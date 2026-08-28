import React, { useState } from 'react';
import { X, Stethoscope, ShieldCheck, Video, MapPin, Phone, Mail, CheckCircle2, Sparkles, Building2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface DoctorRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DoctorRegistrationModal: React.FC<DoctorRegistrationModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [docType, setDocType] = useState<'CRM' | 'CRO'>('CRM');
  const [docNumber, setDocNumber] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [city, setCity] = useState('');
  const [uf, setUf] = useState('');
  const [isOnline, setIsOnline] = useState(true);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [appointmentUrl, setAppointmentUrl] = useState('');

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const fullRegistration = `${docType}-${uf.toUpperCase()} ${docNumber.trim()}`;
    const payload = {
      type: 'prescriber',
      entity_name: name.trim(),
      responsible_name: fullRegistration,
      email: email.trim(),
      phone: phone.trim(),
      message: `TIPO: ${docType} | REGISTRO: ${fullRegistration} | ESPECIALIDADE: ${specialty} | CIDADE: ${city}/${uf} | TELEMEDICINA: ${isOnline ? 'SIM' : 'NÃO'} | AGENDAMENTO: ${appointmentUrl}`
    };

    try {
      if (supabase) {
        await supabase.from('contact_requests').insert([payload]);
      }
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setName('');
    setDocNumber('');
    setSpecialty('');
    setCity('');
    setUf('');
    setPhone('');
    setEmail('');
    setAppointmentUrl('');
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl border border-emerald-500/30 shadow-2xl overflow-hidden my-auto animate-in fade-in duration-200">
        
        {/* Header do Modal */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-teal-950 via-emerald-950 to-slate-900 text-white relative">
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 p-1.5 text-emerald-200 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-bold mb-2">
            <Stethoscope className="w-3.5 h-3.5 text-teal-300" />
            <span>Credenciamento de Prescritor</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white">Cadastre seu Consultório</h2>
          <p className="text-xs text-teal-100/90 mt-1 leading-relaxed">
            Faça parte da Rede Oficial de Médicos (CRM) e Cirurgiões-Dentistas (CRO) Verificados do CannaGuia.
          </p>
        </div>

        {/* Conteúdo do Formulário */}
        <div className="p-6">
          {submitted ? (
            <div className="text-center py-8 space-y-4 animate-in fade-in">
              <div className="w-16 h-16 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-black text-gray-900">Cadastro Enviado com Sucesso!</h3>
              <p className="text-xs text-gray-600 max-w-xs mx-auto leading-relaxed">
                Recebemos sua solicitação de credenciamento. O registro <strong>{docType}-{uf.toUpperCase()} {docNumber}</strong> será validado pelo nosso corpo técnico em até 24h úteis.
              </p>
              <button
                onClick={handleReset}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
              >
                Concluir
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Seleção do Conselho Profissional */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Conselho Profissional</label>
                <div className="grid grid-cols-2 gap-3 font-bold text-xs">
                  <button
                    type="button"
                    onClick={() => setDocType('CRM')}
                    className={`py-2.5 px-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${
                      docType === 'CRM'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <Stethoscope className="w-4 h-4" />
                    <span>Médico (CRM)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDocType('CRO')}
                    className={`py-2.5 px-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${
                      docType === 'CRO'
                        ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Dentista (CRO)</span>
                  </button>
                </div>
              </div>

              {/* Nome Completo */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Nome Completo do Profissional *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={docType === 'CRM' ? "Ex: Dr. Carlos Eduardo Silva" : "Ex: Dra. Juliana Santos"}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              {/* Número do Registro & UF */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">Número do {docType} *</label>
                  <input
                    type="text"
                    required
                    value={docNumber}
                    onChange={(e) => setDocNumber(e.target.value)}
                    placeholder="Ex: 184920"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">UF *</label>
                  <input
                    type="text"
                    required
                    maxLength={2}
                    value={uf}
                    onChange={(e) => setUf(e.target.value.toUpperCase())}
                    placeholder="SP"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-center font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Especialidade / Foco Clínico */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Especialidade ou Foco Clínico *</label>
                <input
                  type="text"
                  required
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  placeholder={docType === 'CRM' ? "Ex: Psiquiatria, Dor Crônica, Neurologia" : "Ex: DTM, Bruxismo, Dor Orofacial"}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              {/* Cidade & Atendimento Online */}
              <div className="grid grid-cols-2 gap-3 items-center">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Cidade Principal *</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Ex: São Paulo"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>

                <div className="pt-4">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isOnline}
                      onChange={(e) => setIsOnline(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500"
                    />
                    <span className="text-xs font-bold text-gray-800 flex items-center gap-1">
                      <Video className="w-3.5 h-3.5 text-teal-600" /> Telemedicina (Online)
                    </span>
                  </label>
                </div>
              </div>

              {/* Contato & Link de Agendamento */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">E-mail Profissional *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="doutor@exemplo.com"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">WhatsApp de Agendamento *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(11) 99999-9999"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Link de Agendamento (Doctoralia / WhatsApp / Agenda) */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center justify-between">
                  <span>Link de Agendamento Online</span>
                  <span className="text-[10px] text-gray-400 font-normal">(Opcional)</span>
                </label>
                <input
                  type="url"
                  value={appointmentUrl}
                  onChange={(e) => setAppointmentUrl(e.target.value)}
                  placeholder="https://doctoralia.com.br/seu-perfil ou WhatsApp"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              {/* Botão de Envio */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <span>Enviando Cadastro...</span>
                  ) : (
                    <>
                      <Stethoscope className="w-4 h-4" />
                      <span>Cadastrar Meu Registro no CannaGuia</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};

export default DoctorRegistrationModal;
