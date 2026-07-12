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
    { img: 'assets/testi-7.jpg', cap: 'Hasil Sesuai · Referensi Aman' }
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
