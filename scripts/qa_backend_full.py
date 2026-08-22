#!/usr/bin/env python3
"""Independent QA for the complete reviewed R014 modular backend.

This validator checks the schema and every reference/locator, preserves the
Boundary-11 public-record prefix byte-for-byte, proves the final terminology,
correction, exercise, rights and pending-build closures, and compares all 15
CSV projections with the XLSX cell matrices without using an Excel editor.
"""

from __future__ import annotations

import argparse
import copy
import csv
import hashlib
import json
import re
import zipfile
from collections import Counter
from datetime import datetime, timedelta, timezone
from pathlib import Path
from xml.etree import ElementTree as ET

from jsonschema import Draft202012Validator, FormatChecker
from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_BACKEND = ROOT / "backend"
DEFAULT_PREVIEWS = ROOT / "qa" / "backend-previews"
DEFAULT_RECEIPT = ROOT / "qa" / "BACKEND_QA.json"
DETERMINISM = ROOT / "qa" / "BACKEND_DETERMINISM.json"
TARGET_REL = "qa/review-candidates/boundary28-r2/yaintt-id.tex"
CANONICAL_TARGET_REL = "qa/frozen-boundaries/boundary28-final/yaintt-id.tex"
LEDGER_REL = "qa/review-candidates/boundary28-r2/ADVERSE_LEDGER.md"
TERMINOLOGY_REL = "qa/review-candidates/boundary28-r2/TERMINOLOGY.md"
TARGET_SHA = "b1dd2926dc8bfdb84c6a3b4605490a8d96b14c44d89653867160d701fa0f17db"
LEDGER_SHA = "dd4de4ca603dc1bf67b635bce3199fcdbf6bcacbc3b8d3736350b5a825a00f57"
TERMINOLOGY_SHA = "3e3fe31baa8565bbc54cd6d789570cac18ed469f68cf683f08dd639ef92d9bd1"
RECORDS_SHA = "e2c4374c37fbc0d45c2d029b7b734b7774a78f5a66caeb66d19d1a7bb97509d0"
B28R2_RECORDS_SHA = "18764193b4579196c2b02549ff592da0f04e4c0c4194cf6da5294ff11bbb6fa7"
B11_RECORDS_SHA = "3fe63938cec0aaeb8cc31ec4590af077377c758b3585cea4049b433542086a7c"
EXPECTED_COUNTS = {
    "artifact": 105, "asset": 14, "concept": 223, "correction": 141,
    "course": 1, "edition": 12, "program": 1, "qa_event": 131,
    "relation": 3297, "resource": 1, "rights": 15, "segment": 544,
    "term": 239, "unit": 548,
}
CANONICAL_GATES = {
    20: ("qa/BOUNDARY20_BUILD.json", "9a01263fce5b1d6b8d554f6a3e9639271a9ba0f333a32f382cc05abeed0e529b", "qa/BOUNDARY20_VISUAL.json", "15cdba4c28c6b3fa16000fb6a77e861042f580ad1e7d21771978e6a09cadef6a", "output/YAINTT_ID_BOUNDARY20.pdf", 753084, "b17e142502288b08eaca055060d412d7fd3cdf4c246de9b1582adc8e09e0fdfe", 103),
    21: ("qa/BOUNDARY21_BUILD.json", "fc788f9a50c3de71f41cd5a59a39c885fd3c4518afd8ce21b107c030dc2b1a37", "qa/BOUNDARY21_VISUAL.json", "395890557f499fbaea49e0ce35a76e5e74b0d72cffb684ba64deb2df2ab17f5e", "output/YAINTT_ID_BOUNDARY21.pdf", 777400, "bb9ad104576e4b61b54e55451d526f94be2399fb53352f105754b12177aa2046", 107),
    22: ("qa/BOUNDARY22_BUILD.json", "916bceebc4ec9649ef4ae48856c7a70fdf997b5772446ef5b501cb6bd71bb1dc", "qa/BOUNDARY22_VISUAL.json", "bc7f4b8445b638b44f3fb62bb13fb6729e36218662f98d43cc8e6a040ee82ea5", "output/YAINTT_ID_BOUNDARY22.pdf", 791075, "27536429f962e5af3321cdad6a00a12ced0031f37845f4bad4cfb6125c2bfac9", 111),
    23: ("qa/BOUNDARY23_BUILD.json", "6b628803fce21b4d0e7530f7ab6001a88658736f943e00571e167c5d892f15dd", "qa/BOUNDARY23_VISUAL.json", "4b95d52d82f3c578f1f51827860b60a6527e751c41ba49b998d7dc4368b9dedc", "output/YAINTT_ID_BOUNDARY23.pdf", 816756, "719fe1592c8a1748b1dc7bf1cae8f10fe00d249a59f7843739e745a1e84c68b9", 114),
    24: ("qa/BOUNDARY24_BUILD.json", "5b2beb56139c56cd58a753fd8a11e7a1f55989be284443092065dac23ae3a235", "qa/BOUNDARY24_VISUAL.json", "776ff1f8e179ac0c5269b5da8ee35b7eae803d2d9dc8d770d304e2f023aaade2", "output/YAINTT_ID_BOUNDARY24.pdf", 832452, "8815a9a16c19529cfa505be8c1dcdf8a2319d7010d56e636c170a16179b0024f", 118),
    25: ("qa/BOUNDARY25_BUILD.json", "ced14aa2fff399d8c9b2c972c15c3e369c032b8b5e907a722894004003d5da6d", "qa/BOUNDARY25_VISUAL.json", "0e72412cbdef3d11e358ffa1fcdf82862d940ef2a74bc84852432bba2f18c71b", "output/YAINTT_ID_BOUNDARY25.pdf", 874882, "95dde8dbd45dcfdf7580d5a81672a137ec7275ff4cb1a40435c128f6caa6c154", 124),
    26: ("qa/BOUNDARY26_BUILD.json", "9c53a68af6d0a6b26144da5d1c8a46cffd297bff8f75e73421da1cee4c96bd21", "qa/BOUNDARY26_VISUAL.json", "07162fb087693d5b2aad108bacf2d8835a05584452d3e4987b329c3aadd922b3", "output/YAINTT_ID_BOUNDARY26.pdf", 899343, "28f497d2cdfee61c85b37a62873184f5a2348f73c1daef7ac7c56d10dc2dd169", 128),
    27: ("qa/BOUNDARY27_BUILD.json", "f2df52416545380a8347c96e895d2bc6dbb85d7a7d3ba7cd19c1341db78d24d7", "qa/BOUNDARY27_VISUAL.json", "e089c64c0b67a63fdc9c53fac63b499e768ca3aeb1e642bb53ab707f0cc8b24b", "output/YAINTT_ID_BOUNDARY27.pdf", 934433, "1fb63e1d1bd1643f5a2296b2e36b7503348ac21f307f502d912fcc2b3bcfeccf", 132),
    28: ("qa/FINAL_BUILD.json", "d112b48de7032c2eda809419eadaaafdec089c8b6c5886db8501ab226c8123e2", "qa/FINAL_VISUAL.json", "4d69b0335cb59477117209ba2c62347afc758c73d9bde9a19c6b25df10851292", "output/YAINTT_ID.pdf", 962527, "1ded3c6844b656347259b464bf21526fdc32dc2246c73ac58ab76ed28688eefc", 138),
}
SHEETS = [
    "program", "course", "resource", "edition", "unit", "concept",
    "segment", "term", "asset", "relation", "rights", "qa_event",
    "artifact", "correction", "assessments",
]
FINAL_TAIL_PREVIEWS = [
    "edition-final-tail.png", "unit-final-tail.png", "concept-final-tail.png",
    "segment-final-tail.png", "term-final-tail.png", "relation-final-tail.png",
    "qa_event-final-tail.png", "artifact-final-tail.png",
    "correction-final-tail.png", "assessments-final-tail.png",
]
NS = {"x": "http://schemas.openxmlformats.org/spreadsheetml/2006/main",
      "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
      "p": "http://schemas.openxmlformats.org/package/2006/relationships"}


