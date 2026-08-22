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
