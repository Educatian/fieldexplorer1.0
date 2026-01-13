-- ============================================================================
-- FieldExplorer: Update purpose to array (multiple selection)
-- Run this in Supabase SQL Editor
-- ============================================================================

-- 1. Drop the CHECK constraint and change to TEXT[]
ALTER TABLE collaboration_threads DROP COLUMN IF EXISTS purpose;
ALTER TABLE collaboration_threads ADD COLUMN purposes TEXT[] DEFAULT '{}';

-- 2. Update index
DROP INDEX IF EXISTS idx_threads_purpose;
CREATE INDEX idx_threads_purposes_gin ON collaboration_threads USING GIN (purposes);
