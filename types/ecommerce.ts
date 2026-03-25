export type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data: T;
};

export type Category = {
  id: string;
  name: string;
};

export type BrandOption = {
  id: string;
  name: string;
};

export type ProductFilterOptions = {
  categories: Category[];
  brands: BrandOption[];
  productTypes: string[];
  featureKeys: string[];
  featureValuesByKey: Record<string, string[]>;
  variantColors: string[];
  variantSizes: string[];
  variantSkus: string[];
};

export type Product = {
  id: string;
  name: string;
  price: string | number;
  createdAt?: string | null;
  description?: string | null;
  categoryId?: string | null;
  categoryName?: string | null;
  brandId?: string | null;
  brandName?: string | null;
  productType?: string | null;
  images?: Array<{
    id: number;
    productId: string | null;
    url: string;
  }>;
  features?: Array<
    string | { id?: number; productId?: string | null; feature: string; featureKey?: string | null; featureValue?: string | null }
  >;
  variants?: ProductVariant[];
};

export type ProductVariant = {
  id: string;
  productId: string;
  name: string;
  additionalPrice?: string | number | null;
  stock?: number | null;
};

export type OrderItem = {
  id: number;
  orderId: string;
  productId: string | null;
  variantId: string | null;
  name: string;
  basePrice: string | number;
  image: string;
  quantity: number;
};

export type Order = {
  id: string;
  userId: string;
  status: string;
  totalAmount: string | number;
  paymentImage: string;
  createdAt: string;
  items?: OrderItem[];
  customerPhone?: string | null;
  customerEmail?: string | null;
  deliveryAddress?: string | null;
  paymentScreenshotUrl?: string | null;
};
