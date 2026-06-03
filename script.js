(() => {
  /* -------- modal open/close (works for any modal) -------- */
  let lastFocus = null;
  let activeModal = null;

  function openModal(modal) {
    if (!modal) return;
    lastFocus = document.activeElement;
    activeModal = modal;
    modal.setAttribute('aria-hidden', 'false');
    const firstInput = modal.querySelector('input:not([type="hidden"]):not([type="checkbox"]), select, textarea');
    if (firstInput) setTimeout(() => firstInput.focus(), 50);
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
    if (activeModal === modal) activeModal = null;
  }

  document.querySelectorAll('[data-open-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-open-modal');
      openModal(document.getElementById(id));
    });
  });

  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal');
      closeModal(modal);
    });
  });

  /* Esc closes; Tab/Shift-Tab cycle focus within the modal (focus trap). */
  const FOCUSABLE_SELECTOR = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled]):not([type="hidden"])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(',');

  document.addEventListener('keydown', (e) => {
    if (!activeModal) return;

    if (e.key === 'Escape') {
      closeModal(activeModal);
      return;
    }

    if (e.key === 'Tab') {
      const focusable = activeModal.querySelectorAll(FOCUSABLE_SELECTOR);
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  /* -------- Web3Forms submit (works for any form) -------- */
  function wireForm(formId, statusId, successMsg) {
    const form = document.getElementById(formId);
    const status = document.getElementById(statusId);
    if (!form || !status) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      status.className = 'form__status';
      status.textContent = 'Sending...';

      const data = new FormData(form);
      const accessKey = data.get('access_key');
      if (!accessKey || accessKey === 'YOUR_WEB3FORMS_ACCESS_KEY') {
        status.className = 'form__status is-error';
        status.textContent = 'Form not configured yet — add your Web3Forms access key in index.html.';
        return;
      }

      try {
        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: data,
        });
        const json = await res.json();
        if (json.success) {
          status.className = 'form__status is-success';
          status.textContent = successMsg;
          form.reset();
          setTimeout(() => closeModal(form.closest('.modal')), 1800);
        } else {
          status.className = 'form__status is-error';
          status.textContent = json.message || 'Something went wrong. Try again?';
        }
      } catch (err) {
        status.className = 'form__status is-error';
        status.textContent = "Couldn't reach the kitchen. Check your connection and try again.";
      }
    });
  }

  wireForm('notifyForm', 'formStatus', "You're on the list. Mimosas pending.");
  wireForm('restaurantForm', 'restaurantStatus', "Got it. Our team will be in touch with the details soon.");

  /* -------- footer year -------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
