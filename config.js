/* ============================================================================
   config.js — CAMADA CLIENTE (variável) da LP SETEC TIP®
   ----------------------------------------------------------------------------
   Fonte: BRIEFING.md §6. Tudo que muda por cliente vive AQUI. Para reaproveitar
   o site para outro cliente, duplique este arquivo e troque:
     cliente, logoCliente, heroEyebrowCliente, ativoExemplo, dashboard,
     scorecard, investimento.
   O ROTEIRO/PRODUTO (as 11 cenas, a copy do TIP®) NÃO muda — vive em js/scenes.js.
   ============================================================================ */

export const CONFIG = {
  cliente: "Baker Hughes",
  logoCliente: "logos/baker-hughes.svg",       // opcional; se ausente, o site esconde o slot
  heroEyebrowCliente: "Preparado para Baker Hughes",
  corAcento: "#B46E3C",                          // cobre SETEC (padrão da marca)

  // Ativo de exemplo usado nos mockups digitais (Cena 7)
  ativoExemplo: {
    id: "BH-HST-0018",
    serie: "BH4589211",
    base: "Macaé",
    disponibilidade: 99,
    ultimaManut: "15/08/2026",
    proxima: "15/02/2027",
    horas: 2348
  },

  // Dashboard Executivo (Cena 7) — números de exemplo
  dashboard: {
    cadastrados: 50, disponiveis: 47, manutencao: 2, teste: 1, certificados: 48,
    sla: 100, dispOperacional: 98.6, tempoMedioDias: 3.4,
    os: { abertas: 3, andamento: 2, concluidas: 187, aguardandoPecas: 1 }
  },

  // Scorecard executivo / KPIs (Cena 8) — valor atingido + meta
  scorecard: {
    disponibilidade: 99.2, sla: 98.7, mttr: 3.1, mtbf: "+14%", retrabalho: 0.8,
    certificados: 100, ncCriticas: 0, satisfacao: 98
  },

  // Modelo comercial (Cena 10)
  investimento: {
    porAtivoMes: 27600,      // R$ por ativo/mês
    minimoAtivos: 10,
    capacidadeAtivos: 50,
    estruturaInternaMes: 80000  // comparativo "montar internamente"
  },

  // Contato / CTA (Cena 11)
  contato: {
    ctaPrimario: { label: "Agendar apresentação", href: "mailto:contato@gruposetec.net?subject=Apresentação%20TIP%C2%AE%20—%20Baker%20Hughes" },
    ctaSecundario: { label: "Falar com a engenharia", href: "mailto:contato@gruposetec.net" },
    site: "gruposetec.net"
  }
};
