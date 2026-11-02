import {describe,it,expect} from 'vitest';
import fs from 'node:fs';
import ts from 'typescript';
import semanticProfiles from './semantic_profiles.json';
import venueMetrics from './venue_metrics.json';
import raw from './venues.json';
import {TAG_CATEGORIES,canonicalCategory} from './venues';
const source=fs.readFileSync(new URL('../../index.tsx',import.meta.url),'utf8');
const ast=ts.createSourceFile('index.tsx',source,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
const fn=ast.statements.find(s=>ts.isFunctionDeclaration(s)&&s.name?.text==='parseNetworkData')!.getText(ast);
const parse=(text:string)=>Function('venueData','semanticProfiles','venueMetrics','TAG_CATEGORIES','canonicalCategory','formulaText',ts.transpileModule(text,{compilerOptions:{target:ts.ScriptTarget.ES2022}}).outputText+';return parseNetworkData();')(raw,semanticProfiles,venueMetrics,TAG_CATEGORIES,canonicalCategory,()=> 'formula');
// Retain the released union-and-norm algorithm as an independent parity oracle.
const reference=fn.replace('const terms = vectorTerms.get(v1.name)!;', 'const terms = new Set([...Object.keys(vec1), ...Object.keys(vec2)]);')
 .replace('const similarity = dotProduct / (vectorNorms.get(v1.name)! * vectorNorms.get(v2.name)!);', 'const norm = (vector:Record<string,number>) => Math.sqrt([...terms].reduce((sum,term)=>sum+(vector[term]||0)**2,0)); const similarity = dotProduct / (norm(vec1)*norm(vec2));');
describe('semantic graph calculation parity',()=>{
 it('preserves every node, edge, tooltip, category and citation record',()=>{
  const actual=parse(fn),before=parse(reference);
  expect(reference).not.toEqual(fn);expect(actual.nodes.length).toBeGreaterThan(100);expect(actual.edges.some((e:any)=>e.id?.startsWith('semantic-'))).toBe(true);
  expect(actual.nodes).toEqual(before.nodes);expect(actual.categories).toEqual(before.categories);expect(actual.citationEdges).toEqual(before.citationEdges);
  expect(actual.edges).toHaveLength(before.edges.length);
  actual.edges.forEach((edge:any,i:number)=>{const old=before.edges[i];expect({...edge,value:undefined}).toEqual({...old,value:undefined});if(edge.value!==undefined)expect(edge.value).toBeCloseTo(old.value,12);});
 });
});
