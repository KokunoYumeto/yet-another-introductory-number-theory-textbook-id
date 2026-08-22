import fs from "node:fs";
import path from "node:path";

const FINAL_CREATED_AT = "2026-08-22T03:06:00+02:00";
const FINAL_TARGET_REL_PATH = "qa/review-candidates/boundary28-r2/yaintt-id.tex";
const FINAL_TARGET_BYTES = 269464;
const FINAL_TARGET_SHA256 = "b1dd2926dc8bfdb84c6a3b4605490a8d96b14c44d89653867160d701fa0f17db";
const FINAL_LEDGER_REL_PATH = "qa/review-candidates/boundary28-r2/ADVERSE_LEDGER.md";
const FINAL_LEDGER_BYTES = 51058;
const FINAL_LEDGER_SHA256 = "dd4de4ca603dc1bf67b635bce3199fcdbf6bcacbc3b8d3736350b5a825a00f57";
const FINAL_TERMINOLOGY_REL_PATH = "qa/review-candidates/boundary28-r2/TERMINOLOGY.md";
const FINAL_TERMINOLOGY_BYTES = 29316;
const FINAL_TERMINOLOGY_SHA256 = "3e3fe31baa8565bbc54cd6d789570cac18ed469f68cf683f08dd639ef92d9bd1";
const FINAL_EDITION_ID = "ttp.r014.edition.id-id.boundary28-r2";
const FINAL_RIGHTS_ID = "rights.yaintt.id-id.derivative.boundary28-r2";
const FINAL_STRUCTURAL_QA_ID = "ttp.r014.qa.boundary28-r2-backend-structural";

const SELECTED_ENVIRONMENTS = new Set([
  "discussion", "exercise", "definition", "proof", "theorem", "example",
  "proposition", "corollary", "lemma", "figure", "wrapfigure", "table",
  "tabular", "verbatim",
]);

const BOUNDARIES = [
  { number: 12, source: [2211, 2372], target: [2504, 2682], root: "sec.batfta", headings: [
    { unitType: "chapter", suffix: "chap.pns", parentSuffix: "book", sourceStart: 2211, sourceEnd: 2787, targetStart: 2504, targetEnd: 3185, fixedOrder: 3 },
    { unitType: "section", suffix: "sec.batfta", parentSuffix: "chap.pns", sourceStart: 2220, sourceEnd: 2372, targetStart: 2513, targetEnd: 2682, fixedOrder: 1 },
  ] },
  { number: 13, source: [2373, 2456], target: [2693, 2784], root: "sec.wt", headings: [
    { unitType: "section", suffix: "sec.wt", parentSuffix: "chap.pns", sourceStart: 2373, sourceEnd: 2456, targetStart: 2693, targetEnd: 2784, fixedOrder: 2 },
  ] },
  { number: 14, source: [2457, 2663], target: [2795, 3028], root: "sec.moaa", headings: [
    { unitType: "section", suffix: "sec.moaa", parentSuffix: "chap.pns", sourceStart: 2457, sourceEnd: 2663, targetStart: 2795, targetEnd: 3028, fixedOrder: 3 },
  ] },
  { number: 15, source: [2664, 2787], target: [3039, 3175], root: "sec.aatflaet", headings: [
    { unitType: "section", suffix: "sec.aatflaet", parentSuffix: "chap.pns", sourceStart: 2664, sourceEnd: 2787, targetStart: 3039, targetEnd: 3175, fixedOrder: 4 },
  ] },
  { number: 16, source: [2788, 3064], target: [3186, 3470], root: "sec.ssh", headings: [
    { unitType: "chapter", suffix: "id-id.chap.crypto", parentSuffix: "book", sourceStart: 2788, sourceEnd: 4476, targetStart: 3186, targetEnd: 5018, fixedOrder: 4, supersedesSuffix: "chap.crypto" },
    { unitType: "section", suffix: "sec.ssh", parentSuffix: "id-id.chap.crypto", sourceStart: 2832, sourceEnd: 3064, targetStart: 3231, targetEnd: 3470, fixedOrder: 1 },
  ] },
  { number: 17, source: [3065, 3281], target: [3481, 3704], root: "sec.ccaiv", headings: [
    { unitType: "section", suffix: "sec.ccaiv", parentSuffix: "id-id.chap.crypto", sourceStart: 3065, sourceEnd: 3281, targetStart: 3481, targetEnd: 3704, fixedOrder: 2 },
  ] },
  { number: 18, source: [3282, 3624], target: [3715, 4068], root: "sec.frequency", headings: [
    { unitType: "section", suffix: "sec.frequency", parentSuffix: "id-id.chap.crypto", sourceStart: 3282, sourceEnd: 3624, targetStart: 3715, targetEnd: 4068, fixedOrder: 3 },
  ] },
  { number: 19, source: [3625, 4096], target: [4079, 4571], root: "sec.rsa", headings: [
    { unitType: "section", suffix: "sec.rsa", parentSuffix: "id-id.chap.crypto", sourceStart: 3625, sourceEnd: 4096, targetStart: 4079, targetEnd: 4571, fixedOrder: 4 },
  ] },
  { number: 20, source: [4097, 4319], target: [4582, 4828], root: "sec.digital-signatures", headings: [
    { unitType: "section", suffix: "sec.digital-signatures", parentSuffix: "id-id.chap.crypto", sourceStart: 4097, sourceEnd: 4319, targetStart: 4582, targetEnd: 4828, fixedOrder: 5 },
  ] },
  { number: 21, source: [4320, 4476], target: [4839, 5007], root: "sec.mitm-certificates-trust", headings: [
    { unitType: "section", suffix: "sec.mitm-certificates-trust", parentSuffix: "id-id.chap.crypto", sourceStart: 4320, sourceEnd: 4476, targetStart: 4839, targetEnd: 5007, fixedOrder: 6 },
  ] },
  { number: 22, source: [4477, 4602], target: [5019, 5144], root: "id-id.chap.ieqdl", headings: [
    { unitType: "chapter", suffix: "id-id.chap.ieqdl", parentSuffix: "book", sourceStart: 4477, sourceEnd: 5993, targetStart: 5019, targetEnd: 6671, fixedOrder: 5, supersedesSuffix: "chap.ieqdl" },
  ] },
  { number: 23, source: [4603, 4782], target: [5155, 5349], root: "sec.multiplicative-order-properties", headings: [
    { unitType: "section", suffix: "sec.multiplicative-order-properties", parentSuffix: "id-id.chap.ieqdl", sourceStart: 4603, sourceEnd: 4782, targetStart: 5155, targetEnd: 5349, fixedOrder: 1 },
  ] },
  { number: 24, source: [4783, 4898], target: [5360, 5479], root: "sec.gauss-totient-sum", headings: [
    { unitType: "section", suffix: "sec.gauss-totient-sum", parentSuffix: "id-id.chap.ieqdl", sourceStart: 4783, sourceEnd: 4898, targetStart: 5360, targetEnd: 5479, fixedOrder: 2 },
  ] },
  { number: 25, source: [4899, 5271], target: [5490, 5884], root: "sec.primitive-roots", headings: [
    { unitType: "section", suffix: "sec.primitive-roots", parentSuffix: "id-id.chap.ieqdl", sourceStart: 4899, sourceEnd: 5271, targetStart: 5490, targetEnd: 5884, fixedOrder: 3 },
  ] },
  { number: 26, source: [5272, 5523], target: [5895, 6154], root: "sec.indices", headings: [
    { unitType: "section", suffix: "sec.indices", parentSuffix: "id-id.chap.ieqdl", sourceStart: 5272, sourceEnd: 5523, targetStart: 5895, targetEnd: 6154, fixedOrder: 4 },
  ] },
  { number: 27, source: [5524, 5766], target: [6165, 6417], root: "id-id.sec.dhke", headings: [
    { unitType: "section", suffix: "id-id.sec.dhke", parentSuffix: "id-id.chap.ieqdl", sourceStart: 5524, sourceEnd: 5766, targetStart: 6165, targetEnd: 6417, fixedOrder: 5, supersedesSuffix: "sec.dhke" },
  ] },
  { number: 28, source: [5767, 5993], target: [6428, 6671], root: "id-id.sec.tegc", headings: [
    { unitType: "section", suffix: "id-id.sec.tegc", parentSuffix: "id-id.chap.ieqdl", sourceStart: 5767, sourceEnd: 5993, targetStart: 6428, targetEnd: 6671, fixedOrder: 6, supersedesSuffix: "sec.tegc" },
  ] },
];

