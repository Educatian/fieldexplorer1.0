import {MAP_VENUES} from './mapVenues';
import {TAG_CATEGORIES,canonicalCategory} from './venues';

/** Same unique-name and field/tag rules used by the map. */
export function summarizeVenues(data: readonly {name:string;type:string;categories:string[]}[]) {
    const unique = new Map(data.map(v=>[v.name,v]));
    return {
        journals: [...unique.values()].filter(v=>v.type==='Journal').length,
        conferences: [...unique.values()].filter(v=>v.type==='Conference'||v.type==='SubConference').length,
        categories: new Set([...unique.values()].flatMap(v=>v.categories).filter(c=>!TAG_CATEGORIES.has(c)).map(canonicalCategory)).size,
    };
}
export const NETWORK_SUMMARY = summarizeVenues(MAP_VENUES);

export function renderNetworkSummary() {
    for(const [key,value] of Object.entries(NETWORK_SUMMARY)) {
        const node=document.querySelector(`[data-network-count="${key}"]`);
        if(node) node.textContent=String(value);
    }
}
