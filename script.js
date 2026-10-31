document.addEventListener('DOMContentLoaded', function () {
  var navToggle = document.getElementById('navToggle');
  var mainNav = document.getElementById('mainNav');

  var header = document.querySelector('.site-header');

  // The mobile menu hangs off the bottom of the header, so it needs the
  // header's real height rather than a hard-coded guess.
  function syncHeaderHeight() {
    if (!header) return;
    var h = Math.round(header.getBoundingClientRect().height);
    document.documentElement.style.setProperty('--header-h', h + 'px');
  }
  syncHeaderHeight();
  window.addEventListener('resize', syncHeaderHeight);
  window.addEventListener('orientationchange', syncHeaderHeight);

  if (navToggle && mainNav) {
    var setNav = function (isOpen) {
      mainNav.classList.toggle('open', isOpen);
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      navToggle.setAttribute('aria-label', isOpen ? 'Tutup menu' : 'Buka menu');
    };

    navToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      syncHeaderHeight();
      setNav(!mainNav.classList.contains('open'));
    });

    mainNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () { setNav(false); });
    });

    document.addEventListener('click', function (e) {
      if (!mainNav.classList.contains('open')) return;
      if (!mainNav.contains(e.target) && !navToggle.contains(e.target)) setNav(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mainNav.classList.contains('open')) {
        setNav(false);
        navToggle.focus();
      }
    });
  }

  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  setupReveal();
  setupTestimonials();
  setupKarya();
});

function setupReveal() {
  if (!('IntersectionObserver' in window)) return;

  var targets = document.querySelectorAll(
    '.why-card, .service-card, .step-card, .cta-inner'
  );
  if (!targets.length) return;

  // Hiding is gated on this class so a JS failure never leaves a blank page.
  document.documentElement.classList.add('js-reveal');

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(function (el, i) {
    el.classList.add('reveal');
    el.style.transitionDelay = (i % 4) * 70 + 'ms';
    observer.observe(el);
  });
}

