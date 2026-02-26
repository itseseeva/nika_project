import asyncio
from database import AsyncSessionLocal
import models
from sqlalchemy.future import select

async def add_items():
    async with AsyncSessionLocal() as db:
        # 1. Создание категорий
        categories_data = [
            {"name": "Масла и Смазки", "slug": "masla-i-smazki"},
            {"name": "Технические жидкости", "slug": "tekhnicheskie-zhidkosti"}
        ]
        
        categories = {}
        for cat_data in categories_data:
            res = await db.execute(select(models.Category).where(models.Category.slug == cat_data["slug"]))
            cat = res.scalar_one_or_none()
            if not cat:
                cat = models.Category(name=cat_data["name"], slug=cat_data["slug"])
                db.add(cat)
                await db.flush()
                print(f"Категория '{cat_data['name']}' создана.")
            else:
                print(f"Категория '{cat_data['name']}' уже существует.")
            categories[cat_data["slug"]] = cat

        # 2. Создание товаров
        products_data = [
            {
                "name": "Масло моторное 5W-40",
                "slug": "maslo-motornoe-5w-40",
                "price": 3500.0,
                "category_id": categories["masla-i-smazki"].id,
                "description": "Высококачественное моторное масло для современных двигателей.",
                "attributes": {"Вязкость": "5W-40"}
            },
            {
                "name": "Масло трансмиссионное 75W-90",
                "slug": "maslo-transmissionnoe-75w-90",
                "price": 1200.0,
                "category_id": categories["masla-i-smazki"].id,
                "description": "Трансмиссионное масло для механических коробок передач.",
                "attributes": {"Вязкость": "75W-90"}
            },
            {
                "name": "Омывайка зимняя -25°C",
                "slug": "omyvayka-zimnyaya-25c",
                "price": 500.0,
                "category_id": categories["tekhnicheskie-zhidkosti"].id,
                "description": "Незамерзающая жидкость для стеклоомывателя.",
                "attributes": {"Температура": "-25°C"}
            },
            {
                "name": "Тормозная жидкость DOT 4",
                "slug": "tormoznaya-zhidkost-dot-4",
                "price": 800.0,
                "category_id": categories["tekhnicheskie-zhidkosti"].id,
                "description": "Тормозная жидкость стандарта DOT 4.",
                "attributes": {"Стандарт": "DOT 4"}
            }
        ]

        for prod_data in products_data:
            res = await db.execute(select(models.Product).where(models.Product.slug == prod_data["slug"]))
            if not res.scalar_one_or_none():
                product = models.Product(**prod_data)
                db.add(product)
                print(f"Товар '{prod_data['name']}' добавлен.")
            else:
                print(f"Товар '{prod_data['name']}' уже существует.")
        
        await db.commit()
        print("Все изменения успешно сохранены.")

if __name__ == "__main__":
    asyncio.run(add_items())
