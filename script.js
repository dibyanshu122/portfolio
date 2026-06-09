/* ============================================================
   DIBYANSHU PORTFOLIO — ULTRA PREMIUM MASTER SCRIPT v4.0
   Epic Preloader · 3D Torus Galaxy · Hero 3D Object
   Magnetic · Scramble Text · Click Particles · AI Terminal
   ============================================================ */
'use strict';

const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

/* ═══════════════════════════════════════════════════
   1. EPIC PRELOADER
═══════════════════════════════════════════════════ */
(function initPreloader() {
  const preloader = $('#preloader');
  const bar       = $('#preloaderBar');
  const percent   = $('#preloaderPercent');
  const canvas    = $('#preloaderCanvas');
  if (!preloader) return;

  // Tiny star-burst on preloader canvas
  const ctx  = canvas.getContext('2d');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  const stars = Array.from({ length: 200 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.5,
    o: Math.random(),
    s: (Math.random() - 0.5) * 0.3,
  }));

  let rafPre;
  function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(s => {
      s.o += s.s * 0.05;
      if (s.o > 1 || s.o < 0) s.s *= -1;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,212,255,${Math.abs(s.o)})`;
      ctx.fill();
    });
    rafPre = requestAnimationFrame(drawStars);
  }
  drawStars();

  // Animate progress to 100%
  let p = 0;
  const interval = setInterval(() => {
    p += Math.random() * 4 + 1;
    if (p >= 100) p = 100;
    bar.style.width = p + '%';
    percent.textContent = Math.floor(p) + '%';
    if (p >= 100) {
      clearInterval(interval);
      cancelAnimationFrame(rafPre);
      setTimeout(() => {
        preloader.classList.add('exit');
        preloader.addEventListener('animationend', () => {
          preloader.remove();
          document.body.style.overflow = '';
          // Trigger counters after preloader
          startCounters();
        }, { once: true });
      }, 500);
    }
  }, 40);

  document.body.style.overflow = 'hidden';
})();

/* ═══════════════════════════════════════════════════
   2. CUSTOM CURSOR
═══════════════════════════════════════════════════ */
(function initCursor() {
  const dot  = $('#cursorDot');
  const ring = $('#cursorRing');
  if (!dot || !ring) return;

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  }, { passive: true });

  (function lagRing() {
    rx += (mx - rx) * 0.11;
    ry += (my - ry) * 0.11;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(lagRing);
  })();

  const hoverSel = 'a,button,.card,.float-btn,input,.btn--primary,.btn--ghost,.marquee-item';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverSel)) {
      dot.classList.add('hovering');
      ring.classList.add('hovering');
    }
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(hoverSel)) {
      dot.classList.remove('hovering');
      ring.classList.remove('hovering');
    }
  });
})();

/* ═══════════════════════════════════════════════════
   3. CLICK PARTICLE BURST
═══════════════════════════════════════════════════ */
(function initParticles() {
  const container = $('#particles');
  if (!container) return;

  const colors = ['#00d4ff', '#7c3aed', '#f472b6', '#ffffff', '#00f2ff'];

  document.addEventListener('click', e => {
    const count = 12;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const angle  = (i / count) * Math.PI * 2;
      const dist   = 40 + Math.random() * 60;
      const size   = 4 + Math.random() * 5;
      const color  = colors[Math.floor(Math.random() * colors.length)];
      p.style.cssText = `
        left:${e.clientX}px; top:${e.clientY}px;
        width:${size}px; height:${size}px;
        background:${color};
        box-shadow:0 0 8px ${color};
        --tx:${Math.cos(angle) * dist}px;
        --ty:${Math.sin(angle) * dist}px;
      `;
      container.appendChild(p);
      setTimeout(() => p.remove(), 850);
    }
  });
})();

/* ═══════════════════════════════════════════════════
   4. SCROLL PROGRESS BAR
═══════════════════════════════════════════════════ */
(function initScrollBar() {
  const bar = $('#scrollBar');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    bar.style.width = Math.min(pct * 100, 100) + '%';
  }, { passive: true });
})();

/* ═══════════════════════════════════════════════════
   5. STICKY NAV + ACTIVE LINKS
═══════════════════════════════════════════════════ */
(function initNav() {
  const nav   = $('#navbar');
  const links = $$('.nav__links a');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  const sections = $$('section[id]');
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${e.target.id}`));
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach(s => io.observe(s));
})();

