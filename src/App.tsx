import { useState } from 'react';
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
import { PwaInstallBanner } from './components/PwaInstallBanner';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('catalogo-flores');
  const [isTermsOpen, setIsTermsOpen] = useState<boolean>(false);
  const [isContactOpen, setIsContactOpen] = useState<boolean>(false);
  const [blogArticleId, setBlogArticleId] = useState<string | undefined>(undefined);

  const handleOpenBlogArticle = (articleId: string) => {
    setBlogArticleId(articleId);
    setActiveTab('blog');
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col font-sans">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'catalogo-flores' && <Catalog currentCategory="flores" />}
        {activeTab === 'catalogo-oleos' && <Catalog currentCategory="oleos" />}
        {activeTab === 'catalogo-outros' && <Catalog currentCategory="outros" />}
        {activeTab === 'associacoes' && (
          <Associations 
            setActiveTab={setActiveTab} 
            openBlogArticle={handleOpenBlogArticle} 
          />
        )}
        {activeTab === 'sommelier' && <AiSommelier />}
        {activeTab === 'medicos' && <Doctors />}
        {activeTab === 'blog' && <Blog initialPostId={blogArticleId} />}
        {activeTab === 'blog-como-se-associar' && <Blog initialPostId="4" />}
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
        <div className="pt-2 flex items-center justify-center gap-4 flex-wrap">
          <button
            onClick={() => setIsContactOpen(true)}
            className="text-emerald-700 font-bold hover:underline text-[11px]"
          >
            📩 Fale Conosco
          </button>
          <span className="text-gray-300">•</span>
          <button
            onClick={() => setIsTermsOpen(true)}
            className="text-emerald-700 font-bold hover:underline text-[11px]"
          >
            Termos de Uso & Política de Privacidade (LGPD)
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

      {/* Banner Flutuante de Instalação PWA no Celular */}
      <PwaInstallBanner />
    </div>
  );
}

export default App;
