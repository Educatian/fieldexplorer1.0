import {describe,it,expect} from 'vitest';
import {findMentionedVenues} from './venueMentions';
const names=['Journal of the Learning Sciences','Computers & Education','Computers & Education: X Reality','International Journal of Computer-Supported Collaborative Learning','CSCL'].map(name=>({name}));
describe('explicit comparison identities',()=>{
    it('recognizes advertised aliases next to Korean particles',()=>{
        expect(findMentionedVenues('JLS와 C&E 비교',names)).toEqual([names[0].name,names[1].name]);
    });
    it('does not substitute the similarly named XR journal',()=>{
        expect(findMentionedVenues('JLS와 Computers & Education의 차이',names)).toEqual([names[0].name,names[1].name]);
        expect(findMentionedVenues('Computers & Education: X Reality vs JLS',names)).toEqual([names[2].name,names[0].name]);
    });
    it('keeps journal and conference abbreviations distinct',()=>{
        expect(findMentionedVenues('ijCSCL vs CSCL',names)).toEqual([names[3].name,names[4].name]);
        expect(findMentionedVenues('notjls vs mystery journal',names)).toEqual([]);
    });
    it('preserves ambiguous counts so the UI can ask instead of guessing',()=>{
        expect(findMentionedVenues('JLS 비교',names)).toHaveLength(1);
        expect(findMentionedVenues('JLS vs C&E vs CSCL',names)).toHaveLength(3);
    });
});
