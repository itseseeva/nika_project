# backend/Dockerfile

FROM python:3.10-slim

WORKDIR /app

# Устанавливаем системные зависимости, если нужно (например, для компиляции некоторых пакетов)
# RUN apt-get update && apt-get install -y --no-install-recommends gcc libsqlite3-dev && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Копируем остальной код
COPY . .

# Makes entrypoint executable
RUN chmod +x entrypoint.sh

# При запуске, создаем пустую директорию для базы данных, если её нет, хотя мы будем мапить её через volume
EXPOSE 8000

ENTRYPOINT ["./entrypoint.sh"]
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