def fail(message: str) -> None:
    raise AssertionError(message)


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for block in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def sha256_bytes(value: bytes) -> str:
    return hashlib.sha256(value).hexdigest()


def root_file(relative: str) -> Path:
    # Rebuild from POSIX components to reject drive/parent escapes
    # deterministically on every host.
    path = ROOT.joinpath(*Path(relative.replace("\\", "/")).parts).resolve()
    if not path.is_relative_to(ROOT.resolve()) or not path.is_file():
        fail(f"missing or escaping evidence path: {relative}")
    return path


def line_span(relative: str, start: int, end: int, cache: dict[str, list[bytes]]) -> bytes:
    if relative not in cache:
        cache[relative] = root_file(relative).read_bytes().splitlines(keepends=True)
    lines = cache[relative]
    if start < 1 or end < start or end > len(lines):
        fail(f"invalid locator {relative}:{start}-{end} of {len(lines)}")
    return b"".join(lines[start - 1:end])


def load_records(path: Path) -> tuple[list[dict], list[bytes]]:
    raw_lines = path.read_bytes().splitlines()
    try:
        records = [json.loads(line.decode("utf-8")) for line in raw_lines]
    except Exception as exc:
        fail(f"records.jsonl is not strict UTF-8 JSONL: {exc}")
    return records, raw_lines


