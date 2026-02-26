import asyncio
from database import engine, Base, AsyncSessionLocal
import models

def u(photo_id: str) -> str:
    return f"https://images.unsplash.com/photo-{photo_id}?auto=format&fit=crop&w=600&q=80"

async def init_db():
    print("Creating tables...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as db:
        cat_workwear = models.Category(name="Спецодежда и СИЗ", slug="workwear")
        cat_packaging = models.Category(name="Упаковочные материалы", slug="packaging")
        db.add_all([cat_workwear, cat_packaging])
        await db.commit()

        workwear = [
            models.Product(
                name="Костюм утеплённый «Линкор»",
                slug="kostum-uteplennyj-linkor",
                description="Профессиональный утеплённый костюм «Линкор» для работы в условиях низких температур. Куртка + брюки. Сертифицированная продукция.",
                price=11110.0,
                image_urls=[u("1515041022473-f59adf28c950")],   # рабочая куртка
                category_id=cat_workwear.id,
                attributes={"Тип": "Утеплённый", "Материал": "Оксфорд", "В комплекте": "Куртка + брюки"}
            ),
            models.Product(
                name="Сапоги ПВХ «Геолэндер reBOOT»",
                slug="sapogi-pvh-geolender-reboot",
                description="Надёжные сапоги из ПВХ «Геолэндер reBOOT». Водонепроницаемые, морозостойкие.",
                price=459.0,
                image_urls=[u("1608256246200-53e635b5b65f")],   # резиновые сапоги
                category_id=cat_workwear.id,
                attributes={"Материал": "ПВХ", "Назначение": "Для улицы и цеха"}
            ),
            models.Product(
                name="Сапоги ПВХ «Акватрек», КП, чёрные",
                slug="sapogi-pvh-akvatrek-chyornyj",
                description="Чёрные сапоги из ПВХ «Акватрек» с кевларовым подноском (КП).",
                price=990.0,
                image_urls=[u("1606107557195-0e29a4b5b4aa")],   # чёрные сапоги
                category_id=cat_workwear.id,
                attributes={"Материал": "ПВХ", "Защита": "Кевларовый подносок (КП)", "Цвет": "Чёрный"}
            ),
            models.Product(
                name="Перчатки «КЩС тип 2»",
                slug="perchatki-kshhs-tip-2",
                description="Резиновые перчатки «КЩС тип 2» — защита от кислот, щелочей и агрессивных химических растворов.",
                price=60.0,
                image_urls=[u("1583454110551-21f2fa2afe61")],   # жёлтые резиновые перчатки
                category_id=cat_workwear.id,
                attributes={"Тип": "КЩС тип 2", "Защита": "Кислоты и щёлочи"}
            ),
            models.Product(
                name="Ботинки Мастеров утеплённые с металлическим подноском",
                slug="botinki-masterov-uteplennye-metal-podnosok",
                description="Утеплённые рабочие ботинки с металлическим подноском и металлической стелькой. Защита от удара (200 Дж) и прокола.",
                price=1850.0,
                image_urls=[u("1542291026-7eec264c27ff")],      # рабочие ботинки
                category_id=cat_workwear.id,
                attributes={"Подносок": "Металлический", "Стелька": "Металлическая", "Цвет": "Чёрный"}
            ),
            models.Product(
                name="Костюм Магистраль утеплённый с СВП, жёлтый",
                slug="kostum-magistral-uteplennyj-svp-zhyoltyj",
                description="Утеплённый костюм «Магистраль» с сигнально-видимыми полосами (СВП). Жёлтый. Для дорожных работ.",
                price=10250.0,
                image_urls=[u("1581244277943-fe4a9c777189")],   # жёлтый строительный жилет
                category_id=cat_workwear.id,
                attributes={"Цвет": "Жёлтый", "СВП": "Есть", "Тип": "Утеплённый"}
            ),
            models.Product(
                name="Перчатки 7 нитей, 10 класс с ПВХ",
                slug="perchatki-7-nitej-10klass-pvh",
                description="Трикотажные перчатки 7 нитей 10 класса с точечным ПВХ покрытием. Надёжный хват и защита ладони.",
                price=18.0,
                image_urls=[u("1572635196237-14b3f281503f")],   # рабочие перчатки
                category_id=cat_workwear.id,
                attributes={"Нити": "7", "Класс вязки": "10", "Покрытие": "ПВХ точечное"}
            ),
            models.Product(
                name="Каска защитная оранжевая",
                slug="kaska-zashhitnaya-oranzhevaya",
                description="Лёгкая защитная каска из ударопрочного пластика. Оранжевый цвет. Регулируемое оголовье.",
                price=275.0,
                image_urls=[u("1504328345606-18bbc8c9d7d1")],   # оранжевая каска
                category_id=cat_workwear.id,
                attributes={"Цвет": "Оранжевый", "Материал": "Ударопрочный пластик"}
            ),
            models.Product(
                name="Наушники противошумные",
                slug="naushniki-protivoshumovye",
                description="Накладные наушники для защиты слуха от производственного шума. Складная конструкция.",
                price=280.0,
                image_urls=[u("1577174881658-0f30ed549adc")],   # наушники защитные
                category_id=cat_workwear.id,
                attributes={"Тип": "Накладные", "Назначение": "Защита слуха"}
            ),
            models.Product(
                name="Щиток сварщика",
                slug="shhitok-svarshchika",
                description="Сварочный щиток лицевой. Защищает лицо и шею от брызг металла и ультрафиолетового излучения.",
                price=500.0,
                image_urls=[u("1504307651254-35680f356dfd")],   # строительные работы / сварка
                category_id=cat_workwear.id,
                attributes={"Назначение": "Сварочные работы"}
            ),
            models.Product(
                name="Перчатки кожаные сварочные защитные",
                slug="perchatki-kozhanye-svarochnye-zashhitnye",
                description="Рабочие краги из воловьей кожи. Надёжная защита рук при сварке.",
                price=505.0,
                image_urls=[u("1614680376573-df3480f0c6ff")],   # кожаные перчатки
                category_id=cat_workwear.id,
                attributes={"Материал": "Воловья кожа", "Назначение": "Сварочные работы"}
            ),
        ]
        db.add_all(workwear)
        await db.commit()

        packaging = [
            models.Product(
                name="Короб №19 пятислойный, 600×400×400 мм",
                slug="korob-19-pyatislojnyj-600x400x400",
                description="Гофрокартонная коробка №19 (пятислойный картон Т23), 600×400×400 мм. До 25 кг.",
                price=120.0,
                image_urls=[u("1586281380349-632531db7ed4")],   # картонная коробка
                category_id=cat_packaging.id,
                attributes={"Размер": "600×400×400 мм", "Картон": "Т23 (5-слойный)", "Нагрузка": "до 25 кг"}
            ),
            models.Product(
                name="Клейкая лента прозрачная 48мм × 150м × 45мкм",
                slug="kleykaya-lenta-prozrachnaya-48x150",
                description="Прозрачная упаковочная лента 48 мм × 150 м × 45 мкм. Акриловый клей.",
                price=140.0,
                image_urls=[u("1589939705384-5185137a7f0f")],   # скотч / лента
                category_id=cat_packaging.id,
                attributes={"Ширина": "48 мм", "Длина": "150 м", "Толщина": "45 мкм"}
            ),
            models.Product(
                name="Стрейч-плёнка прозрачная, микро-ролик 125 мм, 20 мкм, 0.5 кг",
                slug="strejch-plenka-mikro-rolik-125mm",
                description="Компактный микро-ролик стрейч-плёнки 125 мм. Для ручного использования.",
                price=155.0,
                image_urls=[u("1607082349566-187342175e2f")],   # плёнка
                category_id=cat_packaging.id,
                attributes={"Ширина": "125 мм", "Толщина": "20 мкм", "Вес": "0.5 кг"}
            ),
            models.Product(
                name="Стрейч-плёнка прозрачная в рулоне 500 мм, 20 мкм, 2 кг",
                slug="strejch-plenka-rulon-500mm-2kg",
                description="Паллетная стрейч-плёнка 500 мм. Для обмотки паллет и крупных грузов.",
                price=450.0,
                image_urls=[u("1553531889-e6cf4d692b1b")],     # паллетная плёнка
                category_id=cat_packaging.id,
                attributes={"Ширина": "500 мм", "Толщина": "20 мкм", "Вес": "2 кг"}
            ),
            models.Product(
                name="Подпергамент в листах 0.84×0.7 м, 10 кг (350 листов)",
                slug="podpergament-listy-084x07-10kg",
                description="Подпергаментная бумага 0.84×0.7 м, жиростойкая. 350 листов (10 кг).",
                price=2500.0,
                image_urls=[u("1519682577862-22b62b24e493")],  # бумага листы
                category_id=cat_packaging.id,
                attributes={"Размер листа": "0.84×0.7 м", "Количество": "350 листов", "Вес упаковки": "10 кг"}
            ),
            models.Product(
                name="ВПП «Стандарт» двухслойная 1.2м × 100м",
                slug="vpp-standart-dvukhslojnaya-12x100",
                description="Воздушно-пузырчатая плёнка (ВПП) «Стандарт» двухслойная, 1.2 м × 100 м. Для хрупких товаров.",
                price=2000.0,
                image_urls=[u("1604187351574-c75ca79f5807")],  # пузырчатая плёнка
                category_id=cat_packaging.id,
                attributes={"Ширина": "1.2 м", "Длина рулона": "100 м", "Слойность": "2-слойная"}
            ),
        ]
        db.add_all(packaging)
        await db.commit()
        print(f"Done! {len(workwear)} workwear + {len(packaging)} packaging = {len(workwear)+len(packaging)} products total.")

if __name__ == "__main__":
    asyncio.run(init_db())
