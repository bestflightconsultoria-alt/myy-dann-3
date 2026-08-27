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

  // Menu Principal Completo do CannaGuia
  const navItems = [
    { id: 'catalogo-flores', label: 'Catálogo', icon: LayoutGrid },
    { id: 'sommelier', label: 'Fummelier IA', icon: Flame },
    { id: 'associacoes', label: 'Associações', icon: Building2 },
    { id: 'medicos', label: 'Prescritores', icon: Stethoscope },
    { id: 'blog', label: 'Guia do Paciente', icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200/80 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
          
          {/* Logo Oficial CannaGuia */}
          <div onClick={() => setActiveTab('catalogo-flores')} className="cursor-pointer shrink-0">
            <Logo size="md" showText={true} />
          </div>

          {/* Menu Central Responsivo com scroll limpo em telas pequenas */}
          <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-2 scrollbar-none no-scrollbar max-w-[60vw] sm:max-w-none">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id || (item.id === 'catalogo-flores' && ['catalogo-oleos', 'catalogo-outros'].includes(activeTab));
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 font-bold scale-[1.02]'
                      : 'text-gray-600 hover:text-emerald-700 hover:bg-emerald-50/80'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isActive ? 'text-white' : 'text-emerald-600'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Área de Autenticação / Perfil */}
          <div className="shrink-0 flex items-center gap-1.5 sm:gap-2">
            {user ? (
              <div className="flex items-center gap-1">
                {/* Botão de abrir "Meu Espaço" */}
                <button
                  type="button"
                  onClick={() => setActiveTab('perfil')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
                    activeTab === 'perfil'
                      ? 'bg-emerald-600 text-white shadow-emerald-200'
                      : 'bg-emerald-50 text-emerald-900 border border-emerald-200/80 hover:bg-emerald-100'
                  }`}
                >
                  <UserCheck className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${activeTab === 'perfil' ? 'text-white' : 'text-emerald-600'}`} />
                  <span className="hidden sm:inline max-w-[100px] truncate">
                    {user.user_metadata?.full_name?.split(' ')[0] || 'Meu Espaço'}
                  </span>
                  <span className="sm:hidden text-[11px]">Perfil</span>
                </button>

                {/* Botão de Logout */}
                <button
                  type="button"
                  onClick={handleLogout}
                  title="Sair da conta"
                  className="p-1.5 sm:p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all"
                >
                  <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
            ) : (
              /* Botão de Login */
              <button
                type="button"
                onClick={handleLogin}
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 text-xs font-bold text-gray-800 bg-white hover:bg-gray-50 border border-gray-200 hover:border-emerald-300 rounded-xl shadow-sm transition-all"
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
