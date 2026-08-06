document.addEventListener('DOMContentLoaded', () => {
  const toggleButton = document.querySelector('[data-header-menu-toggle]');
  const menu = document.querySelector('[data-header-menu]');
  if (toggleButton && menu) {
    let closeTimeout;

    const setMenuHeight = (isOpen) => {
      menu.style.maxHeight = isOpen ? `${menu.scrollHeight}px` : '0px';
    };

    const setMenuItemsState = (isOpen) => {
      const items = Array.from(menu.querySelectorAll('[data-header-menu-item]'));

      items.forEach((item, index) => {
        const delay = isOpen ? `${index * 70}ms` : `${(items.length - index - 1) * 45}ms`;
        const duration = isOpen ? '260ms' : '180ms';
        const opacity = isOpen ? '1' : '0';
        const transform = isOpen ? 'translateY(0)' : 'translateY(-8px)';

        item.style.transitionDelay = delay;
        item.style.transitionDuration = duration;
        item.style.opacity = opacity;
        item.style.transform = transform;
      });
    };

    const closeMobileMenu = () => {
      clearTimeout(closeTimeout);
      setMenuItemsState(false);

      setMenuHeight(false);
      menu.classList.remove('opacity-100', 'translate-y-0', 'pointer-events-auto');
      menu.classList.add('max-h-0', 'opacity-0', '-translate-y-2', 'pointer-events-none');

      closeTimeout = window.setTimeout(() => {
        menu.classList.add('hidden');
      }, 220);

      toggleButton.setAttribute('aria-expanded', 'false');
      toggleButton.classList.remove('text-white');
      toggleButton.classList.add('text-white/70');
    };

    const openMobileMenu = () => {
      clearTimeout(closeTimeout);
      menu.classList.remove('hidden');

      requestAnimationFrame(() => {
        menu.classList.remove('max-h-0', 'opacity-0', '-translate-y-2', 'pointer-events-none');
        menu.classList.add('opacity-100', 'translate-y-0', 'pointer-events-auto');
        setMenuHeight(true);
        setMenuItemsState(true);
      });

      toggleButton.setAttribute('aria-expanded', 'true');
      toggleButton.classList.remove('text-white/70');
      toggleButton.classList.add('text-white');
    };

    toggleButton.addEventListener('click', () => {
      const isOpen = toggleButton.getAttribute('aria-expanded') === 'true';

      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    menu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMobileMenu);
    });

    document.addEventListener('click', (event) => {
      const clickedInside = toggleButton.contains(event.target) || menu.contains(event.target);

      if (!clickedInside) {
        closeMobileMenu();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeMobileMenu();
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth >= 768) {
        closeMobileMenu();
      } else if (toggleButton.getAttribute('aria-expanded') === 'true') {
        setMenuHeight(true);
      }
    });
  }

  const desktopServicesMenus = document.querySelectorAll('[data-desktop-services-menu]');

  desktopServicesMenus.forEach((desktopMenu) => {
    const toggle = desktopMenu.querySelector('[data-desktop-services-toggle]');
    const panel = desktopMenu.querySelector('[data-desktop-services-panel]');
    const icon = desktopMenu.querySelector('[data-desktop-services-icon]');

    if (!toggle || !panel || !icon) {
      return;
    }

    const openDesktopMenu = () => {
      panel.classList.remove('invisible', 'pointer-events-none', 'opacity-0', 'translate-y-2');
      panel.classList.add('visible', 'pointer-events-auto', 'opacity-100', 'translate-y-0');
      toggle.classList.remove('text-white/40');
      toggle.classList.add('text-white', 'bg-white/10');
      toggle.setAttribute('aria-expanded', 'true');
      icon.classList.add('rotate-180');
    };

    const closeDesktopMenu = () => {
      panel.classList.add('invisible', 'pointer-events-none', 'opacity-0', 'translate-y-2');
      panel.classList.remove('visible', 'pointer-events-auto', 'opacity-100', 'translate-y-0');
      toggle.classList.remove('text-white', 'bg-white/10');
      toggle.classList.add('text-white/40');
      toggle.setAttribute('aria-expanded', 'false');
      icon.classList.remove('rotate-180');
    };

    toggle.addEventListener('click', (event) => {
      event.preventDefault();
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';

      if (isOpen) {
        closeDesktopMenu();
      } else {
        openDesktopMenu();
      }
    });

    desktopMenu.addEventListener('mouseenter', openDesktopMenu);
    desktopMenu.addEventListener('mouseleave', closeDesktopMenu);

    document.addEventListener('click', (event) => {
      if (!desktopMenu.contains(event.target)) {
        closeDesktopMenu();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeDesktopMenu();
      }
    });
  });
});
