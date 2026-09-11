import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Doctor } from '../types/doctor';
import { INITIAL_DOCTORS } from '../data/doctorsData';
import { trackCustomEvent } from '../lib/analytics';

export { type Doctor } from '../types/doctor';
export { INITIAL_DOCTORS } from '../data/doctorsData';

const STORAGE_KEY = 'cannaguia_approved_doctors_v2';
const CLICKS_STORAGE_KEY = 'cannaguia_doctor_clicks_v1';

interface ContactRequestDoctorRow {
  id?: string;
  entity_name?: string;
  responsible_name?: string;
  phone?: string;
  message?: string;
}

export function useDoctors() {
  const [doctors, setDoctors] = useState<Doctor[]>(INITIAL_DOCTORS);
  const [loading, setLoading] = useState<boolean>(true);
  const [doctorClicks, setDoctorClicks] = useState<Record<string, number>>({});

  const loadClicks = () => {
    try {
      const stored = localStorage.getItem(CLICKS_STORAGE_KEY);
      if (stored) {
        setDoctorClicks(JSON.parse(stored) as Record<string, number>);
      }
    } catch (err) {
      console.warn('Falha ao ler métricas locais de médicos:', err);
    }
  };

  const loadDoctors = async () => {
    setLoading(true);
    const list: Doctor[] = [...INITIAL_DOCTORS];

    // 1. Carrega do localStorage local se houver novos cadastrados
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const localDocs: Doctor[] = JSON.parse(stored);
        const existingIds = new Set(list.map(d => d.id));
        localDocs.forEach(d => {
          if (!existingIds.has(d.id)) list.push(d);
        });
      }
    } catch (err) {
      console.warn('Falha ao ler médicos do cache local:', err);
    }

    // 2. Carrega solicitações aprovadas do Supabase contact_requests se disponível
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('contact_requests')
          .select('*')
          .eq('type', 'prescriber');

        if (!error && data) {
          const approvedFromDb: Doctor[] = (data as ContactRequestDoctorRow[]).map((item) => {
            const isOnline = item.message?.includes('TELEMEDICINA: SIM') ?? true;
            const crmStr = item.responsible_name || 'CRM / CRO Verificado';
            
            let appUrl = '';
            if (item.message?.includes('AGENDAMENTO: http')) {
              appUrl = item.message.split('AGENDAMENTO: ')[1]?.trim() || '';
            } else if (item.phone) {
              const cleanPhone = item.phone.replace(/\D/g, '');
              appUrl = `https://wa.me/55${cleanPhone}?text=Ol%C3%A1!%20Vim%20pelo%20CannaGuia%20e%20gostaria%20de%20agendar%20uma%20consulta.`;
            }

            return {
              id: item.id || `doc-${Math.random()}`,
              name: item.entity_name || 'Médico Prescritor',
              crm: crmStr,
              city: 'São Paulo',
              state: 'SP',
              isOnline: isOnline,
              contactPhone: item.phone || '(11) 99999-9999',
              appointmentUrl: appUrl || '#'
            };
          });

          const existingIds = new Set(list.map(d => d.id));
          approvedFromDb.forEach(d => {
            if (!existingIds.has(d.id)) {
              list.push(d);
            }
          });
        }
      } catch (err) {
        console.error('Erro ao carregar médicos do Supabase:', err);
      }
    }

    setDoctors(list);
    setLoading(false);
  };

  const trackDoctorClick = async (doc: Doctor) => {
    // 1. Envia evento customizado para o Google Analytics 4 (GA4)
    trackCustomEvent('doctor_whatsapp_click', {
      doctor_id: doc.id,
      doctor_name: doc.name,
      doctor_crm: doc.crm,
      doctor_state: doc.state,
      event_category: 'Prescriber Leads',
      event_label: `WhatsApp Click - ${doc.name}`
    });

    // 2. Salva incremento local para métricas visíveis
    try {
      const stored = localStorage.getItem(CLICKS_STORAGE_KEY);
      const current: Record<string, number> = stored ? JSON.parse(stored) : {};
      current[doc.id] = (current[doc.id] || 0) + 1;
      localStorage.setItem(CLICKS_STORAGE_KEY, JSON.stringify(current));
      setDoctorClicks(current);
    } catch (err) {
      console.warn('Falha ao salvar métrica de clique local:', err);
    }

    // 3. Registra log de métricas no Supabase
    if (supabase) {
      try {
        await supabase.from('contact_requests').insert({
          type: 'doctor_lead_telemetry',
          entity_name: doc.name,
          responsible_name: doc.id,
          phone: doc.contactPhone,
          message: `[LEAD CANNAGUIA] Clique no botão de WhatsApp para o médico ${doc.name} (${doc.crm})`
        });
      } catch (err) {
        console.warn('Falha ao enviar telemetria para o Supabase:', err);
      }
    }
  };

  const addDoctor = (newDoc: Doctor) => {
    setDoctors(prev => {
      const updated = [newDoc, ...prev];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.warn('Falha ao salvar médico no localStorage:', err);
      }
      return updated;
    });
  };

  useEffect(() => {
    loadDoctors();
    loadClicks();
  }, []);

  return { 
    doctors, 
    loading, 
    doctorClicks, 
    trackDoctorClick, 
    refreshDoctors: loadDoctors, 
    addDoctor 
  };
}
