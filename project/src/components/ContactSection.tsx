import React from 'react';
import { Mail, Phone, Github, Linkedin } from 'lucide-react';

const ContactSection: React.FC = () => {
  return (
    <section id="contact" className="py-12 sm:py-16 px-4 sm:px-6 bg-gradient-to-br from-slate-950 via-neutral-950 to-emerald-950 rounded-lg">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10 sm:mb-12" data-gsap-item>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-emerald-200 mb-3 sm:mb-4">Entre em Contato</h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-300">Vamos conversar sobre oportunidades</p>
        </div>

        <div className="flex flex-col lg:flex-row justify-center gap-4 sm:gap-8 w-full max-w-6xl mx-auto">
          <div className="flex flex-col gap-4 w-full">
            <a href="mailto:rafael.personal83@hotmail.com" data-gsap-item className="block bg-black/30 backdrop-blur-sm rounded-lg p-4 sm:p-6 border border-emerald-500/15 flex items-start gap-4 transition-all duration-300 hover:border-emerald-400/50 hover:transform hover:scale-105">
              <div className="bg-slate-900 p-3 rounded-full flex-shrink-0">
                <Mail className="w-5 sm:w-6 h-5 sm:h-6 text-emerald-300" />
              </div>
              <div className="flex-grow">
                <h4 className="text-white font-semibold mb-1 text-sm sm:text-base">Email</h4>
                <span className="text-gray-300 hover:text-white break-all text-sm sm:text-base">
                  rafael.personal83@hotmail.com
                </span>
              </div>
            </a>

            <a href="https://www.linkedin.com/in/rafaelfrancoazevedo/" target="_blank" rel="noopener noreferrer" data-gsap-item className="block bg-black/30 backdrop-blur-sm rounded-lg p-4 sm:p-6 border border-emerald-500/15 flex items-start gap-4 transition-all duration-300 hover:border-emerald-400/50 hover:transform hover:scale-105">
              <div className="bg-slate-900 p-3 rounded-full flex-shrink-0">
                <Linkedin className="w-5 sm:w-6 h-5 sm:h-6 text-emerald-300" />
              </div>
              <div className="flex-grow">
                <h4 className="text-white font-semibold mb-1 text-sm sm:text-base">LinkedIn</h4>
                <span className="text-gray-300 hover:text-white break-all text-sm sm:text-base">
                  linkedin.com/in/rafaelfrancoazevedo
                </span>
              </div>
            </a>

            <a href="https://github.com/RafaelFrancoD" target="_blank" rel="noopener noreferrer" data-gsap-item className="block bg-black/30 backdrop-blur-sm rounded-lg p-4 sm:p-6 border border-emerald-500/15 flex items-start gap-4 transition-all duration-300 hover:border-emerald-400/50 hover:transform hover:scale-105">
              <div className="bg-slate-900 p-3 rounded-full flex-shrink-0">
                <Github className="w-5 sm:w-6 h-5 sm:h-6 text-emerald-300" />
              </div>
              <div className="flex-grow">
                <h4 className="text-white font-semibold mb-1 text-sm sm:text-base">GitHub</h4>
                <span className="text-gray-300 hover:text-white break-all text-sm sm:text-base">
                  github.com/RafaelFrancoD
                </span>
              </div>
            </a>

            <a href="https://wa.me/5517996210770" target="_blank" rel="noopener noreferrer" data-gsap-item className="block bg-black/30 backdrop-blur-sm rounded-lg p-4 sm:p-6 border border-emerald-500/15 flex items-start gap-4 transition-all duration-300 hover:border-emerald-400/50 hover:transform hover:scale-105">
              <div className="bg-slate-900 p-3 rounded-full flex-shrink-0">
                <Phone className="w-5 sm:w-6 h-5 sm:h-6 text-emerald-300" />
              </div>
              <div className="flex-grow">
                <h4 className="text-white font-semibold mb-1 text-sm sm:text-base">WhatsApp</h4>
                <span className="text-gray-300 hover:text-white break-all text-sm sm:text-base">
                  (17) 99621-0770
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
