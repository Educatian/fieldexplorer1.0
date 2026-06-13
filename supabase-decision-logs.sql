-- FieldExplorer V2.0 Decision Logs Schema
-- Purpose: Research platform for decision-making analysis
-- Features: session_id for path analysis, decision_time_ms for A/B testing

-- Decision Logs Table
CREATE TABLE IF NOT EXISTS decision_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id UUID,                        -- Track exploration flow (sequence/path analysis)
  
  -- Context
  context JSONB DEFAULT '{}'::jsonb,      -- { page, filters, search_query, viewport }
  
  -- Inputs
  inputs JSONB DEFAULT '{}'::jsonb,       -- { compared_nodes, viewed_nodes, hovered_nodes }
  
  -- Signals
  signals JSONB DEFAULT '{}'::jsonb,      -- { rule_signals[], ai_scores{} }
  
  -- Decision
  choice VARCHAR(100) NOT NULL,           -- 'favorited', 'dismissed', 'compared', 'aborted'
  target_venue_id VARCHAR(100),           -- Venue ID if applicable
  
  -- Metrics
  decision_time_ms INTEGER,               -- Time from first view to decision
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for analytics queries
CREATE INDEX IF NOT EXISTS idx_decision_logs_user_id ON decision_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_decision_logs_session_id ON decision_logs(session_id);
CREATE INDEX IF NOT EXISTS idx_decision_logs_choice ON decision_logs(choice);
CREATE INDEX IF NOT EXISTS idx_decision_logs_created_at ON decision_logs(created_at);

-- Row Level Security
ALTER TABLE decision_logs ENABLE ROW LEVEL SECURITY;

-- Users can only access their own logs (idempotent: safe to re-run)
DROP POLICY IF EXISTS "users_own_decision_logs" ON decision_logs;
CREATE POLICY "users_own_decision_logs"
  ON decision_logs
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Session Analytics View (for Day-0 vs Day-14 comparison)
CREATE OR REPLACE VIEW decision_analytics AS
SELECT
  user_id,
  session_id,
  DATE(created_at) as decision_date,
  choice,
  AVG(decision_time_ms) as avg_decision_time_ms,
  COUNT(*) as decision_count,
  COUNT(*) FILTER (WHERE choice = 'favorited') as favorites_count,
  COUNT(*) FILTER (WHERE choice = 'aborted') as aborts_count
FROM decision_logs
GROUP BY user_id, session_id, DATE(created_at), choice;

-- User Journey View (for path analysis)
CREATE OR REPLACE VIEW user_journey AS
SELECT
  user_id,
  session_id,
  array_agg(choice ORDER BY created_at) as decision_sequence,
  array_agg(target_venue_id ORDER BY created_at) as venue_sequence,
  MIN(created_at) as session_start,
  MAX(created_at) as session_end,
  EXTRACT(EPOCH FROM (MAX(created_at) - MIN(created_at))) as session_duration_sec
FROM decision_logs
WHERE session_id IS NOT NULL
GROUP BY user_id, session_id;

-- Grant access to authenticated users
GRANT SELECT, INSERT ON decision_logs TO authenticated;
GRANT SELECT ON decision_analytics TO authenticated;
GRANT SELECT ON user_journey TO authenticated;
