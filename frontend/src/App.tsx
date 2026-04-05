import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Catalog } from './pages/Catalog';
import { ProductPage } from './pages/ProductPage';
import { About } from './pages/About';
import { TermsPage } from './pages/TermsPage';
import { LoginPage } from './pages/LoginPage';
import { FloatingManager } from './components/FloatingManager';
import { InteractiveBackground } from './components/InteractiveBackground';
import { AuthModal } from './components/AuthModal';
import { AuthFullPage } from './components/AuthFullPage';
import { useAuthStore } from './store/useAuthStore';
import { useEffect } from 'react';

const API_URL = (import.meta as any).env.VITE_API_URL || '/api';

function App() {
    const { token, setToken, setUser, logout } = useAuthStore();
    const location = useLocation();
    const isLoginPage = location.pathname === '/login';

    useEffect(() => {
        // 1. Сначала читаем токен из URL (если пришли из Google OAuth)
        const urlParams = new URLSearchParams(window.location.search);
        const urlToken = urlParams.get('token');
        const activeToken = urlToken || token;

        if (urlToken) {
            setToken(urlToken);
            // Убираем токен из URL для чистоты
            window.history.replaceState({}, document.title, window.location.pathname);
        }

        // 2. Если токен есть — загружаем пользователя
        if (!activeToken) return;

        const fetchUser = async () => {
            try {
                const response = await fetch(`${API_URL}/auth/me`, {
                    headers: { 'Authorization': `Bearer ${activeToken}` }
                });
                if (response.ok) {
                    const userData = await response.json();
                    setUser(userData);
                } else if (response.status === 401) {
                    logout();
                }
            } catch (error) {
                console.error('Failed to fetch user:', error);
            }
        };
        fetchUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="min-h-screen font-sans text-gray-900 selection:bg-blue-300 selection:text-blue-900 relative overflow-hidden">
            {!isLoginPage && <InteractiveBackground />}
            {!isLoginPage && <Navbar />}
            <main className="flex-1 w-full">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/catalog" element={<Catalog />} />
                    <Route path="/product/:slug" element={<ProductPage />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/terms" element={<TermsPage />} />
                    <Route path="/login" element={<LoginPage />} />
                </Routes>
            </main>

            {/* Modern Footer directly in App.tsx */}
            {!isLoginPage && <footer className="bg-white/10 backdrop-blur-xl border-t border-white/20 text-gray-800 py-10 sm:py-16 mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 sm:gap-12">
                    <div className="md:col-span-2">
                        <Link to="/" className="flex items-center gap-2 mb-6 inline-block">
                            <img
                                src="/photo_2026-02-28_20-15-26.jpg"
                                alt="НИКА Логотип"
                                className="h-12 w-auto object-contain hover:scale-105 transition-transform duration-300 transform origin-left"
                            />
                        </Link>
                        <p className="text-sm text-gray-600 max-w-sm leading-relaxed">
                            Надежный партнер в сфере B2B-поставок. Мы обеспечиваем предприятия качественной спецодеждой, проверенными автозапчастями и прочными упаковочными материалами.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-gray-900 font-bold text-lg mb-6">Навигация</h4>
                        <ul className="space-y-4 text-sm font-medium">
                            <li><Link to="/" className="hover:text-blue-400 transition-colors flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> Главная</Link></li>
                            <li><Link to="/catalog" className="hover:text-blue-400 transition-colors flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> Каталог товаров</Link></li>
                            <li><Link to="/about" className="hover:text-blue-400 transition-colors flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div> О компании</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-gray-900 font-bold text-lg mb-6">Контакты</h4>
                        <ul className="space-y-4 text-sm">
                            <li className="flex flex-col">
                                <span className="text-gray-500 text-xs uppercase font-bold tracking-wider mb-1">Телефон</span>
                                <a href="tel:+79650087946" className="hover:text-blue-600 font-medium text-lg text-gray-900 transition-colors">8 (965) 008-79-46</a>
                            </li>
                            <li className="flex flex-col">
                                <span className="text-gray-500 text-xs uppercase font-bold tracking-wider mb-1">Email</span>
                                <a href="mailto:ab9650087946@yandex.ru" className="text-gray-900 hover:text-blue-600 font-medium transition-colors">ab9650087946@yandex.ru</a>
                            </li>
                            <li className="flex flex-col">
                                <span className="text-gray-500 text-xs uppercase font-bold tracking-wider mb-1">Склад (отгрузка)</span>
                                <span className="text-gray-700">г. Санкт-Петербург, ул. Савушкина, д. 89 лит А</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-white/20 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
                    <p>&copy; {new Date().getFullYear()} Компания "НИКА". Все права защищены.</p>
                    <div className="mt-4 md:mt-0 flex space-x-6">
                        <a href="#" className="hover:text-gray-900 transition-colors">Политика конфиденциальности</a>
                        <a href="/terms" className="hover:text-gray-900 transition-colors">Условия работы</a>
                    </div>
                </div>
            </footer>}
            {!isLoginPage && <FloatingManager />}
            {!isLoginPage && <AuthModal />}
            {!isLoginPage && <AuthFullPage />}
        </div>
    );
}

export default App;
