#!/bin/bash
echo "Starting Promsell E-commerce..."

echo "Starting Backend..."
(cd backend && source venv/Scripts/activate && uvicorn main:app --reload --port 8000) &

echo "Starting Frontend..."
(cd frontend && npm run dev) &

echo "Both services started in background!"
wait
