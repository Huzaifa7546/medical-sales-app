import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from database import engine, Base, SessionLocal
from models import User
from routers import auth, medicines, sales
from routers.auth import get_password_hash

# Create database tables
Base.metadata.create_all(bind=engine)

# Seed default users on first run
db = SessionLocal()
if not db.query(User).first():
    db.add(User(username="admin", email="admin@huzzmed.com", password=get_password_hash("admin123"), role="admin"))
    db.add(User(username="operator", email="op@huzzmed.com", password=get_password_hash("op123"), role="user"))
    db.commit()
db.close()

app = FastAPI(
    title="Huzz.Medflow Professional API",
    description="Enterprise-grade medical store management system by Huzz",
    version="1.1.0"
)

ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "*").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS if ALLOWED_ORIGINS != ["*"] else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api")
app.include_router(medicines.router, prefix="/api")
app.include_router(sales.router, prefix="/api")

# Serve React Frontend
app.mount("/assets", StaticFiles(directory="../frontend/dist/assets"), name="assets")

@app.get("/{full_path:path}")
def serve_react_app(full_path: str):
    return FileResponse("../frontend/dist/index.html")

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8001))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
    # Restarted worker to load new FastAPI StaticFiles router
