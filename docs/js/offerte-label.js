document.addEventListener('DOMContentLoaded', () => {
  const labels = document.querySelectorAll('[data-offerte-label]');

  if (!labels.length) return;

  const revealScrollThreshold = 300;
  let scrollTicking = false;

  const setVisible = (target) => {
    target.classList.remove('translate-x-full', 'opacity-0');
    target.classList.add('translate-x-0', 'opacity-100');
  };

  const setHidden = (target) => {
    target.classList.remove('translate-x-0', 'opacity-100');
    target.classList.add('translate-x-full', 'opacity-0');
  };

  const revealAll = () => {
    labels.forEach((label) => {
      setVisible(label);
    });
  };

  const syncWithScroll = () => {
    const shouldReveal = window.scrollY >= revealScrollThreshold;

    labels.forEach((label) => {
      if (shouldReveal) {
        setVisible(label);
        return;
      }

      setHidden(label);
    });
  };

  const onScroll = () => {
    if (scrollTicking) return;

    scrollTicking = true;
    window.requestAnimationFrame(() => {
      syncWithScroll();
      scrollTicking = false;
    });
  };

  const initializeRevealCycle = () => {
    syncWithScroll();
  };

  if (document.readyState === 'complete') {
    initializeRevealCycle();
  } else {
    window.addEventListener('load', initializeRevealCycle, { once: true });
  }

  window.addEventListener('pageshow', (event) => {
    if (!event.persisted) {
      return;
    }

    initializeRevealCycle();
  });

  window.addEventListener('scroll', onScroll, { passive: true });
});
