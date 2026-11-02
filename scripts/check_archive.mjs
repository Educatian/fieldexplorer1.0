// Validate archive data without a browser or network; used by CI and before publication.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {pathToFileURL} from 'node:url';

export function loadArchive(root) {
  const window={};
  for(const file of ['catalog.js','guides.js','transcripts.js','reviews.js','discovery.js']) {
    vm.runInNewContext(fs.readFileSync(path.join(root,'public/archive',file),'utf8'),{window,URL},{timeout:3000});
  }
  return {lectures:window.LECTURES,guides:window.LECTURE_GUIDES,transcripts:window.TRANSCRIPTS,reviews:window.ARCHIVE_REVIEWS,discovery:window.ARCHIVE_DISCOVERY,review:window.ArchiveReview};
}

export function validateArchive(data,{exists=()=>true}={}) {
  const {lectures,guides,transcripts,reviews,discovery,review}=data;
  const errors=[],pending=[],ids=new Set();
  const fail=s=>errors.push(s),https=value=>{try{return new URL(value).protocol==='https:'}catch{return false}};
  if(!Array.isArray(lectures)||!lectures.length)return {errors:['Catalog missing or empty'],pending};
  for(const v of lectures){
    if(!v.id||ids.has(v.id))fail(`Duplicate or empty lecture ID: ${v.id}`);
    ids.add(v.id);
    if(!v.title||!v.shortTitle||!/^\d+:\d{2}$/.test(v.duration||''))fail(`${v.id}: title or duration missing`);
    if(!['foundations','design','experience','assessment','methods','guide'].includes(v.category))fail(`${v.id}: invalid field`);
    if(v.videoFile)fail(`${v.id}: new self-hosted media is not permitted; use the existing Drive workflow`);
    if(v.driveFileId?!/^[\w-]{20,}$/.test(v.driveFileId):!/^[\w-]{11}$/.test(v.id))fail(`${v.id}: invalid video host ID`);
    if(!v.thumbnail||v.thumbnail.includes('..')||!exists(v.thumbnail))fail(`${v.id}: missing or unsafe thumbnail`);
    const g=guides?.[v.id];
    if(!g||!g.purpose||!g.distinction||!g.caution||!g.koSummary)fail(`${v.id}: incomplete study guide`);
    if(v.category!=='guide'&&!g?.sources?.length)fail(`${v.id}: no further reading`);
    for(const source of g?.sources||[])if(!source.title||!https(source.url))fail(`${v.id}: invalid source link`);
    if(g?.researchers&&!https(g.researchers.url))fail(`${v.id}: invalid researcher link`);
    const cues=transcripts?.[v.id]?.cues;
    if(!Array.isArray(cues)||!cues.length)fail(`${v.id}: timed captions missing`);
    let end=0;
    for(const [i,c] of (cues||[]).entries()){
      if(!Number.isFinite(c.start)||!Number.isFinite(c.end)||c.start<0||c.end<=c.start||c.start<end-0.001||!c.text?.trim())fail(`${v.id}: invalid or overlapping caption ${i}`);
      end=c.end;
    }
    if(!review.complete(reviews.records[v.id]?.creator))pending.push({id:v.id,title:v.shortTitle,category:v.category});
  }
  for(const [name,records] of Object.entries({guides,transcripts,reviews:reviews?.records||{}}))for(const id of Object.keys(records||{}))if(!ids.has(id))fail(`${name}: orphan ID ${id}`);
  for(const [id,record] of Object.entries(reviews?.records||{}))for(const [key,entry] of Object.entries(record)){
    if(!['creator','curator','board'].includes(key))fail(`${id}: unknown confirmation type ${key}`);
    if(entry.status==='confirmed'&&!review.complete(entry))fail(`${id}: incomplete confirmed ${key} record`);
  }
  for(const key of ['questions','paths']){
    const seen=new Set();
    for(const entry of discovery?.[key]||[]){
      if(!entry.id||seen.has(entry.id)||!entry.ids?.length)fail(`${key}: duplicate or empty entry ${entry.id}`);
      seen.add(entry.id);
      if(new Set(entry.ids).size!==entry.ids.length)fail(`${entry.id}: duplicate lecture reference`);
      for(const id of entry.ids)if(!ids.has(id))fail(`${entry.id}: unknown lecture ${id}`);
      if(key==='paths'&&entry.reasons?.length!==entry.ids.length)fail(`${entry.id}: path reasons do not match steps`);
    }
    if(!seen.size)fail(`Missing discovery ${key}`);
  }
  return {errors,pending};
}

if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href){
  const root=process.cwd(),data=loadArchive(root);
  const result=validateArchive(data,{exists:thumbnail=>fs.existsSync(path.join(root,'public/archive',thumbnail))});
  for(const error of result.errors)console.error('ERROR',error);
  const count=result.pending.filter(v=>v.category!=='guide').length;
  console.log(`Archive ${data.lectures.length} entries, ${data.discovery.paths.length} paths: ${result.errors.length} errors; creator confirmation absent for ${count} lectures and ${result.pending.length-count} guide.`);
  if(process.argv.includes('--review-queue')){
    const lines=['# Creator confirmation queue','','Generated from current catalog and existing records. This is a request list, not approval or independent scholarly review. Existing confirmed records remain unchanged.','','Only an explicit creator statement for listed IDs can add creator confirmation. Record by, actual confirmation date, scope and a non-sensitive reference. Do not infer curator or board approval.','','| ID | Title | Kind |','|---|---|---|',...result.pending.map(v=>`| ${v.id} | ${v.title.replaceAll('|','/')} | ${v.category==='guide'?'Guide':'Lecture'} |`)];
    fs.writeFileSync(path.join(root,'docs/archive-creator-confirmation.md'),lines.join('\n')+'\n');
  }
  process.exitCode=result.errors.length?1:0;
}
