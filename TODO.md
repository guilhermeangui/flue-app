# Fluê — Status & TODO

## Fases concluídas

### Fase 1 — Auth ✅
Supabase Auth, email/password, middleware, useAuth hook.

### Fase 2 — Database ✅
Server Components + Server Actions, todas as páginas lêem do Supabase. Gravação de áudio (WebM/Opus 32kbps), upload para Supabase Storage, playback no chat.

### Fase 3 — AI Integration ✅
- Anthropic Claude (Haiku 4.5 para conversação, Sonnet 4.5 para análise Pro)
- OpenAI Whisper para transcrição de áudio (Claude API não suporta áudio)
- Rate limiting: Free=15 msgs/dia, Pro=150 msgs/dia
- Análise de texto e voz: transcription, wordsToReview, accuracyScore, details
- Context windowing (8 msgs free, 15 pro) com prompt caching
- Aceleração de áudio 1.3x client-side (Web Audio API + WAV) para reduzir custo
- Typing indicator com timeout de 30s
- Usage counter no chat input
- Cost tracking via `usage_logs` table

#### Arquivos do AI service:
- `src/lib/ai/service.ts` — generateResponse, generateVoiceAnalysis, transcribeAudio, logUsage
- `src/lib/ai/prompts.ts` — System prompts por idioma (JSON structured output)
- `src/lib/ai/context.ts` — buildContext com windowing
- `src/lib/ai/rate-limiter.ts` — checkAndIncrementUsage, getUsageStatus

#### Decisões técnicas importantes:
- OpenAI client é lazy-initialized (evita crash sem OPENAI_API_KEY)
- `extractJson()` remove markdown fences (```json```) antes do JSON.parse
- Cada resposta AI salva 2 mensagens no DB: analysis card + coach text
- BYOK removido completamente (UI, types, DB table)

---

## Pendências menores da Fase 3

- [ ] Limpar mensagens antigas com JSON cru no DB (anteriores ao fix de 2026-04-03)
- [ ] Cron para reset diário de usage (pg_cron ou Supabase Edge Function)
- [ ] Testar/ajustar prompts em todos os idiomas (pt, en, es, fr)
- [ ] Integração Stripe para plano Pro (futura Fase 5)

---

## Fase 4 — Polimento (próxima)

### Toast / Snackbar
- [ ] Componente Toast (success, error, info)
- [ ] Auto-dismiss 3s com animação
- [ ] Integrar em: Forgot Password, Settings, Profile, Sign Out

### Responsividade
- [x] Mobile (375-402px) — design base
- [ ] Verificar 320px (iPhone SE)
- [ ] Tablet (768px+) — centralizar com max-w + fundo sutil
- [ ] Desktop (1024px+) — container com sombra, possível split view

### i18n
- [ ] Setup i18next + react-i18next
- [ ] Tradução de todas as strings (en + pt-BR)
- [ ] Seletor de idioma do app no Profile

### Animações de página
- [x] Fade-in no ChatView
- [x] Animações de entrada para mensagens
- [ ] Slide entre auth pages
- [ ] Fade entre tabs do app
- [ ] framer-motion para transições de rota

### Micro-interações (nice to have)
- [ ] Scale down nos botões primary
- [ ] Hover/press nos cards da chat list
- [ ] Pill slide no tab bar
- [ ] Spring animation no toggle
- [ ] Bounce nos score badges
- [ ] Expand/collapse animation no analysis details

### Error handling
- [ ] Error boundaries por rota
- [ ] Fallback UI para erros de rede/API
- [ ] Retry automático em falhas transientes
