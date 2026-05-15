import React from 'react';
import { Github, Monitor } from 'lucide-react';

const projects = [
  {
    title: 'CRM Holístico',
    description: 'Projeto de CRM focado em centralizar relacionamento com clientes, organização de processos e apoio à automação comercial.',
    tech: ['CRM', 'Automação', 'Gestão de clientes'],
    image: '/crm-holistico-preview.png',
    github: 'https://github.com/RafaelFrancoD/CRM-hol-stico',
    liveDemo: 'https://crm-holistico.vercel.app/'
  },
  {
    title: 'Sistema de Gerenciamento de Férias',
    description: 'Solução para simplificar a gestão de férias de equipes. Permite solicitar, aprovar e acompanhar os períodos de férias dos colaboradores, otimizar o planejamento e evitar conflitos de agendamento.',
    tech: ['React', 'TypeScript', 'Vite', 'Recharts', 'jsPDF'],
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    github: 'https://github.com/RafaelFrancoD/Sistema-Gerenciamento',
    liveDemo: 'https://sistema-gerenciamento-beryl.vercel.app/'
  },
  {
    title: 'Apollos',
    description: 'AstroSun é um site interativo e educacional, que contém uma história em quadrinhos que visa exemplificar os efeitos do clima espacial na Terra e, consequentemente, despertar a curiosidade científica e o pensamento crítico.',
    tech: ['HTML', 'CSS', 'JavaScript', 'Vercel'],
    image: 'https://images.pexels.com/photos/23769/pexels-photo.jpg',
    github: 'https://github.com/RafaelFrancoD/AstroSun',
    liveDemo: 'https://astro-sun.vercel.app/'
  },
  {
    title: 'Gisela',
    description: `Portifólio Profissional para Analista de Qualidade de Software O Desafio: A cliente, uma especialista em QA, precisava de uma presença online profissional para apresentar a sua experiência, e competências e potenciais. O objetivo era criar uma plataforma moderna, rápida e que transmitisse credibilidade. A Minha Atuação: Atuei como um  desenvolvedor neste projeto de ponta-a-ponta.`,
    tech: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Gerenciamento de projetos', 'Comunicação com o cliente', 'UI/UX Design', 'Desenvolvimento front-end'],
    image: 'https://gisela.vercel.app/foto%20gisela.jpg',
    github: 'https://github.com/RafaelFrancoD/Gisela',
    liveDemo: 'https://gisela.vercel.app/'
  },
  {
    title: 'Cookitos Landing Page',
    description: 'Uma landing page moderna, responsiva e interativa para a marca de biscoitos artesanais "Cookitos". O projeto foi desenvolvido com foco em uma apresentação visual atraente dos produtos e na fácil interação do usuário.',
    tech: ['HTML5', 'CSS3', 'JavaScript'],
    image: 'https://applicativa-marketplace-prod.s3.amazonaws.com/blog/cookies-artigo-generico-2.jpg',
    github: 'https://github.com/RafaelFrancoD/cookitos-landing',
    liveDemo: 'https://cookitos-landing.vercel.app/'
  },
];

const ProjectsSection: React.FC = () => {
  return (
    <section id="projects" className="py-12 sm:py-16 px-4 sm:px-6 bg-gradient-to-br from-slate-950 via-neutral-950 to-emerald-950 rounded-lg">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10 sm:mb-12" data-gsap-item>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-emerald-200 mb-3 sm:mb-4">Projetos em Destaque</h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-300">Alguns dos meus trabalhos recentes</p>
        </div>

        <h3 className="text-xl sm:text-2xl font-bold text-emerald-100 mb-5 sm:mb-6 text-center" data-gsap-item>Secção 1: Projetos Web Completos (Ponta-a-Ponta)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8 items-stretch">
          {projects.map((project, index) => (
            <div key={index} data-gsap-item className="bg-black/30 backdrop-blur-sm rounded-lg p-4 sm:p-6 border border-emerald-500/15 flex flex-col justify-between hover:border-emerald-400/50 transition-all duration-300 hover:transform hover:scale-105 shadow-lg shadow-black/40">
              <div>
                <img src={project.image} alt={project.title} className="w-full h-40 sm:h-48 object-contain object-center rounded-md mb-4" />
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">{project.title}</h3>
                <p className="text-sm sm:text-base text-gray-300 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech.map((tech, techIndex) => (
                    <span key={techIndex} className="bg-emerald-700/25 text-emerald-200 text-xs sm:text-sm px-3 py-1 rounded-full">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 sm:gap-4 mt-4">
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-slate-800 text-white px-3 sm:px-4 py-2 rounded-full font-semibold hover:bg-emerald-900 transition-colors duration-300 flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <Github size={18} /> GitHub
                </a>
                {project.liveDemo && (
                  <a
                    href={project.liveDemo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-slate-800 text-white px-3 sm:px-4 py-2 rounded-full font-semibold hover:bg-emerald-900 transition-colors duration-300 flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    <Monitor size={18} /> Demo
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
