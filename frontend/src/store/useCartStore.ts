import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    image_url: string;
}

interface CartStore {
    items: CartItem[];
    addItem: (product: any, quantity?: number, openCart?: boolean) => void;
    removeItem: (id: number) => void;
    updateQuantity: (id: number, quantity: number) => void;
    clearCart: () => void;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    totalItems: () => number;
    totalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,
            setIsOpen: (isOpen) => set({ isOpen }),
            addItem: (product, quantity = 1, openCart = false) => {
                set((state) => {
                    const existing = state.items.find((i) => i.id === product.id);
                    if (existing) {
                        return {
                            items: state.items.map((i) =>
                                i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i
                            ),
                            ...(openCart && { isOpen: true })
                        };
                    }
                    return {
                        items: [
                            ...state.items,
                            {
                                id: product.id,
                                name: product.name,
                                price: typeof product.price === 'string'
                                    ? parseFloat(product.price.replace(/[^\d.]/g, '')) || 0
                                    : Number(product.price) || 0,
                                quantity,
                                image_url: product.image_urls?.[0] || product.img || product.image_url || 'https://placehold.co/400x400/31343C/FFFFFF?text=No+Image'
                            },
                        ],
                        ...(openCart ? { isOpen: true } : {})
                    };
                });
            },
            removeItem: (id) =>
                set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
            updateQuantity: (id, quantity) => {
                if (quantity <= 0) {
                    set((state) => ({ items: state.items.filter((i) => i.id !== id) }));
                } else {
                    set((state) => ({
                        items: state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
                    }));
                }
            },
            clearCart: () => set({ items: [] }),
            totalItems: () => get().items.reduce((acc, item) => acc + item.quantity, 0),
            totalPrice: () => get().items.reduce((acc, item) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const raw = item.price as any;
                const safePrice = typeof raw === 'string'
                    ? parseFloat(raw.replace(/[^\d.]/g, '')) || 0
                    : Number(raw) || 0;
                return acc + (safePrice * item.quantity);
            }, 0),
        }),
        {
            name: 'promsell-cart-storage',
        }
    )
);
