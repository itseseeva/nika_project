import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Mail, KeyRound, Loader2, Eye, EyeOff, CheckCircle2,
    ShieldCheck, Truck, Package, Users, ArrowRight
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useCartStore } from '../store/useCartStore';
import { api } from '../utils/api';

async function getGoogleAuthUrl(): Promise<string> {
    const res = await fetch('/api/auth/google/url');
    if (!res.ok) throw new Error('Ошибка');
    const data = await res.json();
    return data.url;
}

const FEATURES = [
    { icon: ShieldCheck, title: 'Гарантия качества', desc: 'Сертифицированная продукция от проверенных производителей', color: 'bg-blue-500' },
    { icon: Truck, title: 'Быстрая отгрузка', desc: 'Со склада в Санкт-Петербурге в день заказа', color: 'bg-indigo-500' },
    { icon: Package, title: 'Прямые поставки', desc: 'Работаем без посредников и лишних наценок', color: 'bg-violet-500' },
    { icon: Users, title: 'Персональный менеджер', desc: 'Индивидуальный подход к каждому партнёру', color: 'bg-sky-500' },
];

const STATS = [
    { value: '500+', label: 'клиентов' },
    { value: '3 000+', label: 'позиций' },
    { value: '1 день', label: 'отгрузка' },
    { value: 'с 2010', label: 'на рынке' },
];

// ── Google Button Component
function GoogleButton({ loading, onClick }: { loading: boolean; onClick: () => void }) {
    return (
        <button onClick={onClick} disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3 border-2 border-gray-200 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-50 shadow-sm"
        >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
            )}
            Войти через Google
        </button>
    );
}

// ── Divider
function Divider() {
    return (
        <div className="relative my-5">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
            <div className="relative flex justify-center"><span className="bg-white px-3 text-xs text-gray-400 font-medium">или</span></div>
        </div>
    );
}

