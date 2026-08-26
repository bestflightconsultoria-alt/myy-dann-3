import { useState, useMemo } from 'react';
import { Strain } from '../types/strain';

const INITIAL_STRAINS: Strain[] = [
  {
    id: "strain-gorila-freak",
    name: "Gorila Freak",
    category: "flores",
    type: "H\u00edbrida",
    dominantCannabinoid: "THC",
    thc: "18% - 22%",
    cbd: "< 1%",
    genetics: "Gorila Kush x Strolona Freak",
    terpenes: ["Cariofileno", "Mirceno", "Humuleno"],
    aromaFlavor: "Amadeirado, terroso e picante com notas de pinho. Efeitos: Relaxamento f\u00edsico profundo e al\u00edvio do estresse.",
    description: "Amadeirado, terroso e picante com notas de pinho. Efeitos: Relaxamento f\u00edsico profundo e al\u00edvio do estresse.",
    effects: ["Controle de Ansiedade"],
    associations: [
      {
            "associationId": "institutodamasceno",
            "associationName": "Instituto Damasceno",
            "pricePerGram": 60.0,
            "priceDisplay": "R$ 60,00 (1g) | R$ 400,00 (10g)",
            "inStock": true,
            "cultivationType": "Certificado"
      }
]
  },
  {
    id: "strain-gorila-kush",
    name: "Gorila Kush",
    category: "flores",
    type: "Indica",
    dominantCannabinoid: "THC",
    thc: "20% - 24%",
    cbd: "< 1%",
    genetics: "Gorilla Glue #4 x OG Kush",
    terpenes: ["Cariofileno", "Limoneno", "Mirceno"],
    aromaFlavor: "Combustivel, terroso classico de Kush e cafe. Efeitos: Seda\u00e7\u00e3o corporal e al\u00edvio de dores cr\u00f4nicas.",
    description: "Combustivel, terroso classico de Kush e cafe. Efeitos: Seda\u00e7\u00e3o corporal e al\u00edvio de dores cr\u00f4nicas.",
    effects: ["Indu\u00e7\u00e3o ao Sono", "Al\u00edvio de Dores"],
    associations: [
      {
            "associationId": "institutodamasceno",
            "associationName": "Instituto Damasceno",
            "pricePerGram": 60.0,
            "priceDisplay": "R$ 60,00 (1g) | R$ 400,00 (10g) (Esgotado)",
            "inStock": false,
            "cultivationType": "Certificado"
      },
      {
            "associationId": "abrapango",
            "associationName": "Abrapango",
            "pricePerGram": 500.0,
            "priceDisplay": "R$ 500,00 (10g)",
            "inStock": true,
            "cultivationType": "Certificado"
      },
      {
            "associationId": "alca",
            "associationName": "ALCA",
            "pricePerGram": 49.5,
            "priceDisplay": "R$ 49,50/g",
            "inStock": true,
            "cultivationType": "Certificado"
      }
]
  },
  {
    id: "strain-harley-queen",
    name: "Harley Queen",
    category: "flores",
    type: "Sativa",
    dominantCannabinoid: "CBD",
    thc: "< 1%",
    cbd: "12% - 16%",
    genetics: "Harlequin x Dancehall",
    terpenes: ["Mirceno", "Pineno", "Cariofileno"],
    aromaFlavor: "Frutas doces tropicais e notas herbais. Efeitos: Ansiol\u00edtico, foco sem euforia e relaxamento leve.",
    description: "Frutas doces tropicais e notas herbais. Efeitos: Ansiol\u00edtico, foco sem euforia e relaxamento leve.",
    effects: ["Controle de Ansiedade", "Foco & Criatividade", "Eleva\u00e7\u00e3o de Humor"],
    associations: [
      {
            "associationId": "institutodamasceno",
            "associationName": "Instituto Damasceno",
            "pricePerGram": 60.0,
            "priceDisplay": "R$ 60,00 (1g) | R$ 400,00 (10g) (Esgotado)",
            "inStock": false,
            "cultivationType": "Certificado"
      }
]
  },
  {
    id: "strain-kama-kush",
    name: "Kama Kush",
    category: "flores",
    type: "Indica",
    dominantCannabinoid: "CBD",
    thc: "< 1%",
    cbd: "14% - 18%",
    genetics: "Kush x Alto CBD",
    terpenes: ["Cariofileno", "Mirceno", "Bisabolol"],
    aromaFlavor: "Terroso suave com especiarias e citrico. Efeitos: Calmante muscular e suporte ao sono.",
    description: "Terroso suave com especiarias e citrico. Efeitos: Calmante muscular e suporte ao sono.",
    effects: ["Indu\u00e7\u00e3o ao Sono", "Controle de Ansiedade", "Al\u00edvio de Dores"],
    associations: [
      {
            "associationId": "institutodamasceno",
            "associationName": "Instituto Damasceno",
            "pricePerGram": 60.0,
            "priceDisplay": "R$ 60,00 (1g) | R$ 400,00 (10g)",
            "inStock": true,
            "cultivationType": "Certificado"
      }
]
  },
  {
    id: "strain-mexican-ice",
    name: "Mexican Ice",
    category: "flores",
    type: "Sativa",
    dominantCannabinoid: "THC",
    thc: "19% - 23%",
    cbd: "< 1%",
    genetics: "Mexican Sativa x Afghan",
    terpenes: ["Limoneno", "Pineno", "Ocimeno"],
    aromaFlavor: "Citrico refrescante, floral e mentolado. Efeitos: Estimulante mental, euforia limpa e energia.",
    description: "Citrico refrescante, floral e mentolado. Efeitos: Estimulante mental, euforia limpa e energia.",
    effects: ["Foco & Criatividade", "Eleva\u00e7\u00e3o de Humor"],
    associations: [
      {
            "associationId": "institutodamasceno",
            "associationName": "Instituto Damasceno",
            "pricePerGram": 60.0,
            "priceDisplay": "R$ 60,00 (1g) | R$ 400,00 (10g)",
            "inStock": true,
            "cultivationType": "Certificado"
      }
]
  },
  {
    id: "strain-mimosa",
    name: "Mimosa",
    category: "flores",
    type: "Sativa",
    dominantCannabinoid: "THC",
    thc: "19% - 24%",
    cbd: "< 1%",
    genetics: "Clementine x Purple Punch",
    terpenes: ["Limoneno", "Mirceno", "Cariofileno"],
    aromaFlavor: "Citrico intenso, tangerina e frutas vermelhas. Efeitos: Eleva\u00e7\u00e3o de humor, energia diurna e combate \u00e0 depress\u00e3o.",
    description: "Citrico intenso, tangerina e frutas vermelhas. Efeitos: Eleva\u00e7\u00e3o de humor, energia diurna e combate \u00e0 depress\u00e3o.",
    effects: ["Foco & Criatividade", "Eleva\u00e7\u00e3o de Humor"],
    associations: [
      {
            "associationId": "institutodamasceno",
            "associationName": "Instituto Damasceno",
            "pricePerGram": 60.0,
            "priceDisplay": "R$ 60,00 (1g) | R$ 400,00 (10g)",
            "inStock": true,
            "cultivationType": "Certificado"
      }
]
  },
  {
    id: "strain-moby-dick",
    name: "Moby Dick",
    category: "flores",
    type: "Sativa",
    dominantCannabinoid: "THC",
    thc: "20% - 25%",
    cbd: "< 1%",
    genetics: "White Widow x Haze",
    terpenes: ["Mirceno", "Terpinoleno", "Pineno"],
    aromaFlavor: "Flores de alta qualidade, com aroma marcante e excelente produ\u00e7\u00e3o de resina. Uma gen\u00e9tica reconhecida pelo seu perfil equilibrado e pela qualidade consistente das flores.",
    description: "Flores de alta qualidade, com aroma marcante e excelente produ\u00e7\u00e3o de resina. Uma gen\u00e9tica reconhecida pelo seu perfil equilibrado e pela qualidade consistente das flores.",
    effects: ["Foco & Disposi\u00e7\u00e3o", "Est\u00edmulo Criativo", "Eleva\u00e7\u00e3o de Humor"],
    associations: [
      {
            "associationId": "institutodamasceno",
            "associationName": "Instituto Damasceno",
            "pricePerGram": 60.0,
            "priceDisplay": "R$ 60,00 (1g) | R$ 400,00 (10g)",
            "inStock": true,
            "cultivationType": "Certificado"
      },
      {
            "associationId": "liva",
            "associationName": "Liva",
            "pricePerGram": 55.0,
            "priceDisplay": "R$ 55,00/g",
            "inStock": true,
            "cultivationType": "Certificado"
      },
      {
            "associationId": "alca",
            "associationName": "ALCA",
            "pricePerGram": 35.0,
            "priceDisplay": "R$ 35,00/g",
            "inStock": true,
            "cultivationType": "Certificado"
      }
]
  },
  {
    id: "strain-purple-punch-cbd",
    name: "Purple Punch CBD",
    category: "flores",
    type: "H\u00edbrida",
    dominantCannabinoid: "CBD",
    thc: "< 1%",
    cbd: "13% - 17%",
    genetics: "Sour Diesel x Purple CBD",
    terpenes: ["Mirceno \ud83c\udf4b Perfil: h\u00edbrido com sele\u00e7\u00e3o para CBD Aroma: terroso, herbal, frutado e levemente c\u00edtrico Sabor: frutado, resinoso e encorpado Estrutura arom\u00e1tica: intensa, profunda e persistente Caracter\u00edstica marcante: combina\u00e7\u00e3o de notas frutadas e terrosas com fundo Diesel"],
    aromaFlavor: "Uva madura, mirtilo e nuance de diesel. Efeitos: Relaxamento suave, redu\u00e7\u00e3o de tens\u00e3o e ansiedade.",
    description: "Uva madura, mirtilo e nuance de diesel. Efeitos: Relaxamento suave, redu\u00e7\u00e3o de tens\u00e3o e ansiedade.",
    effects: ["Controle de Ansiedade"],
    associations: [
      {
            "associationId": "institutodamasceno",
            "associationName": "Instituto Damasceno",
            "pricePerGram": 60.0,
            "priceDisplay": "R$ 60,00 (1g) | R$ 400,00 (10g)",
            "inStock": true,
            "cultivationType": "Certificado"
      }
]
  },
  {
    id: "strain-purple-queen",
    name: "Purple Queen",
    category: "flores",
    type: "Indica",
    dominantCannabinoid: "THC",
    thc: "21% - 24%",
    cbd: "< 1%",
    genetics: "Hindu Kush x Purple Afghani",
    terpenes: ["Mirceno", "Cariofileno", "Linalol"],
    aromaFlavor: "Frutas roxas, terra umida e pinheiro afegao. Efeitos: Relaxamento corporal profundo e indutor de sono.",
    description: "Frutas roxas, terra umida e pinheiro afegao. Efeitos: Relaxamento corporal profundo e indutor de sono.",
    effects: ["Indu\u00e7\u00e3o ao Sono"],
    associations: [
      {
            "associationId": "institutodamasceno",
            "associationName": "Instituto Damasceno",
            "pricePerGram": 60.0,
            "priceDisplay": "R$ 60,00 (1g) | R$ 400,00 (10g)",
            "inStock": true,
            "cultivationType": "Certificado"
      }
]
  },
  {
    id: "strain-strolona-freak",
    name: "Strolona Freak",
    category: "flores",
    type: "H\u00edbrida",
    dominantCannabinoid: "THC",
    thc: "18% - 22%",
    cbd: "< 1%",
    genetics: "Selecao Propria Damasceno",
    terpenes: ["Cariofileno", "Humuleno", "Mirceno"],
    aromaFlavor: "Pungente, floral denso com nuances herbais. Efeitos: Al\u00edvio de dor e relaxamento mental.",
    description: "Pungente, floral denso com nuances herbais. Efeitos: Al\u00edvio de dor e relaxamento mental.",
    effects: ["Al\u00edvio de Dores"],
    associations: [
      {
            "associationId": "institutodamasceno",
            "associationName": "Instituto Damasceno",
            "pricePerGram": 60.0,
            "priceDisplay": "R$ 60,00 (1g) | R$ 400,00 (10g) (Esgotado)",
            "inStock": false,
            "cultivationType": "Certificado"
      }
]
  },
  {
    id: "strain-24k",
    name: "24K Gold",
    category: "flores",
    type: "Indica",
    dominantCannabinoid: "THC",
    thc: "18% - 24%",
    cbd: "< 1%",
    genetics: "Kosher Kush x Tangie",
    terpenes: ["Mirceno", "Limoneno", "Cariofileno"],
    aromaFlavor: "Tangerina madura, notas citricas intensas com fundo terroso e adocicado. Efeitos: Relaxamento fisico profundo, bem-estar, tranquilidade mental. Auxilio em ansiedade, estresse, tensao muscular e dores leves a moderadas sem sedacao imediata.",
    description: "Tangerina madura, notas citricas intensas com fundo terroso e adocicado. Efeitos: Relaxamento fisico profundo, bem-estar, tranquilidade mental. Auxilio em ansiedade, estresse, tensao muscular e dores leves a moderadas sem sedacao imediata.",
    effects: ["Indu\u00e7\u00e3o ao Sono", "Controle de Ansiedade", "Al\u00edvio de Dores"],
    associations: [
      {
            "associationId": "liva",
            "associationName": "Liva",
            "pricePerGram": 55.0,
            "priceDisplay": "R$ 55,00/g",
            "inStock": true,
            "cultivationType": "Certificado"
      },
      {
            "associationId": "cannabcura",
            "associationName": "CannabCura",
            "pricePerGram": 50.0,
            "priceDisplay": "R$ 50,00/g",
            "inStock": true,
            "cultivationType": "Certificado"
      },
      {
            "associationId": "abrapango",
            "associationName": "Abrapango",
            "pricePerGram": 500.0,
            "priceDisplay": "R$ 500,00 (10g)",
            "inStock": true,
            "cultivationType": "Certificado"
      }
]
  },
  {
    id: "strain-blue-dream",
    name: "Blue Dream",
    category: "flores",
    type: "Sativa",
    dominantCannabinoid: "THC",
    thc: "17% - 22%",
    cbd: "< 2%",
    genetics: "Blueberry x Haze",
    terpenes: ["Mirceno", "Pineno", "Cariofileno"],
    aromaFlavor: "Frutas vermelhas, mirtilo doce e floral. Efeitos: Euforia equilibrada e al\u00edvio de estresse.",
    description: "Frutas vermelhas, mirtilo doce e floral. Efeitos: Euforia equilibrada e al\u00edvio de estresse.",
    effects: ["Controle de Ansiedade", "Eleva\u00e7\u00e3o de Humor"],
    associations: [
      {
            "associationId": "liva",
            "associationName": "Liva",
            "pricePerGram": 55.0,
            "priceDisplay": "R$ 55,00/g",
            "inStock": true,
            "cultivationType": "Certificado"
      }
]
  },
  {
    id: "strain-oil-cbd-full-3000",
    name: "Oleo CBD Full Spectrum 3000mg",
    category: "oleos",
    type: "\u00d3leo",
    dominantCannabinoid: "CBD",
    thc: "< 0.2%",
    cbd: "3000mg (100mg/ml)",
    genetics: "Extracao Full Spectrum TCM",
    terpenes: ["Bisabolol", "Mirceno", "Cariofileno"],
    aromaFlavor: "Herbal natural suave e terroso. Efeitos: Ansiol\u00edtico, anti-inflamat\u00f3rio e suporte ao sono.",
    description: "Herbal natural suave e terroso. Efeitos: Ansiol\u00edtico, anti-inflamat\u00f3rio e suporte ao sono.",
    effects: ["Indu\u00e7\u00e3o ao Sono", "Controle de Ansiedade", "Al\u00edvio de Dores"],
    associations: [
      {
            "associationId": "liva",
            "associationName": "Liva",
            "pricePerGram": 290.0,
            "priceDisplay": "R$ 290,00",
            "inStock": true,
            "cultivationType": "Certificado"
      },
      {
            "associationId": "cannabcura",
            "associationName": "CannabCura",
            "pricePerGram": 270.0,
            "priceDisplay": "R$ 270,00",
            "inStock": true,
            "cultivationType": "Certificado"
      }
]
  },
  {
    id: "strain-oil-balanced-1-1",
    name: "Oleo Balanceado 1:1 THC:CBD",
    category: "oleos",
    type: "\u00d3leo",
    dominantCannabinoid: "THC",
    thc: "750mg (25mg/ml)",
    cbd: "750mg (25mg/ml)",
    genetics: "Blend Canabinoide em Oleo TCM",
    terpenes: ["Linalol", "Mirceno", "Humuleno"],
    aromaFlavor: "Herbal levemente picante. Efeitos: Analg\u00e9sico, miorrelaxante e modula\u00e7\u00e3o de ansiedade.",
    description: "Herbal levemente picante. Efeitos: Analg\u00e9sico, miorrelaxante e modula\u00e7\u00e3o de ansiedade.",
    effects: ["Controle de Ansiedade", "Al\u00edvio de Dores"],
    associations: [
      {
            "associationId": "cannabcura",
            "associationName": "CannabCura",
            "pricePerGram": 320.0,
            "priceDisplay": "R$ 320,00",
            "inStock": true,
            "cultivationType": "Certificado"
      }
]
  },
  {
    id: "strain-gummy-cbd-sleep",
    name: "Gummies CBD + CBN Sono Perfeito",
    category: "outros",
    type: "Gummies",
    dominantCannabinoid: "CBD",
    thc: "0%",
    cbd: "25mg CBD + 5mg CBN",
    genetics: "Extrato Broad Spectrum Relaxante",
    terpenes: ["Linalol", "Mirceno"],
    aromaFlavor: "Frutas Vermelhas / Amora. Efeitos: Sedativo suave, indu\u00e7\u00e3o e manuten\u00e7\u00e3o do sono.",
    description: "Frutas Vermelhas / Amora. Efeitos: Sedativo suave, indu\u00e7\u00e3o e manuten\u00e7\u00e3o do sono.",
    effects: ["Indu\u00e7\u00e3o ao Sono"],
    associations: [
      {
            "associationId": "liva",
            "associationName": "Liva",
            "pricePerGram": 190.0,
            "priceDisplay": "R$ 190,00 (30 gomas)",
            "inStock": true,
            "cultivationType": "Certificado"
      }
]
  },
  {
    id: "strain-end-game",
    name: "End Game",
    category: "flores",
    type: "H\u00edbrida",
    dominantCannabinoid: "THC",
    thc: "20% - 25%",
    cbd: "< 1%",
    genetics: "Cherry Punch x Planet of the Grapes (Ethos Genetics)",
    terpenes: ["Cariofileno", "Mirceno", "Limoneno"],
    aromaFlavor: "Frutas escuras, uva madura, notas de combustivel e azedo. Efeitos: Relaxamento corporal pesado, forte analg\u00e9sico para dores cr\u00f4nicas, redu\u00e7\u00e3o de estresse e suporte para ins\u00f4nia.",
    description: "Frutas escuras, uva madura, notas de combustivel e azedo. Efeitos: Relaxamento corporal pesado, forte analg\u00e9sico para dores cr\u00f4nicas, redu\u00e7\u00e3o de estresse e suporte para ins\u00f4nia.",
    effects: ["Indu\u00e7\u00e3o ao Sono", "Controle de Ansiedade", "Al\u00edvio de Dores"],
    associations: [
      {
            "associationId": "abrapango",
            "associationName": "Abrapango",
            "pricePerGram": 500.0,
            "priceDisplay": "R$ 500,00 (10g)",
            "inStock": true,
            "cultivationType": "Certificado"
      }
]
  },
  {
    id: "strain-gorilla-zkittlez",
    name: "Gorilla Zkittlez",
    category: "flores",
    type: "Indica",
    dominantCannabinoid: "THC",
    thc: "20% - 24%",
    cbd: "< 1%",
    genetics: "Gorilla Glue #4 x Zkittlez",
    terpenes: ["Cariofileno", "Mirceno", "Humuleno"],
    aromaFlavor: "Frutas tropicais doces, chocolate e nuance herbal pungente. Efeitos: Sensa\u00e7\u00e3o potente de calmante e tranquilidade, aux\u00edlio em espasmos musculares, dor cr\u00f4nica e est\u00edmulo de apetite.",
    description: "Frutas tropicais doces, chocolate e nuance herbal pungente. Efeitos: Sensa\u00e7\u00e3o potente de calmante e tranquilidade, aux\u00edlio em espasmos musculares, dor cr\u00f4nica e est\u00edmulo de apetite.",
    effects: ["Controle de Ansiedade", "Foco & Criatividade", "Al\u00edvio de Dores"],
    associations: [
      {
            "associationId": "abrapango",
            "associationName": "Abrapango",
            "pricePerGram": 500.0,
            "priceDisplay": "R$ 500,00 (10g)",
            "inStock": true,
            "cultivationType": "Certificado"
      }
]
  },
  {
    id: "strain-manga-rosa",
    name: "Manga Rosa",
    category: "flores",
    type: "Sativa",
    dominantCannabinoid: "THC",
    thc: "15% - 20%",
    cbd: "< 1%",
    genetics: "Landrace Nordestina Brasileira",
    terpenes: ["Mirceno", "Pineno", "Limoneno"],
    aromaFlavor: "Manga madura doce, herbal fresco e notas florais. Efeitos: Energ\u00e9tico, euf\u00f3rico e estimulante mental. Ideal para combate \u00e0 fadiga, depress\u00e3o, desmotiva\u00e7\u00e3o e uso diurno.",
    description: "Manga madura doce, herbal fresco e notas florais. Efeitos: Energ\u00e9tico, euf\u00f3rico e estimulante mental. Ideal para combate \u00e0 fadiga, depress\u00e3o, desmotiva\u00e7\u00e3o e uso diurno.",
    effects: ["Foco & Disposi\u00e7\u00e3o", "Est\u00edmulo Criativo", "Eleva\u00e7\u00e3o de Humor"],
    associations: [
      {
            "associationId": "abrapango",
            "associationName": "Abrapango",
            "pricePerGram": 500.0,
            "priceDisplay": "R$ 500,00 (10g)",
            "inStock": true,
            "cultivationType": "Certificado"
      }
]
  },
  {
    id: "strain-punto-rojo",
    name: "Punto Rojo (Colombian Red)",
    category: "flores",
    type: "Sativa",
    dominantCannabinoid: "THC",
    thc: "18% - 22%",
    cbd: "< 1%",
    genetics: "Landrace Colombiana de Altitude",
    terpenes: ["Pineno", "Mirceno", "Cariofileno"],
    aromaFlavor: "Frutado, terroso e amadeirado picante. Efeitos: Estimula\u00e7\u00e3o cerebral intensa, clareza mental, criatividade e eleva\u00e7\u00e3o de esp\u00edrito sem sensa\u00e7\u00e3o de peso corporal.",
    description: "Frutado, terroso e amadeirado picante. Efeitos: Estimula\u00e7\u00e3o cerebral intensa, clareza mental, criatividade e eleva\u00e7\u00e3o de esp\u00edrito sem sensa\u00e7\u00e3o de peso corporal.",
    effects: ["Foco & Criatividade"],
    associations: [
      {
            "associationId": "abrapango",
            "associationName": "Abrapango",
            "pricePerGram": 500.0,
            "priceDisplay": "R$ 500,00 (10g)",
            "inStock": true,
            "cultivationType": "Certificado"
      }
]
  },
  {
    id: "strain-cheddar-z",
    name: "Cheddar Z",
    category: "flores",
    type: "Indica",
    dominantCannabinoid: "THC",
    thc: "19% - 23%",
    cbd: "< 1%",
    genetics: "Cheese x Zkittlez",
    terpenes: ["Cariofileno", "Mirceno", "Humuleno"],
    aromaFlavor: "Queijo curado acido, frutas doces e notas pungentes. Efeitos: Miorrelaxante profundo, combate ao estresse e seda\u00e7\u00e3o leve.",
    description: "Queijo curado acido, frutas doces e notas pungentes. Efeitos: Miorrelaxante profundo, combate ao estresse e seda\u00e7\u00e3o leve.",
    effects: ["Indu\u00e7\u00e3o ao Sono", "Controle de Ansiedade"],
    associations: [
      {
            "associationId": "abrapango",
            "associationName": "Abrapango",
            "pricePerGram": 500.0,
            "priceDisplay": "R$ 500,00 (10g) (Esgotado)",
            "inStock": false,
            "cultivationType": "Certificado"
      }
]
  },
  {
    id: "strain-colombian-gold",
    name: "Colombian Gold",
    category: "flores",
    type: "Sativa",
    dominantCannabinoid: "THC",
    thc: "18% - 22%",
    cbd: "< 1%",
    genetics: "Landrace Santa Marta Colombiana",
    terpenes: ["Limoneno", "Pineno", "Mirceno"],
    aromaFlavor: "Skunk doce, limao citrico e notas de cha herbal. Efeitos: Elevador de humor, estimulante mental, foco e al\u00edvio de fadiga e ansiedade.",
    description: "Skunk doce, limao citrico e notas de cha herbal. Efeitos: Elevador de humor, estimulante mental, foco e al\u00edvio de fadiga e ansiedade.",
    effects: ["Controle de Ansiedade", "Foco & Criatividade", "Al\u00edvio de Dores"],
    associations: [
      {
            "associationId": "abrapango",
            "associationName": "Abrapango",
            "pricePerGram": 500.0,
            "priceDisplay": "R$ 500,00 (10g) (Esgotado)",
            "inStock": false,
            "cultivationType": "Certificado"
      }
]
  },
  {
    id: "strain-dgusta",
    name: "D'Gusta",
    category: "flores",
    type: "H\u00edbrida",
    dominantCannabinoid: "THC",
    thc: "18% - 23%",
    cbd: "< 1%",
    genetics: "Selecao Genetica Abrapango",
    terpenes: ["Cariofileno", "Limoneno", "Linalol"],
    aromaFlavor: "Fruta madura, biscoito doce e toque condimentado. Efeitos: Equil\u00edbrio mente-corpo, al\u00edvio de estresse e bem-estar sem sonol\u00eancia.",
    description: "Fruta madura, biscoito doce e toque condimentado. Efeitos: Equil\u00edbrio mente-corpo, al\u00edvio de estresse e bem-estar sem sonol\u00eancia.",
    effects: ["Indu\u00e7\u00e3o ao Sono", "Controle de Ansiedade", "Eleva\u00e7\u00e3o de Humor"],
    associations: [
      {
            "associationId": "abrapango",
            "associationName": "Abrapango",
            "pricePerGram": 500.0,
            "priceDisplay": "R$ 500,00 (10g) (Esgotado)",
            "inStock": false,
            "cultivationType": "Certificado"
      }
]
  },
  {
    id: "strain-grape-cookies",
    name: "Grape Cookies",
    category: "flores",
    type: "Indica",
    dominantCannabinoid: "THC",
    thc: "20% - 24%",
    cbd: "< 1%",
    genetics: "Grape Ape x Girl Scout Cookies",
    terpenes: ["Mirceno", "Cariofileno", "Linalol"],
    aromaFlavor: "Uva doce, baunilha, massa de biscoito e terra umida. Efeitos: Relaxamento f\u00edsico intenso, aux\u00edlio em dores cr\u00f4nicas e suporte para o sono.",
    description: "Uva doce, baunilha, massa de biscoito e terra umida. Efeitos: Relaxamento f\u00edsico intenso, aux\u00edlio em dores cr\u00f4nicas e suporte para o sono.",
    effects: ["Indu\u00e7\u00e3o ao Sono", "Al\u00edvio de Dores"],
    associations: [
      {
            "associationId": "abrapango",
            "associationName": "Abrapango",
            "pricePerGram": 500.0,
            "priceDisplay": "R$ 500,00 (10g) (Esgotado)",
            "inStock": false,
            "cultivationType": "Certificado"
      }
]
  },
  {
    id: "strain-lemon-orange",
    name: "Lemon Orange",
    category: "flores",
    type: "Sativa",
    dominantCannabinoid: "THC",
    thc: "19% - 24%",
    cbd: "< 1%",
    genetics: "Super Lemon Haze x Clementine",
    terpenes: ["Limoneno", "Terpinoleno", "Pineno"],
    aromaFlavor: "Explosao citrica de limao siciliano e laranja madura. Efeitos: Energizante, foco aprimorado, motiva\u00e7\u00e3o e combate \u00e0 depress\u00e3o e des\u00e2nimo.",
    description: "Explosao citrica de limao siciliano e laranja madura. Efeitos: Energizante, foco aprimorado, motiva\u00e7\u00e3o e combate \u00e0 depress\u00e3o e des\u00e2nimo.",
    effects: ["Foco & Criatividade"],
    associations: [
      {
            "associationId": "abrapango",
            "associationName": "Abrapango",
            "pricePerGram": 500.0,
            "priceDisplay": "R$ 500,00 (10g) (Esgotado)",
            "inStock": false,
            "cultivationType": "Certificado"
      }
]
  },
  {
    id: "strain-pink-runtz",
    name: "Pink Runtz",
    category: "flores",
    type: "H\u00edbrida",
    dominantCannabinoid: "THC",
    thc: "20% - 25%",
    cbd: "< 1%",
    genetics: "Zkittlez x Gelato (Pheno Pink)",
    terpenes: ["Limoneno", "Cariofileno", "Linalol"],
    aromaFlavor: "Balas de frutas doces, azedinho cremoso e frutas vermelhas. Efeitos: Euforia duradoura, bem-estar social, al\u00edvio de estresse e dor sem ansiedade.",
    description: "Balas de frutas doces, azedinho cremoso e frutas vermelhas. Efeitos: Euforia duradoura, bem-estar social, al\u00edvio de estresse e dor sem ansiedade.",
    effects: ["Controle de Ansiedade", "Al\u00edvio de Dores", "Eleva\u00e7\u00e3o de Humor"],
    associations: [
      {
            "associationId": "abrapango",
            "associationName": "Abrapango",
            "pricePerGram": 500.0,
            "priceDisplay": "R$ 500,00 (10g) (Esgotado)",
            "inStock": false,
            "cultivationType": "Certificado"
      },
      {
            "associationId": "adaptacann",
            "associationName": "Adapta-Cann",
            "pricePerGram": 67.0,
            "priceDisplay": "R$ 67,00/g (Outdoor) | R$ 92,00/g (Indoor)",
            "inStock": true,
            "cultivationType": "Indoor / Org\u00e2nico"
      }
]
  },
  {
    id: "strain-sour-strawberry",
    name: "Sour Strawberry",
    category: "flores",
    type: "Sativa",
    dominantCannabinoid: "THC",
    thc: "19% - 23%",
    cbd: "< 1%",
    genetics: "Sour Diesel x Strawberry Cough",
    terpenes: ["Cariofileno", "Mirceno", "Pineno"],
    aromaFlavor: "Morango azedo, combustivel diesel e frutas vermelhas. Efeitos: Estimulante, eleva\u00e7\u00e3o de humor e al\u00edvio de fadiga e ansiedade.",
    description: "Morango azedo, combustivel diesel e frutas vermelhas. Efeitos: Estimulante, eleva\u00e7\u00e3o de humor e al\u00edvio de fadiga e ansiedade.",
    effects: ["Controle de Ansiedade", "Eleva\u00e7\u00e3o de Humor"],
    associations: [
      {
            "associationId": "abrapango",
            "associationName": "Abrapango",
            "pricePerGram": 500.0,
            "priceDisplay": "R$ 500,00 (10g) (Esgotado)",
            "inStock": false,
            "cultivationType": "Certificado"
      }
]
  },
  {
    id: "strain-watermelon",
    name: "Watermelon (Watermelon Zkittlez)",
    category: "flores",
    type: "Indica",
    dominantCannabinoid: "THC",
    thc: "20% - 24%",
    cbd: "< 1%",
    genetics: "Watermelon OG x Zkittlez",
    terpenes: ["Mirceno", "Limoneno", "Humuleno"],
    aromaFlavor: "Melancia doce refrescante, melao e fundo terroso. Efeitos: Calmante corporal, desacelera\u00e7\u00e3o do estresse e relaxamento noturno.",
    description: "Melancia doce refrescante, melao e fundo terroso. Efeitos: Calmante corporal, desacelera\u00e7\u00e3o do estresse e relaxamento noturno.",
    effects: ["Indu\u00e7\u00e3o ao Sono", "Controle de Ansiedade"],
    associations: [
      {
            "associationId": "abrapango",
            "associationName": "Abrapango",
            "pricePerGram": 500.0,
            "priceDisplay": "R$ 500,00 (10g) (Esgotado)",
            "inStock": false,
            "cultivationType": "Certificado"
      }
]
  },
  {
    id: "strain-yellow-melon",
    name: "Yellow Melon",
    category: "flores",
    type: "Sativa",
    dominantCannabinoid: "THC",
    thc: "18% - 22%",
    cbd: "< 1%",
    genetics: "Melon Kush x Lemon Skunk",
    terpenes: ["Limoneno", "Mirceno", "Ocimeno"],
    aromaFlavor: "Melao amarelo maduro, tropical e floral suave. Efeitos: Euforia leve, clareza mental e melhora do estado de esp\u00edrito.",
    description: "Melao amarelo maduro, tropical e floral suave. Efeitos: Euforia leve, clareza mental e melhora do estado de esp\u00edrito.",
    effects: ["Foco & Criatividade", "Eleva\u00e7\u00e3o de Humor"],
    associations: [
      {
            "associationId": "abrapango",
            "associationName": "Abrapango",
            "pricePerGram": 500.0,
            "priceDisplay": "R$ 500,00 (10g) (Esgotado)",
            "inStock": false,
            "cultivationType": "Certificado"
      }
]
  },
  {
    id: "strain-zkittle-cake",
    name: "Zkittle Cake (Zkittlez Cake)",
    category: "flores",
    type: "Indica",
    dominantCannabinoid: "THC",
    thc: "20% - 25%",
    cbd: "< 1%",
    genetics: "Zkittlez x Wedding Cake",
    terpenes: ["Cariofileno", "Limoneno", "Linalol"],
    aromaFlavor: "Bolo doce, baunilha, frutas tropicais e nota de pimenta. Efeitos: Profundamente relaxante, combate \u00e0 dor cr\u00f4nica, ansiedade e ins\u00f4nia.",
    description: "Bolo doce, baunilha, frutas tropicais e nota de pimenta. Efeitos: Profundamente relaxante, combate \u00e0 dor cr\u00f4nica, ansiedade e ins\u00f4nia.",
    effects: ["Indu\u00e7\u00e3o ao Sono", "Controle de Ansiedade", "Al\u00edvio de Dores"],
    associations: [
      {
            "associationId": "abrapango",
            "associationName": "Abrapango",
            "pricePerGram": 500.0,
            "priceDisplay": "R$ 500,00 (10g) (Esgotado)",
            "inStock": false,
            "cultivationType": "Certificado"
      }
]
  },
  {
    id: "oil-cbd-1-1-thc-1500mg-abrapango",
    name: "Oleo CBD 1:1 THC 1500mg (Abrapango)",
    category: "oleos",
    type: "\u00d3leo",
    dominantCannabinoid: "THC/CBD",
    thc: "25mg/ml (750mg total)",
    cbd: "25mg/ml (750mg total)",
    genetics: "Extrato vegetal de Cannabis Sativa CBD/THC em \u00d3leo de MCT",
    terpenes: ["Bisabolol", "Mirceno", "Cariofileno"],
    aromaFlavor: "Herbal natural de Cannabis em TCM. Efeitos: Equil\u00edbrio sin\u00e9rgico (efeito entourage) para dores cr\u00f4nicas, modula\u00e7\u00e3o de ansiedade, dist\u00farbios do sono e rigidez muscular.",
    description: "Herbal natural de Cannabis em TCM. Efeitos: Equil\u00edbrio sin\u00e9rgico (efeito entourage) para dores cr\u00f4nicas, modula\u00e7\u00e3o de ansiedade, dist\u00farbios do sono e rigidez muscular.",
    effects: ["Indu\u00e7\u00e3o ao Sono", "Controle de Ansiedade", "Al\u00edvio de Dores"],
    associations: [
      {
            "associationId": "abrapango",
            "associationName": "Abrapango",
            "pricePerGram": 450.0,
            "priceDisplay": "R$ 450,00 (30ml)",
            "inStock": true,
            "cultivationType": "Certificado"
      }
]
  },
  {
    id: "strain-frozen-biscuit-thc",
    name: "FROZEN BISCUIT  - THC",
    category: "flores",
    type: "H\u00edbrida",
    dominantCannabinoid: "THC",
    thc: "18% - 24%",
    cbd: "< 1%",
    genetics: "Oreoz x Biscotti Terpeno dominante: Cariofileno / H\u00famida Aroma: Doce, amanteigado, biscoito e baunilha. Come\u00e7a com euforia e melhora do humor; depois evolui para relaxamento corporal forte e prolongado.",
    terpenes: ["Cariofileno / H\u00famida Aroma: Doce, amanteigado, biscoito e baunilha. Come\u00e7a com euforia e melhora do humor", "depois evolui para relaxamento corporal forte e prolongado."],
    aromaFlavor: "Gen\u00e9tica: Oreoz x Biscotti Terpeno dominante: Cariofileno / H\u00famida Aroma: Doce, amanteigado, biscoito e baunilha. Come\u00e7a com euforia e melhora do humor; depois evolui para relaxamento corporal forte e prolongado.",
    description: "Gen\u00e9tica: Oreoz x Biscotti Terpeno dominante: Cariofileno / H\u00famida Aroma: Doce, amanteigado, biscoito e baunilha. Come\u00e7a com euforia e melhora do humor; depois evolui para relaxamento corporal forte e prolongado.",
    effects: ["Eleva\u00e7\u00e3o de Humor"],
    associations: [
      {
            "associationId": "institutodamasceno",
            "associationName": "Instituto Damasceno",
            "pricePerGram": 60.0,
            "priceDisplay": "R$ 60,00 (1g) | R$ 600,00 (10g)",
            "inStock": true,
            "cultivationType": "Certificado"
      }
]
  },
  {
    id: "strain-oleo-de-thc-10ml-100mg-ml",
    name: "\u00d3leo de THC - 10ML - 100mg/ml",
    category: "oleos",
    type: "\u00d3leo",
    dominantCannabinoid: "THC",
    thc: "18% - 24%",
    cbd: "< 1%",
    genetics: "\u00d3leo de THC - 10ML - 100mg/ml",
    terpenes: ["Cariofileno", "Mirceno", "Limoneno"],
    aromaFlavor: "Full Spectrum",
    description: "Full Spectrum",
    effects: ["Equil\u00edbrio F\u00edsico e Mental", "Ansiol\u00edtico Suave", "Al\u00edvio de Estresse"],
    associations: [
      {
            "associationId": "institutodamasceno",
            "associationName": "Instituto Damasceno",
            "pricePerGram": 200.0,
            "priceDisplay": "R$ 200,00",
            "inStock": true,
            "cultivationType": "Certificado"
      }
]
  },
  {
    id: "strain-oleo-de-thc-10ml-200mg-ml",
    name: "\u00d3leo de THC - 10ML - 200mg/ml",
    category: "oleos",
    type: "\u00d3leo",
    dominantCannabinoid: "THC",
    thc: "18% - 24%",
    cbd: "< 1%",
    genetics: "\u00d3leo de THC - 10ML - 200mg/ml",
    terpenes: ["Cariofileno", "Mirceno", "Limoneno"],
    aromaFlavor: "Full Spectrum",
    description: "Full Spectrum",
    effects: ["Equil\u00edbrio F\u00edsico e Mental", "Ansiol\u00edtico Suave", "Al\u00edvio de Estresse"],
    associations: [
      {
            "associationId": "institutodamasceno",
            "associationName": "Instituto Damasceno",
            "pricePerGram": 380.0,
            "priceDisplay": "R$ 380,00",
            "inStock": true,
            "cultivationType": "Certificado"
      }
]
  },
  {
    id: "strain-oleo-de-thc-10ml-50mg-ml",
    name: "\u00d3leo de THC - 10ML - 50mg/ml",
    category: "oleos",
    type: "\u00d3leo",
    dominantCannabinoid: "THC",
    thc: "18% - 24%",
    cbd: "< 1%",
    genetics: "\u00d3leo de THC - 10ML - 50mg/ml",
    terpenes: ["Cariofileno", "Mirceno", "Limoneno"],
    aromaFlavor: "Full Spectrum",
    description: "Full Spectrum",
    effects: ["Equil\u00edbrio F\u00edsico e Mental", "Ansiol\u00edtico Suave", "Al\u00edvio de Estresse"],
    associations: [
      {
            "associationId": "institutodamasceno",
            "associationName": "Instituto Damasceno",
            "pricePerGram": 130.0,
            "priceDisplay": "R$ 130,00",
            "inStock": true,
            "cultivationType": "Certificado"
      }
]
  },
  {
    id: "strain-oleo-de-thc-30ml-100mg-ml",
    name: "\u00d3leo de THC - 30ML - 100mg/ml",
    category: "oleos",
    type: "\u00d3leo",
    dominantCannabinoid: "THC",
    thc: "18% - 24%",
    cbd: "< 1%",
    genetics: "\u00d3leo de THC - 30ML - 100mg/ml",
    terpenes: ["Cariofileno", "Mirceno", "Limoneno"],
    aromaFlavor: "Full Spectrum",
    description: "Full Spectrum",
    effects: ["Equil\u00edbrio F\u00edsico e Mental", "Ansiol\u00edtico Suave", "Al\u00edvio de Estresse"],
    associations: [
      {
            "associationId": "institutodamasceno",
            "associationName": "Instituto Damasceno",
            "pricePerGram": 350.0,
            "priceDisplay": "R$ 350,00",
            "inStock": true,
            "cultivationType": "Certificado"
      }
]
  },
  {
    id: "strain-oleo-de-thc-30ml-200mg-ml",
    name: "\u00d3leo de THC - 30ML - 200mg/ml",
    category: "oleos",
    type: "\u00d3leo",
    dominantCannabinoid: "THC",
    thc: "18% - 24%",
    cbd: "< 1%",
    genetics: "\u00d3leo de THC - 30ML - 200mg/ml",
    terpenes: ["Cariofileno", "Mirceno", "Limoneno"],
    aromaFlavor: "Full Spectrum",
    description: "Full Spectrum",
    effects: ["Equil\u00edbrio F\u00edsico e Mental", "Ansiol\u00edtico Suave", "Al\u00edvio de Estresse"],
    associations: [
      {
            "associationId": "institutodamasceno",
            "associationName": "Instituto Damasceno",
            "pricePerGram": 600.0,
            "priceDisplay": "R$ 600,00",
            "inStock": true,
            "cultivationType": "Certificado"
      }
]
  },
  {
    id: "strain-oleo-de-thc-30ml-50mg-ml",
    name: "\u00d3leo de THC - 30ML - 50mg/ml",
    category: "oleos",
    type: "\u00d3leo",
    dominantCannabinoid: "THC",
    thc: "18% - 24%",
    cbd: "< 1%",
    genetics: "\u00d3leo de THC - 30ML - 50mg/ml",
    terpenes: ["Cariofileno", "Mirceno", "Limoneno"],
    aromaFlavor: "Full Spectrum",
    description: "Full Spectrum",
    effects: ["Equil\u00edbrio F\u00edsico e Mental", "Ansiol\u00edtico Suave", "Al\u00edvio de Estresse"],
    associations: [
      {
            "associationId": "institutodamasceno",
            "associationName": "Instituto Damasceno",
            "pricePerGram": 250.0,
            "priceDisplay": "R$ 250,00",
            "inStock": true,
            "cultivationType": "Certificado"
      }
]
  },
  {
    id: "strain-sour-diesel-thc",
    name: "SOUR DIESEL \u26fd- THC",
    category: "flores",
    type: "Sativa",
    dominantCannabinoid: "THC",
    thc: "18% - 24%",
    cbd: "< 1%",
    genetics: "Chemdawg x Super Skunk",
    terpenes: ["Cariofileno", "Mirceno", "Limoneno"],
    aromaFlavor: "Flores de alta qualidade, com aroma intenso e perfil marcante. Uma gen\u00e9tica cl\u00e1ssica, reconhecida pela excelente produ\u00e7\u00e3o de resina e qualidade consistente.",
    description: "Flores de alta qualidade, com aroma intenso e perfil marcante. Uma gen\u00e9tica cl\u00e1ssica, reconhecida pela excelente produ\u00e7\u00e3o de resina e qualidade consistente.",
    effects: ["Foco & Disposi\u00e7\u00e3o", "Est\u00edmulo Criativo", "Eleva\u00e7\u00e3o de Humor"],
    associations: [
      {
            "associationId": "institutodamasceno",
            "associationName": "Instituto Damasceno",
            "pricePerGram": 70.0,
            "priceDisplay": "R$ 70,00 (1g) | R$ 700,00 (10g)",
            "inStock": true,
            "cultivationType": "Certificado"
      },
      {
            "associationId": "alca",
            "associationName": "ALCA",
            "pricePerGram": 35.0,
            "priceDisplay": "R$ 35,00/g",
            "inStock": true,
            "cultivationType": "Certificado"
      }
]
  },
  {
    id: "strain-bubba-kush-thc",
    name: "BUBBA KUSH  - THC",
    category: "flores",
    type: "Indica",
    dominantCannabinoid: "THC",
    thc: "18% - 24%",
    cbd: "< 1%",
    genetics: "Bubba Kush pr\u00e9-98 x Bubba Kush pr\u00e9-98",
    terpenes: ["Mirceno"],
    aromaFlavor: "Flores de alta qualidade, com aroma marcante e excelente produ\u00e7\u00e3o de resina. Uma gen\u00e9tica reconhecida pela sua qualidade consistente e perfil cl\u00e1ssico.",
    description: "Flores de alta qualidade, com aroma marcante e excelente produ\u00e7\u00e3o de resina. Uma gen\u00e9tica reconhecida pela sua qualidade consistente e perfil cl\u00e1ssico.",
    effects: ["Relaxamento Corporal", "Seda\u00e7\u00e3o Noturna", "Al\u00edvio de Tens\u00f5es"],
    associations: [
      {
            "associationId": "institutodamasceno",
            "associationName": "Instituto Damasceno",
            "pricePerGram": 60.0,
            "priceDisplay": "R$ 60,00 (1g) | R$ 600,00 (10g) (Esgotado)",
            "inStock": false,
            "cultivationType": "Certificado"
      },
      {
            "associationId": "alca",
            "associationName": "ALCA",
            "pricePerGram": 45.0,
            "priceDisplay": "R$ 45,00/g",
            "inStock": true,
            "cultivationType": "Certificado"
      }
]
  },
  {
    id: "strain-dr-cbd",
    name: "DR CBD",
    category: "flores",
    type: "Sativa",
    dominantCannabinoid: "CBD",
    thc: "18% - 24%",
    cbd: "< 1%",
    genetics: "CBD asi\u00e1tico x CBD asi\u00e1tico",
    terpenes: ["Cariofileno", "Mirceno", "Limoneno"],
    aromaFlavor: "Gen\u00e9tica: CBD asi\u00e1tico x CBD asi\u00e1tico \u2192 Rico em CBD (Limoneno) Sativa Dominante Aroma c\u00edtrico e herbal. Efeito de relaxamento, redu\u00e7\u00e3o da ansiedade, pode auxiliar no manejo de dores e mant\u00e9m maior clareza mental.",
    description: "Gen\u00e9tica: CBD asi\u00e1tico x CBD asi\u00e1tico \u2192 Rico em CBD (Limoneno) Sativa Dominante Aroma c\u00edtrico e herbal. Efeito de relaxamento, redu\u00e7\u00e3o da ansiedade, pode auxiliar no manejo de dores e mant\u00e9m maior clareza mental.",
    effects: ["Controle de Ansiedade", "Foco & Criatividade", "Al\u00edvio de Dores"],
    associations: [
      {
            "associationId": "institutodamasceno",
            "associationName": "Instituto Damasceno",
            "pricePerGram": 100.0,
            "priceDisplay": "R$ 100,00 (1g) | R$ 1000,00 (10g) (Esgotado)",
            "inStock": false,
            "cultivationType": "Certificado"
      }
]
  },
  {
    id: "strain-mobidick-thc",
    name: "Mobidick - THC",
    category: "flores",
    type: "H\u00edbrida",
    dominantCannabinoid: "THC",
    thc: "18% - 24%",
    cbd: "< 1%",
    genetics: "White Widow x Haze Terpeno dominante: Mirceno \ud83e\udd6d Perfil: h\u00edbrido Aroma: terroso, herbal, frutado e levemente c\u00edtrico Sabor: encorpado, resinoso e frutado Estrutura arom\u00e1tica: intensa, complexa e persistente Caracter\u00edstica marcante: combina\u00e7\u00e3o de resina, frutas maduras e fundo herbal",
    terpenes: ["Mirceno \ud83e\udd6d Perfil: h\u00edbrido Aroma: terroso, herbal, frutado e levemente c\u00edtrico Sabor: encorpado, resinoso e frutado Estrutura arom\u00e1tica: intensa, complexa e persistente Caracter\u00edstica marcante: combina\u00e7\u00e3o de resina, frutas maduras e fundo herbal"],
    aromaFlavor: "Mobidick \ud83d\udc0b Gen\u00e9tica: White Widow x Haze Terpeno dominante: Mirceno \ud83e\udd6d Perfil: h\u00edbrido Aroma: terroso, herbal, frutado e levemente c\u00edtrico Sabor: encorpado, resinoso e frutado Estrutura arom\u00e1tica: intensa, complexa e persistente Caracter\u00edstica marcante: combina\u00e7\u00e3o de resina, frutas maduras e fundo herbal",
    description: "Mobidick \ud83d\udc0b Gen\u00e9tica: White Widow x Haze Terpeno dominante: Mirceno \ud83e\udd6d Perfil: h\u00edbrido Aroma: terroso, herbal, frutado e levemente c\u00edtrico Sabor: encorpado, resinoso e frutado Estrutura arom\u00e1tica: intensa, complexa e persistente Caracter\u00edstica marcante: combina\u00e7\u00e3o de resina, frutas maduras e fundo herbal",
    effects: ["Equil\u00edbrio F\u00edsico e Mental", "Ansiol\u00edtico Suave", "Al\u00edvio de Estresse"],
    associations: [
      {
            "associationId": "institutodamasceno",
            "associationName": "Instituto Damasceno",
            "pricePerGram": 70.0,
            "priceDisplay": "R$ 70,00 (1g) | R$ 700,00 (10g) (Esgotado)",
            "inStock": false,
            "cultivationType": "Certificado"
      }
]
  },
  {
    id: "strain-oleo-7-1-30ml-cbd-thc-100mg-ml",
    name: "\u00d3leo 7:1 - 30ML - (CBD + THC) 100mg/ml",
    category: "oleos",
    type: "\u00d3leo",
    dominantCannabinoid: "CBD",
    thc: "18% - 24%",
    cbd: "< 1%",
    genetics: "\u00d3leo 7:1 - 30ML - (CBD + THC) 100mg/ml",
    terpenes: ["Cariofileno", "Mirceno", "Limoneno"],
    aromaFlavor: "Full Spectrum",
    description: "Full Spectrum",
    effects: ["Al\u00edvio de Ansiedade", "Anti-inflamat\u00f3rio", "Clareza sem Psicoatividade"],
    associations: [
      {
            "associationId": "institutodamasceno",
            "associationName": "Instituto Damasceno",
            "pricePerGram": 350.0,
            "priceDisplay": "R$ 350,00 (Esgotado)",
            "inStock": false,
            "cultivationType": "Certificado"
      }
]
  },
  {
    id: "strain-oleo-7-1-30ml-cbd-thc-200mg-ml",
    name: "\u00d3leo 7:1 - 30ML - (CBD + THC) 200mg/ml",
    category: "oleos",
    type: "\u00d3leo",
    dominantCannabinoid: "CBD",
    thc: "18% - 24%",
    cbd: "< 1%",
    genetics: "\u00d3leo 7:1 - 30ML - (CBD + THC) 200mg/ml",
    terpenes: ["Cariofileno", "Mirceno", "Limoneno"],
    aromaFlavor: "Full Spectrum",
    description: "Full Spectrum",
    effects: ["Al\u00edvio de Ansiedade", "Anti-inflamat\u00f3rio", "Clareza sem Psicoatividade"],
    associations: [
      {
            "associationId": "institutodamasceno",
            "associationName": "Instituto Damasceno",
            "pricePerGram": 600.0,
            "priceDisplay": "R$ 600,00 (Esgotado)",
            "inStock": false,
            "cultivationType": "Certificado"
      }
]
  },
  {
    id: "strain-oleo-7-1-30ml-cbd-thc-50mg-ml",
    name: "\u00d3leo 7:1 - 30ML - (CBD + THC) 50mg/ml",
    category: "oleos",
    type: "\u00d3leo",
    dominantCannabinoid: "CBD",
    thc: "18% - 24%",
    cbd: "< 1%",
    genetics: "\u00d3leo 7:1 - 30ML - (CBD + THC) 50mg/ml",
    terpenes: ["Cariofileno", "Mirceno", "Limoneno"],
    aromaFlavor: "Full Spectrum",
    description: "Full Spectrum",
    effects: ["Al\u00edvio de Ansiedade", "Anti-inflamat\u00f3rio", "Clareza sem Psicoatividade"],
    associations: [
      {
            "associationId": "institutodamasceno",
            "associationName": "Instituto Damasceno",
            "pricePerGram": 250.0,
            "priceDisplay": "R$ 250,00 (Esgotado)",
            "inStock": false,
            "cultivationType": "Certificado"
      }
]
  },
  {
    id: "strain-oleo-de-cbd-10ml-100mg-ml",
    name: "\u00d3leo de CBD - 10ML - 100mg/ml",
    category: "oleos",
    type: "\u00d3leo",
    dominantCannabinoid: "CBD",
    thc: "18% - 24%",
    cbd: "< 1%",
    genetics: "\u00d3leo de CBD - 10ML - 100mg/ml",
    terpenes: ["Cariofileno", "Mirceno", "Limoneno"],
    aromaFlavor: "Full Spectrum",
    description: "Full Spectrum",
    effects: ["Al\u00edvio de Ansiedade", "Anti-inflamat\u00f3rio", "Clareza sem Psicoatividade"],
    associations: [
      {
            "associationId": "institutodamasceno",
            "associationName": "Instituto Damasceno",
            "pricePerGram": 200.0,
            "priceDisplay": "R$ 200,00",
            "inStock": true,
            "cultivationType": "Certificado"
      }
]
  },
  {
    id: "strain-oleo-de-cbd-10ml-200mg-ml",
    name: "\u00d3leo de CBD - 10ML - 200mg/ml",
    category: "oleos",
    type: "\u00d3leo",
    dominantCannabinoid: "CBD",
    thc: "18% - 24%",
    cbd: "< 1%",
    genetics: "\u00d3leo de CBD - 10ML - 200mg/ml",
    terpenes: ["Cariofileno", "Mirceno", "Limoneno"],
    aromaFlavor: "Full Spectrum",
    description: "Full Spectrum",
    effects: ["Al\u00edvio de Ansiedade", "Anti-inflamat\u00f3rio", "Clareza sem Psicoatividade"],
    associations: [
      {
            "associationId": "institutodamasceno",
            "associationName": "Instituto Damasceno",
            "pricePerGram": 380.0,
            "priceDisplay": "R$ 380,00",
            "inStock": true,
            "cultivationType": "Certificado"
      }
]
  },
  {
    id: "strain-oleo-de-cbd-10ml-50mg-ml",
    name: "\u00d3leo de CBD - 10ML - 50mg/ml",
    category: "oleos",
    type: "\u00d3leo",
    dominantCannabinoid: "CBD",
    thc: "18% - 24%",
    cbd: "< 1%",
    genetics: "\u00d3leo de CBD - 10ML - 50mg/ml",
    terpenes: ["Cariofileno", "Mirceno", "Limoneno"],
    aromaFlavor: "Full Spectrum",
    description: "Full Spectrum",
    effects: ["Al\u00edvio de Ansiedade", "Anti-inflamat\u00f3rio", "Clareza sem Psicoatividade"],
    associations: [
      {
            "associationId": "institutodamasceno",
            "associationName": "Instituto Damasceno",
            "pricePerGram": 130.0,
            "priceDisplay": "R$ 130,00 (Esgotado)",
            "inStock": false,
            "cultivationType": "Certificado"
      }
]
  },
  {
    id: "strain-oleo-de-cbd-30ml-100mg-ml",
    name: "\u00d3leo de CBD - 30ML - 100mg/ml",
    category: "oleos",
    type: "\u00d3leo",
    dominantCannabinoid: "CBD",
    thc: "18% - 24%",
    cbd: "< 1%",
    genetics: "\u00d3leo de CBD - 30ML - 100mg/ml",
    terpenes: ["Cariofileno", "Mirceno", "Limoneno"],
    aromaFlavor: "Full Spectrum",
    description: "Full Spectrum",
    effects: ["Al\u00edvio de Ansiedade", "Anti-inflamat\u00f3rio", "Clareza sem Psicoatividade"],
    associations: [
      {
            "associationId": "institutodamasceno",
            "associationName": "Instituto Damasceno",
            "pricePerGram": 350.0,
            "priceDisplay": "R$ 350,00 (Esgotado)",
            "inStock": false,
            "cultivationType": "Certificado"
      }
]
  },
  {
    id: "strain-oleo-de-cbd-30ml-200mg-ml",
    name: "\u00d3leo de CBD - 30ML - 200mg/ml",
    category: "oleos",
    type: "\u00d3leo",
    dominantCannabinoid: "CBD",
    thc: "18% - 24%",
    cbd: "< 1%",
    genetics: "\u00d3leo de CBD - 30ML - 200mg/ml",
    terpenes: ["Cariofileno", "Mirceno", "Limoneno"],
    aromaFlavor: "Full Spectrum",
    description: "Full Spectrum",
    effects: ["Al\u00edvio de Ansiedade", "Anti-inflamat\u00f3rio", "Clareza sem Psicoatividade"],
    associations: [
      {
            "associationId": "institutodamasceno",
            "associationName": "Instituto Damasceno",
            "pricePerGram": 600.0,
            "priceDisplay": "R$ 600,00",
            "inStock": true,
            "cultivationType": "Certificado"
      }
]
  },
  {
    id: "strain-oleo-de-cbd-30ml-50mg-ml",
    name: "\u00d3leo de CBD - 30ML - 50mg/ml",
    category: "oleos",
    type: "\u00d3leo",
    dominantCannabinoid: "CBD",
    thc: "18% - 24%",
    cbd: "< 1%",
    genetics: "\u00d3leo de CBD - 30ML - 50mg/ml",
    terpenes: ["Cariofileno", "Mirceno", "Limoneno"],
    aromaFlavor: "Full Spectrum",
    description: "Full Spectrum",
    effects: ["Al\u00edvio de Ansiedade", "Anti-inflamat\u00f3rio", "Clareza sem Psicoatividade"],
    associations: [
      {
            "associationId": "institutodamasceno",
            "associationName": "Instituto Damasceno",
            "pricePerGram": 250.0,
            "priceDisplay": "R$ 250,00",
            "inStock": true,
            "cultivationType": "Certificado"
      }
]
  },
  {
    id: "strain-super-og-thc",
    name: "SUPER OG \ud83c\udf19 - THC",
    category: "flores",
    type: "Indica",
    dominantCannabinoid: "THC",
    thc: "18% - 24%",
    cbd: "< 1%",
    genetics: "Hindu Kush x Ruderalis Indica Dominante Aroma frutado / gosto c\u00edtrico. Efeito relaxante e narc\u00f3tico.",
    terpenes: ["Cariofileno", "Mirceno", "Limoneno"],
    aromaFlavor: "Gen\u00e9tica: Hindu Kush x Ruderalis Indica Dominante Aroma frutado / gosto c\u00edtrico. Efeito relaxante e narc\u00f3tico. (Gosto c\u00edtrico).",
    description: "Gen\u00e9tica: Hindu Kush x Ruderalis Indica Dominante Aroma frutado / gosto c\u00edtrico. Efeito relaxante e narc\u00f3tico. (Gosto c\u00edtrico).",
    effects: ["Relaxamento Corporal", "Seda\u00e7\u00e3o Noturna", "Al\u00edvio de Tens\u00f5es"],
    associations: [
      {
            "associationId": "institutodamasceno",
            "associationName": "Instituto Damasceno",
            "pricePerGram": 70.0,
            "priceDisplay": "R$ 70,00 (1g) | R$ 700,00 (10g) (Esgotado)",
            "inStock": false,
            "cultivationType": "Certificado"
      }
]
  },
  {
    id: "strain-victory-thcv-1",
    name: "Victory THCV 1 \ud83d\udc8e",
    category: "flores",
    type: "Sativa",
    dominantCannabinoid: "THC",
    thc: "18% - 24%",
    cbd: "< 1%",
    genetics: "Landrace x Caprichosa Thai",
    terpenes: ["Cariofileno", "Mirceno", "Limoneno"],
    aromaFlavor: "Rica em THCV Gen\u00e9tica: Landrace x Caprichosa Thai (Limoneno, Pineno e Cariofileno) Aroma herbal, c\u00edtrico e levemente amadeirado Sativa Dominante / Aroma floral e picante com notas de con\u00edferas, como pinho, al\u00e9m de anis e alguns perfumes ou aroma resinoso.",
    description: "Rica em THCV Gen\u00e9tica: Landrace x Caprichosa Thai (Limoneno, Pineno e Cariofileno) Aroma herbal, c\u00edtrico e levemente amadeirado Sativa Dominante / Aroma floral e picante com notas de con\u00edferas, como pinho, al\u00e9m de anis e alguns perfumes ou aroma resinoso.",
    effects: ["Foco & Disposi\u00e7\u00e3o", "Est\u00edmulo Criativo", "Eleva\u00e7\u00e3o de Humor"],
    associations: [
      {
            "associationId": "institutodamasceno",
            "associationName": "Instituto Damasceno",
            "pricePerGram": 100.0,
            "priceDisplay": "R$ 100,00 (1g) | R$ 1000,00 (10g) (Esgotado)",
            "inStock": false,
            "cultivationType": "Certificado"
      }
]
  },
  {
    id: "strain-cbd-full-spectrum-1000mg",
    name: "CBD Full Spectrum 1000mg",
    category: "flores",
    type: "H\u00edbrida",
    dominantCannabinoid: "CBD",
    thc: "18% - 24%",
    cbd: "< 1%",
    genetics: "CBD Full Spectrum 1000mg",
    terpenes: ["Cariofileno", "Mirceno", "Limoneno"],
    aromaFlavor: "CBD Full Spectrum 1000mg",
    description: "CBD Full Spectrum 1000mg",
    effects: ["Al\u00edvio de Ansiedade", "Anti-inflamat\u00f3rio", "Clareza sem Psicoatividade"],
    associations: [
      {
            "associationId": "institutodamasceno",
            "associationName": "Instituto Damasceno",
            "pricePerGram": 357.9,
            "priceDisplay": "R$ 357,90",
            "inStock": true,
            "cultivationType": "Certificado"
      }
]
  },
  {
    id: "strain-cbd-full-spectrum-500mg",
    name: "CBD Full Spectrum 500mg",
    category: "flores",
    type: "H\u00edbrida",
    dominantCannabinoid: "CBD",
    thc: "18% - 24%",
    cbd: "< 1%",
    genetics: "CBD Full Spectrum 500mg",
    terpenes: ["Cariofileno", "Mirceno", "Limoneno"],
    aromaFlavor: "CBD Full Spectrum 500mg",
    description: "CBD Full Spectrum 500mg",
    effects: ["Al\u00edvio de Ansiedade", "Anti-inflamat\u00f3rio", "Clareza sem Psicoatividade"],
    associations: [
      {
            "associationId": "institutodamasceno",
            "associationName": "Instituto Damasceno",
            "pricePerGram": 215.9,
            "priceDisplay": "R$ 215,90 (Esgotado)",
            "inStock": false,
            "cultivationType": "Certificado"
      }
]
  },
  {
    id: "strain-oleo-71-10ml-cbd-thc-100mgml",
    name: "\u00d3leo 7:1 - 10ML - (CBD + THC) 100mg/ml",
    category: "oleos",
    type: "\u00d3leo",
    dominantCannabinoid: "CBD",
    thc: "18% - 24%",
    cbd: "< 1%",
    genetics: "\u00d3leo 7:1 - 10ML - (CBD + THC) 100mg/ml",
    terpenes: ["Cariofileno", "Mirceno", "Limoneno"],
    aromaFlavor: "Full Spectrum",
    description: "Full Spectrum",
    effects: ["Al\u00edvio de Ansiedade", "Anti-inflamat\u00f3rio", "Clareza sem Psicoatividade"],
    associations: [
      {
            "associationId": "institutodamasceno",
            "associationName": "Instituto Damasceno",
            "pricePerGram": 200.0,
            "priceDisplay": "R$ 200,00 (Esgotado)",
            "inStock": false,
            "cultivationType": "Certificado"
      }
]
  },
  {
    id: "strain-oleo-71-10ml-cbd-thc-200mgml",
    name: "\u00d3leo 7:1 - 10ML - (CBD + THC) 200mg/ml",
    category: "oleos",
    type: "\u00d3leo",
    dominantCannabinoid: "CBD",
    thc: "18% - 24%",
    cbd: "< 1%",
    genetics: "\u00d3leo 7:1 - 10ML - (CBD + THC) 200mg/ml",
    terpenes: ["Cariofileno", "Mirceno", "Limoneno"],
    aromaFlavor: "Full Spectrum",
    description: "Full Spectrum",
    effects: ["Al\u00edvio de Ansiedade", "Anti-inflamat\u00f3rio", "Clareza sem Psicoatividade"],
    associations: [
      {
            "associationId": "institutodamasceno",
            "associationName": "Instituto Damasceno",
            "pricePerGram": 380.0,
            "priceDisplay": "R$ 380,00 (Esgotado)",
            "inStock": false,
            "cultivationType": "Certificado"
      }
]
  },
  {
    id: "strain-oleo-71-10ml-cbd-thc-50mgml",
    name: "\u00d3leo 7:1 - 10ML - (CBD + THC) 50mg/ml",
    category: "oleos",
    type: "\u00d3leo",
    dominantCannabinoid: "CBD",
    thc: "18% - 24%",
    cbd: "< 1%",
    genetics: "\u00d3leo 7:1 - 10ML - (CBD + THC) 50mg/ml",
    terpenes: ["Cariofileno", "Mirceno", "Limoneno"],
    aromaFlavor: "Full Spectrum",
    description: "Full Spectrum",
    effects: ["Al\u00edvio de Ansiedade", "Anti-inflamat\u00f3rio", "Clareza sem Psicoatividade"],
    associations: [
      {
            "associationId": "institutodamasceno",
            "associationName": "Instituto Damasceno",
            "pricePerGram": 130.0,
            "priceDisplay": "R$ 130,00",
            "inStock": true,
            "cultivationType": "Certificado"
      }
]
  },
  {
    id: "strain-thc-full-spectrum-1000mg",
    name: "THC Full Spectrum 1000mg",
    category: "flores",
    type: "H\u00edbrida",
    dominantCannabinoid: "THC",
    thc: "18% - 24%",
    cbd: "< 1%",
    genetics: "THC Full Spectrum 1000mg",
    terpenes: ["Cariofileno", "Mirceno", "Limoneno"],
    aromaFlavor: "THC Full Spectrum 1000mg",
    description: "THC Full Spectrum 1000mg",
    effects: ["Equil\u00edbrio F\u00edsico e Mental", "Ansiol\u00edtico Suave", "Al\u00edvio de Estresse"],
    associations: [
      {
            "associationId": "institutodamasceno",
            "associationName": "Instituto Damasceno",
            "pricePerGram": 357.9,
            "priceDisplay": "R$ 357,90 (Esgotado)",
            "inStock": false,
            "cultivationType": "Certificado"
      }
]
  },
  {
    id: "strain-thc-full-spectrum-500mg",
    name: "THC Full Spectrum 500mg",
    category: "flores",
    type: "H\u00edbrida",
    dominantCannabinoid: "THC",
    thc: "18% - 24%",
    cbd: "< 1%",
    genetics: "THC Full Spectrum 500mg",
    terpenes: ["Cariofileno", "Mirceno", "Limoneno"],
    aromaFlavor: "THC Full Spectrum 500mg",
    description: "THC Full Spectrum 500mg",
    effects: ["Equil\u00edbrio F\u00edsico e Mental", "Ansiol\u00edtico Suave", "Al\u00edvio de Estresse"],
    associations: [
      {
            "associationId": "institutodamasceno",
            "associationName": "Instituto Damasceno",
            "pricePerGram": 215.9,
            "priceDisplay": "R$ 215,90 (Esgotado)",
            "inStock": false,
            "cultivationType": "Certificado"
      }
]
  },
  {
    id: "strain-pomada-in-natura",
    name: "Pomada in Natura",
    category: "outros",
    type: "Gummies",
    dominantCannabinoid: "THC",
    thc: "18% - 24%",
    cbd: "< 1%",
    genetics: "Pomada in Natura",
    terpenes: ["Cariofileno", "Mirceno", "Limoneno"],
    aromaFlavor: "Desenvolvida para uso t\u00f3pico, nossa Pomada de Cannabis \u00e9 produzida com folhas da planta e formulada para proporcionar sensa\u00e7\u00e3o de conforto, cuidado e bem-estar na regi\u00e3o aplicada. Modo de uso: aplicar uma pequena quantidade sobre a pele e massagear suavemente at\u00e9 a absor\u00e7\u00e3o, conforme orienta\u00e7\u00e3o do produto.",
    description: "Desenvolvida para uso t\u00f3pico, nossa Pomada de Cannabis \u00e9 produzida com folhas da planta e formulada para proporcionar sensa\u00e7\u00e3o de conforto, cuidado e bem-estar na regi\u00e3o aplicada. Modo de uso: aplicar uma pequena quantidade sobre a pele e massagear suavemente at\u00e9 a absor\u00e7\u00e3o, conforme orienta\u00e7\u00e3o do produto.",
    effects: ["Eleva\u00e7\u00e3o de Humor"],
    associations: [
      {
            "associationId": "institutodamasceno",
            "associationName": "Instituto Damasceno",
            "pricePerGram": 100.0,
            "priceDisplay": "R$ 100,00",
            "inStock": true,
            "cultivationType": "Certificado"
      }
]
  },
  {
    id: "strain-dr-cbd",
    name: "DR CBD \ud83e\ude7a",
    category: "flores",
    type: "Sativa",
    dominantCannabinoid: "CBD",
    thc: "18% - 24%",
    cbd: "< 1%",
    genetics: "CBD asi\u00e1tico x CBD asi\u00e1tico",
    terpenes: ["Cariofileno", "Mirceno", "Limoneno"],
    aromaFlavor: "Gen\u00e9tica: CBD asi\u00e1tico x CBD asi\u00e1tico \u2192 Rico em CBD (Limoneno) Sativa Dominante Aroma c\u00edtrico e herbal. Efeito de relaxamento, redu\u00e7\u00e3o da ansiedade, pode auxiliar no manejo de dores e mant\u00e9m maior clareza mental.",
    description: "Gen\u00e9tica: CBD asi\u00e1tico x CBD asi\u00e1tico \u2192 Rico em CBD (Limoneno) Sativa Dominante Aroma c\u00edtrico e herbal. Efeito de relaxamento, redu\u00e7\u00e3o da ansiedade, pode auxiliar no manejo de dores e mant\u00e9m maior clareza mental.",
    effects: ["Controle de Ansiedade", "Foco & Criatividade", "Al\u00edvio de Dores"],
    associations: [
      {
            "associationId": "institutodamasceno",
            "associationName": "Instituto Damasceno",
            "pricePerGram": 100.0,
            "priceDisplay": "R$ 100,00 (1g) | R$ 1000,00 (10g) (Esgotado)",
            "inStock": false,
            "cultivationType": "Certificado"
      }
]
  },
  {
    id: "strain-gelato-41",
    name: "Gelato #41",
    category: "flores",
    type: "H\u00edbrida",
    dominantCannabinoid: "THC",
    thc: "18% - 24%",
    cbd: "< 1%",
    genetics: "Sunset Sherbet x Girl Scout Cookies",
    terpenes: ["Cariofileno", "Linalool", "Limoneno"],
    aromaFlavor: "Flores de alta qualidade, com aroma adocicado e perfil equilibrado. Uma gen\u00e9tica muito apreciada pela sua excelente resina, apar\u00eancia e experi\u00eancia marcante.",
    description: "Flores de alta qualidade, com aroma adocicado e perfil equilibrado. Uma gen\u00e9tica muito apreciada pela sua excelente resina, apar\u00eancia e experi\u00eancia marcante.",
    effects: ["Equil\u00edbrio F\u00edsico e Mental", "Ansiol\u00edtico Suave", "Al\u00edvio de Estresse"],
    associations: [
      {
            "associationId": "alca",
            "associationName": "ALCA",
            "pricePerGram": 55.0,
            "priceDisplay": "R$ 55,00/g",
            "inStock": true,
            "cultivationType": "Certificado"
      },
      {
            "associationId": "adaptacann",
            "associationName": "Adapta-Cann",
            "pricePerGram": 67.0,
            "priceDisplay": "R$ 67,00/g (Outdoor) | R$ 92,00/g (Indoor)",
            "inStock": true,
            "cultivationType": "Indoor / Org\u00e2nico"
      }
]
  },
  {
    id: "strain-pineapple-express",
    name: "Pineapple Express",
    category: "flores",
    type: "H\u00edbrida",
    dominantCannabinoid: "THC",
    thc: "18% - 24%",
    cbd: "< 1%",
    genetics: "Pineapple Express",
    terpenes: ["Cariofileno", "Mirceno", "Limoneno"],
    aromaFlavor: "Flores de alta qualidade, com aroma agrad\u00e1vel e perfil tropical. Uma gen\u00e9tica muito apreciada pela excelente produ\u00e7\u00e3o de resina e qualidade consistente.",
    description: "Flores de alta qualidade, com aroma agrad\u00e1vel e perfil tropical. Uma gen\u00e9tica muito apreciada pela excelente produ\u00e7\u00e3o de resina e qualidade consistente.",
    effects: ["Equil\u00edbrio F\u00edsico e Mental", "Ansiol\u00edtico Suave", "Al\u00edvio de Estresse"],
    associations: [
      {
            "associationId": "alca",
            "associationName": "ALCA",
            "pricePerGram": 35.0,
            "priceDisplay": "R$ 35,00/g",
            "inStock": true,
            "cultivationType": "Certificado"
      }
]
  },
  {
    id: "strain-amnesia-haze",
    name: "Amnesia Haze",
    category: "flores",
    type: "H\u00edbrida",
    dominantCannabinoid: "THC",
    thc: "18% - 24%",
    cbd: "< 1%",
    genetics: "Amnesia Haze",
    terpenes: ["Cariofileno", "Mirceno", "Limoneno"],
    aromaFlavor: "Flores de alta qualidade, com aroma intenso e marcante. Uma gen\u00e9tica cl\u00e1ssica, reconhecida pela excelente produ\u00e7\u00e3o de resina e pelo perfil arom\u00e1tico caracter\u00edstico.",
    description: "Flores de alta qualidade, com aroma intenso e marcante. Uma gen\u00e9tica cl\u00e1ssica, reconhecida pela excelente produ\u00e7\u00e3o de resina e pelo perfil arom\u00e1tico caracter\u00edstico.",
    effects: ["Equil\u00edbrio F\u00edsico e Mental", "Ansiol\u00edtico Suave", "Al\u00edvio de Estresse"],
    associations: [
      {
            "associationId": "alca",
            "associationName": "ALCA",
            "pricePerGram": 55.0,
            "priceDisplay": "R$ 55,00/g",
            "inStock": true,
            "cultivationType": "Certificado"
      }
]
  },
  {
    id: "strain-acapulco-gold",
    name: "Acapulco Gold",
    category: "flores",
    type: "H\u00edbrida",
    dominantCannabinoid: "THC",
    thc: "18% - 24%",
    cbd: "< 1%",
    genetics: "Acapulco Gold",
    terpenes: ["Cariofileno", "Mirceno", "Limoneno"],
    aromaFlavor: "Flores de alta qualidade, com aroma marcante e perfil cl\u00e1ssico. Uma gen\u00e9tica renomada pela excelente produ\u00e7\u00e3o de resina, apar\u00eancia diferenciada e qualidade consistente.",
    description: "Flores de alta qualidade, com aroma marcante e perfil cl\u00e1ssico. Uma gen\u00e9tica renomada pela excelente produ\u00e7\u00e3o de resina, apar\u00eancia diferenciada e qualidade consistente.",
    effects: ["Equil\u00edbrio F\u00edsico e Mental", "Ansiol\u00edtico Suave", "Al\u00edvio de Estresse"],
    associations: [
      {
            "associationId": "alca",
            "associationName": "ALCA",
            "pricePerGram": 45.0,
            "priceDisplay": "R$ 45,00/g",
            "inStock": true,
            "cultivationType": "Certificado"
      }
]
  },
  {
    id: "strain-maui-wowie",
    name: "Maui Wowie",
    category: "flores",
    type: "H\u00edbrida",
    dominantCannabinoid: "THC",
    thc: "18% - 24%",
    cbd: "< 1%",
    genetics: "Maui Wowie",
    terpenes: ["Cariofileno", "Mirceno", "Limoneno"],
    aromaFlavor: "Flores de alta qualidade, com aroma agrad\u00e1vel e perfil tropical. Uma gen\u00e9tica cl\u00e1ssica, conhecida pela boa produ\u00e7\u00e3o de resina e excelente qualidade das flores.",
    description: "Flores de alta qualidade, com aroma agrad\u00e1vel e perfil tropical. Uma gen\u00e9tica cl\u00e1ssica, conhecida pela boa produ\u00e7\u00e3o de resina e excelente qualidade das flores.",
    effects: ["Equil\u00edbrio F\u00edsico e Mental", "Ansiol\u00edtico Suave", "Al\u00edvio de Estresse"],
    associations: [
      {
            "associationId": "alca",
            "associationName": "ALCA",
            "pricePerGram": 30.0,
            "priceDisplay": "R$ 30,00/g",
            "inStock": true,
            "cultivationType": "Certificado"
      }
]
  },
  {
    id: "strain-white-widow",
    name: "White Widow",
    category: "flores",
    type: "H\u00edbrida",
    dominantCannabinoid: "THC",
    thc: "18% - 24%",
    cbd: "< 1%",
    genetics: "White Widow",
    terpenes: ["Cariofileno", "Mirceno", "Limoneno"],
    aromaFlavor: "Flores de alta qualidade, com aroma marcante e excelente produ\u00e7\u00e3o de resina. Uma gen\u00e9tica cl\u00e1ssica e muito reconhecida pela sua consist\u00eancia e qualidade.",
    description: "Flores de alta qualidade, com aroma marcante e excelente produ\u00e7\u00e3o de resina. Uma gen\u00e9tica cl\u00e1ssica e muito reconhecida pela sua consist\u00eancia e qualidade.",
    effects: ["Equil\u00edbrio F\u00edsico e Mental", "Ansiol\u00edtico Suave", "Al\u00edvio de Estresse"],
    associations: [
      {
            "associationId": "alca",
            "associationName": "ALCA",
            "pricePerGram": 35.0,
            "priceDisplay": "R$ 35,00/g",
            "inStock": true,
            "cultivationType": "Certificado"
      }
]
  },
  {
    id: "strain-durban-poison",
    name: "Durban Poison",
    category: "flores",
    type: "H\u00edbrida",
    dominantCannabinoid: "THC",
    thc: "18% - 24%",
    cbd: "< 1%",
    genetics: "Durban Poison",
    terpenes: ["Cariofileno", "Mirceno", "Limoneno"],
    aromaFlavor: "Flores de alta qualidade, com aroma marcante e perfil cl\u00e1ssico. Uma gen\u00e9tica tradicional, reconhecida pela excelente produ\u00e7\u00e3o de resina e qualidade consistente.",
    description: "Flores de alta qualidade, com aroma marcante e perfil cl\u00e1ssico. Uma gen\u00e9tica tradicional, reconhecida pela excelente produ\u00e7\u00e3o de resina e qualidade consistente.",
    effects: ["Equil\u00edbrio F\u00edsico e Mental", "Ansiol\u00edtico Suave", "Al\u00edvio de Estresse"],
    associations: [
      {
            "associationId": "alca",
            "associationName": "ALCA",
            "pricePerGram": 35.0,
            "priceDisplay": "R$ 35,00/g",
            "inStock": true,
            "cultivationType": "Certificado"
      }
]
  },
  {
    id: "strain-girl-scout-cookies",
    name: "Girl Scout Cookies",
    category: "flores",
    type: "H\u00edbrida",
    dominantCannabinoid: "THC",
    thc: "18% - 24%",
    cbd: "< 1%",
    genetics: "Girl Scout Cookies",
    terpenes: ["Cariofileno", "Mirceno", "Limoneno"],
    aromaFlavor: "Flores de alta qualidade, com aroma marcante e excelente produ\u00e7\u00e3o de resina. Uma gen\u00e9tica muito apreciada pela qualidade consistente e pelo perfil arom\u00e1tico caracter\u00edstico.",
    description: "Flores de alta qualidade, com aroma marcante e excelente produ\u00e7\u00e3o de resina. Uma gen\u00e9tica muito apreciada pela qualidade consistente e pelo perfil arom\u00e1tico caracter\u00edstico.",
    effects: ["Equil\u00edbrio F\u00edsico e Mental", "Ansiol\u00edtico Suave", "Al\u00edvio de Estresse"],
    associations: [
      {
            "associationId": "alca",
            "associationName": "ALCA",
            "pricePerGram": 36.0,
            "priceDisplay": "R$ 36,00/g",
            "inStock": true,
            "cultivationType": "Certificado"
      }
]
  },
  {
    id: "strain-mako-haze",
    name: "Mako Haze",
    category: "flores",
    type: "H\u00edbrida",
    dominantCannabinoid: "THC",
    thc: "18% - 24%",
    cbd: "< 1%",
    genetics: "Mako Haze",
    terpenes: ["Cariofileno", "Mirceno", "Limoneno"],
    aromaFlavor: "Flores de alta qualidade, com aroma intenso e perfil cl\u00e1ssico. Uma gen\u00e9tica reconhecida pela excelente produ\u00e7\u00e3o de resina e qualidade consistente das flores.",
    description: "Flores de alta qualidade, com aroma intenso e perfil cl\u00e1ssico. Uma gen\u00e9tica reconhecida pela excelente produ\u00e7\u00e3o de resina e qualidade consistente das flores.",
    effects: ["Equil\u00edbrio F\u00edsico e Mental", "Ansiol\u00edtico Suave", "Al\u00edvio de Estresse"],
    associations: [
      {
            "associationId": "alca",
            "associationName": "ALCA",
            "pricePerGram": 35.0,
            "priceDisplay": "R$ 35,00/g",
            "inStock": true,
            "cultivationType": "Certificado"
      }
]
  },
  {
    id: "strain-northern-lights",
    name: "Northern Lights",
    category: "flores",
    type: "H\u00edbrida",
    dominantCannabinoid: "THC",
    thc: "18% - 24%",
    cbd: "< 1%",
    genetics: "Northern Lights",
    terpenes: ["Cariofileno", "Mirceno", "Limoneno"],
    aromaFlavor: "Flores de alta qualidade, com aroma marcante e excelente produ\u00e7\u00e3o de resina. Uma gen\u00e9tica cl\u00e1ssica, reconhecida pela sua qualidade consistente e perfil equilibrado.",
    description: "Flores de alta qualidade, com aroma marcante e excelente produ\u00e7\u00e3o de resina. Uma gen\u00e9tica cl\u00e1ssica, reconhecida pela sua qualidade consistente e perfil equilibrado.",
    effects: ["Equil\u00edbrio F\u00edsico e Mental", "Ansiol\u00edtico Suave", "Al\u00edvio de Estresse"],
    associations: [
      {
            "associationId": "alca",
            "associationName": "ALCA",
            "pricePerGram": 40.5,
            "priceDisplay": "R$ 40,50/g",
            "inStock": true,
            "cultivationType": "Certificado"
      }
]
  },
  {
    id: "strain-permanent-marker",
    name: "Permanent Marker",
    category: "flores",
    type: "H\u00edbrida",
    dominantCannabinoid: "THC",
    thc: "18% - 24%",
    cbd: "< 1%",
    genetics: "Permanent Marker",
    terpenes: ["Cariofileno", "Mirceno", "Limoneno"],
    aromaFlavor: "Flores de alta qualidade, com aroma intenso e perfil marcante. Uma gen\u00e9tica reconhecida pela excelente produ\u00e7\u00e3o de resina e qualidade consistente das flores.",
    description: "Flores de alta qualidade, com aroma intenso e perfil marcante. Uma gen\u00e9tica reconhecida pela excelente produ\u00e7\u00e3o de resina e qualidade consistente das flores.",
    effects: ["Equil\u00edbrio F\u00edsico e Mental", "Ansiol\u00edtico Suave", "Al\u00edvio de Estresse"],
    associations: [
      {
            "associationId": "alca",
            "associationName": "ALCA",
            "pricePerGram": 36.0,
            "priceDisplay": "R$ 36,00/g",
            "inStock": true,
            "cultivationType": "Certificado"
      }
]
  },
  {
    id: "strain-jack-herer",
    name: "Jack Herer",
    category: "flores",
    type: "H\u00edbrida",
    dominantCannabinoid: "THC",
    thc: "18% - 24%",
    cbd: "< 1%",
    genetics: "Jack Herer",
    terpenes: ["Cariofileno", "Mirceno", "Limoneno"],
    aromaFlavor: "Flores de alta qualidade, com aroma marcante e excelente produ\u00e7\u00e3o de resina. Uma gen\u00e9tica cl\u00e1ssica, reconhecida pela sua qualidade consistente e perfil equilibrado.",
    description: "Flores de alta qualidade, com aroma marcante e excelente produ\u00e7\u00e3o de resina. Uma gen\u00e9tica cl\u00e1ssica, reconhecida pela sua qualidade consistente e perfil equilibrado.",
    effects: ["Equil\u00edbrio F\u00edsico e Mental", "Ansiol\u00edtico Suave", "Al\u00edvio de Estresse"],
    associations: [
      {
            "associationId": "alca",
            "associationName": "ALCA",
            "pricePerGram": 45.0,
            "priceDisplay": "R$ 45,00/g",
            "inStock": true,
            "cultivationType": "Certificado"
      }
]
  },
  {
    id: "strain-afghan-kush",
    name: "Afghan Kush",
    category: "flores",
    type: "H\u00edbrida",
    dominantCannabinoid: "THC",
    thc: "18% - 24%",
    cbd: "< 1%",
    genetics: "Afghan Kush",
    terpenes: ["Cariofileno", "Mirceno", "Limoneno"],
    aromaFlavor: "Gen\u00e9tica cl\u00e1ssica de predomin\u00e2ncia \u00edndica, origin\u00e1ria da regi\u00e3o do Hindu Kush, conhecida por seu perfil terpeno terroso.",
    description: "Gen\u00e9tica cl\u00e1ssica de predomin\u00e2ncia \u00edndica, origin\u00e1ria da regi\u00e3o do Hindu Kush, conhecida por seu perfil terpeno terroso.",
    effects: ["Equil\u00edbrio F\u00edsico e Mental", "Ansiol\u00edtico Suave", "Al\u00edvio de Estresse"],
    associations: [
      {
            "associationId": "alca",
            "associationName": "ALCA",
            "pricePerGram": 40.0,
            "priceDisplay": "R$ 40,00/g",
            "inStock": true,
            "cultivationType": "Certificado"
      }
]
  },
  {
    id: "strain-soul-glow",
    name: "Soul Glow",
    category: "flores",
    type: "H\u00edbrida",
    dominantCannabinoid: "THC",
    thc: "18% - 24%",
    cbd: "< 1%",
    genetics: "Soul Glow",
    terpenes: ["Cariofileno", "Limoneno", "Linalol"],
    aromaFlavor: "Marker funk n\u00edtido com doce floral, creme/g\u00e1s e leve fruto vermelho. Equil\u00edbrio emocional, conforto corporal progressivo.",
    description: "Marker funk n\u00edtido com doce floral, creme/g\u00e1s e leve fruto vermelho. Equil\u00edbrio emocional, conforto corporal progressivo.",
    effects: ["Equil\u00edbrio F\u00edsico e Mental", "Ansiol\u00edtico Suave", "Al\u00edvio de Estresse"],
    associations: [
      {
            "associationId": "adaptacann",
            "associationName": "Adapta-Cann",
            "pricePerGram": 67.0,
            "priceDisplay": "R$ 67,00/g (Outdoor) | R$ 92,00/g (Indoor)",
            "inStock": true,
            "cultivationType": "Indoor / Org\u00e2nico"
      }
]
  },
  {
    id: "strain-blue-slushi",
    name: "Blue Slushi",
    category: "flores",
    type: "H\u00edbrida",
    dominantCannabinoid: "THC",
    thc: "18% - 24%",
    cbd: "< 1%",
    genetics: "Blue Slushi",
    terpenes: ["Mirceno", "Cariofileno", "Limoneno"],
    aromaFlavor: "Doce tipo 'berry-candy', creme/baunilha e fundo funky. Foco suave, inspira\u00e7\u00e3o e humor elevado.",
    description: "Doce tipo 'berry-candy', creme/baunilha e fundo funky. Foco suave, inspira\u00e7\u00e3o e humor elevado.",
    effects: ["Foco & Criatividade", "Eleva\u00e7\u00e3o de Humor"],
    associations: [
      {
            "associationId": "adaptacann",
            "associationName": "Adapta-Cann",
            "pricePerGram": 67.0,
            "priceDisplay": "R$ 67,00/g (Outdoor) | R$ 92,00/g (Indoor)",
            "inStock": true,
            "cultivationType": "Indoor / Org\u00e2nico"
      }
]
  },
  {
    id: "strain-zoap",
    name: "Zoap (Raw Genetics)",
    category: "flores",
    type: "H\u00edbrida",
    dominantCannabinoid: "THC",
    thc: "18% - 24%",
    cbd: "< 1%",
    genetics: "Rainbow Sherbet x Pink Guava",
    terpenes: ["Mirceno", "Limoneno", "Linalool"],
    aromaFlavor: "Doce/frutado com 'soapy' floral e toque gasoso. Descanso ativo, conforto corporal e clareza.",
    description: "Doce/frutado com 'soapy' floral e toque gasoso. Descanso ativo, conforto corporal e clareza.",
    effects: ["Foco & Criatividade"],
    associations: [
      {
            "associationId": "adaptacann",
            "associationName": "Adapta-Cann",
            "pricePerGram": 67.0,
            "priceDisplay": "R$ 67,00/g (Outdoor) | R$ 92,00/g (Indoor)",
            "inStock": true,
            "cultivationType": "Indoor / Org\u00e2nico"
      }
]
  },
  {
    id: "strain-alien-mints",
    name: "Alien Mints",
    category: "flores",
    type: "H\u00edbrida",
    dominantCannabinoid: "THC",
    thc: "18% - 24%",
    cbd: "< 1%",
    genetics: "Alien Cookies x Cap Junky",
    terpenes: ["Cariofileno", "Limoneno", "Mirceno"],
    aromaFlavor: "Menta cremosa com doce leve sobre terroso. Descanso muscular, equil\u00edbrio afetivo e recupera\u00e7\u00e3o f\u00edsica.",
    description: "Menta cremosa com doce leve sobre terroso. Descanso muscular, equil\u00edbrio afetivo e recupera\u00e7\u00e3o f\u00edsica.",
    effects: ["Al\u00edvio de Dores"],
    associations: [
      {
            "associationId": "adaptacann",
            "associationName": "Adapta-Cann",
            "pricePerGram": 67.0,
            "priceDisplay": "R$ 67,00/g (Outdoor) | R$ 92,00/g (Indoor)",
            "inStock": true,
            "cultivationType": "Indoor / Org\u00e2nico"
      }
]
  },
  {
    id: "strain-lilac-cookies",
    name: "Lilac Cookies",
    category: "flores",
    type: "H\u00edbrida",
    dominantCannabinoid: "THC",
    thc: "18% - 24%",
    cbd: "< 1%",
    genetics: "Lilac Diesel x Forum Cookies",
    terpenes: ["Cariofileno", "Limoneno", "Terpinoleno"],
    aromaFlavor: "Lim\u00e3o doce e floral rico, com toques 'sour cream' e g\u00e1s. Eleva\u00e7\u00e3o do humor e leveza cognitiva.",
    description: "Lim\u00e3o doce e floral rico, com toques 'sour cream' e g\u00e1s. Eleva\u00e7\u00e3o do humor e leveza cognitiva.",
    effects: ["Eleva\u00e7\u00e3o de Humor"],
    associations: [
      {
            "associationId": "adaptacann",
            "associationName": "Adapta-Cann",
            "pricePerGram": 67.0,
            "priceDisplay": "R$ 67,00/g (Outdoor) | R$ 92,00/g (Indoor)",
            "inStock": true,
            "cultivationType": "Indoor / Org\u00e2nico"
      }
]
  },
  {
    id: "strain-cherry-gar-see-ya",
    name: "Cherry Gar-See-Ya",
    category: "flores",
    type: "H\u00edbrida",
    dominantCannabinoid: "THC",
    thc: "18% - 24%",
    cbd: "< 1%",
    genetics: "Black Cherry Soda x Cherry Maduro",
    terpenes: ["Ocimeno", "Limoneno", "Cariofileno"],
    aromaFlavor: "Cereja marcante com c\u00edtrico e fundo gasoso/terroso. Humor positivo, descanso suave e leveza sensorial.",
    description: "Cereja marcante com c\u00edtrico e fundo gasoso/terroso. Humor positivo, descanso suave e leveza sensorial.",
    effects: ["Eleva\u00e7\u00e3o de Humor"],
    associations: [
      {
            "associationId": "adaptacann",
            "associationName": "Adapta-Cann",
            "pricePerGram": 67.0,
            "priceDisplay": "R$ 67,00/g (Outdoor) | R$ 92,00/g (Indoor)",
            "inStock": true,
            "cultivationType": "Indoor / Org\u00e2nico"
      }
]
  },
  {
    id: "strain-fanta-sea",
    name: "Fanta Sea",
    category: "flores",
    type: "H\u00edbrida",
    dominantCannabinoid: "THC",
    thc: "18% - 24%",
    cbd: "< 1%",
    genetics: "Wedding Cake x Triangle Kush",
    terpenes: ["Limoneno", "Terpinoleno", "Cariofileno"],
    aromaFlavor: "Doce-cremoso de bolo, laranja intensa e madeira/gasoso. Eleva\u00e7\u00e3o sensorial e inspira\u00e7\u00e3o criativa.",
    description: "Doce-cremoso de bolo, laranja intensa e madeira/gasoso. Eleva\u00e7\u00e3o sensorial e inspira\u00e7\u00e3o criativa.",
    effects: ["Foco & Criatividade"],
    associations: [
      {
            "associationId": "adaptacann",
            "associationName": "Adapta-Cann",
            "pricePerGram": 67.0,
            "priceDisplay": "R$ 67,00/g (Outdoor) | R$ 92,00/g (Indoor)",
            "inStock": true,
            "cultivationType": "Indoor / Org\u00e2nico"
      }
]
  },
  {
    id: "strain-grandpas-stash",
    name: "Grandpa's Stash",
    category: "flores",
    type: "Indica",
    dominantCannabinoid: "THC",
    thc: "18% - 24%",
    cbd: "< 1%",
    genetics: "1994 Super Skunk x 1992 OG Kush x 1970 Afghan Kush",
    terpenes: ["Limoneno", "Mirceno", "Pineno"],
    aromaFlavor: "Terroso com pinho e toques 'gas/chem'. Estabilidade emocional, relaxamento f\u00edsico e conforto noturno.",
    description: "Terroso com pinho e toques 'gas/chem'. Estabilidade emocional, relaxamento f\u00edsico e conforto noturno.",
    effects: ["Indu\u00e7\u00e3o ao Sono"],
    associations: [
      {
            "associationId": "adaptacann",
            "associationName": "Adapta-Cann",
            "pricePerGram": 67.0,
            "priceDisplay": "R$ 67,00/g (Outdoor) | R$ 92,00/g (Indoor)",
            "inStock": true,
            "cultivationType": "Indoor / Org\u00e2nico"
      }
]
  },
  {
    id: "strain-cream-and-cheese",
    name: "Cream and Cheese",
    category: "flores",
    type: "H\u00edbrida",
    dominantCannabinoid: "THC/CBD",
    thc: "1:1",
    cbd: "1:1",
    genetics: "Seedsman CBD x UK Cheese",
    terpenes: ["Cariofileno", "Humuleno", "Mirceno"],
    aromaFlavor: "Cremoso/cheese com doce suave. Equil\u00edbrio entre corpo e mente, redu\u00e7\u00e3o de tens\u00e3o e conforto f\u00edsico.",
    description: "Cremoso/cheese com doce suave. Equil\u00edbrio entre corpo e mente, redu\u00e7\u00e3o de tens\u00e3o e conforto f\u00edsico.",
    effects: ["Controle de Ansiedade"],
    associations: [
      {
            "associationId": "adaptacann",
            "associationName": "Adapta-Cann",
            "pricePerGram": 67.0,
            "priceDisplay": "R$ 67,00/g (Outdoor) | R$ 92,00/g (Indoor)",
            "inStock": true,
            "cultivationType": "Indoor / Org\u00e2nico"
      }
]
  },
  {
    id: "strain-lifter-cbd",
    name: "Lifter CBD",
    category: "flores",
    type: "Sativa",
    dominantCannabinoid: "CBD",
    thc: "< 1%",
    cbd: "12% - 16%",
    genetics: "Early Resin Berry x Suver Haze",
    terpenes: ["Mirceno", "Cariofileno", "Pineno"],
    aromaFlavor: "C\u00edtrico herbal e terroso fresco. Foco no presente, percep\u00e7\u00e3o otimista, leveza e conforto f\u00edsico.",
    description: "C\u00edtrico herbal e terroso fresco. Foco no presente, percep\u00e7\u00e3o otimista, leveza e conforto f\u00edsico.",
    effects: ["Foco & Criatividade"],
    associations: [
      {
            "associationId": "adaptacann",
            "associationName": "Adapta-Cann",
            "pricePerGram": 67.0,
            "priceDisplay": "R$ 67,00/g (Outdoor) | R$ 92,00/g (Indoor)",
            "inStock": true,
            "cultivationType": "Indoor / Org\u00e2nico"
      }
]
  },
  {
    id: "oil-full-spectrum-15mg",
    name: "\u00d3leo Full Spectrum 15mg/ml (450mg)",
    category: "oleos",
    type: "\u00d3leo",
    dominantCannabinoid: "THC",
    thc: "15mg/ml",
    cbd: "15mg/ml",
    genetics: "Full Spectrum Extract",
    terpenes: ["Cariofileno", "Mirceno", "Limoneno"],
    aromaFlavor: "Extrato vegetal completo de Cannabis Sativa em \u00d3leo MCT. Suporte de amplo espectro.",
    description: "Extrato vegetal completo de Cannabis Sativa em \u00d3leo MCT. Suporte de amplo espectro.",
    effects: ["Equil\u00edbrio F\u00edsico e Mental", "Ansiol\u00edtico Suave", "Al\u00edvio de Estresse"],
    associations: [
      {
            "associationId": "adaptacann",
            "associationName": "Adapta-Cann",
            "pricePerGram": 280.0,
            "priceDisplay": "R$ 280,00 (30ml)",
            "inStock": true,
            "cultivationType": "Certificado"
      }
]
  },
  {
    id: "oil-full-spectrum-30mg",
    name: "\u00d3leo Full Spectrum 30mg/ml (900mg)",
    category: "oleos",
    type: "\u00d3leo",
    dominantCannabinoid: "THC",
    thc: "30mg/ml",
    cbd: "30mg/ml",
    genetics: "Full Spectrum Extract",
    terpenes: ["Cariofileno", "Mirceno", "Limoneno"],
    aromaFlavor: "Extrato vegetal completo de Cannabis Sativa em \u00d3leo MCT.",
    description: "Extrato vegetal completo de Cannabis Sativa em \u00d3leo MCT.",
    effects: ["Equil\u00edbrio F\u00edsico e Mental", "Ansiol\u00edtico Suave", "Al\u00edvio de Estresse"],
    associations: [
      {
            "associationId": "adaptacann",
            "associationName": "Adapta-Cann",
            "pricePerGram": 450.0,
            "priceDisplay": "R$ 450,00 (30ml)",
            "inStock": true,
            "cultivationType": "Certificado"
      }
]
  },
  {
    id: "oil-full-spectrum-50mg",
    name: "\u00d3leo Full Spectrum 50mg/ml (1500mg)",
    category: "oleos",
    type: "\u00d3leo",
    dominantCannabinoid: "THC",
    thc: "50mg/ml",
    cbd: "50mg/ml",
    genetics: "Full Spectrum Extract",
    terpenes: ["Cariofileno", "Mirceno", "Limoneno"],
    aromaFlavor: "Extrato concentrado de Cannabis Sativa em \u00d3leo MCT. A\u00e7\u00e3o prolongada e potente.",
    description: "Extrato concentrado de Cannabis Sativa em \u00d3leo MCT. A\u00e7\u00e3o prolongada e potente.",
    effects: ["Equil\u00edbrio F\u00edsico e Mental", "Ansiol\u00edtico Suave", "Al\u00edvio de Estresse"],
    associations: [
      {
            "associationId": "adaptacann",
            "associationName": "Adapta-Cann",
            "pricePerGram": 750.0,
            "priceDisplay": "R$ 750,00 (30ml)",
            "inStock": true,
            "cultivationType": "Certificado"
      }
]
  },
  {
    id: "oil-full-spectrum-100mg",
    name: "\u00d3leo Full Spectrum 100mg/ml (3000mg)",
    category: "oleos",
    type: "\u00d3leo",
    dominantCannabinoid: "THC",
    thc: "100mg/ml",
    cbd: "100mg/ml",
    genetics: "Full Spectrum Extract",
    terpenes: ["Cariofileno", "Mirceno", "Limoneno"],
    aromaFlavor: "Extrato ultra-concentrado de Cannabis Sativa em \u00d3leo MCT.",
    description: "Extrato ultra-concentrado de Cannabis Sativa em \u00d3leo MCT.",
    effects: ["Equil\u00edbrio F\u00edsico e Mental", "Ansiol\u00edtico Suave", "Al\u00edvio de Estresse"],
    associations: [
      {
            "associationId": "adaptacann",
            "associationName": "Adapta-Cann",
            "pricePerGram": 1150.0,
            "priceDisplay": "R$ 1.150,00 (30ml)",
            "inStock": true,
            "cultivationType": "Certificado"
      }
]
  },
  {
    id: "gummy-full-spectrum-15mg",
    name: "Gummies Full Spectrum 15mg",
    category: "outros",
    type: "Gummies",
    dominantCannabinoid: "THC",
    thc: "15mg por gummie",
    cbd: "15mg por gummie",
    genetics: "Gummies Full Spectrum 15mg",
    terpenes: ["Cariofileno", "Mirceno", "Limoneno"],
    aromaFlavor: "Gomas medicinais de espectro completo (450mg total / 30 unidades). Uso pr\u00e1tico e saboroso.",
    description: "Gomas medicinais de espectro completo (450mg total / 30 unidades). Uso pr\u00e1tico e saboroso.",
    effects: ["Equil\u00edbrio F\u00edsico e Mental", "Ansiol\u00edtico Suave", "Al\u00edvio de Estresse"],
    associations: [
      {
            "associationId": "adaptacann",
            "associationName": "Adapta-Cann",
            "pricePerGram": 350.0,
            "priceDisplay": "R$ 350,00 (30 un)",
            "inStock": true,
            "cultivationType": "Certificado"
      }
]
  },
  {
    id: "strain-hash-thca-static-dry-sift",
    name: "Hash THCA (Static Dry Sift)",
    category: "outros",
    type: "Gummies",
    dominantCannabinoid: "THC",
    thc: "Alta Concentra\u00e7\u00e3o THCA",
    cbd: "< 1%",
    genetics: "Hash THCA (Static Dry Sift)",
    terpenes: ["Cariofileno", "Mirceno"],
    aromaFlavor: "Extra\u00e7\u00e3o pura e artesanal em p\u00f3 resinoso Static Dry Sift de alta pot\u00eancia.",
    description: "Extra\u00e7\u00e3o pura e artesanal em p\u00f3 resinoso Static Dry Sift de alta pot\u00eancia.",
    effects: ["Equil\u00edbrio F\u00edsico e Mental", "Ansiol\u00edtico Suave", "Al\u00edvio de Estresse"],
    associations: [
      {
            "associationId": "adaptacann",
            "associationName": "Adapta-Cann",
            "pricePerGram": 125.0,
            "priceDisplay": "R$ 125,00 (1g)",
            "inStock": true,
            "cultivationType": "Certificado"
      }
]
  },
  {
    id: "strain-pipoquinhas-thc",
    name: "Pipoquinhas THC",
    category: "flores",
    type: "H\u00edbrida",
    dominantCannabinoid: "THC",
    thc: "15% - 22%",
    cbd: "< 1%",
    genetics: "Blend de Pipocas THC de Alta Qualidade",
    terpenes: ["Cariofileno", "Limoneno", "Mirceno"],
    aromaFlavor: "Infloresc\u00eancias menores (pipoquinhas) ricas em THC. Variedades sortidas e selecionadas com \u00f3timo aroma e pot\u00eancia.",
    description: "Infloresc\u00eancias menores (pipoquinhas) ricas em THC. Variedades sortidas e selecionadas com \u00f3timo aroma e pot\u00eancia.",
    effects: ["Equil\u00edbrio F\u00edsico e Mental", "Ansiol\u00edtico Suave", "Al\u00edvio de Estresse"],
    associations: [
      {
            "associationId": "abrapango",
            "associationName": "Abrapango",
            "pricePerGram": 300.0,
            "priceDisplay": "R$ 300,00 (10g)",
            "inStock": true,
            "cultivationType": "Certificado"
      },
      {
            "associationId": "alca",
            "associationName": "ALCA",
            "pricePerGram": 25.0,
            "priceDisplay": "R$ 25,00/g",
            "inStock": true,
            "cultivationType": "Certificado"
      }
]
  },
  {
    id: "strain-pipoquinhas-cbd",
    name: "Pipoquinhas CBD",
    category: "flores",
    type: "Sativa",
    dominantCannabinoid: "CBD",
    thc: "< 1%",
    cbd: "10% - 15%",
    genetics: "Blend de Pipocas CBD de Alta Qualidade",
    terpenes: ["Mirceno", "Cariofileno", "Pineno"],
    aromaFlavor: "Infloresc\u00eancias menores (pipoquinhas) ricas em CBD. Sabor herbal e terroso suave com excelente rela\u00e7\u00e3o custo-benef\u00edcio.",
    description: "Infloresc\u00eancias menores (pipoquinhas) ricas em CBD. Sabor herbal e terroso suave com excelente rela\u00e7\u00e3o custo-benef\u00edcio.",
    effects: ["Al\u00edvio de Ansiedade", "Anti-inflamat\u00f3rio", "Clareza sem Psicoatividade"],
    associations: [
      {
            "associationId": "abrapango",
            "associationName": "Abrapango",
            "pricePerGram": 300.0,
            "priceDisplay": "R$ 300,00 (10g)",
            "inStock": true,
            "cultivationType": "Certificado"
      }
]
  }
];

export function useStrains() {
  const [strains] = useState<Strain[]>(INITIAL_STRAINS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCannabinoid, setSelectedCannabinoid] = useState<string>('todos');
  const [selectedEffect, setSelectedEffect] = useState<string>('todos');

  const filteredStrains = useMemo(() => {
    return strains.filter((strain) => {
      const matchesSearch = 
        strain.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        strain.aromaFlavor?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        strain.effects.some(e => e.toLowerCase().includes(searchQuery.toLowerCase())) ||
        strain.associations?.some(a => a.associationName.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCannabinoid = 
        selectedCannabinoid === 'todos' || 
        strain.dominantCannabinoid === selectedCannabinoid;

      const matchesEffect = 
        selectedEffect === 'todos' || 
        strain.effects.some(e => e.toLowerCase().includes(selectedEffect.toLowerCase()));

      return matchesSearch && matchesCannabinoid && matchesEffect;
    });
  }, [strains, searchQuery, selectedCannabinoid, selectedEffect]);

  return {
    strains: filteredStrains,
    allStrains: strains,
    searchQuery,
    setSearchQuery,
    selectedCannabinoid,
    setSelectedCannabinoid,
    selectedEffect,
    setSelectedEffect,
  };
}
