import React, { useState, useEffect } from 'react';
import { 
  User, 
  ShieldCheck, 
  Star, 
  LogOut, 
  MessageSquare, 
  Building2, 
  Save, 
  Check, 
  Sparkles, 
  Users, 
  SlidersHorizontal,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  Lock,
  ArrowUpRight,
  Filter
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAssociations, Association } from '../hooks/useAssociations';
import { AssociationModal } from './AssociationModal';

interface UserReview {
  id: string;
  strain_id: string;
  strain_name: string;
  association_name: string;
  rating: number;
  conditions: string[];
  positive_effects: string[];
  side_effects: string[];
  comment: string;
  created_at: string;
  patient_name?: string;
  is_verified?: boolean;
}

// Lista de e-mails autorizados para visualizar o Painel Admin Secreto
const ADMIN_EMAILS = [
  'bestflightconsultoria',
  'lucas',
  'admin@cannaguia.com.br'
];

export const MyProfile: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [reviews, setReviews] = useState<UserReview[]>([]);
  const [allReviewsAdmin, setAllReviewsAdmin] = useState<any[]>([]);
  const [adminFilter, setAdminFilter] = useState<'all' | 'verified' | 'anonymous'>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'profile' | 'reviews' | 'associations' | 'admin'>('profile');
  const [selectedAssoc, setSelectedAssoc] = useState<Association | null>(null);
  const { associations } = useAssociations();

  // Dados do Perfil Terapêutico
  const [fullName, setFullName] = useState('');
  const [mainCondition, setMainCondition] = useState('Ansiedade & Estresse');
  const [prescribingDoctor, setPrescribingDoctor] = useState('');
  const [treatmentStatus, setTreatmentStatus] = useState('em_tratamento');
  const [savingProfile, setSavingProfile] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    async function checkUserAndLoadData() {
      if (!supabase) {
        setLoading(false);
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const savedDoc = user.user_metadata?.prescribing_doctor || localStorage.getItem('cannaguia_user_prescribing_doctor') || '';
        setFullName(user.user_metadata?.full_name || user.email?.split('@')[0] || '');
        setMainCondition(user.user_metadata?.main_condition || 'Ansiedade & Estresse');
        setPrescribingDoctor(savedDoc);
        setTreatmentStatus(user.user_metadata?.treatment_status || 'em_tratamento');

        try {
          const uName = user.user_metadata?.full_name || '';
          const uEmail = user.email || '';

          const { data, error } = await supabase
            .from('reviews')
            .select('*')
            .order('created_at', { ascending: false });

          if (!error && data) {
            setAllReviewsAdmin(data);

            const filtered = data.filter((r: any) => 
              (r.user_id && r.user_id === user.id) ||
              (uName && r.patient_name?.toLowerCase().includes(uName.toLowerCase())) ||
              (uEmail && r.patient_name?.toLowerCase().includes(uEmail.toLowerCase()))
            );

            setReviews(filtered);
          }
        } catch (err) {
          console.error('Erro ao carregar dados do usuário:', err);
        }
      }
      setLoading(false);
    }

    checkUserAndLoadData();
  }, []);

  const isAdmin = React.useMemo(() => {
    if (!user || !user.email) return false;
    const emailLower = user.email.toLowerCase();
    return ADMIN_EMAILS.some(adminKeyword => emailLower.includes(adminKeyword.toLowerCase()));
  }, [user]);

  const handleGoogleLogin = async () => {
    if (!supabase) return;
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);

    if (supabase && user) {
      try {
        if (prescribingDoctor.trim()) {
          localStorage.setItem('cannaguia_user_prescribing_doctor', prescribingDoctor.trim());
        }

        const { data: updateRes } = await supabase.auth.updateUser({
          data: {
            full_name: fullName,
            main_condition: mainCondition,
            prescribing_doctor: prescribingDoctor.trim(),
            treatment_status: treatmentStatus
          }
        });

        if (updateRes?.user) {
          setUser(updateRes.user);
        }

        // Atualiza retroativamente no banco Supabase
        if (prescribingDoctor.trim()) {
          try {
            await supabase
              .from('reviews')
              .update({ prescribing_doctor: prescribingDoctor.trim() })
              .eq('user_id', user.id);
          } catch (e) {}
        }

        setAllReviewsAdmin(prev => prev.map(r => {
          const isMatch = (r.user_id && r.user_id === user.id) || 
            (r.patient_name && fullName && r.patient_name.toLowerCase().includes(fullName.toLowerCase()));
          if (isMatch) {
            return { ...r, prescribing_doctor: prescribingDoctor.trim() };
          }
          return r;
        }));

        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      } catch (err) {
        console.error('Erro ao atualizar perfil:', err);
      }
    }
    setSavingProfile(false);
  };

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
      setUser(null);
    }
  };

  // Filtragem exclusiva para o Painel Admin
  const filteredAdminReviews = React.useMemo(() => {
    if (adminFilter === 'verified') {
      return allReviewsAdmin.filter(r => r.is_verified || r.user_id);
    }
    if (adminFilter === 'anonymous') {
      return allReviewsAdmin.filter(r => !r.is_verified && !r.user_id);
    }
    if (adminFilter === 'has_doctor') {
      return allReviewsAdmin.filter(r => r.prescribing_doctor && r.prescribing_doctor.trim() !== '');
    }
    return allReviewsAdmin;
  }, [allReviewsAdmin, adminFilter]);

  // Lista de associações que o paciente registrou em seus relatos
  const myAssociatedEntities = React.useMemo(() => {
    if (!reviews || reviews.length === 0) return [];
    const names = new Set(reviews.map(r => r.association_name?.toLowerCase()));
    return associations.filter(a => names.has(a.name.toLowerCase()) || names.has(a.acronym.toLowerCase()));
  }, [reviews, associations]);

  if (loading) {
    return <div className="py-12 text-center text-gray-500 text-sm">Carregando seu perfil...</div>;
  }

  // Se NÃO estiver logado, exibe a tela de convite para Login com Google
  if (!user) {
    return (
      <div className="max-w-md mx-auto my-8 bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xl text-center space-y-6 animate-in fade-in">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
          <User className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-black text-gray-900">Meu Diário CannaGuia</h2>
          <p className="text-xs text-gray-600 leading-relaxed">
            Faça login com sua conta do Google para salvar seus relatos terapêuticos, acompanhar seus tratamentos e acessar seus históricos.
          </p>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full py-3.5 px-4 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-bold text-xs rounded-2xl shadow-sm transition-all flex items-center justify-center gap-3"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          <span>Entrar com Conta do Google</span>
        </button>

        <p className="text-[10px] text-gray-400">
          🔒 Conexão segura em conformidade com a LGPD. Seus dados são confidenciais.
        </p>
      </div>
    );
  }

  // SE ESTIVER LOGADO -> Exibe a área do paciente
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Banner de Boas-Vindas */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-emerald-700/80 rounded-2xl flex items-center justify-center text-xl font-black border border-emerald-500/40 shadow-inner">
            {user.user_metadata?.avatar_url ? (
              <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-full h-full rounded-2xl object-cover" />
            ) : (
              <span>{user.email?.[0].toUpperCase()}</span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-white">{fullName || user.email}</h1>
              <span className="text-[10px] font-bold bg-emerald-500/30 text-emerald-200 px-2.5 py-0.5 rounded-full border border-emerald-400/40 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-300" /> Paciente Verificado
              </span>
            </div>
            <p className="text-xs text-emerald-200 mt-0.5">{user.email}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-emerald-800/80 hover:bg-emerald-700 text-emerald-200 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border border-emerald-600/40 shrink-0"
        >
          <LogOut className="w-3.5 h-3.5" /> Sair da Conta
        </button>
      </div>

      {/* Navegação por Sub-abas do Perfil */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'profile'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <User className="w-4 h-4" /> Perfil Terapêutico
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'reviews'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <MessageSquare className="w-4 h-4" /> Minhas Avaliações ({reviews.length})
        </button>

        <button
          onClick={() => setActiveTab('associations')}
          className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'associations'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <Building2 className="w-4 h-4" /> Minhas Associações ({myAssociatedEntities.length})
        </button>

        {/* Tab Secreta de Admin (Moderação de Relatos) */}
        {isAdmin && (
          <button
            onClick={() => setActiveTab('admin')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap flex items-center gap-2 border ${
              activeTab === 'admin'
                ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                : 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
            }`}
          >
            <Lock className="w-4 h-4 text-amber-500" /> Painel Restrito de Gestão
          </button>
        )}
      </div>

      {/* 1. PERFIL TERAPÊUTICO DO PACIENTE */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="space-y-1 border-b border-gray-100 pb-4">
            <h3 className="text-lg font-black text-gray-900">Seu Perfil de Acompanhamento Terapêutico</h3>
            <p className="text-xs text-gray-500">Mantenha seus dados clínicos atualizados para obter melhores recomendações no Fummelier IA.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 block">Nome Completo do Paciente:</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Seu nome completo"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 block">Principal Condição Tratada:</label>
              <select
                value={mainCondition}
                onChange={(e) => setMainCondition(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold outline-none focus:border-emerald-500"
              >
                <option value="Ansiedade & Estresse">🧘 Ansiedade & Estresse</option>
                <option value="Insônia & Sono Profundo">😴 Insônia & Sono Profundo</option>
                <option value="Dores Crônicas & Enxaqueca">🦴 Dores Crônicas & Enxaqueca</option>
                <option value="Foco, TDAH & Concentração">🧠 Foco, TDAH & Concentração</option>
                <option value="Relaxamento Físico">💆 Relaxamento Físico & Muscular</option>
                <option value="Outra Condição">🩺 Outra Condição Clínica</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 block">Médico Prescritor Assistente (Opcional):</label>
              <input
                type="text"
                value={prescribingDoctor}
                onChange={(e) => setPrescribingDoctor(e.target.value)}
                placeholder="Ex: Dr. Carlos Eduardo Silva (CRM 184.920)"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 block">Status Atual do Tratamento:</label>
              <select
                value={treatmentStatus}
                onChange={(e) => setTreatmentStatus(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold outline-none focus:border-emerald-500"
              >
                <option value="iniciante">🌱 Iniciando Acompanhamento (Primeiros Meses)</option>
                <option value="em_tratamento">🌿 Em Tratamento Ativo (Ajuste de Dosagem)</option>
                <option value="estavel">✨ Tratamento Estabilizado com Sucesso</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
            <span className="text-[11px] text-gray-400">Dados salvos com criptografia na nuvem.</span>
            
            <button
              type="submit"
              disabled={savingProfile}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-200" /> Perfil Atualizado!
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" /> {savingProfile ? 'Salvando...' : 'Salvar Alterações'}
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* 2. PAINEL ADMIN RESTRITO (Visível apenas para admins) */}
      {activeTab === 'admin' && isAdmin && (
        <div className="bg-white rounded-3xl border-2 border-amber-400 p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-amber-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 text-[10px] font-black bg-amber-100 text-amber-900 rounded-md border border-amber-300 uppercase">
                  Acesso Restrito ao Diretor
                </span>
                <h3 className="text-xl font-black text-gray-900">Painel de Moderação & Gestão Geral</h3>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Visualização do banco de dados em tempo real dos relatos de pacientes e métricas do CannaGuia.
              </p>
            </div>

            {/* Filtro por Registro do Usuário */}
            <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-xl shrink-0">
              <button
                onClick={() => setAdminFilter('all')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                  adminFilter === 'all' ? 'bg-amber-600 text-white shadow-xs' : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                Todos ({allReviewsAdmin.length})
              </button>
              <button
                onClick={() => setAdminFilter('verified')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                  adminFilter === 'verified' ? 'bg-emerald-600 text-white shadow-xs' : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                🛡️ Registrados ({allReviewsAdmin.filter(r => r.is_verified || r.user_id).length})
              </button>
              <button
                onClick={() => setAdminFilter('anonymous')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                  adminFilter === 'anonymous' ? 'bg-gray-700 text-white shadow-xs' : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                🌐 Anônimos ({allReviewsAdmin.filter(r => !r.is_verified && !r.user_id).length})
              </button>
              <button
                onClick={() => setAdminFilter('has_doctor')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                  adminFilter === 'has_doctor' ? 'bg-teal-700 text-white shadow-xs' : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                🩺 Com Prescritor ({allReviewsAdmin.filter(r => r.prescribing_doctor && r.prescribing_doctor.trim() !== '').length})
              </button>
            </div>
          </div>

          {/* Cards de Métricas Admin */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-center">
              <Users className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
              <span className="text-2xl font-black text-emerald-950 block">{filteredAdminReviews.length}</span>
              <span className="text-xs font-bold text-emerald-700">
                {adminFilter === 'verified' ? 'Relatos de Usuários Registrados' : adminFilter === 'anonymous' ? 'Relatos Anônimos' : adminFilter === 'has_doctor' ? 'Relatos com Médico Prescritor' : 'Total de Relatos no Banco'}
              </span>
            </div>

            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 text-center">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500 mx-auto mb-1" />
              <span className="text-2xl font-black text-amber-950 block">
                {filteredAdminReviews.length > 0 ? (filteredAdminReviews.reduce((a, b) => a + (b.rating || 5), 0) / filteredAdminReviews.length).toFixed(1) : '5.0'}
              </span>
              <span className="text-xs font-bold text-amber-800">Nota Média do Filtro Selecionado</span>
            </div>

            <div className="p-4 bg-teal-50 rounded-2xl border border-teal-100 text-center">
              <Building2 className="w-5 h-5 text-teal-600 mx-auto mb-1" />
              <span className="text-2xl font-black text-teal-950 block">{associations.length}</span>
              <span className="text-xs font-bold text-teal-700">Associações Mapeadas</span>
            </div>
          </div>

          {/* Listagem Geral de Avaliações Registradas */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
                Exibindo {filteredAdminReviews.length} relatos ({adminFilter === 'verified' ? 'Apenas Usuários Logados com Google' : adminFilter === 'anonymous' ? 'Apenas Anônimos' : adminFilter === 'has_doctor' ? 'Apenas Relatos com Médico Prescritor' : 'Todos os Relatos'}):
              </h4>
            </div>

            {filteredAdminReviews.length === 0 ? (
              <div className="p-8 bg-gray-50 rounded-2xl text-center text-xs text-gray-500 border border-dashed">
                Nenhum relato encontrado para o filtro selecionado ({adminFilter}).
              </div>
            ) : (
              <div className="overflow-x-auto border border-gray-200 rounded-2xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 text-gray-700 font-bold border-b border-gray-200">
                    <tr>
                      <th className="p-3">Data</th>
                      <th className="p-3">Tipo</th>
                      <th className="p-3">Paciente</th>
                      <th className="p-3">Médico Prescritor</th>
                      <th className="p-3">Genética / Produto</th>
                      <th className="p-3">Associação</th>
                      <th className="p-3">Nota</th>
                      <th className="p-3">Sintomas Tratados</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredAdminReviews.map((r) => (
                      <tr key={r.id} className="hover:bg-emerald-50/40 transition-colors">
                        <td className="p-3 font-medium text-gray-500">
                          {new Date(r.created_at).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="p-3">
                          {r.is_verified || r.user_id ? (
                            <span className="text-[10px] font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-full border border-emerald-200">
                              🛡️ Registrado
                            </span>
                          ) : (
                            <span className="text-[10px] font-medium bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">
                              🌐 Anônimo
                            </span>
                          )}
                        </td>
                        <td className="p-3 font-bold text-gray-900">
                          {r.patient_name || 'Anônimo'}
                        </td>
                        <td className="p-3 font-semibold text-teal-800">
                          {(() => {
                            const activeDoc = prescribingDoctor || user?.user_metadata?.prescribing_doctor || localStorage.getItem('cannaguia_user_prescribing_doctor');
                            const matchUser = (r.user_id && r.user_id === user?.id) ||
                              (r.patient_name && (
                                r.patient_name.toLowerCase().includes('lucas') ||
                                (fullName && r.patient_name.toLowerCase().includes(fullName.toLowerCase()))
                              ));
                            return r.prescribing_doctor || (matchUser ? activeDoc : null) || '—';
                          })()}
                        </td>
                        <td className="p-3 font-bold text-emerald-800">
                          {r.strain_name}
                        </td>
                        <td className="p-3 text-gray-600">
                          {r.association_name}
                        </td>
                        <td className="p-3 font-black text-amber-600">
                          ⭐ {r.rating}/5
                        </td>
                        <td className="p-3 text-gray-600">
                          {(r.conditions || []).join(', ')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. MINHAS AVALIAÇÕES */}
      {activeTab === 'reviews' && (
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <div className="p-10 bg-white rounded-3xl border border-dashed border-gray-300 text-center space-y-2">
              <p className="text-xs font-medium text-gray-500">
                Você ainda não registrou avaliações para suas genéticas ou óleos.
              </p>
              <p className="text-[11px] text-gray-400">
                Abra qualquer produto no catálogo e clique em <strong>+ Avaliar em 1 Clique</strong> para salvar no seu diário.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reviews.map((rev) => (
                <div 
                  key={rev.id}
                  className="p-5 bg-white rounded-3xl border border-gray-200/90 shadow-sm space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-extrabold text-base text-gray-900">{rev.strain_name}</h3>
                        <span className="text-[11px] text-gray-500">
                          Dispensado por: <strong className="text-gray-800">{rev.association_name}</strong>
                        </span>
                      </div>

                      <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-xs font-black text-amber-900">{rev.rating}/5</span>
                      </div>
                    </div>

                    {/* Condições Clínicas */}
                    {rev.conditions && rev.conditions.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {rev.conditions.map((c, i) => (
                          <span key={i} className="text-[10px] font-semibold bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md">
                            🩺 {c}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Benefícios vs Reações Adversas */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {rev.positive_effects?.map((pos, idx) => (
                        <span key={idx} className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" /> {pos}
                        </span>
                      ))}

                      {rev.side_effects?.map((side, idx) => (
                        <span key={idx} className="text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <AlertTriangle className="w-2.5 h-2.5 text-amber-600" /> {side}
                        </span>
                      ))}
                    </div>

                    {rev.comment && (
                      <p className="text-xs text-gray-600 italic pt-1 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                        "{rev.comment}"
                      </p>
                    )}
                  </div>

                  <span className="text-[10px] text-gray-400 block text-right pt-2 border-t border-gray-100">
                    Avaliado em {new Date(rev.created_at).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4. MINHAS ASSOCIAÇÕES */}
      {activeTab === 'associations' && (
        <div className="space-y-4">
          {myAssociatedEntities.length === 0 ? (
            <div className="p-10 bg-white rounded-3xl border border-dashed border-gray-300 text-center space-y-2">
              <p className="text-xs font-medium text-gray-500">
                Nenhuma associação vinculada ao seu histórico até o momento.
              </p>
              <p className="text-[11px] text-gray-400">
                Ao registrar avaliações selecionando a associação dispensadora, ela aparecerá automaticamente aqui com seus atalhos de cardápio.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {myAssociatedEntities.map((assoc) => (
                <div
                  key={assoc.id}
                  onClick={() => setSelectedAssoc(assoc)}
                  className="p-5 bg-white rounded-3xl border border-gray-200/90 shadow-sm hover:shadow-md hover:border-emerald-500/60 transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div className="space-y-2.5">
                    <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-100 px-2.5 py-1 rounded-md inline-block">
                      {assoc.city} / {assoc.state}
                    </span>
                    <h3 className="text-base font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
                      {assoc.name}
                    </h3>
                  </div>

                  <div className="pt-4 mt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                    <span className="font-semibold text-emerald-700">
                      {assoc.membershipFee || "Sem taxa"}
                    </span>
                    <span className="font-bold text-emerald-600 group-hover:underline flex items-center gap-0.5">
                      Ver cardápio <ArrowUpRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal de Detalhes da Associação */}
      {selectedAssoc && (
        <AssociationModal
          association={selectedAssoc}
          onClose={() => setSelectedAssoc(null)}
        />
      )}

    </div>
  );
};

export default MyProfile;
