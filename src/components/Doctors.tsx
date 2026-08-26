import React, { useState } from 'react';
import { 
  Stethoscope, 
  Search, 
  MapPin, 
  Star, 
  ShieldCheck, 
  Calendar, 
  Video, 
  Phone,
  Filter,
  CheckCircle2,
  Award
} from 'lucide-react';

export interface Doctor {
  id: string;
  name: string;
  crm: string;
  specialty: string;
  secondarySpecialty?: string;
  city: string;
  state: string;
  isOnline: boolean;
  rating: number;
  reviewsCount: number;
  bio: string;
  focusConditions: string[];
  contactPhone: string;
  appointmentUrl?: string;
  avatarUrl?: string;
}

export const MOCK_DOCTORS: Doctor[] = [
  {
    id: "dr-carlos-silva",
    name: "Dr. Carlos Eduardo Silva",
    crm: "CRM-SP 184.920 | RQE 92.104",
    specialty: "Neurologia & Medicina da Dor",
    secondarySpecialty: "Endocannabinologia",
    city: "São Paulo",
    state: "SP",
    isOnline: true,
    rating: 4.9,
    reviewsCount: 38,
    bio: "Especialista em dor crônica, insônia e enxaqueca refratária com foco no ajuste individual de proporções CBD:THC.",
    focusConditions: ["Dor Crônica", "Insônia", "Enxaqueca", "Fibromialgia"],
    contactPhone: "(11) 98765-4321",
    appointmentUrl: "https://wa.me/5511987654321?text=Ola!%20Encontrei%20seu%20contato%20pelo%20CannaGuia%20e%20gostaria%20de%20agendar%20uma%20consulta."
  },
  {
    id: "dra-camila-vasconcelos",
    name: "Dra. Camila Vasconcelos",
    crm: "CRM-MG 72.410",
    specialty: "Psiquiatria",
    secondarySpecialty: "Saúde Mental & Ansiolíticos",
    city: "Belo Horizonte",
    state: "MG",
    isOnline: true,
    rating: 5.0,
    reviewsCount: 45,
    bio: "Foco no tratamento integrativo de transtornos de ansiedade, depressão e TDAH utilizando fitocanabinoides.",
    focusConditions: ["Ansiedade", "Depressão", "TDAH", "Estresse Pós-Traumático"],
    contactPhone: "(31) 99876-5432",
    appointmentUrl: "https://wa.me/5531998765432?text=Ola!%20Vim%20pelo%20CannaGuia%20e%20gostaria%20de%20agendar%20uma%20consulta."
  },
  {
    id: "dr-marcelo-almeida",
    name: "Dr. Marcelo Almeida",
    crm: "CRM-RJ 95.830 | RQE 41.200",
    specialty: "Medicina de Família & Geriatria",
    city: "Rio de Janeiro",
    state: "RJ",
    isOnline: true,
    rating: 4.8,
    reviewsCount: 29,
    bio: "Atendimento acolhedor focado em pacientes da terceira idade, Parkinson, Alzheimer e melhoria da qualidade de vida.",
    focusConditions: ["Parkinson", "Alzheimer", "Dor Articular", "Insônia em Idosos"],
    contactPhone: "(21) 97654-3210",
    appointmentUrl: "https://wa.me/5521976543210?text=Ola!%20Gostaria%20de%20agendar%20uma%20consulta%20prescrita%20pelo%20CannaGuia."
  },
  {
    id: "dra-fernanda-lima",
    name: "Dra. Fernanda Lima",
    crm: "CRM-PR 43.190",
    specialty: "Pediatria & Neurologia Infantil",
    city: "Curitiba",
    state: "PR",
    isOnline: true,
    rating: 4.9,
    reviewsCount: 52,
    bio: "Tratamento especializado em Espectro Autista (TEA) e Crises Convulsivas em neuropediatria com acompanhamento continuado.",
    focusConditions: ["Autismo (TEA)", "Epilepsia", "Crises Convulsivas"],
    contactPhone: "(41) 98877-6655",
    appointmentUrl: "https://wa.me/5541988776655?text=Ola!%20Vim%20pelo%20CannaGuia%20para%20agendar%20consulta."
  }
];

