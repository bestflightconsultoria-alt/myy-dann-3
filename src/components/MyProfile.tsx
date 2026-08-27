import React, { useState, useEffect } from 'react';
import { 
  User, 
  Star, 
  Building2, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  LogIn, 
  ArrowUpRight,
  ShieldCheck,
  Stethoscope,
  Save,
  Check,
  Crown,
  Users,
  FileSpreadsheet
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAssociations, Association } from '../hooks/useAssociations';
import { AssociationModal } from './AssociationModal';

interface UserReview {
  id: string;
  strain_id: string;
  strain_name: string;
  association_id: string;
  association_name: string;
  rating: number;
  conditions: string[];
  positive_effects: string[];
  side_effects: string[];
  comment: string;
  created_at: string;
  patient_name?: string;
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
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'profile' | 'reviews' | 'associations' | 'admin'>('profile');
  const [selectedAssoc, setSelectedAssoc] = useState<Association | null>(null);
  const { associations } = useAssociations();

  // Dados do Perfil Terapêutico
  const [fullName, setFullName] = useState('');
  const [mainCondition, setMainCondition] = useState('');
  const [prescribingDoctor, setPrescribingDoctor] = useState('');
  const [treatmentStatus, setTreatmentStatus] = useState('em_tratamento');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    async function checkUserAndLoadData() {
      if (!supabase) {
        setLoading(false);
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        setFullName(user.user_metadata?.full_name || '');
        setMainCondition(user.user_metadata?.main_condition || 'Ansiedade & Estresse');
        setPrescribingDoctor(user.user_metadata?.prescribing_doctor || '');
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
            setReviews(filtered.length > 0 ? filtered : data);
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
        redirectTo: `${window.location.origin}/api/auth/callback`
      }
    });
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);

    if (supabase && user) {
      try {
        await supabase.auth.updateUser({
          data: {
            full_name: fullName,
            main_condition: mainCondition,
            prescribing_doctor: prescribingDoctor,
            treatment_status: treatmentStatus
          }
        });
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      } catch (err) {
        console.error('Erro ao atualizar perfil:', err);
      }
    }
    setSavingProfile(false);
  };

  // Exportar Relatório Admin em CSV
  const handleExportAdminCSV = () => {
    if (allReviewsAdmin.length === 0) return;
    
    const headers = ["ID Avaliacao", "Data", "Nome Paciente", "Associacao", "Genetica / Produto", "Nota Rating", "Condicoes Tratadas", "Efeitos Positivos", "Efeitos Adversos", "Comentario"];
    const csvRows = [headers.join(";")];

    allReviewsAdmin.forEach(r => {
      const row = [
        r.id,
        new Date(r.created_at).toLocaleDateString('pt-BR'),
        `"${r.patient_name || 'Paciente Anônimo'}"`,
        `"${r.association_name || 'Sob Consulta'}"`,
        `"${r.strain_name || ''}"`,
        r.rating || 5,
        `"${(r.conditions || []).join(', ')}"`,
        `"${(r.positive_effects || []).join(', ')}"`,
        `"${(r.side_effects || []).join(', ')}"`,
        `"${(r.comment || '').replace(/"/g, '""')}"`
      ];
      csvRows.push(row.join(";"));
    });

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8-sig;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `relatorio_pacientes_cannaguia_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const myAssociatedEntities = React.useMemo(() => {
    const assocNames = Array.from(new Set(reviews.map(r => r.association_name?.toLowerCase().trim()))).filter(Boolean);
    return associations.filter(a => 
      assocNames.some(name => 
        a.name.toLowerCase().includes(name) || 
        name.includes(a.name.toLowerCase()) || 
        name.includes(a.acronym.toLowerCase())
      )
    );
  }, [reviews, associations]);

  if (loading) {
    return (
      <div className="py-20 text-center text-gray-500 text-sm">
        Carregando seu espaço...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-white rounded-3xl border border-gray-200/90 shadow-xl text-center space-y-5 animate-in fade-in">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
          <User className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-gray-900">Espaço do Paciente</h2>
          <p className="text-xs text-gray-600 leading-relaxed">
            Faça login com a sua conta Google para consultar seu histórico, salvar genéticas favoritas e receber recomendações personalizadas do Fummelier IA.
          </p>
        </div>
        <button
          onClick={handleGoogleLogin}
          className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
        >
          <LogIn className="w-4 h-4" /> Entrar com Google
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Header do Perfil */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 text-emerald-300 font-bold text-xl uppercase">
            {fullName[0] || user.email?.[0] || 'P'}
          </div>
          <div>
            <span className="text-emerald-300 text-xs font-bold uppercase tracking-wider bg-white/10 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Paciente Verificado
            </span>
            <h1 className="text-xl sm:text-2xl font-black">
              {fullName || 'Paciente CannaGuia'}
            </h1>
            <p className="text-xs text-emerald-200/80">{user.email}</p>
          </div>
        </div>

        {/* Estatísticas Rápidas */}
        <div className="flex items-center gap-3">
          <div className="bg-white/10 border border-white/20 px-4 py-2.5 rounded-2xl text-center">
            <span className="text-base font-black block">{reviews.length}</span>
            <span className="text-[10px] text-emerald-200">Genéticas Avaliadas</span>
          </div>
          <div className="bg-white/10 border border-white/20 px-4 py-2.5 rounded-2xl text-center">
            <span className="text-base font-black block">{myAssociatedEntities.length}</span>
            <span className="text-[10px] text-emerald-200">Associações no Histórico</span>
          </div>
        </div>
      </div>

      {/* Navegação de Abas do Perfil */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'profile'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <User className="w-3.5 h-3.5" /> Meu Cadastro Terapêutico
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'reviews'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" /> Minhas Avaliações ({reviews.length})
        </button>

        <button
          onClick={() => setActiveTab('associations')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'associations'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" /> Minhas Associações ({myAssociatedEntities.length})
        </button>

        {/* ABA EXCLUSIVA DO ADMINISTRADOR DO SITE */}
        {isAdmin && (
          <button
            onClick={() => setActiveTab('admin')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'admin'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-amber-50 border border-amber-200 text-amber-900 hover:bg-amber-100'
            }`}
          >
            <Crown className="w-3.5 h-3.5 text-amber-500" /> Painel Admin (Restrito)
          </button>
        )}
      </div>

      {/* 1. CADASTRO TERAPÊUTICO DO PACIENTE */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="bg-white rounded-3xl border border-gray-200/90 p-6 sm:p-8 shadow-xl space-y-5 animate-in fade-in">
          <div>
            <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-emerald-600" />
              Perfil Clínico & Prescrição Medicinal
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Esses dados ajudam o Fummelier IA a recomendar as genéticas e dosagens exatas para a sua prescrição.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            
            {/* Nome Completo */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 block">Nome do Paciente:</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ex: Pedro Henrique Silva"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium outline-none focus:border-emerald-500"
              />
            </div>

            {/* Condição Médica Principal */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 block">Condição Médica Principal:</label>
              <select
                value={mainCondition}
                onChange={(e) => setMainCondition(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 outline-none focus:border-emerald-500"
              >
                <option value="Ansiedade & Estresse">🧘 Ansiedade & Estresse</option>
                <option value="Insônia / Distúrbios do Sono">😴 Insônia / Distúrbios do Sono</option>
                <option value="Dor Crônica / Fibromialgia">🦴 Dor Crônica / Fibromialgia</option>
                <option value="TDAH / Foco">🧠 TDAH / Déficit de Atenção</option>
                <option value="Depressão / Humor">😊 Depressão / Manejo do Humor</option>
                <option value="Autismo (TEA)">🧩 Transtorno do Espectro Autista</option>
                <option value="Epilepsia / Convulsões">⚡ Epilepsia / Crises Convulsivas</option>
                <option value="Outra Condição">🩺 Outra Condição Específica</option>
              </select>
            </div>

            {/* Médico Prescritor */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 block">Médico Prescritor (Opcional):</label>
              <input
                type="text"
                value={prescribingDoctor}
                onChange={(e) => setPrescribingDoctor(e.target.value)}
                placeholder="Ex: Dr. Carlos Silva (ou deixe em branco)"
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium outline-none focus:border-emerald-500"
              />
            </div>

            {/* Status do Tratamento */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 block">Status do Tratamento:</label>
              <select
                value={treatmentStatus}
                onChange={(e) => setTreatmentStatus(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 outline-none focus:border-emerald-500"
              >
                <option value="em_tratamento">🟢 Já estou em Tratamento Medicinal</option>
                <option value="iniciando">🟡 Tenho receita e vou iniciar</option>
                <option value="buscando_medico">🔵 Buscando Médico Prescritor</option>
              </select>
            </div>

          </div>

          <div className="pt-2 flex items-center justify-between">
            {savedSuccess ? (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <Check className="w-4 h-4" /> Perfil Terapêutico atualizado com sucesso!
              </span>
            ) : <span />}

            <button
              type="submit"
              disabled={savingProfile}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {savingProfile ? 'Salvando...' : 'Salvar Perfil Terapêutico'}
            </button>
          </div>
        </form>
      )}

      {/* 2. PAINEL ADMIN RESTRICTO (EXCLUSIVO DO PROPRIETÁRIO DO SITE) */}
      {isAdmin && activeTab === 'admin' && (
        <div className="bg-white rounded-3xl border border-amber-200 p-6 sm:p-8 shadow-xl space-y-6 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black mb-1">
                <Crown className="w-3.5 h-3.5 text-amber-600" /> Acesso Exclusivo do Administrador
              </div>
              <h3 className="text-xl font-black text-gray-900">Relatório Geral de Pacientes & Avaliações</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Esta aba é visível apenas para você. Consulte e exporte os relatos e dados cadastrados.
              </p>
            </div>

            <button
              type="button"
              onClick={handleExportAdminCSV}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <FileSpreadsheet className="w-4 h-4" /> Exportar Planilha CSV
            </button>
          </div>

          {/* Cards de Métricas Admin */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-center">
              <Users className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
              <span className="text-2xl font-black text-emerald-950 block">{allReviewsAdmin.length}</span>
              <span className="text-xs font-bold text-emerald-700">Relatos / Avaliações Registradas</span>
            </div>

            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 text-center">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500 mx-auto mb-1" />
              <span className="text-2xl font-black text-amber-950 block">
                {allReviewsAdmin.length > 0 ? (allReviewsAdmin.reduce((a, b) => a + (b.rating || 5), 0) / allReviewsAdmin.length).toFixed(1) : '5.0'}
              </span>
              <span className="text-xs font-bold text-amber-800">Nota Média Geral do Catálogo</span>
            </div>

            <div className="p-4 bg-teal-50 rounded-2xl border border-teal-100 text-center">
              <Building2 className="w-5 h-5 text-teal-600 mx-auto mb-1" />
              <span className="text-2xl font-black text-teal-950 block">{associations.length}</span>
              <span className="text-xs font-bold text-teal-700">Associações Mapeadas</span>
            </div>
          </div>

          {/* Listagem Geral de Avaliações Registradas */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
              Últimos Relatos Salvos no Banco de Dados:
            </h4>

            {allReviewsAdmin.length === 0 ? (
              <div className="p-8 bg-gray-50 rounded-2xl text-center text-xs text-gray-500 border border-dashed">
                Ainda não há registros no banco de dados. Quando os pacientes avaliarem as genéticas, eles aparecerão organizados nesta tabela.
              </div>
            ) : (
              <div className="overflow-x-auto border border-gray-200 rounded-2xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 text-gray-700 font-bold border-b border-gray-200">
                    <tr>
                      <th className="p-3">Data</th>
                      <th className="p-3">Paciente</th>
                      <th className="p-3">Genética / Produto</th>
                      <th className="p-3">Associação</th>
                      <th className="p-3">Nota</th>
                      <th className="p-3">Sintomas Tratados</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {allReviewsAdmin.map((r) => (
                      <tr key={r.id} className="hover:bg-emerald-50/40 transition-colors">
                        <td className="p-3 font-medium text-gray-500">
                          {new Date(r.created_at).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="p-3 font-bold text-gray-900">
                          {r.patient_name || 'Anônimo'}
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
