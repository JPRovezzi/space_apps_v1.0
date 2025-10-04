from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
import numpy as np

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

# Modelos de datos
class AnalysisRequest(BaseModel):
    data: List[float]
    normalization_type: str = "minmax"

class NormalizeRequest(BaseModel):
    data: List[float]
    normalization_type: str = "minmax"

@app.get("/")
async def root():
    return {"message": "Space Apps ML API", "status": "running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.post("/api/v1/analyze")
async def analyze_data(request: AnalysisRequest):
    """Analiza y normaliza datos usando algoritmos de ML"""
    try:
        if not request.data:
            raise HTTPException(status_code=400, detail="No data provided")

        # Normalizar datos
        data_array = np.array(request.data)

        if request.normalization_type == "minmax":
            normalized = (data_array - data_array.min()) / (data_array.max() - data_array.min())
        elif request.normalization_type == "zscore":
            normalized = (data_array - data_array.mean()) / data_array.std()
        else:
            # Default to minmax
            normalized = (data_array - data_array.min()) / (data_array.max() - data_array.min())

        normalized_list = normalized.tolist()

        # Calcular estadísticas
        statistics = {
            "original": {
                "count": len(request.data),
                "mean": float(data_array.mean()),
                "std": float(data_array.std()),
                "min": float(data_array.min()),
                "max": float(data_array.max()),
                "median": float(np.median(data_array))
            },
            "normalized": {
                "count": len(normalized_list),
                "mean": float(np.array(normalized_list).mean()),
                "std": float(np.array(normalized_list).std()),
                "min": float(min(normalized_list)),
                "max": float(max(normalized_list)),
                "median": float(np.median(normalized_list))
            }
        }

        return {
            "original_data": request.data,
            "normalized_data": normalized_list,
            "normalization_type": request.normalization_type,
            "statistics": statistics,
            "visualization_data": {
                "original": request.data,
                "normalized": normalized_list,
                "indices": list(range(len(request.data)))
            }
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing data: {str(e)}")

@app.post("/api/v1/normalize")
async def normalize_index(request: NormalizeRequest):
    """Normaliza un índice específico"""
    try:
        if not request.data:
            raise HTTPException(status_code=400, detail="No data provided")

        data_array = np.array(request.data)

        if request.normalization_type == "minmax":
            normalized = (data_array - data_array.min()) / (data_array.max() - data_array.min())
        elif request.normalization_type == "zscore":
            normalized = (data_array - data_array.mean()) / data_array.std()
        else:
            normalized = (data_array - data_array.min()) / (data_array.max() - data_array.min())

        return {
            "original_data": request.data,
            "normalized_data": normalized.tolist(),
            "normalization_type": request.normalization_type
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error normalizing data: {str(e)}")

@app.get("/api/v1/models")
async def get_models():
    """Obtiene la lista de modelos disponibles"""
    models = [
        {
            "id": "minmax",
            "name": "Min-Max Scaling",
            "description": "Escala los valores al rango [0, 1]"
        },
        {
            "id": "zscore",
            "name": "Z-Score Normalization",
            "description": "Normalización estándar con media 0 y desviación 1"
        },
        {
            "id": "robust",
            "name": "Robust Scaling",
            "description": "Escalado robusto usando mediana e IQR"
        }
    ]
    return {"models": models}

@app.post("/api/v1/upload-data")
async def upload_data_file(file: UploadFile = File(...)):
    """Sube y procesa un archivo de datos"""
    try:
        if not file.filename.endswith(('.csv', '.txt')):
            raise HTTPException(status_code=400, detail="Only CSV and TXT files are supported")

        content = await file.read()
        content_str = content.decode('utf-8')

        # Simple CSV parsing (first column)
        lines = content_str.strip().split('\n')
        data = []
        for line in lines[1:]:  # Skip header
            if line.strip():
                parts = line.split(',')
                if parts:
                    try:
                        data.append(float(parts[0].strip()))
                    except ValueError:
                        continue

        return {
            "filename": file.filename,
            "data": data,
            "count": len(data),
            "column": "first_column"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error uploading file: {str(e)}")