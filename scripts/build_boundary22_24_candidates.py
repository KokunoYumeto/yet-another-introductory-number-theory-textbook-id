#!/usr/bin/env python3
"""Fresh reproducibility builds for R014 Boundary 22-24 review candidates."""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import shutil
import subprocess
import sys
from pathlib import Path

import pikepdf


ROOT = Path(__file__).resolve().parents[1]
REFS = ROOT / "source" / "refs.bib"
ASSETS = ROOT / "source" / "assets"
FINALIZER = ROOT / "scripts" / "finalize_pdf_deterministic.py"
CONFIGS = {
    "boundary22": {
        "source": ROOT / "qa" / "review-candidates" / "boundary22-layout-r2" / "yaintt-id.tex",
        "macro": "boundarytwentytwo",
        "bytes": 265289,
        "sha256": "f5509b8e941daf94d9cc01cc9668895f48611d7e5c718546adedd7f8337606ec",
        "job": "YAINTT_ID_BOUNDARY22_LAYOUT_R2",
        "boundary_id": "boundary22-layout-r2",
    },
    "boundary23": {
        "source": ROOT / "qa" / "review-candidates" / "boundary23-r3" / "yaintt-id.tex",
        "macro": "boundarytwentythree",
        "bytes": 265467,
        "sha256": "53ca51205b17143cddf2ec009221063b6efe7edaa89f101bdde21c60772ca485",
        "job": "YAINTT_ID_BOUNDARY23_R3",
        "boundary_id": "boundary23-r3",
    },
    "boundary24": {
        "source": ROOT / "qa" / "review-candidates" / "boundary24-r2" / "yaintt-id.tex",
        "macro": "boundarytwentyfour",
        "bytes": 265880,
        "sha256": "c231318f45d5a8beb6a019fe0a7192404b32f97acf08601f912bff5cf2c90948",
        "job": "YAINTT_ID_BOUNDARY24_R2",
        "boundary_id": "boundary24-r2",
    },
}
BUILD_INPUTS = {
    REFS: (4406, "115c8a3b51dec2ce3dd1595953127beeed02dd30698fa1f91c8d4fa580ec1d8a"),
    FINALIZER: (4048, "267b82b87d487a21e400acfc86d55363847a3b1f1740952911e5dbfb7cc95f9b"),
    ASSETS / "cover_art.eps": (48828, "076b45fffb0031e9cf35883c4123de72c9d302dc963975a88c64a81f7c8c78d1"),
    ASSETS / "dbend.eps": (13704, "bddd8601f3e402ed262b19332b77cb45442a82c4895e80c1c368686e05f6c2a4"),
    ASSETS / "Scytale.eps": (85548, "e34c6fae11957f5ffde765fe73546c84e71fc81c8c3a0db6b39d4b681c3af780"),
    ASSETS / "eng_freq_hist.eps": (301732, "d06715934780939e1631f5743f35dfeb6b9c327d056c7f79f77c26c22b9b9199"),
    ASSETS / "samp_Cct_hist.eps": (92360, "2960ad2f0d3ee99be8e10352821ad5b72c9e5fa6ee976571a33df9f1d4e9c5d7"),
    ASSETS / "seadk_Cct.eps": (61214, "5819fa5143ba305eb2f7f9c41964739061ae762cbb6e2c5b092361053eddea7e"),
    ASSETS / "seadk_rkkrt.eps": (69918, "1bc7e601b694bb1d736cbd3275434005e1654d2639e0e36d0ea858a9bd7c7d1e"),
    ASSETS / "hamhip_freqs.eps": (101596, "dce37ecc01cd9d445b24ccd7e464063e59a2b3bc270ba1385e821968207d9c01"),
    ASSETS / "seadk_hamhip.eps": (51160, "e8e958d437d431451095d24eebbdd97f1b1f84579792678bdedb6588eeab1f82"),
}


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def run(command: list[str], cwd: Path, log_name: str, env: dict[str, str]) -> None:
    log_path = cwd / log_name
    with log_path.open("wb") as log:
        completed = subprocess.run(
            command,
            cwd=cwd,
            env=env,
            stdin=subprocess.DEVNULL,
            stdout=log,
            stderr=subprocess.STDOUT,
            check=False,
        )
    if completed.returncode != 0:
        raise SystemExit(
            f"command failed with exit code {completed.returncode}: "
            f"{command[0]} (see {log_path})"
        )


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("boundary", choices=sorted(CONFIGS))
    parser.add_argument("build_directory", type=Path)
    args = parser.parse_args()
    config = CONFIGS[args.boundary]
    source = config["source"]
    build_directory = args.build_directory
    if not build_directory.is_absolute():
        build_directory = ROOT / build_directory
    if build_directory.exists():
        raise SystemExit(f"fresh build directory already exists: {build_directory}")
    if source.stat().st_size != config["bytes"] or sha256(source) != config["sha256"]:
        raise SystemExit(f"review candidate {args.boundary} source drift")
    for path, (expected_bytes, expected_sha256) in BUILD_INPUTS.items():
        if not path.is_file() or path.stat().st_size != expected_bytes or sha256(path) != expected_sha256:
            raise SystemExit(f"required build input is missing or drifted: {path}")

    build_directory.mkdir(parents=True)
    shutil.copyfile(source, build_directory / "yaintt-id.tex")
    shutil.copyfile(REFS, build_directory / "refs.bib")
    env = os.environ.copy()
    env["TEXINPUTS"] = str(ASSETS) + os.pathsep + env.get("TEXINPUTS", "")
    latex_entry = (
        rf"\def\{config['macro']}{{}}"
        r"\def\boundarynine{}"
        r"\AtBeginDocument{"
        r"\let\RBoundaryMainmatter\mainmatter"
        r"\def\mainmatter{"
        r"\let\boundarynine\undefined"
        r"\RBoundaryMainmatter}}"
        r"\input{yaintt-id.tex}"
    )
    latex = [
        "latex",
        "--disable-installer",
        "-interaction=nonstopmode",
        "-halt-on-error",
        "-no-shell-escape",
        f"--job-name={config['job']}",
        latex_entry,
    ]
    run(latex, build_directory, "01-latex.stdout.log", env)
    run(["bibtex", "--disable-installer", config["job"]], build_directory, "02-bibtex.stdout.log", env)
    run(latex, build_directory, "03-latex.stdout.log", env)
    run(latex, build_directory, "04-latex.stdout.log", env)
    run(["makeindex", f"{config['job']}.idx"], build_directory, "05-makeindex.stdout.log", env)
    run(latex, build_directory, "06-latex.stdout.log", env)
    run(latex, build_directory, "07-latex-stabilize.stdout.log", env)
    run(["dvips", "-o", f"{config['job']}.ps", f"{config['job']}.dvi"], build_directory, "08-dvips.stdout.log", env)
    stage = build_directory / f"{config['job']}.stage.pdf"
    run(["ps2pdf", f"{config['job']}.ps", stage.name], build_directory, "09-ps2pdf.stdout.log", env)
    raw_pdf = build_directory / f"{config['job']}.pdf"
    shutil.copyfile(stage, raw_pdf)
    with pikepdf.Pdf.open(raw_pdf) as raw_check:
        observed_pages = len(raw_check.pages)
    normalized_pdf = build_directory / f"{config['job']}.normalized.pdf"
    run(
        [
            sys.executable,
            str(FINALIZER),
            str(raw_pdf),
            str(normalized_pdf),
            "--source-sha256",
            config["sha256"],
            "--boundary-id",
            config["boundary_id"],
            "--expected-pages",
            str(observed_pages),
        ],
        build_directory,
        "10-normalize.stdout.log",
        env,
    )
    copied_source = build_directory / "yaintt-id.tex"
    if copied_source.stat().st_size != config["bytes"] or sha256(copied_source) != config["sha256"]:
        raise SystemExit("build-local review candidate source drift")
    result = {
        "boundary": args.boundary,
        "build_directory": str(build_directory.relative_to(ROOT)).replace("\\", "/"),
        "pages": observed_pages,
        "raw_pdf_bytes": raw_pdf.stat().st_size,
        "raw_pdf_sha256": sha256(raw_pdf),
        "normalized_pdf_bytes": normalized_pdf.stat().st_size,
        "normalized_pdf_sha256": sha256(normalized_pdf),
        "source_sha256": sha256(copied_source),
    }
    print(json.dumps(result, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
