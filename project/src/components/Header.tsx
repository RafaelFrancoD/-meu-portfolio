import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import useScrollToSection from '../hooks/useScrollToSection';

const navLinks = [
  { id: 'about', title: 'Início' },
  { id: 'skills', title: 'Habilidades' },
  { id: 'projects', title: 'Projetos' },
  { id: 'github', title: 'GitHub' },
  { id: 'blog', title: 'Blog' },
  { id: 'comments', title: 'Comentários' },
  { id: 'contact', title: 'Contato' },
];

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { scrollToSection } = useScrollToSection();

  const handleLinkClick = (sectionId: string) => {
    scrollToSection(sectionId);
    setIsOpen(false); // Fecha o menu mobile ao clicar em um link
  };

  return (
    <header className="bg-gray-900/80 backdrop-blur-sm text-white fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <span 
              className="text-2xl font-bold cursor-pointer text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400"
              onClick={() => handleLinkClick('about')}
            >
              R.F.A
            </span>
          </div>
          <div className="hidden md:block">
            <nav className="ml-10 flex items-baseline space-x-4">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {link.title}
                </button>
              ))}
            </nav>
          </div>
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <span className="sr-only">Abrir menu</span>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile */}
      {isOpen && (
        <div className="md:hidden">
          <nav className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className="text-gray-300 hover:bg-gray-700 hover:text-white block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors"
              >
                {link.title}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;