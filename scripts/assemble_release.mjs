#!/usr/bin/env node

/**
 * Deterministic, lane-local release assembler for R014 / YAINTT id-ID.
 *
 * This script performs no network, Git, credential, or publication operation.
 * It intentionally requires explicit final PDF and receipt paths so an
 * intermediate boundary cannot be admitted by accident.
 *
 * Example (replace every path with the admitted final receipt path):
 *   node scripts/assemble_release.mjs \
 *     --pdf output/YAINTT_ID_BOUNDARY28.pdf \
 *     --pdf-build-receipt qa/BOUNDARY28_BUILD.json \
 *     --pdf-visual-receipt qa/BOUNDARY28_VISUAL.json \
 *     --backend-qa-receipt qa/BACKEND_QA.json \
 *     --backend-determinism-receipt qa/BACKEND_DETERMINISM.json
 */

import { createHash } from "node:crypto";
import {
  chmod,
  lstat,
  mkdir,
  readFile,
  readdir,
  rename,
  rm,
  unlink,
  utimes,
  writeFile,
} from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const JSZip = require("jszip");
const jszipVersion = require("jszip/package.json").version;

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const LANE_ROOT = path.resolve(SCRIPT_DIR, "..");
const PUBLICATION_DIR = path.resolve(LANE_ROOT, "publication");
const STAGING_DIR = path.resolve(PUBLICATION_DIR, "staging");
const NEXT_STAGING_DIR = path.resolve(PUBLICATION_DIR, ".staging-next");
const RELEASE_MANIFEST_PATH = path.resolve(
  PUBLICATION_DIR,
  "RELEASE_MANIFEST.json",
);
const RELEASE_MANIFEST_NEXT_PATH = path.resolve(
  PUBLICATION_DIR,
  ".RELEASE_MANIFEST.next.json",
);

const ZIP_DATE = new Date("1980-01-01T00:00:00.000Z");
const ZIP_FILE_MODE = 0o100644;
const ZIP_CONTENTS_NAME = "CONTENTS.sha256";
const HEX_256 = /^[0-9a-f]{64}$/;

const REQUIRED_OPTIONS = new Set([
  "pdf",
  "pdf-build-receipt",
  "pdf-visual-receipt",
  "backend-qa-receipt",
  "backend-determinism-receipt",
]);

const SOURCE_BUNDLE_FILES = [
  "README.md",
  "BUILD.md",
  "LICENSE.md",
  "ATTRIBUTION.md",
  "CITATION.cff",
  ".zenodo.json",
  "source/yaintt-id.tex",
  "source/refs.bib",
  "source/assets/cover_art.eps",
  "source/assets/dbend.eps",
  "source/assets/eng_freq_hist.eps",
  "source/assets/hamhip_freqs.eps",
  "source/assets/samp_Cct_hist.eps",
  "source/assets/Scytale.eps",
  "source/assets/seadk_Cct.eps",
  "source/assets/seadk_hamhip.eps",
  "source/assets/seadk_rkkrt.eps",
  "authority/SOURCE_AUTHORITY.json",
  "authority/COMPONENT_RIGHTS.json",
  "scripts/finalize_pdf_deterministic.py",
];

const EVIDENCE_BUNDLE_STATIC_FILES = [
  "README.md",
  "BUILD.md",
  "LICENSE.md",
  "ATTRIBUTION.md",
  "CITATION.cff",
  ".zenodo.json",
  "authority/SOURCE_AUTHORITY.json",
  "authority/COMPONENT_RIGHTS.json",
  "authority/receipts/C60_CURRICULUM_AUTHORITY.json",
  "00_control/ADVERSE_LEDGER.md",
  "00_control/TERMINOLOGY.md",
  "00_control/DECISION_LOG.md",
  "qa/FULL_CORPUS_AUDIT.json",
  "qa/BOUNDARY28_TRANSLATION_REVIEW.json",
  "qa/frozen-boundaries/boundary28-final/SOURCE_SNAPSHOT.json",
  "publication/PUBLICATION_TARGETS.json",
  "publication/ZENODO_METADATA_DRAFT.json",
  "publication/RELEASE_NOTES.md",
  "publication/RELEASE_CHECKLIST.md",
  "scripts/assemble_release.mjs",
  "scripts/publish_release.mjs",
];

