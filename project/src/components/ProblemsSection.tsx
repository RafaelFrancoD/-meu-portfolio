import React from 'react';
import { AlertTriangle, ArrowRight, CheckCircle2, Clock3, TrendingDown, X } from 'lucide-react';

const problemCards = [
  {
    icon: Clock3,
    title: 'Você demora pra responder e perde o cliente pra concorrência',
  },
  {
    icon: TrendingDown,
    title: 'A medida vem errada e você refaz, jogando dinheiro fora',
  },
  {
    icon: AlertTriangle,
    title: 'Não sabe onde está cada venda e perde o controle do negócio',
  },
];

const painPoints = [
  'Lead entra em contato e fica sem resposta por horas',
  'Orçamento enviado e nunca mais seguido',
  'Cliente some no WhatsApp e você não sabe o que aconteceu',
  'Atendimento lento porque o vendedor está ocupado ou fora do horário',
  'Pedidos, clientes e conversas espalhados em anotações e grupos',
  'Medida errada chega na produção e você refaz tudo do zero',
];

const solutionPoints = [
  'O lead recebe resposta imediata, mesmo fora do horário comercial',
  'O fluxo acompanha o orçamento até a próxima etapa',
  'O WhatsApp deixa de ser um buraco negro e passa a ter histórico',
  'O atendimento segue com IA quando a equipe está ocupada',
  'As conversas e pedidos ficam organizados em um processo único',
  'A produção recebe dados corretos e reduz retrabalho',
];

const workflowSteps = [
  {
    number: '1',
    title: 'Cliente entra em contato',
    description: 'Pelo WhatsApp, a qualquer hora do dia ou da noite.',
  },
  {
    number: '2',
    title: 'O agente de IA atende e qualifica',
    description: 'Coleta as informações necessárias e conduz a conversa.',
  },
  {
    number: '3',
    title: 'Agenda uma reunião para discutir o projeto',
    description: 'A conversa avança com mais contexto e menos atrito.',
  },
  {
    number: '4',
    title: 'Venda fechada e produção sem erro',
    description: 'Pedido organizado e produção segue com confiança.',
  },
];

function ProblemsSection() {
  return (
    <section
      id="problems"
      className="relative overflow-hidden bg-transparent px-4 py-20 sm:px-6 lg:px-8"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-14">
        <div className="text-center">
          <span className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/15 px-4 py-1 text-[0.65rem] uppercase tracking-[0.35em] text-white/90">
            Problemas
          </span>
          <h2 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Você reconhece esses problemas?
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {problemCards.map((card) => {
            const Icon = card.icon;

            return (
              <article
                key={card.title}
                className="group rounded-[1.6rem] bg-gradient-to-br from-rose-950/40 via-black/20 to-rose-950/40 p-6 shadow-[0_0_25px_rgba(244,63,94,0.15),0_18px_45px_rgba(0,0,0,0.25)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_35px_rgba(244,63,94,0.25),0_20px_50px_rgba(0,0,0,0.3)]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/15 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.2)]">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="mt-5 text-lg font-medium leading-8 text-white">{card.title}</p>
              </article>
            );
          })}
        </div>

        <div className="mt-28 rounded-[1.75rem] bg-black/30 px-4 py-10 sm:px-6 lg:px-10">
          <div className="mx-auto mb-2 max-w-3xl rounded-2xl bg-gradient-to-br from-rose-500 to-orange-600 p-[2px] shadow-[0_0_30px_rgba(244,63,94,0.4)]">
            <div className="rounded-2xl bg-slate-900 px-6 py-5">
              <h3 className="text-center text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
                Isso acontece todo dia na sua empresa
              </h3>
            </div>
          </div>

          <div className="mx-auto mt-10 flex max-w-5xl flex-col gap-4">
            {painPoints.map((point) => (
              <div
                key={point}
                className="flex flex-row items-start justify-start gap-3 text-left"
              >
                <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rose-500/20 text-red-500">
                  <X className="h-5 w-5" strokeWidth={3} />
                </span>
                <p className="max-w-3xl text-base leading-7 text-white sm:text-lg">{point}</p>
              </div>
            ))}
          </div>

          <p className="mx-auto mt-8 max-w-4xl text-center text-base leading-8 text-white sm:text-lg">
            Se você marcou pelo menos um desses, sua empresa está perdendo dinheiro agora.
          </p>
        </div>

        <div className="mt-16 rounded-[1.75rem] bg-white/[0.08] px-4 py-10 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-3xl rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-[2px] shadow-[0_0_30px_rgba(16,185,129,0.4)]">
            <div className="rounded-2xl bg-slate-900 px-6 py-5">
              <h3 className="text-center text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
                Como eu resolvo isso
              </h3>
            </div>
          </div>

          <div className="mx-auto mt-8 grid max-w-5xl gap-4 md:grid-cols-2">
            {solutionPoints.map((point) => (
              <div
                key={point}
                className="flex items-start gap-3 rounded-[1.25rem] bg-black/30 px-4 py-4"
              >
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />
                <p className="text-sm leading-7 text-white sm:text-base">{point}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[1.75rem] px-1 py-2 sm:px-2 sm:py-4">
          <div className="text-center">
            <span className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/15 px-5 py-2 text-sm uppercase tracking-[0.25em] text-white/90 font-semibold">
              Processo
            </span>
            <div className="mx-auto mt-4 max-w-3xl rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 p-[2px] shadow-[0_0_30px_rgba(59,130,246,0.4)]">
              <div className="rounded-2xl bg-slate-900 px-6 py-5">
                <h3 className="text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
                  Como funciona
                </h3>
                <p className="mt-2 text-sm text-white sm:text-base">Do primeiro contato à produção</p>
              </div>
            </div>
          </div>

          <div className="mx-auto mt-10 grid max-w-6xl gap-5 lg:grid-cols-2">
            {workflowSteps.map((step) => (
              <div
                key={step.number}
                className="flex items-start gap-4 rounded-[1.5rem] bg-white/[0.08] px-5 py-5 shadow-[0_10px_32px_rgba(0,0,0,0.12)] transition duration-300 hover:-translate-y-1 hover:bg-white/[0.12]"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/20 text-lg font-semibold text-emerald-300">
                  {step.number}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs uppercase tracking-[0.3em] text-emerald-300">
                      Passo {step.number}
                    </span>
                    <ArrowRight className="h-4 w-4 text-white/50" />
                  </div>
                  <h4 className="mt-2 text-lg font-semibold text-white">{step.title}</h4>
                  <p className="mt-2 max-w-xl text-sm leading-7 text-white sm:text-base">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProblemsSection;
