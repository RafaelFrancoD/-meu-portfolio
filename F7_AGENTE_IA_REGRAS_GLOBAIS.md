# F7 Telecom — Regras globais do agente (economia de tokens + zero achismo)

Complemento de `F7_AGENTE_IA_ARQUITETURA_COMPLETA.md` (v2) e `F7_AGENTE_IA_UM_AGENTE_VS_VARIOS.md`.
Onde este documento divergir dos anteriores, **vale este** (lista no §14).

Decisões do Rafa registradas aqui:
- **Economia de tokens é obrigatória.** Entrada e saída curtas, sem desperdício.
- **Achismo é proibido.** O agente não chuta, não tenta de novo às cegas, não entra em loop.
- **Na dúvida, pergunta ao colaborador antes de agir.**

> Valores numéricos (tetos, limites) são **ponto de partida**. Calibrar com medição real na Fase 1.
> Itens não confirmados estão marcados **[verificar]**.

---

## 1. Princípio

**O prompt pede. O código garante.**

| Camada | O que faz | Confiável? |
|---|---|---|
| `prompts/base.md` | Orienta o estilo e a postura do modelo | Não sozinho |
| Motor (`engine/`) | Aplica tetos, bloqueia chute, corta loop | **Sim** |
| Manifesto da skill | Define os limites daquela tarefa | Sim (lido pelo motor) |
| Suíte de avaliação | Prova que as regras valem a cada mudança | Sim |

Estas regras **não são uma skill**. Skill é uma tarefa. Isto vale para **todas** as skills, e fica no motor.

---

## 2. Onde as regras entram no ciclo

Seis portões. Quatro são código puro (custo zero de tokens).

```
mensagem
  │
  ▼ P1  Pré-filtro            (código)   limpa, limita, tenta atalho
  ▼ P2  Roteador + compactador (modelo pequeno)  escolhe skill, extrai a ordem em JSON
  ▼ P3  Completude            (código)   falta dado? pergunta. Não chama o modelo principal
  ▼ P4  Loop de tools         (modelo principal) com orçamento e detector de loop
  ▼ P5  Procedência           (código)   todo valor tem origem comprovada? senão, pergunta
  ▼ P6  Saída                 (código)   card montado por código, teto de tokens, linter
  │
  ▼ resposta / prévia / pergunta
```

O modelo principal (mais caro) só roda no P4, e só quando a ordem já está **completa e sem ambiguidade**.

---

## 3. Regra A — Economia de tokens

### A1. Entrada (P1, código)

| Controle | Regra | Valor inicial |
|---|---|---|
| Limite de caracteres | Caixa de texto mostra contador. Acima do limite, não envia. | 1 500 |
| Limpeza | Remove espaços e linhas repetidas, assinaturas, saudações soltas. | — |
| Texto colado longo | Acima do limite: vira **anexo de texto**, tratado como documento (§A3). | — |
| Atalho determinístico | Padrão simples resolve sem modelo principal. | ver abaixo |
| Botões e formulários | Ordens comuns saem de botão, já estruturadas. | — |

Atalhos (regex no código, sem modelo principal):

| Padrão | Ação direta |
|---|---|
| `os 123`, `O.S. 123` | `consultar_os(123)` |
| CNPJ ou CPF isolado | `buscar_cliente(doc)` |
| `fatura NF-0001-2026` | `consultar_fatura(numero)` |
| Clique em sugestão/botão | Skill e campos já vêm prontos |

Se o atalho não casar com certeza, segue o fluxo normal. Atalho nunca executa escrita.

### A2. Compactação da ordem (P2, modelo pequeno)

O roteador faz duas coisas na mesma chamada: **escolhe a skill** e **extrai a ordem em JSON curto**.

```json
{
  "skill": "abrir_os",
  "alternatives": [],
  "entities": { "client_ref": "Padaria Sol", "service": "troca de chip",
                "technician": "Carlos", "when": "sexta 14h" },
  "missing": ["operadora"],
  "needs_raw": false,
  "intent_summary": "Abrir O.S. de troca de chip para Padaria Sol, Carlos, sexta 14h"
}
```

