#!/usr/bin/env python3
"""Admit two complete, isolated R014 backend replays after byte comparison.

The generator itself is run with three explicit output roots (backend, preview,
and handoff).  This checker never mutates either replay; it inventories every
file and writes the canonical determinism receipt only when both inventories
are identical and the pinned final source identity is still exact.
"""

from __future__ import annotations

import argparse
import hashlib
import json
from datetime import datetime, timezone
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_A = ROOT / "qa" / "backend-full-smoke-06"
DEFAULT_B = ROOT / "qa" / "backend-full-smoke-07"
RECEIPT = ROOT / "qa" / "BACKEND_DETERMINISM.json"
TARGET = ROOT / "qa" / "frozen-boundaries" / "boundary28-final" / "yaintt-id.tex"
LEDGER = ROOT / "qa" / "review-candidates" / "boundary28-r2" / "ADVERSE_LEDGER.md"
TERMINOLOGY = ROOT / "qa" / "review-candidates" / "boundary28-r2" / "TERMINOLOGY.md"
BUILDER = ROOT / "scripts" / "build_backend.mjs"
EXTENSION = ROOT / "scripts" / "backend_full_extension.mjs"
CANONICAL_ADMISSION = ROOT / "scripts" / "backend_canonical_reader_admission.mjs"
FINAL_BUILD = ROOT / "qa" / "FINAL_BUILD.json"
FINAL_VISUAL = ROOT / "qa" / "FINAL_VISUAL.json"
FINAL_PDF = ROOT / "output" / "YAINTT_ID.pdf"

PINNED = {
    TARGET: (269_464, "b1dd2926dc8bfdb84c6a3b4605490a8d96b14c44d89653867160d701fa0f17db"),
    LEDGER: (51_058, "dd4de4ca603dc1bf67b635bce3199fcdbf6bcacbc3b8d3736350b5a825a00f57"),
    TERMINOLOGY: (29_316, "3e3fe31baa8565bbc54cd6d789570cac18ed469f68cf683f08dd639ef92d9bd1"),
    FINAL_BUILD: (7_395, "d112b48de7032c2eda809419eadaaafdec089c8b6c5886db8501ab226c8123e2"),
    FINAL_VISUAL: (5_729, "4d69b0335cb59477117209ba2c62347afc758c73d9bde9a19c6b25df10851292"),
    FINAL_PDF: (962_527, "1ded3c6844b656347259b464bf21526fdc32dc2246c73ac58ab76ed28688eefc"),
}
EXPECTED_COUNTS = {
    "artifact": 105,
    "asset": 14,
    "concept": 223,
    "correction": 141,
    "course": 1,
    "edition": 12,
    "program": 1,
    "qa_event": 131,
    "relation": 3297,
    "resource": 1,
    "rights": 15,
    "segment": 544,
    "term": 239,
    "unit": 548,
}
EXPECTED_RECORDS = 5_272
EXPECTED_RECORDS_BYTES = 5_656_786
EXPECTED_RECORDS_SHA256 = "e2c4374c37fbc0d45c2d029b7b734b7774a78f5a66caeb66d19d1a7bb97509d0"


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for block in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def inventory(root: Path) -> dict[str, dict[str, int | str]]:
    if not root.is_dir():
        raise AssertionError(f"missing isolated replay surface: {root}")
    result: dict[str, dict[str, int | str]] = {}
    for path in sorted((item for item in root.rglob("*") if item.is_file()), key=lambda item: item.as_posix()):
        relative = path.relative_to(root).as_posix()
        result[relative] = {"bytes": path.stat().st_size, "sha256": sha256(path)}
    return result


