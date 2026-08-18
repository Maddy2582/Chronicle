// Commands to start BE using Bash

cd /d/Chronicle/backend
source .venv/Scripts/activate
uvicorn main:app --reload (locally)
uvicorn main:app --reload --host 0.0.0.0 --port 8000 (to share the port)