"""
Скачивает фото с avangard-sp.ru в frontend/public/products/
Потом обновляет базу данных с локальными путями /products/filename.jpg
"""
import os
import urllib.request
import ssl
import asyncio
from database import engine, Base, AsyncSessionLocal
import models

DEST = r'E:\Users\username\Desktop\nika\frontend\public\products'
os.makedirs(DEST, exist_ok=True)

IMAGES = [
    ("kostum_linkor.jpg",    "https://www.avangard-sp.ru/upload/resize_cache/iblock/94e/295_295_1/94eac186fea5b478121064dbb41a403d.jpg"),
    ("sapogi_pvh.jpg",       "https://www.avangard-sp.ru/upload/resize_cache/iblock/6bd/295_295_1/6bdc68fac7050cb9c68aa44fe6bcdf68.jpg"),
    ("perchatki_kshhs.jpg",  "https://www.avangard-sp.ru/upload/resize_cache/iblock/a14/295_295_1/bx7lf0rl9qe0jwxxj48i09qnbfxzyysh.jpg"),
    ("botinki.jpg",          "https://www.avangard-sp.ru/upload/resize_cache/iblock/fa0/295_295_1/fa00e7479655f8d9cedb84cee8ee024c.jpg"),
    ("kostum_zheltyj.jpg",   "https://www.avangard-sp.ru/upload/resize_cache/iblock/0a5/295_295_1/0a5a2f7edf8e02c7d9c052884c7d41b1.png"),
    ("perchatki_trikot.jpg", "https://www.avangard-sp.ru/upload/resize_cache/iblock/d78/295_295_1/4cjt0umjbyg7wllche9j2bowaqsjyduz.jpg"),
    ("kaska.jpg",            "https://www.avangard-sp.ru/upload/resize_cache/iblock/fe5/295_295_1/fe5d07eb9a3b06a8d94a1aae68e9e727.jpg"),
    ("naushniki.jpg",        "https://www.avangard-sp.ru/upload/resize_cache/iblock/6aa/295_295_1/6aa8357ce3db4e0be751cc0b8c9590f1.jpg"),
    ("shhitok.jpg",          "https://www.avangard-sp.ru/upload/resize_cache/iblock/76c/295_295_1/76ca37facbf3ea69d535c7f20a924b39.jpg"),
    ("kragy.jpg",            "https://www.avangard-sp.ru/upload/resize_cache/iblock/fe8/295_295_1/fe8d937bd9e5f10e3ae8241d6584ca8c.jpg"),
    ("korob.jpg",            "https://spb-basket-cdn-05.geobasket.ru/vol4982/part498298/498298220/images/c516x688/1.webp"),
    ("strejch.jpg",          "https://spb-basket-cdn-09.geobasket.ru/vol2293/part229327/229327524/images/c516x688/1.webp"),
]

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
    'Referer': 'https://www.avangard-sp.ru/',
}
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

downloaded = {}

print("=== Downloading images ===")
for fname, url in IMAGES:
    dest = os.path.join(DEST, fname)
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, context=ctx, timeout=15) as resp:
            data = resp.read()
        if len(data) < 500:
            raise Exception(f"Too small ({len(data)} bytes)")
        with open(dest, 'wb') as f:
            f.write(data)
        print(f"[OK]   {fname}  ({len(data)//1024} KB)")
        downloaded[fname] = True
    except Exception as e:
        print(f"[FAIL] {fname}: {e}")
        downloaded[fname] = False

print()

def img(fname, fallback_fname=None):
    """Возвращает /products/fname если скачано, иначе fallback или None"""
    if downloaded.get(fname):
        return f"/products/{fname}"
    if fallback_fname and downloaded.get(fallback_fname):
        return f"/products/{fallback_fname}"
    return None

