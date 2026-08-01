# BRIEFING — Landing Page "SETEC Torque Integrity Program (TIP®)"
### Site-proposta scrollytelling (voo contínuo por cenas) · Cliente: Baker Hughes · Reaproveitável

> Este documento é a **fonte única de verdade** do projeto. Contém: contexto, arquitetura,
> sistema de marca, o conteúdo curado da proposta, o **roteiro cena a cena** (copy +
> animação de scroll + still + vídeo Seedance), a **config do cliente** e o **mapa de vídeos**.
> As fotos de origem estão em `/fotos_origem`. Os assets gerados vão para `/assets_gerados`.

---

## 1. VISÃO GERAL
- **O que é:** landing page de página única, tipo *scroll-through world* (câmera "voa" de fora
  para dentro de cada cena, sem cortes, dirigida pela rolagem — técnica das páginas de produto da Apple),
  apresentando o programa **SETEC Torque Integrity Program (TIP®)** da **Setec Marine Service**.
- **Objetivo:** servir como **proposta apresentável** — prender pelo cinematográfico e, a partir daí,
  entregar conteúdo técnico/comercial sóbrio e data-forward (comprador industrial de contrato milionário).
- **Cliente atual:** Baker Hughes. **Reaproveitável:** construir **config-driven**, com a Baker Hughes
  como 1ª "skin" (ver seção 6). Trocar de cliente = trocar um arquivo de config + logo + dados de exemplo.
- **Idioma:** português do Brasil.

## 2. ARQUITETURA E STACK
- **Skill base:** usar a skill **scroll-world** (github.com/oso95/scroll-world) — traz o motor de
  scroll-scrub (vanilla JS, seam-locked), os templates de prompt e o pipeline Higgsfield.
- **Geração de vídeo:** **Higgsfield**, modelo **Seedance 2.0** (image-to-video, capaz de "frame-lock"
  as emendas entre cenas). Usar o **MCP do Higgsfield** (`generate_video`, model `seedance_2_0`).
- **Stills das cenas:** priorizar as **fotos reais** de `/fotos_origem`. Onde não houver foto, gerar
  still no Higgsfield (GPT Image) coerente com a marca.
- **Duas camadas de conteúdo:**
  - **PRODUTO (fixa):** todo o roteiro do TIP® — vale para qualquer cliente.
  - **CLIENTE (variável):** nome, logo, dados de exemplo do dashboard, scorecard, investimento → em `config.js`.
- **Performance:** lazy-load dos vídeos, `blob-seek` do motor scroll-world, versão **mobile** em 9:16
  (cadeia própria, não crop) e animação pesada só no desktop. Poster/fallback estático em telas fracas.
- **Entrega:** site estático (HTML/JS/CSS) rodável localmente e publicável (ex.: Vercel/Netlify).

## 3. SISTEMA DE MARCA (Grupo SETEC)
- **Cores:** azul-noite `#0E2334` (base/overlay), azul-marinho `#1F4E79` (apoio), **cobre `#B46E3C`**
  (acento/1 palavra-chave, selos, números-chave), creme `#ECE6D6` e branco (texto sobre escuro).
- **Tipografia:** sans-serif geométrica bold (Outfit / Poppins). Números e dados com peso alto; rótulos
  em caixa-alta com tracking. Um mono discreto (DM Mono) para labels técnicos/legendas.
- **Logo:** usar `/logos/GS_logo_completa_clara_transparente.png` (creme, p/ fundo escuro) e
  `GS_simbolo_claro_transparente.png` (só o símbolo GS). **Nunca recriar/alterar** a logo.
- **Tom:** autoridade naval/industrial séria, premium, engenharia orientada a dados. Nada de "promoção".

---

## 4. CONTEÚDO CURADO DO TIP® (fatos que vão no site)
**Empresa:** Setec Marine Service — engenharia de manutenção, inspeção, certificação e gestão da
integridade de ativos (offshore, óleo & gás, naval, industrial, energia). Pilares: **Segurança Operacional,
Engenharia Aplicada, Gestão de Ativos, Melhoria Contínua**. Filosofia: *Asset Integrity Management*.

