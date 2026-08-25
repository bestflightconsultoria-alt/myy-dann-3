import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface AssociationPriceItem {
  category: 'Flores in Natura' | 'Óleos' | 'Gummies' | 'Outros';
  title: string;
  details: string;
}

export interface Association {
  id: string;
  name: string;
  acronym: string;
  state: string;
  city: string;
  contactPhone?: string;
  membershipFee?: string;
  undeliveredStates?: string[];
  generalPricing?: AssociationPriceItem[];
  focus: string[];
  website?: string;
  instagram?: string;
  description: string;
  howToJoin?: string;
  rating?: number;
  reviewCount?: number;
}

export const MOCK_ASSOCIATIONS: Association[] = [
  // ================= MINAS GERAIS (MG) =================
  {
    id: "flores-brasil-mg",
    name: "Flores Brasil",
    acronym: "Flores Brasil",
    state: "MG",
    city: "Contagem",
    contactPhone: "(31) 99367-2475",
    membershipFee: "Sem taxa de associacao",
    undeliveredStates: [],
    focus: ["Acolhimento ao Paciente", "Flores Medicinais"],
    website: "https://floresbrasil.org.br",
    description: "Associação com atendimento e acolhimento em Contagem / MG.",
    generalPricing: [
      {
        category: "Flores in Natura",
        title: "Flores Medicinais",
        details: "1 a 10g: R$ 80,00 | 20g: R$ 1400,00"
      }
    ],
    rating: 0,
    reviewCount: 0
  },

  // ================= SÃO PAULO (SP) =================
  {
    id: "abecmed-sp",
    name: "ABECMed",
    acronym: "ABECMed",
    state: "SP",
    city: "São Paulo",
    contactPhone: "(11) 98336-8220",
    membershipFee: "Sem taxa de associacao",
    undeliveredStates: [],
    focus: ["Flores Medicinais", "Óleos Full Spectrum"],
    website: "https://abecmed.com.br/",
    description: "Associação localizada em São Paulo / SP com foco em cultivo indoor de alto padrão e extratos concentrados.",
    generalPricing: [
      {
        category: "Flores in Natura",
        title: "Flores Indoor THC",
        details: "Papaya R$ 85/g, Chemdawg R$ 85/g, Rainbow Mints R$ 90/g"
      },
      {
        category: "Óleos",
        title: "Óleo AZUL 10% Full Spectrum",
        details: "3000mg - 100mg/ml - 30ml: R$ 780,00"
      }
    ],
    rating: 0,
    reviewCount: 0
  },
  {
    id: "liva-sp",
    name: "Liva",
    acronym: "Liva",
    state: "SP",
    city: "São Paulo",
    contactPhone: "(11) 97559-3422",
    membershipFee: "R$ 117,00 anual",
    undeliveredStates: [],
    focus: ["Flores Terapêuticas", "Óleos Full Spectrum", "Gummies"],
    website: "https://liva.org.br",
    description: "Associação pioneira no fornecimento de genéticas in natura e derivados padronizados.",
    generalPricing: [
      {
        category: "Flores in Natura",
        title: "Flores Selecionadas",
        details: "24K Gold / Blue Dream: R$ 55/g"
      },
      {
        category: "Óleos",
        title: "Óleo CBD Full Spectrum",
        details: "3000mg (30ml): R$ 290,00"
      }
    ],
    rating: 0,
    reviewCount: 0
  },
  {
    id: "viva-cannabis-sp",
    name: "Viva Cannabis",
    acronym: "Viva Cannabis",
    state: "SP",
    city: "Batatais",
    contactPhone: "(16) 99259-3858",
    membershipFee: "Sem taxa de associacao",
    undeliveredStates: [],
    focus: ["Acolhimento", "Apoio ao Paciente"],
    website: "https://vivacannabis.org.br/",
    description: "Entidade de suporte e acolhimento localizada em Batatais / SP.",
    generalPricing: [],
    rating: 0,
    reviewCount: 0
  },
  {
    id: "abracuca-sp",
    name: "ABRACUCA",
    acronym: "ABRACUCA",
    state: "SP",
    city: "Bragança Paulista",
    contactPhone: "(11) 93397-1459",
    membershipFee: "Sem taxa de associacao",
    undeliveredStates: [],
    focus: ["Auto-cultivo", "Apoio Jurídico"],
    website: "https://abracuca.org/",
    description: "Associação com foco em apoio terapêutico e jurídico em Bragança Paulista / SP.",
    generalPricing: [],
    rating: 0,
    reviewCount: 0
  },
  {
    id: "santa-gaia-sp",
    name: "Santa Gaia",
    acronym: "Santa Gaia",
    state: "SP",
    city: "Lins",
    contactPhone: "(14) 99824-1180",
    membershipFee: "Sem taxa de associacao",
    undeliveredStates: [],
    focus: ["Óleos", "Acolhimento Familiar"],
    website: "https://santagaia.ong.br/#",
    description: "Associação localizada em Lins / SP.",
    generalPricing: [],
    rating: 0,
    reviewCount: 0
  },
  {
    id: "emanacan-sp",
    name: "Emanacan",
    acronym: "Emanacan",
    state: "SP",
    city: "Marília",
    contactPhone: "(14) 99727-4050",
    membershipFee: "Sem taxa de associacao",
    undeliveredStates: [],
    focus: ["Acolhimento ao Paciente"],
    website: "https://www.emanacan.com.br/",
    description: "Associação localizada em Marília / SP.",
    generalPricing: [],
    rating: 0,
    reviewCount: 0
  },
  {
    id: "maria-flor-sp",
    name: "Maria Flor",
    acronym: "Maria Flor",
    state: "SP",
    city: "Marília",
    contactPhone: "(14) 99154-9400",
    membershipFee: "Sem taxa de associacao",
    undeliveredStates: [],
    focus: ["Flores Medicinais", "Óleos Terapêuticos"],
    website: "https://www.mariaflor.org.br/",
    description: "Associação localizada em Marília / SP.",
    generalPricing: [],
    rating: 0,
    reviewCount: 0
  },
  {
    id: "accura-sp",
    name: "Accura",
    acronym: "Accura",
    state: "SP",
    city: "São Paulo",
    contactPhone: "(11) 95357-6240",
    membershipFee: "Sem taxa de associacao",
    undeliveredStates: [],
    focus: ["Acolhimento", "Tratamento Terapêutico"],
    website: "https://accura.org.br/",
    description: "Associação com sede em São Paulo / SP.",
    generalPricing: [],
    rating: 0,
    reviewCount: 0
  },
  {
    id: "anova-sp",
    name: "Anova",
    acronym: "Anova",
    state: "SP",
    city: "São Paulo",
    contactPhone: "(11) 95062-5168",
    membershipFee: "Sem taxa de associacao",
    undeliveredStates: [],
    focus: ["Acolhimento ao Paciente"],
    website: "https://anovacannabis.org.br/",
    description: "Associação localizada em São Paulo / SP.",
    generalPricing: [],
    rating: 0,
    reviewCount: 0
  },
  {
    id: "cultive-sp",
    name: "Cultive",
    acronym: "Cultive",
    state: "SP",
    city: "São Paulo",
    membershipFee: "Sem taxa de associacao",
    undeliveredStates: [],
    focus: ["Auto-cultivo", "Workshops", "Suporte Jurídico"],
    website: "https://cultive.org.br/",
    description: "Associação de ensino e capacitação em auto-cultivo terapêutico.",
    generalPricing: [],
    rating: 0,
    reviewCount: 0
  },
  {
    id: "flowermed",
    name: "FlowerMed",
    acronym: "FlowerMed",
    state: "BR",
    city: "Importação",
    contactPhone: "(21) 97292-3198",
    membershipFee: "Sem taxa de associacao",
    undeliveredStates: [],
    focus: ["Empresa Importadora"],
    website: "https://flowermed.com.br/",
    description: "Empresa e serviço de importação de derivados canabinoides.",
    generalPricing: [],
    rating: 0,
    reviewCount: 0
  },
  {
    id: "pro-vida-cannabis-sp",
    name: "Pró-Vida Cannabis",
    acronym: "Pró-Vida",
    state: "SP",
    city: "São Paulo",
    contactPhone: "(11) 99442-2277",
    membershipFee: "Sem taxa de associacao",
    undeliveredStates: [],
    focus: ["Acolhimento ao Paciente"],
    website: "https://www.providacannabis.com.br/",
    description: "Associação localizada em São Paulo / SP.",
    generalPricing: [],
    rating: 0,
    reviewCount: 0
  },
  {
    id: "zeleno-meds-sp",
    name: "Zeleno Meds",
    acronym: "Zeleno Meds",
    state: "BR",
    city: "Importação",
    contactPhone: "(11) 92152-6539",
    membershipFee: "Sem taxa de associacao",
    undeliveredStates: [],
    focus: ["Empresa Importadora"],
    website: "https://www.zelenomeds.com/",
    description: "Empresa de assessoria e importação de produtos canábicos.",
    generalPricing: [],
    rating: 0,
    reviewCount: 0
  },

  // ================= CEARÁ (CE) =================
  {
    id: "adapta-ce",
    name: "AdaptaCann",
    acronym: "AdaptaCann",
    state: "CE",
    city: "Fortaleza",
    contactPhone: "(85) 98135-3946",
    membershipFee: "Sem taxa de associacao",
    undeliveredStates: [],
    focus: ["Gummies", "Flores Indoor & Outdoor", "Acolhimento"],
    website: "https://adaptacann.com.br/",
    description: "Associação sediada em Fortaleza / CE com amplo catálogo de genéticas in natura e derivados comestíveis.",
    generalPricing: [
      {
        category: "Gummies",
        title: "Gummies Terapêuticas",
        details: "15mg (450mg total / 30 unidades): R$ 350,00"
      },
      {
        category: "Flores in Natura",
        title: "Flores Outdoor",
        details: "5g: R$ 335,00 | 2,5g: R$ 185,00"
      },
      {
        category: "Flores in Natura",
        title: "Flores Indoor",
        details: "5g: R$ 460,00 | 2,5g: R$ 240,00"
      }
    ],
    rating: 0,
    reviewCount: 0
  },
  {
    id: "damasceno-ce",
    name: "Instituto Damasceno",
    acronym: "Damasceno",
    state: "CE",
    city: "Baturité",
    contactPhone: "(85) 99627-7319",
    membershipFee: "Sem taxa de associacao",
    undeliveredStates: [],
    focus: ["Flores In Natura THC/CBD", "Cultivo Orgânico", "Acolhimento"],
    website: "https://institutodamasceno.com.br",
    description: "Foco em cultivo artesanal de alto padrão com genéticas selecionadas ricas em terpenos.",
    generalPricing: [
      {
        category: "Flores in Natura",
        title: "Flores Indoor THC / CBD",
        details: "1g: R$ 60,00 | 10g: R$ 400,00"
      }
    ],
    rating: 0,
    reviewCount: 0
  },
  {
    id: "abracam-ce",
    name: "Abracam",
    acronym: "Abracam",
    state: "CE",
    city: "Fortaleza",
    contactPhone: "85 98930-5017",
    membershipFee: "Sem taxa de associacao",
    undeliveredStates: [],
    focus: ["Acolhimento ao Paciente"],
    website: "https://abracam.org/",
    description: "Associação localizada em Fortaleza / CE.",
    generalPricing: [],
    rating: 0,
    reviewCount: 0
  },
  {
    id: "instituto-aho-ce",
    name: "Instituto Ahô",
    acronym: "Instituto Ahô",
    state: "CE",
    city: "Juazeiro do Norte",
    contactPhone: "(88) 988321283",
    membershipFee: "Sem taxa de associacao",
    undeliveredStates: [],
    focus: ["Flores Medicinais", "Óleos Terapêuticos"],
    website: "https://institutoaho.org.br/",
    description: "Instituto localizado em Juazeiro do Norte / CE.",
    generalPricing: [
      {
        category: "Flores in Natura",
        title: "Flores THC/CBD",
        details: "3,5g: R$ 250,00 | 7g: R$ 420,00"
      },
      {
        category: "Óleos",
        title: "Óleos CBD",
        details: "Frasco 30ml: R$ 320,00"
      }
    ],
    rating: 0,
    reviewCount: 0
  },

  // ================= DISTRITO FEDERAL (DF) =================
  {
    id: "abrapango-df",
    name: "Abrapango",
    acronym: "Abrapango",
    state: "DF",
    city: "Brasília",
    contactPhone: "(61) 99958-4998",
    membershipFee: "R$ 120,00 anual",
    undeliveredStates: [],
    focus: ["Acolhimento", "Educação"],
    website: "https://www.abrapango.ong/",
    description: "Associação de amparo e educação em saúde canábica em Brasília / DF.",
    generalPricing: [],
    rating: 0,
    reviewCount: 0
  },
  {
    id: "flor-do-amor-df",
    name: "Flor do Amor",
    acronym: "Flor do Amor",
    state: "DF",
    city: "Brasília",
    contactPhone: "(61) 99584-3229",
    membershipFee: "Sem taxa de associacao",
    undeliveredStates: [],
    focus: ["Acolhimento ao Paciente"],
    website: "https://www.flordoamor.org/",
    description: "Associação localizada em Brasília / DF.",
    generalPricing: [],
    rating: 0,
    reviewCount: 0
  },

  // ================= BAHIA (BA) =================
  {
    id: "aspaec-ba",
    name: "ASPAEC",
    acronym: "ASPAEC",
    state: "BA",
    city: "Paulo Afonso",
    contactPhone: "75 99932-0420",
    membershipFee: "Sem taxa de associacao",
    undeliveredStates: [],
    focus: ["Estudos Canábicos", "Acolhimento"],
    website: "https://aspaec.com/",
    description: "Associação sediada em Paulo Afonso / BA.",
    generalPricing: [],
    rating: 0,
    reviewCount: 0
  },

  // ================= GOIÁS (GO) =================
  {
    id: "cannabcura-go",
    name: "Cannabcura",
    acronym: "Cannabcura",
    state: "GO",
    city: "Senador Canedo",
    contactPhone: "(48) 97777-2222",
    membershipFee: "Sem taxa de associacao",
    undeliveredStates: [],
    focus: ["Flores Greenhouse", "Óleos Medicinais", "Apoio Terapêutico"],
    website: "https://cannabcura.com.br/",
    description: "Apoio completo ao paciente medicinal com genéticas de alto rendimento.",
    generalPricing: [
      {
        category: "Flores in Natura",
        title: "Flores Terapêuticas",
        details: "24K Gold: R$ 50,00/g"
      },
      {
        category: "Óleos",
        title: "Óleo CBD 3000mg / Óleo 1:1",
        details: "CBD 3000mg: R$ 270,00 | 1:1 THC:CBD: R$ 320,00"
      }
    ],
    rating: 0,
    reviewCount: 0
  },

  // ================= PARAÍBA (PB) =================
  {
    id: "abrace-pb",
    name: "Abrace Esperança",
    acronym: "ABRACE",
    state: "PB",
    city: "João Pessoa",
    contactPhone: "(83) 99872-0072",
    membershipFee: "Sem taxa de associacao",
    undeliveredStates: [],
    focus: ["Óleos Terapêuticos", "Atendimento Nacional"],
    website: "https://abraceesperanca.org.br",
    description: "Primeira associação do Brasil com autorização para cultivo e dispensação.",
    generalPricing: [],
    rating: 0,
    reviewCount: 0
  },
  {
    id: "acaflor-pb",
    name: "Acaflor",
    acronym: "Acaflor",
    state: "PB",
    city: "João Pessoa",
    contactPhone: "(83) 99674-5445",
    membershipFee: "Sem taxa de associacao",
    undeliveredStates: [],
    focus: ["Acolhimento ao Paciente"],
    website: "https://acaflor.org.br/",
    description: "Associação localizada em João Pessoa / PB.",
    generalPricing: [],
    rating: 0,
    reviewCount: 0
  },
  {
    id: "liga-canabica-pb",
    name: "Liga Canábica",
    acronym: "Liga Canábica",
    state: "PB",
    city: "João Pessoa",
    contactPhone: "(83) 99806-6101",
    membershipFee: "Sem taxa de associacao",
    undeliveredStates: [],
    focus: ["Acolhimento Familiar", "Direito à Saúde"],
    website: "https://ligacanabica.org.br/",
    description: "Associação localizada em João Pessoa / PB com suporte jurídico e social.",
    generalPricing: [],
    rating: 0,
    reviewCount: 0
  },

  // ================= PERNAMBUCO (PE) =================
  {
    id: "alianca-medicinal-pe",
    name: "Aliança Medicinal",
    acronym: "Aliança Medicinal",
    state: "PE",
    city: "Olinda",
    contactPhone: "(81) 99901-6547",
    membershipFee: "Sem taxa de associacao",
    undeliveredStates: [],
    focus: ["Óleos", "Acolhimento ao Paciente"],
    website: "https://www.aliancamedicinal.org/",
    description: "Associação com atendimento localizado em Olinda / PE.",
    generalPricing: [],
    rating: 0,
    reviewCount: 0
  },

  // ================= SANTA CATARINA (SC) =================
  {
    id: "apoiar-brasil-sc",
    name: "Apoiar Brasil",
    acronym: "Apoiar Brasil",
    state: "SC",
    city: "Braço do Norte",
    contactPhone: "(48) 99652-0153",
    membershipFee: "Sem taxa de associacao",
    undeliveredStates: [],
    focus: ["Acolhimento Social"],
    website: "https://apoiarbrasil.org/",
    description: "Associação com atuação em acolhimento em Braço do Norte / SC.",
    generalPricing: [],
    rating: 0,
    reviewCount: 0
  },

  // ================= SERGIPE (SE) =================
  {
    id: "alca-se",
    name: "ALCA",
    acronym: "ALCA",
    state: "SE",
    city: "São Cristóvão",
    contactPhone: "(11) 92178-8640",
    membershipFee: "Sem taxa de associacao",
    undeliveredStates: [],
    focus: ["Acolhimento", "Apoio a Pacientes"],
    website: "https://www.alcanabica.org/",
    description: "Associação localizada em São Cristóvão / SE.",
    generalPricing: [],
    rating: 0,
    reviewCount: 0
  }
];

