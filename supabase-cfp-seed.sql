-- ============================================================================
-- FieldExplorer: Initial CFP Seed
-- Run this after supabase-admin.sql and supabase-cfp.sql
-- ============================================================================

INSERT INTO cfp_verifications (
  venue_name,
  submission_deadline,
  submission_label,
  abstract_deadline,
  abstract_label,
  source_url,
  source_label,
  verified_at,
  timezone,
  notes
)
VALUES
  (
    'AERA Annual Meeting',
    '2025-08-01',
    'Paper / session submissions due',
    NULL,
    NULL,
    'https://www.aera.net/Events-Meetings/Annual-Meeting/2026-Annual-Meeting',
    'AERA 2026 Annual Meeting overview',
    '2026-03-31',
    'Local',
    'The official 2026 Annual Meeting page states that submissions closed on August 1, 2025.'
  ),
  (
    'LAK Conference',
    '2025-09-29',
    'Full / short research papers due',
    NULL,
    NULL,
    'https://www.solaresearch.org/events/lak/lak26/general-call/',
    'LAK26 general call',
    '2026-03-31',
    'AoE',
    'Uses the research-track deadline published in the official LAK26 general call.'
  ),
  (
    'EDM Conference',
    '2026-02-09',
    'Full / short papers due',
    '2026-02-02',
    'Abstracts due',
    'https://educationaldatamining.org/edm2026/important-dates/',
    'EDM 2026 important dates',
    '2026-03-31',
    'AoE',
    'The EDM 2026 page explicitly lists both the abstract deadline and the main paper deadline.'
  ),
  (
    'AIED Conference',
    '2026-02-02',
    'Main-track papers due',
    '2026-01-26',
    'Main-track abstracts due',
    'https://aied-conference.org/2026/call-for-paper',
    'AIED 2026 important dates',
    '2026-03-31',
    'AoE',
    'The main-track page lists abstracts and papers separately; the abstract deadline is the first required gate.'
  ),
  (
    'CHI Conference',
    '2025-09-11',
    'Full paper due',
    '2025-09-04',
    'Abstract / metadata due',
    'https://chi2026.acm.org/for-authors/papers/',
    'CHI 2026 papers call',
    '2026-03-31',
    'AoE',
    'CHI requires abstract / metadata first, followed by the full paper one week later.'
  ),
  (
    'ICER Conference',
    '2026-02-27',
    'Full paper submission deadline',
    '2026-02-20',
    'Titles / abstracts / authors due',
    'https://icer2026.acm.org/track/icer-2026-papers',
    'ICER 2026 research papers track',
    '2026-03-31',
    'AoE',
    'ICER 2026 requires title / abstract metadata before the full paper deadline.'
  )
ON CONFLICT (venue_name) DO UPDATE SET
  submission_deadline = EXCLUDED.submission_deadline,
  submission_label = EXCLUDED.submission_label,
  abstract_deadline = EXCLUDED.abstract_deadline,
  abstract_label = EXCLUDED.abstract_label,
  source_url = EXCLUDED.source_url,
  source_label = EXCLUDED.source_label,
  verified_at = EXCLUDED.verified_at,
  timezone = EXCLUDED.timezone,
  notes = EXCLUDED.notes,
  updated_at = now();

DO $$
BEGIN
  IF to_regclass('public.cfp_verification_history') IS NOT NULL THEN
    INSERT INTO cfp_verification_history (
      venue_name,
      action,
      snapshot,
      storage_mode,
      changed_by
    )
    VALUES
      (
        'AERA Annual Meeting',
        'upsert',
        '{"venueName":"AERA Annual Meeting","submissionDeadline":"2025-08-01","submissionLabel":"Paper / session submissions due","sourceUrl":"https://www.aera.net/Events-Meetings/Annual-Meeting/2026-Annual-Meeting","sourceLabel":"AERA 2026 Annual Meeting overview","verifiedAt":"2026-03-31","timezone":"Local","notes":"The official 2026 Annual Meeting page states that submissions closed on August 1, 2025."}'::jsonb,
        'cloud',
        auth.uid()
      ),
      (
        'LAK Conference',
        'upsert',
        '{"venueName":"LAK Conference","submissionDeadline":"2025-09-29","submissionLabel":"Full / short research papers due","sourceUrl":"https://www.solaresearch.org/events/lak/lak26/general-call/","sourceLabel":"LAK26 general call","verifiedAt":"2026-03-31","timezone":"AoE","notes":"Uses the research-track deadline published in the official LAK26 general call."}'::jsonb,
        'cloud',
        auth.uid()
      ),
      (
        'EDM Conference',
        'upsert',
        '{"venueName":"EDM Conference","submissionDeadline":"2026-02-09","submissionLabel":"Full / short papers due","abstractDeadline":"2026-02-02","abstractLabel":"Abstracts due","sourceUrl":"https://educationaldatamining.org/edm2026/important-dates/","sourceLabel":"EDM 2026 important dates","verifiedAt":"2026-03-31","timezone":"AoE","notes":"The EDM 2026 page explicitly lists both the abstract deadline and the main paper deadline."}'::jsonb,
        'cloud',
        auth.uid()
      ),
      (
        'AIED Conference',
        'upsert',
        '{"venueName":"AIED Conference","submissionDeadline":"2026-02-02","submissionLabel":"Main-track papers due","abstractDeadline":"2026-01-26","abstractLabel":"Main-track abstracts due","sourceUrl":"https://aied-conference.org/2026/call-for-paper","sourceLabel":"AIED 2026 important dates","verifiedAt":"2026-03-31","timezone":"AoE","notes":"The main-track page lists abstracts and papers separately; the abstract deadline is the first required gate."}'::jsonb,
        'cloud',
        auth.uid()
      ),
      (
        'CHI Conference',
        'upsert',
        '{"venueName":"CHI Conference","submissionDeadline":"2025-09-11","submissionLabel":"Full paper due","abstractDeadline":"2025-09-04","abstractLabel":"Abstract / metadata due","sourceUrl":"https://chi2026.acm.org/for-authors/papers/","sourceLabel":"CHI 2026 papers call","verifiedAt":"2026-03-31","timezone":"AoE","notes":"CHI requires abstract / metadata first, followed by the full paper one week later."}'::jsonb,
        'cloud',
        auth.uid()
      ),
      (
        'ICER Conference',
        'upsert',
        '{"venueName":"ICER Conference","submissionDeadline":"2026-02-27","submissionLabel":"Full paper submission deadline","abstractDeadline":"2026-02-20","abstractLabel":"Titles / abstracts / authors due","sourceUrl":"https://icer2026.acm.org/track/icer-2026-papers","sourceLabel":"ICER 2026 research papers track","verifiedAt":"2026-03-31","timezone":"AoE","notes":"ICER 2026 requires title / abstract metadata before the full paper deadline."}'::jsonb,
        'cloud',
        auth.uid()
      );
  END IF;
END $$;
