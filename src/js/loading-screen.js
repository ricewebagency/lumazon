document.addEventListener('DOMContentLoaded', () => {
  const loadingScreen = document.getElementById('loadingScreen');
  const loadingLogo = document.getElementById('loadingScreenLogo');
  const loadingImageA = document.getElementById('loadingScreenImageA');
  const loadingImageB = document.getElementById('loadingScreenImageB');
  
  if (!loadingScreen || !loadingLogo || !loadingImageA || !loadingImageB) return;

  const loadingFrames = [
    './assets/images/logos/lumazon-icon-wit-geel-loading-1.png',
    './assets/images/logos/lumazon-icon-wit-geel-loading-2.png',
    './assets/images/logos/lumazon-icon-wit-geel-loading-3.png',
    './assets/images/logos/lumazon-icon-wit-geel-loading-4.png',
    './assets/images/logos/lumazon-icon-wit-geel-loading-5.png',
    './assets/images/logos/lumazon-icon-wit-geel-loading-6.png',
  ];

  loadingFrames.forEach((source) => {
    const image = new Image();
    image.src = source;
  });

  const frameDelay = 75;
  const finalFadeDelay = 120;
  const removeDelay = 500;

  const delay = (duration) => new Promise((resolve) => {
    window.setTimeout(resolve, duration);
  });

  const setOpacity = (element, isVisible) => {
    element.classList.toggle('opacity-100', isVisible);
    element.classList.toggle('opacity-0', !isVisible);
  };

  const createFrameLayer = (source) => {
    const layer = document.createElement('img');
    layer.src = source;
    layer.alt = 'Lumazon';
    layer.decoding = 'async';
    layer.className = 'absolute inset-0 h-full w-full object-contain opacity-0 transition-opacity duration-220 ease-out';
    loadingLogo.appendChild(layer);
    return layer;
  };

  const fadeOutLogo = () => {
    loadingLogo.classList.remove('opacity-100', 'scale-100');
    loadingLogo.classList.add('opacity-0', 'scale-95');
  };

  const startSequence = async () => {
    loadingImageA.remove();
    loadingImageB.remove();

    const frameLayers = loadingFrames.map((source) => createFrameLayer(source));

    for (let index = 0; index < frameLayers.length; index += 1) {
      if (index > 0) {
        await delay(frameDelay);
      }

      const currentLayer = frameLayers[index];

      window.requestAnimationFrame(() => {
        setOpacity(currentLayer, true);
      });

      // Wait for this frame to begin blending before adding the next layer.
      await delay(frameDelay);
    }

    await delay(finalFadeDelay);

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        fadeOutLogo();
      });
    });

    window.setTimeout(() => {
      loadingScreen.remove();
    }, removeDelay);
  };

  const timer = window.setTimeout(() => {
    startSequence();
  }, 0);

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    window.clearTimeout(timer);
  });
});
