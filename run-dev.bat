@echo off
echo ========================================
echo   Space Apps - Desarrollo Local
echo ========================================
echo.

echo Iniciando servicios...
echo.

echo [1/2] Iniciando Backend FastAPI...
start cmd /k "cd backend && python -m venv venv && call venv\Scripts\activate && pip install -r requirements.txt && python run.py"

timeout /t 3 /nobreak > nul

echo [2/2] Iniciando Frontend Vue.js...
start cmd /k "cd frontend && npm run serve"

echo.
echo ========================================
echo Servicios iniciados:
echo - Backend: http://localhost:8000
echo - Frontend: http://localhost:8080
echo - API Docs: http://localhost:8000/docs
echo ========================================
echo.
echo Presiona cualquier tecla para cerrar...
pause > nul
