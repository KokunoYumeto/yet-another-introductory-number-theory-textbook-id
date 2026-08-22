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

## R014-ADV-0039 — Equivalence-class representative has the wrong ambient set

The authority defines an equivalence class `\Cc` and then assumes
`\Cc\in S`, even though `\Cc` is a subset/class rather than an element of the
underlying set. The required type is `\Cc\in S/{{}\cong{}}`. The target uses
that quotient-set membership while retaining `r\in S` for a representative.

## R014-ADV-0040 — Partition proof invokes symmetry in the wrong direction

From `z\cong x` and `z\cong y`, the authority says symmetry gives
`y\cong z` and then claims transitivity gives `x\cong y`; those two displayed
relations instead give `y\cong x`. The target applies symmetry to obtain
`x\cong z`, then transitivity to obtain `x\cong y`, and explicitly closes the
mutual-inclusion and exclusivity arguments.

## R014-ADV-0041 — Congruence-class multiplication uses an unbound variable

The authority defines representatives `a` and `b` of `\Cc` and `\Dd` but
writes `\Cc\cdot\Dd=[a\cdot m]`, where `m` is unbound. The following theorem
and proof consistently require `[a\cdot b]`; the target restores that factor.

## R014-ADV-0042 — Congruence-class transition uses the wrong preposition

The authority writes `beside just Corollary`, where the intended transition is
`besides` or `in addition to`. The target states directly that many earlier
results, in addition to the cited corollary, can be reformulated with
congruence classes.

## R014-ADV-0043 — Rational-arithmetic exercise pluralizes a single theorem

The authority asks for a version of `Theorems` but supplies exactly one
cross-reference, `thm:plustimeswelldefined`. The target uses the singular
`Teorema` while preserving that reference and the exercise's mathematical task.

## R014-ADV-0044 — Multiplicativity theorem applies `phi` outside its domain

The authority defines `\phi(n)` only for `n\in\NN` but states the
multiplicativity theorem for `n,m\in\ZZ`, which includes zero and negative
arguments where its own function is undefined. The proof immediately fixes
positive `n,m`. The target states the theorem consistently for
`n,m\in\NN`.

## R014-ADV-0045 — Cartesian product repeats the first modulus

The authority defines
`(\ZZ/n\ZZ)^*\times(\ZZ/m\ZZ)^*` but writes both components of its set-builder
condition in `(\ZZ/n\ZZ)^*`. The second component must satisfy
`b\in(\ZZ/m\ZZ)^*`, as used throughout the cardinality argument. The target
restores that modulus.

## R014-ADV-0046 — Unit-group correspondence omits its codomain and preimage checks

The authority proves that the CRT map is independent of representatives,
injective, and has a congruence-class preimage, but never proves that its image
lies in the two unit groups or that the CRT preimage is a unit modulo `nm`.
The target supplies both missing checks by reducing an inverse modulo `nm` to
the two factors and, conversely, combining component inverses with the Chinese
Remainder Theorem.

## R014-ADV-0047 — Totient attribution sentence omits a letter

The authority says the name “was give to it” by Sylvester. The target renders
the intended statement (“diberikan oleh”) and retains the attribution and
English pronunciation note.

## R014-ADV-0048 — Small-factor proof reverses the decisive inequality

To prove that a composite `n` has a divisor at most `sqrt(n)`, the authority
says the paired divisors `a` and `n/a` cannot both be *less* than `sqrt(n)` and
derives a product smaller than `n`. That establishes the opposite of the
needed claim. The correct contradiction assumes both factors are *greater*
than `sqrt(n)`, which would make their product greater than `n`. The target
uses that direction.

## R014-ADV-0049 — Prime-divisor proposition drops its first alternative

The authority states `p\mid ab` implies `p\mid` or `p\mid b`, leaving the first
dividend blank. The proof and Euclid's Lemma require `p\mid a` or `p\mid b`.
The target restores `a`.

## R014-ADV-0050 — Prime-factor cancellation incorrectly leaves `n` unchanged

In the uniqueness proof for the Fundamental Theorem of Arithmetic, the
authority cancels the equal factors `p_1=q_j` but then writes the remaining
products as still equal to `n`. They equal `n/p_1`. The target restores that
quotient and makes the empty-product/end-of-list argument explicit.

