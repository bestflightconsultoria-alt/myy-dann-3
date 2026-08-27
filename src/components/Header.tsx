import React, { useState, useEffect } from 'react';
import { Building2, Flame, BookOpen, LogOut, UserCheck, LayoutGrid, Stethoscope } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Logo } from './Logo';

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
        redirectTo: `${window.location.origin}/api/auth/callback`
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

  // Menu Principal Completo do CannaGuia
  const navItems = [
    { id: 'catalogo-flores', label: 'Catálogo', icon: LayoutGrid },
    { id: 'sommelier', label: 'Fummelier IA', icon: Flame },
    { id: 'associacoes', label: 'Associações', icon: Building2 },
    { id: 'medicos', label: 'Prescritores', icon: Stethoscope },
    { id: 'blog', label: 'Guia Paciente', icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/98 backdrop-blur-md border-b border-gray-200/90 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* DESKTOP LAYOUT (Single Row) & MOBILE TOP ROW */}
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2">
          
          {/* Logo Oficial CannaGuia */}
          <div onClick={() => setActiveTab('catalogo-flores')} className="cursor-pointer shrink-0">
            <Logo size="md" showText={true} />
          </div>

          {/* MENU DESKTOP (Escondido em telas pequenas < sm) */}
          <nav className="hidden sm:flex items-center gap-1.5 md:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id || (item.id === 'catalogo-flores' && ['catalogo-oleos', 'catalogo-outros'].includes(activeTab));
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 font-bold scale-[1.02]'
                      : 'text-gray-600 hover:text-emerald-700 hover:bg-emerald-50/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-emerald-600'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Área de Autenticação / Perfil (Sempre visível no topo à direita) */}
          <div className="shrink-0 flex items-center gap-1.5">
            {user ? (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setActiveTab('perfil')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
                    activeTab === 'perfil'
                      ? 'bg-emerald-600 text-white shadow-emerald-200'
                      : 'bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100'
                  }`}
                >
                  <UserCheck className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${activeTab === 'perfil' ? 'text-white' : 'text-emerald-600'}`} />
                  <span>
                    {user.user_metadata?.full_name?.split(' ')[0] || 'Meu Espaço'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  title="Sair da conta"
                  className="p-1.5 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleLogin}
                className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-bold text-gray-800 bg-white hover:bg-gray-50 border border-gray-200 hover:border-emerald-300 rounded-xl shadow-xs transition-all"
              >
                <img 
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                  alt="Google" 
                  className="w-3.5 h-3.5" 
                />
                <span>Entrar com Google</span>
              </button>
            )}
          </div>

        </div>

        {/* MOBILE SECOND ROW (Linha dedicada exclusiva para o menu no Celular!) */}
        <div className="sm:hidden pb-2.5 pt-0.5 border-t border-gray-100">
          <nav className="flex items-center gap-1.5 overflow-x-auto scrollbar-none no-scrollbar py-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id || (item.id === 'catalogo-flores' && ['catalogo-oleos', 'catalogo-outros'].includes(activeTab));
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-gray-50 text-gray-700 border border-gray-200/70 hover:bg-emerald-50 hover:text-emerald-800'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-emerald-600'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

      </div>
    </header>
  );
};