/* ═══════════════════════════════════════════════════
   6. SCROLL REVEAL
═══════════════════════════════════════════════════ */
(function initReveal() {
  const els = $$('.reveal');
  const io  = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  els.forEach(el => io.observe(el));
})();

/* ═══════════════════════════════════════════════════
   7. TEXT SCRAMBLE (section titles)
═══════════════════════════════════════════════════ */
(function initScramble() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&';

  function scramble(el) {
    const original = el.dataset.text || el.textContent;
    let iteration  = 0;
    clearInterval(el._scrambleTimer);
    el._scrambleTimer = setInterval(() => {
      el.textContent = original.split('').map((ch, i) => {
        if (ch === ' ') return ' ';
        if (i < iteration) return original[i];
        return chars[Math.floor(Math.random() * chars.length)];
      }).join('');
      if (iteration >= original.length) {
        clearInterval(el._scrambleTimer);
        el.textContent = original;
      }
      iteration += .5;
    }, 30);
  }

  const titles = $$('.scramble');
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        setTimeout(() => scramble(e.target), 100);
      }
    });
  }, { threshold: 0.5 });
  titles.forEach(el => io.observe(el));
})();

/* ═══════════════════════════════════════════════════
   8. TYPEWRITER
═══════════════════════════════════════════════════ */
(function initTypewriter() {
  const el = $('#typewriter');
  if (!el) return;

  const phrases = ['Developer', 'SaaS Founder', 'AI Architect', 'Agent Builder', 'System Designer'];
  let pi = 0, ci = 0, del = false;

  (function tick() {
    const cur = phrases[pi];
    el.textContent = del ? cur.slice(0, --ci) : cur.slice(0, ++ci);
    const speed = del ? 55 : 115;

    if (!del && ci === cur.length) {
      setTimeout(() => { del = true; tick(); }, 2200);
    } else if (del && ci === 0) {
      del = false;
      pi  = (pi + 1) % phrases.length;
      setTimeout(tick, 350);
    } else {
      setTimeout(tick, speed);
    }
  })();
})();

/* ═══════════════════════════════════════════════════
   9. HERO STATS COUNTER
═══════════════════════════════════════════════════ */
function startCounters() {
  $$('.hero__stat-num').forEach(el => {
    const target  = parseInt(el.dataset.target, 10);
    const step    = Math.ceil(target / 60);
    let current   = 0;
    const timer   = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current;
      if (current >= target) clearInterval(timer);
    }, 25);
  });
}

/* ═══════════════════════════════════════════════════
   10. MAGNETIC HOVER
═══════════════════════════════════════════════════ */
(function initMagnetic() {
  $$('.magnetic, .btn--primary, .btn--ghost, .nav__cta, .float-btn').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r  = el.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width  / 2) * 0.28;
      const dy = (e.clientY - r.top  - r.height / 2) * 0.28;
      el.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
      el.style.transition = 'transform 0.45s cubic-bezier(0.16,1,0.3,1)';
      setTimeout(() => el.style.transition = '', 450);
    });
  });
})();

/* ═══════════════════════════════════════════════════
   11. VANILLA TILT
═══════════════════════════════════════════════════ */
(function initTilt() {
  if (typeof VanillaTilt === 'undefined') return;
  VanillaTilt.init($$('.js-tilt'), {
    max: 12, speed: 400,
    glare: true, 'max-glare': 0.12, scale: 1.02,
  });
})();

