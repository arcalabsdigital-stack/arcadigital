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

## Pendências para o Marcos revisar/decidir

1. ~~Autorizar push~~ — feito em 2026-09-22: `backup/pre-redesign-2026-09-21`, `v-antes-redesign` e `redesign/2026-09` confirmados no GitHub.
2. **Substituir a foto placeholder** da seção Sobre por uma foto real.
3. **Revisar os valores dos pacotes** (Fase 3) — foram definidos por julgamento de mercado, não por dado interno da ArcaLabs.
4. **Verificação visual em navegador real** antes do merge (ver limitação técnica acima).
5. Nenhum merge feito na `main`, nenhum deploy em produção — aguardando autorização explícita, conforme instrução.
