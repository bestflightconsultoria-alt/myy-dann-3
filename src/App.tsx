import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Header } from './components/Header';
import { Catalog } from './components/Catalog';
import { PwaInstallBanner } from './components/PwaInstallBanner';
import { Strain } from './types/strain';
import { Association } from './types/association';
import { BlogPost } from './types/blog';

// Lazy loading das abas secundárias para diminuir o bundle inicial e acelerar o carregamento
const Associations = lazy(() => import('./components/Associations').then(m => ({ default: m.Associations })));
const AiSommelier = lazy(() => import('./components/AiSommelier').then(m => ({ default: m.AiSommelier })));
const Doctors = lazy(() => import('./components/Doctors').then(m => ({ default: m.Doctors })));
const Blog = lazy(() => import('./components/Blog').then(m => ({ default: m.Blog })));
const FAQ = lazy(() => import('./components/FAQ').then(m => ({ default: m.FAQ })));
const MyProfile = lazy(() => import('./components/MyProfile').then(m => ({ default: m.MyProfile })));
const TermsModal = lazy(() => import('./components/TermsModal').then(m => ({ default: m.TermsModal })));
const ContactModal = lazy(() => import('./components/ContactModal').then(m => ({ default: m.ContactModal })));
const AuthModal = lazy(() => import('./components/AuthModal').then(m => ({ default: m.AuthModal })));

const TabLoadingFallback = () => (
  <div className="py-20 flex flex-col items-center justify-center gap-3 text-emerald-700 animate-pulse">
    <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
    <span className="text-xs font-bold text-gray-500">Carregando informações...</span>
  </div>
);