/* ═══════════════════════════════════════════════════
   12. THREE.JS — 3D GALAXY BACKGROUND
═══════════════════════════════════════════════════ */
(function initGalaxy() {
  if (typeof THREE === 'undefined') return;
  const canvas   = $('#bgCanvas');
  if (!canvas) return;

  const scene    = new THREE.Scene();
  const camera   = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  camera.position.z = 8;

  // Stars
  function starLayer(n, spread, sz, col) {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n * 3; i++) pos[i] = (Math.random() - .5) * spread;
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return new THREE.Points(geo, new THREE.PointsMaterial({ color: col, size: sz, transparent: true, opacity: .7, sizeAttenuation: true }));
  }

  const far  = starLayer(5000, 110, .04, 0x8ecfff);
  const mid  = starLayer(3500,  75, .07, 0x00d4ff);
  const near = starLayer(2000,  50, .11, 0xffffff);

  // Nebula clouds
  const nebula = new THREE.Group();
  [[0x00d4ff, 6, 0], [0x7c3aed, -5, 2], [0xf472b6, 3, -3]].forEach(([col, x, y]) => {
    const g = new THREE.BufferGeometry();
    const p = new Float32Array(400 * 3);
    for (let i = 0; i < 400 * 3; i++) p[i] = (Math.random() - .5) * 20;
    g.setAttribute('position', new THREE.BufferAttribute(p, 3));
    const pts = new THREE.Points(g, new THREE.PointsMaterial({ color: col, size: .055, transparent: true, opacity: .18 }));
    pts.position.set(x, y, -12);
    nebula.add(pts);
  });

  scene.add(far, mid, near, nebula);

  let tX = 0, tY = 0, scrollY = 0;
  document.addEventListener('mousemove', e => {
    tX = (e.clientX / innerWidth  - .5) * 2;
    tY = -(e.clientY / innerHeight - .5) * 2;
  }, { passive: true });
  window.addEventListener('scroll', () => { scrollY = pageYOffset; }, { passive: true });

  let t = 0;
  (function animate() {
    requestAnimationFrame(animate);
    t += .001;
    camera.position.x += (tX - camera.position.x) * .04;
    camera.position.y += (tY - camera.position.y) * .04;
    camera.position.z  = 8 - scrollY * .0007;

    far.rotation.y  += .00022;
    far.rotation.x  += .00007;
    mid.rotation.y  += .00045;
    mid.rotation.x  += .00012;
    near.rotation.y += .0008;
    nebula.rotation.y += .00018;
    nebula.rotation.x  = Math.sin(t) * .04;

    renderer.render(scene, camera);
  })();

  window.addEventListener('resize', () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  }, { passive: true });
})();

/* ═══════════════════════════════════════════════════
   13. THREE.JS — HERO 3D FLOATING OBJECT (Torus Knot)
═══════════════════════════════════════════════════ */
(function initHero3D() {
  if (typeof THREE === 'undefined') return;
  const canvas = $('#heroCanvas');
  if (!canvas) return;

  const W = canvas.clientWidth  || 400;
  const H = canvas.clientHeight || 400;

  const scene    = new THREE.Scene();
  const camera   = new THREE.PerspectiveCamera(50, W / H, 0.1, 100);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(W, H);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  camera.position.set(0, 0, 4.5);

  // Torus Knot
  const geom = new THREE.TorusKnotGeometry(1, .32, 160, 20, 2, 3);

  // Wireframe + solid layers
  const solidMat = new THREE.MeshPhongMaterial({
    color:     0x00d4ff,
    emissive:  0x001a2e,
    specular:  0x7c3aed,
    shininess: 120,
    transparent: true,
    opacity: .12,
  });
  const wireMat  = new THREE.MeshBasicMaterial({
    color:       0x00d4ff,
    wireframe:   true,
    transparent: true,
    opacity:     .55,
  });

  const solid = new THREE.Mesh(geom, solidMat);
  const wire  = new THREE.Mesh(geom, wireMat);
  scene.add(solid, wire);

  // Glowing point cloud around it
  const dotGeo = new THREE.BufferGeometry();
  const dotPos = new Float32Array(800 * 3);
  for (let i = 0; i < 800 * 3; i++) dotPos[i] = (Math.random() - .5) * 5;
  dotGeo.setAttribute('position', new THREE.BufferAttribute(dotPos, 3));
  const dots = new THREE.Points(dotGeo, new THREE.PointsMaterial({
    color: 0x00d4ff, size: .025, transparent: true, opacity: .5,
  }));
  scene.add(dots);

  // Lights
  scene.add(new THREE.AmbientLight(0x00d4ff, .4));
  const pLight1 = new THREE.PointLight(0x00d4ff, 2, 8);
  pLight1.position.set(3, 2, 2);
  const pLight2 = new THREE.PointLight(0x7c3aed, 1.5, 8);
  pLight2.position.set(-3, -2, 2);
  scene.add(pLight1, pLight2);

  let mouseX = 0, mouseY = 0;
  window.addEventListener('mousemove', e => {
    mouseX = (e.clientX / innerWidth  - .5) * 2;
    mouseY = (e.clientY / innerHeight - .5) * 2;
  }, { passive: true });

  let t = 0;
  (function loop() {
    requestAnimationFrame(loop);
    t += .008;

    solid.rotation.x += .004;
    solid.rotation.y += .006;
    wire.rotation.x   = solid.rotation.x;
    wire.rotation.y   = solid.rotation.y;
    dots.rotation.y  += .003;

    // Breathing scale
    const s = 1 + Math.sin(t) * .04;
    solid.scale.setScalar(s);
    wire.scale.setScalar(s);

    // Mouse follow
    scene.rotation.y += (mouseX * .3 - scene.rotation.y) * .05;
    scene.rotation.x += (-mouseY * .2 - scene.rotation.x) * .05;

    // Pulsing light
    pLight1.intensity = 1.5 + Math.sin(t * 2) * .5;
    pLight2.intensity = 1.2 + Math.cos(t * 1.5) * .4;

    renderer.render(scene, camera);
  })();

  // Responsive resize
  const resizeHero = () => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (w === 0 || h === 0) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  };
  window.addEventListener('resize', resizeHero, { passive: true });
})();

