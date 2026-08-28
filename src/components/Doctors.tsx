import React, { useState } from 'react';
import { 
  Stethoscope, 
  Search, 
  MapPin, 
  ShieldCheck, 
  Calendar, 
  Video,
  UserPlus
} from 'lucide-react';
import { DoctorRegistrationModal } from './DoctorRegistrationModal';
import { useDoctors } from '../hooks/useDoctors';

export interface Doctor {
  id: string;
  name: string;
  crm: string;
  city: string;
  state: string;
  isOnline: boolean;
  contactPhone: string;
  appointmentUrl?: string;
}

export const Doctors: React.FC = () => {
  const { doctors, refreshDoctors } = useDoctors();
  const [search, setSearch] = useState('');
  const [onlyOnline, setOnlyOnline] = useState(false);
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);

  const filteredDoctors = doctors.filter((doc) => {
    const matchSearch =
      search === '' ||
      doc.name.toLowerCase().includes(search.toLowerCase()) ||
      doc.city.toLowerCase().includes(search.toLowerCase()) ||
      doc.crm.toLowerCase().includes(search.toLowerCase());

    const matchOnline = !onlyOnline || doc.isOnline;

    return matchSearch && matchOnline;
  });

  return (
    <div className="space-y-6">
      
      {/* Banner Principal de Prescritores + Botão de Cadastro por Mensagem */}
      <div className="bg-gradient-to-r from-teal-900 via-emerald-800 to-emerald-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-200 text-xs font-semibold backdrop-blur-md">
            <Stethoscope className="w-3.5 h-3.5 text-teal-300" />
            <span>Diretório Oficial de Prescritores Verificados</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
            Médicos & Dentistas Prescritores
          </h1>

          <p className="text-sm sm:text-base text-teal-100/90 leading-relaxed">
            Consulte profissionais habilitados com registro ativo no CRM e CRO com atendimento presencial ou via Telemedicina em todo o Brasil.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-medium text-teal-200/80">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-teal-400" /> Registro CRM / CRO Verificado
            </span>
            <span className="flex items-center gap-1.5">
              <Video className="w-4 h-4 text-teal-400" /> Atendimento Online (Telemedicina)
            </span>
          </div>
        </div>

        {/* Card / Chamada para Cadastrar Profissional */}
        <div className="relative z-10 shrink-0 w-full md:w-auto bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-center space-y-3">
          <span className="text-xs font-extrabold text-teal-200 block uppercase tracking-wider">É Médico ou Dentista?</span>
          <p className="text-xs text-teal-100 max-w-xs mx-auto">
            Cadastre seu perfil de atendimento no diretório do CannaGuia.
          </p>
          <button
            onClick={() => setIsDoctorModalOpen(true)}
            className="w-full py-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>Cadastrar Meu Registro</span>
          </button>
        </div>
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        
        {/* Campo de Busca */}
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome, CRM/CRO ou cidade..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        {/* Toggle Telemedicina Único */}
        <button
          onClick={() => setOnlyOnline(!onlyOnline)}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
            onlyOnline
              ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
              : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
          }`}
        >
          <Video className="w-4 h-4" />
          <span>Apenas Telemedicina (Online)</span>
        </button>
      </div>

      {/* Grid ou Empty State dos Prescritores */}
      {filteredDoctors.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-gray-300 p-8 sm:p-12 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center mx-auto border border-teal-100">
            <Stethoscope className="w-8 h-8" />
          </div>
          <div className="space-y-1.5 max-w-md mx-auto">
            <h3 className="text-lg font-black text-gray-900">Nenhum prescritor cadastrado no momento</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Você é médico (CRM) ou cirurgião-dentista (CRO)? Cadastre seu perfil de atendimento no CannaGuia e receba solicitações de novos pacientes.
            </p>
          </div>
          <button
            onClick={() => setIsDoctorModalOpen(true)}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all inline-flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>Cadastrar Meu Registro de Prescritor</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredDoctors.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-3xl border border-gray-200/90 p-6 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" /> Registro Verificado
                  </span>
                  {doc.isOnline && (
                    <span className="text-[10px] font-bold bg-teal-100 text-teal-800 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <Video className="w-3 h-3 text-teal-600" /> Telemedicina
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-black text-gray-900">{doc.name}</h3>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg inline-block">
                  {doc.crm}
                </span>

                <div className="flex items-center gap-2 text-xs text-gray-500 pt-1">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                  <span>{doc.city} - {doc.state}</span>
                </div>
              </div>

              {/* Ação de Agendamento */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-3">
                <span className="text-xs text-gray-500 font-medium">
                  {doc.contactPhone}
                </span>

                <a
                  href={doc.appointmentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" /> Agendar Consulta
                </a>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Modal Dedicada de Credenciamento de Prescritores (CRM / CRO) */}
      <DoctorRegistrationModal
        isOpen={isDoctorModalOpen}
        onClose={() => setIsDoctorModalOpen(false)}
      />

    </div>
  );
};

export default Doctors;
