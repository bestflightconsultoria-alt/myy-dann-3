import React, { useState } from 'react';
import { BookOpen, ShieldCheck, CheckCircle2, ArrowRight, Sparkles, Copy, Check } from 'lucide-react';

interface EbookCardProps {
  variant?: 'horizontal' | 'sidebar';
}

export const EbookCard: React.FC<EbookCardProps> = ({ variant = 'horizontal' }) => {
  const [copied, setCopied] = useState(false);
  const checkoutUrl = 'https://pay.kiwify.com.br/LrBHu6E';
  const couponCode = 'CANNAGUIA';

  const handleCopyCoupon = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(couponCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (variant === 'sidebar') {
    return (
      <aside className="bg-gradient-to-b from-slate-900 via-emerald-950 to-slate-950 text-white rounded-3xl p-5 border border-emerald-500/30 shadow-xl space-y-4">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-slate-950 rounded-md">
            Livro Digital 2026
          </span>
          <span className="text-[11px] text-emerald-300 font-medium flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Guia do Paciente
          </span>
        </div>

        <div className="relative group overflow-hidden rounded-2xl shadow-2xl border border-white/10 bg-slate-800/60 aspect-[2/3] flex items-center justify-center">
          <img
            src="/capa-manual-paciente.webp"
            alt="Capa do livro O Manual do Paciente Legal"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/capa-manual-paciente.jpg';
            }}
          />
        </div>

        <div className="space-y-1.5">
          <h4 className="text-lg font-extrabold text-white leading-snug">
            O Manual do Paciente Legal
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            Passo a passo descomplicado para conseguir laudo, autorização Anvisa e tratamento seguro.
          </p>
        </div>

        <div className="space-y-1.5 text-xs text-slate-200">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
            <span>Passo a passo Anvisa em minutos</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
            <span>Proteção jurídica e regras de trânsito</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
            <span>Tabela de dosagem e modelos de declaração</span>
          </div>
        </div>

        <div className="pt-2 border-t border-white/10 space-y-3">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-[10px] uppercase text-slate-400 font-bold block">Investimento</span>
              <span className="text-2xl font-black text-emerald-400">R$ 19,90</span>
            </div>
            <button
              onClick={handleCopyCoupon}
              title="Clique para copiar cupom"
              className="flex items-center gap-1 text-[11px] bg-white/10 hover:bg-white/15 px-2 py-1 rounded-lg border border-white/10 text-emerald-300 transition-all font-mono"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{couponCode} (-5%)</span>
            </button>
          </div>

          <a
            href={checkoutUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 active:scale-98 text-slate-950 font-black py-3 px-4 rounded-xl text-xs sm:text-sm transition-all shadow-lg shadow-emerald-500/25"
          >
            Garantir Exemplar <ArrowRight className="w-4 h-4" />
          </a>

          <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Garantia incondicional de 7 dias</span>
          </div>
        </div>
      </aside>
    );
  }

  // Variant HORIZONTAL (para o final dos artigos)
  return (
    <section className="mt-10 bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-emerald-500/30 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 sm:gap-8">
        
        {/* Capa com efeito de destaque */}
        <div className="shrink-0 w-44 sm:w-52 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border border-white/15 bg-slate-800/80 group">
          <img
            src="/capa-manual-paciente.webp"
            alt="Capa do livro O Manual do Paciente Legal"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/capa-manual-paciente.jpg';
            }}
          />
        </div>

        {/* Conteúdo de Texto e Conversão */}
        <div className="flex-1 space-y-4 text-center md:text-left">
          
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <span className="px-2.5 py-0.5 text-xs font-black uppercase tracking-wider bg-emerald-500 text-slate-950 rounded-md">
              Edição Oficial 2026
            </span>
            <span className="text-xs text-emerald-300 font-semibold flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" /> Livro Digital Completo (PDF)
            </span>
          </div>

          <div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
              O Manual do Paciente Legal
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed">
              Tudo o que você precisa saber para ter acesso a consultas, remédios de qualidade com economia e proteção total em blitz e viagens, sem termos jurídicos difíceis.
            </p>
          </div>

          {/* Benefícios em Tópicos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-200 pt-1 text-left">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Passo a passo no Gov.br e Anvisa em minutos</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Economia de até 60%: farmácia x importação x associação</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Proteção na CNH e conduta em abordagens policiais</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Bônus: Tabela de titulação e modelos prontos de declaração</span>
            </div>
          </div>

          {/* Preço, Cupom e Ação */}
          <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div>
                <span className="text-[11px] uppercase text-slate-400 font-bold block">Preço único</span>
                <span className="text-3xl font-black text-emerald-400">R$ 19,90</span>
              </div>
              
              <div 
                onClick={handleCopyCoupon}
                className="cursor-pointer bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-xl border border-white/10 transition-all group"
                title="Clique para copiar cupom"
              >
                <span className="text-[10px] text-slate-300 block">Cupom da comunidade:</span>
                <span className="text-xs font-mono font-bold text-emerald-300 flex items-center gap-1">
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {couponCode} (-5%)
                </span>
              </div>
            </div>

            <div className="w-full sm:w-auto flex flex-col items-center sm:items-end gap-1.5">
              <a
                href={checkoutUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 active:scale-98 text-slate-950 font-black py-3 px-6 rounded-xl text-sm transition-all shadow-xl shadow-emerald-500/25"
              >
                Garantir Exemplar com Desconto <ArrowRight className="w-4 h-4" />
              </a>
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" /> Acesso imediato no e-mail com garantia de 7 dias
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
