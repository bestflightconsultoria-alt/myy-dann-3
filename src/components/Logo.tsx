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
      {/* Ícone 1C-v1: Leque Botânico Real + Cruz Medicinal Suave */}
      <div className={`relative ${iconSizes[size]} rounded-2xl bg-emerald-50 border border-emerald-200/80 p-0.5 shadow-sm group-hover:shadow-md group-hover:border-emerald-300 transition-all duration-300 transform group-hover:scale-105`}>
        <div className="w-full h-full flex items-center justify-center relative overflow-hidden rounded-[14px]">
          
          <svg className="w-full h-full p-1" viewBox="0 0 48 48" fill="none">
            {/* Cruz Médica Suave de Fundo */}
            <path d="M24 8V40M8 24H40" stroke="#059669" strokeWidth="3" strokeLinecap="round" strokeOpacity="0.25"/>
            
            {/* Caule da folha */}
            <path d="M24 38V28" stroke="#059669" strokeWidth="2.5" strokeLinecap="round"/>
            
            {/* 5 Folíolos Finos em Leque Botânico de Cannabis */}
            {/* Folíolo Central */}
            <path d="M24 10C24 10 21 18 24 28C27 18 24 10 24 10Z" fill="#059669"/>
            
            {/* Folíolo Superior Esquerdo */}
            <path d="M24 28C22 25 15 16 13 18C12 20 19 25 24 28Z" fill="#10b981"/>
            
            {/* Folíolo Superior Direito */}
            <path d="M24 28C26 25 33 16 35 18C36 20 29 25 24 28Z" fill="#10b981"/>
            
            {/* Folíolo Inferior Esquerdo */}
            <path d="M24 28C21 27 12 24 11 26C11 28 19 29 24 28Z" fill="#34d399"/>
            
            {/* Folíolo Inferior Direito */}
            <path d="M24 28C27 27 36 24 37 26C37 28 29 29 24 28Z" fill="#34d399"/>
          </svg>

        </div>
      </div>

      {/* Nome da Marca CannaGuia e Tagline Acolhedora */}
      {showText && (
        <div className="flex flex-col">
          <span className={`${textSizes[size]} font-black tracking-tight text-gray-900 leading-none`}>
            Canna<span className="text-emerald-600">Guia</span>
          </span>
          <span className="text-[10px] font-medium text-emerald-800/90 mt-1 tracking-tight">
            Seu Guia de Cannabis Medicinal
          </span>
        </div>
      )}
    </div>
  );
};
