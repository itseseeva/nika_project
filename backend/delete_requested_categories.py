import asyncio
from database import AsyncSessionLocal
import models
from sqlalchemy.future import select
from sqlalchemy import delete

async def delete_items():
    async with AsyncSessionLocal() as db:
        target_ids = [7, 8]
        
        # 1. Удаляем товары в этих категориях
        prod_del = delete(models.Product).where(models.Product.category_id.in_(target_ids))
        prod_res = await db.execute(prod_del)
        print(f"Удалено товаров: {prod_res.rowcount}")
        
        # 2. Удаляем сами категории
        cat_del = delete(models.Category).where(models.Category.id.in_(target_ids))
        cat_res = await db.execute(cat_del)
        print(f"Удалено категорий: {cat_res.rowcount}")
        
        await db.commit()
        print("Изменения зафиксированы в базе данных.")

if __name__ == "__main__":
    asyncio.run(delete_items())
