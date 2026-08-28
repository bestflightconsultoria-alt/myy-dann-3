import React, { useState, useEffect } from 'react';
import { BookOpen, Clock, Calendar, ArrowRight, ArrowLeft } from 'lucide-react';
import { useBlog } from '../hooks/useBlog';
import { BlogPost } from '../types/blog';

interface BlogProps {
  initialPostId?: string;
  initialPostSlug?: string;
  onSelectPost?: (post: BlogPost | null) => void;
}

export const Blog: React.FC<BlogProps> = ({ initialPostId, initialPostSlug, onSelectPost }) => {
  const { posts } = useBlog();
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    if (initialPostId || initialPostSlug) {
      const match = posts.find(p => p.id === initialPostId || p.slug === initialPostSlug);
      if (match) {
        setSelectedPost(match);
      } else {
        setSelectedPost(null);
      }
    } else {
      setSelectedPost(null);
    }
  }, [initialPostId, initialPostSlug, posts]);

  const handleBackToList = () => {
    setSelectedPost(null);
    if (onSelectPost) onSelectPost(null);
    window.history.pushState(null, '', '/blog');
  };

  if (selectedPost) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-200">
        <button
          onClick={handleBackToList}
          className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3.5 py-2 rounded-xl transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> ← Voltar para Todos os Guias do Paciente
        </button>

        <article className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-10 shadow-sm space-y-6">
          <div className="space-y-3">
            <button
              onClick={handleBackToList}
              className="px-3 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition-all cursor-pointer inline-flex items-center gap-1"
            >
              🏷️ {selectedPost.category} (Ver todos)
            </button>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
              {selectedPost.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 pt-2 border-b pb-4">
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {selectedPost.date}</span>
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {selectedPost.readTime}</span>
              <span>Por <strong>{selectedPost.author}</strong></span>
            </div>
          </div>

          <div
            className="prose prose-emerald max-w-none text-gray-700 leading-relaxed space-y-4 text-sm sm:text-base [&>h3]:text-lg [&>h3]:font-bold [&>h3]:text-gray-900 [&>h3]:mt-6 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-1.5 [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:space-y-1.5"
            dangerouslySetInnerHTML={{ __html: selectedPost.content }}
          />

          <div className="pt-6 border-t flex flex-wrap gap-2">
            {selectedPost.tags.map((tag, idx) => (
              <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-lg font-medium">
                #{tag}
              </span>
            ))}
          </div>
        </article>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
          <BookOpen className="w-8 h-8 text-emerald-600" />
          Guia do Paciente & Conteúdo
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Artigos educativos, passo a passo de acolhimento e guias para descomplicar seu tratamento canabinoide.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((post) => (
          <div
            key={post.id}
            onClick={() => {
              setSelectedPost(post);
              if (onSelectPost) onSelectPost(post);
            }}
            className="bg-white rounded-2xl border border-gray-200/90 p-6 hover:shadow-xl hover:border-emerald-500/60 transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {post.isPinned && (
                    <span className="px-2.5 py-0.5 text-xs font-black rounded-md bg-amber-400 text-slate-950 shadow-xs">
                      📌 GUIA ESSENCIAL FIXADO
                    </span>
                  )}
                  <span className="px-2.5 py-0.5 text-xs font-bold rounded-md bg-emerald-50 text-emerald-800 border border-emerald-100">
                    {post.category}
                  </span>
                </div>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {post.readTime}
                </span>
              </div>

              <h3 className="text-xl font-bold text-gray-900 group-hover:text-emerald-700 transition-colors leading-snug">
                {post.title}
              </h3>

              <p className="text-xs sm:text-sm text-gray-600 mt-2.5 leading-relaxed">
                {post.excerpt}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-400">{post.date}</span>
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                Ler Artigo Completo <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blog;