def validate_schemas(backend: Path, catalog: dict, records: list[dict]) -> None:
    record_schema = json.loads((backend / "schemas" / "record.schema.json").read_text(encoding="utf-8"))
    catalog_schema = json.loads((backend / "schemas" / "catalog.schema.json").read_text(encoding="utf-8"))
    record_validator = Draft202012Validator(record_schema, format_checker=FormatChecker())
    errors = []
    for index, record in enumerate(records):
        for error in record_validator.iter_errors(record):
            errors.append(f"record {index + 1} {record.get('record_id')}: {error.message}")
            if len(errors) >= 20:
                break
        if len(errors) >= 20:
            break
    if errors:
        fail("record schema errors: " + " | ".join(errors))
    expanded = copy.deepcopy(catalog_schema)
    expanded["properties"]["records"]["items"] = record_schema
    catalog_errors = list(Draft202012Validator(expanded, format_checker=FormatChecker()).iter_errors(catalog))
    if catalog_errors:
        fail("catalog schema errors: " + " | ".join(error.message for error in catalog_errors[:20]))


def validate_manifest(backend: Path, manifest: dict) -> dict[str, dict]:
    listed = {item["path"]: item for item in manifest["files"]}
    actual = {
        path.relative_to(backend).as_posix(): path
        for path in backend.rglob("*") if path.is_file() and path.name not in ("MANIFEST.json", "MANIFEST.sha256")
    }
    manifest_digest_path = backend / "MANIFEST.sha256"
    if manifest_digest_path.read_text(encoding="ascii").split()[0] != sha256(backend / "MANIFEST.json"):
        fail("MANIFEST.sha256 does not bind MANIFEST.json")
    if set(listed) != set(actual):
        fail(f"manifest inventory mismatch: missing={sorted(set(actual)-set(listed))}, extra={sorted(set(listed)-set(actual))}")
    for relative, item in listed.items():
        path = actual[relative]
        if path.stat().st_size != item["bytes"] or sha256(path) != item["sha256"]:
            fail(f"manifest identity mismatch: {relative}")
    return listed


def validate_references(records: list[dict]) -> dict[str, dict]:
    by_id = {record["record_id"]: record for record in records}
    if len(by_id) != len(records):
        fail("duplicate public record_id")
    scalar_fields = (
        "resource_id", "edition_id", "supersedes", "rights_id", "source_edition_id",
        "parent_unit_id", "unit_id", "concept_id", "build_receipt_id",
    )
    array_fields = (
        "course_ids", "resource_ids", "file_ids", "prerequisite_concept_ids",
        "qa_event_ids", "witness_ids", "dependency_ids", "affected_unit_ids",
    )
    for record in records:
        for field in scalar_fields:
            value = record.get(field)
            if isinstance(value, str) and (value.startswith("ttp.") or value.startswith("rights.")) and value not in by_id:
                fail(f"dangling {field} on {record['record_id']}: {value}")
        for field in array_fields:
            for value in record.get(field, []) or []:
                if isinstance(value, str) and (value.startswith("ttp.") or value.startswith("rights.")) and value not in by_id:
                    fail(f"dangling {field} on {record['record_id']}: {value}")
        if record["entity_class"] == "relation":
            for field in ("subject_id", "object_id"):
                if record[field] not in by_id:
                    fail(f"dangling relation endpoint {record['record_id']}.{field}: {record[field]}")
    return by_id


def validate_locators(records: list[dict]) -> int:
    cache: dict[str, list[bytes]] = {}
    checked = 0
    for record in records:
        for prefix in ("source", "target"):
            locator = record.get(f"{prefix}_locator")
            expected = record.get(f"{prefix}_content_sha256")
            if locator is None and expected is None:
                continue
            if locator is None and isinstance(expected, str):
                text_field = record.get(f"{prefix}_text")
                if not isinstance(text_field, str) or sha256_bytes(text_field.encode("utf-8")) != expected:
                    fail(f"unlocated {prefix} text/hash mismatch on {record['record_id']}")
                continue
            if not isinstance(locator, dict) or not isinstance(expected, str):
                fail(f"incomplete {prefix} locator/hash pair on {record['record_id']}")
            span = line_span(locator["path"], locator["start_line"], locator["end_line"], cache)
            if sha256_bytes(span) != expected:
                fail(f"{prefix} locator hash mismatch on {record['record_id']}")
            text_field = record.get(f"{prefix}_text")
            if text_field is not None and span.decode("utf-8") != text_field:
                fail(f"{prefix} locator text mismatch on {record['record_id']}")
            checked += 1
        if record["entity_class"] == "segment":
            expressions = record.get("expressions", [])
            if len(expressions) not in (1, 2):
                fail(f"invalid expression count on {record['record_id']}")
            for expression in expressions:
                if sha256_bytes(expression["text_latex"].encode("utf-8")) != expression["content_sha256"]:
                    fail(f"expression hash mismatch on {expression['expression_id']}")
            source = next((item for item in expressions if item["expression_id"] == record["source_expression_id"]), None)
            target = next((item for item in expressions if item["expression_id"] == record["target_expression_id"]), None)
            if source and (source["text_latex"] != record["source_text"] or source["content_sha256"] != record["source_content_sha256"]):
                fail(f"source expression linkage mismatch on {record['record_id']}")
            if target and (target["text_latex"] != record["target_text"] or target["content_sha256"] != record["target_content_sha256"]):
                fail(f"target expression linkage mismatch on {record['record_id']}")
    return checked


