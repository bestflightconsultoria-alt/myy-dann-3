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
  }
];
