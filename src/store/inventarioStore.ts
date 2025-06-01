import { Product } from "@/types/product";
import { create } from "zustand";

interface InventarioState {
    inventario: Product[];
}

interface InventarioActions {
    updateInventario: (productId: string, quantity: number) => void;
    getInventarioItem: (productId: string) => Product | null;
    getInventario: () => Product[];
    setInventario: (inventario: Product[]) => void;
    //inStock: (productId: string) => boolean;
}

export const useInventarioStore = create<InventarioState & InventarioActions>((set) => ({
    inventario: [],
    updateInventario: (productId: string, quantity: number) => set((state) => ({
        inventario: state.inventario.map((product) => product.id === productId ? { ...product, quantity } : product)
    })),
    getInventarioItem: (productId: string): Product | null => {
        const state = useInventarioStore.getState() as InventarioState;
        const product = state.inventario.find((product: Product) => product.id === productId);
        return product || null;
    },
    getInventario: () => {
        const state = useInventarioStore.getState() as InventarioState;
        return state.inventario;
    },
    setInventario: (inventario: Product[]) => set({ inventario })
}))