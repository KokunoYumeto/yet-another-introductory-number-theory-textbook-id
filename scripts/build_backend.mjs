#!/usr/bin/env node
import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";
import JSZip from "jszip";
import { extendFullBackend } from "./backend_full_extension.mjs";
import { admitCanonicalReaderEvidence } from "./backend_canonical_reader_admission.mjs";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDir, "..");
const backendDir = process.env.R014_BACKEND_DIR
  ? path.resolve(process.env.R014_BACKEND_DIR)
  : path.join(root, "backend");
const exportDir = path.join(backendDir, "exports");
const evidenceDir = path.join(backendDir, "evidence");
const previewDir = process.env.R014_PREVIEW_DIR
  ? path.resolve(process.env.R014_PREVIEW_DIR)
  : path.join(root, "qa", "backend-previews");
const handoffDir = process.env.R014_HANDOFF_DIR
  ? path.resolve(process.env.R014_HANDOFF_DIR)
  : path.resolve(root, "..", "..", "..", "outputs", "01a01fa7-51cd-71e0-934d-187b3b7da5ba");
const authorityPath = path.join(root, "authority", "downloads", "yaintt.tex");
const targetRelPath = "qa/frozen-boundaries/boundary3/yaintt-id.tex";
const targetPath = path.join(root, ...targetRelPath.split("/"));
const refsPath = path.join(root, "authority", "downloads", "refs.bib");
const createdAt = "2026-08-21T13:53:00+02:00";
const authoritySha = "d2967870a0d43de60c590a2bb40cee6915e7b6d68a0dd3ad574f64c7b6430829";
const targetSha = "695c071582bdee94a297987c820195b31fe808c16dbb1c0f07559e2b2ed73666";
const boundary4TargetRelPath = "qa/frozen-boundaries/boundary4/yaintt-id.tex";
const boundary4TargetPath = path.join(root, ...boundary4TargetRelPath.split("/"));
const boundary4TargetSha = "6579069bd8ca959042eaeba5b743d5eb4a3ed3e58828e55a827a30f0b0066859";
const boundary4TargetBytesExpected = 245517;
const boundary5TargetRelPath = "qa/frozen-boundaries/boundary5/yaintt-id.tex";
const boundary5TargetPath = path.join(root, ...boundary5TargetRelPath.split("/"));
const boundary5TargetSha = "a1e4f897c579852ae201e59f20538883cff4c07575a128ddfc24b6b19e2334d1";
const boundary5TargetBytesExpected = 246813;
const boundary5TerminologyRelPath = "qa/frozen-boundaries/boundary5/TERMINOLOGY.md";
const boundary5TerminologySha = "c8b46c2a6e9fd96feae1ee03e4646f8dd18c387d07da3549c7ccf09b9de284ea";
const boundary6TargetRelPath = "qa/frozen-boundaries/boundary6/yaintt-id.tex";
const boundary6TargetPath = path.join(root, ...boundary6TargetRelPath.split("/"));
const boundary6TargetSha = "4f9ca62a4fd7a3e4c7c2629ce62ee33bda8e35202bd35850df339f211464116d";
const boundary6TargetBytesExpected = 247240;
const boundary6TerminologyRelPath = "qa/frozen-boundaries/boundary6/TERMINOLOGY.md";
const boundary6TerminologySha = "28262ecaee6f0153929e106b3659c7e73303b8280c6c4ff9f2fef0573fdfba18";
const boundary7TargetRelPath = "qa/frozen-boundaries/boundary7/yaintt-id.tex";
const boundary7TargetPath = path.join(root, ...boundary7TargetRelPath.split("/"));
const boundary7TargetSha = "8557e99ec0cc12ece98cb3a28706676d21d8c0526f526034a3178742acee5a79";
const boundary7TargetBytesExpected = 248279;
const boundary7TerminologyRelPath = "qa/frozen-boundaries/boundary7/TERMINOLOGY.md";
const boundary7TerminologySha = "6107138281cbb3996e3b923688cf5007f30b0768cbda896e535a7b70443c15d6";
const boundary8TargetRelPath = "qa/frozen-boundaries/boundary8/yaintt-id.tex";
const boundary8TargetPath = path.join(root, ...boundary8TargetRelPath.split("/"));
const boundary8TargetSha = "f4e17c49e2dc2e871fc6595e11daa97c8ad55e1a4eba2005488e9e841e68e749";
const boundary8TargetBytesExpected = 249528;
const boundary8TerminologyRelPath = "qa/frozen-boundaries/boundary8/TERMINOLOGY.md";
const boundary8TerminologySha = "b24d7de653ee20a099dfd511d50f46641329589accf774bb0ce5ff5e74ba93d0";
const boundary9TargetRelPath = "qa/frozen-boundaries/boundary9/yaintt-id.tex";
const boundary9TargetPath = path.join(root, ...boundary9TargetRelPath.split("/"));
const boundary9TargetSha = "643a63186e4d6e1f2589aec775f9f70b58875aee6d61ec297cd55029b44cb1f9";
const boundary9TargetBytesExpected = 249864;
const boundary9TerminologyRelPath = "qa/frozen-boundaries/boundary9/TERMINOLOGY.md";
const boundary9TerminologySha = "d0ca90abaad183751936a72245a9c666caeb5055c6f6b06499bebefb48711992";
const boundary10TargetRelPath = "qa/frozen-boundaries/boundary10/yaintt-id.tex";
const boundary10TargetPath = path.join(root, ...boundary10TargetRelPath.split("/"));
const boundary10TargetSha = "e2eb275565a11f04e44c4009a3dae2df7af1f8a7ea05b24ef7e30037ee2dc2a8";
const boundary10TargetBytesExpected = 250682;
const boundary10TerminologyRelPath = "qa/frozen-boundaries/boundary10/TERMINOLOGY.md";
const boundary10TerminologySha = "837852f95b66fcad08e32b07cb205b22483d8b7cd1b67f7da6cbd343c3744ab3";
const boundary11TargetRelPath = "qa/frozen-boundaries/boundary11/yaintt-id.tex";
const boundary11TargetPath = path.join(root, ...boundary11TargetRelPath.split("/"));
const boundary11TargetSha = "cccf9bac270237c36545b61973c49e02afc3d19a5828c7a9dfb1fed524ec9a53";
const boundary11TargetBytesExpected = 251814;
const boundary11TerminologyRelPath = "qa/frozen-boundaries/boundary11/TERMINOLOGY.md";
const boundary11TerminologySha = "edf8d277be21f2e663407a26ffbfa9fb0fdd585535e49695f07768bdc19f9a7f";
const workId = "ttp.r014.yaintt";
const resourceId = workId;
const sourceEditionId = "ttp.r014.edition.source.2014-05-07";
const targetEditionId = "ttp.r014.edition.id-id.boundary3";
const boundary4EditionId = "ttp.r014.edition.id-id.boundary4";
const boundary4RightsId = "rights.yaintt.id-id.derivative.boundary4";
const boundary5EditionId = "ttp.r014.edition.id-id.boundary5";
const boundary5RightsId = "rights.yaintt.id-id.derivative.boundary5";
const boundary6EditionId = "ttp.r014.edition.id-id.boundary6";
const boundary6RightsId = "rights.yaintt.id-id.derivative.boundary6";
const boundary7EditionId = "ttp.r014.edition.id-id.boundary7";
const boundary7RightsId = "rights.yaintt.id-id.derivative.boundary7";
const boundary8EditionId = "ttp.r014.edition.id-id.boundary8";
const boundary8RightsId = "rights.yaintt.id-id.derivative.boundary8";
const boundary9EditionId = "ttp.r014.edition.id-id.boundary9";
const boundary9RightsId = "rights.yaintt.id-id.derivative.boundary9";
const boundary10EditionId = "ttp.r014.edition.id-id.boundary10";
const boundary10RightsId = "rights.yaintt.id-id.derivative.boundary10";
const boundary11EditionId = "ttp.r014.edition.id-id.boundary11";
const boundary11RightsId = "rights.yaintt.id-id.derivative.boundary11";
const fixedQaIds = {
  source: "ttp.r014.qa.source-authority",
  rights: "ttp.r014.qa.component-rights",
  upstream: "ttp.r014.qa.upstream-build",
  topology: "ttp.r014.qa.boundary1-topology",
  math: "ttp.r014.qa.boundary1-math",
  language: "ttp.r014.qa.boundary1-language",
  build: "ttp.r014.qa.boundary1-build",
  accessibility: "ttp.r014.qa.boundary1-accessibility",
  visual: "ttp.r014.qa.boundary1-visual",
  aowiTopology: "ttp.r014.qa.section-aowi-topology",
  aowiMath: "ttp.r014.qa.section-aowi-math",
  aowiLanguage: "ttp.r014.qa.section-aowi-language",
  build2: "ttp.r014.qa.boundary2-build",
  accessibility2: "ttp.r014.qa.boundary2-accessibility",
  visual2: "ttp.r014.qa.boundary2-visual",
  dadaTopology: "ttp.r014.qa.section-dada-topology",
  dadaMath: "ttp.r014.qa.section-dada-math",
  dadaLanguage: "ttp.r014.qa.section-dada-language",
  build3: "ttp.r014.qa.boundary3-build",
  accessibility3: "ttp.r014.qa.boundary3-accessibility",
  visual3: "ttp.r014.qa.boundary3-visual",
  backend: "ttp.r014.qa.backend-roundtrip",
  roiidbTopology: "ttp.r014.qa.section-roiidb-topology",
  roiidbMath: "ttp.r014.qa.section-roiidb-math",
  roiidbLanguage: "ttp.r014.qa.section-roiidb-language",
  build4: "ttp.r014.qa.boundary4-build",
  accessibility4: "ttp.r014.qa.boundary4-accessibility",
  visual4: "ttp.r014.qa.boundary4-visual",
  backend4: "ttp.r014.qa.backend-boundary4-determinism",
  gcdTopology: "ttp.r014.qa.section-gcd-topology",
  gcdMath: "ttp.r014.qa.section-gcd-math",
  gcdLanguage: "ttp.r014.qa.section-gcd-language",
  build5: "ttp.r014.qa.boundary5-build",
  accessibility5: "ttp.r014.qa.boundary5-accessibility",
  visual5: "ttp.r014.qa.boundary5-visual",
  backend5: "ttp.r014.qa.backend-boundary5-determinism",
  eaTopology: "ttp.r014.qa.section-ea-topology",
  eaMath: "ttp.r014.qa.section-ea-math",
  eaLanguage: "ttp.r014.qa.section-ea-language",
  build6: "ttp.r014.qa.boundary6-build",
  accessibility6: "ttp.r014.qa.boundary6-accessibility",
  visual6: "ttp.r014.qa.boundary6-visual",
  backend6: "ttp.r014.qa.backend-boundary6-determinism",
  itcTopology: "ttp.r014.qa.section-itc-topology",
  itcMath: "ttp.r014.qa.section-itc-math",
  itcLanguage: "ttp.r014.qa.section-itc-language",
  build7: "ttp.r014.qa.boundary7-build",
  accessibility7: "ttp.r014.qa.boundary7-accessibility",
  visual7: "ttp.r014.qa.boundary7-visual",
  backend7: "ttp.r014.qa.backend-boundary7-determinism",
  lcTopology: "ttp.r014.qa.section-lc-topology",
  lcMath: "ttp.r014.qa.section-lc-math",
  lcLanguage: "ttp.r014.qa.section-lc-language",
  build8: "ttp.r014.qa.boundary8-build",
  accessibility8: "ttp.r014.qa.boundary8-accessibility",
  visual8: "ttp.r014.qa.boundary8-visual",
  backend8: "ttp.r014.qa.backend-boundary8-determinism",
  crtTopology: "ttp.r014.qa.section-crt-topology",
  crtMath: "ttp.r014.qa.section-crt-math",
  crtLanguage: "ttp.r014.qa.section-crt-language",
  build9: "ttp.r014.qa.boundary9-build",
  accessibility9: "ttp.r014.qa.boundary9-accessibility",
  visual9: "ttp.r014.qa.boundary9-visual",
  backend9: "ttp.r014.qa.backend-boundary9-determinism",
  awtwwcTopology: "ttp.r014.qa.section-awtwwc-topology",
  awtwwcMath: "ttp.r014.qa.section-awtwwc-math",
  awtwwcLanguage: "ttp.r014.qa.section-awtwwc-language",
  build10: "ttp.r014.qa.boundary10-build",
  accessibility10: "ttp.r014.qa.boundary10-accessibility",
  visual10: "ttp.r014.qa.boundary10-visual",
  backend10: "ttp.r014.qa.backend-boundary10-determinism",
  ephifTopology: "ttp.r014.qa.section-ephif-topology",
  ephifMath: "ttp.r014.qa.section-ephif-math",
  ephifLanguage: "ttp.r014.qa.section-ephif-language",
  build11: "ttp.r014.qa.boundary11-build",
  accessibility11: "ttp.r014.qa.boundary11-accessibility",
  visual11: "ttp.r014.qa.boundary11-visual",
  backend11: "ttp.r014.qa.backend-boundary11-determinism",
};

function sha256Bytes(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function sha256File(filename) {
  const digest = crypto.createHash("sha256");
  const fd = fs.openSync(filename, "r");
  const buffer = Buffer.allocUnsafe(1024 * 1024);
  try {
    for (;;) {
      const count = fs.readSync(fd, buffer, 0, buffer.length, null);
      if (!count) break;
      digest.update(buffer.subarray(0, count));
    }
  } finally {
    fs.closeSync(fd);
  }
  return digest.digest("hex");
}

function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.keys(value)
        .filter((key) => value[key] !== undefined)
        .sort((a, b) => a.localeCompare(b, "en"))
        .map((key) => [key, canonicalize(value[key])]),
    );
  }
  return value;
}

function stableJson(value, indent = 0) {
  return JSON.stringify(canonicalize(value), null, indent);
}

async function normalizeXlsxDeterministic(filename) {
  const input = await JSZip.loadAsync(await fsp.readFile(filename));
  const names = Object.keys(input.files).filter((name) => !input.files[name].dir).sort((a, b) => a.localeCompare(b, "en"));
  const contents = new Map();
  for (const name of names) contents.set(name, await input.files[name].async("nodebuffer"));

  const rootRelsName = "_rels/.rels";
  const workbookRelsName = "xl/_rels/workbook.xml.rels";
  const workbookName = "xl/workbook.xml";
  const rootRels = contents.get(rootRelsName).toString("utf8").replace(/\bId="[^"]+"/, 'Id="rId1"');
  const workbookRelsSource = contents.get(workbookRelsName).toString("utf8");
  const relationshipIds = [...workbookRelsSource.matchAll(/\bId="([^"]+)"/g)].map((match) => match[1]);
  if (relationshipIds.length !== 19 || new Set(relationshipIds).size !== 19) throw new Error("unexpected XLSX relationship closure");
  const relationshipMap = new Map(relationshipIds.map((id, index) => [id, `rId${index + 1}`]));
  const workbookRels = workbookRelsSource.replace(/\bId="([^"]+)"/g, (_whole, id) => `Id="${relationshipMap.get(id)}"`);
  const workbookSource = contents.get(workbookName).toString("utf8");
  const workbookXml = workbookSource.replace(/\br:id="([^"]+)"/g, (_whole, id) => {
    if (!relationshipMap.has(id)) throw new Error(`unmapped workbook relationship ${id}`);
    return `r:id="${relationshipMap.get(id)}"`;
  });
  contents.set(rootRelsName, Buffer.from(rootRels, "utf8"));
  contents.set(workbookRelsName, Buffer.from(workbookRels, "utf8"));
  contents.set(workbookName, Buffer.from(workbookXml, "utf8"));
  for (let index = 1; index <= 15; index += 1) {
    const sheetName = `xl/worksheets/sheet${index}.xml`;
    const sheetSource = contents.get(sheetName).toString("utf8");
    const sheetXml = sheetSource.replace(
      /<x:sheetView([^>]*)\s*\/>/,
      '<x:sheetView$1><x:pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen" /></x:sheetView>',
    );
    if (sheetXml === sheetSource || !sheetXml.includes('topLeftCell="A2"')) throw new Error(`unable to freeze header row in ${sheetName}`);
    contents.set(sheetName, Buffer.from(sheetXml, "utf8"));
  }

  const output = new JSZip();
  const fixedDate = new Date("2000-01-01T00:00:00.000Z");
  for (const name of names) {
    output.file(name, contents.get(name), {
      binary: true,
      createFolders: false,
      date: fixedDate,
      compression: "DEFLATE",
      compressionOptions: { level: 9 },
    });
  }
  const bytes = await output.generateAsync({
    type: "nodebuffer",
    platform: "DOS",
    compression: "DEFLATE",
    compressionOptions: { level: 9 },
    mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  await fsp.writeFile(filename, bytes);
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), "utf8"));
}

function relative(filename) {
  return path.relative(root, filename).split(path.sep).join("/");
}

function lineOffsets(buffer) {
  const offsets = [0];
  for (let index = 0; index < buffer.length; index += 1) {
    if (buffer[index] === 0x0a) offsets.push(index + 1);
  }
  return offsets;
}

function span(buffer, offsets, startLine, endLine) {
  if (startLine < 1 || endLine < startLine || startLine > offsets.length) {
    throw new Error(`invalid line span ${startLine}-${endLine}`);
  }
  const start = offsets[startLine - 1];
  const end = endLine < offsets.length ? offsets[endLine] : buffer.length;
  const bytes = buffer.subarray(start, end);
  return {
    bytes,
    text: bytes.toString("utf8"),
    sha256: sha256Bytes(bytes),
  };
}

function baseRecord(entityClass, recordId, overrides = {}) {
  return {
    schema: "r014.backend.record",
    schema_version: "1.0.0",
    record_id: recordId,
    entity_class: entityClass,
    status: "active",
    work_id: workId,
    resource_id: resourceId,
    edition_id: null,
    locale: "und",
    created_at: createdAt,
    responsible_workflow: "codex.r014.id-ID",
    supersedes: null,
    ...overrides,
  };
}

function unitId(suffix) {
  return `ttp.r014.unit.${suffix}`;
}

function conceptId(code) {
  return `ttp.concept.${code}`;
}

function assetId(filename) {
  return `ttp.r014.asset.authority.${filename.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "")}`;
}

function correctionId(number) {
  return `ttp.r014.correction.${String(number).padStart(4, "0")}`;
}

function csvEscape(value) {
  let text;
  if (value === null || value === undefined) text = "";
  else if (Array.isArray(value) || typeof value === "object") text = stableJson(value);
  else if (typeof value === "boolean") text = value ? "true" : "false";
  else text = String(value);
  if (/[",\r\n]/.test(text)) return `"${text.replaceAll('"', '""')}"`;
  return text;
}

function csvText(headers, rows) {
  const lines = [headers.map(csvEscape).join(",")];
  for (const row of rows) lines.push(headers.map((header) => csvEscape(row[header])).join(","));
  return `${lines.join("\n")}\n`;
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (quoted) {
      if (char === '"' && text[index + 1] === '"') {
        cell += '"';
        index += 1;
      } else if (char === '"') quoted = false;
      else cell += char;
    } else if (char === '"') quoted = true;
    else if (char === ",") {
      row.push(cell);
      cell = "";
    } else if (char === "\n") {
      row.push(cell.replace(/\r$/, ""));
      rows.push(row);
      row = [];
      cell = "";
    } else cell += char;
  }
  if (quoted) throw new Error("unterminated CSV quote");
  if (cell.length || row.length) {
    row.push(cell.replace(/\r$/, ""));
    rows.push(row);
  }
  return rows;
}

function excelColumn(index) {
  let result = "";
  let value = index;
  while (value > 0) {
    value -= 1;
    result = String.fromCharCode(65 + (value % 26)) + result;
    value = Math.floor(value / 26);
  }
  return result;
}

const authorityBytes = fs.readFileSync(authorityPath);
const targetBytes = fs.readFileSync(targetPath);
const boundary4TargetBytes = fs.readFileSync(boundary4TargetPath);
const boundary5TargetBytes = fs.readFileSync(boundary5TargetPath);
const boundary6TargetBytes = fs.readFileSync(boundary6TargetPath);
const boundary7TargetBytes = fs.readFileSync(boundary7TargetPath);
const boundary8TargetBytes = fs.readFileSync(boundary8TargetPath);
const boundary9TargetBytes = fs.readFileSync(boundary9TargetPath);
const boundary10TargetBytes = fs.readFileSync(boundary10TargetPath);
const boundary11TargetBytes = fs.readFileSync(boundary11TargetPath);
const refsBytes = fs.readFileSync(refsPath);
// Boundary 3 is a frozen append-only prefix.  Its evidence is read back from the
// canonical backend copy instead of the moving production control.
const adverseLedgerSourcePath = path.join(root, "backend", "evidence", "ADVERSE_LEDGER.md");
const adverseLedgerBytes = fs.readFileSync(adverseLedgerSourcePath);
const adverseLedgerText = adverseLedgerBytes.toString("utf8");
const adverseLedgerSha = sha256Bytes(adverseLedgerBytes);
const adverseLedgerBackendPath = "backend/evidence/ADVERSE_LEDGER.md";
const boundary4LedgerRelPath = "qa/frozen-boundaries/boundary4/ADVERSE_LEDGER.md";
const boundary4LedgerBytes = fs.readFileSync(path.join(root, ...boundary4LedgerRelPath.split("/")));
const boundary4LedgerText = boundary4LedgerBytes.toString("utf8");
const boundary4LedgerSha = sha256Bytes(boundary4LedgerBytes);
const boundary4LedgerBackendPath = "backend/evidence/ADVERSE_LEDGER_BOUNDARY4.md";
const boundary5LedgerRelPath = "qa/frozen-boundaries/boundary5/ADVERSE_LEDGER.md";
const boundary5LedgerBytes = fs.readFileSync(path.join(root, ...boundary5LedgerRelPath.split("/")));
const boundary5LedgerText = boundary5LedgerBytes.toString("utf8");
const boundary5LedgerSha = sha256Bytes(boundary5LedgerBytes);
const boundary5LedgerBackendPath = "backend/evidence/ADVERSE_LEDGER_BOUNDARY5.md";
const boundary5TerminologyBytes = fs.readFileSync(path.join(root, ...boundary5TerminologyRelPath.split("/")));
const boundary6LedgerRelPath = "qa/frozen-boundaries/boundary6/ADVERSE_LEDGER.md";
const boundary6LedgerBytes = fs.readFileSync(path.join(root, ...boundary6LedgerRelPath.split("/")));
const boundary6LedgerText = boundary6LedgerBytes.toString("utf8");
const boundary6LedgerSha = sha256Bytes(boundary6LedgerBytes);
const boundary6LedgerBackendPath = "backend/evidence/ADVERSE_LEDGER_BOUNDARY6.md";
const boundary6TerminologyBytes = fs.readFileSync(path.join(root, ...boundary6TerminologyRelPath.split("/")));
const boundary7LedgerRelPath = "qa/frozen-boundaries/boundary7/ADVERSE_LEDGER.md";
const boundary7LedgerBytes = fs.readFileSync(path.join(root, ...boundary7LedgerRelPath.split("/")));
const boundary7LedgerText = boundary7LedgerBytes.toString("utf8");
const boundary7LedgerSha = sha256Bytes(boundary7LedgerBytes);
const boundary7LedgerBackendPath = "backend/evidence/ADVERSE_LEDGER_BOUNDARY7.md";
const boundary7TerminologyBytes = fs.readFileSync(path.join(root, ...boundary7TerminologyRelPath.split("/")));
const boundary8LedgerRelPath = "qa/frozen-boundaries/boundary8/ADVERSE_LEDGER.md";
const boundary8LedgerBytes = fs.readFileSync(path.join(root, ...boundary8LedgerRelPath.split("/")));
const boundary8LedgerText = boundary8LedgerBytes.toString("utf8");
const boundary8LedgerSha = sha256Bytes(boundary8LedgerBytes);
const boundary8LedgerBackendPath = "backend/evidence/ADVERSE_LEDGER_BOUNDARY8.md";
const boundary8TerminologyBytes = fs.readFileSync(path.join(root, ...boundary8TerminologyRelPath.split("/")));
const boundary9LedgerRelPath = "qa/frozen-boundaries/boundary9/ADVERSE_LEDGER.md";
const boundary9LedgerBytes = fs.readFileSync(path.join(root, ...boundary9LedgerRelPath.split("/")));
const boundary9LedgerText = boundary9LedgerBytes.toString("utf8");
const boundary9LedgerSha = sha256Bytes(boundary9LedgerBytes);
const boundary9LedgerBackendPath = "backend/evidence/ADVERSE_LEDGER_BOUNDARY9.md";
const boundary9TerminologyBytes = fs.readFileSync(path.join(root, ...boundary9TerminologyRelPath.split("/")));
const boundary10LedgerRelPath = "qa/frozen-boundaries/boundary10/ADVERSE_LEDGER.md";
const boundary10LedgerBytes = fs.readFileSync(path.join(root, ...boundary10LedgerRelPath.split("/")));
const boundary10LedgerText = boundary10LedgerBytes.toString("utf8");
const boundary10LedgerSha = sha256Bytes(boundary10LedgerBytes);
const boundary10LedgerBackendPath = "backend/evidence/ADVERSE_LEDGER_BOUNDARY10.md";
const boundary10TerminologyBytes = fs.readFileSync(path.join(root, ...boundary10TerminologyRelPath.split("/")));
const boundary11LedgerRelPath = "qa/frozen-boundaries/boundary11/ADVERSE_LEDGER.md";
const boundary11LedgerBytes = fs.readFileSync(path.join(root, ...boundary11LedgerRelPath.split("/")));
const boundary11LedgerText = boundary11LedgerBytes.toString("utf8");
const boundary11LedgerSha = sha256Bytes(boundary11LedgerBytes);
const boundary11LedgerBackendPath = "backend/evidence/ADVERSE_LEDGER_BOUNDARY11.md";
const boundary11TerminologyBytes = fs.readFileSync(path.join(root, ...boundary11TerminologyRelPath.split("/")));
if (sha256Bytes(authorityBytes) !== authoritySha) throw new Error("authority source hash drift");
if (sha256Bytes(targetBytes) !== targetSha) throw new Error("target source hash drift");
if (boundary4TargetBytes.length !== boundary4TargetBytesExpected || sha256Bytes(boundary4TargetBytes) !== boundary4TargetSha) throw new Error("Boundary 4 target snapshot drift");
if (boundary5TargetBytes.length !== boundary5TargetBytesExpected || sha256Bytes(boundary5TargetBytes) !== boundary5TargetSha) throw new Error("Boundary 5 target snapshot drift");
if (boundary6TargetBytes.length !== boundary6TargetBytesExpected || sha256Bytes(boundary6TargetBytes) !== boundary6TargetSha) throw new Error("Boundary 6 target snapshot drift");
if (boundary7TargetBytes.length !== boundary7TargetBytesExpected || sha256Bytes(boundary7TargetBytes) !== boundary7TargetSha) throw new Error("Boundary 7 target snapshot drift");
if (boundary8TargetBytes.length !== boundary8TargetBytesExpected || sha256Bytes(boundary8TargetBytes) !== boundary8TargetSha) throw new Error("Boundary 8 target snapshot drift");
if (boundary9TargetBytes.length !== boundary9TargetBytesExpected || sha256Bytes(boundary9TargetBytes) !== boundary9TargetSha) throw new Error("Boundary 9 target snapshot drift");
if (boundary10TargetBytes.length !== boundary10TargetBytesExpected || sha256Bytes(boundary10TargetBytes) !== boundary10TargetSha) throw new Error("Boundary 10 target snapshot drift");
if (boundary11TargetBytes.length !== boundary11TargetBytesExpected || sha256Bytes(boundary11TargetBytes) !== boundary11TargetSha) throw new Error("Boundary 11 target snapshot drift");
if (adverseLedgerBytes.length !== 6018 || adverseLedgerSha !== "bad63981382d3a2d8a6561e1691992aef3248f6d3c91886ed3601bc4ee20be45") throw new Error("Boundary 3 adverse ledger drift");
if (boundary4LedgerBytes.length !== 7849 || boundary4LedgerSha !== "f0b156c825ea3a86865203a4c2eff727eb72284fc03568f74a648cca10e19520") throw new Error("Boundary 4 adverse ledger drift");
if (boundary5LedgerBytes.length !== 9625 || boundary5LedgerSha !== "162e8861593298f87291d8b5c0495425ab0d2ba1b0815d3bf03ccd709f1e79f0") throw new Error("Boundary 5 adverse ledger drift");
if (boundary5TerminologyBytes.length !== 5216 || sha256Bytes(boundary5TerminologyBytes) !== boundary5TerminologySha) throw new Error("Boundary 5 terminology drift");
if (boundary6LedgerBytes.length !== 10548 || boundary6LedgerSha !== "439f2728e2bf3455b616bfc5fbc7e6d5a658ba86d7d6c1cbbb0411fcaf9cf49a") throw new Error("Boundary 6 adverse ledger drift");
if (boundary6TerminologyBytes.length !== 5490 || sha256Bytes(boundary6TerminologyBytes) !== boundary6TerminologySha) throw new Error("Boundary 6 terminology drift");
if (boundary7LedgerBytes.length !== 12221 || boundary7LedgerSha !== "e1e47594393f5154587c6cc02ae46c3298ba7ef3b37b94a22b4a28dcf0b220b5") throw new Error("Boundary 7 adverse ledger drift");
if (boundary7TerminologyBytes.length !== 6142 || sha256Bytes(boundary7TerminologyBytes) !== boundary7TerminologySha) throw new Error("Boundary 7 terminology drift");
if (boundary8LedgerBytes.length !== 14723 || boundary8LedgerSha !== "5ca4cedea493e2688437cc5dd01db138e781e1d16c28f7dcee2eeed772f60f9b") throw new Error("Boundary 8 adverse ledger drift");
if (boundary8TerminologyBytes.length !== 6554 || sha256Bytes(boundary8TerminologyBytes) !== boundary8TerminologySha) throw new Error("Boundary 8 terminology drift");
if (boundary9LedgerBytes.length !== 15137 || boundary9LedgerSha !== "1354896c1f7f1427ffffef9d33cdae0f908e60e2be63529b5d9a3fd57ab5349b") throw new Error("Boundary 9 adverse ledger drift");
if (boundary9TerminologyBytes.length !== 6687 || sha256Bytes(boundary9TerminologyBytes) !== boundary9TerminologySha) throw new Error("Boundary 9 terminology drift");
if (boundary10LedgerBytes.length !== 16871 || boundary10LedgerSha !== "204c5f8287abde8f443467f52cdfc67d256deb7fda471a9b7665d71a6d2dfe52") throw new Error("Boundary 10 adverse ledger drift");
if (boundary10TerminologyBytes.length !== 7638 || sha256Bytes(boundary10TerminologyBytes) !== boundary10TerminologySha) throw new Error("Boundary 10 terminology drift");
if (boundary11LedgerBytes.length !== 18322 || boundary11LedgerSha !== "b4304bf5625025a7361d06fbaa284c24f16e1cf7303753b1e05e982a6f46a67f") throw new Error("Boundary 11 adverse ledger drift");
if (boundary11TerminologyBytes.length !== 8722 || sha256Bytes(boundary11TerminologyBytes) !== boundary11TerminologySha) throw new Error("Boundary 11 terminology drift");
const authorityOffsets = lineOffsets(authorityBytes);
const targetOffsets = lineOffsets(targetBytes);
const boundary4TargetOffsets = lineOffsets(boundary4TargetBytes);
const boundary5TargetOffsets = lineOffsets(boundary5TargetBytes);
const boundary6TargetOffsets = lineOffsets(boundary6TargetBytes);
const boundary7TargetOffsets = lineOffsets(boundary7TargetBytes);
const boundary8TargetOffsets = lineOffsets(boundary8TargetBytes);
const boundary9TargetOffsets = lineOffsets(boundary9TargetBytes);
const boundary10TargetOffsets = lineOffsets(boundary10TargetBytes);
const boundary11TargetOffsets = lineOffsets(boundary11TargetBytes);
const refsOffsets = lineOffsets(refsBytes);
const authorityText = authorityBytes.toString("ascii");
const targetText = targetBytes.toString("utf8");
const refsText = refsBytes.toString("utf8");
const sourceAuthority = readJson("authority/SOURCE_AUTHORITY.json");
const componentRights = readJson("authority/COMPONENT_RIGHTS.json");
const curriculum = readJson("authority/receipts/C60_CURRICULUM_AUTHORITY.json");

const records = [];
records.push(
  baseRecord("program", "ttp.program.mathematics.id-id.v1", {
    locale: "id-ID",
    program_code: "MATH-ID-V1",
    title: "Program Matematika Lengkap — Bahasa Indonesia",
    curriculum_authority: {
      path: "authority/receipts/C60_CURRICULUM_AUTHORITY.json",
      source_sha256: curriculum.source_sha256,
    },
    course_ids: ["ttp.course.c60"],
    status: "partial_resource_production",
  }),
  baseRecord("course", "ttp.course.c60", {
    locale: "en",
    course_code: curriculum.course.id,
    title: curriculum.course.title,
    stage: curriculum.course.stage,
    prerequisite_course_ids: curriculum.course.prerequisites,
    prerequisite_records: curriculum.prerequisites,
    scope: curriculum.course.scope,
    outcome: curriculum.course.outcome,
    resource_ids: [resourceId],
    curriculum_status: curriculum.course.status,
  }),
  baseRecord("resource", resourceId, {
    title: "Yet Another Introductory Number Theory Textbook",
    subtitle: "Cryptology Emphasis Version",
    authors: ["Jonathan A. Poritz", "based initially on work by Wissam Raji"],
    authority_url: sourceAuthority.landing_page,
    source_format: "single-file LaTeX, BibTeX, and EPS asset distribution",
    rights_id: "rights.yaintt.text_and_author_assets",
    source_available_snapshot: sourceAuthority.snapshot_id,
    upstream_repository: null,
    official_pdf_url: sourceAuthority.files.find((item) => item.role === "official_source_corresponding_pdf").url,
  }),
  baseRecord("edition", sourceEditionId, {
    edition_id: sourceEditionId,
    locale: "en",
    edition_kind: "official_source_available_snapshot",
    source_snapshot_id: sourceAuthority.snapshot_id,
    file_ids: sourceAuthority.files
      .filter((item) => !["landing_and_license_authority", "official_source_corresponding_pdf"].includes(item.role))
      .map((item) => assetId(path.basename(item.path))),
    translation_state: "source_frozen",
    declared_timestamp: sourceAuthority.declared_source_timestamp,
    authority_manifest_path: "authority/SOURCE_AUTHORITY.json",
    build_recipe: sourceAuthority.upstream_build_recipe,
  }),
  baseRecord("edition", targetEditionId, {
    edition_id: targetEditionId,
    locale: "id-ID",
    edition_kind: "indonesian_translation_boundary",
    source_snapshot_id: sourceAuthority.snapshot_id,
    source_edition_id: sourceEditionId,
    file_ids: ["ttp.r014.artifact.target-source", "ttp.r014.artifact.boundary3-pdf"],
    translation_state: "visually_checked",
    translated_through: "sec:DaDA",
    next_cursor: "sec:RoIiDB",
    rights_id: "rights.yaintt.id-id.derivative",
  }),
);
records.push(baseRecord("edition", boundary4EditionId, {
  edition_id: boundary4EditionId,
  locale: "id-ID",
  edition_kind: "indonesian_translation_boundary",
  source_snapshot_id: sourceAuthority.snapshot_id,
  source_edition_id: sourceEditionId,
  file_ids: ["ttp.r014.artifact.target-source.boundary4", "ttp.r014.artifact.boundary4-pdf"],
  translation_state: "visually_checked",
  translated_through: "sec:RoIiDB",
  next_cursor: "gcd",
  rights_id: boundary4RightsId,
  supersedes: targetEditionId,
}));
records.push(baseRecord("edition", boundary5EditionId, {
  edition_id: boundary5EditionId,
  locale: "id-ID",
  edition_kind: "indonesian_translation_boundary",
  source_snapshot_id: sourceAuthority.snapshot_id,
  source_edition_id: sourceEditionId,
  file_ids: ["ttp.r014.artifact.target-source.boundary5", "ttp.r014.artifact.boundary5-pdf"],
  translation_state: "visually_checked",
  translated_through: "gcd",
  next_cursor: "sec:EA",
  rights_id: boundary5RightsId,
  supersedes: boundary4EditionId,
}));
records.push(baseRecord("edition", boundary6EditionId, {
  edition_id: boundary6EditionId,
  locale: "id-ID",
  edition_kind: "indonesian_translation_boundary",
  source_snapshot_id: sourceAuthority.snapshot_id,
  source_edition_id: sourceEditionId,
  file_ids: ["ttp.r014.artifact.target-source.boundary6", "ttp.r014.artifact.boundary6-pdf"],
  translation_state: "visually_checked",
  translated_through: "sec:EA",
  next_cursor: "chap:Cs",
  rights_id: boundary6RightsId,
  supersedes: boundary5EditionId,
}));
records.push(baseRecord("edition", boundary7EditionId, {
  edition_id: boundary7EditionId,
  locale: "id-ID",
  edition_kind: "indonesian_translation_boundary",
  source_snapshot_id: sourceAuthority.snapshot_id,
  source_edition_id: sourceEditionId,
  file_ids: ["ttp.r014.artifact.target-source.boundary7", "ttp.r014.artifact.boundary7-pdf"],
  translation_state: "visually_checked",
  translated_through: "sec:ItC",
  next_cursor: "sec:LC",
  rights_id: boundary7RightsId,
  supersedes: boundary6EditionId,
}));
records.push(baseRecord("edition", boundary8EditionId, {
  edition_id: boundary8EditionId,
  locale: "id-ID",
  edition_kind: "indonesian_translation_boundary",
  source_snapshot_id: sourceAuthority.snapshot_id,
  source_edition_id: sourceEditionId,
  file_ids: ["ttp.r014.artifact.target-source.boundary8", "ttp.r014.artifact.boundary8-pdf"],
  translation_state: "visually_checked",
  translated_through: "sec:LC",
  next_cursor: "sec:CRT",
  rights_id: boundary8RightsId,
  supersedes: boundary7EditionId,
}));
records.push(baseRecord("edition", boundary9EditionId, {
  edition_id: boundary9EditionId,
  locale: "id-ID",
  edition_kind: "indonesian_translation_boundary",
  source_snapshot_id: sourceAuthority.snapshot_id,
  source_edition_id: sourceEditionId,
  file_ids: ["ttp.r014.artifact.target-source.boundary9", "ttp.r014.artifact.boundary9-pdf"],
  translation_state: "visually_checked",
  translated_through: "sec:CRT",
  next_cursor: "sec:AWtWwC",
  rights_id: boundary9RightsId,
  supersedes: boundary8EditionId,
}));
records.push(baseRecord("edition", boundary10EditionId, {
  edition_id: boundary10EditionId,
  locale: "id-ID",
  edition_kind: "indonesian_translation_boundary",
  source_snapshot_id: sourceAuthority.snapshot_id,
  source_edition_id: sourceEditionId,
  file_ids: ["ttp.r014.artifact.target-source.boundary10", "ttp.r014.artifact.boundary10-pdf"],
  translation_state: "visually_checked",
  translated_through: "sec:AWtWwC",
  next_cursor: "sec:EphiF",
  rights_id: boundary10RightsId,
  supersedes: boundary9EditionId,
}));
records.push(baseRecord("edition", boundary11EditionId, {
  edition_id: boundary11EditionId,
  locale: "id-ID",
  edition_kind: "indonesian_translation_boundary",
  source_snapshot_id: sourceAuthority.snapshot_id,
  source_edition_id: sourceEditionId,
  file_ids: ["ttp.r014.artifact.target-source.boundary11", "ttp.r014.artifact.boundary11-pdf"],
  translation_state: "visually_checked",
  translated_through: "sec:EphiF",
  next_cursor: "chap:Prime",
  rights_id: boundary11RightsId,
  supersedes: boundary10EditionId,
}));

const unitSpecs = [
  ["book", "book", null, 1, "book", "Yet Another Introductory Number Theory Textbook", "Satu Lagi Buku Teks Pengantar Teori Bilangan", 1, 6023, 1, 6102, "draft"],
  ["frontmatter", "frontmatter", "book", 1, "frontmatter", "Front matter", "Bagian awal", 261, 388, 282, 431, "language_reviewed"],
  ["frontmatter.title-page", "title_page", "frontmatter", 1, "title-page", "Title page", "Halaman judul", 265, 279, 286, 300, "visually_checked"],
  ["frontmatter.title-page.figure.cover", "figure", "frontmatter.title-page", 1, "cover_art.eps", "Cover art", "Seni sampul", 265, 265, 286, 288, "visually_checked"],
  ["frontmatter.preface", "preface", "frontmatter", 2, "preface", "Preface", "Prakata", 281, 331, 302, 361, "language_reviewed"],
  ["frontmatter.preface.figure.license-badge", "figure", "frontmatter.preface", 1, "by-sa.eps", "CC BY-SA badge", "Lencana lisensi sumber", 304, 304, null, null, "blocked"],
  ["frontmatter.release-notes", "release_notes", "frontmatter", 3, "releasenotes", "Release Notes", "Catatan Rilis", 333, 379, 363, 422, "language_reviewed"],
  ["frontmatter.release-notes.figure.caution", "figure", "frontmatter.release-notes", 1, "dbend.eps", "Caution symbol", "Simbol perhatian", 359, 364, 402, 407, "visually_checked"],
  ["frontmatter.toc", "table_of_contents", "frontmatter", 4, "tableofcontents", "Contents", "Daftar Isi", 382, 386, 425, 429, "visually_checked"],
  ["chap.woad", "chapter", "book", 2, "chap:WOaD", "Well-Ordering and Division", "Keterurutan Baik dan Pembagian", 390, 1325, 433, 1418, "draft"],
  ["sec.wopami", "section", "chap.woad", 1, "sec:WOPaMI", "The Well-Ordering Principle and Mathematical Induction", "Prinsip Keterurutan Baik dan Induksi Matematika", 392, 586, 435, 638, "language_reviewed"],
  ["sec.wopami.discussion.01", "discussion", "sec.wopami", 1, "generated:discussion:01", "Three proof tools", "Tiga alat pembuktian", 394, 400, 437, 443, "language_reviewed"],
  ["sec.wopami.subsection.01", "subsection", "sec.wopami", 2, "generated:subsection:01", "The Well-Ordering Principle", "Prinsip Keterurutan Baik", 402, 415, 445, 459, "language_reviewed"],
  ["sec.wopami.definition.01", "definition", "sec.wopami.subsection.01", 1, "generated:definition:01", "Least element", "Elemen terkecil", 404, 407, 447, 451, "language_reviewed"],
  ["sec.wopami.principle.well-ordering", "principle", "sec.wopami.subsection.01", 2, "generated:WOprinciple:01", "Well-Ordering Principle", "Prinsip Keterurutan Baik", 409, 411, 453, 455, "language_reviewed"],
  ["sec.wopami.discussion.02", "discussion", "sec.wopami.subsection.01", 3, "generated:discussion:02", "Axiom note", "Catatan aksioma", 413, 415, 457, 459, "language_reviewed"],
  ["sec.wopami.subsection.02", "subsection", "sec.wopami", 3, "generated:subsection:02", "The Pigeonhole Principle", "Prinsip Sarang Merpati", 417, 430, 461, 473, "language_reviewed"],
  ["thm.pigeonhole", "theorem", "sec.wopami.subsection.02", 1, "thm:pigeonhole", "Pigeonhole Principle", "Prinsip Sarang Merpati", 419, 424, 463, 468, "language_reviewed"],
  ["thm.pigeonhole.proof", "proof", "thm.pigeonhole", 1, "generated:proof:thm:pigeonhole", "Proof", "Bukti", 426, 430, 470, 473, "language_reviewed"],
  ["sec.wopami.subsection.03", "subsection", "sec.wopami", 4, "generated:subsection:03", "The Principle of Mathematical Induction", "Prinsip Induksi Matematika", 432, 551, 475, 601, "language_reviewed"],
  ["sec.wopami.discussion.03", "discussion", "sec.wopami.subsection.03", 1, "generated:discussion:03", "Induction introduction", "Pengantar induksi", 434, 437, 477, 480, "language_reviewed"],
  ["sec.wopami.theorem.induction.01", "theorem", "sec.wopami.subsection.03", 2, "generated:theorem:induction:01", "First Principle of Mathematical Induction", "Prinsip Pertama Induksi Matematika", 439, 455, 482, 499, "language_reviewed"],
  ["sec.wopami.theorem.induction.01.proof", "proof", "sec.wopami.theorem.induction.01", 1, "generated:proof:induction:01", "Proof", "Bukti", 457, 481, 501, 527, "language_reviewed"],
  ["eg.inductionv1a", "example", "sec.wopami.subsection.03", 3, "eg:inductionv1a", "Finite-sum induction example", "Contoh induksi jumlah berhingga", 483, 503, 529, 550, "language_reviewed"],
  ["eg.inductionv1a.equation.01", "equation", "eg.inductionv1a", 1, "generated:equation:inductionv1a:01", "Target identity", "Identitas sasaran", 485, 487, 532, 534, "mathematically_reviewed"],
  ["eg.inductionv1a.equation.02", "equation", "eg.inductionv1a", 2, "generated:equation:inductionv1a:02", "Base case", "Kasus dasar", 489, 491, 536, 538, "mathematically_reviewed"],
  ["eg.inductionv1a.equation.03", "equation", "eg.inductionv1a", 3, "generated:equation:inductionv1a:03", "Inductive target", "Sasaran induksi", 495, 497, 542, 544, "mathematically_reviewed"],
  ["eg.inductionv1a.equation.04", "equation", "eg.inductionv1a", 4, "generated:equation:inductionv1a:04", "Inductive calculation", "Perhitungan induksi", 499, 501, 546, 548, "mathematically_reviewed"],
  ["eg.inductionv1b", "example", "sec.wopami.subsection.03", 4, "eg:inductionv1b", "Factorial bound", "Batas faktorial", 505, 518, 552, 567, "language_reviewed"],
  ["eg.inductionv1b.equation.01", "equation", "eg.inductionv1b", 1, "generated:equation:inductionv1b:01", "Induction hypothesis", "Hipotesis induksi", 510, 512, 558, 560, "mathematically_reviewed"],
  ["eg.inductionv1b.equation.02", "equation", "eg.inductionv1b", 2, "generated:equation:inductionv1b:02", "Inductive inequality", "Pertidaksamaan induksi", 514, 516, 563, 565, "mathematically_reviewed"],
  ["sec.wopami.theorem.induction.02", "theorem", "sec.wopami.subsection.03", 5, "generated:theorem:induction:02", "Second Principle of Mathematical Induction", "Prinsip Kedua Induksi Matematika", 520, 537, 569, 587, "language_reviewed"],
  ["sec.wopami.theorem.induction.02.proof", "proof", "sec.wopami.theorem.induction.02", 1, "generated:proof:induction:02", "Proof", "Bukti", 538, 551, 588, 601, "language_reviewed"],
  ["sec.wopami.exercises", "exercise_group", "sec.wopami", 5, "generated:exercise-group:sec:WOPaMI", "Exercises for Section 1.1", "Latihan untuk §1.1", 553, 586, 603, 638, "language_reviewed"],
  ["sec.wopami.exercise.01", "exercise", "sec.wopami.exercises", 1, "generated:exercise:sec:WOPaMI:01", "Exercise 1", "Latihan 1", 561, 563, 611, 614, "language_reviewed"],
  ["sec.wopami.exercise.02", "exercise", "sec.wopami.exercises", 2, "generated:exercise:sec:WOPaMI:02", "Exercise 2", "Latihan 2", 564, 566, 615, 617, "language_reviewed"],
  ["sec.wopami.exercise.03", "exercise", "sec.wopami.exercises", 3, "generated:exercise:sec:WOPaMI:03", "Exercise 3", "Latihan 3", 567, 570, 618, 621, "language_reviewed"],
  ["sec.wopami.exercise.04", "exercise", "sec.wopami.exercises", 4, "generated:exercise:sec:WOPaMI:04", "Exercise 4", "Latihan 4", 571, 574, 622, 625, "language_reviewed"],
  ["sec.wopami.exercise.05", "exercise", "sec.wopami.exercises", 5, "generated:exercise:sec:WOPaMI:05", "Exercise 5", "Latihan 5", 575, 577, 626, 629, "language_reviewed"],
  ["sec.wopami.exercise.06", "exercise", "sec.wopami.exercises", 6, "generated:exercise:sec:WOPaMI:06", "Exercise 6", "Latihan 6", 578, 580, 630, 632, "language_reviewed"],
  ["sec.wopami.exercise.07", "exercise", "sec.wopami.exercises", 7, "generated:exercise:sec:WOPaMI:07", "Exercise 7", "Latihan 7", 581, 583, 633, 635, "language_reviewed"],
  ["sec.aowi", "section", "chap.woad", 2, "sec:AOwI", "Algebraic Operations with Integers", "Operasi Aljabar pada Bilangan Bulat", 587, 645, 650, 709, "language_reviewed"],
  ["chap.crypto", "chapter", "book", 3, "chap:Crypto", "Cryptology", null, 2788, 4476, null, null, "queued"],
  ["chap.ieqdl", "chapter", "book", 4, "chap:IeqDL", "Index, Discrete Logarithms", null, 4477, 5993, null, null, "queued"],
  ["sec.dhke", "section", "chap.ieqdl", 1, "sec:DHKE", "Diffie-Hellman Key Exchange", null, 5524, 5766, null, null, "queued"],
  ["sec.tegc", "section", "chap.ieqdl", 2, "sec:tEGC", "The ElGamal Cryptosystem", null, 5767, 5993, null, null, "queued"],
  ["backmatter", "backmatter", "book", 5, "backmatter", "Back matter", "Bagian akhir", 5994, 6009, 913, 917, "structurally_verified"],
  ["backmatter.bibliography", "bibliography", "backmatter", 1, "bibliography", "Bibliography", "Daftar Pustaka", 5999, 6000, 913, 915, "structurally_verified"],
  ["bib.stallman2002free", "bibliography_entry", "backmatter.bibliography", 1, "stallman2002free", "Stallman 2002", "Stallman 2002", 153, 158, null, null, "source_frozen", "refs"],
  ["bib.hardy2005mathematician", "bibliography_entry", "backmatter.bibliography", 2, "hardy2005mathematician", "Hardy 2005", "Hardy 2005", 50, 55, null, null, "source_frozen", "refs"],
  ["bib.bourbaki2004theory", "bibliography_entry", "backmatter.bibliography", 3, "bourbaki2004theory", "Bourbaki 2004", "Bourbaki 2004", 17, 22, null, null, "source_frozen", "refs"],
  ["backmatter.index", "index", "backmatter", 2, "printindex", "Index", "Indeks", 6003, 6007, 916, 916, "structurally_verified"],
  ["sec.dada", "section", "chap.woad", 3, "sec:DaDA", "Divisibility and the Division Algorithm", "Keterbagian dan Algoritma Pembagian", 646, 828, 720, 911, "language_reviewed"],
  ["sec.dada.discussion.01", "discussion", "sec.dada", 1, "generated:discussion:sec:DaDA:01", "Divisibility introduction", "Pengantar keterbagian", 648, 650, 722, 724, "language_reviewed"],
  ["sec.dada.subsection.divisibility", "subsection", "sec.dada", 2, "generated:subsection:sec:DaDA:01", "Integer Divisibility", "Keterbagian Bilangan Bulat", 652, 730, 726, 809, "language_reviewed"],
  ["sec.dada.definition.divisibility", "definition", "sec.dada.subsection.divisibility", 1, "generated:definition:sec:DaDA:01", "Divisibility", "Keterbagian", 653, 664, 727, 740, "language_reviewed"],
  ["sec.dada.example.basic", "example", "sec.dada.subsection.divisibility", 2, "generated:example:sec:DaDA:01", "Basic divisibility examples", "Contoh dasar keterbagian", 666, 668, 742, 744, "language_reviewed"],
  ["sec.dada.definition.parity", "definition", "sec.dada.subsection.divisibility", 3, "generated:definition:sec:DaDA:02", "Even and odd integers", "Bilangan bulat genap dan ganjil", 670, 674, 746, 751, "language_reviewed"],
  ["sec.dada.discussion.parity", "discussion", "sec.dada.subsection.divisibility", 4, "generated:discussion:sec:DaDA:02", "Odd-integer representation", "Representasi bilangan bulat ganjil", 676, 679, 753, 757, "language_reviewed"],
  ["sec.dada.proposition.zero", "proposition", "sec.dada.subsection.divisibility", 5, "generated:proposition:sec:DaDA:01", "Every nonzero integer divides zero", "Setiap bilangan bulat tak nol membagi nol", 681, 682, 759, 760, "language_reviewed"],
  ["sec.dada.proposition.size", "proposition", "sec.dada.subsection.divisibility", 6, "generated:proposition:sec:DaDA:02", "Divisibility and size", "Keterbagian dan besar nilai", 683, 684, 761, 762, "language_reviewed"],
  ["sec.dada.proposition.absolute-value", "proposition", "sec.dada.subsection.divisibility", 7, "generated:proposition:sec:DaDA:03", "Divisibility and absolute value", "Keterbagian dan nilai mutlak", 685, 686, 763, 765, "language_reviewed"],
  ["sec.dada.theorem.transitivity", "theorem", "sec.dada.subsection.divisibility", 8, "generated:theorem:sec:DaDA:01", "Transitivity of divisibility", "Transitivitas keterbagian", 688, 691, 767, 770, "language_reviewed"],
  ["sec.dada.theorem.transitivity.proof", "proof", "sec.dada.theorem.transitivity", 1, "generated:proof:sec:DaDA:01", "Proof", "Bukti", 692, 695, 771, 774, "language_reviewed"],
  ["eg.divisibility", "example", "sec.dada.subsection.divisibility", 9, "eg:divisibility", "Divisibility transitivity example", "Contoh transitivitas keterbagian", 697, 699, 776, 778, "language_reviewed"],
  ["sec.dada.discussion.linear-combination", "discussion", "sec.dada.subsection.divisibility", 10, "generated:discussion:sec:DaDA:03", "Linear-combination introduction", "Pengantar kombinasi linear", 701, 704, 780, 783, "language_reviewed"],
  ["thm.divisibilitylincombs", "theorem", "sec.dada.subsection.divisibility", 11, "thm:divisibilitylincombs", "Divisibility of linear combinations", "Keterbagian kombinasi linear", 706, 708, 785, 788, "language_reviewed"],
  ["thm.divisibilitylincombs.proof", "proof", "thm.divisibilitylincombs", 1, "generated:proof:thm:divisibilitylincombs", "Proof", "Bukti", 709, 716, 789, 796, "language_reviewed"],
  ["sec.dada.discussion.finite-combination", "discussion", "sec.dada.subsection.divisibility", 12, "generated:discussion:sec:DaDA:04", "Finite linear combinations", "Kombinasi linear berhingga", 718, 730, 798, 809, "language_reviewed"],
  ["sec.dada.subsection.division-algorithm", "subsection", "sec.dada", 3, "generated:subsection:sec:DaDA:02", "The Division Algorithm", "Algoritma Pembagian", 732, 774, 811, 852, "language_reviewed"],
  ["thm.the-da", "theorem", "sec.dada.subsection.division-algorithm", 1, "thm:theDA", "The Division Algorithm", "Algoritma Pembagian", 734, 740, 813, 818, "language_reviewed"],
  ["thm.the-da.proof", "proof", "thm.the-da", 1, "generated:proof:thm:theDA", "Proof", "Bukti", 742, 770, 820, 848, "language_reviewed"],
  ["eg.arithmetic", "example", "sec.dada.subsection.division-algorithm", 2, "eg:arithmetic", "Quotient and remainder example", "Contoh hasil bagi dan sisa", 772, 774, 850, 852, "language_reviewed"],
  ["sec.dada.exercises", "exercise_group", "sec.dada", 4, "generated:exercise-group:sec:DaDA", "Exercises for Section 1.3", "Latihan untuk §1.3", 776, 828, 854, 911, "language_reviewed"],
  ["sec.dada.exercise.01", "exercise", "sec.dada.exercises", 1, "generated:exercise:sec:DaDA:01", "Exercise 1", "Latihan 1", 784, 786, 862, 864, "language_reviewed"],
  ["sec.dada.exercise.02", "exercise", "sec.dada.exercises", 2, "generated:exercise:sec:DaDA:02", "Exercise 2", "Latihan 2", 787, 790, 865, 868, "language_reviewed"],
  ["sec.dada.exercise.03", "exercise", "sec.dada.exercises", 3, "generated:exercise:sec:DaDA:03", "Exercise 3", "Latihan 3", 791, 794, 869, 872, "language_reviewed"],
  ["sec.dada.exercise.04", "exercise", "sec.dada.exercises", 4, "generated:exercise:sec:DaDA:04", "Exercise 4", "Latihan 4", 795, 798, 873, 876, "language_reviewed"],
  ["sec.dada.exercise.05", "exercise", "sec.dada.exercises", 5, "exer:sizeofdivisors", "Exercise 5", "Latihan 5", 799, 801, 877, 880, "language_reviewed"],
  ["sec.dada.exercise.06", "exercise", "sec.dada.exercises", 6, "generated:exercise:sec:DaDA:06", "Exercise 6", "Latihan 6", 802, 805, 881, 885, "language_reviewed"],
  ["sec.dada.exercise.07", "exercise", "sec.dada.exercises", 7, "generated:exercise:sec:DaDA:07", "Exercise 7", "Latihan 7", 806, 809, 886, 890, "language_reviewed"],
  ["sec.dada.exercise.08", "exercise", "sec.dada.exercises", 8, "generated:exercise:sec:DaDA:08", "Exercise 8", "Latihan 8", 810, 812, 891, 893, "language_reviewed"],
  ["sec.dada.exercise.09", "exercise", "sec.dada.exercises", 9, "generated:exercise:sec:DaDA:09", "Exercise 9", "Latihan 9", 813, 815, 894, 897, "language_reviewed"],
  ["sec.dada.exercise.10", "exercise", "sec.dada.exercises", 10, "generated:exercise:sec:DaDA:10", "Exercise 10", "Latihan 10", 816, 819, 898, 902, "language_reviewed"],
  ["sec.dada.exercise.11", "exercise", "sec.dada.exercises", 11, "generated:exercise:sec:DaDA:11", "Exercise 11", "Latihan 11", 820, 822, 903, 905, "language_reviewed"],
  ["sec.dada.exercise.12", "exercise", "sec.dada.exercises", 12, "generated:exercise:sec:DaDA:12", "Exercise 12", "Latihan 12", 823, 825, 906, 908, "language_reviewed"],
];

const parentByUnit = new Map(unitSpecs.map((spec) => [spec[0], spec[2]]));
function ancestry(suffix) {
  const result = [];
  const seen = new Set();
  let current = suffix;
  while (current) {
    if (seen.has(current)) throw new Error(`unit cycle at ${current}`);
    seen.add(current);
    result.unshift(unitId(current));
    current = parentByUnit.get(current);
  }
  return result;
}

function qaIdsForTargetUnit(suffix) {
  if (suffix === "sec.aowi") return [fixedQaIds.aowiTopology, fixedQaIds.aowiMath, fixedQaIds.aowiLanguage];
  if (suffix === "sec.dada" || suffix.startsWith("sec.dada.") || ["eg.divisibility", "thm.divisibilitylincombs", "thm.divisibilitylincombs.proof", "thm.the-da", "thm.the-da.proof", "eg.arithmetic"].includes(suffix)) {
    return [fixedQaIds.dadaTopology, fixedQaIds.dadaMath, fixedQaIds.dadaLanguage];
  }
  if (["book", "chap.woad"].includes(suffix)) {
    return [fixedQaIds.topology, fixedQaIds.math, fixedQaIds.language, fixedQaIds.aowiTopology, fixedQaIds.aowiMath, fixedQaIds.aowiLanguage, fixedQaIds.dadaTopology, fixedQaIds.dadaMath, fixedQaIds.dadaLanguage];
  }
  if (suffix.startsWith("backmatter")) return [fixedQaIds.build3, fixedQaIds.visual3];
  return [fixedQaIds.topology, fixedQaIds.math, fixedQaIds.language];
}

for (const spec of unitSpecs) {
  const [suffix, unitType, parentSuffix, order, sourceLocalId, titleEn, titleId, sourceStart, sourceEnd, targetStart, targetEnd, translationState, sourceKind = "authority"] = spec;
  const sourceBuffer = sourceKind === "refs" ? refsBytes : authorityBytes;
  const sourceOffsets = sourceKind === "refs" ? refsOffsets : authorityOffsets;
  const sourceFile = sourceKind === "refs" ? "authority/downloads/refs.bib" : "authority/downloads/yaintt.tex";
  const sourceSpan = span(sourceBuffer, sourceOffsets, sourceStart, sourceEnd);
  const targetSpan = targetStart ? span(targetBytes, targetOffsets, targetStart, targetEnd) : null;
  const record = baseRecord("unit", unitId(suffix), {
    edition_id: targetEditionId,
    locale: targetSpan ? "id-ID" : "en",
    unit_type: unitType,
    parent_unit_id: parentSuffix ? unitId(parentSuffix) : null,
    order,
    order_key: String(order).padStart(4, "0"),
    source_local_id: sourceLocalId,
    title_en: titleEn,
    title_id: titleId,
    source_locator: { path: sourceFile, start_line: sourceStart, end_line: sourceEnd },
    source_content_sha256: sourceSpan.sha256,
    target_locator: targetSpan ? { path: targetRelPath, start_line: targetStart, end_line: targetEnd } : undefined,
    target_content_sha256: targetSpan?.sha256,
    translation_state: translationState,
    rights_id: suffix === "frontmatter.preface.figure.license-badge"
      ? "rights.yaintt.license_badge"
      : targetSpan
        ? "rights.yaintt.id-id.derivative"
        : "rights.yaintt.text_and_author_assets",
    ancestry: ancestry(suffix),
    path: ancestry(suffix).join("/"),
    label_status: sourceLocalId.includes(":") && !sourceLocalId.startsWith("generated:") ? "source_label" : "generated_stable_id",
    assessment_closure: unitType === "exercise" ? { hints: [], answers: [], solutions: [], status: "source_has_none" } : null,
    target_disposition: suffix === "frontmatter.preface.figure.license-badge" ? "omitted_rights_unclosed" : null,
    qa_event_ids: targetSpan ? qaIdsForTargetUnit(suffix) : [fixedQaIds.source],
  });
  records.push(record);
}
if (unitSpecs.length !== 86) throw new Error(`expected 86 units, observed ${unitSpecs.length}`);

// Boundary 4 units are generated only from the immutable Boundary 4 reader.
// The legacy unit loop and its frozen target bindings above are intentionally
// untouched so every Boundary 3 object remains byte-identical by ID.
const boundary4UnitSpecs = [
  ["sec.roiidb", "section", "chap.woad", 4, "sec:RoIiDB", "Representations of Integers in Different Bases", "Representasi Bilangan Bulat dalam Berbagai Basis", 829, 989, 926, 1084],
  ["sec.roiidb.discussion.01", "discussion", "sec.roiidb", 1, "generated:discussion:sec:RoIiDB:01", "Base-representation introduction", "Pengantar representasi basis", 830, 840, 927, 938],
  ["thm.basebexpansion", "theorem", "sec.roiidb", 2, "thm:basebexpansion", "Unique base-b expansion", "Ekspansi basis b yang tunggal", 845, 853, 943, 952],
  ["thm.basebexpansion.proof", "proof", "thm.basebexpansion", 1, "generated:proof:thm:basebexpansion", "Proof", "Bukti", 854, 915, 953, 1011],
  ["def.baseb", "definition", "sec.roiidb", 3, "def:baseb", "Base-b representation", "Representasi basis b", 917, 942, 1013, 1039],
  ["eg.basetwo", "example", "sec.roiidb", 4, "eg:basetwo", "Convert 214 to base 3", "Mengubah 214 ke basis 3", 944, 956, 1041, 1052],
  ["eg.changebase", "example", "sec.roiidb", 5, "eg:changebase", "Convert base 7 to decimal", "Mengubah basis 7 ke desimal", 958, 962, 1054, 1057],
  ["sec.roiidb.exercises", "exercise_group", "sec.roiidb", 6, "generated:exercise-group:sec:RoIiDB", "Exercises for Section 1.4", "Latihan untuk §1.4", 964, 989, 1059, 1084],
  ["sec.roiidb.exercise.01", "exercise", "sec.roiidb.exercises", 1, "generated:exercise:sec:RoIiDB:01", "Exercise 1", "Latihan 1", 972, 974, 1067, 1069],
  ["sec.roiidb.exercise.02", "exercise", "sec.roiidb.exercises", 2, "generated:exercise:sec:RoIiDB:02", "Exercise 2", "Latihan 2", 975, 977, 1070, 1072],
  ["sec.roiidb.exercise.03", "exercise", "sec.roiidb.exercises", 3, "generated:exercise:sec:RoIiDB:03", "Exercise 3", "Latihan 3", 978, 980, 1073, 1075],
  ["sec.roiidb.exercise.04", "exercise", "sec.roiidb.exercises", 4, "generated:exercise:sec:RoIiDB:04", "Exercise 4", "Latihan 4", 981, 983, 1076, 1078],
  ["sec.roiidb.exercise.05", "exercise", "sec.roiidb.exercises", 5, "generated:exercise:sec:RoIiDB:05", "Exercise 5", "Latihan 5", 984, 986, 1079, 1081],
];
for (const spec of boundary4UnitSpecs) parentByUnit.set(spec[0], spec[2]);
for (const [suffix, unitType, parentSuffix, order, sourceLocalId, titleEn, titleId, sourceStart, sourceEnd, targetStart, targetEnd] of boundary4UnitSpecs) {
  const sourceSpan = span(authorityBytes, authorityOffsets, sourceStart, sourceEnd);
  const targetSpan = span(boundary4TargetBytes, boundary4TargetOffsets, targetStart, targetEnd);
  records.push(baseRecord("unit", unitId(suffix), {
    edition_id: boundary4EditionId,
    locale: "id-ID",
    unit_type: unitType,
    parent_unit_id: unitId(parentSuffix),
    order,
    order_key: String(order).padStart(4, "0"),
    source_local_id: sourceLocalId,
    title_en: titleEn,
    title_id: titleId,
    source_locator: { path: "authority/downloads/yaintt.tex", start_line: sourceStart, end_line: sourceEnd },
    source_content_sha256: sourceSpan.sha256,
    target_locator: { path: boundary4TargetRelPath, start_line: targetStart, end_line: targetEnd },
    target_content_sha256: targetSpan.sha256,
    translation_state: "language_reviewed",
    rights_id: boundary4RightsId,
    ancestry: ancestry(suffix),
    path: ancestry(suffix).join("/"),
    label_status: sourceLocalId.includes(":") && !sourceLocalId.startsWith("generated:") ? "source_label" : "generated_stable_id",
    assessment_closure: unitType === "exercise" ? { hints: [], answers: [], solutions: [], status: "source_has_none" } : null,
    target_disposition: null,
    qa_event_ids: [fixedQaIds.roiidbTopology, fixedQaIds.roiidbMath, fixedQaIds.roiidbLanguage],
  }));
}
if (boundary4UnitSpecs.length !== 13) throw new Error(`expected 13 Boundary 4 units, observed ${boundary4UnitSpecs.length}`);

const boundary5UnitSpecs = [
  ["sec.gcd", "section", "chap.woad", 5, "gcd", "The Greatest Common Divisor", "Faktor Persekutuan Terbesar", 990, 1218, 1099, 1342],
  ["sec.gcd.discussion.01", "discussion", "sec.gcd", 1, "generated:discussion:gcd:01", "Greatest-common-divisor introduction", "Pengantar faktor persekutuan terbesar", 991, 1001, 1100, 1110],
  ["sec.gcd.definition.greatest-common-divisor", "definition", "sec.gcd", 2, "generated:definition:gcd:01", "Greatest common divisor", "Faktor persekutuan terbesar", 1003, 1009, 1112, 1118],
  ["eg.gcda", "example", "sec.gcd", 3, "eg:gcda", "gcd of 24 and 18", "FPB 24 dan 18", 1011, 1013, 1120, 1123],
  ["sec.gcd.definition.relatively-prime", "definition", "sec.gcd", 4, "generated:definition:gcd:02", "Relatively prime integers", "Bilangan bulat relatif prima", 1015, 1018, 1125, 1128],
  ["eg.gcdb", "example", "sec.gcd", 5, "eg:gcdb", "9 and 16 are relatively prime", "9 dan 16 relatif prima", 1020, 1023, 1130, 1133],
  ["sec.gcd.discussion.02", "discussion", "sec.gcd", 6, "generated:discussion:gcd:02", "Signs and gcd normalization", "Tanda pembagi dan normalisasi FPB", 1025, 1033, 1135, 1144],
  ["thm.dividebygcd", "theorem", "sec.gcd", 7, "thm:dividebygcd", "Reduction by the gcd", "Reduksi dengan FPB", 1034, 1037, 1145, 1150],
  ["thm.dividebygcd.proof", "proof", "thm.dividebygcd", 1, "generated:proof:thm:dividebygcd", "Proof", "Bukti", 1038, 1052, 1151, 1165],
  ["sec.gcd.discussion.03", "discussion", "sec.gcd", 8, "generated:discussion:gcd:03", "GCD invariance introduction", "Pengantar invariansi FPB", 1054, 1058, 1167, 1171],
  ["sec.gcd.theorem.invariance", "theorem", "sec.gcd", 9, "generated:theorem:gcd:01", "GCD invariant under adding a multiple", "FPB invarian terhadap penambahan kelipatan", 1060, 1062, 1173, 1175],
  ["sec.gcd.theorem.invariance.proof", "proof", "sec.gcd.theorem.invariance", 1, "generated:proof:gcd:theorem:01", "Proof", "Bukti", 1064, 1078, 1177, 1192],
  ["eg.gcdc", "example", "sec.gcd", 10, "eg:gcdc", "GCD by subtracting a multiple", "FPB melalui pengurangan kelipatan", 1080, 1082, 1194, 1196],
  ["sec.gcd.discussion.04", "discussion", "sec.gcd", 11, "generated:discussion:gcd:04", "Linear-combination introduction", "Pengantar kombinasi linear", 1084, 1088, 1198, 1202],
  ["thm.gcdislincomb", "theorem", "sec.gcd", 12, "thm:gcdislincomb", "GCD as the least positive linear combination", "FPB sebagai kombinasi linear positif terkecil", 1090, 1094, 1204, 1208],
  ["thm.gcdislincomb.proof", "proof", "thm.gcdislincomb", 1, "generated:proof:thm:gcdislincomb", "Proof", "Bukti", 1096, 1128, 1210, 1244],
  ["sec.gcd.discussion.05", "discussion", "sec.gcd", 13, "generated:discussion:gcd:05", "Relatively-prime corollary introduction", "Pengantar akibat relatif prima", 1130, 1132, 1246, 1248],
  ["cor.intlincombrelprime", "corollary", "sec.gcd", 14, "cor:intlincombrelprime", "Linear combination equal to 1", "Kombinasi linear yang sama dengan 1", 1133, 1136, 1249, 1252],
  ["sec.gcd.definition.gcd-family", "definition", "sec.gcd", 15, "generated:definition:gcd:03", "GCD of a finite family", "FPB keluarga berhingga", 1138, 1142, 1254, 1259],
  ["sec.gcd.definition.mutually-relatively-prime", "definition", "sec.gcd", 16, "generated:definition:gcd:04", "Mutually relatively prime", "Relatif prima secara bersama-sama", 1143, 1147, 1260, 1265],
  ["eg.mutrelprime", "example", "sec.gcd", 17, "eg:mutrelprime", "Mutually relatively prime example", "Contoh relatif prima secara bersama-sama", 1149, 1152, 1267, 1270],
  ["sec.gcd.definition.pairwise-relatively-prime", "definition", "sec.gcd", 18, "generated:definition:gcd:05", "Pairwise relatively prime", "Relatif prima berpasangan", 1154, 1159, 1272, 1277],
  ["eg.pairwiserelprime", "example", "sec.gcd", 19, "eg:pairwiserelprime", "Pairwise relatively prime example", "Contoh relatif prima berpasangan", 1161, 1164, 1279, 1282],
  ["sec.gcd.proposition.pairwise-implies-mutual", "proposition", "sec.gcd", 20, "generated:proposition:gcd:01", "Pairwise coprimality implies mutual coprimality", "Relatif prima berpasangan mengakibatkan relatif prima bersama-sama", 1166, 1169, 1284, 1288],
  ["sec.gcd.exercises", "exercise_group", "sec.gcd", 21, "generated:exercise-group:gcd", "Exercises for Section 1.5", "Latihan untuk §1.5", 1171, 1218, 1290, 1342],
  ...Array.from({ length: 9 }, (_, index) => {
    const number = String(index + 1).padStart(2, "0");
    const sourceRanges = [[1179, 1182], [1183, 1186], [1187, 1190], [1191, 1194], [1195, 1198], [1199, 1202], [1203, 1206], [1207, 1210], [1211, 1215]];
    const targetRanges = [[1298, 1301], [1302, 1305], [1306, 1309], [1310, 1314], [1315, 1319], [1320, 1324], [1325, 1328], [1329, 1333], [1334, 1339]];
    return [`sec.gcd.exercise.${number}`, "exercise", "sec.gcd.exercises", index + 1, `generated:exercise:gcd:${number}`, `Exercise ${index + 1}`, `Latihan ${index + 1}`, ...sourceRanges[index], ...targetRanges[index]];
  }),
];
for (const spec of boundary5UnitSpecs) parentByUnit.set(spec[0], spec[2]);
for (const [suffix, unitType, parentSuffix, order, sourceLocalId, titleEn, titleId, sourceStart, sourceEnd, targetStart, targetEnd] of boundary5UnitSpecs) {
  const sourceSpan = span(authorityBytes, authorityOffsets, sourceStart, sourceEnd);
  const targetSpan = span(boundary5TargetBytes, boundary5TargetOffsets, targetStart, targetEnd);
  records.push(baseRecord("unit", unitId(suffix), {
    edition_id: boundary5EditionId,
    locale: "id-ID",
    unit_type: unitType,
    parent_unit_id: unitId(parentSuffix),
    order,
    order_key: String(order).padStart(4, "0"),
    source_local_id: sourceLocalId,
    title_en: titleEn,
    title_id: titleId,
    source_locator: { path: "authority/downloads/yaintt.tex", start_line: sourceStart, end_line: sourceEnd },
    source_content_sha256: sourceSpan.sha256,
    target_locator: { path: boundary5TargetRelPath, start_line: targetStart, end_line: targetEnd },
    target_content_sha256: targetSpan.sha256,
    translation_state: "language_reviewed",
    rights_id: boundary5RightsId,
    ancestry: ancestry(suffix),
    path: ancestry(suffix).join("/"),
    label_status: sourceLocalId.includes(":") && !sourceLocalId.startsWith("generated:") ? "source_label" : "generated_stable_id",
    assessment_closure: unitType === "exercise" ? { hints: [], answers: [], solutions: [], status: "source_has_none" } : null,
    target_disposition: null,
    qa_event_ids: [fixedQaIds.gcdTopology, fixedQaIds.gcdMath, fixedQaIds.gcdLanguage],
  }));
}
if (boundary5UnitSpecs.length !== 34) throw new Error(`expected 34 Boundary 5 units, observed ${boundary5UnitSpecs.length}`);

const boundary6UnitSpecs = [
  ["sec.ea", "section", "chap.woad", 6, "sec:EA", "The Euclidean Algorithm", "Algoritma Euklides", 1219, 1325, 1357, 1463],
  ["sec.ea.discussion.01", "discussion", "sec.ea", 1, "generated:discussion:sec:EA:01", "Euclidean-algorithm introduction", "Pengantar Algoritma Euklides", 1220, 1224, 1358, 1362],
  ["lem.gcdafterdivision", "lemma", "sec.ea", 2, "lem:gcdafterdivision", "GCD after one division step", "FPB setelah satu langkah pembagian", 1225, 1227, 1363, 1365],
  ["lem.gcdafterdivision.proof", "proof", "lem.gcdafterdivision", 1, "generated:proof:lem:gcdafterdivision", "Proof", "Bukti", 1228, 1230, 1366, 1369],
  ["sec.ea.discussion.02", "discussion", "sec.ea", 3, "generated:discussion:sec:EA:02", "Last-nonzero-remainder formulation", "Rumusan sisa taknol terakhir", 1232, 1236, 1371, 1375],
  ["thm.euclideanalg", "theorem", "sec.ea", 4, "thm:euclideanalg", "Euclidean and extended Euclidean algorithms", "Algoritma Euklides dan Algoritma Euklides diperluas", 1238, 1247, 1377, 1388],
  ["thm.euclideanalg.proof", "proof", "thm.euclideanalg", 1, "generated:proof:thm:euclideanalg", "Proof", "Bukti", 1248, 1266, 1389, 1401],
  ["sec.ea.note.extended-algorithm", "note", "sec.ea", 5, "generated:note:sec:EA:01", "Extended-algorithm terminology", "Terminologi algoritma diperluas", 1267, 1269, 1402, 1404],
  ["sec.ea.discussion.03", "discussion", "sec.ea", 6, "generated:discussion:sec:EA:03", "Deferred coefficient proof", "Bukti koefisien yang ditunda", 1271, 1275, 1406, 1410],
  ["eg.ea", "example", "sec.ea", 7, "eg:EA", "GCD of 4147 and 10672", "FPB 4147 dan 10672", 1277, 1290, 1412, 1425],
  ["sec.ea.exercises", "exercise_group", "sec.ea", 8, "generated:exercise-group:sec:EA", "Exercises for Section 1.6", "Latihan untuk §1.6", 1292, 1325, 1427, 1463],
  ...Array.from({ length: 6 }, (_, index) => {
    const number = String(index + 1).padStart(2, "0");
    const sourceRanges = [[1300, 1304], [1305, 1309], [1310, 1313], [1314, 1317], [1318, 1321], [1322, 1324]];
    const targetRanges = [[1435, 1440], [1441, 1446], [1447, 1450], [1451, 1455], [1456, 1459], [1460, 1462]];
    return [`sec.ea.exercise.${number}`, "exercise", "sec.ea.exercises", index + 1, `generated:exercise:sec:EA:${number}`, `Exercise ${index + 1}`, `Latihan ${index + 1}`, ...sourceRanges[index], ...targetRanges[index]];
  }),
];
for (const spec of boundary6UnitSpecs) parentByUnit.set(spec[0], spec[2]);
for (const [suffix, unitType, parentSuffix, order, sourceLocalId, titleEn, titleId, sourceStart, sourceEnd, targetStart, targetEnd] of boundary6UnitSpecs) {
  const sourceSpan = span(authorityBytes, authorityOffsets, sourceStart, sourceEnd);
  const targetSpan = span(boundary6TargetBytes, boundary6TargetOffsets, targetStart, targetEnd);
  records.push(baseRecord("unit", unitId(suffix), {
    edition_id: boundary6EditionId,
    locale: "id-ID",
    unit_type: unitType,
    parent_unit_id: unitId(parentSuffix),
    order,
    order_key: String(order).padStart(4, "0"),
    source_local_id: sourceLocalId,
    title_en: titleEn,
    title_id: titleId,
    source_locator: { path: "authority/downloads/yaintt.tex", start_line: sourceStart, end_line: sourceEnd },
    source_content_sha256: sourceSpan.sha256,
    target_locator: { path: boundary6TargetRelPath, start_line: targetStart, end_line: targetEnd },
    target_content_sha256: targetSpan.sha256,
    translation_state: "language_reviewed",
    rights_id: boundary6RightsId,
    ancestry: ancestry(suffix),
    path: ancestry(suffix).join("/"),
    label_status: sourceLocalId.includes(":") && !sourceLocalId.startsWith("generated:") ? "source_label" : "generated_stable_id",
    assessment_closure: unitType === "exercise" ? { hints: [], answers: [], solutions: [], status: "source_has_none" } : null,
    target_disposition: null,
    qa_event_ids: [fixedQaIds.eaTopology, fixedQaIds.eaMath, fixedQaIds.eaLanguage],
  }));
}
if (boundary6UnitSpecs.length !== 17) throw new Error(`expected 17 Boundary 6 units, observed ${boundary6UnitSpecs.length}`);

const boundary7UnitSpecs = [
  ["chap.cs", "chapter", "book", 3, "chap:Cs", "Congruences", "Kongruensi", 1326, 1621, 1479, 1795],
  ["chap.cs.discussion.01", "discussion", "chap.cs", 1, "generated:discussion:chap:Cs:01", "Chapter introduction", "Pengantar bab", 1328, 1339, 1481, 1493],
  ["sec.itc", "section", "chap.cs", 2, "sec:ItC", "Introduction to Congruences", "Pengantar Kongruensi", 1341, 1621, 1495, 1795],
  ["sec.itc.discussion.01", "discussion", "sec.itc", 1, "generated:discussion:sec:ItC:01", "Historical context", "Konteks sejarah", 1342, 1345, 1496, 1499],
  ["def.congruence", "definition", "sec.itc", 2, "generated:definition:sec:ItC:01", "Congruence modulo n", "Kongruensi modulo n", 1346, 1350, 1500, 1505],
  ["eg.congruences", "example", "sec.itc", 3, "eg:congruences", "Elementary congruence examples", "Contoh kongruensi dasar", 1352, 1355, 1507, 1510],
  ["sec.itc.discussion.02", "discussion", "sec.itc", 4, "generated:discussion:sec:ItC:02", "Congruence and equality", "Kongruensi dan kesamaan", 1357, 1359, 1512, 1514],
  ["thm.basiccongprops", "theorem", "sec.itc", 5, "thm:basiccongprops", "Basic properties of congruence", "Sifat-sifat dasar kongruensi", 1361, 1378, 1516, 1534],
  ["thm.basiccongprops.proof", "proof", "thm.basiccongprops", 1, "generated:proof:thm:basiccongprops", "Proof", "Bukti", 1379, 1469, 1535, 1626],
  ["sec.itc.discussion.03", "discussion", "sec.itc", 6, "generated:discussion:sec:ItC:03", "Coprime-factor divisibility result", "Hasil keterbagian dengan faktor relatif prima", 1471, 1473, 1628, 1630],
  ["thm.combing", "theorem", "sec.itc", 7, "thm:combing", "Divisibility by a product of coprime factors", "Keterbagian oleh hasil kali faktor relatif prima", 1474, 1478, 1631, 1635],
  ["thm.combing.proof", "proof", "thm.combing", 1, "generated:proof:thm:combing", "Proof", "Bukti", 1479, 1487, 1636, 1644],
  ["eg.congarith", "example", "sec.itc", 8, "eg:congarith", "Congruence arithmetic examples", "Contoh aritmetika kongruensi", 1489, 1507, 1646, 1668],
  ["sec.itc.discussion.04", "discussion", "sec.itc", 9, "generated:discussion:sec:ItC:04", "Introduction to Euclid's Lemma", "Pengantar Lemma Euklides", 1509, 1512, 1670, 1673],
  ["lem.euclids", "lemma", "sec.itc", 10, "lem:euclids", "Euclid's Lemma", "Lemma Euklides", 1513, 1517, 1674, 1679],
  ["lem.euclids.proof", "proof", "lem.euclids", 1, "generated:proof:lem:euclids", "Proof", "Bukti", 1518, 1523, 1680, 1685],
  ["sec.itc.discussion.05", "discussion", "sec.itc", 11, "generated:discussion:sec:ItC:05", "Dividing congruences", "Membagi kongruensi", 1525, 1532, 1687, 1694],
  ["thm.congcanc", "theorem", "sec.itc", 12, "thm:congcanc", "Cancellation in congruences", "Pencoretan dalam kongruensi", 1534, 1545, 1696, 1709],
  ["thm.congcanc.proof", "proof", "thm.congcanc", 1, "generated:proof:thm:congcanc", "Proof", "Bukti", 1546, 1560, 1710, 1725],
  ["eg.solvcongs", "example", "sec.itc", 13, "eg:solvcongs", "Cancelling a congruence", "Mencoret faktor dalam kongruensi", 1562, 1565, 1727, 1731],
  ["sec.itc.discussion.06", "discussion", "sec.itc", 14, "generated:discussion:sec:ItC:06", "Counting zero congruence classes", "Menghitung kelas kongruensi nol", 1567, 1569, 1733, 1735],
  ["thm.numzerosmodafactor", "theorem", "sec.itc", 15, "thm:numzerosmodafactor", "Number of zero classes modulo a factor", "Banyaknya kelas nol modulo suatu faktor", 1570, 1574, 1736, 1740],
  ["thm.numzerosmodafactor.proof", "proof", "thm.numzerosmodafactor", 1, "generated:proof:thm:numzerosmodafactor", "Proof", "Bukti", 1575, 1591, 1741, 1761],
  ["sec.itc.exercises", "exercise_group", "sec.itc", 16, "generated:exercise-group:sec:ItC", "Exercises for Section 2.1", "Latihan untuk §2.1", 1593, 1621, 1763, 1795],
  ["sec.itc.exercise.01", "exercise", "sec.itc.exercises", 1, "generated:exercise:sec:ItC:01", "Exercise 1", "Latihan 1", 1601, 1603, 1771, 1773],
  ["sec.itc.exercise.02", "exercise", "sec.itc.exercises", 2, "generated:exercise:sec:ItC:02", "Exercise 2", "Latihan 2", 1604, 1606, 1774, 1777],
  ["sec.itc.exercise.03", "exercise", "sec.itc.exercises", 3, "generated:exercise:sec:ItC:03", "Exercise 3", "Latihan 3", 1607, 1610, 1778, 1781],
  ["sec.itc.exercise.04", "exercise", "sec.itc.exercises", 4, "generated:exercise:sec:ItC:04", "Exercise 4", "Latihan 4", 1611, 1615, 1782, 1787],
  ["sec.itc.exercise.05", "exercise", "sec.itc.exercises", 5, "generated:exercise:sec:ItC:05", "Exercise 5", "Latihan 5", 1616, 1618, 1788, 1791],
];
for (const spec of boundary7UnitSpecs) parentByUnit.set(spec[0], spec[2]);
for (const [suffix, unitType, parentSuffix, order, sourceLocalId, titleEn, titleId, sourceStart, sourceEnd, targetStart, targetEnd] of boundary7UnitSpecs) {
  const sourceSpan = span(authorityBytes, authorityOffsets, sourceStart, sourceEnd);
  const targetSpan = span(boundary7TargetBytes, boundary7TargetOffsets, targetStart, targetEnd);
  records.push(baseRecord("unit", unitId(suffix), {
    edition_id: boundary7EditionId,
    locale: "id-ID",
    unit_type: unitType,
    parent_unit_id: unitId(parentSuffix),
    order,
    order_key: String(order).padStart(4, "0"),
    source_local_id: sourceLocalId,
    title_en: titleEn,
    title_id: titleId,
    source_locator: { path: "authority/downloads/yaintt.tex", start_line: sourceStart, end_line: sourceEnd },
    source_content_sha256: sourceSpan.sha256,
    target_locator: { path: boundary7TargetRelPath, start_line: targetStart, end_line: targetEnd },
    target_content_sha256: targetSpan.sha256,
    translation_state: "language_reviewed",
    rights_id: boundary7RightsId,
    ancestry: ancestry(suffix),
    path: ancestry(suffix).join("/"),
    label_status: sourceLocalId.includes(":") && !sourceLocalId.startsWith("generated:") ? "source_label" : "generated_stable_id",
    assessment_closure: unitType === "exercise" ? { hints: [], answers: [], solutions: [], status: "source_has_none" } : null,
    target_disposition: null,
    qa_event_ids: [fixedQaIds.itcTopology, fixedQaIds.itcMath, fixedQaIds.itcLanguage],
  }));
}
if (boundary7UnitSpecs.length !== 29) throw new Error(`expected 29 Boundary 7 content units, observed ${boundary7UnitSpecs.length}`);

const boundary7BibliographySuffix = "bib.gauss1986disquisitiones";
parentByUnit.set(boundary7BibliographySuffix, "backmatter.bibliography");
const boundary7BibliographySpan = span(refsBytes, refsOffsets, 43, 48);
if (boundary7BibliographySpan.bytes.length !== 225 || boundary7BibliographySpan.sha256 !== "22797e80659b695b625837855d5f4c960734f93e9e02e9a6334c72822bfc4205") throw new Error("Boundary 7 Gauss bibliography witness drift");
records.push(baseRecord("unit", unitId(boundary7BibliographySuffix), {
  edition_id: boundary7EditionId,
  locale: "en",
  unit_type: "bibliography_entry",
  parent_unit_id: unitId("backmatter.bibliography"),
  order: 4,
  order_key: "0004",
  source_local_id: "gauss1986disquisitiones",
  title_en: "Gauss 1986",
  title_id: "Gauss 1986",
  source_locator: { path: "authority/downloads/refs.bib", start_line: 43, end_line: 48 },
  source_content_sha256: boundary7BibliographySpan.sha256,
  translation_state: "source_frozen",
  rights_id: "rights.yaintt.text_and_author_assets",
  ancestry: ancestry(boundary7BibliographySuffix),
  path: ancestry(boundary7BibliographySuffix).join("/"),
  label_status: "generated_stable_id",
  assessment_closure: null,
  target_disposition: null,
  qa_event_ids: [fixedQaIds.source],
}));

const boundary8UnitSpecs = [
  ["sec.lc", "section", "chap.cs", 3, "sec:LC", "Linear Congruences", "Kongruensi Linear", 1622, 1772, 1810, 1982],
  ["sec.lc.discussion.01", "discussion", "sec.lc", 1, "generated:discussion:sec:LC:01", "Linear-congruence introduction", "Pengantar kongruensi linear", 1623, 1630, 1811, 1819],
  ["def.linearcongruence", "definition", "sec.lc", 2, "generated:definition:sec:LC:01", "Linear congruence in one variable", "Kongruensi linear dalam satu peubah", 1631, 1635, 1820, 1824],
  ["sec.lc.discussion.02", "discussion", "sec.lc", 3, "generated:discussion:sec:LC:02", "Infinitely many integer representatives", "Tak terhingga banyak wakil bilangan bulat", 1637, 1639, 1826, 1829],
  ["thm.linearcongruencesameclass", "theorem", "sec.lc", 4, "generated:theorem:sec:LC:01", "Solutions are stable within a congruence class", "Solusi tetap berlaku dalam satu kelas kongruensi", 1641, 1645, 1831, 1836],
  ["sec.lc.discussion.03", "discussion", "sec.lc", 5, "generated:discussion:sec:LC:03", "Historical Diophantine framing", "Kerangka Diofantin historis", 1647, 1649, 1838, 1841],
  ["def.diophantine", "definition", "sec.lc", 6, "generated:definition:sec:LC:02", "Diophantine equation", "Persamaan Diofantin", 1650, 1653, 1842, 1846],
  ["sec.lc.discussion.04", "discussion", "sec.lc", 7, "generated:discussion:sec:LC:04", "Congruences as Diophantine equations", "Kongruensi sebagai persamaan Diofantin", 1654, 1662, 1847, 1855],
  ["thm.basiclincongs", "theorem", "sec.lc", 8, "thm:basiclincongs", "Existence and number of linear-congruence solutions", "Keberadaan dan banyaknya solusi kongruensi linear", 1663, 1675, 1856, 1869],
  ["thm.basiclincongs.proof", "proof", "thm.basiclincongs", 1, "generated:proof:thm:basiclincongs", "Proof", "Bukti", 1677, 1698, 1871, 1904],
  ["rem.uniqsolnlincong", "remark", "sec.lc", 9, "rem:uniqsolnlincong", "Unique solution for a coprime coefficient", "Solusi tunggal untuk koefisien relatif prima", 1700, 1705, 1906, 1912],
  ["eg.multiplesolscongs", "example", "sec.lc", 10, "eg:multiplesolscongs", "Three solution classes modulo 6", "Tiga kelas solusi modulo 6", 1707, 1715, 1914, 1925],
  ["sec.lc.discussion.05", "discussion", "sec.lc", 11, "generated:discussion:sec:LC:05", "Introduction to modular inverses", "Pengantar invers modular", 1717, 1722, 1927, 1932],
  ["def.modularinverse", "definition", "sec.lc", 12, "generated:definition:sec:LC:03", "Inverse modulo n", "Invers modulo n", 1724, 1730, 1934, 1940],
  ["sec.lc.discussion.06", "discussion", "sec.lc", 13, "generated:discussion:sec:LC:06", "Modular-inverse existence bridge", "Jembatan keberadaan invers modular", 1732, 1736, 1942, 1946],
  ["cor.modinv", "corollary", "sec.lc", 14, "cor:modinv", "Existence and uniqueness of modular inverses", "Keberadaan dan ketunggalan invers modular", 1737, 1741, 1947, 1951],
  ["eg.modinverses", "example", "sec.lc", 15, "eg:modinverses", "Inverse of 7 modulo 48", "Invers 7 modulo 48", 1743, 1746, 1953, 1956],
  ["sec.lc.exercises", "exercise_group", "sec.lc", 16, "generated:exercise-group:sec:LC", "Exercises for Section 2.2", "Latihan untuk §2.2", 1748, 1772, 1958, 1982],
  ["sec.lc.exercise.01", "exercise", "sec.lc.exercises", 1, "generated:exercise:sec:LC:01", "Exercise 1", "Latihan 1", 1756, 1758, 1966, 1968],
  ["sec.lc.exercise.02", "exercise", "sec.lc.exercises", 2, "generated:exercise:sec:LC:02", "Exercise 2", "Latihan 2", 1759, 1761, 1969, 1971],
  ["sec.lc.exercise.03", "exercise", "sec.lc.exercises", 3, "generated:exercise:sec:LC:03", "Exercise 3", "Latihan 3", 1762, 1764, 1972, 1974],
  ["sec.lc.exercise.04", "exercise", "sec.lc.exercises", 4, "generated:exercise:sec:LC:04", "Exercise 4", "Latihan 4", 1765, 1769, 1975, 1979],
];
for (const spec of boundary8UnitSpecs) parentByUnit.set(spec[0], spec[2]);
for (const [suffix, unitType, parentSuffix, order, sourceLocalId, titleEn, titleId, sourceStart, sourceEnd, targetStart, targetEnd] of boundary8UnitSpecs) {
  const sourceSpan = span(authorityBytes, authorityOffsets, sourceStart, sourceEnd);
  const targetSpan = span(boundary8TargetBytes, boundary8TargetOffsets, targetStart, targetEnd);
  records.push(baseRecord("unit", unitId(suffix), {
    edition_id: boundary8EditionId,
    locale: "id-ID",
    unit_type: unitType,
    parent_unit_id: unitId(parentSuffix),
    order,
    order_key: String(order).padStart(4, "0"),
    source_local_id: sourceLocalId,
    title_en: titleEn,
    title_id: titleId,
    source_locator: { path: "authority/downloads/yaintt.tex", start_line: sourceStart, end_line: sourceEnd },
    source_content_sha256: sourceSpan.sha256,
    target_locator: { path: boundary8TargetRelPath, start_line: targetStart, end_line: targetEnd },
    target_content_sha256: targetSpan.sha256,
    translation_state: "language_reviewed",
    rights_id: boundary8RightsId,
    ancestry: ancestry(suffix),
    path: ancestry(suffix).join("/"),
    label_status: sourceLocalId.includes(":") && !sourceLocalId.startsWith("generated:") ? "source_label" : "generated_stable_id",
    assessment_closure: unitType === "exercise" ? { hints: [], answers: [], solutions: [], status: "source_has_none" } : null,
    target_disposition: null,
    qa_event_ids: [fixedQaIds.lcTopology, fixedQaIds.lcMath, fixedQaIds.lcLanguage],
  }));
}
if (boundary8UnitSpecs.length !== 22) throw new Error(`expected 22 Boundary 8 content units, observed ${boundary8UnitSpecs.length}`);

const boundary9UnitSpecs = [
  ["sec.crt", "section", "chap.cs", 4, "sec:CRT", "The Chinese Remainder Theorem", "Teorema Sisa Cina", 1773, 1876, 1998, 2102],
  ["sec.crt.discussion.01", "discussion", "sec.crt", 1, "generated:discussion:sec:CRT:01", "Systems with different moduli", "Sistem dengan modulus berbeda", 1774, 1781, 1999, 2005],
  ["thm.chinese-remainder", "theorem", "sec.crt", 2, "generated:theorem:sec:CRT:01", "Chinese Remainder Theorem", "Teorema Sisa Cina", 1782, 1795, 2006, 2019],
  ["thm.chinese-remainder.proof", "proof", "thm.chinese-remainder", 1, "generated:proof:theorem:sec:CRT:01", "Proof", "Bukti", 1797, 1824, 2021, 2049],
  ["eg.systemofcongs", "example", "sec.crt", 3, "eg:systemofcongs", "Solving a three-modulus system", "Menyelesaikan sistem dengan tiga modulus", 1826, 1843, 2051, 2068],
  ["sec.crt.exercises", "exercise_group", "sec.crt", 4, "generated:exercise-group:sec:CRT", "Exercises for Section 2.3", "Latihan untuk §2.3", 1845, 1876, 2070, 2102],
  ["sec.crt.exercise.01", "exercise", "sec.crt.exercises", 1, "generated:exercise:sec:CRT:01", "Exercise 1", "Latihan 1", 1853, 1856, 2078, 2081],
  ["sec.crt.exercise.02", "exercise", "sec.crt.exercises", 2, "generated:exercise:sec:CRT:02", "Exercise 2", "Latihan 2", 1857, 1860, 2082, 2085],
  ["sec.crt.exercise.03", "exercise", "sec.crt.exercises", 3, "generated:exercise:sec:CRT:03", "Exercise 3", "Latihan 3", 1861, 1864, 2086, 2089],
  ["sec.crt.exercise.04", "exercise", "sec.crt.exercises", 4, "generated:exercise:sec:CRT:04", "Exercise 4", "Latihan 4", 1865, 1873, 2090, 2099],
];
for (const spec of boundary9UnitSpecs) parentByUnit.set(spec[0], spec[2]);
for (const [suffix, unitType, parentSuffix, order, sourceLocalId, titleEn, titleId, sourceStart, sourceEnd, targetStart, targetEnd] of boundary9UnitSpecs) {
  const sourceSpan = span(authorityBytes, authorityOffsets, sourceStart, sourceEnd);
  const targetSpan = span(boundary9TargetBytes, boundary9TargetOffsets, targetStart, targetEnd);
  records.push(baseRecord("unit", unitId(suffix), {
    edition_id: boundary9EditionId,
    locale: "id-ID",
    unit_type: unitType,
    parent_unit_id: unitId(parentSuffix),
    order,
    order_key: String(order).padStart(4, "0"),
    source_local_id: sourceLocalId,
    title_en: titleEn,
    title_id: titleId,
    source_locator: { path: "authority/downloads/yaintt.tex", start_line: sourceStart, end_line: sourceEnd },
    source_content_sha256: sourceSpan.sha256,
    target_locator: { path: boundary9TargetRelPath, start_line: targetStart, end_line: targetEnd },
    target_content_sha256: targetSpan.sha256,
    translation_state: "language_reviewed",
    rights_id: boundary9RightsId,
    ancestry: ancestry(suffix),
    path: ancestry(suffix).join("/"),
    label_status: sourceLocalId.includes(":") && !sourceLocalId.startsWith("generated:") ? "source_label" : "generated_stable_id",
    assessment_closure: unitType === "exercise" ? { hints: [], answers: [], solutions: [], status: "source_has_none" } : null,
    target_disposition: null,
    qa_event_ids: [fixedQaIds.crtTopology, fixedQaIds.crtMath, fixedQaIds.crtLanguage],
  }));
}
if (boundary9UnitSpecs.length !== 10) throw new Error(`expected 10 Boundary 9 content units, observed ${boundary9UnitSpecs.length}`);

const boundary10UnitSpecs = [
  ["sec.awtwwc", "section", "chap.cs", 5, "sec:AWtWwC", "Another Way to Work with Congruences: Equivalence Classes", "Cara Lain Menangani Kongruensi: Kelas Ekuivalensi", 1877, 2085, 2114, 2332],
  ["sec.awtwwc.discussion.01", "discussion", "sec.awtwwc", 1, "generated:discussion:sec:AWtWwC:01", "Equivalence-relation motivation", "Motivasi relasi ekuivalensi", 1879, 1882, 2116, 2119],
  ["def.equivalence-relation", "definition", "sec.awtwwc", 2, "generated:definition:sec:AWtWwC:01", "Equivalence relation and equivalence class", "Relasi ekuivalensi dan kelas ekuivalensi", 1884, 1903, 2121, 2140],
  ["thm.equivalence-classes-disjoint-or-equal", "theorem", "sec.awtwwc", 3, "generated:theorem:sec:AWtWwC:01", "Equivalence classes are disjoint or equal", "Kelas ekuivalensi saling lepas atau sama", 1905, 1912, 2142, 2150],
  ["thm.equivalence-classes-disjoint-or-equal.proof", "proof", "thm.equivalence-classes-disjoint-or-equal", 1, "generated:proof:theorem:sec:AWtWwC:01", "Proof", "Bukti", 1913, 1928, 2151, 2169],
  ["eg.rationals", "example", "sec.awtwwc", 4, "eg:rationals", "Rational numbers as equivalence classes", "Bilangan rasional sebagai kelas ekuivalensi", 1930, 1934, 2171, 2175],
  ["sec.awtwwc.discussion.02", "discussion", "sec.awtwwc", 5, "generated:discussion:sec:AWtWwC:02", "Congruence as an equivalence relation", "Kongruensi sebagai relasi ekuivalensi", 1936, 1939, 2177, 2179],
  ["prop.congruence-equivalence-relation", "proposition", "sec.awtwwc", 6, "generated:proposition:sec:AWtWwC:01", "Congruence modulo n is an equivalence relation", "Kongruensi modulo n adalah relasi ekuivalensi", 1941, 1948, 2181, 2188],
  ["def.integers-mod-n", "definition", "sec.awtwwc", 7, "generated:definition:sec:AWtWwC:02", "Integers modulo n", "Bilangan bulat modulo n", 1950, 1957, 2190, 2197],
  ["thm.integers-mod-n-representatives", "theorem", "sec.awtwwc", 8, "generated:theorem:sec:AWtWwC:02", "Representatives of the integers modulo n", "Wakil bilangan bulat modulo n", 1959, 1966, 2199, 2207],
  ["thm.integers-mod-n-representatives.proof", "proof", "thm.integers-mod-n-representatives", 1, "generated:proof:theorem:sec:AWtWwC:02", "Proof", "Bukti", 1968, 1975, 2209, 2218],
  ["sec.awtwwc.discussion.03", "discussion", "sec.awtwwc", 9, "generated:discussion:sec:AWtWwC:03", "Arithmetic on congruence classes", "Aritmetika pada kelas kongruensi", 1977, 1981, 2220, 2224],
  ["def.congruence-class-operations", "definition", "sec.awtwwc", 10, "generated:definition:sec:AWtWwC:03", "Addition and multiplication of congruence classes", "Penjumlahan dan perkalian kelas kongruensi", 1983, 1989, 2226, 2232],
  ["thm.plustimeswelldefined", "theorem", "sec.awtwwc", 11, "thm:plustimeswelldefined", "Congruence-class operations are well-defined", "Operasi kelas kongruensi terdefinisi dengan baik", 1991, 1995, 2234, 2238],
  ["thm.plustimeswelldefined.proof", "proof", "thm.plustimeswelldefined", 1, "generated:proof:thm:plustimeswelldefined", "Proof", "Bukti", 1996, 2004, 2239, 2247],
  ["sec.awtwwc.discussion.04", "discussion", "sec.awtwwc", 12, "generated:discussion:sec:AWtWwC:04", "Arithmetic properties inherited by congruence classes", "Sifat aritmetika yang diwarisi kelas kongruensi", 2006, 2008, 2249, 2251],
  ["thm.plustimesproperties", "theorem", "sec.awtwwc", 13, "thm:plustimesproperties", "Arithmetic laws in the integers modulo n", "Hukum aritmetika dalam bilangan bulat modulo n", 2009, 2023, 2252, 2266],
  ["thm.plustimesproperties.proof", "proof", "thm.plustimesproperties", 1, "generated:proof:thm:plustimesproperties", "Proof", "Bukti", 2024, 2027, 2267, 2271],
  ["sec.awtwwc.discussion.05", "discussion", "sec.awtwwc", 14, "generated:discussion:sec:AWtWwC:05", "Linear congruences as class equations", "Kongruensi linear sebagai persamaan kelas", 2029, 2033, 2273, 2277],
  ["thm.linear-congruence-classes", "theorem", "sec.awtwwc", 15, "generated:theorem:sec:AWtWwC:03", "Solutions of a linear equation in congruence classes", "Solusi persamaan linear dalam kelas kongruensi", 2034, 2045, 2278, 2290],
  ["thm.linear-congruence-classes.proof", "proof", "thm.linear-congruence-classes", 1, "generated:proof:theorem:sec:AWtWwC:03", "Proof", "Bukti", 2046, 2049, 2291, 2294],
  ["sec.awtwwc.exercises", "exercise_group", "sec.awtwwc", 16, "generated:exercise-group:sec:AWtWwC", "Exercises for Section 2.4", "Latihan untuk §2.4", 2051, 2085, 2296, 2332],
  ["sec.awtwwc.exercise.01", "exercise", "sec.awtwwc.exercises", 1, "generated:exercise:sec:AWtWwC:01", "Exercise 1", "Latihan 1", 2059, 2070, 2304, 2316],
  ["sec.awtwwc.exercise.02", "exercise", "sec.awtwwc.exercises", 2, "generated:exercise:sec:AWtWwC:02", "Exercise 2", "Latihan 2", 2071, 2074, 2317, 2320],
  ["sec.awtwwc.exercise.03", "exercise", "sec.awtwwc.exercises", 3, "generated:exercise:sec:AWtWwC:03", "Exercise 3", "Latihan 3", 2075, 2077, 2321, 2324],
  ["sec.awtwwc.exercise.04", "exercise", "sec.awtwwc.exercises", 4, "generated:exercise:sec:AWtWwC:04", "Exercise 4", "Latihan 4", 2078, 2082, 2325, 2329],
];
for (const spec of boundary10UnitSpecs) parentByUnit.set(spec[0], spec[2]);
for (const [suffix, unitType, parentSuffix, order, sourceLocalId, titleEn, titleId, sourceStart, sourceEnd, targetStart, targetEnd] of boundary10UnitSpecs) {
  const sourceSpan = span(authorityBytes, authorityOffsets, sourceStart, sourceEnd);
  const targetSpan = span(boundary10TargetBytes, boundary10TargetOffsets, targetStart, targetEnd);
  records.push(baseRecord("unit", unitId(suffix), {
    edition_id: boundary10EditionId,
    locale: "id-ID",
    unit_type: unitType,
    parent_unit_id: unitId(parentSuffix),
    order,
    order_key: String(order).padStart(4, "0"),
    source_local_id: sourceLocalId,
    title_en: titleEn,
    title_id: titleId,
    source_locator: { path: "authority/downloads/yaintt.tex", start_line: sourceStart, end_line: sourceEnd },
    source_content_sha256: sourceSpan.sha256,
    target_locator: { path: boundary10TargetRelPath, start_line: targetStart, end_line: targetEnd },
    target_content_sha256: targetSpan.sha256,
    translation_state: "language_reviewed",
    rights_id: boundary10RightsId,
    ancestry: ancestry(suffix),
    path: ancestry(suffix).join("/"),
    label_status: sourceLocalId.includes(":") && !sourceLocalId.startsWith("generated:") ? "source_label" : "generated_stable_id",
    assessment_closure: unitType === "exercise" ? { hints: [], answers: [], solutions: [], status: "source_has_none" } : null,
    target_disposition: null,
    qa_event_ids: [fixedQaIds.awtwwcTopology, fixedQaIds.awtwwcMath, fixedQaIds.awtwwcLanguage],
  }));
}
if (boundary10UnitSpecs.length !== 26) throw new Error(`expected 26 Boundary 10 content units, observed ${boundary10UnitSpecs.length}`);

const boundary11UnitSpecs = [
  ["sec.ephif", "section", "chap.cs", 6, "sec:EphiF", "Euler's phi Function", "Fungsi phi Euler", 2086, 2210, 2344, 2490],
  ["sec.ephif.discussion.01", "discussion", "sec.ephif", 1, "generated:discussion:sec:EphiF:01", "Counting relatively prime residues", "Menghitung residu yang relatif prima", 2088, 2090, 2346, 2348],
  ["def.euler-phi", "definition", "sec.ephif", 2, "generated:definition:sec:EphiF:01", "Euler's phi function", "Fungsi phi Euler", 2091, 2104, 2349, 2362],
  ["sec.ephif.discussion.02", "discussion", "sec.ephif", 3, "generated:discussion:sec:EphiF:02", "Phi as a count of invertible classes", "Phi sebagai banyaknya kelas yang dapat dibalik", 2106, 2108, 2364, 2366],
  ["thm.euler-phi-counts-units", "theorem", "sec.ephif", 4, "generated:theorem:sec:EphiF:01", "Euler phi counts the units modulo n", "Phi Euler menghitung unit modulo n", 2110, 2114, 2368, 2372],
  ["thm.euler-phi-counts-units.proof", "proof", "thm.euler-phi-counts-units", 1, "generated:proof:theorem:sec:EphiF:01", "Proof", "Bukti", 2115, 2117, 2373, 2376],
  ["sec.ephif.discussion.03", "discussion", "sec.ephif", 5, "generated:discussion:sec:EphiF:03", "Multiplicativity of Euler's phi function", "Kemultiplikatifan fungsi phi Euler", 2119, 2122, 2378, 2382],
  ["thm.phiismultiplicative", "theorem", "sec.ephif", 6, "thm:phiismultiplicative", "Euler's phi function is multiplicative", "Fungsi phi Euler bersifat multiplikatif", 2124, 2128, 2384, 2389],
  ["thm.phiismultiplicative.proof", "proof", "thm.phiismultiplicative", 1, "generated:proof:thm:phiismultiplicative", "Proof", "Bukti", 2129, 2191, 2390, 2472],
  ["sec.ephif.exercises", "exercise_group", "sec.ephif", 7, "generated:exercise-group:sec:EphiF", "Exercises for Section 2.5", "Latihan untuk §2.5", 2193, 2210, 2474, 2490],
  ["sec.ephif.exercise.01", "exercise", "sec.ephif.exercises", 1, "generated:exercise:sec:EphiF:01", "Exercise 1", "Latihan 1", 2201, 2204, 2482, 2485],
  ["sec.ephif.exercise.02", "exercise", "sec.ephif.exercises", 2, "generated:exercise:sec:EphiF:02", "Exercise 2", "Latihan 2", 2205, 2209, 2486, 2490],
];
for (const spec of boundary11UnitSpecs) parentByUnit.set(spec[0], spec[2]);
for (const [suffix, unitType, parentSuffix, order, sourceLocalId, titleEn, titleId, sourceStart, sourceEnd, targetStart, targetEnd] of boundary11UnitSpecs) {
  const sourceSpan = span(authorityBytes, authorityOffsets, sourceStart, sourceEnd);
  const targetSpan = span(boundary11TargetBytes, boundary11TargetOffsets, targetStart, targetEnd);
  records.push(baseRecord("unit", unitId(suffix), {
    edition_id: boundary11EditionId,
    locale: "id-ID",
    unit_type: unitType,
    parent_unit_id: unitId(parentSuffix),
    order,
    order_key: String(order).padStart(4, "0"),
    source_local_id: sourceLocalId,
    title_en: titleEn,
    title_id: titleId,
    source_locator: { path: "authority/downloads/yaintt.tex", start_line: sourceStart, end_line: sourceEnd },
    source_content_sha256: sourceSpan.sha256,
    target_locator: { path: boundary11TargetRelPath, start_line: targetStart, end_line: targetEnd },
    target_content_sha256: targetSpan.sha256,
    translation_state: "language_reviewed",
    rights_id: boundary11RightsId,
    ancestry: ancestry(suffix),
    path: ancestry(suffix).join("/"),
    label_status: sourceLocalId.includes(":") && !sourceLocalId.startsWith("generated:") ? "source_label" : "generated_stable_id",
    assessment_closure: unitType === "exercise" ? { hints: [], answers: [], solutions: [], status: "source_has_none" } : null,
    target_disposition: null,
    qa_event_ids: [fixedQaIds.ephifTopology, fixedQaIds.ephifMath, fixedQaIds.ephifLanguage],
  }));
}
if (boundary11UnitSpecs.length !== 12) throw new Error(`expected 12 Boundary 11 content units, observed ${boundary11UnitSpecs.length}`);

const conceptSpecs = [
  ["natural_number", "natural number", "bilangan asli", []],
  ["integer", "integer", "bilangan bulat", []],
  ["binary_operation", "binary operation", "operasi biner", []],
  ["addition", "addition", "penjumlahan", ["integer"]],
  ["multiplication", "multiplication", "perkalian", ["integer"]],
  ["commutativity", "commutativity", "komutativitas", ["binary_operation"]],
  ["associativity", "associativity", "asosiativitas", ["binary_operation"]],
  ["distributivity", "distributivity", "distributivitas", ["addition", "multiplication"]],
  ["identity_element", "identity element", "elemen identitas", ["binary_operation"]],
  ["additive_inverse", "additive inverse", "invers aditif", ["addition", "identity_element"]],
  ["multiplicative_inverse", "multiplicative inverse", "invers multiplikatif", ["multiplication", "identity_element"]],
  ["subtraction", "subtraction", "pengurangan", ["addition", "additive_inverse"]],
  ["division", "division", "pembagian", ["multiplication"]],
  ["least_element", "least element", "elemen terkecil", []],
  ["well_ordering_principle", "well-ordering principle", "prinsip keterurutan baik", ["least_element", "natural_number"]],
  ["pigeonhole_principle", "pigeonhole principle", "prinsip sarang merpati", []],
  ["mathematical_induction", "mathematical induction", "induksi matematika", ["well_ordering_principle"]],
  ["strong_induction", "strong induction / second principle", "induksi kuat / prinsip kedua", ["mathematical_induction"]],
  ["proof_by_contradiction", "proof by contradiction", "bukti dengan kontradiksi", []],
  ["finite_sum", "finite sum", "jumlah berhingga", []],
  ["factorial", "factorial", "faktorial", []],
  ["cryptology", "cryptology", "kriptologi", []],
  ["cryptography", "cryptography", "kriptografi", []],
  ["cryptanalysis", "cryptanalysis", "kriptanalisis", []],
  ["cryptosystem", "cryptosystem", "kriptosistem", []],
  ["key_exchange", "key exchange", "pertukaran kunci", []],
  ["rsa", "RSA cryptosystem", "kriptosistem RSA", ["cryptosystem"]],
  ["diffie_hellman", "Diffie-Hellman key exchange", "pertukaran kunci Diffie-Hellman", ["key_exchange"]],
  ["elgamal", "ElGamal cryptosystem", "kriptosistem ElGamal", ["cryptosystem"]],
  ["euler_theorem", "Euler's theorem", "Teorema Euler", []],
  ["primitive_root", "primitive root", "akar primitif", []],
  ["index_discrete_log", "number-theoretic index / discrete logarithm", "indeks / logaritma diskret", []],
  ["divisibility", "divisibility", "keterbagian", ["integer", "multiplication"]],
  ["factor", "factor", "faktor", ["divisibility"]],
  ["divisor", "divisor", "pembagi", ["divisibility"]],
  ["multiple", "multiple", "kelipatan", ["divisibility"]],
  ["parity", "parity", "paritas", ["divisibility"]],
  ["linear_combination", "linear combination", "kombinasi linear", ["addition", "multiplication"]],
  ["division_algorithm", "Division Algorithm", "Algoritma Pembagian", ["integer", "well_ordering_principle"]],
  ["quotient", "quotient", "hasil bagi", ["division_algorithm"]],
  ["remainder", "remainder", "sisa pembagian", ["division_algorithm"]],
];
for (const [code, nameEn, nameId, prereqs] of conceptSpecs) {
  records.push(
    baseRecord("concept", conceptId(code), {
      locale: "und",
      name_en: nameEn,
      name_id: nameId,
      concept_code: code,
      prerequisite_concept_ids: prereqs.map(conceptId),
      taxonomy_path: `mathematics/number-theory/${code}`,
      evidence: { path: targetRelPath, target_sha256: targetSha },
    }),
  );
}

const boundary4ConceptSpecs = [
  ["base", "base", "basis", ["integer"]],
  ["base_representation", "base-b representation", "representasi basis b", ["base", "natural_number", "division_algorithm"]],
  ["digit", "digit", "digit", ["base_representation"]],
  ["binary_representation", "binary representation", "representasi biner", ["base_representation"]],
  ["decimal", "decimal", "desimal", ["base_representation"]],
  ["octal", "octal", "oktal", ["base_representation"]],
  ["hexadecimal", "hexadecimal", "heksadesimal", ["base_representation"]],
  ["hex", "hex", "heks", ["hexadecimal"]],
  ["sexagesimal", "sexagesimal", "seksagesimal", ["base_representation"]],
  ["bit", "bit / binary digit", "bit / digit biner", ["binary_representation", "digit"]],
];
for (const [code, nameEn, nameId, prereqs] of boundary4ConceptSpecs) {
  records.push(baseRecord("concept", conceptId(code), {
    locale: "und",
    name_en: nameEn,
    name_id: nameId,
    concept_code: code,
    prerequisite_concept_ids: prereqs.map(conceptId),
    taxonomy_path: `mathematics/number-theory/${code}`,
    evidence: { path: boundary4TargetRelPath, target_sha256: boundary4TargetSha },
  }));
}

const boundary5ConceptSpecs = [
  ["greatest_common_divisor", "greatest common divisor", "faktor persekutuan terbesar", ["common_divisor", "natural_number"]],
  ["common_divisor", "common divisor", "pembagi bersama", ["divisibility", "divisor"]],
  ["relatively_prime", "relatively prime", "relatif prima", ["greatest_common_divisor"]],
  ["mutually_relatively_prime", "mutually relatively prime", "relatif prima secara bersama-sama", ["greatest_common_divisor", "relatively_prime"]],
  ["pairwise_relatively_prime", "pairwise relatively prime", "relatif prima berpasangan", ["greatest_common_divisor", "relatively_prime"]],
];
for (const [code, nameEn, nameId, prereqs] of boundary5ConceptSpecs) {
  records.push(baseRecord("concept", conceptId(code), {
    locale: "und",
    name_en: nameEn,
    name_id: nameId,
    concept_code: code,
    prerequisite_concept_ids: prereqs.map(conceptId),
    taxonomy_path: `mathematics/number-theory/${code}`,
    evidence: { path: boundary5TargetRelPath, target_sha256: boundary5TargetSha },
  }));
}

const boundary6ConceptSpecs = [
  ["euclidean_algorithm", "Euclidean algorithm", "Algoritma Euklides", ["greatest_common_divisor", "division_algorithm", "remainder"]],
  ["extended_euclidean_algorithm", "extended Euclidean algorithm", "Algoritma Euklides diperluas", ["euclidean_algorithm", "linear_combination"]],
];
for (const [code, nameEn, nameId, prereqs] of boundary6ConceptSpecs) {
  records.push(baseRecord("concept", conceptId(code), {
    locale: "und",
    name_en: nameEn,
    name_id: nameId,
    concept_code: code,
    prerequisite_concept_ids: prereqs.map(conceptId),
    taxonomy_path: `mathematics/number-theory/${code}`,
    evidence: { path: boundary6TargetRelPath, target_sha256: boundary6TargetSha },
  }));
}

const boundary7ConceptSpecs = [
  ["congruence", "congruence", "kongruensi", ["divisibility", "integer"]],
  ["modulo", "modulo", "modulo", ["congruence", "natural_number"]],
  ["congruence_class", "congruence class", "kelas kongruensi", ["congruence", "modulo"]],
  ["chinese_remainder_theorem", "Chinese Remainder Theorem", "Teorema Sisa Cina", ["congruence", "modulo", "pairwise_relatively_prime"]],
  ["euclids_lemma", "Euclid's Lemma", "Lemma Euklides", ["divisibility", "greatest_common_divisor", "relatively_prime"]],
];
for (const [code, nameEn, nameId, prereqs] of boundary7ConceptSpecs) {
  records.push(baseRecord("concept", conceptId(code), {
    locale: "und",
    name_en: nameEn,
    name_id: nameId,
    concept_code: code,
    prerequisite_concept_ids: prereqs.map(conceptId),
    taxonomy_path: `mathematics/number-theory/${code}`,
    evidence: { path: boundary7TargetRelPath, target_sha256: boundary7TargetSha },
  }));
}

const boundary8ConceptSpecs = [
  ["linear_congruence", "linear congruence", "kongruensi linear", ["congruence", "integer", "natural_number"]],
  ["diophantine_equation", "Diophantine equation", "persamaan Diofantin", ["integer"]],
  ["modular_inverse", "modular inverse", "invers modular", ["congruence", "modulo", "relatively_prime"]],
];
for (const [code, nameEn, nameId, prereqs] of boundary8ConceptSpecs) {
  records.push(baseRecord("concept", conceptId(code), {
    locale: "und",
    name_en: nameEn,
    name_id: nameId,
    concept_code: code,
    prerequisite_concept_ids: prereqs.map(conceptId),
    taxonomy_path: `mathematics/number-theory/${code}`,
    evidence: { path: boundary8TargetRelPath, target_sha256: boundary8TargetSha },
  }));
}

const boundary9ConceptSpecs = [
  ["system_of_congruences", "system of congruences", "sistem kongruensi", ["congruence", "modulo"]],
];
for (const [code, nameEn, nameId, prereqs] of boundary9ConceptSpecs) {
  records.push(baseRecord("concept", conceptId(code), {
    locale: "und",
    name_en: nameEn,
    name_id: nameId,
    concept_code: code,
    prerequisite_concept_ids: prereqs.map(conceptId),
    taxonomy_path: `mathematics/number-theory/${code}`,
    evidence: { path: boundary9TargetRelPath, target_sha256: boundary9TargetSha },
  }));
}

const boundary10ConceptSpecs = [
  ["equivalence_relation", "equivalence relation", "relasi ekuivalensi", []],
  ["reflexivity", "reflexivity", "refleksivitas", ["equivalence_relation"]],
  ["symmetry", "symmetry", "simetri", ["equivalence_relation"]],
  ["transitivity", "transitivity", "transitivitas", ["equivalence_relation"]],
  ["equivalence_class", "equivalence class", "kelas ekuivalensi", ["equivalence_relation"]],
  ["class_representative", "class representative", "wakil kelas ekuivalensi", ["equivalence_class"]],
  ["integers_mod_n", "integers modulo n", "bilangan bulat modulo n", ["congruence_class", "modulo"]],
  ["well_defined", "well-defined", "terdefinisi dengan baik", ["equivalence_class", "binary_operation"]],
];
for (const [code, nameEn, nameId, prereqs] of boundary10ConceptSpecs) {
  records.push(baseRecord("concept", conceptId(code), {
    locale: "und",
    name_en: nameEn,
    name_id: nameId,
    concept_code: code,
    prerequisite_concept_ids: prereqs.map(conceptId),
    taxonomy_path: `mathematics/number-theory/${code}`,
    evidence: { path: boundary10TargetRelPath, target_sha256: boundary10TargetSha },
  }));
}

const boundary11ConceptSpecs = [
  ["euler_phi_function", "Euler's phi function", "fungsi phi Euler", ["relatively_prime", "natural_number"]],
  ["euler_totient_function", "Euler's totient function", "fungsi totient Euler", ["euler_phi_function"]],
  ["cardinality", "cardinality", "kardinalitas", []],
  ["cartesian_product", "Cartesian product", "hasil kali Kartesius", []],
  ["injective", "injective", "injektif", []],
  ["surjective", "surjective", "surjektif", []],
  ["bijective", "bijective", "bijektif", ["injective", "surjective"]],
  ["unit_group", "unit group", "grup unit", ["integers_mod_n", "modular_inverse"]],
  ["multiplicative_function", "multiplicative function", "fungsi multiplikatif", ["euler_phi_function", "relatively_prime", "multiplication"]],
];
for (const [code, nameEn, nameId, prereqs] of boundary11ConceptSpecs) {
  records.push(baseRecord("concept", conceptId(code), {
    locale: "und",
    name_en: nameEn,
    name_id: nameId,
    concept_code: code,
    prerequisite_concept_ids: prereqs.map(conceptId),
    taxonomy_path: `mathematics/number-theory/${code}`,
    evidence: { path: boundary11TargetRelPath, target_sha256: boundary11TargetSha },
  }));
}

const segmentSpecs = [
  ["title", "frontmatter.title-page", 265, 267, 286, 288],
  ["author", "frontmatter.title-page", 269, 269, 290, 290],
  ["address", "frontmatter.title-page", 270, 276, 291, 297],
  ["heading", "frontmatter.preface", 282, 282, 303, 303],
  ["paragraph", "frontmatter.preface", 284, 296, 305, 319],
  ["paragraph", "frontmatter.preface", 298, 313, 321, 334],
  ["editorial_notice", "frontmatter.preface", null, null, 336, 341],
  ["paragraph", "frontmatter.preface", 315, 318, 343, 347],
  ["dedication", "frontmatter.preface", 320, 327, 349, 357],
  ["signature", "frontmatter.preface", 330, 330, 360, 360],
  ["heading", "frontmatter.release-notes", 334, 334, 364, 364],
  ["paragraph", "frontmatter.release-notes", 335, 345, 365, 388],
  ["paragraph", "frontmatter.release-notes", 347, 355, 390, 398],
  ["caution", "frontmatter.release-notes", 365, 370, 408, 413],
  ["source_links", "frontmatter.release-notes", 374, 378, 417, 421],
  ["chapter_title", "chap.woad", 390, 390, 433, 433],
  ["section_title", "sec.wopami", 392, 392, 435, 435],
  ["discussion", "sec.wopami.discussion.01", 395, 399, 438, 442],
  ["subsection_title", "sec.wopami.subsection.01", 402, 402, 445, 445],
  ["definition", "sec.wopami.definition.01", 405, 406, 448, 450],
  ["principle", "sec.wopami.principle.well-ordering", 410, 410, 454, 454],
  ["discussion", "sec.wopami.discussion.02", 414, 414, 458, 458],
  ["subsection_title", "sec.wopami.subsection.02", 417, 417, 461, 461],
  ["theorem", "thm.pigeonhole", 421, 423, 465, 467],
  ["proof", "thm.pigeonhole.proof", 427, 429, 471, 473],
  ["subsection_title", "sec.wopami.subsection.03", 432, 432, 475, 475],
  ["discussion", "sec.wopami.discussion.03", 435, 436, 478, 479],
  ["theorem", "sec.wopami.theorem.induction.01", 441, 454, 484, 498],
  ["proof", "sec.wopami.theorem.induction.01.proof", 458, 480, 502, 526],
  ["example", "eg.inductionv1a", 484, 502, 530, 549],
  ["example", "eg.inductionv1b", 506, 517, 553, 566],
  ["theorem", "sec.wopami.theorem.induction.02", 521, 536, 570, 586],
  ["proof", "sec.wopami.theorem.induction.02.proof", 539, 550, 589, 600],
  ["exercise_heading", "sec.wopami.exercises", 558, 558, 608, 608],
  ["exercise_prompt", "sec.wopami.exercise.01", 562, 562, 612, 613],
  ["exercise_prompt", "sec.wopami.exercise.02", 565, 565, 616, 616],
  ["exercise_prompt", "sec.wopami.exercise.03", 568, 569, 619, 620],
  ["exercise_prompt", "sec.wopami.exercise.04", 572, 573, 623, 624],
  ["exercise_prompt", "sec.wopami.exercise.05", 576, 576, 627, 628],
  ["exercise_prompt", "sec.wopami.exercise.06", 579, 579, 631, 631],
  ["exercise_prompt", "sec.wopami.exercise.07", 582, 582, 634, 634],
  ["section_title", "sec.aowi", 587, 587, 650, 650],
  ["paragraph", "sec.aowi", 588, 590, 651, 654],
  ["algebraic_properties", "sec.aowi", 592, 607, 656, 671],
  ["identity_elements", "sec.aowi", 608, 614, 672, 678],
  ["additive_inverse", "sec.aowi", 616, 621, 680, 685],
  ["multiplicative_inverse", "sec.aowi", 622, 628, 686, 692],
  ["subtraction_division_definitions", "sec.aowi", 630, 642, 694, 706],
  ["section_title", "sec.dada", 646, 646, 720, 720],
  ["discussion", "sec.dada.discussion.01", 648, 650, 722, 724],
  ["subsection", "sec.dada.subsection.divisibility", 652, 652, 726, 726],
  ["definition", "sec.dada.definition.divisibility", 653, 664, 727, 740],
  ["example", "sec.dada.example.basic", 666, 668, 742, 744],
  ["definition", "sec.dada.definition.parity", 670, 674, 746, 751],
  ["discussion", "sec.dada.discussion.parity", 676, 679, 753, 757],
  ["proposition", "sec.dada.proposition.zero", 681, 682, 759, 760],
  ["proposition", "sec.dada.proposition.size", 683, 684, 761, 762],
  ["proposition", "sec.dada.proposition.absolute-value", 685, 686, 763, 765],
  ["theorem", "sec.dada.theorem.transitivity", 688, 691, 767, 770],
  ["proof", "sec.dada.theorem.transitivity.proof", 692, 695, 771, 774],
  ["example", "eg.divisibility", 697, 699, 776, 778],
  ["discussion", "sec.dada.discussion.linear-combination", 701, 704, 780, 783],
  ["theorem", "thm.divisibilitylincombs", 706, 708, 785, 788],
  ["proof", "thm.divisibilitylincombs.proof", 709, 716, 789, 796],
  ["discussion", "sec.dada.discussion.finite-combination", 718, 730, 798, 809],
  ["subsection", "sec.dada.subsection.division-algorithm", 732, 732, 811, 811],
  ["theorem", "thm.the-da", 734, 740, 813, 818],
  ["proof", "thm.the-da.proof", 742, 770, 820, 848],
  ["example", "eg.arithmetic", 772, 774, 850, 852],
  ["exercise_heading", "sec.dada.exercises", 776, 782, 854, 860],
  ["exercise_prompt", "sec.dada.exercise.01", 784, 786, 862, 864],
  ["exercise_prompt", "sec.dada.exercise.02", 787, 790, 865, 868],
  ["exercise_prompt", "sec.dada.exercise.03", 791, 794, 869, 872],
  ["exercise_prompt", "sec.dada.exercise.04", 795, 798, 873, 876],
  ["exercise_prompt", "sec.dada.exercise.05", 799, 801, 877, 880],
  ["exercise_prompt", "sec.dada.exercise.06", 802, 805, 881, 885],
  ["exercise_prompt", "sec.dada.exercise.07", 806, 809, 886, 890],
  ["exercise_prompt", "sec.dada.exercise.08", 810, 812, 891, 893],
  ["exercise_prompt", "sec.dada.exercise.09", 813, 815, 894, 897],
  ["exercise_prompt", "sec.dada.exercise.10", 816, 819, 898, 902],
  ["exercise_prompt", "sec.dada.exercise.11", 820, 822, 903, 905],
  ["exercise_prompt", "sec.dada.exercise.12", 823, 825, 906, 908],
];
const segmentRecords = [];
segmentSpecs.forEach((spec, zeroIndex) => {
  const [segmentKind, unitSuffix, sourceStart, sourceEnd, targetStart, targetEnd] = spec;
  const order = zeroIndex + 1;
  const targetSpan = span(targetBytes, targetOffsets, targetStart, targetEnd);
  const sourceSpan = sourceStart ? span(authorityBytes, authorityOffsets, sourceStart, sourceEnd) : { text: "", sha256: sha256Bytes(Buffer.alloc(0)) };
  const recordId = `ttp.r014.segment.${String(order).padStart(3, "0")}`;
  const sourceExpressionId = sourceStart ? `${recordId}.expr.en` : null;
  const targetExpressionId = `${recordId}.expr.id-id`;
  const record = baseRecord("segment", recordId, {
    edition_id: targetEditionId,
    locale: "mul",
    unit_id: unitId(unitSuffix),
    order,
    order_key: String(order).padStart(4, "0"),
    segment_kind: segmentKind,
    source_text: sourceSpan.text,
    target_text: targetSpan.text,
    source_content_sha256: sourceSpan.sha256,
    target_content_sha256: targetSpan.sha256,
    source_locator: sourceStart ? { path: "authority/downloads/yaintt.tex", start_line: sourceStart, end_line: sourceEnd } : undefined,
    target_locator: { path: targetRelPath, start_line: targetStart, end_line: targetEnd },
    source_expression_id: sourceExpressionId,
    target_expression_id: targetExpressionId,
    expressions: [
      ...(sourceStart ? [{ expression_id: sourceExpressionId, language: "en", locale: "en", source_or_target: "source", text_latex: sourceSpan.text, content_sha256: sourceSpan.sha256, state: "source_frozen" }] : []),
      { expression_id: targetExpressionId, language: "id", locale: "id-ID", source_or_target: "target", text_latex: targetSpan.text, content_sha256: targetSpan.sha256, state: "language_reviewed" },
    ],
    translation_state: "language_reviewed",
    rights_id: "rights.yaintt.id-id.derivative",
    provenance: sourceStart
      ? { kind: "translation", authority_sha256: authoritySha }
      : { kind: "editorial_addition", reason: "Indonesian derivative change, licensing, and non-endorsement notice" },
    qa_event_ids: unitSuffix === "sec.aowi"
      ? [fixedQaIds.aowiTopology, fixedQaIds.aowiMath, fixedQaIds.aowiLanguage]
      : unitSuffix === "sec.dada" || unitSuffix.startsWith("sec.dada.") || ["eg.divisibility", "thm.divisibilitylincombs", "thm.divisibilitylincombs.proof", "thm.the-da", "thm.the-da.proof", "eg.arithmetic"].includes(unitSuffix)
        ? [fixedQaIds.dadaTopology, fixedQaIds.dadaMath, fixedQaIds.dadaLanguage]
      : [fixedQaIds.topology, fixedQaIds.math, fixedQaIds.language],
  });
  segmentRecords.push(record);
  records.push(record);
});
if (segmentRecords.length !== 82) throw new Error(`expected 82 segments, observed ${segmentRecords.length}`);
if (segmentRecords.reduce((sum, record) => sum + record.expressions.length, 0) !== 163) throw new Error("expected 163 segment expressions");

const boundary4SegmentSpecs = [
  ["section_title", "sec.roiidb", 829, 829, 926, 926],
  ["discussion", "sec.roiidb.discussion.01", 830, 840, 927, 938],
  ["notation", "sec.roiidb", 842, 843, 940, 941],
  ["theorem", "thm.basebexpansion", 845, 853, 943, 952],
  ["proof", "thm.basebexpansion.proof", 854, 915, 953, 1011],
  ["definition", "def.baseb", 917, 942, 1013, 1039],
  ["example", "eg.basetwo", 944, 956, 1041, 1052],
  ["example", "eg.changebase", 958, 962, 1054, 1057],
  ["exercise_heading", "sec.roiidb.exercises", 964, 970, 1059, 1065],
  ["exercise_prompt", "sec.roiidb.exercise.01", 972, 974, 1067, 1069],
  ["exercise_prompt", "sec.roiidb.exercise.02", 975, 977, 1070, 1072],
  ["exercise_prompt", "sec.roiidb.exercise.03", 978, 980, 1073, 1075],
  ["exercise_prompt", "sec.roiidb.exercise.04", 981, 983, 1076, 1078],
  ["exercise_prompt", "sec.roiidb.exercise.05", 984, 986, 1079, 1081],
];
for (const [segmentKind, unitSuffix, sourceStart, sourceEnd, targetStart, targetEnd] of boundary4SegmentSpecs) {
  const order = segmentRecords.length + 1;
  const sourceSpan = span(authorityBytes, authorityOffsets, sourceStart, sourceEnd);
  const targetSpan = span(boundary4TargetBytes, boundary4TargetOffsets, targetStart, targetEnd);
  const recordId = `ttp.r014.segment.${String(order).padStart(3, "0")}`;
  const sourceExpressionId = `${recordId}.expr.en`;
  const targetExpressionId = `${recordId}.expr.id-id`;
  const record = baseRecord("segment", recordId, {
    edition_id: boundary4EditionId,
    locale: "mul",
    unit_id: unitId(unitSuffix),
    order,
    order_key: String(order).padStart(4, "0"),
    segment_kind: segmentKind,
    source_text: sourceSpan.text,
    target_text: targetSpan.text,
    source_content_sha256: sourceSpan.sha256,
    target_content_sha256: targetSpan.sha256,
    source_locator: { path: "authority/downloads/yaintt.tex", start_line: sourceStart, end_line: sourceEnd },
    target_locator: { path: boundary4TargetRelPath, start_line: targetStart, end_line: targetEnd },
    source_expression_id: sourceExpressionId,
    target_expression_id: targetExpressionId,
    expressions: [
      { expression_id: sourceExpressionId, language: "en", locale: "en", source_or_target: "source", text_latex: sourceSpan.text, content_sha256: sourceSpan.sha256, state: "source_frozen" },
      { expression_id: targetExpressionId, language: "id", locale: "id-ID", source_or_target: "target", text_latex: targetSpan.text, content_sha256: targetSpan.sha256, state: "language_reviewed" },
    ],
    translation_state: "language_reviewed",
    rights_id: boundary4RightsId,
    provenance: { kind: "translation", authority_sha256: authoritySha },
    qa_event_ids: [fixedQaIds.roiidbTopology, fixedQaIds.roiidbMath, fixedQaIds.roiidbLanguage],
  });
  segmentRecords.push(record);
  records.push(record);
}
if (segmentRecords.length !== 96) throw new Error(`expected 96 segments through Boundary 4, observed ${segmentRecords.length}`);
if (segmentRecords.reduce((sum, record) => sum + record.expressions.length, 0) !== 191) throw new Error("expected 191 segment expressions through Boundary 4");

const boundary5SegmentSpecs = [
  ["section_title", "sec.gcd", 990, 990, 1099, 1099],
  ["discussion", "sec.gcd.discussion.01", 991, 1001, 1100, 1110],
  ["definition", "sec.gcd.definition.greatest-common-divisor", 1003, 1009, 1112, 1118],
  ["example", "eg.gcda", 1011, 1013, 1120, 1123],
  ["definition", "sec.gcd.definition.relatively-prime", 1015, 1018, 1125, 1128],
  ["example", "eg.gcdb", 1020, 1023, 1130, 1133],
  ["discussion", "sec.gcd.discussion.02", 1025, 1033, 1135, 1144],
  ["theorem", "thm.dividebygcd", 1034, 1037, 1145, 1150],
  ["proof", "thm.dividebygcd.proof", 1038, 1052, 1151, 1165],
  ["discussion", "sec.gcd.discussion.03", 1054, 1058, 1167, 1171],
  ["theorem", "sec.gcd.theorem.invariance", 1060, 1062, 1173, 1175],
  ["proof", "sec.gcd.theorem.invariance.proof", 1064, 1078, 1177, 1192],
  ["example", "eg.gcdc", 1080, 1082, 1194, 1196],
  ["discussion", "sec.gcd.discussion.04", 1084, 1088, 1198, 1202],
  ["theorem", "thm.gcdislincomb", 1090, 1094, 1204, 1208],
  ["proof", "thm.gcdislincomb.proof", 1096, 1128, 1210, 1244],
  ["discussion", "sec.gcd.discussion.05", 1130, 1132, 1246, 1248],
  ["corollary", "cor.intlincombrelprime", 1133, 1136, 1249, 1252],
  ["definition", "sec.gcd.definition.gcd-family", 1138, 1142, 1254, 1259],
  ["definition", "sec.gcd.definition.mutually-relatively-prime", 1143, 1147, 1260, 1265],
  ["example", "eg.mutrelprime", 1149, 1152, 1267, 1270],
  ["definition", "sec.gcd.definition.pairwise-relatively-prime", 1154, 1159, 1272, 1277],
  ["example", "eg.pairwiserelprime", 1161, 1164, 1279, 1282],
  ["proposition", "sec.gcd.proposition.pairwise-implies-mutual", 1166, 1169, 1284, 1288],
  ["exercise_heading", "sec.gcd.exercises", 1171, 1177, 1290, 1296],
  ["exercise_prompt", "sec.gcd.exercise.01", 1179, 1182, 1298, 1301],
  ["exercise_prompt", "sec.gcd.exercise.02", 1183, 1186, 1302, 1305],
  ["exercise_prompt", "sec.gcd.exercise.03", 1187, 1190, 1306, 1309],
  ["exercise_prompt", "sec.gcd.exercise.04", 1191, 1194, 1310, 1314],
  ["exercise_prompt", "sec.gcd.exercise.05", 1195, 1198, 1315, 1319],
  ["exercise_prompt", "sec.gcd.exercise.06", 1199, 1202, 1320, 1324],
  ["exercise_prompt", "sec.gcd.exercise.07", 1203, 1206, 1325, 1328],
  ["exercise_prompt", "sec.gcd.exercise.08", 1207, 1210, 1329, 1333],
  ["exercise_prompt", "sec.gcd.exercise.09", 1211, 1215, 1334, 1339],
];
for (const [segmentKind, unitSuffix, sourceStart, sourceEnd, targetStart, targetEnd] of boundary5SegmentSpecs) {
  const order = segmentRecords.length + 1;
  const sourceSpan = span(authorityBytes, authorityOffsets, sourceStart, sourceEnd);
  const targetSpan = span(boundary5TargetBytes, boundary5TargetOffsets, targetStart, targetEnd);
  const recordId = `ttp.r014.segment.${String(order).padStart(3, "0")}`;
  const sourceExpressionId = `${recordId}.expr.en`;
  const targetExpressionId = `${recordId}.expr.id-id`;
  const record = baseRecord("segment", recordId, {
    edition_id: boundary5EditionId,
    locale: "mul",
    unit_id: unitId(unitSuffix),
    order,
    order_key: String(order).padStart(4, "0"),
    segment_kind: segmentKind,
    source_text: sourceSpan.text,
    target_text: targetSpan.text,
    source_content_sha256: sourceSpan.sha256,
    target_content_sha256: targetSpan.sha256,
    source_locator: { path: "authority/downloads/yaintt.tex", start_line: sourceStart, end_line: sourceEnd },
    target_locator: { path: boundary5TargetRelPath, start_line: targetStart, end_line: targetEnd },
    source_expression_id: sourceExpressionId,
    target_expression_id: targetExpressionId,
    expressions: [
      { expression_id: sourceExpressionId, language: "en", locale: "en", source_or_target: "source", text_latex: sourceSpan.text, content_sha256: sourceSpan.sha256, state: "source_frozen" },
      { expression_id: targetExpressionId, language: "id", locale: "id-ID", source_or_target: "target", text_latex: targetSpan.text, content_sha256: targetSpan.sha256, state: "language_reviewed" },
    ],
    translation_state: "language_reviewed",
    rights_id: boundary5RightsId,
    provenance: { kind: "translation", authority_sha256: authoritySha },
    qa_event_ids: [fixedQaIds.gcdTopology, fixedQaIds.gcdMath, fixedQaIds.gcdLanguage],
  });
  segmentRecords.push(record);
  records.push(record);
}
if (boundary5SegmentSpecs.length !== 34 || segmentRecords.length !== 130) throw new Error(`expected 130 segments through Boundary 5, observed ${segmentRecords.length}`);
if (segmentRecords.reduce((sum, record) => sum + record.expressions.length, 0) !== 259) throw new Error("expected 259 segment expressions through Boundary 5");

const boundary6SegmentSpecs = [
  ["section_title", "sec.ea", 1219, 1219, 1357, 1357],
  ["discussion", "sec.ea.discussion.01", 1220, 1224, 1358, 1362],
  ["lemma", "lem.gcdafterdivision", 1225, 1227, 1363, 1365],
  ["proof", "lem.gcdafterdivision.proof", 1228, 1230, 1366, 1369],
  ["discussion", "sec.ea.discussion.02", 1232, 1236, 1371, 1375],
  ["theorem", "thm.euclideanalg", 1238, 1247, 1377, 1388],
  ["proof", "thm.euclideanalg.proof", 1248, 1266, 1389, 1401],
  ["note", "sec.ea.note.extended-algorithm", 1267, 1269, 1402, 1404],
  ["discussion", "sec.ea.discussion.03", 1271, 1275, 1406, 1410],
  ["example", "eg.ea", 1277, 1290, 1412, 1425],
  ["exercise_group", "sec.ea.exercises", 1292, 1298, 1427, 1433],
  ["exercise", "sec.ea.exercise.01", 1300, 1304, 1435, 1440],
  ["exercise", "sec.ea.exercise.02", 1305, 1309, 1441, 1446],
  ["exercise", "sec.ea.exercise.03", 1310, 1313, 1447, 1450],
  ["exercise", "sec.ea.exercise.04", 1314, 1317, 1451, 1455],
  ["exercise", "sec.ea.exercise.05", 1318, 1321, 1456, 1459],
  ["exercise", "sec.ea.exercise.06", 1322, 1324, 1460, 1462],
];
for (const [segmentKind, unitSuffix, sourceStart, sourceEnd, targetStart, targetEnd] of boundary6SegmentSpecs) {
  const order = segmentRecords.length + 1;
  const sourceSpan = span(authorityBytes, authorityOffsets, sourceStart, sourceEnd);
  const targetSpan = span(boundary6TargetBytes, boundary6TargetOffsets, targetStart, targetEnd);
  const recordId = `ttp.r014.segment.${String(order).padStart(3, "0")}`;
  const sourceExpressionId = `${recordId}.expr.en`;
  const targetExpressionId = `${recordId}.expr.id-id`;
  const record = baseRecord("segment", recordId, {
    edition_id: boundary6EditionId,
    locale: "mul",
    unit_id: unitId(unitSuffix),
    order,
    order_key: String(order).padStart(4, "0"),
    segment_kind: segmentKind,
    source_text: sourceSpan.text,
    target_text: targetSpan.text,
    source_content_sha256: sourceSpan.sha256,
    target_content_sha256: targetSpan.sha256,
    source_locator: { path: "authority/downloads/yaintt.tex", start_line: sourceStart, end_line: sourceEnd },
    target_locator: { path: boundary6TargetRelPath, start_line: targetStart, end_line: targetEnd },
    source_expression_id: sourceExpressionId,
    target_expression_id: targetExpressionId,
    expressions: [
      { expression_id: sourceExpressionId, language: "en", locale: "en", source_or_target: "source", text_latex: sourceSpan.text, content_sha256: sourceSpan.sha256, state: "source_frozen" },
      { expression_id: targetExpressionId, language: "id", locale: "id-ID", source_or_target: "target", text_latex: targetSpan.text, content_sha256: targetSpan.sha256, state: "language_reviewed" },
    ],
    translation_state: "language_reviewed",
    rights_id: boundary6RightsId,
    provenance: { kind: "translation", authority_sha256: authoritySha },
    qa_event_ids: [fixedQaIds.eaTopology, fixedQaIds.eaMath, fixedQaIds.eaLanguage],
  });
  segmentRecords.push(record);
  records.push(record);
}
if (boundary6SegmentSpecs.length !== 17 || segmentRecords.length !== 147) throw new Error(`expected 147 segments through Boundary 6, observed ${segmentRecords.length}`);
if (segmentRecords.reduce((sum, record) => sum + record.expressions.length, 0) !== 293) throw new Error("expected 293 segment expressions through Boundary 6");

const boundary7SegmentSpecs = [
  ["chapter_title", "chap.cs", 1326, 1326, 1479, 1479],
  ["discussion", "chap.cs.discussion.01", 1328, 1339, 1481, 1493],
  ["section_title", "sec.itc", 1341, 1341, 1495, 1495],
  ["discussion", "sec.itc.discussion.01", 1342, 1345, 1496, 1499],
  ["definition", "def.congruence", 1346, 1350, 1500, 1505],
  ["example", "eg.congruences", 1352, 1355, 1507, 1510],
  ["discussion", "sec.itc.discussion.02", 1357, 1359, 1512, 1514],
  ["theorem", "thm.basiccongprops", 1361, 1378, 1516, 1534],
  ["proof", "thm.basiccongprops.proof", 1379, 1469, 1535, 1626],
  ["discussion", "sec.itc.discussion.03", 1471, 1473, 1628, 1630],
  ["theorem", "thm.combing", 1474, 1478, 1631, 1635],
  ["proof", "thm.combing.proof", 1479, 1487, 1636, 1644],
  ["examples", "eg.congarith", 1489, 1507, 1646, 1668],
  ["discussion", "sec.itc.discussion.04", 1509, 1512, 1670, 1673],
  ["lemma", "lem.euclids", 1513, 1517, 1674, 1679],
  ["proof", "lem.euclids.proof", 1518, 1523, 1680, 1685],
  ["discussion", "sec.itc.discussion.05", 1525, 1532, 1687, 1694],
  ["theorem", "thm.congcanc", 1534, 1545, 1696, 1709],
  ["proof", "thm.congcanc.proof", 1546, 1560, 1710, 1725],
  ["example", "eg.solvcongs", 1562, 1565, 1727, 1731],
  ["discussion", "sec.itc.discussion.06", 1567, 1569, 1733, 1735],
  ["theorem", "thm.numzerosmodafactor", 1570, 1574, 1736, 1740],
  ["proof", "thm.numzerosmodafactor.proof", 1575, 1591, 1741, 1761],
  ["exercise_group", "sec.itc.exercises", 1593, 1599, 1763, 1769],
  ["exercise", "sec.itc.exercise.01", 1601, 1603, 1771, 1773],
  ["exercise", "sec.itc.exercise.02", 1604, 1606, 1774, 1777],
  ["exercise", "sec.itc.exercise.03", 1607, 1610, 1778, 1781],
  ["exercise", "sec.itc.exercise.04", 1611, 1615, 1782, 1787],
  ["exercise", "sec.itc.exercise.05", 1616, 1618, 1788, 1791],
];
for (const [segmentKind, unitSuffix, sourceStart, sourceEnd, targetStart, targetEnd] of boundary7SegmentSpecs) {
  const order = segmentRecords.length + 1;
  const sourceSpan = span(authorityBytes, authorityOffsets, sourceStart, sourceEnd);
  const targetSpan = span(boundary7TargetBytes, boundary7TargetOffsets, targetStart, targetEnd);
  const recordId = `ttp.r014.segment.${String(order).padStart(3, "0")}`;
  const sourceExpressionId = `${recordId}.expr.en`;
  const targetExpressionId = `${recordId}.expr.id-id`;
  const record = baseRecord("segment", recordId, {
    edition_id: boundary7EditionId,
    locale: "mul",
    unit_id: unitId(unitSuffix),
    order,
    order_key: String(order).padStart(4, "0"),
    segment_kind: segmentKind,
    source_text: sourceSpan.text,
    target_text: targetSpan.text,
    source_content_sha256: sourceSpan.sha256,
    target_content_sha256: targetSpan.sha256,
    source_locator: { path: "authority/downloads/yaintt.tex", start_line: sourceStart, end_line: sourceEnd },
    target_locator: { path: boundary7TargetRelPath, start_line: targetStart, end_line: targetEnd },
    source_expression_id: sourceExpressionId,
    target_expression_id: targetExpressionId,
    expressions: [
      { expression_id: sourceExpressionId, language: "en", locale: "en", source_or_target: "source", text_latex: sourceSpan.text, content_sha256: sourceSpan.sha256, state: "source_frozen" },
      { expression_id: targetExpressionId, language: "id", locale: "id-ID", source_or_target: "target", text_latex: targetSpan.text, content_sha256: targetSpan.sha256, state: "language_reviewed" },
    ],
    translation_state: "language_reviewed",
    rights_id: boundary7RightsId,
    provenance: { kind: "translation", authority_sha256: authoritySha },
    qa_event_ids: [fixedQaIds.itcTopology, fixedQaIds.itcMath, fixedQaIds.itcLanguage],
  });
  segmentRecords.push(record);
  records.push(record);
}
if (boundary7SegmentSpecs.length !== 29 || segmentRecords.length !== 176) throw new Error(`expected 176 segments through Boundary 7, observed ${segmentRecords.length}`);
if (segmentRecords.reduce((sum, record) => sum + record.expressions.length, 0) !== 351) throw new Error("expected 351 segment expressions through Boundary 7");

const boundary8SegmentSpecs = [
  ["section_title", "sec.lc", 1622, 1622, 1810, 1810],
  ["discussion", "sec.lc.discussion.01", 1623, 1630, 1811, 1819],
  ["definition", "def.linearcongruence", 1631, 1635, 1820, 1824],
  ["discussion", "sec.lc.discussion.02", 1637, 1639, 1826, 1829],
  ["theorem", "thm.linearcongruencesameclass", 1641, 1645, 1831, 1836],
  ["discussion", "sec.lc.discussion.03", 1647, 1649, 1838, 1841],
  ["definition", "def.diophantine", 1650, 1653, 1842, 1846],
  ["discussion", "sec.lc.discussion.04", 1654, 1662, 1847, 1855],
  ["theorem", "thm.basiclincongs", 1663, 1675, 1856, 1869],
  ["proof", "thm.basiclincongs.proof", 1677, 1698, 1871, 1904],
  ["remark", "rem.uniqsolnlincong", 1700, 1705, 1906, 1912],
  ["example", "eg.multiplesolscongs", 1707, 1715, 1914, 1925],
  ["discussion", "sec.lc.discussion.05", 1717, 1722, 1927, 1932],
  ["definition", "def.modularinverse", 1724, 1730, 1934, 1940],
  ["discussion", "sec.lc.discussion.06", 1732, 1736, 1942, 1946],
  ["corollary", "cor.modinv", 1737, 1741, 1947, 1951],
  ["example", "eg.modinverses", 1743, 1746, 1953, 1956],
  ["exercise_group", "sec.lc.exercises", 1748, 1754, 1958, 1964],
  ["exercise", "sec.lc.exercise.01", 1756, 1758, 1966, 1968],
  ["exercise", "sec.lc.exercise.02", 1759, 1761, 1969, 1971],
  ["exercise", "sec.lc.exercise.03", 1762, 1764, 1972, 1974],
  ["exercise", "sec.lc.exercise.04", 1765, 1769, 1975, 1979],
];
for (const [segmentKind, unitSuffix, sourceStart, sourceEnd, targetStart, targetEnd] of boundary8SegmentSpecs) {
  const order = segmentRecords.length + 1;
  const sourceSpan = span(authorityBytes, authorityOffsets, sourceStart, sourceEnd);
  const targetSpan = span(boundary8TargetBytes, boundary8TargetOffsets, targetStart, targetEnd);
  const recordId = `ttp.r014.segment.${String(order).padStart(3, "0")}`;
  const sourceExpressionId = `${recordId}.expr.en`;
  const targetExpressionId = `${recordId}.expr.id-id`;
  const record = baseRecord("segment", recordId, {
    edition_id: boundary8EditionId,
    locale: "mul",
    unit_id: unitId(unitSuffix),
    order,
    order_key: String(order).padStart(4, "0"),
    segment_kind: segmentKind,
    source_text: sourceSpan.text,
    target_text: targetSpan.text,
    source_content_sha256: sourceSpan.sha256,
    target_content_sha256: targetSpan.sha256,
    source_locator: { path: "authority/downloads/yaintt.tex", start_line: sourceStart, end_line: sourceEnd },
    target_locator: { path: boundary8TargetRelPath, start_line: targetStart, end_line: targetEnd },
    source_expression_id: sourceExpressionId,
    target_expression_id: targetExpressionId,
    expressions: [
      { expression_id: sourceExpressionId, language: "en", locale: "en", source_or_target: "source", text_latex: sourceSpan.text, content_sha256: sourceSpan.sha256, state: "source_frozen" },
      { expression_id: targetExpressionId, language: "id", locale: "id-ID", source_or_target: "target", text_latex: targetSpan.text, content_sha256: targetSpan.sha256, state: "language_reviewed" },
    ],
    translation_state: "language_reviewed",
    rights_id: boundary8RightsId,
    provenance: { kind: "translation", authority_sha256: authoritySha },
    qa_event_ids: [fixedQaIds.lcTopology, fixedQaIds.lcMath, fixedQaIds.lcLanguage],
  });
  segmentRecords.push(record);
  records.push(record);
}
if (boundary8SegmentSpecs.length !== 22 || segmentRecords.length !== 198) throw new Error(`expected 198 segments through Boundary 8, observed ${segmentRecords.length}`);
if (segmentRecords.reduce((sum, record) => sum + record.expressions.length, 0) !== 395) throw new Error("expected 395 segment expressions through Boundary 8");

const boundary9SegmentSpecs = [
  ["section_title", "sec.crt", 1773, 1773, 1998, 1998],
  ["discussion", "sec.crt.discussion.01", 1774, 1781, 1999, 2005],
  ["theorem", "thm.chinese-remainder", 1782, 1795, 2006, 2019],
  ["proof", "thm.chinese-remainder.proof", 1797, 1824, 2021, 2049],
  ["example", "eg.systemofcongs", 1826, 1843, 2051, 2068],
  ["exercise_group", "sec.crt.exercises", 1845, 1851, 2070, 2076],
  ["exercise", "sec.crt.exercise.01", 1853, 1856, 2078, 2081],
  ["exercise", "sec.crt.exercise.02", 1857, 1860, 2082, 2085],
  ["exercise", "sec.crt.exercise.03", 1861, 1864, 2086, 2089],
  ["exercise", "sec.crt.exercise.04", 1865, 1873, 2090, 2099],
];
for (const [segmentKind, unitSuffix, sourceStart, sourceEnd, targetStart, targetEnd] of boundary9SegmentSpecs) {
  const order = segmentRecords.length + 1;
  const sourceSpan = span(authorityBytes, authorityOffsets, sourceStart, sourceEnd);
  const targetSpan = span(boundary9TargetBytes, boundary9TargetOffsets, targetStart, targetEnd);
  const recordId = `ttp.r014.segment.${String(order).padStart(3, "0")}`;
  const sourceExpressionId = `${recordId}.expr.en`;
  const targetExpressionId = `${recordId}.expr.id-id`;
  const record = baseRecord("segment", recordId, {
    edition_id: boundary9EditionId,
    locale: "mul",
    unit_id: unitId(unitSuffix),
    order,
    order_key: String(order).padStart(4, "0"),
    segment_kind: segmentKind,
    source_text: sourceSpan.text,
    target_text: targetSpan.text,
    source_content_sha256: sourceSpan.sha256,
    target_content_sha256: targetSpan.sha256,
    source_locator: { path: "authority/downloads/yaintt.tex", start_line: sourceStart, end_line: sourceEnd },
    target_locator: { path: boundary9TargetRelPath, start_line: targetStart, end_line: targetEnd },
    source_expression_id: sourceExpressionId,
    target_expression_id: targetExpressionId,
    expressions: [
      { expression_id: sourceExpressionId, language: "en", locale: "en", source_or_target: "source", text_latex: sourceSpan.text, content_sha256: sourceSpan.sha256, state: "source_frozen" },
      { expression_id: targetExpressionId, language: "id", locale: "id-ID", source_or_target: "target", text_latex: targetSpan.text, content_sha256: targetSpan.sha256, state: "language_reviewed" },
    ],
    translation_state: "language_reviewed",
    rights_id: boundary9RightsId,
    provenance: { kind: "translation", authority_sha256: authoritySha },
    qa_event_ids: [fixedQaIds.crtTopology, fixedQaIds.crtMath, fixedQaIds.crtLanguage],
  });
  segmentRecords.push(record);
  records.push(record);
}
if (boundary9SegmentSpecs.length !== 10 || segmentRecords.length !== 208) throw new Error(`expected 208 segments through Boundary 9, observed ${segmentRecords.length}`);
if (segmentRecords.reduce((sum, record) => sum + record.expressions.length, 0) !== 415) throw new Error("expected 415 segment expressions through Boundary 9");

const boundary10SegmentSpecs = [
  ["section_title", "sec.awtwwc", 1877, 1878, 2114, 2115],
  ["discussion", "sec.awtwwc.discussion.01", 1879, 1882, 2116, 2119],
  ["definition", "def.equivalence-relation", 1884, 1903, 2121, 2140],
  ["theorem", "thm.equivalence-classes-disjoint-or-equal", 1905, 1912, 2142, 2150],
  ["proof", "thm.equivalence-classes-disjoint-or-equal.proof", 1913, 1928, 2151, 2169],
  ["example", "eg.rationals", 1930, 1934, 2171, 2175],
  ["discussion", "sec.awtwwc.discussion.02", 1936, 1939, 2177, 2179],
  ["proposition", "prop.congruence-equivalence-relation", 1941, 1948, 2181, 2188],
  ["definition", "def.integers-mod-n", 1950, 1957, 2190, 2197],
  ["theorem", "thm.integers-mod-n-representatives", 1959, 1966, 2199, 2207],
  ["proof", "thm.integers-mod-n-representatives.proof", 1968, 1975, 2209, 2218],
  ["discussion", "sec.awtwwc.discussion.03", 1977, 1981, 2220, 2224],
  ["definition", "def.congruence-class-operations", 1983, 1989, 2226, 2232],
  ["theorem", "thm.plustimeswelldefined", 1991, 1995, 2234, 2238],
  ["proof", "thm.plustimeswelldefined.proof", 1996, 2004, 2239, 2247],
  ["discussion", "sec.awtwwc.discussion.04", 2006, 2008, 2249, 2251],
  ["theorem", "thm.plustimesproperties", 2009, 2023, 2252, 2266],
  ["proof", "thm.plustimesproperties.proof", 2024, 2027, 2267, 2271],
  ["discussion", "sec.awtwwc.discussion.05", 2029, 2033, 2273, 2277],
  ["theorem", "thm.linear-congruence-classes", 2034, 2045, 2278, 2290],
  ["proof", "thm.linear-congruence-classes.proof", 2046, 2049, 2291, 2294],
  ["exercise_group", "sec.awtwwc.exercises", 2051, 2057, 2296, 2302],
  ["exercise", "sec.awtwwc.exercise.01", 2059, 2070, 2304, 2316],
  ["exercise", "sec.awtwwc.exercise.02", 2071, 2074, 2317, 2320],
  ["exercise", "sec.awtwwc.exercise.03", 2075, 2077, 2321, 2324],
  ["exercise", "sec.awtwwc.exercise.04", 2078, 2082, 2325, 2329],
];
for (const [segmentKind, unitSuffix, sourceStart, sourceEnd, targetStart, targetEnd] of boundary10SegmentSpecs) {
  const order = segmentRecords.length + 1;
  const sourceSpan = span(authorityBytes, authorityOffsets, sourceStart, sourceEnd);
  const targetSpan = span(boundary10TargetBytes, boundary10TargetOffsets, targetStart, targetEnd);
  const recordId = `ttp.r014.segment.${String(order).padStart(3, "0")}`;
  const sourceExpressionId = `${recordId}.expr.en`;
  const targetExpressionId = `${recordId}.expr.id-id`;
  const record = baseRecord("segment", recordId, {
    edition_id: boundary10EditionId,
    locale: "mul",
    unit_id: unitId(unitSuffix),
    order,
    order_key: String(order).padStart(4, "0"),
    segment_kind: segmentKind,
    source_text: sourceSpan.text,
    target_text: targetSpan.text,
    source_content_sha256: sourceSpan.sha256,
    target_content_sha256: targetSpan.sha256,
    source_locator: { path: "authority/downloads/yaintt.tex", start_line: sourceStart, end_line: sourceEnd },
    target_locator: { path: boundary10TargetRelPath, start_line: targetStart, end_line: targetEnd },
    source_expression_id: sourceExpressionId,
    target_expression_id: targetExpressionId,
    expressions: [
      { expression_id: sourceExpressionId, language: "en", locale: "en", source_or_target: "source", text_latex: sourceSpan.text, content_sha256: sourceSpan.sha256, state: "source_frozen" },
      { expression_id: targetExpressionId, language: "id", locale: "id-ID", source_or_target: "target", text_latex: targetSpan.text, content_sha256: targetSpan.sha256, state: "language_reviewed" },
    ],
    translation_state: "language_reviewed",
    rights_id: boundary10RightsId,
    provenance: { kind: "translation", authority_sha256: authoritySha },
    qa_event_ids: [fixedQaIds.awtwwcTopology, fixedQaIds.awtwwcMath, fixedQaIds.awtwwcLanguage],
  });
  segmentRecords.push(record);
  records.push(record);
}
if (boundary10SegmentSpecs.length !== 26 || segmentRecords.length !== 234) throw new Error(`expected 234 segments through Boundary 10, observed ${segmentRecords.length}`);
if (segmentRecords.reduce((sum, record) => sum + record.expressions.length, 0) !== 467) throw new Error("expected 467 segment expressions through Boundary 10");

const boundary11SegmentSpecs = [
  ["section_title", "sec.ephif", 2086, 2086, 2344, 2344],
  ["discussion", "sec.ephif.discussion.01", 2088, 2090, 2346, 2348],
  ["definition", "def.euler-phi", 2091, 2104, 2349, 2362],
  ["discussion", "sec.ephif.discussion.02", 2106, 2108, 2364, 2366],
  ["theorem", "thm.euler-phi-counts-units", 2110, 2114, 2368, 2372],
  ["proof", "thm.euler-phi-counts-units.proof", 2115, 2117, 2373, 2376],
  ["discussion", "sec.ephif.discussion.03", 2119, 2122, 2378, 2382],
  ["theorem", "thm.phiismultiplicative", 2124, 2128, 2384, 2389],
  ["proof", "thm.phiismultiplicative.proof", 2129, 2191, 2390, 2472],
  ["exercise_group", "sec.ephif.exercises", 2193, 2199, 2474, 2480],
  ["exercise", "sec.ephif.exercise.01", 2201, 2204, 2482, 2485],
  ["exercise", "sec.ephif.exercise.02", 2205, 2209, 2486, 2490],
];
for (const [segmentKind, unitSuffix, sourceStart, sourceEnd, targetStart, targetEnd] of boundary11SegmentSpecs) {
  const order = segmentRecords.length + 1;
  const sourceSpan = span(authorityBytes, authorityOffsets, sourceStart, sourceEnd);
  const targetSpan = span(boundary11TargetBytes, boundary11TargetOffsets, targetStart, targetEnd);
  const recordId = `ttp.r014.segment.${String(order).padStart(3, "0")}`;
  const sourceExpressionId = `${recordId}.expr.en`;
  const targetExpressionId = `${recordId}.expr.id-id`;
  const record = baseRecord("segment", recordId, {
    edition_id: boundary11EditionId,
    locale: "mul",
    unit_id: unitId(unitSuffix),
    order,
    order_key: String(order).padStart(4, "0"),
    segment_kind: segmentKind,
    source_text: sourceSpan.text,
    target_text: targetSpan.text,
    source_content_sha256: sourceSpan.sha256,
    target_content_sha256: targetSpan.sha256,
    source_locator: { path: "authority/downloads/yaintt.tex", start_line: sourceStart, end_line: sourceEnd },
    target_locator: { path: boundary11TargetRelPath, start_line: targetStart, end_line: targetEnd },
    source_expression_id: sourceExpressionId,
    target_expression_id: targetExpressionId,
    expressions: [
      { expression_id: sourceExpressionId, language: "en", locale: "en", source_or_target: "source", text_latex: sourceSpan.text, content_sha256: sourceSpan.sha256, state: "source_frozen" },
      { expression_id: targetExpressionId, language: "id", locale: "id-ID", source_or_target: "target", text_latex: targetSpan.text, content_sha256: targetSpan.sha256, state: "language_reviewed" },
    ],
    translation_state: "language_reviewed",
    rights_id: boundary11RightsId,
    provenance: { kind: "translation", authority_sha256: authoritySha },
    qa_event_ids: [fixedQaIds.ephifTopology, fixedQaIds.ephifMath, fixedQaIds.ephifLanguage],
  });
  segmentRecords.push(record);
  records.push(record);
}
if (boundary11SegmentSpecs.length !== 12 || segmentRecords.length !== 246) throw new Error(`expected 246 segments through Boundary 11, observed ${segmentRecords.length}`);
if (segmentRecords.reduce((sum, record) => sum + record.expressions.length, 0) !== 491) throw new Error("expected 491 segment expressions through Boundary 11");

const domainTerms = [
  ["well_ordering_principle", "well-ordering principle", "prinsip keterurutan baik", [], ["pengurutan baik", "prinsip terurut baik"]],
  ["least_element", "least element", "elemen terkecil", [], []],
  ["pigeonhole_principle", "pigeonhole principle", "prinsip sarang merpati", [], ["rumah merpati"]],
  ["mathematical_induction", "mathematical induction", "induksi matematika", [], []],
  ["strong_induction", "second principle of mathematical induction", "prinsip kedua induksi matematika", ["induksi kuat"], []],
  ["natural_number", "natural number", "bilangan asli", [], []],
  ["integer", "integer", "bilangan bulat", [], []],
  ["cryptology", "cryptology", "kriptologi", [], ["kriptografi"]],
  ["cryptography", "cryptography", "kriptografi", [], []],
  ["cryptanalysis", "cryptanalysis", "kriptanalisis", [], []],
  ["cryptosystem", "cryptosystem", "kriptosistem", [], []],
  ["key_exchange", "key exchange", "pertukaran kunci", [], []],
  ["rsa", "RSA cryptosystem", "kriptosistem RSA", [], []],
  ["diffie_hellman", "Diffie-Hellman key exchange", "pertukaran kunci Diffie-Hellman", [], []],
  ["elgamal", "ElGamal cryptosystem", "kriptosistem ElGamal", [], []],
  ["euler_theorem", "Euler's theorem", "Teorema Euler", [], []],
  ["primitive_root", "primitive root", "akar primitif", [], []],
  ["index_discrete_log", "number-theoretic index", "indeks", ["logaritma diskret"], []],
];
const generatedTerms = [
  ["Theorem", "Teorema"], ["Corollary", "Akibat"], ["Lemma", "Lema"], ["Proposition", "Proposisi"],
  ["Examples", "Contoh-contoh"], ["Definition", "Definisi"], ["Exercise", "Latihan"], ["Remark", "Catatan"],
  ["Example", "Contoh"], ["Proof", "Bukti"], ["Chapter", "Bab"], ["Contents", "Daftar Isi"],
  ["Bibliography", "Daftar Pustaka"], ["Index", "Indeks"], ["Figure", "Gambar"], ["Table", "Tabel"],
];
let termOrder = 0;
for (const [code, sourceTerm, targetTerm, variants, rejected] of domainTerms) {
  termOrder += 1;
  records.push(baseRecord("term", `ttp.r014.term.${String(termOrder).padStart(3, "0")}`, {
    locale: "id-ID",
    concept_id: conceptId(code),
    source_term: sourceTerm,
    target_term: targetTerm,
    variants,
    rejected_forms: rejected,
    scope: "R014 mathematical prose",
    register: "formal textbook",
    evidence: { path: "00_control/TERMINOLOGY.md", target_sha256: targetSha },
    examples: [{ source_text: sourceTerm, target_text: targetTerm, usage: "canonical R014 term mapping", evidence_path: "00_control/TERMINOLOGY.md" }],
    order: termOrder,
  }));
}
for (const [sourceTerm, targetTerm] of generatedTerms) {
  termOrder += 1;
  records.push(baseRecord("term", `ttp.r014.term.${String(termOrder).padStart(3, "0")}`, {
    locale: "id-ID",
    concept_id: null,
    source_term: sourceTerm,
    target_term: targetTerm,
    variants: [],
    rejected_forms: [],
    scope: "generated reader label",
    register: "interface and structural label",
    evidence: { path: targetRelPath, target_sha256: targetSha },
    examples: [{ source_text: sourceTerm, target_text: targetTerm, usage: "generated structural label", evidence_path: targetRelPath }],
    order: termOrder,
  }));
}
const aowiTerms = [
  ["binary_operation", "binary operation", "operasi biner"],
  ["addition", "addition", "penjumlahan"],
  ["multiplication", "multiplication", "perkalian"],
  ["commutativity", "commutativity of addition and multiplication", "komutativitas penjumlahan dan perkalian"],
  ["associativity", "associativity of addition and multiplication", "asosiativitas penjumlahan dan perkalian"],
  ["distributivity", "distributivity of multiplication over addition", "distributivitas perkalian terhadap penjumlahan"],
  ["identity_element", "identity element", "elemen identitas"],
  ["additive_inverse", "additive inverse", "invers aditif"],
  ["multiplicative_inverse", "multiplicative inverse", "invers multiplikatif"],
  ["subtraction", "subtraction", "pengurangan"],
  ["division", "division", "pembagian"],
];
for (const [code, sourceTerm, targetTerm] of aowiTerms) {
  termOrder += 1;
  records.push(baseRecord("term", `ttp.r014.term.${String(termOrder).padStart(3, "0")}`, {
    locale: "id-ID",
    concept_id: conceptId(code),
    source_term: sourceTerm,
    target_term: targetTerm,
    variants: [],
    rejected_forms: [],
    scope: "R014 Section 1.2 mathematical prose",
    register: "formal textbook",
    evidence: { path: "00_control/TERMINOLOGY.md", target_sha256: targetSha },
    examples: [{ source_text: sourceTerm, target_text: targetTerm, usage: "canonical Section 1.2 term mapping", evidence_path: "00_control/TERMINOLOGY.md" }],
    order: termOrder,
  }));
}
const dadaTerms = [
  ["divisibility", "divisibility", "keterbagian"],
  ["factor", "factor", "faktor"],
  ["divisor", "divisor", "pembagi"],
  ["multiple", "multiple", "kelipatan"],
  ["parity", "even / odd", "genap / ganjil"],
  ["linear_combination", "linear combination", "kombinasi linear"],
  ["division_algorithm", "Division Algorithm", "Algoritma Pembagian"],
  ["quotient", "quotient", "hasil bagi"],
  ["remainder", "remainder", "sisa pembagian"],
];
for (const [code, sourceTerm, targetTerm] of dadaTerms) {
  termOrder += 1;
  records.push(baseRecord("term", `ttp.r014.term.${String(termOrder).padStart(3, "0")}`, {
    locale: "id-ID",
    concept_id: conceptId(code),
    source_term: sourceTerm,
    target_term: targetTerm,
    variants: [],
    rejected_forms: [],
    scope: "R014 Section 1.3 mathematical prose",
    register: "formal textbook",
    evidence: { path: "00_control/TERMINOLOGY.md", target_sha256: targetSha },
    examples: [{ source_text: sourceTerm, target_text: targetTerm, usage: "canonical Section 1.3 term mapping", evidence_path: "00_control/TERMINOLOGY.md" }],
    order: termOrder,
  }));
}
if (termOrder !== 54) throw new Error(`expected 54 terms, observed ${termOrder}`);

const boundary4Terms = [
  ["base", "base", "basis"],
  ["base_representation", "base-b representation", "representasi basis b"],
  ["digit", "digit", "digit"],
  ["binary_representation", "binary representation", "representasi biner"],
  ["decimal", "decimal", "desimal"],
  ["octal", "octal", "oktal"],
  ["hexadecimal", "hexadecimal", "heksadesimal"],
  ["hex", "hex", "heks"],
  ["sexagesimal", "sexagesimal", "seksagesimal"],
  ["bit", "bit / binary digit", "bit / digit biner"],
];
for (const [code, sourceTerm, targetTerm] of boundary4Terms) {
  termOrder += 1;
  records.push(baseRecord("term", `ttp.r014.term.${String(termOrder).padStart(3, "0")}`, {
    locale: "id-ID",
    concept_id: conceptId(code),
    source_term: sourceTerm,
    target_term: targetTerm,
    variants: [],
    rejected_forms: [],
    scope: "R014 Section 1.4 mathematical prose",
    register: "formal textbook",
    evidence: { path: "qa/frozen-boundaries/boundary4/TERMINOLOGY.md", target_sha256: boundary4TargetSha },
    examples: [{ source_text: sourceTerm, target_text: targetTerm, usage: "canonical Section 1.4 term mapping", evidence_path: "qa/frozen-boundaries/boundary4/TERMINOLOGY.md" }],
    order: termOrder,
  }));
}
if (termOrder !== 64) throw new Error(`expected 64 terms through Boundary 4, observed ${termOrder}`);

const boundary5Terms = [
  ["greatest_common_divisor", "greatest common divisor (gcd)", "faktor persekutuan terbesar (FPB)"],
  ["common_divisor", "common divisor", "pembagi bersama"],
  ["relatively_prime", "relatively prime", "relatif prima"],
  ["mutually_relatively_prime", "mutually relatively prime", "relatif prima secara bersama-sama"],
  ["pairwise_relatively_prime", "pairwise relatively prime", "relatif prima berpasangan"],
];
for (const [code, sourceTerm, targetTerm] of boundary5Terms) {
  termOrder += 1;
  records.push(baseRecord("term", `ttp.r014.term.${String(termOrder).padStart(3, "0")}`, {
    locale: "id-ID",
    concept_id: conceptId(code),
    source_term: sourceTerm,
    target_term: targetTerm,
    variants: [],
    rejected_forms: [],
    scope: "R014 Section 1.5 mathematical prose",
    register: "formal textbook",
    evidence: { path: boundary5TerminologyRelPath, evidence_sha256: boundary5TerminologySha, target_sha256: boundary5TargetSha },
    examples: [{ source_text: sourceTerm, target_text: targetTerm, usage: "canonical Section 1.5 term mapping", evidence_path: boundary5TerminologyRelPath }],
    order: termOrder,
  }));
}
if (termOrder !== 69) throw new Error(`expected 69 terms through Boundary 5, observed ${termOrder}`);

const boundary6Terms = [
  ["euclidean_algorithm", "Euclidean Algorithm", "Algoritma Euklides"],
  ["extended_euclidean_algorithm", "extended Euclidean Algorithm", "Algoritma Euklides diperluas"],
];
for (const [code, sourceTerm, targetTerm] of boundary6Terms) {
  termOrder += 1;
  records.push(baseRecord("term", `ttp.r014.term.${String(termOrder).padStart(3, "0")}`, {
    locale: "id-ID",
    concept_id: conceptId(code),
    source_term: sourceTerm,
    target_term: targetTerm,
    variants: [],
    rejected_forms: [],
    scope: "R014 Section 1.6 mathematical prose",
    register: "formal textbook",
    evidence: { path: boundary6TerminologyRelPath, evidence_sha256: boundary6TerminologySha, target_sha256: boundary6TargetSha },
    examples: [{ source_text: sourceTerm, target_text: targetTerm, usage: "canonical Section 1.6 term mapping", evidence_path: boundary6TerminologyRelPath }],
    order: termOrder,
  }));
}
if (termOrder !== 71) throw new Error(`expected 71 terms through Boundary 6, observed ${termOrder}`);

const boundary7Terms = [
  ["congruence", "congruence / congruent", "kongruensi / kongruen"],
  ["modulo", "modulo", "modulo"],
  ["congruence_class", "congruence class", "kelas kongruensi"],
  ["chinese_remainder_theorem", "Chinese Remainder Theorem", "Teorema Sisa Cina"],
  ["euclids_lemma", "Euclid's Lemma", "Lemma Euklides"],
];
for (const [code, sourceTerm, targetTerm] of boundary7Terms) {
  termOrder += 1;
  records.push(baseRecord("term", `ttp.r014.term.${String(termOrder).padStart(3, "0")}`, {
    locale: "id-ID",
    concept_id: conceptId(code),
    source_term: sourceTerm,
    target_term: targetTerm,
    variants: [],
    rejected_forms: [],
    scope: "R014 Chapter 2 introduction and Section 2.1 mathematical prose",
    register: "formal textbook",
    evidence: { path: boundary7TerminologyRelPath, evidence_sha256: boundary7TerminologySha, target_sha256: boundary7TargetSha },
    examples: [{ source_text: sourceTerm, target_text: targetTerm, usage: "canonical Chapter 2 introduction and Section 2.1 term mapping", evidence_path: boundary7TerminologyRelPath }],
    order: termOrder,
  }));
}
if (termOrder !== 76) throw new Error(`expected 76 terms through Boundary 7, observed ${termOrder}`);

const boundary8Terms = [
  ["linear_congruence", "linear congruence", "kongruensi linear"],
  ["diophantine_equation", "Diophantine equation", "persamaan Diofantin"],
  ["modular_inverse", "modular inverse", "invers modular"],
];
for (const [code, sourceTerm, targetTerm] of boundary8Terms) {
  termOrder += 1;
  records.push(baseRecord("term", `ttp.r014.term.${String(termOrder).padStart(3, "0")}`, {
    locale: "id-ID",
    concept_id: conceptId(code),
    source_term: sourceTerm,
    target_term: targetTerm,
    variants: [],
    rejected_forms: [],
    scope: "R014 Section 2.2 mathematical prose",
    register: "formal textbook",
    evidence: { path: boundary8TerminologyRelPath, evidence_sha256: boundary8TerminologySha, target_sha256: boundary8TargetSha },
    examples: [{ source_text: sourceTerm, target_text: targetTerm, usage: "canonical Section 2.2 term mapping", evidence_path: boundary8TerminologyRelPath }],
    order: termOrder,
  }));
}
if (termOrder !== 79) throw new Error(`expected 79 terms through Boundary 8, observed ${termOrder}`);

const boundary9Terms = [
  ["system_of_congruences", "system of congruences", "sistem kongruensi"],
];
for (const [code, sourceTerm, targetTerm] of boundary9Terms) {
  termOrder += 1;
  records.push(baseRecord("term", `ttp.r014.term.${String(termOrder).padStart(3, "0")}`, {
    locale: "id-ID",
    concept_id: conceptId(code),
    source_term: sourceTerm,
    target_term: targetTerm,
    variants: [],
    rejected_forms: [],
    scope: "R014 Section 2.3 mathematical prose",
    register: "formal textbook",
    evidence: { path: boundary9TerminologyRelPath, evidence_sha256: boundary9TerminologySha, target_sha256: boundary9TargetSha },
    examples: [{ source_text: sourceTerm, target_text: targetTerm, usage: "canonical Section 2.3 term mapping", evidence_path: boundary9TerminologyRelPath }],
    order: termOrder,
  }));
}
if (termOrder !== 80) throw new Error(`expected 80 terms through Boundary 9, observed ${termOrder}`);

const boundary10Terms = [
  ["equivalence_relation", "equivalence relation", "relasi ekuivalensi"],
  ["reflexivity", "reflexivity", "refleksivitas"],
  ["symmetry", "symmetry", "simetri"],
  ["transitivity", "transitivity", "transitivitas"],
  ["equivalence_class", "equivalence class", "kelas ekuivalensi"],
  ["class_representative", "class representative", "wakil kelas ekuivalensi"],
  ["integers_mod_n", "integers mod n", "bilangan bulat modulo n"],
  ["well_defined", "well-defined", "terdefinisi dengan baik"],
];
for (const [code, sourceTerm, targetTerm] of boundary10Terms) {
  termOrder += 1;
  records.push(baseRecord("term", `ttp.r014.term.${String(termOrder).padStart(3, "0")}`, {
    locale: "id-ID",
    concept_id: conceptId(code),
    source_term: sourceTerm,
    target_term: targetTerm,
    variants: [],
    rejected_forms: [],
    scope: "R014 Section 2.4 mathematical prose",
    register: "formal textbook",
    evidence: { path: boundary10TerminologyRelPath, evidence_sha256: boundary10TerminologySha, target_sha256: boundary10TargetSha },
    examples: [{ source_text: sourceTerm, target_text: targetTerm, usage: "canonical Section 2.4 term mapping", evidence_path: boundary10TerminologyRelPath }],
    order: termOrder,
  }));
}
if (termOrder !== 88) throw new Error(`expected 88 terms through Boundary 10, observed ${termOrder}`);

const boundary11Terms = [
  ["euler_phi_function", "Euler's phi function", "fungsi phi Euler"],
  ["euler_totient_function", "Euler's totient function", "fungsi totient Euler"],
  ["cardinality", "cardinality / number of elements", "kardinalitas / banyaknya elemen"],
  ["cartesian_product", "Cartesian product", "hasil kali Kartesius"],
  ["injective", "one-to-one / injective", "injektif"],
  ["surjective", "onto / surjective", "surjektif"],
  ["bijective", "bijective", "bijektif"],
  ["unit_group", "group of multiplicatively invertible classes", "grup unit"],
  ["multiplicative_function", "multiplicative function", "fungsi multiplikatif"],
];
for (const [code, sourceTerm, targetTerm] of boundary11Terms) {
  termOrder += 1;
  records.push(baseRecord("term", `ttp.r014.term.${String(termOrder).padStart(3, "0")}`, {
    locale: "id-ID",
    concept_id: conceptId(code),
    source_term: sourceTerm,
    target_term: targetTerm,
    variants: [],
    rejected_forms: [],
    scope: "R014 Section 2.5 mathematical prose",
    register: "formal textbook",
    evidence: { path: boundary11TerminologyRelPath, evidence_sha256: boundary11TerminologySha, target_sha256: boundary11TargetSha },
    examples: [{ source_text: sourceTerm, target_text: targetTerm, usage: "canonical Section 2.5 term mapping", evidence_path: boundary11TerminologyRelPath }],
    order: termOrder,
  }));
}
if (termOrder !== 97) throw new Error(`expected 97 terms through Boundary 11, observed ${termOrder}`);

const rightsIdByFilename = new Map();
for (const component of componentRights.components) {
  for (const filename of component.paths) rightsIdByFilename.set(filename, component.rights_id);
  records.push(baseRecord("rights", component.rights_id, {
    locale: "und",
    component_paths: component.paths,
    license: component.license,
    license_url: component.license_url ?? null,
    attribution: component.attribution ?? [],
    obligations: component.derivative_obligations ?? [],
    rights_status: component.status,
    evidence: {
      source_note: component.source_note ?? component.evidence ?? null,
      source_url: component.source_url ?? null,
      manifest: "authority/COMPONENT_RIGHTS.json",
    },
  }));
}
records.push(baseRecord("rights", "rights.yaintt.id-id.derivative", {
  locale: "id-ID",
  component_paths: [targetRelPath, "output/YAINTT_ID_BOUNDARY1.pdf", "output/YAINTT_ID_BOUNDARY2.pdf", "output/YAINTT_ID_BOUNDARY3.pdf"],
  license: "CC BY-SA 4.0",
  license_url: "https://creativecommons.org/licenses/by-sa/4.0/",
  attribution: ["Jonathan A. Poritz", "Wissam Raji", "Bahasa Indonesia translation prepared for Floris"],
  obligations: ["attribution", "indicate_changes", "share_alike", "no_additional_restrictions", "preserve_component_attribution"],
  rights_status: "admissible_with_exact_notice",
  change_notice: "Bahasa Indonesia translation plus documented technical compatibility and layout changes.",
  non_endorsement: "Not an official publication of Poritz, Raji, or Colorado State University Pueblo and does not imply their endorsement.",
  evidence: { path: targetRelPath, lines: [336, 341] },
}));
records.push(baseRecord("rights", boundary4RightsId, {
  locale: "id-ID",
  component_paths: [boundary4TargetRelPath, "output/YAINTT_ID_BOUNDARY4.pdf"],
  license: "CC BY-SA 4.0",
  license_url: "https://creativecommons.org/licenses/by-sa/4.0/",
  attribution: ["Jonathan A. Poritz", "Wissam Raji", "Bahasa Indonesia translation prepared for Floris"],
  obligations: ["attribution", "indicate_changes", "share_alike", "no_additional_restrictions", "preserve_component_attribution"],
  rights_status: "admissible_with_exact_notice",
  change_notice: "Bahasa Indonesia translation plus documented technical compatibility and layout changes.",
  non_endorsement: "Not an official publication of Poritz, Raji, or Colorado State University Pueblo and does not imply their endorsement.",
  evidence: { path: boundary4TargetRelPath, lines: [336, 341] },
}));
records.push(baseRecord("rights", boundary5RightsId, {
  locale: "id-ID",
  component_paths: [boundary5TargetRelPath, "output/YAINTT_ID_BOUNDARY5.pdf"],
  license: "CC BY-SA 4.0",
  license_url: "https://creativecommons.org/licenses/by-sa/4.0/",
  attribution: ["Jonathan A. Poritz", "Wissam Raji", "Bahasa Indonesia translation prepared for Floris"],
  obligations: ["attribution", "indicate_changes", "share_alike", "no_additional_restrictions", "preserve_component_attribution"],
  rights_status: "admissible_with_exact_notice",
  change_notice: "Bahasa Indonesia translation plus documented technical compatibility and layout changes.",
  non_endorsement: "Not an official publication of Poritz, Raji, or Colorado State University Pueblo and does not imply their endorsement.",
  evidence: { path: boundary5TargetRelPath, lines: [336, 341] },
}));
records.push(baseRecord("rights", boundary6RightsId, {
  locale: "id-ID",
  component_paths: [boundary6TargetRelPath, "output/YAINTT_ID_BOUNDARY6.pdf"],
  license: "CC BY-SA 4.0",
  license_url: "https://creativecommons.org/licenses/by-sa/4.0/",
  attribution: ["Jonathan A. Poritz", "Wissam Raji", "Bahasa Indonesia translation prepared for Floris"],
  obligations: ["attribution", "indicate_changes", "share_alike", "no_additional_restrictions", "preserve_component_attribution"],
  rights_status: "admissible_with_exact_notice",
  change_notice: "Bahasa Indonesia translation plus documented technical compatibility and layout changes.",
  non_endorsement: "Not an official publication of Poritz, Raji, or Colorado State University Pueblo and does not imply their endorsement.",
  evidence: { path: boundary6TargetRelPath, lines: [336, 341] },
}));
records.push(baseRecord("rights", boundary7RightsId, {
  locale: "id-ID",
  component_paths: [boundary7TargetRelPath, "output/YAINTT_ID_BOUNDARY7.pdf"],
  license: "CC BY-SA 4.0",
  license_url: "https://creativecommons.org/licenses/by-sa/4.0/",
  attribution: ["Jonathan A. Poritz", "Wissam Raji", "Bahasa Indonesia translation prepared for Floris"],
  obligations: ["attribution", "indicate_changes", "share_alike", "no_additional_restrictions", "preserve_component_attribution"],
  rights_status: "admissible_with_exact_notice",
  change_notice: "Bahasa Indonesia translation plus documented technical compatibility and layout changes.",
  non_endorsement: "Not an official publication of Poritz, Raji, or Colorado State University Pueblo and does not imply their endorsement.",
  evidence: { path: boundary7TargetRelPath, lines: [336, 341] },
}));
records.push(baseRecord("rights", boundary8RightsId, {
  locale: "id-ID",
  component_paths: [boundary8TargetRelPath, "output/YAINTT_ID_BOUNDARY8.pdf"],
  license: "CC BY-SA 4.0",
  license_url: "https://creativecommons.org/licenses/by-sa/4.0/",
  attribution: ["Jonathan A. Poritz", "Wissam Raji", "Bahasa Indonesia translation prepared for Floris"],
  obligations: ["attribution", "indicate_changes", "share_alike", "no_additional_restrictions", "preserve_component_attribution"],
  rights_status: "admissible_with_exact_notice",
  change_notice: "Bahasa Indonesia translation plus documented technical compatibility and layout changes.",
  non_endorsement: "Not an official publication of Poritz, Raji, or Colorado State University Pueblo and does not imply their endorsement.",
  evidence: { path: boundary8TargetRelPath, lines: [336, 341] },
}));
records.push(baseRecord("rights", boundary9RightsId, {
  locale: "id-ID",
  component_paths: [boundary9TargetRelPath, "output/YAINTT_ID_BOUNDARY9.pdf"],
  license: "CC BY-SA 4.0",
  license_url: "https://creativecommons.org/licenses/by-sa/4.0/",
  attribution: ["Jonathan A. Poritz", "Wissam Raji", "Bahasa Indonesia translation prepared for Floris"],
  obligations: ["attribution", "indicate_changes", "share_alike", "no_additional_restrictions", "preserve_component_attribution"],
  rights_status: "admissible_with_exact_notice",
  change_notice: "Bahasa Indonesia translation plus documented technical compatibility and layout changes.",
  non_endorsement: "Not an official publication of Poritz, Raji, or Colorado State University Pueblo and does not imply their endorsement.",
  evidence: { path: boundary9TargetRelPath, lines: [336, 341] },
}));
records.push(baseRecord("rights", boundary10RightsId, {
  locale: "id-ID",
  component_paths: [boundary10TargetRelPath, "output/YAINTT_ID_BOUNDARY10.pdf"],
  license: "CC BY-SA 4.0",
  license_url: "https://creativecommons.org/licenses/by-sa/4.0/",
  attribution: ["Jonathan A. Poritz", "Wissam Raji", "Bahasa Indonesia translation prepared for Floris"],
  obligations: ["attribution", "indicate_changes", "share_alike", "no_additional_restrictions", "preserve_component_attribution"],
  rights_status: "admissible_with_exact_notice",
  change_notice: "Bahasa Indonesia translation plus documented technical compatibility and layout changes.",
  non_endorsement: "Not an official publication of Poritz, Raji, or Colorado State University Pueblo and does not imply their endorsement.",
  evidence: { path: boundary10TargetRelPath, lines: [336, 341] },
}));
records.push(baseRecord("rights", boundary11RightsId, {
  locale: "id-ID",
  component_paths: [boundary11TargetRelPath, "output/YAINTT_ID_BOUNDARY11.pdf"],
  license: "CC BY-SA 4.0",
  license_url: "https://creativecommons.org/licenses/by-sa/4.0/",
  attribution: ["Jonathan A. Poritz", "Wissam Raji", "Bahasa Indonesia translation prepared for Floris"],
  obligations: ["attribution", "indicate_changes", "share_alike", "no_additional_restrictions", "preserve_component_attribution"],
  rights_status: "admissible_with_exact_notice",
  change_notice: "Bahasa Indonesia translation plus documented technical compatibility and layout changes.",
  non_endorsement: "Not an official publication of Poritz, Raji, or Colorado State University Pueblo and does not imply their endorsement.",
  evidence: { path: boundary11TargetRelPath, lines: [336, 341] },
}));

const sourceAssetNames = sourceAuthority.files
  .filter((item) => !["landing_and_license_authority", "official_source_corresponding_pdf"].includes(item.role))
  .map((item) => path.basename(item.path));
const sourceDependencyIds = sourceAssetNames.filter((name) => name !== "yaintt.tex").map(assetId);
for (const item of sourceAuthority.files) {
  const filename = path.basename(item.path);
  const id = assetId(filename);
  let targetVariant = null;
  if (filename === "yaintt.tex") {
    targetVariant = { path: targetRelPath, bytes: targetBytes.length, sha256: targetSha };
  } else if (filename === "refs.bib") {
    const targetRef = path.join(root, "source", "refs.bib");
    targetVariant = { path: "source/refs.bib", bytes: fs.statSync(targetRef).size, sha256: sha256File(targetRef) };
  } else if (filename.endsWith(".eps") && filename !== "by-sa.eps") {
    const targetAsset = path.join(root, "source", "assets", filename);
    targetVariant = { path: `source/assets/${filename}`, bytes: fs.statSync(targetAsset).size, sha256: sha256File(targetAsset) };
  }
  records.push(baseRecord("asset", id, {
    locale: "und",
    path: item.path,
    url: item.url,
    role: item.role,
    bytes: item.bytes,
    sha256: item.sha256,
    mime_type: filename.endsWith(".tex") ? "application/x-tex" : filename.endsWith(".bib") ? "application/x-bibtex" : filename.endsWith(".eps") ? "application/postscript" : filename.endsWith(".pdf") ? "application/pdf" : "text/html",
    rights_id: rightsIdByFilename.get(filename) ?? (filename === "yaintt.pdf" ? "rights.yaintt.official_pdf" : "rights.yaintt.landing_page"),
    dependency_ids: filename === "yaintt.tex" ? sourceDependencyIds : [],
    retrieved_utc: item.retrieved_utc,
    server_last_modified: item.server_last_modified,
    target_variant: targetVariant,
    target_disposition: filename === "by-sa.eps" ? "omitted_rights_unclosed" : targetVariant ? "preserved_or_localised" : "authority_witness_only",
  }));
}

const corrections = [
  [1, "build_control", 131, 131, "%\\def\\suppressallIndex{}", "%\\def\\suppressIndex{}", "Make the documented switch match the back-matter test.", ["backmatter.index"], "candidate_for_single_final_upstream_report", "R014-ADV-0004"],
  [2, "mathematics", 515, 515, "(n+1).n^n", "(n+1)\\cdot n^n", "A period is punctuation, not a multiplication operator.", ["eg.inductionv1b"], "candidate_for_single_final_upstream_report", "R014-ADV-0005"],
  [3, "typography", 492, 492, "the the statement", "pernyataan tersebut", "Remove the duplicated word while translating.", ["eg.inductionv1a"], "candidate_for_single_final_upstream_report", "R014-ADV-0006"],
  [4, "locator", 375, 377, "http://www.poritz.net/jonathan/share/yaintt", "https://www.poritz.net/jonathan/share/yaintt", "Use the working HTTPS authority locators.", ["frontmatter.release-notes"], "not_applicable_derivative_locator_update", "R014-ADV-0007"],
  [5, "layout", 265, 265, "width=15cm,clip", "width=.85\\textwidth,clip", "Fit the longer Indonesian title without altering the cover image.", ["frontmatter.title-page.figure.cover"], "not_applicable_derivative_layout", "R014-ADV-0009"],
  [6, "layout", 568, 569, "Use mathematical induction to prove that", "Gunakan induksi matematika untuk membuktikan bahwa\\newline", "Move a long formula to the next line to prevent reader-visible overflow.", ["sec.wopami.exercise.03"], "not_applicable_derivative_layout", "R014-ADV-0009"],
  [7, "boundary_reader", 335, 345, "Chapter~\\ref{chap:Crypto}", "Bab~4 serta \\S\\S~5.5 dan 5.6", "Resolve forward references numerically only in the bounded reader; preserve refs in the full branch.", ["frontmatter.release-notes"], "not_applicable_boundary_reader", "R014-ADV-0010"],
  [8, "component_rights", 304, 304, "\\includegraphics[height=.7cm,clip]{by-sa.eps}", "textual CC BY-SA 4.0 notice; badge omitted", "The badge EPS lacks component-specific rights evidence and embeds Adobe procsets.", ["frontmatter.preface.figure.license-badge"], "not_applicable_component_replacement", "R014-ADV-0002"],
  [9, "typography", 287, 287, "University --Pueblo", "University, Pueblo", "Restore missing spacing/punctuation in the institution name.", ["frontmatter.title-page"], "candidate_for_single_final_upstream_report", "R014-ADV-0011"],
  [10, "build_compatibility", 190, 192, "\\let\\@@pmod\\pmod", "\\NewCommandCopy{\\@@pmod}{\\pmod} with a legacy fallback", "Prevent recursion of the robust pmod command under the 2025 LaTeX kernel.", ["book"], "candidate_for_single_final_upstream_report", "R014-ADV-0012"],
  [11, "mathematics", 622, 628, "only the integer $1$ has a", "hanyalah $1$ dan $-1$", "Both 1 and -1 are units in Z, and each is its own multiplicative inverse.", ["sec.aowi"], "candidate_for_single_final_upstream_report", "R014-ADV-0013"],
  [12, "mathematics", 681, 685, "\\begin{proposition} $\\forall a\\in\\ZZ$ we have $a\\mid 0$.", "Bind the nonzero-divisor domain in all three propositions.", "The section defines divisibility only for a nonzero divisor, so the proposition domains must retain that convention.", ["sec.dada.proposition.zero", "sec.dada.proposition.size", "sec.dada.proposition.absolute-value"], "candidate_for_single_final_upstream_report", "R014-ADV-0014"],
  [13, "mathematics", 742, 752, "Consider the set $A=\\{a-bk\\geq 0 \\mid k\\in \\ZZ\\}$.", "A=\\{a-bk\\mid k\\in\\ZZ,\\ a-bk\\geq 0\\}; least element of A", "The original set-builder is malformed and 'least positive' excludes the valid zero remainder.", ["thm.the-da.proof"], "candidate_for_single_final_upstream_report", "R014-ADV-0015"],
  [14, "mathematics", 767, 769, "$-\\max(r_1,r_2)\\leq|r_2-r_1|", "$0\\leq|r_2-r_1|", "The lower bound for an absolute value should be zero; the negative bound is vacuous.", ["thm.the-da.proof"], "candidate_for_single_final_upstream_report", "R014-ADV-0016"],
  [15, "mathematics", 813, 819, "Show that the square of every odd integer is of the form $8m+1$.", "State explicitly that the parameter m is an integer in Exercises 9 and 10.", "The exercise conclusions use an otherwise unbound parameter m.", ["sec.dada.exercise.09", "sec.dada.exercise.10"], "candidate_for_single_final_upstream_report", "R014-ADV-0017"],
];
for (const [number, type, start, end, sourceText, targetAfter, rationale, affectedSuffixes, disposition, adverseId] of corrections) {
  if (!authorityText.includes(sourceText)) throw new Error(`authority correction witness missing: ${number}`);
  if (!adverseLedgerText.includes(`## ${adverseId} —`)) throw new Error(`adverse-ledger witness missing: ${adverseId}`);
  records.push(baseRecord("correction", correctionId(number), {
    locale: "mul",
    correction_type: type,
    authority_locator: { path: "authority/downloads/yaintt.tex", start_line: start, end_line: end },
    source_text: sourceText,
    target_text: targetAfter,
    rationale,
    evidence: { authority_sha256: authoritySha, adverse_ledger: { id: adverseId, path: adverseLedgerBackendPath, sha256: adverseLedgerSha } },
    upstream_report_disposition: disposition,
    affected_unit_ids: affectedSuffixes.map(unitId),
    report_status: "not_submitted",
  }));
}

const boundary4Corrections = [
  [16, "mathematics", 829, 915, "\\exists a_1,\\dots,a_l\\in\\ZZ", "Include $a_0$, permit $l\\geq0$, state uniqueness, and handle the one-digit branch.", "The theorem omits $a_0$ from its quantified digits and its proof assumes a positive-length quotient chain, so the zero-length expansion and uniqueness claim need explicit closure.", ["thm.basebexpansion", "thm.basebexpansion.proof"], "candidate_for_single_final_upstream_report", "R014-ADV-0018"],
  [17, "mathematics", 899, 913, "If the two expansions are different, then there exists $0\\leq j\\leq", "Choose the smallest differing index $j$ and restore the minus sign when isolating $a_j-c_j$.", "Without choosing the least differing index, factoring out $b^j$ discards lower-order terms; the displayed rearrangement also loses a minus sign.", ["thm.basebexpansion.proof"], "candidate_for_single_final_upstream_report", "R014-ADV-0019"],
  [18, "mathematics", 917, 936, "the sequences of digits", "Use the digit string $(m)_b=a_\\ell\\dots a_1a_0$, correct $a_j$, and require $\\ell+1$ wires.", "The definition omits the units digit, conflicts with the section notation, contains a missing subscript, and undercounts the wires required for digits indexed 0 through l.", ["def.baseb"], "candidate_for_single_final_upstream_report", "R014-ADV-0020"],
];
for (const [number, type, start, end, sourceText, targetAfter, rationale, affectedSuffixes, disposition, adverseId] of boundary4Corrections) {
  if (!authorityText.includes(sourceText)) throw new Error(`Boundary 4 authority correction witness missing: ${number}`);
  if (!boundary4LedgerText.includes(`## ${adverseId} —`)) throw new Error(`Boundary 4 adverse-ledger witness missing: ${adverseId}`);
  records.push(baseRecord("correction", correctionId(number), {
    locale: "mul",
    correction_type: type,
    authority_locator: { path: "authority/downloads/yaintt.tex", start_line: start, end_line: end },
    source_text: sourceText,
    target_text: targetAfter,
    rationale,
    evidence: { authority_sha256: authoritySha, adverse_ledger: { id: adverseId, path: boundary4LedgerBackendPath, sha256: boundary4LedgerSha } },
    upstream_report_disposition: disposition,
    affected_unit_ids: affectedSuffixes.map(unitId),
    report_status: "not_submitted",
  }));
}

const boundary5Corrections = [
  [19, "mathematics", 997, 1000, "Two integers $a$ and $b$, not both $0$, can have only finitely many divisors", "At least one input is nonzero and has finitely many divisors, so their common-divisor set is finite.", "Zero has infinitely many divisors; only the common-divisor set is forced finite when the inputs are not both zero.", ["sec.gcd.discussion.01"], "candidate_for_single_final_upstream_report", "R014-ADV-0021"],
  [20, "mathematics", 1034, 1051, "If $a,b\\in\\ZZ$ have $\\gcd(a,b)=d$ then $\\gcd(a/d,b/d)=1$.", "Exclude $(a,b)=(0,0)$ and bind the quotient witnesses in $\\ZZ$.", "The all-zero pair makes division by $d=0$ undefined, and quotient witnesses may be negative.", ["thm.dividebygcd", "thm.dividebygcd.proof"], "candidate_for_single_final_upstream_report", "R014-ADV-0022"],
  [21, "mathematics", 1096, 1104, "Assume without loss of generality that $a,b\\in\\NN$ are positive integers.", "Use nonnegative absolute values, not both zero, and handle whichever input is positive.", "Absolute values make the inputs nonnegative rather than both positive, so either input may be zero.", ["thm.gcdislincomb.proof"], "candidate_for_single_final_upstream_report", "R014-ADV-0023"],
  [22, "mathematics", 1166, 1169, "For $n\\in\\NN$ and $a_1,\\dots,a_n\\in\\ZZ$, if $a_1,a_2,\\dots,a_n$ are pairwise", "Require $n\\geq 2$ before concluding mutual relative primality.", "For $n=1$, pairwise relative primality is vacuous and does not imply that $|a_1|=1$.", ["sec.gcd.proposition.pairwise-implies-mutual"], "candidate_for_single_final_upstream_report", "R014-ADV-0024"],
];
for (const [number, type, start, end, sourceText, targetAfter, rationale, affectedSuffixes, disposition, adverseId] of boundary5Corrections) {
  if (!authorityText.includes(sourceText)) throw new Error(`Boundary 5 authority correction witness missing: ${number}`);
  if (!boundary5LedgerText.includes(`## ${adverseId} —`)) throw new Error(`Boundary 5 adverse-ledger witness missing: ${adverseId}`);
  records.push(baseRecord("correction", correctionId(number), {
    locale: "mul",
    correction_type: type,
    authority_locator: { path: "authority/downloads/yaintt.tex", start_line: start, end_line: end },
    source_text: sourceText,
    target_text: targetAfter,
    rationale,
    evidence: { authority_sha256: authoritySha, adverse_ledger: { id: adverseId, path: boundary5LedgerBackendPath, sha256: boundary5LedgerSha } },
    upstream_report_disposition: disposition,
    affected_unit_ids: affectedSuffixes.map(unitId),
    report_status: "not_submitted",
  }));
}

const boundary6Corrections = [
  [23, "mathematics", 1240, 1265,
    "s_{j+1}=s_{j-1}-q_{j+1}s_j and \\gcd(a,b)=r_n=s_{n+1}a+t_{n+1}b",
    "Put remainders in the nonnegative integers, use s_{j+2}=s_j-q_{j+1}s_{j+1} and the analogous t recurrence, conclude r_n=s_na+t_nb, and state the terminal indexed recurrence uniformly.",
    "The authority places the terminal zero remainder in NN, shifts the coefficient recurrences by one index, concludes with s_(n+1),t_(n+1), and uses an endpoint-expanded display that is not well formed when the algorithm stops at n=1 or n=2.",
    ["thm.euclideanalg", "thm.euclideanalg.proof"], "candidate_for_single_final_upstream_report", "R014-ADV-0025"],
];
if (!authorityText.includes("s_{j+1}=s_{j-1}-q_{j+1}s_j") || !authorityText.includes("\\gcd(a,b)=r_n=")) throw new Error("Boundary 6 authority correction witness missing: 23");
for (const [number, type, start, end, sourceText, targetAfter, rationale, affectedSuffixes, disposition, adverseId] of boundary6Corrections) {
  if (!boundary6LedgerText.includes(`## ${adverseId} —`)) throw new Error(`Boundary 6 adverse-ledger witness missing: ${adverseId}`);
  records.push(baseRecord("correction", correctionId(number), {
    locale: "mul",
    correction_type: type,
    authority_locator: { path: "authority/downloads/yaintt.tex", start_line: start, end_line: end },
    source_text: sourceText,
    target_text: targetAfter,
    rationale,
    evidence: { authority_sha256: authoritySha, adverse_ledger: { id: adverseId, path: boundary6LedgerBackendPath, sha256: boundary6LedgerSha } },
    upstream_report_disposition: disposition,
    affected_unit_ids: affectedSuffixes.map(unitId),
    report_status: "not_submitted",
  }));
}

const boundary7Corrections = [
  [24, "editorial", 1332, 1333,
    "when he was 24;a translation",
    "ketika ia berusia 24 tahun; terjemahannya",
    "Insert the missing separator after Gauss's age while translating.",
    ["chap.cs.discussion.01"], "candidate_for_single_final_upstream_report", "R014-ADV-0026",
    ["when he was 24;a", "translation is \\cite{gauss1986disquisitiones}"],
  ],
  [25, "mathematics", 1366, 1387,
    "a\\equiv c\\pmod m; a=c\\pmod n",
    "a\\equiv c\\pmod n in the statement and proof",
    "The transitivity item uses an undefined modulus m and its proof concludes with equality notation instead of congruence.",
    ["thm.basiccongprops", "thm.basiccongprops.proof"], "candidate_for_single_final_upstream_report", "R014-ADV-0027",
    ["a\\equiv c\\pmod m", "a=c\\pmod n"],
  ],
  [26, "mathematics", 1455, 1458,
    "such that such that; (kc-lb)n",
    "one sedemikian sehingga; (ck+bl)n",
    "Remove duplicated words and correct the coefficient obtained by adding the two displayed identities.",
    ["thm.basiccongprops.proof"], "candidate_for_single_final_upstream_report", "R014-ADV-0028",
    ["such that such that", "(kc-lb)n"],
  ],
  [27, "mathematics", 1539, 1543,
    "b=c\\pmod n",
    "b\\equiv c\\pmod n",
    "The cancellation theorem must state congruence rather than equality modulo n.",
    ["thm.congcanc"], "candidate_for_single_final_upstream_report", "R014-ADV-0029",
    ["b=c\\pmod n"],
  ],
  [28, "mathematics", 1589, 1590,
    "x_j\\pmod{x_j}; x_1,\\dots,x_{(d-1)}",
    "x_j\\pmod n; x_0,\\dots,x_{(d-1)}",
    "Use modulus n and include the zero-class representative in the concluding list.",
    ["thm.numzerosmodafactor.proof"], "candidate_for_single_final_upstream_report", "R014-ADV-0030",
    ["x_j\\pmod{x_j}", "x_1,\\dots,x_{(d-1)}"],
  ],
];
for (const [number, type, start, end, sourceText, targetAfter, rationale, affectedSuffixes, disposition, adverseId, sourceWitnesses] of boundary7Corrections) {
  for (const witness of sourceWitnesses) if (!authorityText.includes(witness)) throw new Error(`Boundary 7 authority correction witness missing: ${number}: ${witness}`);
  if (!boundary7LedgerText.includes(`## ${adverseId} —`)) throw new Error(`Boundary 7 adverse-ledger witness missing: ${adverseId}`);
  records.push(baseRecord("correction", correctionId(number), {
    locale: "mul",
    correction_type: type,
    authority_locator: { path: "authority/downloads/yaintt.tex", start_line: start, end_line: end },
    source_text: sourceText,
    target_text: targetAfter,
    rationale,
    evidence: { authority_sha256: authoritySha, adverse_ledger: { id: adverseId, path: boundary7LedgerBackendPath, sha256: boundary7LedgerSha } },
    upstream_report_disposition: disposition,
    affected_unit_ids: affectedSuffixes.map(unitId),
    report_status: "not_submitted",
  }));
}

const boundary8Corrections = [
  [29, "mathematics", 1632, 1644,
    "n\\in\\ZZ in the linear-congruence definition and following theorem",
    "n\\in\\NN in both statements",
    "The authority's congruence notation was defined only for positive moduli, so zero and negative moduli fall outside its stated domain.",
    ["def.linearcongruence", "thm.linearcongruencesameclass"], "candidate_for_single_final_upstream_report", "R014-ADV-0031",
    ["Given constants $a,b\\in\\ZZ$ and $n\\in\\ZZ$", "Given constants $a,b\\in\\ZZ$, $n\\in\\ZZ$"]],
  [30, "mathematics", 1651, 1652,
    "An algebraic equation whose constants and variables are all integers",
    "a polynomial equation with integer coefficients whose solutions are sought in integers",
    "Variables are not fixed integers; the standard definition constrains coefficients and the sought solutions.",
    ["def.diophantine"], "candidate_for_single_final_upstream_report", "R014-ADV-0032",
    ["whose constants and variables are all integers"]],
  [31, "mathematics", 1686, 1688,
    "n\\mid a(kp)=b",
    "n\\mid(a(kp)-b)",
    "The displayed identity proves divisibility of the difference, which is the condition equivalent to the target congruence.",
    ["thm.basiclincongs.proof"], "candidate_for_single_final_upstream_report", "R014-ADV-0033",
    ["n\\mid a(kp)=b"]],
  [32, "mathematics", 1693, 1697,
    "cite Part (2) and infer exactly d solutions from a necessary condition",
    "cite Part 1 and prove both the upper bound and existence of every one of the d classes",
    "The applicable cancellation case is Part 1, and counting possible differences alone does not prove that every class yields a solution.",
    ["thm.basiclincongs.proof"], "candidate_for_single_final_upstream_report", "R014-ADV-0034",
    ["By part (2) of Theorem~\\ref{thm:congcanc}", "Thus there are $d$ solutions"]],
  [33, "mathematics", 1712, 1714,
    "x_1, x_1, x_2 as three solution labels",
    "x_0, x_1, x_2 with all three written as congruence classes modulo 6",
    "The authority duplicates x_1 and omits x_0 while listing the three classes.",
    ["eg.multiplesolscongs"], "candidate_for_single_final_upstream_report", "R014-ADV-0035",
    ["$x_1=6\\pmod6$, $x_1=6+2=2\\pmod6$"]],
  [34, "editorial", 1744, 1745,
    "$7^{-1}$of",
    "$7^{-1}$ dari",
    "Restore the missing word boundary while translating.",
    ["eg.modinverses"], "candidate_for_single_final_upstream_report", "R014-ADV-0036",
    ["$7^{-1}$of"]],
  [35, "mathematics", 1765, 1768,
    "quantify a and n, then use unbound b and b^{-1}",
    "quantify a,b\\in\\ZZ and n\\in\\NN",
    "The exercise uses b and its inverse without binding b.",
    ["sec.lc.exercise.04"], "candidate_for_single_final_upstream_report", "R014-ADV-0037",
    ["Given $a\\in\\ZZ$ and $n\\in\\NN$, show that if", "$b^{-1}$ is the inverse of $b$"]],
];
for (const [number, type, start, end, sourceText, targetAfter, rationale, affectedSuffixes, disposition, adverseId, sourceWitnesses] of boundary8Corrections) {
  for (const witness of sourceWitnesses) if (!authorityText.includes(witness)) throw new Error(`Boundary 8 authority correction witness missing: ${number}: ${witness}`);
  if (!boundary8LedgerText.includes(`## ${adverseId} —`)) throw new Error(`Boundary 8 adverse-ledger witness missing: ${adverseId}`);
  records.push(baseRecord("correction", correctionId(number), {
    locale: "mul",
    correction_type: type,
    authority_locator: { path: "authority/downloads/yaintt.tex", start_line: start, end_line: end },
    source_text: sourceText,
    target_text: targetAfter,
    rationale,
    evidence: { authority_sha256: authoritySha, adverse_ledger: { id: adverseId, path: boundary8LedgerBackendPath, sha256: boundary8LedgerSha } },
    upstream_report_disposition: disposition,
    affected_unit_ids: affectedSuffixes.map(unitId),
    report_status: "not_submitted",
  }));
}

const boundary9Corrections = [
  [36, "mathematics", 1820, 1823,
    "apply Theorem thm:combing k times",
    "apply the theorem repeatedly, formally by induction",
    "Combining k pairwise relatively prime divisors requires k-1 applications for k at least 2 and none for k=1, not k applications.",
    ["thm.chinese-remainder.proof"], "candidate_for_single_final_upstream_report", "R014-ADV-0038",
    ["Theorem~\\ref{thm:combing} $k$ times"]],
];
for (const [number, type, start, end, sourceText, targetAfter, rationale, affectedSuffixes, disposition, adverseId, sourceWitnesses] of boundary9Corrections) {
  for (const witness of sourceWitnesses) if (!authorityText.includes(witness)) throw new Error(`Boundary 9 authority correction witness missing: ${number}: ${witness}`);
  if (!boundary9LedgerText.includes(`## ${adverseId} —`)) throw new Error(`Boundary 9 adverse-ledger witness missing: ${adverseId}`);
  records.push(baseRecord("correction", correctionId(number), {
    locale: "mul",
    correction_type: type,
    authority_locator: { path: "authority/downloads/yaintt.tex", start_line: start, end_line: end },
    source_text: sourceText,
    target_text: targetAfter,
    rationale,
    evidence: { authority_sha256: authoritySha, adverse_ledger: { id: adverseId, path: boundary9LedgerBackendPath, sha256: boundary9LedgerSha } },
    upstream_report_disposition: disposition,
    affected_unit_ids: affectedSuffixes.map(unitId),
    report_status: "not_submitted",
  }));
}

const boundary10Corrections = [
  [37, "mathematics", 1900, 1902,
    "if C is in S, then any r in S such that C=[r] is a representative",
    "if C is in S/~, then any r in S such that C=[r] is a representative",
    "An equivalence class is an element of the quotient set, not of the underlying set.",
    ["def.equivalence-relation"], "candidate_for_single_final_upstream_report", "R014-ADV-0039",
    ["if $\\Cc\\in S$,", "$S/{{}\\cong{}}$"]],
  [38, "mathematics", 1916, 1927,
    "from z~x and z~y, symmetry gives y~z and transitivity gives x~y",
    "symmetry gives x~z, then transitivity gives x~y; both inclusions and exclusivity are closed explicitly",
    "The displayed relations in the authority yield y~x in the stated order, not x~y.",
    ["thm.equivalence-classes-disjoint-or-equal.proof"], "candidate_for_single_final_upstream_report", "R014-ADV-0040",
    ["symmetry $y\\cong z$ and by transitivity, $x\\cong y$"]],
  [39, "mathematics", 1986, 1988,
    "C times D equals [a times m] where a and b are representatives",
    "C times D equals [a times b] where a and b are representatives",
    "The variable m is unbound; the following theorem and proof use the representative b.",
    ["def.congruence-class-operations"], "candidate_for_single_final_upstream_report", "R014-ADV-0041",
    ["$\\Cc\\cdot\\Dd=[a\\cdot m]$"]],
  [40, "editorial", 2029, 2032,
    "many of our other, earlier results beside just Corollary",
    "many earlier results, in addition to the corollary, can be restated with congruence classes",
    "The intended transition requires besides or an equivalent phrase, not beside.",
    ["sec.awtwwc.discussion.05"], "candidate_for_single_final_upstream_report", "R014-ADV-0042",
    ["results beside just"]],
  [41, "editorial", 2059, 2064,
    "Prove a version of Theorems followed by one theorem reference",
    "Prove a version of Theorem followed by the same single reference",
    "The exercise cites exactly one theorem, so the head noun must be singular.",
    ["sec.awtwwc.exercise.01"], "candidate_for_single_final_upstream_report", "R014-ADV-0043",
    ["Theorems~\\ref{thm:plustimeswelldefined}"]],
];
for (const [number, type, start, end, sourceText, targetAfter, rationale, affectedSuffixes, disposition, adverseId, sourceWitnesses] of boundary10Corrections) {
  for (const witness of sourceWitnesses) if (!authorityText.includes(witness)) throw new Error(`Boundary 10 authority correction witness missing: ${number}: ${witness}`);
  if (!boundary10LedgerText.includes(`## ${adverseId} —`)) throw new Error(`Boundary 10 adverse-ledger witness missing: ${adverseId}`);
  records.push(baseRecord("correction", correctionId(number), {
    locale: "mul",
    correction_type: type,
    authority_locator: { path: "authority/downloads/yaintt.tex", start_line: start, end_line: end },
    source_text: sourceText,
    target_text: targetAfter,
    rationale,
    evidence: { authority_sha256: authoritySha, adverse_ledger: { id: adverseId, path: boundary10LedgerBackendPath, sha256: boundary10LedgerSha } },
    upstream_report_disposition: disposition,
    affected_unit_ids: affectedSuffixes.map(unitId),
    report_status: "not_submitted",
  }));
}

const boundary11Corrections = [
  [42, "mathematics", 2124, 2128,
    "Given n,m in Z, if gcd(n,m)=1 then phi(nm)=phi(n)phi(m)",
    "Given n,m in N, if gcd(n,m)=1 then phi(nm)=phi(n)phi(m)",
    "The book defines phi only on positive natural-number arguments and the proof immediately fixes positive n and m.",
    ["thm.phiismultiplicative"], "candidate_for_single_final_upstream_report", "R014-ADV-0044",
    ["Given $n,m\\in\\ZZ$, if $\\gcd(n,m)=1$"]],
  [43, "mathematics", 2140, 2143,
    "both Cartesian-product components are declared in (Z/nZ)*",
    "the second component is declared in (Z/mZ)*",
    "The second component belongs to the unit group modulo m, as required by the product and cardinality argument.",
    ["thm.phiismultiplicative.proof"], "candidate_for_single_final_upstream_report", "R014-ADV-0045",
    ["b\\in(\\ZZ/n\\ZZ)^*\\}"]],
  [44, "mathematics", 2155, 2190,
    "the CRT map is asserted to be a bijection without proving that images and preimages are units",
    "the proof checks that images lie in both unit groups and constructs a unit preimage modulo nm",
    "A bijection between the stated unit groups requires both codomain membership and unit preimage checks.",
    ["thm.phiismultiplicative.proof"], "candidate_for_single_final_upstream_report", "R014-ADV-0046",
    ["We must show $\\Ff$ is well-defined, 1-1, and onto.", "$\\Ff([z]_{nm})=([x]_n,[y]_m)$."]],
  [45, "editorial", 2101, 2103,
    "this name was give to it by the English mathematician Sylvester",
    "this name was given by the English mathematician Sylvester",
    "The authority omits the final n in given.",
    ["def.euler-phi"], "candidate_for_single_final_upstream_report", "R014-ADV-0047",
    ["this name was give to it"]],
];
for (const [number, type, start, end, sourceText, targetAfter, rationale, affectedSuffixes, disposition, adverseId, sourceWitnesses] of boundary11Corrections) {
  for (const witness of sourceWitnesses) if (!authorityText.includes(witness)) throw new Error(`Boundary 11 authority correction witness missing: ${number}: ${witness}`);
  if (!boundary11LedgerText.includes(`## ${adverseId} —`)) throw new Error(`Boundary 11 adverse-ledger witness missing: ${adverseId}`);
  records.push(baseRecord("correction", correctionId(number), {
    locale: "mul",
    correction_type: type,
    authority_locator: { path: "authority/downloads/yaintt.tex", start_line: start, end_line: end },
    source_text: sourceText,
    target_text: targetAfter,
    rationale,
    evidence: { authority_sha256: authoritySha, adverse_ledger: { id: adverseId, path: boundary11LedgerBackendPath, sha256: boundary11LedgerSha } },
    upstream_report_disposition: disposition,
    affected_unit_ids: affectedSuffixes.map(unitId),
    report_status: "not_submitted",
  }));
}

const qaSpecs = [
  [fixedQaIds.source, "source_authority", "pass", ["ttp.r014.artifact.authority-manifest"], "authority/SOURCE_AUTHORITY.json"],
  [fixedQaIds.rights, "component_rights", "pass_with_badge_omission", ["ttp.r014.artifact.authority-manifest"], "authority/COMPONENT_RIGHTS.json"],
  [fixedQaIds.upstream, "upstream_build_baseline", "pass_with_modern_compatibility_delta", ["ttp.r014.artifact.upstream-replay-pdf"], "qa/UPSTREAM_BUILD_BASELINE.json"],
  [fixedQaIds.topology, "source_target_topology", "pass", ["ttp.r014.artifact.target-source"], "qa/BOUNDARY1_STRUCTURE.json"],
  [fixedQaIds.math, "mathematics", "pass", ["ttp.r014.artifact.target-source"], "qa/BOUNDARY1_LANGUAGE_MATH.json"],
  [fixedQaIds.language, "language", "pass", ["ttp.r014.artifact.target-source"], "qa/BOUNDARY1_LANGUAGE_MATH.json"],
  [fixedQaIds.build, "target_build", "pass", ["ttp.r014.artifact.boundary1-pdf"], "qa/BOUNDARY1_BUILD.json"],
  [fixedQaIds.accessibility, "accessibility", "pass_with_untagged_pdf_caveat", ["ttp.r014.artifact.boundary1-pdf"], "qa/BOUNDARY1_VISUAL.json"],
  [fixedQaIds.visual, "visual", "pass", ["ttp.r014.artifact.boundary1-pdf"], "qa/BOUNDARY1_VISUAL.json"],
  [fixedQaIds.aowiTopology, "source_target_topology", "pass", ["ttp.r014.artifact.target-source"], "qa/SECTION_AOWI_STRUCTURE.json", "2026-08-21T12:31:18+02:00"],
  [fixedQaIds.aowiMath, "mathematics", "pass_with_documented_source_correction", ["ttp.r014.artifact.target-source"], "qa/SECTION_AOWI_STRUCTURE.json", "2026-08-21T12:31:18+02:00"],
  [fixedQaIds.aowiLanguage, "language", "pass", ["ttp.r014.artifact.target-source"], "qa/BOUNDARY2_BUILD.json", "2026-08-21T12:33:25+02:00"],
  [fixedQaIds.build2, "target_build", "pass", ["ttp.r014.artifact.boundary2-pdf"], "qa/BOUNDARY2_BUILD.json", "2026-08-21T12:33:25+02:00"],
  [fixedQaIds.accessibility2, "accessibility", "pass_with_untagged_pdf_caveat", ["ttp.r014.artifact.boundary2-pdf"], "qa/BOUNDARY2_VISUAL.json", "2026-08-21T12:34:05+02:00"],
  [fixedQaIds.visual2, "visual", "pass", ["ttp.r014.artifact.boundary2-pdf"], "qa/BOUNDARY2_VISUAL.json", "2026-08-21T12:34:05+02:00"],
  [fixedQaIds.dadaTopology, "source_target_topology", "pass", ["ttp.r014.artifact.target-source"], "qa/SECTION_DADA_STRUCTURE.json", "2026-08-21T13:08:00+02:00"],
  [fixedQaIds.dadaMath, "mathematics", "pass_with_documented_source_correction", ["ttp.r014.artifact.target-source"], "qa/SECTION_DADA_STRUCTURE.json", "2026-08-21T13:08:00+02:00"],
  [fixedQaIds.dadaLanguage, "language", "pass", ["ttp.r014.artifact.target-source"], "qa/SECTION_DADA_STRUCTURE.json", "2026-08-21T13:08:00+02:00"],
  [fixedQaIds.build3, "target_build", "pass", ["ttp.r014.artifact.boundary3-pdf"], "qa/BOUNDARY3_BUILD.json", "2026-08-21T13:42:32+02:00"],
  [fixedQaIds.accessibility3, "accessibility", "pass_with_untagged_pdf_caveat", ["ttp.r014.artifact.boundary3-pdf"], "qa/BOUNDARY3_VISUAL.json", "2026-08-21T13:44:10+02:00"],
  [fixedQaIds.visual3, "visual", "pass", ["ttp.r014.artifact.boundary3-pdf"], "qa/BOUNDARY3_VISUAL.json", "2026-08-21T13:44:10+02:00"],
  [fixedQaIds.backend, "backend_deterministic_roundtrip", "pass", ["ttp.r014.artifact.qa-bundle"], "backend/MANIFEST.json"],
];
for (const [id, qaType, result, witnessIds, evidencePath, eventTimestamp] of qaSpecs) {
  records.push(baseRecord("qa_event", id, {
    locale: "und",
    qa_type: qaType,
    result,
    witness_ids: witnessIds,
    evidence: { path: evidencePath },
    method: qaType === "backend_deterministic_roundtrip" ? "schema, referential, CSV, manifest, and second-run byte replay" : "bounded evidence replay",
    event_timestamp: eventTimestamp ?? createdAt,
  }));
}
for (const [id, qaType, result, witnessIds, evidencePath, eventTimestamp] of [
  [fixedQaIds.roiidbTopology, "source_target_topology", "pass", ["ttp.r014.artifact.target-source.boundary4"], "qa/SECTION_ROIIDB_STRUCTURE.json", "2026-08-21T14:16:54+02:00"],
  [fixedQaIds.roiidbMath, "mathematics", "pass_with_documented_source_correction", ["ttp.r014.artifact.target-source.boundary4"], "qa/SECTION_ROIIDB_STRUCTURE.json", "2026-08-21T14:16:54+02:00"],
  [fixedQaIds.roiidbLanguage, "language", "pass", ["ttp.r014.artifact.target-source.boundary4"], "qa/SECTION_ROIIDB_STRUCTURE.json", "2026-08-21T14:16:54+02:00"],
  [fixedQaIds.build4, "target_build", "pass", ["ttp.r014.artifact.boundary4-pdf"], "qa/BOUNDARY4_BUILD.json", "2026-08-21T14:20:02+02:00"],
  [fixedQaIds.accessibility4, "accessibility", "pass_with_untagged_pdf_caveat", ["ttp.r014.artifact.boundary4-pdf"], "qa/BOUNDARY4_VISUAL.json", "2026-08-21T14:22:05+02:00"],
  [fixedQaIds.visual4, "visual", "pass", ["ttp.r014.artifact.boundary4-pdf"], "qa/BOUNDARY4_VISUAL.json", "2026-08-21T14:22:05+02:00"],
  [fixedQaIds.backend4, "backend_deterministic_roundtrip", "pass", ["ttp.r014.artifact.qa-bundle.boundary4"], "qa/BACKEND_DETERMINISM.json", createdAt],
]) {
  records.push(baseRecord("qa_event", id, {
    locale: "und",
    qa_type: qaType,
    result,
    witness_ids: witnessIds,
    evidence: { path: evidencePath },
    method: qaType === "backend_deterministic_roundtrip" ? "two isolated clean builds plus schema, referential, CSV, XLSX, manifest, preview, and byte replay" : "bounded evidence replay",
    event_timestamp: eventTimestamp,
  }));
}
for (const [id, qaType, result, witnessIds, evidencePath, eventTimestamp] of [
  [fixedQaIds.awtwwcTopology, "source_target_topology", "pass", ["ttp.r014.artifact.target-source.boundary10"], "qa/SECTION_AWTWWC_STRUCTURE.json", "2026-08-21T17:42:06+02:00"],
  [fixedQaIds.awtwwcMath, "mathematics", "pass_with_documented_source_correction", ["ttp.r014.artifact.target-source.boundary10"], "qa/SECTION_AWTWWC_STRUCTURE.json", "2026-08-21T17:42:06+02:00"],
  [fixedQaIds.awtwwcLanguage, "language", "pass", ["ttp.r014.artifact.target-source.boundary10"], "qa/SECTION_AWTWWC_STRUCTURE.json", "2026-08-21T17:42:06+02:00"],
  [fixedQaIds.build10, "target_build", "pass", ["ttp.r014.artifact.boundary10-pdf"], "qa/BOUNDARY10_BUILD.json", "2026-08-21T17:54:30+02:00"],
  [fixedQaIds.accessibility10, "accessibility", "pass_with_untagged_pdf_caveat", ["ttp.r014.artifact.boundary10-pdf"], "qa/BOUNDARY10_VISUAL.json", "2026-08-21T17:56:00+02:00"],
  [fixedQaIds.visual10, "visual", "pass", ["ttp.r014.artifact.boundary10-pdf"], "qa/BOUNDARY10_VISUAL.json", "2026-08-21T17:56:00+02:00"],
  [fixedQaIds.backend10, "backend_deterministic_roundtrip", "pass", ["ttp.r014.artifact.qa-bundle.boundary10"], "qa/BACKEND_DETERMINISM.json", createdAt],
]) {
  records.push(baseRecord("qa_event", id, {
    locale: "und",
    qa_type: qaType,
    result,
    witness_ids: witnessIds,
    evidence: { path: evidencePath },
    method: qaType === "backend_deterministic_roundtrip" ? "two isolated clean builds plus schema, referential, CSV, XLSX, manifest, preview, and byte replay" : "bounded evidence replay",
    event_timestamp: eventTimestamp,
  }));
}
for (const [id, qaType, result, witnessIds, evidencePath, eventTimestamp] of [
  [fixedQaIds.ephifTopology, "source_target_topology", "pass", ["ttp.r014.artifact.target-source.boundary11"], "qa/SECTION_EPHIF_STRUCTURE.json", "2026-08-21T17:50:42+02:00"],
  [fixedQaIds.ephifMath, "mathematics", "pass_with_documented_source_correction", ["ttp.r014.artifact.target-source.boundary11"], "qa/SECTION_EPHIF_STRUCTURE.json", "2026-08-21T17:50:42+02:00"],
  [fixedQaIds.ephifLanguage, "language", "pass", ["ttp.r014.artifact.target-source.boundary11"], "qa/SECTION_EPHIF_STRUCTURE.json", "2026-08-21T17:50:42+02:00"],
  [fixedQaIds.build11, "target_build", "pass", ["ttp.r014.artifact.boundary11-pdf"], "qa/BOUNDARY11_BUILD.json", "2026-08-21T18:16:30+02:00"],
  [fixedQaIds.accessibility11, "accessibility", "pass_with_untagged_pdf_caveat", ["ttp.r014.artifact.boundary11-pdf"], "qa/BOUNDARY11_VISUAL.json", "2026-08-21T18:17:00+02:00"],
  [fixedQaIds.visual11, "visual", "pass", ["ttp.r014.artifact.boundary11-pdf"], "qa/BOUNDARY11_VISUAL.json", "2026-08-21T18:17:00+02:00"],
  [fixedQaIds.backend11, "backend_deterministic_roundtrip", "pass", ["ttp.r014.artifact.qa-bundle.boundary11"], "qa/BACKEND_DETERMINISM.json", createdAt],
]) {
  records.push(baseRecord("qa_event", id, {
    locale: "und",
    qa_type: qaType,
    result,
    witness_ids: witnessIds,
    evidence: { path: evidencePath },
    method: qaType === "backend_deterministic_roundtrip" ? "two isolated clean builds plus schema, referential, CSV, XLSX, manifest, preview, and byte replay" : "bounded evidence replay",
    event_timestamp: eventTimestamp,
  }));
}
for (const [id, qaType, result, witnessIds, evidencePath, eventTimestamp] of [
  [fixedQaIds.gcdTopology, "source_target_topology", "pass", ["ttp.r014.artifact.target-source.boundary5"], "qa/SECTION_GCD_STRUCTURE.json", "2026-08-21T14:52:24+02:00"],
  [fixedQaIds.gcdMath, "mathematics", "pass_with_documented_source_correction", ["ttp.r014.artifact.target-source.boundary5"], "qa/SECTION_GCD_STRUCTURE.json", "2026-08-21T14:52:24+02:00"],
  [fixedQaIds.gcdLanguage, "language", "pass", ["ttp.r014.artifact.target-source.boundary5"], "qa/SECTION_GCD_STRUCTURE.json", "2026-08-21T14:52:24+02:00"],
  [fixedQaIds.build5, "target_build", "pass", ["ttp.r014.artifact.boundary5-pdf"], "qa/BOUNDARY5_BUILD.json", "2026-08-21T14:53:55+02:00"],
  [fixedQaIds.accessibility5, "accessibility", "pass_with_untagged_pdf_caveat", ["ttp.r014.artifact.boundary5-pdf"], "qa/BOUNDARY5_VISUAL.json", "2026-08-21T14:59:39+02:00"],
  [fixedQaIds.visual5, "visual", "pass", ["ttp.r014.artifact.boundary5-pdf"], "qa/BOUNDARY5_VISUAL.json", "2026-08-21T14:59:39+02:00"],
  [fixedQaIds.backend5, "backend_deterministic_roundtrip", "pass", ["ttp.r014.artifact.qa-bundle.boundary5"], "qa/BACKEND_DETERMINISM.json", createdAt],
]) {
  records.push(baseRecord("qa_event", id, {
    locale: "und",
    qa_type: qaType,
    result,
    witness_ids: witnessIds,
    evidence: { path: evidencePath },
    method: qaType === "backend_deterministic_roundtrip" ? "two isolated clean builds plus schema, referential, CSV, XLSX, manifest, preview, and byte replay" : "bounded evidence replay",
    event_timestamp: eventTimestamp,
  }));
}
for (const [id, qaType, result, witnessIds, evidencePath, eventTimestamp] of [
  [fixedQaIds.eaTopology, "source_target_topology", "pass", ["ttp.r014.artifact.target-source.boundary6"], "qa/SECTION_EA_STRUCTURE.json", "2026-08-21T16:53:15+02:00"],
  [fixedQaIds.eaMath, "mathematics", "pass_with_documented_source_correction", ["ttp.r014.artifact.target-source.boundary6"], "qa/SECTION_EA_STRUCTURE.json", "2026-08-21T16:53:15+02:00"],
  [fixedQaIds.eaLanguage, "language", "pass", ["ttp.r014.artifact.target-source.boundary6"], "qa/SECTION_EA_STRUCTURE.json", "2026-08-21T16:53:15+02:00"],
  [fixedQaIds.build6, "target_build", "pass", ["ttp.r014.artifact.boundary6-pdf"], "qa/BOUNDARY6_BUILD.json", "2026-08-21T16:56:45+02:00"],
  [fixedQaIds.accessibility6, "accessibility", "pass_with_untagged_pdf_caveat", ["ttp.r014.artifact.boundary6-pdf"], "qa/BOUNDARY6_VISUAL.json", "2026-08-21T16:59:10+02:00"],
  [fixedQaIds.visual6, "visual", "pass", ["ttp.r014.artifact.boundary6-pdf"], "qa/BOUNDARY6_VISUAL.json", "2026-08-21T16:59:10+02:00"],
  [fixedQaIds.backend6, "backend_deterministic_roundtrip", "pass", ["ttp.r014.artifact.qa-bundle.boundary6"], "qa/BACKEND_DETERMINISM.json", createdAt],
]) {
  records.push(baseRecord("qa_event", id, {
    locale: "und",
    qa_type: qaType,
    result,
    witness_ids: witnessIds,
    evidence: { path: evidencePath },
    method: qaType === "backend_deterministic_roundtrip" ? "two isolated clean builds plus schema, referential, CSV, XLSX, manifest, preview, and byte replay" : "bounded evidence replay",
    event_timestamp: eventTimestamp,
  }));
}
for (const [id, qaType, result, witnessIds, evidencePath, eventTimestamp] of [
  [fixedQaIds.itcTopology, "source_target_topology", "pass", ["ttp.r014.artifact.target-source.boundary7"], "qa/SECTION_ITC_STRUCTURE.json", "2026-08-21T17:12:10+02:00"],
  [fixedQaIds.itcMath, "mathematics", "pass_with_documented_source_correction", ["ttp.r014.artifact.target-source.boundary7"], "qa/SECTION_ITC_STRUCTURE.json", "2026-08-21T17:12:10+02:00"],
  [fixedQaIds.itcLanguage, "language", "pass", ["ttp.r014.artifact.target-source.boundary7"], "qa/SECTION_ITC_STRUCTURE.json", "2026-08-21T17:12:10+02:00"],
  [fixedQaIds.build7, "target_build", "pass", ["ttp.r014.artifact.boundary7-pdf"], "qa/BOUNDARY7_BUILD.json", "2026-08-21T17:14:20+02:00"],
  [fixedQaIds.accessibility7, "accessibility", "pass_with_untagged_pdf_caveat", ["ttp.r014.artifact.boundary7-pdf"], "qa/BOUNDARY7_VISUAL.json", "2026-08-21T17:16:30+02:00"],
  [fixedQaIds.visual7, "visual", "pass", ["ttp.r014.artifact.boundary7-pdf"], "qa/BOUNDARY7_VISUAL.json", "2026-08-21T17:16:30+02:00"],
  [fixedQaIds.backend7, "backend_deterministic_roundtrip", "pass", ["ttp.r014.artifact.qa-bundle.boundary7"], "qa/BACKEND_DETERMINISM.json", createdAt],
]) {
  records.push(baseRecord("qa_event", id, {
    locale: "und",
    qa_type: qaType,
    result,
    witness_ids: witnessIds,
    evidence: { path: evidencePath },
    method: qaType === "backend_deterministic_roundtrip" ? "two isolated clean builds plus schema, referential, CSV, XLSX, manifest, preview, and byte replay" : "bounded evidence replay",
    event_timestamp: eventTimestamp,
  }));
}
for (const [id, qaType, result, witnessIds, evidencePath, eventTimestamp] of [
  [fixedQaIds.lcTopology, "source_target_topology", "pass", ["ttp.r014.artifact.target-source.boundary8"], "qa/SECTION_LC_STRUCTURE.json", "2026-08-21T17:24:55+02:00"],
  [fixedQaIds.lcMath, "mathematics", "pass_with_documented_source_correction", ["ttp.r014.artifact.target-source.boundary8"], "qa/SECTION_LC_STRUCTURE.json", "2026-08-21T17:24:55+02:00"],
  [fixedQaIds.lcLanguage, "language", "pass", ["ttp.r014.artifact.target-source.boundary8"], "qa/SECTION_LC_STRUCTURE.json", "2026-08-21T17:24:55+02:00"],
  [fixedQaIds.build8, "target_build", "pass", ["ttp.r014.artifact.boundary8-pdf"], "qa/BOUNDARY8_BUILD.json", "2026-08-21T17:28:30+02:00"],
  [fixedQaIds.accessibility8, "accessibility", "pass_with_untagged_pdf_caveat", ["ttp.r014.artifact.boundary8-pdf"], "qa/BOUNDARY8_VISUAL.json", "2026-08-21T17:29:10+02:00"],
  [fixedQaIds.visual8, "visual", "pass", ["ttp.r014.artifact.boundary8-pdf"], "qa/BOUNDARY8_VISUAL.json", "2026-08-21T17:29:10+02:00"],
  [fixedQaIds.backend8, "backend_deterministic_roundtrip", "pass", ["ttp.r014.artifact.qa-bundle.boundary8"], "qa/BACKEND_DETERMINISM.json", createdAt],
]) {
  records.push(baseRecord("qa_event", id, {
    locale: "und",
    qa_type: qaType,
    result,
    witness_ids: witnessIds,
    evidence: { path: evidencePath },
    method: qaType === "backend_deterministic_roundtrip" ? "two isolated clean builds plus schema, referential, CSV, XLSX, manifest, preview, and byte replay" : "bounded evidence replay",
    event_timestamp: eventTimestamp,
  }));
}
for (const [id, qaType, result, witnessIds, evidencePath, eventTimestamp] of [
  [fixedQaIds.crtTopology, "source_target_topology", "pass", ["ttp.r014.artifact.target-source.boundary9"], "qa/SECTION_CRT_STRUCTURE.json", "2026-08-21T17:31:37+02:00"],
  [fixedQaIds.crtMath, "mathematics", "pass_with_documented_source_correction", ["ttp.r014.artifact.target-source.boundary9"], "qa/SECTION_CRT_STRUCTURE.json", "2026-08-21T17:31:37+02:00"],
  [fixedQaIds.crtLanguage, "language", "pass", ["ttp.r014.artifact.target-source.boundary9"], "qa/SECTION_CRT_STRUCTURE.json", "2026-08-21T17:31:37+02:00"],
  [fixedQaIds.build9, "target_build", "pass", ["ttp.r014.artifact.boundary9-pdf"], "qa/BOUNDARY9_BUILD.json", "2026-08-21T17:36:30+02:00"],
  [fixedQaIds.accessibility9, "accessibility", "pass_with_untagged_pdf_caveat", ["ttp.r014.artifact.boundary9-pdf"], "qa/BOUNDARY9_VISUAL.json", "2026-08-21T17:38:05+02:00"],
  [fixedQaIds.visual9, "visual", "pass", ["ttp.r014.artifact.boundary9-pdf"], "qa/BOUNDARY9_VISUAL.json", "2026-08-21T17:38:05+02:00"],
  [fixedQaIds.backend9, "backend_deterministic_roundtrip", "pass", ["ttp.r014.artifact.qa-bundle.boundary9"], "qa/BACKEND_DETERMINISM.json", createdAt],
]) {
  records.push(baseRecord("qa_event", id, {
    locale: "und",
    qa_type: qaType,
    result,
    witness_ids: witnessIds,
    evidence: { path: evidencePath },
    method: qaType === "backend_deterministic_roundtrip" ? "two isolated clean builds plus schema, referential, CSV, XLSX, manifest, preview, and byte replay" : "bounded evidence replay",
    event_timestamp: eventTimestamp,
  }));
}

const qaBundlePaths = [
  "qa/UPSTREAM_BUILD_BASELINE.json",
  "qa/BOUNDARY1_STRUCTURE.json",
  "qa/BOUNDARY1_LANGUAGE_MATH.json",
  "qa/BOUNDARY1_BUILD.json",
  "qa/BOUNDARY1_VISUAL.json",
  "qa/SECTION_AOWI_STRUCTURE.json",
  "qa/BOUNDARY2_BUILD.json",
  "qa/BOUNDARY2_VISUAL.json",
  "qa/SECTION_DADA_STRUCTURE.json",
  "qa/BOUNDARY3_BUILD.json",
  "qa/BOUNDARY3_VISUAL.json",
  "qa/frozen-boundaries/boundary3/SOURCE_SNAPSHOT.json",
];
const qaBundleRows = qaBundlePaths.map((item) => {
  const filename = path.join(root, item);
  return { path: item, bytes: fs.statSync(filename).size, sha256: sha256File(filename) };
}).sort((a, b) => a.path.localeCompare(b.path, "en"));
const qaBundleManifest = Buffer.from(qaBundleRows.map((row) => `${row.path}\t${row.bytes}\t${row.sha256}\n`).join(""), "utf8");
const boundary4QaBundlePaths = [
  "qa/BOUNDARY4_BUILD.json",
  "qa/BOUNDARY4_VISUAL.json",
  "qa/frozen-boundaries/boundary4/SOURCE_SNAPSHOT.json",
  "qa/SECTION_ROIIDB_STRUCTURE.json",
];
const boundary4QaBundleRows = boundary4QaBundlePaths.map((item) => {
  const filename = path.join(root, item);
  return { path: item, bytes: fs.statSync(filename).size, sha256: sha256File(filename) };
}).sort((a, b) => a.path.localeCompare(b.path, "en"));
const boundary4QaBundleManifest = Buffer.from(boundary4QaBundleRows.map((row) => `${row.path}\t${row.bytes}\t${row.sha256}\n`).join(""), "utf8");
if (boundary4QaBundleRows.reduce((sum, row) => sum + row.bytes, 0) !== 7016 || sha256Bytes(boundary4QaBundleManifest) !== "2564dd591dc9973eb114ab3680cc237bd95bce1911c5808fa7e8de4761bc45e7") throw new Error("Boundary 4 QA bundle manifest drift");
const boundary5QaBundlePaths = [
  "qa/BOUNDARY5_BUILD.json",
  "qa/BOUNDARY5_VISUAL.json",
  "qa/frozen-boundaries/boundary5/SOURCE_SNAPSHOT.json",
  "qa/SECTION_GCD_STRUCTURE.json",
];
const boundary5QaBundleRows = boundary5QaBundlePaths.map((item) => {
  const filename = path.join(root, item);
  return { path: item, bytes: fs.statSync(filename).size, sha256: sha256File(filename) };
}).sort((a, b) => a.path.localeCompare(b.path, "en"));
const boundary5QaBundleManifest = Buffer.from(boundary5QaBundleRows.map((row) => `${row.path}\t${row.bytes}\t${row.sha256}\n`).join(""), "utf8");
if (boundary5QaBundleRows.reduce((sum, row) => sum + row.bytes, 0) !== 8096 || boundary5QaBundleManifest.length !== 411 || sha256Bytes(boundary5QaBundleManifest) !== "589a09f93c6b1dfb6aae465eb567c480150a03b6d6eccb877b480416cfdc1ebf") throw new Error("Boundary 5 QA bundle manifest drift");
const boundary6QaBundlePaths = [
  "qa/BOUNDARY6_BUILD.json",
  "qa/BOUNDARY6_VISUAL.json",
  "qa/frozen-boundaries/boundary6/SOURCE_SNAPSHOT.json",
  "qa/SECTION_EA_STRUCTURE.json",
];
const boundary6QaBundleRows = boundary6QaBundlePaths.map((item) => {
  const filename = path.join(root, item);
  return { path: item, bytes: fs.statSync(filename).size, sha256: sha256File(filename) };
}).sort((a, b) => a.path.localeCompare(b.path, "en"));
const boundary6QaBundleManifest = Buffer.from(boundary6QaBundleRows.map((row) => `${row.path}\t${row.bytes}\t${row.sha256}\n`).join(""), "utf8");
if (boundary6QaBundleRows.reduce((sum, row) => sum + row.bytes, 0) !== 7910 || boundary6QaBundleManifest.length !== 410 || sha256Bytes(boundary6QaBundleManifest) !== "5f9b40329a0ace8194405477f567cb8802015399a6c28596f61e5ce7d609a8c2") throw new Error("Boundary 6 QA bundle manifest drift");
const boundary7QaBundlePaths = [
  "qa/BOUNDARY7_BUILD.json",
  "qa/BOUNDARY7_VISUAL.json",
  "qa/frozen-boundaries/boundary7/SOURCE_SNAPSHOT.json",
  "qa/SECTION_ITC_STRUCTURE.json",
];
const boundary7QaBundleRows = boundary7QaBundlePaths.map((item) => {
  const filename = path.join(root, item);
  return { path: item, bytes: fs.statSync(filename).size, sha256: sha256File(filename) };
}).sort((a, b) => a.path.localeCompare(b.path, "en"));
const boundary7QaBundleManifest = Buffer.from(boundary7QaBundleRows.map((row) => `${row.path}\t${row.bytes}\t${row.sha256}\n`).join(""), "utf8");
if (boundary7QaBundleRows.reduce((sum, row) => sum + row.bytes, 0) !== 8788 || boundary7QaBundleManifest.length !== 411 || sha256Bytes(boundary7QaBundleManifest) !== "85e6b0ed126fa1d63d59b32cb097a85993717d87e369f5606047d4f5e51f341a") throw new Error("Boundary 7 QA bundle manifest drift");
const boundary8QaBundlePaths = [
  "qa/BOUNDARY8_BUILD.json",
  "qa/BOUNDARY8_VISUAL.json",
  "qa/frozen-boundaries/boundary8/SOURCE_SNAPSHOT.json",
  "qa/SECTION_LC_STRUCTURE.json",
];
const boundary8QaBundleRows = boundary8QaBundlePaths.map((item) => {
  const filename = path.join(root, item);
  return { path: item, bytes: fs.statSync(filename).size, sha256: sha256File(filename) };
}).sort((a, b) => a.path.localeCompare(b.path, "en"));
const boundary8QaBundleManifest = Buffer.from(boundary8QaBundleRows.map((row) => `${row.path}\t${row.bytes}\t${row.sha256}\n`).join(""), "utf8");
if (boundary8QaBundleRows.reduce((sum, row) => sum + row.bytes, 0) !== 9172 || boundary8QaBundleManifest.length !== 410 || sha256Bytes(boundary8QaBundleManifest) !== "e46297d3d3fb4e327e7343d6d94cb7e6cf89ee63bec4ed6f7ef312860704bbb7") throw new Error("Boundary 8 QA bundle manifest drift");
const boundary9QaBundlePaths = [
  "qa/BOUNDARY9_BUILD.json",
  "qa/BOUNDARY9_VISUAL.json",
  "qa/frozen-boundaries/boundary9/SOURCE_SNAPSHOT.json",
  "qa/SECTION_CRT_STRUCTURE.json",
];
const boundary9QaBundleRows = boundary9QaBundlePaths.map((item) => {
  const filename = path.join(root, item);
  return { path: item, bytes: fs.statSync(filename).size, sha256: sha256File(filename) };
}).sort((a, b) => a.path.localeCompare(b.path, "en"));
const boundary9QaBundleManifest = Buffer.from(boundary9QaBundleRows.map((row) => `${row.path}\t${row.bytes}\t${row.sha256}\n`).join(""), "utf8");
if (boundary9QaBundleRows.reduce((sum, row) => sum + row.bytes, 0) !== 9110 || boundary9QaBundleManifest.length !== 411 || sha256Bytes(boundary9QaBundleManifest) !== "eab6d23e3fcfaa20bc58fbbd68706af7b4db7c155974d922caa83a3abb0b1905") throw new Error("Boundary 9 QA bundle manifest drift");
const boundary10QaBundlePaths = [
  "qa/BOUNDARY10_BUILD.json",
  "qa/BOUNDARY10_VISUAL.json",
  "qa/frozen-boundaries/boundary10/SOURCE_SNAPSHOT.json",
  "qa/SECTION_AWTWWC_STRUCTURE.json",
];
const boundary10QaBundleRows = boundary10QaBundlePaths.map((item) => {
  const filename = path.join(root, item);
  return { path: item, bytes: fs.statSync(filename).size, sha256: sha256File(filename) };
}).sort((a, b) => a.path.localeCompare(b.path, "en"));
const boundary10QaBundleManifest = Buffer.from(boundary10QaBundleRows.map((row) => `${row.path}\t${row.bytes}\t${row.sha256}\n`).join(""), "utf8");
if (boundary10QaBundleRows.reduce((sum, row) => sum + row.bytes, 0) !== 11299 || boundary10QaBundleManifest.length !== 417 || sha256Bytes(boundary10QaBundleManifest) !== "f9a1be145afb5733e24a3f7eb5ea177ca6a3220e6ea69e455df203667f229644") throw new Error("Boundary 10 QA bundle manifest drift");
const boundary11QaBundlePaths = [
  "qa/BOUNDARY11_BUILD.json",
  "qa/BOUNDARY11_VISUAL.json",
  "qa/frozen-boundaries/boundary11/SOURCE_SNAPSHOT.json",
  "qa/SECTION_EPHIF_STRUCTURE.json",
];
const boundary11QaBundleRows = boundary11QaBundlePaths.map((item) => {
  const filename = path.join(root, item);
  return { path: item, bytes: fs.statSync(filename).size, sha256: sha256File(filename) };
}).sort((a, b) => a.path.localeCompare(b.path, "en"));
const boundary11QaBundleManifest = Buffer.from(boundary11QaBundleRows.map((row) => `${row.path}\t${row.bytes}\t${row.sha256}\n`).join(""), "utf8");
if (boundary11QaBundleRows.reduce((sum, row) => sum + row.bytes, 0) !== 11091 || boundary11QaBundleManifest.length !== 416 || sha256Bytes(boundary11QaBundleManifest) !== "0d301e3b2bd8fe5f78fd5ee5527652ba17a65b9cde71e4c08c80c5b6651ce08b") throw new Error("Boundary 11 QA bundle manifest drift");
const artifactSpecs = [
  ["ttp.r014.artifact.authority-manifest", "authority/SOURCE_AUTHORITY.json", "application/json", fixedQaIds.source, {}],
  ["ttp.r014.artifact.official-pdf", "authority/downloads/yaintt.pdf", "application/pdf", fixedQaIds.source, { pages: 128 }],
  ["ttp.r014.artifact.upstream-replay-pdf", "qa/upstream-baseline-replay/rebuilt-authority.pdf", "application/pdf", fixedQaIds.upstream, { pages: 128 }],
  ["ttp.r014.artifact.target-source", targetRelPath, "application/x-tex", fixedQaIds.dadaTopology, {}],
  ["ttp.r014.artifact.boundary1-pdf", "output/YAINTT_ID_BOUNDARY1.pdf", "application/pdf", fixedQaIds.build, { pages: 15 }],
  ["ttp.r014.artifact.boundary2-pdf", "output/YAINTT_ID_BOUNDARY2.pdf", "application/pdf", fixedQaIds.build2, { pages: 17 }],
  ["ttp.r014.artifact.boundary3-pdf", "output/YAINTT_ID_BOUNDARY3.pdf", "application/pdf", fixedQaIds.build3, { pages: 19 }],
];
for (const [id, relPath, mediaType, receiptId, extra] of artifactSpecs) {
  const filename = path.join(root, relPath);
  records.push(baseRecord("artifact", id, {
    locale: relPath === targetRelPath || relPath.includes("BOUNDARY1") || relPath.includes("BOUNDARY2") || relPath.includes("BOUNDARY3") ? "id-ID" : "und",
    path: relPath,
    media_type: mediaType,
    bytes: fs.statSync(filename).size,
    sha256: sha256File(filename),
    toolchain: relPath.endsWith(".pdf") ? "documented in linked build receipt" : "frozen byte capture",
    build_receipt_id: receiptId,
    reproducible: !relPath.endsWith("yaintt.pdf") || relPath.includes("upstream-baseline"),
    ...extra,
  }));
}
for (const [id, relPath, mediaType, receiptId, extra] of [
  ["ttp.r014.artifact.target-source.boundary4", boundary4TargetRelPath, "application/x-tex", fixedQaIds.roiidbTopology, {}],
  ["ttp.r014.artifact.boundary4-pdf", "output/YAINTT_ID_BOUNDARY4.pdf", "application/pdf", fixedQaIds.build4, { pages: 23 }],
]) {
  const filename = path.join(root, relPath);
  records.push(baseRecord("artifact", id, {
    locale: "id-ID",
    path: relPath,
    media_type: mediaType,
    bytes: fs.statSync(filename).size,
    sha256: sha256File(filename),
    toolchain: relPath.endsWith(".pdf") ? "documented in linked build receipt" : "frozen byte capture",
    build_receipt_id: receiptId,
    reproducible: true,
    ...extra,
  }));
}
for (const [id, relPath, mediaType, receiptId, extra] of [
  ["ttp.r014.artifact.target-source.boundary5", boundary5TargetRelPath, "application/x-tex", fixedQaIds.gcdTopology, {}],
  ["ttp.r014.artifact.boundary5-pdf", "output/YAINTT_ID_BOUNDARY5.pdf", "application/pdf", fixedQaIds.build5, { pages: 27 }],
]) {
  const filename = path.join(root, relPath);
  records.push(baseRecord("artifact", id, {
    locale: "id-ID",
    path: relPath,
    media_type: mediaType,
    bytes: fs.statSync(filename).size,
    sha256: sha256File(filename),
    toolchain: relPath.endsWith(".pdf") ? "documented in linked build receipt" : "frozen byte capture",
    build_receipt_id: receiptId,
    reproducible: true,
    ...extra,
  }));
}
for (const [id, relPath, mediaType, receiptId, extra] of [
  ["ttp.r014.artifact.target-source.boundary6", boundary6TargetRelPath, "application/x-tex", fixedQaIds.eaTopology, {}],
  ["ttp.r014.artifact.boundary6-pdf", "output/YAINTT_ID_BOUNDARY6.pdf", "application/pdf", fixedQaIds.build6, { pages: 31 }],
]) {
  const filename = path.join(root, relPath);
  records.push(baseRecord("artifact", id, {
    locale: "id-ID",
    path: relPath,
    media_type: mediaType,
    bytes: fs.statSync(filename).size,
    sha256: sha256File(filename),
    toolchain: relPath.endsWith(".pdf") ? "documented in linked build receipt" : "frozen byte capture",
    build_receipt_id: receiptId,
    reproducible: true,
    ...extra,
  }));
}
for (const [id, relPath, mediaType, receiptId, extra] of [
  ["ttp.r014.artifact.target-source.boundary7", boundary7TargetRelPath, "application/x-tex", fixedQaIds.itcTopology, {}],
  ["ttp.r014.artifact.boundary7-pdf", "output/YAINTT_ID_BOUNDARY7.pdf", "application/pdf", fixedQaIds.build7, { pages: 38 }],
]) {
  const filename = path.join(root, relPath);
  records.push(baseRecord("artifact", id, {
    locale: "id-ID",
    path: relPath,
    media_type: mediaType,
    bytes: fs.statSync(filename).size,
    sha256: sha256File(filename),
    toolchain: relPath.endsWith(".pdf") ? "documented in linked build receipt" : "frozen byte capture",
    build_receipt_id: receiptId,
    reproducible: true,
    ...extra,
  }));
}
for (const [id, relPath, mediaType, receiptId, extra] of [
  ["ttp.r014.artifact.target-source.boundary8", boundary8TargetRelPath, "application/x-tex", fixedQaIds.lcTopology, {}],
  ["ttp.r014.artifact.boundary8-pdf", "output/YAINTT_ID_BOUNDARY8.pdf", "application/pdf", fixedQaIds.build8, { pages: 42 }],
]) {
  const filename = path.join(root, relPath);
  records.push(baseRecord("artifact", id, {
    locale: "id-ID",
    path: relPath,
    media_type: mediaType,
    bytes: fs.statSync(filename).size,
    sha256: sha256File(filename),
    toolchain: relPath.endsWith(".pdf") ? "documented in linked build receipt" : "frozen byte capture",
    build_receipt_id: receiptId,
    reproducible: true,
    ...extra,
  }));
}
for (const [id, relPath, mediaType, receiptId, extra] of [
  ["ttp.r014.artifact.target-source.boundary9", boundary9TargetRelPath, "application/x-tex", fixedQaIds.crtTopology, {}],
  ["ttp.r014.artifact.boundary9-pdf", "output/YAINTT_ID_BOUNDARY9.pdf", "application/pdf", fixedQaIds.build9, { pages: 46 }],
]) {
  const filename = path.join(root, relPath);
  records.push(baseRecord("artifact", id, {
    locale: "id-ID",
    path: relPath,
    media_type: mediaType,
    bytes: fs.statSync(filename).size,
    sha256: sha256File(filename),
    toolchain: relPath.endsWith(".pdf") ? "documented in linked build receipt" : "frozen byte capture",
    build_receipt_id: receiptId,
    reproducible: true,
    ...extra,
  }));
}
for (const [id, relPath, mediaType, receiptId, extra] of [
  ["ttp.r014.artifact.target-source.boundary10", boundary10TargetRelPath, "application/x-tex", fixedQaIds.awtwwcTopology, {}],
  ["ttp.r014.artifact.boundary10-pdf", "output/YAINTT_ID_BOUNDARY10.pdf", "application/pdf", fixedQaIds.build10, { pages: 50 }],
]) {
  const filename = path.join(root, relPath);
  records.push(baseRecord("artifact", id, {
    locale: "id-ID",
    path: relPath,
    media_type: mediaType,
    bytes: fs.statSync(filename).size,
    sha256: sha256File(filename),
    toolchain: relPath.endsWith(".pdf") ? "documented in linked build receipt" : "frozen byte capture",
    build_receipt_id: receiptId,
    reproducible: true,
    ...extra,
  }));
}
for (const [id, relPath, mediaType, receiptId, extra] of [
  ["ttp.r014.artifact.target-source.boundary11", boundary11TargetRelPath, "application/x-tex", fixedQaIds.ephifTopology, {}],
  ["ttp.r014.artifact.boundary11-pdf", "output/YAINTT_ID_BOUNDARY11.pdf", "application/pdf", fixedQaIds.build11, { pages: 52 }],
]) {
  const filename = path.join(root, relPath);
  records.push(baseRecord("artifact", id, {
    locale: "id-ID",
    path: relPath,
    media_type: mediaType,
    bytes: fs.statSync(filename).size,
    sha256: sha256File(filename),
    toolchain: relPath.endsWith(".pdf") ? "documented in linked build receipt" : "frozen byte capture",
    build_receipt_id: receiptId,
    reproducible: true,
    ...extra,
  }));
}
records.push(baseRecord("artifact", "ttp.r014.artifact.qa-bundle", {
  locale: "und",
  path: "qa/",
  media_type: "application/vnd.r014.qa-bundle+json",
  bytes: qaBundleRows.reduce((sum, row) => sum + row.bytes, 0),
  sha256: sha256Bytes(qaBundleManifest),
  file_manifest: qaBundleRows,
  toolchain: "canonical path-tab-bytes-tab-sha256 LF manifest",
  build_receipt_id: fixedQaIds.backend,
  reproducible: true,
}));
records.push(baseRecord("artifact", "ttp.r014.artifact.qa-bundle.boundary4", {
  locale: "und",
  path: "qa/",
  media_type: "application/vnd.r014.qa-bundle+json",
  bytes: boundary4QaBundleRows.reduce((sum, row) => sum + row.bytes, 0),
  sha256: sha256Bytes(boundary4QaBundleManifest),
  file_manifest: boundary4QaBundleRows,
  toolchain: "canonical path-tab-bytes-tab-sha256 LF manifest",
  build_receipt_id: fixedQaIds.backend4,
  reproducible: true,
}));
records.push(baseRecord("artifact", "ttp.r014.artifact.qa-bundle.boundary5", {
  locale: "und",
  path: "qa/",
  media_type: "application/vnd.r014.qa-bundle+json",
  bytes: boundary5QaBundleRows.reduce((sum, row) => sum + row.bytes, 0),
  sha256: sha256Bytes(boundary5QaBundleManifest),
  file_manifest: boundary5QaBundleRows,
  toolchain: "canonical path-tab-bytes-tab-sha256 LF manifest",
  build_receipt_id: fixedQaIds.backend5,
  reproducible: true,
}));
records.push(baseRecord("artifact", "ttp.r014.artifact.qa-bundle.boundary6", {
  locale: "und",
  path: "qa/",
  media_type: "application/vnd.r014.qa-bundle+json",
  bytes: boundary6QaBundleRows.reduce((sum, row) => sum + row.bytes, 0),
  sha256: sha256Bytes(boundary6QaBundleManifest),
  file_manifest: boundary6QaBundleRows,
  toolchain: "canonical path-tab-bytes-tab-sha256 LF manifest",
  build_receipt_id: fixedQaIds.backend6,
  reproducible: true,
}));
records.push(baseRecord("artifact", "ttp.r014.artifact.qa-bundle.boundary7", {
  locale: "und",
  path: "qa/",
  media_type: "application/vnd.r014.qa-bundle+json",
  bytes: boundary7QaBundleRows.reduce((sum, row) => sum + row.bytes, 0),
  sha256: sha256Bytes(boundary7QaBundleManifest),
  file_manifest: boundary7QaBundleRows,
  toolchain: "canonical path-tab-bytes-tab-sha256 LF manifest",
  build_receipt_id: fixedQaIds.backend7,
  reproducible: true,
}));
records.push(baseRecord("artifact", "ttp.r014.artifact.qa-bundle.boundary8", {
  locale: "und",
  path: "qa/",
  media_type: "application/vnd.r014.qa-bundle+json",
  bytes: boundary8QaBundleRows.reduce((sum, row) => sum + row.bytes, 0),
  sha256: sha256Bytes(boundary8QaBundleManifest),
  file_manifest: boundary8QaBundleRows,
  toolchain: "canonical path-tab-bytes-tab-sha256 LF manifest",
  build_receipt_id: fixedQaIds.backend8,
  reproducible: true,
}));
records.push(baseRecord("artifact", "ttp.r014.artifact.qa-bundle.boundary9", {
  locale: "und",
  path: "qa/",
  media_type: "application/vnd.r014.qa-bundle+json",
  bytes: boundary9QaBundleRows.reduce((sum, row) => sum + row.bytes, 0),
  sha256: sha256Bytes(boundary9QaBundleManifest),
  file_manifest: boundary9QaBundleRows,
  toolchain: "canonical path-tab-bytes-tab-sha256 LF manifest",
  build_receipt_id: fixedQaIds.backend9,
  reproducible: true,
}));
records.push(baseRecord("artifact", "ttp.r014.artifact.qa-bundle.boundary10", {
  locale: "und",
  path: "qa/",
  media_type: "application/vnd.r014.qa-bundle+json",
  bytes: boundary10QaBundleRows.reduce((sum, row) => sum + row.bytes, 0),
  sha256: sha256Bytes(boundary10QaBundleManifest),
  file_manifest: boundary10QaBundleRows,
  toolchain: "canonical path-tab-bytes-tab-sha256 LF manifest",
  build_receipt_id: fixedQaIds.backend10,
  reproducible: true,
}));
records.push(baseRecord("artifact", "ttp.r014.artifact.qa-bundle.boundary11", {
  locale: "und",
  path: "qa/",
  media_type: "application/vnd.r014.qa-bundle+json",
  bytes: boundary11QaBundleRows.reduce((sum, row) => sum + row.bytes, 0),
  sha256: sha256Bytes(boundary11QaBundleManifest),
  file_manifest: boundary11QaBundleRows,
  toolchain: "canonical path-tab-bytes-tab-sha256 LF manifest",
  build_receipt_id: fixedQaIds.backend11,
  reproducible: true,
}));

const relationRecords = [];
let relationOrder = 0;
function relation(subjectId, predicate, objectId, evidence = null) {
  relationOrder += 1;
  relationRecords.push(baseRecord("relation", `ttp.r014.relation.${String(relationOrder).padStart(4, "0")}`, {
    locale: "und",
    subject_id: subjectId,
    predicate,
    object_id: objectId,
    relation_order: relationOrder,
    evidence_locator: evidence,
    confidence: "high",
  }));
}
for (const spec of unitSpecs.slice(0, 52)) if (spec[2]) relation(unitId(spec[2]), "contains", unitId(spec[0]));
relation("ttp.program.mathematics.id-id.v1", "contains", "ttp.course.c60");

const sequenceGroups = [
  ["frontmatter.title-page", "frontmatter.preface", "frontmatter.release-notes", "frontmatter.toc"],
  ["sec.wopami.discussion.01", "sec.wopami.subsection.01", "sec.wopami.subsection.02", "sec.wopami.subsection.03", "sec.wopami.exercises"],
  ["sec.wopami.definition.01", "sec.wopami.principle.well-ordering", "sec.wopami.discussion.02"],
  ["sec.wopami.discussion.03", "sec.wopami.theorem.induction.01", "eg.inductionv1a", "eg.inductionv1b", "sec.wopami.theorem.induction.02"],
  ["eg.inductionv1a.equation.01", "eg.inductionv1a.equation.02", "eg.inductionv1a.equation.03", "eg.inductionv1a.equation.04"],
  ["eg.inductionv1b.equation.01", "eg.inductionv1b.equation.02"],
  ["sec.wopami.exercise.01", "sec.wopami.exercise.02", "sec.wopami.exercise.03", "sec.wopami.exercise.04", "sec.wopami.exercise.05", "sec.wopami.exercise.06", "sec.wopami.exercise.07"],
  ["backmatter.bibliography", "backmatter.index"],
  ["bib.stallman2002free", "bib.hardy2005mathematician", "bib.bourbaki2004theory"],
  ["sec.wopami", "sec.aowi"],
];
for (const group of sequenceGroups) for (let i = 0; i + 1 < group.length; i += 1) relation(unitId(group[i]), "precedes", unitId(group[i + 1]));
relation("ttp.course.c60", "depends_on", resourceId, { path: "authority/receipts/C60_CURRICULUM_AUTHORITY.json" });
relation(targetEditionId, "translates", sourceEditionId);
relation(targetEditionId, "adapts", sourceEditionId);
const sourceEditionAssets = sourceAuthority.files.filter((item) => !["landing_and_license_authority", "official_source_corresponding_pdf"].includes(item.role));
for (const item of sourceEditionAssets) relation(sourceEditionId, "depends_on", assetId(path.basename(item.path)));
for (const item of sourceEditionAssets.filter((item) => path.basename(item.path) !== "by-sa.eps")) relation(targetEditionId, "depends_on", assetId(path.basename(item.path)));
relation(unitId("frontmatter.title-page.figure.cover"), "uses_asset", assetId("cover_art.eps"));
relation(unitId("frontmatter.preface.figure.license-badge"), "source_uses_asset", assetId("by-sa.eps"));
relation(unitId("frontmatter.release-notes.figure.caution"), "uses_asset", assetId("dbend.eps"));
relation(unitId("frontmatter.release-notes"), "references", unitId("chap.crypto"));
relation(unitId("frontmatter.release-notes"), "references", unitId("sec.dhke"));
relation(unitId("frontmatter.release-notes"), "references", unitId("sec.tegc"));
relation(unitId("sec.wopami.exercises"), "references", unitId("sec.wopami"));
relation(unitId("frontmatter.preface"), "cites", unitId("bib.stallman2002free"));
relation(unitId("frontmatter.release-notes"), "cites", unitId("bib.hardy2005mathematician"));
relation(unitId("frontmatter.release-notes"), "cites", unitId("bib.bourbaki2004theory"));
for (const [number,,,,,,, affectedSuffixes] of corrections.filter((item) => item[0] <= 10)) {
  for (const suffix of affectedSuffixes) relation(correctionId(number), "corrects", unitId(suffix));
}
relation(unitId("thm.pigeonhole.proof"), "proves", unitId("thm.pigeonhole"));
relation(unitId("sec.wopami.theorem.induction.01.proof"), "proves", unitId("sec.wopami.theorem.induction.01"));
relation(unitId("sec.wopami.theorem.induction.02.proof"), "proves", unitId("sec.wopami.theorem.induction.02"));
relation(unitId("eg.inductionv1a"), "illustrates", unitId("sec.wopami.theorem.induction.01"));
relation(unitId("eg.inductionv1b"), "illustrates", unitId("sec.wopami.theorem.induction.01"));

const conceptMappings = [
  ["frontmatter.release-notes", ["cryptology", "primitive_root", "index_discrete_log", "cryptosystem", "key_exchange", "rsa", "diffie_hellman", "elgamal", "euler_theorem"]],
  ["sec.wopami.discussion.01", ["well_ordering_principle", "pigeonhole_principle", "mathematical_induction"]],
  ["sec.wopami.definition.01", ["least_element"]],
  ["sec.wopami.principle.well-ordering", ["well_ordering_principle", "least_element", "natural_number"]],
  ["thm.pigeonhole", ["pigeonhole_principle", "natural_number"]],
  ["thm.pigeonhole.proof", ["pigeonhole_principle", "proof_by_contradiction"]],
  ["sec.wopami.discussion.03", ["mathematical_induction"]],
  ["sec.wopami.theorem.induction.01", ["mathematical_induction", "natural_number"]],
  ["sec.wopami.theorem.induction.01.proof", ["mathematical_induction", "well_ordering_principle", "proof_by_contradiction"]],
  ["eg.inductionv1a", ["mathematical_induction", "finite_sum"]],
  ["eg.inductionv1b", ["mathematical_induction", "factorial"]],
  ["sec.wopami.theorem.induction.02", ["strong_induction", "natural_number"]],
  ["sec.wopami.theorem.induction.02.proof", ["strong_induction", "mathematical_induction"]],
  ["sec.wopami.exercise.01", ["mathematical_induction"]],
  ["sec.wopami.exercise.02", ["mathematical_induction", "finite_sum"]],
  ["sec.wopami.exercise.03", ["mathematical_induction", "finite_sum"]],
  ["sec.wopami.exercise.04", ["mathematical_induction", "finite_sum"]],
  ["sec.wopami.exercise.05", ["mathematical_induction", "finite_sum"]],
  ["sec.wopami.exercise.06", ["mathematical_induction", "factorial"]],
  ["sec.wopami.exercise.07", ["mathematical_induction", "factorial"]],
];
let mappingCount = 0;
for (const [suffix, concepts] of conceptMappings) for (const code of concepts) {
  relation(unitId(suffix), "covers", conceptId(code));
  mappingCount += 1;
}
if (mappingCount !== 47) throw new Error(`expected 47 unit-concept mappings, observed ${mappingCount}`);
const prerequisiteEdges = [
  ["least_element", "well_ordering_principle"],
  ["natural_number", "well_ordering_principle"],
  ["well_ordering_principle", "mathematical_induction"],
  ["mathematical_induction", "strong_induction"],
  ["cryptosystem", "rsa"],
  ["cryptosystem", "elgamal"],
  ["key_exchange", "diffie_hellman"],
];
for (const [subject, object] of prerequisiteEdges) relation(conceptId(subject), "prerequisite_for", conceptId(object));
relation(correctionId(11), "corrects", unitId("sec.aowi"));
for (const code of [
  "integer",
  "binary_operation",
  "addition",
  "multiplication",
  "commutativity",
  "associativity",
  "distributivity",
  "identity_element",
  "additive_inverse",
  "multiplicative_inverse",
  "subtraction",
  "division",
]) relation(unitId("sec.aowi"), "covers", conceptId(code));
for (const [subject, object] of [
  ["integer", "addition"],
  ["integer", "multiplication"],
  ["binary_operation", "commutativity"],
  ["binary_operation", "associativity"],
  ["binary_operation", "identity_element"],
  ["addition", "distributivity"],
  ["addition", "additive_inverse"],
  ["addition", "subtraction"],
  ["multiplication", "distributivity"],
  ["multiplication", "multiplicative_inverse"],
  ["multiplication", "division"],
  ["identity_element", "additive_inverse"],
  ["identity_element", "multiplicative_inverse"],
  ["additive_inverse", "subtraction"],
]) relation(conceptId(subject), "prerequisite_for", conceptId(object));
if (relationRecords.length !== 211) throw new Error(`legacy Boundary 2 relation prefix drifted: expected 211, observed ${relationRecords.length}`);

// Boundary 3 additions are deliberately appended after the exact legacy prefix so
// relation IDs 0001–0211 remain stable across exports.
for (const spec of unitSpecs.slice(52)) if (spec[2]) relation(unitId(spec[2]), "contains", unitId(spec[0]));
relation(unitId("sec.aowi"), "precedes", unitId("sec.dada"));
for (const group of [
  ["sec.dada.discussion.01", "sec.dada.subsection.divisibility", "sec.dada.subsection.division-algorithm", "sec.dada.exercises"],
  ["sec.dada.definition.divisibility", "sec.dada.example.basic", "sec.dada.definition.parity", "sec.dada.discussion.parity", "sec.dada.proposition.zero", "sec.dada.proposition.size", "sec.dada.proposition.absolute-value", "sec.dada.theorem.transitivity", "eg.divisibility", "sec.dada.discussion.linear-combination", "thm.divisibilitylincombs", "sec.dada.discussion.finite-combination"],
  ["thm.the-da", "eg.arithmetic"],
  Array.from({ length: 12 }, (_, index) => `sec.dada.exercise.${String(index + 1).padStart(2, "0")}`),
]) {
  for (let index = 0; index + 1 < group.length; index += 1) relation(unitId(group[index]), "precedes", unitId(group[index + 1]));
}
for (const [number,,,,,,, affectedSuffixes] of corrections.filter((item) => item[0] >= 12)) {
  for (const suffix of affectedSuffixes) relation(correctionId(number), "corrects", unitId(suffix));
}
relation(unitId("sec.dada.theorem.transitivity.proof"), "proves", unitId("sec.dada.theorem.transitivity"));
relation(unitId("thm.divisibilitylincombs.proof"), "proves", unitId("thm.divisibilitylincombs"));
relation(unitId("thm.the-da.proof"), "proves", unitId("thm.the-da"));
relation(unitId("sec.dada.example.basic"), "illustrates", unitId("sec.dada.definition.divisibility"));
relation(unitId("eg.divisibility"), "illustrates", unitId("sec.dada.theorem.transitivity"));
relation(unitId("eg.arithmetic"), "illustrates", unitId("thm.the-da"));
relation(unitId("sec.dada.discussion.parity"), "references", unitId("thm.the-da"));
relation(unitId("sec.dada.discussion.finite-combination"), "references", unitId("thm.divisibilitylincombs"));
relation(unitId("sec.dada.exercises"), "references", unitId("sec.dada"));

const dadaConceptMappings = [
  ["sec.dada.discussion.01", ["divisibility"]],
  ["sec.dada.definition.divisibility", ["integer", "divisibility", "factor", "divisor", "multiple"]],
  ["sec.dada.example.basic", ["divisibility"]],
  ["sec.dada.definition.parity", ["divisibility", "parity"]],
  ["sec.dada.discussion.parity", ["parity", "division_algorithm"]],
  ["sec.dada.proposition.zero", ["divisibility"]],
  ["sec.dada.proposition.size", ["divisibility"]],
  ["sec.dada.proposition.absolute-value", ["divisibility"]],
  ["sec.dada.theorem.transitivity", ["divisibility"]],
  ["sec.dada.theorem.transitivity.proof", ["divisibility"]],
  ["eg.divisibility", ["divisibility"]],
  ["sec.dada.discussion.linear-combination", ["divisibility", "linear_combination"]],
  ["thm.divisibilitylincombs", ["divisibility", "linear_combination"]],
  ["thm.divisibilitylincombs.proof", ["divisibility", "linear_combination"]],
  ["sec.dada.discussion.finite-combination", ["divisibility", "linear_combination", "mathematical_induction"]],
  ["thm.the-da", ["division_algorithm", "quotient", "remainder"]],
  ["thm.the-da.proof", ["division_algorithm", "well_ordering_principle", "divisibility"]],
  ["eg.arithmetic", ["division_algorithm", "quotient", "remainder"]],
  ["sec.dada.exercise.01", ["divisibility"]],
  ["sec.dada.exercise.02", ["division_algorithm", "quotient", "remainder"]],
  ["sec.dada.exercise.03", ["division_algorithm", "quotient", "remainder"]],
  ["sec.dada.exercise.04", ["divisibility", "multiplication"]],
  ["sec.dada.exercise.05", ["divisibility"]],
  ["sec.dada.exercise.06", ["parity", "addition"]],
  ["sec.dada.exercise.07", ["parity", "multiplication"]],
  ["sec.dada.exercise.08", ["divisibility"]],
  ["sec.dada.exercise.09", ["parity"]],
  ["sec.dada.exercise.10", ["remainder"]],
  ["sec.dada.exercise.11", ["divisibility"]],
  ["sec.dada.exercise.12", ["divisibility"]],
];
let dadaMappingCount = 0;
for (const [suffix, concepts] of dadaConceptMappings) for (const code of concepts) {
  relation(unitId(suffix), "covers", conceptId(code));
  dadaMappingCount += 1;
}
if (dadaMappingCount !== 54) throw new Error(`expected 54 Boundary 3 concept mappings, observed ${dadaMappingCount}`);
for (const [subject, object] of [
  ["integer", "divisibility"],
  ["multiplication", "divisibility"],
  ["divisibility", "factor"],
  ["divisibility", "divisor"],
  ["divisibility", "multiple"],
  ["divisibility", "parity"],
  ["addition", "linear_combination"],
  ["multiplication", "linear_combination"],
  ["integer", "division_algorithm"],
  ["well_ordering_principle", "division_algorithm"],
  ["division_algorithm", "quotient"],
  ["division_algorithm", "remainder"],
]) relation(conceptId(subject), "prerequisite_for", conceptId(object));
if (relationRecords.length !== 354) throw new Error(`expected 354 relations, observed ${relationRecords.length}`);

// Boundary 4 is appended after the exact 0001–0354 relation prefix.
for (const spec of boundary4UnitSpecs) relation(unitId(spec[2]), "contains", unitId(spec[0]));
relation(unitId("sec.dada"), "precedes", unitId("sec.roiidb"));
for (const group of [
  ["sec.roiidb.discussion.01", "thm.basebexpansion", "def.baseb", "eg.basetwo", "eg.changebase", "sec.roiidb.exercises"],
  Array.from({ length: 5 }, (_, index) => `sec.roiidb.exercise.${String(index + 1).padStart(2, "0")}`),
]) for (let index = 0; index + 1 < group.length; index += 1) relation(unitId(group[index]), "precedes", unitId(group[index + 1]));
for (const [number,,,,,,, affectedSuffixes] of boundary4Corrections) {
  for (const suffix of affectedSuffixes) relation(correctionId(number), "corrects", unitId(suffix));
}
relation(unitId("thm.basebexpansion.proof"), "proves", unitId("thm.basebexpansion"));
relation(unitId("eg.basetwo"), "illustrates", unitId("thm.basebexpansion"));
relation(unitId("eg.changebase"), "illustrates", unitId("def.baseb"));
relation(unitId("def.baseb"), "references", unitId("thm.basebexpansion"));
relation(unitId("sec.roiidb.exercises"), "references", unitId("sec.roiidb"));

const boundary4ConceptMappings = [
  ["sec.roiidb", ["base", "base_representation"]],
  ["sec.roiidb.discussion.01", ["base", "base_representation", "decimal", "sexagesimal"]],
  ["thm.basebexpansion", ["base", "base_representation", "digit", "division_algorithm", "natural_number"]],
  ["thm.basebexpansion.proof", ["base", "base_representation", "digit", "division_algorithm", "quotient", "remainder"]],
  ["def.baseb", ["base", "base_representation", "digit", "binary_representation", "bit", "octal", "hexadecimal", "hex", "sexagesimal"]],
  ["eg.basetwo", ["base", "base_representation", "digit", "division_algorithm", "quotient", "remainder", "decimal"]],
  ["eg.changebase", ["base", "base_representation", "digit", "decimal"]],
  ["sec.roiidb.exercise.01", ["base", "base_representation", "division_algorithm", "remainder", "decimal"]],
  ["sec.roiidb.exercise.02", ["base", "base_representation", "division_algorithm", "remainder", "decimal", "octal"]],
  ["sec.roiidb.exercise.03", ["base_representation", "binary_representation", "decimal"]],
  ["sec.roiidb.exercise.04", ["base_representation", "hexadecimal", "decimal"]],
  ["sec.roiidb.exercise.05", ["base_representation", "hexadecimal", "binary_representation"]],
];
let boundary4MappingCount = 0;
for (const [suffix, concepts] of boundary4ConceptMappings) for (const code of concepts) {
  relation(unitId(suffix), "covers", conceptId(code));
  boundary4MappingCount += 1;
}
if (boundary4MappingCount !== 57) throw new Error(`expected 57 Boundary 4 concept mappings, observed ${boundary4MappingCount}`);
const boundary4PrerequisiteEdges = [
  ["integer", "base"],
  ["base", "base_representation"],
  ["natural_number", "base_representation"],
  ["division_algorithm", "base_representation"],
  ["base_representation", "digit"],
  ["base_representation", "binary_representation"],
  ["base_representation", "decimal"],
  ["base_representation", "octal"],
  ["base_representation", "hexadecimal"],
  ["base_representation", "sexagesimal"],
  ["hexadecimal", "hex"],
  ["binary_representation", "bit"],
  ["digit", "bit"],
];
for (const [subject, object] of boundary4PrerequisiteEdges) relation(conceptId(subject), "prerequisite_for", conceptId(object));
relation(boundary4EditionId, "translates", sourceEditionId);
relation(boundary4EditionId, "adapts", sourceEditionId);
for (const item of sourceEditionAssets.filter((item) => path.basename(item.path) !== "by-sa.eps")) relation(boundary4EditionId, "depends_on", assetId(path.basename(item.path)));
if (relationRecords.length !== 469) throw new Error(`expected 469 relations through Boundary 4, observed ${relationRecords.length}`);

// Boundary 5 is appended after the exact 0001–0469 admitted relation prefix.
for (const spec of boundary5UnitSpecs) relation(unitId(spec[2]), "contains", unitId(spec[0]));
relation(unitId("sec.roiidb"), "precedes", unitId("sec.gcd"));
for (const group of [
  [
    "sec.gcd.discussion.01",
    "sec.gcd.definition.greatest-common-divisor",
    "eg.gcda",
    "sec.gcd.definition.relatively-prime",
    "eg.gcdb",
    "sec.gcd.discussion.02",
    "thm.dividebygcd",
    "sec.gcd.discussion.03",
    "sec.gcd.theorem.invariance",
    "eg.gcdc",
    "sec.gcd.discussion.04",
    "thm.gcdislincomb",
    "sec.gcd.discussion.05",
    "cor.intlincombrelprime",
    "sec.gcd.definition.gcd-family",
    "sec.gcd.definition.mutually-relatively-prime",
    "eg.mutrelprime",
    "sec.gcd.definition.pairwise-relatively-prime",
    "eg.pairwiserelprime",
    "sec.gcd.proposition.pairwise-implies-mutual",
    "sec.gcd.exercises",
  ],
  Array.from({ length: 9 }, (_, index) => `sec.gcd.exercise.${String(index + 1).padStart(2, "0")}`),
]) for (let index = 0; index + 1 < group.length; index += 1) relation(unitId(group[index]), "precedes", unitId(group[index + 1]));
for (const [number,,,,,,, affectedSuffixes] of boundary5Corrections) {
  for (const suffix of affectedSuffixes) relation(correctionId(number), "corrects", unitId(suffix));
}
relation(unitId("thm.dividebygcd.proof"), "proves", unitId("thm.dividebygcd"));
relation(unitId("sec.gcd.theorem.invariance.proof"), "proves", unitId("sec.gcd.theorem.invariance"));
relation(unitId("thm.gcdislincomb.proof"), "proves", unitId("thm.gcdislincomb"));
relation(unitId("eg.gcda"), "illustrates", unitId("sec.gcd.definition.greatest-common-divisor"));
relation(unitId("eg.gcdb"), "illustrates", unitId("sec.gcd.definition.relatively-prime"));
relation(unitId("eg.gcdc"), "illustrates", unitId("sec.gcd.theorem.invariance"));
relation(unitId("eg.mutrelprime"), "illustrates", unitId("sec.gcd.definition.mutually-relatively-prime"));
relation(unitId("eg.pairwiserelprime"), "illustrates", unitId("sec.gcd.definition.pairwise-relatively-prime"));
relation(unitId("sec.gcd.discussion.01"), "references", unitId("sec.dada.exercise.05"));
relation(unitId("sec.gcd.theorem.invariance.proof"), "references", unitId("thm.divisibilitylincombs"));
relation(unitId("thm.gcdislincomb.proof"), "references", unitId("thm.divisibilitylincombs"));
relation(unitId("sec.gcd.exercises"), "references", unitId("sec.gcd"));

const boundary5ConceptMappings = [
  ["sec.gcd", ["greatest_common_divisor", "common_divisor", "relatively_prime", "linear_combination"]],
  ["sec.gcd.discussion.01", ["greatest_common_divisor", "common_divisor", "divisor"]],
  ["sec.gcd.definition.greatest-common-divisor", ["greatest_common_divisor", "common_divisor", "divisibility", "divisor", "integer"]],
  ["eg.gcda", ["greatest_common_divisor", "common_divisor"]],
  ["sec.gcd.definition.relatively-prime", ["relatively_prime", "greatest_common_divisor"]],
  ["eg.gcdb", ["relatively_prime", "greatest_common_divisor"]],
  ["sec.gcd.discussion.02", ["divisor", "greatest_common_divisor", "common_divisor", "integer"]],
  ["thm.dividebygcd", ["greatest_common_divisor", "relatively_prime", "divisibility"]],
  ["thm.dividebygcd.proof", ["greatest_common_divisor", "relatively_prime", "common_divisor", "divisor", "divisibility", "integer"]],
  ["sec.gcd.discussion.03", ["greatest_common_divisor", "addition", "multiplication"]],
  ["sec.gcd.theorem.invariance", ["greatest_common_divisor", "addition", "multiplication", "integer"]],
  ["sec.gcd.theorem.invariance.proof", ["greatest_common_divisor", "common_divisor", "divisibility", "linear_combination"]],
  ["eg.gcdc", ["greatest_common_divisor"]],
  ["sec.gcd.discussion.04", ["greatest_common_divisor", "linear_combination"]],
  ["thm.gcdislincomb", ["greatest_common_divisor", "linear_combination", "natural_number", "integer"]],
  ["thm.gcdislincomb.proof", ["greatest_common_divisor", "linear_combination", "well_ordering_principle", "division_algorithm", "quotient", "remainder", "divisibility"]],
  ["sec.gcd.discussion.05", ["relatively_prime", "linear_combination"]],
  ["cor.intlincombrelprime", ["relatively_prime", "linear_combination", "greatest_common_divisor"]],
  ["sec.gcd.definition.gcd-family", ["greatest_common_divisor", "common_divisor", "integer"]],
  ["sec.gcd.definition.mutually-relatively-prime", ["mutually_relatively_prime", "greatest_common_divisor"]],
  ["eg.mutrelprime", ["mutually_relatively_prime", "relatively_prime", "greatest_common_divisor"]],
  ["sec.gcd.definition.pairwise-relatively-prime", ["pairwise_relatively_prime", "relatively_prime", "greatest_common_divisor"]],
  ["eg.pairwiserelprime", ["pairwise_relatively_prime", "mutually_relatively_prime", "relatively_prime"]],
  ["sec.gcd.proposition.pairwise-implies-mutual", ["pairwise_relatively_prime", "mutually_relatively_prime"]],
  ["sec.gcd.exercise.01", ["greatest_common_divisor", "common_divisor"]],
  ["sec.gcd.exercise.02", ["greatest_common_divisor", "common_divisor"]],
  ["sec.gcd.exercise.03", ["greatest_common_divisor", "common_divisor"]],
  ["sec.gcd.exercise.04", ["greatest_common_divisor", "relatively_prime"]],
  ["sec.gcd.exercise.05", ["greatest_common_divisor"]],
  ["sec.gcd.exercise.06", ["greatest_common_divisor", "relatively_prime", "addition", "subtraction"]],
  ["sec.gcd.exercise.07", ["relatively_prime", "greatest_common_divisor", "linear_combination"]],
  ["sec.gcd.exercise.08", ["greatest_common_divisor", "relatively_prime", "addition", "multiplication"]],
  ["sec.gcd.exercise.09", ["greatest_common_divisor", "common_divisor", "multiplication"]],
];
let boundary5MappingCount = 0;
for (const [suffix, concepts] of boundary5ConceptMappings) for (const code of concepts) {
  relation(unitId(suffix), "covers", conceptId(code));
  boundary5MappingCount += 1;
}
if (boundary5MappingCount !== 100) throw new Error(`expected 100 Boundary 5 concept mappings, observed ${boundary5MappingCount}`);
const boundary5PrerequisiteEdges = [
  ["divisibility", "common_divisor"],
  ["divisor", "common_divisor"],
  ["common_divisor", "greatest_common_divisor"],
  ["natural_number", "greatest_common_divisor"],
  ["greatest_common_divisor", "relatively_prime"],
  ["greatest_common_divisor", "mutually_relatively_prime"],
  ["relatively_prime", "mutually_relatively_prime"],
  ["greatest_common_divisor", "pairwise_relatively_prime"],
  ["relatively_prime", "pairwise_relatively_prime"],
];
for (const [subject, object] of boundary5PrerequisiteEdges) relation(conceptId(subject), "prerequisite_for", conceptId(object));
relation(boundary5EditionId, "translates", sourceEditionId);
relation(boundary5EditionId, "adapts", sourceEditionId);
for (const item of sourceEditionAssets.filter((item) => path.basename(item.path) !== "by-sa.eps")) relation(boundary5EditionId, "depends_on", assetId(path.basename(item.path)));
if (relationRecords.length !== 671) throw new Error(`expected 671 relations through Boundary 5, observed ${relationRecords.length}`);

// Boundary 6 is appended after the exact 0001–0671 admitted relation prefix.
for (const spec of boundary6UnitSpecs) relation(unitId(spec[2]), "contains", unitId(spec[0]));
relation(unitId("sec.gcd"), "precedes", unitId("sec.ea"));
for (const group of [
  [
    "sec.ea.discussion.01",
    "lem.gcdafterdivision",
    "sec.ea.discussion.02",
    "thm.euclideanalg",
    "sec.ea.note.extended-algorithm",
    "sec.ea.discussion.03",
    "eg.ea",
    "sec.ea.exercises",
  ],
  Array.from({ length: 6 }, (_, index) => `sec.ea.exercise.${String(index + 1).padStart(2, "0")}`),
]) for (let index = 0; index + 1 < group.length; index += 1) relation(unitId(group[index]), "precedes", unitId(group[index + 1]));
for (const [number,,,,,,, affectedSuffixes] of boundary6Corrections) {
  for (const suffix of affectedSuffixes) relation(correctionId(number), "corrects", unitId(suffix));
}
relation(unitId("lem.gcdafterdivision.proof"), "proves", unitId("lem.gcdafterdivision"));
relation(unitId("thm.euclideanalg.proof"), "proves", unitId("thm.euclideanalg"));
relation(unitId("eg.ea"), "illustrates", unitId("thm.euclideanalg"));
relation(unitId("lem.gcdafterdivision.proof"), "references", unitId("sec.gcd.theorem.invariance"));
relation(unitId("thm.euclideanalg.proof"), "references", unitId("lem.gcdafterdivision"));
relation(unitId("sec.ea.exercises"), "references", unitId("sec.ea"));

const boundary6ConceptMappings = [
  ["sec.ea", ["euclidean_algorithm", "extended_euclidean_algorithm", "greatest_common_divisor", "division_algorithm", "linear_combination"]],
  ["sec.ea.discussion.01", ["euclidean_algorithm", "greatest_common_divisor"]],
  ["lem.gcdafterdivision", ["greatest_common_divisor", "division_algorithm", "quotient", "remainder"]],
  ["lem.gcdafterdivision.proof", ["greatest_common_divisor", "addition", "multiplication"]],
  ["sec.ea.discussion.02", ["euclidean_algorithm", "greatest_common_divisor", "remainder", "division_algorithm"]],
  ["thm.euclideanalg", ["euclidean_algorithm", "extended_euclidean_algorithm", "division_algorithm", "quotient", "remainder", "greatest_common_divisor", "linear_combination", "natural_number"]],
  ["thm.euclideanalg.proof", ["euclidean_algorithm", "division_algorithm", "quotient", "remainder", "greatest_common_divisor", "natural_number", "integer", "well_ordering_principle"]],
  ["sec.ea.note.extended-algorithm", ["euclidean_algorithm", "extended_euclidean_algorithm", "linear_combination"]],
  ["sec.ea.discussion.03", ["extended_euclidean_algorithm", "greatest_common_divisor", "linear_combination"]],
  ["eg.ea", ["euclidean_algorithm", "greatest_common_divisor", "division_algorithm", "quotient", "remainder"]],
  ["sec.ea.exercise.01", ["euclidean_algorithm", "greatest_common_divisor", "linear_combination"]],
  ["sec.ea.exercise.02", ["euclidean_algorithm", "greatest_common_divisor", "linear_combination"]],
  ["sec.ea.exercise.03", ["greatest_common_divisor"]],
  ["sec.ea.exercise.04", ["greatest_common_divisor", "multiplication", "divisibility"]],
  ["sec.ea.exercise.05", ["greatest_common_divisor", "parity", "division"]],
  ["sec.ea.exercise.06", ["extended_euclidean_algorithm", "euclidean_algorithm", "linear_combination"]],
];
let boundary6MappingCount = 0;
for (const [suffix, concepts] of boundary6ConceptMappings) for (const code of concepts) {
  relation(unitId(suffix), "covers", conceptId(code));
  boundary6MappingCount += 1;
}
if (boundary6MappingCount !== 61) throw new Error(`expected 61 Boundary 6 concept mappings, observed ${boundary6MappingCount}`);
const boundary6PrerequisiteEdges = [
  ["greatest_common_divisor", "euclidean_algorithm"],
  ["division_algorithm", "euclidean_algorithm"],
  ["remainder", "euclidean_algorithm"],
  ["euclidean_algorithm", "extended_euclidean_algorithm"],
  ["linear_combination", "extended_euclidean_algorithm"],
];
for (const [subject, object] of boundary6PrerequisiteEdges) relation(conceptId(subject), "prerequisite_for", conceptId(object));
relation(boundary6EditionId, "translates", sourceEditionId);
relation(boundary6EditionId, "adapts", sourceEditionId);
for (const item of sourceEditionAssets.filter((item) => path.basename(item.path) !== "by-sa.eps")) relation(boundary6EditionId, "depends_on", assetId(path.basename(item.path)));
if (relationRecords.length !== 788) throw new Error(`expected 788 relations through Boundary 6, observed ${relationRecords.length}`);

// Boundary 7 is appended after the exact 0001–0788 admitted relation prefix.
for (const spec of boundary7UnitSpecs) relation(unitId(spec[2]), "contains", unitId(spec[0]));
relation(unitId("backmatter.bibliography"), "contains", unitId(boundary7BibliographySuffix));
relation(unitId("sec.ea"), "precedes", unitId("chap.cs"));
relation(unitId("chap.cs.discussion.01"), "precedes", unitId("sec.itc"));
for (const group of [
  [
    "sec.itc.discussion.01",
    "def.congruence",
    "eg.congruences",
    "sec.itc.discussion.02",
    "thm.basiccongprops",
    "sec.itc.discussion.03",
    "thm.combing",
    "eg.congarith",
    "sec.itc.discussion.04",
    "lem.euclids",
    "sec.itc.discussion.05",
    "thm.congcanc",
    "eg.solvcongs",
    "sec.itc.discussion.06",
    "thm.numzerosmodafactor",
    "sec.itc.exercises",
  ],
  Array.from({ length: 5 }, (_, index) => `sec.itc.exercise.${String(index + 1).padStart(2, "0")}`),
]) for (let index = 0; index + 1 < group.length; index += 1) relation(unitId(group[index]), "precedes", unitId(group[index + 1]));
relation(unitId("chap.cs.discussion.01"), "cites", unitId(boundary7BibliographySuffix));
for (const [number,,,,,,, affectedSuffixes] of boundary7Corrections) {
  for (const suffix of affectedSuffixes) relation(correctionId(number), "corrects", unitId(suffix));
}
for (const [proofSuffix, theoremSuffix] of [
  ["thm.basiccongprops.proof", "thm.basiccongprops"],
  ["thm.combing.proof", "thm.combing"],
  ["lem.euclids.proof", "lem.euclids"],
  ["thm.congcanc.proof", "thm.congcanc"],
  ["thm.numzerosmodafactor.proof", "thm.numzerosmodafactor"],
]) relation(unitId(proofSuffix), "proves", unitId(theoremSuffix));
for (const [exampleSuffix, subjectSuffix] of [
  ["eg.congruences", "def.congruence"],
  ["eg.congarith", "thm.basiccongprops"],
  ["eg.solvcongs", "thm.congcanc"],
]) relation(unitId(exampleSuffix), "illustrates", unitId(subjectSuffix));
for (const [subjectSuffix, objectSuffix] of [
  ["thm.combing.proof", "cor.intlincombrelprime"],
  ["lem.euclids.proof", "cor.intlincombrelprime"],
  ["thm.congcanc.proof", "thm.dividebygcd"],
  ["thm.congcanc.proof", "lem.euclids"],
  ["thm.congcanc.proof", "thm.basiccongprops"],
  ["sec.itc.exercises", "sec.itc"],
]) relation(unitId(subjectSuffix), "references", unitId(objectSuffix));

const boundary7ConceptMappings = [
  ["chap.cs", ["congruence", "divisibility", "chinese_remainder_theorem", "congruence_class"]],
  ["chap.cs.discussion.01", ["congruence", "divisibility", "chinese_remainder_theorem"]],
  ["sec.itc", ["congruence", "modulo", "congruence_class", "divisibility", "euclids_lemma"]],
  ["sec.itc.discussion.01", ["congruence"]],
  ["def.congruence", ["congruence", "modulo", "divisibility", "integer", "natural_number"]],
  ["eg.congruences", ["congruence", "modulo", "parity"]],
  ["sec.itc.discussion.02", ["congruence"]],
  ["thm.basiccongprops", ["congruence", "modulo", "addition", "subtraction", "multiplication"]],
  ["thm.basiccongprops.proof", ["congruence", "divisibility", "addition", "subtraction", "multiplication", "integer"]],
  ["sec.itc.discussion.03", ["divisibility", "relatively_prime"]],
  ["thm.combing", ["divisibility", "relatively_prime", "multiplication"]],
  ["thm.combing.proof", ["divisibility", "relatively_prime", "linear_combination", "multiplication"]],
  ["eg.congarith", ["congruence", "modulo", "addition", "subtraction", "multiplication"]],
  ["sec.itc.discussion.04", ["euclids_lemma", "divisibility"]],
  ["lem.euclids", ["euclids_lemma", "divisibility", "greatest_common_divisor", "relatively_prime"]],
  ["lem.euclids.proof", ["euclids_lemma", "divisibility", "linear_combination", "multiplication"]],
  ["sec.itc.discussion.05", ["congruence", "division"]],
  ["thm.congcanc", ["congruence", "modulo", "greatest_common_divisor", "euclids_lemma", "division"]],
  ["thm.congcanc.proof", ["congruence", "divisibility", "greatest_common_divisor", "euclids_lemma", "division"]],
  ["eg.solvcongs", ["congruence", "modulo", "greatest_common_divisor"]],
  ["sec.itc.discussion.06", ["congruence_class"]],
  ["thm.numzerosmodafactor", ["congruence", "congruence_class", "modulo", "divisibility", "multiple"]],
  ["thm.numzerosmodafactor.proof", ["congruence", "congruence_class", "modulo", "division_algorithm", "remainder", "multiple"]],
  ["sec.itc.exercise.01", ["congruence", "modulo"]],
  ["sec.itc.exercise.02", ["congruence", "modulo", "parity", "multiplication"]],
  ["sec.itc.exercise.03", ["congruence", "modulo", "divisibility"]],
  ["sec.itc.exercise.04", ["congruence", "modulo", "finite_sum", "addition"]],
  ["sec.itc.exercise.05", ["congruence", "modulo", "finite_sum", "addition"]],
];
let boundary7MappingCount = 0;
for (const [suffix, concepts] of boundary7ConceptMappings) for (const code of concepts) {
  relation(unitId(suffix), "covers", conceptId(code));
  boundary7MappingCount += 1;
}
if (boundary7MappingCount !== 101) throw new Error(`expected 101 Boundary 7 concept mappings, observed ${boundary7MappingCount}`);
const boundary7PrerequisiteEdges = [
  ["divisibility", "congruence"],
  ["integer", "congruence"],
  ["congruence", "modulo"],
  ["natural_number", "modulo"],
  ["congruence", "congruence_class"],
  ["modulo", "congruence_class"],
  ["congruence", "chinese_remainder_theorem"],
  ["modulo", "chinese_remainder_theorem"],
  ["pairwise_relatively_prime", "chinese_remainder_theorem"],
  ["divisibility", "euclids_lemma"],
  ["greatest_common_divisor", "euclids_lemma"],
  ["relatively_prime", "euclids_lemma"],
];
for (const [subject, object] of boundary7PrerequisiteEdges) relation(conceptId(subject), "prerequisite_for", conceptId(object));
relation(boundary7EditionId, "translates", sourceEditionId);
relation(boundary7EditionId, "adapts", sourceEditionId);
for (const item of sourceEditionAssets.filter((item) => path.basename(item.path) !== "by-sa.eps")) relation(boundary7EditionId, "depends_on", assetId(path.basename(item.path)));
if (relationRecords.length !== 986) throw new Error(`expected 986 relations through Boundary 7, observed ${relationRecords.length}`);

// Boundary 8 is appended after the exact 0001–0986 admitted relation prefix.
for (const spec of boundary8UnitSpecs) relation(unitId(spec[2]), "contains", unitId(spec[0]));
relation(unitId("sec.itc"), "precedes", unitId("sec.lc"));
for (const group of [
  [
    "sec.lc.discussion.01",
    "def.linearcongruence",
    "sec.lc.discussion.02",
    "thm.linearcongruencesameclass",
    "sec.lc.discussion.03",
    "def.diophantine",
    "sec.lc.discussion.04",
    "thm.basiclincongs",
    "rem.uniqsolnlincong",
    "eg.multiplesolscongs",
    "sec.lc.discussion.05",
    "def.modularinverse",
    "sec.lc.discussion.06",
    "cor.modinv",
    "eg.modinverses",
    "sec.lc.exercises",
  ],
  Array.from({ length: 4 }, (_, index) => `sec.lc.exercise.${String(index + 1).padStart(2, "0")}`),
]) for (let index = 0; index + 1 < group.length; index += 1) relation(unitId(group[index]), "precedes", unitId(group[index + 1]));
for (const [number,,,,,,, affectedSuffixes] of boundary8Corrections) {
  for (const suffix of affectedSuffixes) relation(correctionId(number), "corrects", unitId(suffix));
}
relation(unitId("thm.basiclincongs.proof"), "proves", unitId("thm.basiclincongs"));
relation(unitId("eg.multiplesolscongs"), "illustrates", unitId("thm.basiclincongs"));
relation(unitId("eg.modinverses"), "illustrates", unitId("def.modularinverse"));
for (const [subjectSuffix, objectSuffix] of [
  ["thm.basiclincongs.proof", "thm.gcdislincomb"],
  ["thm.basiclincongs.proof", "thm.congcanc"],
  ["thm.basiclincongs.proof", "thm.numzerosmodafactor"],
  ["sec.lc.discussion.05", "rem.uniqsolnlincong"],
  ["sec.lc.discussion.06", "rem.uniqsolnlincong"],
  ["sec.lc.exercises", "sec.lc"],
]) relation(unitId(subjectSuffix), "references", unitId(objectSuffix));

const boundary8ConceptMappings = [
  ["sec.lc", ["linear_congruence", "congruence", "modulo", "greatest_common_divisor", "diophantine_equation", "modular_inverse", "congruence_class"]],
  ["sec.lc.discussion.01", ["congruence", "linear_congruence"]],
  ["def.linearcongruence", ["linear_congruence", "congruence", "integer", "natural_number"]],
  ["sec.lc.discussion.02", ["linear_congruence", "congruence_class"]],
  ["thm.linearcongruencesameclass", ["linear_congruence", "congruence", "modulo", "congruence_class"]],
  ["sec.lc.discussion.03", ["diophantine_equation", "linear_congruence"]],
  ["def.diophantine", ["diophantine_equation", "integer"]],
  ["sec.lc.discussion.04", ["linear_congruence", "diophantine_equation", "integer", "natural_number"]],
  ["thm.basiclincongs", ["linear_congruence", "greatest_common_divisor", "divisibility", "congruence_class", "modulo"]],
  ["thm.basiclincongs.proof", ["linear_congruence", "greatest_common_divisor", "divisibility", "congruence_class", "modulo", "linear_combination", "integer"]],
  ["rem.uniqsolnlincong", ["linear_congruence", "relatively_prime", "congruence_class"]],
  ["eg.multiplesolscongs", ["linear_congruence", "greatest_common_divisor", "congruence_class", "euclidean_algorithm"]],
  ["sec.lc.discussion.05", ["modular_inverse", "linear_congruence", "greatest_common_divisor", "relatively_prime"]],
  ["def.modularinverse", ["modular_inverse", "congruence", "modulo", "relatively_prime"]],
  ["sec.lc.discussion.06", ["modular_inverse", "linear_congruence", "congruence_class"]],
  ["cor.modinv", ["modular_inverse", "relatively_prime", "congruence_class"]],
  ["eg.modinverses", ["modular_inverse", "congruence", "modulo"]],
  ["sec.lc.exercises", ["linear_congruence", "modular_inverse"]],
  ["sec.lc.exercise.01", ["linear_congruence", "greatest_common_divisor", "congruence_class", "modulo"]],
  ["sec.lc.exercise.02", ["linear_congruence", "modulo", "congruence"]],
  ["sec.lc.exercise.03", ["modular_inverse", "modulo"]],
  ["sec.lc.exercise.04", ["modular_inverse", "multiplication", "congruence", "modulo"]],
];
let boundary8MappingCount = 0;
for (const [suffix, concepts] of boundary8ConceptMappings) for (const code of concepts) {
  relation(unitId(suffix), "covers", conceptId(code));
  boundary8MappingCount += 1;
}
if (boundary8MappingCount !== 78) throw new Error(`expected 78 Boundary 8 concept mappings, observed ${boundary8MappingCount}`);
const boundary8PrerequisiteEdges = [
  ["congruence", "linear_congruence"],
  ["integer", "linear_congruence"],
  ["natural_number", "linear_congruence"],
  ["integer", "diophantine_equation"],
  ["congruence", "modular_inverse"],
  ["modulo", "modular_inverse"],
  ["relatively_prime", "modular_inverse"],
];
for (const [subject, object] of boundary8PrerequisiteEdges) relation(conceptId(subject), "prerequisite_for", conceptId(object));
relation(boundary8EditionId, "translates", sourceEditionId);
relation(boundary8EditionId, "adapts", sourceEditionId);
for (const item of sourceEditionAssets.filter((item) => path.basename(item.path) !== "by-sa.eps")) relation(boundary8EditionId, "depends_on", assetId(path.basename(item.path)));
if (relationRecords.length !== 1142) throw new Error(`expected 1142 relations through Boundary 8, observed ${relationRecords.length}`);

// Boundary 9 is appended after the exact 0001–1142 Boundary 8 relation prefix.
for (const spec of boundary9UnitSpecs) relation(unitId(spec[2]), "contains", unitId(spec[0]));
relation(unitId("sec.lc"), "precedes", unitId("sec.crt"));
for (const group of [
  ["sec.crt.discussion.01", "thm.chinese-remainder", "eg.systemofcongs", "sec.crt.exercises"],
  Array.from({ length: 4 }, (_, index) => `sec.crt.exercise.${String(index + 1).padStart(2, "0")}`),
]) for (let index = 0; index + 1 < group.length; index += 1) relation(unitId(group[index]), "precedes", unitId(group[index + 1]));
for (const [number,,,,,,, affectedSuffixes] of boundary9Corrections) {
  for (const suffix of affectedSuffixes) relation(correctionId(number), "corrects", unitId(suffix));
}
relation(unitId("thm.chinese-remainder.proof"), "proves", unitId("thm.chinese-remainder"));
relation(unitId("eg.systemofcongs"), "illustrates", unitId("thm.chinese-remainder"));
for (const [subjectSuffix, objectSuffix] of [
  ["thm.chinese-remainder.proof", "cor.modinv"],
  ["thm.chinese-remainder.proof", "thm.combing"],
  ["sec.crt.exercises", "sec.crt"],
]) relation(unitId(subjectSuffix), "references", unitId(objectSuffix));

const boundary9ConceptMappings = [
  ["sec.crt", ["chinese_remainder_theorem", "system_of_congruences", "congruence", "modulo", "pairwise_relatively_prime", "modular_inverse"]],
  ["sec.crt.discussion.01", ["system_of_congruences", "congruence", "modulo", "chinese_remainder_theorem"]],
  ["thm.chinese-remainder", ["chinese_remainder_theorem", "system_of_congruences", "congruence", "modulo", "pairwise_relatively_prime", "congruence_class", "multiplication"]],
  ["thm.chinese-remainder.proof", ["chinese_remainder_theorem", "system_of_congruences", "modulo", "pairwise_relatively_prime", "relatively_prime", "greatest_common_divisor", "modular_inverse", "divisibility", "multiplication", "mathematical_induction"]],
  ["eg.systemofcongs", ["chinese_remainder_theorem", "system_of_congruences", "modulo", "modular_inverse", "multiplication"]],
  ["sec.crt.exercises", ["chinese_remainder_theorem", "system_of_congruences"]],
  ["sec.crt.exercise.01", ["chinese_remainder_theorem", "system_of_congruences", "modulo", "divisibility"]],
  ["sec.crt.exercise.02", ["chinese_remainder_theorem", "system_of_congruences", "modulo"]],
  ["sec.crt.exercise.03", ["chinese_remainder_theorem", "system_of_congruences", "modulo"]],
  ["sec.crt.exercise.04", ["chinese_remainder_theorem", "system_of_congruences", "modulo", "divisibility"]],
];
let boundary9MappingCount = 0;
for (const [suffix, concepts] of boundary9ConceptMappings) for (const code of concepts) {
  relation(unitId(suffix), "covers", conceptId(code));
  boundary9MappingCount += 1;
}
if (boundary9MappingCount !== 48) throw new Error(`expected 48 Boundary 9 concept mappings, observed ${boundary9MappingCount}`);
const boundary9PrerequisiteEdges = [
  ["congruence", "system_of_congruences"],
  ["modulo", "system_of_congruences"],
];
for (const [subject, object] of boundary9PrerequisiteEdges) relation(conceptId(subject), "prerequisite_for", conceptId(object));
relation(unitId("eg.systemofcongs"), "illustrates", conceptId("system_of_congruences"));
relation(boundary9EditionId, "translates", sourceEditionId);
relation(boundary9EditionId, "adapts", sourceEditionId);
for (const item of sourceEditionAssets.filter((item) => path.basename(item.path) !== "by-sa.eps")) relation(boundary9EditionId, "depends_on", assetId(path.basename(item.path)));
if (relationRecords.length !== 1229) throw new Error(`expected 1229 relations through Boundary 9, observed ${relationRecords.length}`);

// Boundary 10 is appended after the exact 0001–1229 admitted Boundary 9 relation prefix.
for (const spec of boundary10UnitSpecs) relation(unitId(spec[2]), "contains", unitId(spec[0]));
relation(unitId("sec.crt"), "precedes", unitId("sec.awtwwc"));
for (const group of [
  [
    "sec.awtwwc.discussion.01",
    "def.equivalence-relation",
    "thm.equivalence-classes-disjoint-or-equal",
    "eg.rationals",
    "sec.awtwwc.discussion.02",
    "prop.congruence-equivalence-relation",
    "def.integers-mod-n",
    "thm.integers-mod-n-representatives",
    "sec.awtwwc.discussion.03",
    "def.congruence-class-operations",
    "thm.plustimeswelldefined",
    "sec.awtwwc.discussion.04",
    "thm.plustimesproperties",
    "sec.awtwwc.discussion.05",
    "thm.linear-congruence-classes",
    "sec.awtwwc.exercises",
  ],
  Array.from({ length: 4 }, (_, index) => `sec.awtwwc.exercise.${String(index + 1).padStart(2, "0")}`),
]) for (let index = 0; index + 1 < group.length; index += 1) relation(unitId(group[index]), "precedes", unitId(group[index + 1]));
for (const [number,,,,,,, affectedSuffixes] of boundary10Corrections) {
  for (const suffix of affectedSuffixes) relation(correctionId(number), "corrects", unitId(suffix));
}
for (const [proofSuffix, theoremSuffix] of [
  ["thm.equivalence-classes-disjoint-or-equal.proof", "thm.equivalence-classes-disjoint-or-equal"],
  ["thm.integers-mod-n-representatives.proof", "thm.integers-mod-n-representatives"],
  ["thm.plustimeswelldefined.proof", "thm.plustimeswelldefined"],
  ["thm.plustimesproperties.proof", "thm.plustimesproperties"],
  ["thm.linear-congruence-classes.proof", "thm.linear-congruence-classes"],
]) relation(unitId(proofSuffix), "proves", unitId(theoremSuffix));
for (const [exampleSuffix, subjectSuffix] of [
  ["eg.rationals", "def.equivalence-relation"],
  ["prop.congruence-equivalence-relation", "def.equivalence-relation"],
]) relation(unitId(exampleSuffix), "illustrates", unitId(subjectSuffix));
for (const [subjectSuffix, objectSuffix] of [
  ["thm.plustimeswelldefined.proof", "thm.basiccongprops"],
  ["thm.plustimesproperties.proof", "cor.modinv"],
  ["sec.awtwwc.discussion.05", "cor.modinv"],
  ["thm.linear-congruence-classes.proof", "thm.basiclincongs"],
  ["sec.awtwwc.exercises", "sec.awtwwc"],
  ["sec.awtwwc.exercise.01", "eg.rationals"],
  ["sec.awtwwc.exercise.01", "thm.plustimeswelldefined"],
  ["sec.awtwwc.exercise.04", "sec.itc"],
  ["sec.awtwwc.exercise.04", "sec.lc"],
]) relation(unitId(subjectSuffix), "references", unitId(objectSuffix));

const boundary10ConceptMappings = [
  ["sec.awtwwc", ["equivalence_relation", "reflexivity", "symmetry", "transitivity", "equivalence_class", "class_representative", "integers_mod_n", "well_defined", "congruence", "congruence_class", "addition", "multiplication"]],
  ["sec.awtwwc.discussion.01", ["equivalence_relation"]],
  ["def.equivalence-relation", ["equivalence_relation", "reflexivity", "symmetry", "transitivity", "equivalence_class", "class_representative"]],
  ["thm.equivalence-classes-disjoint-or-equal", ["equivalence_relation", "equivalence_class"]],
  ["thm.equivalence-classes-disjoint-or-equal.proof", ["equivalence_relation", "reflexivity", "symmetry", "transitivity", "equivalence_class"]],
  ["eg.rationals", ["equivalence_relation", "equivalence_class", "class_representative"]],
  ["sec.awtwwc.discussion.02", ["congruence", "equivalence_relation", "congruence_class"]],
  ["prop.congruence-equivalence-relation", ["congruence", "equivalence_relation", "reflexivity", "symmetry", "transitivity"]],
  ["def.integers-mod-n", ["integers_mod_n", "congruence_class", "modulo", "class_representative"]],
  ["thm.integers-mod-n-representatives", ["integers_mod_n", "congruence_class", "class_representative", "modulo", "division_algorithm", "remainder"]],
  ["thm.integers-mod-n-representatives.proof", ["integers_mod_n", "congruence_class", "class_representative", "modulo", "division_algorithm", "remainder"]],
  ["sec.awtwwc.discussion.03", ["integers_mod_n", "addition", "multiplication"]],
  ["def.congruence-class-operations", ["integers_mod_n", "congruence_class", "addition", "multiplication", "well_defined", "binary_operation"]],
  ["thm.plustimeswelldefined", ["well_defined", "integers_mod_n", "equivalence_class", "addition", "multiplication", "congruence"]],
  ["thm.plustimeswelldefined.proof", ["well_defined", "integers_mod_n", "addition", "multiplication", "congruence"]],
  ["sec.awtwwc.discussion.04", ["addition", "multiplication", "integers_mod_n"]],
  ["thm.plustimesproperties", ["integers_mod_n", "addition", "multiplication", "commutativity", "associativity", "distributivity", "identity_element", "additive_inverse", "multiplicative_inverse", "greatest_common_divisor", "relatively_prime"]],
  ["thm.plustimesproperties.proof", ["integers_mod_n", "multiplicative_inverse", "modular_inverse", "relatively_prime"]],
  ["sec.awtwwc.discussion.05", ["integers_mod_n", "linear_congruence", "congruence_class"]],
  ["thm.linear-congruence-classes", ["integers_mod_n", "linear_congruence", "greatest_common_divisor", "congruence_class", "division"]],
  ["thm.linear-congruence-classes.proof", ["integers_mod_n", "linear_congruence", "greatest_common_divisor", "congruence_class"]],
  ["sec.awtwwc.exercises", ["equivalence_relation", "equivalence_class", "integers_mod_n"]],
  ["sec.awtwwc.exercise.01", ["equivalence_class", "addition", "multiplication", "identity_element", "additive_inverse", "multiplicative_inverse", "well_defined"]],
  ["sec.awtwwc.exercise.02", ["chinese_remainder_theorem", "system_of_congruences", "congruence_class", "integers_mod_n"]],
  ["sec.awtwwc.exercise.03", ["equivalence_relation", "equivalence_class"]],
  ["sec.awtwwc.exercise.04", ["congruence", "congruence_class", "integers_mod_n", "linear_congruence"]],
];
let boundary10MappingCount = 0;
for (const [suffix, concepts] of boundary10ConceptMappings) for (const code of concepts) {
  relation(unitId(suffix), "covers", conceptId(code));
  boundary10MappingCount += 1;
}
if (boundary10MappingCount !== 123) throw new Error(`expected 123 Boundary 10 concept mappings, observed ${boundary10MappingCount}`);
const boundary10PrerequisiteEdges = [
  ["equivalence_relation", "reflexivity"],
  ["equivalence_relation", "symmetry"],
  ["equivalence_relation", "transitivity"],
  ["equivalence_relation", "equivalence_class"],
  ["equivalence_class", "class_representative"],
  ["congruence_class", "integers_mod_n"],
  ["modulo", "integers_mod_n"],
  ["equivalence_class", "well_defined"],
  ["binary_operation", "well_defined"],
];
for (const [subject, object] of boundary10PrerequisiteEdges) relation(conceptId(subject), "prerequisite_for", conceptId(object));
relation(boundary10EditionId, "translates", sourceEditionId);
relation(boundary10EditionId, "adapts", sourceEditionId);
for (const item of sourceEditionAssets.filter((item) => path.basename(item.path) !== "by-sa.eps")) relation(boundary10EditionId, "depends_on", assetId(path.basename(item.path)));
if (relationRecords.length !== 1440) throw new Error(`expected 1440 relations through Boundary 10, observed ${relationRecords.length}`);

// Boundary 11 is appended after the exact 0001–1440 admitted Boundary 10 relation prefix.
for (const spec of boundary11UnitSpecs) relation(unitId(spec[2]), "contains", unitId(spec[0]));
relation(unitId("sec.awtwwc"), "precedes", unitId("sec.ephif"));
for (const group of [
  ["sec.ephif.discussion.01", "def.euler-phi", "sec.ephif.discussion.02", "thm.euler-phi-counts-units", "sec.ephif.discussion.03", "thm.phiismultiplicative", "sec.ephif.exercises"],
  Array.from({ length: 2 }, (_, index) => `sec.ephif.exercise.${String(index + 1).padStart(2, "0")}`),
]) for (let index = 0; index + 1 < group.length; index += 1) relation(unitId(group[index]), "precedes", unitId(group[index + 1]));
for (const [number,,,,,,, affectedSuffixes] of boundary11Corrections) {
  for (const suffix of affectedSuffixes) relation(correctionId(number), "corrects", unitId(suffix));
}
relation(unitId("thm.euler-phi-counts-units.proof"), "proves", unitId("thm.euler-phi-counts-units"));
relation(unitId("thm.phiismultiplicative.proof"), "proves", unitId("thm.phiismultiplicative"));
relation(unitId("thm.phiismultiplicative"), "illustrates", conceptId("multiplicative_function"));
relation(unitId("thm.euler-phi-counts-units.proof"), "references", unitId("thm.plustimesproperties"));
relation(unitId("sec.ephif.exercises"), "references", unitId("sec.ephif"));

const boundary11ConceptMappings = [
  ["sec.ephif", ["euler_phi_function", "euler_totient_function", "cardinality", "unit_group", "multiplicative_function", "relatively_prime", "chinese_remainder_theorem"]],
  ["sec.ephif.discussion.01", ["euler_phi_function", "relatively_prime"]],
  ["def.euler-phi", ["euler_phi_function", "euler_totient_function", "cardinality", "relatively_prime", "natural_number"]],
  ["sec.ephif.discussion.02", ["euler_phi_function", "unit_group", "integers_mod_n", "modular_inverse"]],
  ["thm.euler-phi-counts-units", ["euler_phi_function", "unit_group", "integers_mod_n", "multiplicative_inverse"]],
  ["thm.euler-phi-counts-units.proof", ["euler_phi_function", "unit_group", "modular_inverse"]],
  ["sec.ephif.discussion.03", ["euler_phi_function", "multiplicative_function", "relatively_prime"]],
  ["thm.phiismultiplicative", ["euler_phi_function", "multiplicative_function", "relatively_prime", "multiplication"]],
  ["thm.phiismultiplicative.proof", ["euler_phi_function", "multiplicative_function", "cardinality", "cartesian_product", "injective", "surjective", "bijective", "unit_group", "chinese_remainder_theorem", "system_of_congruences", "integers_mod_n", "modular_inverse", "relatively_prime", "multiplication"]],
  ["sec.ephif.exercises", ["euler_phi_function"]],
  ["sec.ephif.exercise.01", ["euler_phi_function", "natural_number"]],
  ["sec.ephif.exercise.02", ["euler_phi_function", "natural_number", "multiplication"]],
];
let boundary11MappingCount = 0;
for (const [suffix, concepts] of boundary11ConceptMappings) for (const code of concepts) {
  relation(unitId(suffix), "covers", conceptId(code));
  boundary11MappingCount += 1;
}
if (boundary11MappingCount !== 52) throw new Error(`expected 52 Boundary 11 concept mappings, observed ${boundary11MappingCount}`);
const boundary11PrerequisiteEdges = [
  ["relatively_prime", "euler_phi_function"],
  ["natural_number", "euler_phi_function"],
  ["euler_phi_function", "euler_totient_function"],
  ["injective", "bijective"],
  ["surjective", "bijective"],
  ["integers_mod_n", "unit_group"],
  ["modular_inverse", "unit_group"],
  ["euler_phi_function", "multiplicative_function"],
  ["relatively_prime", "multiplicative_function"],
  ["multiplication", "multiplicative_function"],
];
for (const [subject, object] of boundary11PrerequisiteEdges) relation(conceptId(subject), "prerequisite_for", conceptId(object));
relation(boundary11EditionId, "translates", sourceEditionId);
relation(boundary11EditionId, "adapts", sourceEditionId);
for (const item of sourceEditionAssets.filter((item) => path.basename(item.path) !== "by-sa.eps")) relation(boundary11EditionId, "depends_on", assetId(path.basename(item.path)));
if (relationRecords.length !== 1544) throw new Error(`expected 1544 relations through Boundary 11, observed ${relationRecords.length}`);
const expectedPredicateCounts = { adapts: 9, cites: 4, contains: 250, corrects: 53, covers: 733, depends_on: 112, illustrates: 23, precedes: 180, prerequisite_for: 100, proves: 26, references: 42, source_uses_asset: 1, translates: 9, uses_asset: 2 };
const predicateCounts = {};
for (const item of relationRecords) predicateCounts[item.predicate] = (predicateCounts[item.predicate] ?? 0) + 1;
if (stableJson(predicateCounts) !== stableJson(expectedPredicateCounts)) throw new Error(`relation predicate count mismatch: ${stableJson(predicateCounts)}`);
records.push(...relationRecords);

const rank = new Map(["program", "course", "resource", "edition", "unit", "concept", "segment", "term", "asset", "relation", "rights", "qa_event", "artifact", "correction"].map((name, index) => [name, index]));
records.sort((a, b) => rank.get(a.entity_class) - rank.get(b.entity_class) || String(a.order_key ?? a.record_id).localeCompare(String(b.order_key ?? b.record_id), "en") || a.record_id.localeCompare(b.record_id, "en"));

const boundary4RecordIds = new Set([
  boundary4EditionId,
  ...boundary4UnitSpecs.map((spec) => unitId(spec[0])),
  ...boundary4ConceptSpecs.map((spec) => conceptId(spec[0])),
  ...Array.from({ length: 14 }, (_, index) => `ttp.r014.segment.${String(index + 83).padStart(3, "0")}`),
  ...Array.from({ length: 10 }, (_, index) => `ttp.r014.term.${String(index + 55).padStart(3, "0")}`),
  boundary4RightsId,
  fixedQaIds.roiidbTopology, fixedQaIds.roiidbMath, fixedQaIds.roiidbLanguage,
  fixedQaIds.build4, fixedQaIds.accessibility4, fixedQaIds.visual4, fixedQaIds.backend4,
  "ttp.r014.artifact.target-source.boundary4", "ttp.r014.artifact.boundary4-pdf", "ttp.r014.artifact.qa-bundle.boundary4",
  ...Array.from({ length: 3 }, (_, index) => correctionId(index + 16)),
  ...Array.from({ length: 115 }, (_, index) => `ttp.r014.relation.${String(index + 355).padStart(4, "0")}`),
]);
const boundary5RecordIds = new Set([
  boundary5EditionId,
  ...boundary5UnitSpecs.map((spec) => unitId(spec[0])),
  ...boundary5ConceptSpecs.map((spec) => conceptId(spec[0])),
  ...Array.from({ length: 34 }, (_, index) => `ttp.r014.segment.${String(index + 97).padStart(3, "0")}`),
  ...Array.from({ length: 5 }, (_, index) => `ttp.r014.term.${String(index + 65).padStart(3, "0")}`),
  boundary5RightsId,
  fixedQaIds.gcdTopology, fixedQaIds.gcdMath, fixedQaIds.gcdLanguage,
  fixedQaIds.build5, fixedQaIds.accessibility5, fixedQaIds.visual5, fixedQaIds.backend5,
  "ttp.r014.artifact.target-source.boundary5", "ttp.r014.artifact.boundary5-pdf", "ttp.r014.artifact.qa-bundle.boundary5",
  ...Array.from({ length: 4 }, (_, index) => correctionId(index + 19)),
  ...Array.from({ length: 202 }, (_, index) => `ttp.r014.relation.${String(index + 470).padStart(4, "0")}`),
]);
if (boundary5RecordIds.size !== 296) throw new Error(`Boundary 5 append ID closure drift: ${boundary5RecordIds.size}`);
const boundary6RecordIds = new Set([
  boundary6EditionId,
  ...boundary6UnitSpecs.map((spec) => unitId(spec[0])),
  ...boundary6ConceptSpecs.map((spec) => conceptId(spec[0])),
  ...Array.from({ length: 17 }, (_, index) => `ttp.r014.segment.${String(index + 131).padStart(3, "0")}`),
  ...Array.from({ length: 2 }, (_, index) => `ttp.r014.term.${String(index + 70).padStart(3, "0")}`),
  boundary6RightsId,
  fixedQaIds.eaTopology, fixedQaIds.eaMath, fixedQaIds.eaLanguage,
  fixedQaIds.build6, fixedQaIds.accessibility6, fixedQaIds.visual6, fixedQaIds.backend6,
  "ttp.r014.artifact.target-source.boundary6", "ttp.r014.artifact.boundary6-pdf", "ttp.r014.artifact.qa-bundle.boundary6",
  correctionId(23),
  ...Array.from({ length: 117 }, (_, index) => `ttp.r014.relation.${String(index + 672).padStart(4, "0")}`),
]);
if (boundary6RecordIds.size !== 168) throw new Error(`Boundary 6 append ID closure drift: ${boundary6RecordIds.size}`);
const boundary7RecordIds = new Set([
  boundary7EditionId,
  ...boundary7UnitSpecs.map((spec) => unitId(spec[0])),
  unitId(boundary7BibliographySuffix),
  ...boundary7ConceptSpecs.map((spec) => conceptId(spec[0])),
  ...Array.from({ length: 29 }, (_, index) => `ttp.r014.segment.${String(index + 148).padStart(3, "0")}`),
  ...Array.from({ length: 5 }, (_, index) => `ttp.r014.term.${String(index + 72).padStart(3, "0")}`),
  boundary7RightsId,
  fixedQaIds.itcTopology, fixedQaIds.itcMath, fixedQaIds.itcLanguage,
  fixedQaIds.build7, fixedQaIds.accessibility7, fixedQaIds.visual7, fixedQaIds.backend7,
  "ttp.r014.artifact.target-source.boundary7", "ttp.r014.artifact.boundary7-pdf", "ttp.r014.artifact.qa-bundle.boundary7",
  ...Array.from({ length: 5 }, (_, index) => correctionId(index + 24)),
  ...Array.from({ length: 198 }, (_, index) => `ttp.r014.relation.${String(index + 789).padStart(4, "0")}`),
]);
if (boundary7RecordIds.size !== 284) throw new Error(`Boundary 7 append ID closure drift: ${boundary7RecordIds.size}`);
const boundary8RecordIds = new Set([
  boundary8EditionId,
  ...boundary8UnitSpecs.map((spec) => unitId(spec[0])),
  ...boundary8ConceptSpecs.map((spec) => conceptId(spec[0])),
  ...Array.from({ length: 22 }, (_, index) => `ttp.r014.segment.${String(index + 177).padStart(3, "0")}`),
  ...Array.from({ length: 3 }, (_, index) => `ttp.r014.term.${String(index + 77).padStart(3, "0")}`),
  boundary8RightsId,
  fixedQaIds.lcTopology, fixedQaIds.lcMath, fixedQaIds.lcLanguage,
  fixedQaIds.build8, fixedQaIds.accessibility8, fixedQaIds.visual8, fixedQaIds.backend8,
  "ttp.r014.artifact.target-source.boundary8", "ttp.r014.artifact.boundary8-pdf", "ttp.r014.artifact.qa-bundle.boundary8",
  ...Array.from({ length: 7 }, (_, index) => correctionId(index + 29)),
  ...Array.from({ length: 156 }, (_, index) => `ttp.r014.relation.${String(index + 987).padStart(4, "0")}`),
]);
if (boundary8RecordIds.size !== 225) throw new Error(`Boundary 8 append ID closure drift: ${boundary8RecordIds.size}`);
const boundary9RecordIds = new Set([
  boundary9EditionId,
  ...boundary9UnitSpecs.map((spec) => unitId(spec[0])),
  ...boundary9ConceptSpecs.map((spec) => conceptId(spec[0])),
  ...Array.from({ length: 10 }, (_, index) => `ttp.r014.segment.${String(index + 199).padStart(3, "0")}`),
  "ttp.r014.term.080",
  boundary9RightsId,
  fixedQaIds.crtTopology, fixedQaIds.crtMath, fixedQaIds.crtLanguage,
  fixedQaIds.build9, fixedQaIds.accessibility9, fixedQaIds.visual9, fixedQaIds.backend9,
  "ttp.r014.artifact.target-source.boundary9", "ttp.r014.artifact.boundary9-pdf", "ttp.r014.artifact.qa-bundle.boundary9",
  correctionId(36),
  ...Array.from({ length: 87 }, (_, index) => `ttp.r014.relation.${String(index + 1143).padStart(4, "0")}`),
]);
if (boundary9RecordIds.size !== 122) throw new Error(`Boundary 9 append ID closure drift: ${boundary9RecordIds.size}`);
const boundary10RecordIds = new Set([
  boundary10EditionId,
  ...boundary10UnitSpecs.map((spec) => unitId(spec[0])),
  ...boundary10ConceptSpecs.map((spec) => conceptId(spec[0])),
  ...Array.from({ length: 26 }, (_, index) => `ttp.r014.segment.${String(index + 209).padStart(3, "0")}`),
  ...Array.from({ length: 8 }, (_, index) => `ttp.r014.term.${String(index + 81).padStart(3, "0")}`),
  boundary10RightsId,
  fixedQaIds.awtwwcTopology, fixedQaIds.awtwwcMath, fixedQaIds.awtwwcLanguage,
  fixedQaIds.build10, fixedQaIds.accessibility10, fixedQaIds.visual10, fixedQaIds.backend10,
  "ttp.r014.artifact.target-source.boundary10", "ttp.r014.artifact.boundary10-pdf", "ttp.r014.artifact.qa-bundle.boundary10",
  ...Array.from({ length: 5 }, (_, index) => correctionId(index + 37)),
  ...Array.from({ length: 211 }, (_, index) => `ttp.r014.relation.${String(index + 1230).padStart(4, "0")}`),
]);
if (boundary10RecordIds.size !== 296) throw new Error(`Boundary 10 append ID closure drift: ${boundary10RecordIds.size}`);
const boundary11RecordIds = new Set([
  boundary11EditionId,
  ...boundary11UnitSpecs.map((spec) => unitId(spec[0])),
  ...boundary11ConceptSpecs.map((spec) => conceptId(spec[0])),
  ...Array.from({ length: 12 }, (_, index) => `ttp.r014.segment.${String(index + 235).padStart(3, "0")}`),
  ...Array.from({ length: 9 }, (_, index) => `ttp.r014.term.${String(index + 89).padStart(3, "0")}`),
  boundary11RightsId,
  fixedQaIds.ephifTopology, fixedQaIds.ephifMath, fixedQaIds.ephifLanguage,
  fixedQaIds.build11, fixedQaIds.accessibility11, fixedQaIds.visual11, fixedQaIds.backend11,
  "ttp.r014.artifact.target-source.boundary11", "ttp.r014.artifact.boundary11-pdf", "ttp.r014.artifact.qa-bundle.boundary11",
  ...Array.from({ length: 4 }, (_, index) => correctionId(index + 42)),
  ...Array.from({ length: 104 }, (_, index) => `ttp.r014.relation.${String(index + 1441).padStart(4, "0")}`),
]);
if (boundary11RecordIds.size !== 162) throw new Error(`Boundary 11 append ID closure drift: ${boundary11RecordIds.size}`);
const boundary10Records = records.filter((record) => !boundary11RecordIds.has(record.record_id));
if (boundary10Records.length !== 2255) throw new Error(`Boundary 10 preserved-record count drift: ${boundary10Records.length}`);
const boundary10IdHashRows = boundary10Records.map((record) => `${record.record_id}\t${sha256Bytes(Buffer.from(stableJson(record), "utf8"))}\n`).join("");
if (sha256Bytes(Buffer.from(boundary10IdHashRows, "utf8")) !== "2bb4a2fae0a05a5adb5421116272c3edd7b17f704a5bd13f86e8d0644aa1a4da") throw new Error("Boundary 10 record-object aggregate drift");
const boundary10RelationHashRows = relationRecords.slice(0, 1440).map((record) => `${record.record_id}\t${sha256Bytes(Buffer.from(stableJson(record), "utf8"))}\n`).join("");
if (sha256Bytes(Buffer.from(boundary10RelationHashRows, "utf8")) !== "4934b7681147d45f61864a542da70a56c88bb2c7b74299f8a443a4b183c4311b") throw new Error("Boundary 10 relation-object prefix drift");
const boundary10RecordsText = `${boundary10Records.map((record) => stableJson(record)).join("\n")}\n`;
if (Buffer.byteLength(boundary10RecordsText, "utf8") !== 2101915 || sha256Bytes(Buffer.from(boundary10RecordsText, "utf8")) !== "7b57210d0e23158db35360c66a1ba7fe2ca8f8be0d07dab71f69a2126ab052e7") throw new Error("Boundary 10 canonical records stream drift");
const boundary9Records = boundary10Records.filter((record) => !boundary10RecordIds.has(record.record_id));
if (boundary9Records.length !== 1959) throw new Error(`Boundary 9 preserved-record count drift: ${boundary9Records.length}`);
const boundary9IdHashRows = boundary9Records.map((record) => `${record.record_id}\t${sha256Bytes(Buffer.from(stableJson(record), "utf8"))}\n`).join("");
if (sha256Bytes(Buffer.from(boundary9IdHashRows, "utf8")) !== "89eda9535a6368ec8cde4006cc5c94d7fe03ae76e8fafff6453470cfcb1af219") throw new Error("Boundary 9 record-object aggregate drift");
const boundary9RelationHashRows = relationRecords.slice(0, 1229).map((record) => `${record.record_id}\t${sha256Bytes(Buffer.from(stableJson(record), "utf8"))}\n`).join("");
if (sha256Bytes(Buffer.from(boundary9RelationHashRows, "utf8")) !== "0889e94ab7c9a950cae20aae66ee0e2493a1e7a910c2cfabc67d28b54aa09698") throw new Error("Boundary 9 relation-object prefix drift");
const boundary9RecordsText = `${boundary9Records.map((record) => stableJson(record)).join("\n")}\n`;
if (Buffer.byteLength(boundary9RecordsText, "utf8") !== 1838702 || sha256Bytes(Buffer.from(boundary9RecordsText, "utf8")) !== "384ab084acbd62924966dae9e11b2bccb8220d9a33f5cdb7039106b2d3f93009") throw new Error("Boundary 9 canonical records stream drift");
const boundary11IdHashRows = records.map((record) => `${record.record_id}\t${sha256Bytes(Buffer.from(stableJson(record), "utf8"))}\n`).join("");
if (sha256Bytes(Buffer.from(boundary11IdHashRows, "utf8")) !== "a2e72798bbeaaded35cdebfb7314b228714f9e4a78b0e47fa80da211a8e2eadc") throw new Error("Boundary 11 record-object aggregate drift");
const boundary11RelationHashRows = relationRecords.map((record) => `${record.record_id}\t${sha256Bytes(Buffer.from(stableJson(record), "utf8"))}\n`).join("");
if (sha256Bytes(Buffer.from(boundary11RelationHashRows, "utf8")) !== "38b12ae84cde99ef0dcd3ee3e1739dbbaac1a2e6b54da0618fd57bcb984317f8") throw new Error("Boundary 11 relation-object aggregate drift");
const boundary8Records = boundary9Records.filter((record) => !boundary9RecordIds.has(record.record_id));
if (boundary8Records.length !== 1837) throw new Error(`Boundary 8 preserved-record count drift: ${boundary8Records.length}`);
const boundary8IdHashRows = boundary8Records.map((record) => `${record.record_id}\t${sha256Bytes(Buffer.from(stableJson(record), "utf8"))}\n`).join("");
if (sha256Bytes(Buffer.from(boundary8IdHashRows, "utf8")) !== "76cb2ac9ab6fd546dad8ea7f223ec601cf860bcd8bcefa8fd582295a8ed346cc") throw new Error("Boundary 8 record-object aggregate drift");
const boundary8RelationHashRows = relationRecords.slice(0, 1142).map((record) => `${record.record_id}\t${sha256Bytes(Buffer.from(stableJson(record), "utf8"))}\n`).join("");
if (sha256Bytes(Buffer.from(boundary8RelationHashRows, "utf8")) !== "f7a76421fc51f2abadb52fc6a863ff5553a0386075f60585c77026c52da40f64") throw new Error("Boundary 8 relation-object prefix drift");
const boundary7Records = boundary8Records.filter((record) => !boundary8RecordIds.has(record.record_id));
if (boundary7Records.length !== 1612) throw new Error(`Boundary 7 preserved-record count drift: ${boundary7Records.length}`);
const boundary7IdHashRows = boundary7Records.map((record) => `${record.record_id}\t${sha256Bytes(Buffer.from(stableJson(record), "utf8"))}\n`).join("");
if (sha256Bytes(Buffer.from(boundary7IdHashRows, "utf8")) !== "94291b3143ec48f796580b54db8d38f517a4fd9a71f17e4a597ae11d577b9669") throw new Error("Boundary 7 record-object aggregate drift");
const boundary7RelationHashRows = relationRecords.slice(0, 986).map((record) => `${record.record_id}\t${sha256Bytes(Buffer.from(stableJson(record), "utf8"))}\n`).join("");
if (sha256Bytes(Buffer.from(boundary7RelationHashRows, "utf8")) !== "d4a329c68ee4396b310573098de10a94abe982ee309c328414f4f4bdb2e89135") throw new Error("Boundary 7 relation-object prefix drift");
const boundary6Records = boundary7Records.filter((record) => !boundary7RecordIds.has(record.record_id));
if (boundary6Records.length !== 1328) throw new Error(`Boundary 6 preserved-record count drift: ${boundary6Records.length}`);
const boundary6IdHashRows = boundary6Records.map((record) => `${record.record_id}\t${sha256Bytes(Buffer.from(stableJson(record), "utf8"))}\n`).join("");
if (sha256Bytes(Buffer.from(boundary6IdHashRows, "utf8")) !== "806d81d1375698546946f541e531abfdbb0953d8274a0b8cfcd05a071820a8af") throw new Error("Boundary 6 record-object aggregate drift");
const boundary6RelationHashRows = relationRecords.slice(0, 788).map((record) => `${record.record_id}\t${sha256Bytes(Buffer.from(stableJson(record), "utf8"))}\n`).join("");
if (sha256Bytes(Buffer.from(boundary6RelationHashRows, "utf8")) !== "8cb429c1e59ea7a8008a9d204f1a235ad94e5b7634f5ea3c37a06aba4fee10a0") throw new Error("Boundary 6 relation-object prefix drift");
const boundary5Records = boundary6Records.filter((record) => !boundary6RecordIds.has(record.record_id));
if (boundary5Records.length !== 1160) throw new Error(`Boundary 5 preserved-record count drift: ${boundary5Records.length}`);
const boundary5IdHashRows = boundary5Records.map((record) => `${record.record_id}\t${sha256Bytes(Buffer.from(stableJson(record), "utf8"))}\n`).join("");
if (sha256Bytes(Buffer.from(boundary5IdHashRows, "utf8")) !== "7ffec6969d64d1318fc7dae96c8532577b01b29457d3d528cbf344643ec9356a") throw new Error("Boundary 5 record-object aggregate drift");
const boundary5RelationHashRows = relationRecords.slice(0, 671).map((record) => `${record.record_id}\t${sha256Bytes(Buffer.from(stableJson(record), "utf8"))}\n`).join("");
if (sha256Bytes(Buffer.from(boundary5RelationHashRows, "utf8")) !== "704fa520ad4e5dc8c9b9e245811bcd53c366b6bad6e2e2589ac432c43610c4ef") throw new Error("Boundary 5 relation-object prefix drift");
const boundary4Records = boundary5Records.filter((record) => !boundary5RecordIds.has(record.record_id));
if (boundary4Records.length !== 864) throw new Error(`Boundary 4 preserved-record count drift: ${boundary4Records.length}`);
const boundary4IdHashRows = boundary4Records.map((record) => `${record.record_id}\t${sha256Bytes(Buffer.from(stableJson(record), "utf8"))}\n`).join("");
if (sha256Bytes(Buffer.from(boundary4IdHashRows, "utf8")) !== "376bbb056d25afee324ed09dd2ec4f11c984469eec33ff124627c947db1c8f4a") throw new Error("Boundary 4 record-object aggregate drift");
const boundary4RelationHashRows = relationRecords.slice(0, 469).map((record) => `${record.record_id}\t${sha256Bytes(Buffer.from(stableJson(record), "utf8"))}\n`).join("");
if (sha256Bytes(Buffer.from(boundary4RelationHashRows, "utf8")) !== "02d46413bd446408cbd76716aa861be92c888b134f7ee1ec55c2345dc2cfa55e") throw new Error("Boundary 4 relation-object prefix drift");
const boundary3Records = boundary4Records.filter((record) => !boundary4RecordIds.has(record.record_id));
if (boundary3Records.length !== 687) throw new Error(`Boundary 3 preserved-record count drift: ${boundary3Records.length}`);
const boundary3IdHashRows = boundary3Records.map((record) => `${record.record_id}\t${sha256Bytes(Buffer.from(stableJson(record), "utf8"))}\n`).join("");
if (sha256Bytes(Buffer.from(boundary3IdHashRows, "utf8")) !== "ff2f10c069f53fb2409834c54ba2f87d9cc3c3febe83d6e9a243c4c5239e9c18") throw new Error("Boundary 3 record-object prefix drift");
const boundary3RelationHashRows = relationRecords.slice(0, 354).map((record) => `${record.record_id}\t${sha256Bytes(Buffer.from(stableJson(record), "utf8"))}\n`).join("");
if (sha256Bytes(Buffer.from(boundary3RelationHashRows, "utf8")) !== "d7e82d0a24102a500548da1ec39be44fccc560461d9d4a5e5e868b4e2b47fe4c") throw new Error("Boundary 3 relation-object prefix drift");

// Freeze the complete Boundary 11 public record surface before the additive
// full-edition extension runs.  The extension may only append new IDs; this
// byte/object gate makes any mutation of the 2,417 admitted records fatal.
const boundary11RecordsText = `${records.map((record) => stableJson(record)).join("\n")}\n`;
if (Buffer.byteLength(boundary11RecordsText, "utf8") !== 2247534 || sha256Bytes(Buffer.from(boundary11RecordsText, "utf8")) !== "3fe63938cec0aaeb8cc31ec4590af077377c758b3585cea4049b433542086a7c") throw new Error("Boundary 11 canonical records stream drift");
const fullExtension = extendFullBackend({
  root,
  records,
  relationRecords,
  segmentRecords,
  baseRecord,
  unitId,
  conceptId,
  correctionId,
  sha256Bytes,
  sha256File,
  stableJson,
  authorityBytes,
  authorityOffsets,
  authoritySha,
  sourceEditionId,
  boundary11EditionId,
});
records.sort((a, b) => rank.get(a.entity_class) - rank.get(b.entity_class) || String(a.order_key ?? a.record_id).localeCompare(String(b.order_key ?? b.record_id), "en") || a.record_id.localeCompare(b.record_id, "en"));
const boundary28r2RecordsText = `${records.map((record) => stableJson(record)).join("\n")}\n`;
if (Buffer.byteLength(boundary28r2RecordsText, "utf8") !== 5584334 || sha256Bytes(Buffer.from(boundary28r2RecordsText, "utf8")) !== "18764193b4579196c2b02549ff592da0f04e4c0c4194cf6da5294ff11bbb6fa7") throw new Error("Boundary 28-r2 admitted records stream drift before canonical reader admission");
const boundary28r2Records = [...records];
const boundary28r2IdHashRows = boundary28r2Records.map((record) => `${record.record_id}\t${sha256Bytes(Buffer.from(stableJson(record), "utf8"))}\n`).join("");
const canonicalAdmission = admitCanonicalReaderEvidence({
  root,
  records,
  relationRecords,
  baseRecord,
  sha256File,
  sourceEditionId,
});
records.sort((a, b) => rank.get(a.entity_class) - rank.get(b.entity_class) || String(a.order_key ?? a.record_id).localeCompare(String(b.order_key ?? b.record_id), "en") || a.record_id.localeCompare(b.record_id, "en"));

const ids = new Set();
for (const record of records) {
  if (!/^[a-z0-9][a-z0-9._:-]+$/.test(record.record_id)) throw new Error(`invalid record id ${record.record_id}`);
  if (ids.has(record.record_id)) throw new Error(`duplicate record id ${record.record_id}`);
  ids.add(record.record_id);
}
for (const record of records) {
  for (const key of ["parent_unit_id", "unit_id", "concept_id", "rights_id", "source_edition_id", "build_receipt_id", "supersedes"]) {
    if (record[key] && !ids.has(record[key])) throw new Error(`unresolved ${key}=${record[key]} in ${record.record_id}`);
  }
  for (const key of ["affected_unit_ids", "prerequisite_concept_ids", "witness_ids"]) {
    for (const value of record[key] ?? []) if (value.startsWith("ttp.") && !ids.has(value)) throw new Error(`unresolved ${key}=${value} in ${record.record_id}`);
  }
}
for (const record of relationRecords) {
  if (!ids.has(record.subject_id) || !ids.has(record.object_id)) throw new Error(`unresolved relation ${record.record_id}`);
}

const authorityLabels = [...authorityText.matchAll(/\\label\{([^{}]+)\}/g)].map((match) => match[1]);
const authorityRefs = [...authorityText.matchAll(/\\(?:ref|eqref)\{([^{}]+)\}/g)].map((match) => match[1]);
if (new Set(authorityLabels).size !== authorityLabels.length) throw new Error("duplicate authority label");
for (const ref of authorityRefs) if (!authorityLabels.includes(ref)) throw new Error(`unresolved authority ref ${ref}`);
const bibKeys = [...refsText.matchAll(/^@\w+\{([^,]+),/gm)].map((match) => match[1]);
const cites = [...authorityText.matchAll(/\\cite\{([^{}]+)\}/g)].flatMap((match) => match[1].split(",").map((item) => item.trim()));
for (const cite of cites) if (!bibKeys.includes(cite)) throw new Error(`unresolved citation ${cite}`);
const boundarySource = span(authorityBytes, authorityOffsets, 392, 586).text;
if ((boundarySource.match(/\\begin\{exercise\}/g) ?? []).length !== 7) throw new Error("boundary exercise count drift");
if (targetText.includes("\\includegraphics[width=3cm]{by-sa.eps}")) throw new Error("blocked badge remains active in target");
if (sha256File(path.join(root, "output", "YAINTT_ID_BOUNDARY1.pdf")) !== "2167be5bc46bc9319b46c972afa7a5e267161ab2ce78672d098174aab5236dcd") throw new Error("boundary PDF hash drift");
if (sha256File(path.join(root, "output", "YAINTT_ID_BOUNDARY2.pdf")) !== "777effae025dbd2cc183a72c9dbc0c70717543c4bcf07b6c35f4d4c079582f20") throw new Error("boundary2 PDF hash drift");
if (sha256File(path.join(root, "output", "YAINTT_ID_BOUNDARY3.pdf")) !== "18586dc3e7b73ac42c309d4752c5153ce8d0cc42cac44b0b7cf900707b014987") throw new Error("boundary3 PDF hash drift");
if (sha256File(path.join(root, "output", "YAINTT_ID_BOUNDARY4.pdf")) !== "e12c6e17814c061a93fabc3c8bb5bf70cae3710001595a21ff0f881f939caf0e") throw new Error("boundary4 PDF hash drift");
if (sha256File(path.join(root, "output", "YAINTT_ID_BOUNDARY5.pdf")) !== "df12be132095bcfc6eef9415207909ae1c34e32bb14b856da28b0cbf4733e544") throw new Error("boundary5 PDF hash drift");
if (sha256File(path.join(root, "output", "YAINTT_ID_BOUNDARY6.pdf")) !== "299391777d02eb8c75a6da6b41bd1df75038fa07462594f9a9f3a9918da6b40d") throw new Error("boundary6 PDF hash drift");
if (sha256File(path.join(root, "output", "YAINTT_ID_BOUNDARY7.pdf")) !== "2c306db723c86516872b5c583992fbcd839f5cf45f75b838da5043ecff0bc42f") throw new Error("boundary7 PDF hash drift");
if (sha256File(path.join(root, "output", "YAINTT_ID_BOUNDARY8.pdf")) !== "84cc7eecf22a464b0807f40c661e8513c1347ff766086803691cb5fa4888049a") throw new Error("boundary8 PDF hash drift");
if (sha256File(path.join(root, "output", "YAINTT_ID_BOUNDARY9.pdf")) !== "35efd46be5a8f9ec90e15c3000ca2caf7e82ba4dd76cfe4d47409a902b8532c0") throw new Error("boundary9 PDF hash drift");
if (sha256File(path.join(root, "output", "YAINTT_ID_BOUNDARY10.pdf")) !== "b2df908f800ffac7288460b83984a5983ba38f45ee1c97164bef53f27beb2b8d") throw new Error("boundary10 PDF hash drift");
if (sha256File(path.join(root, "output", "YAINTT_ID_BOUNDARY11.pdf")) !== "06fd57a4f86134af025d72f5792d8258a68fc792749f463bd8f4fa58a731b2c9") throw new Error("boundary11 PDF hash drift");
if (span(authorityBytes, authorityOffsets, 587, 645).sha256 !== "5630fe29de962e88fb91c717fe12f730c0bbc9423f494a8341efc068f1e7e523") throw new Error("Section 1.2 authority span drift");
if (span(targetBytes, targetOffsets, 650, 709).sha256 !== "5d3b95aba1a62dbcd78e72bc05dcf92d47e900ebfbaee788023b268038d15c98") throw new Error("Section 1.2 target span drift");
if (span(authorityBytes, authorityOffsets, 646, 828).sha256 !== "1422764765c74e06baf3f51bcd5c50e297e45708b9c26a91576ce41301708ef8") throw new Error("Section 1.3 authority span drift");
if (span(targetBytes, targetOffsets, 720, 911).sha256 !== "dc5f5637880f9bed91c72b59eeb7322de727419e7fc1aa4d1c679fc30ebd6227") throw new Error("Section 1.3 target span drift");
if ((span(authorityBytes, authorityOffsets, 646, 828).text.match(/\\begin\{exercise\}/g) ?? []).length !== 12) throw new Error("Section 1.3 exercise count drift");
if (span(authorityBytes, authorityOffsets, 829, 989).sha256 !== "d488ae0ca2e4b9b183ddd9f3bee06b2c4902e885d29e448ad3dfbc8fda70cd3b") throw new Error("Section 1.4 authority span drift");
if (span(boundary4TargetBytes, boundary4TargetOffsets, 926, 1084).sha256 !== "db81676cc5ce84598235772ede12a7947141b7431b8ba170d332a90461e17f83") throw new Error("Section 1.4 target span drift");
if ((span(authorityBytes, authorityOffsets, 829, 989).text.match(/\\begin\{exercise\}/g) ?? []).length !== 5) throw new Error("Section 1.4 exercise count drift");
if (span(authorityBytes, authorityOffsets, 990, 1218).sha256 !== "552e40ccbb96dac68c7f7968d69535db76ca71916aa40b07a41c753b8ebc8fc2") throw new Error("Section 1.5 authority span drift");
if (span(boundary5TargetBytes, boundary5TargetOffsets, 1099, 1342).sha256 !== "4cf74aa139ca2dbf5652328b72c83c42a3bb840d9538d82dafb5908762c1088e") throw new Error("Section 1.5 target span drift");
if ((span(authorityBytes, authorityOffsets, 990, 1218).text.match(/\\begin\{exercise\}/g) ?? []).length !== 9) throw new Error("Section 1.5 exercise count drift");
if (span(authorityBytes, authorityOffsets, 1219, 1325).sha256 !== "448636a4556d90d8353256f68774d5a452b214763ec97e1031c13e21dea2adb2") throw new Error("Section 1.6 authority span drift");
if (span(boundary6TargetBytes, boundary6TargetOffsets, 1357, 1463).sha256 !== "23906f780ff314563953e8783087995116a024f88d5bf3664766f34bd278fd69") throw new Error("Section 1.6 target span drift");
if ((span(authorityBytes, authorityOffsets, 1219, 1325).text.match(/\\begin\{exercise\}/g) ?? []).length !== 6) throw new Error("Section 1.6 exercise count drift");
if (span(authorityBytes, authorityOffsets, 1326, 1621).sha256 !== "5c37ac5d16ff7bd59afdff375ea9f993fd7c49457cf96870b36e903ef439f203") throw new Error("Chapter 2 introduction and Section 2.1 authority span drift");
if (span(boundary7TargetBytes, boundary7TargetOffsets, 1479, 1795).sha256 !== "ac9cf2ebdb2e50cd20b15b6974dd8ba3a95833eab7bf26a309fc12ff60e729e6") throw new Error("Chapter 2 introduction and Section 2.1 target span drift");
if ((span(authorityBytes, authorityOffsets, 1326, 1621).text.match(/\\begin\{exercise\}/g) ?? []).length !== 5) throw new Error("Section 2.1 exercise count drift");
if (span(authorityBytes, authorityOffsets, 1622, 1772).sha256 !== "d5b18941339395e28d5fcc7beb97d3e69b818051a963ee1146c697a83533be5d") throw new Error("Section 2.2 authority span drift");
if (span(boundary8TargetBytes, boundary8TargetOffsets, 1810, 1983).sha256 !== "f16f681203c7bbe6b87f474f6ea16773fafcb324e353245b37efc49691ea6bf1") throw new Error("Section 2.2 target span drift");
if ((span(authorityBytes, authorityOffsets, 1622, 1772).text.match(/\\begin\{exercise\}/g) ?? []).length !== 4) throw new Error("Section 2.2 exercise count drift");
if (span(authorityBytes, authorityOffsets, 1773, 1876).sha256 !== "0a6d6bf087b3b26ea9a15612264ab9fc7093e412a11780ad4a4b270d98bbdaa1") throw new Error("Section 2.3 authority span drift");
if (span(boundary9TargetBytes, boundary9TargetOffsets, 1998, 2103).sha256 !== "26ecffb75de9a6607eb13f765e4cfb4daadbcf1a8d25d4a329d45e02ad3c8151") throw new Error("Section 2.3 target span drift");
if ((span(authorityBytes, authorityOffsets, 1773, 1876).text.match(/\\begin\{exercise\}/g) ?? []).length !== 4) throw new Error("Section 2.3 exercise count drift");
if (span(authorityBytes, authorityOffsets, 1877, 2085).sha256 !== "4a4b07b6bc58a7c3dcb5077030dc2dcac5c7fb21f645bb7591d6d3e076bcd300") throw new Error("Section 2.4 authority span drift");
if (span(boundary10TargetBytes, boundary10TargetOffsets, 2114, 2333).sha256 !== "a2d6209be1ccdc2d6536574b6ef361d86eea78f8cd63a0d47d1cda2b1611e003") throw new Error("Section 2.4 target span drift");
if ((span(authorityBytes, authorityOffsets, 1877, 2085).text.match(/\\begin\{exercise\}/g) ?? []).length !== 4) throw new Error("Section 2.4 exercise count drift");
if (span(authorityBytes, authorityOffsets, 2086, 2210).sha256 !== "000cc0f9ca49e05eb11c2f10322c6c051114b4435eb6cc7f67abbc957cf447b0") throw new Error("Section 2.5 authority span drift");
if (span(boundary11TargetBytes, boundary11TargetOffsets, 2344, 2491).sha256 !== "abb0260f808eb59c018c389170cc4735a954a10d9b3311db324b50e85733783a") throw new Error("Section 2.5 target span drift");
if ((span(authorityBytes, authorityOffsets, 2086, 2210).text.match(/\\begin\{exercise\}/g) ?? []).length !== 2) throw new Error("Section 2.5 exercise count drift");

const boundary11ExpectedCounts = { program: 1, course: 1, resource: 1, edition: 10, unit: 250, concept: 84, segment: 246, term: 97, asset: 14, relation: 1544, rights: 14, qa_event: 78, artifact: 32, correction: 45 };
const expectedCounts = Object.fromEntries(Object.entries(boundary11ExpectedCounts).map(([entityClass, count]) => [entityClass, count + (fullExtension.additions[entityClass] ?? 0) + (canonicalAdmission.additions[entityClass] ?? 0)]));
const recordCounts = {};
for (const record of records) recordCounts[record.entity_class] = (recordCounts[record.entity_class] ?? 0) + 1;
if (stableJson(recordCounts) !== stableJson(expectedCounts)) throw new Error(`record count mismatch: ${stableJson(recordCounts)}`);

const catalog = {
  schema: "r014.backend.catalog",
  schema_version: "1.0.0",
  export_id: "r014.id-id.boundary28-final.20260822",
  generated_at: canonicalAdmission.createdAt,
  work_id: workId,
  authority_snapshot_id: sourceAuthority.snapshot_id,
  authority_sha256: authoritySha,
  target_sha256: canonicalAdmission.finalTargetSha256,
  record_counts: recordCounts,
  records,
};

const commonColumns = ["schema", "schema_version", "record_id", "entity_class", "status", "work_id", "resource_id", "edition_id", "locale", "created_at", "responsible_workflow", "supersedes"];
const classColumns = {
  program: ["program_code", "title", "curriculum_authority", "course_ids"],
  course: ["course_code", "title", "stage", "prerequisite_course_ids", "prerequisite_records", "scope", "outcome", "resource_ids", "curriculum_status"],
  resource: ["title", "subtitle", "authors", "authority_url", "source_format", "rights_id", "source_available_snapshot", "upstream_repository", "official_pdf_url"],
  edition: ["edition_kind", "source_snapshot_id", "source_edition_id", "file_ids", "translation_state", "declared_timestamp", "authority_manifest_path", "build_recipe", "translated_through", "next_cursor", "rights_id"],
  unit: ["unit_type", "parent_unit_id", "order", "order_key", "source_local_id", "title_en", "title_id", "source_locator", "source_content_sha256", "target_locator", "target_content_sha256", "translation_state", "rights_id", "ancestry", "path", "label_status", "assessment_closure", "target_disposition", "qa_event_ids"],
  concept: ["concept_code", "name_en", "name_id", "prerequisite_concept_ids", "taxonomy_path", "evidence"],
  segment: ["unit_id", "order", "order_key", "segment_kind", "expression_id", "expression_order", "expression_language", "expression_locale", "source_or_target", "text_latex", "content_sha256", "locator", "state", "source_expression_id", "target_expression_id", "provenance", "qa_event_ids"],
  term: ["order", "concept_id", "source_term", "target_term", "variants", "rejected_forms", "scope", "register", "evidence", "examples"],
  asset: ["path", "url", "role", "bytes", "sha256", "mime_type", "rights_id", "dependency_ids", "retrieved_utc", "server_last_modified", "target_variant", "target_disposition"],
  relation: ["subject_id", "predicate", "object_id", "relation_order", "evidence_locator", "confidence"],
  rights: ["component_paths", "license", "license_url", "attribution", "obligations", "rights_status", "change_notice", "non_endorsement", "evidence"],
  qa_event: ["qa_type", "result", "witness_ids", "evidence", "method", "event_timestamp"],
  artifact: ["path", "media_type", "bytes", "sha256", "toolchain", "build_receipt_id", "reproducible", "pages", "file_manifest"],
  correction: ["correction_type", "authority_locator", "source_text", "target_text", "rationale", "evidence", "upstream_report_disposition", "affected_unit_ids", "report_status"],
};

const exportData = new Map();
for (const entityClass of rank.keys()) {
  const headers = [...commonColumns, ...classColumns[entityClass]];
  let rows;
  if (entityClass === "segment") {
    rows = records.filter((record) => record.entity_class === "segment").flatMap((record) => record.expressions.map((expression, index) => ({
      ...record,
      expression_id: expression.expression_id,
      expression_order: index + 1,
      expression_language: expression.language,
      expression_locale: expression.locale,
      source_or_target: expression.source_or_target,
      text_latex: expression.text_latex,
      content_sha256: expression.content_sha256,
      locator: expression.source_or_target === "source" ? record.source_locator : record.target_locator,
      state: expression.state,
    })));
  } else rows = records.filter((record) => record.entity_class === entityClass);
  exportData.set(entityClass, { headers, rows });
}
const assessmentHeaders = ["exercise_unit_id", "parent_section_id", "order_key", "prompt_segment_id", "concept_ids", "hint_unit_ids", "answer_unit_ids", "solution_unit_ids", "closure_status"];
const boundary11AssessmentRows = [
  ["sec.wopami", 7, conceptMappings],
  ["sec.dada", 12, dadaConceptMappings],
  ["sec.roiidb", 5, boundary4ConceptMappings],
  ["sec.gcd", 9, boundary5ConceptMappings],
  ["sec.ea", 6, boundary6ConceptMappings],
  ["sec.itc", 5, boundary7ConceptMappings],
  ["sec.lc", 4, boundary8ConceptMappings],
  ["sec.crt", 4, boundary9ConceptMappings],
  ["sec.awtwwc", 4, boundary10ConceptMappings],
  ["sec.ephif", 2, boundary11ConceptMappings],
].flatMap(([sectionSuffix, count, mappings]) => Array.from({ length: count }, (_, index) => {
  const number = String(index + 1).padStart(2, "0");
  const unit = unitId(`${sectionSuffix}.exercise.${number}`);
  const prompt = segmentRecords.find((record) => record.unit_id === unit);
  const mapped = mappings.find(([suffix]) => unitId(suffix) === unit)?.[1] ?? [];
  if (!prompt) throw new Error(`missing assessment prompt segment for ${unit}`);
  return {
    exercise_unit_id: unit,
    parent_section_id: unitId(sectionSuffix),
    order_key: number,
    prompt_segment_id: prompt.record_id,
    concept_ids: mapped.map(conceptId),
    hint_unit_ids: [],
    answer_unit_ids: [],
    solution_unit_ids: [],
    closure_status: "source_has_none",
  };
}));
if (boundary11AssessmentRows.length !== 58) throw new Error(`expected 58 Boundary 11 assessments, observed ${boundary11AssessmentRows.length}`);
const assessmentRows = [...boundary11AssessmentRows, ...fullExtension.assessmentRows];
if (assessmentRows.length !== 101) throw new Error(`expected 101 complete-edition assessments, observed ${assessmentRows.length}`);
exportData.set("assessments", { headers: assessmentHeaders, rows: assessmentRows });

await fsp.mkdir(exportDir, { recursive: true });
await fsp.mkdir(evidenceDir, { recursive: true });
await fsp.mkdir(previewDir, { recursive: true });
await fsp.mkdir(handoffDir, { recursive: true });
const schemaDir = path.join(backendDir, "schemas");
await fsp.mkdir(schemaDir, { recursive: true });
for (const schemaName of ["catalog.schema.json", "record.schema.json"]) {
  const canonicalSchema = path.join(root, "backend", "schemas", schemaName);
  const destinationSchema = path.join(schemaDir, schemaName);
  if (path.resolve(canonicalSchema) !== path.resolve(destinationSchema)) await fsp.copyFile(canonicalSchema, destinationSchema);
}
for (const obsoletePreview of ["term-boundary2-tail.png", "segment-boundary2-tail.png", "relation-boundary2-tail.png"]) {
  await fsp.rm(path.join(previewDir, obsoletePreview), { force: true });
}
await fsp.writeFile(path.join(evidenceDir, "ADVERSE_LEDGER.md"), adverseLedgerBytes);
await fsp.writeFile(path.join(evidenceDir, "ADVERSE_LEDGER_BOUNDARY4.md"), boundary4LedgerBytes);
await fsp.writeFile(path.join(evidenceDir, "ADVERSE_LEDGER_BOUNDARY5.md"), boundary5LedgerBytes);
await fsp.writeFile(path.join(evidenceDir, "ADVERSE_LEDGER_BOUNDARY6.md"), boundary6LedgerBytes);
await fsp.writeFile(path.join(evidenceDir, "ADVERSE_LEDGER_BOUNDARY7.md"), boundary7LedgerBytes);
await fsp.writeFile(path.join(evidenceDir, "ADVERSE_LEDGER_BOUNDARY8.md"), boundary8LedgerBytes);
await fsp.writeFile(path.join(evidenceDir, "ADVERSE_LEDGER_BOUNDARY9.md"), boundary9LedgerBytes);
await fsp.writeFile(path.join(evidenceDir, "ADVERSE_LEDGER_BOUNDARY10.md"), boundary10LedgerBytes);
await fsp.writeFile(path.join(evidenceDir, "ADVERSE_LEDGER_BOUNDARY11.md"), boundary11LedgerBytes);
await fsp.writeFile(path.join(evidenceDir, "ADVERSE_LEDGER_FINAL_BOUNDARY28_R2.md"), fullExtension.finalLedgerBytes);
await fsp.writeFile(path.join(evidenceDir, "TERMINOLOGY_FINAL_BOUNDARY28_R2.md"), fullExtension.finalTerminologyBytes);
await fsp.writeFile(path.join(evidenceDir, "B11_RECORD_OBJECT_HASHES.tsv"), boundary11IdHashRows, "utf8");
await fsp.writeFile(path.join(evidenceDir, "BOUNDARY28_R2_RECORD_OBJECT_HASHES.tsv"), boundary28r2IdHashRows, "utf8");
const recordsText = `${records.map((record) => stableJson(record)).join("\n")}\n`;
const finalRecordsBuffer = Buffer.from(recordsText, "utf8");
if (finalRecordsBuffer.byteLength !== 5656786 || sha256Bytes(finalRecordsBuffer) !== "e2c4374c37fbc0d45c2d029b7b734b7774a78f5a66caeb66d19d1a7bb97509d0") {
  throw new Error(`Boundary 28-final canonical records stream drift: ${finalRecordsBuffer.byteLength}/${sha256Bytes(finalRecordsBuffer)}`);
}
await fsp.writeFile(path.join(backendDir, "records.jsonl"), recordsText, "utf8");
await fsp.writeFile(path.join(backendDir, "catalog.json"), `${stableJson(catalog, 2)}\n`, "utf8");

for (const [name, data] of exportData) {
  const output = csvText(data.headers, data.rows);
  const parsed = parseCsv(output);
  if (parsed.length !== data.rows.length + 1 || parsed[0].join("\u0000") !== data.headers.join("\u0000")) throw new Error(`CSV roundtrip failed for ${name}`);
  for (let rowIndex = 0; rowIndex < data.rows.length; rowIndex += 1) {
    const expected = data.headers.map((header) => {
      const value = data.rows[rowIndex][header];
      if (value === null || value === undefined) return "";
      if (Array.isArray(value) || typeof value === "object") return stableJson(value);
      if (typeof value === "boolean") return value ? "true" : "false";
      return String(value);
    });
    if (parsed[rowIndex + 1].join("\u0000") !== expected.join("\u0000")) throw new Error(`CSV cell roundtrip failed for ${name} row ${rowIndex + 2}`);
  }
  await fsp.writeFile(path.join(exportDir, `${name}.csv`), output, "utf8");
}

const workbook = Workbook.create();
for (const [name, data] of exportData) {
  const sheet = workbook.worksheets.add(name);
  const matrix = [data.headers, ...data.rows.map((row) => data.headers.map((header) => {
    const value = row[header];
    if (value === null || value === undefined) return "";
    if (Array.isArray(value) || typeof value === "object") return stableJson(value);
    return value;
  }))];
  const used = sheet.getRangeByIndexes(0, 0, matrix.length, data.headers.length);
  used.format.numberFormat = matrix.map((row) => row.map((value) => {
    if (typeof value === "number") return "0";
    if (typeof value === "boolean") return "General";
    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(value)) return 'yyyy-mm-dd hh:mm:ss "UTC"';
    return "@";
  }));
  used.values = matrix;
  used.format.font = { name: "Aptos", size: 9, color: "#172033" };
  used.format.verticalAlignment = "top";
  used.format.wrapText = true;
  used.format.borders = { preset: "all", style: "thin", color: "#DCE3ED" };
  const header = sheet.getRangeByIndexes(0, 0, 1, data.headers.length);
  header.format.fill = "#17365D";
  header.format.font = { name: "Aptos Display", size: 10, bold: true, color: "#FFFFFF" };
  header.format.rowHeight = 30;
  const firstColumns = sheet.getRangeByIndexes(0, 0, matrix.length, Math.min(4, data.headers.length));
  firstColumns.format.columnWidth = 24;
  if (data.headers.length > 4) sheet.getRangeByIndexes(0, 4, matrix.length, data.headers.length - 4).format.columnWidth = 32;
  sheet.freezePanes.freezeRows(1);
  sheet.showGridLines = false;
}

const sheetInspection = await workbook.inspect({ kind: "sheet", include: "id,name", maxChars: 6000 });
if (!sheetInspection || exportData.size !== 15) throw new Error("workbook sheet inspection failed");
await fsp.rm(path.join(exportDir, "R014_MODULAR_BACKEND.xlsx.inspect.ndjson"), { force: true });
for (const [name, data] of exportData) {
  const rowsToRender = Math.min(data.rows.length + 1, 25);
  const colsToRender = Math.min(data.headers.length, 8);
  const preview = await workbook.render({
    sheetName: name,
    range: `A1:${excelColumn(colsToRender)}${rowsToRender}`,
    scale: 1,
    format: "png",
  });
  await fsp.writeFile(path.join(previewDir, `${name}.png`), new Uint8Array(await preview.arrayBuffer()));
}
for (const [name, range, outputName] of [
  ["term", "M47:T55", "term-boundary3-tail.png"],
  ["segment", "M135:T164", "segment-boundary3-tail.png"],
  ["relation", "M326:S355", "relation-boundary3-tail.png"],
  ["term", "M56:T65", "term-boundary4-tail.png"],
  ["segment", "M165:T192", "segment-boundary4-tail.png"],
  ["relation", "M441:S470", "relation-boundary4-tail.png"],
  ["term", "M66:T70", "term-boundary5-tail.png"],
  ["segment", "M193:T226", "segment-boundary5-head.png"],
  ["segment", "M227:T260", "segment-boundary5-tail.png"],
  ["relation", "M643:S672", "relation-boundary5-tail.png"],
  ["assessments", "A26:I34", "assessments-boundary5-tail.png"],
  ["qa_event", "M20:R32", "qa-event-boundary5.png"],
  ["term", "M70:T72", "term-boundary6-tail.png"],
  ["segment", "M261:T278", "segment-boundary6-head.png"],
  ["segment", "M279:T294", "segment-boundary6-tail.png"],
  ["relation", "M760:S789", "relation-boundary6-tail.png"],
  ["assessments", "A34:I40", "assessments-boundary6-tail.png"],
  ["qa_event", "M20:R38", "qa-event-boundary6.png"],
  ["term", "M72:T77", "term-boundary7-tail.png"],
  ["segment", "M295:T324", "segment-boundary7-head.png"],
  ["segment", "M325:T352", "segment-boundary7-tail.png"],
  ["relation", "M956:S985", "relation-boundary7-tail.png"],
  ["assessments", "A40:I45", "assessments-boundary7-tail.png"],
  ["qa_event", "M20:R45", "qa-event-boundary7.png"],
  ["term", "M78:T80", "term-boundary8-tail.png"],
  ["segment", "M353:T374", "segment-boundary8-head.png"],
  ["segment", "M375:T396", "segment-boundary8-tail.png"],
  ["relation", "M1114:S1143", "relation-boundary8-tail.png"],
  ["assessments", "A46:I49", "assessments-boundary8-tail.png"],
  ["qa_event", "M20:R52", "qa-event-boundary8.png"],
  ["term", "M80:T81", "term-boundary9-tail.png"],
  ["segment", "M397:T416", "segment-boundary9-tail.png"],
  ["relation", "M1201:S1230", "relation-boundary9-tail.png"],
  ["assessments", "A50:I53", "assessments-boundary9-tail.png"],
  ["qa_event", "M20:R59", "qa-event-boundary9.png"],
  ["term", "M82:T89", "term-boundary10-tail.png"],
  ["segment", "M417:T442", "segment-boundary10-head.png"],
  ["segment", "M443:T468", "segment-boundary10-tail.png"],
  ["relation", "M1412:S1441", "relation-boundary10-tail.png"],
  ["assessments", "A54:I57", "assessments-boundary10-tail.png"],
  ["qa_event", "M45:R72", "qa-event-boundary10.png"],
  ["term", "M90:T98", "term-boundary11-tail.png"],
  ["segment", "M469:T492", "segment-boundary11-tail.png"],
  ["relation", "M1516:S1545", "relation-boundary11-tail.png"],
  ["assessments", "A58:I59", "assessments-boundary11-tail.png"],
  ["qa_event", "M52:R79", "qa-event-boundary11.png"],
]) {
  const preview = await workbook.render({ sheetName: name, range, scale: 1, format: "png" });
  await fsp.writeFile(path.join(previewDir, outputName), new Uint8Array(await preview.arrayBuffer()));
}
for (const name of ["edition", "unit", "concept", "segment", "term", "relation", "qa_event", "artifact", "correction", "assessments"]) {
  const data = exportData.get(name);
  const endRow = data.rows.length + 1;
  const startRow = Math.max(2, endRow - 23);
  const endColumn = excelColumn(Math.min(data.headers.length, 8));
  const preview = await workbook.render({ sheetName: name, range: `A${startRow}:${endColumn}${endRow}`, scale: 1, format: "png" });
  await fsp.writeFile(path.join(previewDir, `${name}-final-tail.png`), new Uint8Array(await preview.arrayBuffer()));
}

const workbookBlob = await SpreadsheetFile.exportXlsx(workbook);
const laneWorkbook = path.join(exportDir, "R014_MODULAR_BACKEND.xlsx");
const handoffWorkbook = path.join(handoffDir, "R014_MODULAR_BACKEND.xlsx");
await workbookBlob.save(laneWorkbook);
await normalizeXlsxDeterministic(laneWorkbook);
await fsp.copyFile(laneWorkbook, handoffWorkbook);
await fsp.rm(path.join(exportDir, "R014_MODULAR_BACKEND.xlsx.inspect.ndjson"), { force: true });

const manifestCandidates = [
  "catalog.json",
  "records.jsonl",
  "schemas/catalog.schema.json",
  "schemas/record.schema.json",
  "evidence/ADVERSE_LEDGER.md",
  "evidence/ADVERSE_LEDGER_BOUNDARY4.md",
  "evidence/ADVERSE_LEDGER_BOUNDARY5.md",
  "evidence/ADVERSE_LEDGER_BOUNDARY6.md",
  "evidence/ADVERSE_LEDGER_BOUNDARY7.md",
  "evidence/ADVERSE_LEDGER_BOUNDARY8.md",
  "evidence/ADVERSE_LEDGER_BOUNDARY9.md",
  "evidence/ADVERSE_LEDGER_BOUNDARY10.md",
  "evidence/ADVERSE_LEDGER_BOUNDARY11.md",
  "evidence/ADVERSE_LEDGER_FINAL_BOUNDARY28_R2.md",
  "evidence/TERMINOLOGY_FINAL_BOUNDARY28_R2.md",
  "evidence/B11_RECORD_OBJECT_HASHES.tsv",
  "evidence/BOUNDARY28_R2_RECORD_OBJECT_HASHES.tsv",
  ...Array.from(exportData.keys()).map((name) => `exports/${name}.csv`),
  "exports/R014_MODULAR_BACKEND.xlsx",
];
const manifestRows = manifestCandidates.sort((a, b) => a.localeCompare(b, "en")).map((item) => {
  const filename = path.join(backendDir, item);
  return { path: item, bytes: fs.statSync(filename).size, sha256: sha256File(filename) };
});
const canonicalManifestRows = manifestRows.map((row) => `${row.path}\t${row.bytes}\t${row.sha256}\n`).join("");
const backendManifest = {
  schema: "r014.backend.manifest",
  schema_version: "1.0.0",
  generated_at: canonicalAdmission.createdAt,
  authority_sha256: authoritySha,
  target_sha256: canonicalAdmission.finalTargetSha256,
  record_counts: recordCounts,
  csv_projection_count: 15,
  workbook_sheet_count: 15,
  baseline_boundary11_record_count: 2417,
  baseline_boundary11_records_sha256: "3fe63938cec0aaeb8cc31ec4590af077377c758b3585cea4049b433542086a7c",
  admitted_boundary28_r2_record_count: 5180,
  admitted_boundary28_r2_records_sha256: "18764193b4579196c2b02549ff592da0f04e4c0c4194cf6da5294ff11bbb6fa7",
  final_topology: fullExtension.topology,
  canonical_reader: { edition_id: canonicalAdmission.finalEditionId, boundaries: canonicalAdmission.canonicalBoundaries, pdf: canonicalAdmission.finalPdf },
  files: manifestRows,
  canonical_rows_sha256: sha256Bytes(Buffer.from(canonicalManifestRows, "utf8")),
};
const manifestPath = path.join(backendDir, "MANIFEST.json");
await fsp.writeFile(manifestPath, `${stableJson(backendManifest, 2)}\n`, "utf8");
await fsp.writeFile(path.join(backendDir, "MANIFEST.sha256"), `${sha256File(manifestPath)}  MANIFEST.json\n`, "ascii");

console.log(stableJson({
  result: "pass",
  records: records.length,
  record_counts: recordCounts,
  relations: relationRecords.length,
  segment_expressions: segmentRecords.reduce((sum, record) => sum + record.expressions.length, 0),
  assessments: assessmentRows.length,
  csv_exports: 15,
  workbook_sheets: 15,
  workbook: { path: relative(laneWorkbook), bytes: fs.statSync(laneWorkbook).size, sha256: sha256File(laneWorkbook) },
  handoff_workbook: { path: handoffWorkbook, bytes: fs.statSync(handoffWorkbook).size, sha256: sha256File(handoffWorkbook) },
  manifest: { path: relative(manifestPath), bytes: fs.statSync(manifestPath).size, sha256: sha256File(manifestPath), canonical_rows_sha256: backendManifest.canonical_rows_sha256 },
}, 2));
