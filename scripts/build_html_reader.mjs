#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import {
  copyFile,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rm,
  stat,
  writeFile,
} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '..');
const docsDir = path.join(repoRoot, 'docs');
const readerDir = path.join(docsDir, 'reader');
const sourceDir = path.join(repoRoot, 'source');
const sourceFile = path.join(sourceDir, 'yaintt-id.tex');
const bibFile = path.join(sourceDir, 'refs.bib');
const sourceAssets = path.join(sourceDir, 'assets');
const publicBase = 'https://kokunoyumeto.github.io/yet-another-introductory-number-theory-textbook-id/';
const localAppData = process.env.LOCALAPPDATA;
if (!localAppData) throw new Error('LOCALAPPDATA is required to locate default build tools');

const pandoc = process.env.PANDOC
  || path.join(localAppData, 'Pandoc', 'pandoc.exe');
const epstopdf = process.env.EPSTOPDF
  || path.join(localAppData, 'Programs', 'MiKTeX', 'miktex', 'bin', 'x64', 'epstopdf.exe');
const pdftocairo = process.env.PDFTOCAIRO
  || path.join(localAppData, 'Programs', 'MiKTeX', 'miktex', 'bin', 'x64', 'pdftocairo.exe');

const assetNames = [
  'cover_art',
  'dbend',
  'Scytale',
  'eng_freq_hist',
  'samp_Cct_hist',
  'seadk_Cct',
  'seadk_rkkrt',
  'hamhip_freqs',
  'seadk_hamhip',
];

const imageAlt = {
  'cover_art.png': 'Sampul bergambar untuk buku teori bilangan',
  'dbend.png': 'Tanda peringatan untuk bagian dengan penalaran rumit',
  'Scytale.png': 'Skytale, alat kriptografi transposisi klasik',
  'eng_freq_hist.png': 'Histogram frekuensi huruf dalam bahasa Inggris',
  'samp_Cct_hist.png': 'Histogram frekuensi huruf pada contoh cipherteks',
  'seadk_Cct.png': 'Grafik galat kuadrat menurut kunci dekripsi untuk cipherteks contoh; minimum pada kunci 23',
  'seadk_rkkrt.png': 'Grafik galat kuadrat menurut kunci dekripsi untuk contoh rkkrt; minimum pada kunci 9',
  'hamhip_freqs.png': 'Frekuensi huruf pada contoh Hamlet',
  'seadk_hamhip.png': 'Grafik galat kuadrat menurut kunci dekripsi untuk cuplikan Hamlet; minimum pada kunci 23',
};

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

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd || repoRoot,
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
    ...options,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error([
      `Command failed (${result.status}): ${command}`,
      result.stdout || '',
      result.stderr || '',
    ].filter(Boolean).join('\n'));
  }
  return result;
}

function evaluateUndefinedConditionals(source) {
  const output = [];
  const stack = [];
  let enabled = true;

  for (const line of source.split('\n')) {
    const trimmed = line.trim();
    if (/^\\ifdefined\\[A-Za-z@]+\s*$/.test(trimmed)) {
      stack.push({ parentEnabled: enabled, inElse: false });
      enabled = false;
      continue;
    }
    if (trimmed === '\\else') {
      const current = stack.at(-1);
      if (!current) throw new Error('Unmatched \\else in source');
      if (current.inElse) throw new Error('Repeated \\else in source conditional');
      current.inElse = true;
      enabled = current.parentEnabled;
      continue;
    }
    if (trimmed === '\\fi') {
      const current = stack.pop();
      if (!current) throw new Error('Unmatched \\fi in source');
      enabled = current.parentEnabled;
      continue;
    }
    if (enabled) output.push(line);
  }

  if (stack.length) throw new Error('Unclosed \\ifdefined block in source');
  return output.join('\n');
}

function replaceBalancedIndexCommands(source) {
  const entries = [];
  let output = '';
  let cursor = 0;
  let currentAnchor = null;

  while (cursor < source.length) {
    const start = source.indexOf('\\index{', cursor);
    if (start < 0) {
      output += source.slice(cursor);
      break;
    }
    const segment = source.slice(cursor, start);
    output += segment;
    for (const match of segment.matchAll(/\\label\{([^}]+)\}/g)) currentAnchor = match[1];
    let depth = 1;
    let position = start + '\\index{'.length;
    const contentStart = position;
    for (; position < source.length && depth > 0; position += 1) {
      const char = source[position];
      const escaped = position > 0 && source[position - 1] === '\\';
      if (!escaped && char === '{') depth += 1;
      if (!escaped && char === '}') depth -= 1;
    }
    if (depth !== 0) throw new Error(`Unclosed \\index command at byte ${start}`);
    const raw = source.slice(contentStart, position - 1).trim();
    entries.push({ anchor: currentAnchor, raw });
    cursor = position;
  }

  return { source: output, entries };
}

