import sqlite3
import shutil
import json
import os

PHOTO_DIR = r"E:\Users\username\Desktop\nika\фото"
PUBLIC_PRODUCTS_DIR = r"E:\Users\username\Desktop\nika\frontend\public\products"
DB_PATH = r"E:\Users\username\Desktop\nika\backend\nika.db"

PHOTO_MAP = {
    "Короб №19 пятислойный, 600×400×400 мм": "Короб №19 пятислойный, мм",
    "Клейкая лента прозрачная 48мм × 150м × 45мкм": "Клейкая лента прозрачная, 48мм150м45мкм",
    "Стрейч-плёнка прозрачная, микро-ролик 125 мм, 20 мкм, 0.5 кг": "Стрейч пленка прозрачная, микро-ролик, 125 мм, 20 мкм, 0.5 кг",
    "Стрейч-плёнка прозрачная в рулоне 500 мм, 20 мкм, 2 кг": "Стрейч пленка прозрачная в рулоне, 500 мм, 20 мкм, 2 кг",
    "Подпергамент в листах 0.84×0.7 м, 10 кг (350 листов)": "Подпергамент в листах, 0.840.7 м, 10 кг, 350 листов",
    "ВПП «Стандарт» двухслойная 1.2м × 100м": "ВПП Стандарт Двухслойная 1,2м100м"
}

def main():
    if not os.path.exists(PUBLIC_PRODUCTS_DIR):
        os.makedirs(PUBLIC_PRODUCTS_DIR)
        
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    updated_count = 0
    missing_count = 0

    for db_name, photo_base in PHOTO_MAP.items():
        photo1 = f"{photo_base}.jpg"
        photo2 = f"{photo_base}_2.jpg"
        
        src1 = os.path.join(PHOTO_DIR, photo1)
        src2 = os.path.join(PHOTO_DIR, photo2)
        
        dst1 = os.path.join(PUBLIC_PRODUCTS_DIR, photo1)
        dst2 = os.path.join(PUBLIC_PRODUCTS_DIR, photo2)
        
        if os.path.exists(src1):
            shutil.copy2(src1, dst1)
            image_urls = [f"/products/{photo1}"]
            
            if os.path.exists(src2):
                shutil.copy2(src2, dst2)
                image_urls.append(f"/products/{photo2}")
            
            cursor.execute("UPDATE products SET image_urls = ? WHERE name = ?", (json.dumps(image_urls, ensure_ascii=False), db_name))
            if cursor.rowcount > 0:
                print(f"✅ Обновлен товар '{db_name}': {image_urls}")
                updated_count += 1
            else:
                print(f"⚠️ Товар '{db_name}' найден в маппинге, но не найден в БД!")
                missing_count += 1
        else:
            print(f"❌ Не найдены фото для '{db_name}' (искали '{src1}')")
            missing_count += 1

    conn.commit()
    conn.close()

    print(f"\nИтог: Обновлено товаров - {updated_count}. Ошибок/Не найдено - {missing_count}.")

if __name__ == '__main__':
    main()
