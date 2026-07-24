document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.js-reveal-form');
  if (!form) {
    return;
  }

  const submitButton = form.querySelector('button[type="submit"]');

  const createPopup = ({ title, message, tone }) => {
    const isSuccess = tone === 'success';
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const overlay = document.createElement('div');
    overlay.className = [
      'fixed inset-0 z-[9999] flex items-center justify-center px-4',
      'bg-[#132e28]/0 opacity-0',
      reduceMotion ? '' : 'transition-all duration-200 ease-out'
    ].join(' ').trim();

    overlay.innerHTML = `
      <div role="dialog" aria-modal="true" aria-label="Melding"
        class="w-full max-w-md rounded-lg bg-[#f5f3ea] p-6 text-left shadow-[0_20px_60px_rgba(12,30,26,0.4)] opacity-0 translate-y-2 scale-[0.98] ${reduceMotion ? '' : 'transition-all duration-200 ease-out'}">
        <p class="text-sm font-medium ${isSuccess ? 'text-[#2f7b56]' : 'text-[#8a4b2f]'}">${isSuccess ? '' : 'Let op'}</p>
        <h2 class="mt-1 text-3xl leading-tight text-[#2d3d32]">${title}</h2>
        <p class="mt-3 text-sm leading-6 text-[#445548]">${message}</p>
        <button type="button"
          class="mt-5 inline-flex h-11 items-center justify-center rounded-xl border border-[#e0b260] bg-[#f0bd65] px-5 text-sm font-medium text-[#2f3527] transition hover:bg-[#e4ad50] focus:outline-none focus:ring-2 focus:ring-[#d6a14c]">
          Sluiten
        </button>
      </div>
    `;

    const closeButton = overlay.querySelector('button');
    const dialog = overlay.querySelector('[role="dialog"]');

    const close = () => {
      if (reduceMotion) {
        overlay.remove();
        return;
      }

      overlay.classList.remove('bg-[#132e28]/65', 'opacity-100');
      overlay.classList.add('bg-[#132e28]/0', 'opacity-0');
      dialog.classList.remove('opacity-100', 'translate-y-0', 'scale-100');
      dialog.classList.add('opacity-0', 'translate-y-2', 'scale-[0.98]');

      window.setTimeout(() => {
        overlay.remove();
      }, 220);
    };

    closeButton.addEventListener('click', close);
    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) {
        close();
      }
    });

    document.body.appendChild(overlay);

    window.requestAnimationFrame(() => {
      overlay.classList.remove('bg-[#132e28]/0', 'opacity-0');
      overlay.classList.add('bg-[#132e28]/65', 'opacity-100');
      dialog.classList.remove('opacity-0', 'translate-y-2', 'scale-[0.98]');
      dialog.classList.add('opacity-100', 'translate-y-0', 'scale-100');
    });

    closeButton.focus();
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!submitButton) {
      return;
    }

    submitButton.disabled = true;
    submitButton.classList.add('opacity-70', 'cursor-not-allowed');

    try {
      const formData = new FormData(form);
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (response.ok && result.success) {
        form.reset();
        createPopup({
          title: 'Bedankt voor je aanmelding!',
          message: 'Je aanmelding is succesvol ontvangen. <br><br>Benoem je aanmelding samen met je e-mail adres bij je eerste montage en wij zorgen voor extra korting!',
          tone: 'success'
        });
        return;
      }

      createPopup({
        title: 'Verzenden is niet gelukt',
        message: 'Probeer het opnieuw. Blijft het misgaan, stuur ons later nog een keer je e-mailadres.',
        tone: 'error'
      });
    } catch (error) {
      createPopup({
        title: 'Verbinding mislukt',
        message: 'Er ging iets mis met verzenden. Controleer je verbinding en probeer opnieuw.',
        tone: 'error'
      });
    } finally {
      submitButton.disabled = false;
      submitButton.classList.remove('opacity-70', 'cursor-not-allowed');
    }
  });
});
