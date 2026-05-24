import React, { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const AboutSection: React.FC = () => {
  const fullName = 'Rafael Américo Franco de Azevedo';
  const [showDetailedAbout, setShowDetailedAbout] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLVideoElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const introBlockRef = useRef<HTMLDivElement>(null);
  const introRefs = useRef<Array<HTMLElement | null>>([]);

  const handleHideDetailedAbout = () => {
    setShowDetailedAbout(false);
  };

  const handleShowDetailedAbout = () => {
    setShowDetailedAbout(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useLayoutEffect(() => {
    if (showDetailedAbout) return;

    gsap.registerPlugin(ScrollTrigger);

    const panel = panelRef.current;
    const glow = glowRef.current;
    const logo = logoRef.current;
    const content = contentRef.current;
    const introBlock = introBlockRef.current;
    const introItems = introRefs.current.filter(Boolean);

    if (!panel) return;

    const ctx = gsap.context(() => {
      gsap.set(panel, { y: 24 });
      gsap.set(glow, { scale: 0.78, y: 10 });
      gsap.set(logo, { scale: 0.84 });
      gsap.set(introBlock, { y: 0 });
      gsap.set(content, { y: 18 });
      gsap.set(introItems, { y: 24, autoAlpha: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: panel,
          start: 'top 85%',
          once: true,
        },
      });

      tl.to(panel, {
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
      })
        .to(
          glow,
          {
            scale: 1,
            y: 0,
            duration: 1.1,
            ease: 'power3.out',
          },
          '-=0.7'
        )
        .to(
          logo,
          {
            scale: 1,
            duration: 1.15,
            ease: 'power4.out',
          },
          '-=0.45'
        )
        .to(
          introItems,
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power3.out',
          },
          '-=0.55'
        );


      if (glow) {
        gsap.to(glow, {
          y: -18,
          scale: 1.08,
          opacity: 0.82,
          scrollTrigger: {
            trigger: panel,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
      }

      if (content) {
        gsap.to(content, {
          y: -16,
          scrollTrigger: {
            trigger: panel,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
      }

      if (introBlock) {
        gsap.to(introBlock, {
          y: -14,
          scrollTrigger: {
            trigger: panel,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.8,
          },
        });
      }

      if (introItems.length) {
        introItems.forEach((item, index) => {
          gsap.to(item, {
            y: -8 - index * 2,
            autoAlpha: 1,
            scrollTrigger: {
              trigger: panel,
              start: 'top 85%',
              end: 'bottom top',
              scrub: 0.9,
            },
          });
        });
      }
    }, panel);

    return () => ctx.revert();
  }, [showDetailedAbout]);

  return (
    <>
      {!showDetailedAbout ? (
        <>
          <section
            id="about"
            className="relative pt-6 pb-0 px-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950"
          />

          <section className="relative px-4 sm:px-6 pb-4 pt-20 sm:pt-0 -mt-2">
            <div className="w-full mx-auto">
              <div ref={panelRef} className="relative overflow-hidden rounded-2xl bg-[#041419] border-y border-cyan-500/10 shadow-[0_0_60px_rgba(0,0,0,0.45)]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.10),transparent_45%),radial-gradient(circle_at_left,rgba(16,185,129,0.12),transparent_35%),linear-gradient(180deg,rgba(0,0,0,0.18),rgba(0,0,0,0.52))]" />
                <div
                  ref={glowRef}
                  className="pointer-events-none absolute left-1/2 top-[18%] h-40 w-40 sm:h-64 sm:w-64 -translate-x-1/2 rounded-full bg-emerald-500/20 blur-3xl"
                />

                <div className="relative px-4 py-6 sm:px-6 sm:py-8 lg:py-10">
                  <div className="grid items-center gap-8 lg:grid-cols-1 lg:px-0">
                    <div ref={contentRef} className="text-center text-white">
                      <div className="mb-5 sm:mb-6 w-full flex justify-center">
                        <video
                          ref={logoRef}
                          src="/video-logo.mp4"
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="block w-full h-auto object-contain drop-shadow-[0_0_40px_rgba(16,185,129,0.45)] rounded-lg"
                        />
                      </div>

                      <div ref={introBlockRef} className="space-y-1 sm:space-y-2">
                        <p ref={(el) => { introRefs.current[0] = el; }} className="text-cyan-200 text-lg sm:text-2xl lg:text-3xl font-medium mb-2 tracking-[0.12em] uppercase">
                          Olá, Sou
                        </p>
                        <h2 ref={(el) => { introRefs.current[1] = el; }} className="text-3xl sm:text-5xl lg:text-6xl font-bold text-cyan-200 leading-tight tracking-tight drop-shadow-[0_0_32px_rgba(34,211,238,0.58)]">
                          {fullName}
                        </h2>
                        <p ref={(el) => { introRefs.current[2] = el; }} className="mt-4 text-white text-lg sm:text-2xl lg:text-3xl font-semibold tracking-wide">
                          Desenvolvedor Full Stack
                        </p>
                        <p ref={(el) => { introRefs.current[3] = el; }} className="mt-2 text-emerald-200 text-xs sm:text-base lg:text-lg tracking-wide">
                          Foco em automação, IA e resultados.
                        </p>

                        <p ref={(el) => { introRefs.current[4] = el; }} className="mt-5 max-w-3xl mx-auto text-sm sm:text-lg leading-7 text-slate-200/90">
                          Sou um profissional prático e orientado à tecnologia, com foco em criar soluções que automatizam processos e geram valor real.
                        </p>

                        <div className="mt-6 sm:mt-7 flex justify-center">
                          <button
                            ref={(el) => { introRefs.current[5] = el; }}
                            onClick={handleShowDetailedAbout}
                            className="rounded-md border border-cyan-400/60 bg-transparent px-5 py-3 sm:px-8 sm:py-4 text-cyan-200 transition-colors duration-300 hover:bg-cyan-400/10"
                          >
                            Sobre Mim - Detalhes
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
          ) : (
        <section className="py-12 px-4 sm:px-6 bg-gradient-to-br from-slate-950 via-neutral-950 to-emerald-950 rounded-lg min-h-screen flex items-center justify-center">
          <div className="max-w-4xl mx-auto bg-black/35 backdrop-blur-sm rounded-lg p-5 sm:p-8 border border-emerald-500/15 relative">
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-6 text-center">Sobre Mim - Detalhes</h3>

            <div className="space-y-5 sm:space-y-6 text-gray-300 leading-relaxed text-base sm:text-lg">
              <p>
                Sou desenvolvedor Full Stack com foco em Inteligência Artificial, automações e desenvolvimento moderno orientado a IA (Vibe Coding).
              </p>
              <p>
                Atuo criando soluções inteligentes utilizando ferramentas como n8n, agentes de IA e Typebot, conectando diferentes tecnologias para automatizar processos, otimizar operações e gerar resultados reais.
              </p>
              <p>
                Meu foco vai além da escrita de código: trabalho com arquitetura de automações, engenharia de prompts e estruturação de fluxos inteligentes para tornar sistemas mais eficientes, precisos e escaláveis.
              </p>
              <p>
                Utilizo IA como aliada no processo de criação, validação e otimização de soluções, acelerando desenvolvimento, reduzindo falhas e aumentando produtividade.
              </p>
            </div>

            <div className="flex justify-center mt-8">
              <button
                onClick={handleHideDetailedAbout}
                className="bg-emerald-700 hover:bg-emerald-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 shadow-lg flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-arrow-left mr-2"
                >
                  <path d="m12 19-7-7 7-7" />
                  <path d="M19 12H5" />
                </svg>
                Voltar
              </button>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default AboutSection;
