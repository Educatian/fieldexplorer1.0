"""Independent refreshes with last-good-data rollback and quota-cache preservation."""
import argparse
from datetime import datetime, timezone
import json
import os
from pathlib import Path
import subprocess
import sys

LAYERS = {
    "activity": ("venue_activity.json", ["build_venue_activity.py", "build_alt_activity.py"]),
    "trends": ("field_trends.json", ["build_field_trends.py"]),
    "citations": ("venue_metrics.json", ["build_venue_metrics.py", "disparity_backbone.py"]),
}


def current(path, month, layer):
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
        meta = data.get("_meta", {})
        date = meta.get("generated_at", "")
        datetime.strptime(date, "%Y-%m-%d")
        if date[:7] != month:
            return False
        if layer == "citations":
            return bool(data.get("venues")) and "n_backbone_edges" in meta and meta.get("samples_per_venue") == 60
        return bool(data.get("topics") if layer == "trends" else data.get("venues"))
    except (ValueError, TypeError, AttributeError, OSError):
        return False


def refresh(root, month, force=False, run=None):
    root = Path(root)
    run = run or (lambda args: subprocess.run(args, cwd=root, check=True))
    results = {}
    for layer, (filename, commands) in LAYERS.items():
        file = root / "src" / "data" / filename
        entry = {"file": file.relative_to(root).as_posix()}
        if not force and current(file, month, layer):
            results[layer] = {**entry, "status": "current"}
            continue
        original = file.read_bytes() if file.exists() else None
        try:
            for command in commands:
                args = [sys.executable, "scripts/" + command]
                if command == "build_venue_metrics.py":
                    args += ["--samples", "60"]
                run(args)
            if not current(file, month, layer):
                raise ValueError("Generated output is incomplete or not dated this month")
            # Alternate sources may catch per-venue errors internally and still exit 0.
            # Do not publish a smaller venue set in place of previously available data.
            if original is not None and layer in ("activity", "citations"):
                previous = json.loads(original).get("venues", {})
                updated = json.loads(file.read_text(encoding="utf-8")).get("venues", {})
                missing = sorted(set(previous) - set(updated))
                if missing:
                    raise ValueError("Previously published venues disappeared: " + ", ".join(missing))
            results[layer] = {**entry, "status": "refreshed"}
        except Exception as error:
            if original is not None:
                file.write_bytes(original)
            elif file.exists():
                file.unlink()
            results[layer] = {**entry, "status": "failed", "error": str(error)}
            print(f"{layer}: failed; last-good data restored: {error}", file=sys.stderr, flush=True)
    return {"month": month, "layers": results, "failed": any(v["status"] == "failed" for v in results.values())}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--force", action="store_true")
    parser.add_argument("--report", default="refresh-report.json")
    args = parser.parse_args()
    report = refresh(Path(__file__).resolve().parents[1], datetime.now(timezone.utc).strftime("%Y-%m"), args.force)
    Path(args.report).write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    summary = "## OpenAlex refresh\n\n| Layer | Result |\n|---|---|\n" + "\n".join(f"| {name} | {value['status']} |" for name, value in report["layers"].items()) + "\n"
    print(summary)
    if os.environ.get("GITHUB_STEP_SUMMARY"):
        with open(os.environ["GITHUB_STEP_SUMMARY"], "a", encoding="utf-8") as output:
            output.write(summary)
    return int(report["failed"])


if __name__ == "__main__":
    sys.exit(main())