const BUILD_EVIDENCE = [
  ...Array.from({ length: 8 }, (_, index) => {
    const number = index + 12;
    return { number, build: `qa/BOUNDARY${number}_BUILD.json`, visual: `qa/BOUNDARY${number}_VISUAL.json`, pdf: `output/YAINTT_ID_BOUNDARY${number}.pdf` };
  }),
  { number: 20, build: "qa/BOUNDARY20_LAYOUT_R2_BUILD.json", visual: "qa/BOUNDARY20_LAYOUT_R2_VISUAL.json", pdf: "output/YAINTT_ID_BOUNDARY20_LAYOUT_R2_CANDIDATE.pdf" },
  { number: 21, build: "qa/BOUNDARY21_LAYOUT_R2_BUILD.json", visual: "qa/BOUNDARY21_LAYOUT_R2_VISUAL.json", pdf: "output/YAINTT_ID_BOUNDARY21_LAYOUT_R2_CANDIDATE.pdf" },
  { number: 22, build: "qa/BOUNDARY22_LAYOUT_R2_BUILD.json", visual: "qa/BOUNDARY22_LAYOUT_R2_VISUAL.json", pdf: "output/YAINTT_ID_BOUNDARY22_LAYOUT_R2_CANDIDATE.pdf" },
  { number: 23, build: "qa/BOUNDARY23_R3_BUILD.json", visual: "qa/BOUNDARY23_R3_VISUAL.json", pdf: "output/YAINTT_ID_BOUNDARY23_R3_CANDIDATE.pdf" },
  { number: 24, build: "qa/BOUNDARY24_R2_BUILD.json", visual: "qa/BOUNDARY24_R2_VISUAL.json", pdf: "output/YAINTT_ID_BOUNDARY24_R2_CANDIDATE.pdf" },
];

const REVIEW_EVIDENCE = [25, 26, 27].map((number) => ({ number, path: `qa/BOUNDARY${number}_TRANSLATION_REVIEW.json` }));

const CONCEPT_BOUNDARY_RANGES = [
  [12, "nt.prime", "nt.proper_divisor"],
  [13, "nt.wilsons_theorem", "nt.primality_test"],
  [14, "nt.multiplicative_order", "algebra.coset"],
  [15, "nt.eulers_theorem", "nt.fermats_last_theorem"],
  [16, "crypto.cryptology", "crypto.security_through_obscurity"],
  [17, "crypto.caesar_cipher", "crypto.key_distribution"],
  [18, "randomness.pseudorandom", "stats.weighted_mixture"],
  [19, "crypto.symmetric_cipher", "encoding.utf16"],
  [20, "crypto.digital_signature", "security.replay_attack"],
  [21, "security.man_in_the_middle_attack", "pki.key_fingerprint"],
  [23, "nt.exponents_modulo_order", "nt.order_of_power"],
  [24, "nt.gauss_totient_sum", "nt.divisor_sum_function"],
  [25, "nt.primitive_root", "nt.order_class_count"],
  [26, "nt.index_relative", "algebra.change_of_base_formula"],
  [27, "crypto.diffie_hellman_key_exchange", "crypto.dh_public_parameters"],
  [28, "crypto.elgamal_cryptosystem", "randomness.fresh_randomness"],
];

const PREREQUISITES = {
  composite: ["prime", "divisibility"],
  prime_factorization: ["prime", "divisibility"],
  fundamental_theorem_arithmetic: ["prime_factorization", "well_ordering_principle"],
  square_free: ["prime_factorization"],
  proper_divisor: ["divisibility"],
  wilsons_theorem: ["prime", "modular_inverse"],
  self_inverse: ["modular_inverse"],
  primality_test: ["prime", "wilsons_theorem"],
  multiplicative_order: ["congruence", "modular_inverse"],
  lagranges_theorem: ["unit_group"],
  cyclic_subgroup: ["unit_group", "multiplicative_order"],
  coset: ["cyclic_subgroup"],
  eulers_theorem: ["multiplicative_order", "euler_phi_function"],
  fermats_little_theorem: ["eulers_theorem", "prime"],
  cryptosystem: ["encryption", "decryption", "key"],
  caesar_cipher: ["congruence"],
  vigenere_cipher: ["caesar_cipher"],
  one_time_pad: ["vigenere_cipher", "fresh_randomness"],
  frequency_analysis: ["letter_frequency", "ciphertext"],
  caesar_cracker: ["caesar_cipher", "total_square_error"],
  public_key_cryptosystem: ["asymmetric_cipher", "key_generation_algorithm"],
  rsa_modulus: ["prime_factorization"],
  rsa_semiprime: ["rsa_modulus"],
  rsa_exponent: ["euler_phi_function", "modular_inverse"],
  rsa_public_key: ["rsa_modulus", "rsa_exponent"],
  rsa_private_key: ["rsa_public_key", "modular_inverse"],
  fast_modular_exponentiation: ["binary_representation", "congruence"],
  digital_signature: ["public_key_cryptosystem"],
  cryptographic_hash_function: ["digital_signature"],
  signature_unforgeability: ["digital_signature"],
  certificate_authority: ["digital_signature", "identity_key_binding"],
  digital_certificate: ["certificate_authority", "public_key"],
  certification_path: ["digital_certificate", "trust_anchor"],
  public_key_infrastructure: ["certification_path"],
  exponents_modulo_order: ["multiplicative_order"],
  order_of_power: ["multiplicative_order", "greatest_common_divisor"],
  gauss_totient_sum: ["euler_phi_function", "divisibility"],
  primitive_root: ["multiplicative_order", "euler_phi_function"],
  primitive_root_count: ["primitive_root", "euler_phi_function"],
  polynomial_mod_p: ["congruence", "prime"],
  polynomial_root: ["polynomial_mod_p"],
  zero_product_property: ["polynomial_mod_p"],
  integral_domain: ["zero_product_property"],
  order_class_count: ["primitive_root", "gauss_totient_sum"],
  index_relative: ["primitive_root", "discrete_logarithm"],
  discrete_logarithm_hardness: ["discrete_logarithm", "input_length"],
  change_of_base_formula: ["index_relative", "modular_inverse"],
  diffie_hellman_key_exchange: ["primitive_root", "discrete_logarithm_hardness"],
  dh_secret_exponent: ["diffie_hellman_key_exchange", "fresh_randomness"],
  shared_secret: ["diffie_hellman_key_exchange"],
  diffie_hellman_problem: ["diffie_hellman_key_exchange"],
  elgamal_cryptosystem: ["primitive_root", "discrete_logarithm_hardness", "public_key_cryptosystem"],
  elgamal_public_key: ["elgamal_cryptosystem"],
  elgamal_private_key: ["elgamal_cryptosystem"],
  elgamal_ephemeral_exponent: ["elgamal_cryptosystem", "fresh_randomness"],
  elgamal_ciphertext: ["elgamal_cryptosystem"],
  elgamal_signature: ["elgamal_cryptosystem", "digital_signature"],
  elgamal_signature_nonce: ["elgamal_signature", "fresh_randomness"],
  semantic_security: ["elgamal_cryptosystem"],
};

function normalizedPath(root, relativePath) {
  return path.join(root, ...relativePath.split("/"));
}

