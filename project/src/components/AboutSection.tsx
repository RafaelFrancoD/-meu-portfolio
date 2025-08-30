import React from 'react';

const AboutSection: React.FC = () => {
  const fullName = "Rafael Américo Franco de Azevedo";

  return (
    <>
      {/* Hero Section */}
      <section id="about" className="relative pt-20 pb-96 sm:pb-[30rem] lg:pb-[40rem] px-4 sm:px-6 bg-[url('/IA.jpg')] bg-cover bg-center">
      </section>

      {/* About Section */}
      <section className="py-16 px-4 sm:px-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-2xl sm:text-3xl lg:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-2">Olá, Sou</p>
            <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white mb-4 h-24 lg:h-32 flex items-center justify-center">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                {fullName}
              </span>
            </h2>
          </div>

          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="relative w-[40rem] h-[40rem] overflow-hidden mx-auto lg:mx-0 mb-8 lg:mb-0">
              <img
                src="/foto rafael.jpg"
                alt="Rafael Américo Franco de Azevedo - Foto de Perfil"
                className="w-full h-full object-contain object-center"
              />
            </div>
            <div className="space-y-6 lg:w-2/3">
              <p className="text-gray-300 leading-relaxed text-lg">
                Estou cursando um curso tecnólogo na área de Análise e Desenvolvimento de Sistemas, movido por uma paixão genuína por tecnologia, criação e aprendizado constante.
              </p>
              <p className="text-gray-300 leading-relaxed text-lg">
                Iniciei minha jornada com foco no Back-End, especialmente com a linguagem Java, onde conquistei certificados por meio de plataformas de ensino online.
              </p>
              <p className="text-gray-300 leading-relaxed text-lg">
                Com o tempo, fui despertando interesse também pelo Front-End — e, desde então, venho estudando a criação de interfaces web, landing pages e adquirindo noções de marketing digital. Essas áreas ampliaram minha visão sobre como unir design, funcionalidade e estratégia para gerar resultados reais.
              </p>
              <p className="text-gray-300 leading-relaxed text-lg">
                Mesmo sem certificados formais em Front-End ou Marketing, tenho aplicado o que aprendo com apoio de ferramentas de IA e muita prática. Um exemplo disso é meu primeiro projeto autoral: este portfólio, desenvolvido como parte do meu processo de aprendizado.
              </p>
              <p className="text-gray-300 leading-relaxed text-lg">
                Hoje, estou em busca de uma primeira oportunidade na área de tecnologia, seja para integrar uma equipe ou atuar como freelancer. Quero ganhar experiência prática, fortalecer minha segurança técnica e evoluir na criação de projetos cada vez mais completos e relevantes.
              </p>
              <p className="text-gray-300 leading-relaxed text-lg">
                Se você está procurando alguém em crescimento, com sede de conhecimento, iniciativa e disposição para aprender e contribuir — vamos conversar.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12">
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <div className="text-3xl font-bold text-purple-400 mb-2">9+</div>
              <div className="text-gray-300">Tecnologias</div>
            </div>
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <div className="text-3xl font-bold text-purple-400 mb-2">10+</div>
              <div className="text-gray-300">Projetos</div>
            </div>
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <div className="text-3xl font-bold text-purple-400 mb-2">100%</div>
              <div className="text-gray-300">Dedicação</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutSection;