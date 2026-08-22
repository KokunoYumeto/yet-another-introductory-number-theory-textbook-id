#!/usr/bin/env python3
"""Normalize volatile Ghostscript metadata in an R014 PDF artifact."""

from __future__ import annotations

import argparse
import hashlib
import uuid
from pathlib import Path

import pikepdf


FIXED_INSTANT = "2014-05-07T17:04:00Z"
PDF_DATE = "D:20140507170400Z"
TITLE = "Satu Lagi Buku Teks Pengantar Teori Bilangan"
AUTHOR = "Jonathan A. Poritz; berdasarkan karya Wissam Raji"
SUBJECT = "Edisi bahasa Indonesia dengan penekanan pada kriptologi"
KEYWORDS = "teori bilangan, kriptologi, induksi matematika"
CREATOR = "LaTeX with hyperref"
PRODUCER = "dvips + MiKTeX GPL Ghostscript 9.25"


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("input", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--source-sha256", required=True)
    parser.add_argument("--boundary-id", default="boundary1")
    parser.add_argument("--expected-pages", type=int, default=15)
    args = parser.parse_args()

    if args.input.resolve() == args.output.resolve():
        raise SystemExit("input and output paths must differ")
    if len(args.source_sha256) != 64:
        raise SystemExit("source SHA-256 must contain 64 hexadecimal characters")
    int(args.source_sha256, 16)

    document_uuid = uuid.uuid5(
        uuid.NAMESPACE_URL,
        "https://poritz.net/jonathan/share/yaintt/|"
        f"{args.source_sha256}|id-ID|{args.boundary_id}",
    )
    stable_id = f"urn:uuid:{document_uuid}"

    with pikepdf.Pdf.open(args.input) as pdf:
        if len(pdf.pages) != args.expected_pages:
            raise SystemExit(
                f"expected {args.expected_pages} pages, observed {len(pdf.pages)}"
            )
        if "/Metadata" in pdf.Root:
            del pdf.Root.Metadata
        with pdf.open_metadata(
            set_pikepdf_as_editor=False,
            update_docinfo=False,
        ) as metadata:
            metadata["dc:title"] = TITLE
            metadata["dc:creator"] = [AUTHOR]
            metadata["dc:description"] = SUBJECT
            metadata["pdf:Keywords"] = KEYWORDS
            metadata["pdf:Producer"] = PRODUCER
            metadata["xmp:CreatorTool"] = CREATOR
            metadata["xmp:CreateDate"] = FIXED_INSTANT
            metadata["xmp:ModifyDate"] = FIXED_INSTANT
            metadata["xmp:MetadataDate"] = FIXED_INSTANT
            metadata["xmpMM:DocumentID"] = stable_id
            metadata["xmpMM:InstanceID"] = stable_id

        info = pdf.docinfo
        info["/Title"] = TITLE
        info["/Author"] = AUTHOR
        info["/Subject"] = SUBJECT
        info["/Keywords"] = KEYWORDS
        info["/Creator"] = CREATOR
        info["/Producer"] = PRODUCER
        info["/CreationDate"] = PDF_DATE
        info["/ModDate"] = PDF_DATE
        pdf.Root.Lang = pikepdf.String("id-ID")
        stable_file_id = bytes.fromhex(args.source_sha256[:32])
        pdf.trailer.ID = pikepdf.Array(
            [pikepdf.String(stable_file_id), pikepdf.String(stable_file_id)]
        )

        args.output.parent.mkdir(parents=True, exist_ok=True)
        pdf.save(
            args.output,
            deterministic_id=True,
            force_version="1.4",
            object_stream_mode=pikepdf.ObjectStreamMode.preserve,
            preserve_pdfa=True,
        )

    with pikepdf.Pdf.open(args.output) as check:
        if len(check.pages) != args.expected_pages or str(check.Root.Lang) != "id-ID":
            raise SystemExit("normalized PDF failed page-count or language verification")
        if str(check.docinfo.get("/CreationDate")) != PDF_DATE:
            raise SystemExit("normalized PDF has an unexpected creation date")

    print(
        f"{args.output}\t{args.output.stat().st_size}\t{sha256(args.output)}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
