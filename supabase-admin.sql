-- ============================================================================
-- FieldExplorer: Admin & Collaboration Schema (Phase 1)
-- Run this in Supabase SQL Editor
-- ============================================================================

-- ============================================================================
-- STEP 1: ADMIN ROLE SYSTEM
-- ============================================================================

-- 1.1 Role Enum
CREATE TYPE user_role AS ENUM ('user', 'admin');

-- 1.2 User Roles Table
CREATE TABLE user_roles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_user_roles_role ON user_roles(role);

-- 1.3 Auto-Role Trigger (가입 시 자동 생성, 특정 이메일은 admin)
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_roles (user_id, role)
  VALUES (
    NEW.id,
    CASE WHEN NEW.email = 'jewoong.moon@gmail.com' THEN 'admin'::user_role
         ELSE 'user'::user_role
    END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 1.4 Helper Function: Check if user is admin
CREATE OR REPLACE FUNCTION is_admin(uid UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles WHERE user_id = uid AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- 1.5 RLS for user_roles
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Users can read their own role
CREATE POLICY "users_read_own_role" ON user_roles FOR SELECT
USING (auth.uid() = user_id);

-- Admins can manage all roles
CREATE POLICY "admin_manage_roles" ON user_roles FOR ALL
USING (is_admin(auth.uid()));

-- ============================================================================
-- STEP 2: COLLABORATION SCHEMA
-- ============================================================================

-- 2.1 Collaboration Threads
CREATE TABLE collaboration_threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'closed')),
  last_activity_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE collaboration_threads ENABLE ROW LEVEL SECURITY;

-- Anyone can read threads
CREATE POLICY "public_read_threads" ON collaboration_threads FOR SELECT USING (true);

-- Authenticated users can create
CREATE POLICY "auth_create_threads" ON collaboration_threads FOR INSERT
WITH CHECK (auth.uid() = author_id);

-- Author or admin can update
CREATE POLICY "author_or_admin_update" ON collaboration_threads FOR UPDATE
USING (author_id = auth.uid() OR is_admin(auth.uid()));

-- Author or admin can delete
CREATE POLICY "author_or_admin_delete" ON collaboration_threads FOR DELETE
USING (author_id = auth.uid() OR is_admin(auth.uid()));

-- 2.2 Collaboration Replies
CREATE TABLE collaboration_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID REFERENCES collaboration_threads(id) ON DELETE CASCADE,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE collaboration_replies ENABLE ROW LEVEL SECURITY;

-- Anyone can read replies
CREATE POLICY "public_read_replies" ON collaboration_replies FOR SELECT USING (true);

-- Authenticated users can create
CREATE POLICY "auth_create_replies" ON collaboration_replies FOR INSERT
WITH CHECK (auth.uid() = author_id);

-- Author or admin can update/delete
CREATE POLICY "author_or_admin_manage_replies" ON collaboration_replies FOR ALL
USING (author_id = auth.uid() OR is_admin(auth.uid()));

-- 2.3 Thread Participants
CREATE TABLE thread_participants (
  thread_id UUID REFERENCES collaboration_threads(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'viewing' CHECK (status IN ('viewing', 'commented', 'uploaded', 'inactive')),
  joined_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (thread_id, user_id)
);

ALTER TABLE thread_participants ENABLE ROW LEVEL SECURITY;

-- Anyone can read participants
CREATE POLICY "public_read_participants" ON thread_participants FOR SELECT USING (true);

-- Auto-insert on reply/participation
CREATE POLICY "auth_join_thread" ON thread_participants FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 2.4 Update last_activity_at on reply
CREATE OR REPLACE FUNCTION update_thread_activity()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE collaboration_threads 
  SET last_activity_at = now() 
  WHERE id = NEW.thread_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_reply_insert
  AFTER INSERT ON collaboration_replies
  FOR EACH ROW EXECUTE FUNCTION update_thread_activity();

-- 2.5 Auto-add participant on reply
CREATE OR REPLACE FUNCTION auto_add_participant()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO thread_participants (thread_id, user_id, status)
  VALUES (NEW.thread_id, NEW.author_id, 'commented')
  ON CONFLICT (thread_id, user_id) 
  DO UPDATE SET status = 'commented';
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_reply_add_participant
  AFTER INSERT ON collaboration_replies
  FOR EACH ROW EXECUTE FUNCTION auto_add_participant();

-- ============================================================================
-- STEP 3: ACTIVITY LOGS & NOTIFICATIONS
-- ============================================================================

-- 3.1 Activity Logs
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID REFERENCES collaboration_threads(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL, -- 'created', 'replied', 'uploaded', 'status_changed'
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Anyone can read activity (public threads)
CREATE POLICY "public_read_activity" ON activity_logs FOR SELECT USING (true);

-- System inserts only (via triggers/functions)
CREATE POLICY "system_insert_activity" ON activity_logs FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 3.2 Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'mention', 'reply', 'admin_announcement'
  thread_id UUID,
  content TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users can only read their own notifications
CREATE POLICY "users_read_own_notifications" ON notifications FOR SELECT
USING (auth.uid() = user_id);

-- System/triggers can create
CREATE POLICY "auth_create_notifications" ON notifications FOR INSERT
WITH CHECK (true);

-- Users can mark their notifications as read
CREATE POLICY "users_update_own_notifications" ON notifications FOR UPDATE
USING (auth.uid() = user_id);

-- 3.3 Announcement Logs (Admin only)
CREATE TABLE announcement_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES auth.users(id),
  subject TEXT NOT NULL,
  body TEXT,
  recipient_count INT,
  sent_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE announcement_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can read/write
CREATE POLICY "admin_manage_announcements" ON announcement_logs FOR ALL
USING (is_admin(auth.uid()));

-- ============================================================================
-- STEP 4: INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX idx_threads_last_activity ON collaboration_threads(last_activity_at DESC);
CREATE INDEX idx_replies_thread ON collaboration_replies(thread_id);
CREATE INDEX idx_activity_thread ON activity_logs(thread_id);
CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);

-- ============================================================================
-- STEP 5: INSERT EXISTING ADMIN (if already registered)
-- ============================================================================

INSERT INTO user_roles (user_id, role)
SELECT id, 'admin'::user_role FROM auth.users WHERE email = 'jewoong.moon@gmail.com'
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
