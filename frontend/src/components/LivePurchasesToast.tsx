import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PackageCheck, X } from 'lucide-react';

const MOCK_PURCHASES = [
  { company: 'ООО СтройСнаб', item: 'Комбинезон рабочий PRO (50 шт)', time: 'только что' },
  { company: 'ИП Смирнов А.В.', item: 'Перчатки х/б с ПВХ (200 пар)', time: '1 мин назад' },
  { company: 'Автосервис "Гараж"', item: 'Масло моторное 5W-40 (20 л)', time: '3 мин назад' },
  { company: 'ЗАО ТехноСервис', item: 'Стрейч-плёнка (10 рул)', time: 'только что' },
  { company: 'СМУ-4', item: 'Костюм сварщика (10 шт)', time: 'только что' },
];

export function LivePurchasesToast() {
  const [currentToast, setCurrentToast] = useState<{ company: string; item: string; time: string; id: number } | null>(null);

  useEffect(() => {
    // Начальная задержка перед первым показом
    const initialTimer = setTimeout(() => {
      showNextToast();
    }, 5000);

    return () => clearTimeout(initialTimer);
  }, []);

  const showNextToast = () => {
    const randomPurchase = MOCK_PURCHASES[Math.floor(Math.random() * MOCK_PURCHASES.length)];
    const id = Date.now();
    
    setCurrentToast({ ...randomPurchase, id });

    // Скрываем тост через 5 секунд
    setTimeout(() => {
      setCurrentToast(currentToast => currentToast?.id === id ? null : currentToast);
      
      // Планируем следующий показ через 15-30 секунд
      const nextDelay = Math.random() * 15000 + 15000;
      setTimeout(showNextToast, nextDelay);
    }, 5000);
  };

  return (
    <div className="fixed bottom-4 left-4 z-50 pointer-events-none">
      <AnimatePresence>
        {currentToast && (
          <motion.div
            key={currentToast.id}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="bg-white rounded-lg shadow-xl shadow-gray-200/50 border border-gray-100 p-4 max-w-sm flex items-start space-x-4 pointer-events-auto"
          >
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <PackageCheck className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {currentToast.company} <span className="text-gray-500 font-normal">заказал(а):</span>
              </p>
              <p className="text-sm text-blue-600 font-medium truncate mt-0.5">
                {currentToast.item}
              </p>
              <p className="text-xs text-gray-400 mt-1 flex items-center">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse" />
                {currentToast.time}
              </p>
            </div>
            <button 
              onClick={() => setCurrentToast(null)}
              className="flex-shrink-0 text-gray-400 hover:text-gray-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
