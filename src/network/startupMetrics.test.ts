import {describe,it,expect} from 'vitest';
import fs from 'node:fs';import ts from 'typescript';
import semanticProfiles from '../data/semantic_profiles.json';import venueMetrics from '../data/venue_metrics.json';
import {MAP_VENUES} from '../data/mapVenues';import {TAG_CATEGORIES,canonicalCategory} from '../data/venues';
import baseline from './__fixtures__/metrics-baseline.json';
const source=fs.readFileSync(new URL('../../index.tsx',import.meta.url),'utf8');
const ast=ts.createSourceFile('index.tsx',source,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
const declarations=['parseNetworkData','calculateNetworkMetrics','applyMetricsToNodes'].map(name=>ast.statements.find(s=>ts.isFunctionDeclaration(s)&&s.name?.text===name)!.getText(ast));
const js=ts.transpileModule(declarations.join('\n'),{compilerOptions:{target:ts.ScriptTarget.ES2022}}).outputText;
const api=Function('venueData','semanticProfiles','venueMetrics','TAG_CATEGORIES','canonicalCategory','formulaText',js+';return {parseNetworkData,calculateNetworkMetrics,applyMetricsToNodes};')(MAP_VENUES,semanticProfiles,venueMetrics,TAG_CATEGORIES,canonicalCategory,()=> 'formula');
describe('startup graph metric parity',()=>{
 for(const example of baseline)it(example.name,()=>{
  const graph=example.name==='released graph'?api.parseNetworkData():example;
  const m=api.calculateNetworkMetrics(graph.nodes,graph.edges);
  const result={metrics:Object.fromEntries(Object.entries(m).map(([k,v])=>[k,v instanceof Map?[...v]:v])),styled:api.applyMetricsToNodes(graph.nodes,m)};
  expect(JSON.parse(JSON.stringify(result))).toEqual(example.expected);
 });
});
