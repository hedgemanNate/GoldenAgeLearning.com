export interface TaxonomyTag {
  id: string;
  value: string;
}

export interface ClassTemplate {
  name: string;
  description: string;
  price: number;
  seatLimit: number;
  duration: number;
  defaultCategory: string;
  defaultLocation: string;
  createdAt: number;
  createdBy: string;
}

export interface ClassTemplateWithId extends ClassTemplate {
  id: string;
}
