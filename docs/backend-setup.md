# Backend Setup — Fluê

## Supabase

O projeto usa [Supabase](https://supabase.com) como backend (Auth, Database, Storage).

**Projeto:** `recreyrzogjrupcwzfio` (Supabase Dashboard)

### Variáveis de ambiente

Arquivo `.env.local` na raiz do projeto:

```
NEXT_PUBLIC_SUPABASE_URL=<url do projeto>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key do projeto>
```

### Auth Providers habilitados

- Email/Password
- Google OAuth (a configurar)
- Apple OAuth (a configurar)

### Migrations

As migrations ficam em `supabase/migrations/` e devem ser executadas manualmente no **Supabase Dashboard > SQL Editor**.

| Arquivo | Descrição | Status |
|---------|-----------|--------|
| `001_profiles.sql` | Tabela `profiles` + trigger auto-create no signup + RLS | Aplicada |
| `002_core_tables.sql` | Tabelas `user_languages`, `chats`, `messages`, `daily_activity`, `user_api_keys` + RLS | Aplicada |

### Storage

| Bucket | Descrição | Acesso |
|--------|-----------|--------|
| `voice-messages` | Áudios gravados pelos usuários | Público (read), autenticado (write) |

> **Setup necessário:** Criar o bucket `voice-messages` no Supabase Dashboard > Storage com acesso público para leitura.

---

## ⚠️ Email Confirmation (IMPORTANTE)

**Estado atual:** Email confirmation está **DESABILITADA** no Supabase para facilitar o desenvolvimento.

**Para produção, é OBRIGATÓRIO:**

1. **Reabilitar email confirmation** no Supabase Dashboard:
   - Authentication > Providers > Email > ativar "Confirm email"

2. **Implementar no código:**
   - Tela de "Verifique seu email" após signup (ao invés de redirecionar direto para /chats)
   - Rota `/auth/confirm` para receber o callback de confirmação do Supabase
   - Tratamento do estado `user.email_confirmed_at === null` no middleware
   - Opção de reenviar email de confirmação

3. **Configurar email templates** no Supabase Dashboard:
   - Authentication > Email Templates
   - Personalizar com branding do Fluê

---

## Arquitetura de Auth

### Fluxo

```
Browser → Middleware (refresh session) → App
                                          ├── Rotas públicas: /login, /signup, /forgot-password
                                          └── Rotas protegidas: /chats, /progress, /profile, etc.
```

### Arquivos

| Arquivo | Responsabilidade |
|---------|------------------|
| `src/lib/supabase/client.ts` | Client Supabase para componentes client-side (browser) |
| `src/lib/supabase/server.ts` | Client Supabase para Server Actions e componentes server-side |
| `src/middleware.ts` | Refresh de sessão via cookies + proteção de rotas |
| `src/hooks/use-auth.ts` | Hook React com estado de auth + métodos (login, signup, logout, OAuth) |

### Middleware (`src/middleware.ts`)

- Refresha cookies de sessão do Supabase em cada request
- Redireciona usuários não autenticados para `/login`
- Redireciona usuários autenticados para `/chats` se tentarem acessar rotas de auth
- Redireciona `/` para `/chats` (auth) ou `/login` (não auth)

### Hook `useAuth`

```typescript
interface UseAuth {
  isAuthenticated: boolean;
  userId: string | null;
  user: User | null;      // Supabase User object
  isLoading: boolean;
  login(email: string, password: string): Promise<boolean>;
  signup(name: string, email: string, password: string): Promise<boolean>;
  loginWithGoogle(): Promise<void>;
  loginWithApple(): Promise<void>;
  logout(): Promise<void>;
}
```

---

## Arquitetura de Dados (Phase 2)

### Padrão de acesso a dados

- **Leitura:** Server Components chamam Supabase diretamente via `src/lib/db/queries.ts`
- **Escrita:** Server Actions em `src/lib/db/actions/` com validação Zod
- **Loading states:** `loading.tsx` com skeleton components
- **Padrão híbrido:** Server Component busca dados → passa como props para Client Component (interatividade)

### Arquivos de dados

| Arquivo | Responsabilidade |
|---------|------------------|
| `src/lib/db/types.ts` | Tipos das rows do banco (snake_case) |
| `src/lib/db/schemas.ts` | Schemas Zod para validação de inputs |
| `src/lib/db/mappers.ts` | Conversores DB row → tipo frontend (camelCase) |
| `src/lib/db/queries.ts` | Funções de leitura (getCurrentUser, getChats, etc.) |
| `src/lib/db/actions/chat-actions.ts` | Server Actions de chat (create, sendMessage, sendVoice, delete) |
| `src/lib/db/actions/profile-actions.ts` | Server Actions de perfil (update, languages, settings) |

### Mensagens de voz

- Gravação no browser via MediaRecorder API
- Formato: WebM/Opus a 32kbps (comprimido)
- Upload para Supabase Storage bucket `voice-messages`
- Playback via HTML5 Audio com controles de play/pause e barra de progresso

---

## Fases do Backend

| Fase | Descrição | Status |
|------|-----------|--------|
| 1 — Auth | Supabase Auth real (email/password + OAuth) | ✅ Completa |
| 2 — Database | Persistir chats, mensagens, perfil, progresso | ✅ Completa |
| 3 — AI Integration | BYOK, service layer, streaming | Pendente |
| 4 — Polish | Rate limiting, error boundaries, voice upload | Pendente |

---

## Dependências

| Pacote | Versão | Uso |
|--------|--------|-----|
| `@supabase/supabase-js` | ^2 | Client Supabase (auth, DB, storage) |
| `@supabase/ssr` | ^0 | Server-side client para Next.js (cookies) |
| `zod` | ^4 | Validação de inputs em Server Actions |
| `react-hook-form` | ^7 | Formulários (auth pages) |
