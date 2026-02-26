from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import joinedload
import models
import schemas
import uuid

async def _generate_unique_slug(db: AsyncSession, model, base_slug: str):
    slug = base_slug
    # Check if slug exists
    res = await db.execute(select(model).filter(model.slug == slug))
    if not res.scalar_one_or_none():
        return slug
    
    # If exists, append unique suffix
    return f"{base_slug}-{uuid.uuid4().hex[:6]}"

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

async def create_category(db: AsyncSession, category: schemas.CategoryCreate):
    data = category.model_dump()
    data['slug'] = await _generate_unique_slug(db, models.Category, data['slug'])
    db_category = models.Category(**data)
    db.add(db_category)
    await db.commit()
    await db.refresh(db_category)
    return db_category

async def create_product(db: AsyncSession, product: schemas.ProductCreate):
    data = product.model_dump()
    category_id = data.get('category_id')
    data['slug'] = await _generate_unique_slug(db, models.Product, data['slug'])
    db_product = models.Product(**data)
    db.add(db_product)
    await db.commit()
    await db.refresh(db_product)
    
    # Manually load category to avoid lazy loading issues during serialization
    if category_id:
        res = await db.execute(select(models.Category).filter(models.Category.id == category_id))
        db_product.category = res.scalar_one_or_none()
        
    return db_product
