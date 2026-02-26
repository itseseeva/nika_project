const API_BASE = '/api';

const getToken = () => {
    const storage = localStorage.getItem('auth-storage');
    if (storage) {
        try {
            const parsed = JSON.parse(storage);
            return parsed.state?.token;
        } catch (e) { }
    }
    return null;
};

const getHeaders = () => {
    const token = getToken();
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
    deleteCategory: async (categoryId: number) => {
        const res = await fetch(`${API_BASE}/categories/${categoryId}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        if (!res.ok) throw new Error('Failed to delete category');
        return res.json();
    },
    toggleCategoryHide: async (categoryId: number) => {
        const res = await fetch(`${API_BASE}/categories/${categoryId}/toggle_hide`, {
            method: 'POST',
            headers: getHeaders()
        });
        if (!res.ok) throw new Error('Failed to toggle category hide');
        return res.json();
    },
    createCategory: async (category: { name: string, slug: string }) => {
        const res = await fetch(`${API_BASE}/categories`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(category)
        });
        if (!res.ok) throw new Error('Failed to create category');
        return res.json();
    },
    createProduct: async (product: any) => {
        const res = await fetch(`${API_BASE}/products`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(product)
        });
        if (!res.ok) throw new Error('Failed to create product');
        return res.json();
    },
    uploadCategoryImage: async (categoryId: number, file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        const token = getToken();
        const headers: Record<string, string> = {};
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        const res = await fetch(`${API_BASE}/categories/${categoryId}/image`, {
            method: 'POST',
            headers,
            body: formData
        });
        if (!res.ok) throw new Error('Failed to upload category image');
        return res.json();
    },
};
