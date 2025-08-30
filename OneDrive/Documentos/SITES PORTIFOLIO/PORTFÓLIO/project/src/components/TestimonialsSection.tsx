import React, { useState } from 'react';
import { Send } from 'lucide-react';

interface Comment {
  name: string;
  message: string;
  timestamp: string;
}

const CommentsSection: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() === '' || message.trim() === '') {
      alert('Por favor, preencha seu nome e sua mensagem.');
      return;
    }

    const newComment: Comment = {
      name: name.trim(),
      message: message.trim(),
      timestamp: new Date().toLocaleString(),
    };

    setComments([...comments, newComment]);
    setName('');
    setMessage('');
  };

  return (
    <section id="comments" className="py-16 px-6 bg-black/20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4 text-shadow-purple">Deixe seu Comentário</h2>
          <p className="text-xl text-gray-300">Sua opinião é importante!</p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20 mb-12 shadow-lg shadow-purple-500/25">
          <h3 className="text-2xl font-bold text-white mb-6">Envie sua Mensagem</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-gray-300 text-lg font-semibold mb-2">Seu Nome:</label>
              <input
                type="text"
                id="name"
                className="w-full p-3 rounded-md bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400"
                placeholder="Digite seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-gray-300 text-lg font-semibold mb-2">Sua Mensagem:</label>
              <textarea
                id="message"
                rows={5}
                className="w-full p-3 rounded-md bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400"
                placeholder="Deixe seu comentário ou elogio..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 flex items-center gap-2 justify-center"
            >
              <Send size={20} />
              Enviar Mensagem
            </button>
          </form>
        </div>

        {comments.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold text-white mb-6 text-center">Comentários Recebidos</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {comments.map((comment, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 shadow-lg shadow-purple-500/25"
                >
                  <p className="text-gray-300 italic mb-4">"{comment.message}"</p>
                  <h4 className="text-xl font-bold text-white mb-1">{comment.name}</h4>
                  <p className="text-purple-400 text-sm">{comment.timestamp}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CommentsSection;