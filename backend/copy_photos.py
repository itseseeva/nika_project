import shutil
import os

src_dir = r"E:\Users\username\.gemini\antigravity\brain\953da8fb-f51a-4251-b135-80eb119e0f61"
dst_dir = r"E:\Users\username\Desktop\promsell\frontend\public\temp_photo"

os.makedirs(dst_dir, exist_ok=True)

files = [
    ("hero_01_warehouse_1771764091857.png",  "01_склад.png"),
    ("hero_02_construction_1771764107524.png","02_стройплощадка.png"),
    ("hero_03_factory_1771764126989.png",     "03_завод.png"),
    ("hero_04_logistics_1771764148201.png",   "04_логистика.png"),
    ("hero_05_workwear_1771764164635.png",    "05_рабочие.png"),
    ("hero_06_welding_1771764198250.png",     "06_сварка.png"),
    ("hero_07_storage_1771764217009.png",     "07_хранилище.png"),
    ("hero_08_night_city_1771764237821.png",  "08_ночной_промрайон.png"),
    ("hero_09_supply_1771764258491.png",      "09_снабжение.png"),
]

for src_name, dst_name in files:
    src = os.path.join(src_dir, src_name)
    dst = os.path.join(dst_dir, dst_name)
    if os.path.exists(src):
        shutil.copy2(src, dst)
        size = os.path.getsize(dst) // 1024
        print(f"OK  {dst_name}  ({size} KB)")
    else:
        print(f"NOT FOUND: {src_name}")

print(f"\nDone. Files in {dst_dir}:")
for f in os.listdir(dst_dir):
    print(f"  {f}")
