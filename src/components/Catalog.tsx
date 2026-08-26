import React, { useState, useMemo } from 'react';
import { Search, Filter, ShieldCheck, Sparkles } from 'lucide-react';
import { StrainCard } from './StrainCard';
import { StrainModal } from './StrainModal';
import { Strain, ProductCategory } from '../types/strain';
import { useStrains } from '../hooks/useStrains';

interface CatalogProps {
  currentCategory?: ProductCategory;
}

export const Catalog: React.FC<CatalogProps> = ({ currentCategory = 'flores' }) => {
  const { strains, loading } = useStrains();
  const [search, setSearch] = useState('');
  const [selectedSubFilter, setSelectedSubFilter] = useState('ALL');
  const [selectedStrain, setSelectedStrain] = useState<Strain | null>(null);

  // Lista de filtros para flores
  const flowerFilters = ['ALL', 'Híbrida', 'Indica', 'Sativa', 'THC', 'CBD', 'THC/CBD'];

  const filteredStrains = useMemo(() => {
    return strains.filter((strain) => {
      // 1. Filtro por Categoria Principal
      const matchCategory = currentCategory ? strain.category === currentCategory : true;

      // 2. Filtro Secundário em Flores
      let matchSubFilter = true;
      if (currentCategory === 'flores' && selectedSubFilter !== 'ALL') {
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
  }, [strains, currentCategory, selectedSubFilter, search]);

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
      
      {/* Banner Principal - CannaGuia: Seu Guia de Cannabis Medicinal */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span>CannaGuia — Seu Guia de Cannabis Medicinal</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
            {titles[currentCategory].title}
          </h1>

          <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed">
            {titles[currentCategory].subtitle}
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

      {/* Topo de Busca e Filtros */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <div>
          <h2 className="text-lg font-bold text-gray-900">
            Exibindo {filteredStrains.length} produtos medicinais
          </h2>
          <p className="text-xs text-gray-500">
            Use os filtros abaixo ou digite o efeito desejado (ex: insônia, ansiedade, dor).
          </p>
        </div>

        {/* Campo de Busca */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome, aroma ou efeito..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Filtros em Pílula (Exclusivos para Flores) */}
      {currentCategory === 'flores' && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1">
          <span className="text-xs font-bold text-gray-500 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5 text-emerald-600" /> Filtrar por:
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

      {/* Grid de Itens */}
      {loading ? (
        <div className="py-12 text-center text-gray-500 text-sm">Carregando catálogo...</div>
      ) : filteredStrains.length === 0 ? (
        <div className="py-12 text-center bg-white rounded-2xl border border-dashed border-gray-300 p-8 text-gray-500 text-sm">
          Nenhum produto encontrado para o filtro selecionado.
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
