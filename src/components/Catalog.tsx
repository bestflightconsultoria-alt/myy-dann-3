import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, ShieldCheck, Sparkles, Flower2, Droplets, Package, ArrowUpDown } from 'lucide-react';
import { StrainCard } from './StrainCard';
import { StrainModal } from './StrainModal';
import { Strain, ProductCategory } from '../types/strain';
import { useStrains } from '../hooks/useStrains';
import { supabase } from '../lib/supabase';

interface CatalogProps {
  currentCategory?: ProductCategory;
}

interface CommunityReviewStats {
  [strainId: string]: {
    avgRating: number;
    count: number;
    hasVerifiedReview?: boolean;
  };
}

export const Catalog: React.FC<CatalogProps> = ({ currentCategory: initialCategory = 'flores' }) => {
  const { strains, loading } = useStrains();
  const [activeCategory, setActiveCategory] = useState<ProductCategory>(initialCategory);
  const [search, setSearch] = useState('');
  const [selectedSubFilter, setSelectedSubFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('RECOMENDADOS');
  const [selectedStrain, setSelectedStrain] = useState<Strain | null>(null);
  const [communityStats, setCommunityStats] = useState<CommunityReviewStats>({});

  // Lista de subfiltros para flores
  const flowerFilters = ['ALL', '🔥 Mais Recomendadas', '🛡️ Verificados por Pacientes', 'Híbrida', 'Indica', 'Sativa', 'THC', 'CBD', 'THC/CBD'];

  // Busca avaliações reais para exibir estrelas e contagem nos cards
  useEffect(() => {
    async function loadStats() {
      if (!supabase) return;
      try {
        const { data, error } = await supabase.from('reviews').select('strain_id, rating, is_verified');
        if (!error && data) {
          const map: CommunityReviewStats = {};
          data.forEach((r: any) => {
            const sId = r.strain_id;
            if (!map[sId]) {
              map[sId] = { avgRating: 0, count: 0, hasVerifiedReview: false };
            }
            map[sId].count += 1;
            map[sId].avgRating += r.rating || 5;
            if (r.is_verified) {
              map[sId].hasVerifiedReview = true;
            }
          });

          Object.keys(map).forEach(sId => {
            map[sId].avgRating = Number((map[sId].avgRating / map[sId].count).toFixed(1));
          });

          setCommunityStats(map);
        }
      } catch (e) {
        console.error('Erro ao carregar estatísticas:', e);
      }
    }
    loadStats();
  }, []);

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
        if (selectedSubFilter === '🔥 Mais Recomendadas') {
          const stats = communityStats[strain.id];
          matchSubFilter = !!(stats && stats.count > 0 && stats.avgRating >= 4.0);
        } else if (selectedSubFilter === '🛡️ Verificados por Pacientes') {
          const stats = communityStats[strain.id];
          matchSubFilter = !!(stats && stats.hasVerifiedReview);
        } else if (['Híbrida', 'Indica', 'Sativa'].includes(selectedSubFilter)) {
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
  }, [strains, activeCategory, selectedSubFilter, search, communityStats]);

  // Ordenação Inteligente
  const sortedStrains = useMemo(() => {
    const list = [...filteredStrains];
    if (sortBy === 'NAME_ASC') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'THC_DESC') {
      list.sort((a, b) => {
        const thcA = parseFloat(a.thc?.replace(/[^0-9.]/g, '') || '0');
        const thcB = parseFloat(b.thc?.replace(/[^0-9.]/g, '') || '0');
        return thcB - thcA;
      });
    } else if (sortBy === 'CBD_DESC') {
      list.sort((a, b) => {
        const cbdA = parseFloat(a.cbd?.replace(/[^0-9.]/g, '') || '0');
        const cbdB = parseFloat(b.cbd?.replace(/[^0-9.]/g, '') || '0');
        return cbdB - cbdA;
      });
    } else {
      // RECOMENDADOS (Nota de avaliações da comunidade)
      list.sort((a, b) => {
        const ratingA = communityStats[a.id]?.avgRating || 0;
        const ratingB = communityStats[b.id]?.avgRating || 0;
        return ratingB - ratingA;
      });
    }
    return list;
  }, [filteredStrains, sortBy, communityStats]);

  return (
    <div className="space-y-6">
      
      {/* Banner Principal do Catálogo */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-semibold backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span>Guia de Genéticas & Produtos Regulamentados</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
            Flores Medicinais e Inflorescências
          </h1>

          <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed">
            Perfis de terpenos, linhagens genéticas e preços comparados entre associações de cannabis no Brasil.
          </p>
        </div>
      </div>

      {/* Navegação por Categorias + Ordenação + Busca */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        
        {/* Tabs de Categoria (Flores, Óleos, Outros) */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none">
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
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isTabActive
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-200'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
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

        {/* Busca e Ordenação Rápida */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Ordenação */}
          <div className="relative shrink-0">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="pl-3 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 appearance-none cursor-pointer"
            >
              <option value="RECOMENDADOS">🔥 Mais Recomendados</option>
              <option value="NAME_ASC">🔤 Nome (A - Z)</option>
              <option value="THC_DESC">🌿 Maior Teor de THC</option>
              <option value="CBD_DESC">💧 Maior Teor de CBD</option>
            </select>
            <ArrowUpDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Campo de Busca Rápida */}
          <div className="relative w-full sm:w-64">
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

      {/* Contagem Dinâmica Real */}
      <div className="flex items-center justify-between text-xs text-gray-500 px-1">
        <span>Exibindo <strong>{sortedStrains.length}</strong> produtos medicinais disponíveis</span>
      </div>

      {/* Grid de Itens */}
      {loading ? (
        <div className="py-12 text-center text-gray-500 text-sm">Carregando catálogo...</div>
      ) : sortedStrains.length === 0 ? (
        <div className="py-12 text-center bg-white rounded-2xl border border-dashed border-gray-300 p-8 text-gray-500 text-sm">
          Nenhum produto encontrado para a categoria ou filtro selecionado.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedStrains.map((strain, idx) => (
            <StrainCard
              key={`${strain.id}-${idx}`}
              strain={strain}
              ratingStats={communityStats[strain.id]}
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
