# F7 Telecom — Um agente ou vários? Como evitar confusão

Complemento de `F7_AGENTE_IA_ARQUITETURA_COMPLETA.md` (v2).
Decisões do Rafa registradas aqui:
- **MFA é obrigatório** para todos os usuários.
- **Todos os colaboradores** usarão o agente.
- **"Transferir"**: significado ainda não definido (§9).

---

## 1. Decisão

**Um agente só, com especialistas por dentro.**

| Para o colaborador | Por dentro |
|---|---|
| Um chat único no CRM | Um **roteador** escolhe a **skill** certa |
| Mesma tela para todos | Cada skill tem ferramentas, regras e testes próprios |
| Permissão pelo papel dele | O CRM aplica o papel real do usuário logado |

Não existe "agente do vendedor", "agente do financeiro" ou "agente do João" como programas separados. Existe **um programa**, e **o papel de quem está logado define o que ele pode pedir**.

---

## 2. Por que não um agente por colaborador ou por aba

| Alternativa | Problema |
|---|---|
| Um agente por colaborador | Mesmo código copiado N vezes. Cada correção se repete em todos. Cada novo colaborador exige configuração. |
| Um agente por aba | Ordens que cruzam abas ("abre a O.S. e emite a fatura") obrigam o usuário a trocar de agente. Contexto se perde. |
| Um agente por papel | O CRM já separa por papel. Duplicar essa regra no agente cria divergência. |
| **Um agente + skills** | Uma base de código. Uma conversa contínua. Regras do CRM aplicadas de forma única. |

---

## 3. Como a confusão é evitada (8 travas)

Segurança **em código**, não só em prompt. O modelo não é a última barreira.

### Trava 1 — Contexto isolado
- Uma **conversa por assunto**. Histórico próprio.
- Conversa pertence a **um usuário** (`crm_user_id`). Ninguém lê a conversa de outro.
- Nada de "memória global" misturando clientes. Memória é por conversa, com resumo rolante.
- Botão **Nova conversa** ao mudar de assunto. O agente sugere quando o tema muda.

### Trava 2 — Uma skill ativa por vez
```
mensagem → roteador → escolhe 1 skill → executa → devolve
```
- Roteador usa modelo pequeno e exemplos (`triggers` do manifesto).
- Confiança baixa ou duas skills possíveis → **pergunta** ("Você quer abrir uma O.S. ou consultar uma?").
- Skill ativa fica registrada em `agent_runs.skill`.

### Trava 3 — Ferramentas por skill (allow-list)
- Cada skill declara as tools que pode usar.
- O motor **bloqueia no código** qualquer tool fora da lista, mesmo que o modelo peça.
- Skill de leitura não recebe nenhuma tool de escrita.

### Trava 4 — Permissão por papel (filtro antes do modelo)
- O servidor monta a **lista de skills disponíveis** para o usuário conforme os papéis dele.
- Skill que o papel não permite **nem aparece** para o modelo. Ele não consegue escolher.
- Mesmo assim, o CRM revalida na rota (dupla barreira).

### Trava 5 — Estado no banco, não na cabeça do modelo
- Entidades resolvidas (cliente, O.S., lead) ficam gravadas na conversa com **ID**.
- Prévia guarda o **payload exato + hash**. Nada muda entre a prévia e o clique.
- O modelo nunca "lembra" um valor. Ele **relê** do CRM antes de montar a prévia.

### Trava 6 — Resolução de entidade sem chute
- "Cliente Silva" com 3 resultados → lista com documento e cidade e pede escolha.
- Nome, documento e ID aparecem na prévia. Usuário confere antes do clique.
- Número de O.S., valor e destino **nunca são inferidos**.

### Trava 7 — Ordem com várias etapas vira plano
Exemplo: "Abre a O.S., agenda para sexta e já emite a fatura."
```
Plano:
 1) abrir_os        (R2)  → prévia → Confirmar
 2) agendar_evento  (R2)  → prévia → Confirmar
 3) emitir_fatura   (R3)  → depende da O.S. Concluída → NÃO agora
```
- Cada etapa tem prévia própria. Cada uma exige seu clique.
- Etapa que depende de outra ainda não concluída é **recusada com explicação** (fatura só depois da O.S. Concluída).
- Máximo de etapas por plano: 5. Acima, pede para dividir.

