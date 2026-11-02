import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {checkVideoHosting} from './check_video_hosting.mjs';

function fixture(t) {
    const root = fs.mkdtempSync(path.join(os.tmpdir(),'fe-video-hosting-'));
    t.after(() => fs.rmSync(root,{recursive:true,force:true}));
    execFileSync('git',['init','--quiet'],{cwd:root});
    return {root, write(file, value='fixture') {
        const target=path.join(root,file); fs.mkdirSync(path.dirname(target),{recursive:true}); fs.writeFileSync(target,value);
    }, git(...args) {execFileSync('git',args,{cwd:root});}};
}

test('an ignored video in public is still rejected before Vite copies it', t => {
    const f=fixture(t); f.write('.gitignore','*.mp4\n'); f.write('public/intro.mp4');
    assert.match(checkVideoHosting(f.root).join('\n'),/Deployed video: public[/\\]intro.mp4/);
});
test('a force-added, mixed-case video outside public cannot be pushed unnoticed', t => {
    const f=fixture(t); f.write('.gitignore','*.MP4\n'); f.write('docs/Intro.MP4'); f.git('add','-f','docs/Intro.MP4');
    assert.match(checkVideoHosting(f.root).join('\n'),/Tracked video: docs\/Intro.MP4/);
});
test('a stale build copy also fails the deployment check', t => {
    const f=fixture(t); f.write('dist/assets/clip.webm');
    assert.match(checkVideoHosting(f.root).join('\n'),/Deployed video: dist[/\\]assets[/\\]clip.webm/);
});
test('Drive links, captions, thumbnails, source files and external local originals are allowed', t => {
    const f=fixture(t);
    f.write('public/archive/catalog.js','window.LECTURES=[{driveFileId:"123456789012345678901"}]');
    f.write('app.html','<iframe data-src="https://drive.google.com/file/d/123456789012345678901/preview"></iframe>');
    for (const name of ['public/archive/captions.vtt','public/archive/thumb.jpg','src/app.ts','docs/demo.gif','local-originals/clip.mp4']) f.write(name);
    f.git('add','app.html','public','src','docs');
    assert.deepEqual(checkVideoHosting(f.root),[]);
});
