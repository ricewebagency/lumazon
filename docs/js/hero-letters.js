document.addEventListener('DOMContentLoaded', () => {
  const targets = document.querySelectorAll('[data-animate-letters]');
  const revealTargets = document.querySelectorAll('[data-animate-reveal-up], [data-animate-reveal-down]');
  const lazyRevealTargets = document.querySelectorAll('[data-animate-after-lazy][data-animate-pending][data-animate-reveal-up], [data-animate-after-lazy][data-animate-pending][data-animate-reveal-down]');
  const noBlurRevealTargets = document.querySelectorAll('[data-animate-reveal-up][data-animate-no-blur], [data-animate-reveal-down][data-animate-no-blur]');
  const lazySlideUpTargets = document.querySelectorAll('[data-animate-lazy-slide-up][data-animate-pending]');

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
  });

  revealTargets.forEach((target) => {
    const delay = Number.parseFloat(target.getAttribute('data-animate-delay') || '0.8');

    if (Number.isFinite(delay)) {
      target.style.setProperty('--animate-delay', `${delay}s`);
    }
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
});
