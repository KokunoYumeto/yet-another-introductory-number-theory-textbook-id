# Membangun pembaca HTML

Pembaca statis dibuat secara deterministik dari `source/yaintt-id.tex` oleh
`scripts/build_html_reader.mjs`. Pandoc menghasilkan HTML per bab yang dapat
di-reflow, MathML semantik, daftar isi, rujukan silang, sitasi, daftar pustaka,
dan indeks web. Skrip juga mengubah sembilan aset EPS resmi menjadi PNG lokal,
menambahkan teks alternatif, serta membuat `HTML_READER_MANIFEST.json`.

## Prasyarat

- Node.js 22 atau lebih baru;
- Pandoc 3.9 atau versi kompatibel;
- `epstopdf` dan `pdftocairo` dari MiKTeX.

Pada Windows, skrip mencari alat tersebut di bawah `%LOCALAPPDATA%`. Lokasi
lain dapat dipilih dengan variabel `PANDOC`, `EPSTOPDF`, dan `PDFTOCAIRO`.

## Build dan QA

Dari akar repositori, jalankan:

```text
node scripts/build_html_reader.mjs
node scripts/qa_html_reader.mjs
```

Build mengganti hanya `docs/reader/`, memperbarui tautan bab dan sitemap pada
`docs/`, lalu menghapus direktori kerja sementara. QA harus berstatus `passed`:
semua tautan dan fragmen lokal ada, jumlah lingkungan semantik cocok tepat
dengan sumber, seluruh gambar memiliki teks alternatif, tidak ada penanda
sitasi/rujukan atau lingkungan LaTeX mentah yang bocor, dan PDF memiliki
identitas byte yang diharapkan.

`docs/index.html` adalah beranda publik; `docs/reader/index.html` adalah daftar
isi buku; `docs/YAINTT_ID.pdf` adalah PDF 138 halaman yang sama.