**O problema (modelo reativo):** equipamento só vai à manutenção após falhar → custos imprevisíveis,
longa indisponibilidade, baixa rastreabilidade, sem histórico, difícil gestão. Falhas em equipamentos de
torque geram: interrupção de operação, mobilização cara, risco às equipes, danos a ativos, perda de produtividade.

**O que é o TIP®:** programa completo de gestão da integridade de equipamentos hidráulicos de torque —
administra todo o ciclo de vida. Cada ativo passa a ter: histórico técnico completo, identificação individual,
**rastreabilidade digital (QR Code)**, plano preventivo e corretivo, indicadores de desempenho, certificação,
controle documental, gestão da vida útil.

**Centro Técnico — fluxo do ativo:** Recebimento → Cadastro → Inspeção Inicial → Desmontagem →
Limpeza Técnica → Inspeção dos Componentes → Avaliação Técnica → Substituição → Montagem →
Testes Hidráulicos → Testes Funcionais → Certificação → Controle de Qualidade → Expedição.
Classificação na entrada: **Classe A** (preventiva), **B** (troca de itens de desgaste), **C** (corretiva),
**D** (avaliação de engenharia).

**Instrumentação:** paquímetros e micrômetros digitais, relógios comparadores, torquímetros e manômetros
calibrados, bombas hidráulicas de teste — todos rastreados/calibrados.

**Bancada de Testes STTB-01 (Smart Torque Test Bench):** mede o **torque REAL** aplicado pela ferramenta.
- Componentes: **Power Pack Hidráulico**, **Ferramenta de Torque** (CRP), **Transdutor de Torque**,
  **Bloco de Reação**, **Painel Elétrico**, **Sistema de Aquisição de Dados (DAQ)**.
- Instrumentos: Transdutor de Torque (±0,25% FS, 0–20.000 N.m), Manômetro Digital (0,25% FS, 0–3000 bar),
  Transdutor de Pressão (0,25% FS, 0–3000 bar), Sensor de Temperatura (-40 a 150 °C),
  DAQ (≥100 Hz; canais Torque, Pressão, Temperatura, Tempo).
- Specs da bancada: Torque máx **20.000 N.m** (ex.), Pressão máx **3000 bar**, Precisão Torque/Pressão **±0,25% FS**,
  Aquisição **≥100 Hz**, Alimentação **380 VAC – 60 Hz**, Dimensões **2500×1200×1800 mm** (ex.), Peso **~1200 kg**.
- Software de ensaio: curva **Pressão × Torque em tempo real**, registro automático dos ensaios,
  relatório técnico automático, gráfico de repetibilidade, emissão de certificado de desempenho, histórico.

**Engenharia de Confiabilidade:** análise de falhas, investigação de **causa raiz**, banco de dados de falhas,
**MTBF/MTTR**, engenharia preventiva, monitoramento de vida útil. Ciclo de melhoria contínua:
Coleta de Dados → Inspeção → Análise de Falhas → Causa Raiz → Ação → Monitoramento → Maior Confiabilidade.

**Ecossistema Digital:** **QR Code individual** por ativo, **Portal do Cliente GS**, **Dashboard Executivo**,
**App mobile**. Exemplo de ativo (dados p/ mockup): `BH-HST-0018` · série `BH4589211` · base **Macaé** ·
disponibilidade **99%** · última manutenção **15/08/2026** · próxima **15/02/2027** · **2.348 h** de operação.

**Dashboard Executivo (exemplo):** 50 cadastrados · 47 disponíveis · 2 em manutenção · 1 em teste ·
48 certificados · SLA 100% · disponibilidade 98,6% · tempo médio 3,4 dias. OS: 3 abertas, 2 em andamento,
187 concluídas, 1 aguardando peças.

