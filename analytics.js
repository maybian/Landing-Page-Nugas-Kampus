/* ==========================================================================
   Nugas Kampus - Pelacakan Pengunjung
   --------------------------------------------------------------------------
   ISI DUA BARIS DI BAWAH INI, lalu commit dan push. Selama masih kosong,
   tidak ada satu pun request yang dikirim, jadi situs tetap aman dan cepat.

   GA4_ID     : ambil di analytics.google.com > Admin > Data Streams >
                pilih stream web nugaskampus.com > "Measurement ID"
                formatnya G-XXXXXXXXXX
   CLARITY_ID : ambil di clarity.microsoft.com > buat project baru untuk
                nugaskampus.com > Settings > Setup > kode di dalam
                "clarity(...)" formatnya 10 karakter huruf angka
   ========================================================================== */

var GA4_ID = '';
var CLARITY_ID = '';

/* --------------------------------------------------------------------------
   Di bawah ini tidak perlu diubah.
   -------------------------------------------------------------------------- */
(function () {
  'use strict';

  // ---- Google Analytics 4 ----
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;

  if (GA4_ID) {
    var ga = document.createElement('script');
    ga.async = true;
    ga.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA4_ID;
    document.head.appendChild(ga);

    gtag('js', new Date());
    gtag('config', GA4_ID);
  }

  // ---- Microsoft Clarity (rekaman sesi & heatmap) ----
  if (CLARITY_ID) {
    (function (c, l, a, r, i, t, y) {
      c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
      t = l.createElement(r); t.async = 1;
      t.src = 'https://www.clarity.ms/tag/' + i;
      y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
    })(window, document, 'clarity', 'script', CLARITY_ID);
  }

  /* ------------------------------------------------------------------------
     Pelacakan klik WhatsApp.

     Tiap tombol WA punya atribut data-wa-src yang menandai posisinya, misalnya
     "home-hero-admin1" atau "layanan-spss-cta". Nilai itu dikirim ke GA4
     sebagai event "klik_wa", jadi di laporan kelihatan tombol mana yang benar
     benar menghasilkan chat, bukan cuma jumlah pengunjung.
     ------------------------------------------------------------------------ */
  document.addEventListener('click', function (e) {
    var link = e.target.closest ? e.target.closest('a[href*="wa.me"]') : null;
    if (!link) return;

    var src = link.getAttribute('data-wa-src') || 'tanpa-label';

    if (GA4_ID) {
      gtag('event', 'klik_wa', {
        wa_src: src,
        halaman: window.location.pathname
      });
    }
    if (CLARITY_ID && window.clarity) {
      window.clarity('event', 'klik_wa_' + src);
    }
  }, true);

  /* ------------------------------------------------------------------------
     Penanda sumber kunjungan.

     Kalau pengunjung datang dari link berparameter (?utm_source=instagram,
     ?utm_source=tiktok, dan seterusnya), penandanya disimpan di sessionStorage
     lalu ikut terkirim di event klik WA. Berguna untuk memisahkan chat yang
     datang dari Google, dari bio Instagram, atau dari link yang dibagikan.
     ------------------------------------------------------------------------ */
  try {
    var utm = new URLSearchParams(window.location.search).get('utm_source');
    if (utm) sessionStorage.setItem('nk_utm', utm);
  } catch (err) { /* private mode, abaikan */ }
})();
