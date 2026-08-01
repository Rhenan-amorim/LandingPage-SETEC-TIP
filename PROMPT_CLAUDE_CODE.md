# PROMPT PARA O CLAUDE CODE — Landing Page SETEC TIP®

> Cole o texto abaixo no Claude Code, **com esta pasta (`LP_SETEC_TIP`) aberta como diretório do projeto**.
> Ele vai ler o `BRIEFING.md`, usar as fotos de `/fotos_origem`, instalar a skill scroll-world e gerar
> os vídeos no Higgsfield (Seedance 2.0).

---

Você é um especialista em sites com design premium e animações de scroll (scrollytelling).
Vamos construir uma **landing page-proposta scroll-through** para o **SETEC Torque Integrity Program (TIP®)**.

## Contexto e fonte de verdade
- Leia integralmente o arquivo **`BRIEFING.md`** desta pasta. Ele é a fonte única: contém o roteiro
  cena a cena, a copy exata, o sistema de marca, a config do cliente e o mapa de vídeos. Siga-o à risca.
- As **fotos de origem** estão em `/fotos_origem` (ver `LEIA-ME_FOTOS.md` para o mapeamento).
- As **logos** estão em `/logos` (use como estão; nunca recrie a logo).
- Salve assets gerados em `/assets_gerados/videos` e `/assets_gerados/imagens`.

## Skill de base (instale e use)
Instale e utilize a skill **scroll-world** (motor de scroll-scrub seam-locked + pipeline Higgsfield):
```
/plugin marketplace add oso95/scroll-world
/plugin install scroll-world@scroll-world
```
Use o motor de scroll (scrub-engine.js), os templates de prompt e o pipeline dela como base da montagem.

## Geração de vídeo (obrigatório)
- **TODOS os vídeos SEM ÁUDIO (mudos):** gerar sem trilha e remover a faixa de áudio no encode (`ffmpeg -an`); no HTML usar `muted` + `playsinline`.
- **TODOS os vídeos em 16:9** (`aspect_ratio: "16:9"` no Seedance) — é o formato do site.
- Gere TODOS os vídeos com o **MCP do Higgsfield**, modelo **`seedance_2_0`** (image-to-video).
- Siga o **"Mapa de cenas → vídeos" (seção 7 do BRIEFING)**: um clipe de mergulho por cena + os conectores
  entre cenas, gerados a partir dos frames reais das cenas vizinhas (emenda frame-locked — regra da skill).
- Use as **fotos reais** de `/fotos_origem` como still/quadro inicial de cada cena que tiver foto.
  Para as cenas sem foto (V6 confiabilidade, V7 digital, V8 resultados), gere o still no Higgsfield
  (GPT Image) em estética isométrica/UI escura na paleta da marca.
- **FASE ATUAL = DESKTOP 16:9 APENAS.** Gere somente a cadeia 16:9 (sem áudio). **NÃO gere a cadeia mobile 9:16** agora (economiza créditos) — a versão mobile virá numa fase futura.
- **ANTES de gerar qualquer coisa:** cheque o saldo de créditos do Higgsfield, estime o custo total
  (N imagens + ~2N-1 vídeos; mobile dobra os vídeos) e **peça minha aprovação do orçamento**. Não gaste sem aprovar.

## Construção do site
- Página única, **config-driven**: crie `config.js` exatamente como na **seção 6 do BRIEFING** (dados Baker Hughes).
  Tudo que é do cliente sai do config, para reaproveitar depois trocando só esse arquivo.
- Implemente as **11 cenas na ordem** (seção 5), com a **copy exata** (hero: "A integridade dos seus
  equipamentos de torque começa antes da falha.").
- Interações especiais: **exploded view** da bancada + **curva Pressão × Torque** desenhando (Cena 5);
  **count-up** dos KPIs (Cena 8); **slider 10→50 ativos** recalculando o investimento (Cena 10);
  **scroll horizontal com pin** na jornada do ativo (Cena 4).
- Marca: paleta `#0E2334 / #1F4E79 / #B46E3C / #ECE6D6`, tipografia Outfit/Poppins, logo GS de `/logos`.
- Textos como **HTML real** (não embutidos no vídeo). Respeite `prefers-reduced-motion` (fallback para stills).

## Ordem de execução sugerida
1. Ler `BRIEFING.md` e confirmar entendimento do roteiro.
2. Instalar scroll-world; checar Higgsfield (MCP) autenticado + créditos; apresentar orçamento e aguardar aprovação.
3. Gerar stills faltantes + os vídeos V1–V11 (Seedance 2.0) **só em 16:9, sem áudio**, com emendas (sem cadeia mobile nesta fase).
4. Criar `config.js` + estrutura do site (HTML/CSS/JS) com o motor de scroll.
5. Montar as 11 cenas com copy, animações e assets.
6. Testar desktop e mobile; validar o **checklist da seção 10 do BRIEFING**.
7. Buildar estático e escrever um README de como rodar/publicar.

## Entregáveis
- Site estático rodável localmente e pronto para deploy (Vercel/Netlify).
- Todos os vídeos/stills em `/assets_gerados`.
- `config.js` documentado para reaproveitamento.
- README com instruções.

Comece lendo o `BRIEFING.md` e, em seguida, me apresente (a) o plano de execução e (b) a estimativa de
créditos do Higgsfield para aprovação, antes de gerar qualquer asset.
