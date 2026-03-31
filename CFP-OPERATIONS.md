# CFP Operations

FieldExplorer now supports a CFP verification workflow with:

- built-in verified CFP records in code
- shared Supabase storage for current verified records
- verification history
- local fallback when the cloud table is missing or unavailable

## Apply Order

Run these SQL files in Supabase SQL Editor in this order:

1. `supabase-admin.sql`
2. `supabase-cfp.sql`
3. `supabase-cfp-seed.sql`

After that, refresh the app and open `🔐 Admin -> CFP 팩트체크 워크플로`.

If you already ran an older version of `supabase-cfp.sql`, run the latest `supabase-cfp.sql` again before `supabase-cfp-seed.sql`.
The seed file is now defensive and will still insert verified CFP rows even if the history table is missing, but rerunning `supabase-cfp.sql` is the correct fix so history works too.

## What Each File Does

- `supabase-cfp.sql`
  Creates `cfp_verifications` and `cfp_verification_history`.

- `supabase-cfp-seed.sql`
  Seeds the first verified CFP set and logs matching history rows.

- `cfp-seed.json`
  Human-readable source package for the current initial seed.

## Initial Seed Coverage

Current verified seed records:

- `AERA Annual Meeting`
- `LAK Conference`
- `EDM Conference`
- `AIED Conference`
- `CHI Conference`
- `ICER Conference`

Priority backlog for the next verification wave is listed in `cfp-seed.json`.

## Admin Workflow

Use the admin CFP panel for ongoing maintenance:

1. Pick a venue from the review list.
2. Paste the official CFP URL.
3. Enter verified deadlines and the verification date.
4. Save.

If Supabase is available and the tables exist, the panel will show `공용 저장`.
If not, it will fall back to `로컬 저장`.

## Stale Policy

Recommended review policy:

- `90+ days since verified_at`: review soon
- `180+ days since verified_at`: stale
- `deadline already passed`: re-verify for the next cycle

These states are surfaced in the admin CFP review list.

## Notes

- The built-in app data remains the fallback baseline.
- Cloud records override the built-in baseline.
- Local overrides override the built-in baseline only for the current browser when cloud storage is unavailable.
