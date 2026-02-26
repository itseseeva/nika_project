


const PARTNERS = [
    "Газпром", "Роснефть", "Норильский Никель", "СЕВЕРСТАЛЬ",
    "Лукойл", "РЖД", "Сбер", "Яндекс", "VK", "МТС", "МегаФон", "X5 Group"
];

export function MarqueeBrands() {
    return (
        <div className="bg-white border-b border-gray-100 py-10 overflow-hidden relative flex bg-gray-50/50">
            <div className="absolute left-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-r from-white to-transparent"></div>
            <div className="absolute right-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-l from-white to-transparent"></div>

            <div className="flex animate-[marquee_40s_linear_infinite] whitespace-nowrap min-w-full">
                {PARTNERS.map((partner, i) => (
                    <div key={`p1-${i}`} className="mx-8 text-2xl font-bold text-gray-300 uppercase tracking-widest hover:text-blue-500 transition-colors duration-300">
                        {partner}
                    </div>
                ))}
                {PARTNERS.map((partner, i) => (
                    <div key={`p2-${i}`} className="mx-8 text-2xl font-bold text-gray-300 uppercase tracking-widest hover:text-blue-500 transition-colors duration-300">
                        {partner}
                    </div>
                ))}
            </div>

            {/* Добавляем стили анимации для бегущей строки */}
            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}} />
        </div>
    );
}