def validate_artifacts(records: list[dict]) -> int:
    checked = 0
    for record in records:
        if record["entity_class"] not in ("artifact", "asset"):
            continue
        file_manifest = record.get("file_manifest")
        if file_manifest:
            lines = []
            total_bytes = 0
            for item in file_manifest:
                member = root_file(item["path"])
                if member.stat().st_size != item["bytes"] or sha256(member) != item["sha256"]:
                    fail(f"artifact bundle member identity mismatch: {record['record_id']} -> {item['path']}")
                total_bytes += item["bytes"]
                lines.append(f"{item['path']}\t{item['bytes']}\t{item['sha256']}\n")
            if total_bytes != record["bytes"] or sha256_bytes("".join(lines).encode("utf-8")) != record["sha256"]:
                fail(f"artifact bundle aggregate mismatch: {record['record_id']}")
            checked += 1
            continue
        path_value = record.get("path")
        if not isinstance(path_value, str):
            fail(f"missing file path on {record['record_id']}")
        path = root_file(path_value)
        if path.stat().st_size != record["bytes"] or sha256(path) != record["sha256"]:
            fail(f"artifact/asset byte identity mismatch: {record['record_id']}")
        checked += 1
    return checked


def parse_terminology() -> list[tuple[str, str, str]]:
    rows = []
    for line in root_file(TERMINOLOGY_REL).read_text(encoding="utf-8").splitlines():
        if not re.match(r"^\| [a-z][a-z0-9_]*\.[a-z0-9_]+ \|", line):
            continue
        cells = [cell.strip() for cell in line.strip().strip("|").split("|")]
        if len(cells) != 4:
            fail(f"malformed terminology row: {line}")
        rows.append((cells[0], cells[1], cells[2]))
    if len(rows) != 216 or len({row[0] for row in rows}) != 216:
        fail(f"authoritative terminology closure drift: {len(rows)}")
    return rows


