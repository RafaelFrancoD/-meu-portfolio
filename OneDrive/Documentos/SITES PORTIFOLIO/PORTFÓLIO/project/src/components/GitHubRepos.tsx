import React, { useEffect, useState } from 'react';
import { Github, ExternalLink } from 'lucide-react';

interface Repo {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
}

const GitHubRepos: React.FC = () => {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        // Substitua 'RafaelFrancoD' pelo seu nome de usuário do GitHub
        const response = await fetch('https://api.github.com/users/RafaelFrancoD/repos?sort=updated&per_page=6');
        if (!response.ok) {
          throw new Error(`GitHub API error: ${response.statusText}`);
        }
        const data: Repo[] = await response.json();
        setRepos(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, []);

  if (loading) {
    return <div className="text-center text-gray-400">Carregando repositórios do GitHub...</div>;
  }

  if (error) {
    return <div className="text-center text-red-400">Erro ao carregar repositórios: {error}</div>;
  }

  return (
    <section className="py-16 px-6 bg-black/20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Meus Repositórios no GitHub</h2>
          <p className="text-xl text-gray-300">Projetos recentes e contribuições</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {repos.map((repo) => (
            <a
              key={repo.id}
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 hover:border-purple-400/50 transition-all duration-300 hover:transform hover:scale-105"
            >
              <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <Github size={20} /> {repo.name}
              </h3>
              <p className="text-gray-300 mb-4">{repo.description || 'Sem descrição.'}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {repo.language && (
                  <span className="bg-blue-600/30 text-blue-300 px-3 py-1 rounded-full text-sm">
                    {repo.language}
                  </span>
                )}
                <span className="bg-yellow-600/30 text-yellow-300 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                  ⭐ {repo.stargazers_count}
                </span>
                <span className="bg-green-600/30 text-green-300 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                  🍴 {repo.forks_count}
                </span>
              </div>
              <span className="flex items-center gap-2 text-purple-400">
                <ExternalLink size={16} />
                Ver no GitHub
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GitHubRepos;
