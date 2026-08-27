import React, { useState, useEffect } from 'react';
import { Smartphone, Download, X, Sparkles } from 'lucide-react';

export const PwaInstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState<boolean>(false);

  useEffect(() => {
    // Verifica se o usuário já dispensou a instalação nesta sessão
    const dismissed = sessionStorage.getItem('cannaguia_pwa_dismissed');
    if (dismissed) return;

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    sessionStorage.setItem('cannaguia_pwa_dismissed', 'true');
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 bg-slate-900 text-white p-4 rounded-3xl border border-emerald-500/40 shadow-2xl animate-in slide-in-from-bottom duration-300 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-inner">
          <Smartphone className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-xs font-black text-white flex items-center gap-1">
            Instalar App CannaGuia
            <Sparkles className="w-3 h-3 text-amber-400" />
          </h4>
          <p className="text-[11px] text-emerald-200/90 leading-tight mt-0.5">
            Acesse o catálogo e o diário direto na tela inicial do seu celular.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={handleInstallClick}
          className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-1"
        >
          <Download className="w-3.5 h-3.5" /> Instalar
        </button>

        <button
          onClick={handleDismiss}
          className="p-1.5 text-gray-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default PwaInstallBanner;
