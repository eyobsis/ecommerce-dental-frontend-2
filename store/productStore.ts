import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface IProductVariant {
  id: string;
  name: string;
  additionalPrice?: number;
  stock: number;
}

export interface IProduct {
  id: string;
  name: string;
  category: {
    id: string;
    name: string;
  };
  price: number;
  quantity: number;
  description: string;
  features: string[];
  variants?: IProductVariant[];
  images: string[];
}

export interface ICartItem {
  productId: string;
  name: string;
  basePrice: number;
  image: string;
  variant?: IProductVariant;
  quantity: number;
}

interface CartStore {
  cart: ICartItem[];
  cartCount: number;

  addToCart: (product: IProduct, variant?: IProductVariant) => void;
  removeFromCart: (productId: string, variantId?: string) => void;
  increaseQuantity: (productId: string, variantId?: string) => void;
  decreaseQuantity: (productId: string, variantId?: string) => void;
  clearCart: () => void;

  getTotalPrice: () => number;
}

/* ---------------- STORE ---------------- */

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: [],
      cartCount: 0,

      addToCart: (product, variant) => {
        const existing = get().cart.find(
          (item) =>
            item.productId === product.id && item.variant?.id === variant?.id,
        );

        let updatedCart;

        if (existing) {
          updatedCart = get().cart.map((item) =>
            item.productId === product.id && item.variant?.id === variant?.id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          );
        } else {
          const newItem: ICartItem = {
            productId: product.id,
            name: product.name,
            basePrice: product.price,
            image: product.images[0],
            variant,
            quantity: 1,
          };

          updatedCart = [...get().cart, newItem];
        }

        set({
          cart: updatedCart,
          cartCount: updatedCart.reduce(
            (total, item) => total + item.quantity,
            0,
          ),
        });
      },

      removeFromCart: (productId, variantId) => {
        const updatedCart = get().cart.filter(
          (item) =>
            !(item.productId === productId && item.variant?.id === variantId),
        );

        set({
          cart: updatedCart,
          cartCount: updatedCart.reduce(
            (total, item) => total + item.quantity,
            0,
          ),
        });
      },

      increaseQuantity: (productId, variantId) => {
        const updatedCart = get().cart.map((item) =>
          item.productId === productId && item.variant?.id === variantId
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );

        set({
          cart: updatedCart,
          cartCount: updatedCart.reduce(
            (total, item) => total + item.quantity,
            0,
          ),
        });
      },

      decreaseQuantity: (productId, variantId) => {
        const updatedCart = get()
          .cart.map((item) =>
            item.productId === productId && item.variant?.id === variantId
              ? { ...item, quantity: item.quantity - 1 }
              : item,
          )
          .filter((item) => item.quantity > 0);

        set({
          cart: updatedCart,
          cartCount: updatedCart.reduce(
            (total, item) => total + item.quantity,
            0,
          ),
        });
      },

      clearCart: () =>
        set({
          cart: [],
          cartCount: 0,
        }),

      getTotalPrice: () => {
        return get().cart.reduce((total, item) => {
          const variantPrice = item.variant?.additionalPrice || 0;
          return total + (item.basePrice + variantPrice) * item.quantity;
        }, 0);
      },
    }),
    {
      name: "cart-storage", // localStorage key
    },
  ),
);