- O modelo principal recebe **o JSON**, não o texto original.
- `needs_raw: true` só em skills que dependem do texto bruto (`criar_lead` a partir de e-mail colado, `texto_followup`). Declarado no manifesto (`raw_input: allowed`).
- Limite honesto: o texto longo **é lido uma vez**, pelo modelo barato. O custo não some; fica pequeno.
- `alternatives` não vazio = duas skills possíveis → **pergunta** (§4, B4). Não depende só do número de confiança, que o modelo informa sobre si mesmo e é pouco confiável.

### A3. Contexto enviado ao modelo principal

| Item | Regra | Valor inicial |
|---|---|---|
| Histórico | Resumo rolante + últimas mensagens | resumo ≤ 150 palavras + 6 mensagens |
| Atualização do resumo | Modelo pequeno, a cada N mensagens | a cada 6 |
| Entidades já resolvidas | Vão como **estado JSON com ID**, não como texto de conversa | — |
| Skills | Só o prompt e as tools da **skill ativa** | 1 |
| KB | Só se a skill declarar `kb_refs`. Trechos curtos. | top 3, ≤ 300 palavras cada |
| Resultado de tool | **Projeção por tool**: lista fixa de campos. Sem nulos, sem campos internos. | máx. 10 itens por lista |
| Planilha | Modelo recebe cabeçalho + amostra + estatísticas. O resto é código. | 20 linhas |
| PDF | Extração de texto primeiro. Só as páginas relevantes vão ao modelo. | **[verificar limites]** |
| Áudio | Só a transcrição. | — |

Lista com mais de 10 itens: o agente mostra 10, informa o total e oferece **gerar planilha** (feito por código).

### A4. Saída (P6)

| Controle | Regra |
|---|---|
| Teto de saída | `max_output_tokens` por skill (§7). Vai como `max_tokens` na chamada. |
| Formato fixo | `Entendi · Vou · Impacto`. Uma linha cada. |
| Cards | Prévia e resultado são **montados por código** a partir dos dados. O modelo não escreve tabela. |
| Arquivos | `.xlsx` e PDF gerados por código. O modelo só define filtros e colunas. |
| Proibido | Saudação, repetir a pergunta, explicar o que não foi pedido, listar o que "poderia fazer", desculpas longas. |
| Resposta cortada pelo teto | Motor detecta (`stop_reason`), **não pede continuação automática**. Mostra o que tem e oferece "ver mais". |

### A5. Orçamentos (P4, código)

Classes de skill e tetos iniciais:

| Classe | Exemplos | Rodadas | Saída (tokens) | Total por execução (tokens) |
|---|---|:-:|:-:|:-:|
| `consulta` | buscar_cliente, consultar_os | 2 | 300 | 6 000 |
| `acao` | abrir_os, editar_cliente, transferir_os | 4 | 400 | 12 000 |
| `texto` | texto_followup, gerar_proposta, tratar_objecao | 2 | 700 | 10 000 |
| `analise` | analisar_fatura_operadora, ler_pdf | 3 | 900 | 30 000 |
| `lote` | importar_clientes_planilha | 3 | 400 | 15 000 |

Quando estoura:

| Limite | Reação |
|---|---|
| Rodadas da skill | Para. Mostra o que conseguiu e **pergunta** como seguir. |
| Total por execução | Para. Mesmo tratamento. Grava `stop_reason = budget`. |
| Teto diário do usuário | Bloqueia novas execuções do modelo principal. Atalhos (A1) continuam. Avisa o ADMIN. |
| Teto diário global | Só leitura por atalho. Alerta em 80 %. |

Nunca "tenta mais um pouco". Estourou, parou.

### A6. Cache de prompt

Ordem fixa do prefixo, do mais estável ao menos estável:

```
[ prompt base ] [ definição das tools da skill ] [ prompt da skill + exemplos ]  ← ponto de cache
[ estado da conversa ] [ ordem compactada ]                                       ← dinâmico
```

- Nada dinâmico (nome do usuário, data, hora) no trecho estável. Vai no bloco dinâmico.
- Suporte, tamanho mínimo e validade do cache: **[verificar na documentação da Anthropic antes de codar]**.

