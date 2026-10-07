import { Doctor } from '../types/doctor';

export const INITIAL_DOCTORS: Doctor[] = [
  {
    id: 'dr-rafa-eymael',
    name: 'Dr. Rafa Eymael',
    crm: 'CRM/SC 12805 • Medicina de Família & Canabinoide',
    specialties: [
      'Dor Crônica & Enxaqueca',
      'Insônia & Qualidade do Sono',
      'Ansiedade & Estresse',
      'Cannabis Medicinal',
      'Medicina de Família & Integrativa'
    ],
    bio: 'Especialista em manejo de Dor Crônica, Insônia e Ansiedade através de terapias integrativas e prescrição médica individualizada de fitocanabinoides (Cannabis Medicinal). Atendimento no Jurerê Medical Center e via Telemedicina em todo o Brasil.',
    city: 'Florianópolis',
    state: 'SC',
    isOnline: true,
    contactPhone: '(48) 99172-8092',
    whatsappMessage: 'Olá, Dr. Rafa Eymael! Vim pelo CannaGuia e gostaria de agendar uma consulta médica para avaliação de tratamento (Dor Crônica / Ansiedade / Insônia).',
    appointmentUrl: 'https://wa.me/5548991728092?text=Ol%C3%A1%2C%20Dr.%20Rafa%20Eymael!%20Vim%20pelo%20CannaGuia%20e%20gostaria%20de%20agendar%20uma%20consulta%20m%C3%A9dica%20para%20avalia%C3%A7%C3%A3o%20de%20tratamento.'
  },
  {
    id: 'dr-hyuri-de-souza-luiz',
    name: 'Dr. Hyuri de Souza Luiz',
    crm: 'CREFITO/SC 287858-F • Fisioterapia & Terapia Canabinoide',
    specialties: [
      'Dor Crônica & Fibromialgia',
      'Reabilitação Neurofuncional',
      'Cannabis Medicinal',
      'Fisioterapia Integrativa'
    ],
    bio: 'Fisioterapeuta especialista em reabilitação neurofuncional, manejo de dores crônicas e indicação clínica de fitocanabinoides e produtos à base de cannabis. Atendimento presencial em Santa Catarina e Telemedicina para todo o Brasil.',
    city: 'Florianópolis',
    state: 'SC',
    isOnline: true,
    contactPhone: '(48) 99967-2201',
    whatsappMessage: 'Olá, Dr. Hyuri! Vim pelo CannaGuia e gostaria de agendar uma consulta para avaliação terapêutica.',
    appointmentUrl: 'https://wa.me/5548999672201?text=Ol%C3%A1%2C%20Dr.%20Hyuri!%20Vim%20pelo%20CannaGuia%20e%20gostaria%20de%20agendar%20uma%20consulta%20para%20avalia%C3%A7%C3%A3o%20terap%C3%AAutica.'
  },
  {
    id: 'dr-rodrigo-regis-lima-rios',
    name: 'Dr. Rodrigo Régis Lima Rios',
    crm: 'CRM/BA 46709 • Medicina Canabinoide',
    specialties: [
      'Medicina Geral & Canabinoide',
      'Ansiedade & Insônia',
      'Dor Crônica & Inflamação',
      'Acompanhamento Clínico'
    ],
    bio: 'Médico prescritor de cannabis medicinal focado no acolhimento de pacientes com dor crônica, distúrbios do sono e ansiedade. Atendimento humanizado e via Telemedicina em todo o Brasil.',
    city: 'Ilhéus',
    state: 'BA',
    isOnline: true,
    contactPhone: '(73) 99990-0420',
    whatsappMessage: 'Olá, Dr. Rodrigo Régis! Vim pelo CannaGuia e gostaria de agendar uma consulta médica.',
    appointmentUrl: 'https://wa.me/5573999900420?text=Ol%C3%A1%2C%20Dr.%20Rodrigo%20R%C3%A9gis!%20Vim%20pelo%20CannaGuia%20e%20gostaria%20de%20agendar%20uma%20consulta%20m%C3%A9dica.'
  },
  {
    id: 'dra-laura-bervian',
    name: 'Dra. Laura Bervian',
    crm: 'CRM/SC 30368 • Medicina Canabinoide & Integrativa',
    specialties: [
      'Saúde Integrativa',
      'Manejo de Sintomas com Cannabis',
      'Ansiedade & Depressão',
      'Qualidade de Vida'
    ],
    bio: 'Médica com foco em medicina integrativa e terapia com fitocanabinoides. Prescrição individualizada de óleos Full Spectrum e acompanhamento clínico contínuo presencial e via Telemedicina.',
    city: 'Florianópolis',
    state: 'SC',
    isOnline: true,
    contactPhone: '(54) 93618-1833',
    whatsappMessage: 'Olá, Dra. Laura Bervian! Vim pelo CannaGuia e gostaria de agendar uma consulta médica.',
    appointmentUrl: 'https://wa.me/5554936181833?text=Ol%C3%A1%2C%20Dra.%20Laura%20Bervian!%20Vim%20pelo%20CannaGuia%20e%20gostaria%20de%20agendar%20uma%20consulta%20m%C3%A9dica.'
  },
  {
    id: 'dra-michelle-santos-menezes',
    name: 'Dra. Michelle Santos Menezes',
    crm: 'CREFITO/SE 327720-F • Fisioterapia & Fitocanabinoides',
    specialties: [
      'Fisioterapia & Dor Crônica',
      'Tratamentos Canabinoides',
      'Reabilitação Física & Mobilidade',
      'Saúde Funcional'
    ],
    bio: 'Fisioterapeuta atuante no manejo da dor crônica, mobilidade articular e aplicação de fitocanabinoides para redução de espasmos e processos inflamatórios. Atendimento em Sergipe e via Telemedicina nacional.',
    city: 'Aracaju',
    state: 'SE',
    isOnline: true,
    contactPhone: '(79) 99846-8770',
    whatsappMessage: 'Olá, Dra. Michelle! Vim pelo CannaGuia e gostaria de agendar uma avaliação terapêutica.',
    appointmentUrl: 'https://wa.me/5579998468770?text=Ol%C3%A1%2C%20Dra.%20Michelle!%20Vim%20pelo%20CannaGuia%20e%20gostaria%20de%20agendar%20uma%20avalia%C3%A7%C3%A3o%20terap%C3%AAutica.'
  }
];
