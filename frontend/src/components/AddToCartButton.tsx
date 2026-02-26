import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Minus, Plus } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';

interface AddToCartButtonProps {
    product: any;
    compact?: boolean;
}

export function AddToCartButton({ product, compact = true }: AddToCartButtonProps) {
    const { items, addItem, updateQuantity } = useCartStore();

    const cartItem = items.find(item => item.id === product.id);
    const quantity = cartItem?.quantity || 0;

    const handleAdd = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addItem(product, 1, false);
    };


    const handleIncrement = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (cartItem) {
            updateQuantity(product.id, quantity + 1);
        }
    };

    const handleDecrement = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (cartItem) {
            updateQuantity(product.id, quantity - 1);
        }
    };

    return (
        <div className="relative flex items-center justify-end" onClick={e => e.preventDefault()}>
            <AnimatePresence mode="wait">
                {quantity === 0 ? (
                    <motion.button
                        key="add-btn"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleAdd}
                        className={
                            compact
                                ? "bg-blue-600 text-white p-1.5 rounded-lg hover:bg-blue-700 font-medium transition-all duration-200 flex items-center justify-center w-8 h-8 z-10 shadow-sm"
                                : "w-full bg-slate-900 text-white rounded-xl flex items-center justify-center font-semibold text-[15px] hover:bg-black shadow-lg shadow-slate-900/20 transition-all h-12 z-10"
                        }
                        title="В корзину"
                    >
                        <ShoppingBag className={compact ? "w-4 h-4" : "w-4 h-4 mr-2"} />
                        {!compact && "Добавить в корзину"}
                    </motion.button>
                ) : (
                    <motion.div
                        key="qty-selector"
                        initial={{ opacity: 0, width: 40, borderRadius: "20px" }}
                        animate={{ opacity: 1, width: compact ? 100 : '100%', borderRadius: compact ? "20px" : "12px" }}
                        exit={{ opacity: 0, width: 40 }}
                        className={
                            compact
                                ? "flex items-center justify-between bg-blue-600 text-white rounded-lg h-8 px-1 overflow-hidden z-10 min-w-[80px]"
                                : "flex items-center justify-between border border-slate-900 rounded-xl h-12 bg-white overflow-hidden w-full z-10"
                        }
                    >
                        <button
                            type="button"
                            onClick={handleDecrement}
                            className={`flex-1 flex justify-center items-center h-full transition-colors ${compact ? "hover:bg-blue-700 text-white" : "hover:bg-slate-50 text-slate-900"}`}
                        >
                            <Minus className="w-4 h-4" />
                        </button>

                        <div className={`w-8 text-center font-bold flex items-center justify-center ${compact ? "text-white text-[14px]" : "text-slate-900 text-[15px]"}`}>
                            <motion.span
                                key={quantity}
                                initial={{ y: -10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="inline-block"
                            >
                                {quantity}
                            </motion.span>
                        </div>

                        <button
                            type="button"
                            onClick={handleIncrement}
                            className={`flex-1 flex justify-center items-center h-full transition-colors ${compact ? "hover:bg-blue-700 text-white" : "hover:bg-slate-50 text-slate-900"}`}
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