// Função auxiliar para normalizar texto (remove acentos, traços e espaços)
function cleanStr(text: string): string {
  return (text || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

export function useAssociations() {
  const [associations, setAssociations] = useState<Association[]>(MOCK_ASSOCIATIONS);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    async function loadStatsFromSupabase() {
      if (!supabase) return;
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('reviews')
          .select('association_id, association_name, rating');

        if (!error && data && data.length > 0) {
          const rawReviews = data;

          setAssociations((prevList) =>
            prevList.map((assoc) => {
              const assocCleanName = cleanStr(assoc.name);
              const assocCleanAcronym = cleanStr(assoc.acronym);
              const assocCleanId = cleanStr(assoc.id.replace(/-[a-z]{2}$/, ''));

              // Filtra todos os reviews compatíveis com esta associação
              const matched = rawReviews.filter((r: any) => {
                const rName = cleanStr(r.association_name);
                const rId = cleanStr(r.association_id);

                return (
                  rName.includes(assocCleanName) ||
                  assocCleanName.includes(rName) ||
                  rName.includes(assocCleanAcronym) ||
                  assocCleanAcronym.includes(rName) ||
                  rId.includes(assocCleanId) ||
                  assocCleanId.includes(rId)
                );
              });

              if (matched.length > 0) {
                const total = matched.reduce((acc: number, curr: any) => acc + Number(curr.rating || 5), 0);
                return {
                  ...assoc,
                  rating: Number((total / matched.length).toFixed(1)),
                  reviewCount: matched.length
                };
              }

              return {
                ...assoc,
                rating: 0,
                reviewCount: 0
              };
            })
          );
        }
      } catch (err) {
        console.warn('Usando dados locais de associações:', err);
      } finally {
        setLoading(false);
      }
    }

    loadStatsFromSupabase();
  }, []);

  return { associations, loading };
}
