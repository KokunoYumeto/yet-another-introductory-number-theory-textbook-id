(() => {
  const root = document.documentElement;
  const isLanding = document.body.classList.contains('landing-page');

  const savedTheme = localStorage.getItem('yaintt-theme');
  if (savedTheme === 'light' || savedTheme === 'dark') {
    root.dataset.theme = savedTheme;
  }

  if (isLanding) return;

  document.body.classList.add('reader-page');
  const inReaderDirectory = /\/reader\//.test(location.pathname);
  const homeHref = inReaderDirectory ? '../' : './';
  const tocHref = inReaderDirectory ? 'index.html' : 'reader/index.html';
  const pdfHref = inReaderDirectory ? '../YAINTT_ID.pdf' : 'YAINTT_ID.pdf';

  const skip = document.createElement('a');
  skip.className = 'skip-link';
  skip.href = '#reader-content';
  skip.textContent = 'Lewati ke isi utama';

  const wrap = document.createElement('div');
  wrap.className = 'reader-toolbar-wrap';
  wrap.innerHTML = `
    <nav class="reader-toolbar" aria-label="Kontrol pembaca">
      <a class="wordmark" href="${homeHref}" aria-label="Beranda pembaca">
        <span class="wordmark-mark" aria-hidden="true">ℤ</span>
        <span>Pembaca Teori Bilangan</span>
      </a>
      <div class="reader-links">
        <a href="${tocHref}">Daftar isi</a>
        <a class="optional-link" href="${pdfHref}">PDF</a>
        <a class="optional-link" href="https://github.com/KokunoYumeto/yet-another-introductory-number-theory-textbook-id/blob/main/source/yaintt-id.tex">Sumber</a>
      </div>
      <div class="reader-tools" aria-label="Tampilan">
        <button class="reader-tool" type="button" data-action="smaller" aria-label="Perkecil teks">A−</button>
        <button class="reader-tool" type="button" data-action="larger" aria-label="Perbesar teks">A+</button>
        <button class="reader-tool" type="button" data-action="theme" aria-label="Ganti tema">◐</button>
      </div>
    </nav>
    <div class="reader-progress" aria-hidden="true"></div>`;

  document.body.prepend(wrap);
  document.body.prepend(skip);

  let size = Number.parseFloat(localStorage.getItem('yaintt-size') || '1');
  const applySize = () => {
    size = Math.min(1.35, Math.max(0.88, size));
    root.style.setProperty('--reader-size', `${size}rem`);
    localStorage.setItem('yaintt-size', String(size));
  };
  applySize();

  wrap.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-action]');
    if (!button) return;
    if (button.dataset.action === 'larger') {
      size += 0.08;
      applySize();
    } else if (button.dataset.action === 'smaller') {
      size -= 0.08;
      applySize();
    } else if (button.dataset.action === 'theme') {
      const current = root.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      root.dataset.theme = current === 'dark' ? 'light' : 'dark';
      localStorage.setItem('yaintt-theme', root.dataset.theme);
    }
  });

  const progress = wrap.querySelector('.reader-progress');
  const updateProgress = () => {
    const scrollable = document.documentElement.scrollHeight - innerHeight;
    const ratio = scrollable > 0 ? scrollY / scrollable : 0;
    progress.style.width = `${Math.min(100, Math.max(0, ratio * 100))}%`;
  };
  addEventListener('scroll', updateProgress, { passive: true });
  addEventListener('resize', updateProgress, { passive: true });
  updateProgress();

  document.querySelectorAll('a[href^="http"]').forEach((link) => {
    if (new URL(link.href).origin !== location.origin) {
      link.rel = 'noopener noreferrer';
    }
  });
})();