## R014-ADV-0051 — Square-free exercise changes domain without handling one

The authority first defines square-free only for `n>1`, then asks for an
equivalence for every `n\ge1`. The case `n=1` is square-free but is not a
nonempty product of distinct primes. The target defines the property on
`\NN` and explicitly permits the empty product, of value `1`.

## R014-ADV-0052 — Fundamental-theorem prose contains two broken phrases

The authority says `in term s of the p's` and later `run of of primes`. The
target renders the intended factor-reordering and exhaustion statements
without those typographical breaks.

## R014-ADV-0053 — Wilson proof does not handle the prime two

The authority groups the nontrivial factors into `(p-3)/2` inverse pairs. For
`p=2`, which is included in the theorem, this count is `-1/2` and the pairing
argument is not defined. The target proves the `p=2` case directly and applies
the inverse-pair argument only to odd primes.

## R014-ADV-0054 — Wilson proof leaves a parenthetical clause unclosed

The authority opens the parenthetical clause beginning `so would p-1` but does
not close it after the lemma reference. The target recasts the argument as
complete sentences while preserving the mathematical content.

## R014-ADV-0055 — Worked Wilson example overstates the inverse search range

The authority says it finds all inverses of `2,...,6` but lists only the two
nontrivial inverse pairs among `2,...,5`; the factor `6=p-1` is handled
separately in the following display. The target states that exact range and
also repairs the authority's missing space in `or$ 4^{-1}`.

## R014-ADV-0056 — Order-divisibility theorem omits its defining modulus domain

The authority states `ord_n(a) | phi(n)` for `n in N`, although its own
definition of `ord_n(a)` requires `n>=2`. The target adds that missing domain
condition to the theorem.

## R014-ADV-0057 — Coset cover uses the wrong ambient set and relation

The authority concludes that all unit classes lie in a coset but displays
`ZZ/nZZ` as a subset of the coset union. Nonunit classes need not lie in any of
those cosets, and the established cover is an equality on `(ZZ/nZZ)^*`. The
target displays that exact unit-group equality and states both inclusions.

## R014-ADV-0058 — Coset-equality argument leaves its exponent range unjustified

The authority rewrites an arbitrary element of one coset using exponent
`q+j-k`, which may be negative even though the cyclic subgroup was defined
using exponents `1,...,ord_n(a)`. The same sentence also repeats the broken
phrase `is can be expressed`. The target proves one inclusion, reduces powers
modulo the order into the defined range, and obtains equality from the equal
finite cardinalities.

## R014-ADV-0059 — Euler proof invokes an order that is undefined at modulus one

Euler's theorem is stated for every `n in N`, but the proof immediately invokes
`ord_n(a)`, which the preceding definition only supplies for `n>=2`. The target
proves the `n=1` case directly and then applies the order theorem for `n>=2`.

## R014-ADV-0060 — Remainder exercise has singular–plural disagreement

The authority asks `What are the remainder` while requesting two separate
remainders. The target asks the two division questions explicitly.

## R014-ADV-0061 — Fermat permutation proof gives false difference bounds

For `0<=j,k<p`, the authority claims `-p+1<j-k<p-1`, which excludes the
possible endpoint differences `-(p-1)` and `p-1`. The needed and correct bound
is `-p<j-k<p`; it still shows that the only multiple of `p` in the range is
zero. The target uses that bound.

## R014-ADV-0062 — Fermat product display contains a duplicated product symbol

The authority writes `1\cdot\cdot2` on the right-hand side of the product
congruence. The target restores `1\cdot2`.

## R014-ADV-0063 — Euler permutation set drops the final factor

The authority defines `M_a^*` with first term `[b_1a]_n` but final term
`[b_{phi(n)}]_n`, omitting the factor `a`. The subsequent distinctness and
product arguments require every listed unit class to be multiplied by `a`.
The target restores `[b_{phi(n)}a]_n`.

## R014-ADV-0064 — Alternate Euler proof again omits the modulus-one case

