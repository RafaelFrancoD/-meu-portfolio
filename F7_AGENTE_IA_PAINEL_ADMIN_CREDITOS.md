# F7 Telecom — Painel do ADMIN: gastos, créditos e compra

Sexto documento. Complementa os anteriores (ver `F7_AGENTE_IA_INDICE.md`).
Onde divergir dos anteriores, **vale este** (lista no §11).

Decisões do Rafa registradas aqui:
- **Só o ADMIN_GERAL** vê gastos e controla o uso do agente.
- Aba própria no login do ADMIN: gasto por colaborador, **em tempo real**.
- **Botão para comprar créditos** na hora, com o cartão do dono.
- **Controle do saldo** para não ser pego de surpresa: alerta e previsão de quando acaba.

> Itens que dependem da Anthropic estão marcados **[verificar]**.

---

## 1. O que é possível e como

| Pedido | Possível? | Como |
|---|---|---|
| Ver gasto de cada colaborador em tempo real | **Sim** | O próprio agente registra tokens e custo de cada execução (`agent_runs`) |
| Botão para comprar créditos | **Sim, com link** | Abre a página de cobrança da Anthropic. O dono paga **lá** |
| Crédito sobe automático após a compra | **Sim** | A Anthropic credita na conta. O agente volta a funcionar sozinho |
| Ver o saldo e ser avisado antes de acabar | **Sim** | Saldo controlado pelo painel + alertas + previsão de término |
| Digitar o cartão dentro do CRM | **Não. De propósito** | Ver §1.1 |

### 1.1 Por que o cartão não é digitado no CRM

- Dado de cartão exige certificação de segurança (PCI-DSS). O CRM não tem e não deve ter.
- Quem vende o crédito é a Anthropic. Só ela pode receber o pagamento e creditar a conta.
- Se o CRM fosse invadido, nenhum dado de cartão estaria lá.

Na prática, para o dono, a experiência é a mesma: clica no botão, abre a página de pagamento, paga, volta ao CRM.

### 1.2 Saldo real da Anthropic

| Fonte | O que dá | Situação |
|---|---|---|
| Registro do próprio agente | Gasto exato de cada execução, em tempo real | **Disponível** (já previsto) |
| API de Uso e Custo da Anthropic (Admin API) | Gasto oficial da organização, para conferência | **Disponível [verificar escopo e atraso dos dados]** |
| Saldo de créditos por API | Saldo restante oficial | **[verificar se existe]** |

Enquanto não houver saldo por API, o painel usa o **saldo estimado** (§4).

---

## 2. Acesso

| Regra | Detalhe |
|---|---|
| Quem vê | Só `ADMIN_GERAL`. Checado no servidor em toda rota `/api/agent/admin/*` |
| Outros papéis | A aba não aparece. Rota devolve `404` |
| Colaborador comum | Vê só o próprio uso do dia (mensagens e cota do modo Avançado). **Não vê valores em reais** |
| MFA | Ações que mudam limite, bloqueio ou saldo exigem código MFA (R3) |
| Auditoria | Toda mudança feita no painel vai para o `audit_log` |

---

## 3. Aba "Agente IA — Controle" (só ADMIN)

### 3.1 Topo: situação dos créditos

```
┌──────────────────────────────────────────────────────────────────┐
│ Saldo estimado      R$ 84,20   (US$ 14,80)     ● Normal          │
│ Gasto hoje          R$ 3,10    Gasto no mês      R$ 61,40        │
│ Previsão            Saldo acaba em ~12 dias (por volta de 28/11) │
│ Recarga automática  Ligada · US$ 20 quando abaixo de US$ 5       │
│                                                                  │
│   [ Comprar créditos ↗ ]   [ Informar saldo ]   [ Limites ]      │
└──────────────────────────────────────────────────────────────────┘
```

| Indicador | Cor | Regra inicial |
|---|---|---|
| Normal | Verde | Saldo cobre mais de 7 dias |
| Atenção | Amarelo | Saldo cobre de 3 a 7 dias, ou abaixo de 30 % do último saldo |
| Crítico | Vermelho | Saldo cobre menos de 3 dias, ou abaixo de US$ 5 |
| Esgotado | Cinza | API devolveu erro de crédito. Agente em modo limitado |

