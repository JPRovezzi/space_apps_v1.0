# Space Apps v1.0 - Análisis de Datos Espaciales

Aplicación web para análisis de datos espaciales y satélites, desarrollada para NASA Space Apps Challenge Córdoba.

## 🚀 Características

- **Análisis de Datos Espaciales**: Procesamiento de datos satelitales y meteorológicos
- **Interfaz Moderna**: Frontend Vue.js 3 con diseño responsive
- **API REST**: Backend Node.js/Express con middleware de seguridad
- **Data Processing**: Gestión de datos geoespaciales con análisis integrado
- **Visualización**: Mapas interactivos y gráficos de datos
- **Health Monitoring**: Sistema de monitoreo de estado de la API

## 🛠️ Tecnologías

- **Frontend**: Vue.js 3 + Vue Router + Vuex + Axios + Vuetify
- **Backend**: Node.js + Express.js + CORS + Helmet + Morgan
- **UI**: Diseño responsive con tema NASA-inspired
- **Desarrollo**: Hot reload, linting, configuración modular

## 🚀 Instalación y Ejecución

### Opción 1: Script Automático (Recomendado)

**Windows:**

```bash
# Ejecutar el script de desarrollo
run-dev.bat
```

**Linux/Mac:**

```bash
# Ejecutar el script de desarrollo
chmod +x start.sh
./start.sh
```

### Opción 2: Instalación Manual

#### Backend (Node.js)

```bash
cd backend
npm install
npm run dev  # Desarrollo con nodemon
# o
npm start    # Producción
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
- **API Backend**: http://localhost:3000
- **Health Check**: http://localhost:3000/health
- **API Info**: http://localhost:3000/api

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
├── backend/          # API Node.js/Express
│   ├── config/       # Configuración de la aplicación
│   ├── controllers/  # Controladores de rutas
│   ├── middleware/   # Middleware personalizado
│   ├── routes/       # Definición de rutas API
│   ├── server.js     # Servidor principal
│   ├── package.json  # Dependencias Node.js
│   └── README.md     # Documentación del backend
├── frontend/         # Vue.js 3
│   ├── src/
│   │   ├── views/    # Páginas principales
│   │   ├── services/ # API client
│   │   ├── store/    # Vuex state management
│   │   └── router/   # Vue Router
│   └── vue.config.js # Proxy configuración
├── run-dev.bat       # Script desarrollo (Windows)
├── start.sh          # Script desarrollo (Linux/Mac)
└── readme.md         # Documentación principal
```

## 🔧 Desarrollo

### Agregar Nuevos Endpoints

1. Crear controlador en `backend/controllers/`
2. Definir rutas en `backend/routes/`
3. Actualizar `frontend/src/services/api.js`
4. Agregar acciones en `frontend/src/store/index.js`

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
- Comunidad Node.js
- Comunidad Express.js
- Contribuidores open source

---

**Desarrollado con ❤️ para explorar el universo de los datos espaciales**
