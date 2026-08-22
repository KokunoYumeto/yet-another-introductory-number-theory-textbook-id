#!/usr/bin/env node

/**
 * Credential-safe, restart-safe API publisher for the verified R014 staging.
 *
 * This file contains no Git command and never contacts authors or opens issues.
 * The only credential inputs are GITHUB_TOKEN and ZENODO_TOKEN environment
 * variables. Tokens are sent in Authorization headers, never URLs, logs, local
 * metadata, receipts, or error messages.
 *
 * First execution reserves the exact GitHub/Zenodo identities, binds them into
 * local metadata, and stops. After scripts/assemble_release.mjs is rerun, the
 * next execution uploads, publishes, and verifies the exact rebuilt staging.
 */

import { createHash } from "node:crypto";
import {
  lstat,
  readFile,
  readdir,
  rename,
  unlink,
  writeFile,
} from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const JSZip = require("jszip");

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const LANE_ROOT = path.resolve(SCRIPT_DIR, "..");
const PUBLICATION_DIR = path.resolve(LANE_ROOT, "publication");
const STAGING_DIR = path.resolve(PUBLICATION_DIR, "staging");

const WORK_ID = "ttp.r014.yaintt";
const AUTHORITY_SNAPSHOT = "yaintt-source-2014-05-07-freeze-20260820";
const TITLE =
  "Satu Lagi Buku Teks Pengantar Teori Bilangan (Versi dengan Penekanan pada Kriptologi) — Edisi Bahasa Indonesia";
const UPSTREAM_URL = "https://poritz.net/jonathan/share/yaintt/";
const VERSION = "1.0.0";
const RELEASE_TAG = "v1.0.0";
const RELEASE_NAME = `${TITLE} — v${VERSION}`;
const REPOSITORY_SLUG = "yet-another-introductory-number-theory-textbook-id";
const REPOSITORY_DESCRIPTION =
  "Edisi Bahasa Indonesia (id-ID) dari Yet Another Introductory Number Theory Textbook — Indonesian open textbook edition with LaTeX source and modular backend";
const REPOSITORY_TOPICS = [
  "bahasa-indonesia",
  "cc-by-sa-4-0",
  "cryptology",
  "indonesian",
  "latex",
  "number-theory",
  "open-textbook",
].sort();

const GITHUB_API = "https://api.github.com";
const GITHUB_UPLOADS = "https://uploads.github.com";
const ZENODO_API = "https://zenodo.org/api";
const GITHUB_API_VERSION = "2026-03-10";
const REQUEST_TIMEOUT_MS = 120_000;

const RELEASE_MANIFEST_REL = "publication/RELEASE_MANIFEST.json";
const TARGETS_REL = "publication/PUBLICATION_TARGETS.json";
const ZENODO_METADATA_REL = ".zenodo.json";
const ZENODO_API_METADATA_REL = "publication/ZENODO_METADATA_DRAFT.json";
const PUBLISH_STATE_REL = "publication/PUBLISH_STATE.json";
const PUBLICATION_RECEIPT_REL = "publication/PUBLICATION_RECEIPT.json";

const README_BLOCK_START = "<!-- BEGIN R014-PUBLICATION -->";
const README_BLOCK_END = "<!-- END R014-PUBLICATION -->";
const CFF_BLOCK_START = "# BEGIN R014-PUBLICATION";
const CFF_BLOCK_END = "# END R014-PUBLICATION";
const HEX_256 = /^[0-9a-f]{64}$/;

const REQUIRED_ARTIFACTS = new Map([
  ["final_reader_pdf", "YAINTT_ID.pdf"],
  ["editable_source_bundle", "YAINTT_ID_SOURCE.zip"],
  ["modular_backend_bundle", "YAINTT_ID_BACKEND.zip"],
  ["release_evidence_bundle", "YAINTT_ID_EVIDENCE.zip"],
]);

const STAGING_HUMAN_FILES = [
  "README.md",
  "BUILD.md",
  "LICENSE.md",
  "ATTRIBUTION.md",
  "CITATION.cff",
  "zenodo.json",
  "RELEASE_NOTES.md",
  "RELEASE_MANIFEST.json",
];

const REPOSITORY_STATIC_FILES = [
  "README.md",
  "BUILD.md",
  "LICENSE.md",
  "ATTRIBUTION.md",
  "CITATION.cff",
  ".zenodo.json",
  "publication/RELEASE_NOTES.md",
  "publication/RELEASE_MANIFEST.json",
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
  "00_control/ADVERSE_LEDGER.md",
  "00_control/TERMINOLOGY.md",
  "00_control/DECISION_LOG.md",
  "qa/FULL_CORPUS_AUDIT.json",
  "qa/BOUNDARY28_TRANSLATION_REVIEW.json",
  "qa/FINAL_BUILD.json",
  "qa/FINAL_VISUAL.json",
  "qa/BACKEND_QA.json",
  "qa/BACKEND_DETERMINISM.json",
  "qa/frozen-boundaries/boundary28-final/SOURCE_SNAPSHOT.json",
  "backend/MANIFEST.json",
  "backend/MANIFEST.sha256",
  "scripts/assemble_release.mjs",
  "scripts/backend_canonical_reader_admission.mjs",
  "scripts/backend_full_extension.mjs",
  "scripts/build_backend.mjs",
  "scripts/build_boundary22_24_candidates.py",
  "scripts/build_boundary25_28_candidates.py",
  "scripts/finalize_pdf_deterministic.py",
  "scripts/publish_release.mjs",
  "scripts/qa_backend_full.py",
  "scripts/qa_boundary28_r2_candidate.py",
  "scripts/replay_backend_full.py",
];

function invariant(condition, message) {
  if (!condition) throw new Error(message);
}