/* ═══════════════════════════════════════════════════
   14. AI TERMINAL — GEMINI CHAT
═══════════════════════════════════════════════════ */
(function initTerminal() {
  const body   = $('#ai-response');
  const status = $('#ai-status');
  const input  = $('#user-input');
  const btn    = $('#send-btn');
  if (!body || !input || !btn) return;

  function appendLine(text, color = '#22c55e', prefix = '> ') {
    const d = document.createElement('div');
    d.style.cssText = `color:${color};margin-top:6px;line-height:1.6;`;
    d.textContent   = prefix + text;
    body.appendChild(d);
    body.scrollTop  = body.scrollHeight;
    return d;
  }

  function typeText(div, text, done) {
    let i = 0;
    div.textContent = '> ';
    const t = setInterval(() => {
      div.textContent += text[i++];
      body.scrollTop   = body.scrollHeight;
      if (i >= text.length) { clearInterval(t); done && done(); }
    }, 16);
  }

  async function callGemini(q) {
    appendLine(q, '#e2e8f0', '> You: ');
    status.textContent = 'THINKING...';
    status.style.color = '#fbbf24';
    const thinking = appendLine('Processing through Neural Core...', '#00d4ff');

    try {
      const KEY = (typeof CONFIG !== 'undefined' && CONFIG.API_KEY) ? CONFIG.API_KEY : '';
      if (!KEY) throw new Error('API key not configured in config.js');

      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${KEY}`;
      const sys = `You are Dibyanshu's AI assistant on his portfolio.
Dibyanshu is a Full Stack & AI Developer and Founder of B9 Automation (India's first WhatsApp AI Agency Platform).
Skills: FastAPI, Next.js, LangChain, LangGraph, RAG, PostgreSQL, AWS. 2+ years experience.
B9 Automation: 86+ API endpoints, 100+ businesses, 95% retention, 1000+ concurrent sessions.
Also built Nexus AI Insight Engine (multi-agent research platform).
Answer concisely in under 120 words. Be professional but friendly.`;

      const res  = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: sys + '\n\nUser: ' + q }] }],
          generationConfig: { maxOutputTokens: 250, temperature: .75 },
        }),
      });
      const data = await res.json();
      thinking.remove();

      const txt = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!txt) throw new Error(data.error?.message || 'No response');

      const ansDiv = document.createElement('div');
      ansDiv.style.cssText = 'color:#22c55e;margin-top:8px;line-height:1.65;';
      body.appendChild(ansDiv);
      typeText(ansDiv, txt, () => {
        status.textContent = 'ONLINE';
        status.style.color = '#22c55e';
      });
    } catch (err) {
      if (thinking.parentNode) thinking.remove();
      appendLine(`SYSTEM ERROR: ${err.message}`, '#ff4444');
      status.textContent = 'OFFLINE';
      status.style.color = '#ff4444';
      setTimeout(() => { status.textContent = 'ONLINE'; status.style.color = '#22c55e'; }, 3000);
    }
  }

  function send() {
    const v = input.value.trim();
    if (!v) return;
    input.value = '';
    callGemini(v);
  }

  btn.addEventListener('click', send);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') send(); });
})();
