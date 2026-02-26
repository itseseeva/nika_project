from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import api
from database import engine, Base
from dotenv import load_dotenv
import os
import shutil

# Load environment variables from the root .env file
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '.env'))

app = FastAPI(title="NIKA E-commerce MVP")

# Configure CORS for frontend access
origins = [
    "http://localhost",       # Docker (nginx на порту 80)
    "http://127.0.0.1",
    "http://localhost:5173",  # Vite dev server
    "http://127.0.0.1:5173",
    "http://localhost:5555",
    "http://127.0.0.1:5555",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api.router, prefix="/api")


def _copy_auto_photos():
    """Копирует фото автотоваров в public/products."""
    # Пытаемся найти папку 'новые_фото' в разных местах (локально и в Docker)
    base_dir = os.path.dirname(__file__)
    src_options = [
        os.path.join(base_dir, 'новые_фото'),
        os.path.join(base_dir, '..', 'новые_фото'),
        '/app/новые_фото',
        '/новые_фото'
    ]
    dst_options = [
        os.path.join(base_dir, '..', 'frontend', 'public', 'products'),
        '/frontend/public/products',
        '/app/frontend/public/products'
    ]
    
    src = next((s for s in src_options if os.path.exists(s)), None)
    dst = next((d for d in dst_options if os.path.exists(d) or 'frontend' in d), None)

    if not src or not dst:
        print(f"[AUTO-COPY] ОШИБКА: src ({src}) или dst ({dst}) не найден!")
        return

    os.makedirs(dst, exist_ok=True)
    print(f"[AUTO-COPY] Копирование из {src} в {dst}...")
    
    for fname in os.listdir(src):
        s = os.path.join(src, fname)
        d = os.path.join(dst, fname)
        if os.path.isfile(s):
            try:
                if not os.path.exists(d):
                    shutil.copy2(s, d)
            except Exception as e:
                print(f"[AUTO-COPY] Ошибка при копировании {fname}: {e}")


