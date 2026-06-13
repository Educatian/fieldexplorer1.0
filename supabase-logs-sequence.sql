-- ============================================================================
-- FieldExplorer: sequence-ready analytics view (OPTIONAL, run in Supabase SQL Editor)
-- The app stamps a client-side timestamp + per-session monotonic counter into
-- user_logs.metadata ({ "client_ts": <epoch ms>, "seq": <int> }). This view
-- surfaces them as typed columns for sequence mining / process mining / ENA,
-- WITHOUT altering the base user_logs table (so no insert-path risk).
-- ============================================================================

CREATE OR REPLACE VIEW user_logs_seq AS
SELECT
  id,
  user_id,
  session_id,
  action_type,
  context_tag,
  target_element,
  target_node,
  (metadata->>'seq')::int                                    AS event_seq,
  to_timestamp((metadata->>'client_ts')::bigint / 1000.0)    AS client_ts,
  metadata,
  screen_x,
  screen_y,
  created_at
FROM user_logs;

-- session-ordered event stream (reliable order for lag-sequential / ENA):
--   SELECT action_type, context_tag, target_node, event_seq, client_ts
--   FROM user_logs_seq WHERE session_id = '<id>' ORDER BY event_seq;

-- decision episodes already carry decision_time_ms + context.client_ts in decision_logs;
-- join on session_id to align the event stream with decisions:
--   SELECT * FROM decision_logs WHERE session_id = '<id>' ORDER BY (context->>'client_ts')::bigint;
