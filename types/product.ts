export interface IProductVariant {
  id: string;
  name: string; // "Thickness 1mm"
  additionalPrice?: number; // +500 ETB
  stock: number;
}

export interface IProduct {
  id: string;
  name: string;
  category: {
    id: string;
    name: string;
  };
  price: number; // base price
  quantity: number;
  description: string;
  features: string[]; // bullet features
  variants?: IProductVariant[];
  images: string[];
}