export const Doctors: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('ALL');
  const [onlyOnline, setOnlyOnline] = useState(false);

  const specialties = [
    'ALL',
    'Neurologia & Medicina da Dor',
    'Psiquiatria',
    'Medicina de Família & Geriatria',
    'Pediatria & Neurologia Infantil'
  ];

  const filteredDoctors = MOCK_DOCTORS.filter((doc) => {
    const matchSearch =
      search === '' ||
      doc.name.toLowerCase().includes(search.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(search.toLowerCase()) ||
      doc.city.toLowerCase().includes(search.toLowerCase()) ||
      doc.focusConditions.some(c => c.toLowerCase().includes(search.toLowerCase()));

    const matchSpecialty =
      selectedSpecialty === 'ALL' || doc.specialty === selectedSpecialty;

    const matchOnline = !onlyOnline || doc.isOnline;

    return matchSearch && matchSpecialty && matchOnline;
  });

  return (
    <div className="space-y-6">
      
      {/* Banner Principal de Médicos */}
      <div className="bg-gradient-to-r from-teal-900 via-emerald-800 to-emerald-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-200 text-xs font-semibold backdrop-blur-md">
            <Stethoscope className="w-3.5 h-3.5 text-teal-300" />
            <span>Diretório Oficial de Prescritores Verificados</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
            Médicos Prescritores de Cannabis Medicinal
          </h1>

          <p className="text-sm sm:text-base text-teal-100/90 leading-relaxed">
            Encontre médicos especialistas com registro no CRM, experientes na prescrição de fitocanabinoides e atendimento presencial ou via Telemedicina em todo o Brasil.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-medium text-teal-200/80">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-teal-400" /> Profissionais com CRM Ativo
            </span>
            <span className="flex items-center gap-1.5">
              <Video className="w-4 h-4 text-teal-400" /> Atendimento Online (Telemedicina)
            </span>
          </div>
        </div>
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Campo de Busca */}
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por médico, especialidade ou cidade..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          {/* Toggle Telemedicina */}
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

        {/* Pílulas de Especialidades */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-gray-100">
          <span className="text-xs font-bold text-gray-500 flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5 text-emerald-600" /> Especialidade:
          </span>
          {specialties.map((spec) => (
            <button
              key={spec}
              onClick={() => setSelectedSpecialty(spec)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedSpecialty === spec
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {spec === 'ALL' ? 'Todas as Especialidades' : spec}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de Médicos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredDoctors.map((doc) => (
          <div
            key={doc.id}
            className="bg-white rounded-3xl border border-gray-200/90 p-6 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              
              {/* Header do Card */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" /> Médico Verificado
                    </span>
                    {doc.isOnline && (
                      <span className="text-[10px] font-bold bg-teal-100 text-teal-800 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <Video className="w-3 h-3 text-teal-600" /> Telemedicina
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-black text-gray-900">{doc.name}</h3>
                  <span className="text-xs font-semibold text-gray-500 block">{doc.crm}</span>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 bg-amber-50 px-3 py-1 rounded-xl border border-amber-200 shrink-0">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-black text-amber-900">{doc.rating}</span>
                  <span className="text-[10px] text-amber-700 font-medium">({doc.reviewsCount})</span>
                </div>
              </div>

              {/* Especialidade e Cidade */}
              <div className="flex items-center gap-3 text-xs text-gray-600 pt-1">
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                  {doc.specialty}
                </span>
                <span className="flex items-center gap-1 text-gray-500">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" /> {doc.city} - {doc.state}
                </span>
              </div>

              {/* Bio / Apresentação */}
              <p className="text-xs text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-2xl border border-gray-100">
                "{doc.bio}"
              </p>

              {/* Condições de Foco */}
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-gray-500 block">Foco de Atendimento:</span>
                <div className="flex flex-wrap gap-1.5">
                  {doc.focusConditions.map((cond, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-semibold bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded-md"
                    >
                      🩺 {cond}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* Ações / Agendamento */}
            <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
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

    </div>
  );
};

export default Doctors;
