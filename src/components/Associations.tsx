import React, { useState, useMemo } from 'react';
import { Search, MapPin, Building2, Star, DollarSign, ArrowUpDown, BookOpen, UserPlus, Sprout, ArrowRight } from 'lucide-react';
import { useAssociations, Association } from '../hooks/useAssociations';
import { useStrains } from '../hooks/useStrains';
import { AssociationModal } from './AssociationModal';

interface AssociationsProps {
  setActiveTab?: (tab: string) => void;
}

export const Associations: React.FC<AssociationsProps> = ({ setActiveTab }) => {
  const { associations, loading } = useAssociations();
  const { strains } = useStrains();

  const [search, setSearch] = useState('');
  const [selectedState, setSelectedState] = useState('ALL');
  const [sortBy, setSortBy] = useState<'rating' | 'reviews' | 'name'>('rating');
  const [selectedAssociation, setSelectedAssociation] = useState<Association | null>(null);

  // Mapeia quantidade de produtos/strains cadastradas por associação
  const productCountMap = useMemo(() => {
    const map: { [assocId: string]: number } = {};
    strains.forEach(strain => {
      if (strain.associations && strain.associations.length > 0) {
        strain.associations.forEach(assocOffer => {
          const id = assocOffer.associationId.toLowerCase();
          map[id] = (map[id] || 0) + 1;
        });
      }
    });
    return map;
  }, [strains]);

  const availableStates = useMemo(() => {
    const states = Array.from(new Set(associations.map((a) => a.state))).filter(Boolean);
    return ['ALL', ...states.sort()];
  }, [associations]);

  const filteredAssociations = useMemo(() => {
    let result = associations.filter((assoc) => {
      const matchesState = selectedState === 'ALL' || assoc.state === selectedState;
      const searchLower = search.toLowerCase();
      const matchesSearch =
        search === '' ||
        assoc.name.toLowerCase().includes(searchLower) ||
        assoc.acronym.toLowerCase().includes(searchLower) ||
        assoc.city.toLowerCase().includes(searchLower) ||
        assoc.state.toLowerCase().includes(searchLower);

      return matchesState && matchesSearch;
    });

    result.sort((a, b) => {
      if (sortBy === 'rating') {
        const ratingA = a.rating || 0;
        const ratingB = b.rating || 0;
        if (ratingB !== ratingA) return ratingB - ratingA;
        return (b.reviewCount || 0) - (a.reviewCount || 0);
      }
      if (sortBy === 'reviews') {
        return (b.reviewCount || 0) - (a.reviewCount || 0);
      }
      return a.name.localeCompare(b.name);
    });

    return result;
  }, [associations, selectedState, search, sortBy]);

  return (
    <div className="space-y-6">
      
      {/* Banner Principal + Link para o Guia do Blog */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-semibold backdrop-blur-md">
            <Building2 className="w-3.5 h-3.5 text-emerald-300" />
            <span>Diretório Oficial de Entidades Dispensadoras</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
            Associações & Entidades de Pacientes
          </h1>

          <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed">
            Consulte taxas de anuidade, localização e cardápio de genéticas das associações sem fins lucrativos autorizadas no Brasil.
          </p>
        </div>

        {/* Card Destaque: Guia de Como se Associar */}
        <div className="relative z-10 shrink-0 w-full md:w-auto bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-center space-y-2.5">
          <span className="text-xs font-extrabold text-emerald-200 block uppercase tracking-wider">Dúvidas sobre como se associar?</span>
          <p className="text-xs text-emerald-100 max-w-xs mx-auto">
            Confira os 4 passos legais para obter laudo e se filiar.
          </p>
          <button
            onClick={() => setActiveTab && setActiveTab('blog')}
            className="w-full py-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            <span>Ler Guia Passo a Passo</span>
          </button>
        </div>
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        
        {/* Campo de Busca */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome, sigla ou cidade..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          />
        </div>

        {/* Ordenação Dropdown */}
        <div className="relative w-full sm:w-auto">
          <select
            value={sortBy}
            onChange={(e: any) => setSortBy(e.target.value)}
            className="w-full sm:w-auto pl-8 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 outline-none focus:border-emerald-500 shadow-xs cursor-pointer"
          >
            <option value="rating">⭐ Mais Relevantes (Maior Nota)</option>
            <option value="reviews">💬 Mais Avaliados</option>
            <option value="name">🔤 Ordem Alfabética (A-Z)</option>
          </select>
          <ArrowUpDown className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Filtro por Estado */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {availableStates.map((state) => (
          <button
            key={state}
            onClick={() => setSelectedState(state)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedState === state
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {state === 'ALL' ? 'Todos os Estados' : state}
          </button>
        ))}
      </div>

      {/* Grid de Associações */}
      {loading ? (
        <div className="py-12 text-center text-gray-500 text-sm">Carregando associações...</div>
      ) : filteredAssociations.length === 0 ? (
        <div className="py-12 text-center bg-white rounded-2xl border border-dashed border-gray-300 p-8 text-gray-500 text-sm">
          Nenhuma associação encontrada para este filtro.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredAssociations.map((assoc) => {
            const countProducts = productCountMap[assoc.id.toLowerCase()] || 0;
            return (
              <div
                key={assoc.id}
                onClick={() => setSelectedAssociation(assoc)}
                className="bg-white rounded-3xl border border-gray-200/90 p-5 hover:shadow-lg hover:border-emerald-500/60 transition-all cursor-pointer flex flex-col justify-between group space-y-4"
              >
                <div>
                  {/* Topo do Card com Cidade e Nota */}
                  <div className="flex items-start justify-between gap-2 mb-2.5">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-100">
                      <MapPin className="w-3 h-3 text-emerald-600" />
                      {assoc.city} / {assoc.state}
                    </span>

                    {assoc.rating && assoc.rating > 0 ? (
                      <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span className="text-xs font-bold text-gray-800">
                          {assoc.rating.toFixed(1)}
                        </span>
                        {assoc.reviewCount ? (
                          <span className="text-[10px] text-gray-400">({assoc.reviewCount})</span>
                        ) : null}
                      </div>
                    ) : (
                      <span className="text-[10px] font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded">
                        Sem avaliações
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-black text-gray-900 group-hover:text-emerald-700 transition-colors">
                    {assoc.name}
                  </h3>

                  {/* ITEM 1: Badge de Total de Produtos no Catálogo */}
                  <div className="mt-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-900 bg-emerald-100/90 px-2.5 py-1 rounded-xl border border-emerald-200">
                      <Sprout className="w-3.5 h-3.5 text-emerald-700" />
                      {countProducts > 0 ? `${countProducts} produtos no catálogo` : 'Consulte cardápio'}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                  <span className="flex items-center gap-1 font-semibold text-emerald-800">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                    {assoc.membershipFee || "Sem taxa"}
                  </span>

                  <span className="font-bold text-emerald-600 group-hover:underline flex items-center gap-1">
                    Ver cardápio <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ITEM 3: Banner no Rodapé para Cadastro de Novas Associações */}
      <div className="bg-gradient-to-br from-slate-900 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold">
            <Building2 className="w-3.5 h-3.5" />
            <span>Para Representantes & Diretores</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Representa uma Associação de Pacientes?
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/80 max-w-xl">
            Cadastre sua entidade gratuitamente no CannaGuia e apresente seu cardápio regulamentado para milhares de pacientes e médicos prescritores.
          </p>
        </div>

        <a
          href="https://wa.me/5511999999999?text=Ola!%20Represento%20uma%20associacao%20de%20pacientes%20e%20gostaria%20de%20cadastrar%20nossa%20entidade%20no%20CannaGuia."
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black text-xs sm:text-sm rounded-2xl shadow-lg transition-all flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          <span>Cadastrar Minha Associação</span>
        </a>
      </div>

      <AssociationModal
        association={selectedAssociation}
        onClose={() => setSelectedAssociation(null)}
      />
    </div>
  );
};

export default Associations;
