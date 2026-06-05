-- FieldExplorer: Community-submitted venues
-- Lets approved community venues (e.g. added via the KELS Discord /add-venue
-- command) appear in the app graph alongside the static venues.json baseline.
--
-- The app reads approved rows with the anon key and merges them into the venue
-- list. Writes are service-role only (no anon insert policy), so submissions come
-- from trusted server-side integrations, not arbitrary clients.

CREATE TABLE IF NOT EXISTS community_venues (
  id           TEXT PRIMARY KEY,              -- stable slug, e.g. "journal-of-x"
  name         TEXT NOT NULL UNIQUE,          -- display name
  type         TEXT NOT NULL DEFAULT 'Journal'
                 CHECK (type IN ('Journal', 'Conference', 'SubConference', 'Organization')),
  categories   TEXT[] NOT NULL DEFAULT '{}',  -- category names (link into the graph)
  impact       TEXT CHECK (impact IN ('Q1', 'Q2', 'Q3', 'Q4')),
  cfp_deadline TEXT,                          -- optional, e.g. "2026-09-01"
  submitted_by TEXT,                          -- e.g. "discord_<id>"
  source       TEXT DEFAULT 'discord',
  status       TEXT NOT NULL DEFAULT 'approved'
                 CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at   TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE community_venues ENABLE ROW LEVEL SECURITY;

-- Public app reads approved venues only.
DROP POLICY IF EXISTS "community_venues_select_approved" ON community_venues;
CREATE POLICY "community_venues_select_approved" ON community_venues FOR SELECT
  USING (status = 'approved');

-- No anon INSERT/UPDATE/DELETE policy on purpose: writes use the service role,
-- which bypasses RLS (the bot's /add-venue handler).

CREATE INDEX IF NOT EXISTS idx_community_venues_status ON community_venues(status);
CREATE INDEX IF NOT EXISTS idx_community_venues_created ON community_venues(created_at DESC);
