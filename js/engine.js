/* ============================================================================
   engine.js — page-by-page slide engine for SETEC TIP®
   Manages vertical layout translations, keyboard/wheel/touch swipe controls,
   native browser video streaming, and automated entry progress animations.
   ========================================================================== */

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));

export function initEngine(config, modules = {}) {
  let fill, topbar, nav, rail, dots = [], navItems = [], activeN = -1;
  let lastTransitionTime = 0;
  const cooldown = 1000; // 1s cooldown between slide transitions
  // unidade de altura: svh (viewport pequeno, considera a barra do navegador no mobile);
  // no desktop svh == vh, então não muda nada lá. Fallback p/ vh em browsers antigos.
  const VU = (window.CSS && CSS.supports && CSS.supports('height', '100svh')) ? 'svh' : 'vh';

  const scenes = Array.from(document.querySelectorAll('[data-scene]')).map(el => {
    const n = +el.dataset.scene;
    return {
      n, el,
      pin: el.querySelector('.scene__pin'),
      videoSrc: el.dataset.video || null,
      poster: el.querySelector('.scene__poster'),
      video: null, loading: false, ready: false, hasClip: false,
      p: 0, animFrame: null,
      mod: modules[n] || null,
    };
  });

  // Init scene modules once
  scenes.forEach(s => {
    try {
      s.mod && s.mod.init && s.mod.init(s.el, config);
    } catch (e) {
      console.warn('scene init', s.n, e);
    }
  });

  // Native streaming video loader
  function loadClip(s) {
    if (s.loading || !s.videoSrc) return;
    s.loading = true;

    const v = document.createElement('video');
    v.className = 'scene__video';
    v.muted = true;
    v.loop = true;
    v.playsInline = true;
    v.setAttribute('muted', '');
    v.setAttribute('playsinline', '');
    v.setAttribute('loop', '');
    v.src = s.videoSrc;

    v.addEventListener('loadedmetadata', () => { s.ready = true; });
    v.addEventListener('loadeddata', () => {
      s.el.classList.add('has-clip');
      s.ready = true;
      if (s.n === activeN && !reduce) {
        v.play().catch(err => console.warn("Video play failed:", err));
      }
    });

    const bg = s.pin ? s.pin.querySelector('.scene__bg') : s.el.querySelector('.scene__bg');
    if (bg) bg.appendChild(v);
    s.video = v;
    s.hasClip = true;
  }

  // Set active scene & transition
  function goToScene(n) {
    n = Math.max(1, Math.min(scenes.length, n));
    if (n === activeN) return;

    const now = performance.now();
    lastTransitionTime = now;

    activeN = n;
    const activeScene = scenes[activeN - 1];

    // Lazy load background video for active scene
    if (activeScene.videoSrc && !activeScene.hasClip && !reduce) {
      loadClip(activeScene);
    }

    // Preload adjacent videos
    const prevScene = scenes[activeN - 2];
    if (prevScene && prevScene.videoSrc && !prevScene.hasClip && !reduce) loadClip(prevScene);
    const nextScene = scenes[activeN];
    if (nextScene && nextScene.videoSrc && !nextScene.hasClip && !reduce) loadClip(nextScene);

    // Apply vertical translation of the world element
    const world = document.getElementById('world');
    if (world) {
      world.style.transform = `translateY(-${(activeN - 1) * 100}${VU})`;
    }

    updateChrome();

    // Toggle playing status: play active, pause/reset others
    scenes.forEach(s => {
      if (s.video) {
        if (s.n === activeN && !reduce) {
          s.video.play().catch(() => {});
        } else {
          s.video.pause();
          s.video.currentTime = 0;
        }
      }
    });

    // Trigger progressive animation of active slide assets
    scenes.forEach(s => {
      s.el.classList.toggle('is-active', s.n === activeN);
      if (s.n === activeN) {
        // Trigger reveal animations
        s.el.querySelectorAll('.eyebrow, .scene__title, .scene__body, .hero__title, .hero__sub, .hero__client, .close__title, .close__cta, .close__logo, .close__site')
          .forEach((node, i) => {
            node.classList.remove('in');
            setTimeout(() => node.classList.add('in'), reduce ? 0 : 50 + i * 60);
          });

        s.el.querySelectorAll('[data-reveal]').forEach((node, i) => {
          node.classList.remove('in');
          setTimeout(() => node.classList.add('in'), reduce ? 0 : i * 70);
        });

        try { s.mod && s.mod.enter && s.mod.enter(s.el); } catch (e) {}
        animateProgress(s);
      } else {
        s.p = 0;
        if (s.animFrame) {
          cancelAnimationFrame(s.animFrame);
          s.animFrame = null;
        }
        try { s.mod && s.mod.progress && s.mod.progress(0, s.el); } catch (e) {}
        
        // Remove text reveal classes to enable re-triggering later
        s.el.querySelectorAll('.eyebrow, .scene__title, .scene__body, .hero__title, .hero__sub, .hero__client, .close__title, .close__cta, .close__logo, .close__site, [data-reveal]')
          .forEach(node => node.classList.remove('in'));
      }
    });
  }

  // Smoothly interpolate progress variable p from 0 to 1
  function animateProgress(s) {
    if (s.animFrame) cancelAnimationFrame(s.animFrame);
    if (reduce) {
      s.p = 1;
      try { s.mod && s.mod.progress && s.mod.progress(1, s.el); } catch (e) {}
      return;
    }

    const duration = 1200; // 1.2s animation
    const t0 = performance.now();
    const startP = s.p;

    function tick(t) {
      const elapsed = t - t0;
      const k = clamp(elapsed / duration);
      const easedK = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2; // easeInOut
      const curP = startP + (1 - startP) * easedK;
      s.p = curP;
      try { s.mod && s.mod.progress && s.mod.progress(curP, s.el); } catch (e) {}

      if (k < 1) {
        s.animFrame = requestAnimationFrame(tick);
      } else {
        s.animFrame = null;
      }
    }
    s.animFrame = requestAnimationFrame(tick);
  }

  function updateChrome() {
    // Fill progress bar
    if (fill) {
      const globalProgress = (activeN - 1) / (scenes.length - 1);
      fill.style.transform = `scaleX(${globalProgress})`;
    }

    // Toggle topbar styling
    if (topbar) {
      topbar.classList.toggle('is-scrolled', activeN > 1);
    }

    // Update dots rail active state
    dots.forEach((d, i) => d.classList.toggle('is-active', scenes[i].n === activeN));

    // Map current active index to the 5 hardcoded menu options
    const navMapping = {
      1: 3, 2: 3, 3: 3, // O Programa (Hero, Problema, Virada)
      4: 4,             // A Jornada
      5: 5, 6: 5, 7: 5, // Bancada STTB-01 / Tecnologia / Digital
      8: 8, 9: 8,       // Resultados / Comparativo
      10: 10, 11: 10    // Investimento / Fecho
    };

    const targetN = navMapping[activeN] || activeN;
    navItems.forEach(btn => {
      const btnTarget = +btn.dataset.target;
      btn.classList.toggle('is-active', btnTarget === targetN);
    });

    // Set accent color dynamically
    const currentScene = scenes[activeN - 1];
    if (currentScene) {
      document.documentElement.style.setProperty('--accent',
        getComputedStyle(currentScene.el).getPropertyValue('--accent') || '#B46E3C');
    }
  }

  function buildChrome() {
    fill = document.querySelector('.progress__fill');
    topbar = document.querySelector('.topbar');
    nav = document.getElementById('nav');
    rail = document.getElementById('rail');

    // Build side dot rail elements
    scenes.forEach(s => {
      const label = s.el.dataset.label || ('Cena ' + s.n);
      const d = document.createElement('button');
      d.className = 'rail__dot';
      d.innerHTML = `<span class="rail__lbl">${label}</span><i></i>`;
      d.addEventListener('click', () => goToScene(s.n));
      rail.appendChild(d);
      dots.push(d);
    });

    // Bind clicks to top navigation items
    if (nav) {
      navItems = Array.from(nav.querySelectorAll('.nav__item'));
      navItems.forEach(btn => {
        const target = +btn.dataset.target;
        btn.addEventListener('click', () => goToScene(target));
      });
    }

    // Intercept any internal hash links
    document.querySelectorAll('a[href^="#cena-"]').forEach(a => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        const num = +a.getAttribute('href').replace('#cena-', '');
        if (num) goToScene(num);
      });
    });

    // Intercept brand home link
    const brand = document.querySelector('.brand');
    if (brand) {
      brand.addEventListener('click', (e) => {
        e.preventDefault();
        goToScene(1);
      });
    }
  }

  buildChrome();

  // Initialize the first page active
  goToScene(1);

  // Wheel listener with cooldown lock
  window.addEventListener('wheel', (e) => {
    const now = performance.now();
    if (now - lastTransitionTime < cooldown) return;

    if (Math.abs(e.deltaY) > 20) {
      if (e.deltaY > 0) {
        goToScene(activeN + 1);
      } else {
        goToScene(activeN - 1);
      }
    }
  }, { passive: true });

  // Swipe touch gestures (Mobile) — consciente de scroll interno
  let touchStartY = 0, touchScrollEl = null;
  window.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
    touchScrollEl = e.target.closest ? e.target.closest('.js-scroll') : null;
  }, { passive: true });

  window.addEventListener('touchend', (e) => {
    const touchEndY = e.changedTouches[0].clientY;
    const diffY = touchStartY - touchEndY;
    const now = performance.now();
    if (now - lastTransitionTime < cooldown) return;
    if (Math.abs(diffY) <= 40) return;

    // Se o gesto começou num container rolável que ainda pode rolar naquele
    // sentido, deixa ele rolar em vez de trocar de cena.
    if (touchScrollEl && touchScrollEl.scrollHeight > touchScrollEl.clientHeight + 2) {
      const atTop = touchScrollEl.scrollTop <= 0;
      const atBottom = touchScrollEl.scrollTop + touchScrollEl.clientHeight >= touchScrollEl.scrollHeight - 1;
      if (diffY > 0 && !atBottom) return;   // swipe p/ cima (próxima) mas ainda há conteúdo abaixo
      if (diffY < 0 && !atTop) return;      // swipe p/ baixo (anterior) mas ainda há conteúdo acima
    }

    if (diffY > 0) goToScene(activeN + 1);
    else goToScene(activeN - 1);
  }, { passive: true });

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    const now = performance.now();
    if (now - lastTransitionTime < cooldown) return;

    if (e.key === 'ArrowDown' || e.key === 'PageDown' || (e.key === ' ' && !e.shiftKey)) {
      e.preventDefault();
      goToScene(activeN + 1);
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp' || (e.key === ' ' && e.shiftKey)) {
      e.preventDefault();
      goToScene(activeN - 1);
    } else if (e.key === 'Home') {
      e.preventDefault();
      goToScene(1);
    } else if (e.key === 'End') {
      e.preventDefault();
      goToScene(scenes.length);
    }
  });

  // Re-align on window resize
  window.addEventListener('resize', () => {
    const world = document.getElementById('world');
    if (world && activeN !== -1) {
      world.style.transform = `translateY(-${(activeN - 1) * 100}${VU})`;
    }
  });
}
