document.addEventListener('DOMContentLoaded', () => {
  const panelElements = Array.from(document.querySelectorAll('.js-reveal-panel'));
  const spriteElements = Array.from(document.querySelectorAll('.js-reveal-sprites'));
  const logoElements = Array.from(document.querySelectorAll('.js-reveal-logo'));
  const headingElements = Array.from(document.querySelectorAll('.js-reveal-heading'));
  const subtextElements = Array.from(document.querySelectorAll('.js-reveal-subtext'));
  const formElements = Array.from(document.querySelectorAll('.js-reveal-form'));
  const treeSideHiddenClass = new WeakMap();

  spriteElements.forEach((element) => {
    const src = (element.getAttribute('src') || '').toLowerCase();
    if (!src.includes('tree')) {
      return;
    }

    const classNames = Array.from(element.classList);
    const isRightSide = classNames.some((className) => className.startsWith('right-') || className.startsWith('-right-'));
    const isLeftSide = classNames.some((className) => className.startsWith('left-') || className.startsWith('-left-'));

    const hiddenSideClass = isRightSide && !isLeftSide ? 'translate-x-8' : '-translate-x-8';
    element.classList.add(hiddenSideClass);
    treeSideHiddenClass.set(element, hiddenSideClass);
  });

  const reveal = (elements, hiddenClasses) => {
    elements.forEach((element) => {
      element.classList.remove(...hiddenClasses);
    });
  };

  const revealSprite = (element) => {
    const hiddenClasses = ['opacity-0', 'translate-y-3'];
    const sideHiddenClass = treeSideHiddenClass.get(element);
    if (sideHiddenClass) {
      hiddenClasses.push(sideHiddenClass);
    }

    element.classList.remove(...hiddenClasses);
  };

  const revealSprites = () => {
    spriteElements.forEach((element) => revealSprite(element));
  };

  const observeSpritesOnView = () => {
    if (!('IntersectionObserver' in window)) {
      revealSprites();
      return;
    }

    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          revealSprite(entry.target);
          currentObserver.unobserve(entry.target);
        });
      },
      {
        root: null,
        threshold: 0.12,
        rootMargin: '0px 0px -6% 0px'
      }
    );

    spriteElements.forEach((element) => observer.observe(element));
  };

  const revealAllImmediately = () => {
    reveal(panelElements, ['opacity-0', 'translate-y-2', 'scale-[0.985]']);
    revealSprites();
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
    observeSpritesOnView();
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
