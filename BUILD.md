# Membangun Pembaca PDF

Sumber rilis lengkap berada di `source/yaintt-id.tex`. Build biasa tanpa
makro `boundary...` menghasilkan seluruh buku; makro batas produksi yang masih
ada di sumber bersifat inert pada build penuh.

## Prasyarat

- distribusi TeX yang menyediakan `latex`, `bibtex`, `makeindex`, dan `dvips`;
- Ghostscript `ps2pdf`;
- Python 3 dan `pikepdf` hanya jika normalisasi deterministik rilis akan
  direproduksi.

Tambahkan direktori absolut `source/assets/` ke `TEXINPUTS` (pemisah `;` pada
Windows dan `:` pada sistem POSIX), lalu jalankan urutan berikut dengan job
name `yaintt-id`:

```text
cd source
latex -interaction=nonstopmode -halt-on-error -no-shell-escape yaintt-id.tex
bibtex yaintt-id
latex -interaction=nonstopmode -halt-on-error -no-shell-escape yaintt-id.tex
latex -interaction=nonstopmode -halt-on-error -no-shell-escape yaintt-id.tex
makeindex yaintt-id.idx
latex -interaction=nonstopmode -halt-on-error -no-shell-escape yaintt-id.tex
latex -interaction=nonstopmode -halt-on-error -no-shell-escape yaintt-id.tex
dvips -o yaintt-id.ps yaintt-id.dvi
ps2pdf yaintt-id.ps yaintt-id.raw.pdf
cd ..
python scripts/finalize_pdf_deterministic.py source/yaintt-id.raw.pdf YAINTT_ID.pdf --source-sha256 b1dd2926dc8bfdb84c6a3b4605490a8d96b14c44d89653867160d701fa0f17db --boundary-id boundary28-final --expected-pages 138
```

Build rilis yang diterima menghasilkan PDF Letter 138 halaman, 962.527 byte,
SHA-256
`1ded3c6844b656347259b464bf21526fdc32dc2246c73ac58ab76ed28688eefc`.
Identitas byte mentah sebelum normalisasi dapat berubah menurut versi TeX dan
Ghostscript; receipt di `qa/FINAL_BUILD.json` mencatat toolchain serta dua
build rilis yang dinormalisasi dan identik byte demi byte.

Jangan tambahkan `by-sa.eps`: berkas itu tidak termasuk closure karya turunan.
Hak dan atribusi setiap komponen tercatat di
`authority/COMPONENT_RIGHTS.json` dan `ATTRIBUTION.md`.
