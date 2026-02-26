import asyncio
from database import AsyncSessionLocal
import models
from sqlalchemy.future import select

async def check_categories():
    async with AsyncSessionLocal() as db:
        for cat_id in [7, 8]:
            res = await db.execute(select(models.Category).where(models.Category.id == cat_id))
            cat = res.scalar_one_or_none()
            if cat:
                print(f"ID {cat_id}: {cat.name} (slug: {cat.slug})")
                # Также проверим количество товаров в этой категории
                prod_res = await db.execute(select(models.Product).where(models.Product.category_id == cat_id))
                prods = prod_res.scalars().all()
                print(f"  Товаров в категории: {len(prods)}")
                for p in prods:
                    print(f"    - {p.name} (slug: {p.slug})")
            else:
                print(f"ID {cat_id}: Не найдена")

if __name__ == "__main__":
    asyncio.run(check_categories())
