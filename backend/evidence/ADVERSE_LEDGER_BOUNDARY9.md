# Adverse Ledger

## R014-ADV-0001 — Later in-flux PDF unavailable

The authority landing page advertises a better in-flux PDF through
`../../numth/yaintt.pdf`, but the resolved target is unavailable and no matching
source closure is public. The source-bearing 7 May 2014 snapshot is selected.

## R014-ADV-0002 — `by-sa.eps` provenance incomplete

The official license badge EPS identifies an Illustrator creator string and
contains Adobe procsets with copyright notices, but the book and landing page
do not give a component-specific origin/license for this byte set. Do not ship
it publicly without a documented disposition. A clean independently sourced
CC BY-SA badge or a text-only notice is the preferred replacement. The exact
official byte remains only under `authority/downloads/by-sa.eps`; it is absent
from `source/assets/` and the derivative uses a textual CC BY-SA 4.0 notice.

## R014-ADV-0003 — Untagged authority PDF

The official PDF is untagged and has blank title/author PDF metadata. This is a
baseline fact, not an inherited requirement for the derivative.

## R014-ADV-0004 — Incorrect index-suppression switch

The source documents `suppressallIndex` near its configuration switches but
tests `suppressIndex` in the back matter, so the advertised option cannot work.
The target normalizes the documented switch to `suppressIndex`; this is a
build-control correction, not a translation.

## R014-ADV-0005 — Multiplication typeset as punctuation

In the second induction example, the authority has `(n+1).n^n`, which renders
an ASCII full stop where multiplication is intended. The target uses
`(n+1)\cdot n^n`. The inequality and proof are otherwise unchanged.

## R014-ADV-0006 — Duplicate word in source prose

The authority's first induction proof says `the the well-ordering principle`.
The Indonesian translation naturally contains a single grammatical phrase;
no mathematical content changed.

## R014-ADV-0007 — Mutable HTTP reader links

The front matter names the correct official resources through `http://` URLs,
which currently redirect to HTTPS. The derivative writes the final HTTPS URLs
directly while the authority manifest retains the exact original locator text.

## R014-ADV-0008 — Target build path

The authority expects EPS files beside `yaintt.tex`. The derivative keeps them
under `source/assets/` and adds `\graphicspath{{assets/}}`; filenames and asset
bytes are unchanged. The unresolved `by-sa.eps` is not referenced by the target.

## R014-ADV-0009 — First-boundary layout repairs

The authority's long third exercise overruns its line, and its cover is wider
than the current text block under the modern toolchain. The target adds a line
break before the unchanged exercise formula and expresses the cover width as
`.85\textwidth`. Long literal URLs become short descriptive `\href` links;
their exact destinations remain embedded and backend-recorded.

## R014-ADV-0010 — Boundary-only forward references

The translated release notes refer to later cryptology units. A bounded reader
ending after Section 1.1 cannot resolve those labels, so its conditional branch
prints their stable chapter/section numbers as plain text. The full-book branch
retains the original `\ref` targets.

## R014-ADV-0011 — Missing source space in institutional name

The authority writes `Colorado State University --Pueblo` without the space
after the dash. The target uses the correctly spaced institutional name.

## R014-ADV-0012 — Recursive `\pmod` wrapper on modern LaTeX

The authority saves `\pmod` with `\let\@@pmod\pmod` and then redeclares a robust
wrapper. Under LaTeX 2025, that alias follows the redeclaration and recurses at
the first unstarred `\pmod`, so a full build does not progress. The target uses
`\NewCommandCopy` when available and retains the historical `\let` fallback.
Both ordinary and the book's 14 starred `\pmod*` uses keep their intended
typesetting.

## R014-ADV-0013 — Missing unit among multiplicatively invertible integers

Section 1.2 of the authority says that only the integer `1` has a
multiplicative inverse in `Z`. In fact both units, `1` and `-1`, have
multiplicative inverses in `Z`, and each is its own inverse. The Indonesian
edition states both integers explicitly; the surrounding definition and
equation are unchanged.

## R014-ADV-0014 — Divisibility statements exceed the local domain

The authority defines `a divides b` only for a nonzero divisor `a`, but then
states `forall a in ZZ, a divides 0` and later quantifies the absolute-value
equivalence over all `a`. The target explicitly restricts the first proposition
to `a in ZZ setminus {0}` and adds `a != 0` to the equivalence. It also binds
both variables in the intervening size proposition. These changes make the
statements well-formed under the book's own definition; they do not change the
definition itself.

## R014-ADV-0015 — Division Algorithm existence set and zero remainder

The authority writes `A={a-bk >= 0 | k in ZZ}`, whose apparent elements are
truth-valued inequalities rather than integers. The target uses the intended
set-builder `A={a-bk | k in ZZ, a-bk >= 0}`. Later, the source calls `r` the
least positive integer even though the theorem permits `r=0`; the target calls
it the least element of `A`, thereby including the zero-remainder case.

