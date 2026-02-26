import urllib.request
import ssl
import os

# Пробуем несколько изображений с avangard-sp.ru разного размера
CANDIDATES = [
    # Полноразмерные (не кеш) изображения Авангарда
    "https://www.avangard-sp.ru/upload/iblock/ffc/ffc34cb7db5826207e5ece8fc26cc843.jpg",
    "https://www.avangard-sp.ru/upload/iblock/94e/94eac186fea5b478121064dbb41a403d.jpg",
    "https://www.avangard-sp.ru/upload/iblock/0a5/0a5a2f7edf8e02c7d9c052884c7d41b1.png",
    # 1100_1000 кеш-вариант
    "https://www.avangard-sp.ru/upload/resize_cache/iblock/ffc/1100_1000_1/ffc34cb7db5826207e5ece8fc26cc843.jpg",
    "https://www.avangard-sp.ru/upload/resize_cache/iblock/94e/1100_1000_1/94eac186fea5b478121064dbb41a403d.jpg",
]

dest = r'E:\Users\username\Desktop\nika\frontend\public\hero_bg.jpg'
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Referer': 'https://www.avangard-sp.ru/',
}
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

for url in CANDIDATES:
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, context=ctx, timeout=15) as r:
            data = r.read()
        if len(data) < 5000:
            print(f'TOO SMALL ({len(data)}b): {url}')
            continue
        with open(dest, 'wb') as f:
            f.write(data)
        print(f'OK  {len(data)//1024} KB  →  {url}')
        break
    except Exception as e:
        print(f'FAIL: {url}\n     {e}')
else:
    print('All candidates failed.')
