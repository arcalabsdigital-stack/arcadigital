// Proxy server-side entre o site (GitHub Pages, estático) e a Evolution API.
//
// Por quê esse proxy existe: o site é HTML/CSS/JS estático servido pelo GitHub
// Pages. Qualquer código que rode no navegador do visitante é público e pode
// ser lido por qualquer pessoa (basta abrir o DevTools). Se a API key da
// Evolution API estivesse no index.html, qualquer visitante poderia copiá-la
// e enviar mensagens de WhatsApp em nome da ArcaLabs pela instância dela.
// Este Worker roda no lado do servidor (Cloudflare), guarda a API key como
// variável de ambiente secreta (nunca no código-fonte) e é o único lugar que
// efetivamente conversa com a Evolution API.
//
// Variáveis de ambiente esperadas (configuradas via `wrangler secret put`,
// nunca commitadas — ver README.md desta pasta):
//   EVOLUTION_API_URL   -> URL base da instância (ex: https://minha-instancia.exemplo.com)
//   EVOLUTION_INSTANCE  -> nome da instância na Evolution API
//   EVOLUTION_API_KEY   -> API key da instância
//
// Origem permitida a chamar este Worker (ajuste se o domínio mudar):
const ALLOWED_ORIGIN = 'https://www.arcalabs.com.br';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

function jsonResponse(body, status) {
  return new Response(JSON.stringify(body), {
    status: status || 200,
    headers: Object.assign({ 'Content-Type': 'application/json' }, corsHeaders()),
  });
}

// Normaliza o número recebido do formulário (o visitante pode digitar com
// espaço, parênteses, traço, com ou sem +55) pro formato que a Evolution API
// espera: só dígitos, com código do país 55 na frente.
function normalizarNumero(whatsapp) {
  const digitos = String(whatsapp || '').replace(/\D/g, '');
  if (digitos.startsWith('55') && digitos.length >= 12) return digitos;
  return '55' + digitos;
}

function montarMensagem(nome, tituloRecomendacao, textoRecomendacao) {
  return (
    'Oi, ' + nome + '! Aqui é a ArcaLabs 👋\n\n' +
    'Esta é uma mensagem automática com o resultado do seu diagnóstico rápido no site:\n\n' +
    '*' + tituloRecomendacao + '*\n' + textoRecomendacao + '\n\n' +
    'Quer continuar essa conversa? Responda essa mensagem ou chama a gente: https://wa.me/5547992291756'
  );
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders() });
    }

    if (request.method !== 'POST') {
      return jsonResponse({ ok: false, error: 'method_not_allowed' }, 405);
    }

    let body;
    try {
      body = await request.json();
    } catch (e) {
      return jsonResponse({ ok: false, error: 'invalid_json' }, 400);
    }

    const nome = (body && body.nome || '').toString().trim();
    const whatsapp = (body && body.whatsapp || '').toString().trim();
    const tituloRecomendacao = (body && body.tituloRecomendacao || '').toString().trim();
    const textoRecomendacao = (body && body.textoRecomendacao || '').toString().trim();

    if (!nome || !whatsapp || !tituloRecomendacao) {
      return jsonResponse({ ok: false, error: 'missing_fields' }, 400);
    }

    if (!env.EVOLUTION_API_URL || !env.EVOLUTION_INSTANCE || !env.EVOLUTION_API_KEY) {
      // Segredos ainda não configurados nesta instância do Worker.
      return jsonResponse({ ok: false, error: 'evolution_not_configured' }, 503);
    }

    const numero = normalizarNumero(whatsapp);
    const mensagem = montarMensagem(nome, tituloRecomendacao, textoRecomendacao);

    // NOTA: o formato exato do corpo esperado pelo endpoint /message/sendText
    // pode variar entre versões da Evolution API (v1 costuma usar
    // `{ number, textMessage: { text } }`; v2 costuma aceitar `{ number, text }`).
    // Este payload segue o formato mais comum na v2. Ajuste aqui se a sua
    // instância retornar erro de formato — teste com uma chamada real assim
    // que as credenciais estiverem configuradas.
    let evoResponse;
    try {
      evoResponse = await fetch(
        env.EVOLUTION_API_URL.replace(/\/$/, '') + '/message/sendText/' + env.EVOLUTION_INSTANCE,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: env.EVOLUTION_API_KEY,
          },
          body: JSON.stringify({
            number: numero,
            text: mensagem,
          }),
        }
      );
    } catch (err) {
      return jsonResponse({ ok: false, error: 'network_error' }, 502);
    }

    if (!evoResponse.ok) {
      return jsonResponse({ ok: false, error: 'evolution_api_error', status: evoResponse.status }, 502);
    }

    return jsonResponse({ ok: true });
  },
};
