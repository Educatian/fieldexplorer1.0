import {it,expect} from 'vitest';import {startupPreload} from './startupPreload';
const chunk=(fileName:string,id:string,imports:string[]=[],dynamicImports:string[]=[])=>({type:'chunk',fileName,modules:{[id]:{}},imports,dynamicImports});
it('preloads only the startup chunks and their static dependencies',()=>{
 const plugin=startupPreload();const hook=plugin.transformIndexHtml as {handler:Function};
 const context={filename:'C:/app/app.html',bundle:{
  'core.js':chunk('core.js','C:/app/index.tsx',['shared.js'],['pdf.js']),
  'graph.js':chunk('graph.js','C:/app/src/ui/graphVendor.ts',['shared.js']),
  'shared.js':chunk('shared.js','shared'), 'pdf.js':chunk('pdf.js','pdf'),
 }};
 expect(hook.handler('',context).map((tag:any)=>tag.attrs.href)).toEqual(['/core.js','/shared.js','/graph.js']);
 expect(hook.handler('',{...context,filename:'C:/app/index.html'})).toBeUndefined();
 expect(hook.handler('',{filename:context.filename})).toBeUndefined();
});