function compareCodePoint(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

function hash(algorithm, data) {
  return createHash(algorithm).update(data).digest("hex");
}

function sha256(data) {
  return hash("sha256", data);
}

function md5(data) {
  return hash("md5", data);
}

function gitBlobSha(data) {
  const prefix = Buffer.from(`blob ${data.length}\0`, "utf8");
  return hash("sha1", Buffer.concat([prefix, data]));
}

function normalizeSha(value, label) {
  invariant(typeof value === "string", `${label} is missing`);
  const normalized = value.toLowerCase().replace(/^sha256:/, "");
  invariant(HEX_256.test(normalized), `${label} is not a SHA-256 value`);
  return normalized;
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
  invariant(
    absolute.startsWith(`${LANE_ROOT}${path.sep}`),
    `${label} resolves outside the R014 lane`,
  );
  return normalized;
}

function absoluteFromRelative(relative) {
  return path.resolve(LANE_ROOT, ...relative.split("/"));
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

async function readRegular(relative, label = relative) {
  const normalized = normalizeRelative(relative, label);
  const absolute = absoluteFromRelative(normalized);
  const stat = await lstat(absolute);
  invariant(!stat.isSymbolicLink(), `${label} must not be a symbolic link`);
  invariant(stat.isFile(), `${label} must be a regular file`);
  const data = await readFile(absolute);
  return {
    path: normalized,
    absolute,
    data,
    bytes: data.length,
    sha256: sha256(data),
  };
}

async function readJson(relative, label = relative) {
  const file = await readRegular(relative, label);
  try {
    return { ...file, value: JSON.parse(file.data.toString("utf8")) };
  } catch (error) {
    throw new Error(`${label} is not valid JSON: ${error.message}`);
  }
}

function jsonBytes(value) {
  return Buffer.from(`${JSON.stringify(value, null, 2)}\n`, "utf8");
}

async function writeAtomic(relative, data) {
  const normalized = normalizeRelative(relative, "atomic output path");
  const absolute = absoluteFromRelative(normalized);
  const next = `${absolute}.publish-next`;
  if (await pathExists(next)) {
    const nextStat = await lstat(next);
    invariant(
      !nextStat.isSymbolicLink() && nextStat.isFile(),
      `${normalized}.publish-next is not a regular file`,
    );
    await unlink(next);
  }
  await writeFile(next, data, { flag: "wx", mode: 0o644 });
  await rename(next, absolute);
  const readback = await readFile(absolute);
  invariant(
    readback.length === data.length && sha256(readback) === sha256(data),
    `${normalized} atomic write/readback failed`,
  );
}

function requireEnvironmentToken(name) {
  const value = process.env[name];
  invariant(typeof value === "string" && value.length >= 8, `${name} is missing`);
  invariant(!/[\r\n]/.test(value), `${name} contains a line break`);
  return value;
}

function safeUrl(raw, service) {
  const url = raw instanceof URL ? new URL(raw.href) : new URL(raw);
  invariant(url.protocol === "https:", `${service} URL must use HTTPS`);
  invariant(!url.username && !url.password, `${service} URL contains credentials`);
  if (service === "github-api") {
    invariant(url.origin === GITHUB_API, "GitHub request left api.github.com");
  } else if (service === "github-upload") {
    invariant(
      url.origin === GITHUB_UPLOADS,
      "GitHub upload left uploads.github.com",
    );
  } else if (service === "zenodo") {
    invariant(url.origin === "https://zenodo.org", "Zenodo request left zenodo.org");
    invariant(url.pathname.startsWith("/api/"), "Zenodo request left /api/");
  }
  return url;
}

function githubHeaders(token, extra = {}) {
  return {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${token}`,
    "User-Agent": "R014-YAINTT-id-ID-release-publisher",
    "X-GitHub-Api-Version": GITHUB_API_VERSION,
    ...extra,
  };
}

function githubAnonymousHeaders(extra = {}) {
  return {
    Accept: "application/vnd.github+json",
    "User-Agent": "R014-YAINTT-id-ID-public-verifier",
    "X-GitHub-Api-Version": GITHUB_API_VERSION,
    ...extra,
  };
}

async function fetchResponse(url, init, service) {
  const safe = safeUrl(url, service);
  return fetch(safe, {
    ...init,
    redirect: "error",
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
}

async function responseJson(response, label) {
  const text = await response.text();
  if (text.length === 0) return null;
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`${label} returned malformed JSON`);
  }
}

async function githubJson(
  pathname,
  { token, method = "GET", body, expected = [200], allow = [] } = {},
) {
  invariant(token, "Internal error: GitHub token not supplied");
  const url = safeUrl(`${GITHUB_API}${pathname}`, "github-api");
  const response = await fetchResponse(
    url,
    {
      method,
      headers: githubHeaders(token, body === undefined ? {} : {
        "Content-Type": "application/json",
      }),
      body: body === undefined ? undefined : JSON.stringify(body),
    },
    "github-api",
  );
  if (allow.includes(response.status)) {
    return { status: response.status, value: await responseJson(response, "GitHub") };
  }
  invariant(
    expected.includes(response.status),
    `GitHub ${method} ${url.pathname} returned HTTP ${response.status}`,
  );
  return { status: response.status, value: await responseJson(response, "GitHub") };
}

async function githubAnonymousJson(pathname, expected = [200]) {
  const url = safeUrl(`${GITHUB_API}${pathname}`, "github-api");
  const response = await fetchResponse(
    url,
    { method: "GET", headers: githubAnonymousHeaders() },
    "github-api",
  );
  invariant(
    expected.includes(response.status),
    `Anonymous GitHub GET ${url.pathname} returned HTTP ${response.status}`,
  );
  return responseJson(response, "Anonymous GitHub");
}

async function zenodoJson(
  pathnameOrUrl,
  { token, method = "GET", body, expected = [200], allow = [] } = {},
) {
  invariant(token, "Internal error: Zenodo token not supplied");
  const raw = pathnameOrUrl.startsWith("https://")
    ? pathnameOrUrl
    : `${ZENODO_API}${pathnameOrUrl}`;
  const url = safeUrl(raw, "zenodo");
  const headers = {
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  const response = await fetchResponse(
    url,
    {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    },
    "zenodo",
  );
  if (allow.includes(response.status)) {
    return { status: response.status, value: await responseJson(response, "Zenodo") };
  }
  invariant(
    expected.includes(response.status),
    `Zenodo ${method} ${url.pathname} returned HTTP ${response.status}`,
  );
  return { status: response.status, value: await responseJson(response, "Zenodo") };
}

function allowedDownloadRedirect(url, service) {
  invariant(url.protocol === "https:", `${service} download redirect is not HTTPS`);
  invariant(!url.username && !url.password, `${service} redirect contains credentials`);
  if (service === "github") {
    const host = url.hostname.toLowerCase();
    invariant(
      host === "github.com" ||
        host.endsWith(".githubusercontent.com") ||
        host === "release-assets.githubusercontent.com",
      "GitHub asset redirected to an untrusted host",
    );
  } else {
    invariant(url.origin === "https://zenodo.org", "Zenodo file redirected off Zenodo");
  }
}

async function binaryWithSafeRedirect(
  rawUrl,
  { service, token = null, headers = {} },
) {
  const initialService = service === "github" ? "github-api" : "zenodo";
  const initial = safeUrl(rawUrl, initialService);
  const firstHeaders = { ...headers };
  if (token) firstHeaders.Authorization = `Bearer ${token}`;
  const first = await fetch(initial, {
    method: "GET",
    headers: firstHeaders,
    redirect: "manual",
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  if (first.status === 200) return Buffer.from(await first.arrayBuffer());
  invariant(
    [301, 302, 303, 307, 308].includes(first.status),
    `${service} binary read returned HTTP ${first.status}`,
  );
  const location = first.headers.get("location");
  invariant(location, `${service} binary redirect omitted Location`);
  const redirected = new URL(location, initial);
  allowedDownloadRedirect(redirected, service);
  // Never forward the caller's bearer token to a redirect target.
  const second = await fetch(redirected, {
    method: "GET",
    redirect: "follow",
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  invariant(second.status === 200, `${service} redirected binary read failed`);
  return Buffer.from(await second.arrayBuffer());
}

async function githubAssetBytes(owner, repository, assetId, token = null) {
  const pathname = `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(
    repository,
  )}/releases/assets/${encodeURIComponent(String(assetId))}`;
  return binaryWithSafeRedirect(`${GITHUB_API}${pathname}`, {
    service: "github",
    token,
    headers: token
      ? githubHeaders(token, { Accept: "application/octet-stream" })
      : githubAnonymousHeaders({ Accept: "application/octet-stream" }),
  });
}

async function zenodoFileBytes(rawUrl, token = null) {
  return binaryWithSafeRedirect(rawUrl, {
    service: "zenodo",
    token,
    // Zenodo's draft/public content routes serve octet-stream bytes but return
    // HTTP 406 when that same media type is sent in Accept. A neutral Accept
    // works for both authenticated draft and anonymous public readback.
    headers: { Accept: "*/*" },
  });
}

async function githubUploadAsset(owner, repository, releaseId, file, token) {
  const url = new URL(
    `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(
      repository,
    )}/releases/${encodeURIComponent(String(releaseId))}/assets`,
    GITHUB_UPLOADS,
  );
  url.searchParams.set("name", file.name);
  safeUrl(url, "github-upload");
  const response = await fetchResponse(
    url,
    {
      method: "POST",
      headers: githubHeaders(token, {
        Accept: "application/vnd.github+json",
        "Content-Type": mediaType(file.name),
        "Content-Length": String(file.bytes),
      }),
      body: file.data,
    },
    "github-upload",
  );
  invariant(
    response.status === 201,
    `GitHub asset upload returned HTTP ${response.status}`,
  );
  return responseJson(response, "GitHub asset upload");
}

async function zenodoUploadFile(bucketUrl, file, token) {
  const bucket = safeUrl(bucketUrl, "zenodo");
  invariant(bucket.pathname.startsWith("/api/files/"), "Unexpected Zenodo bucket route");
  const upload = new URL(
    `${bucket.pathname.replace(/\/$/, "")}/${encodeURIComponent(file.name)}`,
    bucket.origin,
  );
  const response = await fetchResponse(
    upload,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        // The Zenodo bucket API accepts raw file bodies as octet-stream and
        // rejects filename-derived media types with HTTP 415.
        "Content-Type": "application/octet-stream",
        "Content-Length": String(file.bytes),
      },
      body: file.data,
    },
    "zenodo",
  );
  invariant(
    [200, 201].includes(response.status),
    `Zenodo file upload returned HTTP ${response.status}`,
  );
  return responseJson(response, "Zenodo file upload");
}

function mediaType(filename) {
  const lower = filename.toLowerCase();
  if (lower.endsWith(".pdf")) return "application/pdf";
  if (lower.endsWith(".zip")) return "application/zip";
  if (lower.endsWith(".json")) return "application/json";
  if (lower.endsWith(".md")) return "text/markdown; charset=utf-8";
  if (lower.endsWith(".cff")) return "text/yaml; charset=utf-8";
  return "application/octet-stream";
}

async function validateLocalStaging() {
  const canonical = await readJson(RELEASE_MANIFEST_REL, "canonical release manifest");
  const staged = await readJson(
    "publication/staging/RELEASE_MANIFEST.json",
    "staged release manifest",
  );
  invariant(
    canonical.sha256 === staged.sha256,
    "Canonical and staged release manifests are not byte-identical",
  );
  const manifest = canonical.value;
  invariant(manifest.work_id === WORK_ID, "Release manifest work identity drifted");
  invariant(manifest.title === TITLE, "Release manifest title drifted");
  invariant(
    [
      "assembled_verified_pending_publication",
      "publishing_identifiers_reserved",
      "publishing_remote_assets_verified",
    ].includes(manifest.status),
    `Release manifest status is not publishable: ${manifest.status}`,
  );
  invariant(
    Array.isArray(manifest.required_release_artifacts),
    "Release manifest artifact inventory is missing",
  );

  const expectedStaging = new Set(STAGING_HUMAN_FILES);
  for (const [role, expectedName] of REQUIRED_ARTIFACTS) {
    const matches = manifest.required_release_artifacts.filter(
      (record) => record.role === role,
    );
    invariant(matches.length === 1, `Expected one ${role} record`);
    const record = matches[0];
    invariant(record.release_filename === expectedName, `${role} filename drifted`);
    invariant(record.state === "verified", `${role} is not locally verified`);
    invariant(Number.isSafeInteger(record.bytes) && record.bytes > 0, `${role} bytes missing`);
    const expectedSha = normalizeSha(record.sha256, `${role} SHA-256`);
    const stagedFile = await readRegular(
      `publication/staging/${expectedName}`,
      `${role} staged file`,
    );
    invariant(
      stagedFile.bytes === record.bytes && stagedFile.sha256 === expectedSha,
      `${role} staged bytes do not match the release manifest`,
    );
    expectedStaging.add(expectedName);
  }
  const actualStaging = (await readdir(STAGING_DIR)).sort(compareCodePoint);
  invariant(
    JSON.stringify(actualStaging) ===
      JSON.stringify([...expectedStaging].sort(compareCodePoint)),
    "publication/staging contains missing or unexpected files",
  );

  const zenodoMetadata = await readJson(ZENODO_METADATA_REL, "Zenodo metadata");
  invariant(zenodoMetadata.value.title === TITLE, "Zenodo title drifted");
  const targets = await readJson(TARGETS_REL, "publication targets");
  invariant(targets.value.work_id === WORK_ID, "Publication target work ID drifted");
  const githubTarget = targets.value.destinations?.find(
    (target) => target.kind === "github_public_mirror",
  );
  invariant(githubTarget, "GitHub publication target is missing");
  invariant(
    githubTarget.expected_repository_slug === REPOSITORY_SLUG,
    "GitHub repository slug drifted",
  );
  const zenodoTarget = targets.value.destinations?.find(
    (target) => target.kind === "zenodo",
  );
  invariant(zenodoTarget, "Zenodo publication target is missing");

  return {
    manifest,
    manifestIdentity: canonical,
    targets: targets.value,
    zenodoMetadata: zenodoMetadata.value,
  };
}

async function readLocalForIdentifierBinding() {
  const manifest = await readJson(RELEASE_MANIFEST_REL, "release manifest");
  const targets = await readJson(TARGETS_REL, "publication targets");
  const zenodoMetadata = await readJson(ZENODO_METADATA_REL, "Zenodo metadata");
  invariant(manifest.value.work_id === WORK_ID, "Release manifest work identity drifted");
  invariant(manifest.value.title === TITLE, "Release manifest title drifted");
  invariant(targets.value.work_id === WORK_ID, "Publication target work ID drifted");
  invariant(zenodoMetadata.value.title === TITLE, "Zenodo title drifted");
  return {
    manifest: manifest.value,
    manifestIdentity: manifest,
    targets: targets.value,
    zenodoMetadata: zenodoMetadata.value,
  };
}

async function preflightGitHub(token, targets) {
  const userResponse = await githubJson("/user", { token });
  const user = userResponse.value;
  invariant(typeof user?.login === "string" && user.login.length > 0, "GitHub user login missing");
  const owner = user.login;
  const target = targets.destinations.find(
    (entry) => entry.kind === "github_public_mirror",
  );
  if (target.owner !== null && target.owner !== undefined) {
    invariant(
      target.owner.toLowerCase() === owner.toLowerCase(),
      "Authenticated GitHub user conflicts with the recorded owner",
    );
  }
  const repoPath = `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(
    REPOSITORY_SLUG,
  )}`;
  const repositoryResponse = await githubJson(repoPath, {
    token,
    allow: [404],
  });
  const repository = repositoryResponse.status === 404 ? null : repositoryResponse.value;
  if (repository) {
    invariant(repository.name === REPOSITORY_SLUG, "GitHub repository name drifted");
    invariant(
      repository.owner?.login?.toLowerCase() === owner.toLowerCase(),
      "GitHub repository owner drifted",
    );
    invariant(repository.private === false, "Existing GitHub repository is not public");
    invariant(repository.fork === false, "Existing GitHub repository is an unexpected fork");
    invariant(repository.archived === false, "Existing GitHub repository is archived");

    const releases = (
      await githubJson(`${repoPath}/releases?per_page=100`, { token })
    ).value;
    invariant(Array.isArray(releases), "GitHub release inventory is malformed");
    invariant(
      releases.every((release) => release.tag_name === RELEASE_TAG),
      "GitHub repository contains an unexpected release lineage",
    );
    invariant(releases.length <= 1, "GitHub repository has duplicate release lineage");
    const releaseNotes = await readRegular("publication/RELEASE_NOTES.md");
    const expectedAssetNames = [
      ...REQUIRED_ARTIFACTS.values(),
      ...STAGING_HUMAN_FILES,
    ].sort(compareCodePoint);
    for (const release of releases) {
      invariant(release.name === RELEASE_NAME, "Existing GitHub release name drifted");
      invariant(
        release.body === releaseNotes.data.toString("utf8"),
        "Existing GitHub release notes drifted",
      );
      invariant(release.prerelease === false, "Existing GitHub release is a prerelease");
      const assets = (
        await githubJson(`${repoPath}/releases/${release.id}/assets?per_page=100`, {
          token,
        })
      ).value;
      invariant(Array.isArray(assets), "Existing GitHub asset inventory is malformed");
      const names = assets.map((asset) => asset.name);
      invariant(new Set(names).size === names.length, "Existing GitHub release has duplicate assets");
      invariant(
        names.every((name) => expectedAssetNames.includes(name)),
        "Existing GitHub release contains an unexpected asset",
      );
    }

    const tags = (await githubJson(`${repoPath}/tags?per_page=100`, { token })).value;
    invariant(Array.isArray(tags), "GitHub tag inventory is malformed");
    invariant(
      tags.every((tag) => tag.name === RELEASE_TAG),
      "GitHub repository contains an unexpected tag lineage",
    );
    invariant(tags.length <= 1, "GitHub repository has duplicate release tags");
  }
  return {
    owner,
    repository,
    repoPath,
    repositoryUrl: `https://github.com/${owner}/${REPOSITORY_SLUG}`,
    releaseUrl: `https://github.com/${owner}/${REPOSITORY_SLUG}/releases/tag/${RELEASE_TAG}`,
  };
}

