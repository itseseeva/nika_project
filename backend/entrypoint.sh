#!/bin/bash

# Ensure the alembic versions directory exists
mkdir -p alembic/versions

# Check if the versions directory is empty
if [ -z "$(ls -A alembic/versions/*.py 2>/dev/null)" ]; then
    echo "[ENTRYPOINT] No migrations found. Generating the initial migration..."
    # Generate the initial migration automatically
    alembic revision --autogenerate -m "Initial migration"
fi

echo "[ENTRYPOINT] Applying migrations..."
alembic upgrade head

echo "[ENTRYPOINT] Migrations complete. Starting application..."
exec "$@"
