/**
 * ETHICAL CODEX - Core Interactive Scripts
 * Pure Vanilla JS, Zero External Libraries
 */

document.addEventListener('DOMContentLoaded', () => {
  initScrollProgress();
  initMobileMenu();
  initMatrixCanvas();
  initTypewriter();
  initMockTerminal();
  initScrollReveal();
  initStatsCounter();
  initFaqAccordion();
  initCopyButtons();
  initChecklist();
});

/* ==========================================================================
   1. Scroll Progress Bar
   ========================================================================== */
function initScrollProgress() {
  const progressBar = document.getElementById('scroll-progress');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
    progressBar.style.width = scrolled + '%';
  }, { passive: true });
}

/* ==========================================================================
   2. Mobile Menu Toggle
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

  // Close menu when clicking outside or clicking any nav link
  document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !toggleBtn.contains(e.target) && navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ==========================================================================
   3. Matrix Rain Canvas (Optimized & Accessible)
   ========================================================================== */
function initMatrixCanvas() {
  const canvas = document.getElementById('matrix-canvas');
  if (!canvas) return;

  // Check prefers-reduced-motion
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    canvas.style.display = 'none';
    return;
  }

  const ctx = canvas.getContext('2d');
  let animationId = null;
  let isPaused = false;

  const characters = '0101010101ABCDEF<>{}/*+=~#_SEC_ETHICAL';
  const isMobile = window.innerWidth < 768;
  const fontSize = isMobile ? 20 : 16;
  let columns = 0;
  let drops = [];

  function resizeCanvas() {
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
    columns = Math.floor(canvas.width / fontSize);
    drops = [];
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.floor(Math.random() * -50);
    }
  }

  resizeCanvas();
  window.addEventListener('resize', debounce(resizeCanvas, 200));

  let lastTime = 0;
  const fps = isMobile ? 22 : 30;
  const interval = 1000 / fps;

  function drawMatrix(timestamp) {
    if (isPaused) return;

    animationId = requestAnimationFrame(drawMatrix);
    const delta = timestamp - lastTime;
    if (delta < interval) return;
    lastTime = timestamp - (delta % interval);

    // Translucent black overlay for trail effect
    ctx.fillStyle = 'rgba(10, 15, 30, 0.12)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = `${fontSize}px 'JetBrains Mono', monospace`;

    for (let i = 0; i < drops.length; i++) {
      // Lower density: skip drops periodically
      if (isMobile && i % 2 !== 0) continue;

      const char = characters[Math.floor(Math.random() * characters.length)];
      
      // Leading character is brighter
      if (Math.random() > 0.85) {
        ctx.fillStyle = '#00ff88'; // Bright green head
      } else {
        ctx.fillStyle = 'rgba(0, 229, 199, 0.65)'; // Cyber teal
      }

      ctx.fillText(char, i * fontSize, drops[i] * fontSize);

      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }

  animationId = requestAnimationFrame(drawMatrix);

  // Stop canvas when tab is hidden to conserve CPU/Battery
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      isPaused = true;
      if (animationId) cancelAnimationFrame(animationId);
    } else {
      isPaused = false;
      lastTime = performance.now();
      animationId = requestAnimationFrame(drawMatrix);
    }
  });
}

/* ==========================================================================
   4. Typewriter Effect
   ========================================================================== */