### Trava 8 — Testes que caçam confusão
- Casos de ordens parecidas que **não podem ser confundidas**: "transferir O.S." × "transferir carteira"; "cancelar O.S." × "cancelar fatura"; "excluir" × "cancelar".
- Casos com dois clientes de nome parecido.
- Casos de ordem ambígua (deve perguntar).
- A suíte roda a cada mudança de prompt, skill, KB ou modelo. Regressão bloqueia publicação.

---

## 4. Permissões reais do CRM (lidas do código)

Fonte: `server/src/routes/*.ts`. O agente herda isto. Não cria regra nova.

| Capacidade | ADMIN_GERAL | GERENTE_VENDAS | VENDEDOR | TECNICO | FINANCEIRO |
|---|:-:|:-:|:-:|:-:|:-:|
| Ver clientes, leads, O.S., agenda | ✔ | ✔ | ✔ | ✔ | ✔ **[verificar GET de cada rota]** |
| Criar/editar cliente e importar lote | ✔ | ✔ | ✔ | ✘ | ✘ |
| Excluir cliente | ✔ | ✘ | ✘ | ✘ | ✘ |
| Criar/editar/mover lead | ✔ | ✔ | ✔ | ✘ | ✘ |
| Excluir lead | ✔ | ✔ | ✘ | ✘ | ✘ |
| Criar/editar/anotar/excluir O.S. | ✔ | ✔ | ✔ | ✔ | ✘ |
| Agenda (criar/editar/excluir) | ✔ | ✔ | ✔ | ✔ | ✔ |
| Fatura (ver, emitir, editar, status) | ✔ | ✘ | ✘ | ✘ | ✔ |
| Financeiro (ver e lançar) | ✔ | ✘ | ✘ | ✘ | ✔ |
| Usuários | ✔ | ✘ | ✘ | ✘ | ✘ |

Consequências para as skills:
- `excluir_cliente`: só ADMIN_GERAL.
- `emitir_fatura`, `cancelar_fatura`, `lancar_movimentacao`: só FINANCEIRO e ADMIN_GERAL.
- `abrir_os`, `transferir_os`, `anotar_os`: inclui TECNICO.
- TECNICO não vê as skills de cliente (escrita), funil, fatura e financeiro.
- Usuário com **mais de um papel** recebe a união das skills.

---

## 5. Skills visíveis por papel

| Grupo de skills | ADMIN | GERENTE | VENDEDOR | TECNICO | FINANCEIRO |
|---|:-:|:-:|:-:|:-:|:-:|
| Consulta (clientes, O.S., agenda, KB) | ✔ | ✔ | ✔ | ✔ | ✔ |
| Funil (criar, qualificar, mover, proposta) | ✔ | ✔ | ✔ | ✘ | ✘ |
| Excluir lead | ✔ | ✔ | ✘ | ✘ | ✘ |
| Clientes (cadastrar, editar, importar) | ✔ | ✔ | ✔ | ✘ | ✘ |
| Excluir cliente | ✔ | ✘ | ✘ | ✘ | ✘ |
| O.S. e Agenda | ✔ | ✔ | ✔ | ✔ | só consulta + agenda |
| Faturamento e Financeiro | ✔ | ✘ | ✘ | ✘ | ✔ |
| Documentos (ler PDF/planilha, gerar xlsx/PDF) | ✔ | ✔ | ✔ | ✔ | ✔ |
| Relatórios gerenciais | ✔ | ✔ | ✘ | ✘ | financeiro |
| Auditoria do agente | ✔ | ✘ | ✘ | ✘ | ✘ |

Geração de arquivo com dados de uma aba **respeita a permissão daquela aba**. Técnico não gera planilha de faturas.

---

## 6. MFA obrigatório

Como o MFA é obrigatório para todos, o fluxo R3 fica simples e uniforme.

| Risco | Exigência |
|---|---|
| R0 / R1 | Sessão válida. |
| R2 | Sessão + **clique em Confirmar**. |
| R3 | Sessão + clique + **código MFA (TOTP) digitado na hora**. |

Regras:
- Código MFA vale **uma vez** e só para aquela ação (`pending_actions.id`).
- 3 erros seguidos bloqueiam novas ações R3 por alguns minutos e geram log.
- Reaproveita a rotina TOTP e o limitador de tentativas que o CRM já tem (`auth.ts`, `totp.ts`).
- Sessão de usuário sem MFA concluído nem chega ao agente.

---

## 7. Como fica o roteador na prática

### 7.1 Entrada
```
texto/áudio transcrito/anexo + papéis do usuário + resumo da conversa
```

