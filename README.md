# SETEC Torque Integrity Program — TIP® · Landing scrollytelling

Site-proposta de página única, **scroll-through cinematográfico** (a câmera "voa" por 11 cenas,
dirigida pela rolagem), para o programa **TIP®** da Setec Marine Service. Config-driven — a 1ª
"skin" é a **Baker Hughes**; trocar de cliente = trocar só o `config.js`.

Fase atual entregue: **DESKTOP 16:9**. A cadeia mobile 9:16 nativa fica para uma fase futura
(o site já é responsivo e tem fallback estático em mobile / `prefers-reduced-motion`).

---

## Como rodar localmente

Requer apenas um servidor HTTP estático (os módulos ES e o `fetch` dos vídeos como *blob* não
funcionam via `file://`). Escolha uma opção:

```bash
npx --yes serve -l 4173 .
```

ou

```bash
python -m http.server 4173
```

Depois abra **http://localhost:4173**.

> Já existe `.claude/launch.json` com o alvo `lp-setec-tip` (porta 4173) para o preview integrado.

---

## Estrutura

```
index.html            # 11 cenas (HTML real, copy exata do briefing §5)
config.js             # CAMADA CLIENTE (Baker Hughes) — §6 do briefing. Troque este arquivo p/ reaproveitar.
css/styles.css        # design system da marca (navy/blue/copper/cream · Outfit/Poppins/DM Mono)
js/
  main.js             # boot: liga config + engine + cenas
  engine.js           # motor scroll-scrub (blob-seek + seek-coalescing), adaptado do scroll-world
  scenes.js           # CAMADA PRODUTO (fixa): interações por cena (exploded, curva, count-up, slider, pin)
vendor/scroll-world/  # skill scroll-world vendorizada (scrub-engine.js, prompts, pipeline, SKILL.md)
assets_gerados/
  videos/  v1..v11.mp4 (16:9, MUDOS) + raw/ (originais Seedance + conector c1)
  imagens/ stills gerados (V5–V8) + posters otimizados de cada cena + og.jpg
  frames/  plates 16:9 e frames de emenda (seam-lock)
  GENERATION_MANIFEST.json  # todos os job_id/media_id do Higgsfield e o que virou cada arquivo
fotos_origem/  logos/       # fotos reais e logo GS (nunca recriada)
```

## Reaproveitar para outro cliente

1. Duplique **`config.js`** e troque `cliente`, `heroEyebrowCliente`, `ativoExemplo`, `dashboard`,
   `scorecard`, `investimento.estruturaInternaMes` e `contato`.
2. (Opcional) aponte `logoCliente` para um SVG em `/logos`.
3. O roteiro/produto (as 11 cenas e a copy do TIP®) **não muda** — vive em `js/scenes.js` + `index.html`.

---

## Pipeline de vídeo (Higgsfield · Seedance 2.0)

- Todos os clipes: **image-to-video, 1080p, 16:9, SEM ÁUDIO** (`generate_audio:false` + `ffmpeg -an`).
- **Stills:** fotos reais de `/fotos_origem` viram "plates" 16:9 (fundo navy borrado + sujeito nítido, via
  ffmpeg) e servem de *start-image*. Cenas sem foto (V6 anel, V7 digital, V8 scorecard) e o render limpo
  da bancada (V5) foram gerados no `nano_banana_pro` (isométrico/UI escuro, paleta da marca).
- **Voo 1→2→3 seam-locked:** `v1.mp4` = **V1 (hero) + C1 (conector)** concatenados, terminando exatamente
  no 1º frame de V2; `v3.mp4` parte do último frame real de V2. Emendas frame-locked (regra scroll-world).
- **Encode de scrub:** `libx264 -crf 21 -g 8 -keyint_min 8 -sc_threshold 0 -pix_fmt yuv420p +faststart`
  (keyframes densos = *seek* suave ao rolar). O motor carrega cada clipe como **blob** e faz *scrub* do
  `currentTime` conforme o progresso da cena.
- Rastreabilidade completa (job_id/media_id) em `assets_gerados/GENERATION_MANIFEST.json`.
- **Regenerar um clipe:** rode o `generate_video` (model `seedance_2_0`, `aspect_ratio:"16:9"`,
  `generate_audio:false`) com o mesmo *start-image*, baixe o raw para `assets_gerados/videos/raw/` e
  re-encode com os parâmetros acima para `assets_gerados/videos/vX.mp4`.

## Interações por cena

| Cena | Interação |
|------|-----------|
| 1 Hero | vídeo scrubbed (contêiner abre → ferramenta) |
| 2 Problema | palavras de impacto entram uma a uma + linha de falha (SVG) despencando |
| 3 Virada | transição escuro→luz, pilares |
| 4 Jornada | **scroll horizontal com pin** pelas 10 estações |
| 5 Bancada | **exploded view** (infográfico + rótulos) + **curva Pressão×Torque** desenhando + readouts subindo |
| 6 Confiabilidade | anel de melhoria contínua que desenha/gira |
| 7 Digital | QR + tela do ativo (dados da config) + parallax |
| 8 Resultados | **count-up** dos KPIs + barras enchendo |
| 9 Tradicional×TIP® | tabela preenchendo linha a linha |
| 10 Investimento | **slider 10→50 ativos** recalculando mensal/anual + cubos empilhando |
| 11 Fecho | ferramenta volta ao contêiner + selo TIP® + CTA |

---

## Publicar (Vercel / Netlify)

Site 100% estático — sem build step.

- **Netlify:** arraste a pasta em app.netlify.com/drop, ou `netlify deploy --prod` com "publish directory" = raiz.
- **Vercel:** `vercel` (ou `vercel --prod`) na raiz; framework "Other", sem build command, output = raiz.
- **GitHub Pages:** suba a pasta e ative Pages na branch.

**Servir os vídeos com os headers certos:** garanta `Content-Type: video/mp4` e, idealmente,
`Accept-Ranges: bytes` (Vercel/Netlify já fazem). Os `.mp4` finais somam ~56 MB; se quiser reduzir,
re-encode `v1.mp4`/`v5.mp4` com `-crf 24`.

Passo a passo adicional/troubleshooting: `README_DEPLOY.md`.

---

## Acessibilidade & performance
- Textos são **HTML real** (não embutidos no vídeo).
- `prefers-reduced-motion`: não carrega vídeo, mantém os posters e revela o conteúdo estático.
- Vídeos com *lazy-load* por proximidade da cena; poster/fallback sempre presente (se um `.mp4` faltar,
  a cena permanece no poster — degradação graciosa).
- SEO/social: `<title>`, `description` e `og:image` (frame do hero) configurados.
