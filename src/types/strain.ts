export type ProductCategory = 'flores' | 'oleos' | 'outros';

export interface StrainAssociationOffer {
  associationId: string;
  associationName: string;
  cultivationType?: 'Indoor' | 'Outdoor' | 'Greenhouse';
  priceDisplay?: string;
  inStock?: boolean;
}

export interface Strain {
  id: string;
  name: string;
  category: ProductCategory;
  type: 'Sativa' | 'Indica' | 'Híbrida' | 'CBD' | 'THC' | '1:1' | 'Óleo' | 'Gummies';
  thc?: string;
  cbd?: string;
  concentration?: string;
  dominantCannabinoid?: 'THC' | 'CBD' | 'THC/CBD';
  effects: string[];
  terpenes: string[];
  usageProfiles: string[];
  description: string;
  association?: string;
  association_id?: string;
  aromaFlavor?: string;
  associations: StrainAssociationOffer[];
}
