import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Flame, Award, ThumbsUp, Check, SlidersHorizontal, MessageSquare, Star } from 'lucide-react';
import { useStrains } from '../hooks/useStrains';
import { Strain } from '../types/strain';
import { StrainModal } from './StrainModal';
import { supabase } from '../lib/supabase';

interface CommunityReviewStats {
  [strainId: string]: {
    avgRating: number;
    count: number;
    topComment?: string;
  };
}

export const AiSommelier: React.FC = () => {
  const { strains } = useStrains();
  
  // Objetivos Múltiplos (Inicia com 0 selecionados)
  const [selectedObjectives, setSelectedObjectives] = useState<string[]>([]);
  const [timeOfDay, setTimeOfDay] = useState<string>('dia');
  const [experienceLevel, setExperienceLevel] = useState<string>('todos');
  const [preferredFormat, setPreferredFormat] = useState<string>('todos');
  const [communityStats, setCommunityStats] = useState<CommunityReviewStats>({});
  
  const [recommendations, setRecommendations] = useState<Array<{ strain: Strain; score: number; reason: string; reviewStats?: { avgRating: number; count: number; topComment?: string } }>>([]);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [selectedStrain, setSelectedStrain] = useState<Strain | null>(null);

  // Busca avaliações da comunidade no Supabase para alimentar a IA
  useEffect(() => {
    async function loadCommunityReviews() {
      if (!supabase) return;
      try {
        const { data, error } = await supabase.from('reviews').select('*');
        if (!error && data) {
          const statsMap: CommunityReviewStats = {};
          
          data.forEach((rev: any) => {
            const sId = rev.strain_id;
            if (!statsMap[sId]) {
              statsMap[sId] = { avgRating: 0, count: 0, topComment: '' };
            }
            statsMap[sId].count += 1;
            statsMap[sId].avgRating += rev.rating || 5;
            if (rev.comment && (!statsMap[sId].topComment || rev.rating >= 4)) {
              statsMap[sId].topComment = rev.comment;
            }
          });

          // Calcula médias
          Object.keys(statsMap).forEach(sId => {
            statsMap[sId].avgRating = Number((statsMap[sId].avgRating / statsMap[sId].count).toFixed(1));
          });

          setCommunityStats(statsMap);
        }
      } catch (e) {
        console.error('Erro ao carregar avaliações para a IA:', e);
      }
    }
    loadCommunityReviews();
  }, []);

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
      setSelectedObjectives(selectedObjectives.filter(item => item !== id));
    } else {
      setSelectedObjectives([...selectedObjectives, id]);
    }
  };

  const applyPreset = (ids: string[]) => {
    setSelectedObjectives(ids);
  };

  const handleRecommend = () => {
    if (selectedObjectives.length === 0) return;

    const scoredStrains = strains.map((s) => {
      let score = 50;
      const reasons: string[] = [];

      const nameLower = s.name.toLowerCase();
      const profileLower = (s.aromaFlavor || s.description || '').toLowerCase();
      const effectsLower = (s.effects || []).map(e => e.toLowerCase()).join(' ');
      const terpenesLower = (s.terpenes || []).map(t => t.toLowerCase()).join(' ');

      // 0. Bônus por Avaliações Positivas de Pacientes Reais!
      const stats = communityStats[s.id];
      if (stats && stats.count > 0) {
        if (stats.avgRating >= 4.5) {
          score += 15;
          reasons.push(`Aprovada por pacientes com média de ${stats.avgRating}★ na comunidade.`);
        }
      }

      // 1. Filtro de Formato
      if (preferredFormat !== 'todos') {
        if (s.category !== preferredFormat) {
          score -= 30;
        } else {
          score += 15;
        }
      }

      // 2. Pontuação por Objetivos Selecionados
      selectedObjectives.forEach((objId) => {
        if (objId === 'ansiedade') {
          if (effectsLower.includes('ansiedade') || profileLower.includes('ansiol') || terpenesLower.includes('mirceno') || terpenesLower.includes('linalol')) {
            score += 15;
            reasons.push('Excelente ação ansiolítica e modulação de estresse.');
          }
        }
        if (objId === 'relaxamento') {
          if (s.type === 'Indica' || effectsLower.includes('relax') || terpenesLower.includes('mirceno')) {
            score += 15;
            reasons.push('Perfil rico em terpenos sedativos e soltura muscular.');
          }
        }
        if (objId === 'sono') {
          if (s.type === 'Indica' || profileLower.includes('sono') || profileLower.includes('insônia') || nameLower.includes('night') || nameLower.includes('kush')) {
            score += 20;
            reasons.push('Indicada para indução ao sono profundo e combate à insônia.');
          }
        }
        if (objId === 'dor') {
          if (effectsLower.includes('dor') || profileLower.includes('analgés') || profileLower.includes('inflam') || terpenesLower.includes('cariofileno')) {
            score += 18;
            reasons.push('Potencial analgésico e alívio de tensões profundas.');
          }
        }
        if (objId === 'foco') {
          if (s.type === 'Sativa' || profileLower.includes('foco') || profileLower.includes('clareza') || terpenesLower.includes('pineno')) {
            score += 18;
            reasons.push('Promove clareza mental, atenção e estado de presença.');
          }
        }
        if (objId === 'disposicao') {
          if (s.type === 'Sativa' || nameLower.includes('tangie') || nameLower.includes('lemon') || profileLower.includes('energia')) {
            score += 15;
            reasons.push('Estimulante diurno sem provocar sonolência.');
          }
        }
        if (objId === 'humor') {
          if (effectsLower.includes('humor') || profileLower.includes('bem-estar') || terpenesLower.includes('limoneno')) {
            score += 12;
            reasons.push('Elevação do humor e sensação de bem-estar.');
          }
        }
        if (objId === 'cbd_puro') {
          if (s.dominantCannabinoid === 'CBD' || s.dominantCannabinoid === 'THC/CBD') {
            score += 25;
            reasons.push('Predomínio de CBD para ação terapêutica sem psicoatividade intensa.');
          }
        }
      });

      // 3. Momento de Uso (Horário)
      if (timeOfDay === 'dia') {
        if (s.type === 'Indica') {
          score -= 20;
          reasons.push('Atenção: Uso noturno recomendado por ser sedativa.');
        } else if (s.type === 'Sativa' || s.dominantCannabinoid === 'CBD') {
          score += 10;
          reasons.push('Ideal para uso diurno.');
        }
      } else if (timeOfDay === 'noite') {
        if (s.type === 'Sativa') {
          score -= 15;
        } else if (s.type === 'Indica') {
          score += 15;
          reasons.push('Perfeita para consumo no final do dia.');
        }
      }

      // Normaliza Score entre 65% e 99%
      const finalScore = Math.min(99, Math.max(65, score));
      
      const uniqueReasons = Array.from(new Set(reasons)).slice(0, 2);
      const mainReason = uniqueReasons.length > 0
        ? uniqueReasons.join(' ')
        : 'Perfil terpenoide compatível com os objetivos selecionados.';

      return {
        strain: s,
        score: finalScore,
        reason: mainReason,
        reviewStats: stats
      };
    });

    // Ordena do maior score para o menor
    scoredStrains.sort((a, b) => b.score - a.score);

    // Seleciona as 8 melhores recomendações
    setRecommendations(scoredStrains.slice(0, 8));
    setHasSearched(true);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Header do Fummelier IA */}
      <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-teal-900 rounded-3xl p-6 sm:p-10 text-white text-center space-y-3 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 translate-x-10 -translate-y-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl"></div>
        
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold backdrop-blur-md">
          <Flame className="w-4 h-4 text-emerald-400" />
          <span>Fummelier IA — Curadoria Conectada aos Relatos de Pacientes</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
          Fummelier <span className="text-emerald-400">IA</span>
        </h1>

        <p className="text-sm sm:text-base text-emerald-100/80 max-w-xl mx-auto leading-relaxed">
          Nossa inteligência cruza dados de terpenos com as avaliações reais publicadas pela comunidade de pacientes no CannaGuia.
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
                <div
                  key={obj.id}
                  onClick={() => toggleObjective(obj.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                    isSelected
                      ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm'
                      : 'bg-gray-50 border-gray-200/80 hover:bg-gray-100 hover:border-gray-300'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                    isSelected ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-gray-300 bg-white'
                  }`}>
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                  </div>
                  <div>
                    <span className="text-xs font-extrabold text-gray-900 block">{obj.label}</span>
                    <span className="text-[10px] text-gray-500 leading-tight block mt-0.5">{obj.desc}</span>
                  </div>
                </div>
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

          {/* Perfil Terapêutico / Tolerância */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
              3. Perfil Canabinoide
            </label>
            <select
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
            >
              <option value="todos">🌱 Espectro Terapêutico Amplo</option>
              <option value="iniciante">🟢 Formulação Suave / CBD Predominante</option>
              <option value="experiente">🔥 Concentração Elevada</option>
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
              <option value="todos">✨ Todos os Formatos Medicinais</option>
              <option value="flores">🌸 Flores in Natura</option>
              <option value="oleos">💧 Óleos Medicinais</option>
              <option value="outros">🍬 Gummies & Outros</option>
            </select>
          </div>

        </div>

        {/* Botão de Ação */}
        <button
          onClick={handleRecommend}
          disabled={selectedObjectives.length === 0}
          className={`w-full py-4 font-black text-sm rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 transform active:scale-[0.99] ${
            selectedObjectives.length === 0
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed shadow-none'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
          }`}
        >
          <Sparkles className="w-5 h-5 text-amber-300" />
          <span>
            {selectedObjectives.length === 0
              ? 'Selecione ao menos 1 objetivo terapêutico para consultar a IA'
              : 'Consultar Recomendações do Fummelier IA'}
          </span>
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
                Calculado com base em {selectedObjectives.length} {selectedObjectives.length === 1 ? 'objetivo' : 'objetivos simultâneos'}, momento do uso e relatos reais de pacientes.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendations.map((item, index) => (
              <div
                key={item.strain.id}
                onClick={() => setSelectedStrain(item.strain)}
                className="bg-white rounded-3xl border border-gray-200/90 p-6 shadow-sm hover:shadow-xl hover:border-emerald-500/60 transition-all cursor-pointer flex flex-col justify-between space-y-4 relative overflow-hidden group"
              >
                {/* Ranking Tag */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 bg-emerald-600 text-white rounded-xl text-xs font-black flex items-center justify-center shadow-md">
                      #{index + 1}
                    </span>
                    <span className="text-xs font-bold text-gray-500">
                      Compatibilidade Terapêutica
                    </span>
                  </div>

                  <span className="text-sm font-black text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    {item.score}% Compatível
                  </span>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xl font-black text-gray-900 group-hover:text-emerald-700 transition-colors">
                    {item.strain.name}
                  </h4>

                  <p className="text-xs text-gray-600 italic bg-gray-50 p-3 rounded-2xl border border-gray-100">
                    "{item.reason}"
                  </p>
                </div>

                {/* Relato da Comunidade se existir */}
                {item.reviewStats && item.reviewStats.topComment && (
                  <div className="bg-amber-50/80 p-3 rounded-2xl border border-amber-200/80 text-xs space-y-1">
                    <span className="text-[10px] font-extrabold text-amber-900 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> Relato da Comunidade ({item.reviewStats.avgRating}★):
                    </span>
                    <p className="text-[11px] text-amber-950 italic">
                      "{item.reviewStats.topComment}"
                    </p>
                  </div>
                )}

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className="font-semibold text-gray-500">
                    {item.strain.associations?.[0]?.associationName || 'Várias associações'}
                  </span>
                  <span className="font-bold text-emerald-600 group-hover:underline flex items-center gap-1">
                    Ver detalhes completos <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal de Detalhes da Strain */}
      <StrainModal
        strain={selectedStrain}
        onClose={() => setSelectedStrain(null)}
      />

    </div>
  );
};

export default AiSommelier;
