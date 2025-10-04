import os
from typing import List

class Settings:
    # Configuración de la aplicación
    APP_NAME: str = "Space Apps ML API"
    DEBUG: bool = True

    # Configuración del servidor
    HOST: str = "localhost"
    PORT: int = 8000

    # CORS
    ALLOWED_ORIGINS: List[str] = ["http://localhost:8080"]

settings = Settings()
