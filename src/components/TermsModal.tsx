import React from 'react';
import { X, ShieldCheck, Lock, FileText, Stethoscope, Scale } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in duration-200">
        
        {/* Header do Modal */}
        <div className="flex items-center justify-between p-6 border-b bg-emerald-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-800 rounded-xl">
              <ShieldCheck className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <h2 className="text-xl font-black">Termos de Uso & Política de Privacidade (LGPD)</h2>
              <p className="text-xs text-emerald-200">CannaGuia — Plataforma Informativa & Guia Terapêutico</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-emerald-200 hover:text-white hover:bg-emerald-800 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Conteúdo dos Termos com Scroll */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[70vh] overflow-y-auto text-xs text-gray-700 leading-relaxed">
          
          {/* Seção 1: Natureza da Plataforma */}
          <div className="space-y-2">
            <h3 className="text-sm font-extrabold text-gray-900 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-emerald-600" /> 1. Natureza Informativa e Isenção de Responsabilidade Médica
            </h3>
            <p>
              O <strong>CannaGuia</strong> é uma plataforma digital de caráter exclusivamente informativo, educativo e tecnológico. O CannaGuia <strong>NÃO realiza venda, comercialização, intermediação de pagamentos, estocagem ou distribuição de medicamentos ou plantas</strong>.
            </p>
            <p className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-amber-950 font-medium">
              ⚖️ <strong>Aviso Importante:</strong> O uso de Cannabis Medicinal no Brasil exige obrigatoriamente consulta prévia, prescrição de profissional de saúde habilitado e cadastro junto às autoridades competentes (Anvisa ou Associações autorizadas). As informações contidas nesta plataforma não substituem a orientação médica profissional.
            </p>
          </div>

          {/* Seção 2: Conformidade LGPD */}
          <div className="space-y-2 pt-2 border-t border-gray-100">
            <h3 className="text-sm font-extrabold text-gray-900 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-emerald-600" /> 2. Proteção de Dados Pessoais e Sensíveis (Lei nº 13.709/2018 - LGPD)
            </h3>
            <p>
              Em conformidade com a Lei Geral de Proteção de Dados Pessoais (LGPD), o CannaGuia adota medidas rigorosas para proteger os dados de saúde dos usuários:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-gray-600">
              <li><strong>Tratamento de Dados Sensíveis:</strong> As informações relativas a sintomas e condições de saúde são tratadas mediante consentimento livre e esclarecido do usuário no momento do cadastro ou envio de avaliação.</li>
              <li><strong>Anonimização de Relatos:</strong> As avaliações públicas da comunidade são exibidas com o primeiro nome/iniciais ou como "Paciente Anônimo", protegendo a identidade do usuário.</li>
              <li><strong>Direitos do Titular:</strong> O usuário pode, a qualquer momento, solicitar a atualização, correção ou exclusão definitiva de seus dados e avaliações enviando e-mail para o suporte da plataforma.</li>
            </ul>
          </div>

          {/* Seção 3: Avaliações da Comunidade */}
          <div className="space-y-2 pt-2 border-t border-gray-100">
            <h3 className="text-sm font-extrabold text-gray-900 flex items-center gap-1.5">
              <Stethoscope className="w-4 h-4 text-emerald-600" /> 3. Conteúdo Gerado pelos Usuários e Avaliações Clínicas
            </h3>
            <p>
              As opiniões, relatos de benefícios, percepções de sabor e comentários publicados refletem exclusivamente as experiências individuais de cada paciente. O CannaGuia não garante eficácia clínica idêntica para diferentes indivíduos.
            </p>
          </div>

          {/* Seção 4: Direitos Autorais e Marca */}
          <div className="space-y-2 pt-2 border-t border-gray-100">
            <h3 className="text-sm font-extrabold text-gray-900 flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-emerald-600" /> 4. Propriedade Intelectual e Legislação Aplicável
            </h3>
            <p>
              Todo o conteúdo visual, algoritmos do Fummelier IA, marcas e layouts são de propriedade do CannaGuia, protegidos pela Lei de Propriedade Intelectual (Lei nº 9.610/98). Estes termos são regidos pelas leis da República Federativa do Brasil.
            </p>
          </div>

        </div>

        {/* Footer do Modal */}
        <div className="p-4 border-t bg-gray-50 flex items-center justify-between">
          <span className="text-[11px] text-gray-500 font-medium">Última atualização: Agosto de 2026</span>
          <button 
            onClick={onClose} 
            className="px-6 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md transition-all"
          >
            Entendido & Aceito
          </button>
        </div>

      </div>
    </div>
  );
};

export default TermsModal;
