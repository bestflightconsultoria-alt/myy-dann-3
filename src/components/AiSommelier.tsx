import React, { useState } from 'react';
import { Bot, Sparkles, RefreshCw, CheckCircle2, ArrowRight, ShieldCheck, Flame } from 'lucide-react';
import { useStrains } from '../hooks/useStrains';
import { Strain } from '../types/strain';
import { StrainModal } from './StrainModal';

export const AiSommelier: React.FC = () => {
  const { strains } = useStrains();
  const [objective, setObjective] = useState<string>('ansiedade');
  const [timeOfDay, setTimeOfDay] = useState<string>('dia');
  const [preferredFormat, setPreferredFormat] = useState<string>('flores');
  const [recommendations, setRecommendations] = useState<Strain[]>([]);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [selectedStrain, setSelectedStrain] = useState<Strain | null>(null);

  const handleRecommend = () => {
    let matches = strains.filter((s) => {
      // Formato
      if (preferredFormat !== 'todos' && s.category !== preferredFormat) return false;

      // Objetivo
      if (objective === 'ansiedade') {
        return (
          s.dominantCannabinoid === 'CBD' ||
          s.dominantCannabinoid === 'THC/CBD' ||
          s.effects.some((e) => e.toLowerCase().includes('ansiedade') || e.toLowerCase().includes('equilíbrio'))
        );
      }
      if (objective === 'sono') {
        return (
          s.type === 'Indica' ||
          s.usageProfiles.includes('Sono') ||
          s.usageProfiles.includes('Noite') ||
          s.effects.some((e) => e.toLowerCase().includes('descanso') || e.toLowerCase().includes('relaxamento'))
        );
      }
      if (objective === 'foco') {
        return (
          s.type === 'Sativa' ||
          s.usageProfiles.includes('Foco') ||
          s.usageProfiles.includes('Estudo') ||
          s.effects.some((e) => e.toLowerCase().includes('foco') || e.toLowerCase().includes('clareza') || e.toLowerCase().includes('energia'))
        );
      }
      if (objective === 'dor') {
        return (
          s.usageProfiles.includes('Dor Crônica') ||
          s.dominantCannabinoid === 'THC/CBD' ||
          s.effects.some((e) => e.toLowerCase().includes('dor') || e.toLowerCase().includes('muscular'))
        );
      }
      return true;
    });

    if (matches.length === 0) {
      matches = strains.slice(0, 3);
    }

    setRecommendations(matches.slice(0, 4));
    setHasSearched(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center p-3 bg-emerald-100 text-emerald-700 rounded-2xl mb-1 shadow-sm">
          <Flame className="w-8 h-8 text-emerald-600" />
        </div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">
          IA Fummelier
        </h1>
        <p className="text-sm text-gray-600 max-w-lg mx-auto">
          Assistente inteligente para encontrar a genética, óleo ou derivado ideal com base nos seus objetivos terapêuticos.
        </p>
      </div>

      {/* Formulário do Sommelier */}
      <div className="bg-white rounded-3xl border border-gray-200/90 p-6 sm:p-8 shadow-xl space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          
          {/* Objetivo */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
              1. Qual o seu objetivo principal?
            </label>
            <select
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
            >
              <option value="ansiedade">Alívio de Ansiedade / Estresse</option>
              <option value="sono">Sono Reparador / Insônia</option>
              <option value="foco">Foco / Concentração / Criatividade</option>
              <option value="dor">Controle de Dores Crônicas</option>
            </select>
          </div>

          {/* Horário */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
              2. Momento de Uso
            </label>
            <select
              value={timeOfDay}
              onChange={(e) => setTimeOfDay(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
            >
              <option value="dia">Durante o Dia (Sem sonolência)</option>
              <option value="noite">Noite / Antes de dormir</option>
              <option value="qualquer">Qualquer horário / Contínuo</option>
            </select>
          </div>

          {/* Formato */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
              3. Formato de Preferência
            </label>
            <select
              value={preferredFormat}
              onChange={(e) => setPreferredFormat(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
            >
              <option value="flores">Flores in Natura</option>
              <option value="oleos">Óleos Medicinais</option>
              <option value="outros">Gummies / Comestíveis</option>
              <option value="todos">Todos os Formatos</option>
            </select>
          </div>

        </div>

        {/* Botão de Ação */}
        <button
          onClick={handleRecommend}
          className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-200 transition-all flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4" /> Consultar Recomendações do Fummelier
        </button>
      </div>

      {/* Resultados da Recomendação */}
      {hasSearched && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              Opções selecionadas para o seu perfil:
            </h3>
            <span className="text-xs text-gray-500">
              {recommendations.length} {recommendations.length === 1 ? 'resultado' : 'resultados'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {recommendations.map((strain) => (
              <div
                key={strain.id}
                onClick={() => setSelectedStrain(strain)}
                className="bg-white rounded-2xl border border-emerald-200/80 p-5 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-0.5 text-xs font-bold rounded-md bg-emerald-50 text-emerald-800 border border-emerald-100">
                      {strain.dominantCannabinoid || strain.type}
                    </span>
                    <span className="text-xs font-semibold text-emerald-700">
                      {strain.associations?.[0]?.priceDisplay || 'Preço sob consulta'}
                    </span>
                  </div>

                  <h4 className="font-bold text-gray-900 text-base group-hover:text-emerald-700 transition-colors">
                    {strain.name}
                  </h4>

                  {strain.aromaFlavor && (
                    <p className="text-xs text-amber-900/80 bg-amber-50/70 p-2 rounded-lg mt-2 italic font-medium">
                      🌿 {strain.aromaFlavor}
                    </p>
                  )}

                  <p className="text-xs text-gray-600 mt-2 line-clamp-2">
                    {strain.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className="text-gray-500 font-medium flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    {strain.associations?.[0]?.associationName}
                  </span>
                  <span className="font-bold text-emerald-600 flex items-center gap-0.5">
                    Ver Detalhes <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal de Detalhes da Strain Selecionada */}
      <StrainModal
        strain={selectedStrain}
        onClose={() => setSelectedStrain(null)}
      />
    </div>
  );
};

export default AiSommelier;