### 3.2 Gasto por colaborador

| Colaborador | Papel | Mensagens (hoje / mês) | Rápido / Avançado | Gasto hoje | Gasto no mês | % do total | Limite diário | Ação |
|---|---|---|---|---|---|---|---|---|
| Ana | VENDEDOR | 38 / 610 | 92 % / 8 % | R$ 0,62 | R$ 11,30 | 18 % | R$ 2,00 | [Ajustar] [Bloquear] |
| … | | | | | | | | |

- Ordenável por qualquer coluna.
- Clique no nome: detalhe com gasto por dia (gráfico), por skill e as 20 execuções mais caras.
- Filtros: hoje, 7 dias, mês atual, mês anterior, período livre.
- Exportar para `.xlsx` (gerado por código).

### 3.3 Gasto por tipo de uso

| Visão | Mostra |
|---|---|
| Por modelo | Rápido (Haiku) × Avançado (Sonnet) × áudio |
| Por skill | Quais tarefas custam mais |
| Por hora do dia | Picos de uso |
| Subidas para Sonnet | Taxa por skill (Custo e Modelos §5.4) |

### 3.4 Tempo real

- A aba recebe atualização por **SSE** (o mesmo mecanismo do chat).
- Cada execução encerrada envia um evento com usuário, custo e novo total.
- Sem SSE (conexão caiu): atualiza a cada 15 s.
- O cálculo é feito **no momento** da execução, com a tabela de preços do §6. Não depende da Anthropic.

---

## 4. Saldo estimado

A Anthropic é a dona do saldo real. O painel mantém uma estimativa conferida todos os dias.

### 4.1 Cálculo

```
saldo_estimado = último saldo informado
               + compras registradas depois dele
               + recargas automáticas registradas depois dele
               − gasto registrado pelo agente depois dele
```

### 4.2 Como o saldo entra no painel

| Evento | Como registra |
|---|---|
| Primeira configuração | ADMIN informa o saldo que aparece no Console (botão **Informar saldo**) |
| Compra pelo botão | Ao voltar ao CRM, o painel pergunta: "Quanto você comprou?" (US$). Grava como compra |
| Recarga automática | ADMIN informa no painel, ou a conferência diária detecta (§4.3) |
| Correção | **Informar saldo** a qualquer momento. Substitui a estimativa |

Toda entrada exige MFA e fica no `audit_log`.

### 4.3 Conferência diária (automática)

- Uma vez por dia, o servidor consulta a API de Uso e Custo da Anthropic **[verificar]**.
- Compara o gasto oficial com o gasto registrado pelo agente.
- Diferença acima de 5 %: alerta ao ADMIN ("Gasto oficial maior que o registrado. Confira o saldo no Console.").
- Diferença comum: transcrição de áudio por API externa, chamadas fora do agente na mesma conta. Por isso a conta da API deve ser **exclusiva do CRM**.
- Se existir saldo por API: o painel passa a usar o saldo oficial, e o "Informar saldo" vira só correção.

### 4.4 Chave de conferência

- A API de Uso e Custo exige uma **chave de administrador** da Anthropic, diferente da chave comum.
- Essa chave tem poderes amplos na organização **[verificar se existe escopo só de leitura]**.
- Regras:
  - Fica em variável de ambiente separada (`ANTHROPIC_ADMIN_KEY`), só no servidor.
  - Usada **só** pelo job de conferência. Nunca chega ao modelo, à tela ou aos logs.
  - Opcional: sem ela, o painel funciona só com o gasto registrado e o saldo informado.

---

## 5. Compra de créditos

### 5.1 Fluxo

```
ADMIN clica [Comprar créditos ↗]
  → abre a página de cobrança da Anthropic em nova aba
  → dono entra com o login dele na Anthropic (com 2FA)
  → informa o cartão e o valor
  → Anthropic credita a conta (o agente volta a funcionar sozinho)
  → dono volta ao CRM
  → painel pergunta "Quanto você comprou?" → grava a compra
```

| Regra | Detalhe |
|---|---|
| Endereço do link | Variável `ANTHROPIC_BILLING_URL` **[verificar endereço atual da página de cobrança]** |
| Abertura | Nova aba, `rel="noopener noreferrer"` |
| Login na Anthropic | Conta do dono, separada do CRM. Recomendado 2FA ligado |
| Dono da conta Anthropic | O **cliente** (dono da F7), não o desenvolvedor. O cartão e a fatura são dele |
| Cartão no CRM | Nunca |

