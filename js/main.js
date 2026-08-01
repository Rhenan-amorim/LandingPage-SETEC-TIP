/* main.js — boot: liga config (cliente) + engine (scroll) + módulos de cena + modais */
import { CONFIG } from '../config.js?v=3';
import { initEngine } from './engine.js?v=3';
import { sceneModules, applyClientChrome } from './scenes.js?v=3';
import { initModals } from './modals.js?v=3';
import { initCursor } from './cursor.js?v=3';

applyClientChrome(CONFIG);
initEngine(CONFIG, sceneModules);
initModals();
initCursor();
initCreditPopover();

function initCreditPopover() {
  const trigger = document.getElementById('credit-trigger');
  const popover = document.getElementById('credit-popover');
  if (!trigger || !popover) return;

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    const isActive = popover.classList.contains('is-active');
    popover.classList.toggle('is-active', !isActive);
    trigger.setAttribute('aria-expanded', !isActive ? 'true' : 'false');
  });

  document.addEventListener('click', (e) => {
    if (!popover.contains(e.target) && e.target !== trigger) {
      popover.classList.remove('is-active');
      trigger.setAttribute('aria-expanded', 'false');
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      popover.classList.remove('is-active');
      trigger.setAttribute('aria-expanded', 'false');
    }
  });
}