The theorem includes `n=1`, but its displayed enumeration of unit
representatives requires `1<=b_1<...<b_{phi(n)}<n` and therefore cannot be
formed at modulus one. The target proves `n=1` directly, then performs the
unit-permutation argument for `n>=2`.

## R014-ADV-0065 — Decryption definition is indexed under ciphertext

The authority's definition of decrypting a ciphertext inserts
`\index{ciphertext}` rather than an index entry for decryption. The target
indexes the operation as `dekripsi`.

## R014-ADV-0066 — Scytale authentication explanation contains two broken phrases

The authority calls the device `a simple from of authentication` and says that
Alice has a scytale `matching ... to the Bob's`. The target renders the intended
claim as a simple authentication mechanism based on a scytale matching Bob's.

## R014-ADV-0067 — Key-secrecy paragraph uses the wrong adverbial form

The authority refers to `the key for a particularly communication channel`.
The intended phrase is `the key for a particular communication channel`; the
target translates that meaning.

## R014-ADV-0068 — Kerckhoffs passage misspells the name and misstates the role

The authority writes `Kerckhoff's Principle` and describes its namesake as `a
French military cryptography`. The target uses the correct spelling
`Kerckhoffs`, identifies Auguste Kerckhoffs as the author, and names his 1883
two-part work *La Cryptographie militaire* without inheriting the malformed
role phrase.

## R014-ADV-0069 — Greek `kryptos` headword omits its accent

The authority ends the Greek root with `\tau o\varsigma` (κρυπτος). The
correct headword is κρυπτός, so the target restores the acute accent as
`\tau\acute{o}\varsigma` in both the visible entry and its index entry.

## R014-ADV-0070 — Greek `scytale` headword omits lambda

The authority prints `\sigma\kappa\upsilon\tau\acute{\alpha}\eta`
(σκυτάη), which is not the intended headword. The target restores the missing
`\lambda` in σκυτάλη:
`\sigma\kappa\upsilon\tau\acute{\alpha}\lambda\eta`.

## R014-ADV-0071 — Vigenère decryption refers to an undefined scalar key

The authority tells Bob to move every letter `k` places backward, although the
defined key is the vector `\vec{k}=(k_1,\dots,k_\ell)` and no scalar `k` is
defined in that construction. The target states that each letter is shifted by
the corresponding key component and preserves the equivalent inverse key
`-\vec{k}`.

## R014-ADV-0072 — Vigenère key sentence lacks its grammatical head

The authority says `the key in Vigenère is a written down, memorized, and
shared ... in the form of a word`. The target supplies the intended
construction: the key is a word that is written down, memorized, and shared.

## R014-ADV-0073 — Diplomatic-cipher description uses the wrong homophone

The authority calls Vigenère `the principle diplomatic cipher`; the intended
adjective is `principal`. The target renders this as `cipher diplomatik utama`.

## R014-ADV-0074 — Bitwise-encryption explanation repeats a whole phrase

The authority begins a sentence `Another way of saying that is to say that is
that`. The target removes the duplicated wording while preserving the
bit-addition statement in `\ZZ/2\ZZ`.

## R014-ADV-0075 — Octavian is described as Caesar's nephew

The authority calls Octavian Julius Caesar's nephew. Octavian was the grandson
of Caesar's sister Julia and therefore Caesar's great-nephew. The target states
that exact family relationship without changing the surrounding cipher history.

## R014-ADV-0076 — Kerckhoffs is misspelled again

The frequency-analysis section again writes `Kerckhoff's Principle`. The
target consistently uses the correct name `Prinsip Kerckhoffs`.

## R014-ADV-0077 — Vigenère paragraph makes `decryption` singular

The authority says that a computer generates `all of those possible
decryption` while referring to nearly twelve million separate results. The
target uses the intended plural, `semua kemungkinan dekripsi`.

## R014-ADV-0078 — Safe-combination example omits `of`

The authority says Alice sends `an encrypted version the combination of a
safe`. The target restores the intended relation: an encrypted version of a
safe's combination.

## R014-ADV-0079 — Refined-approach sentence has subject–verb disagreement

The authority begins `This suggest the following`. The target renders the
intended singular agreement and introduces the refined method naturally.

## R014-ADV-0080 — Square-error definition ends with an unmatched parenthesis

