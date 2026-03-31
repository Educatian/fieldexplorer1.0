# Content Fact-Check Notes

Last app-wide review: 2026-03-31

## What is now treated as verified

- Venue links that point to official conference or publisher pages.
- CFP records that use the structured verification flow in `src/data/cfp.ts` and the Supabase admin workflow.

## What is now treated as editorial or reference-only

- Venue overviews and topic lists:
  These are learning-oriented summaries based on official aims and scope pages, not verbatim official descriptions.
- Q-tier labels:
  These are app-internal reference tiers and should not be read as live JCR or SJR rankings.
- Methodology profiles:
  These are exploratory profiles derived from static app data and keyword mapping, not publisher-provided analytics.

## What is intentionally suppressed from default factual display

- Acceptance rates
- Time to decision
- Representative researcher lists

These fields were previously shown as hard facts, but public official sources are inconsistent or missing across venues. The app now avoids presenting them as settled facts by default.

## Official links reviewed on 2026-03-31

- AERA Annual Meeting
  [AERA 2026 Annual Meeting](https://www.aera.net/Events-Meetings/Annual-Meeting/2026-Annual-Meeting)
- LAK Conference
  [LAK26 General Call](https://www.solaresearch.org/events/lak/lak26/general-call/)
- EDM Conference
  [EDM 2026 Important Dates](https://educationaldatamining.org/edm2026/important-dates/)
- AIED Conference
  [AIED 2026 Call for Paper](https://aied-conference.org/2026/call-for-paper)
- CHI Conference
  [CHI 2026 Papers](https://chi2026.acm.org/for-authors/papers/)
- CSCW Conference
  [CSCW 2026 Papers](https://cscw.acm.org/2026/papers.html)
- UIST Conference
  [UIST 2026 Official Site](https://uist.acm.org/2026/)
- IDC Conference
  [IDC 2026 Official Site](https://idc.acm.org/2026/)
- IEEE VR
  [IEEE VR 2026 Official Site](https://ieeevr.org/2026/)
- ETRA Symposium
  [ETRA 2026 Submission Process](https://etra.acm.org/2026/submissionprocess.html)
- SIGCSE Technical Symposium
  [SIGCSE TS 2026 Official Site](https://sigcse2026.sigcse.org/)
- ICER Conference
  [ICER 2026 Research Papers](https://icer2026.acm.org/track/icer-2026-papers)

## Remaining gaps

- Journal quartiles still need a dedicated live or periodically reviewed source of truth.
- Topic descriptions are intentionally educational summaries and not full authoritative taxonomies.
- If you want stronger provenance, the next step is to move venue metadata into a reviewed content table with `verified_at`, `source_url`, and field-level status.
