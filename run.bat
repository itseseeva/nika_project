@echo off
echo Starting Promsell E-commerce...

echo Starting Backend...
start cmd /k "cd backend && venv\Scripts\activate.bat && uvicorn main:app --reload --port 8000"

echo Starting Frontend...
start cmd /k "cd frontend && npm run dev"

echo Both services started in separate windows!
