import asyncio
import os
import aiosqlite
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy import text
from dotenv import load_dotenv

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '.env'))

PG_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://postgres:Kohkau11999@postgres:5432/promsell")
SQLITE_DB = os.path.join(os.path.dirname(__file__), "data", "promsell.db")

async def sync():
    if not os.path.exists(SQLITE_DB):
        print(f"[SYNC] No local SQLite db found at {SQLITE_DB}. Skipping sync.")
        return

    print(f"[SYNC] Connecting to PostgreSQL at {PG_URL.split('@')[-1]}...")
    pg_engine = create_async_engine(PG_URL)
    PGSessionLocal = async_sessionmaker(bind=pg_engine, class_=AsyncSession, expire_on_commit=False)

    print(f"[SYNC] Connecting to SQLite at {SQLITE_DB}...")
    async with aiosqlite.connect(SQLITE_DB) as sqlite_conn:
        sqlite_conn.row_factory = aiosqlite.Row

        async with PGSessionLocal() as pg_db:
            
            # --- SYNC CATEGORIES ---
            print("[SYNC] Syncing Categories...")
            async with sqlite_conn.execute("SELECT * FROM categories") as cursor:
                async for row in cursor:
                    res = await pg_db.execute(text("SELECT id FROM categories WHERE id = :id"), {"id": row["id"]})
                    if not res.scalar_one_or_none():
                        await pg_db.execute(
                            text("INSERT INTO categories (id, name, slug) VALUES (:id, :name, :slug)"),
                            dict(row)
                        )
            
            # --- SYNC PRODUCTS ---
            print("[SYNC] Syncing Products...")
            async with sqlite_conn.execute("SELECT * FROM products") as cursor:
                async for row in cursor:
                    res = await pg_db.execute(text("SELECT id FROM products WHERE id = :id"), {"id": row["id"]})
                    if not res.scalar_one_or_none():
                        # Handle potential missing columns in old sqlite versions safely
                        row_dict = dict(row)
                        if "is_hidden" not in row_dict:
                            row_dict["is_hidden"] = False
                            
                        await pg_db.execute(
                            text("""
                                INSERT INTO products (id, name, slug, description, price, image_urls, attributes, category_id, is_hidden)
                                VALUES (:id, :name, :slug, :description, :price, :image_urls, :attributes, :category_id, :is_hidden)
                            """),
                            row_dict
                        )

            # --- SYNC USERS ---
            print("[SYNC] Syncing Users...")
            async with sqlite_conn.execute("SELECT * FROM users") as cursor:
                async for row in cursor:
                    res = await pg_db.execute(text("SELECT id FROM users WHERE id = :id"), {"id": row["id"]})
                    if not res.scalar_one_or_none():
                        row_dict = dict(row)
                        if "hashed_password" not in row_dict:
                            row_dict["hashed_password"] = None
                            
                        await pg_db.execute(
                            text("""
                                INSERT INTO users (id, email, hashed_password, is_active, is_admin, google_id, created_at)
                                VALUES (:id, :email, :hashed_password, :is_active, :is_admin, :google_id, :created_at)
                            """),
                            row_dict
                        )

            await pg_db.commit()
            print("[SYNC] Commit successful.")

    await pg_engine.dispose()
    print("[SYNC] Completed migrating SQLite -> Postgres.")

if __name__ == "__main__":
    asyncio.run(sync())
