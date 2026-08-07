document.addEventListener('DOMContentLoaded', () => {
  const targets = document.querySelectorAll('[data-animate-letters]');
  const revealTargets = document.querySelectorAll('[data-animate-reveal-up], [data-animate-reveal-down]');
  const lazyRevealTargets = document.querySelectorAll('[data-animate-after-lazy][data-animate-pending][data-animate-reveal-up], [data-animate-after-lazy][data-animate-pending][data-animate-reveal-down]');
  const noBlurRevealTargets = document.querySelectorAll('[data-animate-reveal-up][data-animate-no-blur], [data-animate-reveal-down][data-animate-no-blur]');
  const lazySlideUpTargets = document.querySelectorAll('[data-animate-lazy-slide-up][data-animate-pending]');
  const staggerRevealTargets = document.querySelectorAll('[data-animate-stagger-reveal]');

  targets.forEach((target) => {
    const text = target.textContent;
    const chars = Array.from(text);
    const delay = Number.parseFloat(target.getAttribute('data-animate-delay') || '0');

    target.innerHTML = chars
      .map((char, index) => {
        if (char === ' ') {
          return ' ';
        }

        return `<span class="hero-letter" style="--animation-delay: ${delay + index * 0.05}s;">${char}</span>`;
      })
      .join('');

    // Avoid a flash of unanimated text on quick refreshes.
    target.classList.remove('invisible');
  });

  revealTargets.forEach((target) => {
    const delay = Number.parseFloat(target.getAttribute('data-animate-delay') || '0.8');

    if (Number.isFinite(delay)) {
      target.style.setProperty('--animate-delay', `${delay}s`);
    }

    // Allow CSS opacity/transform animations to run by removing visibility:hidden.
    target.classList.remove('invisible');
  });

  lazyRevealTargets.forEach((target) => {
    const lazyImage = target.querySelector('img[loading="lazy"], img');
    const configuredDelay = Number.parseFloat(target.getAttribute('data-animate-delay') || '0.8');
    const delayMs = Number.isFinite(configuredDelay) ? configuredDelay * 1000 : 0;
    const delayGate = new Promise((resolve) => {
      window.setTimeout(resolve, delayMs);
    });
    const imageGate = new Promise((resolve) => {
      if (!lazyImage || lazyImage.complete) {
        resolve();
        return;
      }

      lazyImage.addEventListener('load', resolve, { once: true });
      lazyImage.addEventListener('error', resolve, { once: true });
    });

    Promise.all([delayGate, imageGate]).then(() => {
      if (target.hasAttribute('data-animate-no-blur')) {
        target.classList.add('is-revealed');
        target.removeAttribute('data-animate-pending');
        return;
      }

      target.style.setProperty('--animate-delay', '0s');
      target.removeAttribute('data-animate-pending');
    });
  });

  noBlurRevealTargets.forEach((target) => {
    if (target.hasAttribute('data-animate-pending')) {
      return;
    }

    const configuredDelay = Number.parseFloat(target.getAttribute('data-animate-delay') || '0.8');
    const delayMs = Number.isFinite(configuredDelay) ? configuredDelay * 1000 : 0;

    window.setTimeout(() => {
      target.classList.add('is-revealed');
    }, delayMs);
  });

  lazySlideUpTargets.forEach((target) => {
    const configuredDelay = Number.parseFloat(target.getAttribute('data-animate-delay') || '0.8');
    const delayMs = Number.isFinite(configuredDelay) ? configuredDelay * 1000 : 0;

    const revealTarget = () => {
      target.classList.remove('invisible');
      target.classList.remove('translate-y-[140px]');
      target.classList.add('translate-y-0');
      target.removeAttribute('data-animate-pending');
    };

    window.setTimeout(revealTarget, delayMs);
  });

  staggerRevealTargets.forEach((target) => {
    const items = Array.from(target.children);

    if (!items.length) {
      return;
    }

    const firstDelay = Number.parseFloat(target.getAttribute('data-animate-delay') || '0.15');
    const staggerMs = Number.parseInt(target.getAttribute('data-animate-stagger') || '75', 10);
    const risePx = Number.parseInt(target.getAttribute('data-animate-rise') || '12', 10);
    const transitionDuration = target.getAttribute('data-animate-duration') || '720ms';
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    items.forEach((item, index) => {
      item.style.opacity = '0';
      item.style.transform = `translate3d(0, ${risePx}px, 0)`;
      item.style.willChange = 'opacity, transform';
      item.style.transitionProperty = 'opacity, transform';
      item.style.transitionDuration = transitionDuration;
      item.style.transitionTimingFunction = 'cubic-bezier(0.22, 1, 0.36, 1)';
      item.style.transitionDelay = `${Math.max(0, firstDelay * 1000) + index * Math.max(0, staggerMs)}ms`;
    });

    if (prefersReducedMotion) {
      items.forEach((item) => {
        item.style.transition = 'none';
        item.style.opacity = '1';
        item.style.transform = 'translate3d(0, 0, 0)';
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          window.requestAnimationFrame(() => {
            items.forEach((item) => {
              item.style.opacity = '1';
              item.style.transform = 'translate3d(0, 0, 0)';
            });
          });

          observer.unobserve(target);
        });
      },
      {
        root: null,
        threshold: 0.35,
        rootMargin: '0px 0px -8% 0px',
      }
    );

    observer.observe(target);
  });
});
