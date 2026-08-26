import React, { useState } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Flame, Award, ThumbsUp, Check, SlidersHorizontal } from 'lucide-react';
import { useStrains } from '../hooks/useStrains';
import { Strain } from '../types/strain';
import { StrainModal } from './StrainModal';

export const AiSommelier: React.FC = () => {
  const { strains } = useStrains();
  
  // Objetivos Múltiplos
  const [selectedObjectives, setSelectedObjectives] = useState<string[]>(['ansiedade', 'relaxamento']);
  const [timeOfDay, setTimeOfDay] = useState<string>('dia');
  const [experienceLevel, setExperienceLevel] = useState<string>('todos');
  const [preferredFormat, setPreferredFormat] = useState<string>('todos');
  
  const [recommendations, setRecommendations] = useState<Array<{ strain: Strain; score: number; reason: string }>>([]);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [selectedStrain, setSelectedStrain] = useState<Strain | null>(null);

  // Lista Completa e Abrangente de Objetivos Medicinais
  const availableObjectives = [
    { id: 'ansiedade', label: '🧘 Ansiedade & Estresse', desc: 'Ansiolítico e descompressão da mente' },
    { id: 'relaxamento', label: '💆 Relaxamento Físico', desc: 'Soltura muscular e alívio de tensões' },
    { id: 'sono', label: '😴 Insônia & Sono Profundo', desc: 'Indução ao repouso e qualidade do sono' },
    { id: 'dor', label: '🦴 Dores Crônicas & Enxaqueca', desc: 'Ação analgésica e anti-inflamatória' },
    { id: 'foco', label: '🧠 Foco, TDAH & Concentração', desc: 'Clareza cognitiva e estimulação mental' },
    { id: 'disposicao', label: '⚡ Disposição & Combate à Fadiga', desc: 'Energia diurna sem agitação' },
    { id: 'humor', label: '😊 Elevação de Humor & Bem-Estar', desc: 'Sensação de alegria e bem-estar' },
    { id: 'apetite', label: '🍔 Estímulo de Apetite & Náusea', desc: 'Conforto gastrointestinal e apetite' },
    { id: 'pos_treino', label: '🛡️ Anti-inflamatório & Pós-Treino', desc: 'Regeneração física e recuperação' },
    { id: 'cbd_puro', label: '🌱 Clareza sem Psicoatividade', desc: 'Foco no CBD sem euforia do THC' },
  ];

  const toggleObjective = (id: string) => {
    if (selectedObjectives.includes(id)) {
      if (selectedObjectives.length > 1) {
        setSelectedObjectives(selectedObjectives.filter(item => item !== id));
      }
    } else {
      setSelectedObjectives([...selectedObjectives, id]);
    }
  };

  const applyPreset = (ids: string[]) => {
    setSelectedObjectives(ids);
  };

  const handleRecommend = () => {
    const scoredStrains = strains.map((s) => {
      let score = 50; // Score base
      const reasons: string[] = [];

      const nameLower = s.name.toLowerCase();
      const profileLower = (s.aromaFlavor || s.description || '').toLowerCase();
      const effectsLower = (s.effects || []).map(e => e.toLowerCase()).join(' ');
      const terpenesLower = (s.terpenes || []).map(t => t.toLowerCase()).join(' ');

      // 1. Filtro de Formato
      if (preferredFormat !== 'todos') {
        if (s.category !== preferredFormat) {
          score -= 30;
        } else {
          score += 15;
        }
      }

      // 2. Pontuação por Objetivos Selecionados (Algoritmo Completo)
      selectedObjectives.forEach((obj) => {
        if (obj === 'ansiedade') {
          if (s.dominantCannabinoid === 'CBD' || s.dominantCannabinoid === 'THC/CBD') {
            score += 20;
            reasons.push("Modulação da ansiedade via CBD sem eufóricos excessivos.");
          }
          if (effectsLower.includes('ansiedade') || effectsLower.includes('calma') || terpenesLower.includes('linalol')) {
            score += 15;
          }
        }

        if (obj === 'relaxamento') {
          if (s.type === 'Indica' || s.type === 'Híbrida' || effectsLower.includes('relaxamento') || terpenesLower.includes('mirceno')) {
            score += 20;
            reasons.push("Promove relaxamento corporativo muscular e alívio de nós de tensão.");
          }
        }

        if (obj === 'sono') {
          if (s.type === 'Indica' || s.category === 'oleos' || nameLower.includes('sono') || nameLower.includes('cbn')) {
            score += 25;
            reasons.push("Indução de sono reparador e combate à insônia noturna.");
          }
          if (effectsLower.includes('sono') || effectsLower.includes('sedação')) {
            score += 15;
          }
        }

        if (obj === 'dor') {
          if (s.dominantCannabinoid === 'THC/CBD' || s.category === 'outros' || nameLower.includes('pomada') || nameLower.includes('hash')) {
            score += 25;
            reasons.push("Propriedades analgésicas para dor crônica e enxaquecas.");
          }
          if (effectsLower.includes('dor') || effectsLower.includes('muscular') || terpenesLower.includes('cariofileno')) {
            score += 15;
          }
        }

        if (obj === 'foco') {
          if (s.type === 'Sativa') {
            score += 25;
            reasons.push("Estímulo cognitivo Sativa para foco e clareza mental.");
          }
          if (effectsLower.includes('foco') || effectsLower.includes('criatividade') || terpenesLower.includes('pineno')) {
            score += 15;
          }
        }

        if (obj === 'disposicao') {
          if (s.type === 'Sativa' || terpenesLower.includes('limoneno') || effectsLower.includes('disposição')) {
            score += 20;
            reasons.push("Energia vital e combate à fadiga diurna.");
          }
        }

        if (obj === 'humor') {
          if (s.type === 'Sativa' || s.type === 'Híbrida' || effectsLower.includes('humor')) {
            score += 20;
            reasons.push("Sensação de bem-estar e elevação leve de humor.");
          }
        }

        if (obj === 'apetite') {
          if (effectsLower.includes('apetite') || profileLower.includes('fome')) {
            score += 25;
            reasons.push("Estímulo de apetite e conforto digestivo.");
          }
        }

        if (obj === 'pos_treino') {
          if (effectsLower.includes('anti-inflamatório') || terpenesLower.includes('cariofileno') || nameLower.includes('pomada')) {
            score += 25;
            reasons.push("Ação anti-inflamatória profunda para recuperação pós-exercício.");
          }
        }

        if (obj === 'cbd_puro') {
          if (s.dominantCannabinoid === 'CBD') {
            score += 30;
            reasons.push("Perfil limpo em CBD puro sem psicoatividade.");
          }
        }
      });

      // 3. Impacto REAL do Momento do Uso (Dia vs Noite)
      if (timeOfDay === 'dia') {
        if (s.type === 'Indica' && s.dominantCannabinoid === 'THC') {
          score -= 35; // Penaliza Indicas pesadas de dia!
        } else if (s.type === 'Sativa' || s.dominantCannabinoid === 'CBD') {
          score += 20; // Favorece Sativas e CBD de dia!
          reasons.push("Compatível com uso diurno sem gerar sonolência.");
        }
      } else if (timeOfDay === 'noite') {
        if (s.type === 'Sativa') {
          score -= 25; // Penaliza Sativas de noite!
        } else if (s.type === 'Indica' || s.category === 'oleos' || nameLower.includes('cbn')) {
          score += 20; // Favorece Indicas e Óleos de noite!
          reasons.push("Auxilia na desaceleração noturna antes de deitar.");
        }
      }

      // 4. Perfil de Experiência
      if (experienceLevel === 'iniciante') {
        if (s.dominantCannabinoid === 'CBD' || s.dominantCannabinoid === 'THC/CBD') {
          score += 15;
          reasons.push("Recomendado para iniciantes devido ao perfil suave.");
        }
      } else if (experienceLevel === 'experiente') {
        if (s.dominantCannabinoid === 'THC' || s.type === 'Concentrados') {
          score += 15;
        }
      }

      const finalScore = Math.min(99, Math.max(55, score));
      const reasonText = reasons.length > 0 ? Array.from(new Set(reasons)).slice(0, 2).join(' ') : "Perfil terpênico harmonizado com os seus objetivos.";

      return { strain: s, score: finalScore, reason: reasonText };
    });

    // Ordena do maior score para o menor
    scoredStrains.sort((a, b) => b.score - a.score);

    // Exibe até 8 melhores resultados
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
          <span>Fummelier IA — Curadoria Terapêutica Completa</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
          Fummelier <span className="text-emerald-400">IA</span>
        </h1>

        <p className="text-sm sm:text-base text-emerald-100/80 max-w-xl mx-auto leading-relaxed">
          Selecione os seus sintomas e preferências para receber a recomendação exata de genéticas, extratos e proporções de canabinoides.
        </p>
      </div>

      {/* Formulário Completo do Sommelier */}
      <div className="bg-white rounded-3xl border border-gray-200/90 p-6 sm:p-8 shadow-xl space-y-6">
        
        {/* Presets Rápidos */}
        <div className="flex flex-wrap items-center justify-between gap-2 bg-emerald-50/60 p-3 rounded-2xl border border-emerald-100">
          <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
            <SlidersHorizontal className="w-4 h-4 text-emerald-600" /> Atalhos Rápidos:
          </span>
          <div className="flex flex-wrap gap-1.5 text-xs">
            <button
              type="button"
              onClick={() => applyPreset(['ansiedade', 'relaxamento'])}
              className="px-2.5 py-1 rounded-xl bg-white border border-emerald-200 text-emerald-800 font-bold hover:bg-emerald-600 hover:text-white transition-all shadow-xs"
            >
              🧘 Descompressão & Estresse
            </button>
            <button
              type="button"
              onClick={() => applyPreset(['sono', 'relaxamento'])}
              className="px-2.5 py-1 rounded-xl bg-white border border-emerald-200 text-emerald-800 font-bold hover:bg-emerald-600 hover:text-white transition-all shadow-xs"
            >
              😴 Insônia & Repouso
            </button>
            <button
              type="button"
              onClick={() => applyPreset(['dor', 'pos_treino'])}
              className="px-2.5 py-1 rounded-xl bg-white border border-emerald-200 text-emerald-800 font-bold hover:bg-emerald-600 hover:text-white transition-all shadow-xs"
            >
              🦴 Alívio de Dores
            </button>
            <button
              type="button"
              onClick={() => applyPreset(['foco', 'disposicao'])}
              className="px-2.5 py-1 rounded-xl bg-white border border-emerald-200 text-emerald-800 font-bold hover:bg-emerald-600 hover:text-white transition-all shadow-xs"
            >
              🧠 Foco & Energia
            </button>
          </div>
        </div>

        {/* 1. Seleção Múltipla de Objetivos Terapêuticos */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
              1. Selecione seus Objetivos Terapêuticos ({selectedObjectives.length} selecionados):
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {availableObjectives.map((obj) => {
              const isSelected = selectedObjectives.includes(obj.id);
              return (
                <button
                  key={obj.id}
                  type="button"
                  onClick={() => toggleObjective(obj.id)}
                  className={`p-3.5 rounded-2xl text-xs text-left font-bold transition-all flex items-start justify-between border ${
                    isSelected
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-emerald-50/70 hover:border-emerald-300'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="font-extrabold text-xs">{obj.label}</div>
                    <div className={`text-[10px] font-normal ${isSelected ? 'text-emerald-100' : 'text-gray-500'}`}>
                      {obj.desc}
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-white shrink-0 mt-0.5 ml-1" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Filtros Adicionais (Momento, Tolerância, Formato) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
          
          {/* Momento do Uso */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
              2. Momento de Uso
            </label>
            <select
              value={timeOfDay}
              onChange={(e) => setTimeOfDay(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
            >
              <option value="dia">☀️ Uso Diurno (Sem sonolência)</option>
              <option value="noite">🌙 Uso Noturno (Sedativo/Repouso)</option>
              <option value="qualquer">🔄 Qualquer Horário</option>
            </select>
          </div>

          {/* Perfil / Experiência */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
              3. Perfil / Tolerância
            </label>
            <select
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
            >
              <option value="todos">🌱 Todos os Perfis</option>
              <option value="iniciante">🟢 Iniciante (Leve / CBD)</option>
              <option value="experiente">🔥 Experiente (Mais Potente)</option>
            </select>
          </div>

          {/* Formato Preferido */}
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
                Recomendações Personalizadas pelo Fummelier IA:
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Calculado com base em {selectedObjectives.length} {selectedObjectives.length === 1 ? 'objetivo' : 'objetivos simultâneos'} e momento do uso ({timeOfDay === 'dia' ? 'Diurno' : 'Noturno'}).
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
                  <span>{score}% Compatível</span>
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
