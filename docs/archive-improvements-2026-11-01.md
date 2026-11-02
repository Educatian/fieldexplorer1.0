# Archive discovery, Drive guidance and reliable refreshes

The ten recently released short lectures were searchable but missing from the map's topic links and viewing paths. They now have topic mappings and five additive viewing paths: motivation/self-regulation, inquiry/design, collaboration/peer feedback, embodied learning, and learning at scale. All original 139 catalog records, 138 lecture guides/transcripts, thumbnails, seven question cards, ten existing paths and 72 creator confirmations are retained.

Drive detail pages label the field Selected time, explain its distinction from playback time and provide a direct-host fallback. The archive-guide explanation at 112.919–122.115 seconds has corrected narration/captions without shifting subsequent scenes. Earlier screen counts are identified as historical. The same Drive file ID is retained for the correction.

Archive CI validates host IDs, thumbnails, guides, source URLs, timed captions, discovery references and confirmation completeness. Missing confirmations are listed in `docs/archive-creator-confirmation.md` (66 lectures plus one guide); no approval is inferred. Four corruption regressions exercise missing assets, broken references/captions, and invalid confirmed records.

The monthly runner refreshes activity, trends and citations independently, restores a failed layer's last-good bytes and rejects silent venue-coverage losses. Successful layers remain publishable; failures appear in the final workflow status and a per-layer result artifact. Six offline regressions verify partial failure, rollback, selective retry, stale-output rejection and no-request skips. Jev's quarterly review policy is separate from the monthly free-source refresh.

Validation: existing23 unit tests, four archive regressions, six refresh regressions, archive integrity, map data checks and Vite build. Existing bundle-size and no-OpenAlex-source warnings remain known limitations. Local desktop/mobile path checks and runtime playback evidence are recorded in the task release report; automated full decoding is not a listening-based scientific-content review.
