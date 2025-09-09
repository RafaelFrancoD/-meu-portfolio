import React, { lazy, Suspense, useState } from 'react';
import useScrollToSection from './hooks/useScrollToSection';
import AnimatedSection from './components/common/AnimatedSection';
import { Menu, X } from 'lucide-react';

const AboutSection = lazy(() => import('./components/AboutSection'));
const SkillsSection = lazy(() => import('./components/SkillsSection'));
const ProjectsSection = lazy(() => import('./components/ProjectsSection'));
const ContactSection = lazy(() => import('./components/ContactSection'));

function App() {
  // Forçando novo build para limpar cache - Tentativa Final
  const { activeSection, scrollToSection } = useScrollToSection();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLinkClick = (section: string) => {
    scrollToSection(section);
    setIsMenuOpen(false);
  };

  const navLinks = [
    { id: 'about', name: 'Início' },
    { id: 'about', name: 'Sobre mim' },
    { id: 'skills', name: 'Habilidades' },
    { id: 'projects', name: 'Projetos' },
    { id: 'contact', name: 'Contato' },
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 noise-overlay overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-black/20 backdrop-blur-lg border-b border-white/10 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            {/* Logo / Site title */}
            <div className="flex-shrink-0">
              <div className="text-white font-bold text-xl">
                Portfólio
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-8">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleLinkClick(link.id)}
                  className={`capitalize transition-colors duration-300 ${
                    activeSection === link.id
                      ? 'text-purple-400'
                      : 'text-white hover:text-purple-300'
                  }`}
                >
                  {link.name}
                </button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white hover:text-purple-300"
                aria-label="Abrir menu"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay*/}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-gray-900/95 z-40 pt-16">
           <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleLinkClick(link.id)}
                  className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-700"
                >
                  {link.name}
                </button>
              ))}
            </div>
        </div>
      )}

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

// Forçando novo build para limpar cache - Tentativa Final
export default App;
