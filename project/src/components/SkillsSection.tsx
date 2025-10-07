import React from 'react';

const SkillsSection: React.FC = () => {
  const skills = [
    {
      name: 'Java Nivel Iniciante',
      description: 'Linguagem principal para Desenvolvimento Back-End',
      icon: '☕',
      category: 'backend'
    },
    {
      name: 'Spring Boot',
      description: 'Framework para desenvolvimento de APIs REST',
      icon: '🍃',
      category: 'backend'
    },
    {
      name: 'Python Nivel Básico',
      description: 'Linguagem versátil para desenvolvimento e automação',
      icon: '🐍',
      category: 'backend'
    },
    {
      name: 'Django',
      description: 'Framework web Python para desenvolvimento rápido',
      icon: '🎯',
      category: 'backend'
    },
    {
      name: 'PostgreSQL Nivel Básico',
      description: 'Sistema de gerenciamento de banco de dados relacional',
      icon: '🐘',
      category: 'database'
    },
    {
      name: 'MongoDB Nivel Básico',
      description: 'Banco de dados NoSQL orientado a documentos',
      icon: '🍃',
      category: 'database'
    },
    {
      name: 'Postman',
      description: 'Ferramenta para testes de APIs',
      icon: '📮',
      category: 'tools'
    },
    {
      name: 'GitHub Nivel Básico',
      description: 'Controle de versão e colaboração',
      icon: '🐙',
      category: 'tools'
    },
    {
      name: 'Git',
      description: 'Sistema de controle de versão distribuído',
      icon: '📝',
      category: 'tools'
    }
  ];

  return (
    <section id="skills" className="py-16 px-4 sm:px-6 bg-gradient-to-br from-black to-blue-900 rounded-lg">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Habilidades e Conhecimentos
            </h2>
          <p className="text-lg md:text-xl text-gray-300">Tecnologias que domino</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skills.map((skill, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:border-purple-400/50 transition-all duration-300 hover:transform hover:scale-105 shadow-lg shadow-purple-500/25 h-full">
              
              <h3 className="text-xl font-bold text-white mb-3">{skill.name}</h3>
              <p className="text-gray-300">{skill.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;