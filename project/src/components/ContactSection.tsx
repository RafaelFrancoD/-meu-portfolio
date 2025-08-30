import React, { useRef, useEffect, useState } from 'react';
import { Mail, Phone, Github, Linkedin } from 'lucide-react';

const ContactSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 } // Trigger when 10% of the section is visible
    );

    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <section id="contact" className="py-16 px-4 sm:px-6 bg-gradient-to-br from-black to-blue-900 rounded-lg" ref={sectionRef}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Entre em Contato</h2>
          <p className="text-lg md:text-xl text-gray-300">Vamos conversar sobre oportunidades</p>
        </div>

        <div className="flex flex-col lg:flex-row justify-center gap-8 w-full max-w-6xl mx-auto">
          <div className="flex flex-col gap-4 w-full">
            <a href="mailto:rafael.personal83@hotmail.com" className={`block bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 flex items-start gap-4 transition-all duration-300 hover:border-purple-400/50 hover:transform hover:scale-105 fade-in-item ${isVisible ? 'is-visible' : ''}`} style={{ animationDelay: '0s' }}>
              <div className="bg-gray-800 p-3 rounded-full flex-shrink-0">
                <Mail className="w-6 h-6 text-blue-500" />
              </div>
              <div className="flex-grow">
                <h4 className="text-white font-semibold mb-1">Email</h4>
                <span className="text-gray-300 hover:text-white break-all">
                  rafael.personal83@hotmail.com
                </span>
              </div>
            </a>

            <a href="https://www.linkedin.com/in/rafaelfrancoazevedo/" target="_blank" rel="noopener noreferrer" className={`block bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 flex items-start gap-4 transition-all duration-300 hover:border-blue-400/50 hover:transform hover:scale-105 fade-in-item ${isVisible ? 'is-visible' : ''}`} style={{ animationDelay: '0.5s' }}>
              <div className="bg-gray-800 p-3 rounded-full flex-shrink-0">
                <Linkedin className="w-6 h-6 text-blue-500" />
              </div>
              <div className="flex-grow">
                <h4 className="text-white font-semibold mb-1">LinkedIn</h4>
                <span className="text-gray-300 hover:text-white break-all">
                  linkedin.com/in/rafaelfrancoazevedo
                </span>
              </div>
            </a>

            <a href="https://github.com/RafaelFrancoD" target="_blank" rel="noopener noreferrer" className={`block bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 flex items-start gap-4 transition-all duration-300 hover:border-gray-400/50 hover:transform hover:scale-105 fade-in-item ${isVisible ? 'is-visible' : ''}`} style={{ animationDelay: '1.0s' }}>
              <div className="bg-white p-3 rounded-full flex-shrink-0">
                <Github className="w-6 h-6 text-black" />
              </div>
              <div className="flex-grow">
                <h4 className="text-white font-semibold mb-1">GitHub</h4>
                <span className="text-gray-300 hover:text-white break-all">
                  github.com/RafaelFrancoD
                </span>
              </div>
            </a>

            <a href="https://wa.me/5517992256180" target="_blank" rel="noopener noreferrer" className={`block bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 flex items-start gap-4 transition-all duration-300 hover:border-green-400/50 hover:transform hover:scale-105 fade-in-item ${isVisible ? 'is-visible' : ''}`} style={{ animationDelay: '1.5s' }}>
              <div className="bg-gray-800 p-3 rounded-full flex-shrink-0">
                <Phone className="w-6 h-6 text-green-500" />
              </div>
              <div className="flex-grow">
                <h4 className="text-white font-semibold mb-1">WhatsApp</h4>
                <span className="text-gray-300 hover:text-white break-all">
                  (17) 99225-6180
                </span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
