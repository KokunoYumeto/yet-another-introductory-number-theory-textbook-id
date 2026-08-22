import fs from "node:fs";
import path from "node:path";

const CREATED_AT = "2026-08-22T03:56:00+02:00";
const FINAL_EDITION_ID = "ttp.r014.edition.id-id.boundary28-final";
const CANDIDATE_EDITION_ID = "ttp.r014.edition.id-id.boundary28-r2";
const FINAL_SOURCE_ARTIFACT_ID = "ttp.r014.artifact.target-source.boundary28-final";
const FINAL_SOURCE_QA_ID = "ttp.r014.qa.boundary28-final-source-freeze";
const FINAL_SOURCE = {
  path: "qa/frozen-boundaries/boundary28-final/yaintt-id.tex",
  bytes: 269464,
  sha256: "b1dd2926dc8bfdb84c6a3b4605490a8d96b14c44d89653867160d701fa0f17db",
};

const CANONICAL_EVIDENCE = [
  { number: 20, build: ["qa/BOUNDARY20_BUILD.json", 5716, "9a01263fce5b1d6b8d554f6a3e9639271a9ba0f333a32f382cc05abeed0e529b"], visual: ["qa/BOUNDARY20_VISUAL.json", 3143, "15cdba4c28c6b3fa16000fb6a77e861042f580ad1e7d21771978e6a09cadef6a"], pdf: ["output/YAINTT_ID_BOUNDARY20.pdf", 753084, "b17e142502288b08eaca055060d412d7fd3cdf4c246de9b1582adc8e09e0fdfe", 103] },
  { number: 21, build: ["qa/BOUNDARY21_BUILD.json", 5728, "fc788f9a50c3de71f41cd5a59a39c885fd3c4518afd8ce21b107c030dc2b1a37"], visual: ["qa/BOUNDARY21_VISUAL.json", 3301, "395890557f499fbaea49e0ce35a76e5e74b0d72cffb684ba64deb2df2ab17f5e"], pdf: ["output/YAINTT_ID_BOUNDARY21.pdf", 777400, "bb9ad104576e4b61b54e55451d526f94be2399fb53352f105754b12177aa2046", 107] },
  { number: 22, build: ["qa/BOUNDARY22_BUILD.json", 6039, "916bceebc4ec9649ef4ae48856c7a70fdf997b5772446ef5b501cb6bd71bb1dc"], visual: ["qa/BOUNDARY22_VISUAL.json", 4483, "bc7f4b8445b638b44f3fb62bb13fb6729e36218662f98d43cc8e6a040ee82ea5"], pdf: ["output/YAINTT_ID_BOUNDARY22.pdf", 791075, "27536429f962e5af3321cdad6a00a12ced0031f37845f4bad4cfb6125c2bfac9", 111] },
  { number: 23, build: ["qa/BOUNDARY23_BUILD.json", 5994, "6b628803fce21b4d0e7530f7ab6001a88658736f943e00571e167c5d892f15dd"], visual: ["qa/BOUNDARY23_VISUAL.json", 4597, "4b95d52d82f3c578f1f51827860b60a6527e751c41ba49b998d7dc4368b9dedc"], pdf: ["output/YAINTT_ID_BOUNDARY23.pdf", 816756, "719fe1592c8a1748b1dc7bf1cae8f10fe00d249a59f7843739e745a1e84c68b9", 114] },
  { number: 24, build: ["qa/BOUNDARY24_BUILD.json", 6859, "5b2beb56139c56cd58a753fd8a11e7a1f55989be284443092065dac23ae3a235"], visual: ["qa/BOUNDARY24_VISUAL.json", 5548, "776ff1f8e179ac0c5269b5da8ee35b7eae803d2d9dc8d770d304e2f023aaade2"], pdf: ["output/YAINTT_ID_BOUNDARY24.pdf", 832452, "8815a9a16c19529cfa505be8c1dcdf8a2319d7010d56e636c170a16179b0024f", 118] },
  { number: 25, build: ["qa/BOUNDARY25_BUILD.json", 6186, "ced14aa2fff399d8c9b2c972c15c3e369c032b8b5e907a722894004003d5da6d"], visual: ["qa/BOUNDARY25_VISUAL.json", 4992, "0e72412cbdef3d11e358ffa1fcdf82862d940ef2a74bc84852432bba2f18c71b"], pdf: ["output/YAINTT_ID_BOUNDARY25.pdf", 874882, "95dde8dbd45dcfdf7580d5a81672a137ec7275ff4cb1a40435c128f6caa6c154", 124] },
  { number: 26, build: ["qa/BOUNDARY26_BUILD.json", 6205, "9c53a68af6d0a6b26144da5d1c8a46cffd297bff8f75e73421da1cee4c96bd21"], visual: ["qa/BOUNDARY26_VISUAL.json", 5132, "07162fb087693d5b2aad108bacf2d8835a05584452d3e4987b329c3aadd922b3"], pdf: ["output/YAINTT_ID_BOUNDARY26.pdf", 899343, "28f497d2cdfee61c85b37a62873184f5a2348f73c1daef7ac7c56d10dc2dd169", 128] },
  { number: 27, build: ["qa/BOUNDARY27_BUILD.json", 6271, "f2df52416545380a8347c96e895d2bc6dbb85d7a7d3ba7cd19c1341db78d24d7"], visual: ["qa/BOUNDARY27_VISUAL.json", 5268, "e089c64c0b67a63fdc9c53fac63b499e768ca3aeb1e642bb53ab707f0cc8b24b"], pdf: ["output/YAINTT_ID_BOUNDARY27.pdf", 934433, "1fb63e1d1bd1643f5a2296b2e36b7503348ac21f307f502d912fcc2b3bcfeccf", 132] },
  { number: 28, build: ["qa/FINAL_BUILD.json", 7395, "d112b48de7032c2eda809419eadaaafdec089c8b6c5886db8501ab226c8123e2"], visual: ["qa/FINAL_VISUAL.json", 5729, "4d69b0335cb59477117209ba2c62347afc758c73d9bde9a19c6b25df10851292"], pdf: ["output/YAINTT_ID.pdf", 962527, "1ded3c6844b656347259b464bf21526fdc32dc2246c73ac58ab76ed28688eefc", 138] },
];

