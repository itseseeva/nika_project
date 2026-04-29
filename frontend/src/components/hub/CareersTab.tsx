import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Building, CheckCircle, FileText, PiggyBank, ShieldAlert, Truck, Send, X } from 'lucide-react';
import { useState } from 'react';

export function CareersTab() {
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
            className="py-12 sm:py-20"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Intro Section */}
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <h2 className="text-3xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-6">
                        Работать с нами — это надёжно и прозрачно
                    </h2>
                    <p className="text-xl text-gray-600 leading-relaxed">
                        Мы строим долгосрочные партнерские отношения. Ниже представлено резюме нашего проекта и подробная бизнес-модель работы с поставщиками и клиентами.
                    </p>
                </div>

                {/* 1. Резюме проекта */}
                <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-gray-100 mb-12">
                    <div className="flex items-center mb-6">
                        <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mr-6">
                            <Briefcase className="w-7 h-7" />
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">1. Резюме проекта</h3>
                    </div>
                    <p className="text-gray-700 text-lg leading-relaxed">
                        Компания занимается оптовой поставкой автозапчастей, упаковочных материалов, спецодежды и технических смазок для автосервисов, автопарков и производственных предприятий. Ключевая особенность — работа с поставщиками на условиях отсрочки платежа (товарного кредита): товар закупается, продаётся клиентам, и только после получения оплаты от покупателей средства перечисляются поставщику.
                    </p>
                </div>

                {/* 2 & 3. Бизнес-модель и Ассортимент */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 border border-blue-100">
                        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                            <Building className="w-6 h-6 mr-3 text-blue-600" />
                            2. Описание бизнес-модели
                        </h3>
                        <ul className="space-y-4">
                            <li className="flex items-start">
                                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
                                <span className="text-gray-800">Компания заключает договоры с поставщиками на условиях отсрочки платежа (30–60 дней).</span>
                            </li>
                            <li className="flex items-start">
                                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
                                <span className="text-gray-800">Товар реализуется клиентам (часто тоже с небольшой отсрочкой, но меньшей, чем у поставщика).</span>
                            </li>
                            <li className="flex items-start">
                                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
                                <span className="text-gray-800">После поступления оплаты от клиента компания перечисляет деньги поставщику.</span>
                            </li>
                            <li className="flex items-start">
                                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
                                <span className="text-gray-800">Доход формируется за счёт наценки (15–30%) минус операционные расходы.</span>
                            </li>
                            <li className="flex items-start">
                                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
                                <span className="text-gray-800">Модель позволяет минимизировать потребность в оборотном капитале и избегать кассовых разрывов.</span>
                            </li>
                        </ul>
                        <div className="mt-6 p-4 bg-white/60 rounded-xl text-sm text-gray-700">
                            <strong>Альтернатива:</strong> при необходимости быстрого расчёта с поставщиком можно использовать факторинг (банк выплачивает компании до 95% суммы поставки сразу, а затем взыскивает долг с покупателя).
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 border border-purple-100">
                        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                            <FileText className="w-6 h-6 mr-3 text-purple-600" />
                            3. Ассортимент
                        </h3>
                        <ul className="space-y-5">
                            <li className="bg-white/80 p-4 rounded-xl shadow-sm">
                                <strong className="text-gray-900 block mb-1">Автозапчасти</strong>
                                <span className="text-gray-600 text-sm">Фильтры, колодки, ремни — высокая оборачиваемость.</span>
                            </li>
                            <li className="bg-white/80 p-4 rounded-xl shadow-sm">
                                <strong className="text-gray-900 block mb-1">Смазочные материалы</strong>
                                <span className="text-gray-600 text-sm">Масла, технические жидкости — регулярный спрос.</span>
                            </li>
                            <li className="bg-white/80 p-4 rounded-xl shadow-sm">
                                <strong className="text-gray-900 block mb-1">Упаковочные материалы</strong>
                                <span className="text-gray-600 text-sm">Скотч, стрейч-плёнка, картон — расходники для бизнеса.</span>
                            </li>
                            <li className="bg-white/80 p-4 rounded-xl shadow-sm">
                                <strong className="text-gray-900 block mb-1">Спецодежда и СИЗ</strong>
                                <span className="text-gray-600 text-sm">Маржинальная группа, востребована на производствах.</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* 4 & 5. Ресурсы и Фин модель */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                     <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
                        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                            <Truck className="w-6 h-6 mr-3 text-cyan-600" />
                            4. Ресурсная база
                        </h3>
                        <p className="text-sm text-gray-500 mb-4">(подтверждается документально)</p>
                        <ul className="space-y-4">
                            <li className="flex items-start">
                                <div className="w-2 h-2 rounded-full bg-cyan-500 mt-2 mr-3 flex-shrink-0" />
                                <span className="text-gray-700"><strong>Аренда склада (50–100 кв. м)</strong> с подъездными путями — договор аренды, фото.</span>
                            </li>
                            <li className="flex items-start">
                                <div className="w-2 h-2 rounded-full bg-cyan-500 mt-2 mr-3 flex-shrink-0" />
                                <span className="text-gray-700"><strong>Офисное помещение</strong> (или совмещённое со складом) — договор аренды.</span>
                            </li>
                            <li className="flex items-start">
                                <div className="w-2 h-2 rounded-full bg-cyan-500 mt-2 mr-3 flex-shrink-0" />
                                <span className="text-gray-700"><strong>Стеллажи, оргтехника</strong> — накладные или договоры аренды.</span>
                            </li>
                            <li className="flex items-start">
                                <div className="w-2 h-2 rounded-full bg-cyan-500 mt-2 mr-3 flex-shrink-0" />
                                <span className="text-gray-700"><strong>Транспорт (по желанию):</strong> собственная «Газель» (ПТС) или аренда (договор, путевые листы).</span>
                            </li>
                            <li className="flex items-start">
                                <div className="w-2 h-2 rounded-full bg-cyan-500 mt-2 mr-3 flex-shrink-0" />
                                <span className="text-gray-700"><strong>Персонал:</strong> руководитель, менеджер по продажам, кладовщик, водитель — штатное расписание, договоры.</span>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
                        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                            <PiggyBank className="w-6 h-6 mr-3 text-orange-500" />
                            5. Финансовая модель
                        </h3>
                        <ul className="space-y-4">
                            <li className="flex items-start">
                                <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 mr-3 flex-shrink-0" />
                                <span className="text-gray-700"><strong>Выручка:</strong> зависит от объёма закупок и наценки (в среднем 20%).</span>
                            </li>
                            <li className="flex items-start">
                                <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 mr-3 flex-shrink-0" />
                                <span className="text-gray-700"><strong>Оборачиваемость:</strong> товар должен продаваться быстрее срока оплаты поставщику (идеально: закупка → продажа за 10–15 дней → получение денег → оплата поставщику на 30-й день).</span>
                            </li>
                            <li className="flex items-start">
                                <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 mr-3 flex-shrink-0" />
                                <span className="text-gray-700"><strong>Расходы:</strong> закупка товара (основная статья), аренда, зарплата, налоги, транспорт.</span>
                            </li>
                            <li className="flex items-start">
                                <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 mr-3 flex-shrink-0" />
                                <span className="text-gray-700"><strong>Принцип:</strong> полученная от клиента оплата резервируется под расчёт с поставщиком; маржа остаётся у компании после покрытия всех затрат.</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* 6. Риски */}
                <div className="bg-red-50 rounded-3xl p-8 sm:p-12 border border-red-100 mb-12">
                    <h3 className="text-2xl font-bold text-red-900 mb-6 flex items-center">
                        <ShieldAlert className="w-7 h-7 mr-3 text-red-600" />
                        6. Риски и их снижение
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm">
                            <h4 className="font-bold text-gray-900 mb-2">Неплатёж клиента</h4>
                            <p className="text-gray-600 text-sm">Работа по предоплате с новичками, лимиты долга для постоянных, факторинг.</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm">
                            <h4 className="font-bold text-gray-900 mb-2">Залеживание товара</h4>
                            <p className="text-gray-600 text-sm">Планирование закупок на основе аналитики и прогнозирования спроса.</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm">
                            <h4 className="font-bold text-gray-900 mb-2">Порча груза</h4>
                            <p className="text-gray-600 text-sm">Качественная упаковка на складе и обязательная страховка при транспортировке.</p>
                        </div>
                    </div>
                </div>

                {/* 7. Контрагенты */}
                <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-gray-100">
                    <h3 className="text-2xl font-bold text-gray-900 mb-8">7. Планируемые контрагенты</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[
                            { name: 'ООО "Форт"', inn: '7806460052' },
                            { name: 'ООО "ВСЕИНСТРУМЕНТЫ.РУ"', inn: '7722753969' },
                            { name: 'ООО "ОНЛАЙН КАРДС"', inn: '6732075238' },
                            { name: 'ИП Васильев Андрей Игоревич', inn: '471608366736' },
                            { name: 'ООО "СЕРВИСЗАП"', inn: '7730244490' },
                            { name: 'ООО "СКЛАДЛАЙН"', inn: '7816699770' },
                            { name: 'ООО "Торговый Дом Ювентус"', inn: '7802240306' }
                        ].map((partner, i) => (
                            <div key={i} className="flex flex-col p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all">
                                <span className="font-bold text-gray-900">{partner.name}</span>
                                <span className="text-sm text-gray-500 mt-1">ИНН: {partner.inn}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-12 mb-8 flex justify-center">
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-purple-500/30 text-lg flex items-center gap-2"
                    >
                        Стать партнером
                    </button>
                </div>

                <div className="mt-8 text-center text-gray-500">
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
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Заявка на сотрудничество</h3>
                                <p className="text-gray-500">Оставьте свои контакты, и мы обсудим условия работы.</p>
                            </div>

                            {isSubmitted ? (
                                <motion.div 
                                    initial={{ opacity: 0 }} 
                                    animate={{ opacity: 1 }} 
                                    className="py-12 flex flex-col items-center text-center"
                                >
                                    <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-4">
                                        <Briefcase className="w-8 h-8" />
                                    </div>
                                    <h4 className="text-xl font-bold text-gray-900 mb-2">Заявка отправлена!</h4>
                                    <p className="text-gray-500">Мы получили ваши данные и скоро свяжемся с вами.</p>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Компания / ИНН *</label>
                                        <input required type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all" placeholder="Например: ООО &quot;Вектор&quot; (ИНН 12345678)" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Ваше имя *</label>
                                            <input required type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all" placeholder="Иван И." />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Телефон *</label>
                                            <input required type="tel" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all" placeholder="+7 (___) ___-__-__" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Формат сотрудничества</label>
                                        <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all bg-white">
                                            <option>Я поставщик (предлагаю товар)</option>
                                            <option>Я оптовый покупатель</option>
                                            <option>Инвестиции / Франшиза</option>
                                            <option>Оптовые закупки с отсрочкой</option>
                                            <option>Другое</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Краткое предложение</label>
                                        <textarea rows={3} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all resize-none" placeholder="Укажите суть предложения..."></textarea>
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
