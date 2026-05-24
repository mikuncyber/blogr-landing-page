/**
 * Blogr Landing Page — script.js
 * Features: loading screen, hamburger nav, dropdowns, dark mode, scroll reveals
 */

/* ============================================================
   HELPERS
   ============================================================ */
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];


/* ============================================================
   1. LOADING SCREEN
   ============================================================ */
function initLoader() {
  const loader = $('#loader');
  if (!loader) return;

  const hide = () => {
    loader.classList.add('is-hidden');
    // Remove from DOM after transition ends to clean up
    loader.addEventListener('transitionend', () => loader.remove(), { once: true });
  };

  if (document.readyState === 'complete') {
    // Already loaded (cached page)
    setTimeout(hide, 300);
  } else {
    window.addEventListener('load', () => setTimeout(hide, 400));
  }
}


/* ============================================================
   2. DARK MODE TOGGLE
   ============================================================ */
function initThemeToggle() {
  const btn = $('#themeToggle');
  if (!btn) return;

  const root = document.documentElement;
  const STORAGE_KEY = 'blogr-theme';

  // Determine initial theme: stored > OS preference > light
  function resolveTheme() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'dark' || stored === 'light') return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    btn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
    btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  }

  // Apply on load
  applyTheme(resolveTheme());

  btn.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try { localStorage.setItem(STORAGE_KEY, next); } catch (_) { /* private browsing */ }
  });

  // Respect OS-level changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });
}


/* ============================================================
   3. MOBILE NAV — hamburger + overlay
   ============================================================ */
function initMobileNav() {
  const hamburger  = $('#hamburger');
  const navMenu    = $('#nav-menu');
  const navOverlay = $('#nav-overlay');
  if (!hamburger || !navMenu) return;

  let isOpen = false;

  function openNav() {
    isOpen = true;
    navMenu.classList.add('is-open');
    navMenu.setAttribute('aria-hidden', 'false');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    // Trap focus within panel after open animation
    setTimeout(() => {
      const firstFocusable = navMenu.querySelector('button, a, [tabindex]:not([tabindex="-1"])');
      firstFocusable?.focus();
    }, 300);
  }

  function closeNav() {
    isOpen = false;
    navMenu.classList.remove('is-open');
    navMenu.setAttribute('aria-hidden', 'true');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    hamburger.focus();
    // Also close all dropdowns
    closeAllDropdowns();
  }

  hamburger.addEventListener('click', () => {
    if (isOpen) closeNav(); else openNav();
  });

  // Close on overlay click
  navOverlay?.addEventListener('click', closeNav);

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) closeNav();
  });

  // Close when a nav link is clicked on mobile
  $$('.nav__dropdown-link', navMenu).forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth < 1024) closeNav();
    });
  });

  // Close on auth link click (mobile)
  $$('.nav__login, .btn--cta-red, .btn--cta-white', navMenu).forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth < 1024) closeNav();
    });
  });

  // Re-sync on resize: restore body scroll if nav was open but screen got wide
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.innerWidth >= 1024 && isOpen) {
        closeNav();
      }
    }, 150);
  });
}


/* ============================================================
   4. DROPDOWN MENUS
   ============================================================ */
let activeDropdown = null; // Currently open trigger element

function closeAllDropdowns() {
  $$('.nav__trigger[aria-expanded="true"]').forEach((trigger) => {
    closeDropdown(trigger);
  });
  activeDropdown = null;
}

function openDropdown(trigger) {
  const id = trigger.getAttribute('aria-controls');
  const list = $(`#${id}`);
  if (!list) return;
  trigger.setAttribute('aria-expanded', 'true');
  list.removeAttribute('hidden');
  activeDropdown = trigger;
}

function closeDropdown(trigger) {
  const id = trigger.getAttribute('aria-controls');
  const list = $(`#${id}`);
  if (!list) return;
  trigger.setAttribute('aria-expanded', 'false');
  list.setAttribute('hidden', '');
}

