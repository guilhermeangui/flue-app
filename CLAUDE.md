# Fluê

Aplicativo web construído com Next.js. Futuramente poderá ter versões iOS/Android (considerar ao escolher libs — preferir soluções cross-platform e isolar lógica de negócio da camada de UI).

## Stack

- **Framework:** Next.js 16.1.6 (App Router, Turbopack)
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS v4 (via `@tailwindcss/postcss`)
- **Linting/Formatting:** Biome v2.2
- **Package Manager:** pnpm
- **Runtime:** Node.js

## Estrutura

```
src/
  app/           # App Router — páginas, layouts, rotas
    globals.css  # CSS global com import do Tailwind
    layout.tsx   # Root layout (lang=pt-BR)
    page.tsx     # Página inicial
public/          # Assets estáticos
```

## Comandos

```bash
pnpm dev        # Dev server (Turbopack)
pnpm build      # Build de produção
pnpm start      # Servidor de produção
pnpm lint       # Biome check (lint + format check)
pnpm format     # Biome format com auto-fix
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