### 5.2 Recarga automática (recomendada)

Configurada **no Console da Anthropic**, não no CRM:
- Recarrega um valor fixo quando o saldo cai abaixo de um mínimo.
- Valores iniciais: US$ 20 quando abaixo de US$ 5 (Custo e Modelos §1).
- O painel mostra a configuração informada pelo ADMIN, como lembrete.

Com recarga automática ligada, o agente não para por falta de crédito. O painel serve para **acompanhar**, não para correr atrás.

### 5.3 Limite de gasto no Console

- Limite mensal configurado no Console (ex.: US$ 40).
- É a última barreira: mesmo com erro no agente, a conta não passa disso.
- Condições exatas: **[verificar no Console]**.

---

## 6. Tabela de preços

O custo de cada execução é calculado pelo agente com uma tabela no banco.

```sql
-- f7_agent
CREATE TABLE model_prices (
  model             text NOT NULL,           -- 'claude-haiku-5-5'
  valid_from        date NOT NULL,
  input_usd_mtok    numeric(10,4) NOT NULL,
  output_usd_mtok   numeric(10,4) NOT NULL,
  cache_read_usd_mtok  numeric(10,4),
  cache_write_usd_mtok numeric(10,4),
  PRIMARY KEY (model, valid_from)
);
-- carga inicial (tabela da Anthropic de 03/11/2026)
INSERT INTO model_prices VALUES
  ('claude-haiku-5-5',  '2026-11-03', 0.10,  0.50, NULL, NULL),   -- cache: [verificar]
  ('claude-sonnet-5-5', '2026-11-03', 2.00, 10.00, 0.10, NULL);   -- escrita de cache: [verificar]
```

```
custo = (entrada × preço_entrada + saída × preço_saída
       + cache_lido × preço_cache_leitura + cache_escrito × preço_cache_escrita) / 1 000 000
```

- Tokens vêm do campo `usage` de cada resposta da API.
- Preço mudou: ADMIN cadastra nova linha com `valid_from`. O histórico não muda.
- Áudio por API externa: linha própria (por minuto), se for usado.

### 6.1 Reais

| Regra | Detalhe |
|---|---|
| Cotação | Definida pelo ADMIN no painel (ex.: R$ 5,50) |
| IOF | Percentual definido pelo ADMIN (inicial 3,5 %) |
| Exibição | Reais em destaque, dólar ao lado |
| Histórico | Cada execução grava o custo em dólar. Reais é só exibição com a cotação atual |

Cotação automática por serviço externo: fora do MVP (o servidor precisaria de acesso a mais um site).

---

## 7. Controles do ADMIN

| Controle | Efeito | MFA |
|---|---|---|
| Limite diário por colaborador (R$) | Ao atingir: colaborador passa a usar só atalhos e botões até o dia seguinte | Sim |
| Limite mensal por colaborador (R$) | Idem, até o mês seguinte | Sim |
| Bloquear colaborador | Agente indisponível para ele. Aviso: "Uso do assistente suspenso. Fale com o administrador." | Sim |
| Limite diário global | Ao atingir: modo limitado para todos (Robustez O1) | Sim |
| Reserva mínima | Abaixo do valor: só ADMIN e FINANCEIRO usam o modo completo | Sim |
| Cota do modo Avançado | Por usuário, por dia | Sim |
| Quem vê o seletor de modelo | Papéis | Sim |
| Liberar exceção por hoje | Aumenta o limite de um colaborador só no dia | Sim |

Os limites são checados **antes** de cada chamada ao modelo (`engine/budget.ts`), com o gasto acumulado em `usage_daily`.

---

## 8. Alertas

Exibidos **dentro do CRM** (sino e faixa no topo), só para o ADMIN. Sem e-mail ou WhatsApp no MVP.

