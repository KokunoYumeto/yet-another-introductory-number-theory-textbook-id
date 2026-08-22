#!/usr/bin/env python3
"""Build immutable R014 Boundary 25-28 review candidates."""

from __future__ import annotations

import hashlib
import sys
from pathlib import Path

import build_boundary22_24_candidates as base


ROOT = Path(__file__).resolve().parents[1]
PINNED_BUILDER = ROOT / "scripts" / "build_boundary22_24_candidates.py"
PINNED_BUILDER_BYTES = 7479
PINNED_BUILDER_SHA256 = "6646955623a6867f87fcccab1a8ab7a698a5fb7abff55fdfd94737296e80b68e"
CONFIGS = {
    "boundary25": {
        "source": ROOT / "qa" / "review-candidates" / "boundary25-r2" / "yaintt-id.tex",
        "macro": "boundarytwentyfive",
        "bytes": 266592,
        "sha256": "5f89f9f8d794991e3f3ec665123acd9ac8ab5042e0a29acec5582f15b9262983",
        "job": "YAINTT_ID_BOUNDARY25_R2",
        "boundary_id": "boundary25-r2",
    },
    "boundary26": {
        "source": ROOT / "qa" / "review-candidates" / "boundary26-r4" / "yaintt-id.tex",
        "macro": "boundarytwentysix",
        "bytes": 267258,
        "sha256": "f9fe6c663f922cf9ed1858158849f213b25bbe13f0be682e1ea6f1af0c4909ca",
        "job": "YAINTT_ID_BOUNDARY26_R4",
        "boundary_id": "boundary26-r4",
    },
    "boundary27": {
        "source": ROOT / "qa" / "review-candidates" / "boundary27-r3" / "yaintt-id.tex",
        "macro": "boundarytwentyseven",
        "bytes": 268169,
        "sha256": "2809432d877c650d8fde842b590acb7defe4144ba7cbcc09d0647ed994fa4b5c",
        "job": "YAINTT_ID_BOUNDARY27_R3",
        "boundary_id": "boundary27-r3",
    },
    "boundary28": {
        "source": ROOT / "qa" / "review-candidates" / "boundary28-r2" / "yaintt-id.tex",
        "macro": "boundarytwentyeight",
        "bytes": 269464,
        "sha256": "b1dd2926dc8bfdb84c6a3b4605490a8d96b14c44d89653867160d701fa0f17db",
        "job": "YAINTT_ID_BOUNDARY28_R2",
        "boundary_id": "boundary28-r2",
    },
}


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def main() -> int:
    if len(sys.argv) != 3 or sys.argv[1] not in CONFIGS:
        raise SystemExit("usage: build_boundary25_28_candidates.py BOUNDARY25|BOUNDARY26|BOUNDARY27|BOUNDARY28 BUILD_DIRECTORY")
    if (
        PINNED_BUILDER.stat().st_size != PINNED_BUILDER_BYTES
        or sha256(PINNED_BUILDER) != PINNED_BUILDER_SHA256
    ):
        raise SystemExit("pinned Boundary 22-24 builder drift")
    selected = sys.argv[1]
    build_directory = sys.argv[2]
    base.CONFIGS = {selected: CONFIGS[selected]}
    sys.argv = [sys.argv[0], selected, build_directory]
    return base.main()


if __name__ == "__main__":
    raise SystemExit(main())
