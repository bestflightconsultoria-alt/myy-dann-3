import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Doctor } from '../components/Doctors';

const STORAGE_KEY = 'cannaguia_approved_doctors_v1';

export function useDoctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadDoctors = async () => {
    setLoading(true);
    let list: Doctor[] = [];

    // 1. Carrega do localStorage local se houver salvos
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        list = JSON.parse(stored);
      }
    } catch {}

    // 2. Carrega solicitações aprovadas do Supabase contact_requests se disponível
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('contact_requests')
          .select('*')
          .eq('type', 'prescriber');

        if (!error && data) {
          const approvedFromDb: Doctor[] = data.map((item: any) => {
            const isOnline = item.message?.includes('TELEMEDICINA: SIM') ?? true;
            const crmStr = item.responsible_name || 'CRM / CRO Verificado';
            
            // Tenta extrair URL de agendamento se fornecido
            let appUrl = '';
            if (item.message?.includes('AGENDAMENTO: http')) {
              appUrl = item.message.split('AGENDAMENTO: ')[1]?.trim() || '';
            } else if (item.phone) {
              const cleanPhone = item.phone.replace(/\D/g, '');
              appUrl = `https://wa.me/55${cleanPhone}?text=Olá,%20encontrei%20seu%20contato%20no%20CannaGuia%20e%20gostaria%20de%20agendar%20uma%20consulta.`;
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

          // Unifica sem duplicar IDs
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

  const addDoctor = (newDoc: Doctor) => {
    setDoctors(prev => {
      const updated = [newDoc, ...prev];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  useEffect(() => {
    loadDoctors();
  }, []);

  return { doctors, loading, refreshDoctors: loadDoctors, addDoctor };
}
