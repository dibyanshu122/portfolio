/* ============================================================
   DIBYANSHU PORTFOLIO — MASTER SCRIPT v3.0
   3D Galaxy · Custom Cursor · Scroll Reveals · Magnetic Hover
   Typewriter · AI Terminal · VanillaTilt
   ============================================================ */

'use strict';

/* ─── UTILS ──────────────────────────────────────────────────── */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

/* ─── 1. CUSTOM CURSOR ───────────────────────────────────────── */
(function initCursor() {
  const dot  = $('#cursorDot');
  const ring = $('#cursorRing');
  if (!dot || !ring) return;

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;
  let rafId;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  // Smooth ring lag
  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    rafId = requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover grow effect on interactive elements
  const hoverTargets = 'a, button, .card, .float-btn, input, .btn--primary, .btn--ghost';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverTargets)) {
      dot.classList.add('hovering');
      ring.classList.add('hovering');
    }
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverTargets)) {
      dot.classList.remove('hovering');
      ring.classList.remove('hovering');
    }
  });
})();

/* ─── 2. SCROLL PROGRESS BAR ──────────────────────────────────── */
(function initScrollProgress() {
  const bar = $('#scrollBar');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const total    = document.body.scrollHeight - window.innerHeight;
    bar.style.width = Math.min((scrolled / total) * 100, 100) + '%';
  }, { passive: true });
})();

/* ─── 3. STICKY NAV — ACTIVE LINK HIGHLIGHTING ───────────────── */
(function initNav() {
  const navbar = $('#navbar');
  if (!navbar) return;

  // Scrolled class for deeper blur
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  // Active nav link on scroll
  const sections = $$('section[id], main > section[id]');
  const navLinks = $$('.nav__links a');

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach((s) => io.observe(s));
})();

/* ─── 4. SCROLL REVEAL ANIMATIONS ────────────────────────────── */
(function initReveal() {
  const revealEls = $$('.reveal, .reveal-left, .reveal-right');
  if (!revealEls.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Respect transition-delay set inline
        entry.target.classList.add('revealed');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach((el) => io.observe(el));
})();

/* ─── 5. TYPEWRITER EFFECT ───────────────────────────────────── */
(function initTypewriter() {
  const el = $('#typewriter');
  if (!el) return;

  const phrases = [
    'Developer',
    'SaaS Founder',
    'AI Architect',
    'Agent Builder',
    'System Designer',
  ];

  let phraseIndex = 0;
  let charIndex   = 0;
  let isDeleting  = false;
  let delay       = 120;

  function type() {
    const current = phrases[phraseIndex];
    if (isDeleting) {
      el.textContent = current.slice(0, --charIndex);
      delay = 60;
    } else {
      el.textContent = current.slice(0, ++charIndex);
      delay = 120;
    }

    if (!isDeleting && charIndex === current.length) {
      delay = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delay = 400;
    }

    setTimeout(type, delay);
  }
  type();
})();

/* ─── 6. MAGNETIC HOVER — BUTTONS ────────────────────────────── */
(function initMagnetic() {
  const magnetics = $$('.btn--primary, .btn--ghost, .float-btn, .nav__cta');

  magnetics.forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const rect   = el.getBoundingClientRect();
      const centerX = rect.left + rect.width  / 2;
      const centerY = rect.top  + rect.height / 2;
      const dx = (e.clientX - centerX) * 0.25;
      const dy = (e.clientY - centerY) * 0.25;
      el.style.transform = `translate(${dx}px, ${dy}px)`;
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
      el.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
      setTimeout(() => { el.style.transition = ''; }, 400);
    });
  });
})();

/* ─── 7. VANILLA TILT ON CARDS ────────────────────────────────── */
(function initTilt() {
  if (typeof VanillaTilt === 'undefined') return;
  VanillaTilt.init($$('.js-tilt'), {
    max:       12,
    speed:     400,
    glare:     true,
    'max-glare': 0.12,
    scale:     1.02,
  });
})();

