
# Space Apps v1.0 - Análisis de Subíndices Normalizados

Aplicación web para análisis de datos espaciales con Machine Learning, desarrollada para NASA Space Apps Challenge.

## 🚀 Características

- **Análisis de Subíndices Normalizados**: Procesamiento de datos espaciales con algoritmos ML
- **Interfaz Moderna**: Frontend Vue.js 3 con diseño responsive
- **API REST**: Backend FastAPI con documentación automática
- **Machine Learning**: Integración con scikit-learn para normalización de datos
- **Visualización**: Gráficos interactivos con Chart.js

## 🛠️ Tecnologías

- **Frontend**: Vue.js 3 + Vue Router + Vuex + Axios
- **Backend**: Python FastAPI + scikit-learn + pandas
- **UI**: Vuetify + CSS3 con diseño NASA-inspired
- **Desarrollo**: Hot reload, proxy automático, linting

## 📋 Prerrequisitos

- **Python 3.9+** con pip
- **Node.js 16+** con npm
- **Git** (opcional)

## 🚀 Instalación y Ejecución

### Opción 1: Script Automático (Recomendado)

```bash
# Ejecutar el script de desarrollo
run-dev.bat
```

### Opción 2: Instalación Manual

#### Backend (FastAPI)
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python run.py
```

#### Frontend (Vue.js)
```bash
cd frontend
npm install
npm run serve
```

## 🌐 Acceder a la Aplicación

Una vez ejecutados ambos servicios:

- **Aplicación Principal**: http://localhost:8080
- **API Backend**: http://localhost:8000
- **Documentación API**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

## 📖 Uso

1. **Página de Inicio**: Diseño inspirado en NASA con información del proyecto
2. **Análisis**: Ingrese datos numéricos separados por comas
3. **Resultados**: Visualización de datos normalizados con opción de exportar

### Tipos de Normalización Disponibles

- **Min-Max Scaling**: Escala valores al rango [0,1]
- **Z-Score**: Media = 0, Desviación estándar = 1
- **Robust Scaling**: Basado en mediana y rango intercuartílico

## 🏗️ Arquitectura

```
space_apps_v1.0/
├── backend/          # API FastAPI
│   ├── app/
│   │   ├── main.py   # Configuración FastAPI
│   │   ├── core/     # Configuración
│   │   └── api/      # Endpoints (próximamente)
│   ├── requirements.txt
│   └── run.py        # Servidor desarrollo
├── frontend/         # Vue.js 3
│   ├── src/
│   │   ├── views/    # Páginas principales
│   │   ├── services/ # API client
│   │   ├── store/    # Vuex state management
│   │   └── router/   # Vue Router
│   └── vue.config.js # Proxy configuración
└── run-dev.bat       # Script desarrollo
```

## 🔧 Desarrollo

### Agregar Nuevos Endpoints

1. Crear endpoint en `backend/app/api/v1/endpoints/`
2. Actualizar `frontend/src/services/api.js`
3. Agregar acciones en `frontend/src/store/index.js`

### Próximas Funcionalidades

- [ ] Endpoints ML completos
- [ ] Modelos de Machine Learning avanzados
- [ ] Gráficos interactivos
- [ ] Exportación múltiple de formatos
- [ ] Autenticación de usuarios

## 🤝 Contribuir

1. Fork el proyecto
2. Crear rama para feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 🙏 Agradecimientos

- NASA Space Apps Challenge
- Comunidad Vue.js
- Comunidad FastAPI
- Contribuidores open source

---

**Desarrollado con ❤️ para explorar el universo de los datos espaciales**