The authority closes its explanation of `a=0, b=1, ...` with `).` although
no parenthetical clause was opened. The target omits the stray parenthesis.

## R014-ADV-0081 — Final Vigenère algorithm puts a vector in a scalar range

The authority says `for each such \vec{k}_\ell in the range 1,\dots,L`,
although `\vec{k}_\ell` is a key vector and the scalar key length `\ell` is
what ranges from 1 to `L`. The target binds each vector to its corresponding
`\ell=1,\dots,L`.

## R014-ADV-0082 — Exercise uses the wrong indefinite article

The authority asks about `an brute-force attack`. The target renders the
exercise without inheriting that grammatical error.

## R014-ADV-0083 — Keyword-frequency explanation treats unequal shifts as an unweighted average

The authority says the full Vigenère ciphertext distribution is the average of
16 shifted English distributions because the 35-character keyword has 16
distinct letters. Those letters occur with unequal multiplicities, so the
distribution is instead approximately a weighted mixture over all 35 keyword
positions, comprising 16 distinct shifts. The target states that distinction.

## R014-ADV-0084 — Wrong key-length claim guarantees flattening too broadly

The authority claims that every guessed length smaller than the true key length
makes every residue-class letter distribution flat. That is not guaranteed:
flattening is a tendency when an incorrect grouping mixes several different
Caesar shifts. The target states the qualified claim and retains the concrete
`\ell=5` example as evidence.

## R014-ADV-0085 — Private-key diagram has a broken shared-key caption

The authority's diagram places the fragment `of shared key` between Alice and
Bob, leaving the communication action unstated. The target identifies the
intended private exchange of the shared key.

## R014-ADV-0086 — Public-key security paragraph uses the wrong function

The authority writes Bob's public encryption key as `k_e=\Dd(k_d)` even
though the asymmetric-system definition names the key-association function
`\Ee:\Kk_d\to\Kk_e`. The target restores `k_e=\Ee(k_d)`.

## R014-ADV-0087 — RSA setup omits the distinct-prime requirement

The authority initially permits the two RSA primes `p` and `q` to be equal,
but later uses `\phi(pq)=(p-1)(q-1)` and assigns the non-coprime correctness
case under the explicit hypothesis that they are distinct. The target states
the necessary distinctness at key generation.

## R014-ADV-0088 — RSA key-association map exposes a flaw in the abstract key model

The authority reverses its abstract map `\Ee:\Kk_d\to\Kk_e`; merely reversing
the arrow still fails because `(n,d)` neither identifies an unrestricted
integer `e` uniquely nor exposes `\phi(n)` for feasible computation. The target
repairs the abstraction itself: a key-generation algorithm `\mathsf{Gen}`
jointly emits an associated `(k_e,k_d)` pair, and the RSA definition implements
that algorithm from canonical `p,q,e,d` choices while retaining `(n,d)` as the
operational decryption key.

## R014-ADV-0089 — RSA setup diagram omits the coprimality value

The authority's diagram says only `with \gcd(e,\phi(n))`. The target
restores the required condition `\gcd(e,\phi(n))=1` from the definition.

## R014-ADV-0090 — Prime-counting function uses the wrong bound variable and set

The authority defines `\pi(x)` using `p\le n`, where `n` is unbound in
the theorem, and never restricts `p` to primes. The target defines
`\pi(x)=\#\{p\in\NN\mid p\text{ prime and }p\le x\}`.

## R014-ADV-0091 — Salt paragraph overstates what traffic analysis cannot do

The authority concludes broadly that traffic analysis is impossible once salt
is added. Independently sampled salt from a sufficiently large space makes
equality-of-ciphertext correlation very unlikely; it does not make salt
collisions impossible or hide timing, size, endpoint, and other metadata. The
target states the probabilistic limitation explicitly.

## R014-ADV-0092 — UTF-8 and UTF-16 are assigned one false shared byte range

The authority says both common encodings use between two and four bytes per
character. UTF-8 uses one to four bytes, whereas UTF-16 uses two or four bytes
for a Unicode scalar value. The target states the ranges separately.

## R014-ADV-0093 — Naive exponentiation counts one multiplication too many

