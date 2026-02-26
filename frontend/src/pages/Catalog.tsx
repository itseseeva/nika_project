import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Filter } from 'lucide-react';
import { api } from '../utils/api';
import { AddToCartButton } from '../components/AddToCartButton';
import { useAuthStore } from '../store/useAuthStore';

export function Catalog() {
    const [params, setParams] = useSearchParams();
    const categoryId = params.get('category');

    const [categories, setCategories] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuthStore();

    const handleToggleHide = async (e: React.MouseEvent, productId: number) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            const result = await api.toggleProductHide(productId);
            setProducts(products.map(p => p.id === productId ? { ...p, is_hidden: result.is_hidden } : p));
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        api.getCategories().then(setCategories).catch(console.error);
    }, []);

    useEffect(() => {
        setLoading(true);
        api.getProducts(categoryId ? Number(categoryId) : undefined)
            .then(data => {
                setProducts(data);
                setLoading(false);
            })
            .catch(console.error);
    }, [categoryId]);

    const setCategoryFilter = (id: number | null) => {
        if (id) {
            setParams({ category: id.toString() });
        } else {
            setParams({});
        }
    };

    return (
        <div className="bg-transparent min-h-screen pt-24 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 sm:mb-8">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Каталог товаров</h1>
                        <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-500">
                            Показано {products.length} {products.length === 1 ? 'товар' : products.length > 1 && products.length < 5 ? 'товара' : 'товаров'}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar / Filters */}
                    <aside className="w-full lg:w-64 flex-shrink-0">
                        <div className="bg-white lg:rounded-2xl shadow-sm border-b lg:border border-gray-100 p-4 sm:p-6 lg:sticky lg:top-28 -mx-4 sm:-mx-6 lg:mx-0">
                            <div className="flex items-center gap-2 mb-4 lg:mb-6 text-gray-900 font-semibold px-4 lg:px-0">
                                <Filter className="w-5 h-5" />
                                Категории
                            </div>
                            <ul className="flex lg:flex-col gap-2 lg:gap-3 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 px-4 lg:px-0 scrollbar-none">
                                <li className="flex-shrink-0">
                                    <button
                                        onClick={() => setCategoryFilter(null)}
                                        className={`px-4 py-2 lg:p-0 lg:text-left w-full transition-colors rounded-full lg:rounded-none border lg:border-none ${!categoryId ? 'bg-blue-600 text-white lg:bg-transparent lg:text-blue-600 font-semibold border-blue-600' : 'text-gray-600 hover:text-gray-900 border-gray-200'}`}
                                    >
                                        Все
                                    </button>
                                </li>
                                {categories.map((cat) => (
                                    <li key={cat.id} className="flex-shrink-0">
                                        <button
                                            onClick={() => setCategoryFilter(cat.id)}
                                            className={`px-4 py-2 lg:p-0 lg:text-left w-full transition-colors rounded-full lg:rounded-none border lg:border-none whitespace-nowrap ${categoryId === String(cat.id) ? 'bg-blue-600 text-white lg:bg-transparent lg:text-blue-600 font-semibold border-blue-600' : 'text-gray-600 hover:text-gray-900 border-gray-200'}`}
                                        >
                                            {cat.name}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </aside>

                    {/* Product Grid */}
                    <div className="flex-1">
                        {loading ? (
                            <div className="flex justify-center py-20">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            </div>
                        ) : products.length === 0 ? (
                            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-500">
                                В этой категории пока нет товаров.
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-3 sm:gap-x-5 gap-y-6 sm:gap-y-8">
                                {products.map((product, i) => (
                                    <motion.div
                                        key={product.id}
                                        initial={{ opacity: 0, y: 16 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.04 }}
                                        className="group flex flex-col"
                                    >
                                        {/* Фото */}
                                        <div className="relative overflow-hidden rounded-2xl bg-gray-100 aspect-[4/5] mb-3">
                                            <Link to={`/product/${product.slug}`} className="block w-full h-full group/img">
                                                <img
                                                    src={product.image_urls?.[0] || `https://placehold.co/400x500/e2e8f0/64748b?text=${encodeURIComponent(product.name)}`}
                                                    alt={product.name}
                                                    className={`w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-[1.06] ${product.image_urls?.length > 1 ? 'animate-crossfade' : ''}`}
                                                />
                                                {product.image_urls?.length > 1 && (
                                                    <img
                                                        src={product.image_urls[1]}
                                                        alt={`${product.name} - 2`}
                                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-[1.06] animate-crossfade-reverse"
                                                    />
                                                )}
                                            </Link>
                                            {/* Кнопка корзины только поверх фото */}
                                            <div className="absolute bottom-3 right-3 z-10 flex flex-col gap-2 items-end">
                                                {user?.is_admin && (
                                                    <button
                                                        onClick={(e) => handleToggleHide(e, product.id)}
                                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold text-white shadow-md transition-colors ${product.is_hidden ? 'bg-gray-500 hover:bg-gray-600' : 'bg-red-500 hover:bg-red-600'}`}
                                                    >
                                                        {product.is_hidden ? 'Показать!' : 'Скрыть!'}
                                                    </button>
                                                )}
                                                <AddToCartButton product={product} compact={true} />
                                            </div>
                                        </div>

                                        {/* Название и цена ПОД фото */}
                                        <div className="px-1">
                                            <Link
                                                to={`/product/${product.slug}`}
                                                className="block text-[14px] font-medium text-gray-800 hover:text-blue-600 transition-colors line-clamp-2 leading-snug mb-1.5"
                                            >
                                                {product.name}
                                            </Link>
                                            <div className="flex items-center justify-between">
                                                <span className="text-[17px] font-bold text-gray-900">
                                                    {product.price.toLocaleString('ru-RU')} ₽
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div >
    );
}