function depositionMetadata(deposition) {
  return deposition?.metadata ?? deposition;
}

function depositionId(deposition) {
  return deposition?.id ?? deposition?.record_id ?? deposition?.recordId;
}

function exactZenodoIdentity(deposition, { requireWorkId = false } = {}) {
  const metadata = depositionMetadata(deposition);
  if (metadata?.title !== TITLE) return false;
  const notes = String(metadata.notes ?? "");
  const related = Array.isArray(metadata.related_identifiers)
    ? metadata.related_identifiers
    : [];
  const hasAuthority = notes.includes(AUTHORITY_SNAPSHOT);
  const hasWorkId = notes.includes(WORK_ID);
  const hasUpstream = related.some(
    (record) =>
      record.identifier === UPSTREAM_URL && record.relation === "isDerivedFrom",
  );
  return hasAuthority && hasUpstream && (!requireWorkId || hasWorkId);
}

function sameZenodoTitle(deposition) {
  return depositionMetadata(deposition)?.title === TITLE;
}

function normalizeDepositList(value) {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.hits?.hits)) return value.hits.hits;
  throw new Error("Zenodo deposition inventory is malformed");
}

async function listZenodoDepositions(token) {
  const results = [];
  const pageSize = 100;
  for (let page = 1; page <= 20; page += 1) {
    const query = new URLSearchParams({
      page: String(page),
      size: String(pageSize),
    });
    const response = await zenodoJson(`/deposit/depositions?${query}`, { token });
    const values = normalizeDepositList(response.value);
    results.push(...values);
    if (values.length < pageSize) return results;
  }
  throw new Error("Zenodo inventory exceeded the bounded 2000-record preflight");
}

async function preflightZenodo(token, localMetadata, publishState = null) {
  // Zenodo's legacy deposit endpoint currently returns the same mixed
  // inventory for status=draft and status=published. Enumerate it once and
  // derive publication state from the record itself so one deposition cannot
  // be mistaken for two exact lineages.
  const inventory = await listZenodoDepositions(token);
  const all = inventory.map((record) => ({
    record,
    published: record?.submitted === true || record?.state === "done",
  }));
  const titleMatches = all.filter(({ record }) => sameZenodoTitle(record));
  invariant(
    titleMatches.every(({ record }) => exactZenodoIdentity(record)),
    "Zenodo contains the exact title with conflicting work identity",
  );
  const exact = titleMatches.filter(({ record }) => exactZenodoIdentity(record));
  invariant(exact.length <= 1, "Zenodo contains ambiguous duplicate exact lineage");

  if (publishState) {
    invariant(
      exact.length === 1,
      "Saved Zenodo exact lineage is missing from the authenticated inventory",
    );
    invariant(
      publishState.zenodo?.deposition_id !== undefined,
      "Saved Zenodo cursor has no deposition ID",
    );
    invariant(
      String(depositionId(exact[0].record)) ===
        String(publishState.zenodo.deposition_id),
      "Saved Zenodo cursor conflicts with authenticated inventory",
    );
  }

  let selected = exact[0] ?? null;
  if (!selected) {
    const created = await zenodoJson("/deposit/depositions", {
      token,
      method: "POST",
      body: { metadata: localMetadata },
      expected: [201],
    });
    selected = { record: created.value, published: false };
  }
  const metadata = depositionMetadata(selected.record);
  if (selected.published) {
    invariant(
      exactZenodoIdentity(selected.record, { requireWorkId: true }),
      "Published Zenodo lineage lacks the bound work identity",
    );
  }
  if (metadata.version !== undefined) {
    invariant(metadata.version === VERSION, "Zenodo exact lineage has a different version");
  }
  if (selected.published) {
    invariant(metadata.version === VERSION, "Published Zenodo version drifted");
    invariant(metadata.language === localMetadata.language, "Published Zenodo language drifted");
    invariant(metadata.license === localMetadata.license, "Published Zenodo license drifted");
    invariant(
      metadata.access_right === localMetadata.access_right,
      "Published Zenodo access right drifted",
    );
  }
  return selected;
}

function reservedDoi(deposition) {
  const metadata = depositionMetadata(deposition);
  return (
    metadata?.prereserve_doi?.doi ??
    deposition?.doi ??
    metadata?.doi ??
    null
  );
}

function conceptDoi(deposition) {
  const metadata = depositionMetadata(deposition);
  return deposition?.conceptdoi ?? metadata?.conceptdoi ?? null;
}

async function reserveZenodoDoi(selected, token) {
  if (selected.published) {
    const doi = reservedDoi(selected.record);
    invariant(doi, "Published Zenodo record has no DOI");
    return { ...selected, doi, conceptDoi: conceptDoi(selected.record) };
  }
  let record = selected.record;
  let doi = reservedDoi(record);
  if (!doi) {
    const id = depositionId(record);
    invariant(id !== undefined, "Zenodo draft has no deposition ID");
    // The official deposition API pre-reserves a DOI when it creates the
    // deposition. Refresh once rather than inventing a non-standard action.
    const refreshed = await zenodoJson(
      `/deposit/depositions/${encodeURIComponent(String(id))}`,
      { token },
    );
    record = refreshed.value;
    doi = reservedDoi(record);
  }
  invariant(doi, "Zenodo failed to reserve a DOI for the exact draft");
  return {
    record,
    published: false,
    doi,
    conceptDoi: conceptDoi(record),
  };
}

function replaceManagedBlock(text, start, end, replacement, label) {
  const startIndex = text.indexOf(start);
  const endIndex = text.indexOf(end);
  invariant(
    (startIndex === -1) === (endIndex === -1),
    `${label} has a partial managed publication block`,
  );
  if (startIndex === -1) {
    return `${text.trimEnd()}\n\n${replacement}\n`;
  }
  invariant(endIndex > startIndex, `${label} publication markers are reversed`);
  invariant(
    text.indexOf(start, startIndex + start.length) === -1 &&
      text.indexOf(end, endIndex + end.length) === -1,
    `${label} contains duplicate publication markers`,
  );
  const after = endIndex + end.length;
  return `${text.slice(0, startIndex)}${replacement}${text.slice(after)}`;
}

function publicationReadmeBlock(identifiers) {
  return [
    README_BLOCK_START,
    "## Rilis kanonik",
    "",
    `- Repositori publik: <${identifiers.repositoryUrl}>`,
    `- Rilis GitHub ${RELEASE_TAG}: <${identifiers.releaseUrl}>`,
    `- Rekaman preservasi Zenodo: <${identifiers.recordUrl}>`,
    `- DOI versi: <https://doi.org/${identifiers.doi}>`,
    `- Versi: \`${VERSION}\``,
    "",
    "Identitas publik di atas disiapkan dari lineage yang telah dipreflight;",
    "ukuran dan SHA-256 publik tetap dibuktikan dalam receipt publikasi.",
    README_BLOCK_END,
  ].join("\n");
}

function publicationCffBlock(identifiers) {
  return [
    CFF_BLOCK_START,
    `version: ${VERSION}`,
    `doi: "${identifiers.doi}"`,
    `repository-code: "${identifiers.repositoryUrl}"`,
    `url: "https://doi.org/${identifiers.doi}"`,
    CFF_BLOCK_END,
  ].join("\n");
}

