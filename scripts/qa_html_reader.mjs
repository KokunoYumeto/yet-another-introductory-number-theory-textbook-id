#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { readFile, readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '..');
const docsDir = path.join(repoRoot, 'docs');

const sha256 = (buffer) => createHash('sha256').update(buffer).digest('hex');
const toPosix = (value) => value.split(path.sep).join('/');

async function listFiles(root, relative = '') {
  const entries = await readdir(path.join(root, relative), { withFileTypes: true });
  const files = [];
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    const next = path.join(relative, entry.name);
    if (entry.isDirectory()) files.push(...await listFiles(root, next));
    if (entry.isFile()) files.push(next);
  }
  return files;
}

const allFiles = await listFiles(docsDir);
const htmlFiles = allFiles.filter((name) => name.endsWith('.html'));
const allFileSet = new Set(allFiles.map(toPosix));
const htmlByFile = new Map();
const idsByFile = new Map();
const duplicateIds = [];

for (const relative of htmlFiles) {
  const html = await readFile(path.join(docsDir, relative), 'utf8');
  const normalized = toPosix(relative);
  htmlByFile.set(normalized, html);
  const ids = new Set();
  for (const match of html.matchAll(/\b(?:id|name)=["']([^"']+)["']/gi)) {
    if (ids.has(match[1])) duplicateIds.push({ file: normalized, id: match[1] });
    ids.add(match[1]);
  }
  idsByFile.set(normalized, ids);
}

const missingFiles = [];
const missingAnchors = [];
const localLinks = [];

for (const [relative, html] of htmlByFile) {
  for (const match of html.matchAll(/\b(?:href|src)=["']([^"']+)["']/gi)) {
    const raw = match[1];
    if (/^(?:[a-z]+:|\/\/|data:|mailto:)/i.test(raw)) continue;
    const [pathPartRaw, hashRaw = ''] = raw.split('#', 2);
    const pathPart = decodeURIComponent(pathPartRaw.split('?')[0]);
    let target = pathPart
      ? toPosix(path.normalize(path.join(path.dirname(relative), pathPart)))
      : relative;
    if (target === '.' || target.endsWith('/')) {
      target = toPosix(path.join(target, 'index.html'));
    }

    localLinks.push({ from: relative, target, hash: hashRaw || null });

    if (pathPart && !allFileSet.has(target)) {
      missingFiles.push({ from: relative, reference: raw, target });
      continue;
    }

    if (hashRaw && target.endsWith('.html')) {
      const decodedHash = decodeURIComponent(hashRaw);
      if (!idsByFile.get(target)?.has(decodedHash)) {
        missingAnchors.push({ from: relative, reference: raw, target, hash: decodedHash });
      }
    }
  }
}

const readerHtml = [...htmlByFile.entries()]
  .filter(([name]) => name !== 'index.html')
  .map(([, html]) => html)
  .join('\n');
const readerPageNames = [...htmlByFile.keys()].filter((name) => name.startsWith('reader/'));
const readerHtmlWithoutMathAnnotations = readerHtml.replace(
  /<annotation\b[^>]*>[\s\S]*?<\/annotation>/gi,
  '',
);

const requiredText = [
  'Keterurutan Baik dan Pembagian',
  'Kongruensi',
  'Bilangan Prima',
  'Kriptologi',
  'Indeks = Logaritma Diskret',
  'Daftar Pustaka',
  'Indeks',
];

const requiredTextResults = Object.fromEntries(
  requiredText.map((text) => [text, readerHtml.includes(text)]),
);

