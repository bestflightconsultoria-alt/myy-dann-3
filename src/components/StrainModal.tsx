import React, { useState, useEffect } from 'react';
import { 
  X, 
  DollarSign, 
  Building, 
  MessageSquarePlus, 
  AlertTriangle, 
  CheckCircle2, 
  UserCheck, 
  Send,
  ShieldCheck,
  Globe,
  Star,
  Plus,
  Sparkles
} from 'lucide-react';
import { Strain } from '../types/strain';
import { supabase } from '../lib/supabase';

interface PatientReview {
  id: string;
  strainId: string;
  strainName: string;
  associationId: string;
  associationName: string;
  rating: number;
  patientName: string;
  conditions: string[];
  positiveEffects: string[];
  sideEffects: string[];
  comment: string;
  isVerified: boolean;
  date: string;
}

const COMMON_CONDITIONS = [
  'Ansiedade & Estresse',
  'Insônia / Distúrbios do Sono',
  'Dor Crônica / Tensão Muscular',
  'TDAH / Déficit de Foco',
  'Enxaqueca / Cefaleia',
  'Fibromialgia',
  'Depressão',
  'Bruxismo'
];

const COMMON_SIDE_EFFECTS = [
  'Nenhum efeito adverso',
  'Boca seca',
  'Olhos secos / vermelhidão',
  'Sonolência diurna',
  'Aumento de apetite',
  'Leve tontura transitória'
];

interface StrainModalProps {
  strain: Strain | null;
  onClose: () => void;
}

