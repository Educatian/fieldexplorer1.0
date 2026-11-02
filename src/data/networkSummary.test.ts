import {it,expect} from 'vitest';
import {NETWORK_SUMMARY,summarizeVenues} from './networkSummary';
import {parseNetworkData} from '../network/parser';
it('landing summary follows the actual map unique-name and field/tag rules',()=>{
    const graph=parseNetworkData();
    expect(NETWORK_SUMMARY).toEqual({journals:graph.nodes.filter(n=>n.group==='Journal').length,conferences:graph.nodes.filter(n=>['Conference','SubConference'].includes(n.group)).length,categories:graph.categories.length});
    expect(summarizeVenues([{name:'J',type:'Journal',categories:['ISLS','Human-Computer Interaction']},{name:'J',type:'Journal',categories:['ISLS','Human-Computer Interaction']}])).toEqual({journals:1,conferences:0,categories:1});
});