function fileClosure(root, relativePath, expectedBytes, expectedSha256, sha256File) {
  const filename = normalizedPath(root, relativePath);
  const stat = fs.statSync(filename);
  const sha256 = sha256File(filename);
  if (stat.size !== expectedBytes || sha256 !== expectedSha256) {
    throw new Error(`${relativePath} drift: expected ${expectedBytes}/${expectedSha256}, observed ${stat.size}/${sha256}`);
  }
  return { filename, bytes: stat.size, sha256, buffer: fs.readFileSync(filename) };
}

function lineOffsets(buffer) {
  const result = [0];
  for (let index = 0; index < buffer.length; index += 1) if (buffer[index] === 0x0a) result.push(index + 1);
  return result;
}

function span(buffer, offsets, startLine, endLine, sha256Bytes) {
  if (startLine < 1 || endLine < startLine || startLine > offsets.length) throw new Error(`invalid span ${startLine}-${endLine}`);
  const start = offsets[startLine - 1];
  const end = endLine < offsets.length ? offsets[endLine] : buffer.length;
  const bytes = buffer.subarray(start, end);
  return { bytes, text: bytes.toString("utf8"), sha256: sha256Bytes(bytes) };
}

function parseEnvironmentSpans(lines, startLine, endLine) {
  const stack = [];
  const nodes = [];
  for (let lineNumber = startLine; lineNumber <= endLine; lineNumber += 1) {
    const line = lines[lineNumber - 1];
    const tokens = [...line.matchAll(/\\(begin|end)\{([^{}]+)\}/g)];
    for (const token of tokens) {
      const action = token[1];
      const environment = token[2];
      if (action === "begin") stack.push({ environment, startLine: lineNumber, startColumn: token.index });
      else {
        const opened = stack.pop();
        if (!opened || opened.environment !== environment) throw new Error(`environment topology drift at line ${lineNumber}: ${opened?.environment ?? "none"} -> ${environment}`);
        if (SELECTED_ENVIRONMENTS.has(environment)) nodes.push({ ...opened, type: environment, endLine: lineNumber, endColumn: token.index + token[0].length });
      }
    }
  }
  if (stack.length) throw new Error(`unclosed environment(s) in ${startLine}-${endLine}: ${stack.map((item) => item.environment).join(",")}`);
  return nodes.sort((a, b) => a.startLine - b.startLine || a.startColumn - b.startColumn || b.endLine - a.endLine);
}

function extractHeading(lines, lineNumber) {
  const line = lines[lineNumber - 1];
  const withoutLabel = line.split("\\label", 1)[0];
  const match = withoutLabel.match(/^\s*\\(chapter|section|subsection)(?:\[[^\]]*\])?\{(.+)\}\s*$/);
  if (!match) throw new Error(`unable to parse heading at line ${lineNumber}: ${line}`);
  const nearby = lines.slice(lineNumber - 1, Math.min(lines.length, lineNumber + 2)).join("\n");
  const label = nearby.match(/\\label\{([^{}]+)\}/)?.[1] ?? `generated:${match[1]}:${lineNumber}`;
  return { command: match[1], title: match[2], label };
}

function firstLabel(lines, startLine, endLine) {
  const nearby = lines.slice(startLine - 1, Math.min(endLine, startLine + 2)).join("\n");
  return nearby.match(/\\label\{([^{}]+)\}/)?.[1] ?? null;
}

function parseTerminology(text) {
  const rows = [];
  for (const line of text.split(/\r?\n/)) {
    if (!/^\| [^ -]/.test(line) || /^\| Concept ID/.test(line)) continue;
    const cells = line.slice(1, -1).split("|").map((cell) => cell.trim());
    if (cells.length !== 4) throw new Error(`terminology row has ${cells.length} cells: ${line}`);
    const [fullConceptId, sourceTerm, targetTerm, notes] = cells;
    if (!/^[a-z][a-z0-9_]*\.[a-z0-9_]+$/.test(fullConceptId)) throw new Error(`invalid terminology concept id ${fullConceptId}`);
    rows.push({ fullConceptId, conceptSuffix: fullConceptId.split(".").slice(1).join("."), sourceTerm, targetTerm, notes });
  }
  if (rows.length !== 216) throw new Error(`expected 216 final terminology rows, observed ${rows.length}`);
  if (new Set(rows.map((row) => row.fullConceptId)).size !== rows.length) throw new Error("duplicate final terminology concept id");
  return rows;
}