async def _seed_auto_categories():
    """Добавляет 2 новые категории и 15 автотоваров, если их ещё нет."""
    from database import AsyncSessionLocal
    import models
    from sqlalchemy.future import select

    async with AsyncSessionLocal() as db:
        # Проверяем — уже существуют?
        res = await db.execute(select(models.Category).where(models.Category.slug == "auto-consumables"))
        if res.scalar_one_or_none():
            return  # уже добавлено

        # ── Категории
        cat_cons = models.Category(name="Расходные автоматериалы", slug="auto-consumables")
        cat_parts = models.Category(name="Автозапчасти", slug="autoparts")
        db.add_all([cat_cons, cat_parts])
        await db.flush()  # получаем id

        p = "/products/"  # базовый путь к фото

        # ── РАСХОДНЫЕ АВТОМАТЕРИАЛЫ
        consumables = [
            models.Product(
                name="Масло WOLF OFFICIALTECH 5W30 C3 SP EXTRA 5L",
                slug="maslo-wolf-officialtech-5w30-5l",
                description="Синтетическое моторное масло WOLF OFFICIALTECH 5W30 C3 SP EXTRA, 5 л. Допуски VW 504/507, BMW LL-04, MB 229.51. Для авто с сажевым фильтром (DPF).",
                price=6200.0,
                image_urls=[
                    p + "Масло WOLF OFFICIALTECH 5W30 C3 SP EXTRA 5L.jpg",
                    p + "Масло WOLF VITALTECH 5W40 4L СИНТЕТИКА.jpg",
                ],
                category_id=cat_cons.id,
                attributes={"Вязкость": "5W30", "Объём": "5L", "Класс": "C3 SP", "Тип": "Синтетика"},
            ),
            models.Product(
                name="Масло WOLF VITALTECH 5W40 4L Синтетика",
                slug="maslo-wolf-vitaltech-5w40-4l",
                description="Синтетическое моторное масло WOLF VITALTECH 5W40, 4 л. Всесезонное, для бензиновых и дизельных двигателей.",
                price=4600.0,
                image_urls=[
                    p + "Масло WOLF VITALTECH 5W40 4L СИНТЕТИКА.jpg",
                    p + "Масло WOLF VITALTECH 5W40 4L СИНТЕТИКА_2.jpg",
                ],
                category_id=cat_cons.id,
                attributes={"Вязкость": "5W40", "Объём": "4L", "Тип": "Синтетика"},
            ),
            models.Product(
                name="Антифриз Vitex V104801",
                slug="antifriz-vitex-v104801",
                description="Антифриз Vitex V104801 на основе этиленгликоля. Защита до -40°C. Совместим с алюминиевыми деталями.",
                price=280.0,
                image_urls=[
                    p + "Антифриз Vitex V104801.jpg",
                    p + "Антифриз Vitex V104801_2.webp",
                ],
                category_id=cat_cons.id,
                attributes={"Артикул": "V104801", "Защита до": "-40°C"},
            ),
            models.Product(
                name="Антифриз Vitex V105801",
                slug="antifriz-vitex-v105801",
                description="Антифриз Vitex V105801 концентрат. Карбоксилатный тип, совместим с большинством марок авто.",
                price=170.0,
                image_urls=[
                    p + "Антифриз Vitex V105801.webp",
                    p + "Антифриз Vitex V104801.webp",
                ],
                category_id=cat_cons.id,
                attributes={"Артикул": "V105801", "Тип": "Концентрат"},
            ),
            models.Product(
                name="Фильтры ТО Hyundai Solaris 2017–2022 (масляный + воздушный + салонный)",
                slug="filtry-to-hyundai-solaris-2017-2022",
                description="Комплект фильтров для ТО Hyundai Solaris 2017–2022: масляный, воздушный и салонный фильтры.",
                price=1650.0,
                image_urls=[
                    p + "Фильтры для ТО для Hyundai Solaris 2017-2022 (Фильтр масляный, Фильтр воздушный, Фильтр салона).jpg",
                    p + "Фильтры для ТО для Hyundai Solaris 2017-2022 (Фильтр масляный, Фильтр воздушный, Фильтр салона).webp",
                ],
                category_id=cat_cons.id,
                attributes={"Марка": "Hyundai Solaris", "Годы": "2017–2022", "Состав": "3 фильтра"},
            ),
            models.Product(
                name="Фильтры ТО Kia K5 2015–2020 (масляный + воздушный + салонный)",
                slug="filtry-to-kia-k5-2015-2020",
                description="Комплект фильтров для ТО Kia K5 2015–2020: масляный, воздушный и салонный фильтры.",
                price=2450.0,
                image_urls=[
                    p + "Фильтры для ТО для Kia K5 2015-2020 (Фильтр масляный, Фильтр воздушный, Фильтр салона).webp",
                    p + "Фильтры для ТО для Kia K5 2015-2020 (Фильтр масляный, Фильтр воздушный, Фильтр салона)_2.webp",
                ],
                category_id=cat_cons.id,
                attributes={"Марка": "Kia K5", "Годы": "2015–2020", "Состав": "3 фильтра"},
            ),
            models.Product(
                name="Фильтры ТО Geely Coolray (SX11) от 2018 (масляный + воздушный + салонный)",
                slug="filtry-to-geely-coolray-sx11-2018",
                description="Комплект фильтров для ТО Geely Coolray (SX11) с 2018 года: масляный, воздушный и салонный фильтры.",
                price=3900.0,
                image_urls=[
                    p + "Фильтры для ТО для Geely Coolray (SX11) 2018 Фильтр масляный, Фильтр воздушный, Фильтр салона.jpg",
                    p + "Фильтры для ТО для Geely Coolray (SX11) 2018 Фильтр масляный, Фильтр воздушный, Фильтр салона_2.jpg",
                ],
                category_id=cat_cons.id,
                attributes={"Марка": "Geely Coolray (SX11)", "Год": "от 2018", "Состав": "3 фильтра"},
            ),
        ]

        # ── АВТОЗАПЧАСТИ
        autoparts = [
            models.Product(
                name="Активатор сцепления роботизированной КПП Longho",
                slug="aktivator-scepleniya-longho",
                description="Активатор сцепления для роботизированной КПП Longho. Для авто с роботизированными коробками передач.",
                price=55000.0,
                image_urls=[
                    p + "Активатор сцепления (роботизированной КПП) Longho.jpg",
                    p + "Активатор сцепления (роботизированной КПП) Longho_2.jpg",
                ],
                category_id=cat_parts.id,
                attributes={"Бренд": "Longho", "Тип КПП": "Роботизированная"},
            ),
            models.Product(
                name="Диск сцепления Aisin DTX-152",
                slug="disk-scepleniya-aisin-dtx-152",
                description="Диск сцепления Aisin DTX-152. Ведомый диск японского производителя. Высокая износостойкость.",
                price=6120.0,
                image_urls=[
                    p + "Диск сцепления Aisin DTX-152.jpg",
                    p + "Диск сцепления Aisin DTX-152_2.jpg",
                ],
                category_id=cat_parts.id,
                attributes={"Бренд": "Aisin", "Артикул": "DTX-152"},
            ),
            models.Product(
                name="Ремкомплект сцепления Hermann",
                slug="remkomplekt-scepleniya-hermann",
                description="Ремонтный комплект сцепления Hermann. Все необходимые детали для восстановления механизма.",
                price=2550.0,
                image_urls=[
                    p + "Рк сцепления Hermann.jpg",
                    p + "Рк сцепления Hermann.jpg",
                ],
                category_id=cat_parts.id,
                attributes={"Бренд": "Hermann", "Тип": "Ремкомплект"},
            ),
            models.Product(
                name="АКПП VAG (автоматическая коробка передач)",
                slug="akpp-vag",
                description="Автоматическая коробка переключения передач для автомобилей VAG (VW, Audi, Škoda, SEAT). Проверенный агрегат.",
                price=55000.0,
                image_urls=[
                    p + "АКПП (автоматическая коробка переключения передач) VAG.png",
                    p + "АКПП (автоматическая коробка переключения передач) VAG_2.png",
                ],
                category_id=cat_parts.id,
                attributes={"Группа": "VAG", "Применяемость": "VW / Audi / Škoda / SEAT"},
            ),
            models.Product(
                name="Амортизаторы задние к-кт Асоми LADA LARGUS (от 2012)",
                slug="amortizatory-zadnie-asomi-lada-largus",
                description="Комплект задних амортизаторов Асоми для LADA LARGUS, 2 шт. С 2012 года выпуска.",
                price=9990.0,
                image_urls=[
                    p + "Амортизаторы задние к-кт Асоми VAZ LADA LARGUS 2012.webp",
                    p + "Амортизаторы задние к-кт Асоми VAZ LADA LARGUS 2012_2.webp",
                ],
                category_id=cat_parts.id,
                attributes={"Бренд": "Асоми", "Марка": "LADA LARGUS", "Год": "от 2012", "Комплект": "2 шт."},
            ),
            models.Product(
                name="Фара левая Metaco Hyundai CRETA (от 2016)",
                slug="fara-levaya-metaco-creta-2016",
                description="Фара передняя левая Metaco для Hyundai CRETA с 2016 года. Точное соответствие оригинальным посадочным размерам.",
                price=9500.0,
                image_urls=[
                    p + "Фара левая Metaco CRETA 2016.webp",
                    p + "Фара левая Metaco CRETA 2016_2.webp",
                ],
                category_id=cat_parts.id,
                attributes={"Бренд": "Metaco", "Марка": "Hyundai CRETA", "Год": "от 2016", "Сторона": "Левая"},
            ),
            models.Product(
                name="Фара правая Metaco Hyundai CRETA (от 2016)",
                slug="fara-pravaya-metaco-creta-2016",
                description="Фара передняя правая Metaco для Hyundai CRETA с 2016 года. Качественный аналог оригинала.",
                price=9500.0,
                image_urls=[
                    p + "Фары правые Metaco CRETA 2016.webp",
                    p + "Фары правые Metaco CRETA 2016_2.webp",
                ],
                category_id=cat_parts.id,
                attributes={"Бренд": "Metaco", "Марка": "Hyundai CRETA", "Год": "от 2016", "Сторона": "Правая"},
            ),
            models.Product(
                name="Фары правые Metaco Hyundai CRETA (от 2016) — комплект 2 шт.",
                slug="fary-pravye-metaco-creta-2016-kit",
                description="Фары передние правые Metaco для Hyundai CRETA с 2016 года, комплект 2 штуки.",
                price=9500.0,
                image_urls=[
                    p + "Фары правые Metaco CRETA 2016.webp",
                    p + "Фары правые Metaco CRETA 2016_2.webp",
                ],
                category_id=cat_parts.id,
                attributes={"Бренд": "Metaco", "Марка": "Hyundai CRETA", "Год": "от 2016", "Сторона": "Правая", "Кол-во": "2 шт."},
            ),
        ]

        # ── НОВЫЕ КАТЕГОРИИ
        for cat_data in [
            {"name": "Спецодежда и СИЗ", "slug": "specodezhda-i-siz"},
            {"name": "Упаковочные материалы", "slug": "upakovochnye-materialy"},
            {"name": "Масла и Смазки", "slug": "masla-i-smazki"},
            {"name": "Технические жидкости", "slug": "tekhnicheskie-zhidkosti"}
        ]:
            res = await db.execute(select(models.Category).where(models.Category.slug == cat_data["slug"]))
            if not res.scalar_one_or_none():
                cat = models.Category(name=cat_data["name"], slug=cat_data["slug"])
                db.add(cat)
                await db.flush()
                
                # Добавляем товары для новых категорий
                if cat_data["slug"] == "masla-i-smazki":
                    db.add_all([
                        models.Product(
                            name="Масло моторное 5W-40",
                            slug="maslo-motornoe-5w-40",
                            price=3500.0,
                            category_id=cat.id,
                            description="Высококачественное моторное масло для современных двигателей.",
                            attributes={"Вязкость": "5W-40"}
                        ),
                        models.Product(
                            name="Масло трансмиссионное 75W-90",
                            slug="maslo-transmissionnoe-75w-90",
                            price=1200.0,
                            category_id=cat.id,
                            description="Трансмиссионное масло для механических коробок передач.",
                            attributes={"Вязкость": "75W-90"}
                        )
                    ])
                elif cat_data["slug"] == "tekhnicheskie-zhidkosti":
                    db.add_all([
                        models.Product(
                            name="Омывайка зимняя -25°C",
                            slug="omyvayka-zimnyaya-25c",
                            price=500.0,
                            category_id=cat.id,
                            description="Незамерзающая жидкость для стеклоомывателя.",
                            attributes={"Температура": "-25°C"}
                        ),
                        models.Product(
                            name="Тормозная жидкость DOT 4",
                            slug="tormoznaya-zhidkost-dot-4",
                            price=800.0,
                            category_id=cat.id,
                            description="Тормозная жидкость стандарта DOT 4.",
                            attributes={"Стандарт": "DOT 4"}
                        )
                    ])

        await db.commit()
        print(f"[SEED] Добавлено: 2 категории + {len(consumables)} расходных материалов + {len(autoparts)} запчастей + новые категории")


@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        try:
            from sqlalchemy import text
            await conn.execute(text("ALTER TABLE products ADD COLUMN is_hidden BOOLEAN DEFAULT 0"))
        except Exception:
            pass
        try:
            from sqlalchemy import text
            await conn.execute(text("ALTER TABLE users ADD COLUMN hashed_password TEXT"))
        except Exception:
            pass
        try:
            from sqlalchemy import text
            await conn.execute(text("UPDATE users SET is_admin = 1 WHERE email = 'eseeva228@gmail.com'"))
        except Exception:
            pass
        try:
            from sqlalchemy import text
            await conn.execute(text("DELETE FROM products WHERE slug = 'fary-pravye-metaco-creta-2016-kit'"))
        except Exception:
            pass

    # Копируем фото из новые_фото → frontend/public/products
    _copy_auto_photos()

    # Добавляем новые категории и товары (только если ещё нет)
    await _seed_auto_categories()


@app.get("/")
def read_root():
    return {"message": "Welcome to NIKA Backend API"}
