import {describe,it,expect} from 'vitest';
import fs from 'node:fs';
import ts from 'typescript';
import {escapeHtml,ratingValue} from './html';
const source=fs.readFileSync(new URL('../../index.tsx',import.meta.url),'utf8');
const ast=ts.createSourceFile('index.tsx',source,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
const declaration=ast.statements.find(s=>ts.isFunctionDeclaration(s)&&s.name?.text==='renderAnnotations')!;
const js=ts.transpileModule(declaration.getText(ast),{compilerOptions:{target:ts.ScriptTarget.ES2022}}).outputText;
const render=Function('isGuestUser','escapeHtml','ratingValue',js+';return renderAnnotations;')(()=>true,escapeHtml,ratingValue);
describe('untrusted annotation display',()=>{
    it('keeps comments, tags and attribute values as text',()=>{
        const marker='<img src=x onerror="alert(1)">';
        const html=render([{id:'" onclick="alert(2)',comment:marker,rating:3,tags:[marker],created_at:'2026-11-01'}],'Journal','Journal');
        expect(html).not.toContain('<img');
        expect(html).toContain('&lt;img');
        expect(html).toContain('data-id="&quot; onclick=&quot;alert(2)"');
    });
    it('preserves ordinary text and survives corrupt stored ratings',()=>{
        const html=render([{id:'a',comment:'A & B\n다음 줄',rating:999,tags:[],created_at:'2026-11-01'}],'J','Journal');
        expect(html).toContain('A &amp; B\n다음 줄');
        expect(html).toContain('★★★★★');
        expect(ratingValue(NaN)).toBe(0);
    });
});
