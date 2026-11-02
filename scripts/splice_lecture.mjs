// Add a lecture to the archive: catalog entry (after `afterId`), study guide, transcript, and a link from its
// research-question card. Videos live in Google Drive, not in this repo: upload the MP4 to the public folder
// "Learning Unfolded Public Short Lectures" (shared "anyone with the link: viewer"; files inherit it) and pass the
// file id. The thumbnail (public/archive/thumb-<id>.jpg) stays in the repo.
//
//   node scripts/splice_lecture.mjs <archive.json> <afterId> <driveFileId>
//
// archive.json comes from pen-lecture-studio (make-archive.mjs): { catalog, guide, transcript, question }.
// Pen lectures use synthetic narration, so the entry carries narration: "synthetic" (shown as the audio status).
import { readFileSync, writeFileSync } from 'node:fs'

const [jsonPath, after, driveFileId] = process.argv.slice(2)
if (!jsonPath || !after || !/^[\w-]{20,}$/.test(driveFileId || '')) {
    console.error('usage: node scripts/splice_lecture.mjs <archive.json> <afterId> <driveFileId>')
    process.exit(1)
}
const dir = 'public/archive'
const a = JSON.parse(readFileSync(jsonPath, 'utf8'))
const id = a.catalog.id
const rd = (f) => readFileSync(`${dir}/${f}`, 'utf8'), wr = (f, s) => writeFileSync(`${dir}/${f}`, s)

// catalog.js: `window.LECTURES = [...]` as 2-space JSON; re-serialized, so check the round trip first
const HEAD = 'window.LECTURES = '
const catRaw = rd('catalog.js')
const lectures = JSON.parse(catRaw.slice(HEAD.length).trim().replace(/;$/, ''))
if (HEAD + JSON.stringify(lectures, null, 2) + ';\n' !== catRaw.replace(/\r\n/g, '\n')) throw new Error('catalog.js format changed; update this script')
if (lectures.some((v) => v.id === id)) throw new Error(`${id} is already in the catalog`)
const at = lectures.findIndex((v) => v.id === after)
if (at < 0) throw new Error(`afterId ${after} not in the catalog`)
const c = a.catalog
lectures.splice(at + 1, 0, { id, driveFileId, narration: 'synthetic', title: c.title, shortTitle: c.shortTitle, category: c.category,
    format: c.format, duration: c.duration, summary: c.summary, question: c.question, lab: c.lab ?? null, thumbnail: c.thumbnail })

// guides.js: append before the closing "};"
let g = rd('guides.js')
const ge = g.includes('\r\n') ? '\r\n' : '\n'
if (!g.endsWith(`  }${ge}};${ge}`)) throw new Error('guides.js tail unexpected')
g = g.slice(0, -`${ge}};${ge}`.length) + `,${ge}  ${JSON.stringify(id)}: ` + JSON.stringify(a.guide, null, 2).split('\n').join(ge + '  ') + `${ge}};${ge}`

// transcripts.js (one line)
let t = rd('transcripts.js')
const tail = ['};\r\n', '};\n', '};'].find((s) => t.endsWith('}' + s))
if (!tail) throw new Error('transcripts.js tail unexpected')
t = t.slice(0, -tail.length) + `,${JSON.stringify(id)}:${JSON.stringify(a.transcript)}` + tail

// discovery.js is data shared by the UI and archive consistency checks.
const discoveryHead = 'window.ARCHIVE_DISCOVERY = '
const rawDiscovery = rd('discovery.js')
const discovery = JSON.parse(rawDiscovery.slice(rawDiscovery.indexOf(discoveryHead) + discoveryHead.length).trim().replace(/;$/, ''))
if (a.question !== 'none') {
    const qid = a.question || 'perspectives'
    const card = discovery.questions.find(q => q.id === qid)
    if (!card) throw new Error(`question card ${qid} missing`)
    const position = card.ids.indexOf(after)
    card.ids.splice(position < 0 ? card.ids.length : position + 1, 0, id)
}

wr('catalog.js', HEAD + JSON.stringify(lectures, null, 2) + ';\n')
wr('guides.js', g)
wr('transcripts.js', t)
wr('discovery.js', rawDiscovery.slice(0, rawDiscovery.indexOf(discoveryHead)) + discoveryHead + JSON.stringify(discovery, null, 2) + ';\n')
console.log('spliced', id, 'after', after, 'drive', driveFileId)
