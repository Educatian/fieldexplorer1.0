// A gitignore rule alone cannot stop tracked or force-added videos, or Vite's public copy.
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';

const videoExtension = /\.(?:mp4|m4v|webm|mov|avi|mkv|mpg|mpeg|ogv|mts|m2ts)$/i;
export function checkVideoHosting(root) {
    const tracked = execFileSync('git', ['ls-files', '-z'], {cwd:root, encoding:'utf8'}).split('\0').filter(Boolean);
    const errors = tracked.filter(file => videoExtension.test(file)).map(file => `Tracked video: ${file}`);
    const walk = folder => {
        if (!fs.existsSync(folder)) return;
        for (const item of fs.readdirSync(folder, {withFileTypes:true})) {
            const file = path.join(folder, item.name);
            if (item.isDirectory()) walk(file);
            else if (videoExtension.test(item.name)) errors.push(`Deployed video: ${path.relative(root,file)}`);
        }
    };
    walk(path.join(root,'public'));
    walk(path.join(root,'dist'));
    return [...new Set(errors)];
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
    const errors = checkVideoHosting(process.cwd());
    for (const error of errors) console.error(error);
    if (errors.length) {
        console.error('Upload video originals to Google Drive and commit only their public links/IDs.');
        process.exitCode = 1;
    } else console.log('Video hosting: no video files in Git, public/, or dist/.');
}