function bindZenodoMetadata(metadata, identifiers) {
  const bound = structuredClone(metadata);
  bound.title = TITLE;
  bound.version = VERSION;
  const notes = String(bound.notes ?? "");
  if (!notes.includes(WORK_ID)) {
    bound.notes = `${notes.trim()} Work identity: ${WORK_ID}.`.trim();
  }
  const related = Array.isArray(bound.related_identifiers)
    ? bound.related_identifiers.filter(
        (record) => record.identifier !== identifiers.repositoryUrl,
      )
    : [];
  related.push({
    identifier: identifiers.repositoryUrl,
    relation: "isSupplementedBy",
    resource_type: "software",
  });
  bound.related_identifiers = related.sort((a, b) =>
    compareCodePoint(`${a.identifier}|${a.relation}`, `${b.identifier}|${b.relation}`),
  );
  return bound;
}

function updateTargets(targets, identifiers, states) {
  const updated = structuredClone(targets);
  const github = updated.destinations.find(
    (entry) => entry.kind === "github_public_mirror",
  );
  const zenodo = updated.destinations.find((entry) => entry.kind === "zenodo");
  invariant(github && zenodo, "Publication destination records are incomplete");
  Object.assign(github, {
    state: states.github,
    owner: identifiers.owner,
    repository_url: identifiers.repositoryUrl,
    release_url: identifiers.releaseUrl,
    release_tag: RELEASE_TAG,
  });
  Object.assign(zenodo, {
    state: states.zenodo,
    record_id: identifiers.recordId,
    concept_doi: identifiers.conceptDoi,
    version_doi: identifiers.doi,
    record_url: identifiers.recordUrl,
  });
  updated.lineage_state = states.lineage;
  return updated;
}

function updateManifestForIdentifiers(manifest, identifiers, status) {
  const updated = structuredClone(manifest);
  updated.status = status;
  Object.assign(updated.publication, {
    github_repository_url: identifiers.repositoryUrl,
    github_release_url: identifiers.releaseUrl,
    zenodo_record_id: identifiers.recordId,
    concept_doi: identifiers.conceptDoi,
    version_doi: identifiers.doi,
  });
  return updated;
}

async function bindLocalMetadata(
  local,
  identifiers,
  states,
  manifestStatus,
  { writeStaging = false } = {},
) {
  const rootReadme = await readRegular("README.md");
  const readmeText = replaceManagedBlock(
    rootReadme.data.toString("utf8"),
    README_BLOCK_START,
    README_BLOCK_END,
    publicationReadmeBlock(identifiers),
    "README.md",
  );
  const rootCff = await readRegular("CITATION.cff");
  const cffText = replaceManagedBlock(
    rootCff.data.toString("utf8"),
    CFF_BLOCK_START,
    CFF_BLOCK_END,
    publicationCffBlock(identifiers),
    "CITATION.cff",
  );
  const zenodoMetadata = bindZenodoMetadata(local.zenodoMetadata, identifiers);
  const targets = updateTargets(local.targets, identifiers, states);
  const manifest = updateManifestForIdentifiers(
    local.manifest,
    identifiers,
    manifestStatus,
  );

  const writes = [
    ["README.md", Buffer.from(readmeText, "utf8")],
    ["CITATION.cff", Buffer.from(cffText, "utf8")],
    [ZENODO_METADATA_REL, jsonBytes(zenodoMetadata)],
    [ZENODO_API_METADATA_REL, jsonBytes({ metadata: zenodoMetadata })],
    [TARGETS_REL, jsonBytes(targets)],
    [RELEASE_MANIFEST_REL, jsonBytes(manifest)],
  ];
  if (writeStaging) {
    writes.push(
      ["publication/staging/README.md", Buffer.from(readmeText, "utf8")],
      ["publication/staging/CITATION.cff", Buffer.from(cffText, "utf8")],
      ["publication/staging/zenodo.json", jsonBytes(zenodoMetadata)],
      ["publication/staging/RELEASE_MANIFEST.json", jsonBytes(manifest)],
    );
  }
  for (const [relative, data] of writes) await writeAtomic(relative, data);
  return { readmeText, cffText, zenodoMetadata, targets, manifest };
}

async function readPublishState() {
  const absolute = absoluteFromRelative(PUBLISH_STATE_REL);
  if (!(await pathExists(absolute))) return null;
  const state = await readJson(PUBLISH_STATE_REL, "publication state");
  invariant(state.value.work_id === WORK_ID, "Publication state work ID drifted");
  invariant(state.value.version === VERSION, "Publication state version drifted");
  return state.value;
}

async function savePublishState(phase, identifiers, extra = {}) {
  const existing = await readPublishState();
  const value = {
    schema: "r014.publish_state",
    schema_version: "1.0.0",
    work_id: WORK_ID,
    version: VERSION,
    phase,
    github: {
      owner: identifiers.owner,
      repository: REPOSITORY_SLUG,
      repository_url: identifiers.repositoryUrl,
      release_tag: RELEASE_TAG,
      release_url: identifiers.releaseUrl,
      commit_sha: extra.commitSha ?? null,
      release_id: extra.releaseId ?? null,
    },
    zenodo: {
      deposition_id: identifiers.recordId,
      record_url: identifiers.recordUrl,
      version_doi: identifiers.doi,
      concept_doi: identifiers.conceptDoi,
    },
    bound_metadata: extra.boundMetadata ?? existing?.bound_metadata ?? null,
  };
  await writeAtomic(PUBLISH_STATE_REL, jsonBytes(value));
  return value;
}

function identifiersFromState(state) {
  invariant(state?.github && state?.zenodo, "Publication state lacks identifiers");
  return {
    owner: state.github.owner,
    repositoryUrl: state.github.repository_url,
    releaseUrl: state.github.release_url,
    recordId: state.zenodo.deposition_id,
    recordUrl: state.zenodo.record_url,
    doi: state.zenodo.version_doi,
    conceptDoi: state.zenodo.concept_doi,
  };
}

async function captureBoundMetadata() {
  const records = [];
  for (const relative of [
    "README.md",
    "CITATION.cff",
    ZENODO_METADATA_REL,
    ZENODO_API_METADATA_REL,
    TARGETS_REL,
  ]) {
    const file = await readRegular(relative);
    records.push({ path: relative, bytes: file.bytes, sha256: file.sha256 });
  }
  return records.sort((a, b) => compareCodePoint(a.path, b.path));
}

async function stagingWasReassembled() {
  const canonical = await readRegular(RELEASE_MANIFEST_REL);
  const stagedPath = absoluteFromRelative("publication/staging/RELEASE_MANIFEST.json");
  if (!(await pathExists(stagedPath))) return false;
  const staged = await readRegular("publication/staging/RELEASE_MANIFEST.json");
  if (canonical.sha256 !== staged.sha256) return false;
  let manifest;
  try {
    manifest = JSON.parse(canonical.data.toString("utf8"));
  } catch {
    return false;
  }
  return manifest.status === "assembled_verified_pending_publication";
}

async function assertArchiveMatchesRoot(stagingName, label) {
  const archiveFile = await readRegular(`publication/staging/${stagingName}`);
  const archive = await JSZip.loadAsync(archiveFile.data, { checkCRC32: true });
  const inventoryEntry = archive.file("CONTENTS.sha256");
  invariant(inventoryEntry, `${label} lacks CONTENTS.sha256`);
  const inventoryText = (await inventoryEntry.async("nodebuffer")).toString("utf8");
  const records = [];
  const seen = new Set();
  for (const line of inventoryText.split("\n")) {
    if (line.length === 0) continue;
    const match = /^([0-9a-f]{64})  (.+)$/.exec(line);
    invariant(match, `${label} has a malformed CONTENTS.sha256 line`);
    const relative = normalizeRelative(match[2], `${label} inventory path`);
    invariant(relative !== "CONTENTS.sha256", `${label} inventories its own inventory`);
    invariant(!seen.has(relative), `${label} inventory repeats ${relative}`);
    seen.add(relative);
    records.push({ path: relative, sha256: match[1] });
  }
  invariant(records.length > 0, `${label} inventory is empty`);
  const sortedPaths = records.map((record) => record.path).sort(compareCodePoint);
  invariant(
    JSON.stringify(records.map((record) => record.path)) === JSON.stringify(sortedPaths),
    `${label} inventory paths are not sorted`,
  );
  const archiveNames = Object.keys(archive.files)
    .filter((name) => !archive.files[name].dir)
    .sort(compareCodePoint);
  invariant(
    JSON.stringify(archiveNames) ===
      JSON.stringify([...sortedPaths, "CONTENTS.sha256"].sort(compareCodePoint)),
    `${label} central-directory inventory differs from CONTENTS.sha256`,
  );
  for (const record of records) {
    const entry = archive.file(record.path);
    invariant(entry, `${label} lacks ${record.path}`);
    const archived = await entry.async("nodebuffer");
    invariant(
      sha256(archived) === record.sha256,
      `${label} archived hash drifted for ${record.path}`,
    );
    const root = await readRegular(record.path);
    invariant(
      root.bytes === archived.length && root.sha256 === record.sha256,
      `${record.path} changed after ${label} assembly`,
    );
  }
  return archive;
}

async function validateBoundReassembly(local, state) {
  invariant(
    Array.isArray(state.bound_metadata) && state.bound_metadata.length > 0,
    "Publication state lacks bound metadata identities",
  );
  for (const expected of state.bound_metadata) {
    const file = await readRegular(expected.path);
    invariant(
      file.bytes === expected.bytes && file.sha256 === expected.sha256,
      `${expected.path} changed after identifier binding`,
    );
  }
  const identifiers = identifiersFromState(state);
  const publication = local.manifest.publication ?? {};
  invariant(
    publication.github_repository_url === identifiers.repositoryUrl &&
      publication.github_release_url === identifiers.releaseUrl &&
      String(publication.zenodo_record_id) === String(identifiers.recordId) &&
      publication.version_doi === identifiers.doi,
    "Reassembled manifest does not bind the reserved identifiers",
  );
  for (const [rootRelative, stagedRelative] of [
    ["README.md", "publication/staging/README.md"],
    ["LICENSE.md", "publication/staging/LICENSE.md"],
    ["ATTRIBUTION.md", "publication/staging/ATTRIBUTION.md"],
    ["CITATION.cff", "publication/staging/CITATION.cff"],
    [ZENODO_METADATA_REL, "publication/staging/zenodo.json"],
    ["publication/RELEASE_NOTES.md", "publication/staging/RELEASE_NOTES.md"],
  ]) {
    const root = await readRegular(rootRelative);
    const staged = await readRegular(stagedRelative);
    invariant(
      root.sha256 === staged.sha256,
      `${stagedRelative} does not contain the bound metadata`,
    );
  }

  const archive = await assertArchiveMatchesRoot(
    "YAINTT_ID_SOURCE.zip",
    "source bundle",
  );
  await assertArchiveMatchesRoot("YAINTT_ID_BACKEND.zip", "backend bundle");
  await assertArchiveMatchesRoot("YAINTT_ID_EVIDENCE.zip", "evidence bundle");
  for (const [archiveName, rootRelative] of [
    ["README.md", "README.md"],
    ["CITATION.cff", "CITATION.cff"],
    [".zenodo.json", ZENODO_METADATA_REL],
  ]) {
    const entry = archive.file(archiveName);
    invariant(entry, `Source bundle lacks bound ${archiveName}`);
    const archived = await entry.async("nodebuffer");
    const root = await readRegular(rootRelative);
    invariant(
      archived.length === root.bytes && sha256(archived) === root.sha256,
      `Source bundle contains stale ${archiveName}`,
    );
  }
}