def validate_semantics(records: list[dict], by_id: dict[str, dict]) -> dict[str, int]:
    reviewed_edition = by_id.get("ttp.r014.edition.id-id.boundary28-r2")
    if not reviewed_edition or reviewed_edition.get("translation_state") != "language_reviewed" or reviewed_edition.get("translated_through") != "sec:tEGC":
        fail("final reviewed edition identity/state missing")
    if reviewed_edition.get("file_ids") != [
        "ttp.r014.artifact.target-source.boundary28-r2",
        "ttp.r014.artifact.adverse-ledger.boundary28-r2",
        "ttp.r014.artifact.terminology.boundary28-r2",
    ]:
        fail("reviewed edition file closure drift")

    final_edition = by_id.get("ttp.r014.edition.id-id.boundary28-final")
    if (not final_edition or final_edition.get("translation_state") != "visually_checked"
            or final_edition.get("supersedes") != reviewed_edition["record_id"]
            or final_edition.get("translated_through") != "sec:tEGC"):
        fail("canonical built/visually-checked edition identity/state missing")
    expected_final_files = {"ttp.r014.artifact.target-source.boundary28-final"}
    for number in range(20, 29):
        expected_final_files.update({
            f"ttp.r014.artifact.boundary{number}-pdf-canonical",
            f"ttp.r014.artifact.boundary{number}-build-receipt-canonical",
            f"ttp.r014.artifact.boundary{number}-visual-receipt-canonical",
        })
    if set(final_edition.get("file_ids", [])) != expected_final_files or len(final_edition.get("file_ids", [])) != 28:
        fail("canonical reader edition file closure drift")

    final_units = [record for record in records if record["entity_class"] == "unit" and record.get("edition_id") == reviewed_edition["record_id"]]
    final_segments = [record for record in records if record["entity_class"] == "segment" and record.get("edition_id") == reviewed_edition["record_id"]]
    if len(final_units) != 298 or len(final_segments) != 298:
        fail(f"final unit/segment closure drift: {len(final_units)}/{len(final_segments)}")
    if any(record["target_locator"]["path"] != TARGET_REL or record["translation_state"] != "language_reviewed" for record in final_units + final_segments):
        fail("final unit/segment target lineage drift")
    unit_types = Counter(record["unit_type"] for record in final_units)
    if unit_types["exercise"] != 43 or unit_types["exercise_group"] != 14:
        fail(f"final exercise topology drift: {dict(unit_types)}")
    if len(unit_types) < 10:
        fail(f"semantic environment diversity unexpectedly low: {dict(unit_types)}")

    exercises = [record for record in records if record["entity_class"] == "unit" and record.get("unit_type") == "exercise"]
    if len(exercises) != 101:
        fail(f"complete exercise count drift: {len(exercises)}")
    for exercise in exercises:
        closure = exercise.get("assessment_closure")
        if closure != {"answers": [], "hints": [], "solutions": [], "status": "source_has_none"}:
            fail(f"exercise solution closure drift: {exercise['record_id']}")

    terminology = parse_terminology()
    terms = [record for record in records if record["entity_class"] == "term"]
    term_evidence = {}
    for term_id, source, target in terminology:
        expected_concept = f"ttp.concept.{term_id.split('.', 1)[1]}"
        matches = [record for record in terms if record.get("concept_id") == expected_concept and record["source_term"] == source and record["target_term"] == target]
        if len(matches) != 1:
            fail(f"terminology mapping coverage drift: {term_id} ({len(matches)} matches)")
        record = matches[0]
        evidence_id = record.get("evidence", {}).get("terminology_id") if isinstance(record.get("evidence"), dict) else None
        if evidence_id:
            if evidence_id != term_id:
                fail(f"terminology evidence id drift: {term_id} -> {evidence_id}")
            term_evidence[term_id] = record
        if by_id.get(record["concept_id"], {}).get("entity_class") != "concept":
            fail(f"terminology concept linkage drift: {term_id}")
    if len(term_evidence) != 142:
        fail(f"new authoritative terminology evidence count drift: {len(term_evidence)}")

    ledger_text = root_file(LEDGER_REL).read_text(encoding="utf-8")
    ledger_ids = re.findall(r"^## (R014-ADV-(\d{4}))\b", ledger_text, re.MULTILINE)
    if [int(number) for _, number in ledger_ids] != list(range(1, 142)):
        fail("authoritative adverse-ledger sequence drift")
    corrections = [record for record in records if record["entity_class"] == "correction"]
    if [record["record_id"] for record in corrections] != [f"ttp.r014.correction.{number:04d}" for number in range(1, 142)]:
        fail("correction record sequence drift")
    for number in range(46, 142):
        correction = by_id[f"ttp.r014.correction.{number:04d}"]
        if correction["evidence"].get("ledger_id") != f"R014-ADV-{number:04d}" or correction.get("report_status") != "not_sent":
            fail(f"final correction evidence/report state drift: {number}")

    for number in range(25, 29):
        event = by_id.get(f"ttp.r014.qa.boundary{number}-build-pending")
        if not event or event.get("qa_type") != "build" or event.get("result") != "pending" or event.get("evidence", {}).get("target_sha256") != TARGET_SHA:
            fail(f"historical pending-build event missing for Boundary {number}")
    source_artifact = by_id.get("ttp.r014.artifact.target-source.boundary28-final")
    if (not source_artifact or source_artifact.get("path") != CANONICAL_TARGET_REL
            or source_artifact.get("bytes") != 269464 or source_artifact.get("sha256") != TARGET_SHA):
        fail("canonical frozen source artifact drift")
    for number, gate in CANONICAL_GATES.items():
        build_path, build_sha, visual_path, visual_sha, pdf_path, pdf_bytes, pdf_sha, pages = gate
        build_event = by_id.get(f"ttp.r014.qa.boundary{number}-build-canonical")
        visual_event = by_id.get(f"ttp.r014.qa.boundary{number}-visual-canonical")
        expected_prior_build = f"ttp.r014.qa.boundary{number}-build-evidence" if number <= 24 else f"ttp.r014.qa.boundary{number}-build-pending"
        expected_prior_visual = f"ttp.r014.qa.boundary{number}-visual-evidence" if number <= 24 else None
        if (not build_event or build_event.get("qa_type") != "build" or build_event.get("result") != "pass"
                or build_event.get("supersedes") != expected_prior_build
                or build_event.get("evidence", {}).get("path") != build_path
                or build_event.get("evidence", {}).get("sha256") != build_sha
                or build_event.get("evidence", {}).get("pdf_sha256") != pdf_sha
                or build_event.get("evidence", {}).get("pages") != pages):
            fail(f"canonical build event drift at Boundary {number}")
        if (not visual_event or visual_event.get("qa_type") != "visual" or visual_event.get("result") != "pass"
                or visual_event.get("supersedes") != expected_prior_visual
                or visual_event.get("evidence", {}).get("path") != visual_path
                or visual_event.get("evidence", {}).get("sha256") != visual_sha
                or visual_event.get("evidence", {}).get("pdf_sha256") != pdf_sha
                or visual_event.get("evidence", {}).get("pages") != pages):
            fail(f"canonical visual event drift at Boundary {number}")
        pdf_artifact = by_id.get(f"ttp.r014.artifact.boundary{number}-pdf-canonical")
        if (not pdf_artifact or pdf_artifact.get("path") != pdf_path or pdf_artifact.get("bytes") != pdf_bytes
                or pdf_artifact.get("sha256") != pdf_sha or pdf_artifact.get("pages") != pages):
            fail(f"canonical PDF artifact drift at Boundary {number}")

    predicates = Counter(record["predicate"] for record in records if record["entity_class"] == "relation")
    for required in ("contains", "precedes", "covers", "exercises", "proves", "illustrates", "references", "prerequisite_for", "corrects", "translates", "adapts", "supersedes", "depends_on"):
        if predicates[required] == 0:
            fail(f"missing required relation predicate: {required}")
    final_relations = [record for record in records if record["entity_class"] == "relation" and record["subject_id"] == final_edition["record_id"]]
    if not {record["predicate"] for record in final_relations}.issuperset({"contains", "translates", "adapts", "supersedes", "depends_on"}):
        fail("final edition provenance/dependency relation closure drift")
    if sum(record["predicate"] == "contains" for record in final_relations) != 28:
        fail("canonical edition/artifact containment closure drift")

    final_rights = by_id.get("rights.yaintt.id-id.derivative.boundary28-r2")
    if (not final_rights or "CC BY-SA 4.0" not in final_rights.get("license", "")
            or "unresolved by-sa.eps remains excluded" not in final_rights.get("rights_status", "")):
        fail("final component-rights closure drift")
    return {
        "final_units": len(final_units), "final_segments": len(final_segments),
        "exercises": len(exercises), "terminology_rows": len(terminology),
        "corrections": len(corrections), "relation_predicates": len(predicates),
        "canonical_build_events": len(CANONICAL_GATES), "canonical_visual_events": len(CANONICAL_GATES),
    }


