export interface Collection {
  id: string;
  name: string;
  description: string;
  slug: string;
  imageUrl?: string;
  products: string[]; // Array of product IDs
  isActive: boolean;
  position: number;
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface CollectionFormData extends Omit<Collection, 'id' | 'createdAt' | 'updatedAt'> {
  id?: string;
}
