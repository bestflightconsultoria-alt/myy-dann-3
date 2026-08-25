import { useState } from 'react';
import { BlogPost } from '../types/blog';

export const MOCK_POSTS: BlogPost[] = [
  {
    id: "1",
    slug: "passo-a-passo-tratamento-cannabis-medicinal-brasil",
    title: "Como Iniciar o Tratamento com Cannabis Medicinal no Brasil: Guia Passo a Passo",
    excerpt: "Entenda os 4 passos obrigatórios para conseguir sua prescrição médica, escolher uma associação e ter acesso legal a flores e óleos.",
    category: "Guia do Paciente",
    readTime: "4 min de leitura",
    date: "15 de Agosto de 2026",
    author: "Redação CannaGuia",
    tags: ["Prescrição Médica", "Associações", "Iniciantes", "Acolhimento"],
    content: `
      <h3>1. Consulta Médica e Prescrição</h3>
      <p>Qualquer médico registrado no CRM (ou odontólogo com CFO) pode prescrever cannabis medicinal no Brasil para qualquer condição em que haja justificativa clínica (como ansiedade, insônia, dor crônica, TDAH, entre outros).</p>
      <p>O médico emitirá uma <strong>receita médica de controle especial</strong> e um <strong>laudo médico com justificativa terapêutica</strong>.</p>

      <h3>2. Escolha da Associação ou Via de Acesso</h3>
      <p>Com o laudo e a receita em mãos, você pode se filiar a uma <strong>associação de pacientes</strong> legalmente constituída (como ABECMed, AdaptaCann, ALCA, Abrapango, etc.).</p>

      <h3>3. Envio de Documentos e Acolhimento</h3>
      <p>A maioria das associações solicita via formulário online ou WhatsApp:</p>
      <ul>
        <li>Documento oficial de identidade (RG ou CNH)</li>
        <li>Comprovante de residência atualizado</li>
        <li>Receita médica válida e laudo médico detalhado</li>
        <li>Termo de filiação/adesão assinado</li>
      </ul>

      <h3>4. Dispensação e Acompanhamento Clínico</h3>
      <p>Após a validação da documentação pelo corpo técnico da entidade, o associado tem acesso ao catálogo interno para dispensação dos produtos prescritos, mantendo sempre o acompanhamento com seu médico assistente.</p>
    `
  },
  {
    id: "2",
    slug: "vaporizacao-vs-oleo-como-escolher",
    title: "Flores In Natura vs. Óleo Full Spectrum: Qual a Diferença no Tratamento?",
    excerpt: "Inalação rápida ou ingestão prolongada? Compare início de ação, duração e indicações clínicas de cada formato.",
    category: "Uso Medicinal",
    readTime: "5 min de leitura",
    date: "18 de Agosto de 2026",
    author: "Equipe CannaGuia",
    tags: ["Flores", "Óleos", "Vaporização", "Farmacocinética"],
    content: `
      <h3>Via Inalatória (Flores In Natura Vaporizadas)</h3>
      <p>A inalação através de <strong>vaporizadores de ervas secas</strong> (sem combustão) é amplamente utilizada para alívio rápido de crises agudas:</p>
      <ul>
        <li><strong>Início de ação:</strong> Quase imediato (2 a 5 minutos).</li>
        <li><strong>Duração do efeito:</strong> Curta a moderada (2 a 4 horas).</li>
        <li><strong>Indicações comuns:</strong> Crises agudas de ansiedade, picos de dor, insônia inicial e espasmos.</li>
      </ul>

      <h3>Via Oral (Óleos e Tinturas Sublinguais)</h3>
      <p>Os óleos concentrados (Full Spectrum, Broad Spectrum ou Isolados) são a base para tratamentos contínuos e estabilização:</p>
      <ul>
        <li><strong>Início de ação:</strong> Gradual (30 a 90 minutos).</li>
        <li><strong>Duração do efeito:</strong> Prolongada (6 a 8 horas).</li>
        <li><strong>Indicações comuns:</strong> Manutenção da ansiedade basal, dores inflamatórias crônicas, manutenção do sono e neuroproteção.</li>
      </ul>

      <h3>Tratamento Combinado</h3>
      <p>Muitos médicos prescrevem uma abordagem integrada: o óleo sublingual diário para manter os níveis séricos e a vaporização de flores sob demanda para momentos de crise.</p>
    `
  }
];

export function useBlog() {
  const [posts] = useState<BlogPost[]>(MOCK_POSTS);
  return { posts };
}