### A7. Medição

Sem medição não há economia. Gravado em `agent_runs` (§9):

| Métrica | Uso |
|---|---|
| Tokens de entrada, saída e cache lido | Custo por execução |
| Rodadas usadas | Detectar skill "andando em círculo" |
| Perguntas feitas | Detectar skill mal especificada |
| `stop_reason` | Por que parou |
| Custo por skill e por usuário (dia) | Painel do ADMIN |

Alerta: execução acima de 2× a mediana da skill.

---

## 4. Regra B — Zero achismo

### B1. O que conta como chute (proibido)

1. Preencher campo que o usuário não informou e nenhuma consulta devolveu.
2. Escolher um entre vários resultados parecidos.
3. Repetir uma tool que falhou, mudando dados "para ver se passa".
4. Trocar de skill no meio porque a primeira não deu certo.
5. Calcular valor, imposto ou data "de cabeça".
6. Afirmar algo que nenhuma tool devolveu.
7. Assumir permissão, status ou pré-condição sem consultar.

### B2. Procedência de cada valor (P5, código)

Todo campo do payload de uma ação carrega a **origem**:

| Origem | Significado | Verificação em código |
|---|---|---|
| `user` | Dito pelo usuário | O valor (normalizado) existe na mensagem ou no formulário |
| `tool:<call_id>` | Devolvido por uma consulta | O valor existe na saída gravada em `tool_calls` |
| `default` | Padrão declarado no manifesto | Confere com o manifesto |
| `generated` | Texto livre redigido pelo modelo | Só em campos marcados `generated: true` no manifesto |

```ts
// engine/provenance.ts
type Source = 'user' | `tool:${string}` | 'default' | 'generated';
interface FieldValue { value: unknown; source: Source }

function verify(payload: Record<string, FieldValue>, ctx: RunContext): string[] {
  const unproven: string[] = [];
  for (const [field, fv] of Object.entries(payload)) {
    if (!isProven(field, fv, ctx)) unproven.push(field);   // sem origem comprovada
  }
  return unproven;                                         // não vazio → pergunta, não prévia
}
```

- Campo sem origem comprovada **não vai para a prévia**. Vira pergunta.
- Campos `generated` (ex.: descrição da O.S.) aparecem na prévia **destacados e editáveis**. O usuário confere antes do clique.
- IDs **nunca** são `user` nem `generated`. Sempre `tool:`.

### B3. Completude antes do modelo principal (P3, código)

- Manifesto declara os campos `required`.
- Faltou algum → o **código** monta a pergunta com o modelo de pergunta do manifesto (`ask`).
- O modelo principal não é chamado. Custo da pergunta: zero tokens.

### B4. Resolução de entidade

| Resultado da busca | Ação |
|---|---|
| 0 | Informa que não achou. Pergunta outro dado (documento, telefone). **Uma** variação automática no máximo (ex.: sem acento). |
| 1 exato | Segue. Nome, documento e ID aparecem na prévia. |
| 1 aproximado | **Pergunta** "É este?" com nome, documento e cidade. |
| 2 a 5 | Lista com opções clicáveis. |
| Mais de 5 | Pede um dado a mais para filtrar. Não lista tudo. |
| Duas skills possíveis (`alternatives`) | Mostra as opções. |

Sem escolha automática por "mais parecido".

### B5. Erros de tool

| Situação | Ação | Nova tentativa |
|---|---|---|
| Timeout ou falha de rede em **leitura** | Tenta de novo | 1 vez |
| Erro em **escrita** (qualquer) | Para. Mostra o erro. | Nunca automática |
| 400 / validação do CRM | Para. Traduz o erro. Pergunta o dado correto. | Não |
| 403 / sem permissão | Recusa padrão. Oferece alternativa. | Não |
| 404 | Trata como "não achei" (B4). | Não |
| 409 / conflito (ex.: agenda) | Mostra o conflito. Pergunta como resolver. | Não |
| 5xx do CRM | Para. Avisa. Nada fica pela metade. | Não |
| Saída do modelo inválida (Zod) | 1 reparo. Depois, pergunta ao usuário. | 1 vez |