## R014-ADV-0016 — Vacuous lower bound in the uniqueness proof

The source bounds an absolute value below by `-max(r_1,r_2)`, which is true but
vacuous. The target uses the informative chain
`0 <= |r_2-r_1| <= max(r_1,r_2) < b`, which is the bound required together
with divisibility to conclude that the difference is zero.

## R014-ADV-0017 — Unbound integer parameter in two exercises

Two authority exercises say that a square is “of the form” `8m+1`, `3m`, or
`3m+1` without binding `m`. The target states explicitly that the parameter is
an integer, and separates the nonexistence claim for `3m+2`. The mathematical
tasks and expressions are otherwise preserved.

## R014-ADV-0018 — Base-expansion theorem omits a digit, zero length, and uniqueness

The authority quantifies `a_1,...,a_l` although its displayed expansion also
uses `a_0`. It places `l` in the book's positive-natural-number domain, which
cannot represent any `1 <= m < b` because those cases require highest exponent
zero. Finally, the theorem statement asserts only existence even though the
section lead and the second half of its proof assert uniqueness. The target
quantifies every digit from `a_0` through `a_l`, permits
`l in Z_{>=0}`, states the unique-existence claim proved below, writes the
expansion as a sum valid when `l=0`, and handles that terminal case explicitly
before continuing with an indexed quotient recurrence.

## R014-ADV-0019 — Invalid factorization step in the uniqueness proof

The authority chooses an unspecified differing digit index `j` and then factors
`b^j` out of the entire difference. That factorization is valid only when `j`
is the smallest differing index, so all lower digit differences vanish. It also
drops the minus sign when isolating `a_j-c_j`. The target selects the smallest
such `j` and restores the sign. The sign does not affect the subsequent
divisibility claim, but the displayed equality should still be correct.

## R014-ADV-0020 — Base-representation definition has missing and malformed digits

The authority definition again omits `a_0` from its quantified list and from the
digit string, writes `m_b` despite introducing the notation `(m)_b`, typesets
`0\le aj<2` without the subscript, and says that coefficients `a_0,...,a_l`
use only `l` wires rather than `l+1`. The target restores `a_0`, the final digit,
the parenthesized notation, the subscript, and the correct wire count; it also
uses the nonnegative index domain inherited from the corrected theorem.

## R014-ADV-0021 — Zero has infinitely many divisors, but the common-divisor set is finite

The authority says that two integers not both zero each have only finitely many
divisors. That is false when one of them is zero, since every nonzero integer
divides zero. The target instead observes that at least one input is nonzero
and has finitely many divisors, so the set of divisors common to both inputs is
finite. This is exactly the finiteness needed to define their greatest common
divisor.

## R014-ADV-0022 — Divide-by-gcd theorem permits division by zero and uses positive witnesses

The authority's theorem permits `(a,b)=(0,0)`, for which its convention gives
`d=gcd(0,0)=0` and the displayed quotients `a/d` and `b/d` are undefined. Its
proof also places the witnesses in `NN`, although either quotient may be
negative. The target excludes the all-zero pair and binds the quotient
witnesses in `ZZ`.

## R014-ADV-0023 — Linear-combination proof assumes both inputs are positive

The authority claims without loss of generality that two integers not both
zero may both be taken positive. Absolute values only make them nonnegative,
so one input may still be zero. The target absorbs the signs into the integer
coefficients, works with nonnegative inputs not both zero, and proves the
linear-combination set is nonempty by handling either positive input.

## R014-ADV-0024 — Pairwise coprimality implication needs at least two integers

The authority states that pairwise relatively prime integers are mutually
relatively prime for every `n\in\NN`. For `n=1`, pairwise coprimality is
vacuous, while mutual coprimality requires `\gcd(a_1)=|a_1|=1`; for example,
`a_1=2` is a counterexample. The target adds the necessary condition
`n\geq 2` to the proposition.

## R014-ADV-0025 — Extended Euclidean recurrence has shifted indices and excludes the terminal zero

The authority puts all remainders in `\NN` even though it defines the terminal
remainder to be `0`. More seriously, it pairs `q_{j+1}` with the recurrence
`s_{j+1}=s_{j-1}-q_{j+1}s_j` (and similarly for `t`) and concludes with
`s_{n+1}a+t_{n+1}b`. From
`r_j=q_{j+1}r_{j+1}+r_{j+2}`, the coefficient recurrence is instead
`s_{j+2}=s_j-q_{j+1}s_{j+1}` and
`t_{j+2}=t_j-q_{j+1}t_{j+1}`, yielding
`r_n=s_na+t_nb`. The target also assigns remainders to the nonnegative
integers and states the stopping condition explicitly. It also replaces the
authority's endpoint-expanded division display, which is not well formed when
the algorithm stops with `n=1` or `n=2`, by one indexed recurrence through the
terminal division and a gcd chain that references only `r_0`, `r_1`, `r_n`,
and the defined terminal remainder `r_{n+1}`.

