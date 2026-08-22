# Decision Log

## R014-DEC-0001 — Source-bearing snapshot controls

The selected authority is the complete, reproducibly downloadable `share/yaintt`
snapshot whose source declares 7 May 2014 11:04 MDT. A page link to a later
in-flux PDF is unavailable and lacks matching public source, so it is recorded
but not used as translation authority.

## R014-DEC-0002 — Preserve upstream labels

Existing LaTeX labels, bibliography keys, environment topology, exercise
numbering, formula text, and asset filenames remain stable. Locale-neutral
backend IDs wrap these upstream identifiers rather than replacing them.

## R014-DEC-0003 — First translation boundary

The first complete instructional unit is Chapter 1 Section 1.1,
`sec:WOPaMI`, source lines 392-586, including definitions, both induction
principles and proofs, examples, and all seven exercises. The Chapter 1 title at
line 390 is admitted with the section. Title/front matter is lines 265-388.

## R014-DEC-0004 — Rights at component granularity

The derivative will retain Poritz and Raji attribution, change indication,
CC BY-SA 4.0 ShareAlike, and the separately credited Scytale asset. The existing
`by-sa.eps` is not automatically cleared merely because it appears in the
official directory; its embedded third-party Adobe procsets and missing
component notice require resolution before public packaging.

## R014-DEC-0005 — Translation/build separation

The immutable authority mirror is never edited. The id-ID derivative is built
from a separate target tree, and every target-only mathematical correction is
recorded independently from localization.

## R014-DEC-0006 — First-boundary terminology

Use `keterurutan baik` for the noun, `prinsip keterurutan baik` for the formal
principle, and `prinsip sarang merpati` for the pigeonhole principle. These
forms follow Indonesian mathematical usage; `pengurutan baik`, `prinsip
terurut baik`, and `rumah merpati` are rejected as unnecessarily literal or
grammatically inconsistent variants.

## R014-DEC-0007 — Boundary reader branch

The target LaTeX keeps the entire upstream work in order, but a
`boundaryone` conditional closes the document immediately after `sec:WOPaMI`.
Only that bounded reader may be admitted while later sections remain English.

## R014-DEC-0008 — Portable full-book macro compatibility

The target keeps the upstream starred/unstarred `\pmod` behavior but copies the
original robust command with `\NewCommandCopy` on current LaTeX. Older engines
retain the upstream `\let` fallback. This is required for the complete edition
to remain buildable and is logged as a source-backed technical correction.

## R014-DEC-0009 — Second translation boundary

Boundary 2 advances contiguously through §1.2 `sec:AOwI`, authority lines
587–645. It retains the independently frozen Boundary 1 and freezes a new
current-source snapshot, deterministic 17-page PDF, all-page visual evidence,
and cumulative backend export. The next cursor is §1.3 `sec:DaDA`, authority
lines 646–828.

## R014-DEC-0010 — Integer units correction

The authority's claim that only `1` has a multiplicative inverse in `ZZ` is
mathematically false: both `1` and `-1` are units and self-inverse. The target
states both integers, logs `R014-ADV-0013`, and exposes the correction as a
typed backend record for possible inclusion in the single final upstream
report. No report is submitted during production.

## R014-DEC-0011 — Third translation boundary

Boundary 3 advances contiguously through §1.3 `sec:DaDA`, authority lines
646–828. It freezes its own source, deterministic 19-page PDF, all-page visual
evidence, and an append-only backend generation. Corrections
`R014-ADV-0014`–`0017` remain explicit source-correction records.

## R014-DEC-0012 — Fourth translation boundary

Boundary 4 advances contiguously through §1.4 `sec:RoIiDB`, authority lines
829–989. It freezes its own source, deterministic 23-page PDF, all-page visual
evidence, and an append-only backend generation. The backend preserves every
Boundary-3 object by stable-ID hash and adds an external two-clean-run
determinism witness. Corrections `R014-ADV-0018`–`0020` repair the expansion
theorem/proof and base-representation definition.

## R014-DEC-0013 — Fifth translation boundary

Boundary 5 advances contiguously through §1.5 `gcd`, authority lines
990–1218. The frozen target and deterministic 27-page PDF are admitted after
independent mathematical, structural, language, build, and all-page visual
review. Corrections `R014-ADV-0021`–`0024` cover zero inputs and the one-element
pairwise-coprimality edge case. Its backend migration must remain append-only
from the admitted Boundary-4 generation.

