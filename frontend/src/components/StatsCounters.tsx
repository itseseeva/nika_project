import { useEffect, useRef } from 'react';
import { motion, useInView, useSpring, useTransform } from 'framer-motion';

function CountingNumber({ value, label, suffix = '' }: { value: number; label: string; suffix?: string }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    const springValue = useSpring(0, {
        bounce: 0,
        duration: 2500,
    });

    const roundedValue = useTransform(springValue, (current) => Math.round(current));

    useEffect(() => {
        if (isInView) {
            springValue.set(value);
        }
    }, [isInView, value, springValue]);

    return (
        <div ref={ref} className="text-center p-6 bg-white rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-xl transition-all duration-500">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-400 opacity-0 group-hover:opacity-10 blur transition-opacity duration-500"></div>
            <motion.div className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-gray-900 to-gray-600 mb-2 font-mono tracking-tighter">
                <motion.span>{roundedValue}</motion.span>{suffix}
            </motion.div>
            <div className="text-lg text-gray-500 font-medium">{label}</div>
        </div>
    );
}

export function StatsCounters() {
    return (
        <section className="py-20 bg-gray-50 border-t border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <CountingNumber value={142} label="Заказов отгружено сегодня" />
                    <CountingNumber value={15430} label="Товаров в наличии на складах" suffix="+" />
                    <CountingNumber value={34} label="Оптовика онлайн прямо сейчас" />
                </div>
            </div>
        </section>
    );
}