const STAGING_HUMAN_FILES = new Map([
  ["README.md", "README.md"],
  ["BUILD.md", "BUILD.md"],
  ["LICENSE.md", "LICENSE.md"],
  ["ATTRIBUTION.md", "ATTRIBUTION.md"],
  ["CITATION.cff", "CITATION.cff"],
  // GitHub release assets cannot retain a leading-dot filename: an upload
  // named .zenodo.json is normalized to default.zenodo.json. Keep the
  // repository/source-bundle metadata canonical as .zenodo.json, but use a
  // portable public-release filename shared by GitHub and Zenodo.
  [".zenodo.json", "zenodo.json"],
  ["publication/RELEASE_NOTES.md", "RELEASE_NOTES.md"],
]);

function compareCodePoint(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

function sha256(data) {
  return createHash("sha256").update(data).digest("hex");
}

function invariant(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function normalizeRelative(value, label) {
  invariant(typeof value === "string" && value.length > 0, `${label} is empty`);
  invariant(!value.includes("\0"), `${label} contains a NUL byte`);
  const slash = value.replaceAll("\\", "/");
  invariant(!path.posix.isAbsolute(slash), `${label} must be lane-relative`);
  invariant(!/^[A-Za-z]:/.test(slash), `${label} must not contain a drive`);
  const parts = slash.split("/");
  invariant(
    !parts.some((part) => part === "" || part === "." || part === ".."),
    `${label} contains an empty, dot, or parent component`,
  );
  const normalized = path.posix.normalize(slash);
  const absolute = path.resolve(LANE_ROOT, ...normalized.split("/"));
  const prefix = `${LANE_ROOT}${path.sep}`;
  invariant(
    absolute.startsWith(prefix),
    `${label} resolves outside the YAINTT lane`,
  );
  return normalized;
}

function normalizeZipPath(value, label) {
  const normalized = normalizeRelative(value, label);
  invariant(!normalized.endsWith("/"), `${label} must name a file`);
  return normalized;
}

function absoluteFromRelative(relative) {
  return path.resolve(LANE_ROOT, ...relative.split("/"));
}

function assertPrefix(relative, prefix, label) {
  invariant(
    relative.startsWith(prefix),
    `${label} must be under the bounded prefix ${prefix}`,
  );
}

async function pathExists(absolute) {
  try {
    await lstat(absolute);
    return true;
  } catch (error) {
    if (error?.code === "ENOENT") return false;
    throw error;
  }
}

async function readRegularFile(relative, label = relative) {
  const normalized = normalizeRelative(relative, label);
  const absolute = absoluteFromRelative(normalized);
  const stat = await lstat(absolute);
  invariant(!stat.isSymbolicLink(), `${label} must not be a symbolic link`);
  invariant(stat.isFile(), `${label} must be a regular file`);
  return {
    relative: normalized,
    absolute,
    data: await readFile(absolute),
    bytes: stat.size,
  };
}

async function identityFor(relative, label = relative) {
  const file = await readRegularFile(relative, label);
  return {
    path: file.relative,
    bytes: file.bytes,
    sha256: sha256(file.data),
  };
}

async function readJson(relative, label = relative) {
  const file = await readRegularFile(relative, label);
  let value;
  try {
    value = JSON.parse(file.data.toString("utf8"));
  } catch (error) {
    throw new Error(`${label} is not valid JSON: ${error.message}`);
  }
  return { ...file, value };
}

function normalizeSha(value, label) {
  invariant(typeof value === "string", `${label} is missing`);
  const lowered = value.toLowerCase();
  invariant(HEX_256.test(lowered), `${label} is not a SHA-256 value`);
  return lowered;
}

function assertTopLevelPass(receipt, label) {
  const candidates = [receipt.status, receipt.result, receipt.verdict].filter(
    (value) => typeof value === "string",
  );
  invariant(candidates.length > 0, `${label} has no top-level pass disposition`);
  invariant(
    candidates.some((value) => /^(pass|clean|success|verified)/i.test(value)),
    `${label} is not a passing receipt: ${candidates.join(", ")}`,
  );
}

function assertJsonContainsHash(receipt, expectedHash, label) {
  invariant(
    JSON.stringify(receipt).toLowerCase().includes(expectedHash),
    `${label} does not bind expected SHA-256 ${expectedHash}`,
  );
}

function parseArguments(argv) {
  if (argv.includes("--help")) {
    return { help: true };
  }
  invariant(argv.length % 2 === 0, "Every option requires one value");
  const options = {};
  for (let index = 0; index < argv.length; index += 2) {
    const rawName = argv[index];
    const value = argv[index + 1];
    invariant(rawName.startsWith("--"), `Unexpected argument ${rawName}`);
    const name = rawName.slice(2);
    invariant(REQUIRED_OPTIONS.has(name), `Unknown option --${name}`);
    invariant(options[name] === undefined, `Duplicate option --${name}`);
    options[name] = value;
  }
  for (const name of REQUIRED_OPTIONS) {
    invariant(options[name] !== undefined, `Missing required option --${name}`);
  }
  return { help: false, ...options };
}

function printUsage() {
  process.stdout.write(
    [
      "Usage:",
      "  node scripts/assemble_release.mjs \\",
      "    --pdf output/<admitted-final.pdf> \\",
      "    --pdf-build-receipt qa/<final-build-receipt.json> \\",
      "    --pdf-visual-receipt qa/<final-visual-receipt.json> \\",
      "    --backend-qa-receipt qa/<full-backend-qa.json> \\",
      "    --backend-determinism-receipt qa/<full-backend-determinism.json>",
      "",
    ].join("\n"),
  );
}

async function validateStableInputs(releaseManifest) {
  invariant(
    Array.isArray(releaseManifest.stable_inputs),
    "Release manifest stable_inputs is missing",
  );
  for (const record of releaseManifest.stable_inputs) {
    const relative = normalizeRelative(record.path, "stable input path");
    const identity = await identityFor(relative);
    invariant(identity.bytes === record.bytes, `${relative} byte count drifted`);
    invariant(
      identity.sha256 === normalizeSha(record.sha256, `${relative} SHA-256`),
      `${relative} SHA-256 drifted`,
    );
  }
}

function assertPrepublicationManifest(releaseManifest) {
  const publication = releaseManifest.publication ?? {};
  invariant(
    publication.public_verification_receipt === null ||
      publication.public_verification_receipt === undefined,
    "Refusing to reassemble an already publicly verified release",
  );
  invariant(
    releaseManifest.status !== "published_public_bytes_verified",
    "Refusing to reassemble a published release manifest",
  );
  const identifiers = [
    publication.github_repository_url,
    publication.github_release_url,
    publication.zenodo_record_id,
    publication.version_doi,
  ];
  const populated = identifiers.filter(
    (value) => value !== null && value !== undefined,
  );
  invariant(
    populated.length === 0 || populated.length === identifiers.length,
    "Publication identifiers are only partially bound",
  );
  if (populated.length > 0) {
    invariant(
      releaseManifest.status === "identifiers_bound_reassembly_required" ||
        releaseManifest.status === "assembled_verified_pending_publication",
      "Bound identifiers require the explicit reassembly state",
    );
  }
}

async function validateInputs(options) {
  const pdf = normalizeRelative(options.pdf, "--pdf");
  const pdfBuildReceipt = normalizeRelative(
    options["pdf-build-receipt"],
    "--pdf-build-receipt",
  );
  const pdfVisualReceipt = normalizeRelative(
    options["pdf-visual-receipt"],
    "--pdf-visual-receipt",
  );
  const backendQaReceipt = normalizeRelative(
    options["backend-qa-receipt"],
    "--backend-qa-receipt",
  );
  const backendDeterminismReceipt = normalizeRelative(
    options["backend-determinism-receipt"],
    "--backend-determinism-receipt",
  );

  assertPrefix(pdf, "output/", "--pdf");
  invariant(pdf.toLowerCase().endsWith(".pdf"), "--pdf must name a PDF");
  for (const [relative, label] of [
    [pdfBuildReceipt, "--pdf-build-receipt"],
    [pdfVisualReceipt, "--pdf-visual-receipt"],
    [backendQaReceipt, "--backend-qa-receipt"],
    [backendDeterminismReceipt, "--backend-determinism-receipt"],
  ]) {
    assertPrefix(relative, "qa/", label);
    invariant(relative.toLowerCase().endsWith(".json"), `${label} must be JSON`);
  }

  const releaseManifestFile = await readJson(
    "publication/RELEASE_MANIFEST.json",
    "release manifest",
  );
  const releaseManifest = releaseManifestFile.value;
  assertPrepublicationManifest(releaseManifest);
  await validateStableInputs(releaseManifest);

  const sourceIdentity = await identityFor("source/yaintt-id.tex");
  const pdfIdentity = await identityFor(pdf, "final PDF");
  const pdfFile = await readRegularFile(pdf, "final PDF");

  const fullAudit = await readJson(
    "qa/FULL_CORPUS_AUDIT.json",
    "full corpus audit",
  );
  assertTopLevelPass(fullAudit.value, "full corpus audit");
  invariant(
    normalizeSha(fullAudit.value.target?.sha256, "full audit target SHA-256") ===
      sourceIdentity.sha256,
    "Full corpus audit is not bound to the final source",
  );
  for (const severity of ["p1", "p2", "p3"]) {
    invariant(
      fullAudit.value.findings_after_revision?.[severity] === 0,
      `Full corpus audit retains ${severity} findings`,
    );
  }

  const translationReview = await readJson(
    "qa/BOUNDARY28_TRANSLATION_REVIEW.json",
    "final translation review",
  );
  assertTopLevelPass(translationReview.value, "final translation review");

  const pdfBuild = await readJson(pdfBuildReceipt, "final PDF build receipt");
  assertTopLevelPass(pdfBuild.value, "final PDF build receipt");
  invariant(
    normalizeSha(pdfBuild.value.artifact?.sha256, "build artifact SHA-256") ===
      pdfIdentity.sha256,
    "Build receipt does not bind the final PDF",
  );
  invariant(
    pdfBuild.value.artifact?.bytes === pdfIdentity.bytes,
    "Build receipt PDF byte count does not match",
  );
  invariant(
    normalizeSha(pdfBuild.value.source?.sha256, "build source SHA-256") ===
      sourceIdentity.sha256,
    "Build receipt does not bind the final source",
  );
  invariant(
    normalizeSha(
      pdfBuild.value.reproduction_witness?.sha256,
      "reproduction witness SHA-256",
    ) === pdfIdentity.sha256,
    "Reproduction witness is not byte-identical to the final PDF",
  );
  invariant(
    pdfBuild.value.reproducibility?.four_normalized_surfaces_byte_identical ===
      true,
    "Final PDF reproducibility gate is not true",
  );
  invariant(
    pdfBuild.value.structural_gate?.passed === true,
    "Final PDF structural gate is not true",
  );
  invariant(
    pdfBuild.value.checks?.all_fonts_embedded === true,
    "Final PDF does not have all fonts embedded",
  );
  invariant(
    pdfBuild.value.metadata?.catalog_language === "id-ID",
    "Final PDF catalog language is not id-ID",
  );

  const pdfVisual = await readJson(pdfVisualReceipt, "final PDF visual receipt");
  assertTopLevelPass(pdfVisual.value, "final PDF visual receipt");
  invariant(
    normalizeSha(pdfVisual.value.artifact?.sha256, "visual artifact SHA-256") ===
      pdfIdentity.sha256,
    "Visual receipt does not bind the final PDF",
  );
  invariant(
    normalizeSha(pdfVisual.value.source?.sha256, "visual source SHA-256") ===
      sourceIdentity.sha256,
    "Visual receipt does not bind the final source",
  );
  invariant(
    pdfVisual.value.visual_gate?.passed === true,
    "Final visual gate is not true",
  );
  invariant(
    pdfVisual.value.geometry?.page_fill_and_centering_reviewed === true,
    "Final visual receipt does not confirm page fill and centering review",
  );
  invariant(
    Array.isArray(pdfVisual.value.visual_defects) &&
      pdfVisual.value.visual_defects.length === 0,
    "Final visual receipt contains visual defects",
  );

  const backendManifestFile = await readJson(
    "backend/MANIFEST.json",
    "backend manifest",
  );
  const backendManifest = backendManifestFile.value;
  const backendManifestIdentity = await identityFor("backend/MANIFEST.json");
  invariant(
    normalizeSha(backendManifest.target_sha256, "backend target SHA-256") ===
      sourceIdentity.sha256,
    "Backend manifest is not built from the final source",
  );
  invariant(
    Array.isArray(backendManifest.files) && backendManifest.files.length > 0,
    "Backend manifest file inventory is empty",
  );

  const backendManifestSidecar = await readRegularFile(
    "backend/MANIFEST.sha256",
    "backend manifest sidecar",
  );
  const sidecarHash = backendManifestSidecar.data
    .toString("utf8")
    .trim()
    .split(/\s+/u)[0]
    .toLowerCase();
  invariant(HEX_256.test(sidecarHash), "Backend manifest sidecar is malformed");
  invariant(
    sidecarHash === backendManifestIdentity.sha256,
    "Backend manifest sidecar does not match MANIFEST.json",
  );

  const backendQa = await readJson(backendQaReceipt, "backend QA receipt");
  assertTopLevelPass(backendQa.value, "backend QA receipt");
  assertJsonContainsHash(backendQa.value, sourceIdentity.sha256, "backend QA");
  assertJsonContainsHash(
    backendQa.value,
    backendManifestIdentity.sha256,
    "backend QA",
  );
  const backendQaRecordCount = Number(
    backendQa.value.records?.count ?? backendQa.value.records,
  );
  const backendQaRelationCount = Number(
    backendQa.value.records?.record_counts?.relation ?? backendQa.value.relations,
  );
  invariant(backendQaRecordCount > 0, "Backend QA reports no records");
  invariant(backendQaRelationCount > 0, "Backend QA reports no relations");

  const backendDeterminism = await readJson(
    backendDeterminismReceipt,
    "backend determinism receipt",
  );
  assertTopLevelPass(backendDeterminism.value, "backend determinism receipt");
  const pinnedInputs = backendDeterminism.value.pinned_inputs;
  invariant(
    Array.isArray(pinnedInputs) &&
      pinnedInputs.some(
        (input) =>
          String(input.path).endsWith("/yaintt-id.tex") &&
          Number(input.bytes) === sourceIdentity.bytes &&
          normalizeSha(input.sha256, "backend pinned source SHA-256") ===
            sourceIdentity.sha256,
      ),
    "Backend determinism receipt is not bound to the final source",
  );
  invariant(
    Array.isArray(backendDeterminism.value.runs) &&
      backendDeterminism.value.runs.length === 2 &&
      backendDeterminism.value.runs.every(
        (run) => typeof run.root === "string" && run.root.length > 0,
      ),
    "Backend determinism receipt does not record two isolated runs",
  );
  invariant(
    Array.isArray(backendDeterminism.value.mismatches) &&
      backendDeterminism.value.mismatches.length === 0,
    "Backend determinism receipt contains mismatches",
  );
  assertJsonContainsHash(
    backendDeterminism.value,
    backendManifestIdentity.sha256,
    "backend determinism receipt",
  );

  return {
    normalizedOptions: {
      pdf,
      pdfBuildReceipt,
      pdfVisualReceipt,
      backendQaReceipt,
      backendDeterminismReceipt,
    },
    releaseManifest,
    sourceIdentity,
    pdfIdentity,
    pdfData: pdfFile.data,
    backendManifest,
    backendManifestIdentity,
    receiptIdentities: await Promise.all(
      [
        ["full_corpus_audit", "qa/FULL_CORPUS_AUDIT.json"],
        ["final_translation_review", "qa/BOUNDARY28_TRANSLATION_REVIEW.json"],
        ["final_pdf_build", pdfBuildReceipt],
        ["final_pdf_visual", pdfVisualReceipt],
        ["full_backend_qa", backendQaReceipt],
        ["full_backend_determinism", backendDeterminismReceipt],
      ].map(async ([role, relative]) => ({
        role,
        ...(await identityFor(relative)),
      })),
    ),
  };
}

async function addLaneFile(entries, sourceRelative, archiveRelative = sourceRelative) {
  const archivePath = normalizeZipPath(archiveRelative, "ZIP entry path");
  invariant(archivePath !== ZIP_CONTENTS_NAME, `${ZIP_CONTENTS_NAME} is reserved`);
  invariant(!entries.has(archivePath), `Duplicate ZIP entry ${archivePath}`);
  const file = await readRegularFile(sourceRelative);
  entries.set(archivePath, {
    source: file.relative,
    data: file.data,
    bytes: file.bytes,
    sha256: sha256(file.data),
  });
}

async function addFileList(entries, files) {
  for (const relative of [...files].sort(compareCodePoint)) {
    await addLaneFile(entries, relative);
  }
}

function backendManifestSelections(backendManifest) {
  const seen = new Set();
  const backend = [];
  const evidence = [];
  for (const record of backendManifest.files) {
    const relative = normalizeZipPath(record.path, "backend manifest path");
    invariant(!seen.has(relative), `Duplicate backend manifest path ${relative}`);
    seen.add(relative);
    const normalizedRecord = {
      path: relative,
      bytes: record.bytes,
      sha256: normalizeSha(record.sha256, `${relative} manifest SHA-256`),
    };
    if (
      relative === "catalog.json" ||
      relative === "records.jsonl" ||
      relative.startsWith("exports/") ||
      relative.startsWith("schemas/")
    ) {
      backend.push(normalizedRecord);
    } else if (relative.startsWith("evidence/")) {
      evidence.push(normalizedRecord);
    }
  }
  invariant(
    backend.some((record) => record.path === "catalog.json"),
    "Backend manifest does not inventory catalog.json",
  );
  invariant(
    backend.some((record) => record.path === "records.jsonl"),
    "Backend manifest does not inventory records.jsonl",
  );
  invariant(
    backend.some((record) => record.path.startsWith("exports/")),
    "Backend manifest contains no exports",
  );
  invariant(
    backend.some((record) => record.path.startsWith("schemas/")),
    "Backend manifest contains no schemas",
  );
  return {
    backend: backend.sort((a, b) => compareCodePoint(a.path, b.path)),
    evidence: evidence.sort((a, b) => compareCodePoint(a.path, b.path)),
  };
}

async function addBackendManifestRecords(entries, records) {
  for (const record of records) {
    const sourceRelative = `backend/${record.path}`;
    const file = await readRegularFile(sourceRelative);
    const actualHash = sha256(file.data);
    invariant(file.bytes === record.bytes, `${sourceRelative} byte count drifted`);
    invariant(
      actualHash === record.sha256,
      `${sourceRelative} does not match backend/MANIFEST.json`,
    );
    await addLaneFile(entries, sourceRelative);
  }
}

async function buildBundleEntries(validated) {
  const source = new Map();
  await addFileList(source, SOURCE_BUNDLE_FILES);
  invariant(
    ![...source.keys()].some((entry) => /(^|\/)by-sa\.eps$/i.test(entry)),
    "The excluded by-sa.eps badge entered the source bundle",
  );

  const selections = backendManifestSelections(validated.backendManifest);
  const backend = new Map();
  await addFileList(backend, [
    "README.md",
    "BUILD.md",
    "LICENSE.md",
    "ATTRIBUTION.md",
    "CITATION.cff",
    "backend/MANIFEST.json",
    "backend/MANIFEST.sha256",
  ]);
  await addBackendManifestRecords(backend, selections.backend);

  const evidence = new Map();
  await addFileList(evidence, EVIDENCE_BUNDLE_STATIC_FILES);
  for (const receipt of validated.receiptIdentities) {
    if (!evidence.has(receipt.path)) {
      await addLaneFile(evidence, receipt.path);
    }
  }
  await addBackendManifestRecords(evidence, selections.evidence);

  return { source, backend, evidence };
}

function contentsManifest(entries) {
  const lines = [...entries.entries()]
    .sort(([a], [b]) => compareCodePoint(a, b))
    .map(([archivePath, entry]) => `${entry.sha256}  ${archivePath}\n`)
    .join("");
  return Buffer.from(lines, "utf8");
}

async function setFixedFileMetadata(absolute) {
  await chmod(absolute, 0o644);
  await utimes(absolute, ZIP_DATE, ZIP_DATE);
}

async function createDeterministicZip(filename, entries, destinationDirectory) {
  const manifestData = contentsManifest(entries);
  const complete = new Map(entries);
  complete.set(ZIP_CONTENTS_NAME, {
    source: null,
    data: manifestData,
    bytes: manifestData.length,
    sha256: sha256(manifestData),
  });

  const zip = new JSZip();
  const ordered = [...complete.entries()].sort(([a], [b]) =>
    compareCodePoint(a, b),
  );
  for (const [archivePath, entry] of ordered) {
    zip.file(archivePath, entry.data, {
      binary: true,
      createFolders: false,
      date: ZIP_DATE,
      unixPermissions: ZIP_FILE_MODE,
      compression: "DEFLATE",
      compressionOptions: { level: 9 },
    });
  }

  const generated = await zip.generateAsync({
    type: "nodebuffer",
    platform: "UNIX",
    streamFiles: false,
    compression: "DEFLATE",
    compressionOptions: { level: 9 },
  });
  const destination = path.resolve(destinationDirectory, filename);
  await writeFile(destination, generated, { flag: "wx", mode: 0o644 });
  await setFixedFileMetadata(destination);

  const readback = await readFile(destination);
  invariant(
    sha256(readback) === sha256(generated),
    `${filename} write/readback SHA-256 mismatch`,
  );
  const loaded = await JSZip.loadAsync(readback, { checkCRC32: true });
  const loadedNames = Object.keys(loaded.files)
    .filter((name) => !loaded.files[name].dir)
    .sort(compareCodePoint);
  const expectedNames = ordered.map(([name]) => name);
  invariant(
    JSON.stringify(loadedNames) === JSON.stringify(expectedNames),
    `${filename} central-directory inventory mismatch`,
  );
  for (const [archivePath, expected] of ordered) {
    const loadedEntry = loaded.file(archivePath);
    invariant(loadedEntry !== null, `${filename} lacks ${archivePath}`);
    const extracted = await loadedEntry.async("nodebuffer");
    invariant(
      extracted.length === expected.bytes && sha256(extracted) === expected.sha256,
      `${filename} entry verification failed for ${archivePath}`,
    );
    invariant(
      loadedEntry.date.toISOString() === ZIP_DATE.toISOString(),
      `${filename} entry timestamp drifted for ${archivePath}`,
    );
    invariant(
      (loadedEntry.unixPermissions & 0xffff) === ZIP_FILE_MODE,
      `${filename} entry permissions drifted for ${archivePath}`,
    );
  }

  return {
    path: `publication/staging/${filename}`,
    bytes: readback.length,
    sha256: sha256(readback),
    inventory: {
      payload_file_count: entries.size,
      zip_entry_count: complete.size,
      payload_uncompressed_bytes: [...entries.values()].reduce(
        (sum, entry) => sum + entry.bytes,
        0,
      ),
      contents_sha256_bytes: manifestData.length,
      contents_sha256_sha256: sha256(manifestData),
    },
  };
}

async function assertExactOwnedDirectoryTarget(absolute, expected, label) {
  invariant(path.resolve(absolute) === path.resolve(expected), `${label} drifted`);
  const prefix = `${PUBLICATION_DIR}${path.sep}`;
  invariant(absolute.startsWith(prefix), `${label} is outside publication/`);
  if (await pathExists(absolute)) {
    const stat = await lstat(absolute);
    invariant(!stat.isSymbolicLink(), `${label} must not be a symbolic link`);
    invariant(stat.isDirectory(), `${label} must be a directory`);
  }
}

async function resetNextStaging() {
  await assertExactOwnedDirectoryTarget(
    NEXT_STAGING_DIR,
    path.resolve(PUBLICATION_DIR, ".staging-next"),
    "next staging directory",
  );
  if (await pathExists(NEXT_STAGING_DIR)) {
    await rm(NEXT_STAGING_DIR, { recursive: true, force: false });
  }
  await mkdir(NEXT_STAGING_DIR, { recursive: false });
}

async function writeFixedStagingFile(filename, data) {
  const relative = normalizeZipPath(filename, "staging filename");
  invariant(!relative.includes("/"), "Staging outputs must be flat");
  const destination = path.resolve(NEXT_STAGING_DIR, relative);
  await writeFile(destination, data, { flag: "wx", mode: 0o644 });
  await setFixedFileMetadata(destination);
  const readback = await readFile(destination);
  invariant(
    readback.length === data.length && sha256(readback) === sha256(data),
    `Staging readback failed for ${filename}`,
  );
}

function updateArtifact(releaseManifest, role, sourcePath, identity) {
  const matches = releaseManifest.required_release_artifacts.filter(
    (artifact) => artifact.role === role,
  );
  invariant(matches.length === 1, `Expected exactly one ${role} artifact record`);
  Object.assign(matches[0], {
    source_path: sourcePath,
    state: "verified",
    bytes: identity.bytes,
    sha256: identity.sha256,
  });
  if (identity.inventory !== undefined) {
    matches[0].inventory = identity.inventory;
  } else {
    delete matches[0].inventory;
  }
}

function makeUpdatedManifest(validated, zipIdentities) {
  const manifest = structuredClone(validated.releaseManifest);
  invariant(
    Array.isArray(manifest.required_release_artifacts),
    "Release manifest required_release_artifacts is missing",
  );
  updateArtifact(
    manifest,
    "final_reader_pdf",
    validated.normalizedOptions.pdf,
    validated.pdfIdentity,
  );
  updateArtifact(
    manifest,
    "editable_source_bundle",
    zipIdentities.source.path,
    zipIdentities.source,
  );
  updateArtifact(
    manifest,
    "modular_backend_bundle",
    zipIdentities.backend.path,
    zipIdentities.backend,
  );
  updateArtifact(
    manifest,
    "release_evidence_bundle",
    zipIdentities.evidence.path,
    zipIdentities.evidence,
  );
  manifest.status = "assembled_verified_pending_publication";
  manifest.assembly = {
    script: "scripts/assemble_release.mjs",
    script_sha256: null,
    jszip_version: jszipVersion,
    zip_timestamp_utc: ZIP_DATE.toISOString(),
    zip_platform: "UNIX",
    zip_file_mode_octal: "100644",
    compression: "DEFLATE level 9",
    entry_order: "Unicode code-point order",
    internal_inventory: ZIP_CONTENTS_NAME,
    final_source: validated.sourceIdentity,
    backend_manifest: validated.backendManifestIdentity,
    receipts: [...validated.receiptIdentities].sort((a, b) =>
      compareCodePoint(a.path, b.path),
    ),
  };
  manifest.release_gate =
    "Local assembly and byte readback passed; publication and anonymous public-byte verification remain required.";
  return manifest;
}

async function bindAssemblerIdentity(manifest) {
  const identity = await identityFor("scripts/assemble_release.mjs");
  manifest.assembly.script_sha256 = identity.sha256;
}

async function replaceStagingDirectory() {
  await assertExactOwnedDirectoryTarget(
    STAGING_DIR,
    path.resolve(PUBLICATION_DIR, "staging"),
    "staging directory",
  );
  if (await pathExists(STAGING_DIR)) {
    await rm(STAGING_DIR, { recursive: true, force: false });
  }
  await rename(NEXT_STAGING_DIR, STAGING_DIR);
}

async function replaceCanonicalManifest(data) {
  if (await pathExists(RELEASE_MANIFEST_NEXT_PATH)) {
    const stat = await lstat(RELEASE_MANIFEST_NEXT_PATH);
    invariant(
      !stat.isSymbolicLink() && stat.isFile(),
      "Manifest next path is not a regular file",
    );
    await unlink(RELEASE_MANIFEST_NEXT_PATH);
  }
  await writeFile(RELEASE_MANIFEST_NEXT_PATH, data, {
    flag: "wx",
    mode: 0o644,
  });
  await rename(RELEASE_MANIFEST_NEXT_PATH, RELEASE_MANIFEST_PATH);
}

async function verifyFinalStaging(expectedNames, manifestData) {
  const actualNames = (await readdir(STAGING_DIR)).sort(compareCodePoint);
  invariant(
    JSON.stringify(actualNames) === JSON.stringify([...expectedNames].sort(compareCodePoint)),
    "Final staging tree contains missing or unexpected entries",
  );
  const stagedManifest = await readFile(
    path.resolve(STAGING_DIR, "RELEASE_MANIFEST.json"),
  );
  const canonicalManifest = await readFile(RELEASE_MANIFEST_PATH);
  invariant(
    sha256(stagedManifest) === sha256(manifestData) &&
      sha256(canonicalManifest) === sha256(manifestData),
    "Canonical and staged release manifests are not byte-identical",
  );
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  if (options.help) {
    printUsage();
    return;
  }

  // Validate every final input before touching the task-owned staging paths.
  const validated = await validateInputs(options);
  const bundleEntries = await buildBundleEntries(validated);

  await resetNextStaging();
  await writeFixedStagingFile("YAINTT_ID.pdf", validated.pdfData);

  const zipIdentities = {
    source: await createDeterministicZip(
      "YAINTT_ID_SOURCE.zip",
      bundleEntries.source,
      NEXT_STAGING_DIR,
    ),
    backend: await createDeterministicZip(
      "YAINTT_ID_BACKEND.zip",
      bundleEntries.backend,
      NEXT_STAGING_DIR,
    ),
    evidence: await createDeterministicZip(
      "YAINTT_ID_EVIDENCE.zip",
      bundleEntries.evidence,
      NEXT_STAGING_DIR,
    ),
  };

  for (const [sourceRelative, stagingName] of STAGING_HUMAN_FILES) {
    const file = await readRegularFile(sourceRelative);
    await writeFixedStagingFile(stagingName, file.data);
  }

  const updatedManifest = makeUpdatedManifest(validated, zipIdentities);
  await bindAssemblerIdentity(updatedManifest);
  const manifestData = Buffer.from(
    `${JSON.stringify(updatedManifest, null, 2)}\n`,
    "utf8",
  );
  await writeFixedStagingFile("RELEASE_MANIFEST.json", manifestData);

  const expectedStagingNames = new Set([
    "YAINTT_ID.pdf",
    "YAINTT_ID_SOURCE.zip",
    "YAINTT_ID_BACKEND.zip",
    "YAINTT_ID_EVIDENCE.zip",
    "README.md",
    "BUILD.md",
    "LICENSE.md",
    "ATTRIBUTION.md",
    "CITATION.cff",
    "zenodo.json",
    "RELEASE_NOTES.md",
    "RELEASE_MANIFEST.json",
  ]);
  const nextNames = (await readdir(NEXT_STAGING_DIR)).sort(compareCodePoint);
  invariant(
    JSON.stringify(nextNames) ===
      JSON.stringify([...expectedStagingNames].sort(compareCodePoint)),
    "Next staging tree contains missing or unexpected entries",
  );

  await replaceStagingDirectory();
  await replaceCanonicalManifest(manifestData);
  await verifyFinalStaging(expectedStagingNames, manifestData);

  process.stdout.write(
    `${JSON.stringify(
      {
        status: "assembled_verified_pending_publication",
        staging: "publication/staging",
        release_manifest: {
          path: "publication/RELEASE_MANIFEST.json",
          bytes: manifestData.length,
          sha256: sha256(manifestData),
        },
        artifacts: {
          final_reader_pdf: validated.pdfIdentity,
          editable_source_bundle: zipIdentities.source,
          modular_backend_bundle: zipIdentities.backend,
          release_evidence_bundle: zipIdentities.evidence,
        },
      },
      null,
      2,
    )}\n`,
  );
}

main().catch((error) => {
  process.stderr.write(`Release assembly failed: ${error.stack ?? error}\n`);
  process.exitCode = 1;
});
