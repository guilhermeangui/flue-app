# Fase 3 — AI Integration: Free Tier + Plano Pro

## Contexto

Fases 1 (Auth) e 2 (Database) estão completas. O app Fluê tem chat funcional com persistência, gravação de áudio, skeletons, animações. Faltam respostas de IA — atualmente mensagens são salvas no DB mas nenhuma resposta é gerada.

**Modelo de negócio escolhido:** A plataforma fornece a IA (sem BYOK). Free tier com limite diário + Plano Pro (R$29.90/mo) com limite maior.

**Decisão:** Remover toda infraestrutura de BYOK (UI de "Connect", `AI_PROVIDERS`, `user_api_keys` table, `AIProvider` type). A chave da API fica server-side como env var.

---

## Mudanças no código existente (cleanup BYOK)

### 1. Remover UI de AI Provider das Settings

**Arquivo:** `src/components/settings/settings-view.tsx`
- Deletar seção "AI PROVIDER" inteira (linhas ~119-178) — cards de Claude/OpenAI com botões "Connect"
- Remover estados `claudeConnected` e `openaiConnected`

### 2. Remover tipos e constantes BYOK

**Arquivo:** `src/lib/types.ts`
- Deletar interface `AIProvider` (linhas 83-88)

**Arquivo:** `src/lib/constants.ts`
- Deletar array `AI_PROVIDERS` e import de `AIProvider`

**Arquivo:** `src/lib/db/types.ts`
- Deletar interface `UserApiKeyRow`

### 3. Tabela `user_api_keys` no DB

- Criar migration `003_drop_api_keys.sql` para dropar a tabela
- Ou manter e repurposar para tracking de uso (decisão: **dropar** — usage tracking vai em outra tabela)

### 4. Adicionar campos de usage/tier ao User

**Arquivo:** `src/lib/types.ts` — adicionar ao `User`:
```typescript
tier: "free" | "pro";
dailyMessagesUsed: number;
dailyMessageLimit: number;
```

**Migration `003_usage_and_tiers.sql`:**
```sql
-- Dropar tabela BYOK
DROP TABLE IF EXISTS public.user_api_keys;

-- Adicionar tier ao profiles
ALTER TABLE public.profiles
  ADD COLUMN tier TEXT NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'pro')),
  ADD COLUMN daily_messages_used INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN daily_messages_reset_at DATE NOT NULL DEFAULT CURRENT_DATE;

-- Tabela de usage tracking (para analytics e billing)
CREATE TABLE public.usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  chat_id UUID REFERENCES public.chats(id) ON DELETE SET NULL,
  model TEXT NOT NULL,
  input_tokens INTEGER NOT NULL DEFAULT 0,
  output_tokens INTEGER NOT NULL DEFAULT 0,
  cached_tokens INTEGER NOT NULL DEFAULT 0,
  cost_cents NUMERIC(10,4) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX usage_logs_user_date_idx ON public.usage_logs(user_id, created_at DESC);

-- RLS
ALTER TABLE public.usage_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own usage" ON public.usage_logs
  FOR SELECT USING (auth.uid() = user_id);
```

---

## Arquitetura do AI Service

### Modelo escolhido

| Tier | Modelo | Msgs/dia | Custo estimado/user |
|------|--------|----------|---------------------|
| Free | Claude 3.5 Haiku | 15 | ~R$0.30/dia max |
| Pro  | Claude 3.5 Haiku (+ Sonnet para analysis) | 150 | ~R$3/dia max |

Haiku para conversação (barato, rápido). Sonnet só para análise detalhada de pronúncia/gramática no Pro.

### Fluxo

```
User envia mensagem (text/voice)
  → Server Action salva msg do user no DB
  → Server Action chama AI Service
    → Rate limiter verifica limite diário
    → Context builder monta prompt (system + últimas N msgs)
    → Para voice: transcreve áudio (Whisper ou Haiku multimodal)
    → Chama Claude API (Haiku ou Sonnet)
    → Salva resposta do AI no DB (type: "text" ou "analysis")
    → Log de usage (tokens, custo)
    → Revalidate path
  → Client recebe resposta via revalidação
```

### Arquivos novos

```
src/
  lib/
    ai/
      service.ts          — generateResponse(chatId, userMessage): orquestra tudo
      prompts.ts          — System prompts por idioma e tipo de interação
      context.ts          — buildContext(): monta histórico com janela de contexto
      rate-limiter.ts     — checkAndIncrementUsage(userId): verifica/incrementa limite
      transcribe.ts       — transcribeAudio(url): transcrição de áudio
    db/
      actions/
        ai-actions.ts     — Server Action que chama o service após sendMessage
      queries.ts          — adicionar getRecentMessages(chatId, limit)
  app/
    api/
      ai/
        respond/route.ts  — (alternativa) API route se streaming for necessário
```

---

## Otimizações de custo

### 1. Prompt Caching (Anthropic)
- System prompt + primeiras mensagens do chat ficam em cache
- Economia de ~90% nos tokens de input repetidos
- **Implementação:** Usar `cache_control: { type: "ephemeral" }` nos blocos de system prompt