| Alerta | Quando | Nível |
|---|---|---|
| Saldo em atenção | Cobre de 3 a 7 dias | Amarelo |
| Saldo crítico | Cobre menos de 3 dias ou abaixo de US$ 5 | Vermelho, faixa fixa no topo |
| Créditos esgotados | API devolveu erro de crédito | Vermelho, faixa fixa + botão Comprar |
| Gasto do dia acima do normal | Acima de 2× a média dos últimos 7 dias | Amarelo |
| Colaborador atingiu o limite | Limite diário ou mensal | Informativo |
| Conferência divergente | Diferença acima de 5 % (§4.3) | Amarelo |
| Saldo não informado há 30 dias | Estimativa envelhecendo | Informativo |
| Previsão do mês acima do limite do Console | Projeção > limite mensal | Amarelo |

Cada alerta tem ação direta: **Comprar créditos**, **Informar saldo** ou **Ver detalhe**.

### 8.1 Créditos esgotados: o que o colaborador vê

- Mensagem: "Assistente temporariamente limitado. O administrador já foi avisado."
- Continuam funcionando: atalhos, alertas, botões, confirmar prévias já geradas, desfazer.
- Nada é perdido. Ao repor o crédito, volta sozinho (healthcheck a cada 60 s).

---

## 9. Previsão de término

```
gasto_médio_diário = média dos últimos 7 dias úteis (ignora dias sem uso)
dias_restantes     = saldo_estimado / gasto_médio_diário
data_prevista      = hoje + dias_restantes (em dias úteis)
```

- Com menos de 3 dias de histórico: mostra "Previsão disponível após 3 dias de uso".
- Recarga automática ligada: mostra também "Próxima recarga prevista em ~X dias".
- Projeção do mês: gasto até hoje + média diária × dias úteis restantes.

---

## 10. Implementação

### 10.1 Banco `f7_agent`

```sql
-- agent-migrations/0XX_painel_admin.sql

CREATE TABLE credit_ledger (                    -- só INSERT
  id           bigserial PRIMARY KEY,
  at           timestamptz NOT NULL DEFAULT now(),
  kind         text NOT NULL CHECK (kind IN
               ('balance_set','purchase','auto_reload','adjustment','reconciliation')),
  amount_usd   numeric(12,4) NOT NULL,          -- saldo informado ou valor do evento
  note         text,
  crm_user_id  integer NOT NULL                 -- ADMIN que registrou
);
REVOKE UPDATE, DELETE, TRUNCATE ON credit_ledger FROM f7_agent_app;

CREATE TABLE user_limits (
  crm_user_id        integer PRIMARY KEY,
  daily_limit_usd    numeric(10,4),             -- null = sem limite próprio
  monthly_limit_usd  numeric(10,4),
  blocked            boolean NOT NULL DEFAULT false,
  exception_until    date,
  exception_limit_usd numeric(10,4),
  changed_by integer, changed_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE billing_settings (
  key   text PRIMARY KEY,   -- 'brl_rate','iof_pct','global_daily_limit_usd','reserve_usd',
                            -- 'console_monthly_limit_usd','auto_reload_threshold_usd','auto_reload_amount_usd'
  value jsonb NOT NULL,
  changed_by integer, changed_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE admin_alerts (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind        text NOT NULL,
  level       text NOT NULL CHECK (level IN ('info','warn','critical')),
  message     text NOT NULL,
  data        jsonb,
  created_at  timestamptz NOT NULL DEFAULT now(),
  read_at     timestamptz,
  resolved_at timestamptz
);

CREATE TABLE usage_reconciliation (
  day            date PRIMARY KEY,
  agent_cost_usd numeric(12,4) NOT NULL,
  official_cost_usd numeric(12,4),
  diff_pct       numeric(6,2),
  checked_at     timestamptz NOT NULL DEFAULT now()
);

-- custo por execução (se ainda não existir)
ALTER TABLE agent_runs ADD COLUMN IF NOT EXISTS cost_usd numeric(10,5);
CREATE INDEX IF NOT EXISTS agent_runs_user_day ON agent_runs (crm_user_id, created_at);
```

### 10.2 Rotas (todas `requireRole('ADMIN_GERAL')`)