The authority says computing `a^k` means multiplying `a` by itself `k`
times. Starting from one factor, only `k-1` multiplications are needed. The
target explicitly forms `k` factors and performs `k-1` multiplications while
retaining the same exponential-runtime comparison.

## R014-ADV-0094 — Repeated-squaring hint lists `a^6` instead of `a^8`

The authority's alleged successive squares are `a^2,a^4,a^6`. The third
successive square is `a^8`; the target restores the binary-power sequence.

## R014-ADV-0095 — Euclidean-algorithm step bound drops the factor of two

After establishing that the remainders halve every two divisions, the authority
claims at most `\log_2(b)` divisions. The target asks for the valid bound
`2\lfloor\log_2(b)\rfloor+1` and retains the resulting linear bound in the
number of decimal digits, with small endpoint cases checked separately.

## R014-ADV-0096 — RSA practicality prose contains several mechanical defects

The authority uses `no-printing` for nonprinting ASCII controls, says Unicode
`which as` characters and is stored `in a variety encodings`, asks for a
`much fast` algorithm, and later writes `a least a faction` and
`digits require`. The target renders the intended prose without those
typographical and grammatical defects.

## R014-ADV-0097 — ASCII adoption date is stated as the single year 1960

The authority says ASCII has been used `since 1960`, although the standard
was developed and first standardized during the early 1960s. The target uses
the historically accurate broader phrase `sejak dekade 1960-an`.

## R014-ADV-0098 — Naive-exponentiation runtime equates unrelated variables

The authority defines `d` as the digit length of multiplication operands, then
asserts `kp(d)=c_1e^{c_2d}p(d)` without relating exponent `k` to that `d`.
The target instead lets `D` be the maximum encoded input length, obtains the
valid bound `O(kp(D))`, and observes that a `D`-digit `k` can have order `10^D`,
which makes the naive algorithm exponential in input length.

## R014-ADV-0099 — Factoring claim treats every large composite as hard

The authority says larger composite integers are astronomically harder to
factor, although even integers and integers with small factors are trivial.
The target restricts the claim to RSA-style semiprimes formed from two large,
comparably sized primes and retains RSA-768 as the concrete historical example.

## R014-ADV-0100 — Generic public-key definition does not justify reverse-order signing

The authority presents its basic digital-signature construction for a generic
public-key cryptosystem and asserts that encryption and decryption are inverses
in either order. The preceding asymmetric-system definition requires only
`d_{k_d}(e_{k_e}(m))=m`; it neither makes the private operation defined on
messages nor requires the reverse composition. The target states both domain
and reverse-identity conditions for every generated keypair and `m\in\Mm`, and
identifies RSA as the intended example.

## R014-ADV-0101 — Collision resistance permits the same message twice

The authority defines collision resistance using “two messages” `m_1,m_2` but
does not require them to be distinct, so the displayed equality is trivially
satisfied by `m_1=m_2`. The target adds the necessary condition `m_1\ne m_2`.

## R014-ADV-0102 — RSA signature uses a transposed private-key subscript

The authority writes the signature as `s=d_{d_k}(h(m))`, although the private
decryption/signing key is consistently named `k_d`. The target restores
`s=d_{k_d}(H_n(m))`, using the encoded representative defined for the RSA
message space.

## R014-ADV-0103 — Digital-signature prose contains several mechanical defects

The authority omits the subject in `in that are hard`, writes `After, all`,
adds a stray article in `compute the h(m)`, repeats `here` in the feasibility
definition, and omits terminal punctuation after the infinite-collisions
sentence. The target renders the intended prose without those defects.

## R014-ADV-0104 — Second-preimage exercise forgets to exclude the original input

The authority asks for an input `m_1` having no second preimage, then formalizes
this as no `m_2` at all satisfying `h(m_2)=h(m_1)`. That formula is impossible
because `m_2=m_1` always works. The target states the intended condition
`m_2\ne m_1` explicitly.

## R014-ADV-0105 — RSA signature applies modular arithmetic to an unencoded bit string

The authority applies the RSA private operation directly to bit-string hash
output, omits reduction modulo `n` in its signing table, and never maps the
digest into the RSA message space. The target defines an agreed encoded
representative `H_n(m)\in\{0,\dots,n-1\}`, uses modular exponentiation in both
directions, and labels the diagram schematic rather than deployment-ready.