function setupTestimonials() {
  var track = document.getElementById('testiTrack');
  if (!track) return;

  // ====== EDIT DI SINI ======
  // Tiap testimoni = satu baris. Taruh screenshot-nya di folder assets/
  // dengan nama file yang sama persis. `cap` = label kecil di bawah gambar.
  // Mau nambah? tinggal salin satu baris. Mau ngurangin? hapus barisnya.
  var TESTI = [
    { img: 'assets/testi-1.jpg', cap: 'Cek Similarity · Turun Sesuai Target' },
    { img: 'assets/testi-2.jpg', cap: 'Pengerjaan Cepat Banget' },
    { img: 'assets/testi-3.jpg', cap: 'Policy Paper · Lancar Presentasi' },
    { img: 'assets/testi-4.jpg', cap: 'Harga Pas · Kantong Aman' },
    { img: 'assets/testi-5.jpg', cap: 'PPT Sidang · Desain Kece' },
    { img: 'assets/testi-6.jpg', cap: 'Olah Data Statistik' },
    { img: 'assets/testi-7.jpg', cap: 'Hasil Sesuai · Referensi Aman' },
    { img: 'assets/testi-8.jpg', cap: 'Hasil Sesuai Request · Format Rapi' },
    { img: 'assets/testi-9.jpg', cap: 'Chat Senin, Selasa Kelar' },
    { img: 'assets/testi-10.jpg', cap: 'Skripsi ACC · Lolos Sidang' },
    { img: 'assets/testi-11.jpg', cap: 'Admin Fast Respon · Harga Terjangkau' },
    { img: 'assets/testi-12.jpg', cap: 'Olah Data SPSS · Sabar Menjelaskan' },
    { img: 'assets/testi-13.jpg', cap: 'Tugas Kelar · Panik Deadline Teratasi' },
    { img: 'assets/testi-14.jpg', cap: 'Pelayanan Cepat · Detail dan Teliti' },
    { img: 'assets/testi-15.jpg', cap: 'Artikel Publikasi · Pengerjaan Cepat' },
    { img: 'assets/testi-16.jpg', cap: 'Semua ACC · Direkomendasikan ke Teman' }
  ];
  // ==========================

  var frag = document.createDocumentFragment();
  TESTI.forEach(function (t) {
    var card = document.createElement('article');
    card.className = 'testi-card';
    card.setAttribute('role', 'listitem');

    var shot = document.createElement('div');
    shot.className = 'testi-shot';

    var img = document.createElement('img');
    img.src = t.img;
    img.loading = 'lazy';
    img.alt = 'Testimoni pelanggan Nugas Kampus';
    // Kalau file screenshot-nya belum ada, buang kartunya biar gak muncul
    // ikon gambar rusak — lalu susun ulang dot navigasinya.
    img.addEventListener('error', function () {
      card.remove();
      buildDots();
    });
    shot.appendChild(img);

    var cap = document.createElement('div');
    cap.className = 'testi-cap';
    cap.textContent = t.cap;

    card.appendChild(shot);
    card.appendChild(cap);
    frag.appendChild(card);
  });
  track.appendChild(frag);

  var dotsWrap = document.getElementById('testiDots');
  var slider = track.closest('.testi-slider');
  var prev = slider ? slider.querySelector('.testi-prev') : null;
  var next = slider ? slider.querySelector('.testi-next') : null;

  function cards() { return track.querySelectorAll('.testi-card'); }

  // One card + gap = how far a single "step" scrolls.
  function step() {
    var c = track.querySelector('.testi-card');
    if (!c) return track.clientWidth;
    var cs = getComputedStyle(track);
    var gap = parseInt(cs.columnGap || cs.gap, 10) || 0;
    return c.getBoundingClientRect().width + gap;
  }

  function buildDots() {
    if (!dotsWrap) return;
    dotsWrap.innerHTML = '';
    cards().forEach(function (c, i) {
      var d = document.createElement('button');
      d.type = 'button';
      d.className = 'testi-dot';
      d.setAttribute('aria-label', 'Ke testimoni ' + (i + 1));
      d.addEventListener('click', function () {
        track.scrollTo({ left: i * step(), behavior: 'smooth' });
      });
      dotsWrap.appendChild(d);
    });
    updateActive();
  }

  function updateActive() {
    if (!dotsWrap) return;
    var idx = Math.round(track.scrollLeft / step());
    dotsWrap.querySelectorAll('.testi-dot').forEach(function (d, i) {
      d.classList.toggle('is-active', i === idx);
    });
  }

  if (prev) prev.addEventListener('click', function () {
    track.scrollBy({ left: -step(), behavior: 'smooth' });
  });
  if (next) next.addEventListener('click', function () {
    track.scrollBy({ left: step(), behavior: 'smooth' });
  });

  var raf;
  track.addEventListener('scroll', function () {
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(updateActive);
  });

  // Drag-to-scroll for mouse users; touch already swipes natively.
  var down = false, startX = 0, startScroll = 0, moved = false;
  track.addEventListener('pointerdown', function (e) {
    if (e.pointerType === 'touch') return;
    down = true; moved = false;
    startX = e.clientX; startScroll = track.scrollLeft;
    track.classList.add('is-dragging');
  });
  track.addEventListener('pointermove', function (e) {
    if (!down) return;
    var dx = e.clientX - startX;
    if (Math.abs(dx) > 4) moved = true;
    track.scrollLeft = startScroll - dx;
  });
  function endDrag() {
    if (!down) return;
    down = false;
    track.classList.remove('is-dragging');
  }
  track.addEventListener('pointerup', endDrag);
  track.addEventListener('pointerleave', endDrag);
  // Swallow the click that ends a drag so it doesn't count as a tap.
  track.addEventListener('click', function (e) {
    if (moved) { e.preventDefault(); e.stopPropagation(); }
  }, true);

  window.addEventListener('resize', function () {
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(updateActive);
  });

  buildDots();
}

