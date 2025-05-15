import { create } from "zustand";
import { Product } from "../types/product";

interface CartState {
  products: Product[];
  total: number;
}

interface CartActions {
  addProduct: (product: Product) => void;
  removeProduct: (productId: string) => void;
  clearCart: () => void;
  updateTotal: () => void;
}

export const useCartStore = create<CartState & CartActions>((set, get) => ({
  products: [],
  total: 0,

  addProduct: (product: Product) => {
    set((state) => ({
      products: [...state.products, product]
    }));
    get().updateTotal();
  },

  removeProduct: (productId: string) => {
    set((state) => ({
      products: state.products.filter((product) => product.id !== productId)
    }));
    get().updateTotal();
  },

  clearCart: () => {
    set({ products: [], total: 0 });
  },

  updateTotal: () => {
    set((state) => ({
      total: state.products.reduce((sum, product) => sum + product.precio, 0)
    }));
  }
}));


