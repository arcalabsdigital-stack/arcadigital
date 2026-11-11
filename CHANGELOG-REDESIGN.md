# Changelog do Redesign — Site ArcaLabs (www.arcalabs.com.br)

Registro de todas as decisões tomadas de forma autônoma durante o redesign iniciado em 2026-09-21/22, para revisão posterior do Marcos. Cada item tem o que foi decidido e por quê.

---

## Fase 0 — Descobertas antes de começar (importante ler primeiro)

1. **O repositório do site NÃO é o que constava no briefing original.** O briefing descrevia uma stack Next.js/TypeScript. Na prática, `arcalabsdigital-stack/arcadigital` é um site **estático** — um único `index.html` com CSS e JS inline, sem build step, hospedado via **GitHub Pages** (arquivo `CNAME` apontando para `www.arcalabs.com.br`). Isso muda a abordagem técnica: não há "componentes" React para reaproveitar, e não há preview automático por branch (GitHub Pages normalmente publica a partir de uma branch fixa, não de PRs). Vou trabalhar direto no HTML/CSS/JS existente, reaproveitando classes e estrutura já criadas.
2. **Nome do repositório é enganoso.** `arcadigital` é o repo do site da própria ArcaLabs (confirmado pelo Marcos), não de um cliente chamado "Arca Digital". Documentando aqui para não haver confusão futura.
3. **Bloqueio de acesso identificado e resolvido.** A conta `gh` autenticada originalmente (`institutohombridade`) tinha permissão de leitura mas não de escrita (`push: false`) no repo `arcalabsdigital-stack/arcadigital`. Por isso, todo o trabalho abaixo foi feito **localmente** na branch `redesign/2026-09` primeiro. O Marcos autenticou a conta `arcalabsdigital-stack` via `gh auth login --web` (confirmado `push: true` pela API) e, como o `git push` seguia sendo negado pelo sistema de permissões do próprio Claude Code (não mais por credencial), ele rodou o push manualmente. Confirmado via `git ls-remote` que `backup/pre-redesign-2026-09-21`, `v-antes-redesign` e `redesign/2026-09` estão no GitHub.
4. **Paleta e tipografia extraídas do CSS existente (não inventadas):**
   - `--primary-bg: #111` (fundo principal, quase preto)
   - `--secondary-bg: #1a1a1a` (fundo de cards)
   - `--accent: #1686cf` (azul, usado em links/hover/glow)
   - `--text-light: #fff`, `--text-dark: #ccc`
   - `--btn-bg: #f1f1f1`, `--btn-text: #111`, `--btn-hover: #e0e0e0`
   - Fontes: Satoshi (corpo), Plus Jakarta Sans (títulos), Instrument Sans (botões), Dancing Script (elemento pessoal "Deus é bom o tempo todo" — mantido, é uma assinatura de marca existente, não uma seção do briefing)
5. **Dados reais levantados nos outros projetos da ArcaLabs, para usar em prova social sem inventar números:**
   - **Imobsync/Parcerix** (o case "Plataforma SaaS B2B" do portfólio): stack real = Next.js 14 + TypeScript + Tailwind + Prisma + **PostgreSQL no Railway**. Confirmado em produção desde **30/05/2026** (`DEPLOY.md`: "Status: App online em produção ✅"), primeiro commit em 12/05/2026, 272 commits no histórico até 08/09/2026. Vou usar "em produção desde maio de 2026" — é verificável, não é estatística inflada.
   - **Fluc** (case "Gestão Financeira com IA"): projeto gerado via template (Skip/goskip.dev), sem evidência de deploy em produção nos arquivos do repo. Não vou afirmar "em produção" para esse case — uso linguagem qualitativa neutra ("ferramenta em desenvolvimento" / foco na proposta de valor, sem status de produção).
   - **Automação de Atendimento**: não há um repositório dedicado e isolado; é parte das automações internas do Imobsync (webhook Asaas com autenticação em tempo constante + idempotência, notificação via WhatsApp). Vou descrever qualitativamente ("em uso ativo em operação real"), sem número específico.
   - Não encontrei nenhum dado quantificável adequado para o **hero** (não é uma métrica de produto, é a porta de entrada do site) — logo, o hero não vai ter número forçado, conforme instrução.
6. **Foto do fundador:** não existe nenhuma foto do Marcos nos assets do site ou nos projetos locais (tudo hospedado no Cloudinary, sem referência a foto pessoal). Em vez de inventar/gerar uma imagem falsa, a seção "Sobre" vai usar um avatar/placeholder neutro com iniciais, com um comentário HTML indicando onde trocar pela foto real depois. Documentado para o Marcos substituir.

---

## Fase 1 — Backup

- Branch `backup/pre-redesign-2026-09-21` criada a partir do commit `94964d9` (HEAD da `main` em 2026-09-22, mensagem "Update consultoria IA").
- Tag anotada `v-antes-redesign` apontando para o mesmo commit `94964d9`.
- **Push confirmado no GitHub** (`git ls-remote origin`): `refs/heads/backup/pre-redesign-2026-09-21` → `94964d9`, `refs/tags/v-antes-redesign` → `94964d9`.

---

## Fase 2 — Nova estrutura da home

Branch `redesign/2026-09` criada a partir de `94964d9`. Ordem final implementada, com desvios documentados abaixo:

**Hero → Diagnóstico (prova ao vivo) → Para quem → Serviços → Diferenciais → Prova Social (portfólio + logos) → Sobre → CTA de vídeo → Pacotes → Segurança e IA → FAQ → Contato**

1. **Hero — CTA duplo.** Mantido o vídeo e as 4 headlines rotativas existentes. Adicionado, abaixo do botão de WhatsApp, um link discreto "Prefere deixar seus dados e a gente te chama?" que revela um mini-formulário (nome, e-mail, "o que você precisa") enviado ao mesmo endpoint Formspree já usado no site (`_subject` diferenciado como "Hero - Formulário Rápido" pra distinguir a origem do lead nos e-mails recebidos). Não usei nenhuma estatística no hero — não encontrei dado quantificável verdadeiro que fizesse sentido nessa posição (ver Fase 0, item 5).

