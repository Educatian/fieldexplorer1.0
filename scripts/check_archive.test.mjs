import {test} from 'node:test';
import assert from 'node:assert/strict';
import {loadArchive,validateArchive} from './check_archive.mjs';
const data=()=>loadArchive(process.cwd());
test('current archive references and confirmations are internally consistent',()=>assert.deepEqual(validateArchive(data()).errors,[]));
test('missing guide, caption, thumbnail and duplicated ID are rejected',()=>{
 const d=data(),id=d.lectures[0].id;delete d.guides[id];delete d.transcripts[id];d.lectures.push(d.lectures[0]);
 const errors=validateArchive(d,{exists:()=>false}).errors.join('\n');
 for(const word of ['guide','captions','thumbnail','Duplicate'])assert.match(errors,new RegExp(word,'i'));
});
test('broken path steps and overlapping captions are rejected',()=>{
 const d=data();d.discovery.paths[0].ids.push('missing-lecture');d.transcripts[d.lectures[0].id].cues[1].start=0;
 const errors=validateArchive(d).errors.join('\n');assert.match(errors,/unknown lecture/);assert.match(errors,/reasons/);assert.match(errors,/overlapping caption/);
});
test('creator confirmation cannot be manufactured from an incomplete record',()=>{
 const d=data(),id=d.lectures[0].id;d.reviews.records[id].creator={status:'confirmed'};
 const result=validateArchive(d);assert.match(result.errors.join('\n'),/incomplete confirmed creator/);assert.ok(result.pending.some(v=>v.id===id));
});
