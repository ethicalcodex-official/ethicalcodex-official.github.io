/**
 * ETHICAL CODEX - Clean, Minimal Interactive Scripts
 * Pure Vanilla JS, Zero External Libraries
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initFaqAccordion();
  initCopyButtons();
  initChecklist();
  initScrollReveal();
});

/* ==========================================================================
   1. Mobile Menu Toggle
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-toggle');
  const navLinks = document.getElementById('nav-links');
  if (!toggleBtn || !navLinks) return;

  toggleBtn.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const expanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    toggleBtn.setAttribute('aria-expanded', !expanded);
  });

  document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !toggleBtn.contains(e.target) && navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ==========================================================================
   2. FAQ Accordion
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (!questionBtn) return;

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      faqItems.forEach(other => {
        if (other !== item) {
          other.classList.remove('active');
          const otherBtn = other.querySelector('.faq-question');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        }
      });

      item.classList.toggle('active', !isActive);
      questionBtn.setAttribute('aria-expanded', !isActive);
    });
  });
}

/* ==========================================================================
   3. Copy Code Buttons
   ========================================================================== */
function initCopyButtons() {
  const copyButtons = document.querySelectorAll('.code-copy-btn');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
      const block = btn.closest('.code-block');
      if (!block) return;
      const codeElem = block.querySelector('.code-body code') || block.querySelector('.code-body');
      if (!codeElem) return;

      const text = codeElem.innerText;
      try {
        await navigator.clipboard.writeText(text);
        const originalText = btn.innerText;
        btn.innerText = 'Copied! ✓';
        setTimeout(() => {
          btn.innerText = originalText;
        }, 2000);
      } catch (err) {
        console.error('Failed to copy to clipboard', err);
      }
    });
  });
}

/* ==========================================================================
   4. Interactive Checklist (Episode Progress)
   ========================================================================== */
function initChecklist() {
  const checklist = document.getElementById('episode-checklist');
  if (!checklist) return;

  const episodeId = checklist.getAttribute('data-episode') || 'general';
  const storageKey = `ethicalcodex_chk_${episodeId}`;
  const checkboxes = checklist.querySelectorAll('input[type="checkbox"]');
  const countDisplay = document.getElementById('checklist-count');

  let savedState = {};
  try {
    savedState = JSON.parse(localStorage.getItem(storageKey)) || {};
  } catch (e) {
    savedState = {};
  }

  checkboxes.forEach((cb, index) => {
    if (savedState[index]) {
      cb.checked = true;
      cb.closest('.check-item')?.classList.add('done');
    }

    cb.addEventListener('change', () => {
      savedState[index] = cb.checked;
      try {
        localStorage.setItem(storageKey, JSON.stringify(savedState));
      } catch (e) {}

      if (cb.checked) {
        cb.closest('.check-item')?.classList.add('done');
      } else {
        cb.closest('.check-item')?.classList.remove('done');
      }
      updateProgress();
    });
  });

  function updateProgress() {
    const total = checkboxes.length;
    const checked = Array.from(checkboxes).filter(cb => cb.checked).length;
    if (countDisplay) {
      countDisplay.textContent = `${checked}/${total} Done`;
    }
  }

  updateProgress();
}

/* ==========================================================================
   5. Minimal Scroll Reveal (Respects prefers-reduced-motion)
   ========================================================================== */
function initScrollReveal() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  if (prefersReduced) {
    reveals.forEach(el => el.classList.add('active'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -20px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}