**KPIs / SLAs (scorecard executivo):** Disponibilidade **≥98% (99,2%)** · SLA cumprido **≥95% (98,7%)** ·
MTTR **≤4 dias (3,1)** · MTBF **tendência +14%** · Retrabalho **≤2% (0,8%)** · Aprovação na 1ª inspeção **≥95%** ·
Certificados no prazo **100%** · NC críticas **0** · Satisfação **≥95% (98%)**.
Matriz de prioridade: **Crítica → até 48h** para diagnóstico e plano de ação.

**Governança/Equipe:** Diretor Executivo → Gerente do Contrato → Engenharia / Qualidade / PCM →
Supervisor Técnico → Técnicos Mecânicos, Inspetores, Documentação. Matriz RACI. Responsável Técnico (ART).

**Modelo comercial:** **R$ 27.600,00 por ativo/mês** (prestação continuada), **mínimo 10 ativos**.
Referência: 10 = R$ 276 mil/mês (R$ 3,312 mi/ano) · 20 = R$ 552 mil (R$ 6,624 mi) · 30 = R$ 828 mil (R$ 9,936 mi) ·
40 = R$ 1,104 mi (R$ 13,248 mi) · 50 (capacidade) = R$ 1,38 mi/mês (**R$ 16,56 mi/ano**).
Comparativo: montar a estrutura internamente ≈ **R$ 80.000/mês**. **Não contemplado:** peças/componentes,
componentes hidráulicos de alto valor, recuperações estruturais/soldagem/usinagem especiais, mobilizações
offshore não previstas, emergências em campo (orçadas à parte).

---

## 5. ROTEIRO DO SITE — CENAS (copy + scroll + still + vídeo)
> Cada CENA = 1 still (foto real ou gerada) + 1 clipe de "mergulho" (Seedance 2.0) + conectores entre cenas
> (gerados a partir dos frames reais das cenas vizinhas, p/ emenda idêntica — regra da skill scroll-world).

### CENA 1 — HERO "Do contêiner ao offshore"
- **Eyebrow:** `SETEC TORQUE INTEGRITY PROGRAM · TIP®`
- **Título:** **A integridade dos seus equipamentos de torque começa antes da falha.**
- **Subtexto:** Programa integrado de gestão da integridade, manutenção, testes, certificação e
  confiabilidade de equipamentos hidráulicos de torque.
- **Eyebrow cliente (config):** "Preparado para Baker Hughes"
- **Still:** `05_container_vermelho_cais.jpg` (contêiner fechado no cais). *Alternativa:* `07_caixa_CRP_fechada_cais.jpg`.
- **Vídeo (Seedance 2.0):** câmera se aproxima do contêiner vermelho no cais → a tampa/lateral abre →
  revela a ferramenta CRP amarela dentro → a câmera "entra" e a ferramenta é destacada. (≈6–8s)

### CENA 2 — O PROBLEMA (a dor do modelo reativo)
- **Título:** No modelo tradicional, o equipamento só volta pra manutenção **depois que falha.**
- **Corpo:** interrupção de operação · mobilização cara · risco às equipes · perda de produtividade ·
  custos imprevisíveis · sem histórico · baixa rastreabilidade.
- **Scroll:** fundo escuro; palavras de impacto entram uma a uma; linha de "falha" (SVG) despenca; alerta em cobre.
- **Still:** `06_ferramenta_CRP_closeup.jpg` tratada em tom sombrio/industrial.
- **Vídeo:** câmera lenta ao redor da ferramenta em ambiente escuro de oficina, clima de tensão.

### CENA 3 — A VIRADA (o conceito TIP®)
- **Título:** Deixe de consertar. Passe a **gerenciar a integridade.**
- **Corpo:** Asset Integrity Management — cada equipamento vira um ativo estratégico, com histórico,
  plano preventivo e rastreabilidade. Pilares: Segurança, Engenharia Aplicada, Gestão de Ativos, Melhoria Contínua.
- **Scroll:** "vira a chave" — o cinza reativo desliza e dá lugar ao azul-noite + cobre do TIP®.
- **Still/Vídeo:** transição da ferramenta saindo do escuro para uma bancada iluminada e limpa.

