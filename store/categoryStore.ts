import { create } from "zustand";
import { ecommerceApi } from "@/lib/ecommerce-api";

export type Category = {
  id: string;
  name: string;
  productsCount: number;
};

type CategoryState = {
  categories: Category[];
  loading: boolean;

  fetchCategories: () => Promise<void>;
  addCategory: (name: string) => Promise<void>;
};

export const useCategoryStore = create<CategoryState>((set) => ({
  categories: [],
  loading: false,

  fetchCategories: async () => {
    set({ loading: true });

    try {
      const response = await ecommerceApi.getCategories();
      const data = response.data.map((category) => ({
        ...category,
        productsCount: 0,
      }));

      set({
        categories: data,
        loading: false,
      });
    } catch {
      set({ loading: false });
    }
  },

  addCategory: async (name: string) => {
    const response = await ecommerceApi.createCategory({ name });
    const newCategory = {
      ...response.data,
      productsCount: 0,
    };

    set((state) => ({
      categories: [...state.categories, newCategory],
    }));
  },
}));