// ── Login Form
function LoginForm({ onDone, onSwitchTab, googleLoading, onGoogle }: {
    onDone: (t: string) => void;
    onSwitchTab: () => void;
    googleLoading: boolean;
    onGoogle: () => void;
}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null); setLoading(true);
        try {
            const data = await api.loginWithPassword(email, password);
            onDone(data.access_token);
        } catch (err: any) { setError(err.message); }
        finally { setLoading(false); }
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                            placeholder="your@company.ru"
                            className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 bg-gray-50 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Пароль</label>
                    <div className="relative">
                        <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type={showPw ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)}
                            placeholder="Ваш пароль"
                            className="w-full pl-11 pr-11 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 bg-gray-50 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" />
                        <button type="button" onClick={() => setShowPw(v => !v)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                            {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                {error && <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl">{error}</div>}

                <button type="submit" disabled={loading || !email || !password}
                    className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/30 disabled:opacity-50 text-sm flex items-center justify-center gap-2">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><span>Войти</span><ArrowRight className="w-4 h-4" /></>}
                </button>
            </form>

            <Divider />
            <GoogleButton loading={googleLoading} onClick={onGoogle} />

            <p className="text-center text-sm text-gray-500 mt-6">
                Нет аккаунта?{' '}
                <button onClick={onSwitchTab} className="text-blue-600 font-semibold hover:underline">Зарегистрироваться</button>
            </p>
        </div>
    );
}

// ── Register Form (3 steps)
function RegisterForm({ onDone, onSwitchTab, googleLoading, onGoogle }: {
    onDone: (t: string) => void;
    onSwitchTab: () => void;
    googleLoading: boolean;
    onGoogle: () => void;
}) {
    const [step, setStep] = useState<'email' | 'code' | 'password'>('email');
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [password, setPassword] = useState('');
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const STEPS = ['Email', 'Код', 'Пароль'];
    const stepIdx = step === 'email' ? 0 : step === 'code' ? 1 : 2;

    const sendCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null); setLoading(true);
        try { await api.sendCode(email); setStep('code'); }
        catch (err: any) { setError(err.message); }
        finally { setLoading(false); }
    };

    const verifyCode = (e: React.FormEvent) => {
        e.preventDefault();
        if (code.trim().length >= 4) setStep('password');
    };

    const setPasswordFn = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password.length < 6) { setError('Минимум 6 символов'); return; }
        setError(null); setLoading(true);
        try {
            const data = await api.setPassword(email, code.trim(), password);
            onDone(data.access_token);
        } catch (err: any) { setError(err.message); }
        finally { setLoading(false); }
    };

    return (
        <div>
            {/* Step indicator */}
            <div className="flex items-center gap-1.5 mb-6">
                {STEPS.map((s, i) => (
                    <React.Fragment key={s}>
                        <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold shrink-0 transition-all duration-300 ${i < stepIdx ? 'bg-blue-600 text-white' : i === stepIdx ? 'bg-blue-600 text-white ring-4 ring-blue-100' : 'bg-gray-100 text-gray-400'}`}>
                            {i < stepIdx ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                        </div>
                        <span className={`text-xs font-medium ${i === stepIdx ? 'text-blue-600' : 'text-gray-400'}`}>{s}</span>
                        {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 rounded transition-all duration-500 ${i < stepIdx ? 'bg-blue-600' : 'bg-gray-200'}`} />}
                    </React.Fragment>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {/* Step 1: Email */}
                {step === 'email' && (
                    <motion.form key="email" onSubmit={sendCode}
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                        className="space-y-4"
                    >
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Ваш Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                                    placeholder="your@company.ru"
                                    className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" />
                            </div>
                        </div>
                        {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl">{error}</div>}
                        <button type="submit" disabled={loading || !email}
                            className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/30 disabled:opacity-50 text-sm flex items-center justify-center gap-2">
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Получить код →'}
                        </button>
                    </motion.form>
                )}

                {/* Step 2: Code */}
                {step === 'code' && (
                    <motion.form key="code" onSubmit={verifyCode}
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                        className="space-y-4"
                    >
                        <p className="text-sm text-gray-600 bg-blue-50 px-4 py-3 rounded-xl border border-blue-100">
                            📧 Код отправлен на <strong>{email}</strong>
                        </p>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Код из письма</label>
                            <input type="text" required maxLength={8} value={code} onChange={e => setCode(e.target.value)}
                                placeholder="• • • • • •" autoFocus
                                className="w-full py-4 border border-gray-200 rounded-xl text-center tracking-[0.7em] text-2xl font-bold text-gray-900 placeholder-gray-300 bg-gray-50 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" />
                        </div>
                        <button type="submit" disabled={code.length < 4}
                            className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/30 disabled:opacity-50 text-sm">
                            Подтвердить
                        </button>
                        <button type="button" onClick={() => setStep('email')} className="w-full text-sm text-gray-400 hover:text-gray-600 transition-colors">
                            ← Изменить email
                        </button>
                    </motion.form>
                )}

                {/* Step 3: Password */}
                {step === 'password' && (
                    <motion.form key="password" onSubmit={setPasswordFn}
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                        className="space-y-4"
                    >
                        <p className="text-sm text-green-700 bg-green-50 px-4 py-3 rounded-xl border border-green-100">
                            ✅ Email подтверждён! Придумайте пароль.
                        </p>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Пароль</label>
                            <div className="relative">
                                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input type={showPw ? 'text' : 'password'} required value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="Минимум 6 символов" autoFocus
                                    className="w-full pl-11 pr-11 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" />
                                <button type="button" onClick={() => setShowPw(v => !v)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {/* Password strength */}
                            <div className="mt-2 flex gap-1">
                                {[2, 4, 6, 8].map(min => (
                                    <div key={min} className={`flex-1 h-1 rounded-full transition-all ${password.length >= min ? 'bg-blue-500' : 'bg-gray-200'}`} />
                                ))}
                            </div>
                        </div>
                        {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl">{error}</div>}
                        <button type="submit" disabled={loading || !password}
                            className="w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 transition-all shadow-lg shadow-green-500/30 disabled:opacity-50 text-sm flex items-center justify-center gap-2">
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><span>Создать аккаунт и войти</span><ArrowRight className="w-4 h-4" /></>}
                        </button>
                    </motion.form>
                )}
            </AnimatePresence>

            {step === 'email' && (
                <>
                    <Divider />
                    <GoogleButton loading={googleLoading} onClick={onGoogle} />
                </>
            )}

            <p className="text-center text-sm text-gray-500 mt-6">
                Уже есть аккаунт?{' '}
                <button onClick={onSwitchTab} className="text-blue-600 font-semibold hover:underline">Войти</button>
            </p>
        </div>
    );
}

// ══════════════════════════════════════════════════
// ГЛАВНАЯ СТРАНИЦА ВХОДА
// ══════════════════════════════════════════════════
export function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { setToken, setUser, user } = useAuthStore();
    const from = (location.state as any)?.from || '/';

    const [tab, setTab] = useState<'login' | 'register'>('login');
    const [googleLoading, setGoogleLoading] = useState(false);

    const { setIsOpen } = useCartStore();

    useEffect(() => {
        if (user) {
            if ((location.state as any)?.openCart) {
                setIsOpen(true);
            }
            navigate(from, { replace: true });
        }
    }, [user, navigate, from, setIsOpen, location.state]);

    const handleToken = async (accessToken: string) => {
        setToken(accessToken);
        try {
            const res = await fetch('/api/auth/me', { headers: { Authorization: `Bearer ${accessToken}` } });
            if (res.ok) setUser(await res.json());
        } catch { }
    };

    const handleGoogle = async () => {
        setGoogleLoading(true);
        try {
            const url = await getGoogleAuthUrl();
            window.location.href = url;
        } catch { setGoogleLoading(false); }
    };

    return (
        <div className="min-h-screen flex">

            {/* ══ LEFT — info panel ══ */}
            <div className="hidden lg:flex flex-col w-1/2 relative overflow-hidden"
                style={{ background: 'linear-gradient(145deg, #09122e 0%, #1a3478 55%, #1d4ed8 100%)' }}
            >
                {/* Decorative blobs */}
                <div className="absolute -top-32 -right-32 w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[100px]" />
                <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-indigo-400/20 rounded-full blur-[100px]" />
                <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-cyan-400/10 rounded-full blur-[60px]" />

                <div className="relative z-10 flex flex-col h-full p-12">
                    {/* Logo + Brand */}
                    <div className="flex items-center gap-4 mb-auto">
                        <img src="/logo.jpg" alt="НИКА" className="w-14 h-14 rounded-2xl object-contain border-2 border-white/20 shadow-xl" />
                        <div>
                            <div className="text-white font-extrabold text-xl tracking-tight">ООО «НИКА»</div>
                            <div className="text-blue-300 text-xs">Профессиональные B2B поставки</div>
                        </div>
                    </div>

                    {/* Big headline */}
                    <div className="my-auto">
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                            className="text-4xl xl:text-5xl font-extrabold text-white leading-tight mb-6"
                        >
                            Партнёрский <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300">
                                кабинет НИКА
                            </span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15, duration: 0.8 }}
                            className="text-blue-200 text-lg leading-relaxed max-w-md mb-10"
                        >
                            Спецодежда, автозапчасти и упаковочные материалы.
                            Прямые поставки от производителей без лишних наценок.
                        </motion.p>

                        {/* Features */}
                        <div className="grid grid-cols-1 gap-3">
                            {FEATURES.map((f, i) => (
                                <motion.div key={i}
                                    initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                                    className="flex items-center gap-4 bg-white/8 backdrop-blur border border-white/10 rounded-2xl px-5 py-3.5"
                                >
                                    <div className={`${f.color} w-9 h-9 rounded-xl flex items-center justify-center shrink-0`}>
                                        <f.icon className="w-4.5 h-4.5 text-white w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-white font-semibold text-sm">{f.title}</p>
                                        <p className="text-blue-300 text-xs">{f.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Stats footer */}
                    <div className="grid grid-cols-4 gap-4 mt-auto pt-8 border-t border-white/10">
                        {STATS.map((s, i) => (
                            <div key={i} className="text-center">
                                <div className="text-white font-extrabold text-xl">{s.value}</div>
                                <div className="text-blue-300 text-xs mt-0.5">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ══ RIGHT — form panel ══ */}
            <div className="flex-1 flex flex-col bg-white overflow-y-auto">
                {/* Mobile header */}
                <div className="lg:hidden flex items-center gap-3 px-6 pt-8 pb-4 border-b border-gray-100">
                    <img src="/logo.jpg" alt="НИКА" className="w-10 h-10 rounded-xl object-contain border border-gray-200 shadow" />
                    <div>
                        <div className="font-extrabold text-gray-900 text-base">ООО «НИКА»</div>
                        <div className="text-gray-400 text-xs">Партнёрский кабинет</div>
                    </div>
                </div>

                <div className="flex-1 flex items-center justify-center px-6 sm:px-12 lg:px-16 py-10">
                    <div className="w-full max-w-md">

                        {/* Tabs */}
                        <div className="flex bg-gray-100 p-1 rounded-2xl mb-8 shadow-inner">
                            <button
                                onClick={() => setTab('login')}
                                className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${tab === 'login' ? 'bg-white shadow-md text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                            >Войти</button>
                            <button
                                onClick={() => setTab('register')}
                                className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${tab === 'register' ? 'bg-white shadow-md text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                            >Регистрация</button>
                        </div>

                        <div style={{ minHeight: '480px' }}>
                            <AnimatePresence mode="wait">
                                {tab === 'login' && (
                                    <motion.div key="login"
                                        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
                                        transition={{ duration: 0.2 }}>
                                        <LoginForm
                                            onDone={handleToken}
                                            onSwitchTab={() => setTab('register')}
                                            googleLoading={googleLoading}
                                            onGoogle={handleGoogle}
                                        />
                                    </motion.div>
                                )}
                                {tab === 'register' && (
                                    <motion.div key="register"
                                        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
                                        transition={{ duration: 0.2 }}>
                                        <RegisterForm
                                            onDone={handleToken}
                                            onSwitchTab={() => setTab('login')}
                                            googleLoading={googleLoading}
                                            onGoogle={handleGoogle}
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-8 py-5 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-400">
                    <span>© 2025 ООО «НИКА»</span>
                    <span>г. Санкт-Петербург, ул. Савушкина 89 лит А · 8 (965) 008-79-46</span>
                </div>
            </div>
        </div>
    );
}
