# Archive and data maintenance

## Preserve released content

Keep existing catalog IDs, Drive IDs, source links, transcripts and creator records when adding discovery paths. Lecture video files stay in the public Learning Unfolded Drive folder. Replace a corrected file in place with Drive `files.update`; retain its ID and sharing. Keep the previous source version locally before a correction.

## Video hosting and GitHub updates

Upload new MP4s to the existing [public Learning Unfolded Drive folder](https://drive.google.com/drive/folders/1SNlZixkHxA-L6Hexf-8_7TVbEd_rg_Uz), confirm its inherited public-reader permission, and use the returned file ID. Keep source video originals outside this checkout, especially outside `public/`, because Vite copies every public file into the deployment even if Git ignores it. GitHub contains code, host IDs/links, captions, guides and preview images. Existing YouTube entries retain their original mappings.

The [FieldExplorer introduction](https://drive.google.com/file/d/1rFXjpG-YOG1e_-SmN9AlJTOgVSYQua3J/view) is also hosted in Drive. In `app.html`, its iframe's `data-src` is the Drive `/preview` URL; `src/ui/introVideo.ts` loads it only when the user expands the introduction. Collapsing the section or closing the About dialog unloads the player. Keep the direct `/view` fallback link and README link aligned when replacing the host. Corrected bytes should replace this same Drive file ID.

Run `npm run check:media` after `npm run build` before pushing. CI rejects tracked video files (including force-added files), video files under `public/`, and video files in `dist/`. `.gitignore` also excludes video extensions. Existing Git history may contain the former intro MP4; this change removes it from the current source and deployment without rewriting history.

After publishing, verify actual playback from the FieldExplorer About dialog, the archive player and its embedded share view. A Drive HTTP response or metadata permission alone does not prove playback. Check closing/reopening the intro and mobile sizing, and ensure no app-origin MP4 is requested.

`public/archive/discovery.js` holds research-question cards and viewing paths. Keep route IDs stable and provide one reason per step. `scripts/splice_lecture.mjs` updates the question card there. Map links are maintained in `scripts/build_archive_links.py`; edit its mappings and regenerate `src/data/archive_links.ts`. Do not map a broad lecture to an unrelated research method just to increase coverage.

Run `npm run check:archive`, `python scripts/check_map_data.py`, `npm test`, and `npm run build`. CI runs these checks plus six refresh failure/retry regressions. Test malformed/missing archive data with `node --test scripts/check_archive.test.mjs`.

## Confirmation records

See `docs/archive-creator-confirmation.md` for the current queue; regenerate with `node scripts/check_archive.mjs --review-queue`. Missing confirmation is reported separately and is never converted to approval by CI. The current 72 creator records retain their original scope and dates. An explicit creator confirmation for exact IDs is required to add more. Creator confirmation does not mean independent scientific review, curator review, or board approval.

## Drive timestamps

The archive's selected transcript time is not the Drive playback clock. Selecting a caption reloads the iframe at the requested `?t=` start; press play if needed. Check the time in Drive before copying a timed link. The direct Drive link is a fallback when the embed is blocked. Never infer successful playback from HTTP 200 or file permissions alone.

## Independent monthly data refresh

`refresh_openalex_layers.py` checks activity, trends and citations separately. Activity includes the alternate-source counts; citations include the 60-paper sample and disparity backbone. A failed layer is restored byte-for-byte; successful layers can still be committed. The workflow's final status fails for any incomplete layer and uploads its per-layer report. The next scheduled run skips only current, completed layers. The reference cache remains available for quota retries.

The schedule stays at 07:00 UTC on days 2–4. Use workflow_dispatch for a normal retry. Local `--force` is available for an intentional complete refresh. Do not run forced refreshes just to test: they consume the shared OpenAlex budget. `python scripts/test_refresh_openalex_layers.py` exercises partial failures, rollback and retries without network calls.

Jev coding is a separate paid process, not an incidental part of monthly source refresh. Review its snapshot quarterly (January, April, July, October) or after codebook/source corrections. Check the complete-year window, source coverage and estimated cost; run fetch → code → build using `scripts/build_venue_methodology_jev.py` and alternate sources, inspect reliability and controls, then publish through a reviewed PR. Preserve the old snapshot if coding or source checks fail. A/B wording agreement is not independent human-coder validity. AERA/EARLI/AECT not-applicable records must remain distinct from an ASEE source-access failure.
