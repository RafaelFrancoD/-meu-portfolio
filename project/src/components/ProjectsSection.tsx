import React from 'react';
import { Github, Monitor } from 'lucide-react';

const projects = [
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
  
  {
    title: 'Sistema de Usuários',
    description: 'Sistema completo para gerenciamento de usuários com funcionalidades CRUD',
    tech: ['Java', 'Spring Boot', 'PostgreSQL'],
    image: 'https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?auto=compress&cs=tinysrgb&w=800',
    github: 'https://github.com/RafaelFrancoD/usuario',
    liveDemo: null
  },
  {
    title: 'Agendador de Tarefas',
    description: 'Aplicação para agendamento e gerenciamento de tarefas.',
    tech: ['Java', 'Spring Boot', 'MongoDB'],
    image: 'https://images.pexels.com/photos/3220556/pexels-photo-3220556.jpeg?auto=compress&cs=tinysrgb&w=800',
    github: 'https://github.com/RafaelFrancoD/agendador-tarefas',
    liveDemo: null
  },
  {
    title: 'Projeto Escola',
    description: 'Sistema de gerenciamento escolar com funcionalidades administrativas.',
    tech: ['Java', 'Spring Boot', 'JPA'],
    image: 'https://images.pexels.com/photos/159844/cellular-education-classroom-159844.jpeg?auto=compress&cs=tinysrgb&w=800',
    github: 'https://github.com/RafaelFrancoD/Projeto-Escola',
    liveDemo: null
  },
  {
    title: 'Conta Bancária - DIO',
    description: 'Projeto de simulação de conta bancária desenvolvido durante curso da DIO',
    tech: ['Java', 'POO', 'Collections'],
    image: 'https://images.pexels.com/photos/259200/pexels-photo-259200.jpeg?auto=compress&cs=tinysrgb&w=800',
    github: 'https://github.com/RafaelFrancoD/Testando-Conta-bancaria-DIO.ME',
    liveDemo: null
  },
  
];

const ProjectsSection: React.FC = () => {
  return (
    <section id="projects" className="py-16 px-4 sm:px-6 bg-gradient-to-br from-black to-blue-900 rounded-lg">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Projetos em Destaque</h2>
          <p className="text-lg md:text-xl text-gray-300">Alguns dos meus trabalhos recentes</p>
        </div>

        <h3 className="text-2xl font-bold text-white mb-6 text-center">Secção 1: Projetos Web Completos (Ponta-a-Ponta)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {projects.map((project, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 flex flex-col justify-between hover:border-purple-400/50 transition-all duration-300 hover:transform hover:scale-105 shadow-lg shadow-purple-500/25">
              <div>
                <img src={project.image} alt={project.title} className="w-full h-48 object-contain object-center rounded-md mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">{project.title}</h3>
                <p className="text-gray-300 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech.map((tech, techIndex) => (
                    <span key={techIndex} className="bg-purple-600/30 text-purple-300 text-sm px-3 py-1 rounded-full">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-4 mt-4">
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-gray-700 text-white px-4 py-2 rounded-full font-semibold hover:bg-gray-600 transition-colors duration-300 flex items-center justify-center gap-2"
                >
                  <Github size={18} /> GitHub
                </a>
                {project.liveDemo && (
                  <a
                    href={project.liveDemo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-gray-700 text-white px-4 py-2 rounded-full font-semibold hover:bg-gray-600 transition-colors duration-300 flex items-center justify-center gap-2"
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