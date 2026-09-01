export type ProductCategory = 'flores' | 'oleos' | 'outros';

export type CultivationType = 
  | 'Indoor' 
  | 'Outdoor' 
  | 'Greenhouse' 
  | 'Padronizado' 
  | 'Indoor / Orgânico' 
  | 'Greenhouse / Orgânico'
  | string;

export type StrainType = 
  | 'Sativa' 
  | 'Indica' 
  | 'Híbrida' 
  | 'CBD' 
  | 'THC' 
  | '1:1' 
  | 'Óleo' 
  | 'Gummies' 
  | 'Pomadas' 
  | 'Concentrados' 
  | 'Tópico'
  | string;

export interface StrainAssociationOffer {
  associationId: string;
  associationName: string;
  cultivationType?: CultivationType;
  priceDisplay?: string;
  pricePerGram?: number | string;
  priceDetail?: string;
  unitPrice?: string;
  inStock?: boolean;
}

export interface Strain {
  id: string;
  name: string;
  category: ProductCategory;
  type: StrainType;
  thc?: string;
  cbd?: string;
  cbg?: string;
  cbn?: string;
  concentration?: string;
  dominantCannabinoid?: 'THC' | 'CBD' | 'THC/CBD' | string;
  effects?: string[];
  terpenes?: string[];
  usageProfiles?: string[];
  description?: string;
  association?: string;
  association_id?: string;
  genetics?: string;
  aromaFlavor?: string;
  associations?: StrainAssociationOffer[];
}
