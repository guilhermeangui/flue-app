<p align="center">
  <img src="https://img.shields.io/badge/status-alpha-orange?style=for-the-badge" alt="Alpha" />
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Supabase-Auth_|_DB_|_Storage-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
</p>

<h1 align="center">🗣️ Fluê</h1>

<p align="center">
  <strong>Pratique idiomas conversando com IA — receba feedback em tempo real sobre gramática, pronúncia e ortografia.</strong>
</p>

<p align="center">
  Fluê é um app de prática de idiomas que usa inteligência artificial para simular conversas naturais e analisar sua escrita e fala em tempo real. Converse por texto ou áudio e receba correções detalhadas a cada mensagem.
</p>

> [!WARNING]
> **Este projeto está em desenvolvimento ativo (alpha).** Diversas funcionalidades ainda estão incompletas ou instáveis — incluindo a versão desktop, o sistema de progresso e o plano Pro. Espere mudanças frequentes e breaking changes.

---

## Visão Geral

Fluê combina conversação com IA e análise linguística para criar uma experiência de aprendizado imersiva:

- **Converse naturalmente** — O AI Coach mantém diálogos contextuais no idioma que você está praticando
- **Receba análise instantânea** — Cada mensagem é avaliada com score de precisão, erros destacados e correções explicadas
- **Pratique com voz** — Grave áudios que são transcritos automaticamente e analisados como texto
- **Acompanhe sua evolução** — Streaks diários, tendência de precisão e breakdown de erros por categoria

### Idiomas suportados

🇧🇷 Português &nbsp;&middot;&nbsp; 🇺🇸 English &nbsp;&middot;&nbsp; 🇪🇸 Español &nbsp;&middot;&nbsp; 🇫🇷 Français

## Funcionalidades

### 💬 Chat com IA
Conversas naturais e fluidas com um coach de idiomas baseado em IA. O coach se adapta ao contexto da conversa, faz perguntas, sugere tópicos e mantém o diálogo interessante — tudo no idioma-alvo.

### 📊 Análise em Tempo Real
Cada mensagem que você envia é analisada automaticamente:
- **Score de precisão** (0-100%)
- **Palavras para revisar** classificadas por tipo (gramática, ortografia, pronúncia)
- **Correções detalhadas** com explicação no idioma nativo

### 🎙️ Mensagens de Voz
Grave áudios diretamente no chat. O áudio é transcrito via OpenAI Whisper e analisado pelo AI Coach, permitindo praticar pronúncia e receber feedback escrito.

### 📈 Progresso
- Streak semanal com visualização dia-a-dia
- Gráfico de tendência de precisão
- Breakdown de erros: pronúncia vs gramática vs ortografia

### 👤 Perfil e Configurações
- Gerenciamento de idiomas-alvo
- Configurações de qualidade de áudio
- Idioma da interface (pt-BR / English)

## Arquitetura

```
src/
├── app/                        # Next.js App Router
│   ├── (auth)/                 # Login, signup, recuperação de senha
│   └── (app)/                  # App principal
│       ├── chats/              # Lista de chats e tela de conversa
│       ├── progress/           # Dashboard de progresso
│       └── profile/            # Perfil e configurações
├── components/                 # Componentes React reutilizáveis
│   ├── chat/                   # ChatView, MessageBubble, AnalysisCard, VoiceMessage
│   ├── layout/                 # Header, TabBar, DeviceFrame
│   ├── ui/                     # Button, Input, Badge, Avatar, etc.
│   └── skeletons/              # Loading states
├── lib/
│   ├── ai/                     # Integração com IA
│   │   ├── service.ts          # Geração de respostas, análise, transcrição
│   │   ├── prompts.ts          # System prompts por idioma
│   │   ├── context.ts          # Windowing de histórico de conversa
│   │   └── rate-limiter.ts     # Controle de uso diário
│   ├── db/
│   │   ├── actions/            # Server Actions (chat, auth, profile)
│   │   ├── queries.ts          # Queries read-only
│   │   └── schemas.ts          # Validação com Zod
│   └── supabase/               # Clients Supabase (server/client)
└── middleware.ts                # Proteção de rotas autenticadas
```

### Stack Técnica

| Camada | Tecnologia |
|---|---|
| **Framework** | Next.js 16 (App Router + Turbopack) |
| **Linguagem** | TypeScript |
| **Estilização** | Tailwind CSS v4 |
| **Auth / DB / Storage** | Supabase |
| **IA (Conversação)** | Claude API (Haiku 4.5 para chat, Sonnet 4.5 para análise Pro) |
| **IA (Transcrição)** | OpenAI Whisper |
| **Validação** | Zod |
| **Forms** | React Hook Form |
| **Lint / Format** | Biome |
| **Package Manager** | pnpm |

## Como Rodar

### Pré-requisitos

- Node.js 18+
- pnpm
- Conta no [Supabase](https://supabase.com) (Auth + PostgreSQL)
- API key da [Anthropic](https://console.anthropic.com)
- API key da [OpenAI](https://platform.openai.com) (para Whisper)

### Setup

```bash
# Clone o repositório
git clone https://github.com/guilhermeangui/flue-app.git
cd flue-app

# Instale as dependências
pnpm install

# Configure as variáveis de ambiente
cp .env.example .env.local
```

Preencha o `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
ANTHROPIC_API_KEY=...
OPENAI_API_KEY=...
```

```bash
# Rode o servidor de desenvolvimento
pnpm dev
```

Acesse [http://localhost:3000](http://localhost:3000).

### Scripts

| Comando | Descrição |
|---|---|
| `pnpm dev` | Servidor de desenvolvimento (Turbopack) |
| `pnpm build` | Build de produção |
| `pnpm start` | Servidor de produção |
| `pnpm lint` | Lint + format check (Biome) |
| `pnpm format` | Auto-fix de formatação |

## Planos de Uso

| | Free | Pro |
|---|---|---|
| Mensagens/dia | 15 | 150 |
| Análise por mensagem | Haiku 4.5 | Sonnet 4.5 |

## Roadmap

O projeto está em fase **alpha**. Abaixo o que já funciona e o que ainda está por vir:

- [x] Chat com IA (texto)
- [x] Análise de mensagens em tempo real
- [x] Mensagens de voz com transcrição (Whisper)
- [x] Autenticação (login, signup, recuperação de senha)
- [x] Rate limiting por tier (Free / Pro)
- [x] Dashboard de progresso (parcial)
- [ ] Layout desktop responsivo
- [ ] Sistema de pagamento (plano Pro)
- [ ] Notificações e lembretes
- [ ] Versão mobile nativa (React Native)
- [ ] Mais idiomas
- [ ] Exercícios e desafios estruturados

---

<p align="center">
  Feito com ☕ e IA por <a href="https://github.com/guilhermeangui">@guilhermeangui</a>
</p>
