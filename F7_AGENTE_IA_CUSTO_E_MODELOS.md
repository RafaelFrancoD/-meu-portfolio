# F7 Telecom — Custo, modelos e seleção automática/manual

Quinto documento. Complementa:
- `F7_AGENTE_IA_ARQUITETURA_COMPLETA.md` (v2)
- `F7_AGENTE_IA_UM_AGENTE_VS_VARIOS.md`
- `F7_AGENTE_IA_REGRAS_GLOBAIS.md`
- `F7_AGENTE_IA_ROBUSTEZ_E_AUTOMACAO.md`

Onde divergir dos anteriores, **vale este** (lista no §12).

Decisões do Rafa registradas aqui:
- **Opção econômica é o padrão.** Haiku na maior parte; Sonnet só onde precisa.
- **Seleção de modelo automática**, com **seletor manual controlado** no chat.
- **Cobrança pela API** (créditos com recarga automática). Assinatura Pro/Max não é usada.
- Melhorias no projeto: aplicar direto, sem pedir confirmação.

> Preços: tabela da Anthropic de 03/11/2026. Reais: dólar a R$ 5,50 + IOF ~3,5% (exemplo).
> Valores de custo são **estimativa**. O real sai do primeiro mês (`agent_runs`).

---

## 1. Como o agente é pago

| Item | Decisão |
|---|---|
| Fonte | API da Anthropic (Console), workspace próprio do CRM |
| Assinatura Pro/Max | **Não usar.** É de uso pessoal; atender colaboradores por ela viola os termos e esbarra nos limites por pessoa |
| Pagamento | Créditos pré-pagos + **recarga automática** no cartão |
| Moeda | Dólar. O cartão converte com IOF |
| Chave | `ANTHROPIC_API_KEY` no `server/.env`. Nunca no código |
| Alternativa futura | Fatura mensal (negociar) ou Bedrock/Vertex se a F7 já usar essas nuvens |

### Configuração inicial no Console (opção econômica)

| Ajuste | Dólar | Reais (aprox.) |
|---|---|---|
| Crédito inicial | US$ 30 | R$ 170 |
| Recarga automática | US$ 20 quando o saldo ficar abaixo de US$ 5 | R$ 115 |
| Limite de gasto mensal (Console) | US$ 40 | R$ 230 |
| Teto diário no agente (soma dos usuários) | US$ 2 | R$ 11 |

Condições exatas de recarga e limite no Console: **[verificar]**.

---

## 2. Preço dos modelos

| Modelo | ID | Entrada US$/1M | Saída US$/1M | Leitura de cache US$/1M |
|---|---|---|---|---|
| Claude Haiku 5.5 | `claude-haiku-5-5` | 0,10 | 0,50 | **[verificar]** |
| Claude Sonnet 5.5 | `claude-sonnet-5-5` | 2,00 | 10,00 | 0,10 |

- Haiku 5.5: o preço acima vale para prompts de até 100 mil tokens. O contexto do agente fica muito abaixo disso (Regras Globais §A3).
- Opus e Fable **não são usados**. Custo alto demais para o caso.
- IDs vêm de variável de ambiente (§10). Nunca fixos no código.

---

## 3. Estimativa de custo (5 usuários)

Premissas: 22 dias úteis; 30 % das mensagens resolvidas por código (atalho, pergunta, botão); ~2 rodadas por execução; cache ativo; margem de 30 %.

| Opção | Como funciona | Leve (20 msg/dia) | **Normal (40 msg/dia)** | Intenso (80 msg/dia) |
|---|---|---|---|---|
| **Econômica (padrão)** | Haiku em quase tudo; Sonnet em PDF, análise e escalada | ~R$ 50 | **~R$ 90 a 100** | ~R$ 190 |
| Intermediária | Haiku em consultas; Sonnet em ações | ~R$ 115 | ~R$ 220 | ~R$ 440 |
| Completa | Sonnet em tudo | ~R$ 200 | ~R$ 400 | ~R$ 800 |

- **Por usuário (econômica, normal): ~R$ 20 por mês.**
- Usuário a mais: some ~R$ 20.
- Áudio transcrito no próprio servidor: **R$ 0** de API (§8).

### Por que o Haiku dá conta da maior parte
- O trabalho pesado já é do código: permissão, risco, perguntas, prévias, cards, datas, valores.
- O modelo só interpreta a ordem e escolhe tools de uma skill pequena.
- Na dúvida, ele pergunta. Nada é gravado sem prévia e clique.
- A suíte de testes decide, por skill, se o Haiku basta (§7).

