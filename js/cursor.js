/* ============================================================================
   cursor.js — cursor customizado (ponto + anel) + halo de luz que segue o mouse.
   Só em ponteiro fino (desktop). Aparece quando o mouse entra na página.
   Respeita prefers-reduced-motion (mantém o cursor nativo).
   ========================================================================== */

export function initCursor() {
  const fine = window.matchMedia('(pointer:fine)').matches;
  const reduce = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  if (!fine || reduce) return;                 // touch / reduced-motion → cursor nativo

  const html = document.documentElement;
  html.classList.add('has-cursor');

  const mk = cls => { const d = document.createElement('div'); d.className = 'cur ' + cls; d.setAttribute('aria-hidden', 'true'); document.body.appendChild(d); return d; };
  const glow = mk('cur-glow'), ring = mk('cur-ring'), dot = mk('cur-dot');

  let mx = innerWidth / 2, my = innerHeight / 2;
  let rx = mx, ry = my, gx = mx, gy = my, shown = false;
  const put = (el, x, y) => { el.style.transform = `translate(${x}px,${y}px) translate(-50%,-50%)`; };
  put(dot, mx, my); put(ring, mx, my); put(glow, mx, my);

  function show() { if (!shown) { shown = true; html.classList.add('cur-on'); } }
  function hide() { shown = false; html.classList.remove('cur-on'); }

  window.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    put(dot, mx, my);          // ponto acompanha na hora
    show();
  }, { passive: true });
  document.addEventListener('mouseleave', hide);
  document.addEventListener('mouseenter', show);
  window.addEventListener('mousedown', () => html.classList.add('cur-down'));
  window.addEventListener('mouseup', () => html.classList.remove('cur-down'));

  // estado "hover" sobre elementos interativos
  const INTERACTIVE = 'a,button,input,summary,label,[data-modal],.infochip,.nav__item,.rail__dot,.journey__btn,.acc summary,.invest__slider,.mdl__close';
  window.addEventListener('mouseover', e => { if (e.target.closest && e.target.closest(INTERACTIVE)) html.classList.add('cur-hover'); }, { passive: true });
  window.addEventListener('mouseout', e => {
    const to = e.relatedTarget;
    if (e.target.closest && e.target.closest(INTERACTIVE) && !(to && to.closest && to.closest(INTERACTIVE))) html.classList.remove('cur-hover');
  }, { passive: true });

  (function raf() {
    rx += (mx - rx) * 0.20; ry += (my - ry) * 0.20;   // anel: leve atraso
    gx += (mx - gx) * 0.12; gy += (my - gy) * 0.12;   // glow: atraso maior
    put(ring, rx, ry); put(glow, gx, gy);
    requestAnimationFrame(raf);
  })();
}
