/* ============================================================
   DIBYANSHU PORTFOLIO â€” ULTRA PREMIUM MASTER SCRIPT v4.0
   Epic Preloader Â· 3D Torus Galaxy Â· Hero 3D Object
   Magnetic Â· Scramble Text Â· Click Particles Â· AI Terminal
   ============================================================ */
'use strict';

const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   1. EPIC PRELOADER
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
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

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   2. CUSTOM CURSOR
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
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

  // Only grow cursor on actual interactive elements â€” NOT on cards
  const hoverSel = 'a, button, .float-btn, .btn--primary, .btn--ghost, .nav__cta, .project-card__link';
  // Tiny ring on inputs â€” don't grow
  const inputSel = 'input, textarea';

  document.addEventListener('mouseover', e => {
    if (e.target.closest(inputSel)) {
      // On input fields â€” shrink cursor dot, keep ring small
      dot.classList.remove('hovering');
      ring.classList.remove('hovering');
      dot.style.opacity = '0';
    } else if (e.target.closest(hoverSel)) {
      dot.classList.add('hovering');
      ring.classList.add('hovering');
      dot.style.opacity = '1';
    }
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(inputSel)) {
      dot.style.opacity = '1';
    } else if (e.target.closest(hoverSel)) {
      dot.classList.remove('hovering');
      ring.classList.remove('hovering');
    }
  });
})();

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   3. CLICK PARTICLE BURST
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
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

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   4. SCROLL PROGRESS BAR
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
(function initScrollBar() {
  const bar = $('#scrollBar');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    bar.style.width = Math.min(pct * 100, 100) + '%';
  }, { passive: true });
})();

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   5. STICKY NAV + ACTIVE LINKS
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
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

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   6. SCROLL REVEAL
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
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

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   7. TEXT SCRAMBLE (section titles)
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
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

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   8. TYPEWRITER
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
(function initTypewriter() {
  const el = $('#typewriter');
  if (!el) return;

  const phrases = ['Developer', 'AI Architect', 'Agent Builder', 'System Designer'];
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

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   9. HERO STATS COUNTER
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
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

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   10. MAGNETIC HOVER
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
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

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   11. VANILLA TILT
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
(function initTilt() {
  if (typeof VanillaTilt === 'undefined') return;
  VanillaTilt.init($$('.js-tilt'), {
    max: 12, speed: 400,
    glare: true, 'max-glare': 0.12, scale: 1.02,
  });
})();

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   12. THREE.JS â€” 3D GALAXY BACKGROUND
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
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

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   13. THREE.JS â€” HERO 3D FLOATING OBJECT (Torus Knot)
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
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


/* 14. AI TERMINAL - moved to section 20 (initAICore) */

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   15. CURSOR TRAIL
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
(function initCursorTrail() {
  const count = 18;
  const dots  = Array.from({ length: count }, (_, i) => {
    const d    = document.createElement('div');
    d.className = 'trail-dot';
    const size  = Math.max(8 - i * 0.38, 2);
    d.style.cssText = `width:${size}px;height:${size}px;opacity:0`;
    document.body.appendChild(d);
    return { el: d, x: -200, y: -200 };
  });

  let mx = -200, my = -200;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });

  (function loop() {
    let lx = mx, ly = my;
    dots.forEach((dot, i) => {
      const f = Math.max(0.28 - i * 0.013, 0.04);
      dot.x  += (lx - dot.x) * f;
      dot.y  += (ly - dot.y) * f;
      const s = 1 - i / count;
      dot.el.style.left      = dot.x + 'px';
      dot.el.style.top       = dot.y + 'px';
      dot.el.style.opacity   = (s * 0.5).toString();
      dot.el.style.transform = `translate(-50%,-50%) scale(${s})`;
      lx = dot.x; ly = dot.y;
    });
    requestAnimationFrame(loop);
  })();
})();

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   16. 3D SKILL SPHERE
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
(function initSkillSphere() {
  const inner = document.getElementById('sphereInner');
  if (!inner) return;

  const techs = [
    'FastAPI','Python','Next.js 15','React','TypeScript',
    'LangChain','LangGraph','RAG','Groq','Gemini',
    'PostgreSQL','MongoDB','Redis','Pinecone','MySQL',
    'Node.js','Django','Celery','AWS EC2','Docker',
    'Supabase','Tailwind'
  ];
  const n = techs.length;
  const R = 138;

  techs.forEach((tech, i) => {
    const phi   = Math.acos(1 - 2 * (i + .5) / n);
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;
    const yRot  = theta * (180 / Math.PI);
    const xRot  = -(phi - Math.PI / 2) * (180 / Math.PI);

    const tag = document.createElement('span');
    tag.className   = 'sphere-tag';
    tag.textContent = tech;
    tag.style.transform = `rotateY(${yRot}deg) rotateX(${xRot}deg) translateZ(${R}px) translateX(-50%) translateY(-50%)`;
    inner.appendChild(tag);
  });
})();

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   17. PROJECT MODAL
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
(function initProjectModal() {
  const overlay  = document.getElementById('projectModal');
  const closeBtn = document.getElementById('modalClose');
  const modalBody = document.getElementById('modalBody');
  if (!overlay || !closeBtn || !modalBody) return;

  const PROJECTS = {
    b9: {
      live: true,
      icon: 'fab fa-whatsapp',
      title: 'B9 Automation â€” WhatsApp AI SaaS',
      desc: `India's first WhatsApp AI Agency Platform with a visual drag-and-drop flow builder (40+ canvas nodes). Built a complete production SaaS from scratch.

Key achievements:
â€¢ 86+ FastAPI REST endpoints & 62+ PostgreSQL models
â€¢ Multi-tenant JWT + Fernet AES-128-CBC auth â€” 100K+ req/day on AWS EC2
â€¢ Autonomous agent builder: designs, deploys & self-corrects flows â€” zero human intervention after launch
â€¢ RAG pipeline (Groq Llama 3.3 + Gemini 2.0 Flash failover) â€” sub-1s response across 1,000+ concurrent sessions
â€¢ Agentic loop: AI-generated templates, lead scoring, next-best-action, prompt safety guardrails
â€¢ Real-time: SSE typing indicators, Celery + Redis async campaign processor
â€¢ 9 live integrations: Shopify, IndiaMART, Facebook Ads, Razorpayâ€¦
â€¢ Tiered SaaS (Starter / Pro / Enterprise) â€” 100+ businesses, 95%+ retention`,
      metrics: ['100+ Businesses','86+ API Endpoints','95%+ Retention','1,000+ Concurrent Sessions','100K+ Requests/Day','Sub-1s Response'],
      tags: ['Next.js 15','FastAPI','Python','PostgreSQL','LangChain','LangGraph','Groq Llama 3.3','Gemini 2.0','RAG','Celery','Redis','AWS EC2','Razorpay'],
      liveUrl: 'https://b9-automation-frontend.vercel.app',
      ghUrl:   'https://github.com/dibyanshu122',
    },
    nexus: {
      live: false,
      icon: 'fas fa-brain',
      title: 'Nexus AI Insight Engine',
      desc: `A multi-agent AI research platform with a 3-tier autonomous pipeline powered by LangGraph.

Architecture:
â€¢ Researcher Agent: Searches the web via Tavily AI for real-time data
â€¢ Critic Agent: Validates facts and flags inaccuracies
â€¢ Writer Agent: Synthesises a structured, cited research report
â€¢ LangGraph state machine manages handoffs and quality loops
â€¢ Pinecone Vector DB for persistent semantic memory across sessions
â€¢ Gemini 1.5 Flash as the primary LLM with RAG retrieval
â€¢ Next.js frontend with real-time streaming output via SSE`,
      metrics: ['3-Tier Agent Pipeline','Real-time Web Search','Persistent RAG Memory','Structured Report Output'],
      tags: ['Next.js','FastAPI','LangGraph','LangChain','Gemini 1.5','Pinecone','Tavily AI','SSE Streaming'],
      liveUrl: null,
      ghUrl:   'https://github.com/dibyanshu122',
    },
    crm: {
      live: false,
      icon: 'fas fa-shield-halved',
      title: 'Full-Stack Auth & CRM Portal',
      desc: `Enterprise-grade CRM with rock-solid security and real-time payment infrastructure.

Security features:
â€¢ Google OAuth 2.0 with 256-bit state parameter CSRF protection
â€¢ HTTP-only, Secure, SameSite=Strict cookies â€” zero XSS surface
â€¢ RBAC with 4 roles: Admin / Manager / User / Viewer
â€¢ Audit logging for all sensitive operations

Payments & onboarding:
â€¢ Razorpay + Rozgar Pay with webhook-driven retry logic
â€¢ 99.8% transaction success across 10K+ daily active users
â€¢ Nodemailer onboarding flow with branded email templates
â€¢ Analytics dashboard with Recharts â€” zero security incidents`,
      metrics: ['10K+ Daily Active Users','99.8% Payment Success','4-Level RBAC','Zero Security Incidents'],
      tags: ['Next.js','Node.js','PostgreSQL','Google OAuth 2.0','Razorpay','Nodemailer','Recharts','RBAC'],
      liveUrl: null,
      ghUrl:   'https://github.com/dibyanshu122',
    },
    health: {
      live: false,
      icon: 'fas fa-heartbeat',
      title: 'Healthcare Microservices Backend',
      desc: `Scalable, HIPAA-compliant microservices architecture serving a healthcare platform.

Infrastructure:
â€¢ Django + Node.js microservices â€” 50K+ MAU, 100K+ daily API requests
â€¢ 99.5% uptime with AWS EC2 auto-scaling and load balancing
â€¢ AES-256 encryption for all PHI data at rest and in transit
â€¢ RBAC with audit logging â€” zero data breach incidents over 2 years
â€¢ HIPAA compliance throughout the stack

Database optimisation:
â€¢ Led MySQL â†’ MongoDB migration
â€¢ Cut query time from 500ms to 350ms (30% improvement)
â€¢ Indexed hot queries and refactored N+1 patterns`,
      metrics: ['50K+ Monthly Active Users','100K+ Daily API Requests','99.5% Uptime','30% Faster Queries','Zero Data Breaches'],
      tags: ['Django','Node.js','MongoDB','MySQL','AWS EC2','AWS RDS','AES-256','HIPAA','RBAC'],
      liveUrl: null,
      ghUrl:   'https://github.com/dibyanshu122',
    },
  };

  function buildModal(data) {
    let html = '';
    if (data.live) {
      html += `<div class="modal-live-badge"><span></span> LIVE PROJECT</div>`;
    }
    html += `<div class="modal-title">${data.title}</div>`;
    html += `<p class="modal-desc">${data.desc}</p>`;

    html += `<div class="modal-section-label">Impact Metrics</div>`;
    html += `<div class="modal-metrics">` +
      data.metrics.map(m => `<span class="modal-metric">${m}</span>`).join('') +
    `</div>`;

    html += `<div class="modal-section-label">Tech Stack</div>`;
    html += `<div class="modal-tags">` +
      data.tags.map(t => `<span class="tag" style="color:var(--text-secondary)">${t}</span>`).join('') +
    `</div>`;

    html += `<div class="modal-links">`;
    if (data.liveUrl) {
      html += `<a href="${data.liveUrl}" target="_blank" rel="noopener" class="modal-link modal-link--primary"><i class="fas fa-external-link-alt"></i> Live Demo</a>`;
    }
    if (data.ghUrl) {
      html += `<a href="${data.ghUrl}" target="_blank" rel="noopener" class="modal-link modal-link--ghost"><i class="fab fa-github"></i> GitHub</a>`;
    }
    html += `</div>`;
    return html;
  }

  // Open modal on project card click
  document.querySelectorAll('[data-project]').forEach(card => {
    card.addEventListener('click', () => {
      const key  = card.dataset.project;
      const data = PROJECTS[key];
      if (!data) return;

      modalBody.innerHTML    = buildModal(data);
      overlay.classList.add('open');
      overlay.removeAttribute('aria-hidden');
      document.body.style.overflow = 'hidden';
      closeBtn.focus();
    });
  });

  function closeModal() {
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
})();

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   18. DRAG-TO-SCROLL (Projects)
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
(function initDragScroll() {
  const el = document.querySelector('.projects-hscroll');
  if (!el) return;
  let isDown = false, startX, scrollLeft;
  el.addEventListener('mousedown',  e => { isDown = true; startX = e.pageX - el.offsetLeft; scrollLeft = el.scrollLeft; });
  el.addEventListener('mouseleave', () => { isDown = false; });
  el.addEventListener('mouseup',    () => { isDown = false; });
  el.addEventListener('mousemove',  e => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    el.scrollLeft = scrollLeft - (x - startX) * 1.5;
  });
})();

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   19. CURSOR-FOLLOWING SPOTLIGHT GLOW
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
(function initSpotlightGlow() {
  const cards = document.querySelectorAll('.glow-border');
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top)  + 'px');
    });
    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--mx', '50%');
      card.style.setProperty('--my', '50%');
    });
  });
})();

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
   20. AI CORE UPGRADE
   Auto-Greeting Â· Audio Wave Â· Quick Chips
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
(function initAICore() {
  const body    = $('#ai-response');
  const status  = $('#ai-status');
  const input   = $('#user-input');
  const btn     = $('#send-btn');
  const wave    = document.getElementById('aiWave');
  const chips   = document.getElementById('aiChips');
  if (!body || !input || !btn) return;

  let greeted = false;

  /* â”€â”€ Wave helpers â”€â”€ */
  function waveOn()  { wave && wave.classList.add('active'); }
  function waveOff() { wave && wave.classList.remove('active'); }

  /* â”€â”€ Append a line instantly â”€â”€ */
  function line(text, color = '#22c55e', prefix = '> ') {
    const d = document.createElement('div');
    d.style.cssText = `color:${color};margin-top:6px;line-height:1.65;font-family:var(--font-mono);font-size:.85rem`;
    d.textContent   = prefix + text;
    body.appendChild(d);
    body.scrollTop  = body.scrollHeight;
    return d;
  }

  /* â”€â”€ Type text char by char â”€â”€ */
  function typeInto(div, text, speed, done) {
    let i = 0;
    div.textContent = '> ';
    const t = setInterval(() => {
      div.textContent += text[i++];
      body.scrollTop   = body.scrollHeight;
      if (i >= text.length) { clearInterval(t); done && done(); }
    }, speed || 14);
  }

  /* â”€â”€ Auto-greeting sequence â”€â”€ */
  function runGreeting() {
    if (greeted) return;
    greeted = true;
    body.innerHTML = '';
    waveOn();
    status.textContent = 'BOOTING...';
    status.style.color = '#fbbf24';

    const seq = [
      { delay: 0,    color: '#00d4ff', text: 'Initializing Dibyanshu AI Core...' },
      { delay: 900,  color: '#94a3b8', text: 'Loading knowledge base...' },
      { delay: 1700, color: '#94a3b8', text: 'Neural pathways connected âœ“' },
      { delay: 2500, color: '#22c55e', text: 'SYSTEM READY', typed: true, speed: 60 },
      { delay: 3200, color: '#f1f5f9', text: "Hey! I'm Dibyanshu's personal AI. Ask me anything â€” his projects, skills, or how to hire him.", typed: true, speed: 22 },
    ];

    seq.forEach(({ delay, color, text, typed, speed }) => {
      setTimeout(() => {
        if (typed) {
          const d = document.createElement('div');
          d.style.cssText = `color:${color};margin-top:8px;line-height:1.65;font-family:var(--font-mono);font-size:.85rem`;
          body.appendChild(d);
          typeInto(d, text, speed, () => {
            if (delay === seq[seq.length - 1].delay) {
              waveOff();
              status.textContent = 'ONLINE';
              status.style.color = '#22c55e';
            }
          });
        } else {
          line(text, color);
        }
      }, delay);
    });
  }

  /* â”€â”€ IntersectionObserver â€” trigger greeting on scroll â”€â”€ */
  const termSection = document.getElementById('terminal');
  if (termSection) {
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) { runGreeting(); obs.disconnect(); }
    }, { threshold: 0.25 });
    obs.observe(termSection);
  } else {
    // Fallback: greet immediately
    setTimeout(runGreeting, 600);
  }

  /* â”€â”€ Smart local KB â”€â”€ */
  const KB = [
    { keys:['who','dibyanshu','yourself','about','intro','tell me'], ans:"I'm Dibyanshu â€” Full Stack & AI Developer, Founder of B9 Automation (India's first WhatsApp AI Agency Platform). I build autonomous AI agents, RAG pipelines, and production SaaS serving 100+ businesses." },
    { keys:['b9','automation','whatsapp','saas','startup','company','founded','founder'], ans:"B9 Automation is India's first WhatsApp AI Agency Platform â€” live at b9-automation-frontend.vercel.app. Visual drag-and-drop builder with 40+ nodes, 86+ FastAPI endpoints, RAG pipelines (Groq + Gemini failover), serving 100+ businesses with 95%+ retention." },
    { keys:['skill','tech','stack','use','language','framework','know'], ans:"Core stack: Backend â€” FastAPI, Python, Django, Node.js, Celery, Redis. Frontend â€” Next.js 15, React, TypeScript, Tailwind. AI/LLM â€” LangChain, LangGraph, Groq Llama 3.3, Gemini 2.0 Flash, RAG, Pinecone. Cloud â€” AWS EC2/S3/RDS, Docker, Vercel, GitHub Actions." },
    { keys:['ai','agent','agentic','rag','langchain','langgraph','llm','gemini','groq'], ans:"Dibyanshu builds production agentic AI: autonomous agents using LangChain + LangGraph that plan, act, and self-correct. RAG with Groq Llama 3.3 + Gemini 2.0 Flash failover â€” sub-1s response at 1,000+ concurrent sessions. Also built 3-tier multi-agent pipeline: Researcher â†’ Critic â†’ Writer." },
    { keys:['project','nexus','crm','healthcare','built','portfolio','work'], ans:"Key projects: 1) B9 Automation â€” WhatsApp AI SaaS (LIVE). 2) Nexus AI Engine â€” 3-tier multi-agent research platform with LangGraph + Pinecone. 3) Full-Stack CRM â€” Google OAuth, Razorpay, RBAC, zero security incidents. 4) Healthcare Microservices â€” 50K+ MAU, HIPAA-compliant, 99.5% uptime." },
    { keys:['experience','job','company','ringpass','phero','accenture'], ans:"2+ years experience: Founder at B9 Automation (Mar 2026â€“Present), Full Stack Dev at RingPass Services (Sep 2025â€“Present) building enterprise CRM with AI pipelines, Backend Dev at Phero Health Care (Oct 2023â€“Sep 2025) serving 50K+ MAU." },
    { keys:['education','degree','btech','college','university','cgpa'], ans:"B.Tech in Computer Science & Engineering from Rameshwaram Institute of Technology & Management, Lucknow (2019â€“2023), CGPA 8.05/10. Coursework: DSA, DBMS, Web Dev, ML, Cloud Computing." },
    { keys:['contact','hire','email','phone','linkedin','reach','available'], ans:"Reach Dibyanshu at: Email â€” ddibyanshu2@gmail.com | Phone â€” +91-9628954948 | LinkedIn â€” linkedin.com/in/dibyanshu-286ba723a | GitHub â€” github.com/dibyanshu122. Available for freelance and full-time!" },
    { keys:['aws','cloud','deploy','docker','devops','server'], ans:"Dibyanshu deploys on AWS EC2/S3/RDS handling 100K+ req/day, Vercel for frontends, Docker for containerization, GitHub Actions for CI/CD with zero-downtime deployments." },
    { keys:['hello','hi','hey','namaste','hii','helo'], ans:"Hello! ðŸ‘‹ I'm Dibyanshu's AI. I know everything about his skills, projects, and experience. What would you like to explore?" },
  ];

  function localAnswer(q) {
    const lower = q.toLowerCase();
    for (const e of KB) { if (e.keys.some(k => lower.includes(k))) return e.ans; }
    return "Great question! Dibyanshu is a Full Stack & AI Developer specialising in FastAPI, Next.js, LangChain, and agentic AI. For specifics, email ddibyanshu2@gmail.com ðŸš€";
  }

  /* â”€â”€ Main query handler â”€â”€ */
  async function handleQuery(q) {
    if (!q.trim()) return;
    line(q, '#e2e8f0', '> You: ');
    status.textContent = 'THINKING...';
    status.style.color = '#fbbf24';
    waveOn();

    // Try Gemini API
    try {
      const KEY = (typeof CONFIG !== 'undefined' && (CONFIG.API_KEY || CONFIG.GEMINI_API_KEY))
        ? (CONFIG.API_KEY || CONFIG.GEMINI_API_KEY) : '';
      if (KEY) {
        const sys = `You are Dibyanshu's AI portfolio assistant. Answer ONLY about Dibyanshu.
Facts: Full Stack & AI Developer, Founder of B9 Automation (India's first WhatsApp AI Agency Platform).
B9: 86+ FastAPI endpoints, 62+ DB models, JWT auth, 100K+ req/day, AWS EC2, 100+ businesses, 95% retention.
Agentic AI: LangChain, LangGraph, RAG (Groq Llama 3.3 + Gemini 2.0 Flash), sub-1s response, 1000+ concurrent.
Stack: FastAPI, Python, Next.js 15, React, TypeScript, PostgreSQL, MongoDB, Redis, Pinecone, Docker, AWS.
Contact: ddibyanshu2@gmail.com | +91-9628954948.
Be friendly, professional, under 80 words.`;

        const res  = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${KEY}`,
          { method:'POST', headers:{'Content-Type':'application/json'},
            body: JSON.stringify({ contents:[{parts:[{text:`${sys}\n\nUser: ${q}`}]}], generationConfig:{maxOutputTokens:180,temperature:.7} }) }
        );
        const data = await res.json();
        const txt  = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (txt) {
          waveOff();
          const d = document.createElement('div');
          d.style.cssText = 'color:#22c55e;margin-top:8px;line-height:1.65;font-family:var(--font-mono);font-size:.85rem';
          body.appendChild(d);
          typeInto(d, txt.trim(), 13, () => { status.textContent='ONLINE'; status.style.color='#22c55e'; });
          return;
        }
      }
      throw new Error('local');
    } catch(_) {
      waveOff();
      const ans = localAnswer(q);
      const d   = document.createElement('div');
      d.style.cssText = 'color:#22c55e;margin-top:8px;line-height:1.65;font-family:var(--font-mono);font-size:.85rem';
      body.appendChild(d);
      typeInto(d, ans, 13, () => { status.textContent='ONLINE'; status.style.color='#22c55e'; });
    }
  }

  /* â”€â”€ Quick chips â”€â”€ */
  if (chips) {
    chips.querySelectorAll('.ai-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const q = chip.dataset.q;
        if (q) handleQuery(q);
      });
    });
  }

  /* â”€â”€ Send button + Enter â”€â”€ */
  function send() {
    const v = input.value.trim();
    if (!v) return;
    input.value = '';
    handleQuery(v);
  }
  btn.addEventListener('click', send);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') send(); });
})();
