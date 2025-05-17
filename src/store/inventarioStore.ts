import { Product } from "@/types/product";
import { create } from "zustand";

interface InventarioState {
    products: Product[];
}

interface InventarioActions {
    updateInventario: (productId: string, cantidad: number) => void;
    checkInventario: (productId: string) => void;
    //inStock: (productId: string) => boolean;
}

export const useInventarioStore = create<InventarioState & InventarioActions>((set) => ({
    products: [],
    updateInventario: (productId: string, cantidad: number) => set((state) => ({
        products: state.products.map((product) => product.id === productId ? { ...product, cantidad } : product)
    })),
    checkInventario: (productId: string) => set((state) => ({
        products: state.products.filter((product) => product.id !== productId)
    }))
}))