---

## 4. Modelo por skill (padrão)

Campo novo no manifesto: `model: haiku | sonnet`.

| Grupo | Skills | Modelo |
|---|---|---|
| Roteador | — | Haiku |
| Consulta | buscar_cliente, consultar_os, consultar_fatura, listar_vencidas, resumo_do_dia, auditar_acoes | Haiku |
| Ação | cadastrar/editar cliente, criar/mover/qualificar lead, abrir/editar/transferir/cancelar O.S., agenda, desfazer | Haiku |
| Financeiro (ação) | propor/emitir/cancelar fatura, lançar movimentação, marcar vencidas | Haiku |
| Lote | importar/atualizar planilha | Haiku (mapa de colunas e validação são código) |
| Texto | texto_followup, texto_cobranca, tratar_objecao | Haiku |
| Texto longo | gerar_proposta | **Sonnet** |
| Análise | ler_pdf, analisar_fatura_operadora, relatorio_gerencial, relatorio_financeiro | **Sonnet** |
| Imagem | leitura de foto/print | **Sonnet** |
| Resumo rolante da conversa | — | Haiku |

Financeiro fica no Haiku porque o valor nunca vem do modelo: vem do CRM (`plans`, O.S.) e é conferido pela procedência (Regras Globais B2) e pelo MFA.

---

## 5. Seleção automática (padrão)

Arquivo: `engine/modelSelect.ts`. Decide **antes** de cada chamada ao modelo principal. Custo zero (código).

### 5.1 Ordem de decisão

```
1. Modo manual "Avançado" ativo e com cota?       → Sonnet
2. Modo manual "Rápido"?                           → Haiku (exceto skill que exige Sonnet)
3. Skill com model: sonnet?                        → Sonnet
4. Alguma regra de subida (5.2) vale?              → Sonnet
5. Senão                                           → Haiku
```

### 5.2 Sobe para o Sonnet

| Regra | Motivo |
|---|---|
| Anexo PDF, imagem ou documento acima de 3 000 palavras | Leitura exige mais |
| Plano com 3 ou mais etapas | Encadeamento exige mais |
| Saída do Haiku inválida (Zod) após o reparo | Uma subida, no lugar de pedir ajuda direto |
| Skill marcada `escalate: true` pela suíte (§7) | Teste provou que o Haiku erra |
| Recusa (`refusal`) do Haiku | Tenta uma vez no Sonnet |

A subida acontece **uma vez por execução**. Se o Sonnet também falhar: para e pergunta ao usuário.

### 5.3 Nunca sobe

| Situação | O que faz |
|---|---|
| Ordem ambígua ou faltando dado | **Pergunta.** Modelo mais caro não resolve dúvida |
| Loop detectado | Para (Regras Globais B6) |
| Teto de tokens ou rodadas | Para (Regras Globais A5) |
| Erro de tool | Para (Regras Globais B5) |
| Teto diário de custo atingido | Modo degradado (Robustez O1) |

### 5.4 Registro
- `agent_runs.model` grava o modelo usado.
- `agent_runs.model_reason`: `skill_default | escalated_attachment | escalated_plan | escalated_invalid | escalated_eval | escalated_refusal | manual_fast | manual_advanced`.
- Painel do ADMIN mostra a taxa de subida por skill. Skill com subida acima de 30 % volta para revisão (prompt, exemplos ou `model: sonnet`).

---

## 6. Seletor manual no chat

```
Modelo:  [ Automático ▾ ]
          • Automático   (recomendado)
          • Rápido       — mais barato
          • Avançado     — mais preciso · 20 usos hoje
```

| Regra | Valor inicial |
|---|---|
| Padrão | Automático, sempre |
| Quem vê o seletor | Definido pelo ADMIN por papel. Inicial: ADMIN_GERAL, GERENTE_VENDAS, FINANCEIRO |
| Cota do Avançado | 20 mensagens por usuário por dia |
| Validade da escolha | Só na conversa atual. Nova conversa volta ao Automático |
| Cota esgotada | Volta ao Automático, com aviso. Nada trava |
| "Rápido" em skill que exige Sonnet (ex.: ler PDF) | Usa Sonnet e avisa: "Esta tarefa precisa do modo Avançado" |
| Selo na resposta | "Rápido" ou "Avançado", discreto, em cada resposta |

O seletor muda **só o modelo**. Permissões, travas, prévia, clique e MFA continuam iguais em qualquer modo.

Nomes na tela: "Rápido" e "Avançado". O colaborador não precisa saber o que é Haiku ou Sonnet.

