# Terminology Ledger — Initial id-ID Decisions

| Concept ID | English | Preferred id-ID | Notes |
|---|---|---|---|
| nt.well_ordering_principle | well-ordering principle | prinsip keterurutan baik | Use consistently as the formal name and noun; define “elemen terkecil.” |
| nt.least_element | least element | elemen terkecil | Distinguish from minimal element where order theory later requires it. |
| proof.pigeonhole_principle | pigeonhole principle | prinsip sarang merpati | Established Indonesian rendering; explain boxes/objects in statement. |
| proof.mathematical_induction | mathematical induction | induksi matematika | Use `langkah dasar` and `langkah induksi` in explanatory prose. |
| proof.strong_induction | second principle of mathematical induction | prinsip kedua induksi matematika | Later crosswalk may add “induksi kuat” as a scoped variant. |
| nt.natural_number | natural number | bilangan asli | Preserve upstream convention `NN` beginning at 1 in this section. |
| nt.integer | integer | bilangan bulat | |
| algebra.binary_operation | binary operation | operasi biner | Operation on two elements of the stated set. |
| algebra.addition | addition | penjumlahan | Preserve the symbol `+`. |
| algebra.multiplication | multiplication | perkalian | Preserve `\cdot` in explicit products. |
| algebra.commutativity | commutativity of addition and multiplication | komutativitas penjumlahan dan perkalian | Property name in §1.2. |
| algebra.associativity | associativity of addition and multiplication | asosiativitas penjumlahan dan perkalian | Property name in §1.2. |
| algebra.distributivity | distributivity of multiplication over addition | distributivitas perkalian terhadap penjumlahan | Preserve the direction stated by the source. |
| algebra.identity_element | identity element | elemen identitas | Additive identity `0`; multiplicative identity `1`. |
| algebra.additive_inverse | additive inverse | invers aditif | |
| algebra.multiplicative_inverse | multiplicative inverse | invers multiplikatif | In `ZZ`, the units are `1` and `-1`. |
| algebra.subtraction | subtraction | pengurangan | |
| algebra.division | division | pembagian | Not a binary operation on all of `ZZ`. |
| nt.divisibility | divisibility | keterbagian | Use `a membagi b`; retain `a\mid b`. ITB 2026 attests `a habis membagi b` as a relational variant, not a replacement for the noun. |
| nt.factor | factor | faktor | Paired with `pembagi` where the source gives both factor/divisor. |
| nt.divisor | divisor | pembagi | Do not confuse with the positive divisor `b` in the Division Algorithm. |
| nt.multiple | multiple | kelipatan | |
| nt.parity | even / odd | genap / ganjil | Use `bilangan bulat genap/ganjil` at definition. |
| algebra.linear_combination | linear combination | kombinasi linear | `kombinasi linear berhingga` for finite linear combination. |
| nt.division_algorithm | Division Algorithm | Algoritma Pembagian | Capitalize when naming the theorem/algorithm. |
| nt.quotient | quotient | hasil bagi | |
| nt.remainder | remainder | sisa pembagian | Short form `sisa` after definition. |
| nt.greatest_common_divisor | greatest common divisor (gcd) | faktor persekutuan terbesar (FPB) | Preserve the operator `\gcd`; use `FPB` only in reader prose. ITB 2026 uses `pembagi bersama terbesar (PBB)` but explicitly identifies `faktor persekutuan terbesar (FPB)` as the school term; record PBB as an academic alias and retain FPB for broad reader familiarity. |
| nt.common_divisor | common divisor | pembagi bersama | Distinguish the relation from the conventional name `faktor persekutuan terbesar`. |
| nt.relatively_prime | relatively prime | relatif prima | For two integers whose gcd is `1`. |
| nt.mutually_relatively_prime | mutually relatively prime | relatif prima secara bersama-sama | Means the gcd of the whole finite family is `1`; weaker than pairwise relative primality. |
| nt.pairwise_relatively_prime | pairwise relatively prime | relatif prima berpasangan | Every distinct pair has gcd `1`. |
| nt.base | base | basis | Require an integer base greater than 1 in the expansion theorem. |
| nt.base_representation | base-b representation | representasi basis b | Preserve the notation `(m)_b`. |
| nt.digit | digit | digit | Includes coefficient digits `a_0,\dots,a_l`. |
| nt.binary_representation | binary representation | representasi biner | Base 2 representation. |
| nt.decimal | decimal | desimal | Base 10 notation. |
| nt.octal | octal | oktal | Base 8 notation. |
| nt.hexadecimal | hexadecimal | heksadesimal | Base 16 notation. |
| nt.hex | hex | heks | Scoped short form for hexadecimal. |
| nt.sexagesimal | sexagesimal | seksagesimal | Base 60 notation. |
| computing.bit | bit / binary digit | bit / digit biner | Retain the established loanword `bit`; expand it on first use. |
| nt.euclidean_algorithm | Euclidean Algorithm | Algoritma Euklides | Capitalize when naming the algorithm. `Algoritma Euclidean` and `Algoritma Euclid` are attested aliases; retain `Euklides` consistently with `Lemma Euklides`. |
| nt.extended_euclidean_algorithm | extended Euclidean Algorithm | Algoritma Euklides diperluas | Includes Bézout coefficients alongside the remainder sequence. |
| nt.congruence | congruence / congruent | kongruensi / kongruen | Use “$a$ kongruen dengan $b$ modulo $n$” for $a\equiv b\pmod n$. ITB 2026 repeatedly uses the noun `kekongruenan`; retain it as a searchable alias while keeping the concise, widely attested `kongruensi` in running text. |
| nt.modulo | modulo | modulo | Retain the established mathematical loanword and the notation `\pmod n`. |
| nt.congruence_class | congruence class | kelas kongruensi | Values congruent modulo the stated modulus represent the same class. |
| nt.chinese_remainder_theorem | Chinese Remainder Theorem | Teorema Sisa Cina | Established Indonesian theorem name; retain the source's later label and references. ITB 2026 leaves the theorem name in English, which is treated as an alias rather than grounds to undo the established Indonesian form. |
| nt.euclids_lemma | Euclid's Lemma | Lemma Euklides | If $x\mid yz$ and $\gcd(x,y)=1$, then $x\mid z$. |
| nt.linear_congruence | linear congruence | kongruensi linear | Use “kongruensi linear dalam satu peubah” for $ax\equiv b\pmod n$. `Kekongruenan linier` is an attested ITB variant; retain standard `linear` and the established headword `kongruensi`. |
| nt.diophantine_equation | Diophantine equation | persamaan Diofantin | Polynomial equation with integer coefficients whose solutions are sought in integers. |
| nt.modular_inverse | modular inverse | invers modular | A solution of $ax\equiv1\pmod n$ when $\gcd(a,n)=1$. ITB 2026 attests `balikan modulo (modulo invers)`; record both as aliases while retaining `invers modular` for consistency with the edition's algebraic inverse terminology. |
| nt.system_of_congruences | system of congruences | sistem kongruensi | A simultaneous family, potentially with different moduli. |
| set.equivalence_relation | equivalence relation | relasi ekuivalensi | A relation that is reflexive, symmetric, and transitive. |
| set.reflexivity | reflexivity | refleksivitas | Use `refleksif` for the corresponding adjective. |
| set.symmetry | symmetry | simetri | Use `simetris` for the corresponding adjective. |
| set.transitivity | transitivity | transitivitas | Use `transitif` for the corresponding adjective. |
| set.equivalence_class | equivalence class | kelas ekuivalensi | A class `[x]` determined by an equivalence relation. |
| set.class_representative | representative of an equivalence class | wakil kelas ekuivalensi | The representative is an element of the underlying set. |
| nt.integers_mod_n | integers mod n | bilangan bulat modulo n | Written `\ZZ/n\ZZ`; distinguish the set from a single congruence class. |
| algebra.well_defined | well-defined | terdefinisi dengan baik | Independent of the selected representatives. |
| nt.euler_phi_function | Euler's phi function | fungsi phi Euler | Preserve the notation `\phi(n)`. |
| nt.euler_totient_function | Euler's totient function | fungsi totient Euler | Attested Indonesian usage retains `totient`; keep the English pronunciation note at introduction. |
| set.cardinality | cardinality / number of elements | kardinalitas / banyaknya elemen | Preserve the symbol `\#`. |
| set.cartesian_product | Cartesian product | hasil kali Kartesius | Ordered pairs from the two factor sets. |
| function.injective | one-to-one / injective | injektif | Prefer the standard mathematical term `injektif`. |
| function.surjective | onto / surjective | surjektif | Prefer the standard mathematical term `surjektif`. |
| function.bijective | bijective | bijektif | Both injective and surjective. |
| algebra.unit_group | group of multiplicatively invertible classes | grup unit | Written `(\ZZ/n\ZZ)^*` in this section. |
| arithmetic.multiplicative_function | multiplicative function | fungsi multiplikatif | Here, `\phi(nm)=\phi(n)\phi(m)` for relatively prime `n,m`. |
| nt.prime | prime number | bilangan prima | A natural number greater than 1 with only 1 and itself as natural divisors. |
| nt.composite | composite number | bilangan komposit | A natural number greater than 1 that is not prime. |
| nt.prime_factorization | prime factorization | faktorisasi prima | Factorization into prime factors, unique up to order. |
| nt.fundamental_theorem_arithmetic | Fundamental Theorem of Arithmetic | Teorema Dasar Aritmetika | Existence and uniqueness of prime factorization for `n\ge2`. |
| nt.square_free | square-free | bebas kuadrat | Include `1` via the empty product convention. |
| nt.proper_divisor | proper divisor | pembagi sejati | Here, a positive divisor strictly between `1` and `n`. |
| nt.wilsons_theorem | Wilson's Theorem | Teorema Wilson | Preserve the label `thm:wilsons`. |
| nt.self_inverse | self-inverse modulo p | merupakan invers bagi dirinya sendiri modulo p | Use in the supporting lemma; do not imply ordinary real reciprocals. |
| nt.factorial | factorial | faktorial | Preserve the notation `n!`. |
| nt.primality_test | primality test | uji keprimaan | Wilson's criterion is correct but computationally impractical. |
| nt.multiplicative_order | multiplicative order modulo n | orde multiplikatif modulo n | Written `\ord_n(a)`; definition requires `n\ge2` and `\gcd(a,n)=1`. |
| algebra.lagranges_theorem | Lagrange's Theorem | Teorema Lagrange | Used here through the divisibility of a subgroup order. |
| algebra.cyclic_subgroup | cyclic subgroup generated by a | subgrup siklik yang dibangkitkan oleh a | Written `\left<a\right>` in the authority. |
| algebra.coset | coset | koset | A translate `x\left<a\right>` of the cyclic subgroup. |
| nt.eulers_theorem | Euler's Theorem | Teorema Euler | Preserve `a^{\phi(n)}\equiv1\pmod n` under the coprimality hypothesis. |
| nt.fermats_little_theorem | Fermat's Little Theorem | Teorema Kecil Fermat | Use this established Indonesian word order consistently. |
| nt.fermats_last_theorem | Fermat's Last Theorem | Teorema Terakhir Fermat | Historical aside only; retain the authority's quotation marks around “theorem.” |
| crypto.cryptology | cryptology | kriptologi | Umbrella discipline. |
| crypto.cryptography | cryptography | kriptografi | Do not collapse into kriptologi when source distinguishes them. |
| crypto.cryptanalysis | cryptanalysis | kriptanalisis | |
| crypto.cryptosystem | cryptosystem | kriptosistem | |
| crypto.key_exchange | key exchange | pertukaran kunci | |
| security.information_security | information security | keamanan informasi | Umbrella term for confidentiality, integrity, authentication, and non-repudiation in this chapter. |
| security.confidentiality | confidentiality | kerahasiaan | Only the intended recipient can obtain the message content. |
| security.integrity | integrity | integritas | The recipient can verify that the message was not altered. |
| security.authentication | authentication | autentikasi | Here, verification of the sender's identity. |
| security.non_repudiation | non-repudiation | nirpenyangkalan | Preferred compact Indonesian legal/technical term; retain the source's sender scope. |
| crypto.plaintext | plaintext / cleartext | plainteks / teks terang | Introduce both attested forms together; `plainteks` is the compact running-text form and is independently confirmed by ITB 2026. |
| crypto.cipher | cipher | cipher / algoritme sandi | Retain `cipher` as the technical headword and gloss it on first use. |
| crypto.ciphertext | ciphertext | cipherteks / teks sandi | Introduce both attested forms together; `cipherteks` is the compact running-text form and is independently confirmed by ITB 2026. |
| crypto.encryption | encryption | enkripsi | Verb: `mengenkripsi`. |
| crypto.decryption | decryption | dekripsi | Verb: `mendekripsi`. |
| crypto.key | key | kunci | Additional information required for successful decryption. |
| crypto.scytale | scytale | scytale | Preserve the historical Greek device name; explain construction and pronunciation in prose. |
| crypto.kerckhoffs_principle | Kerckhoffs's Principle | Prinsip Kerckhoffs | Use the correct spelling `Kerckhoffs`, not the authority's `Kerckhoff's`. |
| crypto.security_through_obscurity | security through obscurity | keamanan melalui ketertutupan | Retain the English phrase parenthetically at first use. |
| crypto.caesar_cipher | Caesar cipher | cipher Caesar | A monoalphabetic shift cipher; system name `kriptosistem Caesar`. |
| crypto.rot13 | ROT13 | ROT13 | Preserve the conventional all-caps name and its 13-position shift. |
| crypto.vigenere_cipher | Vigenère cipher | cipher Vigenère | Preserve the name and key-vector notation; the source uses a LaTeX accent macro. |
| crypto.one_time_pad | one-time pad | pad sekali pakai | Introduce the English term parenthetically once; use the Indonesian form thereafter. |
| crypto.vernam_cipher | Vernam Cipher | Cipher Vernam | Preserve the historical name while retaining the authority's qualification about attribution. |
| crypto.information_theoretic_security | information-theoretically secure | aman secara teori informasi | Security proof does not assume bounded attacker computation. |
| complexity.probabilistic_polynomial_time_turing_machine | probabilistic polynomial-time Turing machine | mesin Turing waktu-polinomial probabilistik | Preserve the complexity-theoretic assumption exactly. |
| cs.computational_complexity | computational complexity | kompleksitas komputasi | Standard field name. |
| crypto.key_distribution | key distribution | distribusi kunci | Central practical limitation of one-time pads. |
| randomness.pseudorandom | pseudorandom | acak semu | Deterministic from a shared seed but computationally appears random to attackers. |
| crypto.keyspace | keyspace | ruang kunci | Set of every valid key for the cryptosystem. |
| crypto.brute_force_attack | brute-force attack | serangan brute force | Trying every possible key; retain the common loan phrase without an internal hyphen. |
| search.exhaustive_search | exhaustive search | pencarian menyeluruh | Introduced as the equivalent name for a brute-force attack. |
| crypto.message_space | message space | ruang pesan | Set of possible messages for the encrypted communication. |
| crypto.frequency_analysis | frequency analysis | analisis frekuensi | Compare observed symbol frequencies with a reference-language distribution. |
| crypto.letter_frequency | letter frequency | frekuensi huruf | Localize figure captions and index entries consistently. |
| stats.total_square_error | total square error | galat kuadrat total | Preserve `d(f,g)=\sum_{j=0}^{25}(f(j)-g(j))^2`. |
| stats.least_squares | least squares | kuadrat terkecil | Statistical/linear-algebra equivalence stated by the source. |
| crypto.caesar_cracker | Caesar cracker | pemecah Caesar | Automatic selection of the shift minimizing square error. |
| crypto.key_length | key length | panjang kunci | For Vigenère, the number of repeated shift components. |
| crypto.key_position | key position | posisi kunci | One coordinate/substream in a repeated Vigenère key, not an alphabet letter. |
| stats.weighted_mixture | weighted mixture | campuran berbobot | A mixture whose component shifts contribute according to their unequal multiplicities. |
| crypto.symmetric_cipher | symmetric cipher / cryptosystem / encryption | cipher / kriptosistem / enkripsi simetris | The same shared secret key is used for encryption and decryption. |
| crypto.private_key_cryptosystem | private-key cryptosystem | kriptosistem kunci privat | Name used here for the symmetric-key construction. |
| crypto.asymmetric_cipher | asymmetric cipher / cryptosystem / encryption | cipher / kriptosistem / enkripsi asimetris | Separate associated encryption and decryption keyspaces. |
| crypto.key_generation_algorithm | key-generation algorithm | algoritme pembangkitan kunci | Efficiently emits an associated public/private key pair; written `\mathsf{Gen}`. |
| crypto.encryption_keyspace | encryption keyspace | ruang kunci enkripsi | Written `\Kk_e`. |
| crypto.decryption_keyspace | decryption keyspace | ruang kunci dekripsi | Written `\Kk_d`. |
| crypto.public_key | public key | kunci publik | Publicly distributed encryption key; independently confirmed by ITB 2026. |
| crypto.private_key | private key | kunci privat | Secret decryption key; do not translate as `kunci pribadi`. Independently confirmed by ITB 2026 and kept distinct from a symmetric `kunci rahasia`. |
| crypto.public_key_cryptosystem | public-key cryptosystem | kriptosistem kunci publik | |
| crypto.cryptographic_salt | cryptographic salt | salt kriptografis | Retain the established technical loan `salt` and explain its random-data role. |
| crypto.traffic_analysis | traffic analysis | analisis lalu lintas | Here, correlation of repeated ciphertexts with observable actions. |
| crypto.one_way_function | one-way function | fungsi satu arah | Efficient forward evaluation with infeasible inversion on the relevant image. |
| computing.quantum_computer | quantum computer | komputer kuantum | Contrast with `komputer klasik`. |
| crypto.rsa_modulus | RSA modulus | modulus RSA | `n=pq` for distinct large primes `p,q`. |
| crypto.rsa_semiprime | RSA semiprime | semiprima RSA | Product of two large primes of comparable size; do not generalize factoring hardness to arbitrary composites. |
| crypto.rsa_exponent | RSA exponent | eksponen RSA | Public exponent `e` satisfying `\gcd(e,\phi(n))=1`. |
| crypto.rsa_public_key | RSA public encryption key | kunci publik RSA | Pair `(n,e)`. |
| crypto.rsa_private_key | RSA private decryption key | kunci privat RSA | Pair `(n,d)` with `d=e^{-1}\pmod{\phi(n)}`. |
| complexity.feasible_computation | feasible computation | komputasi layak | Runtime bounded polynomially in the logarithms/input length. |
| nt.prime_number_theorem | Prime Number Theorem | Teorema Bilangan Prima | Preserve the limit involving `\pi(x)` and `x/\ln x`. |
| nt.prime_counting_function | prime-counting function | fungsi penghitung prima | `\pi(x)` counts primes not exceeding `x`. |
| nt.fast_modular_exponentiation | fast modular exponentiation | eksponensiasi modular cepat | Implemented by repeated squaring and binary expansion. |
| complexity.input_length | input length | panjang masukan | Maximum encoded digit/bit length of the relevant inputs; distinguish it from their numeric magnitude. |
| nt.discrete_logarithm | discrete logarithm | logaritma diskret | Chapter-wide formal term; the source also calls it an index. |
| nt.index_modulo | index modulo n | indeks modulo n | Synonym for the discrete logarithm in the later formal definition. |
| algebra.unit_group_modulo | multiplicative unit group modulo n | grup satuan multiplikatif modulo n | Written `(\ZZ/n\ZZ)^*`; retain the star whenever discussing its cyclic subgroups. |
| encoding.ascii | ASCII | ASCII | Retain the expanded English standard name and add an Indonesian gloss. |
| encoding.unicode | Unicode | Unicode | Preserve version-specific historical statement. |
| encoding.utf8 | UTF-8 | UTF-8 | One to four bytes per Unicode scalar value in the stated encoding context. |
| encoding.utf16 | UTF-16 | UTF-16 | Two or four bytes per Unicode scalar value in the stated encoding context. |
| crypto.digital_signature | digital signature | tanda tangan digital | Data attached to a document/message whose valid verification can support signer attribution only under the scheme's security assumptions, an uncompromised private key, and a trusted identity--key binding. |
| crypto.signature_unforgeability | signature unforgeability | ketahanan terhadap pemalsuan tanda tangan | Security property required before valid verification supports attributing a newly created signature to the private-key holder. |
| security.private_key_compromise | private-key compromise | kompromi kunci privat | Loss of exclusive control over a private key; signer attribution requires that this has not occurred. |
| crypto.cryptographic_hash_function | cryptographic hash function | fungsi hash kriptografis | Maps arbitrary-length bit strings to fixed-length bit strings under three computational resistance requirements. |
| crypto.hash_value | hash value | nilai hash | Fixed-length output `h(m)`. |
| crypto.preimage_resistance | pre-image resistance | ketahanan praimaji | Infeasibility of finding an input for a randomly generated target digest under the specified challenge distribution. |
| crypto.second_preimage_resistance | second pre-image resistance | ketahanan praimaji kedua | Infeasibility of finding a different input with the same hash as a specified input. |
| crypto.collision_resistance | collision resistance | ketahanan tumbukan | Infeasibility of finding distinct inputs with equal hashes. |
| crypto.collision | collision | tumbukan | A pair of distinct inputs with the same hash output. |
| crypto.fingerprint | fingerprint | sidik jari | A hash used here to detect non-malicious corruption. |
| crypto.signing_key | signing key | kunci penandatanganan | Private RSA/decryption key used to form the signature. |
| crypto.verification_key | verification key | kunci verifikasi | Public RSA/encryption key used to verify the signature. |
| crypto.signature_encoding | signature encoding | enkode tanda tangan | Scheme-specific encoding/padding applied before the RSA private operation. |
| crypto.message_representative | message representative | wakil pesan | Integer `H_n(m)` in `0,\dots,n-1` obtained by encoding the digest for RSA. |
| crypto.challenge_distribution | challenge distribution | distribusi tantangan | Distribution used to sample the hidden input for a preimage-resistance experiment. |
| security.replay_attack | replay attack | serangan putar ulang | Reuse of a previously valid signed pair; signature validity alone does not prove freshness. |
| security.man_in_the_middle_attack | man-in-the-middle attack | serangan man-in-the-middle | Active attacker substitutes keys and relays or alters traffic; retain the conventional technical phrase. |
| security.identity_key_binding | identity–key binding | pengikatan identitas--kunci | Claim that a specific public key belongs to an identified subject. |
| pki.trusted_third_party | trusted third party (TTP) | pihak ketiga tepercaya (TTP) | External party whose verification statement is trusted. |
| pki.certificate_authority | certificate authority (CA) | otoritas sertifikat (CA) | Trusted party that signs certificates under a stated verification policy. |
| pki.digital_certificate | digital certificate | sertifikat digital | Signed structured statement binding subject identity, public key, and necessary metadata. |
| pki.trust_anchor | trust anchor | jangkar kepercayaan | Preinstalled or otherwise independently trusted CA verification key. |
| pki.certification_path | certification path / certificate chain | jalur sertifikasi / rantai sertifikat | Validated certificate sequence ending at an independently trusted anchor. |
| pki.public_key_infrastructure | public key infrastructure (PKI) | infrastruktur kunci publik (PKI) | Certificates, CAs, trust anchors, distribution, and validation machinery. |
| pki.web_of_trust | web of trust | jejaring kepercayaan | Decentralized identity--key certifications interpreted under the relying user's local policy and ownertrust assignments; signature validity alone is insufficient. |
| pki.ownertrust | ownertrust / introducer trust | tingkat kepercayaan kepada pemilik kunci (ownertrust) | Local judgment of how reliably a key owner certifies other identity--key bindings; distinct from mathematical signature validity. |
| pki.key_signing_party | key-signing party | pertemuan penandatanganan kunci | Event for direct identity and full-fingerprint verification before signing. |
| pki.key_fingerprint | key fingerprint | sidik jari kunci | Full format-defined digest used to compare a public key; do not use MD5. |
| nt.exponents_modulo_order | exponents modulo the multiplicative order | pangkat modulo orde multiplikatif | `a^j\equiv a^k\pmod n` exactly when `j\equiv k\pmod{\ord_n(a)}`. |
| nt.order_of_power | order of a power | orde suatu pangkat | `\ord_n(a^k)=\ord_n(a)/\gcd(\ord_n(a),k)`. |
| nt.gauss_totient_sum | Gauss's theorem on totient sums | Teorema Gauss tentang jumlah nilai fungsi phi Euler | `\sum_{d\mid n}\phi(d)=n`. |
| nt.divisor_sum_function | divisor-sum function F | fungsi jumlah pembagi F | Here `F(n)=\sum_{d\mid n}\phi(d)`; the proof establishes `F(n)=n`. |
| nt.primitive_root | primitive root modulo n | akar primitif modulo n | Unit `a` satisfying `\ord_n(a)=\phi(n)`. |
| nt.primitive_root_count | number of primitive roots | banyaknya akar primitif | If primitive roots modulo `n` exist, their count is `\phi(\phi(n))`; for prime `p`, it is `\phi(p-1)`. |
| algebra.polynomial_mod_p | polynomial modulo p | polinomial modulo p | Polynomial congruence over `\ZZ/p\ZZ`; a nonzero degree-`n` polynomial has at most `n` roots when `p` is prime. |
| algebra.polynomial_root | root of a polynomial | akar polinomial | Residue class making the polynomial congruent to zero. |
| algebra.zero_product_property | zero-product property | sifat hasil kali nol | In `\ZZ/p\ZZ` for prime `p`, a product is zero only if one factor is zero. |
| algebra.integral_domain | integral domain / domain | domain integral / domain | Ring with no nonzero zero divisors; the source uses the shorter word `domain`. |
| nt.order_class_count | number of classes of order d modulo p | banyaknya kelas berorde d modulo p | For prime `p` and positive `d\mid p-1`, exactly `\phi(d)` residue classes have order `d`. |
| nt.index_relative | index of b relative to a | indeks b relatif terhadap a | Least positive `k` satisfying `b\equiv a^k\pmod n` when `a` is a primitive root modulo `n`. |
| complexity.discrete_logarithm_hardness | discrete-logarithm hardness | kesulitan komputasional logaritma diskret | Scope claims to suitably chosen large parameter families and feasible classical algorithms; do not imply hardness in every multiplicative group. |
| algebra.change_of_base_formula | change-of-base formula | rumus perubahan basis | Exercise term for converting indices between two primitive-root bases. |
| crypto.diffie_hellman_key_exchange | Diffie--Hellman key exchange (DHKE) | pertukaran kunci Diffie--Hellman (DHKE) | Protocol name; retain the conventional initialism and use a LaTeX en dash in the names. |
| crypto.dh_secret_exponent | Diffie--Hellman secret exponent | eksponen rahasia Diffie--Hellman | In this full-group presentation, exclude the transparent endpoint choices `1` and `p-1`. |
| crypto.shared_secret | shared secret / shared key | rahasia bersama / kunci bersama | Common value computed independently by the two participants; distinguish the mathematical secret from any scheme-specific key encoding. |
| nt.sophie_germain_prime | Sophie Germain prime | prima Sophie Germain | Prime `p` for which `2p+1` is also prime. |
| crypto.diffie_hellman_problem | Diffie--Hellman problem (DHP) | masalah Diffie--Hellman (DHP) | Given `r^x` and `r^y` in the stated group, compute `r^{xy}` without being given `x` or `y`. |
| crypto.dh_public_parameters | Diffie--Hellman public parameters | parameter publik Diffie--Hellman | Here, the public prime modulus `p` and primitive root `r`. |
| crypto.elgamal_cryptosystem | ElGamal cryptosystem | kriptosistem ElGamal | Textbook multiplicative public-key construction; preserve the proper name. |
| crypto.elgamal_public_key | ElGamal public/encryption key | kunci publik/enkripsi ElGamal | Tuple `(p,r,a)` with `a=r^\alpha\pmod p`. |
| crypto.elgamal_private_key | ElGamal private/decryption key | kunci privat/dekripsi ElGamal | Tuple `(p,r,\alpha)`; the secret exponent excludes the trivial endpoint `p-1`. |
| crypto.elgamal_ephemeral_exponent | ElGamal ephemeral exponent | eksponen efemeral ElGamal | Fresh random `\beta` used once for each encryption. |
| crypto.elgamal_ciphertext | ElGamal ciphertext | cipherteks ElGamal | Ordered pair `(r^\beta, m a^\beta)` reduced modulo `p`. |
| crypto.elgamal_signature | ElGamal digital signature | tanda tangan digital ElGamal | Pair `(x,y)` with `x=r^\gamma\pmod p` and `y=\gamma^{-1}(m-\alpha x)\pmod{p-1}`. |
| crypto.elgamal_signature_nonce | ElGamal signature nonce | nonce tanda tangan ElGamal | Fresh random invertible `\gamma` modulo `p-1`; never substitute the unreduced `r^\gamma` for signature component `x`. |
| security.functional_correctness | functional correctness | kebenaran fungsional | Encryption/decryption or signing/verification composes as specified; this alone is not a strong adversarial security guarantee. |
| security.semantic_security | semantic security | keamanan semantik | Stronger confidentiality property not established by the section's correctness proof. |
| randomness.fresh_randomness | fresh randomness | keacakan baru yang independen | New independent randomness for each encryption or signature operation. |

The notation `\ZZ_{\ge0}` denotes the nonnegative integers; this is distinct
from the book's positive-natural-number convention for `\NN`.

## External field-usage QA

No qualifying Indonesian-language number-theory or cryptology TeX source was
found in a bounded arXiv search. The fallback witness is Rinaldi Munir's
three-part 2026 *Teori Bilangan* lecture series for IF1220 Matematika Diskrit,
Program Studi Teknik Informatika, STEI--ITB (153 pages total). The exact PDF
identities, URLs, term counts, visual checks, rights caveat, comparisons, and
decisions are recorded in `qa/INDONESIAN_TERMINOLOGY_QA.json`. The PDFs expose
no explicit reuse license and are retained only as local QA witnesses, not as
release assets. No preferred reader term or translated passage required
replacement; only the attested aliases above were added.

Rejected first-boundary forms are explicit backend data: `pengurutan baik` and
`prinsip terurut baik` are rejected for the well-ordering principle;
`rumah merpati` is rejected for the pigeonhole principle. The generated reader
label `Corollary` is `Akibat`, matching the target theorem declaration.