async function updateZenodoDraftMetadata(selected, metadata, token) {
  if (selected.published) return selected.record;
  const id = depositionId(selected.record);
  const response = await zenodoJson(
    `/deposit/depositions/${encodeURIComponent(String(id))}`,
    {
      token,
      method: "PUT",
      body: { metadata },
      expected: [200],
    },
  );
  invariant(
    exactZenodoIdentity(response.value, { requireWorkId: true }),
    "Zenodo metadata update lost work identity",
  );
  invariant(depositionMetadata(response.value).version === VERSION, "Zenodo version update failed");
  return response.value;
}

async function repositoryFiles() {
  const backendManifest = await readJson("backend/MANIFEST.json", "backend manifest");
  const backendRecords = backendManifest.value.files
    .sort((a, b) => compareCodePoint(a.path, b.path));
  invariant(backendRecords.length > 0, "Backend manifest contains no files");
  const paths = new Set(REPOSITORY_STATIC_FILES);
  for (const record of backendRecords) {
    const relative = normalizeRelative(`backend/${record.path}`, "backend file path");
    const file = await readRegular(relative);
    invariant(file.bytes === record.bytes, `${relative} bytes drifted from backend manifest`);
    invariant(
      file.sha256 === normalizeSha(record.sha256, `${relative} SHA-256`),
      `${relative} hash drifted from backend manifest`,
    );
    paths.add(relative);
  }
  const files = [];
  for (const relative of [...paths].sort(compareCodePoint)) {
    invariant(!/(^|\/)by-sa\.eps$/i.test(relative), "Excluded by-sa.eps entered GitHub tree");
    const file = await readRegular(relative);
    files.push({
      path: relative,
      data: file.data,
      bytes: file.bytes,
      sha256: file.sha256,
      git_blob_sha: gitBlobSha(file.data),
    });
  }
  return files;
}

async function ensureGitHubRepository(preflight, identifiers, files, token) {
  let repository = preflight.repository;
  if (!repository) {
    const create = await githubJson("/user/repos", {
      token,
      method: "POST",
      body: {
        name: REPOSITORY_SLUG,
        description: REPOSITORY_DESCRIPTION,
        homepage: `https://doi.org/${identifiers.doi}`,
        private: false,
        has_issues: true,
        has_projects: false,
        has_wiki: false,
        auto_init: false,
      },
      expected: [201],
      allow: [422],
    });
    if (create.status === 422) {
      repository = (
        await githubJson(preflight.repoPath, { token })
      ).value;
    } else {
      repository = create.value;
    }
  }
  invariant(repository.private === false, "GitHub repository is not public");
  invariant(repository.name === REPOSITORY_SLUG, "GitHub repository name drifted");
  await assertGitHubRepositoryClaimable(preflight, repository, files, token);
  const updatedRepository = (
    await githubJson(preflight.repoPath, {
      token,
      method: "PATCH",
      body: {
        description: REPOSITORY_DESCRIPTION,
        homepage: `https://doi.org/${identifiers.doi}`,
        has_issues: true,
        has_projects: false,
        has_wiki: false,
      },
      expected: [200],
    })
  ).value;
  invariant(
    updatedRepository.default_branch === "main",
    "The authenticated GitHub account must use main as the default branch for this empty repository",
  );
  await githubJson(`${preflight.repoPath}/topics`, {
    token,
    method: "PUT",
    body: { names: REPOSITORY_TOPICS },
    expected: [200],
  });
  const topics = (await githubJson(`${preflight.repoPath}/topics`, { token })).value;
  invariant(Array.isArray(topics.names), "GitHub topic inventory is malformed");
  invariant(
    JSON.stringify([...topics.names].sort()) === JSON.stringify(REPOSITORY_TOPICS),
    "GitHub topics did not round-trip exactly",
  );
  return updatedRepository;
}

async function githubBranchHead(repoPath, token) {
  const response = await githubJson(`${repoPath}/git/ref/heads/main`, {
    token,
    allow: [404, 409],
  });
  if ([404, 409].includes(response.status)) return null;
  invariant(response.value.object?.type === "commit", "GitHub main ref is not a commit");
  return response.value.object.sha;
}

async function githubTreeInventory(repoPath, commitSha, token = null) {
  const request = token ? githubJson : githubAnonymousJson;
  const commit = token
    ? (await request(`${repoPath}/git/commits/${encodeURIComponent(commitSha)}`, { token })).value
    : await request(`${repoPath}/git/commits/${encodeURIComponent(commitSha)}`);
  const treeSha = commit.tree?.sha;
  invariant(treeSha, "GitHub commit has no tree SHA");
  const tree = token
    ? (
        await request(
          `${repoPath}/git/trees/${encodeURIComponent(treeSha)}?recursive=1`,
          { token },
        )
      ).value
    : await request(`${repoPath}/git/trees/${encodeURIComponent(treeSha)}?recursive=1`);
  invariant(tree.truncated === false, "GitHub recursive tree response was truncated");
  const blobs = tree.tree
    .filter((entry) => entry.type === "blob")
    .map((entry) => ({ path: entry.path, mode: entry.mode, sha: entry.sha }))
    .sort((a, b) => compareCodePoint(a.path, b.path));
  const unexpectedTypes = tree.tree.filter(
    (entry) => !["blob", "tree"].includes(entry.type),
  );
  invariant(unexpectedTypes.length === 0, "GitHub tree contains a submodule or unknown type");
  return { commitSha, treeSha, blobs };
}

function expectedGitHubBlobs(files) {
  return files.map((file) => ({
    path: file.path,
    mode: "100644",
    sha: file.git_blob_sha,
  }));
}

function bootstrapGitHubBlob() {
  const data = Buffer.from(
    "R014 API bootstrap; replaced by the bounded release tree.\n",
    "utf8",
  );
  return {
    path: ".r014-bootstrap",
    mode: "100644",
    sha: gitBlobSha(data),
  };
}

async function assertGitHubRepositoryClaimable(preflight, repository, files, token) {
  invariant(repository.default_branch === "main", "GitHub default branch is not main");
  const head = await githubBranchHead(preflight.repoPath, token);
  if (!head) {
    const branches = (
      await githubJson(`${preflight.repoPath}/branches?per_page=100`, { token })
    ).value;
    invariant(
      Array.isArray(branches) && branches.length === 0,
      "GitHub repository has non-main drift",
    );
    return;
  }
  const inventory = await githubTreeInventory(preflight.repoPath, head, token);
  const observed = JSON.stringify(inventory.blobs);
  invariant(
    observed === JSON.stringify(expectedGitHubBlobs(files)) ||
      observed === JSON.stringify([bootstrapGitHubBlob()]),
    "Existing GitHub main differs from both the exact bootstrap and bounded release tree",
  );
}

async function assertGitHubRepositoryMetadata(preflight, identifiers, files, token) {
  const repository = preflight.repository;
  invariant(repository, "Reserved GitHub repository is missing");
  invariant(repository.description === REPOSITORY_DESCRIPTION, "GitHub description drifted");
  invariant(repository.homepage === `https://doi.org/${identifiers.doi}`, "GitHub homepage drifted");
  invariant(repository.has_issues === true, "GitHub issue setting drifted");
  invariant(repository.has_projects === false, "GitHub project setting drifted");
  invariant(repository.has_wiki === false, "GitHub wiki setting drifted");
  const topics = (await githubJson(`${preflight.repoPath}/topics`, { token })).value;
  invariant(
    JSON.stringify([...topics.names].sort()) === JSON.stringify(REPOSITORY_TOPICS),
    "GitHub topics drifted",
  );
  await assertGitHubRepositoryClaimable(preflight, repository, files, token);
}

function assertTreeMatches(inventory, files, label) {
  const expected = expectedGitHubBlobs(files);
  invariant(
    JSON.stringify(inventory.blobs) === JSON.stringify(expected),
    `${label} tree differs from the bounded release tree`,
  );
}

