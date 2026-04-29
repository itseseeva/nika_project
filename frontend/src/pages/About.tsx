import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Building2, FileText } from 'lucide-react';

export function About() {
    const currentLang: string = 'ru';
    return (
        <div className="bg-transparent min-h-screen pt-20 sm:pt-24 pb-10 sm:pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-4 sm:mb-6"
                    >
                        {currentLang === 'en' ? 'About Promsell' : 'О компании Промселл'}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-base sm:text-lg text-gray-500 leading-relaxed"
                    >
                        {currentLang === 'en' 
                            ? 'Promsell LLC is a reliable supplier of workwear, personal protective equipment and packaging materials for business.' 
                            : 'ООО «Промселл» — надёжный поставщик спецодежды, средств индивидуальной защиты и упаковочных материалов для бизнеса.'}
                        {currentLang === 'en' ? 'We work directly with manufacturers and provide enterprises with high-quality products with fast shipping.' : 'Мы работаем напрямую с производителями и обеспечиваем предприятия качественной продукцией с быстрой отгрузкой.'}
                    </motion.p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        <h2 className="text-2xl font-bold text-gray-900">{currentLang === 'en' ? 'Our Contacts' : 'Наши контакты'}</h2>

                        <div className="flex bg-gray-50 p-6 rounded-2xl border border-gray-100">
                            <MapPin className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-gray-900">{currentLang === 'en' ? 'Warehouse and Office' : 'Склад и офис'}</h3>
                                <p className="mt-1 text-gray-500 text-sm sm:text-base">{currentLang === 'en' ? '89 Savushkina St, Litera A, Saint Petersburg, 197374' : '197374, г. Санкт-Петербург, ул. Савушкина, д. 89 литер А'}<br /><span className="text-xs sm:text-sm text-gray-400">({currentLang === 'en' ? 'pickup from warehouse' : 'самовывоз со склада'})</span></p>
                            </div>
                        </div>

                        <div className="flex bg-gray-50 p-6 rounded-2xl border border-gray-100">
                            <Building2 className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-gray-900">Юридический адрес</h3>
                                <p className="mt-1 text-gray-500 text-sm sm:text-base">198259, г. Санкт-Петербург,<br />ул. Тамбасова, д. 21 к. 2 литера А, кв. 300</p>
                            </div>
                        </div>

                        <div className="flex bg-gray-50 p-6 rounded-2xl border border-gray-100">
                            <Phone className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-gray-900">Телефон отдела продаж</h3>
                                <a href="tel:+79650087946" className="mt-1 text-blue-600 font-bold text-xl hover:text-blue-700 transition-colors">
                                    8 (965) 008-79-46
                                </a>
                            </div>
                        </div>

                        <div className="flex bg-gray-50 p-6 rounded-2xl border border-gray-100">
                            <Mail className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-gray-900">Электронная почта</h3>
                                <a href="mailto:ab9650087946@yandex.ru" className="mt-1 text-blue-600 hover:text-blue-700 transition-colors font-medium">
                                    ab9650087946@yandex.ru
                                </a>
                            </div>
                        </div>

                        <div className="flex bg-gray-50 p-6 rounded-2xl border border-gray-100">
                            <Clock className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-gray-900">Режим работы склада</h3>
                                <p className="mt-1 text-gray-500 text-sm sm:text-base">Пн–Пт: 09:00 – 18:00<br />Сб–Вс: выходной</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col gap-6"
                    >
                        {/* Реквизиты */}
                        <div className="bg-blue-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-blue-500/20">
                            <h3 className="text-xl font-bold mb-5 flex items-center gap-2">
                                <FileText className="w-5 h-5" />
                                {currentLang === 'en' ? 'Legal Details' : 'Юридические реквизиты'}
                            </h3>
                            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm">
                                <div>
                                    <dt className="opacity-70 uppercase tracking-wider text-xs mb-1">Полное наименование</dt>
                                    <dd className="font-semibold">{currentLang === 'en' ? 'Promsell LLC' : 'ООО «Промселл»'}</dd>
                                </div>
                                <div>
                                    <dt className="opacity-70 uppercase tracking-wider text-xs mb-1">Генеральный директор</dt>
                                    <dd className="font-semibold">Алексей Бочаров</dd>
                                </div>
                                <div>
                                    <dt className="opacity-70 uppercase tracking-wider text-xs mb-1">ИНН / КПП</dt>
                                    <dd className="font-semibold">7807269041 / 780701001</dd>
                                </div>
                                <div>
                                    <dt className="opacity-70 uppercase tracking-wider text-xs mb-1">ОГРН</dt>
                                    <dd className="font-semibold">1237800128390</dd>
                                </div>
                                <div>
                                    <dt className="opacity-70 uppercase tracking-wider text-xs mb-1">Дата регистрации</dt>
                                    <dd className="font-semibold">09.11.2023</dd>
                                </div>

                            </dl>
                        </div>

                        {/* Условия поставки */}
                        <div className="bg-gray-50 rounded-3xl p-6 sm:p-8 border border-gray-100">
                            <h3 className="text-xl font-bold text-gray-900 mb-5">{currentLang === 'en' ? 'Working Terms' : 'Условия работы'}</h3>
                            <ul className="space-y-3 text-gray-600 text-sm">
                                <li className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></div>
                                    <span>Оплата — в течение <strong>5 календарных дней</strong> после приёмки товара</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></div>
                                    <span>Поставка — <strong>самовывоз</strong> со склада в Санкт-Петербурге (ул. Савушкина, 89)</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></div>
                                    <span>Срок поставки — не более <strong>30 дней</strong> с момента согласования спецификации</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></div>
                                    <span>Все цены указаны <strong>с НДС 22%</strong></span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></div>
                                    <span>Расчёты — <strong>безналичный перевод</strong> на расчётный счёт</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></div>
                                    <span>Документы: <strong>товарная накладная ТОРГ-12</strong> или УПД в 2-х экземплярах</span>
                                </li>
                            </ul>
                        </div>
                    </motion.div>
                </div>

                {/* Яндекс Карта */}
                <div className="mt-16">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <MapPin className="w-6 h-6 text-blue-600" />
                        {currentLang === 'en' ? 'We are on the map' : 'Мы на карте'}
                    </h2>
                    <div className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border border-gray-100 h-[320px] sm:h-[480px]">
                        <iframe
                            src="https://yandex.ru/map-widget/v1/?text=%D0%A1%D0%B0%D0%BD%D0%BA%D1%82-%D0%9F%D0%B5%D1%82%D0%B5%D1%80%D0%B1%D1%83%D1%80%D0%B3%2C+%D1%83%D0%BB.+%D0%A1%D0%B0%D0%B2%D1%83%D1%88%D0%BA%D0%B8%D0%BD%D0%B0%2C+89&z=16&l=map&pt=30.24206,59.99621,pm2rdm"
                            width="100%"
                            height="100%"
                            frameBorder="0"
                            allowFullScreen
                            title={currentLang === 'en' ? 'Warehouse map of Promsell LLC' : 'Карта склада ООО Промселл'}
                            style={{ border: 0 }}
                        />
                    </div>
                    <p className="mt-3 text-sm text-gray-400 text-center">
                        197374, Санкт-Петербург, ул. Савушкина, д. 89 литер А — самовывоз со склада
                    </p>
                </div>

            </div>
        </div>
    );
}
