-- ============================================================================
-- FieldExplorer: CFP Auto Refresh State
-- Run after supabase-cfp.sql
-- ============================================================================

CREATE TABLE IF NOT EXISTS cfp_refresh_state (
  id TEXT PRIMARY KEY,
  status TEXT NOT NULL DEFAULT 'idle' CHECK (status IN ('idle', 'running', 'completed', 'failed')),
  interaction_id TEXT,
  interaction_started_at TIMESTAMPTZ,
  last_checked_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  last_success_at TIMESTAMPTZ,
  next_due_at TIMESTAMPTZ,
  last_error TEXT,
  last_result_count INTEGER NOT NULL DEFAULT 0,
  last_report TEXT,
  target_names TEXT[] NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION set_cfp_refresh_state_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_cfp_refresh_state_updated ON cfp_refresh_state;
CREATE TRIGGER on_cfp_refresh_state_updated
  BEFORE UPDATE ON cfp_refresh_state
  FOR EACH ROW EXECUTE FUNCTION set_cfp_refresh_state_updated_at();

ALTER TABLE cfp_refresh_state ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_read_cfp_refresh_state" ON cfp_refresh_state;
CREATE POLICY "admin_read_cfp_refresh_state" ON cfp_refresh_state FOR SELECT
USING (is_admin(auth.uid()));

DROP POLICY IF EXISTS "admin_manage_cfp_refresh_state" ON cfp_refresh_state;
CREATE POLICY "admin_manage_cfp_refresh_state" ON cfp_refresh_state FOR ALL
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

INSERT INTO cfp_refresh_state (id, status)
VALUES ('cfp-auto-refresh', 'idle')
ON CONFLICT (id) DO NOTHING;
