// Read-only diagnostic on locally cached published abstracts. Never uploads text.
// Not a held-out evaluation: fingerprint training overlap is unknown.
// node scripts/diagnose_submission_fit.mjs --output /absolute/path/report.json
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import ts from 'typescript';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const args=process.argv.slice(2);
const option=(key,fallback)=>args.includes(key)?args[args.indexOf(key)+1]:fallback;
const cachePath=option('--cache',path.join(root,'data-cache/venue_abstracts.json'));
if(!cachePath||!fs.existsSync(cachePath))throw new Error('Provide an existing local venue_abstracts.json with --cache; no network fetch is performed.');
const profiles=JSON.parse(fs.readFileSync(path.join(root,'src/data/semantic_profiles.json'),'utf8'));
const source=fs.readFileSync(path.join(root,'src/services/submissionFit.ts'),'utf8').replace(/import semanticProfiles from [^;]+;/,'const semanticProfiles = '+JSON.stringify(profiles)+';');
const js=ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText;
const {rankSubmissionFit}=await import('data:text/javascript;base64,'+Buffer.from(js).toString('base64'));
const venues=JSON.parse(fs.readFileSync(path.join(root,'src/data/venues.json'),'utf8'));
const cache=JSON.parse(fs.readFileSync(cachePath,'utf8'));
const names=['Educational Technology Research and Development','Journal of the Learning Sciences','International Journal of Computer-Supported Collaborative Learning','Computers & Education','British Journal of Educational Technology','Journal of Learning Analytics','Instructional Science','Journal of Engineering Education'];
const rows=[],seen=new Set();
for(const name of names){
  const sample=Object.values(cache).find(x=>x.name===name);if(!sample)continue;
  for(const w of (sample.works||[]).filter(w=>w.wid&&w.abstract?.split(/\s+/).length>=90).slice(0,3)){
    if(seen.has(w.wid))continue;seen.add(w.wid);
    const text=w.title+' '+w.abstract,results=rankSubmissionFit(text,venues),position=results.findIndex(x=>x.name===name);
    rows.push({title:w.title,url:'https://openalex.org/'+w.wid,year:w.year,sourceVenue:name,inputSha256:crypto.createHash('sha256').update(text).digest('hex'),rank:position<0?null:position+1,top3:results.slice(0,3).map(r=>({name:r.name,overall:r.overall,topic:r.topicScore,raw:r.rawTopicCosine})),publishedVenueResult:position<0?null:results[position]});
  }
}
if(!rows.length)throw new Error('No eligible abstracts found; refusing an empty diagnostic.');
const ranks=rows.map(x=>x.rank).filter(x=>x!==null).sort((a,b)=>a-b),mid=Math.floor(ranks.length/2);
const summary={n:rows.length,top1:rows.filter(x=>x.rank===1).length,top3:rows.filter(x=>x.rank!==null&&x.rank<=3).length,top10:rows.filter(x=>x.rank!==null&&x.rank<=10).length,missing:rows.filter(x=>x.rank===null).length,medianRank:ranks.length?(ranks.length%2?ranks[mid]:(ranks[mid-1]+ranks[mid])/2):null,scope:'First three eligible cached abstracts per selected venue, not a random or held-out sample. Fingerprint training overlap is unknown. Published venue is a reference label, not the only correct target. This diagnostic does not estimate acceptance probability. No abstracts are included in this report.'};
const report={summary,cacheSha256:crypto.createHash('sha256').update(fs.readFileSync(cachePath)).digest('hex'),profilesSha256:crypto.createHash('sha256').update(JSON.stringify(profiles)).digest('hex'),rows};
const output=option('--output',null);if(output)fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(summary,null,2));
