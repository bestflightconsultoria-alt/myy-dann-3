import React, { useState, useMemo } from 'react';
import { Search, MapPin, Building2, Star, DollarSign, ArrowUpDown } from 'lucide-react';
import { useAssociations, Association } from '../hooks/useAssociations';
import { AssociationModal } from './AssociationModal';

export const Associations: React.FC = () => {
  const { associations, loading } = useAssociations();
  const [search, setSearch] = useState('');
  const [selectedState, setSelectedState] = useState('ALL');
  const [sortBy, setSortBy] = useState<'rating' | 'reviews' | 'name'>('rating');
  const [selectedAssociation, setSelectedAssociation] = useState<Association | null>(null);

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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
            <Building2 className="w-8 h-8 text-emerald-600" />
            Associações & Entidades
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Diretório oficial de associações de pacientes de cannabis medicinal no Brasil.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome, sigla, cidade..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
            />
          </div>

          <div className="relative w-full sm:w-auto">
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="w-full sm:w-auto pl-8 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 outline-none focus:border-emerald-500 shadow-sm cursor-pointer"
            >
              <option value="rating">⭐ Mais Relevantes (Maior Nota)</option>
              <option value="reviews">💬 Mais Avaliados</option>
              <option value="name">🔤 Ordem Alfabética (A-Z)</option>
            </select>
            <ArrowUpDown className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto pb-2">
        {availableStates.map((state) => (
          <button
            key={state}
            onClick={() => setSelectedState(state)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedState === state
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {state === 'ALL' ? 'Todos os Estados' : state}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-12 text-center text-gray-500 text-sm">Carregando associações...</div>
      ) : filteredAssociations.length === 0 ? (
        <div className="py-12 text-center bg-white rounded-2xl border border-dashed border-gray-300 p-8 text-gray-500 text-sm">
          Nenhuma associação encontrada para este filtro.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredAssociations.map((assoc) => (
            <div
              key={assoc.id}
              onClick={() => setSelectedAssociation(assoc)}
              className="bg-white rounded-2xl border border-gray-200/90 p-5 hover:shadow-lg hover:border-emerald-500/60 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700">
                    <MapPin className="w-3 h-3" />
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

                <h3 className="text-base font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
                  {assoc.name}
                </h3>
              </div>

              <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                <span className="flex items-center gap-1 font-medium text-emerald-700">
                  <DollarSign className="w-3.5 h-3.5" />
                  {assoc.membershipFee || "Sem taxa"}
                </span>

                <span className="font-semibold text-emerald-600 group-hover:underline">
                  Ver cardápio →
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <AssociationModal
        association={selectedAssociation}
        onClose={() => setSelectedAssociation(null)}
      />
    </div>
  );
};

export default Associations;