export function App() {
  const [activeTab, setActiveTab] = useState<string>('catalogo-flores');
  const [isTermsOpen, setIsTermsOpen] = useState<boolean>(false);
  const [isContactOpen, setIsContactOpen] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  
  // Roteamento de Estado por URL limpa (ex: /strains/gorilla-freak, /associacoes/damasceno, /blog/como-se-associar)
  const [selectedStrainId, setSelectedStrainId] = useState<string | undefined>(undefined);
  const [selectedAssocId, setSelectedAssocId] = useState<string | undefined>(undefined);
  const [selectedArticleSlug, setSelectedArticleSlug] = useState<string | undefined>(undefined);

  // Leitura inicial da URL ao carregar a página
  useEffect(() => {
    const handleLocationChange = () => {
      const rawPath = window.location.pathname.toLowerCase().replace(/\/$/, '') || '/';
      const hash = window.location.hash.toLowerCase();

      if (rawPath.startsWith('/strains/') || hash.startsWith('#strain=')) {
        const id = rawPath.replace('/strains/', '') || hash.replace('#strain=', '');
        setActiveTab('catalogo-flores');
        setSelectedStrainId(id);
      } else if ((rawPath.startsWith('/associacoes/') && rawPath !== '/associacoes') || hash.startsWith('#associacao=')) {
        const id = rawPath.replace('/associacoes/', '') || hash.replace('#associacao=', '');
        setActiveTab('associacoes');
        setSelectedAssocId(id);
      } else if ((rawPath.startsWith('/blog/') && rawPath !== '/blog') || hash.startsWith('#article=')) {
        const slug = rawPath.replace('/blog/', '') || hash.replace('#article=', '');
        setActiveTab('blog');
        setSelectedArticleSlug(slug);
      } else if (rawPath === '/associacoes') {
        setActiveTab('associacoes');
        setSelectedAssocId(undefined);
      } else if (rawPath === '/sommelier' || rawPath === '/fummelier-ia' || rawPath === '/ia') {
        setActiveTab('sommelier');
      } else if (rawPath === '/medicos' || rawPath === '/prescritores') {
        setActiveTab('medicos');
      } else if (rawPath === '/blog') {
        setActiveTab('blog');
        setSelectedArticleSlug(undefined);
      } else if (rawPath === '/faq') {
        setActiveTab('faq');
      } else if (rawPath === '/perfil') {
        setActiveTab('perfil');
      } else if (rawPath === '/catalogo/oleos') {
        setActiveTab('catalogo-oleos');
      } else if (rawPath === '/catalogo/outros') {
        setActiveTab('catalogo-outros');
      } else {
        setActiveTab('catalogo-flores');
        setSelectedStrainId(undefined);
      }
    };

    handleLocationChange();
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  // Manipulador de troca de aba principal no menu
  const handleNavigateTab = (tab: string) => {
    setActiveTab(tab);
    setSelectedStrainId(undefined);
    setSelectedAssocId(undefined);
    setSelectedArticleSlug(undefined);

    let newUrl = '/';
    if (tab === 'catalogo-flores') newUrl = '/catalogo';
    else if (tab === 'catalogo-oleos') newUrl = '/catalogo/oleos';
    else if (tab === 'catalogo-outros') newUrl = '/catalogo/outros';
    else if (tab === 'associacoes') newUrl = '/associacoes';
    else if (tab === 'sommelier') newUrl = '/fummelier-ia';
    else if (tab === 'medicos') newUrl = '/prescritores';
    else if (tab === 'blog') newUrl = '/blog';
    else if (tab === 'faq') newUrl = '/faq';
    else if (tab === 'perfil') newUrl = '/perfil';

    window.history.pushState(null, '', newUrl);
    document.title = 'CannaGuia — Seu Guia de Cannabis Medicinal no Brasil';
  };

  // Callback de seleção de flor/produto para URL limpa e SEO
  const handleSelectStrain = (strain: Strain | null) => {
    if (strain) {
      window.history.pushState(null, '', `/strains/${strain.id}`);
      document.title = `${strain.name} — Flor Medicinal | CannaGuia`;
    } else {
      window.history.pushState(null, '', '/catalogo');
      document.title = 'CannaGuia — Seu Guia de Cannabis Medicinal no Brasil';
    }
  };

  // Callback de seleção de associação para URL limpa e SEO
  const handleSelectAssoc = (assoc: Association | null) => {
    if (assoc) {
      window.history.pushState(null, '', `/associacoes/${assoc.id}`);
      document.title = `${assoc.name} — Associação de Cannabis | CannaGuia`;
    } else {
      window.history.pushState(null, '', '/associacoes');
      document.title = 'Associações de Cannabis Medicinal no Brasil — CannaGuia';
    }
  };

  // Callback de seleção de artigo para URL limpa e SEO
  const handleSelectPost = (post: BlogPost | null) => {
    if (post) {
      window.history.pushState(null, '', `/blog/${post.slug}`);
      document.title = `${post.title} | CannaGuia`;
    } else {
      window.history.pushState(null, '', '/blog');
      document.title = 'Guia do Paciente & Artigos — CannaGuia';
    }
  };

  const handleOpenBlogArticle = (articleId: string) => {
    setActiveTab('blog');
    setSelectedArticleSlug('como-se-associar-associacao-cannabis-medicinal-brasil');
    window.history.pushState(null, '', '/blog/como-se-associar-associacao-cannabis-medicinal-brasil');
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col font-sans">
      <Header 
        activeTab={activeTab} 
        setActiveTab={handleNavigateTab} 
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'catalogo-flores' && (
          <Catalog 
            currentCategory="flores" 
            initialStrainId={selectedStrainId}
            onSelectStrain={handleSelectStrain}
          />
        )}
        {activeTab === 'catalogo-oleos' && (
          <Catalog 
            currentCategory="oleos" 
            initialStrainId={selectedStrainId}
            onSelectStrain={handleSelectStrain}
          />
        )}
        {activeTab === 'catalogo-outros' && (
          <Catalog 
            currentCategory="outros" 
            initialStrainId={selectedStrainId}
            onSelectStrain={handleSelectStrain}
          />
        )}
        
        <Suspense fallback={<TabLoadingFallback />}>
          {activeTab === 'associacoes' && (
            <Associations 
              setActiveTab={handleNavigateTab} 
              openBlogArticle={handleOpenBlogArticle}
              initialAssocId={selectedAssocId}
              onSelectAssoc={handleSelectAssoc}
            />
          )}
          {activeTab === 'sommelier' && <AiSommelier />}
          {activeTab === 'medicos' && <Doctors />}
          {activeTab === 'blog' && (
            <Blog 
              initialPostSlug={selectedArticleSlug} 
              onSelectPost={handleSelectPost}
            />
          )}
          {activeTab === 'blog-como-se-associar' && (
            <Blog 
              initialPostId="4" 
              onSelectPost={handleSelectPost}
            />
          )}
          {activeTab === 'faq' && <FAQ />}
          {activeTab === 'perfil' && <MyProfile />}
        </Suspense>
      </main>

      {/* Rodapé com Disclaimer Legal, Contato e LGPD */}
      <footer className="bg-white border-t border-gray-200 py-8 text-center text-xs text-gray-500 space-y-2">
        <p className="font-semibold text-gray-700">
          CannaGuia — Guia Informativo e Terapêutico de Cannabis Medicinal no Brasil.
        </p>
        <p className="max-w-2xl mx-auto text-[11px] text-gray-400 px-4 leading-relaxed">
          ⚖️ <strong>Aviso Legal:</strong> O CannaGuia é uma plataforma informativa e educativa. Não comercializamos, não intermediamos vendas e não fabricamos medicamentos. O uso de produtos à base de Cannabis Medicinal exige obrigatoriamente prescrição médica válida.
        </p>
        <div className="pt-2 flex items-center justify-center gap-3 sm:gap-4 flex-wrap text-[11px]">
          <a
            href="mailto:contato@cannaguia.com.br"
            className="text-emerald-900 font-bold hover:underline flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-200 shadow-xs transition-all"
          >
            📩 Contato: contato@cannaguia.com.br
          </a>
          <span className="text-gray-300">•</span>
          <a
            href="https://www.instagram.com/cannaguia.br"
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-900 font-bold hover:underline flex items-center gap-1.5 bg-pink-50 hover:bg-pink-100 px-3 py-1.5 rounded-xl border border-pink-200 shadow-xs transition-all"
          >
            📸 Instagram: @cannaguia.br
          </a>
          <span className="text-gray-300">•</span>
          <button
            onClick={() => setIsTermsOpen(true)}
            className="text-emerald-700 font-bold hover:underline"
          >
            Termos de Uso & LGPD
          </button>
        </div>
      </footer>

      {/* Modais Lazy Loaded com Suspense */}
      <Suspense fallback={null}>
        {isTermsOpen && (
          <TermsModal
            isOpen={isTermsOpen}
            onClose={() => setIsTermsOpen(false)}
          />
        )}

        {isContactOpen && (
          <ContactModal
            isOpen={isContactOpen}
            onClose={() => setIsContactOpen(false)}
            title="Fale Conosco — CannaGuia"
            subtitle="Envie suas dúvidas, sugestões ou pedido de cadastro. Retornaremos via e-mail."
            defaultType="general"
          />
        )}

        {isAuthOpen && (
          <AuthModal
            isOpen={isAuthOpen}
            onClose={() => setIsAuthOpen(false)}
          />
        )}
      </Suspense>

      {/* Banner Flutuante de Instalação PWA no Celular */}
      <PwaInstallBanner />
    </div>
  );
}

export default App;
