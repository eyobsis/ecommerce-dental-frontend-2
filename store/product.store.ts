import { create } from "zustand";
import { ecommerceApi } from "@/lib/ecommerce-api";

interface Category {
  id: string;
  name: string;
}

interface Variant {
  id: string;
  name: string;
  additionalPrice: number;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  categoryId?: string;
  categoryName: string;
  features: string[];
  quantity: number;
  images: string[];
  variants: Variant[];
}

interface StoreState {
  categories: Category[];
  products: Product[];
  loading: boolean;
  lastError: string | null;

  fetchProducts: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  addCategory: (name: string) => Promise<void>;
  addProduct: (product: Omit<Product, "id"> & { imageFiles?: File[] }) => Promise<void>;
  updateProduct: (
    id: string,
    product: Omit<Product, "id"> & { imageFiles?: File[] },
  ) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}

export const useProductsStore = create<StoreState>((set, get) => ({
  categories: [],
  products: [],
  loading: false,
  lastError: null,

  fetchProducts: async () => {
    set({ loading: true, lastError: null });
    try {
      const [productsResponse, categoriesResponse] = await Promise.all([
        ecommerceApi.getProducts(),
        ecommerceApi.getCategories(),
      ]);

      const categoryMap = new Map(
        categoriesResponse.data.map((category) => [category.id, category.name]),
      );

      set({
        products: productsResponse.data.map((product) => {
          const variants = (product.variants || []).map((variant) => ({
            id: variant.id,
            name: variant.name,
            additionalPrice: Number(variant.additionalPrice || 0),
            stock: Number(variant.stock || 0),
          }));

          const features = (product.features || [])
            .map((feature) => {
              if (typeof feature === "string") return feature;
              if (feature && typeof feature === "object" && "feature" in feature) {
                return String(feature.feature || "");
              }
              return "";
            })
            .filter((feature) => feature.trim().length > 0);

          const quantity = variants.reduce(
            (total, variant) => total + (variant.stock || 0),
            0,
          );

          return {
            id: product.id,
            name: product.name,
            price: Number(product.price),
            description: product.description || "",
            categoryId: product.categoryId || undefined,
            categoryName: product.categoryId
              ? (categoryMap.get(product.categoryId) ?? "Uncategorized")
              : "Uncategorized",
            features,
            quantity,
            images: (product.images || []).map((image) => image.url),
            variants,
          };
        }),
        loading: false,
      });
    } catch (error) {
      set({
        loading: false,
        lastError:
          error instanceof Error ? error.message : "Failed to fetch products",
      });
    }
  },

  fetchCategories: async () => {
    try {
      const response = await ecommerceApi.getCategories();
      set({ categories: response.data, lastError: null });
    } catch (error) {
      set({
        lastError:
          error instanceof Error ? error.message : "Failed to fetch categories",
      });
    }
  },

  addCategory: async (name) => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      throw new Error("Category name is required");
    }

    const response = await ecommerceApi.createCategory({ name: trimmedName });
    set((state) => ({
      categories: [...state.categories, response.data],
      lastError: null,
    }));
  },

  addProduct: async (product) => {
    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("price", String(product.price));

    if (product.description?.trim()) {
      formData.append("description", product.description.trim());
    }

    if (product.categoryId?.trim()) {
      formData.append("categoryId", product.categoryId.trim());
    }

    const features = (product.features || [])
      .map((feature) => feature.trim())
      .filter((feature) => feature.length > 0);
    formData.append("features", JSON.stringify(features));

    const variants = (product.variants || []).map((variant) => ({
      name: variant.name,
      additionalPrice: String(variant.additionalPrice || 0),
      stock: variant.stock,
    }));
    formData.append("variants", JSON.stringify(variants));

    for (const file of product.imageFiles || []) {
      formData.append("images", file);
    }

    await ecommerceApi.createProduct(formData);

    await get().fetchProducts();
  },

  updateProduct: async (id, updatedProduct) => {
    const formData = new FormData();
    formData.append("name", updatedProduct.name);
    formData.append("price", String(updatedProduct.price));

    if (updatedProduct.description?.trim()) {
      formData.append("description", updatedProduct.description.trim());
    }

    if (updatedProduct.categoryId?.trim()) {
      formData.append("categoryId", updatedProduct.categoryId.trim());
    }

    const features = (updatedProduct.features || [])
      .map((feature) => feature.trim())
      .filter((feature) => feature.length > 0);
    formData.append("features", JSON.stringify(features));

    const variants = (updatedProduct.variants || []).map((variant) => ({
      name: variant.name,
      additionalPrice: String(variant.additionalPrice || 0),
      stock: variant.stock,
    }));
    formData.append("variants", JSON.stringify(variants));

    const retainedImageUrls = (updatedProduct.images || [])
      .map((image) => image.trim())
      .filter((image) => image.length > 0);
    formData.append("images", JSON.stringify(retainedImageUrls));

    for (const file of updatedProduct.imageFiles || []) {
      formData.append("images", file);
    }

    await ecommerceApi.updateProduct(id, formData);

    await get().fetchProducts();
  },

  deleteProduct: async (id) => {
    await ecommerceApi.deleteProduct(id);
    await get().fetchProducts();
  },
}));
