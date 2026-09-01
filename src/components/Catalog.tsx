import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, Sparkles, Flower2, Droplets, Package, X } from 'lucide-react';
import { StrainCard } from './StrainCard';
import { StrainModal } from './StrainModal';
import { Strain, ProductCategory } from '../types/strain';
import { useStrains } from '../hooks/useStrains';
import { supabase } from '../lib/supabase';

interface CatalogProps {
  currentCategory?: ProductCategory;
  initialStrainId?: string;
  onSelectStrain?: (strain: Strain | null) => void;
}

interface CommunityReviewStats {
  [strainId: string]: {
    avgRating: number;
    count: number;
    hasVerifiedReview?: boolean;
  };
}

export const Catalog: React.FC<CatalogProps> = ({ 
  currentCategory: initialCategory = 'flores',
  initialStrainId,
  onSelectStrain
}) => {
  const { strains, loading } = useStrains();
  const [activeCategory, setActiveCategory] = useState<ProductCategory>(initialCategory);
  const [search, setSearch] = useState('');
  const [selectedSubFilter, setSelectedSubFilter] = useState('ALL');
  const [selectedStrain, setSelectedStrain] = useState<Strain | null>(null);
  const [communityStats, setCommunityStats] = useState<CommunityReviewStats>({});

  // Abre strain inicial vinda da URL se presente
  useEffect(() => {
    if (initialStrainId && strains.length > 0) {
      const found = strains.find(s => s.id === initialStrainId || s.id.toLowerCase() === initialStrainId.toLowerCase());
      if (found) {
        setSelectedStrain(found);
      }
    }
  }, [initialStrainId, strains]);

  // Lista Unificada de Filtro & Ordenação Inteligente em Pílulas
  const unifiedFilters = [
    { id: 'ALL', label: 'Todas as Flores' },
    { id: 'RECOMENDADOS', label: '🔥 Mais Recomendadas' },
    { id: 'NAME_ASC', label: '🔤 Nome (A - Z)' },
    { id: 'THC_DESC', label: '🌿 Maior THC' },
    { id: 'CBD_DESC', label: '💧 Maior CBD' },
    { id: 'Híbrida', label: '🟣 Híbrida' },
    { id: 'Indica', label: '🔵 Indica' },
    { id: 'Sativa', label: '🟢 Sativa' }
  ];

const MOCK_COMMUNITY_STATS: CommunityReviewStats = {
  'strain-gorila-freak': { avgRating: 4.7, count: 3, hasVerifiedReview: true },
  'strain-24k-gold': { avgRating: 4.7, count: 3, hasVerifiedReview: true },
  'strain-gelato-33': { avgRating: 4.5, count: 2, hasVerifiedReview: true },
  'strain-gorila-kush': { avgRating: 4.5, count: 2, hasVerifiedReview: true }, // 2 mock + 1 Supabase = 3 relatos (4.7 avg)
  'strain-super-lemon-haze': { avgRating: 4.9, count: 2, hasVerifiedReview: true },
  'strain-zkittlez': { avgRating: 4.6, count: 2, hasVerifiedReview: true },
  'strain-sour-diesel': { avgRating: 4.8, count: 2, hasVerifiedReview: true },
  'strain-northern-lights': { avgRating: 4.7, count: 2, hasVerifiedReview: true },
  'oleo-cbd-full-3000': { avgRating: 4.9, count: 2, hasVerifiedReview: true },
};

  // Busca avaliações para exibir estrelas e contagem nos cards perfeitamente sincronizadas
  useEffect(() => {
    async function loadStats() {
      const map: CommunityReviewStats = JSON.parse(JSON.stringify(MOCK_COMMUNITY_STATS));

      if (supabase) {
        try {
          const { data, error } = await supabase.from('reviews').select('strain_id, rating, is_verified');
          if (!error && data) {
            data.forEach((r: any) => {
              const sId = r.strain_id;
              if (map[sId]) {
                const newCount = map[sId].count + 1;
                const newSum = (map[sId].avgRating * map[sId].count) + (r.rating || 5);
                map[sId].count = newCount;
                map[sId].avgRating = Number((newSum / newCount).toFixed(1));
              } else {
                map[sId] = {
                  avgRating: r.rating || 5,
                  count: 1,
                  hasVerifiedReview: !!r.is_verified
                };
              }
            });
          }
        } catch (e) {
          console.error('Erro ao carregar estatísticas:', e);
        }
      }

      // Garante teto máximo em 5.0
      Object.keys(map).forEach(sId => {
        if (map[sId].avgRating > 5.0) {
          map[sId].avgRating = 5.0;
        }
      });

      setCommunityStats(map);
    }
    loadStats();
  }, []);

  const categoryTabs = [
    { id: 'flores' as ProductCategory, label: 'Flores in Natura', icon: Flower2, count: strains.filter(s => s.category === 'flores').length },
    { id: 'oleos' as ProductCategory, label: 'Óleos Medicinais', icon: Droplets, count: strains.filter(s => s.category === 'oleos').length },
    { id: 'outros' as ProductCategory, label: 'Gummies & Outros', icon: Package, count: strains.filter(s => s.category === 'outros').length },
  ];

  const processedStrains = useMemo(() => {
    let result = strains.filter((strain) => {
      // 1. Categoria Principal
      const matchCategory = activeCategory ? strain.category === activeCategory : true;

      // 2. Filtro Secundário por Tipo de Planta
      let matchSubFilter = true;
      if (['Híbrida', 'Indica', 'Sativa'].includes(selectedSubFilter)) {
        matchSubFilter = strain.type === selectedSubFilter;
      }

      // 3. Busca de Texto
      const searchLower = search.toLowerCase();
      const matchSearch =
        search === '' ||
        strain.name.toLowerCase().includes(searchLower) ||
        (strain.effects && strain.effects.some((e) => e.toLowerCase().includes(searchLower))) ||
        (strain.aromaFlavor && strain.aromaFlavor.toLowerCase().includes(searchLower));

      return matchCategory && matchSubFilter && matchSearch;
    });

    // Ordenação Unificada
    const list = [...result];
    if (selectedSubFilter === 'NAME_ASC') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (selectedSubFilter === 'THC_DESC') {
      list.sort((a, b) => {
        const thcA = parseFloat(a.thc?.replace(/[^0-9.]/g, '') || '0');
        const thcB = parseFloat(b.thc?.replace(/[^0-9.]/g, '') || '0');
        return thcB - thcA;
      });
    } else if (selectedSubFilter === 'CBD_DESC') {
      list.sort((a, b) => {
        const cbdA = parseFloat(a.cbd?.replace(/[^0-9.]/g, '') || '0');
        const cbdB = parseFloat(b.cbd?.replace(/[^0-9.]/g, '') || '0');
        return cbdB - cbdA;
      });
    } else if (selectedSubFilter === 'RECOMENDADOS') {
      list.sort((a, b) => {
        const ratingA = communityStats[a.id]?.avgRating || 0;
        const ratingB = communityStats[b.id]?.avgRating || 0;
        return ratingB - ratingA;
      });
    }

    return list;
  }, [strains, activeCategory, selectedSubFilter, search, communityStats]);

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

      {/* Bar Unificada de Categoria e Busca */}
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
                  setSearch(''); // Limpa a busca ao trocar de categoria
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

        {/* Campo de Busca Rápida Único com Botão de Limpar (X) */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome, aroma ou efeito..."
            className="w-full pl-10 pr-9 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition-colors"
              title="Limpar busca"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

      </div>

      {/* Barra Única de Ordenação & Filtros em Pílulas */}
      {activeCategory === 'flores' && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5 scrollbar-none">
          <span className="text-xs font-bold text-gray-500 flex items-center gap-1 mr-1 shrink-0">
            <Filter className="w-3.5 h-3.5 text-emerald-600" /> Filtrar / Ordenar:
          </span>
          {unifiedFilters.map((f) => (
            <button
              key={f.id}
              onClick={() => {
                setSelectedSubFilter(f.id);
                if (f.id === 'ALL') {
                  setSearch(''); // Limpa a busca automaticamente ao clicar em "Todas as Flores"
                }
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedSubFilter === f.id
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-200 scale-[1.02]'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      {/* Contagem Dinâmica Real */}
      <div className="flex items-center justify-between text-xs text-gray-500 px-1">
        <span>Exibindo <strong>{processedStrains.length}</strong> produtos medicinais disponíveis</span>
        {search && (
          <button
            onClick={() => setSearch('')}
            className="text-xs text-emerald-700 font-bold hover:underline flex items-center gap-1"
          >
            Limpar busca "{search}"
          </button>
        )}
      </div>

      {/* Grid de Itens */}
      {loading ? (
        <div className="py-12 text-center text-gray-500 text-sm">Carregando catálogo...</div>
      ) : processedStrains.length === 0 ? (
        <div className="py-12 text-center bg-white rounded-2xl border border-dashed border-gray-300 p-8 text-gray-500 text-sm space-y-2">
          <p>Nenhum produto encontrado para a busca ou filtro selecionado.</p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedSubFilter('ALL');
            }}
            className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-xs hover:bg-emerald-700 transition-all"
          >
            Resetar Filtros e Exibir Todos
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {processedStrains.map((strain, idx) => (
            <StrainCard
              key={`${strain.id}-${idx}`}
              strain={strain}
              ratingStats={communityStats[strain.id]}
              onClick={() => {
                setSelectedStrain(strain);
                if (onSelectStrain) onSelectStrain(strain);
              }}
            />
          ))}
        </div>
      )}

      {/* Modal de Detalhes */}
      <StrainModal
        strain={selectedStrain}
        onClose={() => {
          setSelectedStrain(null);
          if (onSelectStrain) onSelectStrain(null);
        }}
      />
    </div>
  );
};

export default Catalog;
