import zipfile, os, re

base = r'E:/Users/username/Desktop/promsell/данные promsell'

docs = [
    ('spec', 'Спецификация 16.02.2026.docx'),
    ('contract', 'договор запчасти.docx'),
    ('order2', 'заявка 2.docx'),
    ('order3', 'заявка 3.docx'),
    ('order4', 'заявка 4.docx'),
]

os.makedirs('E:/Users/username/Desktop/promsell/данные promsell/extracted', exist_ok=True)

for key, name in docs:
    path = os.path.join(base, name)
    print(f'=== {name} ===')
    try:
        with zipfile.ZipFile(path) as z:
            with z.open('word/document.xml') as f:
                content = f.read().decode('utf-8')
                text = re.sub(r'<[^>]+>', ' ', content)
                text = re.sub(r'\s+', ' ', text).strip()
                # Save to file
                out_path = f'E:/Users/username/Desktop/promsell/данные promsell/extracted/{key}.txt'
                with open(out_path, 'w', encoding='utf-8') as out:
                    out.write(text)
                print(f"Saved to {out_path} ({len(text)} chars)")
                print(text[:4000])
    except Exception as e:
        print(f'Error: {e}')
    print()