| Rota | Função |
|---|---|
| `GET /api/agent/admin/billing/summary` | Topo: saldo, gasto hoje/mês, previsão, status |
| `GET /api/agent/admin/billing/users?from=&to=` | Tabela por colaborador |
| `GET /api/agent/admin/billing/users/:id` | Detalhe de um colaborador |
| `GET /api/agent/admin/billing/breakdown?by=model\|skill\|hour` | Gasto por tipo |
| `GET /api/agent/admin/billing/stream` | SSE em tempo real |
| `POST /api/agent/admin/billing/ledger` | Informar saldo, compra, recarga (MFA) |
| `PUT /api/agent/admin/billing/limits/:userId` | Limites e bloqueio (MFA) |
| `PUT /api/agent/admin/billing/settings` | Cotação, IOF, limites globais, reserva (MFA) |
| `GET /api/agent/admin/billing/export.xlsx` | Exportação |
| `GET /api/agent/admin/alerts` · `POST /api/agent/admin/alerts/:id/read` | Alertas |
| `GET /api/agent/me/usage` | **Colaborador:** só o próprio uso do dia, sem valores |

### 10.3 Código

```
server/src/agent/
  billing/
    cost.ts            # custo por execução a partir de usage + model_prices
    balance.ts         # saldo estimado (§4.1)
    forecast.ts        # previsão (§9)
    limits.ts          # checagem de limites (chamado por engine/budget.ts)
    reconcile.ts       # conferência diária (§4.3) — opcional, precisa da chave de admin
    alerts.ts          # regras do §8
    creditError.ts     # detecta erro de crédito da API → modo limitado + alerta
  routes/admin/billing.ts
components/
  admin/AgentBillingTab.tsx      # a aba
  admin/AgentBalanceCard.tsx     # topo (§3.1)
  admin/AgentUsersTable.tsx      # §3.2
  admin/AgentAlertsBell.tsx      # §8
```

Jobs (laço no próprio servidor, como o worker de lote):
- A cada 5 min: alertas de saldo e previsão.
- 1 vez por dia (madrugada): conferência (§4.3).

### 10.4 Variáveis de ambiente

```
ANTHROPIC_BILLING_URL=          # página de cobrança da Anthropic [verificar endereço]
ANTHROPIC_ADMIN_KEY=            # opcional, só para a conferência diária
BILLING_RECONCILE_ENABLED=false
BILLING_ALERT_CHECK_MIN=5
```

---

## 11. O que muda nos documentos anteriores

| Documento | Trecho | Mudança |
|---|---|---|
| v2 §10 | `GET /admin/runs` · `GET /admin/audit` | Soma as rotas do §10.2 |
| v2 §13 | Custo: alerta em 80 % | Alertas do §8 |
| Robustez O1 | Modo degradado | Também ao esgotar crédito (§8.1) |
| Custo e Modelos §1 | Teto diário no agente | Configurável no painel (§7) |
| Custo e Modelos §11 | Painel do ADMIN (acréscimos) | Detalhado neste documento |
| Custo e Modelos §15.1 | Cotação fixa ou automática | Decidido: fixa, definida pelo ADMIN (§6.1) |
| Regras Globais §A5 | Teto diário por usuário | Valor por colaborador no painel (§7) |

---

## 12. Testes

| Caso | Esperado |
|---|---|
| VENDEDOR acessa `/api/agent/admin/billing/*` | `404` |
| Colaborador abre a própria cota | Vê mensagens e cota; **sem** reais |
| Execução encerrada | Painel do ADMIN atualiza em ≤ 2 s |
| Custo calculado × custo esperado (conjunto de execuções fixas) | Diferença 0 |
| Colaborador atinge o limite diário | Próxima mensagem: só atalhos e botões, com aviso |
| ADMIN bloqueia colaborador | Próxima mensagem recusada |
| Mudar limite sem MFA | Recusado |
| API devolve erro de crédito | Modo limitado + alerta crítico + botão Comprar |
| Crédito reposto | Volta ao normal em ≤ 60 s |
| Conferência com 10 % de diferença | Alerta amarelo |
| Saldo informado + compra + gasto | Saldo estimado correto |
| Tentar alterar `credit_ledger` | Banco recusa |

---

## 13. Perguntas em aberto

1. A conta da Anthropic já está no nome do cliente (dono da F7)?
2. Limite diário padrão por colaborador: R$ 2 serve?
3. Reserva mínima: abaixo de quanto só ADMIN e FINANCEIRO continuam no modo completo?
4. Conferência diária com a chave de administrador da Anthropic: ativar desde o início ou só depois do piloto?