## R014-DEC-0014 — Sixth translation boundary

Boundary 6 advances through §1.6 `sec:EA`, authority lines 1219–1325.
`R014-ADV-0025` repairs the extended-Euclidean coefficient recurrence,
terminal-zero remainder domain, and endpoint formulas for short runs. The
mathematical, structural, and language review passed with no remaining
finding; exact source/ledger/terminology bytes are frozen. Two isolated builds
normalize to an identical 31-page PDF, and all-page visual QA passes. Its
backend append is designed only after the Boundary-5 predecessor is admitted.

## R014-DEC-0015 — Seventh translation boundary

The live target advances contiguously through the Chapter 2 introduction and
§2.1 `sec:ItC`, authority lines 1326–1621. Use `kongruensi`/`kongruen`, retain
the loanword `modulo`, and use `Lemma Euklides` and `Teorema Sisa Cina` as the
formal Indonesian names. Corrections `R014-ADV-0026`–`0030` repair five exact
authority defects without altering the remaining mathematical structure.
Independent mathematical, structural, and language review passed with no
remaining finding. Exact source/ledger/terminology bytes are frozen; two fresh
builds normalize to an identical 38-page PDF, and all-page visual QA passes.

## R014-DEC-0016 — Eighth translation boundary frozen/build-active

The live target advances contiguously through §2.2 `sec:LC`, authority lines
1622–1772. Use `kongruensi linear`, `persamaan Diofantin`, and `invers modular`
as the formal Indonesian terms. Corrections `R014-ADV-0031`–`0037` repair the
modulus domain, standard Diofantin definition, divisibility equation,
solution-count proof, solution labels, spacing, and an unbound exercise
variable. Independent review passed with no remaining finding. Exact source,
ledger, and terminology bytes are frozen; reproducible build and visual
admission are active.

## R014-DEC-0017 — Ninth translation boundary frozen

The live target advances contiguously through §2.3 `sec:CRT`, authority lines
1773–1876. Use `Teorema Sisa Cina`, `sistem kongruensi`, and `relatif prima
berpasangan`; preserve all four exercises and the simultaneous-congruence
construction. `R014-ADV-0038` replaces the authority's false fixed count of
two-factor theorem applications in the uniqueness proof with repeated
application formalized by induction. Independent mathematical, structural, and
language review, including the two reader-facing P3 refinements, passed with no
remaining finding. Exact source, ledger, and terminology bytes are frozen;
build and backend admission remain pending.

## R014-DEC-0018 — Tenth translation boundary frozen

The live target advances contiguously through §2.4 `sec:AWtWwC`, authority
lines 1877–2085. Use `relasi ekuivalensi`, `kelas ekuivalensi`, `wakil kelas`,
and `terdefinisi dengan baik`, while preserving quotient and congruence-class
notation. Corrections `R014-ADV-0039`–`0041` repair the authority's ambient-set
type error, an equivalence-proof direction, and the unbound factor in class
multiplication. Exact topology and exhaustive finite checks replay;
independent review passed with P1/P2/P3 all zero. Exact source, ledger, and
terminology bytes are frozen; build/backend admission remain pending.

## R014-DEC-0019 — Eleventh translation boundary under review

The live target advances contiguously through §2.5 `sec:EphiF`, authority lines
2086–2210. Use the attested forms `fungsi phi Euler` and `fungsi totient Euler`,
and the standard function terms `injektif`, `surjektif`, and `bijektif`.
Corrections `R014-ADV-0044`–`0047` repair the theorem domain, a repeated modulus,
the unit-group map's missing codomain/preimage checks, and a spelling defect.
Exact topology locally replays; independent review is active.

## R014-DEC-0020 — Boundaries 12–15 admitted contiguously

The target advances without gaps through the end of Chapter 3. Boundaries
12–15 were independently reviewed and frozen; Boundary 15's deterministic
66-page reader is `output/YAINTT_ID_BOUNDARY15.pdf`, SHA-256
`d1c5589f9d40c378de2431b5fc1ff17843255454046558e0d2aff0f9b9497df6`.
Each correction remains individually recorded in `ADVERSE_LEDGER.md`; none was
reported upstream during production.