## R014-ADV-0106 — Signature verification is mistaken for sender identity and freshness

The authority concludes that a valid signed pair proves the network sender had
the private key. Verification alone establishes only algebraic consistency of
the pair with the public key. Attributing its creation to the named signer also
requires an unforgeable signature scheme, an uncompromised private key, and a
trusted identity--key binding. Even under those assumptions, verification does
not identify the network sender or establish message freshness: anyone can
forward or replay an old pair. The target states those limits.

## R014-ADV-0107 — Preimage resistance lacks a challenge distribution

The authority says only “given a hash value `t`,” which lets an adversary choose
a digest with a known preimage or an unreachable target. The target defines the
challenge as `t=h(M)` for a randomly sampled hidden input under a specified
distribution, then asks the adversary to recover any preimage.

## R014-ADV-0108 — Certificate definition signs a bare key without an identity binding

The authority describes a digital certificate as a CA signature on the public
key itself. A bare signed key does not state whose identity is being certified.
The target defines the certificate as a signed, structured statement binding an
identified subject to a public key and necessary metadata.

## R014-ADV-0109 — Web-of-trust advice rewards unverified edges and hearsay signing

The authority says usefulness requires as many people and connections as
possible, then suggests signing a stranger's key because a trusted acquaintance
vouches for that person. Trust depends on directly verified identity--key
certifications plus the relying user's local policy and judgment of each
certifier as an introducer (`ownertrust`), not raw graph density or signature
validity alone. A signer must directly verify the claimed identity--key binding.
The target states all of these requirements.

## R014-ADV-0110 — Key-fingerprint advice recommends broken MD5 and has a missing preposition

The authority recommends checking an `md5` key fingerprint and ends with the
malformed phrase `second md5 pre-image the fingerprint`. MD5 has lacked
collision resistance since the source's own 2004 example and is unsuitable for
new key-fingerprint verification. The target requires the full fingerprint
under the current key format and explicitly rejects MD5 for this purpose.

## R014-ADV-0111 — Subgroup-order divisibility is attributed to Euler instead of Lagrange

The authority says the order of `\left<a\right>` divides the order of the
ambient unit group “from Euler's Theorem.” This is the Lagrange-theorem result
already proved as Theorem `thm:orddividesphi`. The target restores that theorem
name and cross-reference.

## R014-ADV-0112 — Chapter observations drop the unit-group star

Two bullets discuss large cyclic subgroups in `\ZZ/n\ZZ`, although all rows and
the surrounding argument concern the multiplicative unit group
`(\ZZ/n\ZZ)^*`. The target restores the starred group in both bullets.

## R014-ADV-0113 — Order-of-a-power theorem drops the macro and modulus

The authority states `ord_n(a^k)` without the command backslash and then sets
`r=\ord(a^k)` and `s=\ord(a)`, dropping the modulus that defines both orders.
The target consistently writes `\ord_n(a^k)` and `\ord_n(a)`.

## R014-ADV-0114 — Congruence in the order-of-a-power proof is printed as equality

The authority writes
`(a^k)^{s/g}=(a^s)^{k/g}=1^{k/g}\equiv1\pmod n`. From the definition of
`s=\ord_n(a)`, only `a^s\equiv1\pmod n` is known, not literal equality.
The target changes the second equality to a congruence.

## R014-ADV-0115 — Exercise applies relative primality to residue-class objects

The authority declares `a,b\in\ZZ/n\ZZ` and then says those residue classes
are relatively prime to the integer `n`. The target states the intended typed
hypotheses as `a,b\in\ZZ` with `\gcd(a,n)=\gcd(b,n)=1`, under which every
displayed multiplicative order is defined.

## R014-ADV-0116 — Widely distributed CA keys are treated as inherently trusted

The authority treats broad distribution of a CA verification key as a basis
for trust. Distribution alone permits the same key-substitution attack the
section is meant to prevent. The target requires an independently authenticated
trust anchor or a validated certification path ending at such an anchor, and
describes distribution as PKI machinery rather than a source of trust.

## R014-ADV-0117 — Positive-natural-number convention breaks two exponent proofs

