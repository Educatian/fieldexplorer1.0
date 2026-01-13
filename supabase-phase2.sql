-- ============================================================================
-- FieldExplorer: Collaboration Phase 2 Schema
-- Run this in Supabase SQL Editor (after supabase-admin.sql)
-- ============================================================================

-- ============================================================================
-- STEP 1: PURPOSE & ROLES (Thread Extensions)
-- ============================================================================

-- 1.1 Add purpose column
ALTER TABLE collaboration_threads ADD COLUMN 
  purpose TEXT CHECK (purpose IN (
    'paper', 'research_plan', 'data_analysis', 
    'irb', 'course_dev', 'other'
  ));

-- 1.2 Add needed_roles with default
ALTER TABLE collaboration_threads ADD COLUMN 
  needed_roles TEXT[] DEFAULT '{}';

-- 1.3 Indexes for filtering
CREATE INDEX IF NOT EXISTS idx_threads_purpose ON collaboration_threads(purpose);
CREATE INDEX IF NOT EXISTS idx_threads_roles_gin ON collaboration_threads USING GIN (needed_roles);
CREATE INDEX IF NOT EXISTS idx_threads_last_activity ON collaboration_threads(last_activity_at DESC);

-- ============================================================================
-- STEP 2: TASKS TABLE
-- ============================================================================

CREATE TABLE thread_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID NOT NULL REFERENCES collaboration_threads(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  assignee_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'done')),
  due_date DATE,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  position INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Task indexes
CREATE INDEX idx_tasks_thread_status ON thread_tasks(thread_id, status, position);
CREATE INDEX idx_tasks_assignee ON thread_tasks(assignee_id, status);

-- 2.1 Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION update_task_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER task_updated_at
  BEFORE UPDATE ON thread_tasks
  FOR EACH ROW EXECUTE FUNCTION update_task_timestamp();

-- 2.2 RLS for Tasks
ALTER TABLE thread_tasks ENABLE ROW LEVEL SECURITY;

-- Anyone can read tasks (public threads)
CREATE POLICY "public_read_tasks" ON thread_tasks FOR SELECT USING (true);

-- Authenticated users can create (with created_by = auth.uid())
CREATE POLICY "auth_create_tasks" ON thread_tasks FOR INSERT
WITH CHECK (auth.uid() = created_by);

-- Creator, assignee, or admin can update
CREATE POLICY "author_assignee_admin_update_tasks" ON thread_tasks FOR UPDATE
USING (
  created_by = auth.uid() 
  OR assignee_id = auth.uid() 
  OR is_admin(auth.uid())
);

-- Creator or admin can delete
CREATE POLICY "author_admin_delete_tasks" ON thread_tasks FOR DELETE
USING (created_by = auth.uid() OR is_admin(auth.uid()));

-- ============================================================================
-- STEP 3: RESOURCES TABLE (Links + Files)
-- ============================================================================

CREATE TABLE thread_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID NOT NULL REFERENCES collaboration_threads(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('link', 'file')),
  title TEXT,
  url TEXT,
  storage_path TEXT,
  uploader_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),

  -- Integrity constraint: link needs url, file needs storage_path
  CONSTRAINT resource_type_check CHECK (
    (type = 'link' AND url IS NOT NULL AND storage_path IS NULL) OR
    (type = 'file' AND storage_path IS NOT NULL AND url IS NULL)
  )
);

-- Resource indexes
CREATE INDEX idx_resources_thread ON thread_resources(thread_id, created_at DESC);

-- 3.1 RLS for Resources
ALTER TABLE thread_resources ENABLE ROW LEVEL SECURITY;

-- Anyone can read resources
CREATE POLICY "public_read_resources" ON thread_resources FOR SELECT USING (true);

-- Authenticated users can create
CREATE POLICY "auth_create_resources" ON thread_resources FOR INSERT
WITH CHECK (auth.uid() = uploader_id);

-- Uploader or admin can update/delete
CREATE POLICY "uploader_admin_manage_resources" ON thread_resources FOR ALL
USING (uploader_id = auth.uid() OR is_admin(auth.uid()));

-- ============================================================================
-- STEP 4: UPDATE last_activity_at ON TASK/RESOURCE CHANGES
-- ============================================================================

-- Task insert/update updates thread activity
CREATE OR REPLACE FUNCTION update_thread_activity_on_task()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE collaboration_threads 
  SET last_activity_at = now() 
  WHERE id = NEW.thread_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_task_change_update_thread
  AFTER INSERT OR UPDATE ON thread_tasks
  FOR EACH ROW EXECUTE FUNCTION update_thread_activity_on_task();

-- Resource insert updates thread activity
CREATE OR REPLACE FUNCTION update_thread_activity_on_resource()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE collaboration_threads 
  SET last_activity_at = now() 
  WHERE id = NEW.thread_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_resource_insert_update_thread
  AFTER INSERT ON thread_resources
  FOR EACH ROW EXECUTE FUNCTION update_thread_activity_on_resource();
