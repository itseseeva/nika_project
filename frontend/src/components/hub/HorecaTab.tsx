import { motion, AnimatePresence } from 'framer-motion';
import { ChefHat, Clock, Leaf, Utensils, X, Send } from 'lucide-react';
import { useState } from 'react';

export function HorecaTab() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitted(true);
        setTimeout(() => {
            setIsModalOpen(false);
            setIsSubmitted(false);
        }, 2000);
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="py-12 sm:py-20 bg-amber-50/30"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Hero section inside Tab */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl mb-16">
                    <div className="absolute inset-0">
                        {/* Placeholder generic image for food delivery */}
                        <img 
                            src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=1200" 
                            alt="HoReCa Delivery" 
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-gray-900/40 mix-blend-multiply" />
                    </div>
                    
                    <div className="relative z-10 p-10 sm:p-20 flex flex-col items-start max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/20 text-amber-300 font-bold mb-6 border border-amber-500/30 backdrop-blur-md">
                            <ChefHat className="w-5 h-5" />
                            Оптовые поставки питания
                        </div>
                        <h2 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight mb-6 leading-tight">
                            Свежие продукты для вашего ресторана
                        </h2>
                        <p className="text-lg sm:text-xl text-gray-200 mb-10 leading-relaxed font-light">
                            Бесперебойные поставки ингредиентов высшего качества для кафе, ресторанов и пищевых производств. Мы берем логистику на себя, чтобы вы могли сосредоточиться на вкусе.
                        </p>
                        <button 
                            onClick={() => setIsModalOpen(true)}
                            className="px-8 py-4 bg-amber-500 hover:bg-amber-400 text-white font-bold rounded-xl transition-colors shadow-lg shadow-amber-500/30 text-lg"
                        >
                            Оставить заявку
                        </button>
                    </div>
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 flex flex-col items-center text-center hover:-translate-y-1 transition-transform">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-6">
                            <Leaf className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Свежесть 100%</h3>
                        <p className="text-gray-600">Мы работаем напрямую с фермерскими хозяйствами и надежными импортерами, гарантируя свежесть каждой партии.</p>
                    </div>

                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 flex flex-col items-center text-center hover:-translate-y-1 transition-transform border-b-4 border-b-amber-500">
                        <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mb-6 text-center transform scale-110 shadow-lg shadow-amber-500/20">
                            <Clock className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Точность поставок</h3>
                        <p className="text-gray-600">Доставка строго по графику. Ваш повар всегда получит продукты вовремя до начала открытия смены.</p>
                    </div>

                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 flex flex-col items-center text-center hover:-translate-y-1 transition-transform">
                        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                            <Utensils className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">Широкий выбор</h3>
                        <p className="text-gray-600">От базовых овощей и мяса до экзотических ингредиентов и особых специй. Всё в одном месте.</p>
                    </div>
                </div>

            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl"
                        >
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="text-left mb-6">
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Заявка на поставку</h3>
                                <p className="text-gray-500">Заполните форму, и наш менеджер свяжется с вами для обсуждения деталей.</p>
                            </div>

                            {isSubmitted ? (
                                <motion.div 
                                    initial={{ opacity: 0 }} 
                                    animate={{ opacity: 1 }} 
                                    className="py-12 flex flex-col items-center text-center"
                                >
                                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                                        <Leaf className="w-8 h-8" />
                                    </div>
                                    <h4 className="text-xl font-bold text-gray-900 mb-2">Заявка отправлена!</h4>
                                    <p className="text-gray-500">Мы получили ваши данные и скоро свяжемся с вами.</p>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Название заведения / компании *</label>
                                        <input required type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all" placeholder="Например: Ресторан &quot;Море&quot;" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Ваше имя *</label>
                                            <input required type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all" placeholder="Иван И." />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Телефон *</label>
                                            <input required type="tel" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all" placeholder="+7 (___) ___-__-__" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Категория продуктов</label>
                                        <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all bg-white">
                                            <option>Свежие овощи и фрукты</option>
                                            <option>Мясо и птица</option>
                                            <option>Морепродукты</option>
                                            <option>Бакалея и специи</option>
                                            <option>Комплексные поставки (всё)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Комментарий к заявке</label>
                                        <textarea rows={3} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all resize-none" placeholder="Укажите объемы или особые пожелания..."></textarea>
                                    </div>
                                    <button type="submit" className="w-full py-4 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl transition-colors shadow-lg shadow-gray-900/20 text-lg flex justify-center items-center gap-2">
                                        <Send className="w-5 h-5" />
                                        Отправить заявку
                                    </button>
                                    <p className="text-xs text-center text-gray-400 mt-4">
                                        Нажимая кнопку, вы соглашаетесь с обработкой персональных данных.
                                    </p>
                                </form>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