function setupKarya() {
  var track = document.getElementById('karyaTrack');
  if (!track) return;

  // ====== EDIT DI SINI ======
  // device: 'web' = bingkai browser landscape, 'phone' = bingkai ponsel portrait.
  // screens = daftar tampilan (gambar di assets/karya/), ditampilkan sebagai tab.
  var KARYA = [
    {
      device: 'web', tag: 'Pesanan klien', title: 'SIMEP, Monitoring PKL SMK',
      desc: 'Sistem web untuk memantau praktik kerja lapangan siswa SMK di Surakarta. Guru pembimbing, siswa, dan admin sekolah bekerja di satu tempat, tanpa rekap manual.',
      screens: [
        { img: 'assets/karya/simep-1.webp', label: 'Beranda guru' },
        { img: 'assets/karya/simep-2.webp', label: 'Evaluasi siswa' },
        { img: 'assets/karya/simep-3.webp', label: 'Rekap nilai' }
      ],
      feats: ['Laporan harian wajib foto kamera dan lokasi GPS', 'Nilai teknis, sikap, dan laporan dihitung otomatis', 'Status kelulusan mengikuti syarat kehadiran', 'Panel admin untuk siswa, guru, dan tempat PKL']
    },
    {
      device: 'phone', tag: 'Pesanan klien', title: 'Presensi Guru Digital',
      desc: 'Presensi guru KB dan TK lewat ponsel. Foto langsung dari kamera dan lokasi dicek di server, jadi kehadiran sulit dipalsukan dan admin tidak perlu menghitung manual.',
      screens: [
        { img: 'assets/karya/presensi.webp', label: 'Masuk' }
      ],
      feats: ['Foto kamera langsung, tanpa unggah galeri', 'Jam dan jarak ke sekolah dicek di server', 'Izin dan sakit dengan bukti, disetujui admin', 'Rekap bulanan bisa diunduh sebagai CSV']
    },
    {
      device: 'phone', tag: 'Proyek sukarela', title: 'Kas Masjid Kampus',
      desc: 'Pembukuan kas masjid kampus yang transparan. Takmir mencatat pemasukan dan pengeluaran, pengawas cukup melihat laporannya.',
      screens: [
        { img: 'assets/karya/kas-masjid.webp', label: 'Masuk' }
      ],
      feats: ['Dua peran akses: takmir dan pengawas', 'Foto struk tersimpan bersama transaksi', 'Rekap per kegiatan dan grafik bulanan', 'Laporan siap cetak PDF dan Excel']
    },
    {
      device: 'phone', tag: 'Aplikasi sendiri', title: 'Wallet, Keuangan Pribadi',
      desc: 'Aplikasi keuangan pribadi bergaya iOS yang dipasang di layar utama ponsel. Mencatat pemasukan, pengeluaran, dan dana darurat dengan cepat.',
      screens: [
        { img: 'assets/karya/wallet.webp', label: 'Sambutan' }
      ],
      feats: ['Dipasang di layar utama ponsel seperti aplikasi biasa', 'Dana darurat disisihkan otomatis sesuai persen yang kamu atur', 'Tampilan kaca dengan lima wallpaper', 'Data tersimpan aman per pengguna']
    },
    {
      device: 'web', tag: 'Alat gratis', title: 'Alat Nomor Halaman Skripsi',
      desc: 'Merapikan penomoran halaman skripsi sesuai pedoman kampus. Seluruh proses jalan di browser, jadi dokumenmu tidak pernah keluar dari komputer sendiri.',
      screens: [
        { img: 'assets/karya/nomor-1.webp', label: 'Unggah' },
        { img: 'assets/karya/nomor-2.webp', label: 'Hasil' }
      ],
      feats: ['Romawi untuk halaman awal, angka arab mulai BAB I', 'Halaman judul bab diberi nomor di tengah bawah', 'Berkas asli tidak diubah', 'Gratis dan tanpa daftar']
    }
  ];
  // ==========================

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text) n.textContent = text;
    return n;
  }

  var frag = document.createDocumentFragment();
  KARYA.forEach(function (k) {
    var card = el('article', 'testi-card karya-card');
    card.setAttribute('role', 'listitem');

    // --- sisi kiri: bingkai perangkat + tab layar
    var show = el('div', 'karya-show karya-show-' + k.device);
    var frame = el('div', 'karya-frame karya-frame-' + k.device);
    if (k.device === 'web') {
      var bar = el('div', 'karya-bar');
      bar.innerHTML = '<i></i><i></i><i></i>';
      frame.appendChild(bar);
    }
    var screen = el('div', 'karya-screen');
    var shot = el('img');
    shot.alt = 'Tampilan aplikasi ' + k.title;
    shot.loading = 'lazy';
    shot.src = k.screens[0].img;
    shot.addEventListener('error', function () { card.remove(); buildDots(); });
    screen.appendChild(shot);
    frame.appendChild(screen);
    show.appendChild(frame);

    if (k.screens.length > 1) {
      var tabs = el('div', 'karya-tabs');
      k.screens.forEach(function (s, i) {
        var b = el('button', 'karya-tab' + (i === 0 ? ' is-on' : ''), s.label);
        b.type = 'button';
        b.addEventListener('click', function (e) {
          e.stopPropagation();
          shot.src = s.img;
          tabs.querySelectorAll('.karya-tab').forEach(function (t) { t.classList.remove('is-on'); });
          b.classList.add('is-on');
        });
        tabs.appendChild(b);
      });
      show.appendChild(tabs);
    }

    // --- sisi kanan: keterangan
    var info = el('div', 'karya-info');
    info.appendChild(el('span', 'karya-tag', k.tag));
    info.appendChild(el('h3', '', k.title));
    info.appendChild(el('p', 'karya-desc', k.desc));
    var ul = el('ul', 'karya-feats');
    k.feats.forEach(function (f) { ul.appendChild(el('li', '', f)); });
    info.appendChild(ul);

    card.appendChild(show);
    card.appendChild(info);
    frag.appendChild(card);
  });
  track.appendChild(frag);

  var dotsWrap = document.getElementById('karyaDots');
  var slider = track.closest('.testi-slider');
  var prev = slider.querySelector('.testi-prev');
  var next = slider.querySelector('.testi-next');

  function cards() { return track.querySelectorAll('.testi-card'); }
  function step() {
    var c = track.querySelector('.testi-card');
    if (!c) return track.clientWidth;
    var cs = getComputedStyle(track);
    var gap = parseInt(cs.columnGap || cs.gap, 10) || 0;
    return c.getBoundingClientRect().width + gap;
  }
  function updateActive() {
    var idx = Math.round(track.scrollLeft / step());
    dotsWrap.querySelectorAll('.testi-dot').forEach(function (d, i) {
      d.classList.toggle('is-active', i === idx);
    });
  }
  function buildDots() {
    dotsWrap.innerHTML = '';
    cards().forEach(function (c, i) {
      var d = document.createElement('button');
      d.type = 'button';
      d.className = 'testi-dot';
      d.setAttribute('aria-label', 'Ke aplikasi ' + (i + 1));
      d.addEventListener('click', function () {
        track.scrollTo({ left: i * step(), behavior: 'smooth' });
      });
      dotsWrap.appendChild(d);
    });
    updateActive();
  }

  prev.addEventListener('click', function () { track.scrollBy({ left: -step(), behavior: 'smooth' }); });
  next.addEventListener('click', function () { track.scrollBy({ left: step(), behavior: 'smooth' }); });

  var raf;
  track.addEventListener('scroll', function () {
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(updateActive);
  });

  var down = false, startX = 0, startScroll = 0, moved = false;
  track.addEventListener('pointerdown', function (e) {
    if (e.pointerType === 'touch') return;
    if (e.target.closest && e.target.closest('.karya-tab')) return;
    down = true; moved = false;
    startX = e.clientX; startScroll = track.scrollLeft;
    track.classList.add('is-dragging');
  });
  track.addEventListener('pointermove', function (e) {
    if (!down) return;
    var dx = e.clientX - startX;
    if (Math.abs(dx) > 4) moved = true;
    track.scrollLeft = startScroll - dx;
  });
  function endDrag() {
    if (!down) return;
    down = false;
    track.classList.remove('is-dragging');
  }
  track.addEventListener('pointerup', endDrag);
  track.addEventListener('pointerleave', endDrag);
  track.addEventListener('click', function (e) {
    if (moved) { e.preventDefault(); e.stopPropagation(); }
  }, true);
  window.addEventListener('resize', function () {
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(updateActive);
  });

  buildDots();
}