async function createOrReuseGitHubCommit(preflight, files, token) {
  let head = await githubBranchHead(preflight.repoPath, token);
  const bootstrapData = Buffer.from(
    "R014 API bootstrap; replaced by the bounded release tree.\n",
    "utf8",
  );
  const bootstrapFile = bootstrapGitHubBlob();
  if (head) {
    const inventory = await githubTreeInventory(preflight.repoPath, head, token);
    const expected = expectedGitHubBlobs(files);
    if (JSON.stringify(inventory.blobs) === JSON.stringify(expected)) {
      return inventory;
    }
    invariant(
      JSON.stringify(inventory.blobs) === JSON.stringify([bootstrapFile]),
      "Existing GitHub main differs from both the exact bootstrap and bounded release tree",
    );
  } else {
    const branches = (
      await githubJson(`${preflight.repoPath}/branches?per_page=100`, { token })
    ).value;
    invariant(
      Array.isArray(branches) && branches.length === 0,
      "GitHub repo has non-main drift",
    );
    // GitHub's reference API cannot create the first branch in an empty
    // repository. Use the official Contents REST route for one fixed bootstrap
    // file, then replace its entire tree through blobs/tree/commit/ref APIs.
    const bootstrap = (
      await githubJson(`${preflight.repoPath}/contents/.r014-bootstrap`, {
        token,
        method: "PUT",
        body: {
          message: "Initialize R014 API publication branch",
          content: bootstrapData.toString("base64"),
        },
        expected: [201],
      })
    ).value;
    head = bootstrap.commit?.sha;
    invariant(head, "GitHub bootstrap did not create a commit");
    const bootstrapInventory = await githubTreeInventory(
      preflight.repoPath,
      head,
      token,
    );
    invariant(
      JSON.stringify(bootstrapInventory.blobs) === JSON.stringify([bootstrapFile]),
      "GitHub bootstrap tree drifted",
    );
  }

  const treeEntries = [];
  for (const file of files) {
    const blob = (
      await githubJson(`${preflight.repoPath}/git/blobs`, {
        token,
        method: "POST",
        body: { content: file.data.toString("base64"), encoding: "base64" },
        expected: [201],
      })
    ).value;
    invariant(blob.sha === file.git_blob_sha, `GitHub blob SHA drifted for ${file.path}`);
    treeEntries.push({
      path: file.path,
      mode: "100644",
      type: "blob",
      sha: blob.sha,
    });
  }
  const tree = (
    await githubJson(`${preflight.repoPath}/git/trees`, {
      token,
      method: "POST",
      body: { tree: treeEntries },
      expected: [201],
    })
  ).value;
  const commit = (
    await githubJson(`${preflight.repoPath}/git/commits`, {
      token,
      method: "POST",
      body: {
        message: `Publish ${TITLE} ${RELEASE_TAG}`,
        tree: tree.sha,
        parents: [head],
      },
      expected: [201],
    })
  ).value;
  await githubJson(`${preflight.repoPath}/git/refs/heads/main`, {
    token,
    method: "PATCH",
    body: { sha: commit.sha, force: false },
    expected: [200],
  });
  const inventory = await githubTreeInventory(preflight.repoPath, commit.sha, token);
  assertTreeMatches(inventory, files, "Created GitHub main");
  return inventory;
}

async function stagedUploadFiles() {
  const names = [
    ...REQUIRED_ARTIFACTS.values(),
    ...STAGING_HUMAN_FILES,
  ].sort(compareCodePoint);
  const unique = [...new Set(names)];
  invariant(unique.length === names.length, "Duplicate staged upload filename");
  const files = [];
  for (const name of names) {
    const file = await readRegular(`publication/staging/${name}`);
    files.push({
      name,
      path: file.path,
      data: file.data,
      bytes: file.bytes,
      sha256: file.sha256,
      md5: md5(file.data),
    });
  }
  return files;
}

async function resolveTagCommit(repoPath, tagSha, tagType, token = null) {
  if (tagType === "commit") return tagSha;
  invariant(tagType === "tag", "GitHub tag ref has an unknown object type");
  const tag = token
    ? (
        await githubJson(`${repoPath}/git/tags/${encodeURIComponent(tagSha)}`, {
          token,
        })
      ).value
    : await githubAnonymousJson(`${repoPath}/git/tags/${encodeURIComponent(tagSha)}`);
  return resolveTagCommit(repoPath, tag.object.sha, tag.object.type, token);
}

async function ensureGitHubRelease(preflight, commitSha, files, token) {
  let tagResponse = await githubJson(
    `${preflight.repoPath}/git/ref/tags/${encodeURIComponent(RELEASE_TAG)}`,
    { token, allow: [404] },
  );
  let tagRef;
  if (tagResponse.status === 404) {
    tagRef = (
      await githubJson(`${preflight.repoPath}/git/refs`, {
        token,
        method: "POST",
        body: { ref: `refs/tags/${RELEASE_TAG}`, sha: commitSha },
        expected: [201],
      })
    ).value;
  } else {
    tagRef = tagResponse.value;
  }
  const tagCommit = await resolveTagCommit(
    preflight.repoPath,
    tagRef.object.sha,
    tagRef.object.type,
    token,
  );
  invariant(tagCommit === commitSha, "GitHub release tag points to a different commit");

  const notes = await readRegular("publication/RELEASE_NOTES.md");
  const expectedBody = notes.data.toString("utf8");
  let releaseResponse = await githubJson(
    `${preflight.repoPath}/releases/tags/${encodeURIComponent(RELEASE_TAG)}`,
    { token, allow: [404] },
  );
  let release = releaseResponse.status === 404 ? null : releaseResponse.value;
  if (!release) {
    // GitHub's release-by-tag route does not resolve draft releases. Recover
    // the exact draft through the authenticated inventory so a restart cannot
    // create another draft for the same tag.
    const inventory = (
      await githubJson(`${preflight.repoPath}/releases?per_page=100`, { token })
    ).value;
    invariant(Array.isArray(inventory), "GitHub release inventory is malformed");
    const matchingDrafts = inventory.filter(
      (candidate) => candidate.tag_name === RELEASE_TAG && candidate.draft === true,
    );
    invariant(matchingDrafts.length <= 1, "GitHub has duplicate draft releases for the tag");
    release = matchingDrafts[0] ?? null;
  }
  if (!release) {
    release = (
      await githubJson(`${preflight.repoPath}/releases`, {
        token,
        method: "POST",
        body: {
          tag_name: RELEASE_TAG,
          target_commitish: commitSha,
          name: RELEASE_NAME,
          body: expectedBody,
          draft: true,
          prerelease: false,
        },
        expected: [201],
      })
    ).value;
  }
  invariant(release.tag_name === RELEASE_TAG, "GitHub release tag drifted");
  invariant(release.name === RELEASE_NAME, "GitHub release name drifted");
  invariant(release.body === expectedBody, "GitHub release notes drifted");
  invariant(release.prerelease === false, "GitHub release unexpectedly marked prerelease");

  let assets = (
    await githubJson(`${preflight.repoPath}/releases/${release.id}/assets?per_page=100`, {
      token,
    })
  ).value;
  invariant(Array.isArray(assets), "GitHub release asset inventory is malformed");
  const expectedNames = files.map((file) => file.name).sort(compareCodePoint);
  const remoteNames = assets.map((asset) => asset.name).sort(compareCodePoint);
  invariant(
    remoteNames.every((name) => expectedNames.includes(name)),
    "GitHub release contains an unexpected asset",
  );
  invariant(new Set(remoteNames).size === remoteNames.length, "GitHub release has duplicate assets");

  for (const file of files) {
    let asset = assets.find((candidate) => candidate.name === file.name);
    if (!asset) {
      asset = await githubUploadAsset(
        preflight.owner,
        REPOSITORY_SLUG,
        release.id,
        file,
        token,
      );
      assets.push(asset);
    }
    invariant(asset.size === file.bytes, `GitHub asset size drifted for ${file.name}`);
    const remoteBytes = await githubAssetBytes(
      preflight.owner,
      REPOSITORY_SLUG,
      asset.id,
      token,
    );
    invariant(
      remoteBytes.length === file.bytes && sha256(remoteBytes) === file.sha256,
      `GitHub asset bytes drifted for ${file.name}`,
    );
  }
  assets = (
    await githubJson(`${preflight.repoPath}/releases/${release.id}/assets?per_page=100`, {
      token,
    })
  ).value;
  invariant(
    JSON.stringify(assets.map((asset) => asset.name).sort(compareCodePoint)) ===
      JSON.stringify(expectedNames),
    "GitHub release asset closure is incomplete",
  );
  return { release, assets };
}

function zenodoDraftFileName(file) {
  return file.filename ?? file.key;
}

function zenodoDraftFileSize(file) {
  return file.filesize ?? file.size;
}

function normalizeMd5Checksum(value, label) {
  invariant(typeof value === "string", `${label} checksum missing`);
  const normalized = value.toLowerCase().replace(/^md5:/, "");
  invariant(/^[0-9a-f]{32}$/.test(normalized), `${label} checksum is not MD5`);
  return normalized;
}

function zenodoDraftDownloadUrl(file) {
  return file.links?.download ?? file.links?.content ?? file.links?.self;
}

async function verifyZenodoFile(file, local, token) {
  invariant(
    zenodoDraftFileSize(file) === local.bytes,
    `Zenodo file size drifted for ${local.name}`,
  );
  invariant(
    normalizeMd5Checksum(file.checksum, `Zenodo ${local.name}`) === local.md5,
    `Zenodo MD5 drifted for ${local.name}`,
  );
  const downloadUrl = zenodoDraftDownloadUrl(file);
  invariant(downloadUrl, `Zenodo file ${local.name} has no download route`);
  const bytes = await zenodoFileBytes(downloadUrl, token);
  invariant(
    bytes.length === local.bytes && sha256(bytes) === local.sha256,
    `Zenodo SHA-256 readback drifted for ${local.name}`,
  );
}

async function ensureZenodoFiles(selected, files, token) {
  if (selected.published) return selected.record;
  const id = depositionId(selected.record);
  let deposition = (
    await zenodoJson(`/deposit/depositions/${encodeURIComponent(String(id))}`, {
      token,
    })
  ).value;
  let remoteFiles = Array.isArray(deposition.files) ? deposition.files : [];
  const expectedNames = files.map((file) => file.name).sort(compareCodePoint);
  const remoteNames = remoteFiles.map(zenodoDraftFileName).sort(compareCodePoint);
  invariant(
    remoteNames.every((name) => expectedNames.includes(name)),
    "Zenodo draft contains an unexpected file",
  );
  invariant(new Set(remoteNames).size === remoteNames.length, "Zenodo draft has duplicate files");
  const bucket = deposition.links?.bucket;
  invariant(bucket, "Zenodo draft has no bucket upload route");
  for (const file of files) {
    let remote = remoteFiles.find((candidate) => zenodoDraftFileName(candidate) === file.name);
    if (!remote) {
      await zenodoUploadFile(bucket, file, token);
      deposition = (
        await zenodoJson(`/deposit/depositions/${encodeURIComponent(String(id))}`, {
          token,
        })
      ).value;
      remoteFiles = deposition.files ?? [];
      remote = remoteFiles.find(
        (candidate) => zenodoDraftFileName(candidate) === file.name,
      );
      invariant(remote, `Zenodo upload did not create ${file.name}`);
    }
    await verifyZenodoFile(remote, file, token);
  }
  deposition = (
    await zenodoJson(`/deposit/depositions/${encodeURIComponent(String(id))}`, {
      token,
    })
  ).value;
  remoteFiles = deposition.files ?? [];
  invariant(
    JSON.stringify(remoteFiles.map(zenodoDraftFileName).sort(compareCodePoint)) ===
      JSON.stringify(expectedNames),
    "Zenodo draft file closure is incomplete",
  );
  return deposition;
}

