(() => {
  'use strict';

  const canvas = document.querySelector('.hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  const isMobile = window.matchMedia('(max-width: 767.98px)').matches;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  const LIGHT = '250, 246, 238';
  const GOLD = '184, 134, 11';

  const STAR_COUNT = isMobile ? 60 : 140;
  const NEBULA_COUNT = isMobile ? 2 : 4;

  let width = 0;
  let height = 0;
  let tick = 0;
  let frame = 0;
  let running = true;
  const stars = [];
  const nebulas = [];

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const initStars = () => {
    stars.length = 0;
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.2 + 0.2,
        baseOpacity: Math.random() * 0.7 + 0.2,
        twinkleSpeed: Math.random() * 0.015 + 0.005,
        phase: Math.random() * Math.PI * 2,
        driftX: (Math.random() - 0.5) * 0.05,
        driftY: (Math.random() - 0.5) * 0.05
      });
    }
  };

  const initNebulas = () => {
    nebulas.length = 0;
    for (let i = 0; i < NEBULA_COUNT; i++) {
      nebulas.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 200 + Math.random() * 200,
        opacity: 0.04 + Math.random() * 0.05,
        driftX: (Math.random() - 0.5) * 0.15,
        driftY: (Math.random() - 0.5) * 0.1,
        hue: Math.random() > 0.5 ? GOLD : LIGHT
      });
    }
  };

  const drawNebulas = () => {
    for (let i = 0; i < nebulas.length; i++) {
      const n = nebulas[i];
      n.x += n.driftX;
      n.y += n.driftY;
      if (n.x < -n.radius) n.x = width + n.radius;
      if (n.x > width + n.radius) n.x = -n.radius;
      if (n.y < -n.radius) n.y = height + n.radius;
      if (n.y > height + n.radius) n.y = -n.radius;

      const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.radius);
      grad.addColorStop(0, `rgba(${n.hue}, ${n.opacity})`);
      grad.addColorStop(1, `rgba(${n.hue}, 0)`);
      ctx.fillStyle = grad;
      ctx.fillRect(n.x - n.radius, n.y - n.radius, n.radius * 2, n.radius * 2);
    }
  };

  const drawStars = () => {
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      s.phase += s.twinkleSpeed;
      s.x += s.driftX;
      s.y += s.driftY;
      if (s.x < 0) s.x = width;
      if (s.x > width) s.x = 0;
      if (s.y < 0) s.y = height;
      if (s.y > height) s.y = 0;

      const op = s.baseOpacity * (0.4 + 0.6 * Math.sin(s.phase));
      ctx.fillStyle = `rgba(${LIGHT}, ${op})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const loop = () => {
    if (!running) return;
    ctx.clearRect(0, 0, width, height);
    drawNebulas();
    drawStars();
    tick++;
    frame = requestAnimationFrame(loop);
  };

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      running = false;
      cancelAnimationFrame(frame);
    } else if (!running) {
      running = true;
      loop();
    }
  });

  let resizeTimer = 0;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resize();
      initStars();
      initNebulas();
    }, 200);
  });

  resize();
  initStars();
  initNebulas();
  loop();
})();