---

## 7. Como a suíte de testes decide o modelo

1. Cada skill roda o golden set no Haiku e no Sonnet.
2. Haiku ≥ meta da skill (95 % de acerto de intenção e 100 % nos casos de segurança): `model: haiku`.
3. Haiku abaixo da meta, mas só em um tipo de caso: `escalate: true` só para esse tipo (ex.: ordem com mais de 2 entidades).
4. Haiku abaixo da meta no geral: `model: sonnet`.
5. Reavaliar a cada troca de versão de modelo, prompt ou skill.

Resultado gravado em `skill_versions.manifest`. Mudar `model` é uma nova versão da skill, com rollback.

---

## 8. Áudio sem custo de API

| Opção | Custo | Decisão |
|---|---|---|
| **faster-whisper no VPS** (modelo `small` ou `medium`, PT-BR) | R$ 0 de API; usa CPU | **Padrão** |
| API externa de transcrição | ~R$ 40/mês | Só se o VPS não aguentar |

- Teste obrigatório na Fase 3: tempo e taxa de erro com áudios reais da equipe.
- Meta: áudio de 60 s transcrito em ≤ 15 s no VPS **[medir]**.
- Se não atingir: API externa, com o custo somado em `usage_daily`.

---

## 9. Ajustes técnicos dos modelos

Comportamento da API a respeitar no código. **[verificar na documentação da Anthropic antes de codar]**.

| Tema | Haiku 5.5 | Sonnet 5.5 |
|---|---|---|
| Esforço (`output_config.effort`) | `low` no roteador e no chat; `medium` em ação | `low` em texto; `medium` em análise |
| Raciocínio (`thinking`) | Adaptativo (padrão) | Adaptativo. `disabled` dá erro; para desligar entre tools existe modo próprio |
| Forçar tool (`tool_choice: any/tool`) | — | **Não suportado.** Usar `auto` + `strict: true` + instrução no prompt |
| Saída estruturada | `output_config.format` no roteador | Idem |
| Recusa (`stop_reason: refusal`) | Sem fallback no servidor → regra 5.2 (sobe uma vez) | Usar `fallbacks: "default"` (beta) **[verificar]** |
| Cache | Por modelo. Trocar de modelo no meio da execução perde o cache | Idem |
| Pré-preenchimento da resposta (prefill) | Não usar | Não suportado |

Consequência do cache por modelo: a subida (§5.2) acontece **no início** da execução sempre que possível, nunca rodada a rodada.

Tetos de saída (Regras Globais §A5) continuam valendo nos dois modelos.

---

## 10. Variáveis de ambiente

Substituem `MODEL_ROUTER` e `MODEL_MAIN` da v2 §16.

```
MODEL_FAST=claude-haiku-5-5
MODEL_ADVANCED=claude-sonnet-5-5
MODEL_ROUTER=claude-haiku-5-5
AGENT_ADVANCED_DAILY_QUOTA=20
AGENT_MODEL_SELECTOR_ROLES=ADMIN_GERAL,GERENTE_VENDAS,FINANCEIRO
AGENT_ESCALATE_DOC_WORDS=3000
AGENT_ESCALATE_PLAN_STEPS=3
AGENT_DAILY_COST_LIMIT_USD=2
AGENT_MONTHLY_COST_ALERT_USD=30
STT_PROVIDER=local
STT_LOCAL_MODEL=small
```

---

## 11. Banco `f7_agent`: migração

```sql
-- agent-migrations/0XX_custo_e_modelos.sql

ALTER TABLE agent_runs
  ADD COLUMN model_mode   text NOT NULL DEFAULT 'auto'
    CHECK (model_mode IN ('auto','fast','advanced')),
  ADD COLUMN model_reason text CHECK (model_reason IN
    ('skill_default','escalated_attachment','escalated_plan','escalated_invalid',
     'escalated_eval','escalated_refusal','manual_fast','manual_advanced'));

ALTER TABLE conversations
  ADD COLUMN model_mode text NOT NULL DEFAULT 'auto'
    CHECK (model_mode IN ('auto','fast','advanced'));

ALTER TABLE usage_daily
  ADD COLUMN advanced_runs integer NOT NULL DEFAULT 0,       -- cota do modo Avançado
  ADD COLUMN cost_fast_usd     numeric(10,5) NOT NULL DEFAULT 0,
  ADD COLUMN cost_advanced_usd numeric(10,5) NOT NULL DEFAULT 0;

CREATE TABLE model_settings (                                 -- ajustável pelo ADMIN
  key        text PRIMARY KEY,                                -- 'selector_roles','advanced_quota'
  value      jsonb NOT NULL,
  changed_by integer,
  changed_at timestamptz NOT NULL DEFAULT now()
);
```

