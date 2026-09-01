import { Doctor } from '../types/doctor';

export const INITIAL_DOCTORS: Doctor[] = [
  {
    id: 'dr-rafa-eymael',
    name: 'Dr. Rafa Eymael',
    crm: 'CRM Verificado • Medicina Integrativa & Canabinoide',
    specialties: [
      'Cannabis Medicinal',
      'Medicina Integrativa',
      'Dor Crônica & Enxaqueca',
      'Ansiedade & Insônia'
    ],
    bio: 'Atendimento médico humanizado com foco em qualidade de vida, manejo individualizado de sintomas e prescrição terapêutica de fitocanabinoides.',
    city: 'Florianópolis',
    state: 'SC',
    isOnline: true,
    contactPhone: '(48) 99172-8092',
    whatsappMessage: 'Olá, Dr. Rafa Eymael! Vim pelo CannaGuia e gostaria de agendar uma consulta médica.',
    appointmentUrl: 'https://wa.me/5548991728092?text=Ol%C3%A1%2C%20Dr.%20Rafa%20Eymael!%20Vim%20pelo%20CannaGuia%20e%20gostaria%20de%20agendar%20uma%20consulta%20m%C3%A9dica.'
  }
];