## R014-DEC-0021 — Boundaries 16 and 17 frozen and built

Boundary 16 covers the Chapter 4 introduction plus §4.1 `sec:SSH`; Boundary 17
covers §4.2 `sec:CCaIV`. Their deterministic readers are respectively 75 pages,
SHA-256 `b55c96bc7391d615527e9e9a198f1c53816aa690b190bd3f4e7cd59398cd11ba`,
and 79 pages, SHA-256
`5b5fcb2db096fba3a36d952d463c6ca5b77cda0bdb3b32156bcaf437f8541e89`.
Structural, two-build reproducibility, and all-page visual receipts pass.

## R014-DEC-0022 — Boundary 18 frequency analysis frozen

§4.3 passed three independent reviews with P1/P2/P3 all zero. The immutable
source is `qa/frozen-boundaries/boundary18/yaintt-id.tex`, 259,027 bytes,
SHA-256 `eeb2989b2c0d3d711c0086fa1c91cd27b74244606debc99cff6b3dbde0c67986`.
The structural replay is `qa/SECTION_FREQUENCY_ANALYSIS_STRUCTURE.json`.

## R014-DEC-0023 — Boundary 19 RSA frozen

§4.4 passed four independent cryptographic, mathematical, structural, and
language reviews with no remaining finding. The immutable source is
`qa/frozen-boundaries/boundary19/yaintt-id.tex`, 260,897 bytes, SHA-256
`922aa4f157091caf2474aa5572502c813b53a462a2f8df94f02bbd7bf2220b43`.
Corrections `R014-ADV-0085`–`0099` include a joint key-generation model,
canonical RSA parameters, probabilistic salt claims, and correctly scoped
factoring/complexity statements.

## R014-DEC-0024 — Backend Boundary 9 admitted

The append-only modular backend is admitted through Boundary 9 with 1,959
records, 1,229 relations, 415 segment expressions, and 52 assessments.
`backend/MANIFEST.json` is 5,058 bytes, SHA-256
`1dbde62fdbf4c8fd739b4b273d2cdfc6117adb22d48d514f5a7cd745aa20d299`;
canonical rows SHA-256 is
`35ab0cf232ae769e05b7335fda9256e53fb75c34f5955f4a9df1954dec67aab0`.
The Boundary 10–11 append must replay from this exact predecessor.

## R014-DEC-0025 — Boundary 20 digital signatures frozen

§4.5 passed four independent reviews after separating algebraic verification
from signer attribution, defining an RSA message representative, and making
unforgeability, private-key integrity, trusted identity--key binding, and
freshness assumptions explicit. Frozen source:
`qa/frozen-boundaries/boundary20/yaintt-id.tex`, 263,239 bytes, SHA-256
`3406b82d45206919a14771653aea8afd9490a9d847c6c797183dc76377cdca7f`.
The admission receipt is `qa/SECTION_DIGITAL_SIGNATURES_STRUCTURE.json`.

## R014-DEC-0026 — Boundary 21 is gated on PKI and ownertrust correctness

§4.6 remains under rereview. Candidate `boundary21-r3` corrects the Eve key
description, requires an independently authenticated trust anchor or validated
certification path, and distinguishes OpenPGP signature validity from the
relying user's local policy and `ownertrust`. It may be frozen only after the
independent reviewer returns P1/P2/P3 all zero.

## R014-DEC-0027 — Boundary 22 Chapter 5 introduction translated

The Chapter 5 introduction is captured in `qa/review-candidates/boundary22`.
Its 16 environment events, three labels, three references, eight index entries,
two tables, and three list items replay. `R014-ADV-0111` restores the Lagrange
theorem attribution; `R014-ADV-0112` restores the unit-group star. Independent
review/freeze remains required.

## R014-DEC-0028 — Boundary 23 multiplicative-order properties translated

§5.1 is captured in `qa/review-candidates/boundary23`, 264,292 bytes, SHA-256
`ff52403513ebcad89d8b8d5ca93b9145bbc6dbc79aa9cc81691cf297eccd4661`.
Its target unit is 7,782 bytes, SHA-256
`7a52b8f1795adfcceb272fed61e6ce3ed2213babaa029faaa744c187e77a34fc`;
30 environment events, five labels, ten references, eleven index entries, four
exercises, three enumerated items, and nine displays replay. Corrections
`R014-ADV-0113`–`0115` repair order notation, equality/congruence, and an
exercise type error. Independent review/freeze remains required; the next
translation cursor is authority line 4783, §5.2 `sec:aNDGToSoEF`.

