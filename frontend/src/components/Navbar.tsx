import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import { CartModal } from './CartModal';
import { StaggeredMenu } from './StaggeredMenu';
import { User as UserIcon, LogOut } from 'lucide-react';




export function Navbar() {
    const { totalItems, setIsOpen } = useCartStore();
    const { user, logout } = useAuthStore();
    const location = useLocation();
    const [adminCount, setAdminCount] = useState<number>(() => {
        const saved = localStorage.getItem('adminAddedProductsCount');
        return saved ? parseInt(saved, 10) : 0;
    });

    const handleAdminCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseInt(e.target.value) || 0;
        setAdminCount(val);
        localStorage.setItem('adminAddedProductsCount', val.toString());
    };

    const navLinks = [
        { name: 'Главная', path: '/' },
        { name: 'Каталог', path: '/catalog' },
        { name: 'О компании', path: '/about' },
    ];

    return (
        <>
            <header
                className="fixed top-0 w-full z-40 bg-white shadow-sm border-b border-gray-100"
            >
                {/* Staggered hamburger menu */}
                <div className="absolute left-4 sm:left-6 lg:left-8 top-0 h-full flex items-center z-50">
                    <StaggeredMenu
                        isFixed={false}
                        position="left"
                        displayItemNumbering={false}
                        menuButtonColor="#111"
                        openMenuButtonColor="#111"
                        colors={['#3b82f6', '#1d4ed8']}
                        accentColor="#3b82f6"
                        items={[
                            { label: 'Главная', ariaLabel: 'Главная', link: '/' },
                            { label: 'Каталог', ariaLabel: 'Каталог', link: '/catalog' },
                            { label: 'О компании', ariaLabel: 'О компании', link: '/about' },
                        ]}
                        contacts={[
                            { title: 'Телефон', value: '8 (965) 008-79-46', link: 'tel:+79650087946' },
                            { title: 'Email', value: 'ab9650087946@yandex.ru', link: 'mailto:ab9650087946@yandex.ru' },
                            { title: 'Склад', value: 'г. Санкт-Петербург, ул. Савушкина, д. 89' },
                        ]}
                    />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-14 sm:h-20">

                        {/* Logo */}
                        <div className="pl-32 sm:pl-14 lg:pl-0 lg:-ml-6 flex-shrink-0">
                            <Link to="/" className="flex items-center group h-14 sm:h-20">
                                <img
                                    src="/logo.jpg"
                                    alt="НИКА Логотип"
                                    className="h-10 sm:h-16 md:h-20 w-auto object-contain object-left group-hover:scale-[1.02] transition-transform duration-300 origin-left"
                                />
                            </Link>
                        </div>

                        {/* Desktop Nav */}
                        <nav className="hidden md:flex items-center gap-0">
                            {navLinks.map((link) => {
                                const isActive =
                                    location.pathname === link.path ||
                                    (link.path !== '/' && location.pathname.startsWith(link.path));
                                return (
                                    <Link
                                        key={link.name}
                                        to={link.path}
                                        className={`relative px-5 py-2 text-sm font-semibold transition-colors duration-200 group ${isActive ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        {link.name}
                                        {/* Underline bar */}
                                        <span
                                            className={`absolute bottom-0 left-3 right-3 h-[2px] rounded-full bg-blue-500 transition-all duration-300 origin-center ${isActive
                                                ? 'scale-x-100 opacity-100'
                                                : 'scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-60'
                                                }`}
                                        />
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Auth Button */}
                        <div className="flex items-center gap-4 ml-4">
                            {user ? (
                                <div className="flex items-center gap-3">
                                    {user.is_admin && (
                                        <div className="hidden lg:flex items-center gap-2 bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-100">
                                            <span className="text-xs text-purple-700 font-medium">Товаров:</span>
                                            <input
                                                type="number"
                                                min="0"
                                                value={adminCount}
                                                onChange={handleAdminCountChange}
                                                className="w-16 h-6 px-1 text-sm font-bold text-center text-purple-900 bg-white border border-purple-200 rounded outline-none focus:border-purple-400"
                                            />
                                            <span className="text-sm font-bold text-purple-900 ml-1">
                                                = {adminCount * 50} ₽
                                            </span>
                                        </div>
                                    )}
                                    <span className="hidden lg:inline text-sm font-medium text-gray-700">{user.email}</span>
                                    <button
                                        onClick={logout}
                                        className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                                        title="Выйти"
                                    >
                                        <LogOut className="w-5 h-5" />
                                    </button>
                                </div>
                            ) : (
                                <a
                                    href="/login"
                                    className="flex items-center gap-2 p-2 sm:px-4 sm:py-2 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                                >
                                    <UserIcon className="w-4 h-4" />
                                    <span className="hidden sm:inline">Войти</span>
                                </a>
                            )}

                            {/* Cart button */}
                            <button
                                onClick={() => setIsOpen(true)}
                                className="relative flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-5 sm:py-2.5 text-sm font-bold text-white rounded-xl overflow-hidden group active:scale-95 transition-transform duration-150"
                                style={{ WebkitTapHighlightColor: 'transparent' }}
                            >
                                {/* Gradient background */}
                                <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 transition-all duration-300 group-hover:from-blue-500 group-hover:to-indigo-500" />
                                {/* Glow */}
                                <span className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]" />
                                {/* Bottom shadow glow */}
                                <span className="absolute -inset-0.5 rounded-xl bg-blue-500/40 blur-md opacity-0 group-hover:opacity-100 -z-10 transition-opacity duration-300" />

                                <ShoppingBag className="w-4 h-4 relative z-10 transition-transform duration-200 group-hover:-rotate-6 group-hover:scale-110" strokeWidth={2.2} />
                                <span className="hidden sm:inline relative z-10">Корзина</span>

                                {totalItems() > 0 && (
                                    <span className="relative z-10 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-black text-blue-600 bg-white rounded-full animate-[pop_0.25s_ease]">
                                        {totalItems()}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Add keyframe for cart badge pop */}
            <style>{`
                @keyframes pop {
                    0% { transform: scale(0.5); opacity: 0; }
                    70% { transform: scale(1.2); }
                    100% { transform: scale(1); opacity: 1; }
                }
            `}</style>

            <CartModal />
        </>
    );
}
