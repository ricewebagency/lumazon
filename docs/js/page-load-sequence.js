document.addEventListener('DOMContentLoaded', () => {
  const panelElements = Array.from(document.querySelectorAll('.js-reveal-panel'));
  const spriteElements = Array.from(document.querySelectorAll('.js-reveal-sprites'));
  const logoElements = Array.from(document.querySelectorAll('.js-reveal-logo'));
  const headingElements = Array.from(document.querySelectorAll('.js-reveal-heading'));
  const subtextElements = Array.from(document.querySelectorAll('.js-reveal-subtext'));
  const formElements = Array.from(document.querySelectorAll('.js-reveal-form'));

  const reveal = (elements, hiddenClasses) => {
    elements.forEach((element) => {
      element.classList.remove(...hiddenClasses);
    });
  };

  const revealAllImmediately = () => {
    reveal(panelElements, ['opacity-0', 'translate-y-2', 'scale-[0.985]']);
    reveal(spriteElements, ['opacity-0', 'translate-y-3']);
    reveal(logoElements, ['opacity-0', 'translate-y-2', 'scale-[0.99]', 'blur-[2px]']);
    reveal(headingElements, ['opacity-0', 'translate-y-2', 'scale-[0.99]', 'blur-[2px]']);
    reveal(subtextElements, ['opacity-0', 'translate-y-2', 'scale-[0.99]', 'blur-[2px]']);
    reveal(formElements, ['opacity-0', 'translate-y-2', 'scale-[0.99]', 'blur-[2px]']);
  };

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    revealAllImmediately();
    return;
  }

  window.setTimeout(() => {
    reveal(panelElements, ['opacity-0', 'translate-y-2', 'scale-[0.985]']);
  }, 180);

  window.setTimeout(() => {
    reveal(spriteElements, ['opacity-0', 'translate-y-3']);
  }, 760);

  window.setTimeout(() => {
    reveal(logoElements, ['opacity-0', 'translate-y-2', 'scale-[0.99]', 'blur-[2px]']);
  }, 1180);

  window.setTimeout(() => {
    reveal(headingElements, ['opacity-0', 'translate-y-2', 'scale-[0.99]', 'blur-[2px]']);
  }, 1420);

  window.setTimeout(() => {
    reveal(subtextElements, ['opacity-0', 'translate-y-2', 'scale-[0.99]', 'blur-[2px]']);
  }, 1660);

  window.setTimeout(() => {
    reveal(formElements, ['opacity-0', 'translate-y-2', 'scale-[0.99]', 'blur-[2px]']);
  }, 1920);
});
