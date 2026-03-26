/* ─────────────────────────────────────────
   PythonDevOps Academy – Outro Particles JS
   ───────────────────────────────────────── */

const canvas = document.getElementById('particles');
const ctx    = canvas.getContext('2d');

/* ── Resize canvas to fill viewport ── */
function resize() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

/* ── Generate particles ── */
const NUM = 90;
const particles = Array.from({ length: NUM }, () => ({
  x:    Math.random() * canvas.width,
  y:    Math.random() * canvas.height,
  r:    Math.random() * 1.6 + 0.3,
  vx:   (Math.random() - 0.5) * 0.4,
  vy:   (Math.random() - 0.5) * 0.35,
  o:    Math.random() * 0.55 + 0.1,
  type: Math.random() < 0.15 ? 'cross' : 'dot'   // 15% cross shapes
}));

/* ── Fade-out timing (mirrors CSS) ── */
let masterAlpha  = 1;
const FADE_START = 7000;   // ms
const FADE_DUR   = 3000;   // ms
const startTime  = performance.now();

/* ── Main draw loop ── */
function draw(now) {
  const elapsed = now - startTime;

  /* Sync alpha with CSS fade-out at 7s */
  if (elapsed > FADE_START) {
    masterAlpha = Math.max(0, 1 - (elapsed - FADE_START) / FADE_DUR);
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const p of particles) {
    /* Move */
    p.x += p.vx;
    p.y += p.vy;

    /* Wrap around edges */
    if (p.x < 0)             p.x = canvas.width;
    if (p.x > canvas.width)  p.x = 0;
    if (p.y < 0)             p.y = canvas.height;
    if (p.y > canvas.height) p.y = 0;

    /* Subtle per-particle flicker */
    const flicker = 0.75 + Math.sin(now * 0.003 + p.x) * 0.25;
    const alpha   = p.o * flicker * masterAlpha;

    ctx.save();

    if (p.type === 'cross') {
      /* ── ✚ cross particle ── */
      ctx.strokeStyle = `rgba(0,229,255,${alpha})`;
      ctx.lineWidth   = 0.8;
      ctx.shadowBlur  = 6;
      ctx.shadowColor = '#00e5ff';
      ctx.beginPath();
      ctx.moveTo(p.x - p.r * 2, p.y);
      ctx.lineTo(p.x + p.r * 2, p.y);
      ctx.moveTo(p.x, p.y - p.r * 2);
      ctx.lineTo(p.x, p.y + p.r * 2);
      ctx.stroke();
    } else {
      /* ── dot particle ── */
      ctx.fillStyle   = `rgba(0,229,255,${alpha})`;
      ctx.shadowBlur  = 8;
      ctx.shadowColor = '#00e5ff';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  requestAnimationFrame(draw);
}

/* ── Kick off ── */
requestAnimationFrame(draw);
