/* ============================================================================
   scenes.js — módulos de interação por cena (camada PRODUTO, fixa)
   Cada módulo pode expor: init(el,config), enter(el), progress(p,el)
   ========================================================================== */

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const easeInOut = x => x < .5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;

/* ---------- helpers ---------- */
const BRL = new Intl.NumberFormat('pt-BR');
const fmtInt = n => 'R$ ' + BRL.format(Math.round(n));
const fmtMi = n => 'R$ ' + (n / 1e6).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 2 }) + ' mi';

function setCount(span, value) {
  const dec = +(span.dataset.dec || 0);
  const suffix = span.dataset.suffix || '';
  span.textContent = (dec ? value.toFixed(dec) : Math.round(value).toLocaleString('pt-BR')) + suffix;
}
function animateCount(span, dur = 1300) {
  const target = +span.dataset.count;
  if (reduce) { setCount(span, target); return; }
  const t0 = performance.now();
  (function tick(t) {
    const k = clamp((t - t0) / dur);
    setCount(span, target * easeInOut(k));
    if (k < 1) requestAnimationFrame(tick);
  })(t0);
}
function markPathLengths(el, sel) {
  el.querySelectorAll(sel).forEach(p => p.setAttribute('pathLength', '1'));
}

export const sceneModules = {

  /* ---- CENA 1 — hero: toca o vídeo 3D UMA vez ao entrar (sem loop, sem controles) ---- */
  1: {
    init(el) {
      this.v = el.querySelector('.hero-media__video');
      if (!this.v) return;
      this.v.muted = true; this.v.defaultMuted = true;
      // fallback p/ mobile: se o autoplay for bloqueado, dispara no 1º toque
      const kick = () => { try { this.v.play().catch(() => {}); } catch (e) {} };
      window.addEventListener('touchstart', kick, { once: true, passive: true });
      window.addEventListener('pointerdown', kick, { once: true, passive: true });
    },
    enter() {
      if (!this.v || reduce) return;
      try { this.v.muted = true; this.v.currentTime = 0; const p = this.v.play(); if (p && p.catch) p.catch(() => {}); } catch (e) {}
    }
  },

  /* ---- CENA 2 — problema: palavras + linha de falha ---- */
  2: {
    init(el) { markPathLengths(el, '.failline__path'); },
    progress(p, el) {
      const words = el.querySelectorAll('[data-painwords] li');
      words.forEach((li, i) => {
        const on = p > 0.06 + i * 0.055;
        li.classList.toggle('in', on);
        li.classList.toggle('hot', on && i >= words.length - 3 && p > 0.5);
      });
      const path = el.querySelector('.failline__path');
      const dot = el.querySelector('.failline__dot');
      const draw = clamp((p - 0.45) / 0.35);
      if (path) path.style.strokeDashoffset = String(1 - draw);
      if (dot) dot.style.opacity = draw > 0.95 ? '1' : '0';
      el.querySelector('[data-failtag]')?.classList.toggle('in', p > 0.8);
    }
  },

  /* ---- CENA 4 — jornada: carrossel MANUAL (começa parado; mouse + setas) ---- */
  4: {
    init(el) {
      this.section = el;
      this.track = el.querySelector('[data-journey-track]');
      this.vp = el.querySelector('[data-journey-vp]');
      this.fillEl = el.querySelector('[data-journey-fill]');
      this.stages = Array.from(el.querySelectorAll('.stage'));
      this.prevBtn = el.querySelector('[data-journey-prev]');
      this.nextBtn = el.querySelector('[data-journey-next]');
      this.idx = 0;

      const maxPx = () => Math.max(0, this.track.scrollWidth - this.vp.clientWidth);
      const stageX = i => Math.min(maxPx(), this.stages[i].offsetLeft - this.stages[0].offsetLeft);

      this.render = (animate = true) => {
        this.track.classList.toggle('no-anim', !animate);
        const x = stageX(this.idx);
        this.track.style.transform = `translateX(${-x}px)`;
        if (this.fillEl) this.fillEl.style.width = (maxPx() ? (x / maxPx()) * 100 : 0).toFixed(1) + '%';
        this.stages.forEach((s, i) => s.classList.toggle('is-focus', i === this.idx));
        if (this.prevBtn) this.prevBtn.disabled = this.idx <= 0;
        if (this.nextBtn) this.nextBtn.disabled = this.idx >= this.stages.length - 1;
      };
      this.go = i => { this.idx = clamp(i, 0, this.stages.length - 1) | 0; this.render(); };

      this.prevBtn && this.prevBtn.addEventListener('click', () => this.go(this.idx - 1));
      this.nextBtn && this.nextBtn.addEventListener('click', () => this.go(this.idx + 1));

      // teclado ← → (só quando a cena está ativa)
      window.addEventListener('keydown', e => {
        if (!this.section.classList.contains('is-active')) return;
        if (e.key === 'ArrowRight') { e.preventDefault(); this.go(this.idx + 1); }
        else if (e.key === 'ArrowLeft') { e.preventDefault(); this.go(this.idx - 1); }
      });

      // arrastar com o mouse / toque
      let down = false, sx = 0, base = 0, moved = 0;
      const curX = () => {
        const m = /translateX\((-?[\d.]+)px\)/.exec(this.track.style.transform);
        return m ? parseFloat(m[1]) : 0;
      };
      const start = x => { down = true; sx = x; base = curX(); moved = 0; this.vp.classList.add('is-dragging'); this.track.classList.add('no-anim'); };
      const move = x => {
        if (!down) return;
        moved = x - sx;
        let nx = clamp(-(base + moved), 0, Math.max(0, this.track.scrollWidth - this.vp.clientWidth));
        this.track.style.transform = `translateX(${-nx}px)`;
      };
      const end = () => {
        if (!down) return; down = false; this.vp.classList.remove('is-dragging');
        // snap para o estágio mais próximo
        const x = -curX();
        let best = 0, bd = Infinity;
        this.stages.forEach((s, i) => { const d = Math.abs((s.offsetLeft - this.stages[0].offsetLeft) - x); if (d < bd) { bd = d; best = i; } });
        this.go(best);
      };
      this.vp.addEventListener('pointerdown', e => { start(e.clientX); });
      window.addEventListener('pointermove', e => move(e.clientX));
      window.addEventListener('pointerup', end);

      window.addEventListener('resize', () => this.render(false));
      this.render(false);
    },
    enter() { this.idx = 0; this.render && this.render(false); }   // começa parado no 1º estágio
  },

  /* ---- CENA 5 — bancada: vídeo + acordeões exclusivos; readouts contam na entrada ---- */
  5: {
    init(el) {
      this.readouts = el.querySelectorAll('.bench2__readouts [data-count]');
      // acordeão exclusivo (fallback caso o atributo name não seja suportado)
      const accs = Array.from(el.querySelectorAll('.accordion .acc'));
      accs.forEach(d => d.addEventListener('toggle', () => {
        if (d.open) accs.forEach(o => { if (o !== d && o.open) o.open = false; });
      }));
    },
    enter(el) {
      this.readouts.forEach((s, i) => setTimeout(() => animateCount(s), reduce ? 0 : 200 + i * 140));
    }
  },

  /* ---- CENA 6 — ciclo de melhoria contínua ---- */
  6: {
    init(el) {
      markPathLengths(el, '.cycle__ring');
      // posiciona nós ao redor do círculo (transform fica com o CSS p/ animar)
      const nodes = el.querySelectorAll('.cycle__nodes li');
      nodes.forEach((li, i) => {
        const a = (i / nodes.length) * Math.PI * 2 - Math.PI / 2;
        li.style.left = (50 + Math.cos(a) * 46) + '%';
        li.style.top = (50 + Math.sin(a) * 46) + '%';
        li.style.transitionDelay = (i * 80) + 'ms';
      });
    },
    enter(el) { el.querySelector('[data-cycle]')?.classList.add('in'); },
    progress(p, el) {
      const ring = el.querySelector('.cycle__ring');
      const draw = clamp((p - 0.1) / 0.6);
      if (ring) ring.style.strokeDashoffset = String(1 - draw);
      if (p > 0.1) el.querySelector('[data-cycle]')?.classList.add('in');
    }
  },

  /* ---- CENA 7 — ecossistema digital: dados do ativo (config) ---- */
  7: {
    init(el, config) {
      const a = config.ativoExemplo;
      const set = (k, v) => { const n = el.querySelector(`[data-asset="${k}"]`); if (n) n.textContent = v; };
      set('id', a.id); set('serie', a.serie); set('base', a.base);
      set('disp', a.disponibilidade + '%'); set('horas', a.horas.toLocaleString('pt-BR') + ' h');
      set('proxima', a.proxima);
    },
    enter(el) { el.querySelector('[data-assetcard]')?.classList.add('in'); }
  },

  /* ---- CENA 8 — resultados: count-up + barras ---- */
  8: {
    enter(el) {
      el.querySelectorAll('.kpi').forEach((k, i) => setTimeout(() => k.classList.add('in'), reduce ? 0 : i * 90));
      el.querySelectorAll('[data-kpis] [data-count]').forEach((s, i) => setTimeout(() => animateCount(s), reduce ? 0 : 200 + i * 90));
    }
  },

  /* ---- CENA 9 — comparativo: preenche linha a linha ---- */
  9: {
    init(el, config) {
      const n = el.querySelector('[data-intern]');
      if (n) n.textContent = fmtInt(config.investimento.estruturaInternaMes);
    },
    progress(p, el) {
      const rows = el.querySelectorAll('.ctable__col li');
      const per = 0.85 / rows.length;
      rows.forEach((li, i) => li.classList.toggle('in', p > 0.12 + (i % (rows.length / 2)) * per));
    }
  },

  /* ---- CENA 10 — investimento: slider 10→50 + cubos ---- */
  10: {
    init(el, config) {
      this.inv = config.investimento;
      this.slider = el.querySelector('[data-invest-slider]');
      this.min = this.inv.minimoAtivos; this.max = this.inv.capacidadeAtivos;
      this.slider.min = this.min; this.slider.max = this.max; this.slider.value = this.min;
      // per-asset label
      el.querySelector('[data-per-asset]').textContent = fmtInt(this.inv.porAtivoMes);
      // cubos
      const wrap = el.querySelector('[data-cubes]');
      this.cubes = [];
      for (let i = 0; i < this.max; i++) { const c = document.createElement('span'); c.className = 'cube'; wrap.appendChild(c); this.cubes.push(c); }
      this.qtd = el.querySelector('[data-invest="qtd"]');
      this.mes = el.querySelector('[data-invest="mes"]');
      this.ano = el.querySelector('[data-invest="ano"]');
      this.dragging = false;
      this.slider.addEventListener('pointerdown', () => this.dragging = true);
      window.addEventListener('pointerup', () => this.dragging = false);
      this.slider.addEventListener('input', () => this.render(+this.slider.value));
      this.render(this.min);
    },
    render(v) {
      v = Math.round(v);
      const mensal = v * this.inv.porAtivoMes;
      const anual = mensal * 12;
      this.slider.value = v;
      this.slider.style.setProperty('--fill', ((v - this.min) / (this.max - this.min) * 100) + '%');
      this.qtd.textContent = v;
      this.mes.textContent = fmtInt(mensal);
      this.ano.textContent = fmtMi(anual);
      this.cubes.forEach((c, i) => c.classList.toggle('on', i < v));
    },
    progress(p) {
      if (this.dragging) return;
      const v = this.min + easeInOut(clamp((p - 0.08) / 0.84)) * (this.max - this.min);
      this.render(v);
    }
  },

  /* ---- CENA 11 — fecho: selo + CTAs (config) ---- */
  11: {
    init(el, config) {
      const c = config.contato;
      const p = el.querySelector('[data-cta-primary]'), s = el.querySelector('[data-cta-secondary]');
      if (p) { p.href = c.ctaPrimario.href; p.textContent = c.ctaPrimario.label; }
      if (s) { s.href = c.ctaSecundario.href; s.textContent = c.ctaSecundario.label; }
      const site = el.querySelector('[data-site]'); if (site) site.textContent = c.site;
    },
    enter(el) { el.querySelector('.close')?.classList.add('in'); }
  },
};

/* ---------- injeções globais fora das cenas (topbar / hero client) ---------- */
export function applyClientChrome(config) {
  document.querySelectorAll('[data-cta-primary]').forEach(a => {
    a.href = config.contato.ctaPrimario.href; a.textContent = config.contato.ctaPrimario.label;
  });
  const badge = document.querySelector('[data-client-badge]');
  if (badge) badge.textContent = config.heroEyebrowCliente;
}