### 7.2 Saída (validada com Zod)
```json
{
  "skill": "transferir_os",
  "confidence": 0.93,
  "entities": { "service_order_ref": "123", "new_technician": "Carlos" },
  "missing": [],
  "needs_clarification": false
}
```

### 7.3 Decisão em código
| Condição | Ação |
|---|---|
| `confidence` < limiar (ex.: 0,75) | Pergunta ao usuário. |
| Skill fora da lista permitida ao papel | Recusa com explicação. |
| `missing` não vazio | Pergunta só o que falta. |
| Duas skills próximas | Mostra as opções ("1) … 2) …"). |
| Skill de risco R2/R3 | Monta prévia, não executa. |

Limiar e exemplos são ajustados pela suíte de avaliação.

---

## 8. Quando separar em especialistas (depois)

Só se **medir** problema. Sinais:
- Taxa de erro de roteamento acima da meta, mesmo com exemplos bons.
- Uma área (ex.: financeiro) com prompt grande e regras próprias demais.
- Latência alta por excesso de skills no contexto.

Como separar sem trocar a experiência:
```
Chat único → Roteador → [Especialista Funil | Especialista O.S. | Especialista Financeiro | Especialista Documentos]
```
- O usuário continua vendo **um chat**.
- Cada especialista tem prompt, skills e KB só da área dele.
- O roteador entrega a conversa ao especialista certo.
- Mesma base de código, mesmo banco `f7_agent`, mesmas travas.

Não é necessário no MVP. **Complexidade só quando houver evidência.**

---

## 9. Pendente: "transferir"

Você não lembrou o que quis dizer. Opções previstas no catálogo:

| Skill | Significado | Papéis |
|---|---|---|
| `transferir_os` | Trocar o técnico da O.S. | ADMIN, GERENTE, VENDEDOR, TECNICO |
| `transferir_carteira` | Trocar vendedor ou gestor de conta dos clientes | ADMIN, GERENTE, VENDEDOR |
| `transferir_lead` | Trocar o vendedor responsável por um lead | ADMIN, GERENTE, VENDEDOR |
| Titularidade (serviço F7) | Processo com a operadora. É uma **O.S. de serviço**, não uma troca no CRM. | via `abrir_os` |

Hoje o CRM **não tem** campo de "vendedor responsável" no lead nem na carteira. A O.S. tem técnico. Se você quer transferir lead ou carteira, isso exige **campo novo** no CRM. A decisão fica para quando você lembrar.

---

## 10. Impacto na estrutura do código

```
server/src/agent/
  engine/
    router.ts          # roteador (Trava 2)
    skillAccess.ts     # skills permitidas por papel (Trava 4)
    toolGuard.ts       # allow-list de tools por skill (Trava 3)
    planner.ts         # ordens com várias etapas (Trava 7)
    entityResolver.ts  # resolução sem chute (Trava 6)
    risk.ts · confirm.ts · undo.ts
  skills/<skill>/manifest.yaml   # roles_required, tools, risk, triggers
```

Campos do manifesto que sustentam as travas:
```yaml
roles_required: [ADMIN_GERAL, FINANCEIRO]
tools: [consultar_os, preparar_fatura]
risk: R3
depends_on: [os.status == "Concluída", os.isBilled == false]
triggers: [...]
confusable_with: [cancelar_os, cancelar_fatura]   # alimenta os testes da Trava 8
```

---

## 11. Critérios de aceite

- Usuário de cada papel vê **somente** as skills do papel dele.
- Chamada a tool fora da allow-list da skill: **bloqueada e logada**.
- Ordem ambígua: o agente **pergunta** em 100 % dos casos do conjunto de teste.
- Casos "confundíveis" (§3, Trava 8): erro de roteamento ≤ 2 %.
- Nenhuma conversa lê mensagem de outro usuário.
- Ação R3 sem código MFA válido: **nunca executa**.
- Prévia com payload alterado após a geração: **recusada**.
- Etapa dependente fora de ordem: **recusada com explicação**.

---

## 12. Perguntas em aberto

1. "Transferir" (§9): qual significado, e o CRM ganhará "vendedor responsável"?
2. Todos os colaboradores têm um único papel ou há quem acumule papéis?
3. GERENTE_VENDAS pode pedir relatório financeiro ou só de vendas?
4. Os GETs de cada rota do CRM têm restrição por papel? (confirmar antes de fixar a tabela do §4).
5. O agente pode ser usado em celular (tela do CRM responsiva) ou só desktop?