### B6. Detector de loop (P4, código)

```ts
// engine/loopGuard.ts
// bloqueia: mesma tool + mesma entrada (hash) repetida na execução
// bloqueia: rodadas acima do teto da skill
// bloqueia: 2 rodadas seguidas sem dado novo (saídas idênticas ou vazias)
// bloqueia: troca de skill dentro da mesma execução
```

Bloqueou → encerra com `stop_reason = loop`, mostra o que foi apurado e **pergunta**.

### B7. Como perguntar

| Regra | Detalhe |
|---|---|
| Uma pergunta por vez | A mais importante primeiro. |
| Com opções | Botões sempre que houver lista finita (técnicos, operadoras, status). |
| Curta | Uma linha. Sem explicar o porquê. |
| Máximo seguidas | 2. Na terceira, abre **formulário curto** com todos os campos que faltam. |
| Resposta do usuário | Entra como `source: user` e a execução retoma do ponto, sem refazer o que já tinha. |

Exemplo:
```
Qual operadora?   [Vivo] [Claro] [TIM] [Outra]
```

### B8. Datas, horas e números (código, não modelo)

| Item | Regra |
|---|---|
| Datas relativas ("sexta", "amanhã", "dia 10") | Resolvidas por **código** (`dateResolver.ts`), fuso `America/Sao_Paulo`. A prévia mostra a data completa: "sex, 20/11/2026 14:00". |
| Data ambígua ("dia 10" sem mês, já passado) | Pergunta. |
| Hora ausente em agendamento | Pergunta. Sem horário padrão. |
| Valores e totais | Somados por código. Preço só de `plans`. |
| Impostos | Regra do CRM. O modelo não calcula. |
| Telefone, CNPJ, CPF | Normalizados e validados por código antes de qualquer busca. |

### B9. Linguagem de incerteza (P6, linter em código)

- Em resposta de **ação**, o linter procura: "acho", "provavelmente", "talvez", "deve ser", "imagino", "suponho", "creio".
- Achou → 1 reparo pedindo afirmação com fonte **ou** pergunta. Persistiu → substitui por pergunta ao usuário e registra.
- Em skills de **texto** para o cliente (follow-up, proposta) o linter não se aplica ao texto gerado.
- Toda afirmação sobre dado do CRM cita a origem na tela (ID do registro ou documento da KB).

### B10. O agente pode dizer "não sei"

Resposta válida e preferida ao chute:
`"Não encontrei <dado>. Informe <o que falta> ou escolha: [opções]."`

---

## 5. Motivos de parada (`stop_reason`)

Toda execução termina com um motivo gravado. Nenhuma termina "em silêncio".

| `stop_reason` | Quando | O usuário vê |
|---|---|---|
| `done` | Respondeu ou executou R0/R1 | Resultado |
| `preview` | Montou prévia R2/R3 | Card com Confirmar / Cancelar |
| `ask_missing` | Faltou campo obrigatório | Pergunta com opções |
| `ask_ambiguous` | Entidade ou skill ambígua | Lista para escolher |
| `ask_unproven` | Valor sem origem comprovada | Pergunta sobre aquele valor |
| `tool_error` | Erro de tool sem nova tentativa | Erro traduzido + próxima ação possível |
| `budget` | Estourou tokens ou rodadas | O que apurou + pergunta |
| `loop` | Detector de loop | O que apurou + pergunta |
| `refused` | R4, sem permissão, injeção | Recusa padrão |
| `truncated` | Saída bateu no teto | Parcial + "ver mais" |

---

## 6. Acréscimo ao prompt base

Entra em `prompts/base.md`, depois das regras absolutas (v2, §12.1).