### CENA 4 — A JORNADA DO ATIVO (coração do site)
- **Título:** Um fluxo padronizado, do **recebimento** à **expedição.**
- **Etapas (cards):** Recebimento · Inspeção · Desmontagem · Limpeza Técnica · Inspeção de Componentes ·
  Montagem · Testes Hidráulicos · Certificação · Expedição.
- **Scroll:** **scroll horizontal com pin** — a ferramenta "anda" pela linha do tempo; cada etapa entra
  com uma frase + evidência visual (foto/clipe).
- **Still/Vídeo:** micro-clipes de cada etapa (gerar no Seedance a partir de stills das estações;
  onde tiver foto real da etapa, usar). Câmera acompanha o ativo avançando.

### CENA 5 — A BANCADA STTB-01 (produto-herói)
- **Título:** **Smart Torque Test Bench** — medimos o torque **REAL** aplicado pela ferramenta.
- **Specs (destaque):** 20.000 N.m · 3000 bar · ±0,25% FS · ≥100 Hz.
- **Componentes (rótulos):** Power Pack · Transdutor de Torque · Bloco de Reação · DAQ · Painel Elétrico.
- **Scroll:** **exploded view** — a bancada "se abre" nos componentes com rótulos; a **curva Pressão × Torque
  desenha em tempo real** (faixas Lim. Superior/Inferior); painel com números subindo (PRESSÃO 1500 bar / TORQUE 4560 N.m).
- **Still:** `01_bancada_STTB-01_infografico.jpg` (base perfeita — cada componente vira asset animável).
- **Vídeo:** câmera aproxima e orbita a bancada; foco nos componentes CRP/transdutor.

### CENA 6 — ENGENHARIA DE CONFIABILIDADE
- **Título:** Cada falha vira **aprendizado.**
- **Corpo:** análise de causa raiz · banco de dados de falhas · MTBF/MTTR · engenharia preventiva.
- **Scroll:** o **ciclo de melhoria contínua** como anel que se desenha e gira
  (Coleta → Inspeção → Análise → Causa Raiz → Ação → Monitoramento → +Confiabilidade).

### CENA 7 — ECOSSISTEMA DIGITAL (QR + Portal + Dashboard + App)
- **Título:** Rastreabilidade total, **na palma da mão.**
- **Corpo:** QR Code individual · Portal do Cliente GS · Dashboard Executivo · App mobile.
- **Scroll:** um **QR Code** é escaneado (feixe) → "abre" a tela do equipamento (BH-HST-0018, 99%,
  certificados) → mockups de dashboard/celular deslizam com parallax.
- **Still/Vídeo:** gerar mockups na identidade SETEC (Dashboard Executivo, Tela do Equipamento, Timeline,
  SLA, App) — dados da config. Câmera "entra" na tela do dashboard.

### CENA 8 — RESULTADOS (KPIs/SLAs)
- **Título:** Gestão orientada por **desempenho.**
- **Números (count-up):** Disponibilidade 99,2% · SLA 98,7% · MTTR 3,1 dias · Retrabalho 0,8% ·
  Certificados 100% · NC críticas 0.
- **Scroll:** números sobem ao entrar; barras enchem; selos ficam verdes (scorecard executivo).

### CENA 9 — TRADICIONAL × TIP® / COMPARATIVO DE VALOR
- **Título:** Do reparo pontual à **gestão contínua do ativo.**
- **Corpo:** tabela Modelo Tradicional × TIP® (manutenção corretiva→gestão contínua; histórico limitado→permanente;
  sem indicadores→KPIs; custos imprevisíveis→previsibilidade). "Estrutura interna equivalente ≈ R$ 80 mil/mês."
- **Scroll:** split 50/50 que se preenche linha a linha; a coluna TIP® acende em cobre.

