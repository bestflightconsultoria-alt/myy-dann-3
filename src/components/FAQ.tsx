import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Search, ShieldCheck, FileText, Stethoscope, Sparkles } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
  category: 'legalidade' | 'receita' | 'associacao' | 'produtos';
}

const FAQ_DATA: FaqItem[] = [
  {
    category: 'legalidade',
    question: 'Preciso de receita médica para me associar a uma associação no Brasil?',
    answer: 'Sim. De acordo com a regulamentação médica brasileira e a jurisprudência das associações sem fins lucrativos, é indispensável a apresentação de laudo ou receita médica válida emitida por médico ou dentista prescritor devidamente registrado no CRM ou CRO.'
  },
  {
    category: 'associacao',
    question: 'Como funciona o processo de associação passo a passo?',
    answer: 'O processo é simples: 1) Realize a consulta médica e obtenha a prescrição; 2) Escolha a associação parceira desejada no CannaGuia; 3) Envie a documentação exigida (RG/CPF, comprovante de residência e receita médica); 4) Aguarde a aprovação do cadastro; 5) Acesse o cardápio e solicite a dispensação do tratamento.'
  },
  {
    category: 'produtos',
    question: 'Qual a diferença entre Flores in Natura, Óleos Medicinais e Gummies?',
    answer: 'Flores in natura oferecem início rápido de ação via vaporização (ideal para crises agudas de ansiedade, dor ou insônia). Óleos e extratos orais possuem ação prolongada de 6 a 8 horas (ideais para manutenção de dor crônica e repouso). Gummies e comestíveis são práticos, discretos e de dosagem milimétrica.'
  },
  {
    category: 'legalidade',
    question: 'O CannaGuia realiza a venda de produtos ou medicamentos?',
    answer: 'Não. O CannaGuia é uma plataforma independente de transparência de dados, perfis de terpenos, avaliações de pacientes e catálogo comparativo entre associações de cannabis medicinal regulamentadas no Brasil. Não comercializamos nenhum tipo de produto.'
  },
  {
    category: 'legalidade',
    question: 'As associações brasileiras de pacientes são legais?',
    answer: 'Sim. As associações de cannabis medicinal no Brasil operam sob amparo constitucional (direito fundamental à saúde) e autorizações judiciais específicas (Habeas Corpus coletivos ou decisões de mérito), garantindo acesso seguro e de qualidade para pacientes associados.'
  },
  {
    category: 'associacao',
    question: 'Quanto tempo leva a aprovação do cadastro na associação?',
    answer: 'O tempo de análise varia conforme o corpo técnico da entidade, geralmente levando entre 24h e 72h úteis após o envio da documentação médica completa.'
  },
  {
    category: 'receita',
    question: 'Qualquer médico ou dentista pode prescrever Cannabis Medicinal no Brasil?',
    answer: 'Sim! De acordo com a Resolução do CFM e parecer do CFO, qualquer médico (CRM) ou dentista (CRO) habilitado no Brasil tem autonomia profissional para prescrever produtos derivados de cannabis medicinais quando julgar clinicamente indicado.'
  },
  {
    category: 'produtos',
    question: 'O que é o Recomendador Terapêutico IA do CannaGuia?',
    answer: 'É um algoritmo inteligente desenvolvido pelo CannaGuia que cruza dados químicos das plantas (THC, CBD, terpenos ansiolíticos ou analgésicos) com as avaliações e notas reais enviadas pela comunidade de pacientes para recomendar as flores e óleos mais compatíveis com o seu tratamento.'
  }
];

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');

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

export default FAQ;
