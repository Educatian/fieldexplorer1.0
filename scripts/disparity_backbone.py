"""
disparity_backbone.py  --  tag the multiscale backbone of the citation network.

Implements the directed disparity filter (Serrano, Boguna, Vespignani 2009, PNAS),
the same multiscale-backbone idea pySciSci exposes in network.py. Instead of a crude
global weight threshold (which biases toward hubs and severs the periphery), this
keeps, per node, only the edges that are statistically incompatible with a uniform
random distribution of that node's strength -- preserving hubs AND low-degree venues.

An edge i->j is in the backbone if it is significant at level ALPHA from EITHER the
source's out-side or the target's in-side:
    out-side:  (1 - w_ij/s_out_i)^(k_out_i - 1) < ALPHA
    in-side:   (1 - w_ij/s_in_j)^(k_in_j  - 1) < ALPHA

Reads/writes src/data/venue_metrics.json in place, adding `backbone` (bool) and
`alpha` (float, the min p-value across the two sides) to each citation edge.
"""
import json
from collections import defaultdict
from pathlib import Path

ALPHA = 0.10  # significance level; lower = sparser, calmer backbone
PATH = Path("src/data/venue_metrics.json")


def main():
    d = json.loads(PATH.read_text(encoding="utf-8"))
    edges = d.get("citation_edges", [])

    out_strength = defaultdict(float)
    in_strength = defaultdict(float)
    out_deg = defaultdict(int)
    in_deg = defaultdict(int)
    for e in edges:
        w = e.get("weight", 0)
        out_strength[e["source"]] += w
        in_strength[e["target"]] += w
        out_deg[e["source"]] += 1
        in_deg[e["target"]] += 1

    n_backbone = 0
    for e in edges:
        w = e["weight"]
        s, t = e["source"], e["target"]
        pvals = []
        ko = out_deg[s]
        if ko > 1 and out_strength[s] > 0:
            p_ij = w / out_strength[s]
            pvals.append((1 - p_ij) ** (ko - 1))
        ki = in_deg[t]
        if ki > 1 and in_strength[t] > 0:
            p_ij = w / in_strength[t]
            pvals.append((1 - p_ij) ** (ki - 1))
        # a node with degree 1 keeps its single edge by definition
        alpha = min(pvals) if pvals else 0.0
        e["alpha"] = round(alpha, 4)
        e["backbone"] = alpha < ALPHA
        if e["backbone"]:
            n_backbone += 1

    d.setdefault("_meta", {})["backbone_method"] = (
        f"directed disparity filter (Serrano et al. 2009, PNAS), alpha<{ALPHA}"
    )
    d["_meta"]["n_backbone_edges"] = n_backbone
    PATH.write_text(json.dumps(d, indent=2, ensure_ascii=False), encoding="utf-8")

    print(f"total citation edges : {len(edges)}")
    print(f"backbone edges       : {n_backbone}  ({100*n_backbone/max(1,len(edges)):.1f}%)")
    # how many venues retain >=1 backbone edge (periphery preservation check)
    venues_with = set()
    for e in edges:
        if e["backbone"]:
            venues_with.add(e["source"]); venues_with.add(e["target"])
    print(f"venues in backbone   : {len(venues_with)}")


if __name__ == "__main__":
    main()
