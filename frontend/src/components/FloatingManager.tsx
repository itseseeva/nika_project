import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';

type Message = {
    role: 'user' | 'assistant';
    content: string;
};

export function FloatingManager() {
    const [isOpen, setIsOpen] = useState(false);
    const [hasUnread, setHasUnread] = useState(true);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const isCartOpen = useCartStore(state => state.isOpen);
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: 'Здравствуйте! 👋 Нужна помощь с подбором оптовой партии или есть вопросы по отсрочке платежа?' }
    ]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Имитируем появление "нового сообщения" через 10 секунд
    // useEffect(() => {
    //   const timer = setTimeout(() => {
    //     if (!isOpen) setHasUnread(true);
    //   }, 10000);
    //   return () => clearTimeout(timer);
    // }, [isOpen]);

    const toggleOpen = () => {
        setIsOpen(!isOpen);
        if (!isOpen) setHasUnread(false);
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) scrollToBottom();
    }, [messages, isOpen]);

    const sendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg = input.trim();
        setInput("");

        const newMessages = [...messages, { role: 'user', content: userMsg } as Message];
        setMessages(newMessages);
        setIsLoading(true);

        try {
            // Отправляем запрос на наш бэкенд
            const response = await fetch('http://localhost:8000/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: newMessages })
            });

            if (response.ok) {
                const data = await response.json();
                setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
            } else {
                setMessages(prev => [...prev, { role: 'assistant', content: 'Извините, произошла ошибка связи с сервером.' }]);
            }
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, { role: 'assistant', content: 'Извините, сервис временно недоступен.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className={`fixed bottom-4 right-4 z-50 flex flex-col items-end transition-all duration-300 ${isCartOpen ? 'opacity-0 pointer-events-none translate-x-12' : 'opacity-100 translate-x-0'}`}>
            {/* Чат модалка */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        className="bg-white rounded-2xl shadow-2xl shadow-blue-900/10 border border-gray-100 w-72 sm:w-80 max-w-[calc(100vw-2rem)] overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-4 flex items-center justify-between border-b border-white/10">
                            <div className="flex items-center space-x-3">
                                <div className="relative">
                                    <img
                                        src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=100"
                                        alt="Manager"
                                        className="w-10 h-10 rounded-full border-2 border-white object-cover"
                                    />
                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                                </div>
                                <div>
                                    <h4 className="text-white font-semibold text-sm">Алексей</h4>
                                    <p className="text-blue-100 text-xs">Ваш персональный менеджер</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-white/80 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-4 bg-gray-50 h-64 overflow-y-auto flex flex-col gap-4 scrollbar-thin scrollbar-thumb-gray-300">
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'self-end' : 'self-start'}`}>
                                    <div className={`p-3 rounded-2xl shadow-sm text-sm ${msg.role === 'user'
                                        ? 'bg-blue-600 text-white rounded-tr-none'
                                        : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                                        }`}>
                                        <p className="whitespace-pre-wrap">{msg.content}</p>
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="self-start bg-white p-3 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm max-w-[85%]">
                                    <div className="flex space-x-1 items-center h-5">
                                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input area */}
                        <div className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Написать сообщение..."
                                className="w-full bg-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-100 border border-transparent focus:border-blue-300 text-gray-800 text-sm py-2 px-4 rounded-2xl resize-none outline-none transition-all max-h-24 min-h-[40px] scrollbar-none"
                                rows={1}
                            />
                            <button
                                onClick={sendMessage}
                                disabled={!input.trim() || isLoading}
                                className="p-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-xl transition-colors flex-shrink-0"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Кнопка с фото */}
            {!isOpen && (
                <button
                    onClick={toggleOpen}
                    className="group relative"
                >
                    <div className="relative">
                        {/* Пульсирующий фон, чтобы привлекать внимание */}
                        {!isOpen && (
                            <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-20"></div>
                        )}

                        <div className={`relative w-16 h-16 rounded-full overflow-hidden shadow-xl border-4 transition-all duration-300 ${isOpen ? 'border-gray-200 shadow-none' : 'border-white hover:scale-105'}`}>
                            <img
                                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200"
                                alt="Chat manager"
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Индикатор онлайна на кнопке */}
                        <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>

                        {/* Unread badge */}
                        {!isOpen && hasUnread && (
                            <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                                1
                            </div>
                        )}

                        {/* Иконка чата при наведении */}
                        <div className="absolute inset-0 bg-blue-600/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <MessageCircle className="w-7 h-7 text-white" />
                        </div>
                    </div>

                    {/* Всплывающая подсказка - скрыта на мобильных */}
                    {!isOpen && (
                        <div className="hidden sm:flex absolute right-full top-1/2 -translate-y-1/2 mr-4 bg-white px-4 py-2 rounded-xl shadow-xl shadow-blue-900/10 border border-gray-100 text-sm font-semibold text-gray-800 whitespace-nowrap pointer-events-none animate-bounce flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            Задать вопрос
                            <div className="absolute top-1/2 -translate-y-1/2 left-full w-0 h-0 border-y-[6px] border-y-transparent border-l-[6px] border-l-white"></div>
                        </div>
                    )}
                </button>
            )}
        </div>
    );
}
