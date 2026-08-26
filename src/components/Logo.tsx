import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true }) => {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <div className="flex items-center gap-2.5 group cursor-pointer select-none">
      {/* Ícone Fusão: Bússola + Folha + Brilho de IA */}
      <div className={`relative ${iconSizes[size]} rounded-2xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-900 p-0.5 shadow-lg shadow-emerald-600/20 group-hover:shadow-emerald-600/30 transition-all duration-300 transform group-hover:scale-105`}>
        <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center relative overflow-hidden">
          
          {/* Circuito de Bússola (Conceito 1) */}
          <svg className="absolute inset-0 w-full h-full text-emerald-500/20" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="17" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
            <line x1="20" y1="3" x2="20" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="20" y1="33" x2="20" y2="37" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="3" y1="20" x2="7" y2="20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="33" y1="20" x2="37" y2="20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>

          {/* Folha Medicinal de Cannabis (Vetorial Geométrica) */}
          <svg className="w-6 h-6 text-emerald-400 relative z-10 filter drop-shadow-[0_2px_4px_rgba(16,185,129,0.3)]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C12 2 10.5 7 8 9C5.5 11 2 10 2 10C2 10 5.5 13.5 7.5 16C6 18.5 4.5 21 4.5 21C4.5 21 8.5 19.5 11 18.5V22H13V18.5C15.5 19.5 19.5 21 19.5 21C19.5 21 18 18.5 16.5 16C18.5 13.5 22 10 22 10C22 10 18.5 11 16 9C13.5 7 12 2 12 2Z" />
          </svg>

          {/* Brilho Dourado de IA (Conceito 3 - IA Sommelier) */}
          <div className="absolute top-1 right-1 z-20 animate-pulse">
            <svg className="w-3 h-3 text-amber-400 fill-amber-400 filter drop-shadow-[0_0_6px_rgba(245,158,11,0.8)]" viewBox="0 0 24 24">
              <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
            </svg>
          </div>
          
        </div>
      </div>

      {/* Nome da Marca */}
      {showText && (
        <div className="flex flex-col">
          <span className={`${textSizes[size]} font-black tracking-tight text-gray-900 leading-none`}>
            Canna<span className="text-emerald-600">Guia</span>
          </span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-700/80 mt-0.5">
            Cannabis Medicinal
          </span>
        </div>
      )}
    </div>
  );
};
