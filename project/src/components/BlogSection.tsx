import React from 'react';
import { ExternalLink } from 'lucide-react';

const blogPosts = [
  {
    id: 1,
    title: 'Entendendo o Spring Boot: Um Guia para Iniciantes',
    description: 'Uma introdução abrangente ao Spring Boot, seus principais recursos e como começar a desenvolver aplicações robustas.',
    date: '15 de Julho de 2025',
    link: '#', // Substitua por um link real para o artigo
  },
  {
    id: 2,
    title: 'Docker para Desenvolvedores Back-End: Primeiros Passos',
    description: 'Aprenda a containerizar suas aplicações Java e Python com Docker para um ambiente de desenvolvimento consistente.',
    date: '10 de Julho de 2025',
    link: '#', // Substitua por um link real para o artigo
  },
  {
    id: 3,
    title: 'Desmistificando Bancos de Dados NoSQL: MongoDB vs. PostgreSQL',
    description: 'Uma comparação entre bancos de dados relacionais e NoSQL, com foco em quando usar MongoDB ou PostgreSQL.',
    date: '01 de Julho de 2025',
    link: '#', // Substitua por um link real para o artigo
  },
];

const BlogSection: React.FC = () => {
  return (
    <section id="blog" className="py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Meu Blog</h2>
          <p className="text-xl text-gray-300">Artigos e Insights</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <a
              key={post.id}
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:border-purple-400/50 transition-all duration-300 hover:transform hover:scale-105"
            >
              <h3 className="text-xl font-bold text-white mb-2">{post.title}</h3>
              <p className="text-gray-300 text-sm mb-3">{post.date}</p>
              <p className="text-gray-300 mb-4">{post.description}</p>
              <span className="flex items-center gap-2 text-purple-400">
                <ExternalLink size={16} />
                Ler Artigo
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
