import { useState } from 'react';
import { Header } from './components/Header';
import { Catalog } from './components/Catalog';
import { Associations } from './components/Associations';
import { AiSommelier } from './components/AiSommelier';
import { Blog } from './components/Blog';
import { MyProfile } from './components/MyProfile';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('catalogo-flores');

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col font-sans">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'catalogo-flores' && <Catalog currentCategory="flores" />}
        {activeTab === 'catalogo-oleos' && <Catalog currentCategory="oleos" />}
        {activeTab === 'catalogo-outros' && <Catalog currentCategory="outros" />}
        {activeTab === 'associacoes' && <Associations />}
        {activeTab === 'sommelier' && <AiSommelier />}
        {activeTab === 'blog' && <Blog />}
        {activeTab === 'perfil' && <MyProfile />}
      </main>

      <footer className="bg-white border-t border-gray-200 py-6 text-center text-xs text-gray-500">
        <p>CannaGuia — Guia Informativo e Terapêutico de Cannabis Medicinal no Brasil.</p>
      </footer>
    </div>
  );
}

export default App;