function initDropdowns() {
  const triggers = $$('.nav__trigger');

  triggers.forEach((trigger) => {
    // Click to toggle
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';

      // Close all open dropdowns first
      closeAllDropdowns();

      if (!isExpanded) {
        openDropdown(trigger);
      }
    });

    // Keyboard: open on Enter/Space (already handled by click), arrow keys
    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (trigger.getAttribute('aria-expanded') !== 'true') {
          closeAllDropdowns();
          openDropdown(trigger);
        }
        // Focus first item
        const id = trigger.getAttribute('aria-controls');
        const firstLink = $(`#${id} .nav__dropdown-link`);
        firstLink?.focus();
      }
      if (e.key === 'Escape') {
        closeDropdown(trigger);
        trigger.focus();
      }
    });
  });

  // Arrow key navigation within dropdown
  $$('.nav__dropdown').forEach((dropdown) => {
    dropdown.addEventListener('keydown', (e) => {
      const links = $$('.nav__dropdown-link', dropdown);
      const idx   = links.indexOf(document.activeElement);

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        links[Math.min(idx + 1, links.length - 1)]?.focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (idx === 0) {
          // Move focus back to trigger
          const trigger = $(`[aria-controls="${dropdown.id}"]`);
          closeDropdown(trigger);
          trigger?.focus();
        } else {
          links[Math.max(idx - 1, 0)]?.focus();
        }
      } else if (e.key === 'Escape') {
        const trigger = $(`[aria-controls="${dropdown.id}"]`);
        closeDropdown(trigger);
        trigger?.focus();
      } else if (e.key === 'Tab') {
        // Close on tab out
        const trigger = $(`[aria-controls="${dropdown.id}"]`);
        closeDropdown(trigger);
        activeDropdown = null;
      }
    });
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (activeDropdown && !activeDropdown.closest('.nav__item').contains(e.target)) {
      closeAllDropdowns();
    }
  });

  // On desktop: close on mouse-leave the nav item
  $$('.nav__item').forEach((item) => {
    item.addEventListener('mouseleave', () => {
      if (window.innerWidth >= 1024) {
        const trigger = item.querySelector('.nav__trigger');
        if (trigger && trigger.getAttribute('aria-expanded') === 'true') {
          // Small delay so dropdown doesn't flash away when moving mouse to it
          item._leaveTimer = setTimeout(() => closeDropdown(trigger), 200);
        }
      }
    });
    item.addEventListener('mouseenter', () => {
      clearTimeout(item._leaveTimer);
    });
  });
}


/* ============================================================
   5. SCROLL REVEAL (IntersectionObserver)
   ============================================================ */
function initScrollReveal() {
  const elements = $$('.reveal');
  if (!elements.length) return;

  // Respect reduced-motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    elements.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target); // Animate only once
        }
      });
    },
    {
      threshold: 0.08,
      rootMargin: '0px 0px -32px 0px',
    }
  );

  elements.forEach((el) => observer.observe(el));

  // Immediately reveal elements already in the viewport on first paint
  // (handles hash-navigation and fast-loading pages)
  const revealInViewport = () => {
    elements.forEach((el) => {
      if (el.classList.contains('is-visible')) return;
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight + 64) {
        el.classList.add('is-visible');
        observer.unobserve(el);
      }
    });
  };

  // Run once on load, then again after any hash-scroll settles
  revealInViewport();
  window.addEventListener('load', revealInViewport);
  setTimeout(revealInViewport, 200);
}


/* ============================================================
   6. SMOOTH BUTTON HOVER RIPPLE (optional progressive enhancement)
   ============================================================ */
