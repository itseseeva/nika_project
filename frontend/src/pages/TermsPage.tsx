import { motion } from 'framer-motion';
import { FileText, Scale, Truck, ShieldCheck, AlertTriangle, CreditCard } from 'lucide-react';

const Section = ({ icon: Icon, title, children }: { icon: any; title: string; children: React.ReactNode }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5 }}
        className="bg-gray-50 rounded-3xl p-8 border border-gray-100"
    >
        <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white flex-shrink-0">
                <Icon className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        </div>
        <div className="text-gray-600 space-y-3 text-sm leading-relaxed">
            {children}
        </div>
    </motion.div>
);

const Li = ({ children }: { children: React.ReactNode }) => (
    <li className="flex items-start gap-2">
        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />
        <span>{children}</span>
    </li>
);

export function TermsPage() {
    return (
        <div className="bg-white min-h-screen pt-24 pb-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="text-center mb-14">
                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4"
                    >
                        Условия поставки и договор
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-gray-500"
                    >
                        Все условия основаны на Договоре поставки № 1202-26 (ред. от 12 февраля 2026 г.),
                        заключённом ООО «НИКА» с клиентами.
                    </motion.p>
                </div>

                <div className="space-y-6">

                    <Section icon={FileText} title="1. Предмет договора">
                        <ul className="space-y-2">
                            <Li>Поставщик (ООО «НИКА») поставляет, а Покупатель принимает и оплачивает Товар (спецодежду, СИЗ, упаковочные материалы).</Li>
                            <Li>Ассортимент, количество, цена и сроки устанавливаются в подписанной Спецификации к договору.</Li>
                            <Li>Поставляемый товар новый, ранее не эксплуатировавшийся, не заложенный и не арестованный.</Li>
                        </ul>
                    </Section>

                    <Section icon={CreditCard} title="2. Порядок оплаты">
                        <ul className="space-y-2">
                            <Li>Покупатель оплачивает товар в течение <strong>5 календарных дней</strong> после приёмки.</Li>
                            <Li>Все цены указаны в рублях и <strong>включают НДС 20%</strong>. Цена фиксируется и изменению не подлежит.</Li>
                            <Li>Расчёты — только <strong>безналичный перевод</strong> на расчётный счёт Поставщика.</Li>
                            <Li>Положения ст. 317.1 и ст. 823 ГК РФ к договору не применяются.</Li>
                        </ul>
                    </Section>

                    <Section icon={Truck} title="3. Порядок поставки">
                        <ul className="space-y-2">
                            <Li>Поставка осуществляется на условиях <strong>самовывоза</strong> со склада Поставщика: <strong>197374, г. Санкт-Петербург, ул. Савушкина, д. 89, литер А</strong>.</Li>
                            <Li>Максимальный срок поставки — <strong>30 календарных дней</strong> с момента согласования Спецификации.</Li>
                            <Li>Право собственности переходит к Покупателю в момент передачи товара и подписания отгрузочных документов.</Li>
                            <Li>Товар должен быть маркирован согласно установленным стандартам РФ.</Li>
                        </ul>
                    </Section>

                    <Section icon={FileText} title="Отгрузочные документы">
                        <p>При отгрузке Поставщик передаёт:</p>
                        <ul className="space-y-2 mt-2">
                            <Li><strong>Товарная накладная ТОРГ-12</strong> — оригиналы в 2 (двух) экземплярах, один из которых после подписания возвращается Поставщику.</Li>
                            <Li>Либо <strong>УПД</strong> (универсальный передаточный документ) в 2-х экземплярах.</Li>
                            <Li>Все документы — на русском языке.</Li>
                        </ul>
                    </Section>

                    <Section icon={ShieldCheck} title="4. Качество и гарантия">
                        <ul className="space-y-2">
                            <Li>Гарантия действует на весь гарантийный срок изготовителя, исчисляемый с даты подписания отгрузочных документов.</Li>
                            <Li>При поставке товара ненадлежащего качества Поставщик обязуется его заменить. Претензии принимаются в период гарантийного срока.</Li>
                            <Li>Акт выбраковки составляется в течение <strong>10 дней</strong> с обнаружения дефекта.</Li>
                            <Li>При существенных нарушениях качества Покупатель вправе отказаться от договора и потребовать возврата оплаты.</Li>
                            <Li>Замена бракованного товара производится в течение <strong>30 дней</strong> с получения письменного уведомления.</Li>
                        </ul>
                    </Section>

                    <Section icon={AlertTriangle} title="5. Ответственность сторон">
                        <ul className="space-y-2">
                            <Li>За просрочку оплаты — пеня <strong>0,1% от суммы долга за каждый день</strong>, но не более 10% от стоимости неоплаченного товара.</Li>
                            <Li>За нарушение сроков поставки — пеня <strong>0,1% от стоимости непоставленного товара за каждый день</strong>, но не более 10%.</Li>
                            <Li>Уплата неустойки не освобождает Стороны от исполнения обязательств.</Li>
                            <Li>Стороны освобождаются от ответственности при наступлении обстоятельств непреодолимой силы (форс-мажор) с уведомлением другой стороны в течение 7 дней.</Li>
                        </ul>
                    </Section>

                    <Section icon={Scale} title="6. Разрешение споров">
                        <ul className="space-y-2">
                            <Li>Все споры разрешаются первоначально путём переговоров. Претензионный порядок обязателен.</Li>
                            <Li>Срок ответа на претензию — <strong>10 рабочих дней</strong>.</Li>
                            <Li>При недостижении соглашения — рассмотрение в <strong>Арбитражном суде Санкт-Петербурга и Ленинградской области</strong>.</Li>
                        </ul>
                    </Section>

                    <Section icon={FileText} title="7. Заключительные положения">
                        <ul className="space-y-2">
                            <Li>Договор действует до <strong>31 декабря 2026 г.</strong> и автоматически пролонгируется на следующий год, если ни одна из Сторон не заявит об ином.</Li>
                            <Li>Договор, заключённый по электронной или факсимильной связи, имеет юридическую силу.</Li>
                            <Li>Оригиналы документов должны быть переданы в течение <strong>10 рабочих дней</strong> с момента обмена копиями.</Li>
                            <Li>Все условия договора конфиденциальны и не подлежат разглашению.</Li>
                        </ul>
                    </Section>

                    {/* Реквизиты поставщика */}
                    <div className="bg-blue-600 rounded-3xl p-8 text-white">
                        <h2 className="text-xl font-bold mb-5">Реквизиты ООО «НИКА» (Поставщик)</h2>
                        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                            <div>
                                <dt className="opacity-70 text-xs uppercase tracking-wider mb-1">ИНН / КПП</dt>
                                <dd className="font-semibold font-mono">7807269041 / 780701001</dd>
                            </div>
                            <div>
                                <dt className="opacity-70 text-xs uppercase tracking-wider mb-1">ОГРН</dt>
                                <dd className="font-semibold font-mono">1237800128390</dd>
                            </div>
                            <div>
                                <dt className="opacity-70 text-xs uppercase tracking-wider mb-1">Р/С</dt>
                                <dd className="font-semibold font-mono">40702810669630004553</dd>
                            </div>
                            <div>
                                <dt className="opacity-70 text-xs uppercase tracking-wider mb-1">БИК</dt>
                                <dd className="font-semibold font-mono">046577795</dd>
                            </div>
                            <div>
                                <dt className="opacity-70 text-xs uppercase tracking-wider mb-1">К/С</dt>
                                <dd className="font-semibold font-mono">30101810900000000795</dd>
                            </div>
                            <div>
                                <dt className="opacity-70 text-xs uppercase tracking-wider mb-1">Банк</dt>
                                <dd className="font-semibold">ПАО КБ «УБРИР», г. Екатеринбург</dd>
                            </div>
                            <div className="sm:col-span-2">
                                <dt className="opacity-70 text-xs uppercase tracking-wider mb-1">Юридический адрес</dt>
                                <dd className="font-semibold">198259, г. Санкт-Петербург, ул. Тамбасова, д. 21 к. 2 литера А, кв. 300</dd>
                            </div>
                            <div className="sm:col-span-2">
                                <dt className="opacity-70 text-xs uppercase tracking-wider mb-1">Фактический адрес (склад)</dt>
                                <dd className="font-semibold">197374, г. Санкт-Петербург, ул. Савушкина, д. 89 литер А</dd>
                            </div>
                            <div>
                                <dt className="opacity-70 text-xs uppercase tracking-wider mb-1">Телефон</dt>
                                <dd className="font-semibold">8 (965) 008-79-46</dd>
                            </div>
                            <div>
                                <dt className="opacity-70 text-xs uppercase tracking-wider mb-1">E-mail</dt>
                                <dd className="font-semibold">ab9650087946@yandex.ru</dd>
                            </div>
                        </dl>
                    </div>

                </div>
            </div>
        </div>
    );
}