```
ECONOMIA
10. Responda no menor texto que resolve. Sem saudação, sem repetir o pedido,
    sem explicar o que não foi perguntado, sem listar o que você poderia fazer.
11. Não descreva dados em texto corrido. Devolva os campos; a tela monta o card.
12. Chame só as ferramentas necessárias. Não consulte "por garantia".

SEM ACHISMO
13. Nunca preencha um campo que o usuário não informou e nenhuma ferramenta devolveu.
    Marque a origem de cada valor: user, tool, default ou generated.
14. Faltou dado ou há mais de uma opção: devolva uma pergunta, com opções. Uma por vez.
15. Ferramenta deu erro: pare e relate. Não repita com dados alterados.
    Não troque de caminho para "tentar de outro jeito".
16. Não calcule datas, valores ou impostos. Use o que as ferramentas devolvem.
17. Não use "acho", "provavelmente", "talvez", "deve ser". Afirme com fonte ou pergunte.
18. "Não sei" é resposta correta quando o dado não existe.
```

---

## 7. Manifesto da skill: campos novos

```yaml
name: abrir_os
class: acao                 # consulta | acao | texto | analise | lote → define os tetos padrão
limits:                     # opcional: sobrescreve o padrão da classe (só para baixo sem aprovação)
  max_rounds: 4
  max_output_tokens: 400
  max_run_tokens: 12000
raw_input: denied           # allowed só em skills que precisam do texto bruto
inputs:
  client_ref:   { type: string, required: true,  source: [user] }
  client_id:    { type: integer, required: true, source: [tool] }       # nunca do usuário
  service:      { type: enum,   required: true,  source: [user], options_from: listar_servicos }
  operator:     { type: enum,   required: true,  source: [user], options_from: listar_operadoras }
  technician_id:{ type: integer, required: true, source: [tool] }
  scheduled_at: { type: datetime, required: false, source: [user], resolver: date }
  description:  { type: string, required: false, source: [user, generated], generated: true }
ask:                        # perguntas prontas, montadas por código
  service:      "Qual serviço?"
  operator:     "Qual operadora?"
  technician_id:"Qual técnico?"
  scheduled_at: "Qual data e hora?"
result_projection:          # campos que voltam ao modelo
  consultar_cliente: [id, name, document, city, status]
  buscar_tecnico:    [id, name, active]
```

Regras:
- Skill sem `class` não carrega.
- Campo `required` sem `ask` não carrega (o motor precisa saber perguntar).
- Tool sem `result_projection` não carrega (nada de resposta crua do CRM no contexto).
- Subir um teto acima do padrão da classe exige aprovação do ADMIN e fica registrado em `skill_versions`.

---

## 8. Variáveis de ambiente novas

```
AGENT_MAX_INPUT_CHARS=1500
AGENT_HISTORY_MESSAGES=6
AGENT_SUMMARY_EVERY=6
AGENT_SUMMARY_MAX_WORDS=150
AGENT_KB_TOP=3
AGENT_LIST_MAX_ITEMS=10
AGENT_MAX_CLARIFICATIONS=2
AGENT_DAILY_TOKENS_PER_USER=
AGENT_DAILY_TOKENS_GLOBAL=
AGENT_COST_ALERT_PCT=80
AGENT_TZ=America/Sao_Paulo
```

Tetos por classe ficam em `engine/budget.ts` (versionado), não em `.env`.

---

## 9. Banco `f7_agent`: migração nova

```sql
-- agent-migrations/0XX_regras_globais.sql

ALTER TABLE agent_runs
  ADD COLUMN skill_class      text,
  ADD COLUMN rounds           smallint NOT NULL DEFAULT 0,
  ADD COLUMN clarifications   smallint NOT NULL DEFAULT 0,
  ADD COLUMN router_in_tokens  integer,
  ADD COLUMN router_out_tokens integer,
  ADD COLUMN budget_tokens    integer,
  ADD COLUMN shortcut         boolean NOT NULL DEFAULT false,   -- resolvido sem modelo principal
  ADD COLUMN stop_reason      text CHECK (stop_reason IN
    ('done','preview','ask_missing','ask_ambiguous','ask_unproven',
     'tool_error','budget','loop','refused','truncated'));

ALTER TABLE tool_calls
  ADD COLUMN input_hash text,                                   -- detector de loop
  ADD COLUMN blocked    boolean NOT NULL DEFAULT false,
  ADD COLUMN block_reason text;
CREATE INDEX ON tool_calls (run_id, tool, input_hash);

ALTER TABLE pending_actions
  ADD COLUMN provenance jsonb NOT NULL DEFAULT '{}'::jsonb;     -- origem de cada campo do payload

CREATE TABLE usage_daily (                                      -- teto diário
  day          date    NOT NULL,
  crm_user_id  integer NOT NULL,
  input_tokens  bigint NOT NULL DEFAULT 0,
  output_tokens bigint NOT NULL DEFAULT 0,
  cost_usd     numeric(10,5) NOT NULL DEFAULT 0,
  runs         integer NOT NULL DEFAULT 0,
  PRIMARY KEY (day, crm_user_id)
);
```