function absolute(root, relative) {
  return path.join(root, ...relative.split("/"));
}

function assertFile(root, spec, sha256File) {
  const [relative, bytes, sha256] = spec;
  const filename = absolute(root, relative);
  const stat = fs.statSync(filename);
  const observed = sha256File(filename);
  if (stat.size !== bytes || observed !== sha256) throw new Error(`canonical reader evidence drift: ${relative} expected ${bytes}/${sha256}, observed ${stat.size}/${observed}`);
  return { relative, filename, bytes, sha256 };
}

function findPath(value, wanted) {
  if (!value || typeof value !== "object") return null;
  if (!Array.isArray(value) && value.path === wanted && typeof value.sha256 === "string") return value;
  for (const child of Object.values(value)) {
    const found = findPath(child, wanted);
    if (found) return found;
  }
  return null;
}

export function admitCanonicalReaderEvidence(context) {
  const { root, records, relationRecords, baseRecord, sha256File, sourceEditionId } = context;
  const startingCount = records.length;
  if (startingCount !== 5180) throw new Error(`complete reviewed backend baseline drift: ${startingCount}`);
  const admittedIds = new Set(records.map((record) => record.record_id));
  if (admittedIds.size !== 5180) throw new Error("complete reviewed backend contains duplicate IDs");

  const fullBase = (entityClass, recordId, overrides = {}) => {
    const clean = Object.fromEntries(Object.entries(overrides).filter(([, value]) => value !== undefined));
    return baseRecord(entityClass, recordId, { created_at: CREATED_AT, ...clean });
  };
  const source = assertFile(root, [FINAL_SOURCE.path, FINAL_SOURCE.bytes, FINAL_SOURCE.sha256], sha256File);
  const canonicalArtifacts = [];
  const addArtifact = (recordId, file, mediaType, receiptId, toolchain, pages = null) => {
    const artifact = fullBase("artifact", recordId, {
      edition_id: FINAL_EDITION_ID,
      locale: mediaType === "application/pdf" ? "id-ID" : "und",
      path: file.relative,
      media_type: mediaType,
      bytes: file.bytes,
      sha256: file.sha256,
      toolchain,
      build_receipt_id: receiptId,
      reproducible: true,
      pages,
      file_manifest: null,
    });
    records.push(artifact);
    canonicalArtifacts.push(recordId);
    return artifact;
  };

  addArtifact(FINAL_SOURCE_ARTIFACT_ID, source, "application/x-tex", FINAL_SOURCE_QA_ID, "byte-identical canonical source freeze");
  records.push(fullBase("qa_event", FINAL_SOURCE_QA_ID, {
    edition_id: FINAL_EDITION_ID,
    locale: "und",
    qa_type: "source_freeze",
    result: "pass",
    witness_ids: [FINAL_SOURCE_ARTIFACT_ID],
    evidence: { path: FINAL_SOURCE.path, bytes: FINAL_SOURCE.bytes, sha256: FINAL_SOURCE.sha256, byte_identical_to_review_candidate: true },
    method: "exact byte-count and SHA-256 identity against the admitted Boundary 28-r2 review candidate",
    event_timestamp: CREATED_AT,
  }));

  const canonicalQaIds = [];
  for (const evidence of CANONICAL_EVIDENCE) {
    const buildFile = assertFile(root, evidence.build, sha256File);
    const visualFile = assertFile(root, evidence.visual, sha256File);
    const pdfFile = assertFile(root, evidence.pdf, sha256File);
    const buildReceipt = JSON.parse(fs.readFileSync(buildFile.filename, "utf8"));
    const visualReceipt = JSON.parse(fs.readFileSync(visualFile.filename, "utf8"));
    if (!String(buildReceipt.status ?? "").startsWith("passed_canonical") || !String(visualReceipt.status ?? "").startsWith("passed_canonical")) throw new Error(`Boundary ${evidence.number} receipts are not canonical passes`);
    for (const receipt of [buildReceipt, visualReceipt]) {
      const identity = findPath(receipt, pdfFile.relative);
      if (!identity || identity.bytes !== pdfFile.bytes || identity.sha256 !== pdfFile.sha256 || identity.pages !== evidence.pdf[3]) throw new Error(`Boundary ${evidence.number} receipt/PDF identity disagreement`);
    }

    const buildQaId = `ttp.r014.qa.boundary${evidence.number}-build-canonical`;
    const visualQaId = `ttp.r014.qa.boundary${evidence.number}-visual-canonical`;
    const pdfArtifactId = `ttp.r014.artifact.boundary${evidence.number}-pdf-canonical`;
    const buildArtifactId = `ttp.r014.artifact.boundary${evidence.number}-build-receipt-canonical`;
    const visualArtifactId = `ttp.r014.artifact.boundary${evidence.number}-visual-receipt-canonical`;
    addArtifact(pdfArtifactId, pdfFile, "application/pdf", buildQaId, "canonical deterministic LaTeX reader build", evidence.pdf[3]);
    addArtifact(buildArtifactId, buildFile, "application/json", buildQaId, "canonical build receipt");
    addArtifact(visualArtifactId, visualFile, "application/json", visualQaId, "canonical all-page visual receipt");
    const priorBuildId = evidence.number <= 24 ? `ttp.r014.qa.boundary${evidence.number}-build-evidence` : `ttp.r014.qa.boundary${evidence.number}-build-pending`;
    const priorVisualId = evidence.number <= 24 ? `ttp.r014.qa.boundary${evidence.number}-visual-evidence` : null;
    records.push(fullBase("qa_event", buildQaId, {
      edition_id: FINAL_EDITION_ID,
      locale: "und",
      qa_type: "build",
      result: "pass",
      witness_ids: [pdfArtifactId, buildArtifactId, FINAL_SOURCE_ARTIFACT_ID],
      evidence: { path: buildFile.relative, bytes: buildFile.bytes, sha256: buildFile.sha256, pdf_path: pdfFile.relative, pdf_bytes: pdfFile.bytes, pdf_sha256: pdfFile.sha256, pages: evidence.pdf[3], receipt_status: buildReceipt.status },
      method: "admitted canonical deterministic reader-build receipt",
      event_timestamp: CREATED_AT,
      supersedes: priorBuildId,
    }));
    records.push(fullBase("qa_event", visualQaId, {
      edition_id: FINAL_EDITION_ID,
      locale: "und",
      qa_type: "visual",
      result: "pass",
      witness_ids: [pdfArtifactId, visualArtifactId],
      evidence: { path: visualFile.relative, bytes: visualFile.bytes, sha256: visualFile.sha256, pdf_path: pdfFile.relative, pdf_bytes: pdfFile.bytes, pdf_sha256: pdfFile.sha256, pages: evidence.pdf[3], receipt_status: visualReceipt.status },
      method: "admitted canonical all-page visual inspection receipt",
      event_timestamp: CREATED_AT,
      supersedes: priorVisualId,
    }));
    canonicalQaIds.push(buildQaId, visualQaId);
  }

  records.push(fullBase("edition", FINAL_EDITION_ID, {
    edition_id: FINAL_EDITION_ID,
    locale: "id-ID",
    edition_kind: "complete_built_and_visually_checked_indonesian_edition",
    source_snapshot_id: "yaintt-source-2014-05-07",
    source_edition_id: sourceEditionId,
    file_ids: canonicalArtifacts,
    translation_state: "visually_checked",
    declared_timestamp: CREATED_AT,
    authority_manifest_path: "authority/SOURCE_AUTHORITY.json",
    build_recipe: "Canonical 138-page deterministic reader admitted by FINAL_BUILD.json and FINAL_VISUAL.json.",
    translated_through: "sec:tEGC",
    next_cursor: "release packaging and publication",
    rights_id: "rights.yaintt.id-id.derivative.boundary28-r2",
    supersedes: CANDIDATE_EDITION_ID,
  }));

  let relationIndex = 0;
  const addRelation = (subjectId, predicate, objectId, evidenceLocator) => {
    relationIndex += 1;
    const relation = fullBase("relation", `ttp.r014.relation.canonical.${String(relationIndex).padStart(4, "0")}`, {
      edition_id: FINAL_EDITION_ID,
      locale: "und",
      subject_id: subjectId,
      predicate,
      object_id: objectId,
      relation_order: relationIndex,
      evidence_locator: evidenceLocator,
      confidence: "verified",
    });
    records.push(relation);
    relationRecords.push(relation);
  };
  addRelation(FINAL_EDITION_ID, "supersedes", CANDIDATE_EDITION_ID, { path: FINAL_SOURCE.path, sha256: FINAL_SOURCE.sha256 });
  addRelation(FINAL_EDITION_ID, "translates", sourceEditionId, { path: FINAL_SOURCE.path, sha256: FINAL_SOURCE.sha256 });
  addRelation(FINAL_EDITION_ID, "adapts", sourceEditionId, { path: "qa/FINAL_BUILD.json", sha256: CANONICAL_EVIDENCE.at(-1).build[2] });
  for (const artifactId of canonicalArtifacts) addRelation(FINAL_EDITION_ID, "contains", artifactId, { path: "qa/FINAL_BUILD.json", sha256: CANONICAL_EVIDENCE.at(-1).build[2] });
  for (const asset of records.filter((record) => record.entity_class === "asset" && !/by-sa\.eps$/i.test(record.path ?? ""))) addRelation(FINAL_EDITION_ID, "depends_on", asset.record_id, { path: asset.path, sha256: asset.sha256 });

  const newIds = records.slice(startingCount).map((record) => record.record_id);
  if (new Set(newIds).size !== newIds.length || newIds.some((recordId) => admittedIds.has(recordId))) throw new Error("canonical reader admission ID collision");
  const additions = {};
  for (const record of records.slice(startingCount)) additions[record.entity_class] = (additions[record.entity_class] ?? 0) + 1;
  const expected = { artifact: 28, edition: 1, qa_event: 19, relation: 44 };
  if (JSON.stringify(Object.fromEntries(Object.entries(additions).sort())) !== JSON.stringify(Object.fromEntries(Object.entries(expected).sort()))) throw new Error(`canonical reader admission count drift: ${JSON.stringify(additions)}`);
  return {
    additions,
    createdAt: CREATED_AT,
    finalEditionId: FINAL_EDITION_ID,
    finalTargetPath: FINAL_SOURCE.path,
    finalTargetSha256: FINAL_SOURCE.sha256,
    finalPdf: { path: CANONICAL_EVIDENCE.at(-1).pdf[0], bytes: CANONICAL_EVIDENCE.at(-1).pdf[1], sha256: CANONICAL_EVIDENCE.at(-1).pdf[2], pages: CANONICAL_EVIDENCE.at(-1).pdf[3] },
    canonicalBoundaries: CANONICAL_EVIDENCE.map((item) => item.number),
    canonicalQaIds,
  };
}
