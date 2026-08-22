#!/usr/bin/env python3
"""Run deterministic structural and visual QA for Boundary 28 R2."""

from __future__ import annotations

import hashlib
import json
from pathlib import Path

import qa_boundary22_24_candidates as base


ROOT = Path(__file__).resolve().parents[1]
PINNED_QA = ROOT / "scripts" / "qa_boundary22_24_candidates.py"
PINNED_QA_BYTES = 30630
PINNED_QA_SHA256 = "9e2e8724444d32254fe865cb1f0cf74cd80b639bb2666d9ee2da09988d7fc218"
CONFIG = {
    "version": "r2",
    "source": "qa/review-candidates/boundary28-r2/yaintt-id.tex",
    "source_bytes": 269464,
    "source_sha256": "b1dd2926dc8bfdb84c6a3b4605490a8d96b14c44d89653867160d701fa0f17db",
    "job": "YAINTT_ID_BOUNDARY28_R2",
    "pages": 138,
    "pdf_bytes": 962527,
    "pdf_sha256": "1ded3c6844b656347259b464bf21526fdc32dc2246c73ac58ab76ed28688eefc",
    "candidate": "build/boundary28-r2-candidate-20260822-0062",
    "repro": "build/boundary28-r2-repro-20260822-0063",
    "candidate_raw_bytes": 956263,
    "candidate_raw_sha256": "9898335ea2371c980c79bd428685f20b75d89f1faa8a5d4ddfc34098c1c0b94b",
    "repro_raw_bytes": 956263,
    "repro_raw_sha256": "a9a5502f561b99226e102775490584b33b1656b0bb87ce2b4a9f892412a90964",
    "output": "output/YAINTT_ID_BOUNDARY28_R2_CANDIDATE.pdf",
    "witness": "qa/YAINTT_ID_BOUNDARY28_R2_REPRO.pdf",
    "render_directory": "qa/boundary28-r2-renders",
    "build_receipt": "qa/BOUNDARY28_R2_BUILD.json",
    "visual_receipt": "qa/BOUNDARY28_R2_VISUAL.json",
    "expected_blank_pages": [2, 6, 28, 62, 102, 132],
    "expected_overfull_count": 46,
    "expected_underfull_hbox_count": 2,
    "expected_underfull_vbox_count": 15,
    "required_indonesian_text": (
        "Kriptosistem ElGamal",
        "Kunci privat [dekripsi] ElGamal",
        "Tanda tangan digital ElGamal",
        "kunci publik ElGamal",
    ),
    "prohibited_untranslated_text": (
        "ElGamal Cryptosystem",
        "ElGamal Digital Signature",
        "Make an ElGamal public key",
        "Does that signature verify?",
    ),
    "visual_gate_passed": True,
    "focused_pages": [
        94, 96, 99, 111, 112, 118, 119, 122, 123, 124, 125, 126,
        127, 128, 129, 130, 131, 132, 133,
    ],
    "visual_notes": [
        "All 138 physical pages inspected through the full contact sheet; the new ElGamal section and inherited target pages were inspected full size.",
        "Physical pages 127-128 preserve the ElGamal definition, correctness proposition, proof, and formula layout without clipping or overlap.",
        "Physical page 129 contains the centered, legible ElGamal encryption protocol table; physical page 130 contains the centered, legible ElGamal digital-signature table.",
        "Both ElGamal tables were additionally inspected at 300 dpi; borders, arrows, formulas, labels, and terminal rows remain fully inside the page and readable.",
        "Physical page 131 contains all three exercises in readable order; physical page 132 is an intentional blank verso before the bibliography.",
        "Inherited signature/PKI, running-head, primitive-root, index, and DHKE target pages are raster-identical to Boundary 27 R3.",
    ],
    "visual_defects": [],
}


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def main() -> int:
    if PINNED_QA.stat().st_size != PINNED_QA_BYTES or sha256(PINNED_QA) != PINNED_QA_SHA256:
        raise SystemExit("pinned Boundary 22-24 QA script drift")

    b27 = ROOT / "qa" / "boundary27-r3-renders"
    b28 = ROOT / str(CONFIG["render_directory"])
    inherited = [94, 96, 99, 111, 112, 118, 119, 122, 123, 124, 125, 126]
    if any(sha256(b27 / f"page-{page:03d}.png") != sha256(b28 / f"page-{page:03d}.png") for page in inherited):
        raise SystemExit("Boundary 28 inherited target-page raster drift")

    build_receipt, visual_receipt = base.inspect_candidate("boundary28", CONFIG)
    excluded_attempt = {
        "path": "build/boundary28-r2-candidate-20260822-0060",
        "status": "excluded_from_admissible_pair",
        "reason": "transient_ps2pdf_truncation_missing_trailer",
        "truncated_pdf": {
            "path": "build/boundary28-r2-candidate-20260822-0060/YAINTT_ID_BOUNDARY28_R2.pdf",
            "bytes": 533687,
            "sha256": "46f941fec5f01b7e30f12b96ba8b5eea91cd0a21aead20edadb0744ab80a4ae6",
        },
        "healthy_postscript": {
            "path": "build/boundary28-r2-candidate-20260822-0060/YAINTT_ID_BOUNDARY28_R2.ps",
            "bytes": 2198350,
            "sha256": "5e1e0cd181a024248308a3a60dc7c92b4ea75ee9272e136204245cff1bdba11f",
        },
        "manual_ps2pdf_retry": {
            "path": "build/boundary28-r2-candidate-20260822-0060/YAINTT_ID_BOUNDARY28_R2.retry-stage.pdf",
            "bytes": 956263,
            "sha256": "2d34fe21ae5ed4d268098c98c20a47b4bd928ea6f8a46070147334ae315f8da9",
            "pages": 138,
            "valid_pdf": True,
        },
    }
    evidence = {
        "new_instructional_pages_reviewed_full_size": [127, 128, 129, 130, 131],
        "elgamal_encryption_table_physical_page": 129,
        "elgamal_signature_table_physical_page": 130,
        "critical_tables_reviewed_at_300_dpi": True,
        "inherited_target_pages_raster_identical_to_boundary27_r3": inherited,
        "candidate_recommended_for_refreeze": True,
    }
    build_receipt["status"] = "passed_structural_candidate_not_canonical_recommended_for_refreeze"
    build_receipt["excluded_attempts"] = [excluded_attempt]
    build_receipt["admission_evidence"] = evidence
    build_receipt["structural_gate"]["canonical_recommendation"] = True
    visual_receipt["status"] = "passed_candidate_not_canonical_recommended_for_refreeze"
    visual_receipt["admission_evidence"] = evidence
    visual_receipt["visual_gate"]["canonical_recommendation"] = True

    build_path = ROOT / str(CONFIG["build_receipt"])
    visual_path = ROOT / str(CONFIG["visual_receipt"])
    base.write_json(build_path, build_receipt)
    base.write_json(visual_path, visual_receipt)
    payload = {
        "script": {
            "path": str(Path(__file__).resolve().relative_to(ROOT)).replace("\\", "/"),
            "bytes": Path(__file__).stat().st_size,
            "sha256": sha256(Path(__file__)),
        },
        "receipts": [
            {
                "path": str(path.relative_to(ROOT)).replace("\\", "/"),
                "bytes": path.stat().st_size,
                "sha256": sha256(path),
            }
            for path in (build_path, visual_path)
        ],
    }
    print(json.dumps(payload, ensure_ascii=False, indent=2, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
