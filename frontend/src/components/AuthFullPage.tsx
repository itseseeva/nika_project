import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Mail, KeyRound, Loader2, ShieldCheck, Truck, Award,
    ArrowRight, X, Star, Package, Users
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

const API_URL = (import.meta as any).env.VITE_API_URL || '/api';

const FEATURES = [
    {
        icon: ShieldCheck,
        title: 'Гарантия качества',
        desc: 'Только сертифицированная продукция от проверенных производителей',
        color: 'from-blue-500 to-blue-600',
    },
    {
        icon: Truck,
        title: 'Быстрая отгрузка',
        desc: 'Готовый товар отгружаем в день заказа со склада в Санкт-Петербурге',
        color: 'from-indigo-500 to-indigo-600',
    },
    {
        icon: Package,
        title: 'Прямые поставки',
        desc: 'Работаем напрямую с производителями — без посредников и наценок',
        color: 'from-violet-500 to-violet-600',
    },
    {
        icon: Users,
        title: 'Персональный менеджер',
        desc: 'Индивидуальный подход и поддержка на каждом этапе сотрудничества',
        color: 'from-sky-500 to-sky-600',
    },
];

const STATS = [
    { value: '500+', label: 'клиентов' },
    { value: '3 000+', label: 'позиций в каталоге' },
    { value: '1 день', label: 'срок отгрузки' },
    { value: '22%', label: 'НДС включён' },
];

