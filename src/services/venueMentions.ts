// Explicit identities are distinct from fuzzy topic relevance. Never substitute a
// similarly named venue for one of the two entities requested in a comparison.
const aliases: Record<string, string[]> = {
    'Journal of the Learning Sciences': ['JLS'],
    'International Journal of Computer-Supported Collaborative Learning': ['ijCSCL', 'IJCSCL'],
    'Educational Technology Research and Development': ['ETRD', 'ETR&D'],
    'British Journal of Educational Technology': ['BJET'],
    'Computers & Education': ['C&E', 'C & E'],
    'Computers & Education: X Reality': ['C&E: XR', 'C&E XR'],
    'Journal of Learning Analytics': ['JLA'],
    'ACM Transactions on Computer-Human Interaction': ['TOCHI'],
    'ACM Transactions on Computing Education': ['TOCE'],
    'CHI Conference': ['CHI'],
    'LAK Conference': ['LAK'],
    'AIED Conference': ['AIED'],
    'CSCL': ['CSCL'],
    'ICLS': ['ICLS'],
};

function normalize(text: string) {
    return text.toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9가-힣\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

export function findMentionedVenues(query: string, venues: readonly {name: string}[]): string[] {
    const text = normalize(query);
    const hits: {name: string; start: number; end: number}[] = [];
    for (const {name} of venues) {
        for (const term of new Set([name, ...(aliases[name] || [])].map(normalize))) {
            const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const pattern = new RegExp(`(^|[^a-z0-9])(${escaped})(?=$|[^a-z0-9])`, 'g');
            for (const match of text.matchAll(pattern)) {
                const start = match.index! + match[1].length;
                hits.push({name, start, end: start + match[2].length});
            }
        }
    }
    // A longer canonical name wins over its prefix (e.g. C&E: X Reality).
    const accepted: typeof hits = [];
    for (const hit of hits.sort((a,b) => (b.end-b.start)-(a.end-a.start))) {
        if (!accepted.some(a => hit.start < a.end && hit.end > a.start)) accepted.push(hit);
    }
    return [...new Set(accepted.sort((a,b) => a.start-b.start).map(h => h.name))];
}