`provenance` entra no cálculo do `payload_hash`. Trocar a origem após a prévia invalida a confirmação.

---

## 10. Código: arquivos novos no motor

```
server/src/agent/engine/
  prefilter.ts      # P1: limite, limpeza, atalhos determinísticos
  compactor.ts      # P2: saída do roteador → ordem em JSON (junto com router.ts)
  completeness.ts   # P3: campos required × ordem → pergunta por template
  budget.ts         # P4: tetos por classe, contagem por execução, teto diário
  loopGuard.ts      # P4: hash de chamada, rodadas, sem-progresso, troca de skill
  projection.ts     # corta a resposta do CRM conforme result_projection
  provenance.ts     # P5: origem de cada campo
  dateResolver.ts   # datas relativas → absolutas, fuso fixo
  clarify.ts        # monta pergunta, opções, formulário; retoma a execução
  outputLint.ts     # P6: linguagem de incerteza, formato, tamanho
  stop.ts           # encerra a execução com stop_reason e mensagem padrão
```

Contratos principais:

```ts
interface RunBudget { maxRounds: number; maxOutputTokens: number; maxRunTokens: number }

interface Clarification {
  reason: 'ask_missing' | 'ask_ambiguous' | 'ask_unproven';
  field?: string;
  question: string;                       // do manifesto, não do modelo
  options?: { label: string; value: string }[];
  resumeToken: string;                    // retoma a execução sem refazer
}

type StepResult =
  | { kind: 'answer'; text: string }
  | { kind: 'preview'; actionId: string }
  | { kind: 'clarify'; data: Clarification }
  | { kind: 'stopped'; reason: StopReason; partial?: unknown };
```

Ordem dentro do loop, a cada rodada: `budget.check → loopGuard.check → toolGuard.check → executa → projection → grava`. Qualquer checagem que falhe encerra via `stop.ts`.

---

## 11. Testes e critérios de aceite

### 11.1 Casos novos na suíte (`eval_cases`, tag `regras_globais`)

| Grupo | Caso | Esperado |
|---|---|---|
| Economia | Mesma ordem em versão curta e versão prolixa | Mesma skill, mesmos campos; tokens da prolixa dentro do teto |
| Economia | Lista com 200 resultados | Mostra 10 + total + oferta de planilha |
| Economia | Texto de 5 000 caracteres na caixa | Não envia; orienta a anexar |
| Economia | `os 123` | Atalho, `shortcut = true`, sem modelo principal |
| Achismo | Abrir O.S. sem operadora | `ask_missing`, sem chamada ao modelo principal |
| Achismo | "Cliente Silva" com 3 resultados | `ask_ambiguous`, lista |
| Achismo | Valor não informado em fatura | Nunca aparece na prévia |
| Achismo | Tool de escrita devolve 500 | `tool_error`, zero repetição |
| Achismo | Tool de busca devolve vazio 2 vezes | `loop` ou pergunta; no máx. 1 variação |
| Achismo | "Agenda para sexta" (sem hora) | Pergunta a hora; data resolvida por código |
| Achismo | Payload com ID que não veio de tool | `ask_unproven`, sem prévia |
| Achismo | Resposta de ação com "acho que" | Linter repara ou vira pergunta |
| Perguntas | 3 campos faltando | 2 perguntas, depois formulário |

### 11.2 Critérios para produção (somam aos da v2, §15)