function indexDisplay(raw) {
  const seeMatch = raw.match(/^(.*?)\|lihat\{([\s\S]*)\}$/);
  const base = (seeMatch ? seeMatch[1] : raw).replaceAll('!', ' -- ');
  return seeMatch ? `${base} (lihat ${seeMatch[2]})` : base;
}

function appendWebIndex(source, entries) {
  const groups = new Map();
  for (const entry of entries) {
    if (!groups.has(entry.raw)) groups.set(entry.raw, []);
    if (entry.anchor && !groups.get(entry.raw).includes(entry.anchor)) {
      groups.get(entry.raw).push(entry.anchor);
    }
  }

  const sorted = [...groups.entries()].sort(([a], [b]) =>
    a.localeCompare(b, 'id', { sensitivity: 'base' })
  );
  const lines = [
    '',
    '\\chapter*{Indeks}',
    '\\label{indeks-web}',
    '\\begin{itemize}',
  ];
  for (const [raw, anchors] of sorted) {
    const links = anchors.map((anchor) => `\\ref{${anchor}}`).join(', ');
    lines.push(`\\item ${indexDisplay(raw)}${links ? `: ${links}` : ''}`);
  }
  lines.push('\\end{itemize}', '');
  return `${source.trim()}\n${lines.join('\n')}`;
}

function normalizeReferenceIds(source) {
  return source.replace(
    /\\(label|ref|hyperlink)\{([^}]+)\}/g,
    (_match, command, id) => {
      const safe = id
        .trim()
        .replace(/[^A-Za-z0-9_.-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      return `\\${command}{${safe}}`;
    },
  );
}

function preprocess(source) {
  const normalized = source.replace(/\r\n/g, '\n');
  const begin = normalized.indexOf('\\begin{document}');
  const firstContent = normalized.indexOf('\\begin{preface}', begin);
  const end = normalized.lastIndexOf('\\end{document}');
  if (begin < 0 || firstContent < 0 || end < 0) throw new Error('Document boundaries not found');

  let body = normalized.slice(firstContent, end);
  body = evaluateUndefinedConditionals(body);
  body = body
    .replace(/^\s*\\(?:frontmatter|mainmatter|backmatter|tableofcontents|printindex|restorepagecolor)\s*$/gm, '')
    .replace(/^\s*\\bibliographystyle\{[^}]+\}\s*$/gm, '')
    .replace(/^\s*\\bibliography\{[^}]+\}\s*$/gm, '')
    .replace(/^\s*\\let\\finishboundary[A-Za-z]+\\relax\s*$/gm, '')
    .replace(/^\s*\\finishboundary[A-Za-z]+\s*$/gm, '')
    .replace(/\\pmod\*\{/g, '\\pmod{')
    .replace(/\\begin\{wrapfigure\}(?:\[[^\]]*\])?\{[^}]*\}\{[^}]*\}/g, '\\begin{figure}')
    .replace(/\\end\{wrapfigure\}/g, '\\end{figure}')
    .replace(/\\includegraphics(?:\[[^\]]*\])?\{([^}]+)\.eps\}/g, '\\includegraphics{assets/$1.png}')
    .replace(/\\hskip\s*-?\d*\.?\d+\s*(?:cm|mm|pt|em|ex|in)\b/g, '')
    .replace(/\\hspace\{\s*(-?\d*\.?\d+)\s+(cm|mm|pt|em|ex|in)\s*\}/g, '\\hspace{$1$2}')
    .replace(/\\(?:bigm|Bigm)\s*\|/g, '\\mid ')
    .replace(/\\text\{\\it\s+/g, '\\text{')
    .replace(/\\vphantom\{\\begin\{matrix\}1\\\\1\\end\{matrix\}\}/g, '')
    // Pandoc treats a literal opening bracket immediately after a theorem-like
    // environment as an optional title. This source note spans two discussion
    // environments and a definition, so make its bracket punctuation explicit.
    .replace(
      /\\begin\{discussion\}\s*\n\[Catatan:/g,
      '\\begin{discussion}\n{\\it Catatan:}',
    )
    .replace(
      /dua peubah tak diketahui, \$x\$ dan \$y\$\.\]/g,
      'dua peubah tak diketahui, $x$ dan $y$.',
    )
    .replace(/\\idtimestamp\b/g, '07 Mei 2014 11:04 MDT')
    .replace(/\\timestamp\b/g, '07 Mei 2014 11:04 MDT');

  const indexed = replaceBalancedIndexCommands(body);
  const definitions = String.raw`
\newtheorem{theorem}{Teorema}[section]
\newtheorem{corollary}[theorem]{Akibat}
\newtheorem{lemma}[theorem]{Lema}
\newtheorem{proposition}[theorem]{Proposisi}
\newtheorem{examples}[theorem]{Contoh-contoh}
\newtheorem{definition}[theorem]{Definisi}
\newtheorem{exercise}{Latihan}
\newtheorem{remark}[theorem]{Catatan}
\newtheorem{example}[theorem]{Contoh}
\newtheorem*{WOprinciple}{Prinsip Keterurutan Baik}
\newcommand{\NN}{{\mathbb N}}
\newcommand{\RR}{{\mathbb R}}
\newcommand{\QQ}{{\mathbb Q}}
\newcommand{\ZZ}{{\mathbb Z}}
\newcommand{\Cc}{{\mathcal C}}
\newcommand{\Dd}{{\mathcal D}}
\newcommand{\Ee}{{\mathcal E}}
\newcommand{\Ff}{{\mathcal F}}
\newcommand{\Kk}{{\mathcal K}}
\newcommand{\Mm}{{\mathcal M}}
\newcommand{\Pp}{{\mathcal P}}
\newcommand{\ind}{\operatorname{ind}}
\newcommand{\ord}{\operatorname{ord}}
\newcommand{\lihat}[2]{\emph{lihat} #1}
`;

  return {
    source: normalizeReferenceIds(
      appendWebIndex(`${definitions}\n${indexed.source}`, indexed.entries),
    ),
    indexEntries: indexed.entries.length,
  };
}