const pdf = await readFile(path.join(docsDir, 'YAINTT_ID.pdf'));
const mathmlElements = (readerHtml.match(/<math\b/gi) || []).length;
const unresolvedCitationMarkers = (readerHtml.match(/\[\?\]/g) || []).length;
const unresolvedReferenceMarkers = (readerHtml.match(/\?\?/g) || []).length;
const rawLatexEnvironmentMarkers = (
  readerHtmlWithoutMathAnnotations.match(/\\(?:begin|end)\s*\{/g) || []
).length;
const exerciseMarkers = (readerHtml.match(/(?:class=["'][^"']*\bexercise\b|>Latihan(?:\s|<))/gi) || []).length;
const semanticEnvironmentExpected = {
  discussion: 123,
  exercise: 101,
  proof: 54,
  definition: 50,
  theorem: 44,
  example: 33,
  examples: 1,
  lemma: 3,
  proposition: 11,
  corollary: 5,
  remark: 1,
  WOprinciple: 1,
};
const semanticEnvironmentObserved = Object.fromEntries(
  Object.keys(semanticEnvironmentExpected).map((name) => [
    name,
    (readerHtmlWithoutMathAnnotations.match(
      new RegExp(`<div\\b[^>]*class=["'][^"']*\\b${name}\\b[^"']*["']`, 'gi'),
    ) || []).length,
  ]),
);
const semanticEnvironmentCountsMatch = Object.entries(semanticEnvironmentExpected)
  .every(([name, count]) => semanticEnvironmentObserved[name] === count);
const imageTags = [...readerHtml.matchAll(/<img\b[^>]*>/gi)].map((match) => match[0]);
const imagesMissingAlt = imageTags.filter(
  (tag) => !/\balt=["'][^"']+["']/i.test(tag),
);
const mainLandmarks = (readerHtml.match(/<main\b[^>]*id=["']reader-content["']/gi) || []).length;
const labeledChapterNavs = (
  readerHtml.match(/<nav\b[^>]*id=["']sitenav["'][^>]*aria-label=["']Navigasi bab["']/gi) || []
).length;
const canonicalLinks = (
  readerHtml.match(/<link\b[^>]*rel=["']canonical["'][^>]*href=["']https:\/\/kokunoyumeto\.github\.io\/yet-another-introductory-number-theory-textbook-id\/reader\//gi) || []
).length;
const descriptionMetadata = (readerHtml.match(/<meta\b[^>]*name=["']description["'][^>]*content=["'][^"']+["']/gi) || []).length;
const numberedSections = (readerHtml.match(/<section\b[^>]*class=["']level2["'][^>]*data-number=/gi) || []).length;
const pageStructure = readerPageNames.map((name) => {
  const html = htmlByFile.get(name);
  return {
    file: name,
    h1: (html.match(/<h1\b/gi) || []).length,
    title: html.match(/<title>([^<]+)<\/title>/i)?.[1] || null,
    lang_id_id: /<html\b[^>]*lang=["']id-ID["']/i.test(html),
  };
});
const pageStructureMatches = pageStructure.every((page) => page.h1 === 1 && page.title && page.lang_id_id);

const sourceText = await readFile(path.join(repoRoot, 'source', 'yaintt-id.tex'), 'utf8');
const sourceLabelIds = new Set(
  [...sourceText.matchAll(/\\label\{([^}]+)\}/g)].map((match) => match[1]
    .trim()
    .replace(/[^A-Za-z0-9_.-]+/g, '-')
    .replace(/^-+|-+$/g, '')),
);
const readerIds = new Set(readerPageNames.flatMap((name) => [...idsByFile.get(name)]));
const missingSourceLabelTargets = [...sourceLabelIds].filter((id) => !readerIds.has(id));

const manifestName = 'HTML_READER_MANIFEST.json';
const manifest = JSON.parse(await readFile(path.join(docsDir, manifestName), 'utf8'));
const expectedManifestPaths = new Set(
  allFiles
    .filter((relative) => toPosix(relative) !== manifestName)
    .map((relative) => `docs/${toPosix(relative)}`),
);
const manifestPaths = new Set(manifest.files.map((entry) => entry.path));
const manifestUnlistedFiles = [...expectedManifestPaths].filter((name) => !manifestPaths.has(name));
const manifestUnexpectedFiles = [...manifestPaths].filter((name) => !expectedManifestPaths.has(name));
const manifestHashMismatches = [];
for (const entry of manifest.files) {
  if (!entry.path.startsWith('docs/')) {
    manifestHashMismatches.push({ path: entry.path, reason: 'path_outside_docs' });
    continue;
  }
  const relative = entry.path.slice('docs/'.length).split('/').join(path.sep);
  if (!allFileSet.has(toPosix(relative))) continue;
  const bytes = await readFile(path.join(docsDir, relative));
  if (entry.bytes !== bytes.length || entry.sha256 !== sha256(bytes)) {
    manifestHashMismatches.push({
      path: entry.path,
      expected_bytes: entry.bytes,
      observed_bytes: bytes.length,
      expected_sha256: entry.sha256,
      observed_sha256: sha256(bytes),
    });
  }
}
const manifestIntegrityPassed = (
  manifest.status === 'complete'
  && manifestUnlistedFiles.length === 0
  && manifestUnexpectedFiles.length === 0
  && manifestHashMismatches.length === 0
);

const pass = (
  htmlFiles.length === 11
  && Object.values(requiredTextResults).every(Boolean)
  && missingFiles.length === 0
  && missingAnchors.length === 0
  && unresolvedCitationMarkers === 0
  && unresolvedReferenceMarkers === 0
  && rawLatexEnvironmentMarkers === 0
  && exerciseMarkers >= semanticEnvironmentExpected.exercise
  && semanticEnvironmentCountsMatch
  && imagesMissingAlt.length === 0
  && imageTags.length === 9
  && mainLandmarks === readerPageNames.length
  && labeledChapterNavs === readerPageNames.length
  && canonicalLinks === readerPageNames.length
  && descriptionMetadata === readerPageNames.length
  && numberedSections === 27
  && pageStructureMatches
  && duplicateIds.length === 0
  && sourceLabelIds.size === 157
  && missingSourceLabelTargets.length === 0
  && manifestIntegrityPassed
  && pdf.length === 962527
  && sha256(pdf) === '1ded3c6844b656347259b464bf21526fdc32dc2246c73ac58ab76ed28688eefc'
);

const report = {
  schema: 'r014.html_reader_qa',
  schema_version: '1.2.0',
  work_id: 'ttp.r014.yaintt',
  locale: 'id-ID',
  status: pass ? 'passed' : 'failed',
  metrics: {
    total_files: allFiles.length,
    html_files: htmlFiles.length,
    html_bytes: (await Promise.all(htmlFiles.map(async (name) => (await stat(path.join(docsDir, name))).size))).reduce((a, b) => a + b, 0),
    local_links: localLinks.length,
    missing_files: missingFiles.length,
    missing_anchors: missingAnchors.length,
    mathml_elements: mathmlElements,
    exercise_markers: exerciseMarkers,
    semantic_environment_counts_match: semanticEnvironmentCountsMatch,
    semantic_environment_expected: semanticEnvironmentExpected,
    semantic_environment_observed: semanticEnvironmentObserved,
    image_elements: imageTags.length,
    images_missing_nonempty_alt: imagesMissingAlt.length,
    main_landmarks: mainLandmarks,
    labeled_chapter_navigation_landmarks: labeledChapterNavs,
    canonical_links: canonicalLinks,
    description_metadata: descriptionMetadata,
    numbered_sections: numberedSections,
    page_structure_matches: pageStructureMatches,
    duplicate_ids: duplicateIds.length,
    source_labels: sourceLabelIds.size,
    missing_source_label_targets: missingSourceLabelTargets.length,
    manifest_integrity_passed: manifestIntegrityPassed,
    unresolved_citation_markers: unresolvedCitationMarkers,
    unresolved_reference_markers: unresolvedReferenceMarkers,
    raw_latex_environment_markers: rawLatexEnvironmentMarkers,
  },
  required_text: requiredTextResults,
  pdf: {
    path: 'docs/YAINTT_ID.pdf',
    pages: 138,
    bytes: pdf.length,
    sha256: sha256(pdf),
  },
  findings: {
    missing_files: missingFiles,
    missing_anchors: missingAnchors,
    images_missing_nonempty_alt: imagesMissingAlt,
    duplicate_ids: duplicateIds,
    missing_source_label_targets: missingSourceLabelTargets,
    page_structure: pageStructure,
    manifest: {
      unlisted_files: manifestUnlistedFiles,
      unexpected_files: manifestUnexpectedFiles,
      hash_mismatches: manifestHashMismatches,
    },
  },
};

await writeFile(
  path.join(repoRoot, 'qa', 'HTML_READER_QA.json'),
  `${JSON.stringify(report, null, 2)}\n`,
  'utf8',
);

process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
if (!pass) process.exitCode = 1;
