import {describe,it,expect} from 'vitest';
import fs from 'node:fs';
import ts from 'typescript';
import {findMentionedVenues} from './venueMentions';
const source=fs.readFileSync(new URL('../../index.tsx',import.meta.url),'utf8');
const ast=ts.createSourceFile('index.tsx',source,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
const names=['normalizeRagText','tokenizeRagText','buildVenueMatches','buildTopicMatches'];
const declarations:string[]=[];
function visit(node:ts.Node){
    if(ts.isFunctionDeclaration(node)&&node.name&&names.includes(node.name.text))declarations.push(node.getText(ast));
    ts.forEachChild(node,visit);
}
visit(ast);
const js=ts.transpileModule(declarations.join('\n'),{compilerOptions:{target:ts.ScriptTarget.ES2022}}).outputText;
const venues=['Journal of the Learning Sciences','Computers & Education','Computers & Education: X Reality'].map(name=>({name,type:'Journal',categories:['Learning Sciences']}));
const topic={name:'Collaborative Learning',category:'CSCL',description:'협력 학습',details:'Research topic',keyResearchers:[]};
const details=()=>({topics:['Learning'],overview:{website:'#',description:'Research'},methodologyProfile:[]});
const match=Function('venueData','ISLS_TOPICS','getVenueDetails','getVenueContentAudit','findMentionedVenues',js+';return {buildVenueMatches,buildTopicMatches};')(venues,[topic],details,()=>({}),findMentionedVenues);
describe('actual Sage match builders',()=>{
    it('ranks the two explicitly requested venues ahead of similar names',()=>{
        expect(match.buildVenueMatches('JLS와 Computers & Education 비교').slice(0,2).map((m:any)=>m.venue.name)).toEqual(venues.slice(0,2).map(v=>v.name));
    });
    it('can build topic matches on the same response path',()=>{
        expect(match.buildTopicMatches('Collaborative Learning')[0].topic.name).toBe(topic.name);
        expect(()=>match.buildTopicMatches('JLS와 C&E 비교')).not.toThrow();
    });
});