Cota do Avançado: incremento atômico em `usage_daily` (`UPDATE … SET advanced_runs = advanced_runs + 1 WHERE … AND advanced_runs < quota RETURNING`). Sem linha devolvida = cota esgotada.

### Código novo

```
server/src/agent/
  engine/modelSelect.ts     # §5
  engine/llmClient.ts       # chamada única: modelo, esforço, teto, fallback, custo
  routes/modelMode.ts       # PATCH /conversations/:id/model-mode
  routes/admin/models.ts    # papéis do seletor, cota (ADMIN)
components/
  AgentModelSelector.tsx    # §6
  AgentModelBadge.tsx       # selo na resposta
```

Rota nova: `PATCH /api/agent/conversations/:id/model-mode` com `{ "mode": "auto" | "fast" | "advanced" }`. Valida papel e cota no servidor; a tela só reflete.

### Painel do ADMIN (acréscimos)
- Gasto do mês em reais (cotação configurável) e em dólar, por modelo e por usuário.
- Projeção do mês com base nos dias decorridos.
- Taxa de subida para Sonnet por skill.
- Uso da cota Avançado por usuário.

---

## 12. O que muda nos documentos anteriores

| Documento | Trecho | Mudança |
|---|---|---|
| v2 §7.2 | Modelos: Haiku roteador, Sonnet principal | Haiku é o padrão também no principal. Sonnet por skill ou subida (§4, §5) |
| v2 §6 | STT a definir | Padrão: faster-whisper local (§8) |
| v2 §8.1 | Manifesto | Novos campos `model` e `escalate` |
| v2 §13 | Custo: teto diário e por usuário | Valores do §1 e §10 |
| v2 §16 | `MODEL_ROUTER`, `MODEL_MAIN`, `STT_PROVIDER` | Substituídos pelo §10 |
| v2 §19.3 | STT em aberto | Decidido: local, com fallback para API |
| Regras Globais §A5 | Tetos por classe | Mantidos; valem nos dois modelos |
| Regras Globais §A6 | Cache | Cache é por modelo: subida no início da execução (§9) |
| Robustez U2 | Semáforo de chamadas | Um semáforo por modelo (limites da conta são separados) **[verificar]** |
| Robustez O1 | Modo degradado | Se só o Sonnet falhar, segue no Haiku; skills que exigem Sonnet ficam indisponíveis com aviso |

---

## 13. Testes e critérios de aceite

| Caso | Esperado |
|---|---|
| Consulta simples no Automático | Haiku |
| Anexo PDF no Automático | Sonnet, `model_reason = escalated_attachment` |
| Ordem ambígua | Pergunta. Sem subida |
| Haiku devolve JSON inválido 2 vezes | Uma subida para Sonnet; falhou → pergunta |
| Usuário sem papel tenta `PATCH model-mode` | `403` |
| 21ª mensagem no Avançado no mesmo dia | Volta ao Automático, com aviso |
| "Rápido" com PDF | Usa Sonnet e avisa |
| Teto diário de custo atingido | Modo degradado |
| Nova conversa após usar Avançado | Começa no Automático |

**Critérios para produção (somam aos anteriores):**
- Cada skill com `model` definido pela suíte (§7), não por palpite.
- Taxa de subida medida e abaixo de 30 % por skill.
- Custo do piloto dentro do limite do Console.
- 0 chamada ao Sonnet fora das regras do §5 (auditado por `model_reason`).

---

## 14. Piloto com o cliente

| Item | Proposta |
|---|---|
| Duração | 1 mês |
| Opção | Econômica |
| Limite fixo no Console | US$ 20 (~R$ 115). Não passa disso |
| Escopo | Fases 1 e 2 da v2 (leitura + escrita com confirmação) |
| Entrega no fim | Relatório: custo real, mensagens, taxa de acerto, horas poupadas estimadas |
| Decisão depois | Manter, ajustar modelo por skill ou ampliar escopo |

---

## 15. Perguntas em aberto

1. Cotação de referência para o painel em reais: fixa (definida pelo ADMIN) ou atualizada por serviço externo?
2. Papéis com acesso ao seletor manual: os três do §6 servem?
3. Cota do Avançado: 20 por dia serve?
4. O VPS tem CPU para o faster-whisper? (medir na Fase 3)
