import {it,expect} from 'vitest';
import {NETWORK_SUMMARY,summarizeVenues} from './networkSummary';
it('landing summary follows the actual map unique-name and field/tag rules',()=>{
    expect(NETWORK_SUMMARY).toEqual({journals:65,conferences:23,categories:13});
    expect(summarizeVenues([{name:'J',type:'Journal',categories:['ISLS','Human-Computer Interaction']},{name:'J',type:'Journal',categories:['ISLS','Human-Computer Interaction']}])).toEqual({journals:1,conferences:0,categories:1});
});
