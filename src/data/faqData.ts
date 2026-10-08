export interface FaqItem {
  question: string;
  answer: string;
  category: 'legalidade' | 'receita' | 'associacao' | 'produtos';
}

export const FAQ_DATA: FaqItem[] = [
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
