import React from 'react';
import { ShieldCheck, ChevronRight, Star, Tag } from 'lucide-react';
import { Strain } from '../types/strain';

interface StrainCardProps {
  strain: Strain;
  ratingStats?: { avgRating: number; count: number };
  onClick: () => void;
}

export const StrainCard: React.FC<StrainCardProps> = ({ strain, ratingStats, onClick }) => {
  const displayBadge = () => {
    if (strain.category === 'oleos') {
      return { text: 'Óleo Terapêutico', bg: 'bg-amber-100 text-amber-900 border-amber-200' };
    }
    if (strain.category === 'outros') {
      if (strain.type === 'Pomadas' || strain.name.toLowerCase().includes('pomada')) {
        return { text: 'Pomada Medicinal', bg: 'bg-teal-100 text-teal-900 border-teal-200' };
      }
      if (strain.type === 'Concentrados' || strain.name.toLowerCase().includes('hash')) {
        return { text: 'Hash / Concentrado', bg: 'bg-orange-100 text-orange-900 border-orange-200' };
      }
      return { text: 'Gummies', bg: 'bg-pink-100 text-pink-900 border-pink-200' };
    }
    if (strain.dominantCannabinoid === 'THC/CBD') {
      return { text: 'THC / CBD (1:1)', bg: 'bg-purple-100 text-purple-800 border-purple-200' };
    }
    if (strain.dominantCannabinoid === 'CBD') {
      return { text: 'CBD', bg: 'bg-blue-100 text-blue-800 border-blue-200' };
    }
    return { text: strain.type, bg: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
  };

  const badge = displayBadge();

  // Pega o menor preço ou preço inicial
  const getPriceBadge = () => {
    if (!strain.associations || strain.associations.length === 0) return null;
    const firstWithPrice = strain.associations.find(a => a.unitPrice);
    if (firstWithPrice) return firstWithPrice.unitPrice;
    return strain.associations[0].priceDetail;
  };

  const mainPrice = getPriceBadge();

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
        {/* Topo com badge limpa e nota média */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`px-2.5 py-0.5 text-xs font-bold rounded-md border ${badge.bg}`}>
            {badge.text}
          </span>
          
          {ratingStats && ratingStats.count > 0 ? (
            <span className="flex items-center gap-1 text-[11px] font-extrabold bg-amber-100/90 text-amber-900 px-2 py-0.5 rounded-full border border-amber-200">
              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
              <span>{ratingStats.avgRating}</span>
              <span className="text-amber-800/80 font-medium">({ratingStats.count})</span>
            </span>
          ) : mainPrice ? (
            <span className="text-[11px] font-black text-emerald-900 bg-emerald-100/90 px-2.5 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
              <Tag className="w-3 h-3 text-emerald-700" />
              {mainPrice}
            </span>
          ) : null}
        </div>

        {/* Nome do Produto */}
        <h3 className="text-lg font-bold text-gray-900 group-hover:text-emerald-700 transition-colors leading-snug">
          {strain.name}
        </h3>

        {/* Canabinoides ou Concentração */}
        <div className="flex items-center gap-3 text-xs text-gray-500 mt-1.5">
          {strain.thc && <span><strong className="text-gray-700">THC:</strong> {strain.thc}</span>}
          {strain.cbd && <span><strong className="text-gray-700">CBD:</strong> {strain.cbd}</span>}
          {strain.concentration && <span className="truncate max-w-[200px]">{strain.concentration}</span>}
        </div>

        {/* Efeitos Terapêuticos */}
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

      {/* Rodapé do Card com Valores Nítidos */}
      <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 text-xs text-gray-600 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="truncate max-w-[120px] sm:max-w-[140px]">
            {renderAssociationsLabel()}
          </span>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          className="px-3.5 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-100/80 group-hover:bg-emerald-600 group-hover:text-white rounded-xl border border-emerald-200 transition-all shadow-xs flex items-center gap-1 shrink-0"
        >
          <span>Ver Detalhes & Preços</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default StrainCard;
