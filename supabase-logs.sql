-- ============================================================================
-- FieldExplorer: User Action Logging Schema
-- Run this in Supabase SQL Editor
-- ============================================================================

-- User action logs table
CREATE TABLE IF NOT EXISTS user_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id TEXT,
  action_type TEXT NOT NULL, -- 'click', 'login', 'logout', 'page_view', 'filter', 'search', 'favorite', etc.
  context_tag TEXT, -- 'network', 'sidebar', 'admin', 'collab', 'metrics', etc.
  target_element TEXT, -- element ID or description
  target_node TEXT, -- node ID if applicable
  metadata JSONB DEFAULT '{}', -- additional context data
  screen_x INT,
  screen_y INT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for analytics queries
CREATE INDEX idx_user_logs_user ON user_logs(user_id, created_at DESC);
CREATE INDEX idx_user_logs_action ON user_logs(action_type);
CREATE INDEX idx_user_logs_context ON user_logs(context_tag);
CREATE INDEX idx_user_logs_session ON user_logs(session_id);
CREATE INDEX idx_user_logs_created ON user_logs(created_at DESC);

-- RLS: Users can only read their own logs, admins can read all
ALTER TABLE user_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_read_own_logs" ON user_logs FOR SELECT
USING (auth.uid() = user_id OR auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'admin'));

-- Anyone authenticated can insert logs
CREATE POLICY "auth_insert_logs" ON user_logs FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- ============================================================================
-- Analytics Views
-- ============================================================================

-- Daily active users
CREATE OR REPLACE VIEW daily_active_users AS
SELECT 
  DATE(created_at) as date,
  COUNT(DISTINCT user_id) as unique_users,
  COUNT(*) as total_actions
FROM user_logs
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Popular actions
CREATE OR REPLACE VIEW popular_actions AS
SELECT 
  action_type,
  context_tag,
  COUNT(*) as count,
  COUNT(DISTINCT user_id) as unique_users
FROM user_logs
GROUP BY action_type, context_tag
ORDER BY count DESC;

-- User session summary
CREATE OR REPLACE VIEW user_sessions AS
SELECT 
  session_id,
  user_id,
  MIN(created_at) as session_start,
  MAX(created_at) as session_end,
  COUNT(*) as action_count,
  ARRAY_AGG(DISTINCT action_type) as action_types
FROM user_logs
WHERE session_id IS NOT NULL
GROUP BY session_id, user_id
ORDER BY session_start DESC;