## R014-DEC-0029 — Full Indonesian corpus frozen at Boundary 28

The complete contiguous target is frozen at
`qa/frozen-boundaries/boundary28-final/yaintt-id.tex`, identical to
`source/yaintt-id.tex`: 269,464 bytes, SHA-256
`b1dd2926dc8bfdb84c6a3b4605490a8d96b14c44d89653867160d701fa0f17db`.
The full-corpus and independent translation reviews pass with no unresolved
reference, English instructional residue, or open finding. The structural
signature exactly preserves 1,541 tokens, 589 environments, 63 headings, 101
exercises, 112 list items, 157 labels, 129 references, 22 citations, 407 index
entries, and 12 captions. All 141 source corrections remain individually
recorded; no author contact or upstream report was made.

## R014-DEC-0030 — Final reflowed reader and backend admitted

The canonical reader is `output/YAINTT_ID.pdf`: 138 Letter pages, 962,527
bytes, SHA-256
`1ded3c6844b656347259b464bf21526fdc32dc2246c73ac58ab76ed28688eefc`.
Its second deterministic build is byte-identical and all 138 pages pass visual
inspection after reflowing tables and non-centered material. Fonts are embedded
and `/Lang` is `id-ID`; lack of full PDF tagging is retained as the sole known
accessibility limitation. The complete backend is admitted with 5,272 records;
two isolated rebuilds and the canonical replay have zero differences.

## R014-DEC-0031 — Version 1.0.0 published and public bytes verified

Version 1.0.0 is public at GitHub commit
`11e27180632af3b90202ad38c063807c0d057766` and Zenodo record `22052196`.
The version DOI is `10.5281/zenodo.22052196`; the concept DOI is
`10.5281/zenodo.22052195`. GitHub's release API normalizes leading-dot asset
names, so root `.zenodo.json` remains canonical in the repository/source ZIP
while the cross-destination release filename is `zenodo.json`. Zenodo requires
octet-stream bucket uploads and neutral `Accept` on content reads. Anonymous
GitHub API blob reads exhausted the unauthenticated quota, so final public proof
used commit/tag/main codeload archives plus direct release-asset downloads; all
repository files and all twelve release assets matched. The same twelve Zenodo
files matched by filename, byte count, SHA-256, and MD5. The sanitized receipt
is `publication/PUBLICATION_RECEIPT.json`, 28,618 bytes, SHA-256
`326dc18e3341676957ba0624c3cd50e59668b2b1551d804228ffef274cabc397`.

## R014-DEC-0032 — Zenodo landing page fronts the PDF

Post-publication presentation QA found that Zenodo selected `ATTRIBUTION.md`
for the landing-page preview even though the complete reader PDF was present.
The existing record was edited in place to set `YAINTT_ID.pdf` as
`default_preview`; no new version or DOI was created and none of the twelve
release files changed. Anonymous API readback reports the PDF as the default,
the public embedded viewer loads all 138 pages, and a fresh direct download is
962,527 bytes with SHA-256
`1ded3c6844b656347259b464bf21526fdc32dc2246c73ac58ab76ed28688eefc`,
matching the original publication receipt. The sanitized presentation receipt
is `publication/ZENODO_PRESENTATION_RECEIPT.json`, 1,371 bytes, SHA-256
`66a463964ecda86fd75e517fc709e8e9a01c2a22e9f33bb0e5e2dbb8c9b8a308`.

## R014-DEC-0033 — License-safe Figshare fallback published

The existing Zenodo concept remained current at version DOI
`10.5281/zenodo.22052196` and concept DOI `10.5281/zenodo.22052195`; no
competing Zenodo concept or duplicate version was created. Because Figshare's
public and authenticated license catalogs do not include the release's exact
CC BY-SA 4.0 license, no release bytes were uploaded or falsely relicensed.
Instead, a fileless CC0 metadata-and-link record was published under project
`280296` at article DOI `10.6084/m9.figshare.33314736.v1`. Its description
states the complete quality level, the CC BY-SA 4.0 / `Scytale.eps` CC BY-SA
3.0 boundary, both Zenodo DOIs, and every one of the twelve canonical
filenames, byte counts, and SHA-256 identities.

