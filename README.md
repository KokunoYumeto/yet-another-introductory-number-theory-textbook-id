# Satu Lagi Buku Teks Pengantar Teori Bilangan — Edisi Bahasa Indonesia

Repositori ini memuat edisi lengkap bahasa Indonesia (`id-ID`) dari *Yet
Another Introductory Number Theory Textbook (Cryptology Emphasis Version)* karya
Jonathan A. Poritz, yang pada mulanya didasarkan pada karya Wissam Raji. Edisi
ini mempertahankan rumus, struktur, latihan, rujukan silang, indeks, bibliografi,
dan penekanan pada kriptologi.

Ini adalah edisi turunan, bukan terbitan resmi Jonathan A. Poritz, Wissam Raji,
atau Colorado State University—Pueblo, dan tidak menyiratkan dukungan mereka.
Terjemahan serta integrasi teknisnya dibuat dengan OpenAI Codex atas permintaan
Floris.

Identifikasi model untuk provenance edisi ini: **OpenAI Codex gpt-5.6-sol, Ultra.**
Seluruh kredit penulis sumber dan kontributor manusia tetap berlaku
sebagaimana dinyatakan dalam `ATTRIBUTION.md`.

## Isi repositori

- `source/yaintt-id.tex` — sumber LaTeX bahasa Indonesia yang dapat diedit.
- `source/refs.bib` dan `source/assets/` — bibliografi serta aset sumber yang
  diperlukan.
- `backend/` — ekspor modular JSON, JSONL, CSV, skema, dan bukti determinisme
  untuk pemakaian ulang per unit, segmen, konsep, istilah, dan latihan.
- `authority/` — pembekuan sumber resmi, hash, hubungan dependensi, dan hak per
  komponen.
- `qa/` — bukti pemeriksaan struktur, bahasa, matematika, build, dan tampilan.
- `publication/RELEASE_MANIFEST.json` — satu-satunya daftar kanonik artefak
  rilis dan identitas byte-nya.

Artefak hanya merupakan bagian rilis jika tercantum sebagai `verified` dalam
manifes rilis dengan ukuran byte dan SHA-256. PDF batas produksi atau berkas
berlabel `candidate` bukan artefak rilis.

## Sumber dan keterlacakan

Edisi ini diturunkan dari sumber resmi bertanda waktu **7 Mei 2014 11:04 MDT**:

- halaman sumber: <https://poritz.net/jonathan/share/yaintt/>
- PDF resmi: <https://www.poritz.net/jonathan/share/yaintt.pdf>

Pembekuan otoritatifnya bernama
`yaintt-source-2014-05-07-freeze-20260820`. Sumber utama resmi
`yaintt.tex` berukuran 241.340 byte dengan SHA-256
`d2967870a0d43de60c590a2bb40cee6915e7b6d68a0dd3ad574f64c7b6430829`.
Situs resmi menyediakan berkas statis dan tidak menunjuk repositori Git
upstream.

Perubahan bahasa, tata letak, metadata dokumen, aksesibilitas, dan koreksi
teknis dicatat secara terbuka. Lihat `00_control/ADVERSE_LEDGER.md` untuk
koreksi sumber dan `00_control/TERMINOLOGY.md` untuk keputusan istilah.

## Lisensi dan atribusi

Teks, terjemahan, perubahan teknis, dan backend edisi ini tersedia dengan
lisensi [Creative Commons Attribution-ShareAlike 4.0 International](https://creativecommons.org/licenses/by-sa/4.0/)
(CC BY-SA 4.0), dengan pengecualian komponen yang disebutkan secara khusus di
`ATTRIBUTION.md` dan `authority/COMPONENT_RIGHTS.json`.

Lihat `LICENSE.md`, `ATTRIBUTION.md`, dan `CITATION.cff` sebelum memakai ulang
atau mengutip edisi ini.

## Penemuan bahasa

Bahasa: **Bahasa Indonesia / Indonesian** (`id-ID`, ISO 639-3 `ind`).
Topik: teori bilangan, kriptologi, matematika diskret, aritmetika modular,
kriptografi, buku teks terbuka, LaTeX, dan sumber belajar terbuka.

<!-- BEGIN R014-PUBLICATION -->
## Rilis kanonik

- Repositori publik: <https://github.com/KokunoYumeto/yet-another-introductory-number-theory-textbook-id>
- Rilis GitHub v1.0.0: <https://github.com/KokunoYumeto/yet-another-introductory-number-theory-textbook-id/releases/tag/v1.0.0>
- Rekaman preservasi Zenodo: <https://zenodo.org/records/22052196>
- DOI versi: <https://doi.org/10.5281/zenodo.22052196>
- Versi: `1.0.0`

Identitas publik di atas disiapkan dari lineage yang telah dipreflight;
ukuran dan SHA-256 publik tetap dibuktikan dalam receipt publikasi.
<!-- END R014-PUBLICATION -->