2. **"Prova ao vivo" — escolhi um diagnóstico interativo de 3 perguntas (client-side, sem backend) em vez de expor um sistema real em produção.** Motivo: o case "Plataforma SaaS B2B" (Imobsync/Parcerix) é um SaaS com login e dados de usuários reais — expor esse ambiente publicamente numa página de vendas exigiria criar um modo demo/conta fake isolada, o que não é "a opção mais rápida de implementar bem" pedida no briefing, além de levantar questão de privacidade dos dados de quem já usa o sistema. Um dashboard estático (screenshots) também foi descartado por ser menos "ao vivo" e menos alinhado ao pedido de "demonstrar o processo de consultoria". O quiz de 3 perguntas (situação → prazo → orçamento) roda 100% em JavaScript no navegador (sem servidor, compatível com GitHub Pages), termina numa recomendação de pacote e num link de WhatsApp com a mensagem já preenchida — literalmente demonstra o processo de diagnóstico que a ArcaLabs vende, ao vivo, no próprio site.

3. **"Para quem".** 4 cards por dor, usando os perfis sugeridos no briefing: sem sistema próprio, planilha travando, quer automatizar atendimento, quer validar produto/SaaS.

4. **Serviços.** Mantidos os 6 serviços e vídeos originais; todas as 6 descrições reescritas no formato explícito **Problema → Solução**.

5. **Diferenciais.** 5 cards: diagnóstico antes de codar, comunicação direta com o fundador, suporte pós-entrega, stack moderna testada em produção, e "o sistema e os dados são seus" (esse último também reforça a seção de Segurança mais abaixo).

6. **Prova Social — decisão de unificar portfólio + carrossel de logos numa única seção**, já que o briefing não listava "Clientes Satisfeitos" como item separado na nova estrutura (itens 1 a 11). Em vez de simplesmente remover os 6 logos de clientes reais (Devorare, Haus, Marcio Morais, MultiA, Curados, LIA) — que são prova social real e gratuita —, movi o carrossel pra dentro da seção "Prova Social", logo abaixo dos 3 cases de portfólio. Métricas usadas nos cases (sem inventar números, ver Fase 0 item 5):
   - Parcerix: **"Em produção desde maio de 2026"** (fato verificável no `DEPLOY.md` do projeto).
   - Fluc: **"Em desenvolvimento ativo"** (linguagem qualitativa honesta — não achei evidência de deploy em produção).
   - Automação de Atendimento: **"Em uso ativo"** (qualitativo — automação real dentro do Imobsync, sem métrica isolada disponível).

7. **Sobre.** Seção curta com o Marcos como Engenheiro de Controle e Automação, atuação solo, desenvolvendo com IA como ferramenta de trabalho. **Sem foto real** — não existe nenhuma foto do fundador nos assets do site nem nos repositórios locais. Usei um placeholder circular com a inicial "M" (mesmo estilo visual dos cards do site) e deixei um comentário `<!-- TODO Marcos -->` no HTML indicando exatamente onde trocar pela foto real.

8. **Navegação — reduzida de 11 para 7 âncoras.** Ao adicionar uma seção pra cada um dos 11 itens do briefing, o menu ficaria com 11 links, o que estouraria a largura do header no desktop (o layout atual assume ~6 itens num `header-content` de max-width 1400px). Mantive no menu: Home, Diagnóstico, Serviços, Portfólio, Pacotes, FAQ, Contato. As seções "Para quem", "Diferenciais", "Sobre" e "Segurança" continuam na página, na ordem certa, só não têm link direto no menu — o visitante chega nelas rolando a página normalmente.

---

## Fase 3 — Pacotes (valores e raciocínio)

Tabela de 4 planos adicionada na seção `#pacotes`, reaproveitando o padrão visual dos cards existentes (fundo `--secondary-bg`, mesma sombra/hover).

1. **Landing Page / Site Institucional — R$ 1.900,00 fixo.** Escopo definido pra caber nesse valor no mercado brasileiro: até 5 páginas, design responsivo com a marca do cliente, formulário de contato, SEO on-page básico, 2 rodadas de revisão, prazo de 10–15 dias úteis. Esse é o mesmo padrão de preço/escopo praticado por freelancers e pequenas software houses brasileiras pra site institucional simples (a faixa de mercado observada varia de ~R$1.200 a R$3.500 dependendo de escopo).

2. **Sistema Sob Medida (SaaS/Aplicativo) — a partir de R$ 8.900, valor final após diagnóstico.** Julgamento de mercado: no Brasil, um MVP sob medida (auth + painel + banco de dados + poucas integrações) construído por um dev/software house pequena costuma começar na faixa de R$ 8 mil a R$ 15 mil, podendo passar de R$ 40 mil conforme a complexidade. Escolhi R$ 8.900 como piso de entrada (compatível com um MVP enxuto) deixando explícito que o valor final depende do escopo levantado no diagnóstico.

3. **Automação com IA — a partir de R$ 1.490 (automação simples) / sob consulta (projetos maiores).** Uma automação simples (1 fluxo, ex.: notificação de WhatsApp ou integração entre 2 ferramentas) é um projeto de poucos dias; R$ 1.490 é compatível com esse esforço no mercado BR. Projetos com IA generativa custom ou múltiplas integrações variam demais pra ter preço fixo — por isso ficam "sob consulta".

4. **Consultoria / Diagnóstico — primeira conversa gratuita; diagnóstico técnico documentado R$ 490 (abatido do projeto se fechado).** Decisão de modelo: o mercado de dev/software house B2B no Brasil majoritariamente usa a chamada de descoberta gratuita como ferramenta de qualificação de lead (é isso, inclusive, que o botão "Agendar Diagnóstico" do header já sugeria antes do redesign). Mantive essa gratuidade pra não aumentar o atrito de entrada. Adicionei uma segunda camada — um diagnóstico técnico **pago e documentado** (R$ 490, abatido se o projeto avançar) — pra projetos maiores/mais complexos que exigem um documento de escopo formal antes de qualquer orçamento; essa também é prática comum entre consultorias técnicas e filtra leads não sérios sem cobrar de quem só quer uma conversa inicial.

Adicionei uma nota (`.pricing-note`) deixando explícito que os valores de Sistema Sob Medida e Automação são estimativas de mercado, e que o valor final e o escopo são sempre fechados por escrito depois do diagnóstico, antes de qualquer cobrança — pra não criar expectativa de preço fechado sem diagnóstico nem promessa que a ArcaLabs não tem como cumprir.

---

## Fase 4 — Segurança e IA