The authority uses `q,r\in\NN` in a division-algorithm step even though the
quotient or remainder may be zero. It also chooses `\ell\in\ZZ` in the
forward exponent-congruence proof and then raises a residue to a potentially
negative power without defining that operation; the reverse direction can
apply a theorem restricted to positive exponents to `j-k=0`. The target uses
nonnegative quotient/remainder and exponent domains, exploits symmetry to
avoid negative powers, and handles `j=k` before invoking the positive-exponent
theorem.

## R014-ADV-0118 — Primitive-root count proof loses its modulus and counting range

The authority writes `\ord(b)` and `\ord(a)` although multiplicative order here
is defined modulo `n`, and introduces an unrestricted `k` even though powers
repeat periodically. It also has the typo “if `n` has any primitive roots than
it has.” The target uses `\ord_n`, takes the unique representative
`1\le k\le\phi(n)`, and repairs “then.”

## R014-ADV-0119 — Polynomial root proof substitutes the wrong variables

Near the end of the Lagrange polynomial-root proof, the authority writes
`a(z)=b(x)(x-z_1)` and then says a root of `a(x)` must be a root of `b(a)`.
Both expressions mix or substitute the wrong variable. The target consistently
uses `a(x)\equiv b(x)(x-z_1)\pmod p` and roots of `b(x)` or `x-z_1`.

## R014-ADV-0120 — Exact-root proof omits half of the bounding argument

After showing that `x^d-1` has at least `d` roots, the authority ends with a
malformed sentence and never invokes the degree bound that gives at most `d`
roots. The target explicitly applies the preceding polynomial theorem to obtain
the matching upper bound and hence exact equality.

## R014-ADV-0121 — Element-count proof compares psi with itself

The authority repeatedly prints `\psi(k)\le\psi(k)`, `\psi(k)=\psi(k)`, and
strict variants where the comparison required by the two divisor sums is
between `\psi(k)` and `\phi(k)`. The target restores `\psi(k)\le\phi(k)` and
uses equality of the finite sums to justify termwise equality.

## R014-ADV-0122 — Roots of unity are given the wrong congruence

The authority says the powers of an element of order `k` satisfy
`x^k-1\equiv1\pmod p`; they satisfy `x^k-1\equiv0\pmod p`. The target restores
the zero on the right-hand side before applying the exact-root theorem.

## R014-ADV-0123 — Root-count theorems omit the positive domain of d

Two theorems quantify `d\mid p-1` while using `d` as a polynomial exponent and
an element order without declaring its domain. The target states
`d\in\NN`, consistent with the book's positive-natural-number convention.

## R014-ADV-0124 — Primitive-root corollary substitutes a nonexistent variable

The authority tells the reader to use `k=p-1` in a theorem whose quantified
order variable is `d`. The target correctly substitutes `d=p-1`.

## R014-ADV-0125 — Power-of-two theorem constrains an unbound n

The authority begins `Let k\in\NN satisfy n\ge3. Then n=2^k ...`, constraining
`n` before it is introduced and failing to impose the induction's actual base
condition. The target states `k\ge3` and concludes directly about `2^k`.

## R014-ADV-0126 — The n=17 index table has one incorrect entry

In the row with primitive root `a=14`, the authority gives `16` for the column
`b=11`. Direct modular exponentiation gives `14^{15}\equiv11\pmod{17}`, while
`14^{16}\equiv1\pmod{17}`. The target changes that one entry to `15`.

## R014-ADV-0127 — A change-of-base example reverts to the old index base

After explicitly changing the primitive-root base from `5` to `3`, the
authority correctly starts with `\ind_3` but reverts to `\ind_5` in the next
two displays. The target consistently uses `\ind_3` throughout that second
calculation.

## R014-ADV-0128 — The discrete-logarithm hardness claim is unscoped

The authority's wording can be read as claiming that inversion is infeasible
for arbitrary `n,a,b`, although small or poorly chosen groups are easy and the
computational qualification is platform-dependent. The target limits the claim
to suitably chosen large parameter families and states that no feasible
classical algorithm is known for those families.

## R014-ADV-0129 — DHKE permits two transparently insecure secret exponents

