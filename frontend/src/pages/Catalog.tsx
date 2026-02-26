import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Trash2, Eye, EyeOff, Plus, X, ArrowRight } from 'lucide-react';
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
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newProductName, setNewProductName] = useState('');
    const [newProductPrice, setNewProductPrice] = useState('');
    const [newProductDesc, setNewProductDesc] = useState('');

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

    const handleToggleCategoryHide = async (e: React.MouseEvent, catId: number) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            const result = await api.toggleCategoryHide(catId);
            setCategories(categories.map(c => c.id === catId ? { ...c, is_hidden: result.is_hidden } : c));
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteCategory = async (e: React.MouseEvent, categoryId: number) => {
        // ...
        e.preventDefault();
        e.stopPropagation();
        if (!window.confirm('Вы уверены, что хотите удалить эту категорию?')) return;
        try {
            await api.deleteCategory(categoryId);
            setCategories(categories.filter(c => c.id !== categoryId));
            if (params.get('category') === String(categoryId)) {
                setParams({});
            }
        } catch (error) {
            console.error(error);
            alert('Ошибка при удалении категории');
        }
    };

    const handleCreateCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        const slug = newCategoryName.toLowerCase().replace(/[^a-zа-я0-9]+/g, '-').replace(/(^-|-$)/g, '');
        try {
            const newCat = await api.createCategory({ name: newCategoryName, slug });
            setCategories([...categories, newCat]);
            setNewCategoryName('');
            setIsCategoryModalOpen(false);
        } catch (error) {
            console.error(error);
            alert('Ошибка при создании категории');
        }
    };

    const handleCreateProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        const slug = newProductName.toLowerCase().replace(/[^a-zа-я0-9]+/g, '-').replace(/(^-|-$)/g, '');
        try {
            const newProd = await api.createProduct({
                name: newProductName,
                slug,
                description: newProductDesc,
                price: parseFloat(newProductPrice),
                category_id: categoryId ? parseInt(categoryId) : null,
                image_urls: []
            });
            setProducts([newProd, ...products]);
            setNewProductName('');
            setNewProductPrice('');
            setNewProductDesc('');
            setIsProductModalOpen(false);
        } catch (error) {
            console.error(error);
            alert('Ошибка при создании товара');
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
                                {user?.is_admin && (
                                    <button
                                        onClick={() => setIsCategoryModalOpen(true)}
                                        className="ml-auto p-1 hover:bg-gray-100 rounded-lg text-blue-600 transition-colors"
                                        title="Создать категорию"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                )}
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
                                    <li key={cat.id} className="flex-shrink-0 group/cat">
                                        <div className="flex items-center justify-between gap-2">
                                            <button
                                                onClick={() => setCategoryFilter(cat.id)}
                                                className={`flex-1 px-4 py-2 lg:p-0 lg:text-left transition-colors rounded-full lg:rounded-none border lg:border-none whitespace-nowrap ${categoryId === String(cat.id) ? 'bg-blue-600 text-white lg:bg-transparent lg:text-blue-600 font-semibold border-blue-600' : 'text-gray-600 hover:text-gray-900 border-gray-200'}`}
                                            >
                                                {cat.name}
                                            </button>
                                            {user?.is_admin && (
                                                <div className="flex items-center gap-1 opacity-0 group-hover/cat:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={(e) => handleToggleCategoryHide(e, cat.id)}
                                                        className={`p-1.5 rounded-lg transition-colors ${cat.is_hidden ? 'text-gray-400 hover:text-gray-600 hover:bg-gray-100' : 'text-blue-400 hover:text-blue-600 hover:bg-blue-50'}`}
                                                        title={cat.is_hidden ? "Показать категорию" : "Скрыть категорию"}
                                                    >
                                                        {cat.is_hidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                    </button>
                                                    <button
                                                        onClick={(e) => handleDeleteCategory(e, cat.id)}
                                                        className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                                                        title="Удалить категорию"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
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
                        ) : products.length === 0 && !user?.is_admin ? (
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
                                                    src={product.image_urls?.[0] ? encodeURI(product.image_urls[0]) : `https://placehold.co/400x500/e2e8f0/64748b?text=${encodeURIComponent(product.name)}`}
                                                    alt={product.name}
                                                    className={`w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-[1.06] ${product.image_urls?.length > 1 ? 'animate-crossfade' : ''}`}
                                                />
                                                {product.image_urls?.length > 1 && (
                                                    <img
                                                        src={encodeURI(product.image_urls[1])}
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
                                {user?.is_admin && (
                                    <motion.button
                                        onClick={() => setIsProductModalOpen(true)}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center p-6 text-gray-400 hover:border-blue-400 hover:text-blue-500 transition-all aspect-[4/5]"
                                    >
                                        <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-3">
                                            <Plus className="w-6 h-6" />
                                        </div>
                                        <span className="font-semibold text-sm">Добавить товар</span>
                                        {categoryId && (
                                            <span className="text-[10px] mt-1 opacity-60">в текущую категорию</span>
                                        )}
                                    </motion.button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modals */}
            <AnimatePresence>
                {isCategoryModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsCategoryModalOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-gray-900">Новая категория</h3>
                                <button onClick={() => setIsCategoryModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-xl">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <form onSubmit={handleCreateCategory} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Название</label>
                                    <input
                                        autoFocus
                                        required
                                        type="text"
                                        value={newCategoryName}
                                        onChange={e => setNewCategoryName(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="Напр., Средства защиты"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/25 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                                >
                                    Создать <ArrowRight className="w-4 h-4" />
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}

                {isProductModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsProductModalOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-gray-900">Добавить товар</h3>
                                <button onClick={() => setIsProductModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-xl">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <form onSubmit={handleCreateProduct} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Название</label>
                                    <input
                                        autoFocus
                                        required
                                        type="text"
                                        value={newProductName}
                                        onChange={e => setNewProductName(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="Название товара"
                                    />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Цена (₽)</label>
                                        <input
                                            required
                                            type="number"
                                            value={newProductPrice}
                                            onChange={e => setNewProductPrice(e.target.value)}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            placeholder="1500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Категория</label>
                                        <div className="px-4 py-3 bg-blue-50 text-blue-700 rounded-xl font-medium border border-blue-100">
                                            {categoryId ? categories.find(c => c.id === parseInt(categoryId))?.name || 'Выбрана' : 'Все категории'}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Описание</label>
                                    <textarea
                                        rows={3}
                                        value={newProductDesc}
                                        onChange={e => setNewProductDesc(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                                        placeholder="Описание товара..."
                                    />
                                </div>
                                <div className="p-4 bg-amber-50 rounded-xl flex items-start gap-3 border border-amber-100">
                                    <span className="text-amber-500 text-lg">💡</span>
                                    <p className="text-xs text-amber-700 leading-relaxed">
                                        Фото можно будет загрузить на странице товара после его создания.
                                    </p>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/25 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                                >
                                    Создать товар <Plus className="w-4 h-4" />
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
