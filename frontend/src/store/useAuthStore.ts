import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
    id: number;
    email: string;
    is_active: boolean;
    is_admin: boolean;
    google_id: string | null;
    created_at: string;
}

interface AuthState {
    token: string | null;
    user: User | null;
    isAuthModalOpen: boolean;
    isAuthPageOpen: boolean;
    setToken: (token: string | null) => void;
    setUser: (user: User | null) => void;
    setAuthModalOpen: (isOpen: boolean) => void;
    setAuthPageOpen: (isOpen: boolean) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            user: null,
            isAuthModalOpen: false,
            isAuthPageOpen: false,
            setToken: (token) => set({ token }),
            setUser: (user) => set({ user }),
            setAuthModalOpen: (isOpen) => set({ isAuthModalOpen: isOpen }),
            setAuthPageOpen: (isOpen) => set({ isAuthPageOpen: isOpen }),
            logout: () => set({ token: null, user: null }),
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({ token: state.token }), // Only persist token
        }
    )
);
