import React, { useState } from 'react';
import { Sparkles, CheckCircle2, ArrowRight, ShieldCheck, Flame, Zap, Award, ThumbsUp } from 'lucide-react';
import { useStrains } from '../hooks/useStrains';
import { Strain } from '../types/strain';
import { StrainModal } from './StrainModal';

export const AiSommelier: React.FC = () => {
  const { strains } = useStrains();
  const [objective, setObjective] = useState<string>('ansiedade');
  const [timeOfDay, setTimeOfDay] = useState<string>('dia');
  const [experienceLevel, setExperienceLevel] = useState<string>('todos');
  const [preferredFormat, setPreferredFormat] = useState<string>('todos');
  
  const [recommendations, setRecommendations] = useState<Array<{ strain: Strain; score: number; reason: string }>>([]);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [selectedStrain, setSelectedStrain] = useState<Strain | null>(null);

  const handleRecommend = () => {
    const scoredStrains = strains.map((s) => {
      let score = 70; // Score base
      const reasons: string[] = [];

      const nameLower = s.name.toLowerCase();
      const profileLower = (s.aromaFlavor || s.description || '').toLowerCase();
      const effectsLower = (s.effects || []).map(e => e.toLowerCase()).join(' ');

      // 1. Filtro por Formato
      if (preferredFormat !== 'todos') {
        if (s.category !== preferredFormat) {
          score -= 40;
        } else {
          score += 15;
        }
      }

      // 2. Filtro por Objetivo Terapêutico
      if (objective === 'ansiedade') {
        if (s.dominantCannabinoid === 'CBD' || s.dominantCannabinoid === 'THC/CBD') {
          score += 20;
          reasons.push("Rico em CBD para modulação de ansiedade sem efeito eufórico excessivo.");
        }
        if (effectsLower.includes('ansiedade') || effectsLower.includes('calma') || effectsLower.includes('estresse')) {
          score += 15;
          reasons.push("Perfil de terpenos com propriedades ansiolíticas comprovadas.");
        }
      } else if (objective === 'sono') {
        if (s.type === 'Indica' || s.category === 'oleos' || nameLower.includes('sono') || nameLower.includes('cbn')) {
          score += 25;
          reasons.push("Genética de perfil sedativo ideal para indução do sono reparador.");
        }
        if (effectsLower.includes('sono') || effectsLower.includes('sedação') || effectsLower.includes('relaxamento')) {
          score += 15;
          reasons.push("Promove descompressão muscular e relaxamento físico profundo.");
        }
      } else if (objective === 'foco') {
        if (s.type === 'Sativa') {
          score += 25;
          reasons.push("Perfil Sativa dominante recomendado para clareza mental e foco diurno.");
        }
        if (effectsLower.includes('foco') || effectsLower.includes('criatividade') || effectsLower.includes('disposição')) {
          score += 15;
          reasons.push("Estímulo sensorial sem causar agitação ou névoa mental.");
        }
      } else if (objective === 'dor') {
        if (s.dominantCannabinoid === 'THC/CBD' || s.category === 'outros' || nameLower.includes('pomada') || nameLower.includes('hash')) {
          score += 25;
          reasons.push("Combinação analgésica ideal para alívio de dores crônicas e inflamações.");
        }
        if (effectsLower.includes('dor') || effectsLower.includes('muscular') || effectsLower.includes('inflam')) {
          score += 15;
          reasons.push("Eficaz no manejo de tensões musculares e dores articulares.");
        }
      } else if (objective === 'humor') {
        if (s.type === 'Sativa' || s.type === 'Híbrida') {
          score += 20;
          reasons.push("Elevação de humor e sensação de bem-estar social.");
        }
      }

      // 3. Filtro por Momento do Uso (Dia vs Noite)
      if (timeOfDay === 'dia') {
        if (s.type === 'Indica' && s.dominantCannabinoid === 'THC') {
          score -= 20;
        } else if (s.dominantCannabinoid === 'CBD' || s.type === 'Sativa') {
          score += 10;
          reasons.push("Compatível com rotina diurna sem gerar letargia.");
        }
      } else if (timeOfDay === 'noite') {
        if (s.type === 'Indica' || s.category === 'oleos') {
          score += 10;
        }
      }

      // 4. Experiência / Tolerância
      if (experienceLevel === 'iniciante') {
        if (s.dominantCannabinoid === 'CBD' || s.dominantCannabinoid === 'THC/CBD') {
          score += 15;
          reasons.push("Excelente para iniciantes devido ao perfil equilibrado e suave.");
        }
      } else if (experienceLevel === 'experiente') {
        if (s.dominantCannabinoid === 'THC' || s.type === 'Concentrados') {
          score += 15;
        }
      }

      // Cap final
      const finalScore = Math.min(99, Math.max(60, score));
      const reasonText = reasons.length > 0 ? reasons[0] : "Excelente equilíbrio terpênico e alinhamento com sua busca.";

      return { strain: s, score: finalScore, reason: reasonText };
    });

    // Ordena do maior score para o menor
    scoredStrains.sort((a, b) => b.score - a.score);

    // Retorna até 8 melhores opções
    setRecommendations(scoredStrains.slice(0, 8));
    setHasSearched(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* Header do Fummelier IA */}
      <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-teal-900 rounded-3xl p-6 sm:p-10 text-white text-center space-y-3 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 translate-x-10 -translate-y-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl"></div>
        
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold backdrop-blur-md">
          <Flame className="w-4 h-4 text-emerald-400" />
          <span>Fummelier IA — Curadoria Terapêutica Inteligente</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
          Fummelier <span className="text-emerald-400">IA</span>
        </h1>

        <p className="text-sm sm:text-base text-emerald-100/80 max-w-xl mx-auto leading-relaxed">
          Selecione suas necessidades e nosso algoritmo de inteligência analisará genéticas, terpenos e perfis de 90+ opções para indicar as melhores escolhas.
        </p>
      </div>

      {/* Formulário do Sommelier */}
      <div className="bg-white rounded-3xl border border-gray-200/90 p-6 sm:p-8 shadow-xl space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* 1. Objetivo */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
              1. Qual o objetivo?
            </label>
            <select
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
            >
              <option value="ansiedade">🧘 Ansiedade / Estresse</option>
              <option value="sono">😴 Insônia / Sono Reparador</option>
              <option value="foco">🧠 Foco / Criatividade / TDAH</option>
              <option value="dor">🦴 Dores Crônicas / Inflamação</option>
              <option value="humor">⚡ Disposição & Humor</option>
            </select>
          </div>

          {/* 2. Horário */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
              2. Momento de Uso
            </label>
            <select
              value={timeOfDay}
              onChange={(e) => setTimeOfDay(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
            >
              <option value="dia">☀️ Durante o Dia (Sem letargia)</option>
              <option value="noite">🌙 Noite / Antes de dormir</option>
              <option value="qualquer">🔄 Qualquer Momento</option>
            </select>
          </div>

          {/* 3. Tolerância */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
              3. Perfil / Experiência
            </label>
            <select
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
            >
              <option value="todos">🌱 Todos os Perfis</option>
              <option value="iniciante">🟢 Iniciante (Suave / CBD)</option>
              <option value="experiente">🔥 Experiente (Mais Potente)</option>
            </select>
          </div>

          {/* 4. Formato */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
              4. Formato Preferido
            </label>
            <select
              value={preferredFormat}
              onChange={(e) => setPreferredFormat(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
            >
              <option value="todos">✨ Todos os Formatos</option>
              <option value="flores">🌸 Flores in Natura</option>
              <option value="oleos">💧 Óleos Medicinais</option>
              <option value="outros">🍬 Gummies & Outros</option>
            </select>
          </div>

        </div>

        {/* Botão de Ação */}
        <button
          onClick={handleRecommend}
          className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-2xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 transform active:scale-[0.99]"
        >
          <Sparkles className="w-5 h-5 text-amber-300" />
          <span>Consultar Recomendações do Fummelier IA</span>
        </button>
      </div>

      {/* Resultados da Recomendação */}
      {hasSearched && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-gray-200 pb-4">
            <div>
              <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
                <Award className="w-6 h-6 text-emerald-600" />
                Opções Selecionadas pelo Fummelier IA:
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Exibindo as 8 opções com maior compatibilidade terapêutica para o seu perfil.
              </p>
            </div>
            <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
              {recommendations.length} resultados
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {recommendations.map(({ strain, score, reason }) => (
              <div
                key={strain.id}
                onClick={() => setSelectedStrain(strain)}
                className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-xl hover:border-emerald-500/60 transition-all cursor-pointer flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Porcentagem de Compatibilidade */}
                <div className="absolute top-0 right-0 bg-gradient-to-l from-emerald-600 to-teal-600 text-white text-[11px] font-black px-3 py-1 rounded-bl-xl shadow-sm flex items-center gap-1">
                  <ThumbsUp className="w-3 h-3 text-amber-300" />
                  <span>{score}% de Compatibilidade</span>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2.5 py-0.5 text-xs font-bold rounded-md bg-emerald-50 text-emerald-800 border border-emerald-100">
                      {strain.dominantCannabinoid || strain.type}
                    </span>
                  </div>

                  <h4 className="font-extrabold text-gray-900 text-lg group-hover:text-emerald-700 transition-colors">
                    {strain.name}
                  </h4>

                  {/* Razão da Recomendação pelo Fummelier */}
                  <div className="mt-3 bg-emerald-50/70 border border-emerald-200/60 p-2.5 rounded-xl text-xs text-emerald-950 font-medium space-y-1">
                    <span className="font-extrabold text-emerald-800 flex items-center gap-1">
                      💡 Por que o Fummelier IA recomenda:
                    </span>
                    <p className="text-[11px] leading-relaxed text-emerald-900">
                      {reason}
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className="text-gray-600 font-medium flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="truncate max-w-[140px]">
                      {strain.associations?.[0]?.associationName || 'Sob Consulta'}
                    </span>
                  </span>
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1 group-hover:bg-emerald-600 group-hover:text-white transition-all">
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
