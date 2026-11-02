// Embeddable player: embed.html?id=<lecture id>&t=<seconds>. Plays the lecture as the archive does (self-hosted file,
// YouTube, or Drive) and links back to its archive page, where the transcript, guide, and sources live.
(() => {
const ARCHIVE = 'https://fieldexplorer10.vercel.app/archive/';
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const q = new URLSearchParams(location.search), id = q.get('id') || '';
const v = (window.LECTURES || []).find((x) => x.id === id), root = document.getElementById('embed');
if (!v) { root.innerHTML = `<p class="missing">This lecture is not in the archive. <a href="${ARCHIVE}" target="_blank" rel="noopener">Open the FieldExplorer archive ↗</a></p>`; return; }
const requested = Number(q.get('t'));
const duration = String(v.duration).split(':').reduce((n, part) => n * 60 + Number(part), 0);
const t = Number.isFinite(requested) ? Math.min(Math.max(0, Math.floor(requested)), duration) : 0;
const host = v.driveFileId ? 'Google Drive' : 'YouTube';
const hostURL = v.driveFileId ? `https://drive.google.com/file/d/${encodeURIComponent(v.driveFileId)}/view` : `https://www.youtube.com/watch?v=${encodeURIComponent(v.id)}${t > 0 ? '&t=' + t + 's' : ''}`;
document.title = `${v.shortTitle} · FieldExplorer`;
const page = ARCHIVE + '#lecture/' + encodeURIComponent(v.id) + (t > 0 ? '?t=' + t : '');
const player = v.videoFile
    ? `<video controls playsinline preload="metadata" poster="${esc(v.thumbnail)}" src="${esc(v.videoFile)}" title="${esc(v.title)}"></video>`
    : v.driveFileId
        ? `<iframe credentialless src="https://drive.google.com/file/d/${encodeURIComponent(v.driveFileId)}/preview${t > 0 ? '?t=' + t : ''}" title="${esc(v.title)}" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`
        : `<iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(v.id)}?rel=0&playsinline=1${t > 0 ? '&start=' + t : ''}" title="${esc(v.title)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;
root.innerHTML = `<div class="stage">${player}</div><nav class="bar" aria-label="Lecture resources"><span class="title">${esc(v.shortTitle)} · ${esc(v.duration)}</span><span class="links"><a class="host-link" href="${hostURL}" target="_blank" rel="noopener noreferrer" aria-label="Open ${esc(v.shortTitle)} in ${host} (opens a new tab)">Open video in ${host} ↗</a><a class="archive-link" href="${page}" target="_blank" rel="noopener noreferrer">Transcript &amp; sources ↗</a></span></nav>`;
const el = root.querySelector('video');
if (el && t > 0) { const go = () => { el.currentTime = Math.min(t, el.duration || t); }; if (el.readyState >= 1) go(); else el.addEventListener('loadedmetadata', go, { once: true }); }
})();
