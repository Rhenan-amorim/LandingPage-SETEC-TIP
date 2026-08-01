# README TÉCNICO — Rodar local & Deploy
### Landing Page SETEC Torque Integrity Program (TIP®)

Guia prático para desenvolver localmente e publicar o site. Complementa o `BRIEFING.md`.

---

## 1. Pré-requisitos
- **Node.js ≥ 18** (e npm) — para servidor local, build e CLIs de deploy.
- **Higgsfield** autenticado com **créditos** (geração dos vídeos Seedance 2.0) — via MCP nesta sessão,
  ou `higgsfield auth login` se usar a CLI da skill.
- **ffmpeg / ffprobe** — extração de frames e encode das emendas (exigidos pela skill scroll-world).
- **Python 3 + Pillow** — canvases 9:16 do mobile e knockout opcional de fundo.
- **Skill scroll-world** instalada no Claude Code (`/plugin install scroll-world@scroll-world`).
- (Opcional) Conta **Vercel** ou **Netlify** para publicar.

## 2. Estrutura esperada após a montagem
```
LP_SETEC_TIP/
├── index.html            # página única (ou app/ se for Vite/Next)
├── config.js             # camada CLIENTE (Baker Hughes) — ver seção 6 do BRIEFING
├── css/  js/             # estilos + motor de scroll (scrub-engine)
├── assets_gerados/
│   ├── videos/           # V1..V11 (desktop 16:9 e mobile 9:16) + posters
│   └── imagens/          # stills gerados (V6/V7/V8) + mockups
├── logos/                # logos GS
└── fotos_origem/         # 6 fotos base
```

## 3. Rodar localmente
> Escolha o bloco conforme o stack que o Claude Code montar.

**A) Site estático (HTML/JS/CSS puro — recomendado pela skill):**
```
# na raiz do projeto
npx serve .           # abre em http://localhost:3000
# ou:
python3 -m http.server 8080     # http://localhost:8080
```
Servir por HTTP (não abrir o `index.html` via file://) — o motor faz *blob-seek* nos vídeos e precisa de fetch.

**B) Se for Vite:**
```
npm install
npm run dev           # dev server com HMR
npm run build         # gera /dist estático
npm run preview       # testa o build
```

**C) Se for Next.js (export estático):**
```
npm install
npm run dev
npm run build         # com output:'export' → gera /out
```

## 4. Vídeos grandes (importante)
Os `.mp4/.webp` do scroll são pesados. Antes do deploy:
- Rode a compressão do pipeline (H.264/H.265 + webm; posters em `.webp`). Alvo: cada clipe **< 3–5 MB**.
- **Lazy-load** (o scrub-engine já faz) e **preload** só do V1 (hero).
- Se o total passar de ~100 MB, **hospede os vídeos num CDN** (Cloudflare R2, Bunny, Vercel Blob) e aponte
  as URLs no config — evita estourar limites de repositório/deploy. Alternativa: **git-lfs** para os binários.

## 5. Deploy — Vercel (recomendado)
**Via CLI:**
```
npm i -g vercel
vercel            # 1ª vez: login + configura projeto (Framework: Other/Vite/Next conforme o caso)
vercel --prod     # publica em produção
```
**Via GitHub (CI automático):**
1. `git init && git add . && git commit -m "LP SETEC TIP"` → suba para um repo no GitHub.
2. Em vercel.com → *New Project* → importe o repo.
3. Build: estático = sem build; Vite = `npm run build`, output `dist`; Next = `next build` (output `out`).
4. Cada push na `main` re-publica.

## 6. Deploy — Netlify (alternativa)
- **Arrastar e soltar:** netlify.com/drop → jogue a pasta do build (`/` estático, `/dist` ou `/out`).
- **CLI:** `npm i -g netlify-cli` → `netlify deploy` (preview) → `netlify deploy --prod`.
- Publish directory: `.` (estático), `dist` (Vite) ou `out` (Next).

## 7. Domínio e social
- Aponte um subdomínio (ex.: `tip.gruposetec.net`) nas DNS para a Vercel/Netlify.
- Defina `og:title`, `og:description` e **`og:image`** (exporte um frame do hero para `assets_gerados/imagens/og.jpg`).
- Adicione `favicon` com o símbolo GS.

## 8. Checklist pós-deploy
- [ ] Abre e rola fluido no **desktop** (scrub sem travar).
- [ ] **Mobile** servindo a cadeia 9:16 (não o crop do desktop); posters aparecem antes do vídeo carregar.
- [ ] `prefers-reduced-motion`: cai para stills, sem quebrar o layout.
- [ ] Vídeos com `muted`, `playsinline`, `preload` correto (autoplay inline no iOS).
- [ ] **Lighthouse** (mobile) ≥ 80 em Performance; LCP do hero ok.
- [ ] Textos são HTML real (selecionáveis) — nada de texto "preso" dentro do vídeo.
- [ ] `config.js` só com dados do cliente; trocar cliente = trocar esse arquivo.
- [ ] Sem chaves/API keys commitadas no repositório.

## 9. Troubleshooting rápido
- **Emenda "pisca" entre cenas:** o último frame de um clipe deve ser o primeiro do conector — regerar o
  conector a partir do frame real do vizinho (regra da skill).
- **Vídeo não dá autoplay no iPhone:** faltou `muted` + `playsinline`.
- **Trava no mobile:** reduza resolução/bitrate da cadeia 9:16 e o nº de cenas pesadas; garanta lazy-load.
- **Scroll "pula":** confira o mapeamento scroll→tempo do scrub-engine e a duração real (ffprobe) de cada clipe.

## 10. Reaproveitar para outro cliente
1. Duplique o projeto (ou crie `config.<cliente>.js`).
2. Troque em `config.js`: `cliente`, `logoCliente`, `ativoExemplo`, `dashboard`, `scorecard`, `investimento`.
3. (Opcional) Regere só as cenas com dado de cliente (V7 dashboard) se quiser telas novas.
4. Redeploy. O roteiro/produto (cenas 1–6, 9–11) permanece igual.
