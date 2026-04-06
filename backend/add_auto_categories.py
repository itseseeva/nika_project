"""
Скрипт добавления новых категорий автозапчастей и расходных материалов.
Копирует фото и добавляет товары в БД.
"""
import asyncio
import shutil
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))

from database import AsyncSessionLocal
import models

# ── Пути
SRC_PHOTOS = r"E:\Users\username\Desktop\promsell\новые_фото"
DST_PHOTOS = r"E:\Users\username\Desktop\promsell\frontend\public\products"

os.makedirs(DST_PHOTOS, exist_ok=True)

def cp(src_name: str, dst_name: str) -> str:
    """Копирует файл и возвращает публичный URL."""
    src = os.path.join(SRC_PHOTOS, src_name)
    dst = os.path.join(DST_PHOTOS, dst_name)
    if os.path.exists(src):
        shutil.copy2(src, dst)
        print(f"  ✓ {src_name} → {dst_name}")
    else:
        print(f"  ✗ НЕ НАЙДЕН: {src_name}")
    return f"/products/{dst_name}"


async def add_categories_and_products():
    # ── 1. Копируем фото

    print("📁 Копирование фото...\n")

    # Расходные автоматериалы
    oil1_1 = cp("Масло WOLF OFFICIALTECH 5W30 C3 SP EXTRA 5L.jpg",       "wolf_5w30_1.jpg")
    oil1_2 = cp("Масло WOLF VITALTECH 5W40 4L СИНТЕТИКА.jpg",            "wolf_5w30_2.jpg")  # вторая картинка

    oil2_1 = cp("Масло WOLF VITALTECH 5W40 4L СИНТЕТИКА.jpg",            "wolf_5w40_1.jpg")
    oil2_2 = cp("Масло WOLF VITALTECH 5W40 4L СИНТЕТИКА_2.jpg",          "wolf_5w40_2.jpg")

    anti1_1 = cp("Антифриз Vitex V104801.jpg",                            "antifriz_v104801_1.jpg")
    anti1_2 = cp("Антифриз Vitex V104801_2.webp",                         "antifriz_v104801_2.webp")

    anti2_1 = cp("Антифриз Vitex V105801.webp",                           "antifriz_v105801_1.webp")
    anti2_2 = cp("Антифриз Vitex V104801.webp",                           "antifriz_v105801_2.webp")  # похожий

    fil1_1 = cp("Фильтры для ТО для Hyundai Solaris 2017-2022 (Фильтр масляный, Фильтр воздушный, Фильтр салона).jpg", "filters_solaris_1.jpg")
    fil1_2 = cp("Фильтры для ТО для Hyundai Solaris 2017-2022 (Фильтр масляный, Фильтр воздушный, Фильтр салона).webp","filters_solaris_2.webp")

    fil2_1 = cp("Фильтры для ТО для Kia K5 2015-2020 (Фильтр масляный, Фильтр воздушный, Фильтр салона).webp",        "filters_kia_k5_1.webp")
    fil2_2 = cp("Фильтры для ТО для Kia K5 2015-2020 (Фильтр масляный, Фильтр воздушный, Фильтр салона)_2.webp",      "filters_kia_k5_2.webp")

    fil3_1 = cp("Фильтры для ТО для Geely Coolray (SX11) 2018 Фильтр масляный, Фильтр воздушный, Фильтр салона.jpg",  "filters_geely_1.jpg")
    fil3_2 = cp("Фильтры для ТО для Geely Coolray (SX11) 2018 Фильтр масляный, Фильтр воздушный, Фильтр салона_2.jpg","filters_geely_2.jpg")

    # Автозапчасти
    act1_1 = cp("Активатор сцепления (роботизированной КПП) Longho.jpg",  "activator_longho_1.jpg")
    act1_2 = cp("Активатор сцепления (роботизированной КПП) Longho_2.jpg","activator_longho_2.jpg")

    disc1_1 = cp("Диск сцепления Aisin DTX-152.jpg",                      "disc_aisin_1.jpg")
    disc1_2 = cp("Диск сцепления Aisin DTX-152_2.jpg",                    "disc_aisin_2.jpg")

    rk1_1 = cp("Рк сцепления Hermann.jpg",                                "rk_hermann_1.jpg")
    rk1_2 = cp("Рк сцепления Hermann.jpg",                                "rk_hermann_2.jpg")  # одно фото дублируем

    akpp1_1 = cp("АКПП (автоматическая коробка переключения передач) VAG.png",   "akpp_vag_1.png")
    akpp1_2 = cp("АКПП (автоматическая коробка переключения передач) VAG_2.png",  "akpp_vag_2.png")

    amort1_1 = cp("Амортизаторы задние к-кт Асоми VAZ LADA LARGUS 2012.webp",    "amort_largus_1.webp")
    amort1_2 = cp("Амортизаторы задние к-кт Асоми VAZ LADA LARGUS 2012_2.webp",  "amort_largus_2.webp")

    fara_l1 = cp("Фара левая Metaco CRETA 2016.webp",                     "fara_lev_creta_1.webp")
    fara_l2 = cp("Фара левая Metaco CRETA 2016_2.webp",                   "fara_lev_creta_2.webp")

    fara_r1 = cp("Фары правые Metaco CRETA 2016.webp",                    "fara_prav_creta_1.webp")
    fara_r2 = cp("Фары правые Metaco CRETA 2016_2.webp",                  "fara_prav_creta_2.webp")

    print("\n✅ Фото скопированы\n")

    # ── 2. Добавляем в БД
    print("🗄️  Добавление категорий и товаров в БД...\n")
    async with AsyncSessionLocal() as db:

        # Категории
        cat_consumables = models.Category(
            name="Расходные автоматериалы",
            slug="auto-consumables"
        )
        cat_autoparts = models.Category(
            name="Автозапчасти",
            slug="autoparts"
        )
        db.add_all([cat_consumables, cat_autoparts])
        await db.commit()

        print(f"  Категория 1: {cat_consumables.name} (id={cat_consumables.id})")
        print(f"  Категория 2: {cat_autoparts.name} (id={cat_autoparts.id})")

        # ── РАСХОДНЫЕ АВТОМАТЕРИАЛЫ (6 товаров)
        consumables = [
            models.Product(
                name="Масло WOLF OFFICIALTECH 5W30 C3 SP EXTRA 5L",
                slug="maslo-wolf-officialtech-5w30-5l",
                description="Синтетическое моторное масло WOLF OFFICIALTECH 5W30 C3 SP EXTRA, 5 литров. Допуски VW 504.00/507.00, BMW LL-04, MB 229.51. Подходит для автомобилей с сажевым фильтром (DPF).",
                price=6200.0,
                image_urls=[oil1_1, oil1_2],
                category_id=cat_consumables.id,
                attributes={"Вязкость": "5W30", "Объём": "5L", "Класс API": "SP", "Тип": "Синтетическое"}
            ),
            models.Product(
                name="Масло WOLF VITALTECH 5W40 4L Синтетика",
                slug="maslo-wolf-vitaltech-5w40-4l",
                description="Синтетическое моторное масло WOLF VITALTECH 5W40, 4 литра. Всесезонное масло для бензиновых и дизельных двигателей. Обеспечивает надёжную защиту в широком диапазоне температур.",
                price=4600.0,
                image_urls=[oil2_1, oil2_2],
                category_id=cat_consumables.id,
                attributes={"Вязкость": "5W40", "Объём": "4L", "Тип": "Синтетическое"}
            ),
            models.Product(
                name="Антифриз Vitex V104801",
                slug="antifriz-vitex-v104801",
                description="Антифриз Vitex V104801 на основе этиленгликоля. Защита от замерзания до -40°C и перегрева. Совместим с алюминиевыми деталями двигателя.",
                price=280.0,
                image_urls=[anti1_1, anti1_2],
                category_id=cat_consumables.id,
                attributes={"Артикул": "V104801", "Защита до": "-40°C", "Тип": "G11/G12"}
            ),
            models.Product(
                name="Антифриз Vitex V105801",
                slug="antifriz-vitex-v105801",
                description="Антифриз Vitex V105801 концентрат. Карбоксилатный тип, совместим с большинством иномарок и отечественных автомобилей.",
                price=170.0,
                image_urls=[anti2_1, anti2_2],
                category_id=cat_consumables.id,
                attributes={"Артикул": "V105801", "Тип": "Концентрат"}
            ),
            models.Product(
                name="Фильтры ТО Hyundai Solaris 2017–2022 (масляный + воздушный + салонный)",
                slug="filtry-to-hyundai-solaris-2017-2022",
                description="Комплект фильтров для ТО Hyundai Solaris 2017–2022: масляный, воздушный и салонный фильтры. Оригинальные размеры и характеристики. Аналоги ведущих брендов.",
                price=1650.0,
                image_urls=[fil1_1, fil1_2],
                category_id=cat_consumables.id,
                attributes={"Марка": "Hyundai Solaris", "Годы": "2017–2022", "Состав": "Масляный + Воздушный + Салонный"}
            ),
            models.Product(
                name="Фильтры ТО Kia K5 2015–2020 (масляный + воздушный + салонный)",
                slug="filtry-to-kia-k5-2015-2020",
                description="Комплект фильтров для ТО Kia K5 2015–2020: масляный, воздушный и салонный фильтры. Точное соответствие заводским параметрам.",
                price=2450.0,
                image_urls=[fil2_1, fil2_2],
                category_id=cat_consumables.id,
                attributes={"Марка": "Kia K5", "Годы": "2015–2020", "Состав": "Масляный + Воздушный + Салонный"}
            ),
            models.Product(
                name="Фильтры ТО Geely Coolray (SX11) 2018 (масляный + воздушный + салонный)",
                slug="filtry-to-geely-coolray-sx11-2018",
                description="Комплект фильтров для ТО Geely Coolray (SX11) с 2018 года: масляный, воздушный и салонный фильтры.",
                price=3900.0,
                image_urls=[fil3_1, fil3_2],
                category_id=cat_consumables.id,
                attributes={"Марка": "Geely Coolray (SX11)", "Год выпуска": "от 2018", "Состав": "Масляный + Воздушный + Салонный"}
            ),
        ]

        # ── АВТОЗАПЧАСТИ (8 товаров)
        autoparts = [
            models.Product(
                name="Активатор сцепления роботизированной КПП Longho",
                slug="aktivator-scepleniya-longho",
                description="Активатор сцепления для роботизированной КПП Longho. Предназначен для автомобилей с роботизированными коробками передач. Точная настройка момента включения сцепления.",
                price=55000.0,
                image_urls=[act1_1, act1_2],
                category_id=cat_autoparts.id,
                attributes={"Бренд": "Longho", "Тип КПП": "Роботизированная", "Назначение": "Сцепление"}
            ),
            models.Product(
                name="Диск сцепления Aisin DTX-152",
                slug="disk-scepleniya-aisin-dtx-152",
                description="Диск сцепления Aisin DTX-152. Надёжный ведомый диск сцепления японского производителя Aisin. Высокая износостойкость и стабильные характеристики.",
                price=6120.0,
                image_urls=[disc1_1, disc1_2],
                category_id=cat_autoparts.id,
                attributes={"Бренд": "Aisin", "Артикул": "DTX-152", "Тип": "Ведомый диск"}
            ),
            models.Product(
                name="Ремкомплект сцепления Hermann",
                slug="remkomplekt-scepleniya-hermann",
                description="Ремонтный комплект сцепления Hermann. Включает все необходимые детали для восстановления механизма сцепления. Совместим с широким рядом автомобилей.",
                price=2550.0,
                image_urls=[rk1_1, rk1_2],
                category_id=cat_autoparts.id,
                attributes={"Бренд": "Hermann", "Тип": "Ремкомплект"}
            ),
            models.Product(
                name="АКПП (автоматическая коробка переключения передач) VAG",
                slug="akpp-vag",
                description="Автоматическая коробка переключения передач (АКПП) для автомобилей VAG (Volkswagen, Audi, Škoda, SEAT). Проверенный агрегат, готов к установке.",
                price=55000.0,
                image_urls=[akpp1_1, akpp1_2],
                category_id=cat_autoparts.id,
                attributes={"Группа": "VAG", "Тип": "Автоматическая КПП", "Применяемость": "VW / Audi / Škoda / SEAT"}
            ),
            models.Product(
                name="Амортизаторы задние к-кт Асоми LADA LARGUS (от 2012)",
                slug="amortizatory-zadnie-asomi-lada-largus-2012",
                description="Комплект задних амортизаторов Асоми для LADA LARGUS (2 шт.), с 2012 года выпуска. Обеспечивают комфортное и устойчивое движение.",
                price=9990.0,
                image_urls=[amort1_1, amort1_2],
                category_id=cat_autoparts.id,
                attributes={"Бренд": "Асоми", "Марка": "LADA LARGUS", "Год": "от 2012", "Тип": "Задние, комплект 2 шт."}
            ),
            models.Product(
                name="Фара левая Metaco Hyundai CRETA (от 2016)",
                slug="fara-levaya-metaco-creta-2016",
                description="Фара передняя левая Metaco для Hyundai CRETA с 2016 года. Точное соответствие оригинальным посадочным размерам. Лёгкая установка.",
                price=9500.0,
                image_urls=[fara_l1, fara_l2],
                category_id=cat_autoparts.id,
                attributes={"Бренд": "Metaco", "Марка": "Hyundai CRETA", "Год": "от 2016", "Расположение": "Левая"}
            ),
            models.Product(
                name="Фара правая Metaco Hyundai CRETA (от 2016)",
                slug="fara-pravaya-metaco-creta-2016",
                description="Фара передняя правая Metaco для Hyundai CRETA с 2016 года. Качественный аналог оригинала по выгодной цене.",
                price=9500.0,
                image_urls=[fara_r1, fara_r2],
                category_id=cat_autoparts.id,
                attributes={"Бренд": "Metaco", "Марка": "Hyundai CRETA", "Год": "от 2016", "Расположение": "Правая"}
            ),
        ]

        db.add_all(consumables + autoparts)
        await db.commit()

        total = len(consumables) + len(autoparts)
        print(f"\n✅ Добавлено в БД: {len(consumables)} расходных материалов + {len(autoparts)} запчастей = {total} товаров")
        print(f"   Категория 'Расходные автоматериалы' (id={cat_consumables.id})")
        print(f"   Категория 'Автозапчасти' (id={cat_autoparts.id})")

if __name__ == "__main__":
    asyncio.run(add_categories_and_products())
