from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
import shutil

import crud
import schemas
import auth
import models
from database import get_db
import os
from dotenv import load_dotenv
import httpx
from pydantic import BaseModel

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '.env'))

# Папка для хранения фото товаров
PRODUCTS_PHOTO_DIR = os.path.join(os.path.dirname(__file__), '..', 'frontend', 'public', 'products')
os.makedirs(PRODUCTS_PHOTO_DIR, exist_ok=True)

router = APIRouter()
router.include_router(auth.router)

@router.get("/categories", response_model=List[schemas.Category])
async def read_categories(db: AsyncSession = Depends(get_db)):
    categories = await crud.get_categories(db)
    return categories

@router.get("/products", response_model=List[schemas.Product])
async def read_products(category_id: int = None, db: AsyncSession = Depends(get_db), current_user: models.User = Depends(auth.get_current_user_optional)):
    is_admin = current_user.is_admin if current_user else False
    products = await crud.get_products(db, category_id=category_id, is_admin=is_admin)
    return products

@router.get("/products/{slug}", response_model=schemas.Product)
async def read_product(slug: str, db: AsyncSession = Depends(get_db), current_user: models.User = Depends(auth.get_current_user_optional)):
    is_admin = current_user.is_admin if current_user else False
    product = await crud.get_product_by_slug(db, slug=slug, is_admin=is_admin)
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.post("/products/{product_id}/toggle_hide")
async def toggle_product_hide(product_id: int, db: AsyncSession = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    from sqlalchemy.future import select
    result = await db.execute(select(models.Product).filter(models.Product.id == product_id))
    product = result.scalar_one_or_none()
    
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
        
    product.is_hidden = not product.is_hidden
    await db.commit()
    return {"message": "Product hide status toggled", "is_hidden": product.is_hidden}

@router.delete("/products/{product_id}")
async def delete_product(product_id: int, db: AsyncSession = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not enough permissions")

    from sqlalchemy.future import select
    result = await db.execute(select(models.Product).filter(models.Product.id == product_id))
    product = result.scalar_one_or_none()

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    await db.delete(product)
    await db.commit()
    return {"message": "Product deleted", "id": product_id}


@router.delete("/products/{product_id}/image/{index}")
async def delete_product_image(
    product_id: int,
    index: int,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not enough permissions")

    from sqlalchemy.future import select
    result = await db.execute(select(models.Product).filter(models.Product.id == product_id))
    product = result.scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    urls: list = list(product.image_urls or [])
    if index < 0 or index >= len(urls):
        raise HTTPException(status_code=400, detail="Invalid image index")

    urls.pop(index)
    product.image_urls = urls
    await db.commit()
    return {"message": "Image deleted", "image_urls": urls}


@router.post("/products/{product_id}/upload-image")
async def upload_product_image(
    product_id: int,
    file: UploadFile = File(...),
    index: int = Form(0),          # 0 = первое фото, 1 = второе и т.д.
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not enough permissions")

    from sqlalchemy.future import select
    result = await db.execute(select(models.Product).filter(models.Product.id == product_id))
    product = result.scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    # Сохраняем файл
    ext = os.path.splitext(file.filename or "photo.jpg")[1] or ".jpg"
    filename = f"product_{product_id}_img{index}{ext}"
    filepath = os.path.join(PRODUCTS_PHOTO_DIR, filename)
    with open(filepath, "wb") as f:
        shutil.copyfileobj(file.file, f)

    # Обновляем image_urls
    urls: list = list(product.image_urls or [])
    public_url = f"/products/{filename}"
    if index < len(urls):
        urls[index] = public_url
    else:
        # Добавляем, заполняя пустые слоты если нужно
        while len(urls) < index:
            urls.append("")
        urls.append(public_url)

    product.image_urls = urls
    await db.commit()
    return {"message": "Image uploaded", "url": public_url, "image_urls": urls}

@router.post("/leads")
async def create_lead(lead_data: dict):
    # This is a mock endpoint to collect leads
    print(f"Received lead: {lead_data}")
    return {"status": "success", "message": "Lead received"}

# Модели для чата
class ChatMessage(BaseModel):
    role: str  # "user" или "assistant"
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]

@router.post("/chat")
async def chat_with_aleksey(request: ChatRequest):
    openrouter_key = os.getenv("OPENROUTER_KEY")
    if not openrouter_key:
        raise HTTPException(status_code=500, detail="OpenRouter API key not configured")

    # Читаем базу знаний (данные НИКА) 
    base_dir = os.path.dirname(__file__)
    kb_path = os.getenv("KB_PATH", os.path.join(base_dir, "..", "данные nika", "extracted"))
    knowledge_base = ""
    try:
        if os.path.exists(kb_path):
            for filename in os.listdir(kb_path):
                if filename.endswith(".txt"):
                    filepath = os.path.join(kb_path, filename)
                    with open(filepath, 'r', encoding='utf-8') as f:
                        knowledge_base += f"\n--- Содержимое документа {filename} ---\n"
                        knowledge_base += f.read()
                        knowledge_base += "\n"
    except Exception as e:
        print(f"Error reading knowledge base: {e}")

    # Формируем системный промпт
    system_prompt = f"""Ты — Алексей, вежливый и профессиональный менеджер по B2B-продажам компании 'НИКА'.
Твоя задача — консультировать клиентов, подбирать оптовые партии (спецодежда, запчасти, упаковка), обсуждать отсрочку платежа и условия доставки.
В первую очередь опирайся на предоставленную ниже информацию о компании.
Если клиент задает вопрос, ответа на который нет в базе, ты можешь придумать логичный ответ, исходя из контекста оптовой B2B-компании, или просто поддержать беседу на свободные темы, оставаясь в роли дружелюбного и профессионального менеджера Алексея. 
Пытайся быть полезным и вовлекать клиента в диалог.
Отвечай кратко, как живой человек (можно использовать эмодзи в меру).

--- ДАННЫЕ О КОМПАНИИ НИКА ---
{knowledge_base}
"""

    # Формируем сообщения для API OpenRouter
    api_messages = [{"role": "system", "content": system_prompt}]
    for msg in request.messages:
        api_messages.append({"role": msg.role, "content": msg.content})

    headers = {
        "Authorization": f"Bearer {openrouter_key}",
        "HTTP-Referer": "http://localhost:5173", # Замените на реальный домен
        "X-Title": "NIKA B2B", 
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": "mistralai/mistral-7b-instruct",
        "messages": api_messages,
        "temperature": 0.5 # Оптимальная температура для Mistral
    }

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                "https://openrouter.ai/api/v1/chat/completions",
                json=payload,
                headers=headers
            )
            response.raise_for_status()
            data = response.json()
            reply = data["choices"][0]["message"]["content"]
            return {"reply": reply}
    except Exception as e:
        print(f"OpenRouter Error: {e}")
        if isinstance(e, httpx.HTTPStatusError):
            print(f"Response: {e.response.text}")
        raise HTTPException(status_code=500, detail="Ошибка при обращении к ИИ")
