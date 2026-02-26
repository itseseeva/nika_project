from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import joinedload
import models
import schemas

async def get_categories(db: AsyncSession):
    result = await db.execute(select(models.Category))
    return result.scalars().all()

async def get_products(db: AsyncSession, category_id: int = None, is_admin: bool = False):
    query = select(models.Product).options(joinedload(models.Product.category))
    if category_id:
        query = query.filter(models.Product.category_id == category_id)
    if not is_admin:
        query = query.filter((models.Product.is_hidden == False) | (models.Product.is_hidden == None))
    result = await db.execute(query)
    return result.scalars().all()

async def get_product_by_slug(db: AsyncSession, slug: str, is_admin: bool = False):
    query = select(models.Product).options(joinedload(models.Product.category)).filter(models.Product.slug == slug)
    if not is_admin:
        query = query.filter(models.Product.is_hidden == False)
    result = await db.execute(query)
    return result.scalars().first()
