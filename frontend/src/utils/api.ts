const API_BASE = '/api';

const getHeaders = () => {
    const storage = localStorage.getItem('auth-storage');
    let token = null;
    if (storage) {
        try {
            const parsed = JSON.parse(storage);
            token = parsed.state?.token;
        } catch (e) { }
    }
    const headers: Record<string, string> = {
        'Content-Type': 'application/json'
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
};

export const api = {
    getCategories: async () => {
        const res = await fetch(`${API_BASE}/categories`);
        if (!res.ok) throw new Error('Failed to fetch categories');
        return res.json();
    },
    getProducts: async (categoryId?: number) => {
        const url = categoryId ? `${API_BASE}/products?category_id=${categoryId}` : `${API_BASE}/products`;
        const res = await fetch(url, { headers: getHeaders() });
        if (!res.ok) throw new Error('Failed to fetch products');
        return res.json();
    },
    getProduct: async (slug: string) => {
        const res = await fetch(`${API_BASE}/products/${slug}`, { headers: getHeaders() });
        if (!res.ok) throw new Error('Failed to fetch product');
        return res.json();
    },
    toggleProductHide: async (productId: number) => {
        const res = await fetch(`${API_BASE}/products/${productId}/toggle_hide`, {
            method: 'POST',
            headers: getHeaders()
        });
        if (!res.ok) throw new Error('Failed to toggle hide');
        return res.json();
    },
    submitLead: async (leadData: { name: string; phone: string; cart: any }) => {
        const res = await fetch(`${API_BASE}/leads`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(leadData),
        });
        if (!res.ok) throw new Error('Failed to submit lead');
        return res.json();
    },
    // --- Auth methods ---
    sendCode: async (email: string) => {
        const res = await fetch(`${API_BASE}/auth/send-code`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error((err as any).detail || 'Ошибка отправки кода');
        }
        return res.json();
    },
    setPassword: async (email: string, code: string, password: string) => {
        const res = await fetch(`${API_BASE}/auth/set-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, code, password }),
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error((err as any).detail || 'Ошибка подтверждения');
        }
        return res.json();
    },
    loginWithPassword: async (email: string, password: string) => {
        const res = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error((err as any).detail || 'Неверный email или пароль');
        }
        return res.json();
    },
};