function parseCorrections(text) {
  const lines = text.split(/\r?\n/);
  const starts = [];
  for (let index = 0; index < lines.length; index += 1) {
    const match = lines[index].match(/^## R014-ADV-(\d{4}) — (.+)$/);
    if (match) starts.push({ number: Number(match[1]), id: `R014-ADV-${match[1]}`, title: match[2], startLine: index + 1 });
  }
  const entries = starts.map((entry, index) => {
    const endLine = index + 1 < starts.length ? starts[index + 1].startLine - 1 : lines.length;
    const body = lines.slice(entry.startLine, endLine).join("\n").trim();
    return { ...entry, endLine, body };
  });
  if (entries.length !== 141 || entries[0].number !== 1 || entries.at(-1).number !== 141) throw new Error("final adverse-ledger correction closure drift");
  for (let index = 0; index < entries.length; index += 1) if (entries[index].number !== index + 1) throw new Error(`missing correction ${index + 1}`);
  return entries;
}

function findObjectWithPath(value, targetPath) {
  if (!value || typeof value !== "object") return null;
  if (!Array.isArray(value) && value.path === targetPath) return value;
  for (const child of Array.isArray(value) ? value : Object.values(value)) {
    const found = findObjectWithPath(child, targetPath);
    if (found) return found;
  }
  return null;
}

function receiptStatus(receipt) {
  return String(receipt.result ?? receipt.status ?? receipt.structural_gate?.passed ?? "recorded");
}

function receiptTimestamp(receipt) {
  return receipt.timestamp ?? receipt.generated_at_utc ?? receipt.reviewed_at_utc ?? FINAL_CREATED_AT;
}

function localTitle(type, index, label, language) {
  const names = {
    discussion: ["Discussion", "Pembahasan"], exercise: ["Exercise", "Latihan"], definition: ["Definition", "Definisi"],
    proof: ["Proof", "Bukti"], theorem: ["Theorem", "Teorema"], example: ["Example", "Contoh"],
    proposition: ["Proposition", "Proposisi"], corollary: ["Corollary", "Korolari"], lemma: ["Lemma", "Lemma"],
    figure: ["Figure", "Gambar"], wrapfigure: ["Wrapped figure", "Gambar berbalut"], table: ["Table", "Tabel"],
    tabular: ["Tabular data", "Data tabular"], verbatim: ["Verbatim block", "Blok verbatim"], exercise_group: ["Exercise group", "Kelompok latihan"],
  };
  const name = names[type]?.[language === "id" ? 1 : 0] ?? type;
  return label ? `${name} ${label}` : `${name} ${String(index).padStart(2, "0")}`;
}

function correctionBoundary(number) {
  if (number <= 52) return 12;
  if (number <= 55) return 13;
  if (number <= 60) return 14;
  if (number <= 64) return 15;
  if (number <= 70) return 16;
  if (number <= 82) return 17;
  if (number <= 84) return 18;
  if (number <= 100) return 19;
  if (number <= 107) return 20;
  if (number <= 110) return 21;
  if (number <= 116) return 22;
  if (number <= 117) return 23;
  if (number <= 125) return 25;
  if (number <= 128) return 26;
  if (number <= 133) return 27;
  return 28;
}

export function extendFullBackend(context) {
  const {
    root, records, relationRecords, segmentRecords, baseRecord, unitId, conceptId,
    correctionId, sha256Bytes, sha256File, stableJson, authorityBytes,
    authorityOffsets, authoritySha, sourceEditionId, boundary11EditionId,
  } = context;
  const startingRecordCount = records.length;
  const baselineIds = new Set(records.map((record) => record.record_id));
  if (startingRecordCount !== 2417 || baselineIds.size !== 2417) throw new Error(`Boundary 11 baseline record closure drift: ${startingRecordCount}/${baselineIds.size}`);

  const target = fileClosure(root, FINAL_TARGET_REL_PATH, FINAL_TARGET_BYTES, FINAL_TARGET_SHA256, sha256File);
  const ledger = fileClosure(root, FINAL_LEDGER_REL_PATH, FINAL_LEDGER_BYTES, FINAL_LEDGER_SHA256, sha256File);
  const terminology = fileClosure(root, FINAL_TERMINOLOGY_REL_PATH, FINAL_TERMINOLOGY_BYTES, FINAL_TERMINOLOGY_SHA256, sha256File);
  const targetOffsets = lineOffsets(target.buffer);
  const sourceLines = authorityBytes.toString("utf8").split(/\n/).map((line) => line.replace(/\r$/, ""));
  const targetLines = target.buffer.toString("utf8").split(/\n/).map((line) => line.replace(/\r$/, ""));
  if (sourceLines.length - 1 !== 6023 || targetLines.length - 1 !== 6712) throw new Error(`source/target line closure drift: ${sourceLines.length - 1}/${targetLines.length - 1}`);

  const fullBase = (entityClass, recordId, overrides = {}) => {
    const definedOverrides = Object.fromEntries(Object.entries(overrides).filter(([, value]) => value !== undefined));
    return baseRecord(entityClass, recordId, { created_at: FINAL_CREATED_AT, ...definedOverrides });
  };
  const unitRecordId = (suffix) => unitId(suffix);
  const finalTargetArtifactId = "ttp.r014.artifact.target-source.boundary28-r2";
  const finalLedgerArtifactId = "ttp.r014.artifact.adverse-ledger.boundary28-r2";
  const finalTerminologyArtifactId = "ttp.r014.artifact.terminology.boundary28-r2";

  records.push(fullBase("edition", FINAL_EDITION_ID, {
    edition_id: FINAL_EDITION_ID,
    locale: "id-ID",
    edition_kind: "complete_reviewed_indonesian_translation_candidate",
    source_snapshot_id: "yaintt-source-2014-05-07",
    source_edition_id: sourceEditionId,
    file_ids: [finalTargetArtifactId, finalLedgerArtifactId, finalTerminologyArtifactId],
    translation_state: "language_reviewed",
    declared_timestamp: FINAL_CREATED_AT,
    authority_manifest_path: "authority/SOURCE_AUTHORITY.json",
    build_recipe: "Full-book deterministic reader build remains pending; admitted or visually checked prefix readers exist through Boundary 24.",
    translated_through: "sec:tEGC",
    next_cursor: "full-book deterministic build, visual/accessibility QA, release package, publication",
    rights_id: FINAL_RIGHTS_ID,
    supersedes: boundary11EditionId,
  }));
  records.push(fullBase("rights", FINAL_RIGHTS_ID, {
    edition_id: FINAL_EDITION_ID,
    locale: "id-ID",
    component_paths: [FINAL_TARGET_REL_PATH, FINAL_LEDGER_REL_PATH, FINAL_TERMINOLOGY_REL_PATH],
    license: "CC BY-SA 4.0",
    license_url: "https://creativecommons.org/licenses/by-sa/4.0/",
    attribution: "Jonathan A. Poritz; based on work by Wissam Raji; Indonesian derivative prepared for Floris's interlanguage curriculum project.",
    obligations: ["attribution", "indicate changes", "share alike", "preserve component-specific notices"],
    rights_status: "cleared_derivative_text_and_metadata; unresolved by-sa.eps remains excluded",
    change_notice: "Complete Bahasa Indonesia translation with documented source corrections, modular indexing, localized metadata, and layout reflow.",
    non_endorsement: "No endorsement by the upstream author is asserted.",
    evidence: { path: FINAL_LEDGER_REL_PATH, sha256: FINAL_LEDGER_SHA256, target_path: FINAL_TARGET_REL_PATH, target_sha256: FINAL_TARGET_SHA256 },
  }));

  function addArtifact(recordId, relativePath, mediaType, buildReceiptId, toolchain, extras = {}) {
    const filename = normalizedPath(root, relativePath);
    const stat = fs.statSync(filename);
    const artifact = fullBase("artifact", recordId, {
      edition_id: extras.edition_id ?? null,
      locale: extras.locale ?? "und",
      path: relativePath,
      media_type: mediaType,
      bytes: stat.size,
      sha256: sha256File(filename),
      toolchain,
      build_receipt_id: buildReceiptId,
      reproducible: extras.reproducible ?? true,
      pages: extras.pages ?? null,
      file_manifest: extras.file_manifest ?? null,
    });
    records.push(artifact);
    return artifact;
  }

  addArtifact(finalTargetArtifactId, FINAL_TARGET_REL_PATH, "application/x-tex", FINAL_STRUCTURAL_QA_ID, "immutable reviewed LaTeX candidate", { edition_id: FINAL_EDITION_ID, locale: "id-ID" });
  addArtifact(finalLedgerArtifactId, FINAL_LEDGER_REL_PATH, "text/markdown", FINAL_STRUCTURAL_QA_ID, "authoritative adverse-ledger sidecar", { edition_id: FINAL_EDITION_ID, locale: "en" });
  addArtifact(finalTerminologyArtifactId, FINAL_TERMINOLOGY_REL_PATH, "text/markdown", FINAL_STRUCTURAL_QA_ID, "authoritative terminology sidecar", { edition_id: FINAL_EDITION_ID, locale: "mul" });

  const qaIdsByBoundary = new Map();
  for (const evidence of BUILD_EVIDENCE) {
    const buildQaId = `ttp.r014.qa.boundary${evidence.number}-build-evidence`;
    const visualQaId = `ttp.r014.qa.boundary${evidence.number}-visual-evidence`;
    const pdfArtifactId = `ttp.r014.artifact.boundary${evidence.number}-reader-evidence`;
    const buildReceiptArtifactId = `ttp.r014.artifact.boundary${evidence.number}-build-receipt-evidence`;
    const visualReceiptArtifactId = `ttp.r014.artifact.boundary${evidence.number}-visual-receipt-evidence`;
    const buildReceipt = JSON.parse(fs.readFileSync(normalizedPath(root, evidence.build), "utf8"));
    const visualReceipt = JSON.parse(fs.readFileSync(normalizedPath(root, evidence.visual), "utf8"));
    const receiptPdf = findObjectWithPath(buildReceipt, evidence.pdf) ?? findObjectWithPath(visualReceipt, evidence.pdf);
    const pdfArtifact = addArtifact(pdfArtifactId, evidence.pdf, "application/pdf", buildQaId, "LaTeX/BibTeX/MakeIndex/DVIPS/Ghostscript plus deterministic PDF normalization", { locale: "id-ID", pages: receiptPdf?.pages ?? null });
    if (receiptPdf?.bytes !== undefined && receiptPdf.bytes !== pdfArtifact.bytes) throw new Error(`${evidence.pdf} byte count disagrees with receipt`);
    if (receiptPdf?.sha256 !== undefined && receiptPdf.sha256 !== pdfArtifact.sha256) throw new Error(`${evidence.pdf} hash disagrees with receipt`);
    const buildReceiptArtifact = addArtifact(buildReceiptArtifactId, evidence.build, "application/json", buildQaId, "recorded build receipt", { locale: "und" });
    const visualReceiptArtifact = addArtifact(visualReceiptArtifactId, evidence.visual, "application/json", visualQaId, "recorded visual receipt", { locale: "und" });
    records.push(fullBase("qa_event", buildQaId, {
      qa_type: "build",
      result: receiptStatus(buildReceipt),
      witness_ids: [pdfArtifactId, buildReceiptArtifactId],
      evidence: { path: evidence.build, bytes: buildReceiptArtifact.bytes, sha256: buildReceiptArtifact.sha256, pdf_path: evidence.pdf, pdf_sha256: pdfArtifact.sha256 },
      method: buildReceipt.schema ?? "recorded deterministic build receipt",
      event_timestamp: receiptTimestamp(buildReceipt),
    }));
    records.push(fullBase("qa_event", visualQaId, {
      qa_type: "visual",
      result: receiptStatus(visualReceipt),
      witness_ids: [pdfArtifactId, visualReceiptArtifactId],
      evidence: { path: evidence.visual, bytes: visualReceiptArtifact.bytes, sha256: visualReceiptArtifact.sha256, pdf_path: evidence.pdf, pdf_sha256: pdfArtifact.sha256 },
      method: visualReceipt.schema ?? "recorded visual inspection receipt",
      event_timestamp: receiptTimestamp(visualReceipt),
    }));
    qaIdsByBoundary.set(evidence.number, [buildQaId, visualQaId]);
  }
  for (const evidence of REVIEW_EVIDENCE) {
    const reviewQaId = `ttp.r014.qa.boundary${evidence.number}-translation-review-evidence`;
    const receiptArtifactId = `ttp.r014.artifact.boundary${evidence.number}-translation-review-receipt`;
    const receipt = JSON.parse(fs.readFileSync(normalizedPath(root, evidence.path), "utf8"));
    const artifact = addArtifact(receiptArtifactId, evidence.path, "application/json", reviewQaId, "recorded independent translation review receipt", { locale: "und" });
    records.push(fullBase("qa_event", reviewQaId, {
      edition_id: FINAL_EDITION_ID,
      qa_type: "math-language-topology-review",
      result: receiptStatus(receipt),
      witness_ids: [receiptArtifactId, finalTargetArtifactId],
      evidence: { path: evidence.path, bytes: artifact.bytes, sha256: artifact.sha256, authority: receipt.authority, reviewed_target: receipt.target, checks: receipt.checks },
      method: receipt.schema ?? "independent translation review",
      event_timestamp: receiptTimestamp(receipt),
    }));
    const pendingBuildId = `ttp.r014.qa.boundary${evidence.number}-build-pending`;
    records.push(fullBase("qa_event", pendingBuildId, {
      edition_id: FINAL_EDITION_ID,
      qa_type: "build",
      result: "pending",
      witness_ids: [finalTargetArtifactId],
      evidence: { path: FINAL_TARGET_REL_PATH, target_sha256: FINAL_TARGET_SHA256, reason: `No passed Boundary ${evidence.number} build receipt exists in the selected final-candidate lineage.` },
      method: "filesystem evidence inventory",
      event_timestamp: FINAL_CREATED_AT,
    }));
    qaIdsByBoundary.set(evidence.number, [reviewQaId, pendingBuildId]);
  }
  const boundary28PendingBuildId = "ttp.r014.qa.boundary28-build-pending";
  records.push(fullBase("qa_event", boundary28PendingBuildId, {
    edition_id: FINAL_EDITION_ID,
    qa_type: "build",
    result: "pending",
    witness_ids: [finalTargetArtifactId],
    evidence: { path: FINAL_TARGET_REL_PATH, target_sha256: FINAL_TARGET_SHA256, reason: "No full-book Boundary 28-r2 build receipt or PDF exists yet." },
    method: "filesystem evidence inventory",
    event_timestamp: FINAL_CREATED_AT,
  }));
  qaIdsByBoundary.set(28, [FINAL_STRUCTURAL_QA_ID, boundary28PendingBuildId]);

  const rawNodes = [];
  let selectedEnvironmentCount = 0;
  let exerciseCount = 0;
  let exerciseGroupCount = 0;
  const rootIdByBoundary = new Map(BOUNDARIES.map((boundary) => [boundary.number, unitRecordId(boundary.root)]));
  for (const boundary of BOUNDARIES) {
    for (const heading of boundary.headings) {
      const sourceHeading = extractHeading(sourceLines, heading.sourceStart);
      const targetHeading = extractHeading(targetLines, heading.targetStart);
      if (sourceHeading.command !== heading.unitType || targetHeading.command !== heading.unitType) throw new Error(`Boundary ${boundary.number} heading type drift`);
      rawNodes.push({
        boundary: boundary.number,
        id: unitRecordId(heading.suffix),
        suffix: heading.suffix,
        unitType: heading.unitType,
        parentId: unitRecordId(heading.parentSuffix),
        sourceLocalId: sourceHeading.label,
        titleEn: sourceHeading.title,
        titleId: targetHeading.title,
        sourceStart: heading.sourceStart,
        sourceEnd: heading.sourceEnd,
        targetStart: heading.targetStart,
        targetEnd: heading.targetEnd,
        segmentSourceStart: heading.sourceStart,
        segmentSourceEnd: heading.sourceStart,
        segmentTargetStart: heading.targetStart,
        segmentTargetEnd: heading.targetStart,
        fixedOrder: heading.fixedOrder,
        supersedes: heading.supersedesSuffix ? unitRecordId(heading.supersedesSuffix) : null,
      });
    }
    const sourceEnvironments = parseEnvironmentSpans(sourceLines, boundary.source[0], boundary.source[1]);
    const targetEnvironments = parseEnvironmentSpans(targetLines, boundary.target[0], boundary.target[1]);
    const sourceSignature = sourceEnvironments.map((node) => node.type).join("\u0000");
    const targetSignature = targetEnvironments.map((node) => node.type).join("\u0000");
    if (sourceSignature !== targetSignature) throw new Error(`Boundary ${boundary.number} semantic environment sequence drift`);
    selectedEnvironmentCount += sourceEnvironments.length;
    exerciseCount += sourceEnvironments.filter((node) => node.type === "exercise").length;
    const typeCounters = new Map();
    const envPairs = sourceEnvironments.map((sourceNode, index) => {
      const targetNode = targetEnvironments[index];
      const typeIndex = (typeCounters.get(sourceNode.type) ?? 0) + 1;
      typeCounters.set(sourceNode.type, typeIndex);
      const label = firstLabel(sourceLines, sourceNode.startLine, sourceNode.endLine);
      const suffix = sourceNode.type === "exercise"
        ? `${boundary.root}.exercise.${String(typeIndex).padStart(2, "0")}`
        : `${boundary.root}.${sourceNode.type}.${String(typeIndex).padStart(2, "0")}`;
      return {
        boundary: boundary.number,
        id: unitRecordId(suffix),
        suffix,
        unitType: sourceNode.type === "wrapfigure" ? "figure" : sourceNode.type,
        rawType: sourceNode.type,
        sourceLocalId: label ?? `generated:${sourceNode.type}:boundary${boundary.number}:${String(typeIndex).padStart(2, "0")}`,
        titleEn: localTitle(sourceNode.type, typeIndex, label, "en"),
        titleId: localTitle(sourceNode.type, typeIndex, label, "id"),
        sourceStart: sourceNode.startLine,
        sourceEnd: sourceNode.endLine,
        targetStart: targetNode.startLine,
        targetEnd: targetNode.endLine,
        segmentSourceStart: sourceNode.startLine,
        segmentSourceEnd: sourceNode.endLine,
        segmentTargetStart: targetNode.startLine,
        segmentTargetEnd: targetNode.endLine,
        sourceEnvironment: sourceNode,
      };
    });
    const exercises = envPairs.filter((node) => node.rawType === "exercise");
    let exerciseGroup = null;
    if (exercises.length) {
      const sourceGroupLine = sourceLines.findIndex((line, index) => index + 1 >= boundary.source[0] && index + 1 <= boundary.source[1] && /\\subsection\*\{Exercises for/.test(line)) + 1;
      const targetGroupLine = targetLines.findIndex((line, index) => index + 1 >= boundary.target[0] && index + 1 <= boundary.target[1] && /\\subsection\*\{Latihan untuk/.test(line)) + 1;
      if (sourceGroupLine < boundary.source[0] || targetGroupLine < boundary.target[0]) throw new Error(`Boundary ${boundary.number} exercise group marker missing`);
      exerciseGroup = {
        boundary: boundary.number,
        id: unitRecordId(`${boundary.root}.exercises`),
        suffix: `${boundary.root}.exercises`,
        unitType: "exercise_group",
        parentId: rootIdByBoundary.get(boundary.number),
        sourceLocalId: `generated:exercise-group:boundary${boundary.number}`,
        titleEn: "Exercises",
        titleId: "Latihan",
        sourceStart: sourceGroupLine,
        sourceEnd: boundary.source[1],
        targetStart: targetGroupLine,
        targetEnd: boundary.target[1],
        segmentSourceStart: sourceGroupLine,
        segmentSourceEnd: sourceGroupLine,
        segmentTargetStart: targetGroupLine,
        segmentTargetEnd: targetGroupLine,
      };
      rawNodes.push(exerciseGroup);
      exerciseGroupCount += 1;
    }
    for (const node of envPairs) {
      if (node.rawType === "exercise") node.parentId = exerciseGroup.id;
      else {
        const containers = envPairs.filter((candidate) => candidate !== node
          && candidate.sourceStart <= node.sourceStart && candidate.sourceEnd >= node.sourceEnd
          && (candidate.sourceStart < node.sourceStart || candidate.sourceEnd > node.sourceEnd));
        containers.sort((a, b) => (a.sourceEnd - a.sourceStart) - (b.sourceEnd - b.sourceStart));
        if (containers.length) node.parentId = containers[0].id;
        else if (node.rawType === "proof") {
          const theoremLike = envPairs.filter((candidate) => ["theorem", "proposition", "corollary", "lemma"].includes(candidate.rawType) && candidate.sourceEnd < node.sourceStart).at(-1);
          node.parentId = theoremLike?.id ?? rootIdByBoundary.get(boundary.number);
          node.provesId = theoremLike?.id ?? null;
        } else node.parentId = rootIdByBoundary.get(boundary.number);
      }
      rawNodes.push(node);
    }
  }
  if (selectedEnvironmentCount !== 265 || exerciseCount !== 43 || exerciseGroupCount !== 14 || rawNodes.length !== 298) {
    throw new Error(`final unit topology drift: environments=${selectedEnvironmentCount}, exercises=${exerciseCount}, groups=${exerciseGroupCount}, units=${rawNodes.length}`);
  }
  const rawNodeIds = new Set(rawNodes.map((node) => node.id));
  if (rawNodeIds.size !== rawNodes.length) throw new Error("duplicate generated full-edition unit id");
  for (const id of rawNodeIds) if (baselineIds.has(id)) throw new Error(`full-edition unit id collides with Boundary 11 baseline: ${id}`);

  const nodesByParent = new Map();
  for (const node of rawNodes) {
    if (!nodesByParent.has(node.parentId)) nodesByParent.set(node.parentId, []);
    nodesByParent.get(node.parentId).push(node);
  }
  for (const siblings of nodesByParent.values()) {
    siblings.sort((a, b) => a.sourceStart - b.sourceStart || a.sourceEnd - b.sourceEnd || a.id.localeCompare(b.id, "en"));
    for (let index = 0; index < siblings.length; index += 1) siblings[index].order = siblings[index].fixedOrder ?? index + 1;
  }
  const allUnitParent = new Map(records.filter((record) => record.entity_class === "unit").map((record) => [record.record_id, record.parent_unit_id]));
  for (const node of rawNodes) allUnitParent.set(node.id, node.parentId);
  function ancestry(recordId) {
    const result = [];
    const seen = new Set();
    let current = recordId;
    while (current) {
      if (seen.has(current)) throw new Error(`unit ancestry cycle at ${current}`);
      seen.add(current);
      result.unshift(current);
      current = allUnitParent.get(current) ?? null;
    }
    return result;
  }
  for (const node of rawNodes) {
    const sourceSpan = span(authorityBytes, authorityOffsets, node.sourceStart, node.sourceEnd, sha256Bytes);
    const targetSpan = span(target.buffer, targetOffsets, node.targetStart, node.targetEnd, sha256Bytes);
    const qaEventIds = qaIdsByBoundary.get(node.boundary) ?? [FINAL_STRUCTURAL_QA_ID];
    records.push(fullBase("unit", node.id, {
      edition_id: FINAL_EDITION_ID,
      locale: "id-ID",
      unit_type: node.unitType,
      parent_unit_id: node.parentId,
      order: node.order,
      order_key: `${String(node.boundary).padStart(2, "0")}.${String(node.order).padStart(4, "0")}`,
      source_local_id: node.sourceLocalId,
      title_en: node.titleEn,
      title_id: node.titleId,
      source_locator: { path: "authority/downloads/yaintt.tex", start_line: node.sourceStart, end_line: node.sourceEnd },
      source_content_sha256: sourceSpan.sha256,
      target_locator: { path: FINAL_TARGET_REL_PATH, start_line: node.targetStart, end_line: node.targetEnd },
      target_content_sha256: targetSpan.sha256,
      translation_state: "language_reviewed",
      rights_id: FINAL_RIGHTS_ID,
      ancestry: ancestry(node.id),
      path: ancestry(node.id).join("/"),
      label_status: node.sourceLocalId.startsWith("generated:") ? "generated_stable_id" : "source_label",
      assessment_closure: node.unitType === "exercise" ? { hints: [], answers: [], solutions: [], status: "source_has_none" } : null,
      target_disposition: null,
      qa_event_ids: qaEventIds,
      supersedes: node.supersedes,
    }));
  }

  const terminologyRows = parseTerminology(terminology.buffer.toString("utf8"));
  const existingConceptIds = new Set(records.filter((record) => record.entity_class === "concept").map((record) => record.record_id));
  const finalConceptIdByFull = new Map(terminologyRows.map((row) => [row.fullConceptId, conceptId(row.conceptSuffix)]));
  for (const row of terminologyRows) {
    const id = finalConceptIdByFull.get(row.fullConceptId);
    if (existingConceptIds.has(id)) continue;
    const prerequisites = (PREREQUISITES[row.conceptSuffix] ?? []).map(conceptId).filter((candidate) => existingConceptIds.has(candidate) || [...finalConceptIdByFull.values()].includes(candidate));
    const namespace = row.fullConceptId.split(".")[0];
    const taxonomyRoot = ["crypto", "security", "pki", "randomness", "encoding", "complexity", "cs", "search", "stats", "computing"].includes(namespace)
      ? "computer-science/cryptography"
      : "mathematics/number-theory";
    records.push(fullBase("concept", id, {
      concept_code: row.conceptSuffix,
      name_en: row.sourceTerm,
      name_id: row.targetTerm,
      prerequisite_concept_ids: prerequisites,
      taxonomy_path: `${taxonomyRoot}/${row.conceptSuffix}`,
      evidence: { path: FINAL_TERMINOLOGY_REL_PATH, sha256: FINAL_TERMINOLOGY_SHA256, terminology_id: row.fullConceptId, notes: row.notes },
    }));
    existingConceptIds.add(id);
  }
  if (records.filter((record) => record.entity_class === "concept").length !== 223) throw new Error("final concept closure count drift");

  const existingTermKeys = new Set(records.filter((record) => record.entity_class === "term").map((record) => stableJson([record.concept_id, record.source_term, record.target_term])));
  let nextTermNumber = 98;
  for (const row of terminologyRows) {
    const concept = finalConceptIdByFull.get(row.fullConceptId);
    const key = stableJson([concept, row.sourceTerm, row.targetTerm]);
    if (existingTermKeys.has(key)) continue;
    const targetParts = row.targetTerm.split(/\s+\/\s+/);
    records.push(fullBase("term", `ttp.r014.term.${String(nextTermNumber).padStart(3, "0")}`, {
      locale: "id-ID",
      order: nextTermNumber,
      concept_id: concept,
      source_term: row.sourceTerm,
      target_term: row.targetTerm,
      variants: targetParts.slice(1),
      rejected_forms: [],
      scope: "R014 complete reviewed id-ID edition",
      register: "formal textbook",
      evidence: { path: FINAL_TERMINOLOGY_REL_PATH, evidence_sha256: FINAL_TERMINOLOGY_SHA256, target_sha256: FINAL_TARGET_SHA256, terminology_id: row.fullConceptId, notes: row.notes },
      examples: [{ source_text: row.sourceTerm, target_text: row.targetTerm, usage: "authoritative complete-edition term mapping", evidence_path: FINAL_TERMINOLOGY_REL_PATH }],
    }));
    existingTermKeys.add(key);
    nextTermNumber += 1;
  }
  if (nextTermNumber !== 240 || records.filter((record) => record.entity_class === "term").length !== 239) throw new Error(`final term closure drift: next=${nextTermNumber}`);
  for (const row of terminologyRows) {
    const key = stableJson([finalConceptIdByFull.get(row.fullConceptId), row.sourceTerm, row.targetTerm]);
    if (!existingTermKeys.has(key)) throw new Error(`unrepresented authoritative terminology row ${row.fullConceptId}`);
  }

  const conceptsByBoundary = new Map();
  for (const [boundary, startId, endId] of CONCEPT_BOUNDARY_RANGES) {
    const startIndex = terminologyRows.findIndex((row) => row.fullConceptId === startId);
    const endIndex = terminologyRows.findIndex((row) => row.fullConceptId === endId);
    if (startIndex < 0 || endIndex < startIndex) throw new Error(`invalid concept range for Boundary ${boundary}`);
    conceptsByBoundary.set(boundary, terminologyRows.slice(startIndex, endIndex + 1).map((row) => finalConceptIdByFull.get(row.fullConceptId)));
  }
  conceptsByBoundary.set(22, [conceptId("discrete_logarithm"), conceptId("index_modulo"), conceptId("multiplicative_order")]);

  let segmentNumber = 247;
  const segmentByUnitId = new Map();
  for (const node of rawNodes.sort((a, b) => a.sourceStart - b.sourceStart || a.sourceEnd - b.sourceEnd || a.id.localeCompare(b.id, "en"))) {
    const sourceSpan = span(authorityBytes, authorityOffsets, node.segmentSourceStart, node.segmentSourceEnd, sha256Bytes);
    const targetSpan = span(target.buffer, targetOffsets, node.segmentTargetStart, node.segmentTargetEnd, sha256Bytes);
    if (sourceSpan.bytes.length > 32000 || targetSpan.bytes.length > 32000) throw new Error(`segment exceeds safe spreadsheet cell size for ${node.id}`);
    const recordId = `ttp.r014.segment.${String(segmentNumber).padStart(3, "0")}`;
    const sourceExpressionId = `${recordId}.expr.en`;
    const targetExpressionId = `${recordId}.expr.id-id`;
    const qaEventIds = qaIdsByBoundary.get(node.boundary) ?? [FINAL_STRUCTURAL_QA_ID];
    const record = fullBase("segment", recordId, {
      edition_id: FINAL_EDITION_ID,
      locale: "mul",
      unit_id: node.id,
      order: segmentNumber,
      order_key: String(segmentNumber).padStart(4, "0"),
      segment_kind: node.unitType,
      source_text: sourceSpan.text,
      target_text: targetSpan.text,
      source_content_sha256: sourceSpan.sha256,
      target_content_sha256: targetSpan.sha256,
      source_locator: { path: "authority/downloads/yaintt.tex", start_line: node.segmentSourceStart, end_line: node.segmentSourceEnd },
      target_locator: { path: FINAL_TARGET_REL_PATH, start_line: node.segmentTargetStart, end_line: node.segmentTargetEnd },
      translation_state: "language_reviewed",
      rights_id: FINAL_RIGHTS_ID,
      source_expression_id: sourceExpressionId,
      target_expression_id: targetExpressionId,
      expressions: [
        { expression_id: sourceExpressionId, language: "en", locale: "en", source_or_target: "source", text_latex: sourceSpan.text, content_sha256: sourceSpan.sha256, state: "source_frozen" },
        { expression_id: targetExpressionId, language: "id", locale: "id-ID", source_or_target: "target", text_latex: targetSpan.text, content_sha256: targetSpan.sha256, state: "language_reviewed" },
      ],
      provenance: { kind: "translation", authority_sha256: authoritySha, target_sha256: FINAL_TARGET_SHA256 },
      qa_event_ids: qaEventIds,
    });
    records.push(record);
    segmentRecords.push(record);
    segmentByUnitId.set(node.id, recordId);
    node.segmentId = recordId;
    segmentNumber += 1;
  }
  if (segmentNumber !== 545 || segmentRecords.length !== 544) throw new Error(`final segment closure drift: ${segmentNumber}/${segmentRecords.length}`);

  const corrections = parseCorrections(ledger.buffer.toString("utf8"));
  for (const entry of corrections.filter((item) => item.number > 45)) {
    const boundary = correctionBoundary(entry.number);
    const affectedUnitId = rootIdByBoundary.get(boundary);
    records.push(fullBase("correction", correctionId(entry.number), {
      edition_id: FINAL_EDITION_ID,
      locale: "mul",
      correction_type: "source-backed correction documented in authoritative adverse ledger",
      authority_locator: { path: FINAL_LEDGER_REL_PATH, start_line: entry.startLine, end_line: entry.endLine, ledger_id: entry.id },
      source_text: entry.title,
      target_text: entry.body,
      rationale: entry.body,
      evidence: { path: FINAL_LEDGER_REL_PATH, evidence_sha256: FINAL_LEDGER_SHA256, target_path: FINAL_TARGET_REL_PATH, target_sha256: FINAL_TARGET_SHA256, ledger_id: entry.id },
      upstream_report_disposition: "hold for at most one concise, deduplicated, high-confidence final upstream report",
      affected_unit_ids: [affectedUnitId],
      report_status: "not_sent",
    }));
  }
  if (records.filter((record) => record.entity_class === "correction").length !== 141) throw new Error("final correction closure count drift");

  records.push(fullBase("qa_event", FINAL_STRUCTURAL_QA_ID, {
    edition_id: FINAL_EDITION_ID,
    qa_type: "source-target-topology-and-backend-closure",
    result: "pass",
    witness_ids: [finalTargetArtifactId, finalLedgerArtifactId, finalTerminologyArtifactId],
    evidence: {
      authority_path: "authority/downloads/yaintt.tex",
      authority_sha256: authoritySha,
      target_path: FINAL_TARGET_REL_PATH,
      target_bytes: FINAL_TARGET_BYTES,
      target_sha256: FINAL_TARGET_SHA256,
      terminology_path: FINAL_TERMINOLOGY_REL_PATH,
      terminology_rows: 216,
      adverse_ledger_path: FINAL_LEDGER_REL_PATH,
      corrections: 141,
      boundaries: 17,
      generated_units: rawNodes.length,
      semantic_environments: selectedEnvironmentCount,
      exercise_groups: exerciseGroupCount,
      exercises: exerciseCount,
      structural_sequence_match: true,
    },
    method: "deterministic line-bound source/target parser with exact environment-sequence comparison",
    event_timestamp: FINAL_CREATED_AT,
  }));

  let relationNumber = relationRecords.length + 1;
  const relationKeys = new Set(relationRecords.map((record) => `${record.subject_id}\u0000${record.predicate}\u0000${record.object_id}`));
  function addRelation(subjectId, predicate, objectId, evidenceLocator = null, confidence = "high") {
    const key = `${subjectId}\u0000${predicate}\u0000${objectId}`;
    if (relationKeys.has(key)) return;
    relationKeys.add(key);
    const record = fullBase("relation", `ttp.r014.relation.${String(relationNumber).padStart(4, "0")}`, {
      subject_id: subjectId,
      predicate,
      object_id: objectId,
      relation_order: relationNumber,
      evidence_locator: evidenceLocator,
      confidence,
    });
    records.push(record);
    relationRecords.push(record);
    relationNumber += 1;
  }
  addRelation(FINAL_EDITION_ID, "translates", sourceEditionId, { path: FINAL_TARGET_REL_PATH, sha256: FINAL_TARGET_SHA256 });
  addRelation(FINAL_EDITION_ID, "adapts", sourceEditionId, { path: FINAL_LEDGER_REL_PATH, sha256: FINAL_LEDGER_SHA256 });
  addRelation(FINAL_EDITION_ID, "supersedes", boundary11EditionId, { path: FINAL_TARGET_REL_PATH, sha256: FINAL_TARGET_SHA256 });
  for (const asset of records.filter((record) => record.entity_class === "asset" && !/by-sa\.eps$/i.test(record.path ?? ""))) addRelation(FINAL_EDITION_ID, "depends_on", asset.record_id, { path: asset.path, sha256: asset.sha256 });
  for (const node of rawNodes) {
    addRelation(node.parentId, "contains", node.id, { path: "authority/downloads/yaintt.tex", start_line: node.sourceStart, end_line: node.sourceEnd });
    addRelation(node.id, "contains", node.segmentId, { path: FINAL_TARGET_REL_PATH, start_line: node.segmentTargetStart, end_line: node.segmentTargetEnd });
    if (node.supersedes) {
      addRelation(node.id, "supersedes", node.supersedes, { path: FINAL_TARGET_REL_PATH, start_line: node.targetStart, end_line: node.targetEnd });
      addRelation(node.id, "translates", node.supersedes, { path: "authority/downloads/yaintt.tex", start_line: node.sourceStart, end_line: node.sourceEnd });
    }
    if (node.provesId) addRelation(node.id, "proves", node.provesId, { path: "authority/downloads/yaintt.tex", start_line: node.sourceStart, end_line: node.sourceEnd });
    if (["figure", "table", "tabular", "verbatim"].includes(node.unitType)) addRelation(node.id, "illustrates", node.parentId, { path: "authority/downloads/yaintt.tex", start_line: node.sourceStart, end_line: node.sourceEnd });
  }
  for (const siblings of nodesByParent.values()) {
    const ordered = [...siblings].sort((a, b) => a.sourceStart - b.sourceStart || a.sourceEnd - b.sourceEnd || a.id.localeCompare(b.id, "en"));
    for (let index = 0; index + 1 < ordered.length; index += 1) addRelation(ordered[index].id, "precedes", ordered[index + 1].id, { path: "authority/downloads/yaintt.tex", start_line: ordered[index].sourceStart, end_line: ordered[index + 1].sourceStart });
  }
  for (const [boundary, concepts] of conceptsByBoundary) {
    const rootUnitId = rootIdByBoundary.get(boundary);
    for (const concept of concepts) addRelation(rootUnitId, "covers", concept, { path: FINAL_TERMINOLOGY_REL_PATH, sha256: FINAL_TERMINOLOGY_SHA256 });
    for (const exercise of rawNodes.filter((node) => node.boundary === boundary && node.unitType === "exercise")) {
      for (const concept of concepts) addRelation(exercise.id, "exercises", concept, { path: "authority/downloads/yaintt.tex", start_line: exercise.sourceStart, end_line: exercise.sourceEnd });
    }
  }
  for (const concept of records.filter((record) => record.entity_class === "concept")) {
    for (const prerequisite of concept.prerequisite_concept_ids ?? []) addRelation(prerequisite, "prerequisite_for", concept.record_id, concept.evidence ?? null);
  }
  for (const correction of records.filter((record) => record.entity_class === "correction" && Number(record.record_id.split(".").at(-1)) > 45)) {
    for (const affected of correction.affected_unit_ids) addRelation(correction.record_id, "corrects", affected, correction.evidence);
  }

  const allUnitRecords = records.filter((record) => record.entity_class === "unit");
  const labelToUnit = new Map();
  for (const unit of allUnitRecords) if (unit.source_local_id && !unit.source_local_id.startsWith("generated:")) labelToUnit.set(unit.source_local_id, unit.record_id);
  const authorityText = authorityBytes.toString("utf8");
  const authorityLabels = [...authorityText.matchAll(/\\label\{([^{}]+)\}/g)];
  for (const match of authorityLabels) {
    const byteOffset = Buffer.byteLength(authorityText.slice(0, match.index), "utf8");
    let lineNumber = 1;
    while (lineNumber < authorityOffsets.length && authorityOffsets[lineNumber] <= byteOffset) lineNumber += 1;
    const containers = allUnitRecords.filter((unit) => unit.source_locator?.path === "authority/downloads/yaintt.tex" && unit.source_locator.start_line <= lineNumber && unit.source_locator.end_line >= lineNumber);
    containers.sort((a, b) => (a.source_locator.end_line - a.source_locator.start_line) - (b.source_locator.end_line - b.source_locator.start_line));
    if (containers.length && !labelToUnit.has(match[1])) labelToUnit.set(match[1], containers[0].record_id);
  }
  for (const node of rawNodes) {
    if (["chapter", "section", "exercise_group"].includes(node.unitType)) continue;
    const sourceText = span(authorityBytes, authorityOffsets, node.segmentSourceStart, node.segmentSourceEnd, sha256Bytes).text;
    const refs = [...sourceText.matchAll(/\\(?:ref|eqref)\{([^{}]+)\}/g)].map((match) => match[1]);
    for (const ref of new Set(refs)) if (labelToUnit.has(ref)) addRelation(node.id, "references", labelToUnit.get(ref), { path: "authority/downloads/yaintt.tex", start_line: node.segmentSourceStart, end_line: node.segmentSourceEnd });
  }

  const assessmentRows = rawNodes.filter((node) => node.unitType === "exercise").map((node) => ({
    exercise_unit_id: node.id,
    parent_section_id: rootIdByBoundary.get(node.boundary),
    order_key: `${String(node.boundary).padStart(2, "0")}.${String(node.order).padStart(2, "0")}`,
    prompt_segment_id: segmentByUnitId.get(node.id),
    concept_ids: conceptsByBoundary.get(node.boundary) ?? [],
    hint_unit_ids: [],
    answer_unit_ids: [],
    solution_unit_ids: [],
    closure_status: "source_has_none",
  }));
  if (assessmentRows.length !== 43) throw new Error(`expected 43 added assessments, observed ${assessmentRows.length}`);

  const additions = {};
  for (const record of records.slice(startingRecordCount)) additions[record.entity_class] = (additions[record.entity_class] ?? 0) + 1;
  return {
    finalCreatedAt: FINAL_CREATED_AT,
    finalEditionId: FINAL_EDITION_ID,
    finalRightsId: FINAL_RIGHTS_ID,
    finalTargetRelPath: FINAL_TARGET_REL_PATH,
    finalTargetSha256: FINAL_TARGET_SHA256,
    finalTargetBytes: FINAL_TARGET_BYTES,
    finalLedgerRelPath: FINAL_LEDGER_REL_PATH,
    finalLedgerSha256: FINAL_LEDGER_SHA256,
    finalLedgerBytes: ledger.buffer,
    finalTerminologyRelPath: FINAL_TERMINOLOGY_REL_PATH,
    finalTerminologySha256: FINAL_TERMINOLOGY_SHA256,
    finalTerminologyBytes: terminology.buffer,
    additions,
    assessmentRows,
    topology: { boundaries: BOUNDARIES.length, units: rawNodes.length, semanticEnvironments: selectedEnvironmentCount, exerciseGroups: exerciseGroupCount, exercises: exerciseCount },
  };
}
