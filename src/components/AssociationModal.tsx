import React, { useMemo } from 'react';
import { X, Phone, CheckCircle2, DollarSign, MapPin, Tag, Globe } from 'lucide-react';
import { Association } from '../hooks/useAssociations';
import { useStrains } from '../hooks/useStrains';

interface AssociationModalProps {
  association: Association | null;
  onClose: () => void;
}

function cleanStr(text: string): string {
  return (text || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

export const AssociationModal: React.FC<AssociationModalProps> = ({ association, onClose }) => {
  const { allStrains } = useStrains();

  const linkedStrains = useMemo(() => {
    if (!association || !allStrains || !Array.isArray(allStrains)) return [];

    const assocCleanName = cleanStr(association.name);
    const assocCleanAcronym = cleanStr(association.acronym || '');
    const assocCleanId = cleanStr(association.id ? association.id.replace(/-[a-z]{2}$/, '') : '');

    return allStrains
      .map((strain) => {
        if (!strain || !strain.associations) return null;
        
        const matchedAssoc = strain.associations.find((a) => {
          if (!a) return false;
          const aCleanName = cleanStr(a.associationName || '');
          const aCleanId = cleanStr(a.associationId || '');

          return (
            (assocCleanName && aCleanName.includes(assocCleanName)) ||
            (assocCleanName && assocCleanName.includes(aCleanName)) ||
            (assocCleanAcronym && aCleanName.includes(assocCleanAcronym)) ||
            (assocCleanAcronym && assocCleanAcronym.includes(aCleanName)) ||
            (assocCleanId && aCleanId.includes(assocCleanId)) ||
            (assocCleanId && assocCleanId.includes(aCleanId))
          );
        });

        if (matchedAssoc) {
          return {
            ...strain,
            matchedPrice: matchedAssoc
          };
        }
        return null;
      })
      .filter(Boolean);
  }, [allStrains, association]);

  if (!association) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gray-50/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800">
                {association.state}
              </span>
              <span className="text-xs text-gray-500 flex items-center gap-1 font-medium">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                {association.city} / {association.state}
              </span>
            </div>
            <h2 className="text-2xl font-black text-gray-900 mt-1">{association.name}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Informações Principais */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          
          {/* Taxa e Contato */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-100">
              <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5 mb-1">
                <DollarSign className="w-4 h-4 text-emerald-600" /> Taxa de Associação
              </span>
              <p className="text-sm font-extrabold text-emerald-950">
                {association.membershipFee || "Sem taxa de associação"}
              </p>
            </div>

            <div className="p-4 bg-blue-50/70 rounded-2xl border border-blue-100">
              <span className="text-xs font-bold text-blue-800 flex items-center gap-1.5 mb-1">
                <Phone className="w-4 h-4 text-blue-600" /> Contato / WhatsApp
              </span>
              <p className="text-sm font-extrabold text-blue-950">
                {association.contactPhone || "Consulte via website"}
              </p>
            </div>
          </div>

          {/* Website / Link Externo */}
          {association.website && (
            <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-2xl border border-gray-200/80">
              <span className="text-xs text-gray-600 font-medium flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-gray-500" /> Site Oficial
              </span>
              <a
                href={association.website.startsWith('http') ? association.website : `https://${association.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-emerald-700 hover:underline"
              >
                {association.website.replace(/^https?:\/\//, '')} →
              </a>
            </div>
          )}

          {/* Cardápio e Valores de Referência */}
          <div className="pt-2">
            <h4 className="text-sm font-extrabold text-gray-900 flex items-center gap-1.5 mb-3">
              <Tag className="w-4 h-4 text-emerald-600" /> Cardápio & Genéticas Disponíveis ({linkedStrains.length})
            </h4>

            {linkedStrains.length > 0 ? (
              <div className="space-y-2.5">
                {linkedStrains.map((item: any) => (
                  <div
                    key={item.id}
                    className="p-3.5 bg-white rounded-2xl border border-gray-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 text-sm">{item.name}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          {item.dominantCannabinoid}
                        </span>
                      </div>
                      {item.genetics && (
                        <p className="text-[11px] text-gray-500 mt-0.5">🧬 {item.genetics}</p>
                      )}
                    </div>

                    <div className="bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200/80 text-right">
                      <span className="text-xs font-black text-emerald-950 block">
                        {item.matchedPrice?.priceDisplay || 'Consulte valor'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : association.generalPricing && association.generalPricing.length > 0 ? (
              <div className="space-y-2.5">
                {association.generalPricing.map((item, idx) => (
                  <div key={idx} className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200/80">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                        {item.category}
                      </span>
                      <span className="text-xs font-bold text-gray-900">{item.title}</span>
                    </div>
                    <p className="text-xs text-gray-700 mt-2 font-medium">
                      {item.details}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-gray-50 border border-dashed border-gray-200 text-center text-xs text-gray-500">
                Consulte a disponibilidade entrando em contato direto com a associação.
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 flex items-center justify-between">
          <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Entidade Ativa
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-100 transition-colors"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};

export default AssociationModal;
