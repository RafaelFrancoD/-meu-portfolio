import React, { useState } from 'react';
import { Github, Monitor } from 'lucide-react';

interface Project {
  title: string;
  description: string;
  tech: string[];
  image: string;
  imagePosition?: string;
  github?: string;
  liveDemo?: string;
}

const projects: Project[] = [
  {
    title: 'F7 Telecom CRM',
    description: 'CRM completo para operadora de telecom, em produção real: gestão de clientes (PF/PJ), funil de vendas, ordens de serviço, faturamento e financeiro. Backend próprio com autenticação MFA, RBAC por papel, dados sensíveis cifrados e infraestrutura endurecida (firewall em camadas, HTTPS, backups automáticos cifrados off-site). Projeto confidencial de cliente — código-fonte e ambiente não divulgados.',
    tech: ['React', 'TypeScript', 'Node.js', 'Express', 'PostgreSQL', 'Nginx', 'Segurança/DevOps'],
    image: '/f7-telecom-logo.jpeg',
  },
  {
    title: 'CRM Holístico',
    description: 'Projeto de CRM focado em centralizar relacionamento com clientes, organização de processos e apoio à automação comercial.',
    tech: ['CRM', 'Automação', 'Gestão de clientes'],
    image: '/crm-holistico-preview.png',
    github: 'https://github.com/RafaelFrancoD/CRM-hol-stico',
    liveDemo: 'https://crm-holistico.vercel.app/',
  },
  {
    title: 'Sistema de Gerenciamento de Férias',
    description: 'Solução para simplificar a gestão de férias de equipes. Permite solicitar, aprovar e acompanhar os períodos de férias dos colaboradores.',
    tech: ['React', 'TypeScript', 'Vite', 'Recharts', 'jsPDF'],
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    github: 'https://github.com/RafaelFrancoD/Sistema-Gerenciamento',
    liveDemo: 'https://sistema-gerenciamento-beryl.vercel.app/',
  },
  {
    title: 'Apollos',
    description: 'Site interativo e educacional com história em quadrinhos para exemplificar os efeitos do clima espacial na Terra.',
    tech: ['HTML', 'CSS', 'JavaScript', 'Vercel'],
    image: 'https://images.pexels.com/photos/23769/pexels-photo.jpg',
    github: 'https://github.com/RafaelFrancoD/AstroSun',
    liveDemo: 'https://astro-sun.vercel.app/',
  },
  {
    title: 'Gisela',
    description: 'Portifólio profissional para Analista de Qualidade de Software com foco em presença online moderna, rápida e credível.',
    tech: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'UI/UX Design'],
    image: 'https://gisela.vercel.app/foto%20gisela.jpg',
    imagePosition: 'center 15%',
    github: 'https://github.com/RafaelFrancoD/Gisela',
    liveDemo: 'https://gisela.vercel.app/',
  },
  {
    title: 'Cookitos Landing Page',
    description: 'Landing page moderna, responsiva e interativa para a marca de biscoitos artesanais Cookitos.',
    tech: ['HTML5', 'CSS3', 'JavaScript'],
    image: 'https://applicativa-marketplace-prod.s3.amazonaws.com/blog/cookies-artigo-generico-2.jpg',
    github: 'https://github.com/RafaelFrancoD/cookitos-landing',
    liveDemo: 'https://cookitos-landing.vercel.app/',
  },
];

const ProjectsSection: React.FC = () => {
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);

  return (
    <section id="projects" className="py-12 sm:py-16 px-4 sm:px-6 bg-gradient-to-br from-slate-950 via-neutral-950 to-emerald-950 rounded-lg">
      <div className="w-full max-w-7xl mx-auto">
        {/* Título */}
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-emerald-200 drop-shadow-[0_0_20px_rgba(16,185,129,0.5)]">
            Projetos em Destaque
          </h2>
        </div>

        {/* Backdrop quando hover ativo */}
        {hoveredProject && (
          <div
            className="hidden md:block fixed inset-0 bg-black/70 backdrop-blur-sm z-[90]"
            onClick={() => setHoveredProject(null)}
          />
        )}

        {/* Grid de Projetos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 lg:gap-8">
          {projects.map((project) => (
            <div
              key={project.title}
              className="relative"
            >
              <div
                onMouseEnter={() => setHoveredProject(project.title)}
                onMouseLeave={() => setHoveredProject(null)}
                className={`bg-black/60 backdrop-blur-md rounded-lg p-5 lg:p-6 border border-emerald-500/30 shadow-[0_20px_60px_rgba(0,0,0,0.6)] transition-all duration-500 flex flex-col ${
                  hoveredProject === project.title
                    ? 'md:fixed md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[90vw] md:max-w-4xl md:h-auto md:max-h-[85vh] z-[100] shadow-[0_30px_100px_rgba(16,185,129,0.6)] border-emerald-400 overflow-y-auto'
                    : 'hover:scale-105 hover:shadow-[0_25px_70px_rgba(16,185,129,0.3)] hover:border-emerald-400/60'
                }`}
              >
              <div className="flex-1">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-64 lg:h-72 object-cover object-center rounded-md mb-4"
                  style={project.imagePosition ? { objectPosition: project.imagePosition } : undefined}
                />
                <h3 className="text-xl lg:text-2xl font-bold text-white mb-2">{project.title}</h3>
                <p className="text-sm lg:text-base text-gray-300 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech.map((tech, techIndex) => (
                    <span key={techIndex} className="bg-emerald-700/25 text-emerald-200 text-xs lg:text-sm px-3 py-1 rounded-full">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-slate-800 text-white px-4 py-3 rounded-full font-semibold hover:bg-emerald-900 transition-colors flex items-center justify-center gap-2 text-sm lg:text-base"
                  >
                    <Github size={20} /> GitHub
                  </a>
                )}
                {!project.github && !project.liveDemo && (
                  <span className="flex-1 bg-slate-800/50 text-gray-400 px-4 py-3 rounded-full font-semibold flex items-center justify-center gap-2 text-sm lg:text-base border border-slate-700">
                    Projeto confidencial
                  </span>
                )}
                {project.liveDemo && (
                  <a
                    href={project.liveDemo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-slate-800 text-white px-4 py-3 rounded-full font-semibold hover:bg-emerald-900 transition-colors flex items-center justify-center gap-2 text-sm lg:text-base"
                  >
                    <Monitor size={20} /> Demo
                  </a>
                )}
              </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
