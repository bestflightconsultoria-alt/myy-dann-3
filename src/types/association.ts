export interface AssociationPriceItem {
  category: 'Flores in Natura' | 'Óleos' | 'Gummies' | 'Outros' | string;
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