### CENA 10 — O INVESTIMENTO
- **Título:** **R$ 27.600** por ativo/mês. Mínimo **10 ativos.**
- **Scroll:** **slider/scroll interativo de 10 → 50 ativos** atualizando os valores
  (R$ 276 mil → R$ 1,38 mi/mês; anual R$ 3,312 mi → R$ 16,56 mi). Cada ativo aparece como um "cubo" empilhando.

### CENA 11 — FECHO / CTA
- **Título:** Do recebimento ao retorno à operação — a Setec cuida da **integridade de cada ativo.**
- **CTA:** "Agendar apresentação" / contato · logo GS.
- **Scroll:** a ferramenta volta pro contêiner (fecha o ciclo do Hero) e a tampa se fecha com o selo TIP®.

---

## 6. CONFIG DO CLIENTE (arquivo `config.js` — camada variável)
```js
export const CONFIG = {
  cliente: "Baker Hughes",
  logoCliente: "logos/baker-hughes.svg",      // adicionar se disponível
  heroEyebrowCliente: "Preparado para Baker Hughes",
  corAcento: "#B46E3C",                         // cobre SETEC (padrão)
  ativoExemplo: { id: "BH-HST-0018", serie: "BH4589211", base: "Macaé",
                  disponibilidade: 99, ultimaManut: "15/08/2026", proxima: "15/02/2027", horas: 2348 },
  dashboard: { cadastrados: 50, disponiveis: 47, manutencao: 2, teste: 1, certificados: 48,
               sla: 100, dispOperacional: 98.6, tempoMedioDias: 3.4,
               os: { abertas: 3, andamento: 2, concluidas: 187, aguardandoPecas: 1 } },
  scorecard: { disponibilidade: 99.2, sla: 98.7, mttr: 3.1, mtbf: "+14%", retrabalho: 0.8,
               certificados: 100, ncCriticas: 0, satisfacao: 98 },
  investimento: { porAtivoMes: 27600, minimoAtivos: 10, capacidadeAtivos: 50 }
};
```
> **Reaproveitar:** duplique `config.js`, troque `cliente`, `logoCliente`, `ativoExemplo`, `dashboard`,
> `scorecard` (por dados de exemplo neutros) e o site inteiro se re-veste. O roteiro/produto não muda.

---

## 7. MAPA DE CENAS → VÍDEOS (Higgsfield · Seedance 2.0)
> Regra de emenda (scroll-world): o último frame de um clipe = primeiro frame do conector seguinte.
> Gerar os conectores a partir dos frames reais das cenas vizinhas. Todos os vídeos: horizontal 16:9
> **sempre em 16:9 e sem áudio**. **FASE ATUAL: apenas desktop 16:9 — não gerar a cadeia mobile 9:16 agora** (fica para uma fase futura). Prompts em inglês (rendem melhor).

| # | Cena | Still (origem) | Prompt Seedance (movimento de câmera) | Dur. |
|---|------|----------------|----------------------------------------|------|
| V1 | Hero contêiner | `05_container_vermelho_cais.jpg` | Cinematic push-in toward a closed red offshore container on a dock (ship + crane behind); the lid opens revealing a yellow CRP hydraulic torque tool inside; camera flies in and locks on the tool. | 7s |
| V2 | Problema | `06_ferramenta_CRP_closeup.jpg` | Slow moody orbit around a worn yellow hydraulic torque tool in a dark workshop, dramatic low light, industrial tension. | 5s |
| V3 | Virada | (frame final V2) | Camera pulls the tool out of darkness into a clean, well-lit inspection bench; light and color rise (navy + copper). | 5s |
| V4 | Jornada do ativo | stills das estações | Continuous side-tracking shot following the tool advancing along stations (receiving → inspection → disassembly → cleaning → assembly → hydraulic test → certification). | 8s |
| V5 | Bancada STTB-01 | `01_bancada_STTB-01_infografico.jpg` / foto da bancada | Camera pushes in and slowly orbits the hydraulic torque test bench; focus on transducer, reaction block and DAQ; clean industrial lighting. | 7s |
| V6 | Confiabilidade | still gerado (anel) | Camera flies around a glowing continuous-improvement ring/diagram in dark space, data particles. | 5s |
| V7 | Digital | mockups gerados | Camera dives into a QR code that opens into a dashboard/phone UI; screens slide in with parallax. | 6s |
| V8 | Resultados | still gerado (scorecard) | Gentle push toward a dark executive scorecard; bars fill, green status seals light up. | 4s |
| V11 | Fecho | `04_kit_dentro_container.jpg` + `05_...` | Reverse of V1: the tool returns into the red container, lid closes, TIP® seal stamps on top. | 6s |

