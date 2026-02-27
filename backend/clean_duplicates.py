import asyncio
from sqlalchemy.future import select
from database import AsyncSessionLocal
import models
import os

async def clean_duplicates():
    async with AsyncSessionLocal() as db:
        # fetch all categories
        res = await db.execute(select(models.Category))
        categories = res.scalars().all()
        
        seen_names = {}
        for cat in categories:
            if cat.name in seen_names:
                print(f"Duplicate Category: {cat.name} (ID: {cat.id}, Slug: {cat.slug})")
                
                # Option 1: Re-assign products to the first category we found, then delete this one
                orig_cat = seen_names[cat.name]
                res_prods = await db.execute(select(models.Product).where(models.Product.category_id == cat.id))
                prods = res_prods.scalars().all()
                
                for p in prods:
                    print(f"  Re-assigning product {p.name} from cat {cat.id} to {orig_cat.id}")
                    p.category_id = orig_cat.id
                
                # Delete duplicate category
                print(f"  Deleting category {cat.id}")
                await db.delete(cat)
                
            else:
                seen_names[cat.name] = cat
                
        await db.commit()
        print("Done cleaning duplicates")

if __name__ == "__main__":
    asyncio.run(clean_duplicates())
