import React, { useState, useEffect } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Search } from 'lucide-react';
import { injectFAQSchema, resetDefaultSchema } from '../lib/seoStructuredData';
import { FAQ_DATA, FaqItem } from '../data/faqData';

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');

  // Injeta FAQPage Schema.org para Rich Snippets no Google Search
  useEffect(() => {
    injectFAQSchema(FAQ_DATA);
    return () => {
      resetDefaultSchema();
    };
  }, []);

  const filteredFaqs = FAQ_DATA.filter((item) => {
    const matchCategory = selectedCategory === 'todos' || item.category === selectedCategory;
    const matchSearch = searchTerm === '' || 
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Header FAQ */}
      <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-teal-900 rounded-3xl p-6 sm:p-8 text-white text-center space-y-3 shadow-xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-bold backdrop-blur-md">
          <HelpCircle className="w-4 h-4 text-emerald-300" />
          <span>Central de Dúvidas do Paciente</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
          Perguntas <span className="text-emerald-400">Frequentes (FAQ)</span>
        </h1>

        <p className="text-xs sm:text-sm text-emerald-100/90 max-w-2xl mx-auto leading-relaxed">
          Tire suas dúvidas sobre regulamentação, prescrição médica, associações brasileiras e funcionamento do CannaGuia.
        </p>
      </div>

      {/* Busca e Filtros de Categoria */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm space-y-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Pesquisar por dúvida (ex: receita, legalidade, prazo...)"
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          <button
            onClick={() => setSelectedCategory('todos')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap ${
              selectedCategory === 'todos' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Todas as Dúvidas ({FAQ_DATA.length})
          </button>
          <button
            onClick={() => setSelectedCategory('legalidade')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap ${
              selectedCategory === 'legalidade' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            ⚖️ Legalidade
          </button>
          <button
            onClick={() => setSelectedCategory('receita')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap ${
              selectedCategory === 'receita' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            🩺 Receita Médica
          </button>
          <button
            onClick={() => setSelectedCategory('associacao')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap ${
              selectedCategory === 'associacao' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            🤝 Associações
          </button>
          <button
            onClick={() => setSelectedCategory('produtos')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap ${
              selectedCategory === 'produtos' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            🌿 Produtos
          </button>
        </div>
      </div>

      {/* Accordion FAQ */}
      <div className="space-y-3">
        {filteredFaqs.length === 0 ? (
          <div className="p-8 bg-white rounded-2xl border border-dashed text-center text-xs text-gray-500">
            Nenhuma dúvida encontrada para a sua busca.
          </div>
        ) : (
          filteredFaqs.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-gray-200/90 overflow-hidden shadow-xs hover:border-emerald-500/50 transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(idx)}
                  className="w-full p-4 text-left font-bold text-xs sm:text-sm text-gray-900 flex items-center justify-between gap-3 hover:bg-gray-50/80 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    {item.question}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="p-4 pt-0 text-xs text-gray-600 leading-relaxed border-t border-gray-100 bg-emerald-50/30">
                    <p className="pt-2">{item.answer}</p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
