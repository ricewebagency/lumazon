// Lenis smooth scroll initialisatie
// CDN versie wordt geladen via script tag in HTML

document.addEventListener('DOMContentLoaded', () => {
  // Wacht tot Lenis global beschikbaar is
  if (typeof Lenis !== 'undefined') {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    const getHeaderOffset = () => {
      const header = document.getElementById('header');
      return header ? header.offsetHeight : 0;
    };

    const scrollToHash = (hash, immediate = false) => {
      if (!hash || hash === '#') {
        return;
      }

      const target = document.querySelector(hash);
      if (!target) {
        return;
      }

      // Trek de vaste headerhoogte af zodat de sectie precies uitlijnt.
      lenis.scrollTo(target, {
        offset: -getHeaderOffset(),
        immediate,
        lock: true,
        force: true,
      });
    };

    // Request animation frame voor smooth scroll
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Stop scroll wanneer gebruiker zelf scrollt
    lenis.on('scroll', (e) => {
      // Je kan hier custom logica toevoegen als je wilt
    });

    document.addEventListener('click', (event) => {
      const link = event.target.closest('a[href]');
      if (!link) {
        return;
      }

      const url = new URL(link.href, window.location.href);
      const isSamePage =
        url.origin === window.location.origin &&
        url.pathname === window.location.pathname;

      if (!isSamePage || !url.hash) {
        return;
      }

      if (!document.querySelector(url.hash)) {
        return;
      }

      event.preventDefault();
      history.pushState(null, '', url.hash);
      scrollToHash(url.hash);
    });

    if (window.location.hash) {
      // Wacht een frame zodat layout en fonts geladen zijn voor precieze positie.
      requestAnimationFrame(() => {
        scrollToHash(window.location.hash, true);
      });
    }

    // Maak lenis global beschikbaar voor andere scripts
    window.lenis = lenis;
  }
});
