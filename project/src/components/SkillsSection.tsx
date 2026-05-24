import React from 'react';
import {
  BrainCircuit,
  Bot,
  Cloud,
  Code2,
  Layers3,
  Plug,
  Sparkles,
  Workflow,
} from 'lucide-react';

type SkillItem = {
  title: string;
  description: string;
  accent: string;
  icon: React.ReactNode;
};

const skills: SkillItem[] = [
  {
    title: 'Automação de Processos',
    description: 'Criação de fluxos eficientes para tarefas reais e repetitivas.',
    accent: 'from-emerald-400 via-emerald-500 to-cyan-400',
    icon: <Workflow size={20} />,
  },
  {
    title: 'IA Aplicada',
    description: 'Uso de agentes de IA para apoiar respostas, rotinas e decisões.',
    accent: 'from-cyan-400 via-emerald-400 to-teal-300',
    icon: <BrainCircuit size={20} />,
  },
  {
    title: 'n8n',
    description: 'Construção de automações escaláveis com integrações entre ferramentas.',
    accent: 'from-emerald-300 via-emerald-500 to-lime-300',
    icon: <Cloud size={20} />,
  },
  {
    title: 'Typebot',
    description: 'Criação de fluxos conversacionais e captação inteligente de leads.',
    accent: 'from-lime-300 via-emerald-400 to-cyan-300',
    icon: <Bot size={20} />,
  },
  {
    title: 'Engenharia de Prompts',
    description: 'Estruturação de instruções para melhorar precisão e consistência.',
    accent: 'from-cyan-300 via-teal-400 to-emerald-300',
    icon: <Sparkles size={20} />,
  },
  {
    title: 'Base Full Stack',
    description: 'Experiência com desenvolvimento web para conectar front e back.',
    accent: 'from-teal-300 via-emerald-500 to-emerald-300',
    icon: <Code2 size={20} />,
  },
];

function SkillsSection() {
  const featuredSkills = skills.slice(0, 3);
  const supportSkills = skills.slice(3);

  return (
    <section
      id="skills"
      className="relative mx-auto w-full max-w-6xl overflow-hidden rounded-[2rem] border border-white/8 bg-gradient-to-br from-black via-slate-950 to-neutral-900 px-4 py-14 shadow-[0_30px_100px_rgba(0,0,0,0.45)] sm:px-6 lg:px-10"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.03),_transparent_35%),radial-gradient(circle_at_bottom,_rgba(255,255,255,0.02),_transparent_40%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/40 to-transparent" />
      <div className="pointer-events-none absolute -right-24 top-10 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 bottom-6 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative z-10 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.38em] text-emerald-300/90">
          Habilidades
        </p>
        <h2 className="mt-1 text-3xl font-bold text-white sm:text-4xl">
          Automação, IA e integrações
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
          Um conjunto de capacidades focado em construir soluções inteligentes, integrar ferramentas e acelerar operações com IA.
        </p>
      </div>

      <div className="relative z-10 mt-10 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <div
          data-gsap-item
          className="group relative overflow-hidden rounded-[1.75rem] border border-emerald-500/15 bg-[linear-gradient(180deg,rgba(8,15,23,0.88),rgba(3,7,18,0.96))] p-6 shadow-[0_25px_70px_rgba(0,0,0,0.4)] transition-transform duration-500 hover:-translate-y-1"
        >
          <div className={`absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.22),transparent_35%),radial-gradient(circle_at_left,rgba(34,211,238,0.16),transparent_40%)]`} />
          <div className="relative flex h-full flex-col justify-between gap-8">
            <div className="max-w-xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-xs uppercase tracking-[0.28em] text-emerald-200">
                <Layers3 size={13} />
                Núcleo principal
              </div>
              <h3 className="text-2xl font-bold text-white sm:text-3xl">
                Projetando automações com IA e integrações reais
              </h3>
              <p className="mt-4 text-sm leading-7 text-slate-300 sm:text-base">
                Estruturo fluxos inteligentes para conectar ferramentas, reduzir tarefas manuais e transformar operações em processos previsíveis, rápidos e escaláveis.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {featuredSkills.map((skill) => (
                <article
                  key={skill.title}
                  data-gsap-item
                  className="group/card relative overflow-hidden rounded-2xl border border-white/10 bg-black/35 p-4 shadow-[0_18px_50px_rgba(0,0,0,0.28)] transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300/40"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${skill.accent} opacity-10 transition-opacity duration-300 group-hover/card:opacity-20`} />
                  <div className="relative">
                    <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${skill.accent} text-slate-950 shadow-lg shadow-black/25`}>
                      {skill.icon}
                    </div>
                    <h4 className="text-sm font-semibold text-white sm:text-base">{skill.title}</h4>
                    <p className="mt-2 text-xs leading-5 text-slate-300 sm:text-sm">{skill.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-5">
          {supportSkills.map((skill, index) => (
            <article
              key={skill.title}
              data-gsap-item
              className="group relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-950/90 p-5 shadow-[0_18px_50px_rgba(0,0,0,0.35)] transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400/40"
            >
              <div className={`absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.16),transparent_35%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />
              <div className="relative flex items-start gap-4">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${skill.accent} text-slate-950 shadow-lg shadow-black/25`}>
                  {skill.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <h4 className="text-base font-semibold text-white sm:text-lg">{skill.title}</h4>
                    <span className="text-[0.65rem] uppercase tracking-[0.24em] text-emerald-200/70">
                      0{index + 4}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-300">{skill.description}</p>
                  <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/6">
                    <div className={`h-full w-full rounded-full bg-gradient-to-r ${skill.accent}`} />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="relative z-10 mt-10 grid gap-4 md:hidden">
        {skills.map((skill, index) => (
          <article
            key={skill.title}
            className="rounded-[1.25rem] border border-white/10 bg-slate-950/90 p-5 shadow-[0_18px_50px_rgba(0,0,0,0.35)]"
            data-gsap-item
          >
            <div className={`mb-3 h-1.5 w-20 rounded-full bg-gradient-to-r ${skill.accent}`} />
            <div className="flex items-start gap-3">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${skill.accent} text-slate-950`}>
                {skill.icon}
              </div>
              <div className="min-w-0">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold text-white">{skill.title}</h3>
                  <span className="text-[0.65rem] uppercase tracking-[0.24em] text-emerald-200/70">
                    0{index + 1}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-300">{skill.description}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default SkillsSection;
