# Playback, submission fit and selected source checks — 2026-11-01

Public FieldExplorer is the test target. Physical-phone checks were excluded by the owner. Do not use DALE or another project as an LMS fixture. Actual LMS-specific policy compatibility and iOS/Safari remain unverified.

## Embedded viewing

PR34 adds a direct Drive/YouTube link beside the existing transcript/source link. It remains outside the third-party player, so a viewer can open the original host when embedding fails. Start times are finite and clamped to catalog duration. The Drive iframe retains credentialless isolation.

Verified in the public archive's actual Share & embed → Preview embed flow: correct timed URLs, original Drive target, no horizontal overflow at 320/390/768/1365px, and actual Drive playback and 10-second seek. Credentialless Chromium iframe playback is evidence for that isolated context, not a signed-out Safari/phone/LMS pass.

## Submission-fit interpretation

Ranking and weights are unchanged. Topic cosine is divided by the maximum positive cosine in the candidate pool. A best topical result therefore receives 100 even when raw overlap is small. Overall score blends normalized topic (81.25%) and keyword methodology alignment (18.75%); it uses topic alone when methodology signal is unavailable. Methodology keywords are separate from the map's Jev coding. None of these values is an acceptance probability.

The scorecard now states this before analysis and in results, and shows raw cosine, overlapping expanded term count, and count of candidates with positive overlap. Overlap entries include expanded unigrams/bigrams; they are not independent pieces of evidence.

Local diagnostic: `node scripts/diagnose_submission_fit.mjs --output /absolute/path/report.json`. Requires the existing ignored `data-cache/venue_abstracts.json`; performs no requests and outputs metadata/hashes, not abstracts. Uses the first three eligible cached abstracts in each of eight named venues. November 1 cache: n=24; published venue top1=6, top3=10, top10=14; median rank=7. All 24 complete rankings/scores agree with the pre-change scorer. This is a convenience diagnostic, not validation: training overlap is unknown, and the published venue is only a reference label.

## Selected claims in six lectures

This is a source-bounded editorial check, not independent expert review of all claims, videos, or 138 lectures. Existing creator/curator/board records are unchanged. Existing named fictional examples remain illustrative. Only selected passages were read; no full-paper peer-review claim is made.

| Lecture | Claim and checked passage | Result/change |
| --- | --- | --- |
| Problem-Based Learning | [Walker & Leary (2009), publisher abstract](https://docs.lib.purdue.edu/ijpbl/vol3/iss1/3/): 82 studies, 201 outcomes, pooled d=.13, heterogeneous. [Hmelo-Silver (2004), abstract](https://doi.org/10.1023/B:EDPR.0000034022.16470.f3): research gap outside medicine/gifted education. | Numbers retained; catalog and caution date the gap to the 2004 review. Full texts not checked. |
| Inquiry / Knowledge Integration | [Lazonder & Harmsen (2016), version-of-record PDF](https://pure.rug.nl/ws/portalfiles/portal/81069469/Meta_analysis_of_inquiry_based_learning_Effects_of_guidance.pdf): abstract and age-moderator limitations. [Furtak et al. (2012), publisher abstract](https://doi.org/10.3102/0034654312457206): teacher-led versus student-led study-level effects. | Retain 72 studies and learning-outcome d=.50; distinguish between-study difference from randomized direct comparison. Add Furtak source link. |
| Gesture and Learning | [Dargue et al. (2019), author abstract in PubMed](https://pubmed.ncbi.nlm.nih.gov/31219263/): 83 samples and gesture-function moderator. | Existing between-study wording retained; caution makes scope explicit. Abstract only. |
| Self-Efficacy | [Talsma author thesis, Chapter 2 preprint](https://doi.org/10.25959/23239409), PDF pp.40/64/80–81: abstract, Figure 2/results, causal limitations. | k=11, N=2688, standardized paths .205/.071 confirmed. Add non-experimental/predictive caveat in English and Korean. Journal version unavailable for this pass. |
| Peer Assessment | [Double et al. (2020), open-access publisher article](https://doi.org/10.1007/s10648-019-09510-3): abstract, comparison-group definitions, results. | g=.31 and nonsignificant self-assessment contrast retained; clarify non-significance does not establish equivalence and correlation does not establish interchangeable grades. Other sources not re-audited. |
| BKT / DKT | [Piech et al. (2015), Table 1/results](https://papers.nips.cc/paper/5654-deep-knowledge-tracing.pdf), p.6; [Khajah et al. (2016), abstract/discussion](https://arxiv.org/pdf/1604.02416), pp.1/7. | Historical ASSISTments .86/.69 comparison retained and sourced; not universal superiority. Local 600-student .809/.807 simulation remains explicitly illustrative and was not independently reproduced. |

Preservation: 139 catalog entries, all video IDs, all timed captions, all tracked thumbnails, 72 creator records and 15 discovery paths retained. One catalog summary and six guide records intentionally changed; two source links added. No video replacement or upload.