Seção `#seguranca` com 5 cards, linguagem simples e sem tecniquês, cobrindo exatamente os 5 pontos do briefing:

- **Onde os dados ficam:** PostgreSQL hospedado no Railway. Baseado na stack real confirmada no `DEPLOY.md`/`README.md` do Imobsync (Prisma + PostgreSQL + Railway) — **não é Supabase**, como o briefing supunha; corrigi pra refletir a stack real em vez de inventar/copiar a sugestão do briefing.
- **IA não decide sozinha:** opera dentro de regras e limites definidos no escopo do projeto.
- **Supervisão humana (human-in-the-loop):** destacada especificamente pra interações com cliente final (atendimento, cobrança, decisões sensíveis).
- **LGPD:** menção direta aos princípios de coleta mínima, controle de acesso e possibilidade de exclusão de dados.
- **Propriedade do cliente:** código e dados são do cliente ao final do projeto, sem dependência eterna da ArcaLabs — reforça o mesmo ponto já presente nos Diferenciais.

---

## FAQ

Mantidas as 4 perguntas originais. Adicionadas 3 novas, cobrindo exatamente as lacunas pedidas (preço/pacotes e segurança de dados) mais uma sobre propriedade do sistema, que emergiu naturalmente do conteúdo da seção de Segurança:
5. Quanto custa um projeto com a ArcaLabs?
6. Meus dados e os dados dos meus clientes ficam seguros?
7. Fico "preso" à ArcaLabs depois que o sistema fica pronto?

---

## Ajustes finais de polimento

- **Banner de CTA em vídeo** ("Transforme processos manuais em software que trabalha por você") não fazia parte dos 11 itens listados no briefing, mas já existia no site original como reforço de conversão no meio da página. Mantive-o, reposicionado entre "Sobre" e "Pacotes" — funciona como uma ponte natural antes de mostrar preço.
- **Rodapé:** corrigido "© 2025 ArcaLabs" para "© 2026 ArcaLabs" (estava desatualizado mesmo antes do redesign).

## Verificação técnica feita

- Balanceamento de tags (`<section>`, `<div>`) e ausência de `id` duplicado verificados via script Node — OK.
- Sintaxe do JavaScript embutido verificada com `node --check` — OK.
- Todos os links do menu (`href="#..."`) verificados contra os `id` existentes no HTML — todos resolvem.
- Testado carregamento do arquivo via servidor HTTP local (`python -m http.server`) — HTML e recursos externos (Cloudinary) respondendo 200.
- **Limitação:** este ambiente não tem uma ferramenta de navegador/browser automation disponível nesta sessão, então **não foi possível tirar screenshot ou verificar visualmente o layout mobile/desktop renderizado de fato**. A verificação foi estrutural e de código, não visual. Recomendo abrir o arquivo localmente ou a branch publicada num navegador antes de aprovar o merge, especialmente pra conferir o menu mobile (hamburger) e o quiz em telas pequenas.

---

## Rodada 2 — Ajustes pedidos pelo Marcos após revisão (2026-09-22)

Todos os 9 itens abaixo foram commitados individualmente na branch `redesign/2026-09`, na ordem 2→9→1 (a lógica do quiz do item 1 foi implementada por último de propósito, já considerando a mudança de preço do item 9, pra não precisar reescrevê-la duas vezes).

1. **Lógica do quiz corrigida (orçamento × recomendação).** O bug: pra quem respondia "planilha travando", "atendimento" ou "validar ideia" na pergunta 1 e "Até R$ 2 mil" na pergunta 3, o quiz podia recomendar Sistema Sob Medida (a partir de R$ 8.900) ou Automação com IA — incompatível com o orçamento informado. Corrigido com uma nova regra: orçamento "até R$ 2 mil" agora só recomenda Landing Page (dor = sem_sistema, único pacote com piso ≤ R$ 2 mil) ou "Diagnóstico Gratuito" (as outras 3 dores) — nunca um pacote sem piso compatível. Pra faixa "Entre R$ 2 mil e R$ 10 mil", quando a recomendação é Sistema Sob Medida ou Automação com IA, o texto agora inclui uma ressalva explícita de que o valor final pode ficar acima do teto informado, a esclarecer no diagnóstico gratuito. **Verificação:** como a pergunta de prazo (pergunta 2) não influencia qual pacote é recomendado — só adiciona uma frase informativa ao resumo —, a lógica de recomendação depende apenas de dor×orçamento (16 combinações, que cobrem as 48 combinações totais 4×3×4). Rodei um script Node simulando essas 16 combinações contra os pisos de preço de cada pacote: **zero incompatibilidades sem ressalva** (log completo rodado nesta sessão, disponível no histórico do terminal).
2. **Título do diagnóstico** trocado de "Veja o diagnóstico funcionando, ao vivo" para "Faça um diagnóstico rápido".
3. **Card de diferencial** "Comunicação direta com o fundador" → "Comunicação direta com o programador". Parágrafo abaixo não citava "fundador" diretamente, então não precisou de ajuste de concordância.
4. **Título do portfólio** "Prova Social" → "Veja alguns produtos desenvolvidos".
5. **Seção "Sobre" (Quem constrói) removida por completo** — placeholder de foto, nome, cargo e texto, mais o CSS específico dela (`.about-grid`, `.about-photo-placeholder`, `.about-text`, `.about-role` e o media query associado), que ficaria órfão no arquivo. O banner de CTA em vídeo passou a vir logo depois do portfólio, sem espaço em branco. Verificado balanceamento de tags após a remoção (11 `<section>` abertas/fechadas, 75 `<div>` abertas/fechadas).
6. **Menu "Pacotes" → "Preços".** Mantive `id="pacotes"` no HTML (não quebra o link de âncora) e troquei só o texto visível do menu. Pra consistência, também troquei o `<h2>` da seção de "Pacotes e Investimento" pra "Preços" e a referência na pergunta 5 do FAQ ("veja a seção de Pacotes" → "veja a seção de Preços").
7. **Card "Onde seus dados ficam"** não cita mais "Railway" — mantém a explicação sobre PostgreSQL, infraestrutura na nuvem e acesso restrito por autenticação, só sem nomear o provedor específico.
8. **Novo card "Guard rails: trava técnica, não promessa"** adicionado na seção Segurança e IA, logo depois do card "A IA não decide sozinha" (reforça o mesmo ponto, indo um pouco mais fundo): explica que o login exige autenticação com permissão por papel de usuário, e que os agentes de IA rodam com regras técnicas que bloqueiam automaticamente qualquer ação fora do escopo combinado — sem jargão de engenharia.
9. **Automação com IA nos Pacotes** trocou de "A partir de R$ 1.490" pra "Sob consulta", no mesmo formato do Sistema Sob Medida. A lista de itens do card foi ajustada pra deixar claro que o escopo (simples ou complexo) é o que define o orçamento, sem piso fixo. A nota geral abaixo da tabela de preços também foi reescrita pra não sugerir mais que Automação tem uma "estimativa de mercado" — agora deixa explícito que é sempre sob consulta.

