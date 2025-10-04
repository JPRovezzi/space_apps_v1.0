from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Space Apps ML API",
    description="API para análisis de índices normalizados con ML",
    version="1.0.0"
)

# Configurar CORS para frontend local
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],  # Puerto de Vue
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Space Apps ML API", "status": "running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