### 2. Context Windowing
- Enviar apenas as últimas 10-15 mensagens como contexto (não o chat inteiro)
- Incluir um resumo das mensagens anteriores gerado periodicamente
- Free tier: janela de 8 msgs. Pro: janela de 15 msgs + resumo

### 3. Aceleração de áudio
- Antes de enviar áudio para transcrição, acelerar 1.3x-1.5x
- Reduz duração do áudio → menos tokens de input (áudio cobrado por segundo)
- Incluir no prompt: "O áudio está acelerado em 1.3x"
- **Implementação:** Usar Web Audio API (`playbackRate`) no client antes de enviar, ou FFmpeg no server

### 4. Respostas curtas por default
- System prompt instrui o AI a ser conciso (2-3 frases por resposta)
- Reduz tokens de output significativamente
- Modo "explicação detalhada" só quando o usuário pede

### 5. Smart model routing
- Mensagens simples de conversação → Haiku (mais barato)
- Análise de pronúncia/gramática → Sonnet (mais capaz, só Pro)
- Detecção automática: se o usuário enviou áudio, o próximo passo é análise

### 6. Debounce e batching
- Se o usuário enviar várias mensagens rápidas, agrupar em uma única chamada de API
- Timeout de 2s antes de chamar a API

### 7. Cache de respostas comuns
- Saudações iniciais, instruções básicas → respostas pré-definidas (sem chamar API)
- Primeira mensagem de cada chat pode ser template

### 8. Reset diário de usage
- Cron job ou Supabase Edge Function às 00:00 UTC-3
- `UPDATE profiles SET daily_messages_used = 0, daily_messages_reset_at = CURRENT_DATE`

---

## Steps de implementação

### Step 1 — Migration: cleanup BYOK + adicionar tier/usage
- Criar `supabase/migrations/003_usage_and_tiers.sql`
- Dropar `user_api_keys`, adicionar `tier`/`daily_messages_used` ao profiles, criar `usage_logs`
- Atualizar `src/lib/db/types.ts` (remover `UserApiKeyRow`, adicionar `UsageLogRow`)
- Atualizar `src/lib/types.ts` (remover `AIProvider`, adicionar tier fields ao `User`)

### Step 2 — Cleanup UI BYOK
- Remover seção AI Provider de `settings-view.tsx`
- Remover `AI_PROVIDERS` de `constants.ts`
- Atualizar mappers/queries para incluir novos campos de tier

### Step 3 — Rate limiter
- `src/lib/ai/rate-limiter.ts` — `checkUsage(userId)` retorna `{ allowed, remaining, limit }`
- Incrementa `daily_messages_used` atomicamente
- Reset automático se `daily_messages_reset_at < today`
- Limites: Free=15, Pro=150

### Step 4 — AI Service core
- `src/lib/ai/prompts.ts` — System prompts para cada idioma (pt, en, es, fr)
- `src/lib/ai/context.ts` — Monta array de mensagens com windowing
- `src/lib/ai/service.ts` — Chama Anthropic SDK, retorna resposta estruturada
- Env var: `ANTHROPIC_API_KEY`

### Step 5 — Integrar no fluxo de mensagens
- Modificar `sendMessage` em `chat-actions.ts` para chamar AI após salvar msg do user
- AI responde com texto ou análise
- Resposta salva no DB como mensagem com `sender: "ai"`
- UI recebe via `revalidatePath`

### Step 6 — Transcrição de áudio
- `src/lib/ai/transcribe.ts` — Enviar áudio para transcrição
- Opção A: Claude Haiku multimodal (aceita áudio direto)
- Opção B: OpenAI Whisper API (mais barato para transcrição pura)
- Após transcrição, gerar análise de pronúncia/gramática

### Step 7 — UI de rate limiting
- Mostrar mensagens restantes no chat input: "12/15 mensagens restantes hoje"
- Quando atingir limite: desabilitar input + mostrar CTA para upgrade
- Componente de upgrade banner

### Step 8 — Otimizações
- Prompt caching no Anthropic SDK
- Context windowing (últimas N mensagens)
- Aceleração de áudio client-side
- Respostas template para saudações

### Step 9 — Loading states para AI
- Typing indicator ("AI is typing...") enquanto aguarda resposta
- Skeleton de mensagem AI com animação de pulse
- Timeout de 30s com fallback

### Step 10 — Testes e ajuste de prompts
- Testar conversação em todos os idiomas
- Testar análise de pronúncia com áudio real
- Ajustar prompts para qualidade e concisão
- Verificar custos reais vs estimativas

---

## Env vars necessárias

```env
ANTHROPIC_API_KEY=sk-ant-...
# Opcional, se usar Whisper para transcrição:
OPENAI_API_KEY=sk-...
```

## Verificação

1. Enviar mensagem de texto → receber resposta do AI em <3s
2. Enviar áudio → receber transcrição + análise
3. Enviar 15 mensagens no Free tier → receber erro de limite
4. Confirmar usage_logs sendo populados
5. `pnpm build` sem erros
