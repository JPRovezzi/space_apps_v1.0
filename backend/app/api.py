from fastapi import APIRouter

router = APIRouter()

@router.get("/test")
async def test_endpoint():
    """Endpoint de prueba para verificar que el router funciona"""
    return {"message": "API router is working!"}

@router.get("/models")
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