**Sobre o pedido de revisar o FAQ (pergunta 5):** conferi o texto atual e ele já dizia "automações com IA têm valor final definido depois do diagnóstico" — não citava um valor específico de automação como a premissa da tarefa supunha. Não havia, portanto, nada desatualizado por causa da mudança do item 9 além da referência "seção de Pacotes", já corrigida no item 6.

---

## Rodada 3 — Envio automático de WhatsApp via Evolution API (2026-09-22)

### Arquitetura escolhida e por quê

O site é estático (GitHub Pages) — todo JavaScript que roda no navegador do
visitante é público e inspecionável (basta abrir o DevTools). Por isso, **não
é seguro chamar a Evolution API direto do frontend**: a API key ficaria
exposta no código-fonte do `index.html`, e qualquer pessoa poderia copiá-la e
mandar mensagens pela instância de WhatsApp da ArcaLabs.

Solução: um **proxy server-side em Cloudflare Workers** (`worker/`), que é
quem efetivamente guarda a API key (como variável de ambiente secreta,
configurada via `wrangler secret put` — nunca commitada) e conversa com a
Evolution API. O frontend só conhece a URL pública do Worker, nunca a chave.

Por que Cloudflare Workers e não outra opção: plano gratuito cobre o volume
esperado, não exige migrar o site pra fora do GitHub Pages (é só um endpoint
HTTP separado) e tem suporte nativo a segredos via `wrangler secret`, sem
precisar montar infraestrutura própria só pra guardar uma chave.

### O que foi implementado

