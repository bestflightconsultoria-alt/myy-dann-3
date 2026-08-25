import React, { useState, useEffect } from 'react';
import { Flower2, Droplets, Sparkles, Building2, Flame, BookOpen, LogOut, UserCheck } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (!supabase) return;
    
    // Pega usuário logado
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    // Escuta login e logout em tempo real
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async () => {
    if (!supabase) return;
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
  };

  const handleLogout = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!supabase) return;
    await supabase.auth.signOut();
    setUser(null);
    if (activeTab === 'perfil') {
      setActiveTab('catalogo-flores');
    }
  };

  const navItems = [
    { id: 'catalogo-flores', label: 'Flores in Natura', icon: Flower2 },
    { id: 'catalogo-oleos', label: 'Óleos Medicinais', icon: Droplets },
    { id: 'catalogo-outros', label: 'Gummies & Outros', icon: Sparkles },
    { id: 'associacoes', label: 'Associações', icon: Building2 },
    { id: 'sommelier', label: 'IA Fummelier', icon: Flame },
    { id: 'blog', label: 'Guia do Paciente', icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer shrink-0" onClick={() => setActiveTab('catalogo-flores')}>
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold text-xl shadow-md shadow-emerald-200">
              🌿
            </div>
            <div>
              <span className="text-xl font-black text-gray-900 tracking-tight">Canna<span className="text-emerald-600">Guia</span></span>
            </div>
          </div>

          {/* Menu Central */}
          <nav className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-200 font-semibold'
                      : 'text-gray-600 hover:text-emerald-700 hover:bg-emerald-50/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Área de Autenticação */}
          <div className="shrink-0 flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-1.5">
                {/* Botão de abrir "Meu Espaço" */}
                <button
                  type="button"
                  onClick={() => setActiveTab('perfil')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                    activeTab === 'perfil'
                      ? 'bg-emerald-600 text-white shadow-emerald-200'
                      : 'bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100'
                  }`}
                >
                  <UserCheck className={`w-4 h-4 ${activeTab === 'perfil' ? 'text-white' : 'text-emerald-600'}`} />
                  <span className="max-w-[120px] truncate">
                    {user.user_metadata?.full_name?.split(' ')[0] || 'Meu Espaço'}
                  </span>
                </button>

                {/* Botão de Logout */}
                <button
                  type="button"
                  onClick={handleLogout}
                  title="Sair da conta"
                  className="p-1.5 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              /* Apenas o botão de Login quando não estiver logado */
              <button
                type="button"
                onClick={handleLogin}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 hover:border-gray-400 rounded-2xl shadow-sm transition-all"
              >
                <img 
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                  alt="Google" 
                  className="w-3.5 h-3.5" 
                />
                <span className="hidden sm:inline">Entrar com Google</span>
                <span className="sm:hidden">Entrar</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
