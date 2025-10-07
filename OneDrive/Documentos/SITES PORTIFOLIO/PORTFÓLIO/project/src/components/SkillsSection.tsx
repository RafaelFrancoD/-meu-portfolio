import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const SkillsSection: React.FC = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1
        }
      }
    ]
  };

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
    <section id="skills" className="py-24 px-6 bg-gradient-to-br from-black to-blue-900 rounded-lg">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Habilidades e Conhecimentos
            </h2>
          <p className="text-xl text-gray-300">Tecnologias que domino</p>
        </div>

        <Slider {...settings}>
          {skills.map((skill, index) => (
            <div key={index} className="px-2"> {/* Adicionado padding horizontal para espaçamento entre os slides */}
              <div
                className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:border-purple-400/50 transition-all duration-300 hover:transform hover:scale-105 shadow-lg shadow-purple-500/25"
              >
                <div className="text-4xl mb-4">{skill.icon}</div>
                <h3 className="text-xl font-bold text-white mb-3">{skill.name}</h3>
                <p className="text-gray-300">{skill.description}</p>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default SkillsSection;