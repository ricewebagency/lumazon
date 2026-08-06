document.addEventListener('DOMContentLoaded', () => {
  const carousel = document.querySelector('[data-project-carousel]');

  if (!carousel) {
    return;
  }

  const track = carousel.querySelector('[data-project-carousel-track]');
  const scrollContainer = carousel.querySelector('[data-project-carousel-scroll]') || carousel;
  const prevButton = carousel.querySelector('[data-project-carousel-prev]');
  const nextButton = carousel.querySelector('[data-project-carousel-next]');
  const cards = Array.from(carousel.querySelectorAll('[data-project-carousel-card]'));
  const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  if (!track || !prevButton || !nextButton || cards.length < 2) {
    return;
  }

  const createClone = (card) => {
    const clone = card.cloneNode(true);

    clone.setAttribute('aria-hidden', 'true');
    clone.removeAttribute('data-project-carousel-card');

    clone.querySelectorAll('a, button, input, select, textarea, [tabindex]').forEach((element) => {
      element.tabIndex = -1;
    });

    return clone;
  };

  const appendCloneRow = () => {
    const fragment = document.createDocumentFragment();

    cards.forEach((card) => {
      fragment.appendChild(createClone(card));
    });

    track.appendChild(fragment);
  };

  appendCloneRow();
  appendCloneRow();

  const allCards = Array.from(track.children).filter((element) => element instanceof HTMLElement);

  let step = 0;
  let groupWidth = 0;
  let isWrapping = false;
  let activeUpdateFrame = 0;
  let autoScrollTimer = 0;
  let programmaticScrollTimeout = 0;
  let isProgrammaticScroll = false;
  let hasManualScroll = false;

  allCards.forEach((card) => {
    card.style.transformOrigin = 'center center';
    card.style.transition = 'transform 450ms ease, opacity 450ms ease';
    card.style.willChange = 'transform';
    card.style.transform = 'scale(0.965)';
    card.style.opacity = '0.92';
  });

  const setActiveCard = () => {
    if (!allCards.length) {
      return;
    }

    const scrollBounds = scrollContainer.getBoundingClientRect();
    const viewportCenter = scrollBounds.left + scrollBounds.width / 2;
    let activeCard = null;
    let minDistance = Number.POSITIVE_INFINITY;

    allCards.forEach((card) => {
      const cardBounds = card.getBoundingClientRect();
      const cardCenter = cardBounds.left + cardBounds.width / 2;
      const distance = Math.abs(cardCenter - viewportCenter);

      if (distance < minDistance) {
        minDistance = distance;
        activeCard = card;
      }
    });

    allCards.forEach((card) => {
      if (card === activeCard) {
        card.style.transform = 'scale(1)';
        card.style.opacity = '1';
        card.style.zIndex = '1';
        return;
      }

      card.style.transform = 'scale(0.965)';
      card.style.opacity = '0.92';
      card.style.zIndex = '0';
    });
  };

  const scheduleActiveCardUpdate = () => {
    if (activeUpdateFrame) {
      return;
    }

    activeUpdateFrame = window.requestAnimationFrame(() => {
      activeUpdateFrame = 0;
      setActiveCard();
    });
  };

  const stopAutoScroll = () => {
    if (!autoScrollTimer) {
      return;
    }

    window.clearInterval(autoScrollTimer);
    autoScrollTimer = 0;
  };

  const markProgrammaticScroll = (duration = 750) => {
    isProgrammaticScroll = true;
    window.clearTimeout(programmaticScrollTimeout);
    programmaticScrollTimeout = window.setTimeout(() => {
      isProgrammaticScroll = false;
    }, duration);
  };

  const startAutoScroll = () => {
    if (autoScrollTimer || hasManualScroll || reduceMotionQuery.matches) {
      return;
    }

    autoScrollTimer = window.setInterval(() => {
      if (hasManualScroll) {
        stopAutoScroll();
        return;
      }

      scrollToIndex(getCurrentIndex() + 1);
    }, 4500);
  };

  const getStep = () => {
    const firstCard = cards[0];

    if (!firstCard) {
      return carousel.clientWidth || 0;
    }

    const cardWidth = firstCard.getBoundingClientRect().width;
    const trackStyle = window.getComputedStyle(track);
    const gap = Number.parseFloat(trackStyle.columnGap || trackStyle.gap || '0');

    return cardWidth + (Number.isFinite(gap) ? gap : 0);
  };

  const measure = () => {
    step = getStep();
    groupWidth = step * cards.length;
  };

  const getCurrentIndex = () => {
    if (!step) {
      return 0;
    }

    return Math.round(scrollContainer.scrollLeft / step);
  };

  const scrollToIndex = (index) => {
    const totalPages = cards.length * 3;

    if (!step || !totalPages) {
      return;
    }

    const targetIndex = ((index % totalPages) + totalPages) % totalPages;
    const targetLeft = targetIndex * step;

    markProgrammaticScroll();
    scrollContainer.scrollTo({
      left: targetLeft,
      behavior: reduceMotionQuery.matches ? 'auto' : 'smooth',
    });
  };

  const wrapIfNeeded = () => {
    if (isWrapping || !step || !groupWidth) {
      return;
    }

    const leftThreshold = step / 2;
    const rightThreshold = groupWidth * 2 - step / 2;

    if (scrollContainer.scrollLeft <= leftThreshold) {
      isWrapping = true;
      markProgrammaticScroll(100);
      scrollContainer.scrollLeft += groupWidth;
      requestAnimationFrame(() => {
        isWrapping = false;
        scheduleActiveCardUpdate();
      });
      return;
    }

    if (scrollContainer.scrollLeft >= rightThreshold) {
      isWrapping = true;
      markProgrammaticScroll(100);
      scrollContainer.scrollLeft -= groupWidth;
      requestAnimationFrame(() => {
        isWrapping = false;
        scheduleActiveCardUpdate();
      });
    }
  };

  measure();
  scrollContainer.scrollLeft = groupWidth;
  scheduleActiveCardUpdate();

  prevButton.addEventListener('click', () => {
    scrollToIndex(getCurrentIndex() - 1);
  });

  nextButton.addEventListener('click', () => {
    scrollToIndex(getCurrentIndex() + 1);
  });

  scrollContainer.addEventListener(
    'scroll',
    () => {
      if (!isProgrammaticScroll) {
        hasManualScroll = true;
        stopAutoScroll();
      }

      wrapIfNeeded();
      scheduleActiveCardUpdate();
    },
    { passive: true }
  );

  window.addEventListener('resize', () => {
    const currentIndex = getCurrentIndex();

    measure();
    scrollToIndex(currentIndex);
    scheduleActiveCardUpdate();
  });

  startAutoScroll();
});
