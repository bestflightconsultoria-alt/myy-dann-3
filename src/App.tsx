import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Catalog } from './components/Catalog';
import { Associations } from './components/Associations';
import { AiSommelier } from './components/AiSommelier';
import { Doctors } from './components/Doctors';
import { Blog } from './components/Blog';
import { FAQ } from './components/FAQ';
import { MyProfile } from './components/MyProfile';
import { TermsModal } from './components/TermsModal';
import { ContactModal } from './components/ContactModal';
import { AuthModal } from './components/AuthModal';
import { PwaInstallBanner } from './components/PwaInstallBanner';
import { Strain } from './types/strain';
import { Association } from './hooks/useAssociations';
import { BlogPost } from './types/blog';

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
    } else if (rawPath === '/sommelier' || rawPath === '/fummelier-ia' || rawPath === '/ia') {
      setActiveTab('sommelier');
    } else if (rawPath === '/medicos' || rawPath === '/prescritores') {
      setActiveTab('medicos');
    } else if (rawPath === '/blog') {
      setActiveTab('blog');
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
    }
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
          <button
            onClick={() => setIsTermsOpen(true)}
            className="text-emerald-700 font-bold hover:underline"
          >
            Termos de Uso & LGPD
          </button>
        </div>
      </footer>

      {/* Modal de Termos de Uso e LGPD */}
      <TermsModal
        isOpen={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
      />

      {/* Modal de Mensagem / Contato Geral */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        title="Fale Conosco — CannaGuia"
        subtitle="Envie suas dúvidas, sugestões ou pedido de cadastro. Retornaremos via e-mail."
        defaultType="general"
      />

      {/* Modal de Autenticação Dual (Google + Email/Senha) */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      {/* Banner Flutuante de Instalação PWA no Celular */}
      <PwaInstallBanner />
    </div>
  );
}

export default App;
