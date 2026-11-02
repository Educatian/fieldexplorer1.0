"""Failure/retry regressions; no network, quota use, or public-data mutations."""
import json
from pathlib import Path
import subprocess
import tempfile
import unittest
from refresh_openalex_layers import LAYERS, refresh


class RefreshTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.root = Path(self.tmp.name)
        (self.root / "src/data").mkdir(parents=True)
        self.calls = []
        for layer in LAYERS:
            self.write(layer, "2026-10-31")

    def write(self, layer, date):
        meta = {"generated_at": date}
        if layer == "citations":
            meta.update(samples_per_venue=60, n_backbone_edges=1)
        file = self.root / "src/data" / LAYERS[layer][0]
        file.write_text(json.dumps({"_meta": meta, "venues": {"v": {}}, "topics": ["t"]}), encoding="utf-8")

    def runner(self, args):
        self.calls.append(args[1])
        for layer, (_, commands) in LAYERS.items():
            if args[1].endswith(commands[-1]):
                self.write(layer, "2026-11-02")

    def test_current_citations_do_not_skip_stale_activity_or_trends(self):
        self.write("citations", "2026-11-01")
        report = refresh(self.root, "2026-11", run=self.runner)
        self.assertEqual([v["status"] for v in report["layers"].values()], ["refreshed", "refreshed", "current"])
        self.assertFalse(report["failed"])
        self.assertNotIn("scripts/build_venue_metrics.py", self.calls)

    def test_partial_failure_rolls_back_and_retry_only_runs_incomplete_layer(self):
        file = self.root / "src/data/venue_activity.json"
        original = file.read_bytes()
        def fail(args):
            if args[1].endswith("build_alt_activity.py"):
                file.write_text('{"broken":', encoding="utf-8")
                raise subprocess.CalledProcessError(1, args)
            self.runner(args)
        report = refresh(self.root, "2026-11", run=fail)
        self.assertTrue(report["failed"])
        self.assertEqual(file.read_bytes(), original)
        self.assertEqual(report["layers"]["trends"]["status"], "refreshed")
        self.assertEqual(report["layers"]["citations"]["status"], "refreshed")
        self.calls.clear()
        retry = refresh(self.root, "2026-11", run=self.runner)
        self.assertFalse(retry["failed"])
        self.assertEqual(self.calls, ["scripts/build_venue_activity.py", "scripts/build_alt_activity.py"])

    def test_success_without_fresh_output_is_failure(self):
        report = refresh(self.root, "2026-11", run=lambda args: None)
        self.assertTrue(report["failed"])
        self.assertTrue(all(v["status"] == "failed" for v in report["layers"].values()))

    def test_silent_alternate_source_loss_restores_previous_coverage(self):
        file = self.root / "src/data/venue_activity.json"
        original = file.read_bytes()
        def partial(args):
            self.runner(args)
            if args[1].endswith("build_alt_activity.py"):
                value = json.loads(file.read_text())
                value['venues'] = {'different-venue': {}}
                file.write_text(json.dumps(value))
        report = refresh(self.root, "2026-11", run=partial)
        self.assertTrue(report['failed'])
        self.assertEqual(file.read_bytes(), original)
        self.assertIn('disappeared', report['layers']['activity']['error'])

    def test_current_layers_make_no_requests(self):
        for layer in LAYERS:
            self.write(layer, "2026-11-01")
        report = refresh(self.root, "2026-11", run=self.runner)
        self.assertFalse(report["failed"])
        self.assertEqual(self.calls, [])

    def test_missing_backbone_retries_and_force_refreshes_current_data(self):
        for layer in LAYERS:
            self.write(layer, "2026-11-01")
        file = self.root / "src/data/venue_metrics.json"
        value = json.loads(file.read_text())
        del value["_meta"]["n_backbone_edges"]
        file.write_text(json.dumps(value))
        report = refresh(self.root, "2026-11", run=self.runner)
        self.assertEqual(report["layers"]["citations"]["status"], "refreshed")
        self.calls.clear()
        report = refresh(self.root, "2026-11", force=True, run=self.runner)
        self.assertEqual(len(self.calls), 5)
        self.assertFalse(report["failed"])


if __name__ == "__main__":
    unittest.main()