async def update_db():
    print("=== Updating DB ===")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)

    def pick(fname, fallback=None, ext_url=None):
        p = img(fname, fallback)
        if p:
            return [p]
        return [ext_url] if ext_url else [f"/products/{fname}"]

    async with AsyncSessionLocal() as db:
        cat_workwear = models.Category(name="Спецодежда и СИЗ", slug="workwear")
        cat_packaging = models.Category(name="Упаковочные материалы", slug="packaging")
        db.add_all([cat_workwear, cat_packaging])
        await db.commit()

        workwear = [
            models.Product(name="Костюм утеплённый «Линкор»", slug="kostum-uteplennyj-linkor",
                description="Профессиональный утеплённый костюм «Линкор» (куртка + брюки) для работы в условиях низких температур.",
                price=11110.0, image_urls=pick("kostum_linkor.jpg"), category_id=cat_workwear.id,
                attributes={"Тип": "Утеплённый", "Материал": "Оксфорд", "В комплекте": "Куртка + брюки"}),
            models.Product(name="Сапоги ПВХ «Геолэндер reBOOT»", slug="sapogi-pvh-geolender-reboot",
                description="Надёжные сапоги из ПВХ «Геолэндер reBOOT». Водонепроницаемые, морозостойкие.",
                price=459.0, image_urls=pick("sapogi_pvh.jpg"), category_id=cat_workwear.id,
                attributes={"Материал": "ПВХ", "Назначение": "Для улицы и цеха"}),
            models.Product(name="Сапоги ПВХ «Акватрек», КП, чёрные", slug="sapogi-pvh-akvatrek-chyornyj",
                description="Чёрные сапоги из ПВХ «Акватрек» с кевларовым подноском (КП).",
                price=990.0, image_urls=pick("sapogi_pvh.jpg"), category_id=cat_workwear.id,
                attributes={"Материал": "ПВХ", "Защита": "Кевларовый подносок (КП)", "Цвет": "Чёрный"}),
            models.Product(name="Перчатки «КЩС тип 2»", slug="perchatki-kshhs-tip-2",
                description="Резиновые перчатки «КЩС тип 2» — защита от кислот, щелочей и агрессивных химических растворов.",
                price=60.0, image_urls=pick("perchatki_kshhs.jpg"), category_id=cat_workwear.id,
                attributes={"Тип": "КЩС тип 2", "Защита": "Кислоты и щёлочи"}),
            models.Product(name="Ботинки Мастеров утеплённые с металлическим подноском", slug="botinki-masterov-uteplennye-metal-podnosok",
                description="Утеплённые рабочие ботинки с металлическим подноском и стелькой. Защита от удара (200 Дж) и прокола.",
                price=1850.0, image_urls=pick("botinki.jpg"), category_id=cat_workwear.id,
                attributes={"Подносок": "Металлический", "Стелька": "Металлическая", "Цвет": "Чёрный"}),
            models.Product(name="Костюм Магистраль утеплённый с СВП, жёлтый", slug="kostum-magistral-uteplennyj-svp-zhyoltyj",
                description="Утеплённый костюм «Магистраль» с сигнально-видимыми полосами (СВП). Жёлтый. Для дорожных работ.",
                price=10250.0, image_urls=pick("kostum_zheltyj.jpg"), category_id=cat_workwear.id,
                attributes={"Цвет": "Жёлтый", "СВП": "Есть", "Тип": "Утеплённый"}),
            models.Product(name="Перчатки 7 нитей, 10 класс с ПВХ", slug="perchatki-7-nitej-10klass-pvh",
                description="Трикотажные перчатки 7 нитей 10 класса с точечным ПВХ покрытием. Надёжный хват.",
                price=18.0, image_urls=pick("perchatki_trikot.jpg"), category_id=cat_workwear.id,
                attributes={"Нити": "7", "Класс вязки": "10", "Покрытие": "ПВХ точечное"}),
            models.Product(name="Каска защитная оранжевая", slug="kaska-zashhitnaya-oranzhevaya",
                description="Лёгкая защитная каска из ударопрочного пластика. Оранжевый цвет. Регулируемое оголовье.",
                price=275.0, image_urls=pick("kaska.jpg"), category_id=cat_workwear.id,
                attributes={"Цвет": "Оранжевый", "Материал": "Ударопрочный пластик"}),
            models.Product(name="Наушники противошумные", slug="naushniki-protivoshumovye",
                description="Накладные наушники для защиты слуха от производственного шума.",
                price=280.0, image_urls=pick("naushniki.jpg"), category_id=cat_workwear.id,
                attributes={"Тип": "Накладные", "Назначение": "Защита слуха"}),
            models.Product(name="Щиток сварщика", slug="shhitok-svarshchika",
                description="Сварочный щиток лицевой. Защищает лицо и шею от брызг металла и ультрафиолетового излучения.",
                price=500.0, image_urls=pick("shhitok.jpg"), category_id=cat_workwear.id,
                attributes={"Назначение": "Сварочные работы"}),
            models.Product(name="Перчатки кожаные сварочные защитные", slug="perchatki-kozhanye-svarochnye-zashhitnye",
                description="Рабочие краги из воловьей кожи. Надёжная защита рук при сварке.",
                price=505.0, image_urls=pick("kragy.jpg"), category_id=cat_workwear.id,
                attributes={"Материал": "Воловья кожа", "Назначение": "Сварочные работы"}),
        ]
        db.add_all(workwear)
        await db.commit()

        packaging = [
            models.Product(name="Короб №19 пятислойный, 600×400×400 мм", slug="korob-19-pyatislojnyj-600x400x400",
                description="Гофрокартонная коробка №19 (пятислойный картон Т23), 600×400×400 мм. До 25 кг.",
                price=120.0, image_urls=pick("korob.jpg"), category_id=cat_packaging.id,
                attributes={"Размер": "600×400×400 мм", "Картон": "Т23 (5-слойный)", "Нагрузка": "до 25 кг"}),
            models.Product(name="Клейкая лента прозрачная 48мм × 150м × 45мкм", slug="kleykaya-lenta-prozrachnaya-48x150",
                description="Прозрачная упаковочная лента 48 мм × 150 м × 45 мкм. Акриловый клей.",
                price=140.0, image_urls=pick("strejch.jpg"), category_id=cat_packaging.id,
                attributes={"Ширина": "48 мм", "Длина": "150 м", "Толщина": "45 мкм"}),
            models.Product(name="Стрейч-плёнка прозрачная, микро-ролик 125 мм, 20 мкм, 0.5 кг", slug="strejch-plenka-mikro-rolik-125mm",
                description="Компактный микро-ролик стрейч-плёнки 125 мм. Для ручного использования.",
                price=155.0, image_urls=pick("strejch.jpg"), category_id=cat_packaging.id,
                attributes={"Ширина": "125 мм", "Толщина": "20 мкм", "Вес": "0.5 кг"}),
            models.Product(name="Стрейч-плёнка прозрачная в рулоне 500 мм, 20 мкм, 2 кг", slug="strejch-plenka-rulon-500mm-2kg",
                description="Паллетная стрейч-плёнка 500 мм. Для обмотки паллет и крупных грузов.",
                price=450.0, image_urls=pick("strejch.jpg"), category_id=cat_packaging.id,
                attributes={"Ширина": "500 мм", "Толщина": "20 мкм", "Вес": "2 кг"}),
            models.Product(name="Подпергамент в листах 0.84×0.7 м, 10 кг (350 листов)", slug="podpergament-listy-084x07-10kg",
                description="Подпергаментная бумага 0.84×0.7 м, жиростойкая. 350 листов (10 кг).",
                price=2500.0, image_urls=pick("korob.jpg"), category_id=cat_packaging.id,
                attributes={"Размер листа": "0.84×0.7 м", "Количество": "350 листов", "Вес упаковки": "10 кг"}),
            models.Product(name="ВПП «Стандарт» двухслойная 1.2м × 100м", slug="vpp-standart-dvukhslojnaya-12x100",
                description="Воздушно-пузырчатая плёнка (ВПП) «Стандарт» двухслойная, 1.2 м × 100 м. Для хрупких товаров.",
                price=2000.0, image_urls=pick("strejch.jpg"), category_id=cat_packaging.id,
                attributes={"Ширина": "1.2 м", "Длина рулона": "100 м", "Слойность": "2-слойная"}),
        ]
        db.add_all(packaging)
        await db.commit()
        print(f"Done! DB updated with {len(workwear)+len(packaging)} products.")

asyncio.run(update_db())
