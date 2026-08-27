import { useState } from 'react';
import { Header } from './components/Header';
import { Catalog } from './components/Catalog';
import { Associations } from './components/Associations';
import { AiSommelier } from './components/AiSommelier';
import { Doctors } from './components/Doctors';
import { Blog } from './components/Blog';
import { MyProfile } from './components/MyProfile';
import { TermsModal } from './components/TermsModal';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('catalogo-flores');
  const [isTermsOpen, setIsTermsOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col font-sans">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'catalogo-flores' && <Catalog currentCategory="flores" />}
        {activeTab === 'catalogo-oleos' && <Catalog currentCategory="oleos" />}
        {activeTab === 'catalogo-outros' && <Catalog currentCategory="outros" />}
        {activeTab === 'associacoes' && <Associations setActiveTab={setActiveTab} />}
        {activeTab === 'sommelier' && <AiSommelier />}
        {activeTab === 'medicos' && <Doctors />}
        {activeTab === 'blog' && <Blog />}
        {activeTab === 'perfil' && <MyProfile />}
      </main>

      {/* Rodapé com Disclaimer Legal e LGPD */}
      <footer className="bg-white border-t border-gray-200 py-8 text-center text-xs text-gray-500 space-y-2">
        <p className="font-semibold text-gray-700">
          CannaGuia — Guia Informativo e Terapêutico de Cannabis Medicinal no Brasil.
        </p>
        <p className="max-w-2xl mx-auto text-[11px] text-gray-400 px-4 leading-relaxed">
          ⚖️ <strong>Aviso Legal:</strong> O CannaGuia é uma plataforma informativa e educativa. Não comercializamos, não intermediamos vendas e não fabricamos medicamentos. O uso de produtos à base de Cannabis Medicinal exige obrigatoriamente prescrição médica válida.
        </p>
        <div className="pt-2">
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
    </div>
  );
}

export default App;