def column_index(reference: str) -> int:
    letters = re.match(r"[A-Z]+", reference)
    if not letters:
        fail(f"invalid XLSX cell reference: {reference}")
    value = 0
    for char in letters.group(0):
        value = value * 26 + ord(char) - 64
    return value - 1


def xlsx_matrices(path: Path) -> tuple[list[str], dict[str, list[list[str]]], int]:
    formula_count = 0
    with zipfile.ZipFile(path) as archive:
        workbook = ET.fromstring(archive.read("xl/workbook.xml"))
        relationships = ET.fromstring(archive.read("xl/_rels/workbook.xml.rels"))
        rel_targets = {item.attrib["Id"]: item.attrib["Target"].lstrip("/") for item in relationships}
        shared = []
        if "xl/sharedStrings.xml" in archive.namelist():
            shared_root = ET.fromstring(archive.read("xl/sharedStrings.xml"))
            for item in shared_root.findall("x:si", NS):
                shared.append("".join(node.text or "" for node in item.iterfind(".//x:t", NS)))
        names, matrices = [], {}
        for sheet in workbook.findall("x:sheets/x:sheet", NS):
            name = sheet.attrib["name"]
            names.append(name)
            target = rel_targets[sheet.attrib[f"{{{NS['r']}}}id"]]
            root = ET.fromstring(archive.read(target))
            formula_count += len(root.findall(".//x:f", NS))
            rows = []
            for row in root.findall("x:sheetData/x:row", NS):
                cells: dict[int, str] = {}
                for cell in row.findall("x:c", NS):
                    index = column_index(cell.attrib["r"])
                    kind = cell.attrib.get("t")
                    value_node = cell.find("x:v", NS)
                    value = "" if value_node is None else value_node.text or ""
                    if kind == "s" and value:
                        value = shared[int(value)]
                    elif kind == "inlineStr":
                        value = "".join(node.text or "" for node in cell.iterfind(".//x:t", NS))
                    elif kind == "b":
                        value = "TRUE" if value == "1" else "FALSE"
                    cells[index] = value
                width = max(cells, default=-1) + 1
                rows.append([cells.get(index, "") for index in range(width)])
            matrices[name] = rows
        xml_text = b"".join(archive.read(name) for name in archive.namelist() if name.endswith(".xml"))
        if any(error.encode("ascii") in xml_text for error in ("#REF!", "#DIV/0!", "#VALUE!", "#NAME?", "#N/A")):
            fail("formula/error token detected in workbook XML")
    return names, matrices, formula_count


