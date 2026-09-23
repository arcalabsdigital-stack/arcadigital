# Worker de diagnóstico — proxy pra Evolution API

Proxy server-side (Cloudflare Workers, plano gratuito) entre o site estático
da ArcaLabs (GitHub Pages) e a Evolution API. Existe só por um motivo: o site
é HTML/CSS/JS estático, então qualquer código que rodasse no navegador do
visitante seria público — a API key da Evolution API não pode aparecer em
lugar nenhum do `index.html`. Este Worker guarda a chave como segredo e é o
único ponto que efetivamente fala com a Evolution API.

## Por que Cloudflare Workers

- Plano gratuito cobre bem o volume esperado (poucos envios por dia, vindos
  do quiz de diagnóstico do site).
- Não exige migrar o site pra fora do GitHub Pages — é só um endpoint HTTP
  separado, independente da hospedagem do site.
- Suporta variáveis de ambiente secretas nativamente (`wrangler secret put`),
  sem precisar de infraestrutura própria pra guardar segredo.

## Pré-requisitos

- Node.js instalado.
- Uma instância própria da Evolution API já rodando (self-hosted), com um
  número de WhatsApp dedicado conectado via QR Code.
- `URL base`, `nome da instância` e `API key` dessa instância em mãos.

## Deploy (rodar dentro desta pasta `worker/`)

```bash
npm install -g wrangler   # se ainda não tiver o wrangler instalado
wrangler login            # autentica com a conta Cloudflare

# Configura os 3 segredos — o wrangler pede o valor de forma interativa,
# então a chave nunca aparece no terminal salvo em histórico nem em arquivo:
wrangler secret put EVOLUTION_API_URL
wrangler secret put EVOLUTION_INSTANCE
wrangler secret put EVOLUTION_API_KEY

# Publica o Worker:
wrangler deploy
```

Ao final do `wrangler deploy`, o terminal mostra a URL pública do Worker
(algo como `https://arcalabs-diagnostico.SEU-SUBDOMINIO.workers.dev`).

## Depois do deploy

1. Copie a URL publicada.
2. No `index.html` do site, procure a constante `WORKER_ENDPOINT` (comentário
   `TODO Marcos`) e troque pela URL real.
3. Faça um teste real preenchendo o quiz de diagnóstico no site com seu
   próprio WhatsApp, pra confirmar que a mensagem chega.
4. Se a Evolution API retornar erro de formato, o mais provável é a
   diferença de payload entre versões da API — veja o comentário no topo de
   `src/index.js` sobre o formato de `/message/sendText`.

## Segurança

- Nenhum segredo é lido de arquivo — só de variáveis de ambiente configuradas
  via `wrangler secret put`, que ficam guardadas de forma criptografada pela
  Cloudflare, fora do repositório Git.
- O Worker só aceita requisições da origem `https://www.arcalabs.com.br`
  (CORS) e só o método `POST` — ajuste `ALLOWED_ORIGIN` em `src/index.js` se
  o domínio mudar.
- A resposta do Worker pro frontend nunca inclui a API key nem qualquer
  outro segredo, mesmo em caso de erro.
