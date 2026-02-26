import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';

export function CartModal() {
    const { items, isOpen, setIsOpen, updateQuantity, removeItem, totalPrice } = useCartStore();
    const [showError, setShowError] = useState(false);
    const navigate = useNavigate();

    const handleCheckout = () => {
        setShowError(true);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 overflow-hidden">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => setIsOpen(false)}
                    />

                    <div className="fixed inset-y-0 right-0 max-w-full flex">
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="w-screen max-w-md"
                        >
                            <div className="h-full flex flex-col bg-white shadow-xl">
                                <div className="flex-1 py-4 sm:py-6 overflow-y-auto px-4 sm:px-6">
                                    <div className="flex items-start justify-between">
                                        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                                            <ShoppingBag className="w-5 h-5" /> Корзина
                                        </h2>
                                        <div className="ml-3 h-7 flex items-center">
                                            <button
                                                type="button"
                                                className="-m-2 p-2 text-gray-400 hover:text-gray-500"
                                                onClick={() => setIsOpen(false)}
                                            >
                                                <span className="sr-only">Close panel</span>
                                                <X className="h-6 w-6" aria-hidden="true" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="mt-8">
                                        <AnimatePresence mode="wait">
                                            {showError ? (
                                                <motion.div
                                                    key="error"
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.9 }}
                                                    className="flex flex-col items-center justify-center h-full text-center px-4"
                                                >
                                                    <img
                                                        src="/assets/crying-cat.gif"
                                                        alt="Плачущий котик"
                                                        className="w-48 h-48 object-cover rounded-3xl mb-6 shadow-md bg-gray-100"
                                                    />
                                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Простите, мы сломались</h3>
                                                    <p className="text-gray-500 mb-6 text-lg">
                                                        Это ненадолго, скоро починим.<br />Обновите сайт — иногда это помогает.
                                                    </p>
                                                    <button
                                                        onClick={() => window.location.reload()}
                                                        className="px-6 py-3 bg-gray-900 text-white rounded-xl font-medium shadow-sm hover:bg-gray-800 transition-colors w-full"
                                                    >
                                                        Обновить страницу
                                                    </button>
                                                </motion.div>
                                            ) : items.length === 0 ? (
                                                <motion.div
                                                    key="empty"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className="flex flex-col items-center justify-center h-48 text-gray-500 text-center"
                                                >
                                                    <ShoppingBag className="w-12 h-12 mb-4 text-gray-300" />
                                                    <p>Ваша корзина пуста</p>
                                                    <button
                                                        onClick={() => { setIsOpen(false); navigate('/catalog'); }}
                                                        className="mt-4 text-blue-600 font-medium hover:text-blue-500"
                                                    >
                                                        Перейти к покупкам →
                                                    </button>
                                                </motion.div>
                                            ) : (
                                                <motion.div
                                                    key="items"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className="flow-root"
                                                >
                                                    <ul role="list" className="-my-6 divide-y divide-gray-200">
                                                        {items.map((product) => (
                                                            <li key={product.id} className="py-6 flex">
                                                                <div className="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden bg-white">
                                                                    <img
                                                                        src={product.image_url}
                                                                        alt={product.name}
                                                                        className="w-full h-full object-center object-cover"
                                                                    />
                                                                </div>

                                                                <div className="ml-4 flex-1 flex flex-col">
                                                                    <div>
                                                                        <div className="flex justify-between text-base font-medium text-gray-900">
                                                                            <h3 className="line-clamp-2 pr-4">{product.name}</h3>
                                                                            <p className="ml-4 whitespace-nowrap">{product.price.toLocaleString('ru-RU')} ₽</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex-1 flex items-end justify-between text-sm">
                                                                        <div className="flex items-center border border-gray-300 rounded-lg">
                                                                            <button
                                                                                onClick={() => updateQuantity(product.id, Math.max(1, product.quantity - 1))}
                                                                                className="p-1 text-gray-600 hover:bg-gray-100 rounded-l-lg transition-colors"
                                                                            >
                                                                                <Minus className="w-4 h-4" />
                                                                            </button>
                                                                            <span className="px-3 py-1 font-medium">{product.quantity}</span>
                                                                            <button
                                                                                onClick={() => updateQuantity(product.id, product.quantity + 1)}
                                                                                className="p-1 text-gray-600 hover:bg-gray-100 rounded-r-lg transition-colors"
                                                                            >
                                                                                <Plus className="w-4 h-4" />
                                                                            </button>
                                                                        </div>

                                                                        <div className="flex">
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => removeItem(product.id)}
                                                                                className="font-medium text-red-600 hover:text-red-500 transition-colors"
                                                                            >
                                                                                Удалить
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>

                                {items.length > 0 && (
                                    <div className="border-t border-gray-200 py-6 px-4 sm:px-6 bg-gray-50 pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
                                        <div className="flex justify-between text-lg font-semibold text-gray-900">
                                            <p>Итого</p>
                                            <p>{totalPrice().toLocaleString('ru-RU')} ₽</p>
                                        </div>
                                        <p className="mt-0.5 text-sm text-gray-500">Доставка и налоги рассчитываются при оформлении заказа.</p>
                                        <div className="mt-6">
                                            <button
                                                onClick={handleCheckout}
                                                className="w-full flex justify-center items-center px-6 py-4 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                            >
                                                Оформить заказ
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>
            )}
        </AnimatePresence>
    );
}