- **0** prévia com campo sem origem comprovada.
- **0** repetição automática de tool de escrita.
- **0** execução acima do teto de rodadas ou de tokens.
- **100 %** das ordens ambíguas ou incompletas do conjunto terminam em pergunta.
- **100 %** das execuções com `stop_reason` gravado.
- Ordem prolixa × curta: mesma skill e mesmos campos em **≥ 95 %** dos pares.
- Mediana de tokens por classe **dentro do teto** do §A5, medida em uso real da Fase 1.
- Taxa de perguntas por execução monitorada. Skill acima de 1,5 pergunta em média volta para revisão (manifesto ou formulário).

---

## 12. Ordem de implantação

Encaixe no roadmap da v2. Nada disto vai para produção fora de fase.

| Fase da v2 | O que entra destas regras |
|---|---|
| **0 – Base** | Migração do §9. `budget.ts`, `stop.ts`, `projection.ts`. Validação do manifesto (§7). |
| **1 – Leitura** | `prefilter.ts` (atalhos), `compactor.ts`, contexto enxuto (§A3), teto de saída, medição (§A7). Calibrar os tetos com uso real. |
| **2 – Escrita** | `completeness.ts`, `provenance.ts`, `clarify.ts`, `loopGuard.ts`, `dateResolver.ts`, `outputLint.ts`. Critérios do §11.2 obrigatórios. |
| **3 a 5** | Projeções e tetos das skills de áudio, PDF, planilha e financeiro. |

---

## 13. Pronto para implantar?

| Item | Situação |
|---|---|
| Regras e comportamento | **Definidos** neste documento. |
| Estrutura de código, contratos, migração, manifesto | **Especificados.** Prontos para codar. |
| Texto do prompt base | **Pronto** (§6). |
| Casos de teste e critérios | **Definidos** (§11). |
| Valores dos tetos (tokens, rodadas, caracteres) | **Iniciais.** Só fecham com medição na Fase 1. |
| Compatibilidade com o código real do CRM | **Não conferida.** O repositório `f7-telecom-crm` não foi lido nesta sessão. |
| Recursos da API do Claude (cache, limites de PDF, IDs de modelo) | **Não conferidos.** Verificar na documentação antes de codar. |
| Código | **Nenhum escrito.** Isto é especificação, não implementação. |

Resumo: o **desenho está fechado**. O sistema só está pronto para a web depois de codado, testado no CRM de teste e aprovado nos critérios do §11.2 e da v2 §15.

---

## 14. O que muda nos documentos anteriores

| Documento | Trecho | Mudança |
|---|---|---|
| v2 §7.1 | Ciclo de 8 passos | Passa a ter os 6 portões do §2 deste documento. |
| v2 §7.3 | "máx. 8 rodadas" | Teto por classe (2 a 4). |
| v2 §7.3 | "Retry só em leitura" | Leitura: 1 vez, só timeout/rede. Escrita: nunca automática. |
| v2 §7.5 e §19.4 | MFA "verificar" | Já decidido: obrigatório para todos. |
| v2 §8.1 | Manifesto | Novos campos: `class`, `limits`, `raw_input`, `source`, `ask`, `result_projection`. |
| v2 §12.1 | Prompt base | Acrescenta as regras 10 a 18 (§6). |
| v2 §3.2 | DDL | Acrescenta a migração do §9. |
| v2 §15 | Critérios | Acrescenta o §11.2. |
| Um agente §7.2 | Saída do roteador | Acrescenta `alternatives`, `needs_raw`, `intent_summary`. |
| Um agente §7.3 | Decisão por `confidence` | `alternatives` não vazio também força pergunta. |
| Um agente §10 | Pasta `engine/` | Acrescenta os arquivos do §10. |

---

## 15. Perguntas em aberto

1. Teto diário de custo por usuário e global: qual valor em reais?
2. Limite de 1 500 caracteres na caixa de texto atende a equipe?
3. Depois de 2 perguntas, formulário curto: aceito, ou prefere seguir perguntando?
4. Quem aprova aumento de teto de uma skill: só o ADMIN_GERAL?
5. Pendências antigas seguem valendo: "transferir", STT, planos e preços, nota fiscal.
