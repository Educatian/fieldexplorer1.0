import fs from 'node:fs';import path from 'node:path';
const root=path.resolve('dist'),html=fs.readFileSync(path.join(root,'app.html'),'utf8');
const files=[...html.matchAll(/<link\b[^>]*rel="modulepreload"[^>]*href="([^"]+)"/g)].map(m=>m[1]);
if(!files.some(f=>/graphVendor-.*\.js$/.test(f)))throw Error('Graph preload missing');
if(!files.some(f=>/\/index-.*\.js$/.test(f)))throw Error('Core preload missing');
for(const file of files){if(!fs.existsSync(path.join(root,file)))throw Error('Missing preload '+file);if(/jspdf|html2canvas/.test(file))throw Error('Export loaded too early');}
if(!html.includes('id="loading-overlay"')||!html.includes('media="print"'))throw Error('Retry surface or non-blocking fonts missing');
console.log(`Startup build: ${files.length} valid module preloads; exports remain lazy; retry shell retained.`);
