import React, { lazy, Suspense } from 'react';
import useScrollToSection from './hooks/useScrollToSection';
import AnimatedSection from './components/common/AnimatedSection';

const AboutSection = lazy(() => import('./components/AboutSection'));
const SkillsSection = lazy(() => import('./components/SkillsSection'));
const ProjectsSection = lazy(() => import('./components/ProjectsSection'));
const ContactSection = lazy(() => import('./components/ContactSection'));

function App() {
  const { activeSection, scrollToSection } = useScrollToSection();

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 noise-overlay">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-black/20 backdrop-blur-lg border-b border-white/10 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-end items-center">
            <div className="hidden md:flex space-x-8">
              {['about', 'skills', 'projects', 'contact'].map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className={`capitalize transition-colors duration-300 ${
                    activeSection === section && section !== 'about'
                      ? 'text-purple-400'
                      : 'text-white hover:text-purple-300'
                  }`}
                >
                  {/* Corrigido: Nomes em inglês na navegação */}
                  {section === 'about' ? 'Início' :
                    section === 'skills' ? 'Habilidades' :
                    section === 'projects' ? 'Projetos' : 'Contato'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero and About Section */}
      <AboutSection scrollToSection={scrollToSection} />

      <main className="flex flex-col items-center gap-16 py-16">
        {/* Skills Section */}
        <AnimatedSection delay={100}>
          <Suspense fallback={<div>Loading Skills...</div>}>
            <SkillsSection />
          </Suspense>
        </AnimatedSection>

        {/* Projects Section */}
        <AnimatedSection delay={200}>
          <Suspense fallback={<div>Loading Projects...</div>}>
            <ProjectsSection />
          </Suspense>
        </AnimatedSection>

        {/* Contact Section */}
        <AnimatedSection delay={350}>
          <Suspense fallback={<div>Loading Contact...</div>}>
            <ContactSection scrollToSection={scrollToSection} />
          </Suspense>
        </AnimatedSection>
      </main>

      {/* Footer */}
      <footer className="py-8 px-6 bg-black/40 border-t border-white/10">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-400">
            &copy; 2025 Rafael Américo Franco de Azevedo. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;