/* ─── 8. IMMERSIVE 3D GALAXY BACKGROUND (Three.js) ─────────────── */
(function initGalaxy() {
  if (typeof THREE === 'undefined') return;

  const canvas = $('#bgCanvas');
  if (!canvas) return;

  const scene    = new THREE.Scene();
  const camera   = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  camera.position.z = 8;

  /* ── Star layer factory ── */
  function createStarLayer(count, spread, size, color) {
    const geometry  = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      positions[i] = (Math.random() - 0.5) * spread;
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({
      color,
      size,
      transparent: true,
      opacity: 0.75,
      sizeAttenuation: true,
    });
    return new THREE.Points(geometry, material);
  }

  /* ── Nebula cloud (soft sphere clusters) ── */
  function createNebula() {
    const group    = new THREE.Group();
    const colors   = [0x00d4ff, 0x7c3aed, 0x0062ff];
    colors.forEach((col, i) => {
      const geo = new THREE.BufferGeometry();
      const pos = new Float32Array(300 * 3);
      for (let j = 0; j < 300 * 3; j++) pos[j] = (Math.random() - 0.5) * 18;
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      const mat = new THREE.PointsMaterial({ color: col, size: 0.06, transparent: true, opacity: 0.25 });
      const pts = new THREE.Points(geo, mat);
      pts.position.set((i - 1) * 6, (Math.random() - 0.5) * 4, -10);
      group.add(pts);
    });
    return group;
  }

  const farLayer  = createStarLayer(5000, 100, 0.04, 0x8ecfff);
  const midLayer  = createStarLayer(3500,  70, 0.07, 0x00d4ff);
  const nearLayer = createStarLayer(2000,  45, 0.11, 0xffffff);
  const nebula    = createNebula();

  scene.add(farLayer, midLayer, nearLayer, nebula);

  /* ── Mouse parallax ── */
  let targetCamX = 0, targetCamY = 0;
  document.addEventListener('mousemove', (e) => {
    targetCamX = (e.clientX / window.innerWidth  - 0.5) * 1.8;
    targetCamY = -(e.clientY / window.innerHeight - 0.5) * 1.8;
  }, { passive: true });

  /* ── Scroll depth ── */
  let scrollY = 0;
  window.addEventListener('scroll', () => { scrollY = window.scrollY; }, { passive: true });

  /* ── Animation loop ── */
  let time = 0;
  function animate() {
    requestAnimationFrame(animate);
    time += 0.001;

    // Smooth camera follow mouse
    camera.position.x += (targetCamX - camera.position.x) * 0.04;
    camera.position.y += (targetCamY - camera.position.y) * 0.04;
    camera.position.z  = 8 - scrollY * 0.0008;

    // Rotate layers at different speeds
    farLayer.rotation.y  += 0.00025;
    farLayer.rotation.x  += 0.00008;
    midLayer.rotation.y  += 0.0005;
    midLayer.rotation.x  += 0.00015;
    nearLayer.rotation.y += 0.0009;
    nebula.rotation.y    += 0.0002;
    nebula.rotation.x     = Math.sin(time) * 0.05;

    renderer.render(scene, camera);
  }
  animate();

  /* ── Resize ── */
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }, { passive: true });
})();

/* ─── 9. HERO STATS COUNTER ANIMATION ────────────────────────── */
(function initCounters() {
  const statEls = $$('.hero__stat [style*="font-size:2rem"]');

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el  = entry.target;
      const raw = el.textContent.replace(/\D/g, '');
      const suffix = el.textContent.replace(/[\d]/g, '');
      if (!raw) return;
      const target = parseInt(raw, 10);
      let current  = 0;
      const step   = Math.ceil(target / 50);
      const timer  = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = current + suffix;
        if (current >= target) clearInterval(timer);
      }, 30);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });

  statEls.forEach((el) => io.observe(el));
})();

