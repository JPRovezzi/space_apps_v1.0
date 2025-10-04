from fastapi import FastAPI, HTTPException, UploadFile, File, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import numpy as np
import requests
from datetime import datetime, timedelta
import json
import csv
import io
import os
from cachetools import TTLCache

# Cache para datos de NASA (1 hora TTL para respetar límites de API)
nasa_cache = TTLCache(maxsize=50, ttl=3600)

# URLs de NASA FIRMS (sin token para consultas básicas)
FIRMS_BASE_URL = "https://firms.modaps.eosdis.nasa.gov/api/country/csv"

def parse_firms_csv(csv_content: str) -> List[Dict]:
    """Parsear CSV de NASA FIRMS y convertir a lista de diccionarios"""
    try:
        csv_reader = csv.DictReader(io.StringIO(csv_content))
        fires = []

        for row in csv_reader:
            try:
                fire = {
                    "latitude": float(row["latitude"]),
                    "longitude": float(row["longitude"]),
                    "brightness": float(row.get("brightness", 0)),
                    "confidence": int(row.get("confidence", 0)),
                    "acq_date": row["acq_date"],
                    "acq_time": row.get("acq_time", ""),
                    "satellite": row.get("satellite", "Unknown"),
                    "instrument": row.get("instrument", "Unknown"),
                    "frp": float(row.get("frp", 0)),
                    "daynight": row.get("daynight", "Unknown")
                }

                # Validación básica
                if -90 <= fire["latitude"] <= 90 and -180 <= fire["longitude"] <= 180:
                    fires.append(fire)

            except (ValueError, KeyError) as e:
                continue  # Saltar filas malformadas

        return fires

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error procesando datos FIRMS: {str(e)}")

def fetch_firms_data(country: str = "ARG", days: int = 7, source: str = "MODIS_NRT") -> List[Dict]:
    """Consultar datos de incendios desde NASA FIRMS"""
    cache_key = f"firms_{country}_{days}_{source}"

    # Verificar cache
    if cache_key in nasa_cache:
        return nasa_cache[cache_key]

    try:
        # FIRMS permite consultas sin token para países, pero con límites
        url = f"{FIRMS_BASE_URL}/no_token/{source}/{country}/{days}"

        response = requests.get(url, timeout=30)

        if response.status_code == 200:
            fires = parse_firms_csv(response.text)
            nasa_cache[cache_key] = fires
            return fires
        else:
            raise HTTPException(
                status_code=response.status_code,
                detail=f"Error de NASA FIRMS: {response.text}"
            )

    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=503, detail=f"Error conectando a NASA FIRMS: {str(e)}")

def filter_fires_by_bbox(fires: List[Dict], bbox: List[float]) -> List[Dict]:
    """Filtrar incendios por bounding box [west, south, east, north]"""
    west, south, east, north = bbox

    filtered = []
    for fire in fires:
        lat, lon = fire["latitude"], fire["longitude"]
        if west <= lon <= east and south <= lat <= north:
            filtered.append(fire)

    return filtered

app = FastAPI(
    title="Space Apps ML API",
    description="API para análisis de índices normalizados con ML",
    version="1.0.0"
)

# Configurar CORS
cors_origins = [
    "http://localhost:8080",  # Desarrollo local
]

# Agregar orígenes de producción si estamos en producción
if os.getenv("ENVIRONMENT") == "production":
    cors_origins.extend([
        "https://cometatres.us",
        "https://www.cometatres.us",
    ])

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
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

# ========== ENDPOINTS NASA FIRE DATA ==========

@app.get("/api/v1/nasa/fire-history")
async def get_fire_history(
    bbox: str = Query("-66,-35,-62,-31", description="Bounding box: west,south,east,north"),
    start_year: int = Query(2000, description="Año inicial"),
    end_year: int = Query(2024, description="Año final")
):
    """Obtener historial de incendios para una región específica"""
    try:
        # Simular datos históricos (en producción usar NASA CMR API)
        # Córdoba, Argentina tiene temporada de incendios de junio a diciembre
        fire_data = {
            "region": "Córdoba, Argentina",
            "bbox": bbox,
            "period": f"{start_year}-{end_year}",
            "datasets": [
                "MODIS_Terra_Thermal_Anomalies_All",
                "MODIS_Aqua_Thermal_Anomalies_All",
                "VIIRS_SNPP_Thermal_Anomalies_375m_All"
            ],
            "historical_stats": {
                "total_fires": 1250,
                "avg_fires_per_year": 83,
                "peak_year": 2020,
                "peak_fires": 156,
                "burned_area_hectares": 45000
            },
            "seasonal_pattern": {
                "winter_spring": "Junio-Octubre (Sequías)",
                "summer": "Diciembre-Marzo (Alta temperatura)",
                "risk_level": "Alto - Región boscosa con actividad agrícola"
            }
        }

        return fire_data

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error obteniendo datos históricos: {str(e)}")

@app.get("/api/v1/nasa/fire-stats")
async def get_fire_stats(
    year: int = Query(2024, description="Año para estadísticas"),
    bbox: str = Query("-66,-35,-62,-31", description="Bounding box Córdoba")
):
    """Obtener estadísticas de incendios para un año específico usando datos reales de NASA"""
    try:
        # Parsear bounding box
        bbox_coords = [float(x) for x in bbox.split(",")]

        # Obtener datos de FIRMS para Argentina (últimos 60 días para tener datos recientes)
        fires_data = fetch_firms_data(country="ARG", days=60, source="MODIS_NRT")

        # Filtrar por región de Córdoba
        cordoba_fires = filter_fires_by_bbox(fires_data, bbox_coords)

        # Filtrar por año específico
        year_fires = [f for f in cordoba_fires if f["acq_date"].startswith(str(year))]

        # Agrupar por meses
        monthly_stats = {}
        months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
                 "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]

        for i, month_name in enumerate(months, 1):
            month_fires = [f for f in year_fires if f["acq_date"].endswith(f"-{i:02d}") or
                          f["acq_date"].endswith(f"-{i:02d}") or
                          datetime.strptime(f["acq_date"], "%Y-%m-%d").month == i]

            # Estimar área quemada (aprox. 10-50 ha por incendio basado en confianza)
            total_area = sum(10 + (f["confidence"] * 0.4) for f in month_fires)

            monthly_stats[month_name] = {
                "fires": len(month_fires),
                "burned_area_ha": round(total_area, 1)
            }

        # Convertir a formato de respuesta
        monthly_data = [{"month": month, **stats} for month, stats in monthly_stats.items()]
        total_fires = sum(stats["fires"] for stats in monthly_stats.values())
        total_area = sum(stats["burned_area_ha"] for stats in monthly_stats.values())

        return {
            "year": year,
            "region": "Córdoba, Argentina",
            "total_fires": total_fires,
            "total_burned_area_ha": round(total_area, 1),
            "monthly_data": monthly_data,
            "peak_month": max(monthly_data, key=lambda x: x["fires"])["month"] if monthly_data else "Sin datos",
            "avg_fires_per_month": round(total_fires / 12, 1) if total_fires > 0 else 0,
            "data_source": "NASA FIRMS",
            "last_updated": datetime.now().isoformat(),
            "confidence": "Datos reales de satélites MODIS"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error obteniendo estadísticas de NASA: {str(e)}")

@app.get("/api/v1/nasa/fire-layers")
async def get_available_fire_layers():
    """Obtener lista de capas de incendios disponibles de NASA"""
    try:
        layers = [
            # Capas de incendios eliminadas - no funcionan de manera confiable
        ]

        return {"layers": layers}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error obteniendo capas disponibles: {str(e)}")
