import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const code=fs.readFileSync('public/archive/embed.js','utf8');
const lecture={id:'sample-id01',shortTitle:'A lecture',title:'A lecture',duration:'2:00',driveFileId:'123456789012345678901'};
function render(search,v=lecture){const root={innerHTML:'',querySelector:()=>null};vm.runInNewContext(code,{window:{LECTURES:[v]},document:{title:'',getElementById:()=>root},location:{search},URLSearchParams,Number});return root.innerHTML;}
test('Drive embed always offers direct public-host and transcript links',()=>{
 const html=render('?id=sample-id01&t=30');assert.match(html,/credentialless/);assert.match(html,/preview\?t=30/);assert.match(html,/class="host-link"/);assert.match(html,/123456789012345678901\/view/);assert.match(html,/#lecture\/sample-id01\?t=30/);assert.match(html,/noopener noreferrer/);
});
test('YouTube embed offers the timed original video as its host fallback',()=>{const html=render('?id=sample-id01&t=30',{...lecture,driveFileId:undefined});assert.match(html,/youtube.com\/watch\?v=sample-id01&t=30s/);assert.match(html,/Open video in YouTube/)});
test('start times are finite, nonnegative and within the catalog duration',()=>{for(const t of ['-3','NaN','Infinity'])assert.doesNotMatch(render('?id=sample-id01&t='+t),/preview\?t=/);assert.match(render('?id=sample-id01&t=99999'),/preview\?t=120/)});
test('unknown lecture never creates a player or an invented video link',()=>{const html=render('?id=missing');assert.match(html,/not in the archive/);assert.doesNotMatch(html,/<iframe/);assert.doesNotMatch(html,/host-link/)});
