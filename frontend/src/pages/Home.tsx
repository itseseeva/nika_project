import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ShieldCheck, Truck, Package, Eye, EyeOff, Upload, Briefcase, ChefHat, Building2 } from 'lucide-react';
import { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { CareersTab } from '../components/hub/CareersTab';
import { HorecaTab } from '../components/hub/HorecaTab';
import { api } from '../utils/api';
import { AddToCartButton } from '../components/AddToCartButton';
import { useAuthStore } from '../store/useAuthStore';

const GAP = 16;
// COLS будет динамически определяться в useLayoutEffect
const TRANSITION_MS = 550;

export function Home() {
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    const activeTab = searchParams.get('tab') || 'supply';

    const [categories, setCategories] = useState<any[]>([]);
    const [bestsellers, setBestsellers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Carousel state
    const [offset, setOffset] = useState(0);
    const [animated, setAnimated] = useState(true);
    const isPaused = useRef(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const [cardWidth, setCardWidth] = useState(200); // будет пересчитан
    const stepRef = useRef(200 + GAP);
    const colsRef = useRef(5);
    const { user } = useAuthStore();

    const handleToggleHide = async (e: React.MouseEvent, productId: number) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            const result = await api.toggleProductHide(productId);
            setBestsellers(bestsellers.map(p => p.id === productId ? { ...p, is_hidden: result.is_hidden } : p));
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

    const handleCategoryImageUpload = async (catId: number, file: File) => {
        try {
            const result = await api.uploadCategoryImage(catId, file);
            setCategories(categories.map(c => c.id === catId ? { ...c, image_url: result.url } : c));
        } catch (error) {
            console.error(error);
            alert('Ошибка при загрузке фото');
        }
    };

    // Create extended items from state
    const extendedItems = bestsellers.length > 0 ? [...bestsellers, ...bestsellers, ...bestsellers, ...bestsellers] : [];

    // Пересчёт ширины карточки под ровно COLS штук
    useLayoutEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const calc = () => {
            const w = el.offsetWidth;
            if (w <= 0) return;

            // До 640px — 1 фото, до 1024px — 3 фото, выше — 5 фото
            // Увеличиваем точность: если ширина позволяет 5 штук, ставим 5
            const cols = w < 640 ? 1 : w < 1024 ? 3 : 5;
            colsRef.current = cols;

            // Рассчитываем ширину карточки так, чтобы влезло ровно cols штук с учетом GAP
            const totalGaps = GAP * (cols - 1);
            const cw = (w - totalGaps) / cols;

            setCardWidth(cw);
            stepRef.current = cw + GAP;
            // При изменении размеров сбрасываем офсет, чтобы не "улететь"
            setOffset(0);
        };

        calc(); // Выполняем сразу

        const ro = new ResizeObserver(() => {
            // Используем requestAnimationFrame для синхронизации с отрисовкой
            requestAnimationFrame(calc);
        });
        ro.observe(el);

        return () => ro.disconnect();
    }, [loading, bestsellers.length]);

    useEffect(() => {
        Promise.all([api.getCategories(), api.getProducts()])
            .then(([cats, prods]) => {
                setCategories(cats || []);
                setBestsellers((prods || []).slice(0, 10)); // Take top 10 as bestsellers
            })
            .catch(console.error)
            .finally(() => {
                setLoading(false);
            });
    }, []);

    // Auto-slide every 2.5s
    useEffect(() => {
        const interval = setInterval(() => {
            if (isPaused.current) return;
            setAnimated(true);
            setOffset(prev => {
                const next = prev + stepRef.current;
                if (bestsellers.length > 0 && next >= bestsellers.length * stepRef.current) {
                    // Через время анимации отключить transition и прыгнуть в начало
                    setTimeout(() => {
                        setAnimated(false);
                        setOffset(0);
                        // Сразу вернуть transition обратно (без ре-рендера)
                        requestAnimationFrame(() => requestAnimationFrame(() => setAnimated(true)));
                    }, TRANSITION_MS);
                }
                return next;
            });
        }, 2500);

        return () => clearInterval(interval);
    }, [bestsellers.length]);

    return (
        <div className="bg-transparent flex flex-col min-h-screen">
            {/* HUB TABS SWITCHER */}
            <div className="pt-24 pb-8 sm:pt-32 sm:pb-12 bg-white flex justify-center border-b border-gray-100 z-20 relative shadow-sm">
                <div className="flex bg-gray-100/80 p-1.5 sm:p-2 rounded-2xl gap-2 shadow-inner overflow-x-auto max-w-full mx-4 no-scrollbar">
                    <button 
                        onClick={() => navigate('/?tab=supply')}
                        className={`relative px-5 py-3 sm:px-8 sm:py-4 rounded-xl flex items-center gap-3 text-sm sm:text-base font-bold transition-all whitespace-nowrap ${activeTab === 'supply' ? 'text-blue-700 shadow-md' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'}`}
                    >
                        {activeTab === 'supply' && <motion.div layoutId="activeTabBg" className="absolute inset-0 bg-white rounded-xl" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />}
                        <Building2 className="w-5 h-5 relative z-10" />
                        <span className="relative z-10">B2B Поставки</span>
                    </button>
                    
                    <button 
                        onClick={() => navigate('/?tab=horeca')}
                        className={`relative px-5 py-3 sm:px-8 sm:py-4 rounded-xl flex items-center gap-3 text-sm sm:text-base font-bold transition-all whitespace-nowrap ${activeTab === 'horeca' ? 'text-amber-700 shadow-md' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'}`}
                    >
                        {activeTab === 'horeca' && <motion.div layoutId="activeTabBg" className="absolute inset-0 bg-white rounded-xl" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />}
                        <ChefHat className="w-5 h-5 relative z-10" />
                        <span className="relative z-10">Поставки продуктов</span>
                    </button>
                    
                    <button 
                        onClick={() => navigate('/?tab=careers')}
                        className={`relative px-5 py-3 sm:px-8 sm:py-4 rounded-xl flex items-center gap-3 text-sm sm:text-base font-bold transition-all whitespace-nowrap ${activeTab === 'careers' ? 'text-purple-700 shadow-md' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'}`}
                    >
                        {activeTab === 'careers' && <motion.div layoutId="activeTabBg" className="absolute inset-0 bg-white rounded-xl" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />}
                        <Briefcase className="w-5 h-5 relative z-10" />
                        <span className="relative z-10">Сотрудничество</span>
                    </button>
                </div>
            </div>

            <div className="flex-1 relative">
                <AnimatePresence mode="wait">
                    {activeTab === 'careers' && <CareersTab key="careers" />}
                    {activeTab === 'horeca' && <HorecaTab key="horeca" />}
                    {activeTab === 'supply' && (
                        <motion.div 
                            key="supply"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                        >
                            {/* Hero Section */}
            <section className="relative pt-20 pb-14 sm:pt-32 sm:pb-20 lg:pt-48 lg:pb-32 overflow-hidden flex items-center min-h-[70vh] sm:min-h-[80vh]">
                <div className="absolute inset-0">
                    <img
                        src="/hero_bg.jpg"
                        alt="Склад и производство"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent z-10" />
                <div className="absolute inset-0 bg-blue-900/20 mix-blend-multiply z-10" />


                <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div className="max-w-3xl">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                            <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-tight">
                                Профессиональное <br className="hidden sm:block" />
                                снабжение <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">для вашего бизнеса</span>
                            </h1>
                        </motion.div>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                            className="mt-8 text-xl sm:text-2xl text-gray-300 max-w-2xl font-light"
                        >
                            Спецодежда, автозапчасти и упаковочные материалы. Прямые поставки и надёжное качество.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                            className="mt-8 sm:mt-12 flex flex-col sm:flex-row gap-4 sm:gap-6"
                        >
                            <Link
                                to="/catalog"
                                className="group relative inline-flex w-full sm:w-auto justify-center items-center px-8 sm:px-10 py-4 sm:py-5 text-base sm:text-lg font-bold text-white bg-blue-600 rounded-full overflow-hidden shadow-2xl hover:shadow-blue-500/50 transition-all duration-300"
                            >
                                <motion.div
                                    className="absolute inset-0 bg-white/20"
                                    animate={{ x: ['-100%', '100%'] }}
                                    transition={{ repeat: Infinity, duration: 3, ease: "linear", repeatDelay: 1 }}
                                />
                                <span className="relative z-10 flex items-center">
                                    Перейти в каталог
                                    <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* === FEATURES === */}
            <section className="py-14 sm:py-24 bg-transparent relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-12">
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6 }}
                            className="flex flex-col items-start bg-white/60 backdrop-blur-md p-5 sm:p-8 rounded-3xl border border-gray-100 hover:shadow-xl transition-shadow"
                        >
                            <div className="w-20 h-20 bg-blue-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30 transform -rotate-3">
                                <ShieldCheck className="w-10 h-10" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Гарантия качества</h3>
                            <p className="text-gray-500 leading-relaxed">
                                Только сертифицированная продукция от проверенных мировых производителей. Жёсткий контроль на каждом этапе.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="flex flex-col items-start bg-white/60 backdrop-blur-md p-5 sm:p-8 rounded-3xl border border-gray-100 hover:shadow-xl transition-shadow"
                        >
                            <div className="w-20 h-20 bg-indigo-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/30 transform rotate-3">
                                <Package className="w-10 h-10" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Оптовые закупки</h3>
                            <p className="text-gray-500 leading-relaxed">
                                Индивидуальные цены, гибкие системы скидок и отсрочка платежа для постоянных партнёров.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="flex flex-col items-start bg-white/60 backdrop-blur-md p-5 sm:p-8 rounded-3xl border border-gray-100 hover:shadow-xl transition-shadow"
                        >
                            <div className="w-20 h-20 bg-cyan-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-cyan-500/30 transform -rotate-3">
                                <Truck className="w-10 h-10" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Быстрая доставка</h3>
                            <p className="text-gray-500 leading-relaxed">
                                Собственный автопарк и сеть складов позволяют доставлять заказы день в день в большинстве регионов.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* === КАРУСЕЛЬ === */}
            <section className="py-14 sm:py-24 bg-transparent">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-10">
                    <div className="md:flex md:items-end md:justify-between">
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Хиты продаж</h2>
                            <p className="mt-2 sm:mt-4 text-base sm:text-lg text-gray-500">Самые популярные товары этой недели</p>
                        </div>
                        <Link to="/catalog" className="hidden md:inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                            Смотреть все <ArrowRight className="ml-2 w-4 h-4" />
                        </Link>
                    </div>
                </div>

                {/* Sliding carousel track */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ overflow: 'clip' }}>
                    {loading ? (
                        <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>
                    ) : bestsellers.length === 0 ? (
                        <div className="text-center py-20 text-gray-500">Товаров пока нет</div>
                    ) : (
                        <div
                            ref={containerRef}
                            className="rounded-2xl"
                            style={{ overflow: 'clip', clipPath: 'inset(0 0 0 0 round 1rem)' }}
                            onMouseEnter={() => { isPaused.current = true; }}
                            onMouseLeave={() => { isPaused.current = false; }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    gap: '16px',
                                    transform: `translateX(-${offset}px)`,
                                    transition: animated ? `transform ${TRANSITION_MS}ms cubic-bezier(0.4, 0, 0.2, 1)` : 'none',
                                    willChange: 'transform',
                                }}
                            >
                                {extendedItems.map((item, index) => (
                                    <div
                                        key={`${item.id}-${index}`}
                                        style={{
                                            width: cardWidth ? `${cardWidth}px` : '280px',
                                            minWidth: cardWidth ? `${cardWidth}px` : '280px',
                                            flexShrink: 0
                                        }}
                                        className="border border-[#e8edf2] overflow-hidden group hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex flex-col font-sans rounded-xl bg-white"
                                    >
                                        {/* Фото квадратное, без пустых полос */}
                                        <Link to={`/product/${item.slug}`} className="relative block group/img bg-white" style={{ aspectRatio: '1 / 1' }}>
                                            <img
                                                src={item.image_urls?.[0] ? encodeURI(item.image_urls[0]) : 'https://placehold.co/400x400/f8fafc/31343C?text=No+Photo'}
                                                alt={item.name}
                                                className={`absolute inset-0 w-full h-full object-contain p-2 transition-transform duration-500 group-hover/img:scale-[1.05] ${item.image_urls?.length > 1 ? 'animate-crossfade' : ''}`}
                                            />
                                            {item.image_urls?.length > 1 && (
                                                <img
                                                    src={encodeURI(item.image_urls[1])}
                                                    alt={`${item.name} - 2`}
                                                    className="absolute inset-0 w-full h-full object-contain p-2 transition-transform duration-500 group-hover/img:scale-[1.05] animate-crossfade-reverse"
                                                />
                                            )}
                                            <div className="absolute top-2 right-2 bg-[#ea580c] text-white text-[9px] uppercase font-bold px-2 py-0.5 shadow rounded-md z-10">ХИТ</div>
                                        </Link>

                                        {/* Информация под фото — компактно */}
                                        <div className="flex flex-col p-2.5 gap-1.5 border-t border-gray-100">
                                            <Link to={`/product/${item.slug}`} className="text-[12px] font-semibold text-gray-800 hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                                                {item.name}
                                            </Link>
                                            <div className="flex items-center justify-between">
                                                <span className="text-[14px] font-bold text-gray-900 whitespace-nowrap">
                                                    {item.price.toLocaleString('ru-RU')} ₽
                                                </span>
                                                <div className="flex items-center gap-1">
                                                    {user?.is_admin && (
                                                        <button
                                                            onClick={(e) => handleToggleHide(e, item.id)}
                                                            className={`px-2 py-0.5 rounded text-[10px] font-bold text-white transition-colors ${item.is_hidden ? 'bg-gray-500 hover:bg-gray-600' : 'bg-red-500 hover:bg-red-600'}`}
                                                        >
                                                            {item.is_hidden ? 'Показать' : 'Скрыть'}
                                                        </button>
                                                    )}
                                                    <AddToCartButton product={item} compact={true} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Categories */}
            <section className="py-24 bg-transparent">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-16 text-center max-w-3xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.8 }}
                        >
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">Популярные направления</h2>
                            <div className="w-24 h-1.5 bg-blue-600 mx-auto mt-6 rounded-full"></div>
                        </motion.div>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                            className="mt-8 text-xl text-gray-600 leading-relaxed font-medium"
                        >
                            Основа вашего бизнеса — это надёжные поставки и качественные материалы.
                            Мы отобрали самые востребованные категории товаров, чтобы вы могли
                            укомплектовать своё производство в одном месте без лишней траты времени.
                        </motion.p>
                    </div>

                    {loading ? (
                        <div className="flex justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                            {/* Динамические категории из БД */}
                            {categories
                                .filter((c: any) => (user?.is_admin || !c.is_hidden))
                                .map((cat: any, i) => {
                                    let bgImage = '';
                                    let desc = '';
                                    if (cat.name.includes('Спецодежда')) {
                                        bgImage = 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=800';
                                        desc = 'Защита и комфорт для ваших сотрудников в любых условиях. Спецовка, обувь, униформа.';
                                    } else if (cat.name.includes('запчасти')) {
                                        bgImage = 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80&w=800';
                                        desc = 'Оригинальные и надёжные комплектующие для коммерческого транспорта и спецтехники.';
                                    } else if (cat.name.includes('Упаковочные') || cat.name.includes('упаковоч')) {
                                        bgImage = encodeURI('/упаковочные_материалы.jpg');
                                        desc = 'Всё необходимое для безопасной транспортировки: гофрокороба, стрейч-пленка, скотч.';
                                    } else if (cat.name.includes('Расходные') || cat.name.includes('расходн')) {
                                        bgImage = encodeURI('/расходные_материалы.jpg');
                                        desc = 'Масла, антифризы, фильтры и другие расходные материалы для вашего автопарка.';
                                    } else if (cat.name.includes('Масла') || cat.name.includes('Смазки')) {
                                        bgImage = encodeURI('/products/Масла и Смазки.jpg');
                                        desc = 'Высококачественные моторные и трансмиссионные масла для защиты вашего двигателя.';
                                    } else if (cat.name.includes('Технические жидкости') || cat.name.includes('жидкости')) {
                                        bgImage = encodeURI('/products/технические жидкости.jpg');
                                        desc = 'Омывайки, тормозные жидкости и другие важные технические составы.';
                                    } else {
                                        bgImage = 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=800';
                                        desc = 'Всё необходимое для безопасной транспортировки: гофрокороба, стрейч-пленка, скотч.';
                                    }

                                    return (
                                        <motion.div
                                            key={cat.id}
                                            initial={{ opacity: 0, scale: 0.9, y: 40 }}
                                            whileInView={{ opacity: 1, scale: 1, y: 0 }}
                                            viewport={{ once: true, margin: "-50px" }}
                                            transition={{ duration: 0.8, delay: i * 0.2, type: "spring", stiffness: 60 }}
                                            className={cat.is_hidden ? 'opacity-60 grayscale-[0.5]' : ''}
                                        >
                                            <Link
                                                to={`/catalog?category=${cat.id}`}
                                                className="group block relative rounded-3xl overflow-hidden bg-gray-900 aspect-[3/4] shadow-lg hover:shadow-2xl transition-all duration-500 transform-gpu"
                                            >
                                                {user?.is_admin && (
                                                    <div className="absolute top-3 right-3 z-30 flex gap-2" onClick={(e) => e.stopPropagation()}>
                                                        <label
                                                            className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-colors cursor-pointer"
                                                            title="Загрузить фото"
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            <Upload className="w-4 h-4" />
                                                            <input
                                                                type="file"
                                                                className="hidden"
                                                                accept="image/*"
                                                                onChange={(e) => {
                                                                    const file = e.target.files?.[0];
                                                                    if (file) handleCategoryImageUpload(cat.id, file);
                                                                }}
                                                            />
                                                        </label>
                                                        <button
                                                            onClick={(e) => handleToggleCategoryHide(e, cat.id)}
                                                            className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-colors"
                                                            title={cat.is_hidden ? "Показать" : "Скрыть"}
                                                        >
                                                            {cat.is_hidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                        </button>
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent z-10 opacity-90 group-hover:opacity-100 transition-opacity duration-500" />
                                                <motion.img
                                                    initial={{ scale: 1.3, filter: "blur(10px)" }}
                                                    whileInView={{ scale: 1, filter: "blur(0px)" }}
                                                    transition={{ duration: 1.5, ease: "easeOut", delay: i * 0.1 }}
                                                    viewport={{ once: true, margin: "-50px" }}
                                                    src={cat.image_url ? encodeURI(cat.image_url) : bgImage}
                                                    alt={cat.name}
                                                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                                                />
                                                <div className="absolute inset-x-0 bottom-0 p-4 z-20 flex flex-col justify-end h-full">
                                                    <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                                        <h3 className="text-sm sm:text-base font-extrabold text-white mb-1 tracking-wide leading-tight">{cat.name}</h3>
                                                        <p className="text-gray-300 text-xs leading-relaxed mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 hidden sm:block">
                                                            {desc}
                                                        </p>
                                                        <span className="inline-flex items-center text-white/90 font-bold group-hover:text-blue-400 transition-colors uppercase tracking-wider text-[10px]">
                                                            В каталог <ArrowRight className="ml-1 w-3 h-3 transform group-hover:translate-x-1 transition-transform duration-300" />
                                                        </span>
                                                    </div>
                                                </div>
                                            </Link>
                                        </motion.div>
                                    );
                                })}
                        </div>
                    )}
                </div>
            </section>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

