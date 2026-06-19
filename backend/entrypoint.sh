#!/bin/sh
set -e

echo "Esperando a que MySQL este listo..."
until python -c "
import os, sys
try:
    from sqlalchemy import create_engine, text
    engine = create_engine(os.environ['DATABASE_URL'])
    with engine.connect() as conn:
        conn.execute(text('SELECT 1'))
    sys.exit(0)
except Exception:
    sys.exit(1)
" 2>/dev/null; do
  echo "MySQL no disponible, reintentando en 2 segundos..."
  sleep 2
done

echo "Inicializando base de datos..."
python seed.py

echo "Iniciando servidor..."
exec gunicorn -w 2 -b 0.0.0.0:5000 run:app
