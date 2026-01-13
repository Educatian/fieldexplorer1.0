-- ============================================================================
-- FieldExplorer: Cloud Sync Favorites Schema
-- Run this in Supabase SQL Editor
-- ============================================================================

-- Create user_favorites table (using stable venue_id, not name)
CREATE TABLE IF NOT EXISTS user_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  venue_id TEXT NOT NULL,  -- stable slug from venues.json (e.g., "etrd", "jls")
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, venue_id)
);

-- Enable Row Level Security
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only access their own favorites
CREATE POLICY "users_own_favorites" ON user_favorites
  FOR ALL 
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON user_favorites(user_id);

-- ============================================================================
-- Verification Query (run after inserting)
-- ============================================================================
-- SELECT * FROM user_favorites WHERE user_id = auth.uid();