> **Stills sem foto (V6, V7, V8):** gerar no Higgsfield (GPT Image) em isométrico/UI escuro, paleta da marca.
> **Créditos:** a skill estima o total antes de gerar — **aprovar o orçamento** antes de disparar.

---

## 8. FOTOS DE ORIGEM (em `/fotos_origem`)
1. `01_bancada_STTB-01_infografico.jpg` — infográfico da bancada (specs + componentes) → **Cena 5** (base do exploded view).
2. `02_ferramenta_CRP_carrinho_a.jpg` — ferramenta CRP no carrinho, ângulo 1 → apoio Cenas 2/4.
3. `03_ferramenta_CRP_carrinho_b.jpg` — ferramenta CRP no carrinho c/ "CRP Subsea", ângulo 2 → apoio Cenas 2/4.
4. `04_kit_dentro_container.jpg` — kit dentro do contêiner vermelho aberto → **Cena 1/11** (reveal e fecho).
5. `05_container_vermelho_cais.jpg` — contêiner "20241134" no cais → **Cena 1** (hero) e **11** (fecho).
6. `06_ferramenta_CRP_closeup.jpg` — close-up da ferramenta CRP → **Cena 2** (dor) e beauty shot.
7. `07_caixa_CRP_fechada_cais.jpg` — caixa CRP Subsea vermelha fechada no cais (W16188-1) → **alternativa/adicional** para o hero (Cena 1) e o fecho (Cena 11).

## 9. REQUISITOS TÉCNICOS / ENTREGA
- Página única, config-driven; motor de scroll da skill scroll-world (scrub por blob-seek, lazy-load, crossfade de emenda).
- **Mobile:** cadeia 9:16 nativa (não crop); nas telas fracas, servir poster + reduzir cenas pesadas.
- **Acessibilidade/performance:** textos como HTML real (não dentro do vídeo), contraste conforme marca,
  `prefers-reduced-motion` respeitado (fallback para stills).
- **SEO/social:** título, descrição, og:image (usar um frame do hero).
- **Deploy:** buildar estático e deixar pronto para Vercel/Netlify. README com como rodar local.

## 10. CHECKLIST DE CONCLUSÃO (o agente deve validar)
- [ ] Skill scroll-world instalada e Higgsfield (MCP) autenticado, com créditos e orçamento aprovado.
- [ ] Fotos presentes em `/fotos_origem` com os nomes corretos — **incluindo `01_bancada_STTB-01_infografico.jpg` (o infográfico da bancada; ainda pendente)**.
- [ ] `config.js` criado com os dados da Baker Hughes (seção 6).
- [ ] 11 cenas implementadas na ordem, com a copy exata da seção 5.
- [ ] Vídeos V1–V11 gerados no Seedance 2.0 em **16:9** e **SEM ÁUDIO** (faixa removida no encode), com emendas frame-locked — **somente desktop nesta fase (sem 9:16)**.
- [ ] Curva Pressão × Torque e count-ups de KPIs funcionando.
- [ ] Slider de investimento 10→50 ativos calculando certo.
- [ ] Logo GS aplicada (nunca recriada); paleta e tipografia da marca.
- [ ] Mobile testado; `prefers-reduced-motion` com fallback; build estático rodando.

---

## 11. DEPLOY
Passo a passo de rodar local e publicar (Vercel/Netlify), assets grandes, checklist e troubleshooting: ver **`README_DEPLOY.md`** nesta pasta.