Article `33314736` was added additively to the existing Indonesian collection
`8668413` and anonymously verified in the collection's latest version at the
time, `10.6084/m9.figshare.c.8668413.v9`. Anonymous Figshare API and HTML
readback confirmed project membership, collection membership, CC0
metadata-only scope, and zero files. A new anonymous Zenodo readback downloaded
all twelve public files (4,086,426 bytes total) and reproduced every expected
SHA-256. The sanitized receipt is
`publication/FIGSHARE_PUBLICATION_RECEIPT.json`, 4,517 bytes, SHA-256
`d1d089e3054e8470aac0bfd458110b7284d68618793aecc6268459b61c8affb8`.

## R014-DEC-0034 — Reader-first Figshare version 2 published and verified

The same work-level Figshare article `33314736` was corrected in place; no
duplicate item was created. Version 2 is a public book at DOI
`10.6084/m9.figshare.33314736.v2`. Its first and preview-bearing file is the
complete 138-page `YAINTT_ID.pdf`, followed by compact source and backend ZIPs,
`LICENSE.md`, a payload manifest, and SHA-256 checksums. The six-file payload is
3,576,688 bytes, below its 500,000,000-byte cap. Immediately before publication,
the 22-article project inventory totaled 141,478,856 file bytes including this
draft, below the 20,000,000,000-byte project cap.

Figshare's structured license catalog still lacks CC BY-SA 4.0 and retains a
CC0 platform label. This label is not asserted for the work files. The public
description and included `LICENSE.md` explicitly control the real boundary:
the edition is CC BY-SA 4.0, `Scytale.eps` remains CC BY-SA 3.0, and no CC0 or
CC BY-only license is asserted for the uploaded work files. Anonymous API and
HTML readback confirmed version 2, book type, six files, and the PDF-first
presentation. Each public file was freshly downloaded and matched its local
byte count and SHA-256. Project `280296` and collection `8668413` both contain
the item; the collection was at version 21 during verification. The sanitized
receipt is `publication/FIGSHARE_PUBLICATION_RECEIPT.json`, 5,647 bytes,
SHA-256
`1946b42e65c10ba723cec91fbce747800c4bd4f7b1918f814d48b0ce479ed12b`.

After GitHub reinstatement, bounded anonymous checks returned HTTP 200 for the
repository and release, and the public `main` SHA still exactly matched
`11e27180632af3b90202ad38c063807c0d057766`; no GitHub mutation was required.

## R014-DEC-0035 — Indonesian field-usage terminology QA

A bounded arXiv search found no qualifying Indonesian-language number-theory
or cryptology TeX source. The closest genuine Indonesian TeX source,
arXiv:2001.05854, is a fluid-dynamics thesis and was rejected as field-mismatched.
The documented fallback is Rinaldi Munir's current 2026 three-part *Teori
Bilangan* lecture series for IF1220 Matematika Diskrit, Program Studi Teknik
Informatika, STEI--ITB: 153 Indonesian pages spanning divisibility, Euclidean
algorithms, congruences, primes, RSA, cryptography, and hash functions.

All three PDFs were downloaded, frozen by URL/byte count/SHA-256, text-inspected
in full for bounded terminology counts, and visually checked on representative
identity and terminology pages. They expose no explicit reuse license and are
therefore retained only as ignored local QA witnesses, never as release assets.
The comparison confirms the target's `plainteks`, `cipherteks`, `enkripsi`,
`dekripsi`, `kunci publik`, and `kunci privat`. Differences such as PBB/FPB,
`kekongruenan`/`kongruensi`, `balikan modulo`/`invers modular`, and
`Algoritma Euclidean`/`Algoritma Euklides` are legitimate register or naming
variants. They were added as glossary aliases with explicit rationale; no
preferred term or translated passage required replacement, so the admitted
source and 138-page reader remain byte-identical.

The durable audit is `qa/INDONESIAN_TERMINOLOGY_QA.json`. Repository and release
metadata now carry the exact provenance identification **OpenAI Codex
gpt-5.6-sol, Ultra.** while preserving Jonathan A. Poritz, Wissam Raji, Floris,
and all component credits.