The authority permits `1\le\alpha,\beta\le p-1`. An exponent of `1` publishes
the generator itself and makes the corresponding shared secret equal to the
other public share; an exponent of `p-1` publishes `1` and forces the shared
secret to `1`. The target excludes both endpoints by using
`2\le\alpha,\beta\le p-2`.

## R014-ADV-0130 — The DHKE definition and proof omit reduction modulo p

The authority defines the two computations as literal integer powers and proves
their agreement with an equality chain, although the public shares and shared
secret are residue classes modulo `p`. The target includes `\pmod p` in both
protocol steps and uses a congruence chain in the proof.

## R014-ADV-0131 — The DHKE diagram assigns the shared key to asymmetric crypto

The authority's diagram says “assymteric crypto with key S,” both misspelling
“asymmetric” and contradicting the definition, which uses the negotiated
shared secret with a symmetric cryptosystem. The target labels the channel
“kriptografi simetris dengan kunci S.”

## R014-ADV-0132 — The DHKE prose contains five mechanical sentence errors

The authority prints “finding a the [large] prime,” “is explored” after an
already finite clause, “to computer backwards,” “which is does not,” and
“amounts of solving.” The target repairs these respectively while preserving
the surrounding claims.

## R014-ADV-0133 — DHP infeasibility is stated as an unconditional fact

The authority says that the Diffie--Hellman problem “is not feasible on a
classical computer,” although this is an assumption that depends on the group
and parameter sizes. The target states instead that no feasible classical
algorithm is known for suitably chosen large parameter families.

## R014-ADV-0134 — The RSA recap identifies the secret factors as the private key

The authority calls `(p,q)` the RSA private key, although its own RSA
definition uses `(n,d)` as that key. The factorization is secret information
from which `\phi(n)` and hence `d` can be derived. The target describes the
key owner as knowing the secret factors without relabeling them as the key.

## R014-ADV-0135 — ElGamal key generation permits the trivial public value a=1

The authority permits `2\le\alpha\le p-1`; choosing `\alpha=p-1` gives
`a\equiv1\pmod p` and destroys confidentiality. The target uses
`2\le\alpha\le p-2` in the definition and both diagrams.

## R014-ADV-0136 — The ElGamal public-key map omits reduction modulo p

The authority first writes `a=r^\alpha` and maps the private tuple to
`(p,r,r^\alpha)`, even though the public value is a residue represented modulo
`p`, as its own diagram later shows. The target makes the reduction explicit
at key generation and in the key-association map.

## R014-ADV-0137 — The ElGamal decryption formula and proof mishandle the modulus

The authority's decryption definition omits reduction modulo `p`. Its first
proof line then inserts `\pmod*{p}` in the middle of a product, where it cannot
serve as an operand. The target defines the decrypted representative modulo
`p` and places one congruence modulus at the end of each proof line.

## R014-ADV-0138 — The ElGamal signature uses the wrong value in its second component

The first signature component is `x=r^\gamma\pmod p`, but the authority forms
the second component with the unreduced integer `r^\gamma`. Those values need
not agree modulo `p-1`, so the printed correctness proof does not follow.
The exercise's numerical signature confirms the intended standard formula
`y=\gamma^{-1}(m-\alpha x)\pmod{p-1}`. The target uses `x` in the definition,
diagram, and a corrected proof based on exponents modulo `p-1`.

## R014-ADV-0139 — Signature verification is treated as unconditional origin proof

The authority asks whether a numerically valid signature proves that an email
came from the instructor. The target first asks whether verification passes,
then conditions signer attribution on an authenticated identity--key binding
and an uncompromised private key, consistent with the earlier signature and
PKI sections.

## R014-ADV-0140 — ElGamal functional correctness is not separated from security

The authority motivates the construction using one-wayness and immediately
proves only decryption and signature correctness, which can be mistaken for a
strong security guarantee. The target explicitly states that stronger
guarantees require additional group, parameter-generation, encoding, and
fresh-randomness assumptions not proved in this section.

## R014-ADV-0141 — The first ElGamal exercise begins with a subject typo

The authority begins “You instructor still likes”; the target restores the
possessive meaning as “Pengajar Anda.”
