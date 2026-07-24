document.addEventListener('DOMContentLoaded', () => {
  const panelElements = Array.from(document.querySelectorAll('.js-reveal-panel'));
  const spriteElements = Array.from(document.querySelectorAll('.js-reveal-sprites'));
  const logoElements = Array.from(document.querySelectorAll('.js-reveal-logo'));
  const headingElements = Array.from(document.querySelectorAll('.js-reveal-heading'));
  const subtextElements = Array.from(document.querySelectorAll('.js-reveal-subtext'));
  const formElements = Array.from(document.querySelectorAll('.js-reveal-form'));
  const treeSideHiddenClass = new WeakMap();
  const treeScrollMeta = new WeakMap();

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

  const getSpriteDirection = (element) => {
    const rect = element.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      const elementCenter = rect.left + rect.width / 2;
      const viewportCenter = window.innerWidth / 2;
      return elementCenter >= viewportCenter ? 1 : -1;
    }

    const classNames = Array.from(element.classList);
    const hasRightClass = classNames.some((className) => className.startsWith('right-') || className.startsWith('-right-'));
    return hasRightClass ? 1 : -1;
  };

  const captureTreeScrollMeta = () => {
    const viewportCenter = window.innerWidth / 2;

    spriteElements.forEach((element) => {
      const src = (element.getAttribute('src') || '').toLowerCase();
      if (!src.includes('tree')) {
        treeScrollMeta.delete(element);
        return;
      }

      const rect = element.getBoundingClientRect();
      const elementCenter = rect.width > 0 && rect.height > 0 ? rect.left + rect.width / 2 : viewportCenter;
      const distanceRatio = Math.min(Math.abs(elementCenter - viewportCenter) / Math.max(viewportCenter, 1), 1);
      const direction = getSpriteDirection(element);
      const shiftFactor = Number.parseFloat(element.dataset.scrollShiftFactor || '1');
      const normalizedShiftFactor = Number.isFinite(shiftFactor) && shiftFactor > 0 ? shiftFactor : 1;
      const maxShift = (22 + 78 * Math.max(distanceRatio, 0.24)) * normalizedShiftFactor;

      treeScrollMeta.set(element, {
        direction,
        maxShift
      });
    });
  };

  const applyTreeScrollShift = () => {
    const docElement = document.documentElement;
    const maxScroll = Math.max(docElement.scrollHeight - window.innerHeight, 0);
    const scrollProgress = maxScroll === 0 ? 1 : Math.min(window.scrollY / maxScroll, 1);
    const outwardProgress = 1 - scrollProgress;

    spriteElements.forEach((element) => {
      const meta = treeScrollMeta.get(element);
      if (!meta) {
        element.style.translate = '';
        return;
      }

      const shift = meta.direction * meta.maxShift * outwardProgress;
      element.style.translate = `${shift.toFixed(2)}px 0`;
    });
  };

  let scrollRafHandle = null;
  const scheduleSpriteScrollShift = () => {
    if (scrollRafHandle !== null) {
      return;
    }

    scrollRafHandle = window.requestAnimationFrame(() => {
      scrollRafHandle = null;
      applyTreeScrollShift();
    });
  };

  const setupSpriteScrollAnimation = () => {
    captureTreeScrollMeta();
    applyTreeScrollShift();

    window.addEventListener('scroll', scheduleSpriteScrollShift, { passive: true });
    window.addEventListener('resize', () => {
      captureTreeScrollMeta();
      scheduleSpriteScrollShift();
    });
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
    setupSpriteScrollAnimation();
    return;
  }

  setupSpriteScrollAnimation();

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