def validate_csv_xlsx(backend: Path) -> dict[str, int]:
    exports = backend / "exports"
    csv_files = sorted(path.stem for path in exports.glob("*.csv"))
    if sorted(SHEETS) != csv_files:
        fail(f"15-CSV projection set drift: {csv_files}")
    workbook_path = exports / "R014_MODULAR_BACKEND.xlsx"
    names, matrices, formula_count = xlsx_matrices(workbook_path)
    if names != SHEETS:
        fail(f"XLSX sheet order drift: {names}")
    if formula_count:
        fail(f"unexpected formulas in backend workbook: {formula_count}")
    row_counts = {}
    for sheet in SHEETS:
        with (exports / f"{sheet}.csv").open("r", encoding="utf-8-sig", newline="") as stream:
            csv_rows = list(csv.reader(stream))
        xlsx_rows = matrices[sheet]
        if csv_rows and xlsx_rows:
            date_columns = {index for index, header in enumerate(csv_rows[0]) if header in {
                "created_at", "declared_timestamp", "event_timestamp", "retrieved_utc", "server_last_modified",
            }}
            for row_index in range(1, min(len(csv_rows), len(xlsx_rows))):
                for column in range(min(len(csv_rows[row_index]), len(xlsx_rows[row_index]))):
                    if csv_rows[row_index][column] in ("true", "false") and xlsx_rows[row_index][column] == csv_rows[row_index][column].upper():
                        xlsx_rows[row_index][column] = csv_rows[row_index][column]
                for column in date_columns:
                    if column >= len(csv_rows[row_index]) or column >= len(xlsx_rows[row_index]):
                        continue
                    expected = csv_rows[row_index][column]
                    observed = xlsx_rows[row_index][column]
                    if expected and re.fullmatch(r"-?\d+(?:\.\d+)?", observed or ""):
                        converted = datetime(1899, 12, 30) + timedelta(days=float(observed))
                        expected_datetime = datetime.fromisoformat(expected.replace("Z", "+00:00"))
                        expected_utc = expected_datetime.astimezone(timezone.utc).replace(tzinfo=None, microsecond=0)
                        if converted.replace(microsecond=0) == expected_utc:
                            xlsx_rows[row_index][column] = expected
        if csv_rows != xlsx_rows:
            for index, (left, right) in enumerate(zip(csv_rows, xlsx_rows), 1):
                if left != right:
                    fail(f"CSV/XLSX mismatch on {sheet} row {index}: {left!r} != {right!r}")
            fail(f"CSV/XLSX row-count mismatch on {sheet}: {len(csv_rows)} != {len(xlsx_rows)}")
        if any(len(cell) > 32767 for row in csv_rows for cell in row):
            fail(f"Excel cell character limit exceeded on {sheet}")
        row_counts[sheet] = len(csv_rows) - 1
    for entity in SHEETS[:-1]:
        if row_counts[entity] != EXPECTED_COUNTS[entity] and entity != "segment":
            fail(f"CSV row count drift on {entity}: {row_counts[entity]}")
    if row_counts["assessments"] != 101:
        fail(f"assessment projection row-count drift: {row_counts['assessments']}")
    if row_counts["segment"] <= EXPECTED_COUNTS["segment"]:
        fail("segment expression projection was not exploded")
    return row_counts


def validate_previews(previews: Path) -> dict[str, list[int]]:
    required = [f"{sheet}.png" for sheet in SHEETS] + FINAL_TAIL_PREVIEWS
    dimensions = {}
    for name in required:
        path = previews / name
        if not path.is_file() or path.stat().st_size == 0:
            fail(f"missing spreadsheet render preview: {path}")
        with Image.open(path) as image:
            image.verify()
        with Image.open(path) as image:
            width, height = image.size
        if width < 200 or height < 60:
            fail(f"implausible spreadsheet render dimensions: {name} {width}x{height}")
        dimensions[name] = [width, height]
    return dimensions


def validate_b11_prefix(backend: Path, records: list[dict], raw_lines: list[bytes]) -> None:
    evidence = backend / "evidence" / "B11_RECORD_OBJECT_HASHES.tsv"
    expected = {}
    for line in evidence.read_text(encoding="utf-8").splitlines():
        record_id, digest = line.split("\t")
        expected[record_id] = digest
    if len(expected) != 2417:
        fail(f"Boundary-11 public-record hash inventory drift: {len(expected)}")
    observed = {record["record_id"]: sha256_bytes(raw) for record, raw in zip(records, raw_lines) if record["record_id"] in expected}
    if observed != expected:
        differing = sorted(key for key in expected if observed.get(key) != expected[key])
        fail(f"Boundary-11 public record drift: {differing[:20]}")