function initTypewriter() {
  const elem = document.getElementById('typewriter-text');
  if (!elem) return;

  const phrases = [
    "Hinglish में सीखो Ethical Hacking",
    "Master Networking, Linux & Kali",
    "Zero to Hero: Free & Practical",
    "Defend, Analyze & Break Ethically"
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 90;

  function type() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      elem.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 45;
    } else {
      elem.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 95;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      typingSpeed = 2200; // Pause at end
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingSpeed = 400; // Pause before typing next
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* ==========================================================================
   5. Mock Terminal Window Loop
   ========================================================================== */
function initMockTerminal() {
  const terminalBody = document.getElementById('terminal-content');
  if (!terminalBody) return;

  const commands = [
    {
      cmd: 'whoami',
      output: ['ethical_hacker@ethicalcodex', '[STATUS] Access Level: Root / White Hat']
    },
    {
      cmd: 'ping -c 3 127.0.0.1',
      output: [
        'PING 127.0.0.1 (127.0.0.1) 56(84) bytes of data.',
        '64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=0.042 ms',
        '64 bytes from 127.0.0.1: icmp_seq=2 ttl=64 time=0.038 ms',
        '--- 127.0.0.1 ping statistics ---',
        '2 packets transmitted, 2 received, 0% packet loss'
      ]
    },
    {
      cmd: 'nmap -sV -T4 scanme.ethicalcodex.lan',
      output: [
        'Starting Nmap 7.94 ( https://nmap.org )',
        'PORT     STATE SERVICE VERSION',
        '22/tcp   open  ssh     OpenSSH 9.2p1 Debian',
        '80/tcp   open  http    Apache httpd 2.4.56',
        '443/tcp  open  ssl/https OpenSSL 3.0.8',
        'Nmap done: 1 IP address scanned in 1.48 seconds'
      ]
    },
    {
      cmd: 'cat ~/creed.txt',
      output: [
        '"Knowledge is free. Use it to defend, never to harm."',
        '[RULE] Learn legally in your own local virtual lab.'
      ]
    }
  ];

  let cmdIndex = 0;

  async function runTerminalLoop() {
    while (true) {
      terminalBody.innerHTML = '';
      for (const item of commands) {
        // Create command line
        const line = document.createElement('div');
        line.className = 'term-line';
        line.innerHTML = `<span class="term-prompt">user@codex:~$</span> <span class="term-command"></span><span class="cursor-blink"></span>`;
        terminalBody.appendChild(line);

        const cmdSpan = line.querySelector('.term-command');
        const cursor = line.querySelector('.cursor-blink');

        // Type command
        for (let i = 0; i < item.cmd.length; i++) {
          cmdSpan.textContent += item.cmd[i];
          await wait(50 + Math.random() * 40);
        }

        cursor.remove();
        await wait(300);

        // Print outputs
        for (const out of item.output) {
          const outLine = document.createElement('div');
          outLine.className = 'term-line term-output';
          if (out.includes('[STATUS]') || out.includes('open')) {
            outLine.classList.add('term-success');
          } else if (out.includes('[RULE]')) {
            outLine.classList.add('term-warn');
          }
          outLine.textContent = out;
          terminalBody.appendChild(outLine);
          await wait(80);
          terminalBody.scrollTop = terminalBody.scrollHeight;
        }

        await wait(1800);
      }
      await wait(3000);
    }
  }

  runTerminalLoop();
}

/* ==========================================================================
   6. Scroll Reveal (IntersectionObserver)
   ========================================================================== */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}

/* ==========================================================================
   7. Stats Counter Animation
   ========================================================================== */
function initStatsCounter() {
  const statElements = document.querySelectorAll('.stat-number');
  if (!statElements.length) return;

  let started = false;
  const section = document.querySelector('.stats-section');
  if (!section) return;

  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !started) {
      started = true;
      statElements.forEach(el => {
        const target = parseInt(el.getAttribute('data-target'), 10) || 0;
        const prefix = el.getAttribute('data-prefix') || '';
        const suffix = el.getAttribute('data-suffix') || '';
        animateValue(el, 0, target, 2000, prefix, suffix);
      });
      observer.disconnect();
    }
  }, { threshold: 0.25 });

  observer.observe(section);

  function animateValue(obj, start, end, duration, prefix, suffix) {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeOutQuad = 1 - (1 - progress) * (1 - progress);
      const current = Math.floor(easeOutQuad * (end - start) + start);
      obj.textContent = `${prefix}${current.toLocaleString()}${suffix}`;
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        obj.textContent = `${prefix}${end.toLocaleString()}${suffix}`;
      }
    };
    window.requestAnimationFrame(step);
  }
}

/* ==========================================================================
   8. FAQ Accordion
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (!questionBtn) return;

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close other active items
      faqItems.forEach(other => {
        if (other !== item) {
          other.classList.remove('active');
          const otherBtn = other.querySelector('.faq-question');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current
      item.classList.toggle('active', !isActive);
      questionBtn.setAttribute('aria-expanded', !isActive);
    });
  });
}

/* ==========================================================================
   9. Copy Code Buttons
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
        const original = btn.innerText;
        btn.innerText = 'Copied! ✓';
        btn.style.color = 'var(--accent-green)';
        setTimeout(() => {
          btn.innerText = original;
          btn.style.color = '';
        }, 2000);
      } catch (err) {
        console.error('Failed to copy', err);
      }
    });
  });
}

/* ==========================================================================
   10. Interactive Checklist ("सीखा क्या")
   ========================================================================== */
function initChecklist() {
  const checklist = document.getElementById('episode-checklist');
  if (!checklist) return;

  const episodeId = checklist.getAttribute('data-episode') || 'general';
  const storageKey = `ethicalcodex_chk_${episodeId}`;
  const checkboxes = checklist.querySelectorAll('input[type="checkbox"]');
  const countDisplay = document.getElementById('checklist-count');

  // Load saved state
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
      updateChecklistProgress();
    });
  });

  function updateChecklistProgress() {
    const total = checkboxes.length;
    const checked = Array.from(checkboxes).filter(cb => cb.checked).length;
    if (countDisplay) {
      countDisplay.textContent = `${checked}/${total} Done`;
    }
  }

  updateChecklistProgress();
}

/* Utility Helpers */
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