function initButtonRipple() {
  $$('.btn').forEach((btn) => {
    btn.addEventListener('click', function (e) {
      const rect   = this.getBoundingClientRect();
      const x      = e.clientX - rect.left;
      const y      = e.clientY - rect.top;
      const ripple = document.createElement('span');

      ripple.style.cssText = `
        position:absolute;pointer-events:none;border-radius:50%;
        transform:scale(0);animation:ripple 500ms linear;
        background:rgba(255,255,255,0.35);
        width:64px;height:64px;
        left:${x - 32}px;top:${y - 32}px;
      `;

      if (!['relative', 'absolute', 'fixed'].includes(getComputedStyle(this).position)) {
        this.style.position = 'relative';
      }
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });

  // Inject ripple keyframes
  if (!document.getElementById('ripple-style')) {
    const style = document.createElement('style');
    style.id = 'ripple-style';
    style.textContent = '@keyframes ripple{to{transform:scale(4);opacity:0;}}';
    document.head.appendChild(style);
  }
}


/* ============================================================
   7. ACTIVE NAV HIGHLIGHT on scroll
   ============================================================ */
function initActiveSection() {
  const sections = $$('section[aria-labelledby]');
  if (!sections.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('aria-labelledby');
          $$('.nav__trigger').forEach((t) => t.classList.remove('is-active'));
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach((s) => io.observe(s));
}


/* ============================================================
   8. CONTACT FORM
   ============================================================ */

/** Validators — return an error string or '' if valid */
const validators = {
  name(val) {
    if (!val.trim())              return 'Please enter your name.';
    if (val.trim().length < 2)   return 'Name must be at least 2 characters.';
    return '';
  },
  email(val) {
    if (!val.trim())              return 'Please enter your email address.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim()))
                                  return 'Please enter a valid email address.';
    return '';
  },
  subject(val) {
    if (!val)                     return 'Please choose a topic.';
    return '';
  },
  message(val) {
    if (!val.trim())              return 'Please write a message.';
    if (val.trim().length < 20)  return 'Message must be at least 20 characters.';
    return '';
  },
};

function setFieldState(fieldEl, state, message = '') {
  fieldEl.classList.remove('is-valid', 'is-invalid');
  if (state === 'valid')   fieldEl.classList.add('is-valid');
  if (state === 'invalid') fieldEl.classList.add('is-invalid');

  const errEl = fieldEl.querySelector('.field__error');
  if (errEl) errEl.textContent = message;
}

function validateField(fieldEl) {
  const name   = fieldEl.dataset.field;
  const input  = fieldEl.querySelector('.field__input');
  if (!input || !validators[name]) return true;

  const error = validators[name](input.value);
  if (error) {
    setFieldState(fieldEl, 'invalid', error);
    return false;
  } else {
    setFieldState(fieldEl, 'valid');
    return true;
  }
}

function initContactForm() {
  const form    = $('#contactForm');
  const card    = form?.closest('.contact-card');
  const success = $('#contactSuccess');
  const reset   = $('#contactReset');
  const submitBtn = $('#contactSubmit');
  const textarea  = $('#field-message');
  const counter   = $('#msg-counter');
  if (!form || !success || !submitBtn) return;

  // ── Real-time character counter for textarea ──
  if (textarea && counter) {
    const MAX = Number(textarea.getAttribute('maxlength')) || 500;
    const updateCounter = () => {
      const len = textarea.value.length;
      counter.textContent = `${len} / ${MAX}`;
      counter.classList.toggle('is-near-limit', len >= MAX * 0.85);
    };
    textarea.addEventListener('input', updateCounter);
  }

  // ── Live validation (only after first blur) ──
  $$('.field', form).forEach((fieldEl) => {
    const input = fieldEl.querySelector('.field__input');
    if (!input) return;

    let touched = false;

    input.addEventListener('blur', () => {
      touched = true;
      validateField(fieldEl);
    });

    input.addEventListener('input', () => {
      if (touched) validateField(fieldEl);
    });
  });

  // ── Submit ──
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validate all fields
    let allValid = true;
    $$('.field', form).forEach((fieldEl) => {
      const ok = validateField(fieldEl);
      if (!ok) allValid = false;
    });

    if (!allValid) {
      // Shake the card to signal failure
      card?.classList.remove('is-shaking');
      // Force reflow so animation replays
      void card?.offsetWidth;
      card?.classList.add('is-shaking');
      card?.addEventListener('animationend', () => card.classList.remove('is-shaking'), { once: true });

      // Focus the first invalid field
      const firstInvalid = form.querySelector('.field.is-invalid .field__input');
      firstInvalid?.focus();
      return;
    }

    // ── Simulate async submission ──
    submitBtn.disabled = true;
    submitBtn.classList.add('is-loading');

    // Fake network delay (1.2 – 1.8 s)
    const delay = 1200 + Math.random() * 600;
    setTimeout(() => {
      // Hide form, show success
      form.hidden = true;
      success.hidden = false;

      // Announce to screen readers
      success.setAttribute('tabindex', '-1');
      success.focus();
    }, delay);
  });

  // ── Reset → show form again ──
  reset?.addEventListener('click', () => {
    // Reset form fields and field states
    form.reset();
    $$('.field', form).forEach((fieldEl) => {
      setFieldState(fieldEl, '');
    });
    if (counter) counter.textContent = '0 / 500';

    // Reset submit button
    submitBtn.disabled = false;
    submitBtn.classList.remove('is-loading');

    // Swap views
    success.hidden = true;
    form.hidden    = false;

    // Focus first input for good UX
    form.querySelector('.field__input')?.focus();
  });
}


/* ============================================================
   9. BOOTSTRAP
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initThemeToggle();
  initMobileNav();
  initDropdowns();
  initScrollReveal();
  initButtonRipple();
  initActiveSection();
  initContactForm();
});
