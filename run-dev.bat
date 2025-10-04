@echo off
echo ========================================
echo   Space Apps - Desarrollo Local
echo ========================================
echo.

echo Iniciando servicios...
echo.

echo [1/2] Iniciando Backend Node.js...
start cmd /k "cd backend && npm run dev"

timeout /t 3 /nobreak > nul

echo [2/2] Iniciando Frontend Vue.js...
start cmd /k "cd frontend && npm run serve"

echo.
echo ========================================
echo Servicios iniciados:
echo - Backend API: http://localhost:3000
echo - Frontend: http://localhost:8080
echo - API Health: http://localhost:3000/health
echo ========================================
echo.
echo Presiona cualquier tecla para cerrar...
pause > nul
