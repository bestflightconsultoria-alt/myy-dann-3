import React from 'react';
import { ShieldCheck, ChevronRight } from 'lucide-react';
import { Strain } from '../types/strain';

interface StrainCardProps {
  strain: Strain;
  onClick: () => void;
}

export const StrainCard: React.FC<StrainCardProps> = ({ strain, onClick }) => {
  // Define apenas uma etiqueta principal limpa para o topo
  const displayBadge = () => {
    if (strain.dominantCannabinoid === 'THC/CBD') {
      return { text: 'THC / CBD', bg: 'bg-purple-100 text-purple-800 border-purple-200' };
    }
    if (strain.dominantCannabinoid === 'CBD') {
      return { text: 'CBD', bg: 'bg-blue-100 text-blue-800 border-blue-200' };
    }
    if (strain.category === 'oleos') {
      return { text: 'Óleo', bg: 'bg-amber-100 text-amber-800 border-amber-200' };
    }
    if (strain.category === 'outros') {
      return { text: 'Gummies', bg: 'bg-pink-100 text-pink-800 border-pink-200' };
    }
    return { text: strain.type, bg: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
  };

  const badge = displayBadge();

  // Rótulo dinâmico de associações disponíveis
  const renderAssociationsLabel = () => {
    const count = strain.associations?.length || 0;
    if (count === 0) return 'Consulte disponibilidade';
    if (count === 1) return strain.associations[0].associationName;
    return `Disponível em ${count} associações`;
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl border border-gray-200/90 p-5 hover:shadow-xl hover:border-emerald-500/60 transition-all cursor-pointer flex flex-col justify-between group hover:-translate-y-0.5 duration-200"
    >
      <div>
        {/* Topo com badge limpa */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`px-2.5 py-0.5 text-xs font-bold rounded-md border ${badge.bg}`}>
            {badge.text}
          </span>
          {strain.associations?.length > 1 && (
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              {strain.associations.length} opções
            </span>
          )}
        </div>

        {/* Nome da Strain / Produto */}
        <h3 className="text-lg font-bold text-gray-900 group-hover:text-emerald-700 transition-colors leading-snug">
          {strain.name}
        </h3>

        {/* Canabinoides THC / CBD */}
        <div className="flex items-center gap-3 text-xs text-gray-500 mt-1.5">
          {strain.thc && <span><strong className="text-gray-700">THC:</strong> {strain.thc}</span>}
          {strain.cbd && <span><strong className="text-gray-700">CBD:</strong> {strain.cbd}</span>}
          {strain.concentration && <span className="truncate max-w-[200px]">{strain.concentration}</span>}
        </div>

        {/* Efeitos Principais Terapêuticos */}
        {strain.effects && strain.effects.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3.5">
            {strain.effects.slice(0, 3).map((effect, idx) => (
              <span
                key={idx}
                className="text-[11px] font-medium bg-gray-100/90 text-gray-700 px-2.5 py-1 rounded-md"
              >
                {effect}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Rodapé do Card */}
      <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs text-gray-600 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="truncate max-w-[130px] sm:max-w-[150px]">
            {renderAssociationsLabel()}
          </span>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          className="px-3.5 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 group-hover:bg-emerald-600 group-hover:text-white rounded-xl border border-emerald-200/80 transition-all shadow-sm flex items-center gap-1"
        >
          <span>Ver Preços</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default StrainCard;