## R014-ADV-0026 — Missing space after the author's age

The chapter introduction in the authority reads `when he was 24;a
translation`, joining two clauses without a space. The target uses a semicolon
and a space, preserving the bibliographic claim while repairing the sentence.

## R014-ADV-0027 — Basic congruence transitivity uses the wrong modulus and relation

Part 2 of the authority's basic-properties theorem concludes
`a\equiv c\pmod m`, although every hypothesis uses modulus `n` and `m` is
undefined. Its proof then writes `a=c\pmod n`, using equality where congruence
is required. The target uses `a\equiv c\pmod n` in both the statement and the
proof.

## R014-ADV-0028 — Product-congruence proof has an incorrect coefficient

In Part 9 of the basic-properties proof, the authority derives
`ca-cb=(ck)n` and `bc-bd=(bl)n` but then writes their sum as
`(kc-lb)n`. The correct coefficient is `ck+bl`. The target restores that sum
and removes a duplicated `such that` from the surrounding sentence.

## R014-ADV-0029 — Cancellation theorem states equality instead of congruence

Part 2 of the authority's cancellation theorem prints
`b=c\pmod n` on the left side of an equivalence. The surrounding theorem and
proof require the congruence `b\equiv c\pmod n`, which the target supplies.

## R014-ADV-0030 — Enumeration of zero classes uses the wrong modulus and omits a class

The final proof in the section concludes
`x\equiv x_j\pmod{x_j}`, although the proof is classifying solutions modulo
`n`. It then lists `x_1,...,x_{d-1}` as the `d` representatives, omitting
`x_0`. The target uses modulus `n` and lists all representatives
`x_0,...,x_{d-1}`.

## R014-ADV-0031 — Linear-congruence modulus falls outside its defining domain

The authority defines congruence only for a positive modulus in `NN`, but the
definition of a linear congruence and the theorem immediately following it put
the modulus `n` in all of `ZZ`, including zero. The target consistently uses
`n\in\NN` in both places.

## R014-ADV-0032 — Diophantine-equation definition treats variables as integers

The authority calls an algebraic equation Diophantine when its “constants and
variables are all integers.” Variables are not fixed integers; the defining
condition is that a polynomial equation has integer coefficients and that its
solutions are sought in integers. The target states that standard definition,
which includes the linear two-variable equation used immediately afterward.

## R014-ADV-0033 — Linear-congruence existence proof asserts the wrong divisibility

After deriving `a(kp)-b=(-kq)n`, the authority writes
`n\mid a(kp)=b`. The required conclusion is
`n\mid(a(kp)-b)`, which is equivalent to `a(kp)\equiv b\pmod n`.
The target restores that parenthesized difference.

## R014-ADV-0034 — Solution-count proof cites the wrong case and proves only necessity

For general `d=gcd(a,n)`, the authority uses Part 2 of its cancellation theorem
to infer `x\equiv y\pmod{n/d}`; the applicable result is Part 1. It then counts
the possible differences `delta` but proves only that every solution produces
one of them, which establishes an upper bound rather than existence of all
`d` solution classes. The target cites Part 1 and proves the converse: if
`delta=t(n/d)` and `a=da'`, then `a delta=a'tn` is divisible by `n`, so every
one of the `d` difference classes yields a solution.

## R014-ADV-0035 — Multiple-solution example duplicates one label and omits another

The authority labels the three solution classes to `3x\equiv12\pmod6` as
`x_1`, `x_1`, and `x_2`. The target labels them `x_0`, `x_1`, and `x_2` and
writes each as a congruence modulo 6, namely the classes 0, 2, and 4.

## R014-ADV-0036 — Missing space in the modular-inverse example

The authority joins the formula and following word as `$7^{-1}$of`. The target
restores the missing space while translating the sentence.

## R014-ADV-0037 — Modular-inverse exercise leaves `b` unbound

The final exercise quantifies `a` and `n` but then uses `b` and `b^{-1}`
without declaring `b`. The target binds both `a,b\in\ZZ`; the requested inverse
product identity is otherwise unchanged.

## R014-ADV-0038 — CRT uniqueness proof overcounts theorem applications

The authority says that combining the `k` pairwise relatively prime divisors
of `x-y` requires applying the preceding two-factor theorem `k` times. For
`k\geq2`, only `k-1` combinations are needed, while for `k=1` none is needed.
The target avoids the false count and states that the theorem is applied
repeatedly, formally by induction.
