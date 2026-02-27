import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Check, Package, Tag, ArrowLeft, Eye, EyeOff, Camera, Loader2, Plus, X, Trash2 } from 'lucide-react';
import { api } from '../utils/api';
import { AddToCartButton } from '../components/AddToCartButton';
import { useAuthStore } from '../store/useAuthStore';

export function ProductPage() {
    const { slug } = useParams();
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeIdx, setActiveIdx] = useState(0);
    const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);
    const { user, token } = useAuthStore();
    const navigate = useNavigate();

    const handleToggleHide = async () => {
        if (!product) return;
        try {
            const result = await api.toggleProductHide(product.id);
            setProduct({ ...product, is_hidden: result.is_hidden });
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteProduct = async () => {
        if (!product || !token) return;
        if (!window.confirm(`Вы уверены, что хотите полностью удалить товар "${product.name}"? Это действие необратимо!`)) return;

        try {
            const res = await fetch(`/api/products/${product.id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error('Failed to delete product');
            alert('Товар успешно удален');
            navigate('/catalog');
        } catch (error) {
            console.error(error);
            alert('Ошибка при удалении товара');
        }
    };

    const handleUploadImage = async (file: File, index: number) => {
        if (!product || !token) return;
        setUploadingIdx(index);
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('index', String(index));
            const res = await fetch(`/api/products/${product.id}/upload-image`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });
            if (!res.ok) throw new Error('Upload failed');
            const data = await res.json();
            setProduct({ ...product, image_urls: data.image_urls });
            setActiveIdx(index);
        } catch (err) {
            console.error(err);
            alert('Ошибка загрузки фото');
        } finally {
            setUploadingIdx(null);
        }
    };

    const handleDeleteImage = async (index: number) => {
        if (!product || !token) return;
        if (!window.confirm('Удалить это фото?')) return;
        try {
            const res = await fetch(`/api/products/${product.id}/image/${index}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error('Delete failed');
            const data = await res.json();
            setProduct({ ...product, image_urls: data.image_urls });
            setActiveIdx(Math.max(0, index - 1));
        } catch (err) {
            console.error(err);
            alert('Ошибка удаления фото');
        }
    };

    useEffect(() => {
        if (slug) {
            setLoading(true);
            setActiveIdx(0);
            api.getProduct(slug)
                .then(data => { setProduct(data); setLoading(false); })
                .catch(err => { console.error(err); setLoading(false); });
        }
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen pt-24 flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen pt-24 flex flex-col justify-center items-center gap-4 text-gray-500">
                <Package className="w-16 h-16 text-gray-300" />
                <p className="text-lg font-medium">Товар не найден</p>
                <Link to="/catalog" className="text-blue-600 hover:underline font-semibold">← Вернуться в каталог</Link>
            </div>
        );
    }

    const images: string[] = product.image_urls || [];
    const attrs = product.attributes ? Object.entries(product.attributes) : [];

    return (
        <div className="min-h-screen pt-20 sm:pt-24 pb-16" style={{ background: 'linear-gradient(135deg, #f8faff 0%, #eef2ff 100%)' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Breadcrumbs */}
                <nav className="flex items-center gap-1 text-sm text-gray-400 mb-6 flex-wrap">
                    <Link to="/" className="hover:text-blue-600 transition-colors">Главная</Link>
                    <ChevronRight className="w-4 h-4 shrink-0" />
                    <Link to="/catalog" className="hover:text-blue-600 transition-colors">Каталог</Link>
                    <ChevronRight className="w-4 h-4 shrink-0" />
                    {product.category && (
                        <>
                            <Link to={`/catalog?category=${product.category_id}`} className="hover:text-blue-600 transition-colors">{product.category.name}</Link>
                            <ChevronRight className="w-4 h-4 shrink-0" />
                        </>
                    )}
                    <span className="text-gray-600 font-medium truncate max-w-[200px] sm:max-w-none">{product.name}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-16 items-start">

                    {/* ══ ЛЕВАЯ КОЛОНКА — Фото ══ */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col gap-4"
                    >
                        {/* Главное фото */}
                        <div className="relative rounded-3xl overflow-hidden bg-white border border-gray-100 shadow-lg"
                            style={{ aspectRatio: '1 / 1' }}>
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={activeIdx}
                                    src={images[activeIdx] ? encodeURI(images[activeIdx]) : `https://placehold.co/700x700/f1f5f9/475569?text=${encodeURIComponent(product.name)}`}
                                    alt={product.name}
                                    initial={{ opacity: 0, scale: 1.03 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.97 }}
                                    transition={{ duration: 0.3 }}
                                    className="w-full h-full object-contain p-6"
                                />
                            </AnimatePresence>

                            {product.is_hidden && (
                                <div className="absolute top-4 left-4 bg-gray-700/80 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                                    <EyeOff className="w-3 h-3" /> Скрыт
                                </div>
                            )}
                        </div>

                        {/* Миниатюры + кнопки загрузки (для админа) */}
                        <div className="flex gap-3 overflow-x-auto pb-1">
                            {/* Существующие фото */}
                            {images.map((url, idx) => (
                                <div key={idx} className="relative shrink-0 group">
                                    <button
                                        onClick={() => setActiveIdx(idx)}
                                        className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 transition-all duration-200 bg-white block ${activeIdx === idx
                                            ? 'border-blue-600 shadow-md shadow-blue-200'
                                            : 'border-gray-200 hover:border-blue-300'
                                            }`}
                                    >
                                        <img src={encodeURI(url)} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-contain p-1.5" />
                                    </button>

                                    {/* Кнопка замены фото — иконка камеры снизу слева */}
                                    {user?.is_admin && (
                                        <label
                                            className="absolute bottom-1 left-1 w-7 h-7 bg-blue-600/90 hover:bg-blue-600 text-white rounded-lg flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-all shadow-sm z-10 backdrop-blur-sm"
                                            title="Заменить фото"
                                            onClick={e => e.stopPropagation()}
                                        >
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={e => {
                                                    const f = e.target.files?.[0];
                                                    if (f) handleUploadImage(f, idx);
                                                    e.target.value = '';
                                                }}
                                            />
                                            {uploadingIdx === idx
                                                ? <Loader2 className="w-4 h-4 animate-spin" />
                                                : <Camera className="w-4 h-4" />}
                                        </label>
                                    )}

                                    {/* Кнопка удаления фото — крестик сверху справа (внутри) */}
                                    {user?.is_admin && (
                                        <button
                                            onClick={e => { e.stopPropagation(); handleDeleteImage(idx); }}
                                            className="absolute top-1 right-1 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-md transition-all opacity-0 group-hover:opacity-100 z-10"
                                            title="Удалить фото"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    )}
                                </div>
                            ))}

                            {/* Кнопка добавить фото — только для админа */}
                            {user?.is_admin && (
                                <label className="shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-2 border-dashed border-gray-300 hover:border-blue-400 bg-white flex flex-col items-center justify-center cursor-pointer transition-all gap-1 hover:bg-blue-50">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={e => {
                                            const f = e.target.files?.[0];
                                            if (f) handleUploadImage(f, images.length);
                                            e.target.value = '';
                                        }}
                                    />
                                    {uploadingIdx === images.length
                                        ? <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
                                        : <>
                                            <Plus className="w-5 h-5 text-gray-400" />
                                            <span className="text-[10px] text-gray-400 font-medium">Добавить</span>
                                        </>}
                                </label>
                            )}
                        </div>
                    </motion.div>

                    {/* ══ ПРАВАЯ КОЛОНКА — Инфо ══ */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="flex flex-col gap-6"
                    >
                        {/* Категория */}
                        {product.category && (
                            <Link
                                to={`/catalog?category=${product.category_id}`}
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-3 py-1.5 rounded-full w-fit hover:bg-blue-100 transition-colors"
                            >
                                <Tag className="w-3 h-3" />
                                {product.category.name}
                            </Link>
                        )}

                        {/* Название */}
                        <h1 className="text-2xl sm:text-3xl xl:text-4xl font-extrabold text-gray-900 leading-tight">
                            {product.name}
                        </h1>

                        {/* Цена + наличие */}
                        <div className="flex items-end gap-4 flex-wrap">
                            <div>
                                <p className="text-xs text-gray-400 uppercase font-medium mb-1">Цена</p>
                                <p className="text-4xl sm:text-5xl font-extrabold text-gray-900">
                                    {product.price.toLocaleString('ru-RU')}
                                    <span className="text-2xl sm:text-3xl ml-1 text-gray-600">₽</span>
                                </p>
                            </div>
                            <div className="flex items-center gap-1.5 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-semibold border border-green-100 mb-1">
                                <Check className="w-4 h-4" />
                                В наличии на складе
                            </div>
                        </div>

                        {/* Описание */}
                        <p className="text-gray-600 text-base sm:text-lg leading-relaxed border-l-4 border-blue-200 pl-4">
                            {product.description}
                        </p>

                        {/* Кнопки */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                            <div className="flex-1">
                                <AddToCartButton product={product} compact={false} />
                            </div>
                            {user?.is_admin && (
                                <>
                                    <button
                                        onClick={handleToggleHide}
                                        className={`flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-bold text-white shadow-md transition-all text-sm ${product.is_hidden
                                            ? 'bg-gray-500 hover:bg-gray-600'
                                            : 'bg-orange-500 hover:bg-orange-600'
                                            }`}
                                    >
                                        {product.is_hidden ? <><Eye className="w-4 h-4" /> Показать</> : <><EyeOff className="w-4 h-4" /> Скрыть</>}
                                    </button>

                                    <button
                                        onClick={handleDeleteProduct}
                                        className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 shadow-md transition-all text-sm"
                                        title="Полностью удалить товар из базы"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Удалить
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Характеристики */}
                        {attrs.length > 0 && (
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                                    <Package className="w-4 h-4 text-blue-600" />
                                    <h3 className="text-base font-bold text-gray-900">Характеристики</h3>
                                </div>
                                <div className="divide-y divide-gray-50">
                                    {attrs.map(([key, value]) => (
                                        <div key={key} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors">
                                            <span className="text-sm text-gray-500 font-medium">{key}</span>
                                            <span className="text-sm font-bold text-gray-900 text-right ml-4">{String(value)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Назад */}
                        <Link
                            to="/catalog"
                            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-blue-600 transition-colors mt-2 w-fit"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Вернуться в каталог
                        </Link>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