1. **`worker/src/index.js`** — Worker completo: recebe `{ nome, whatsapp,
   tituloRecomendacao, textoRecomendacao }`, normaliza o número (só dígitos +
   código do país 55), monta a mensagem no tom pedido ("Oi, [nome]! Aqui é a
   ArcaLabs 👋 ... Esta é uma mensagem automática com o resultado do seu
   diagnóstico..."), chama `POST {EVOLUTION_API_URL}/message/sendText/{instance}`
   com header `apikey`, e responde ao frontend só com `{ok:true}` ou
   `{ok:false, error:"..."}` — nunca com a chave. Tem CORS restrito à origem
   `https://www.arcalabs.com.br` e só aceita `POST`.
2. **`worker/wrangler.toml`** e **`worker/README.md`** — configuração e passo
   a passo de deploy (`wrangler login` → `wrangler secret put` × 3 → `wrangler
   deploy`). Nenhum dos dois arquivos contém valor real de segredo, só os
   *nomes* das variáveis esperadas.
3. **`.gitignore`** criado na raiz do repo (não existia antes) — ignora
   `worker/.dev.vars`, `worker/.env` e `worker/.wrangler/`, que são onde o
   `wrangler` guardaria segredos locais durante desenvolvimento, pra evitar
   commit acidental.
4. **Novo passo "contato" no quiz** (`index.html`) — antes o quiz ia direto
   da pergunta 3 pro resultado, sem coletar nome/WhatsApp em lugar nenhum (o
   pedido original presumia que esse passo já existia; não existia, então foi
   criado agora). Formulário com nome + WhatsApp, inserido entre a pergunta 3
   e o resultado.
5. **Envio duplo em paralelo, sem bloquear a UI:** ao confirmar o passo de
   contato, o resultado do quiz aparece **imediatamente** (`showStep('result')`
   é chamado antes de qualquer `fetch` ser aguardado), e os dois envios
   disparam em paralelo, cada um com seu próprio `.catch()` independente:
   - `enviarLeadFormspree()` — reaproveita o mesmo endpoint Formspree já usado
     no site (`mdangzek`), agora também recebendo o resultado do diagnóstico
     (recomendação, prazo, orçamento) como um novo tipo de lead.
   - `enviarWhatsAppAutomatico()` — chama o Worker, que dispara a mensagem via
     Evolution API pro WhatsApp que o próprio visitante digitou.
   - Falha de um não afeta o outro nem trava a experiência — é exatamente a
     redundância pedida: se a Evolution API estiver fora do ar, o Marcos ainda
     recebe o lead pelo Formspree; se o Formspree falhar, o cliente já recebeu
     o diagnóstico automático no WhatsApp dele.
6. **Números de WhatsApp — confirmado que não foram confundidos.** Nenhum
   link ou botão `wa.me/5547992291756` existente foi alterado (inclusive o
   botão "Continuar essa conversa no WhatsApp" do resultado, que continua
   apontando pro canal humano). O número usado para enviar a mensagem
   automática é o que o **visitante** digita no novo campo do quiz — o número
   da instância Evolution API não é (nem precisa ser) conhecido pelo código:
   ele é definido pela conexão da instância, do lado do Worker/Evolution.

### Teste do fluxo completo (documentado, já que não há navegador real disponível nesta sessão)

Sem uma instância real da Evolution API nem um browser disponível neste
ambiente, o teste possível e mais próximo do real foi: extrair o `<script>`
real do `index.html` (o mesmo que vai pro navegador) e executá-lo dentro de
um contexto Node (`vm.createContext`) com `document`/`fetch` simulados,
simulando cliques reais nas perguntas do quiz e o submit do formulário de
contato. Script de teste rodado a partir do scratchpad da sessão (não
commitado no repo — é ferramenta de verificação pontual, não parte do site).
4 cenários rodados:

| Cenário | Resultado exibido na hora? | Erro tratado sem exceção? |
|---|---|---|
| Formspree OK + Worker OK | Sim | Sim |
| Formspree falha + Worker OK | Sim | Sim (só 1 aviso no console, referente ao Formspree) |
| Formspree OK + Worker falha | Sim | Sim (só 1 aviso no console, referente ao Worker) |
| Ambos falham | Sim | Sim (2 avisos no console, zero exceção não tratada) |

Em todos os 4 cenários, `quizSummary` e o link de WhatsApp humano
(`quizWhatsApp.href`) foram preenchidos corretamente antes de qualquer
`fetch` ser considerado, confirmando que a experiência do visitante nunca
depende do sucesso dos dois envios. Nenhum `unhandledRejection` foi
disparado em nenhum cenário.

**O que este teste NÃO cobre** (limitação a documentar com transparência):
não valida o payload real aceito pela Evolution API (formato de
`/message/sendText` pode variar por versão — comentário deixado em
`worker/src/index.js`), nem o comportamento visual/mobile do novo passo do
quiz — segue a mesma limitação de ausência de navegador já registrada mais
acima neste changelog.

### Status da integração: **funcionando, testada de ponta a ponta**

O Marcos forneceu as credenciais (URL base, nome da instância, API key) e
conduzimos juntos o deploy real:

1. **Autenticação:** `wrangler login` via OAuth (conta `arcalabs.digital@gmail.com`
   na Cloudflare).
2. **Segredos configurados** via `wrangler secret put` (`EVOLUTION_API_URL`,
   `EVOLUTION_INSTANCE`, `EVOLUTION_API_KEY`) — inseridos diretamente via
   stdin, nunca escritos em arquivo.
3. **Deploy do Worker:** precisou registrar um subdomínio `workers.dev` pra
   conta (primeira vez usando Workers nela) — feito pelo Marcos no painel da
   Cloudflare. Worker publicado em
   `https://arcalabs-diagnostico.arcalabs-digital.workers.dev/`.
4. **Bug real encontrado e corrigido em produção (fora do nosso código):**
   os primeiros testes de envio davam timeout (erro `524` da Cloudflare)
   pra qualquer número de destino. Isolamos a causa passo a passo:
   - Confirmamos que a Evolution API validava o payload corretamente e
     rapidamente (`{number, text}` é o formato certo pra v2.3.7) — descartando
     bug no Worker ou no payload.
   - Descartamos a hipótese de "autoenvio" (mandar mensagem pro próprio
     número da instância) testando com um número diferente — travou do
     mesmo jeito.
   - Pedimos os logs de runtime do serviço `evolution-api` na Railway ao
     Marcos, e encontramos `ERROR [Redis] redis disconnected` se repetindo
     sem parar, coincidindo exatamente com o momento em que a Evolution API
     tentava despachar a mensagem (`Sending message to ...@s.whatsapp.net`).
   - Causa raiz: o serviço Redis existia no projeto Railway e estava
     "Online", mas **não estava de fato conectado à Evolution API** — faltavam
     as variáveis `CACHE_REDIS_ENABLED` e `CACHE_REDIS_URI` no serviço
     `evolution-api` (só existiam as variáveis genéricas `REDIS_URL` etc.,
     que a Evolution API não lê para ativar o cache).
   - Fix aplicado pelo Marcos: adicionar `CACHE_REDIS_ENABLED=true` e
     `CACHE_REDIS_URI=${{REDIS_URL}}` (sintaxe de referência de variável da
     própria Railway) no serviço `evolution-api`, e reiniciar.
5. **Teste real de ponta a ponta confirmado com sucesso:** após o fix, o
   Worker respondeu `{"ok":true}` em ~2 segundos (antes travava por mais de
   100s), e o Marcos confirmou o recebimento da mensagem de teste no
   WhatsApp de destino.
6. **`WORKER_ENDPOINT` atualizado no `index.html`** para a URL real
   (`https://arcalabs-diagnostico.arcalabs-digital.workers.dev/`), substituindo
   o placeholder. Testes automatizados do fluxo do quiz (script Node com DOM
   simulado, mesmo usado antes) rodados de novo depois da troca — sem
   regressão.

**Nenhum segredo (API key, URL da instância) foi commitado em nenhum momento**
— tudo passou só por `wrangler secret put` (stdin) ou comandos `curl` locais,
nunca gravado em arquivo do repositório.

---

## Pendências para o Marcos revisar/decidir

1. ~~Autorizar push~~ — feito em 2026-09-22: `backup/pre-redesign-2026-09-21`, `v-antes-redesign` e `redesign/2026-09` confirmados no GitHub.
2. ~~Substituir a foto placeholder da seção Sobre~~ — não se aplica mais: a seção "Sobre" foi removida por completo na Rodada 2.
3. **Revisar os valores dos pacotes** (Fase 3, e a mudança da Automação com IA para "Sob consulta" na Rodada 2) — foram definidos por julgamento de mercado, não por dado interno da ArcaLabs.
4. **Verificação visual em navegador real** antes do merge (ver limitação técnica na seção "Verificação técnica feita" — ainda não há ferramenta de browser disponível nesta sessão).
5. ~~Fornecer credenciais da Evolution API~~ — feito. Worker deployado, segredos configurados, bug de Redis na Evolution API (Railway) diagnosticado e corrigido pelo Marcos, teste de ponta a ponta confirmado com sucesso (ver Rodada 3 acima).
6. **Novo commit local pendente de push:** a branch `redesign/2026-09` recebeu commits novos nesta rodada (Worker + novo passo do quiz + URL real do endpoint) que ainda não foram enviados ao GitHub — repetir `git push origin redesign/2026-09`.
7. Nenhum merge feito na `main`, nenhum deploy do site em produção — aguardando autorização explícita, conforme instrução. **O Worker do Cloudflare já está ativo em produção** (é um serviço separado do site, e o deploy dele já foi confirmado e autorizado por mensagem antes de rodar `wrangler deploy`).


---

## Rodada 4 — Reposicionamento como escola de IA (2026-11-11)

Branch `redesign/escola-ia`, criada a partir da `main` em `d0f58fd`. **Nada foi mergeado nem enviado para a `main`.**

### O que mudou

1. **Site de serviços preservado em `/contrate/`** (`contrate/index.html`, cópia literal de `main:index.html`, commit próprio). Ajustes depois da cópia:
   - title, meta description, canonical e og tags próprios (`https://arcalabs.com.br/contrate/`). Sem og:image, porque o site de serviços nunca teve uma.
   - Item **"← Escola de IA"** (→ `../`) no início do menu, em azul, também no menu móvel.
   - Os 8 links fixos de WhatsApp agora levam a frase "Vim pela página de serviços do site." Os que não tinham mensagem receberam "Olá! Vim pela página de serviços do site."
   - **Quiz e Worker intocados.** A mensagem do WhatsApp que o quiz monta no JavaScript também ficou como estava, porque a instrução era não alterar o quiz. Se quiser a origem marcada também ali, é uma linha.
   - Todos os recursos do site antigo são URLs absolutas (Cloudinary, Google Fonts, Font Awesome, Formspree, Worker), então nada quebra na subpasta. O Worker aceita a origem `https://www.arcalabs.com.br`, que é a mesma em `/contrate/`.
2. **A home virou a página do curso Do Zero ao App.** Base: `C:/Projetos/Treinamento_ClaudeCode/pagina-de-vendas/` (a cópia em `C:\AI_FACTORY\projects\Treinamento_ClaudeCode\` é idêntica, exceto pelas capturas em `_testes/`). Foram copiados `index.html`, `assets/`, `termos-e-garantia.html` e `politica-de-privacidade.html`, primeiro sem alteração (commit próprio) e depois editados. **Não** foram copiados `README.md`, `_testes/` nem `assets/og-image.png` (a imagem fala em "3 dias").
3. **Conteúdo removido:** 6, 7 e 8 de novembro, "3 dias", "24 h ao vivo", "30 vagas", R$ 697, "Vendas até", sessão de preparação de 4/5 de novembro, grade por dia/horário, bloco de preço e a chamada final "Em 3 dias…". Todos os `{{...}}` saíram da página e do `app.js`.
4. **Seções novas ou reescritas**, nesta ordem: Hero (selo "Próxima turma: 23/11" → `#turmas`) → Para quem é → **O que você vai aprender** (Apps com Claude Code, Meta Ads com IA, Vídeos com IA) → **Seu primeiro projeto** (agente de WhatsApp + mini CRM, com os tópicos da programação antiga em 3 etapas, sem dias nem horários) → O que está incluso → **Comunidade** → Quem ensina → **Próximas turmas** (card da Turma 1) → **Como garantir sua vaga** (no lugar do bloco de investimento, com a garantia de 7 dias) → Requisitos e custos (com o aviso de bloqueio do número) → FAQ → Chamada final ("primeiro app funcionando") → **Ou a gente constrói pra você** (→ `/contrate/`) → Rodapé (`id="contato"`, dados da empresa e link para `/contrate/`) → banner de cookies.
5. **Inscrição:** os 5 botões `data-compra` (topo, hero, card da turma, "Como garantir", chamada final) apontam para `https://wa.me/5547992291756?text=Quero%20garantir%20minha%20vaga%20na%20Turma%201%20do%20curso%20Do%20Zero%20ao%20App`. Quando houver o link da Hotmart, basta trocar esse `href` nos 5 botões.
6. **Menu no topo:** O Curso, O que você vai aprender, Comunidade, Próximas turmas, FAQ, **Contrate a ArcaLabs** (botão de contorno ciano, → `contrate/`), Contato, mais o botão "Quero minha vaga". Abaixo de 1280px vira hambúrguer (fecha ao tocar num item ou com Esc, `aria-expanded` atualizado). Sem JavaScript, os links aparecem em linha. O corte em 1279px foi medido: com 7 itens, o menu completo não cabe abaixo disso.
7. **`assets/app.js`:**
   - O consentimento do Pixel ficou igual: nada do Meta carrega antes de "Aceitar".
   - `PIXEL_ID` agora é `""`, e o Pixel só carrega com um ID numérico. Isso substitui a trava antiga baseada em `{{`.
   - Os parâmetros UTM continuam sendo repassados aos links `data-compra`, **exceto** quando o link é do WhatsApp, para não sujar a mensagem.
   - Entrou o código do menu móvel.
8. **SEO da home:** novos title, description e og tags. Canonical e og:url passam a `https://arcalabs.com.br/`. og:image e twitter:image saíram, e `twitter:card` virou `summary`.
9. **Sitemap e robots:** não existem no repositório, então não havia o que atualizar. Não criei.
10. **Páginas legais:** saíram datas, horas, 30 alunos e R$ 697. Entraram 1 ano de acesso, comunidade na Hotmart, Meta Ads com conta e orçamento do aluno, e "não prometemos desempenho de anúncios". Data de atualização: 11/11/2026. O aviso "Rascunho a revisar por advogado" continua.

### Decisões tomadas sem dado explícito (revisar)

- **Mantido da página de vendas, por não ter sido contradito:** Zoom como plataforma das aulas, cartilha (PDF e Notion), kit de agentes, projeto de referência, chave da Anthropic durante o curso (Sonnet, com limite), apoio à verificação do Railway, custos do Railway e a garantia de 7 dias (CDC, art. 49). **Confirme se tudo isso continua valendo no formato novo.**
- **"E mais"** (pilares): só com o que está nos materiais. Não há material de Meta Ads nem de vídeo em `Treinamento_ClaudeCode` (a pasta `criativos-meta-ads` é a divulgação do curso, não conteúdo), então o card de vídeo ficou com placeholder, e o "e mais" cita só prompts, boas práticas e solução de problemas, que são capítulos da cartilha.
- **"Inscrições abertas"** no card da Turma 1: decorre de os botões já levarem à inscrição. Não há contador de vagas nem urgência.
- **Evento do Pixel:** os botões de inscrição continuam disparando `InitiateCheckout`, mesmo indo para o WhatsApp. Quando o checkout for a Hotmart, isso volta a ser exato. Até lá, dá para trocar por `Contact` se preferir.
- O rodapé da home mantém o aviso de não afiliação (Meta, WhatsApp, Anthropic, Evolution API, Railway).

### Placeholders visíveis `[MARCOS: ...]` (aparecem em amarelo na página)

> Lista original da rodada 4. A situação atual está na **Rodada 5**, abaixo.

| # | O que falta | Onde |
|---|---|---|
| 1 | Dias e horários das aulas ao vivo | Home: card da Turma 1 e FAQ "Quando começa". Termos §2 |
| 2 | Duração e carga horária | Home: card da Turma 1. Termos §2 |
| 3 | Número de vagas | Home: card da Turma 1 e FAQ "Quantas pessoas participam?". Termos §2 |
| 4 | Se haverá sessão de preparação antes de 23/11, e quando | Home: requisitos e FAQ "O que preciso instalar?". Termos §2 |
| 5 | Ferramentas de vídeo usadas e o que o aluno produz | Home: card "Vídeos com IA" |
| 6 | Se as ferramentas de vídeo têm custo | Home: requisitos e custos |
| 7 | Até quando vale a chave da Anthropic do curso | Home: requisitos e custos. Termos §8 |
| 8 | O 1 ano de acesso conta da compra ou do início da turma? | Home: FAQ "Por quanto tempo tenho acesso?". Termos §2 |
| 9 | Formato e frequência do acompanhamento na comunidade | Home: seção Comunidade e FAQ "Como funciona a comunidade?" |
| 10 | Se as aulas ficam gravadas na Hotmart e por quanto tempo | Home: FAQ "E se eu perder uma aula?" |
| 11 | Preço, forma de pagamento e se o checkout é pela Hotmart | Termos §3 (na home o preço não aparece, de propósito) |
| 12 | Quando o material (cartilha, kit) é liberado | Termos §4 |

Para achar todos: `grep -rn "MARCOS:" index.html termos-e-garantia.html`.

### Pendências fora da página

1. **Imagem de compartilhamento (og:image) nova**, sem "3 dias". Depois é só adicionar `og:image`, `og:image:width/height/alt` e voltar `twitter:card` para `summary_large_image`.
2. **ID do Pixel do Meta** em `assets/app.js` (`PIXEL_ID`, só números).
3. **Link da Hotmart**, quando existir: trocar o `href` dos 5 botões `data-compra`.
4. **Canonical sem www, domínio servido com www.** O pedido foi `https://arcalabs.com.br/`, mas o `CNAME` publica `www.arcalabs.com.br`, então o GitHub Pages redireciona o endereço sem www para o com www, e o canonical aponta para uma URL que redireciona. Recomendo alinhar os dois. Se o domínio principal mudar para sem www, atualize também o `ALLOWED_ORIGIN` do Worker (`worker/src/index.js`), senão o quiz deixa de mandar o WhatsApp automático.
5. **A política de privacidade não cobre `/contrate/`.** Ela diz que a página do curso não tem formulários, o que é verdade, mas `/contrate/` coleta nome, e-mail e WhatsApp (Formspree, Worker e Evolution API) e não tem link para nenhuma política. Precisa de revisão jurídica.
6. **Revisão por advogado** dos termos e da política (o aviso de rascunho continua na página).
7. **Sitemap e robots.txt** não existem. Vale criar com `/` e `/contrate/`.
8. `assets/logo-arcalabs-claro.png` (170 KB) veio junto com `assets/` e não é usado. Pode ser apagado.

### Verificação feita (Chrome real via playwright-core, servidor local)

- **Sintaxe:** `node --check` em `assets/app.js` e no script inline de `/contrate/`, os dois sem erro.
- **Home:** sem `{{`; 5 botões de inscrição com o link certo; 9 links de WhatsApp com o número certo; todas as âncoras existem; links internos respondem 200; imagens carregam; sem erros de JS.
- **Restos do formato antigo:** nenhum "R$ 697", "30 vagas", "24 h", "6, 7 e 8" ou "em 3 dias" no texto da home nem das páginas legais.
- **Cookies:** o aviso aparece; aceitar não carrega o Meta (sem ID); a escolha é lembrada ao recarregar; recusar não carrega nada. UTMs não alteram o link do WhatsApp.
- **Menu da home:** cada item rola até a seção certa sem ficar sob o cabeçalho. "Contrate a ArcaLabs" abre `/contrate/`, e "← Escola de IA" volta para `/` (desktop e celular).
- **Larguras testadas:** 360, 390, 820, 1200, 1279 e 1280 (720 e 800 de altura) e 1366: sem rolagem horizontal e cabeçalho cabendo. O hambúrguer abre, fecha ao tocar num item e a página rola até "Próximas turmas". Sem JavaScript, o menu continua utilizável.
- **`/contrate/`:**
  - title, canonical e og:url próprios; as 8 mensagens de WhatsApp com a origem marcada; âncoras do menu existem.
  - Quiz completo: Formspree e Worker recebem o POST em paralelo, o resultado aparece e o link do WhatsApp é montado. Os envios foram interceptados no teste, então nenhum lead nem mensagem real saiu.
  - O menu cabe em uma linha de 1280 a 1440px e vira hambúrguer abaixo disso, como na `main`. O logo tem o mesmo tamanho da `main`.
- **Falso positivo conhecido:** a checagem de imagens de `/contrate/` acusa logos duplicados do carrossel com `loading="lazy"` que ainda não tinham carregado. As 10 imagens únicas respondem 200 por requisição direta, e o código é idêntico ao da `main`.

---

## Rodada 5: formato das aulas e plano do Claude (2026-11-11)

Branch `redesign/escola-ia`. **Nada foi mergeado nem enviado para a `main`.**

### O que mudou

1. **Placeholders removidos:** ferramentas de vídeo (o card "Vídeos com IA" termina em "Crie e edite vídeos com a ajuda de ferramentas de IA.") e acompanhamento na comunidade (o parágrafo da seção Comunidade saiu inteiro, assim como o placeholder do FAQ "Como funciona a comunidade?").
2. **Formato das aulas** (hero, "O que está incluso", card da Turma 1, FAQ, chamada final, termos §2):
   - Ao vivo pelo Zoom, de segunda a domingo, às 14h e às 20h (Brasília). O aluno escolhe o horário.
   - Cada aula dura de 1 a 2 horas. **Sem** total de aulas, de dias ou carga horária.
   - **10 vagas**, como informação fixa, com o motivo (atenção individual até o app ficar pronto). Sem contador nem urgência.
   - Aulas gravadas na Hotmart, disponíveis nos 12 meses de acesso. Novo item em "O que está incluso". FAQ "E se eu perder uma aula?" → assiste à gravação na Hotmart.
   - Hero: novo fato "14h ou 20h, você escolhe". O card da Turma 1 tem agora 8 campos (Início, Formato, Dias e horários, Duração de cada aula, Gravações, Vagas, Acesso, Comunidade).
   - **Não existe seção "Como funciona"** nesta home. As informações foram para "O que está incluso", o card da Turma 1 e o FAQ.
3. **Plano do Claude no lugar da chave de API do curso:**
   - Saiu de "O que está incluso" o item "Chave de API da Anthropic (com limite de uso, só Sonnet)". Saiu de "Custos" a frase sobre a chave deixar de valer e o crédito com teto de gasto.
   - "Para participar" e "Custos": plano do Claude com acesso ao Claude Code (os planos pagos, como Pro e Max), contratado e pago pelo aluno na Anthropic, **à parte do curso**, sem valor (consulte o preço no site da Anthropic).
   - FAQ "Preciso pagar alguma coisa além do curso?": agora começa com "Sim" e cita o plano do Claude, o Railway depois do teste gratuito e o Meta Ads.
   - FAQ "O que preciso instalar?": a assinatura do Claude entra antes do Zoom e das instalações.
   - Etapa 3: "Depois: custos, chave própria e próximos passos" → "Depois: custos e próximos passos".
   - **Não existe seção "IA com segurança"** nesta home (nem na página de vendas de origem). A ideia "o aluno usa a própria conta, e o código e os dados ficam com ele" entrou no item "Projeto funcionando" de "E você leva para casa".
   - Termos §8: a linha da chave do curso saiu. Entrou o plano do Claude pago pelo aluno e "o curso não fornece chave de API da Anthropic".
4. **Política de privacidade:** não citava a chave de API. Entraram dois itens em §3, "Gravação das aulas" (imagem, voz e chat podem aparecer na gravação) e "Conta do Claude" (contratada direto com a Anthropic), e em §5 a finalidade "gravar as aulas e disponibilizar aos alunos (execução de contrato)". **Precisa de revisão jurídica**, como o resto da política.

### ⚠️ Ponto para decidir: a API do agente de WhatsApp

O projeto do curso é um agente de WhatsApp que **responde com o Claude** (Etapa 2: "Resposta com IA e guard rails"). Isso é uma chamada à **API** da Anthropic, que precisa de uma chave de API e é cobrada por uso no Console. Pelo que eu sei, ela é cobrada **à parte** dos planos Pro e Max, que cobrem o uso do Claude Code mas não dão chave de API para apps próprios. Antes, a chave do curso cobria isso. Agora a página diz que o aluno só paga o plano do Claude e o Railway. Se o agente continuar chamando a API, falta informar esse custo (ou mudar o projeto). Confira as regras atuais da Anthropic e decida o texto.

### Placeholders `[MARCOS: ...]` (situação atual)

| # | O que falta | Onde | Situação |
|---|---|---|---|
| 1 | Dias e horários das aulas | — | ✅ Resolvido |
| 2 | Duração e carga horária | — | ✅ Resolvido (1 a 2 h por aula, sem total) |
| 3 | Número de vagas | — | ✅ Resolvido (10) |
| 4 | Sessão de preparação antes de 23/11 (existe? quando?) | Home: "Para participar" e FAQ "O que preciso instalar?". Termos §2 | ⏳ Pendente |
| 5 | Ferramentas de vídeo e o que o aluno produz | — | ✅ Removido a pedido |
| 6 | Se as ferramentas de vídeo têm custo | Home: "Custos por sua conta" | ⏳ Pendente (não estava na sua lista; mantido) |
| 7 | Até quando vale a chave do curso | — | ✅ Removido (não há chave do curso) |
| 8 | 1 ano de acesso conta da compra ou do início da turma? | Home: FAQ "Por quanto tempo tenho acesso?". Termos §2 | ⏳ Pendente (não estava na sua lista; mantido) |
| 9 | Acompanhamento na comunidade | — | ✅ Removido a pedido |
| 10 | Gravações na Hotmart | — | ✅ Resolvido (12 meses) |
| 11 | Preço, forma de pagamento e se o checkout é pela Hotmart | Termos §3 | ⏳ Pendente |
| 12 | Quando o material é liberado | Termos §4 | ⏳ Pendente (não estava na sua lista; mantido) |
| 13 | Se o apoio para a verificação do Railway continua | Home: "O que está incluso" | ⏳ Pendente (placeholder novo, porque o item só fica se você confirmar) |

Também pendente, fora de placeholder: **o link de inscrição final** (hoje os 5 botões `data-compra` vão para o WhatsApp). Os termos §5 e a política §3 já citam a Hotmart como plataforma da compra, então confira esses dois trechos se o pagamento for por outro meio.

### Conferência por busca (index, termos, privacidade, `assets/`, `contrate/`)

- **`[MARCOS`**: 5 na home (preparação ×2, Railway, custo das ferramentas de vídeo, início do 1 ano) e 4 nos termos (preparação, início do 1 ano, preço/pagamento, liberação do material). Nenhum na política.
- **"30 vagas"** e **"24 h"**: nenhum nas páginas. Só aparecem neste CHANGELOG, como histórico.
- **"R$"**: nenhum.
- **"chave"**: termos §8, "o curso não fornece chave de API da Anthropic" (intencional). Também `CHAVE` em `assets/app.js` (nome da variável do consentimento de cookies) e a API key da Evolution API em `contrate/` e `worker/`, que não têm relação com o curso.
- **"Anthropic"**: home ("Para participar", "Custos", FAQ de instalação e de custos, aviso de não afiliação no rodapé), termos §8 (×2) e política §3. Todos coerentes com o plano pago pelo aluno.
- **"3 dias"**, **"sexta"** e **"sábado"**: só o comentário sobre a og:image no `<head>` e a conversa de exemplo do celular no hero ("Vocês atendem aos sábados?"), que é a demonstração do atendente, não a agenda do curso.
- O hero continua com "você aprende **em poucos dias**", sem número. Combina com "aprendizado rápido", mas troque se preferir evitar qualquer menção a dias.

### Verificação feita (Chrome real via playwright-core, servidor local)

- Home, termos e política em 360, 390, 820, 1280 e 1440px: sem rolagem horizontal e sem erros de JavaScript.
- Nenhum dos textos "30 vagas", "24 h", "limite de uso", "teto de gasto", "sexta" ou "3 dias" no texto renderizado das três páginas.
- Capturas conferidas: fatos do hero (5 itens quebram bem em 360 e 1440), card da Turma 1 (8 campos em 2 colunas no desktop e 1 no celular), "Para participar" e "Custos" no celular.
