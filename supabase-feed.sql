-- FieldExplorer: Recent Reviews Feed Schema (Full Implementation)
-- Links annotations (venue_name) with user_favorites (venue_id) via venue_mappings

-- ============================================================================
-- 1. VENUE MAPPINGS TABLE (venue_name ↔ venue_id 연결)
-- ============================================================================
CREATE TABLE IF NOT EXISTS venue_mappings (
  venue_id TEXT PRIMARY KEY,           -- stable slug (e.g., "etrd", "jls")
  venue_name TEXT NOT NULL UNIQUE,     -- full name (e.g., "Educational Technology Research and Development")
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Insert mappings (add all venues from your data)
INSERT INTO venue_mappings (venue_id, venue_name) VALUES
  ('etrd', 'Educational Technology Research and Development'),
  ('jls', 'Journal of the Learning Sciences'),
  ('ce', 'Computers & Education'),
  ('bjet', 'British Journal of Educational Technology'),
  ('lai', 'Learning and Instruction'),
  ('ijcscl', 'International Journal of Computer-Supported Collaborative Learning'),
  ('jrst', 'Journal of Research in Science Teaching'),
  ('se', 'Science Education'),
  ('ije', 'International Journal of Education'),
  ('tlt', 'IEEE Transactions on Learning Technologies')
ON CONFLICT (venue_id) DO NOTHING;

-- ============================================================================
-- 2. ENABLE RLS
-- ============================================================================
ALTER TABLE annotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE venue_mappings ENABLE ROW LEVEL SECURITY;

-- venue_mappings: 모든 authenticated 사용자 읽기 가능
CREATE POLICY "venue_mappings_select" ON venue_mappings FOR SELECT
USING (true);

-- ============================================================================
-- 3. ANNOTATIONS RLS (내 리뷰 + 즐겨찾기 venue 리뷰)
-- ============================================================================
CREATE POLICY "feed_select" ON annotations FOR SELECT
USING (
  user_email = auth.jwt() ->> 'email'
  OR EXISTS (
    SELECT 1 
    FROM user_favorites f
    JOIN venue_mappings m ON m.venue_id = f.venue_id
    WHERE f.user_id = auth.uid()
      AND m.venue_name = annotations.venue_name
  )
);

-- ============================================================================
-- 4. SECURITY BARRIER VIEW (익명화)
-- ============================================================================
CREATE VIEW annotations_feed
WITH (security_barrier = true) AS
SELECT 
  id,
  venue_name,
  venue_type,
  rating,
  comment,
  tags,
  created_at,
  CASE 
    WHEN user_email = auth.jwt() ->> 'email' THEN 'me'
    ELSE 'user_' || substr(md5(user_email), 1, 4)
  END AS author_label
FROM annotations;

-- Grant access
GRANT SELECT ON annotations_feed TO authenticated;

-- ============================================================================
-- 5. INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_annotations_cursor 
ON annotations(created_at DESC, id DESC);

CREATE INDEX IF NOT EXISTS idx_venue_mappings_name 
ON venue_mappings(venue_name);
