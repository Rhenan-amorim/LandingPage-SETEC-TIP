/* ============================================================================
   modals.js — janelas/popups reutilizáveis com o conteúdo integral da proposta.
   Abrir: qualquer elemento com [data-modal="modal-xxx"].
   Conteúdo: <div class="modal-def" id="modal-xxx" hidden>…</div> no final do body.
   Fecha por X, clique no overlay ou ESC. Bloqueia a navegação do deck enquanto aberto.
   ========================================================================== */

export function initModals() {
  const root = document.createElement('div');
  root.className = 'mdl';
  root.id = 'mdl-root';
  root.setAttribute('aria-hidden', 'true');
  root.innerHTML =
    '<div class="mdl__overlay" data-mdl-close></div>' +
    '<div class="mdl__dialog" role="dialog" aria-modal="true" aria-labelledby="mdl-title">' +
      '<button class="mdl__close" data-mdl-close aria-label="Fechar">&times;</button>' +
      '<div class="mdl__body" id="mdl-body"></div>' +
    '</div>';
  document.body.appendChild(root);
  const body = root.querySelector('#mdl-body');
  let open = false;

  function openModal(id) {
    const src = document.getElementById(id);
    if (!src) { console.warn('modal não encontrado:', id); return; }
    body.innerHTML = src.innerHTML;
    root.dataset.mdl = id;
    root.classList.add('is-open');
    root.setAttribute('aria-hidden', 'false');
    open = true;
    body.scrollTop = 0;
  }
  function closeModal() {
    root.classList.remove('is-open');
    root.setAttribute('aria-hidden', 'true');
    open = false;
  }

  document.addEventListener('click', e => {
    const trg = e.target.closest('[data-modal]');
    if (trg) { e.preventDefault(); openModal(trg.getAttribute('data-modal')); return; }
    if (e.target.closest('[data-mdl-close]')) closeModal();
  });

  // Bloqueia a navegação do deck (wheel/keydown/touch no window) enquanto o modal estiver aberto.
  window.addEventListener('keydown', e => {
    if (!open) return;
    if (e.key === 'Escape') closeModal();
    e.stopImmediatePropagation();
  }, true);
  window.addEventListener('wheel', e => { if (open) e.stopImmediatePropagation(); }, { capture: true, passive: true });
  window.addEventListener('touchmove', e => { if (open) e.stopImmediatePropagation(); }, { capture: true, passive: true });

  return { openModal, closeModal };
}