def validate_run(run_root: Path) -> dict[str, object]:
    backend = run_root / "backend"
    previews = run_root / "previews"
    handoff = run_root / "handoff"
    manifest_path = backend / "MANIFEST.json"
    records_path = backend / "records.jsonl"
    if not manifest_path.is_file() or not records_path.is_file():
        raise AssertionError(f"incomplete isolated replay: {run_root}")
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    if manifest.get("target_sha256") != PINNED[TARGET][1]:
        raise AssertionError(f"target identity drift in {manifest_path}")
    if manifest.get("record_counts") != EXPECTED_COUNTS:
        raise AssertionError(f"record-count drift in {manifest_path}: {manifest.get('record_counts')}")
    if records_path.stat().st_size != EXPECTED_RECORDS_BYTES or sha256(records_path) != EXPECTED_RECORDS_SHA256:
        raise AssertionError(f"records stream drift in {records_path}")
    if sum(1 for _ in records_path.open("r", encoding="utf-8")) != EXPECTED_RECORDS:
        raise AssertionError(f"record total drift in {records_path}")
    return {
        "root": run_root.relative_to(ROOT).as_posix(),
        "backend": inventory(backend),
        "previews": inventory(previews),
        "handoff": inventory(handoff),
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--run-a", type=Path, default=DEFAULT_A)
    parser.add_argument("--run-b", type=Path, default=DEFAULT_B)
    args = parser.parse_args()

    for path, (expected_bytes, expected_hash) in PINNED.items():
        if not path.is_file() or path.stat().st_size != expected_bytes or sha256(path) != expected_hash:
            raise AssertionError(f"pinned final input drift: {path}")

    run_a = validate_run(args.run_a.resolve())
    run_b = validate_run(args.run_b.resolve())
    for surface in ("backend", "previews", "handoff"):
        if run_a[surface] != run_b[surface]:
            a = run_a[surface]
            b = run_b[surface]
            differences = sorted(set(a) ^ set(b) | {key for key in set(a) & set(b) if a[key] != b[key]})
            raise AssertionError(f"isolated replay mismatch on {surface}: {differences[:20]}")

    receipt = {
        "schema": "r014.backend.determinism",
        "schema_version": "2.0.0",
        "generated_at": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        "result": "pass",
        "method": "two isolated complete generator replays with exact full-surface byte comparison",
        "builder": {"path": BUILDER.relative_to(ROOT).as_posix(), "bytes": BUILDER.stat().st_size, "sha256": sha256(BUILDER)},
        "extension": {"path": EXTENSION.relative_to(ROOT).as_posix(), "bytes": EXTENSION.stat().st_size, "sha256": sha256(EXTENSION)},
        "canonical_reader_admission": {"path": CANONICAL_ADMISSION.relative_to(ROOT).as_posix(), "bytes": CANONICAL_ADMISSION.stat().st_size, "sha256": sha256(CANONICAL_ADMISSION)},
        "pinned_inputs": [
            {"path": path.relative_to(ROOT).as_posix(), "bytes": expected_bytes, "sha256": expected_hash}
            for path, (expected_bytes, expected_hash) in PINNED.items()
        ],
        "baseline_boundary11": {
            "record_count": 2417,
            "records_bytes": 2_247_534,
            "records_sha256": "3fe63938cec0aaeb8cc31ec4590af077377c758b3585cea4049b433542086a7c",
        },
        "admitted_boundary28_r2": {
            "record_count": 5180,
            "records_bytes": 5_584_334,
            "records_sha256": "18764193b4579196c2b02549ff592da0f04e4c0c4194cf6da5294ff11bbb6fa7",
        },
        "final_records": {"count": EXPECTED_RECORDS, "bytes": EXPECTED_RECORDS_BYTES, "sha256": EXPECTED_RECORDS_SHA256},
        "record_counts": EXPECTED_COUNTS,
        "runs": [{"root": run_a["root"]}, {"root": run_b["root"]}],
        "compared_surfaces": {
            surface: {
                "file_count": len(run_a[surface]),
                "total_bytes": sum(int(item["bytes"]) for item in run_a[surface].values()),
                "inventory": run_a[surface],
            }
            for surface in ("backend", "previews", "handoff")
        },
        "mismatches": [],
    }
    RECEIPT.write_text(json.dumps(receipt, ensure_ascii=False, sort_keys=True, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({
        "result": "pass",
        "receipt": str(RECEIPT),
        "receipt_sha256": sha256(RECEIPT),
        "backend_files": len(run_a["backend"]),
        "preview_files": len(run_a["previews"]),
        "handoff_files": len(run_a["handoff"]),
    }, indent=2))


if __name__ == "__main__":
    main()