export function AuthFullPage() {
    const { isAuthPageOpen, setAuthPageOpen, setToken, setUser } = useAuthStore();
    const [step, setStep] = useState<'email' | 'code'>('email');
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isAuthPageOpen) return null;

    const handleClose = () => {
        setAuthPageOpen(false);
        setStep('email');
        setEmail('');
        setCode('');
        setError(null);
    };

    const handleSendCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/auth/send-code`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.detail || 'Не удалось отправить код');
            setStep('code');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/auth/verify-code`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.detail || 'Неверный код');

            setToken(data.access_token);
            const userRes = await fetch(`${API_URL}/auth/me`, {
                headers: { Authorization: `Bearer ${data.access_token}` },
            });
            if (userRes.ok) setUser(await userRes.json());

            handleClose();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const res = await fetch(`${API_URL}/auth/google/url`);
            const data = await res.json();
            if (data.url) window.location.href = data.url;
        } catch {
            setError('Не удалось получить ссылку для Google авторизации');
        }
    };

    return (
        <AnimatePresence>
            {isAuthPageOpen && (
                <motion.div
                    key="auth-fullpage"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 z-[200] flex overflow-hidden"
                >
                    {/* ─── LEFT PANEL — компания ─── */}
                    <motion.div
                        initial={{ x: -60, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.1, duration: 0.45, ease: 'easeOut' }}
                        className="hidden lg:flex lg:w-[55%] relative flex-col justify-between overflow-hidden"
                        style={{
                            background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #1e40af 100%)',
                        }}
                    >
                        {/* Декоративные пятна */}
                        <div className="absolute top-[-120px] left-[-120px] w-[480px] h-[480px] rounded-full opacity-20"
                            style={{ background: 'radial-gradient(circle, #60a5fa, transparent 70%)' }} />
                        <div className="absolute bottom-[-80px] right-[-80px] w-[360px] h-[360px] rounded-full opacity-15"
                            style={{ background: 'radial-gradient(circle, #818cf8, transparent 70%)' }} />

                        {/* Сетка-паттерн */}
                        <div className="absolute inset-0 opacity-[0.04]"
                            style={{
                                backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
                                backgroundSize: '40px 40px',
                            }} />

                        <div className="relative z-10 p-10 flex flex-col h-full">
                            {/* Лого + заголовок */}
                            <div className="mb-12">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                                        <Award className="w-5 h-5 text-white" />
                                    </div>
                                    <span className="text-white font-bold text-lg tracking-wide">ООО «НИКА»</span>
                                </div>

                                <motion.h1
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.25 }}
                                    className="text-4xl xl:text-5xl font-extrabold text-white leading-tight mb-4"
                                >
                                    Надёжный партнёр<br />
                                    <span className="text-blue-300">для вашего бизнеса</span>
                                </motion.h1>

                                <motion.p
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.35 }}
                                    className="text-blue-200 text-lg leading-relaxed max-w-md"
                                >
                                    Поставляем спецодежду, СИЗ и упаковочные материалы предприятиям
                                    России напрямую от производителей.
                                </motion.p>
                            </div>

                            {/* Статистика */}
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="grid grid-cols-2 gap-4 mb-10"
                            >
                                {STATS.map((s) => (
                                    <div key={s.label}
                                        className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-4">
                                        <div className="text-2xl font-extrabold text-white mb-0.5">{s.value}</div>
                                        <div className="text-blue-300 text-sm">{s.label}</div>
                                    </div>
                                ))}
                            </motion.div>

                            {/* Преимущества */}
                            <div className="space-y-4 flex-1">
                                {FEATURES.map((f, i) => (
                                    <motion.div
                                        key={f.title}
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.45 + i * 0.08 }}
                                        className="flex items-start gap-4"
                                    >
                                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                                            <f.icon className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <div className="text-white font-semibold text-sm">{f.title}</div>
                                            <div className="text-blue-300 text-xs leading-relaxed mt-0.5">{f.desc}</div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Подпись */}
                            <div className="mt-10 flex items-center gap-2 text-blue-400 text-xs">
                                <Star className="w-4 h-4 fill-blue-400 text-blue-400" />
                                <span>Санкт-Петербург · ул. Савушкина, 89 · Пн–Пт 09:00–18:00</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* ─── RIGHT PANEL — форма ─── */}
                    <motion.div
                        initial={{ x: 60, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.1, duration: 0.45, ease: 'easeOut' }}
                        className="flex-1 bg-white flex flex-col"
                    >
                        {/* Закрыть */}
                        <div className="flex justify-end p-5">
                            <button
                                onClick={handleClose}
                                className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex-1 flex flex-col justify-center px-5 sm:px-12 lg:px-16 pb-12 max-w-lg w-full mx-auto">

                            {/* Мобильный заголовок */}
                            <div className="lg:hidden mb-8 text-center">
                                <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-sm font-semibold px-4 py-2 rounded-full mb-4">
                                    <Award className="w-4 h-4" />
                                    ООО «НИКА»
                                </div>
                                <p className="text-gray-500 text-sm">Надёжный поставщик спецодежды и СИЗ</p>
                            </div>

                            <AnimatePresence mode="wait">
                                {step === 'email' ? (
                                    <motion.div
                                        key="email-step"
                                        initial={{ opacity: 0, y: 16 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -16 }}
                                        transition={{ duration: 0.25 }}
                                    >
                                        <div className="mb-8">
                                            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
                                                Добро пожаловать
                                            </h2>
                                            <p className="text-gray-500 text-sm leading-relaxed">
                                                Войдите или зарегистрируйтесь, чтобы оформить заказ
                                                и получить доступ к персональным ценам.
                                            </p>
                                        </div>

                                        {error && (
                                            <div className="mb-5 p-3.5 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 flex items-start gap-2">
                                                <span className="flex-1">{error}</span>
                                            </div>
                                        )}

                                        <form onSubmit={handleSendCode} className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                    Email адрес
                                                </label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                        <Mail className="h-5 w-5 text-gray-400" />
                                                    </div>
                                                    <input
                                                        type="email"
                                                        required
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 transition-all text-sm"
                                                        placeholder="example@company.ru"
                                                    />
                                                </div>
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={loading || !email}
                                                className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
                                            >
                                                {loading
                                                    ? <Loader2 className="w-5 h-5 animate-spin" />
                                                    : <><span>Получить код</span><ArrowRight className="w-4 h-4" /></>
                                                }
                                            </button>
                                        </form>

                                        <div className="relative my-6">
                                            <div className="absolute inset-0 flex items-center">
                                                <div className="w-full border-t border-gray-150" />
                                            </div>
                                            <div className="relative flex justify-center text-xs">
                                                <span className="px-3 bg-white text-gray-400 font-medium">или войдите через</span>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={handleGoogleLogin}
                                            className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-200 rounded-xl bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all"
                                        >
                                            <img
                                                src="https://www.svgrepo.com/show/475656/google-color.svg"
                                                alt="Google"
                                                className="h-5 w-5"
                                            />
                                            Войти через Google
                                        </button>

                                        <p className="mt-6 text-xs text-gray-400 text-center leading-relaxed">
                                            Продолжая, вы принимаете условия обработки персональных данных
                                            в соответствии с законодательством РФ.
                                        </p>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="code-step"
                                        initial={{ opacity: 0, y: 16 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -16 }}
                                        transition={{ duration: 0.25 }}
                                    >
                                        <div className="mb-8">
                                            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
                                                Проверка кода
                                            </h2>
                                            <p className="text-gray-500 text-sm leading-relaxed">
                                                Мы отправили 6-значный код на{' '}
                                                <span className="font-semibold text-gray-800">{email}</span>
                                            </p>
                                        </div>

                                        {error && (
                                            <div className="mb-5 p-3.5 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">
                                                {error}
                                            </div>
                                        )}

                                        <form onSubmit={handleVerifyCode} className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                                    Код из письма
                                                </label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                        <KeyRound className="h-5 w-5 text-gray-400" />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        required
                                                        maxLength={6}
                                                        value={code}
                                                        onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                                                        className="block w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-center text-xl tracking-[0.6em] font-mono transition-all"
                                                        placeholder="······"
                                                    />
                                                </div>
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={loading || code.length !== 6}
                                                className="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg shadow-blue-500/25"
                                            >
                                                {loading
                                                    ? <Loader2 className="w-5 h-5 animate-spin" />
                                                    : <><span>Войти в аккаунт</span><ArrowRight className="w-4 h-4" /></>
                                                }
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => { setStep('email'); setError(null); }}
                                                className="w-full text-sm text-gray-500 hover:text-blue-600 transition-colors mt-1 py-2"
                                            >
                                                ← Изменить email
                                            </button>
                                        </form>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
