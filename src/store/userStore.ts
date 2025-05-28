import { create } from "zustand";
import {UserInfo} from "@/types/user_info";

interface UserActions {
    user: UserInfo | null;
    setUser: (user: UserInfo) => void;
    clearUser: () => void;
    updateUser: (user: UserInfo) => void;
}

const useUserStore = create<UserActions>((set) => ({
    user: null,
    setUser: (user: UserInfo) => set({ user }),
    clearUser: () => set({ user: null }),
    updateUser: (user: UserInfo) => set({ user }),
}));

export default useUserStore;
