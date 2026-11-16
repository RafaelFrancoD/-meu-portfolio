# F7 Telecom — Agente de IA no CRM: índice dos documentos

Ordem de leitura. Quando dois documentos divergem, **vale o de número maior**.

| # | Documento | Assunto |
|---|---|---|
| 1 | `F7_AGENTE_IA_ARQUITETURA_COMPLETA.md` (v2) | Base: arquitetura, banco `f7_agent`, skills, API, roadmap |
| 2 | `F7_AGENTE_IA_UM_AGENTE_VS_VARIOS.md` | Um agente com skills, roteador, permissões por papel, 8 travas |
| 3 | `F7_AGENTE_IA_REGRAS_GLOBAIS.md` | Economia de tokens e zero achismo (6 portões) |
| 4 | `F7_AGENTE_IA_ROBUSTEZ_E_AUTOMACAO.md` | Concorrência, vários usuários, automação, operação |
| 5 | `F7_AGENTE_IA_CUSTO_E_MODELOS.md` | Custo em reais, Haiku × Sonnet, seleção automática e manual |
| 6 | `F7_AGENTE_IA_PAINEL_ADMIN_CREDITOS.md` | Painel do ADMIN: gasto por colaborador em tempo real, saldo, compra de créditos, alertas |

Os documentos 1 e 2 vieram como anexo e ainda **não estão neste repositório**.

## Decisões já tomadas

| Tema | Decisão |
|---|---|
| Canal | Só dentro do CRM. Sem WhatsApp, sem n8n |
| Banco | `f7_agent` separado do CRM |
| Usuários | Só quem o ADMIN liberar (padrão: sem acesso). Cada um com as permissões do seu papel |
| MFA | Obrigatório para todos. Exigido nas ações R3 |
| Estrutura | Um agente, várias skills, roteador |
| Tokens | Economia obrigatória (Regras Globais) |
| Achismo | Proibido. Na dúvida, pergunta |
| Pagamento | API com créditos e recarga automática. Sem assinatura Pro/Max |
| Modelo | Opção econômica: Haiku padrão, Sonnet por skill ou subida automática |
| Seletor manual | Automático / Rápido / Avançado, com cota e papéis definidos pelo ADMIN |
| Áudio | Transcrição local (faster-whisper), com fallback para API |
| Gastos | Só o ADMIN_GERAL vê e controla. Aba própria, em tempo real |
| Créditos | Botão leva à cobrança da Anthropic. Cartão nunca no CRM. Saldo estimado + alertas + previsão |
| Cotação | Fixa, definida pelo ADMIN no painel |

## Pendências abertas (todas as fontes)

| Tema | Onde |
|---|---|
| Significado de "transferir" e campo "vendedor responsável" | Doc 2 §9 |
| Nota fiscal real (tipo, município, emissor) | Doc 1 §8.4 |
| Planos e preços oficiais cadastrados no CRM | Doc 1 §19 |
| Conteúdo da base de conhecimento | Doc 1 §19 |
| Restrição por papel nos GETs do CRM | Doc 2 §12 |
| Teto de custo, limite de caracteres, formulário após 2 perguntas | Doc 3 §15 |
| Critérios dos alertas, ordens salvas, prazo de desfazer, áudio | Doc 4 §12 |
| Papéis do seletor, cota do Avançado, CPU do VPS | Doc 5 §15 |
| Conta Anthropic no nome do cliente, limite por colaborador, reserva, conferência diária | Doc 6 §13 |

## Ainda não verificado
- Código real do repositório `f7-telecom-crm` (rotas, limitador, campos livres, `updated_at`).
- Documentação atual da API da Anthropic (cache, limites de PDF, fallbacks, limites da conta, saldo por API, endereço da página de cobrança).
- ffmpeg, ClamAV e CPU do VPS.

## Situação
Especificação completa. **Nenhum código escrito.**
