export interface PatientReview {
  id: string;
  strainId: string;
  strainName: string;
  associationId: string;
  associationName: string;
  rating: number;
  patientName: string;
  prescribingDoctor?: string;
  conditions: string[];
  positiveEffects: string[];
  sideEffects: string[];
  comment: string;
  isVerified: boolean;
  date: string;
}

export const COMMON_CONDITIONS = [
  'Ansiedade & Estresse',
  'Relaxamento Físico',
  'Insônia & Sono Profundo',
  'Dores Crônicas & Enxaqueca',
  'Foco, TDAH & Concentração',
  'Disposição & Combate à Fadiga',
  'Elevação de Humor & Bem-Estar',
  'Estímulo de Apetite & Náusea',
  'Anti-inflamatório & Pós-Treino',
  'Clareza sem Psicoatividade (CBD)'
];

export const SPECIFIC_PATIENT_REVIEWS: PatientReview[] = [
  // GORILLA FREAK - 3 relatos
  {
    id: "rev-gf-1",
    strainId: "strain-gorila-freak",
    strainName: "Gorila Freak",
    associationId: "institutodamasceno",
    associationName: "Instituto Damasceno",
    rating: 5,
    patientName: "Mariana Silveira",
    prescribingDoctor: "",
    conditions: ["Ansiedade & Estresse", "Insônia & Sono Profundo"],
    positiveEffects: ["Alívio imediato da ansiedade", "Relaxamento muscular", "Sono reparador"],
    sideEffects: ["Nenhum efeito adverso"],
    comment: "",
    isVerified: true,
    date: "24/08/2026"
  },
  {
    id: "rev-gf-2",
    strainId: "strain-gorila-freak",
    strainName: "Gorila Freak",
    associationId: "institutodamasceno",
    associationName: "Instituto Damasceno",
    rating: 5,
    patientName: "Lucas Machado",
    prescribingDoctor: "",
    conditions: ["Dores Crônicas & Enxaqueca"],
    positiveEffects: ["Alívio da dor crônica nas costas", "Redução de tensão"],
    sideEffects: ["Boca levemente seca"],
    comment: "",
    isVerified: true,
    date: "18/08/2026"
  },
  {
    id: "rev-gf-3",
    strainId: "strain-gorila-freak",
    strainName: "Gorila Freak",
    associationId: "institutodamasceno",
    associationName: "Instituto Damasceno",
    rating: 4,
    patientName: "Thiago H.",
    prescribingDoctor: "",
    conditions: ["Ansiedade & Estresse"],
    positiveEffects: ["Calma profunda", "Alívio da insônia"],
    sideEffects: ["Sonolência leve"],
    comment: "",
    isVerified: true,
    date: "10/08/2026"
  },

  // 24K GOLD - 3 relatos
  {
    id: "rev-24k-1",
    strainId: "strain-24k-gold",
    strainName: "24K Gold",
    associationId: "abrapango",
    associationName: "Abrapango",
    rating: 5,
    patientName: "Fernando",
    prescribingDoctor: "",
    conditions: ["Elevação de Humor & Bem-Estar", "Foco, TDAH & Concentração"],
    positiveEffects: ["Clareza mental", "Sensação de paz", "Disposição para o trabalho"],
    sideEffects: ["Nenhum efeito adverso"],
    comment: "",
    isVerified: true,
    date: "20/08/2026"
  },
  {
    id: "rev-24k-2",
    strainId: "strain-24k-gold",
    strainName: "24K Gold",
    associationId: "abrapango",
    associationName: "Abrapango",
    rating: 4,
    patientName: "Beatriz",
    prescribingDoctor: "",
    conditions: ["Disposição & Combate à Fadiga"],
    positiveEffects: ["Foco renovado", "Alívio do estresse diário"],
    sideEffects: ["Nenhum efeito adverso"],
    comment: "",
    isVerified: true,
    date: "14/08/2026"
  },
  {
    id: "rev-24k-3",
    strainId: "strain-24k-gold",
    strainName: "24K Gold",
    associationId: "institutodamasceno",
    associationName: "Instituto Damasceno",
    rating: 5,
    patientName: "Rodrigo F.",
    prescribingDoctor: "",
    conditions: ["Elevação de Humor & Bem-Estar"],
    positiveEffects: ["Sensação leve e alegre", "Aroma tangerina"],
    sideEffects: ["Nenhum efeito adverso"],
    comment: "",
    isVerified: true,
    date: "05/08/2026"
  },

  // GELATO 33 - 2 relatos
  {
    id: "rev-gelato-1",
    strainId: "strain-gelato-33",
    strainName: "Gelato 33",
    associationId: "liva",
    associationName: "Liva Cannabis",
    rating: 5,
    patientName: "Camila R.",
    prescribingDoctor: "",
    conditions: ["Ansiedade & Estresse", "Relaxamento Físico"],
    positiveEffects: ["Alívio da ansiedade", "Sabor adocicado excelente"],
    sideEffects: ["Nenhum efeito adverso"],
    comment: "",
    isVerified: true,
    date: "22/08/2026"
  },
  {
    id: "rev-gelato-2",
    strainId: "strain-gelato-33",
    strainName: "Gelato 33",
    associationId: "liva",
    associationName: "Liva Cannabis",
    rating: 4,
    patientName: "Gabriel V.",
    prescribingDoctor: "",
    conditions: ["Anti-inflamatório & Pós-Treino"],
    positiveEffects: ["Relaxamento pós-treino", "Diminuição de dores musculares"],
    sideEffects: ["Nenhum efeito adverso"],
    comment: "",
    isVerified: true,
    date: "12/08/2026"
  },

  // GORILA KUSH - 2 relatos
  {
    id: "rev-gk-1",
    strainId: "strain-gorila-kush",
    strainName: "Gorila Kush",
    associationId: "institutodamasceno",
    associationName: "Instituto Damasceno",
    rating: 5,
    patientName: "Eduardo Torres",
    prescribingDoctor: "",
    conditions: ["Insônia & Sono Profundo", "Dores Crônicas & Enxaqueca"],
    positiveEffects: ["Indução ao sono pesado", "Relaxamento físico intenso"],
    sideEffects: ["Nenhum efeito adverso"],
    comment: "",
    isVerified: true,
    date: "21/08/2026"
  },
  {
    id: "rev-gk-2",
    strainId: "strain-gorila-kush",
    strainName: "Gorila Kush",
    associationId: "institutodamasceno",
    associationName: "Instituto Damasceno",
    rating: 4,
    patientName: "Carla B.",
    prescribingDoctor: "",
    conditions: ["Insônia & Sono Profundo"],
    positiveEffects: ["Calma profunda"],
    sideEffects: ["Nenhum efeito adverso"],
    comment: "",
    isVerified: true,
    date: "11/08/2026"
  },

  // SUPER LEMON HAZE - 2 relatos
  {
    id: "rev-slh-1",
    strainId: "strain-super-lemon-haze",
    strainName: "Super Lemon Haze",
    associationId: "flores-brasil-mg",
    associationName: "Flores Brasil",
    rating: 5,
    patientName: "Renato Barbosa",
    prescribingDoctor: "",
    conditions: ["Disposição & Combate à Fadiga", "Foco, TDAH & Concentração"],
    positiveEffects: ["Energia matinal", "Foco cirúrgico"],
    sideEffects: ["Nenhum efeito adverso"],
    comment: "",
    isVerified: true,
    date: "19/08/2026"
  },

  // ZKITTLEZ - 2 relatos
  {
    id: "rev-zkit-1",
    strainId: "strain-zkittlez",
    strainName: "Zkittlez",
    associationId: "cannabcura-rs",
    associationName: "CannabCura",
    rating: 4,
    patientName: "Felipe",
    prescribingDoctor: "",
    conditions: ["Ansiedade & Estresse"],
    positiveEffects: ["Calma mental", "Sabor frutado"],
    sideEffects: ["Nenhum efeito adverso"],
    comment: "",
    isVerified: true,
    date: "23/08/2026"
  },

  // SOUR DIESEL - 2 relatos
  {
    id: "rev-sd-1",
    strainId: "strain-sour-diesel",
    strainName: "Sour Diesel",
    associationId: "alca-sp",
    associationName: "ALCA",
    rating: 5,
    patientName: "Matheus N.",
    prescribingDoctor: "",
    conditions: ["Disposição & Combate à Fadiga"],
    positiveEffects: ["Estímulo criativo", "Foco"],
    sideEffects: ["Nenhum efeito adverso"],
    comment: "",
    isVerified: true,
    date: "17/08/2026"
  },

  // NORTHERN LIGHTS - 2 relatos
  {
    id: "rev-nl-1",
    strainId: "strain-northern-lights",
    strainName: "Northern Lights",
    associationId: "institutodamasceno",
    associationName: "Instituto Damasceno",
    rating: 4,
    patientName: "Sabrina",
    prescribingDoctor: "",
    conditions: ["Insônia & Sono Profundo"],
    positiveEffects: ["Desligamento da mente", "Sono contínuo de 8h"],
    sideEffects: ["Nenhum efeito adverso"],
    comment: "",
    isVerified: true,
    date: "16/08/2026"
  },

  // ÓLEO CBD FULL SPECTRUM 3000MG - 2 relatos
  {
    id: "rev-oleo-cbd-1",
    strainId: "oleo-cbd-full-3000",
    strainName: "Óleo CBD Full Spectrum 3000mg",
    associationId: "institutodamasceno",
    associationName: "Instituto Damasceno",
    rating: 5,
    patientName: "Helena",
    prescribingDoctor: "",
    conditions: ["Ansiedade & Estresse", "Clareza sem Psicoatividade (CBD)"],
    positiveEffects: ["Estabilidade emocional", "Zero ansiedade diária"],
    sideEffects: ["Nenhum efeito adverso"],
    comment: "",
    isVerified: true,
    date: "25/08/2026"
  }
];