def validate_b28r2_prefix(backend: Path, records: list[dict], raw_lines: list[bytes]) -> None:
    evidence = backend / "evidence" / "BOUNDARY28_R2_RECORD_OBJECT_HASHES.tsv"
    expected = {}
    for line in evidence.read_text(encoding="utf-8").splitlines():
        record_id, digest = line.split("\t")
        expected[record_id] = digest
    if len(expected) != 5180:
        fail(f"Boundary-28-r2 admitted-record hash inventory drift: {len(expected)}")
    observed = {record["record_id"]: sha256_bytes(raw) for record, raw in zip(records, raw_lines) if record["record_id"] in expected}
    if observed != expected:
        differing = sorted(key for key in expected if observed.get(key) != expected[key])
        fail(f"Boundary-28-r2 admitted record drift: {differing[:20]}")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--backend", type=Path, default=DEFAULT_BACKEND)
    parser.add_argument("--previews", type=Path, default=DEFAULT_PREVIEWS)
    parser.add_argument("--receipt", type=Path, default=DEFAULT_RECEIPT)
    parser.add_argument("--skip-determinism", action="store_true")
    args = parser.parse_args()
    backend = args.backend.resolve()
    previews = args.previews.resolve()
    receipt = args.receipt.resolve()

    records_path = backend / "records.jsonl"
    catalog_path = backend / "catalog.json"
    manifest_path = backend / "MANIFEST.json"
    if records_path.stat().st_size != 5_656_786 or sha256(records_path) != RECORDS_SHA:
        fail("final records.jsonl byte identity drift")
    if root_file(CANONICAL_TARGET_REL).stat().st_size != 269_464 or sha256(root_file(CANONICAL_TARGET_REL)) != TARGET_SHA:
        fail("final canonical frozen target identity drift")
    if sha256(root_file(TARGET_REL)) != TARGET_SHA:
        fail("reviewed target lineage drift")
    if sha256(root_file(LEDGER_REL)) != LEDGER_SHA or sha256(root_file(TERMINOLOGY_REL)) != TERMINOLOGY_SHA:
        fail("authoritative final sidecar identity drift")
    if not args.skip_determinism:
        determinism = json.loads(DETERMINISM.read_text(encoding="utf-8"))
        if determinism.get("result") != "pass" or determinism.get("final_records", {}).get("sha256") != RECORDS_SHA:
            fail("complete-backend determinism receipt is absent or stale")

    records, raw_lines = load_records(records_path)
    catalog = json.loads(catalog_path.read_text(encoding="utf-8"))
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    if len(records) != 5272 or catalog["records"] != records:
        fail("catalog/JSONL record identity drift")
    counts = dict(sorted(Counter(record["entity_class"] for record in records).items()))
    if counts != EXPECTED_COUNTS or catalog.get("record_counts") != EXPECTED_COUNTS or manifest.get("record_counts") != EXPECTED_COUNTS:
        fail(f"record-count drift: {counts}")
    if catalog.get("target_sha256") != TARGET_SHA or manifest.get("target_sha256") != TARGET_SHA:
        fail("catalog/manifest final target drift")

    validate_schemas(backend, catalog, records)
    manifest_files = validate_manifest(backend, manifest)
    by_id = validate_references(records)
    locator_count = validate_locators(records)
    artifact_count = validate_artifacts(records)
    semantics = validate_semantics(records, by_id)
    validate_b11_prefix(backend, records, raw_lines)
    validate_b28r2_prefix(backend, records, raw_lines)
    csv_rows = validate_csv_xlsx(backend)
    preview_dimensions = validate_previews(previews)

    result = {
        "schema": "r014.backend.qa",
        "schema_version": "2.0.0",
        "generated_at": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        "result": "pass",
        "method": "independent schema, referential, locator, rights, terminology, correction, exercise, evidence-state and CSV-XLSX validation",
        "backend": backend.relative_to(ROOT).as_posix() if backend.is_relative_to(ROOT) else str(backend),
        "manifest": {"bytes": manifest_path.stat().st_size, "sha256": sha256(manifest_path), "listed_files": len(manifest_files)},
        "catalog": {"bytes": catalog_path.stat().st_size, "sha256": sha256(catalog_path)},
        "records": {"count": len(records), "bytes": records_path.stat().st_size, "sha256": sha256(records_path), "record_counts": counts},
        "boundary11_preservation": {"record_count": 2417, "records_bytes": 2_247_534, "records_sha256": B11_RECORDS_SHA, "object_hashes": "pass"},
        "boundary28_r2_preservation": {"record_count": 5180, "records_bytes": 5_584_334, "records_sha256": B28R2_RECORDS_SHA, "object_hashes": "pass"},
        "pinned_target": {"path": CANONICAL_TARGET_REL, "bytes": 269_464, "sha256": TARGET_SHA},
        "canonical_final_reader": {"path": "output/YAINTT_ID.pdf", "bytes": 962_527, "sha256": "1ded3c6844b656347259b464bf21526fdc32dc2246c73ac58ab76ed28688eefc", "pages": 138},
        "pinned_sidecars": {LEDGER_REL: LEDGER_SHA, TERMINOLOGY_REL: TERMINOLOGY_SHA},
        "schema_validated_records": len(records),
        "validated_locators": locator_count,
        "validated_artifacts_and_assets": artifact_count,
        "semantic_closure": semantics,
        "csv_projection_count": len(SHEETS),
        "csv_rows": csv_rows,
        "xlsx": {"path": "backend/exports/R014_MODULAR_BACKEND.xlsx", "bytes": (backend / "exports" / "R014_MODULAR_BACKEND.xlsx").stat().st_size, "sha256": sha256(backend / "exports" / "R014_MODULAR_BACKEND.xlsx"), "sheet_count": len(SHEETS), "csv_cell_matrices_equal": True, "formula_errors": 0},
        "preview_dimensions": preview_dimensions,
        "determinism_receipt": None if args.skip_determinism else {"path": DETERMINISM.relative_to(ROOT).as_posix(), "sha256": sha256(DETERMINISM)},
        "failures": [],
    }
    receipt.parent.mkdir(parents=True, exist_ok=True)
    receipt.write_text(json.dumps(result, ensure_ascii=False, sort_keys=True, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({
        "result": "pass", "receipt": str(receipt), "receipt_sha256": sha256(receipt),
        "records": len(records), "locators": locator_count, "artifact_files": artifact_count,
        "csv_sheets": len(SHEETS), "preview_files": len(preview_dimensions),
    }, indent=2))


if __name__ == "__main__":
    main()
