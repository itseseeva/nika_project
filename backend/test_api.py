import httpx
import asyncio

async def test_get():
    async with httpx.AsyncClient(timeout=10) as client:
        print("Fetching /api/products...")
        try:
            r = await client.get('http://127.0.0.1:8000/api/products')
            print("Status code:", r.status_code)
            if r.status_code == 200:
                print("Num products:", len(r.json()))
            else:
                print("Response:", r.text)
        except Exception as e:
            print("Error:", e)

if __name__ == '__main__':
    asyncio.run(test_get())
