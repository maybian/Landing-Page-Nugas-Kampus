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

/* Geser mulus dengan easing (dipakai slider Karya). Snap dimatikan selama animasi. */
function animateScroll(el, to, dur) {
  if (el._anim) cancelAnimationFrame(el._anim);
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !dur) { el.scrollLeft = to; return; }
  var from = el.scrollLeft, delta = to - from, t0 = null;
  if (Math.abs(delta) < 1) return;
  el.classList.add('is-anim');
  function ease(t) { return 1 - Math.pow(1 - t, 4); }
  function frame(ts) {
    if (t0 === null) t0 = ts;
    var k = Math.min((ts - t0) / dur, 1);
    el.scrollLeft = from + delta * ease(k);
    if (k < 1) { el._anim = requestAnimationFrame(frame); }
    else { el._anim = null; el.classList.remove('is-anim'); }
  }
  el._anim = requestAnimationFrame(frame);
}

function setupKarya() {
  var track = document.getElementById('karyaTrack');
  if (!track) return;

  // ====== EDIT DI SINI ======
  // device: 'web' = bingkai browser landscape, 'phone' = bingkai ponsel portrait.
  // screens = tampilan aplikasi (gambar di assets/karya/). Digeser di dalam bingkai.
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
        { img: 'assets/karya/presensi-1.webp', label: 'Beranda guru' },
        { img: 'assets/karya/presensi-2.webp', label: 'Riwayat' },
        { img: 'assets/karya/presensi-3.webp', label: 'Ajukan izin' },
        { img: 'assets/karya/presensi-4.webp', label: 'Profil' },
        { img: 'assets/karya/presensi-5.webp', label: 'Admin: hari ini' },
        { img: 'assets/karya/presensi-6.webp', label: 'Admin: izin' },
        { img: 'assets/karya/presensi-7.webp', label: 'Admin: guru' },
        { img: 'assets/karya/presensi-8.webp', label: 'Admin: rekap' }
      ],
      feats: ['Foto kamera langsung, tanpa unggah galeri', 'Jam dan jarak ke sekolah dicek di server', 'Izin dan sakit dengan bukti, disetujui admin', 'Rekap bulanan bisa diunduh sebagai Excel']
    },
    {
      device: 'phone', tag: 'Proyek sukarela', title: 'Kas Masjid Kampus',
      desc: 'Pembukuan kas masjid kampus yang transparan. Takmir mencatat pemasukan dan pengeluaran, pengawas cukup melihat laporannya, dan jamaah bisa memindai QR untuk membuka laporan.',
      screens: [
        { img: 'assets/karya/masjid-1.webp', label: 'Beranda' },
        { img: 'assets/karya/masjid-2.webp', label: 'Catat' },
        { img: 'assets/karya/masjid-3.webp', label: 'Riwayat' },
        { img: 'assets/karya/masjid-4.webp', label: 'Kegiatan' },
        { img: 'assets/karya/masjid-5.webp', label: 'Laporan' },
        { img: 'assets/karya/masjid-6.webp', label: 'Papan publik' },
        { img: 'assets/karya/masjid-7.webp', label: 'Poster QR' },
        { img: 'assets/karya/masjid-8.webp', label: 'Pengaturan' }
      ],
      feats: ['Dua peran akses: takmir dan pengawas', 'Poster QR siap unduh dan cetak untuk papan transparansi', 'Foto struk tersimpan bersama transaksi', 'Laporan siap cetak PDF dan Excel']
    },
    {
      device: 'phone', tag: 'Alat internal', title: 'Pembukuan Nugas Kampus',
      desc: 'Aplikasi pembukuan yang kami pakai sendiri. Tiap order dicatat, pembagian kas dan gaji dihitung otomatis, dan tiap awal bulan muncul rekap bulan sebelumnya.',
      screens: [
        { img: 'assets/karya/nk-1.webp', label: 'Beranda' },
        { img: 'assets/karya/nk-2.webp', label: 'Rekap bulanan' },
        { img: 'assets/karya/nk-3.webp', label: 'Catat order' },
        { img: 'assets/karya/nk-4.webp', label: 'Riwayat' },
        { img: 'assets/karya/nk-5.webp', label: 'Pengaturan' },
        { img: 'assets/karya/nk-6.webp', label: 'Saldo uang usaha' }
      ],
      feats: ['Bagi hasil otomatis dengan persentase yang bisa diatur', 'Rekap bulan sebelumnya muncul tiap awal bulan', 'Riwayat bisa dicari, difilter, dan diekspor ke Excel', 'Dikunci PIN, dipakai dari ponsel seperti aplikasi']
    },
    {
      device: 'phone', tag: 'Aplikasi sendiri', title: 'Wallet, Keuangan Pribadi',
      desc: 'Aplikasi keuangan pribadi bergaya iOS yang dipasang di layar utama ponsel. Mencatat pemasukan, pengeluaran, dan dana darurat dengan cepat.',
      screens: [
        { img: 'assets/karya/wallet-1.webp', label: 'Beranda' },
        { img: 'assets/karya/wallet-2.webp', label: 'Pemasukan' },
        { img: 'assets/karya/wallet-3.webp', label: 'Pengeluaran' },
        { img: 'assets/karya/wallet-4.webp', label: 'Dana darurat' },
        { img: 'assets/karya/wallet-5.webp', label: 'Pengaturan' }
      ],
      feats: ['Dipasang di layar utama ponsel seperti aplikasi biasa', 'Dana darurat disisihkan otomatis sesuai persen yang kamu atur', 'Pilihan wallpaper dan animasi di Pengaturan', 'Data tersimpan aman per pengguna']
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

    // --- sisi kiri: bingkai perangkat, layar bisa digeser
    var show = el('div', 'karya-show karya-show-' + k.device);
    var frame = el('div', 'karya-frame karya-frame-' + k.device);
    if (k.device === 'web') {
      var bar = el('div', 'karya-bar');
      bar.innerHTML = '<i></i><i></i><i></i>';
      frame.appendChild(bar);
    }
    var screen = el('div', 'karya-screen');
    var strip = el('div', 'karya-strip');
    k.screens.forEach(function (s) {
      var slide = el('div', 'karya-slide');
      var shot = el('img');
      shot.alt = k.title + ': ' + s.label;
      shot.loading = 'lazy';
      shot.draggable = false;
      shot.src = s.img;
      slide.appendChild(shot);
      strip.appendChild(slide);
    });
    screen.appendChild(strip);
    frame.appendChild(screen);
    show.appendChild(frame);

    // penanda halaman layar (titik), tanpa tulisan
    var pager = null;
    if (k.screens.length > 1) {
      pager = el('div', 'karya-pager');
      k.screens.forEach(function (s, i) {
        var d = el('button', 'karya-pdot' + (i === 0 ? ' is-on' : ''));
        d.type = 'button';
        d.setAttribute('aria-label', 'Tampilan ' + (i + 1));
        d.addEventListener('click', function () { animateScroll(strip, i * strip.clientWidth, 560); });
        pager.appendChild(d);
      });
      show.appendChild(pager);
    }

    // efek geser: layar yang menjauh sedikit mengecil dan memudar; titik ikut berpindah
    var sraf;
    var lastIdx = -1;
    strip.addEventListener('scroll', function () {
      if (sraf) cancelAnimationFrame(sraf);
      sraf = requestAnimationFrame(function () {
        var w = Math.max(strip.clientWidth, 1);
        var slides = strip.children;
        for (var s = 0; s < slides.length; s++) {
          var p = (s * w - strip.scrollLeft) / w;
          var ap = Math.min(Math.abs(p), 1);
          var im = slides[s].firstChild;
          im.style.transform = 'scale(' + (1 - 0.06 * ap).toFixed(3) + ')';
          im.style.opacity = (1 - 0.45 * ap).toFixed(3);
        }
        if (!pager) return;
        var idx = Math.round(strip.scrollLeft / w);
        if (idx === lastIdx) return;
        lastIdx = idx;
        pager.querySelectorAll('.karya-pdot').forEach(function (t, i) { t.classList.toggle('is-on', i === idx); });
      });
    });

    // geser dengan mouse di dalam bingkai (sentuhan sudah native)
    var sdown = false, sx = 0, ss = 0, smoved = false;
    strip.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'touch') return;
      sdown = true; smoved = false; sx = e.clientX; ss = strip.scrollLeft;
      strip.classList.add('is-dragging');
    });
    strip.addEventListener('pointermove', function (e) {
      if (!sdown) return;
      var dx = e.clientX - sx;
      if (Math.abs(dx) > 4) smoved = true;
      strip.scrollLeft = ss - dx;
    });
    function sEnd() {
      if (!sdown) return;
      sdown = false;
      // baca posisi SEBELUM snap dinyalakan lagi, kalau tidak langsung loncat balik
      var w = strip.clientWidth || 1;
      var now = strip.scrollLeft;
      var base = Math.round(ss / w);
      var d = now - ss;
      var idx = Math.abs(d) > 40 ? base + (d > 0 ? 1 : -1) : Math.round(now / w);
      idx = Math.max(0, Math.min(strip.children.length - 1, idx));
      strip.classList.remove('is-dragging');
      strip.scrollLeft = now;
      animateScroll(strip, idx * w, 520);
    }
    strip.addEventListener('pointerup', sEnd);
    strip.addEventListener('pointerleave', sEnd);

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
    return c.offsetWidth + gap; // offsetWidth: tidak terpengaruh efek scale
  }
  function updateActive() {
    var idx = Math.round(track.scrollLeft / step());
    dotsWrap.querySelectorAll('.testi-dot').forEach(function (d, i) {
      d.classList.toggle('is-active', i === idx);
    });
    var st = step();
    cards().forEach(function (c, i) {
      c.classList.toggle('is-current', i === idx);
      // efek kartu: menjauh dari tengah = mengecil, memudar, memburam; mendekat = membesar dan jelas
      var p = Math.min(Math.abs((i * st - track.scrollLeft) / st), 1.4);
      var a = Math.min(p, 1);
      c.style.transform = 'scale(' + (1 - 0.14 * a).toFixed(3) + ')';
      c.style.opacity = (1 - 0.62 * a).toFixed(3);
      c.style.filter = a < 0.02 ? 'none' : 'blur(' + (6 * a).toFixed(2) + 'px)';
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
        animateScroll(track, i * step(), 640);
      });
      dotsWrap.appendChild(d);
    });
    updateActive();
  }

  prev.addEventListener('click', function () { animateScroll(track, track.scrollLeft - step(), 640); });
  next.addEventListener('click', function () { animateScroll(track, track.scrollLeft + step(), 640); });

  var raf;
  track.addEventListener('scroll', function () {
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(updateActive);
  });

  // geser antar aplikasi dengan mouse: hanya dari luar bingkai layar
  var down = false, startX = 0, startScroll = 0, moved = false;
  track.addEventListener('pointerdown', function (e) {
    if (e.pointerType === 'touch') return;
    if (e.target.closest && (e.target.closest('.karya-screen') || e.target.closest('.karya-tab'))) return;
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
