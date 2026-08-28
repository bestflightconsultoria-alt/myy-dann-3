import React, { useState } from 'react';
import { X, Send, CheckCircle2, Building2, Mail, Phone, User, MessageSquare } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  defaultType?: 'association' | 'prescriber' | 'general';
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  title = "Cadastrar Entidade / Contato Direto",
  subtitle = "Preencha o formulário abaixo ou escreva diretamente para contato@cannaguia.com.br",
  defaultType = 'general'
}) => {
  const [name, setName] = useState('');
  const [responsibleName, setResponsibleName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState<'association' | 'prescriber' | 'general'>(defaultType);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      type,
      entity_name: name.trim(),
      responsible_name: responsibleName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      message: message.trim(),
      created_at: new Date().toISOString()
    };

    // Salva no Supabase se conectado ou no localStorage
    if (supabase) {
      try {
        await supabase.from('contact_submissions').insert([payload]);
      } catch (err) {
        console.error('Erro ao enviar contato:', err);
      }
    }

    try {
      const saved = localStorage.getItem('cannaguia_contact_leads');
      const list = saved ? JSON.parse(saved) : [];
      localStorage.setItem('cannaguia_contact_leads', JSON.stringify([payload, ...list]));
    } catch (e) {}

    setSubmitting(false);
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setName('');
    setResponsibleName('');
    setEmail('');
    setPhone('');
    setMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl border-2 border-emerald-500/30 shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in duration-200">
        
        {/* Header do Modal */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b bg-emerald-900 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-800 rounded-2xl">
              <Building2 className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black">{title}</h2>
              <p className="text-xs text-emerald-200">{subtitle}</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-emerald-200 hover:text-white hover:bg-emerald-800 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Conteúdo do Formulário */}
        <div className="p-6">
          {submitted ? (
            <div className="text-center py-8 space-y-4 animate-in fade-in">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-black text-gray-900">Mensagem Enviada com Sucesso!</h3>
              <p className="text-xs text-gray-600 max-w-xs mx-auto leading-relaxed">
                Recebemos sua solicitação. Nossa equipe entrará em contato através do e-mail <strong>{email}</strong> em breve.
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
              
              {/* Seleção do Tipo */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-700 block uppercase">Motivo do Contato:</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setType('association')}
                    className={`py-2 px-2 text-[11px] font-bold rounded-xl border transition-all ${
                      type === 'association' 
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs' 
                        : 'bg-gray-50 text-gray-700 border-gray-200'
                    }`}
                  >
                    🏢 Associação
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('prescriber')}
                    className={`py-2 px-2 text-[11px] font-bold rounded-xl border transition-all ${
                      type === 'prescriber' 
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs' 
                        : 'bg-gray-50 text-gray-700 border-gray-200'
                    }`}
                  >
                    🩺 Prescritor
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('general')}
                    className={`py-2 px-2 text-[11px] font-bold rounded-xl border transition-all ${
                      type === 'general' 
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs' 
                        : 'bg-gray-50 text-gray-700 border-gray-200'
                    }`}
                  >
                    💬 Dúvidas
                  </button>
                </div>
              </div>

              {/* Nome da Associação ou Empresa */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-700 block">
                  {type === 'association' ? 'Nome da Associação:' : type === 'prescriber' ? 'Nome do Profissional / Clínica:' : 'Seu Nome Completo:'}
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={type === 'association' ? 'Ex: Associação ABRACANN' : 'Ex: Dr. Silva ou Seu Nome'}
                    className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Nome do Responsável */}
              {type === 'association' && (
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-700 block">Nome do Responsável / Diretor:</label>
                  <input
                    type="text"
                    value={responsibleName}
                    onChange={(e) => setResponsibleName(e.target.value)}
                    placeholder="Ex: João da Silva (Presidente/Diretor)"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-emerald-500"
                  />
                </div>
              )}

              {/* E-mail de Contato */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-700 block">E-mail para Resposta:</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seuemail@dominio.com.br"
                    className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Telefone / WhatsApp */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-700 block">Telefone / WhatsApp (Opcional):</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(11) 99999-9999"
                    className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Mensagem */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-700 block">Mensagem ou Observações:</label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Descreva detalhes sobre a entidade, catálogo ou dúvida..."
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-emerald-500"
                />
              </div>

              <p className="text-[10px] text-gray-400">
                🔒 Seus dados serão utilizados exclusivamente para retorno direto via e-mail pela equipe do CannaGuia.
              </p>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'Enviando...' : 'Enviar Solicitação'}</span>
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};

export default ContactModal;
