-- ============================================================================
-- FieldExplorer: CFP Verification Records
-- Run this in Supabase SQL Editor after supabase-admin.sql
-- ============================================================================

CREATE OR REPLACE FUNCTION is_admin(uid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  result BOOLEAN := false;
BEGIN
  IF to_regclass('public.user_roles') IS NOT NULL THEN
    EXECUTE
      'SELECT EXISTS (
         SELECT 1
         FROM public.user_roles
         WHERE user_id = $1
           AND role::text = ''admin''
       )'
    INTO result
    USING uid;
  END IF;

  RETURN COALESCE(result, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TABLE IF NOT EXISTS cfp_verifications (
  venue_name TEXT PRIMARY KEY,
  submission_deadline DATE NOT NULL,
  submission_label TEXT NOT NULL,
  abstract_deadline DATE,
  abstract_label TEXT,
  source_url TEXT NOT NULL,
  source_label TEXT NOT NULL,
  verified_at DATE NOT NULL,
  timezone TEXT NOT NULL CHECK (timezone IN ('AoE', 'PT', 'Local')),
  notes TEXT,
  verified_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_cfp_verifications_verified_at
  ON cfp_verifications(verified_at DESC);

CREATE OR REPLACE FUNCTION set_cfp_verifications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_cfp_verifications_updated ON cfp_verifications;
CREATE TRIGGER on_cfp_verifications_updated
  BEFORE UPDATE ON cfp_verifications
  FOR EACH ROW EXECUTE FUNCTION set_cfp_verifications_updated_at();

ALTER TABLE cfp_verifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_cfp_verifications" ON cfp_verifications;
CREATE POLICY "public_read_cfp_verifications" ON cfp_verifications FOR SELECT
USING (true);

DROP POLICY IF EXISTS "admin_manage_cfp_verifications" ON cfp_verifications;
CREATE POLICY "admin_manage_cfp_verifications" ON cfp_verifications FOR ALL
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

CREATE TABLE IF NOT EXISTS cfp_verification_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_name TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('upsert', 'delete')),
  snapshot JSONB DEFAULT '{}'::jsonb,
  storage_mode TEXT NOT NULL CHECK (storage_mode IN ('cloud', 'local')),
  changed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  changed_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_cfp_verification_history_changed_at
  ON cfp_verification_history(changed_at DESC);

CREATE INDEX IF NOT EXISTS idx_cfp_verification_history_venue
  ON cfp_verification_history(venue_name);

ALTER TABLE cfp_verification_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_read_cfp_history" ON cfp_verification_history;
CREATE POLICY "admin_read_cfp_history" ON cfp_verification_history FOR SELECT
USING (is_admin(auth.uid()));

DROP POLICY IF EXISTS "admin_manage_cfp_history" ON cfp_verification_history;
CREATE POLICY "admin_manage_cfp_history" ON cfp_verification_history FOR ALL
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));