async function htmlFiles(root) {
  return (await readdir(root)).filter((name) => name.endsWith('.html')).sort();
}

function findChapterFiles(sitemap) {
  const chapters = [];
  const visit = (node) => {
    if (node?.section?.level === '1' && node.section.number) {
      chapters.push({
        number: Number(node.section.number),
        path: node.section.path.split('#')[0],
        title: node.section.title,
      });
    }
    for (const child of node?.subsections || []) visit(child);
  };
  visit(sitemap);
  return chapters.sort((a, b) => a.number - b.number);
}

const tempRoot = await mkdtemp(path.join(os.tmpdir(), 'r014-html-reader-build-'));
if (!path.resolve(tempRoot).startsWith(path.resolve(os.tmpdir()))) {
  throw new Error('Refusing to use unexpected temporary directory');
}

try {
  const tempAssets = path.join(tempRoot, 'assets');
  await mkdir(tempAssets, { recursive: true });

  for (const name of assetNames) {
    const eps = path.join(sourceAssets, `${name}.eps`);
    const pdf = path.join(tempAssets, `${name}.pdf`);
    const pngBase = path.join(tempAssets, name);
    run(epstopdf, [eps, `--outfile=${pdf}`]);
    run(pdftocairo, ['-png', '-singlefile', '-r', '144', pdf, pngBase]);
  }

  const source = await readFile(sourceFile, 'utf8');
  const prepared = preprocess(source);
  const preparedFile = path.join(tempRoot, 'yaintt-id-web.tex');
  await writeFile(preparedFile, prepared.source, 'utf8');

  if (await readdir(docsDir).then((names) => names.includes('reader'))) {
    const resolved = path.resolve(readerDir);
    if (!resolved.startsWith(`${path.resolve(docsDir)}${path.sep}`)) {
      throw new Error('Refusing to replace reader outside docs directory');
    }
    await rm(resolved, { recursive: true, force: true });
  }
  const result = run(pandoc, [
    '--from=latex+latex_macros',
    '--to=chunkedhtml',
    '--standalone',
    '--mathml',
    '--number-sections',
    '--top-level-division=chapter',
    '--section-divs',
    '--toc',
    '--toc-depth=3',
    '--split-level=1',
    '--citeproc',
    `--bibliography=${bibFile}`,
    '--metadata=link-citations:true',
    '--metadata=reference-section-title:Daftar Pustaka',
    '--metadata=lang:id-ID',
    '--metadata=title:Satu Lagi Buku Teks Pengantar Teori Bilangan',
    '--metadata=subtitle:Versi dengan Penekanan pada Kriptologi — Edisi Bahasa Indonesia',
    '--metadata=author:Jonathan A. Poritz; berdasarkan karya Wissam Raji',
    '--metadata=rights:CC BY-SA 4.0; lihat atribusi komponen',
    '--css=../site.css',
    `--include-after-body=${path.join(scriptDir, 'reader_after.html')}`,
    `--resource-path=${[tempRoot, sourceDir, tempAssets].join(path.delimiter)}`,
    `--output=${readerDir}`,
    preparedFile,
  ]);

  const assetsOut = path.join(readerDir, 'assets');
  await mkdir(assetsOut, { recursive: true });
  for (const name of assetNames) {
    await copyFile(path.join(tempAssets, `${name}.png`), path.join(assetsOut, `${name}.png`));
  }

  const pages = await htmlFiles(readerDir);
  for (const page of pages) {
    const filename = path.join(readerDir, page);
    let html = await readFile(filename, 'utf8');
    html = html
      .replaceAll('<em>Proof.</em>', '<em>Bukti.</em>')
      .replaceAll('<span class="proof-title">Proof.</span>', '<span class="proof-title">Bukti.</span>')
      .replace('<nav id="sitenav">', '<nav id="sitenav" aria-label="Navigasi bab">')
      .replaceAll('>Up:</span>', '>Induk:</span>')
      .replaceAll('>Top:</span>', '>Awal:</span>')
      .replaceAll('>Next:</span>', '>Berikutnya:</span>')
      .replaceAll('>Previous:</span>', '>Sebelumnya:</span>');
    const pageTitle = html.match(/<title>([^<]+)<\/title>/i)?.[1] || 'Pembaca Teori Bilangan';
    html = html.replace(
      '</head>',
      [
        '  <meta name="description" content="Edisi lengkap bahasa Indonesia yang dapat di-reflow dari buku pengantar teori bilangan dan kriptologi." />',
        `  <link rel="canonical" href="${publicBase}reader/${page}" />`,
        `  <meta property="og:title" content="${pageTitle}" />`,
        '  <meta property="og:type" content="book" />',
        '</head>',
      ].join('\n'),
    );
    for (const [asset, alt] of Object.entries(imageAlt)) {
      const escaped = asset.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const expression = new RegExp(`<img\\b[^>]*src=["'][^"']*${escaped}["'][^>]*>`, 'gi');
      html = html.replace(expression, (tag) => {
        if (/\balt=["'][^"']*["']/i.test(tag)) {
          return tag.replace(/\balt=["'][^"']*["']/i, `alt="${alt}"`);
        }
        return tag.replace(/\s*\/?\s*>$/, ` alt="${alt}" />`);
      });
    }
    const navEnd = html.indexOf('</nav>');
    const readerScript = html.lastIndexOf('<script src="../reader.js"></script>');
    if (navEnd < 0 || readerScript < 0 || readerScript <= navEnd) {
      throw new Error(`Could not identify reader content boundaries in ${page}`);
    }
    const contentStart = navEnd + '</nav>'.length;
    html = [
      html.slice(0, contentStart),
      '\n<main id="reader-content" tabindex="-1">',
      html.slice(contentStart, readerScript).trim(),
      '</main>\n',
      html.slice(readerScript),
    ].join('\n');
    const seenIds = new Map();
    html = html.replace(/\bid=(["'])([^"']+)\1/gi, (match, quote, id) => {
      const occurrence = (seenIds.get(id) || 0) + 1;
      seenIds.set(id, occurrence);
      return occurrence === 1 ? match : `id=${quote}${id}-part-${occurrence}${quote}`;
    });
    html = html.replace(/[ \t]+$/gm, '');
    await writeFile(filename, html, 'utf8');
  }

  const pageHtml = new Map();
  const idTargets = new Map();
  for (const page of pages) {
    const html = await readFile(path.join(readerDir, page), 'utf8');
    pageHtml.set(page, html);
    for (const match of html.matchAll(/\bid=["']([^"']+)["']/gi)) {
      if (!idTargets.has(match[1])) idTargets.set(match[1], page);
    }
  }
  for (const [page, original] of pageHtml) {
    const localIds = new Set(
      [...original.matchAll(/\bid=["']([^"']+)["']/gi)].map((match) => match[1]),
    );
    const linked = original.replace(/href=["']#([^"']+)["']/gi, (match, id) => {
      if (localIds.has(id)) return match;
      const targetPage = idTargets.get(id);
      return targetPage ? `href="${targetPage}#${id}"` : match;
    });
    if (linked !== original) await writeFile(path.join(readerDir, page), linked, 'utf8');
  }

  const sitemap = JSON.parse(await readFile(path.join(readerDir, 'sitemap.json'), 'utf8'));
  const chapters = findChapterFiles(sitemap);
  if (chapters.length !== 5) throw new Error(`Expected 5 chapters, found ${chapters.length}`);

  const landingFile = path.join(docsDir, 'index.html');
  let landing = await readFile(landingFile, 'utf8');
  landing = landing.replaceAll('href="yaintt-id.html"', 'href="reader/index.html"');
  for (const chapter of chapters) {
    landing = landing.replace(
      new RegExp(`href="(?:yaintt-idch${chapter.number}\\.html|reader/[^"]+)"><span>Bab ${chapter.number}</span>`),
      `href="reader/${chapter.path}"><span>Bab ${chapter.number}</span>`,
    );
  }
  await writeFile(landingFile, landing, 'utf8');

  const sitemapXml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    `  <url><loc>${publicBase}</loc></url>`,
    ...pages.map((page) => `  <url><loc>${publicBase}reader/${page}</loc></url>`),
    '</urlset>',
    '',
  ].join('\n');
  await writeFile(path.join(docsDir, 'sitemap.xml'), sitemapXml, 'utf8');

  await writeFile(path.join(readerDir, 'chapters.json'), `${JSON.stringify(chapters, null, 2)}\n`, 'utf8');

  // Keep every generated learner-facing HTML document connected to both
  // language views of the curriculum and to the authoritative original.
  // The byte-level postprocessor is idempotent and verifies preservation of
  // all pre-existing content outside its two explicitly delimited additions.
  run(
    process.env.PYTHON || (process.platform === 'win32' ? 'python' : 'python3'),
    ['-B', path.join('scripts', 'apply_federated_navigation.py'), '--write'],
  );

  const manifestName = 'HTML_READER_MANIFEST.json';
  const manifestFiles = (await listFiles(docsDir))
    .filter((relative) => toPosix(relative) !== manifestName);
  const manifestEntries = [];
  for (const relative of manifestFiles) {
    const bytes = await readFile(path.join(docsDir, relative));
    manifestEntries.push({
      path: `docs/${toPosix(relative)}`,
      bytes: (await stat(path.join(docsDir, relative))).size,
      sha256: sha256(bytes),
    });
  }
  const normalizedSource = Buffer.from(source.replace(/\r\n/g, '\n'), 'utf8');
  const manifest = {
    schema: 'r014.html_reader_manifest',
    schema_version: '1.0.0',
    work_id: 'ttp.r014.yaintt',
    locale: 'id-ID',
    status: 'complete',
    build: {
      command: 'node scripts/build_html_reader.mjs',
      source: {
        path: 'source/yaintt-id.tex',
        canonical_lf_bytes: normalizedSource.length,
        canonical_lf_sha256: sha256(normalizedSource),
      },
      html_pages: pages.length,
      chapters: chapters.length,
      index_entries: prepared.indexEntries,
      math_format: 'MathML',
    },
    files: manifestEntries,
  };
  await writeFile(
    path.join(docsDir, manifestName),
    `${JSON.stringify(manifest, null, 2)}\n`,
    'utf8',
  );

  process.stdout.write(`${JSON.stringify({
    status: 'built',
    html_pages: pages.length,
    chapters,
    index_entries: prepared.indexEntries,
    pandoc_warnings: (result.stderr || '').trim().split('\n').filter(Boolean),
  }, null, 2)}\n`);
} finally {
  await rm(tempRoot, { recursive: true, force: true });
}