export const StrainModal: React.FC<StrainModalProps> = ({ strain, onClose }) => {
  const [reviews, setReviews] = useState<PatientReview[]>([]);
  const [showReviewForm, setShowReviewForm] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Form States
  const [patientName, setPatientName] = useState('');
  const [selectedAssoc, setSelectedAssoc] = useState<string>('');
  const [rating, setRating] = useState<number>(5);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [customCondition, setCustomCondition] = useState('');
  const [positiveEffectInput, setPositiveEffectInput] = useState('');
  const [selectedSideEffects, setSelectedSideEffects] = useState<string[]>(['Nenhum efeito adverso']);
  const [customSideEffect, setCustomSideEffect] = useState('');
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  // Busca avaliações reais no Supabase
  useEffect(() => {
    if (!strain) return;

    if (strain.associations && strain.associations.length > 0) {
      setSelectedAssoc(strain.associations[0].associationName);
    } else {
      setSelectedAssoc('Associação Dispensadora');
    }

    async function loadReviews() {
      if (!supabase) {
        setReviews([]);
        return;
      }
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select('*')
          .eq('strain_id', strain.id)
          .order('created_at', { ascending: false });

        if (!error && data) {
          const formatted: PatientReview[] = data.map(item => ({
            id: item.id,
            strainId: item.strain_id,
            strainName: item.strain_name || strain.name,
            associationId: item.association_id || '',
            associationName: item.association_name,
            rating: item.rating || 5,
            patientName: item.patient_name,
            conditions: item.conditions || [],
            positiveEffects: item.positive_effects || [],
            sideEffects: item.side_effects || [],
            comment: item.comment,
            isVerified: item.is_verified,
            date: new Date(item.created_at).toLocaleDateString('pt-BR')
          }));
          setReviews(formatted);
        } else {
          setReviews([]);
        }
      } catch {
        setReviews([]);
      }
    }
    loadReviews();
    setShowReviewForm(false);
  }, [strain]);

  if (!strain) return null;

  const displayBadge = () => {
    if (strain.dominantCannabinoid === 'THC/CBD') return { text: 'THC / CBD', bg: 'bg-purple-100 text-purple-800' };
    if (strain.dominantCannabinoid === 'CBD') return { text: 'CBD', bg: 'bg-blue-100 text-blue-800' };
    if (strain.category === 'oleos') return { text: 'Óleo', bg: 'bg-amber-100 text-amber-800' };
    if (strain.category === 'outros') return { text: 'Gummies', bg: 'bg-pink-100 text-pink-800' };
    return { text: strain.type, bg: 'bg-emerald-100 text-emerald-800' };
  };

  const badge = displayBadge();

  const toggleCondition = (cond: string) => {
    if (selectedConditions.includes(cond)) {
      setSelectedConditions(selectedConditions.filter(c => c !== cond));
    } else {
      setSelectedConditions([...selectedConditions, cond]);
    }
  };

  const toggleSideEffect = (effect: string) => {
    if (effect === 'Nenhum efeito adverso') {
      setSelectedSideEffects(['Nenhum efeito adverso']);
      return;
    }
    const withoutNone = selectedSideEffects.filter(e => e !== 'Nenhum efeito adverso');
    if (withoutNone.includes(effect)) {
      const remaining = withoutNone.filter(e => e !== effect);
      setSelectedSideEffects(remaining.length === 0 ? ['Nenhum efeito adverso'] : remaining);
    } else {
      setSelectedSideEffects([...withoutNone, effect]);
    }
  };

  // SUBMETER AVALIAÇÃO (Relato não é mais obrigatório!)
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    setSubmitting(true);
    const finalName = user?.user_metadata?.full_name || (patientName.trim() || 'Paciente Anônimo');
    
    let allConditions = [...selectedConditions];
    if (customCondition.trim()) {
      allConditions.push(customCondition.trim());
    }
    if (allConditions.length === 0) allConditions = ['Uso Terapêutico Geral'];

    let allSides = [...selectedSideEffects];
    if (customSideEffect.trim()) {
      allSides = allSides.filter(s => s !== 'Nenhum efeito adverso');
      allSides.push(customSideEffect.trim());
    }

    const finalPositives = positiveEffectInput.trim() 
      ? positiveEffectInput.split(',').map(s => s.trim()) 
      : ['Eficácia no tratamento'];

    const matchedAssoc = strain.associations?.find(a => a.associationName === selectedAssoc);
    const assocId = matchedAssoc?.associationId || selectedAssoc.toLowerCase().replace(/\s+/g, '-');
    const isVerified = !!user;

    const finalComment = comment.trim() || `Avaliou com ${rating} estrelas para ${allConditions.join(', ')}.`;

    const newReview: PatientReview = {
      id: Date.now().toString(),
      strainId: strain.id,
      strainName: strain.name,
      associationId: assocId,
      associationName: selectedAssoc,
      rating,
      patientName: finalName,
      conditions: allConditions,
      positiveEffects: finalPositives,
      sideEffects: allSides,
      comment: finalComment,
      isVerified,
      date: 'Hoje'
    };

    if (supabase) {
      try {
        await supabase.from('reviews').insert({
          strain_id: strain.id,
          strain_name: strain.name,
          association_id: assocId,
          association_name: selectedAssoc,
          rating,
          patient_name: finalName,
          conditions: allConditions,
          positive_effects: finalPositives,
          side_effects: allSides,
          comment: finalComment,
          is_verified: isVerified
        });
      } catch (err) {
        console.error('Erro ao salvar:', err);
      }
    }

    setReviews([newReview, ...reviews]);
    setComment('');
    setPositiveEffectInput('');
    setCustomCondition('');
    setCustomSideEffect('');
    setSelectedConditions([]);
    setShowReviewForm(false);
    setSubmitting(false);
  };

  const avgRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in duration-200">
        
        {/* Header do Modal */}
        <div className="flex items-center justify-between p-6 border-b bg-gray-50/80">
          <div>
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${badge.bg}`}>
                {badge.text}
              </span>
              {avgRating && (
                <span className="flex items-center gap-1 text-xs font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                  <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                  {avgRating} ({reviews.length} avaliações)
                </span>
              )}
            </div>
            <h2 className="text-2xl font-black text-gray-900 mt-1.5">{strain.name}</h2>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Conteúdo com Scroll */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Métricas */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 bg-emerald-50/70 rounded-2xl border border-emerald-100 text-center">
              <span className="text-xs font-medium text-emerald-700 block">THC</span>
              <span className="text-base font-bold text-emerald-950">{strain.thc || 'Presente'}</span>
            </div>
            <div className="p-3.5 bg-blue-50/70 rounded-2xl border border-blue-100 text-center">
              <span className="text-xs font-medium text-blue-700 block">CBD</span>
              <span className="text-base font-bold text-blue-950">{strain.cbd || 'Presente'}</span>
            </div>
          </div>

          {/* Banner de Conexão com o Fummelier IA */}
          <div className="bg-gradient-to-r from-emerald-900 to-teal-900 p-3.5 rounded-2xl text-white flex items-center justify-between text-xs">
            <span className="flex items-center gap-2 font-medium">
              <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
              As avaliações publicadas alimentam diretamente o Fummelier IA em tempo real.
            </span>
          </div>

          {/* Onde Encontrar e Preços */}
          <div className="border border-emerald-200 bg-emerald-50/30 rounded-2xl p-5 shadow-sm">
            <h4 className="text-base font-bold text-gray-900 flex items-center gap-2 mb-3">
              <DollarSign className="w-5 h-5 text-emerald-600" />
              Preços e Associações Disponíveis
            </h4>
            
            {strain.associations && strain.associations.length > 0 ? (
              <div className="space-y-3">
                {strain.associations.map((assoc) => (
                  <div
                    key={assoc.associationId}
                    className="p-4 bg-white rounded-xl border border-gray-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                  >
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-emerald-600" />
                      <span className="font-bold text-gray-900 text-sm">{assoc.associationName}</span>
                      {assoc.cultivationType && (
                        <span className="text-[10px] px-2 py-0.5 font-semibold rounded bg-gray-100 text-gray-700 border">
                          {assoc.cultivationType}
                        </span>
                      )}
                    </div>
                    <div className="bg-emerald-50 px-3.5 py-1.5 rounded-xl border border-emerald-200/80">
                      <span className="text-sm font-extrabold text-emerald-950">{assoc.priceDisplay}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-white border text-center text-sm text-gray-500">
                Consulte a disponibilidade diretamente com as associações.
              </div>
            )}
          </div>

          {/* SESSÃO DE AVALIAÇÕES */}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-emerald-600" />
                  Avaliações de Pacientes Real-World ({reviews.length})
                </h4>
                <p className="text-xs text-gray-500">Relatos e desfechos clínicos reportados por pacientes</p>
              </div>

              <button
                type="button"
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="px-3.5 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-xl transition-all flex items-center gap-1"
              >
                <MessageSquarePlus className="w-3.5 h-3.5" />
                {showReviewForm ? 'Fechar' : '+ Avaliar em 1 Clique'}
              </button>
            </div>

            {/* FORMULÁRIO RÁPIDO DE AVALIAÇÃO */}
            {showReviewForm && (
              <form onSubmit={handleSubmitReview} className="bg-gray-50 border border-emerald-200 p-4 sm:p-5 rounded-2xl mb-6 space-y-4 animate-in fade-in">
                
                {/* Identificação */}
                {user ? (
                  <div className="text-xs text-emerald-800 font-medium flex items-center gap-1.5 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Avaliando como <strong>{user.user_metadata?.full_name || user.email}</strong> (Relato Verificado)
                  </div>
                ) : (
                  <div>
                    <label className="text-[11px] font-bold text-gray-700 block mb-1">Seu Nome ou Iniciais (Opcional)</label>
                    <input
                      type="text"
                      placeholder="Ex: Pedro M. (ou deixe em branco para anônimo)"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:border-emerald-500"
                    />
                  </div>
                )}

                {/* Nota e Associação */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-gray-700 block mb-1">Sua Avaliação (Estrelas):</label>
                    <div className="flex items-center gap-1.5 h-[38px]">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="p-1 text-amber-400 hover:scale-110 transition-transform"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              star <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-xs font-bold text-gray-700 ml-1">({rating}/5)</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-gray-700 block mb-1">Associação Dispensadora:</label>
                    <select
                      value={selectedAssoc}
                      onChange={(e) => setSelectedAssoc(e.target.value)}
                      className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-800 outline-none focus:border-emerald-500"
                    >
                      {strain.associations && strain.associations.length > 0 ? (
                        strain.associations.map((a) => (
                          <option key={a.associationId} value={a.associationName}>
                            {a.associationName}
                          </option>
                        ))
                      ) : (
                        <>
                          <option value="Liva">Liva</option>
                          <option value="CannabCura">CannabCura</option>
                          <option value="Instituto Damasceno">Instituto Damasceno</option>
                          <option value="Outra Associação">Outra Associação</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>

                {/* Condições Tratadas */}
                <div>
                  <label className="text-[11px] font-bold text-gray-700 block mb-1.5">
                    Condição(ões) Tratada(s):
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {COMMON_CONDITIONS.map((cond) => {
                      const isSelected = selectedConditions.includes(cond);
                      return (
                        <button
                          key={cond}
                          type="button"
                          onClick={() => toggleCondition(cond)}
                          className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition-all ${
                            isSelected
                              ? 'bg-emerald-600 text-white shadow-sm'
                              : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                          }`}
                        >
                          {isSelected ? '✓ ' : '+ '}{cond}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Benefícios Sentidos */}
                <div>
                  <label className="text-[11px] font-bold text-emerald-800 block mb-1">
                    Benefícios Rápido (ex: alívio rápido, relaxamento muscular):
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Alívio em 15 minutos, bom para dormir"
                    value={positiveEffectInput}
                    onChange={(e) => setPositiveEffectInput(e.target.value)}
                    className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Comentário Opcional */}
                <div>
                  <label className="text-[11px] font-bold text-gray-700 block mb-1">
                    Comentário ou Relato (Opcional):
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Comentários adicionais (opcional)..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:border-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  {submitting ? 'Enviando...' : 'Publicar Avaliação Rápida'}
                </button>
              </form>
            )}

            {/* LISTAGEM DE AVALIAÇÕES REAIS */}
            {reviews.length > 0 ? (
              <div className="space-y-3.5">
                {reviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-2xl bg-gray-50 border border-gray-200/90 space-y-2.5">
                    
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-gray-900 text-xs sm:text-sm">{rev.patientName}</span>
                        
                        {rev.isVerified ? (
                          <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-0.5 border border-emerald-200">
                            <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verificado
                          </span>
                        ) : (
                          <span className="text-[10px] font-medium bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                            <Globe className="w-3 h-3 text-gray-500" /> Comunidade
                          </span>
                        )}

                        <div className="flex items-center text-amber-500">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                      </div>

                      <span className="text-[11px] text-gray-400">
                        {rev.date} • Dispensado por: <strong className="text-gray-700">{rev.associationName}</strong>
                      </span>
                    </div>

                    {/* Tags de Condições */}
                    {rev.conditions && rev.conditions.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {rev.conditions.map((c, i) => (
                          <span key={i} className="text-[10px] font-semibold bg-gray-200/70 text-gray-800 px-2 py-0.5 rounded-md">
                            🩺 {c}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Tags de Benefícios */}
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {rev.positiveEffects.map((pos, idx) => (
                        <span key={idx} className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" /> {pos}
                        </span>
                      ))}
                    </div>

                    {rev.comment && (
                      <p className="text-xs text-gray-700 leading-relaxed pt-1">
                        "{rev.comment}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-gray-50 border border-dashed border-gray-200 text-center space-y-2">
                <p className="text-xs text-gray-500 font-medium">
                  Ainda não há avaliações registradas para esta genética.
                </p>
                <button
                  onClick={() => setShowReviewForm(true)}
                  className="text-xs font-bold text-emerald-700 hover:underline inline-flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Seja o primeiro a avaliar em 1 clique!
                </button>
              </div>
            )}

          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 flex justify-end">
          <button onClick={onClose} className="px-5 py-2 text-xs font-bold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-100">
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};

export default StrainModal;