async function publishZenodo(selected, token) {
  if (selected.published) return selected.record;
  const id = depositionId(selected.record);
  const response = await zenodoJson(
    `/deposit/depositions/${encodeURIComponent(String(id))}/actions/publish`,
    {
      token,
      method: "POST",
      body: {},
      expected: [200, 201, 202],
    },
  );
  return response.value;
}

async function publishGitHubRelease(preflight, release, token) {
  if (release.draft === false) return release;
  return (
    await githubJson(`${preflight.repoPath}/releases/${release.id}`, {
      token,
      method: "PATCH",
      body: { draft: false, prerelease: false, make_latest: "true" },
      expected: [200],
    })
  ).value;
}

async function verifyGithubPublic(owner, commitSha, files, releaseFiles) {
  const repoPath = `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(
    REPOSITORY_SLUG,
  )}`;
  const repository = await githubAnonymousJson(repoPath);
  invariant(repository.private === false, "Anonymous GitHub readback found a private repo");
  const ref = await githubAnonymousJson(`${repoPath}/git/ref/heads/main`);
  invariant(ref.object?.sha === commitSha, "Anonymous GitHub main ref drifted");
  const inventory = await githubTreeInventory(repoPath, commitSha, null);
  assertTreeMatches(inventory, files, "Anonymous GitHub");
  for (const file of files) {
    const blob = await githubAnonymousJson(
      `${repoPath}/git/blobs/${encodeURIComponent(file.git_blob_sha)}`,
    );
    invariant(blob.encoding === "base64", `GitHub blob encoding drifted for ${file.path}`);
    const bytes = Buffer.from(String(blob.content).replace(/\s+/g, ""), "base64");
    invariant(
      bytes.length === file.bytes && sha256(bytes) === file.sha256,
      `Anonymous GitHub blob readback drifted for ${file.path}`,
    );
  }
  const release = await githubAnonymousJson(
    `${repoPath}/releases/tags/${encodeURIComponent(RELEASE_TAG)}`,
  );
  invariant(release.tag_name === RELEASE_TAG, "Public GitHub release tag drifted");
  invariant(release.name === RELEASE_NAME, "Public GitHub release name drifted");
  invariant(release.draft === false, "GitHub release is still a draft");
  invariant(release.prerelease === false, "GitHub release became a prerelease");
  const notes = await readRegular("publication/RELEASE_NOTES.md");
  invariant(
    release.body === notes.data.toString("utf8"),
    "Public GitHub release notes drifted",
  );
  const tagRef = await githubAnonymousJson(
    `${repoPath}/git/ref/tags/${encodeURIComponent(RELEASE_TAG)}`,
  );
  const tagCommit = await resolveTagCommit(
    repoPath,
    tagRef.object.sha,
    tagRef.object.type,
    null,
  );
  invariant(tagCommit === commitSha, "Public GitHub release tag commit drifted");
  const assets = await githubAnonymousJson(
    `${repoPath}/releases/${release.id}/assets?per_page=100`,
  );
  const expectedNames = releaseFiles.map((file) => file.name).sort(compareCodePoint);
  invariant(
    JSON.stringify(assets.map((asset) => asset.name).sort(compareCodePoint)) ===
      JSON.stringify(expectedNames),
    "Anonymous GitHub release inventory drifted",
  );
  const verifiedAssets = [];
  for (const file of releaseFiles) {
    const asset = assets.find((candidate) => candidate.name === file.name);
    const bytes = await githubAssetBytes(owner, REPOSITORY_SLUG, asset.id, null);
    invariant(
      bytes.length === file.bytes && sha256(bytes) === file.sha256,
      `Anonymous GitHub release bytes drifted for ${file.name}`,
    );
    verifiedAssets.push({
      name: file.name,
      bytes: file.bytes,
      sha256: file.sha256,
      asset_id: asset.id,
      api_url: `${GITHUB_API}${repoPath}/releases/assets/${asset.id}`,
    });
  }
  return {
    repository_url: repository.html_url,
    commit_sha: commitSha,
    tree_sha: inventory.treeSha,
    tree_files: files.map(({ data: _data, ...file }) => file),
    release_id: release.id,
    release_url: release.html_url,
    tag: RELEASE_TAG,
    assets: verifiedAssets,
  };
}

function publicZenodoFileName(file) {
  return file.key ?? file.filename;
}

function publicZenodoFileSize(file) {
  return file.size ?? file.filesize;
}

function publicZenodoDownloadUrl(file) {
  return file.links?.content ?? file.links?.download ?? file.links?.self;
}

async function verifyZenodoPublic(recordId, doi, files) {
  const url = safeUrl(`${ZENODO_API}/records/${encodeURIComponent(String(recordId))}`, "zenodo");
  const response = await fetchResponse(
    url,
    { method: "GET", headers: { Accept: "application/json" } },
    "zenodo",
  );
  invariant(response.status === 200, "Anonymous Zenodo record readback failed");
  const record = await responseJson(response, "Anonymous Zenodo");
  invariant(record.metadata?.title === TITLE, "Public Zenodo title drifted");
  invariant(
    exactZenodoIdentity(record, { requireWorkId: true }),
    "Public Zenodo work identity drifted",
  );
  invariant(record.metadata?.version === VERSION, "Public Zenodo version drifted");
  invariant(record.metadata?.language === "ind", "Public Zenodo language drifted");
  const observedDoi = record.doi ?? record.metadata?.doi;
  invariant(observedDoi === doi, "Public Zenodo DOI drifted");
  const remoteFiles = Array.isArray(record.files) ? record.files : [];
  const expectedNames = files.map((file) => file.name).sort(compareCodePoint);
  invariant(
    JSON.stringify(remoteFiles.map(publicZenodoFileName).sort(compareCodePoint)) ===
      JSON.stringify(expectedNames),
    "Public Zenodo file inventory drifted",
  );
  const verifiedFiles = [];
  for (const file of files) {
    const remote = remoteFiles.find(
      (candidate) => publicZenodoFileName(candidate) === file.name,
    );
    invariant(publicZenodoFileSize(remote) === file.bytes, `Zenodo size drifted for ${file.name}`);
    invariant(
      normalizeMd5Checksum(remote.checksum, `Public Zenodo ${file.name}`) === file.md5,
      `Public Zenodo MD5 drifted for ${file.name}`,
    );
    const downloadUrl = publicZenodoDownloadUrl(remote);
    invariant(downloadUrl, `Public Zenodo ${file.name} has no content route`);
    const bytes = await zenodoFileBytes(downloadUrl, null);
    invariant(
      bytes.length === file.bytes && sha256(bytes) === file.sha256,
      `Anonymous Zenodo bytes drifted for ${file.name}`,
    );
    verifiedFiles.push({
      name: file.name,
      bytes: file.bytes,
      sha256: file.sha256,
      md5: file.md5,
      content_url: downloadUrl,
    });
  }
  return {
    record_id: recordId,
    record_url: `https://zenodo.org/records/${recordId}`,
    version_doi: doi,
    concept_doi: record.conceptdoi ?? record.metadata?.conceptdoi ?? null,
    files: verifiedFiles,
  };
}

async function writePublicationReceipt(github, zenodo, prepublicationManifestSha) {
  const receipt = {
    schema: "r014.publication_receipt",
    schema_version: "1.0.0",
    status: "public_bytes_verified",
    work_id: WORK_ID,
    title: TITLE,
    version: VERSION,
    verified_at_utc: new Date().toISOString(),
    verification: {
      anonymous_public_readback: true,
      comparison: "filename, byte count, SHA-256; Zenodo MD5 also checked",
      prepublication_release_manifest_sha256: prepublicationManifestSha,
    },
    github,
    zenodo,
  };
  const data = jsonBytes(receipt);
  await writeAtomic(PUBLICATION_RECEIPT_REL, data);
  return { receipt, data, bytes: data.length, sha256: sha256(data) };
}

function filesFromReceipt(records, includeGitBlob = false) {
  return records.map((record) => ({
    path: record.path,
    name: record.name,
    bytes: record.bytes,
    sha256: normalizeSha(record.sha256, "receipt SHA-256"),
    md5: record.md5,
    git_blob_sha: includeGitBlob ? record.git_blob_sha : undefined,
  }));
}

async function verifyExistingReceipt(receipt) {
  invariant(receipt.status === "public_bytes_verified", "Receipt is not complete");
  invariant(receipt.work_id === WORK_ID && receipt.version === VERSION, "Receipt identity drifted");
  const local = await validateLocalStaging();
  invariant(
    normalizeSha(
      receipt.verification?.prepublication_release_manifest_sha256,
      "receipt prepublication manifest SHA-256",
    ) === local.manifestIdentity.sha256,
    "Receipt is bound to a different local release manifest",
  );
  const treeFiles = filesFromReceipt(receipt.github.tree_files, true);
  const localTreeFiles = (await repositoryFiles())
    .map((file) => ({
      path: file.path,
      bytes: file.bytes,
      sha256: file.sha256,
      git_blob_sha: file.git_blob_sha,
    }))
    .sort((a, b) => compareCodePoint(a.path, b.path));
  const receiptTreeFiles = treeFiles
    .map((file) => ({
      path: file.path,
      bytes: file.bytes,
      sha256: file.sha256,
      git_blob_sha: file.git_blob_sha,
    }))
    .sort((a, b) => compareCodePoint(a.path, b.path));
  invariant(
    JSON.stringify(receiptTreeFiles) === JSON.stringify(localTreeFiles),
    "Receipt GitHub tree does not match current repository inputs",
  );
  const releaseFiles = receipt.github.assets.map((asset) => ({
    name: asset.name,
    bytes: asset.bytes,
    sha256: normalizeSha(asset.sha256, "receipt GitHub asset SHA-256"),
  }));
  const stagedFiles = (await stagedUploadFiles())
    .map((file) => ({ name: file.name, bytes: file.bytes, sha256: file.sha256 }))
    .sort((a, b) => compareCodePoint(a.name, b.name));
  const receiptReleaseFiles = releaseFiles
    .map((file) => ({ name: file.name, bytes: file.bytes, sha256: file.sha256 }))
    .sort((a, b) => compareCodePoint(a.name, b.name));
  invariant(
    JSON.stringify(receiptReleaseFiles) === JSON.stringify(stagedFiles),
    "Receipt GitHub assets do not match current staging",
  );
  await verifyGithubPublic(
    receipt.github.repository_url.split("/").at(-2),
    receipt.github.commit_sha,
    treeFiles,
    releaseFiles,
  );
  const zenodoFiles = receipt.zenodo.files.map((file) => ({
    name: file.name,
    bytes: file.bytes,
    sha256: normalizeSha(file.sha256, "receipt Zenodo SHA-256"),
    md5: file.md5,
  }));
  const receiptZenodoFiles = zenodoFiles
    .map((file) => ({ name: file.name, bytes: file.bytes, sha256: file.sha256 }))
    .sort((a, b) => compareCodePoint(a.name, b.name));
  invariant(
    JSON.stringify(receiptZenodoFiles) === JSON.stringify(stagedFiles) &&
      JSON.stringify(receiptZenodoFiles) === JSON.stringify(receiptReleaseFiles),
    "GitHub and Zenodo receipt inventories are not the same staged release",
  );
  await verifyZenodoPublic(
    receipt.zenodo.record_id,
    receipt.zenodo.version_doi,
    zenodoFiles,
  );
}

