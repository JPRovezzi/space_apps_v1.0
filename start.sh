# Development start script for Node.js backend
#!/bin/bash

echo "========================================="
echo "  Space Apps - Desarrollo Local"
echo "========================================="
echo ""

echo "Iniciando servicios..."
echo ""

echo "[1/2] Iniciando Backend Node.js..."
cd backend && npm run dev &
BACKEND_PID=$!

sleep 3

echo "[2/2] Iniciando Frontend Vue.js..."
cd ../frontend && npm run serve &
FRONTEND_PID=$!

echo ""
echo "========================================="
echo "Servicios iniciados:"
echo "- Backend API: http://localhost:3000"
echo "- Frontend: http://localhost:8080"
echo "- API Health: http://localhost:3000/health"
echo "========================================="
echo ""
echo "Presiona Ctrl+C para detener los servicios"

# Función para manejar la señal de interrupción
cleanup() {
    echo ""
    echo "Deteniendo servicios..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "Servicios detenidos."
    exit 0
}

# Capturar señales de interrupción
trap cleanup SIGINT SIGTERM

# Mantener el script ejecutándose
wait
