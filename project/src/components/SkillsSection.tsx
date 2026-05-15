import React, { type CSSProperties, useEffect, useRef, useState } from 'react';

type SkillItem = {
  title: string;
  description: string;
  accent: string;
};

const skills: SkillItem[] = [
  {
    title: 'Automação de Processos',
    description: 'Criação de fluxos eficientes para tarefas reais e repetitivas.',
    accent: 'from-emerald-400 via-emerald-500 to-cyan-400',
  },
  {
    title: 'IA Aplicada',
    description: 'Uso de agentes de IA para apoiar respostas, rotinas e decisões.',
    accent: 'from-cyan-400 via-emerald-400 to-teal-300',
  },
  {
    title: 'n8n',
    description: 'Construção de automações escaláveis com integrações entre ferramentas.',
    accent: 'from-emerald-300 via-emerald-500 to-lime-300',
  },
  {
    title: 'Typebot',
    description: 'Criação de fluxos conversacionais e captação inteligente de leads.',
    accent: 'from-lime-300 via-emerald-400 to-cyan-300',
  },
  {
    title: 'Engenharia de Prompts',
    description: 'Estruturação de instruções para melhorar precisão e consistência.',
    accent: 'from-cyan-300 via-teal-400 to-emerald-300',
  },
  {
    title: 'Base Full Stack',
    description: 'Experiência com desenvolvimento web para conectar front e back.',
    accent: 'from-teal-300 via-emerald-500 to-emerald-300',
  },
];

function SkillsSection() {
  const cardAngle = 360 / skills.length;
  const dragState = useRef({
    isDragging: false,
    startX: 0,
    startRotation: 0,
    rotation: -18,
    rafId: 0 as number | 0,
    lastTs: 0,
  });
  const [rotation, setRotation] = useState(-18);
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const state = dragState.current;

    const animate = (timestamp: number) => {
      if (!state.lastTs) {
        state.lastTs = timestamp;
      }

      const delta = timestamp - state.lastTs;
      state.lastTs = timestamp;

      if (!state.isDragging) {
        state.rotation += delta * 0.006;
        if (state.rotation > 360 || state.rotation < -360) {
          state.rotation %= 360;
        }
        setRotation(state.rotation);
      }

      state.rafId = window.requestAnimationFrame(animate);
    };

    state.rafId = window.requestAnimationFrame(animate);

    return () => {
      if (state.rafId) {
        window.cancelAnimationFrame(state.rafId);
      }
    };
  }, []);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const state = dragState.current;
    state.isDragging = true;
    state.startX = event.clientX;
    state.startRotation = state.rotation;
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const state = dragState.current;
    if (!state.isDragging) {
      return;
    }

    const deltaX = event.clientX - state.startX;
    const nextRotation = state.startRotation + deltaX * 0.18;
    state.rotation = nextRotation;
    setRotation(nextRotation);
  };

  const stopDragging = (event: React.PointerEvent<HTMLDivElement>) => {
    const state = dragState.current;
    state.isDragging = false;
    setIsDragging(false);
    event.currentTarget.releasePointerCapture(event.pointerId);
    state.lastTs = 0;
  };

  return (
    <section
      id="skills"
      className="relative mx-auto w-full max-w-6xl overflow-hidden rounded-[2rem] border border-white/8 bg-gradient-to-br from-black via-slate-950 to-neutral-900 px-4 py-14 shadow-[0_30px_100px_rgba(0,0,0,0.45)] sm:px-6 lg:px-10"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.03),_transparent_35%),radial-gradient(circle_at_bottom,_rgba(255,255,255,0.02),_transparent_40%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/40 to-transparent" />

      <div className="relative z-10 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.38em] text-emerald-300/90">
          Habilidades
        </p>
        <h2 className="mt-1 text-3xl font-bold text-white sm:text-4xl">
          Automação, IA e integrações
        </h2>
      </div>

      <div className="relative z-10 mt-2 hidden min-h-[240px] items-center justify-center md:flex">
        <div className="skills-carousel-stage">
          <div
            ref={trackRef}
            className="skills-carousel-track"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={stopDragging}
            onPointerLeave={stopDragging}
            onPointerCancel={stopDragging}
            style={
              {
                '--carousel-rotation': `${rotation}deg`,
                '--carousel-transition': isDragging ? 'none' : 'transform 700ms cubic-bezier(0.22, 1, 0.36, 1)',
              } as CSSProperties
            }
          >
            {skills.map((skill, index) => (
              <article
                key={skill.title}
                className="skills-carousel-card group"
                style={
                  {
                    '--card-transform': `rotateY(${index * cardAngle}deg) translateZ(150px)`,
                  } as CSSProperties
                }
                data-gsap-item
              >
                <div className={`skills-carousel-card-glow bg-gradient-to-br ${skill.accent}`} />
                <div className="relative flex h-full flex-col justify-end overflow-hidden rounded-[0.9rem] border border-white/10 bg-slate-950/90 p-2 text-left shadow-[0_18px_50px_rgba(0,0,0,0.45)] backdrop-blur-sm">
                  <div className="mb-1.5">
                    <div className={`mb-2 h-1.5 w-9 rounded-full bg-gradient-to-r ${skill.accent}`} />
                    <h3 className="text-[0.82rem] font-semibold text-white drop-shadow">
                      {skill.title}
                    </h3>
                  </div>
                  <p className="text-[0.68rem] leading-4 text-slate-300">{skill.description}</p>
                  <div className="mt-2 flex items-center gap-2 text-[0.5rem] uppercase tracking-[0.2em] text-emerald-200/70">
                    <span className="h-px w-8 bg-emerald-300/60" />
                    <span>{isDragging ? 'Arrastando' : 'Arraste para girar'}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-10 grid gap-4 md:hidden">
        {skills.map((skill) => (
          <article
            key={skill.title}
            className="rounded-[1.25rem] border border-white/10 bg-slate-950/90 p-5 shadow-[0_18px_50px_rgba(0,0,0,0.35)]"
            data-gsap-item
          >
            <div className={`mb-3 h-1.5 w-20 rounded-full bg-gradient-to-r ${skill.accent}`} />
            <h3 className="text-xl font-semibold text-white">{skill.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-300">{skill.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default SkillsSection;