async function main() {
  const existingReceiptPath = absoluteFromRelative(PUBLICATION_RECEIPT_REL);
  if (await pathExists(existingReceiptPath)) {
    const existing = await readJson(PUBLICATION_RECEIPT_REL, "publication receipt");
    await verifyExistingReceipt(existing.value);
    process.stdout.write(
      `${JSON.stringify({
        status: "already_published_public_bytes_reverified",
        receipt: PUBLICATION_RECEIPT_REL,
        receipt_sha256: existing.sha256,
      })}\n`,
    );
    return;
  }

  let publishState = await readPublishState();

  // A crash during the metadata-binding transaction is repaired locally and
  // still stops before any file upload or publication.
  if (publishState?.phase === "binding_identifiers_in_progress") {
    const identifiers = identifiersFromState(publishState);
    const repairLocal = await readLocalForIdentifierBinding();
    await bindLocalMetadata(
      repairLocal,
      identifiers,
      {
        github: "identifiers_reserved_reassembly_required",
        zenodo: "doi_reserved_reassembly_required",
        lineage: "exact_lineage_resolved_identifiers_bound",
      },
      "identifiers_bound_reassembly_required",
      { writeStaging: false },
    );
    const boundMetadata = await captureBoundMetadata();
    await savePublishState("identifiers_bound_reassembly_required", identifiers, {
      boundMetadata,
    });
    process.stdout.write(
      `${JSON.stringify({
        status: "identifiers_bound_reassembly_required",
        next: "Run scripts/assemble_release.mjs with the admitted final PDF and receipts, then run this publisher again.",
      })}\n`,
    );
    return;
  }

  // Phase 1: preflight both services, create only the exact empty repository
  // and Zenodo deposition when absent, reserve the DOI, bind identifiers to
  // local metadata, and stop. No content upload or publish action occurs here.
  if (!publishState) {
    const githubToken = requireEnvironmentToken("GITHUB_TOKEN");
    const zenodoToken = requireEnvironmentToken("ZENODO_TOKEN");
    const local = await validateLocalStaging();
    const githubPreflight = await preflightGitHub(githubToken, local.targets);
    const repoFiles = await repositoryFiles();
    if (githubPreflight.repository) {
      await assertGitHubRepositoryClaimable(
        githubPreflight,
        githubPreflight.repository,
        repoFiles,
        githubToken,
      );
    }
    const zenodoPreflight = await preflightZenodo(
      zenodoToken,
      local.zenodoMetadata,
      null,
    );
    const reserved = await reserveZenodoDoi(zenodoPreflight, zenodoToken);
    const recordId = depositionId(reserved.record);
    invariant(recordId !== undefined, "Zenodo exact lineage has no record ID");
    const identifiers = {
      owner: githubPreflight.owner,
      repositoryUrl: githubPreflight.repositoryUrl,
      releaseUrl: githubPreflight.releaseUrl,
      recordId,
      recordUrl: `https://zenodo.org/records/${recordId}`,
      doi: reserved.doi,
      conceptDoi: reserved.conceptDoi,
    };
    await ensureGitHubRepository(
      githubPreflight,
      identifiers,
      repoFiles,
      githubToken,
    );
    await savePublishState("binding_identifiers_in_progress", identifiers);
    await bindLocalMetadata(
      local,
      identifiers,
      {
        github: "identifiers_reserved_reassembly_required",
        zenodo: reserved.published
          ? "published_identity_reassembly_required"
          : "doi_reserved_reassembly_required",
        lineage: "exact_lineage_resolved_identifiers_bound",
      },
      "identifiers_bound_reassembly_required",
      { writeStaging: false },
    );
    const boundMetadata = await captureBoundMetadata();
    await savePublishState("identifiers_bound_reassembly_required", identifiers, {
      boundMetadata,
    });
    process.stdout.write(
      `${JSON.stringify(
        {
          status: "identifiers_bound_reassembly_required",
          github_repository: identifiers.repositoryUrl,
          zenodo_record: identifiers.recordUrl,
          reserved_version_doi: identifiers.doi,
          uploads_performed: false,
          publication_performed: false,
          next: "Run scripts/assemble_release.mjs with the admitted final PDF and receipts, then run this publisher again.",
        },
        null,
        2,
      )}\n`,
    );
    return;
  }

  invariant(
    [
      "identifiers_bound_reassembly_required",
      "github_assets_verified_release_draft",
      "zenodo_published_pending_github_release",
    ].includes(publishState.phase),
    `Unsupported publication phase ${publishState.phase}`,
  );
  if (!(await stagingWasReassembled())) {
    process.stdout.write(
      `${JSON.stringify({
        status: "identifiers_bound_reassembly_required",
        uploads_performed: false,
        publication_performed: false,
        next: "Run scripts/assemble_release.mjs with the admitted final PDF and receipts, then run this publisher again.",
      })}\n`,
    );
    return;
  }

  // Phase 2: staging is now a fresh deterministic assembly that contains the
  // bound README, CITATION.cff, portable zenodo.json, and SOURCE ZIP. From this point
  // onward the publisher never mutates those human-facing files or the release
  // manifest; it writes only the restart cursor and final sanitized receipt.
  const githubToken = requireEnvironmentToken("GITHUB_TOKEN");
  const zenodoToken = requireEnvironmentToken("ZENODO_TOKEN");
  const local = await validateLocalStaging();
  await validateBoundReassembly(local, publishState);
  const uploadFiles = await stagedUploadFiles();
  const stateIdentifiers = identifiersFromState(publishState);
  const repoFiles = await repositoryFiles();
  const githubPreflight = await preflightGitHub(githubToken, local.targets);
  invariant(
    githubPreflight.owner.toLowerCase() === stateIdentifiers.owner.toLowerCase() &&
      githubPreflight.repositoryUrl === stateIdentifiers.repositoryUrl,
    "GitHub lineage changed after identifier binding",
  );
  await assertGitHubRepositoryMetadata(
    githubPreflight,
    stateIdentifiers,
    repoFiles,
    githubToken,
  );
  const zenodoPreflight = await preflightZenodo(
    zenodoToken,
    local.zenodoMetadata,
    publishState,
  );
  const reserved = await reserveZenodoDoi(zenodoPreflight, zenodoToken);
  invariant(
    String(depositionId(reserved.record)) === String(stateIdentifiers.recordId) &&
      reserved.doi === stateIdentifiers.doi,
    "Zenodo lineage changed after identifier binding",
  );
  const identifiers = {
    ...stateIdentifiers,
    conceptDoi: reserved.conceptDoi ?? stateIdentifiers.conceptDoi,
  };
  if (reserved.published) {
    await verifyZenodoPublic(
      depositionId(reserved.record),
      identifiers.doi,
      uploadFiles,
    );
  }

  reserved.record = await updateZenodoDraftMetadata(
    reserved,
    local.zenodoMetadata,
    zenodoToken,
  );
  const commit = await createOrReuseGitHubCommit(
    githubPreflight,
    repoFiles,
    githubToken,
  );
  const githubRelease = await ensureGitHubRelease(
    githubPreflight,
    commit.commitSha,
    uploadFiles,
    githubToken,
  );
  await savePublishState("github_assets_verified_release_draft", identifiers, {
    commitSha: commit.commitSha,
    releaseId: githubRelease.release.id,
  });

  reserved.record = await ensureZenodoFiles(reserved, uploadFiles, zenodoToken);
  const publishedZenodo = await publishZenodo(reserved, zenodoToken);
  const publishedDoi = reservedDoi(publishedZenodo) ?? identifiers.doi;
  invariant(publishedDoi === identifiers.doi, "Zenodo published a different DOI");
  identifiers.conceptDoi = conceptDoi(publishedZenodo) ?? identifiers.conceptDoi;
  await savePublishState("zenodo_published_pending_github_release", identifiers, {
    commitSha: commit.commitSha,
    releaseId: githubRelease.release.id,
  });

  const zenodoPublic = await verifyZenodoPublic(
    identifiers.recordId,
    identifiers.doi,
    uploadFiles,
  );
  identifiers.conceptDoi = zenodoPublic.concept_doi ?? identifiers.conceptDoi;

  const publishedRelease = await publishGitHubRelease(
    githubPreflight,
    githubRelease.release,
    githubToken,
  );
  invariant(publishedRelease.draft === false, "GitHub release publish action failed");

  const prepublicationManifest = await readRegular(RELEASE_MANIFEST_REL);
  const githubPublic = await verifyGithubPublic(
    identifiers.owner,
    commit.commitSha,
    repoFiles,
    uploadFiles,
  );
  const receiptIdentity = await writePublicationReceipt(
    githubPublic,
    zenodoPublic,
    prepublicationManifest.sha256,
  );
  await savePublishState("complete_public_bytes_verified", identifiers, {
    commitSha: commit.commitSha,
    releaseId: githubRelease.release.id,
  });

  process.stdout.write(
    `${JSON.stringify(
      {
        status: "published_public_bytes_verified",
        github_repository: identifiers.repositoryUrl,
        github_release: identifiers.releaseUrl,
        zenodo_record: identifiers.recordUrl,
        version_doi: identifiers.doi,
        concept_doi: identifiers.conceptDoi,
        receipt: {
          path: PUBLICATION_RECEIPT_REL,
          bytes: receiptIdentity.bytes,
          sha256: receiptIdentity.sha256,
        },
      },
      null,
      2,
    )}\n`,
  );
}

main().catch((error) => {
  // Error messages are deliberately constructed without response bodies,
  // Authorization headers, environment values, bucket URLs, or signed links.
  process.stderr.write(`Publication failed safely: ${error.message}\n`);
  process.exitCode = 1;
});
