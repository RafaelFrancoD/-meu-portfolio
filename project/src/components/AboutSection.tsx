import React, { useState } from 'react';

const AboutSection: React.FC = () => {
  const fullName = "Rafael Américo Franco de Azevedo";
  const [showDetailedAbout, setShowDetailedAbout] = useState(false);

  const handleShowDetailedAbout = () => {
    setShowDetailedAbout(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleHideDetailedAbout = () => {
    setShowDetailedAbout(false);
  };

  return (
    <>
      {!showDetailedAbout ? (
        <>
          {/* Hero Section */}
          <section id="about" className="relative pt-20 pb-96 sm:pb-[30rem] lg:pb-[40rem] px-4 sm:px-6 bg-[url('/IA.jpg')] bg-cover bg-center">
          </section>

          {/* About Section */}
          <section className="py-16 px-4 sm:px-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12"> {/* Name section - moved back */}
                <p className="text-2xl sm:text-3xl lg:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-2">Olá, Sou</p>
                <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white mb-4 h-24 lg:h-32 flex items-center justify-center"> {/* Reverted h2 classes */}
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                    {fullName}
                  </span>
                </h2>
              </div>

              <div className="flex flex-col lg:flex-row items-center lg:items-start">
                <div className="flex-shrink-0 mb-8 lg:mb-0"> {/* Image container - reverted width/padding */}
                  <img
                    src="/foto-rafael.jpg"
                    alt="Rafael Américo Franco de Azevedo - Foto de Perfil"
                    className="w-full h-auto max-h-[350px] object-contain object-center mx-auto rounded-none" /* Adjusted for rectangle, changed object-cover to object-contain, reduced height */
                  />
                </div>
                <div className="space-y-6 text-center lg:text-left lg:pl-8"> {/* Text container - added lg:pl-8 */}
                  <h3 className="text-2xl font-bold text-white mb-4">
                        <span className="block">Desenvolvedor BackEnd</span>
                        <span className="block text-purple-400 text-lg mt-1">Focado em Performance, Segurança e Escalabilidade</span>
                      </h3>
                      <p className="text-gray-300 leading-relaxed text-lg">
                        Sou um desenvolvedor com foco total em Back-End, especializando-me em Java e Spring Boot. Construí esta plataforma como uma vitrine profissional para os meus futuros projetos. Para criar a interface, utilizei IA como uma ferramenta estratégica, o que me permitiu focar no que é mais importante: construir e apresentar as soluções back-end que são a minha verdadeira paixão.
                      </p>
                  
                </div>
              </div>

              {/* New "Sobre Mim" trigger button */}
              <div className="flex justify-center mt-12">
                <button
                  onClick={handleShowDetailedAbout}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 shadow-lg text-lg"
                >
                  Sobre Mim
                </button>
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
      ) : (
        <section className="py-16 px-4 sm:px-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg min-h-screen flex items-center justify-center">
          <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20 relative">
            <h3 className="text-3xl font-bold text-white mb-6 text-center">Sobre Mim - Detalhes</h3>
            <div className="space-y-6 text-gray-300 leading-relaxed text-lg">
              <p>
                Como uma pessoa naturalmente proativa e curiosa por tecnologia, a minha jornada na área começou com uma paixão genuína pela criação e pelo aprendizado. Desde o início do meu curso de Análise e Desenvolvimento de Sistemas, percebi que o meu fascínio estava nos bastidores. Sou muito atencioso aos detalhes e focado em performance, por isso a construção da lógica, a otimização de dados e a eficiência que sustentam uma aplicação me cativaram imediatamente.
              </p>
              <p>
                Foi assim que o Back-End com Java se tornou o meu principal foco de estudo e carreira, pois acredito que as melhores soluções back-end são aquelas que permitem a criação de experiências de utilizador incríveis no front-end.
              </p>
            </div>
            <div className="flex justify-center mt-8">
              <button
                onClick={handleHideDetailedAbout}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 shadow-lg flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left mr-2"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
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