/* ─── 10. AI TERMINAL — GEMINI CHAT ──────────────────────────── */
(function initAITerminal() {
  const responseContainer = $('#ai-response');
  const statusEl          = $('#ai-status');
  const inputEl           = $('#user-input');
  const sendBtn           = $('#send-btn');
  if (!responseContainer || !inputEl || !sendBtn) return;

  function appendLine(text, color = '#22c55e', prefix = '> ') {
    const div = document.createElement('div');
    div.style.color = color;
    div.style.marginTop = '6px';
    div.textContent = prefix + text;
    responseContainer.appendChild(div);
    responseContainer.scrollTop = responseContainer.scrollHeight;
    return div;
  }

  function typeText(div, text, onDone) {
    let i = 0;
    div.textContent = '> ';
    function tick() {
      if (i < text.length) {
        div.textContent += text[i++];
        responseContainer.scrollTop = responseContainer.scrollHeight;
        setTimeout(tick, 18);
      } else if (onDone) {
        onDone();
      }
    }
    tick();
  }

  async function callGemini(userInput) {
    // Show user message
    appendLine(userInput, '#ffffff', '> You: ');

    // Status: thinking
    statusEl.textContent = 'THINKING...';
    statusEl.style.color = '#fbbf24';

    const thinkingDiv = appendLine('Processing through Neural Core...', '#00d4ff');

    try {
      const API_KEY = (typeof CONFIG !== 'undefined' && CONFIG.API_KEY) ? CONFIG.API_KEY : '';
      if (!API_KEY) throw new Error('API key not configured');

      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

      const systemPrompt = `You are Dibyanshu's AI assistant embedded in his portfolio website. 
You represent Dibyanshu — a Full Stack & AI Developer and Founder of B9 Automation (India's first WhatsApp AI Agency Platform).
Key facts: 2+ years experience, expert in FastAPI, Next.js, LangChain, LangGraph, RAG pipelines, agentic AI systems.
Serving 100+ businesses, built 86+ API endpoints, 95%+ retention rate. Based in New Delhi, India.
Answer concisely and professionally. Keep responses under 150 words. Always be helpful and enthusiastic about tech.`;

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: systemPrompt + '\n\nUser asks: ' + userInput }]
          }],
          generationConfig: { maxOutputTokens: 300, temperature: 0.7 }
        }),
      });

      const data = await response.json();
      thinkingDiv.remove();

      if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
        const aiText = data.candidates[0].content.parts[0].text;
        const answerDiv = document.createElement('div');
        answerDiv.style.color = '#22c55e';
        answerDiv.style.marginTop = '8px';
        answerDiv.style.lineHeight = '1.6';
        responseContainer.appendChild(answerDiv);
        typeText(answerDiv, aiText, () => {
          statusEl.textContent = 'ONLINE';
          statusEl.style.color = '#22c55e';
        });
      } else {
        throw new Error(data.error?.message || 'No response from AI');
      }

    } catch (err) {
      if (thinkingDiv.parentNode) thinkingDiv.remove();
      appendLine(`SYSTEM ERROR: ${err.message}`, '#ff4444');
      statusEl.textContent = 'OFFLINE';
      statusEl.style.color = '#ff4444';
      setTimeout(() => {
        statusEl.textContent = 'ONLINE';
        statusEl.style.color = '#22c55e';
      }, 3000);
    }
  }

  function handleSend() {
    const val = inputEl.value.trim();
    if (!val) return;
    inputEl.value = '';
    callGemini(val);
  }

  sendBtn.addEventListener('click', handleSend);
  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleSend();
  });
})();

/* ─── 11. SMOOTH SECTION ENTER — STAGGER CARDS ───────────────── */
(function initCardStagger() {
  $$('.grid').forEach((grid) => {
    const cards = grid.querySelectorAll('.card');
    cards.forEach((card, i) => {
      if (!card.style.transitionDelay) {
        card.style.transitionDelay = `${i * 0.08}s`;
      }
    });
  });
})();

/* ─── 12. FOOTER YEAR AUTO-UPDATE ─────────────────────────────── */
(function initFooterYear() {
  const el = $('footer .footer__text');
  if (el) {
    el.innerHTML = el.innerHTML.replace('2026', new Date().getFullYear());
  }
})();
