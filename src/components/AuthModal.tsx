import React, { useState } from 'react';
import { X, Mail, Lock, User, Stethoscope, Sparkles, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  
  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [prescribingDoctor, setPrescribingDoctor] = useState('');

  // States
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    if (!supabase) return;
    setLoading(true);
    setErrorMessage('');
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Erro ao conectar com a conta do Google.');
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      setErrorMessage('Erro de conexão com o banco de dados.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    if (mode === 'signup') {
      if (!fullName.trim()) {
        setErrorMessage('Por favor, informe seu nome completo.');
        setLoading(false);
        return;
      }
      if (password.length < 6) {
        setErrorMessage('A senha deve ter pelo menos 6 caracteres.');
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password: password,
          options: {
            data: {
              full_name: fullName.trim(),
              prescribing_doctor: prescribingDoctor.trim()
            }
          }
        });

        if (error) {
          if (error.message.includes('already registered')) {
            setErrorMessage('Este e-mail já está cadastrado. Tente fazer o login.');
          } else {
            setErrorMessage(error.message);
          }
          setLoading(false);
          return;
        }

        // Salva prescritor no localStorage para garantir vinculo imediato no perfil
        if (prescribingDoctor.trim()) {
          localStorage.setItem('cannaguia_user_prescribing_doctor', prescribingDoctor.trim());
        }

        setSuccessMessage('Conta criada com sucesso! Você já está conectado.');
        setTimeout(() => {
          onClose();
          if (onSuccess) onSuccess();
        }, 1200);

      } catch (err: any) {
        setErrorMessage(err.message || 'Erro ao criar conta.');
      } finally {
        setLoading(false);
      }

    } else {
      // LOGIN COM EMAIL E SENHA
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password
        });

        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            setErrorMessage('E-mail ou senha incorretos. Verifique suas credenciais.');
          } else {
            setErrorMessage(error.message);
          }
          setLoading(false);
          return;
        }

        setSuccessMessage('Login realizado com sucesso!');
        setTimeout(() => {
          onClose();
          if (onSuccess) onSuccess();
        }, 1000);

      } catch (err: any) {
        setErrorMessage(err.message || 'Erro ao realizar login.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white w-full max-w-md rounded-3xl border border-gray-200 shadow-2xl overflow-hidden flex flex-col my-auto max-h-[85vh] sm:max-h-[90vh]">
        
        {/* Cabeçalho do Modal */}
        <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-teal-950 p-5 sm:p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Espaço do Paciente</span>
          </div>

          <h2 className="text-xl font-black text-white">
            {mode === 'login' ? 'Acesse sua Conta CannaGuia' : 'Criar Conta Gratuita'}
          </h2>
          <p className="text-xs text-emerald-200/90 mt-1 leading-relaxed">
            Seus dados terapêuticos e avaliações protegidos com sigilo e segurança.
          </p>

          {/* Abas Alternar Login / Cadastro */}
          <div className="grid grid-cols-2 bg-slate-900/80 p-1 rounded-2xl border border-emerald-500/30 mt-4 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMessage('');
              }}
              className={`py-2 rounded-xl transition-all ${
                mode === 'login' ? 'bg-emerald-600 text-white shadow-xs' : 'text-emerald-200/70 hover:text-white'
              }`}
            >
              Entrar na Conta
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setErrorMessage('');
              }}
              className={`py-2 rounded-xl transition-all ${
                mode === 'signup' ? 'bg-emerald-600 text-white shadow-xs' : 'text-emerald-200/70 hover:text-white'
              }`}
            >
              Criar Nova Conta
            </button>
          </div>
        </div>

        {/* Corpo do Formulário */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          
          {/* Botão Oficial do Google */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white hover:bg-gray-50 text-gray-800 text-xs font-bold rounded-2xl border border-gray-300 shadow-xs hover:border-emerald-500 transition-all disabled:opacity-50"
          >
            <img 
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
              alt="Google" 
              className="w-4 h-4 shrink-0" 
            />
            <span>Continuar com o Google</span>
          </button>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-gray-200 w-full"></div>
            <span className="bg-white px-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider shrink-0">
              ou entre com e-mail
            </span>
            <div className="border-t border-gray-200 w-full"></div>
          </div>

          {/* Mensagens de Alerta */}
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-2 text-xs text-red-700 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-xs text-emerald-800 font-bold animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            
            {/* Nome Completo (Apenas no Cadastro) */}
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Nome Completo</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ex: Maria Silva"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>
            )}

            {/* E-mail */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Seu E-mail</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seuemail@exemplo.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Senha */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Sua Senha</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === 'signup' ? 'Mínimo 6 caracteres' : '••••••••'}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Médico ou Dentista Prescritor (Opcional - Apenas no Cadastro) */}
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center justify-between">
                  <span>🩺 Médico ou Dentista Prescritor</span>
                  <span className="text-[10px] text-gray-400 font-normal">(Opcional)</span>
                </label>
                <div className="relative">
                  <Stethoscope className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600" />
                  <input
                    type="text"
                    value={prescribingDoctor}
                    onChange={(e) => setPrescribingDoctor(e.target.value)}
                    placeholder="Ex: Dr. Carlos Eduardo Silva - CRM 184.920"
                    className="w-full pl-10 pr-4 py-2.5 bg-emerald-50/50 border border-emerald-200/80 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>
            )}

            {/* Botão de Envio */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <span>Aguarde...</span>
              ) : mode === 'login' ? (
                <>
                  <span>Entrar no CannaGuia</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>Criar Minha Conta Gratuita</span>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                </>
              )}
            </button>
          </form>

        </div>

      </div>
    </div>
  );
};

export default AuthModal;
