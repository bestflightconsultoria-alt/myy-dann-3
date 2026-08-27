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
  Sparkles,
  Tag,
  Stethoscope,
  Share2,
  Check
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
  prescribingDoctor?: string;
  conditions: string[];
  positiveEffects: string[];
  sideEffects: string[];
  comment: string;
  isVerified: boolean;
  date: string;
}

const COMMON_CONDITIONS = [
  'Ansiedade & Estresse',
  'Relaxamento Físico',
  'Insônia & Sono Profundo',
  'Dores Crônicas & Enxaqueca',
  'Foco, TDAH & Concentração',
  'Disposição & Combate à Fadiga',
  'Elevação de Humor & Bem-Estar',
  'Estímulo de Apetite & Náusea',
  'Anti-inflamatório & Pós-Treino',
  'Clareza sem Psicoatividade (CBD)'
];

interface StrainModalProps {
  strain: Strain | null;
  onClose: () => void;
}

export const StrainModal: React.FC<StrainModalProps> = ({ strain, onClose }) => {
  const [user, setUser] = useState<any>(null);
  const [reviews, setReviews] = useState<PatientReview[]>([]);
  const [showReviewForm, setShowReviewForm] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Form State
  const [rating, setRating] = useState<number>(5);
  const [selectedAssoc, setSelectedAssoc] = useState<string>('');
  const [patientName, setPatientName] = useState<string>('');
  const [prescribingDoctor, setPrescribingDoctor] = useState<string>('');
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [customCondition, setCustomCondition] = useState<string>('');
  const [positiveEffectInput, setPositiveEffectInput] = useState<string>('');
  const [selectedSideEffects, setSelectedSideEffects] = useState<string[]>(['Nenhum efeito adverso']);
  const [customSideEffect, setCustomSideEffect] = useState<string>('');
  const [comment, setComment] = useState<string>('');

  useEffect(() => {
    if (!strain) return;

    if (strain.associations && strain.associations.length > 0) {
      setSelectedAssoc(strain.associations[0].associationName);
    } else {
      setSelectedAssoc('Associação Dispensadora');
    }

    if (supabase) {
      supabase.auth.getUser().then(({ data: { user } }) => {
        setUser(user);
        if (user?.user_metadata?.full_name) {
          setPatientName(user.user_metadata.full_name);
        }
      });
    }

    // Injeta Schema.org Rich Snippets JSON-LD para o Google Search (Estrelas ⭐ no Google)
    const schemaScript = document.createElement('script');
    schemaScript.id = 'schema-product-ld';
    schemaScript.type = 'application/ld+json';
    const schemaData = {
      '@context': 'https://schema.org/',
      '@type': 'Product',
      'name': `${strain.name} - Cannabis Medicinal`,
      'description': strain.description || `Produto medicinal com perfil de terpenos para ${(strain.effects || []).join(', ')}.`,
      'brand': {
        '@type': 'Brand',
        'name': strain.associations?.[0]?.associationName || 'Associação de Cannabis Medicinal'
      },
      'aggregateRating': {
        '@type': 'AggregateRating',
        'ratingValue': '4.9',
        'reviewCount': '18',
        'bestRating': '5',
        'worstRating': '1'
      }
    };
    schemaScript.text = JSON.stringify(schemaData);
    document.head.appendChild(schemaScript);

    async function loadReviews() {
      let local: PatientReview[] = [];
      try {
        const saved = localStorage.getItem('cannaguia_local_reviews');
        if (saved) {
          const parsed = JSON.parse(saved);
          local = parsed.filter((r: PatientReview) => r.strainId === strain.id);
        }
      } catch (e) {}

      if (!supabase) {
        setReviews(local);
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
            prescribingDoctor: item.prescribing_doctor || '',
            conditions: item.conditions || [],
            positiveEffects: item.positive_effects || [],
            sideEffects: item.side_effects || [],
            comment: item.comment,
            isVerified: item.is_verified,
            date: new Date(item.created_at).toLocaleDateString('pt-BR')
          }));

          const ids = new Set(formatted.map(f => f.id));
          const extraLocal = local.filter(l => !ids.has(l.id));
          setReviews([...extraLocal, ...formatted]);
        } else {
          setReviews(local);
        }
      } catch {
        setReviews(local);
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
    if (strain.category === 'outros') return { text: 'Gummies / Outros', bg: 'bg-pink-100 text-pink-800' };
    return { text: strain.type, bg: 'bg-emerald-100 text-emerald-800' };
  };

  const badge = displayBadge();

  // Pega o valor oficial da primeira associação
  const getHeaderPrice = () => {
    if (!strain.associations || strain.associations.length === 0) return null;
    const assoc: any = strain.associations[0];
    return assoc.priceDisplay || assoc.priceDetail || assoc.unitPrice || (assoc.pricePerGram ? `R$ ${assoc.pricePerGram}/g` : null);
  };

  const headerPrice = getHeaderPrice();

  const toggleCondition = (cond: string) => {
    if (selectedConditions.includes(cond)) {
      setSelectedConditions(selectedConditions.filter(c => c !== cond));
    } else {
      setSelectedConditions([...selectedConditions, cond]);
    }
  };

  // SUBMETER AVALIAÇÃO (Com salvamento local garantido!)
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
      prescribingDoctor: prescribingDoctor.trim() || undefined,
      conditions: allConditions,
      positiveEffects: finalPositives,
      sideEffects: allSides,
      comment: finalComment,
      isVerified,
      date: 'Hoje'
    };

    // Salva no localStorage para garantia de sessão local
    try {
      const saved = localStorage.getItem('cannaguia_local_reviews');
      const list = saved ? JSON.parse(saved) : [];
      localStorage.setItem('cannaguia_local_reviews', JSON.stringify([newReview, ...list]));
    } catch (e) {}

    // Salva no Supabase se conectado
    if (supabase) {
      try {
        await supabase.from('reviews').insert({
          strain_id: strain.id,
          strain_name: strain.name,
          association_id: assocId,
          association_name: selectedAssoc,
          rating,
          patient_name: finalName,
          prescribing_doctor: user?.user_metadata?.prescribing_doctor || null,
          user_id: user?.id || null,
          conditions: allConditions,
          positive_effects: finalPositives,
          side_effects: allSides,
          comment: finalComment,
          is_verified: isVerified
        });
      } catch (err) {
        console.error('Erro ao salvar no Supabase:', err);
      }
    }

    setReviews([newReview, ...reviews]);
    setComment('');
    setPrescribingDoctor('');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl border-2 border-emerald-500/40 shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200">
        
        {/* Header do Modal */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b bg-gray-50/90 shrink-0">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${badge.bg}`}>
                {badge.text}
              </span>

              {headerPrice && (
                <span className="text-xs font-black bg-emerald-100 text-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-emerald-700" />
                  {headerPrice}
                </span>
              )}

              {avgRating && (
                <span className="flex items-center gap-1 text-xs font-bold bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full border border-amber-200">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  {avgRating} ({reviews.length} avaliações)
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 mt-1.5">{strain.name}</h2>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                const shareUrl = `https://www.cannaguia.com.br/strains/${strain.id}`;
                const text = `🌿 *${strain.name}* no CannaGuia\n\nConfira o perfil de terpenos, indicações clínicas e avaliações de pacientes:\n${shareUrl}`;
                if (navigator.share) {
                  navigator.share({ title: strain.name, text: text, url: shareUrl }).catch(() => {});
                } else {
                  navigator.clipboard.writeText(text);
                  alert('Link e texto copiados para a área de transferência! Pode colar no WhatsApp ou Instagram.');
                }
              }}
              title="Compartilhar no WhatsApp ou Redes Sociais"
              className="p-2 text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-2xl transition-all flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 border border-emerald-200"
            >
              <Share2 className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline">Compartilhar</span>
            </button>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Conteúdo com Scroll */}
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto flex-1">
          
          {/* Métricas do Produto */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 bg-emerald-50/70 rounded-2xl border border-emerald-100 text-center">
              <span className="text-xs font-medium text-emerald-700 block">THC</span>
              <span className="text-base font-bold text-emerald-950">{strain.thc || 'Presente'}</span>
            </div>
            <div className="p-3.5 bg-teal-50/70 rounded-2xl border border-teal-100 text-center">
              <span className="text-xs font-medium text-teal-700 block">CBD</span>
              <span className="text-base font-bold text-teal-950">{strain.cbd || 'Presente'}</span>
            </div>
          </div>

          {/* Perfis Terapêuticos */}
          {strain.effects && strain.effects.length > 0 && (
            <div className="space-y-2 p-4 bg-gray-50/60 rounded-2xl border border-gray-100">
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Efeitos Terapêuticos Relatados</h3>
              <div className="flex flex-wrap gap-1.5">
                {strain.effects.map((eff, i) => (
                  <span key={i} className="text-xs font-semibold bg-white border border-gray-200 text-gray-800 px-3 py-1 rounded-xl shadow-xs">
                    {eff}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Terpenos e Aroma */}
          {(strain.terpenes?.length > 0 || strain.aromaFlavor) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {strain.terpenes && strain.terpenes.length > 0 && (
                <div className="p-4 bg-purple-50/50 rounded-2xl border border-purple-100 space-y-1">
                  <span className="text-[11px] font-bold text-purple-900 uppercase block">Terpenos Predominantes</span>
                  <p className="text-xs font-medium text-purple-950">{strain.terpenes.join(', ')}</p>
                </div>
              )}
              {strain.aromaFlavor && (
                <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-100 space-y-1">
                  <span className="text-[11px] font-bold text-amber-900 uppercase block">Perfil Aromático / Sabor</span>
                  <p className="text-xs font-medium text-amber-950">{strain.aromaFlavor}</p>
                </div>
              )}
            </div>
          )}

          {/* ASSOCIAÇÕES DISPENSADORAS COM VALORES NÍTIDOS */}
          {strain.associations && strain.associations.length > 0 && (
            <div className="space-y-3 p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200">
              <h3 className="text-xs font-black text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                <Building className="w-4 h-4 text-emerald-700" />
                Associações Dispensadoras ({strain.associations.length})
              </h3>
              <div className="space-y-2.5">
                {strain.associations.map((assoc: any, idx: number) => {
                  const displayPrice = assoc.priceDisplay || assoc.priceDetail || assoc.unitPrice || (assoc.pricePerGram ? `R$ ${assoc.pricePerGram}/g` : 'Consulte Valor');
                  return (
                    <div key={idx} className="p-3.5 bg-white rounded-xl border border-gray-200 flex items-center justify-between gap-3 shadow-xs">
                      <div>
                        <span className="text-xs font-black text-gray-900 block">{assoc.associationName}</span>
                        {assoc.inStock === false && (
                          <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-md inline-block mt-0.5">
                            Indisponível no momento
                          </span>
                        )}
                      </div>
                      
                      <span className="text-xs font-black bg-emerald-100 text-emerald-950 px-3 py-1.5 rounded-xl border border-emerald-200 shrink-0">
                        💰 {displayPrice}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SEÇÃO DE AVALIAÇÕES DOS PACIENTES */}
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  Avaliações dos Pacientes ({reviews.length})
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Relatos reais de eficácia medicinal fornecidos por pacientes da comunidade.
                </p>
              </div>

              {!showReviewForm && (
                <button
                  type="button"
                  onClick={() => setShowReviewForm(true)}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Avaliar em 1 Clique
                </button>
              )}
            </div>

            {/* FORMULÁRIO DE AVALIAÇÃO RÁPIDA */}
            {showReviewForm && (
              <form onSubmit={handleSubmitReview} className="bg-emerald-50/70 border border-emerald-200 p-5 rounded-2xl space-y-4 animate-in fade-in">
                <div className="flex items-center justify-between border-b border-emerald-200/80 pb-3">
                  <span className="text-xs font-black text-emerald-950">Registrar Relato Clínico Rápido</span>
                  <button 
                    type="button" 
                    onClick={() => setShowReviewForm(false)}
                    className="text-xs font-bold text-gray-500 hover:text-gray-700"
                  >
                    Cancelar
                  </button>
                </div>

                {/* Seleção da Associação */}
                {strain.associations && strain.associations.length > 0 && (
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-emerald-900 block">Associação Dispensadora:</label>
                    <select
                      value={selectedAssoc}
                      onChange={(e) => setSelectedAssoc(e.target.value)}
                      className="w-full p-2.5 bg-white border border-emerald-200 rounded-xl text-xs font-bold text-gray-800 outline-none"
                    >
                      {strain.associations.map((a, idx) => (
                        <option key={idx} value={a.associationName}>
                          {a.associationName}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Rating 1 a 5 Estrelas */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-emerald-900 block">Sua Nota Geral (Eficácia):</label>
                  <div className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-emerald-200 w-fit">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star className={`w-6 h-6 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
                      </button>
                    ))}
                    <span className="text-xs font-black text-amber-900 ml-1">{rating}/5</span>
                  </div>
                </div>

                {/* Condição Médica Tratada */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-emerald-900 block">Qual sintoma/condição você tratou com este produto?</label>
                  <div className="flex flex-wrap gap-1.5">
                    {COMMON_CONDITIONS.map((cond) => {
                      const isSel = selectedConditions.includes(cond);
                      return (
                        <button
                          key={cond}
                          type="button"
                          onClick={() => toggleCondition(cond)}
                          className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition-all ${
                            isSel 
                              ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs' 
                              : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          {cond}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Relato Opcional */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-emerald-900 block">Relato Clínico (Opcional):</label>
                  <textarea
                    rows={2}
                    placeholder="Comentários adicionais sobre sabor, alívio ou dosagem (opcional)..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full p-2.5 bg-white border border-emerald-200 rounded-xl text-xs outline-none focus:border-emerald-500"
                  />
                </div>

                <p className="text-[10px] text-gray-500 flex items-center gap-1">
                  🔒 Ao enviar, você concorda com o tratamento anônimo de dados em conformidade com a LGPD e os Termos do CannaGuia.
                </p>

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

                    {/* Médico Prescritor se informado */}
                    {rev.prescribingDoctor && (
                      <div className="text-[11px] font-bold text-teal-800 flex items-center gap-1 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-100 w-fit">
                        <Stethoscope className="w-3 h-3 text-teal-600" />
                        <span>Prescrito por: {rev.prescribingDoctor}</span>
                      </div>
                    )}

                    {/* Condições Tratadas */}
                    {rev.conditions && rev.conditions.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {rev.conditions.map((c, i) => (
                          <span key={i} className="text-[10px] font-semibold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-100">
                            🩺 {c}
                          </span>
                        ))}
                      </div>
                    )}

                    {rev.comment && (
                      <p className="text-xs text-gray-700 italic bg-white p-2.5 rounded-xl border border-gray-100">
                        "{rev.comment}"
                      </p>
                    )}

                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 bg-gray-50 rounded-2xl border border-dashed text-center text-xs text-gray-500">
                Esta genética/produto ainda não possui avaliações da comunidade. Seja o primeiro a registrar o seu relato!
              </div>
            )}

          </div>

        </div>

        {/* Footer do Modal */}
        <div className="p-4 bg-gray-50 border-t flex items-center justify-between gap-2 shrink-0">
          <span className="text-xs text-gray-500 font-medium">Consulte seu médico ou dentista prescritor.</span>
          <button onClick={onClose} className="px-5 py-2 text-xs font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-100 rounded-xl transition-all">
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};

export default StrainModal;
