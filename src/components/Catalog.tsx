import React, { useState, useMemo } from 'react';
import { Search, Filter, ShieldCheck, Sparkles, Flower2, Droplets, Package } from 'lucide-react';
import { StrainCard } from './StrainCard';
import { StrainModal } from './StrainModal';
import { Strain, ProductCategory } from '../types/strain';
import { useStrains } from '../hooks/useStrains';

interface CatalogProps {
  currentCategory?: ProductCategory;
}

export const Catalog: React.FC<CatalogProps> = ({ currentCategory: initialCategory = 'flores' }) => {
  const { strains, loading } = useStrains();
  const [activeCategory, setActiveCategory] = useState<ProductCategory>(initialCategory);
  const [search, setSearch] = useState('');
  const [selectedSubFilter, setSelectedSubFilter] = useState('ALL');
  const [selectedStrain, setSelectedStrain] = useState<Strain | null>(null);

  // Lista de subfiltros para flores
  const flowerFilters = ['ALL', 'Híbrida', 'Indica', 'Sativa', 'THC', 'CBD', 'THC/CBD'];

  const categoryTabs = [
    { id: 'flores' as ProductCategory, label: 'Flores in Natura', icon: Flower2, count: strains.filter(s => s.category === 'flores').length },
    { id: 'oleos' as ProductCategory, label: 'Óleos Medicinais', icon: Droplets, count: strains.filter(s => s.category === 'oleos').length },
    { id: 'outros' as ProductCategory, label: 'Gummies & Outros', icon: Package, count: strains.filter(s => s.category === 'outros').length },
  ];

  const filteredStrains = useMemo(() => {
    return strains.filter((strain) => {
      // 1. Filtro por Categoria Principal (Flores, Óleos, Outros)
      const matchCategory = activeCategory ? strain.category === activeCategory : true;

      // 2. Filtro Secundário em Flores
      let matchSubFilter = true;
      if (activeCategory === 'flores' && selectedSubFilter !== 'ALL') {
        if (['Híbrida', 'Indica', 'Sativa'].includes(selectedSubFilter)) {
          matchSubFilter = strain.type === selectedSubFilter;
        } else if (['THC', 'CBD', 'THC/CBD'].includes(selectedSubFilter)) {
          matchSubFilter = strain.dominantCannabinoid === selectedSubFilter;
        }
      }

      // 3. Busca de Texto
      const searchLower = search.toLowerCase();
      const matchSearch =
        search === '' ||
        strain.name.toLowerCase().includes(searchLower) ||
        strain.effects.some((e) => e.toLowerCase().includes(searchLower)) ||
        (strain.aromaFlavor && strain.aromaFlavor.toLowerCase().includes(searchLower));

      return matchCategory && matchSubFilter && matchSearch;
    });
  }, [strains, activeCategory, selectedSubFilter, search]);

  const titles: Record<ProductCategory, { title: string; subtitle: string }> = {
    flores: {
      title: "Flores Medicinais e Inflorescências",
      subtitle: "Perfis de terpenos, linhagens genéticas e preços comparados entre associações do Brasil."
    },
    oleos: {
      title: "Óleos Terapêuticos e Extratos",
      subtitle: "Formulações Full Spectrum, Isolados e proporções balanceadas de CBD e THC."
    },
    outros: {
      title: "Gummies, Pomadas e Concentrados",
      subtitle: "Formatos alternativos com dosagens padronizadas, conveniência e praticidade."
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Banner Principal CannaGuia */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span>CannaGuia — Seu Guia de Cannabis Medicinal</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
            {titles[activeCategory].title}
          </h1>

          <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed">
            {titles[activeCategory].subtitle}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-medium text-emerald-200/80">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Associações Regulamentadas
            </span>
            <span className="flex items-center gap-1.5">
              🌿 Dados Terapêuticos Verificados
            </span>
          </div>
        </div>
      </div>

      {/* Seletor de Categoria Principal (Flores / Óleos / Gummies) */}
      <div className="bg-white p-2 rounded-2xl border border-gray-200 shadow-sm flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {categoryTabs.map((tab) => {
            const Icon = tab.icon;
            const isTabActive = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveCategory(tab.id);
                  setSelectedSubFilter('ALL');
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                  isTabActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                    : 'bg-gray-50 hover:bg-emerald-50/60 text-gray-600 hover:text-emerald-700 border border-gray-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isTabActive ? 'text-white' : 'text-emerald-600'}`} />
                <span>{tab.label}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                  isTabActive ? 'bg-emerald-700/60 text-white' : 'bg-gray-200 text-gray-700'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Campo de Busca Rápida */}
        <div className="relative w-full sm:w-72 mt-2 sm:mt-0">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome, aroma ou efeito..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          />
        </div>
      </div>

      {/* Subfiltros em Pílula (Exclusivos para a Categoria Flores) */}
      {activeCategory === 'flores' && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1">
          <span className="text-xs font-bold text-gray-500 flex items-center gap-1 mr-1 shrink-0">
            <Filter className="w-3.5 h-3.5 text-emerald-600" /> Filtrar Tipo/Canabinoide:
          </span>
          {flowerFilters.map((f) => (
            <button
              key={f}
              onClick={() => setSelectedSubFilter(f)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedSubFilter === f
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-200'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
              }`}
            >
              {f === 'ALL' ? 'Todas as Flores' : f}
            </button>
          ))}
        </div>
      )}

      {/* Contagem e Status */}
      <div className="flex items-center justify-between text-xs text-gray-500 px-1">
        <span>Exibindo <strong>{filteredStrains.length}</strong> produtos medicinais disponíveis</span>
      </div>

      {/* Grid de Itens */}
      {loading ? (
        <div className="py-12 text-center text-gray-500 text-sm">Carregando catálogo...</div>
      ) : filteredStrains.length === 0 ? (
        <div className="py-12 text-center bg-white rounded-2xl border border-dashed border-gray-300 p-8 text-gray-500 text-sm">
          Nenhum produto encontrado para a categoria ou filtro selecionado.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStrains.map((strain) => (
            <StrainCard
              key={strain.id}
              strain={strain}
              onClick={() => setSelectedStrain(strain)}
            />
          ))}
        </div>
      )}

      {/* Modal de Detalhes */}
      <StrainModal
        strain={selectedStrain}
        onClose={() => setSelectedStrain(null)}
      />
    </div>
  );
};

export default Catalog;
