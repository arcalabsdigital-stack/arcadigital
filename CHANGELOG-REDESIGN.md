# Changelog do Redesign — Site ArcaLabs (www.arcalabs.com.br)

Registro de todas as decisões tomadas de forma autônoma durante o redesign iniciado em 2026-09-21/22, para revisão posterior do Marcos. Cada item tem o que foi decidido e por quê.

---

## Fase 0 — Descobertas antes de começar (importante ler primeiro)

1. **O repositório do site NÃO é o que constava no briefing original.** O briefing descrevia uma stack Next.js/TypeScript. Na prática, `arcalabsdigital-stack/arcadigital` é um site **estático** — um único `index.html` com CSS e JS inline, sem build step, hospedado via **GitHub Pages** (arquivo `CNAME` apontando para `www.arcalabs.com.br`). Isso muda a abordagem técnica: não há "componentes" React para reaproveitar, e não há preview automático por branch (GitHub Pages normalmente publica a partir de uma branch fixa, não de PRs). Vou trabalhar direto no HTML/CSS/JS existente, reaproveitando classes e estrutura já criadas.
2. **Nome do repositório é enganoso.** `arcadigital` é o repo do site da própria ArcaLabs (confirmado pelo Marcos), não de um cliente chamado "Arca Digital". Documentando aqui para não haver confusão futura.
3. **Bloqueio de acesso identificado e reportado ao Marcos:** a conta `gh` autenticada (`institutohombridade`) tem permissão de leitura mas não de escrita (`push: false`) no repo `arcalabsdigital-stack/arcadigital`. Por isso, todo o trabalho abaixo foi feito **localmente** na branch `redesign/2026-09`, sem nenhum push ao GitHub até a permissão ser resolvida. O Marcos está ciente e vai liberar acesso ou trocar de credencial.
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
- **Push pendente** por causa do bloqueio de credencial descrito acima. Branch e tag existem localmente; serão enviadas ao GitHub assim que o acesso de escrita for liberado.

---

(as próximas fases serão registradas abaixo conforme forem implementadas)
