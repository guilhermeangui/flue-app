# Fluê

App de prática de idiomas com IA. Web app (Next.js), com futuras versões iOS/Android (preferir libs cross-platform, isolar lógica de negócio da UI).

## Stack

- **Framework:** Next.js 16.1.6 (App Router, Turbopack)
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS v4 (via `@tailwindcss/postcss`)
- **Linting/Formatting:** Biome v2.2
- **Package Manager:** pnpm
- **Runtime:** Node.js
- **Auth + DB + Storage:** Supabase (Auth, PostgreSQL, Storage)
- **AI (conversação):** Anthropic Claude API (`@anthropic-ai/sdk`) — Haiku 4.5 para conversação, Sonnet 4.5 para análise Pro
- **AI (transcrição de áudio):** OpenAI Whisper (`openai` SDK)

## Estrutura

```
src/
  app/                     # App Router — páginas, layouts, rotas
    (auth)/                # Login, signup, forgot-password
    (app)/                 # App principal (chats, progress, profile)
    globals.css            # CSS global + Tailwind + animações
  components/              # Componentes React reutilizáveis
    chat/                  # ChatView, ChatInput, MessageBubble, VoiceMessage, AnalysisCard
    layout/                # Header, DeviceFrame
    profile/               # ProfileView
    settings/              # SettingsView
    skeletons/             # Loading skeletons
  lib/
    ai/                    # Serviço de IA
      service.ts           # generateResponse, generateVoiceAnalysis, transcribeAudio, logUsage
      prompts.ts           # System prompts por idioma (conversation + analysis)
      context.ts           # buildContext — monta histórico com windowing
      rate-limiter.ts      # checkAndIncrementUsage, getUsageStatus
    db/
      actions/             # Server Actions (chat-actions, auth-actions, profile-actions)
      queries.ts           # Queries read-only (getChats, getMessages, etc.)
      mappers.ts           # Row → Domain object mappers
      schemas.ts           # Zod validation schemas
      types.ts             # DB row types
    supabase/              # Supabase client (server + client)
    constants.ts           # LANGUAGES, TIER_LIMITS
    types.ts               # Domain types (User, Chat, Message, AnalysisData)
    format.ts              # Formatação de datas
  hooks/                   # use-auth
  middleware.ts            # Auth route protection
supabase/
  migrations/              # SQL migrations (001-004)
```

## Comandos

```bash
pnpm dev        # Dev server (Turbopack)
pnpm build      # Build de produção
pnpm start      # Servidor de produção
pnpm lint       # Biome check (lint + format check)
pnpm format     # Biome format com auto-fix
```

## Env vars necessárias

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
ANTHROPIC_API_KEY=...
OPENAI_API_KEY=...          # Para Whisper (transcrição de áudio)
```

## Convenções

- **Indentação:** 2 espaços
- **Linter:** Biome com regras recomendadas + domínios Next.js e React
- **CSS:** `@import "tailwindcss"` no globals.css (Tailwind v4 syntax)
- **Idioma do app:** pt-BR (html lang, conteúdo)
- **Path alias:** `@/*` mapeia para `./src/*`

## Regras para o Claude

- **NUNCA** se adicionar como co-autor, contributor ou co-authored-by nos commits. Todos os commits devem ser exclusivamente em nome de `guilhermeangui`.
- Manter o código limpo e sem conteúdo de template/boilerplate.
- Ao adicionar dependências, preferir bibliotecas que funcionem ou tenham equivalentes para React Native (visando futuro mobile).
