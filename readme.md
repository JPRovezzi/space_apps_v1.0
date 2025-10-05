# Astrochingolo - Análisis de Riesgos Urbanos

Plataforma web innovadora que combina datos satelitales de NASA con análisis geoespacial avanzado para evaluar riesgos ambientales en la expansión urbana de la provincia de Córdoba, Argentina. Desarrollada para NASA Space Apps Challenge Córdoba 2025. Puede ver una vista previa del proyecto en: https://lovely-chebakia-bf37e1.netlify.app/

## 🚀 ¿Qué hace Astrochingolo?

Astrochingolo es una plataforma web que combina datos satelitales de NASA con análisis geoespacial avanzado para evaluar riesgos ambientales en la expansión urbana. La aplicación permite a urbanistas, planificadores y tomadores de decisiones visualizar y cuantificar riesgos como inundaciones, deslizamientos de tierra, incendios forestales y presión urbana sobre áreas protegidas.

### ¿Cómo funciona?

La plataforma integra múltiples fuentes de datos geoespaciales y satelitales para crear mapas de riesgo interactivos:

1. **Captura de Datos**: Integra datos de NASA, datos geoespaciales de la provincia de Córdoba y capas de riesgo generadas por algoritmos de análisis
2. **Procesamiento**: Aplica técnicas de normalización estadística para estandarizar datos heterogéneos
3. **Visualización**: Crea mapas superpuestos con capas de riesgo codificadas por colores, permitiendo análisis visual intuitivo
4. **Análisis Interactivo**: Los usuarios pueden activar/desactivar capas, ajustar opacidades y explorar riesgos específicos por ubicación

## 🚀 Características Principales

- **Mapas de Riesgo Interactivos**: Visualización superpuesta de múltiples capas de riesgo (inundaciones, deslizamientos, incendios, expansión urbana)
- **Integración con NASA APIs**: Datos en tiempo real de incendios forestales y datos satelitales
- **Análisis Estadístico**: Normalización de datos para comparación consistente entre diferentes tipos de riesgo
- **Interfaz Moderna**: Frontend Vue.js 3 con diseño responsive inspirado en NASA
- **API REST Robusta**: Backend Node.js/Express con middleware de seguridad y monitoreo de salud
- **Procesamiento Geoespacial**: Gestión avanzada de datos espaciales con límites provinciales y coordenadas precisas

## 💡 Beneficios del Proyecto

Astrochingolo ofrece múltiples ventajas para la planificación urbana sostenible:

### Para Urbanistas y Planificadores

- **Toma de Decisiones Informada**: Visualización clara de riesgos ambientales antes de aprobar nuevos desarrollos urbanos
- **Evaluación Comparativa**: Capacidad para comparar múltiples escenarios de riesgo simultáneamente
- **Análisis Preventivo**: Identificación temprana de zonas de alto riesgo para evitar desastres futuros

### Para Autoridades Locales

- **Planificación Estratégica**: Herramientas para desarrollar políticas de expansión urbana sostenible
- **Transparencia Pública**: Datos accesibles para ciudadanos interesados en desarrollo urbano
- **Optimización de Recursos**: Priorización de inversiones en infraestructura basadas en datos científicos

### Para la Comunidad Científica

- **Integración de Datos**: Marco unificado para combinar datos satelitales con información geoespacial local
- **Metodología Reproducible**: Técnicas estadísticas estandarizadas para análisis de riesgo consistentes
- **Extensibilidad**: Arquitectura modular que permite agregar nuevos tipos de riesgo y fuentes de datos

## 🌍 Impacto Previsto del Proyecto

Astrochingolo tiene el potencial de generar un impacto significativo en múltiples niveles:

### Impacto Ambiental

- **Prevención de Desastres**: Al identificar zonas de alto riesgo, ayuda a prevenir la construcción en áreas vulnerables a inundaciones, deslizamientos e incendios
- **Conservación de Áreas Protegidas**: Visualiza la presión urbana sobre zonas naturales, facilitando la protección de ecosistemas críticos
- **Mitigación del Cambio Climático**: Datos para desarrollar estrategias de adaptación urbana al cambio climático

### Impacto Social y Económico

- **Reducción de Pérdidas Económicas**: Evita inversiones en infraestructura en zonas de alto riesgo, ahorrando recursos públicos
- **Protección de Vidas**: Identificación preventiva de riesgos reduce la exposición de comunidades a desastres naturales
- **Desarrollo Sostenible**: Promueve la planificación urbana que balancea crecimiento económico con protección ambiental

### Impacto Tecnológico

- **Democratización de Datos**: Hace accesibles datos satelitales complejos para usuarios no técnicos
- **Innovación en Visualización**: Establece nuevos estándares para la presentación de datos geoespaciales complejos
- **Modelo para Otras Regiones**: Arquitectura replicable para análisis de riesgo en otras provincias o países

### Impacto a Largo Plazo

- **Base para Políticas Públicas**: Proporciona evidencia científica para el desarrollo de regulaciones urbanas más estrictas
- **Educación y Conciencia**: Aumenta la conciencia pública sobre riesgos ambientales urbanos
- **Colaboración Internacional**: Crea oportunidades para colaboración con otras iniciativas de NASA y organizaciones espaciales

## 🛠️ Tecnologías y Herramientas Utilizadas

### Lenguajes de Programación

- **JavaScript**: Lenguaje principal para frontend (Vue.js) y backend (Node.js)
- **Python**: Scripts de procesamiento de datos CSV y conversión a imágenes (csv_to_jpeg.py, calcular_riesgo.py)
- **JSON**: Formato de datos para configuración y metadatos geoespaciales

### Frameworks y Librerías

- **Frontend**:

  - Vue.js 3 (Composition API) - Framework progresivo para interfaces de usuario
  - Vue Router - Routing oficial para Vue.js
  - Vuex - Gestión de estado centralizada
  - Axios - Cliente HTTP para requests a APIs
  - Vuetify - Framework de componentes Material Design

- **Backend**:
  - Node.js - Entorno de ejecución JavaScript del lado servidor
  - Express.js - Framework web minimalista para Node.js
  - CORS - Middleware para habilitar Cross-Origin Resource Sharing
  - Helmet - Middleware de seguridad para headers HTTP
  - Morgan - Middleware de logging HTTP

### APIs y Servicios Externos

- **NASA FIRMS API**: Sistema de Información de Incendios de NASA para datos de incendios forestales
- **NASA CMR (Common Metadata Repository)**: Repositorio de metadatos para datos satelitales
- **Google Fonts API**: Fuentes tipográficas oficiales (Fira Sans, Overpass, Fira Code)

### Herramientas de Desarrollo

- **Control de Versiones**: Git para gestión de código fuente
- **Gestión de Dependencias**: npm (Node Package Manager)
- **Entorno de Desarrollo**: Cursor IDE con extensiones para Vue.js y Agente Grok-code-fast-1.
- **Scripts de Automatización**: Bash scripts para desarrollo (run-dev.bat, start.sh)

### Procesamiento de Datos

- **Bibliotecas Python**: Para conversión CSV a JPEG y cálculos de riesgo
- **Procesamiento Geoespacial**: Manejo de datos GeoJSON para límites provinciales
- **Normalización Estadística**: Algoritmos personalizados para Min-Max, Z-Score y Robust Scaling

### Infraestructura y Despliegue

- **Nixpacks**: Sistema de empaquetado para despliegue en la nube
- **Configuración Modular**: Arquitectura de configuración separada por entornos
- **Monitoreo de Salud**: Sistema de health checks para APIs

### Diseño y UI/UX

- **Sistema de Colores NASA**: Paleta oficial de colores (Electric Blue, Deep Blue, Neon Yellow)
- **Tipografía**: Fuentes específicas (Fira Sans, Overpass, Fira Code) siguiendo guías NASA
- **Gradientes y Efectos**: Implementación de gradientes 45° y efectos de vidrio
- **Responsive Design**: Diseño adaptativo para múltiples dispositivos

## 🎨 Creatividad del Proyecto

Astrochingolo representa una aproximación innovadora y creativa al desafío de analizar riesgos urbanos mediante la integración única de varias tecnologías y conceptos:

### Integración Multidisciplinaria

- **Fusión de Dominios**: Combina ciencia espacial (datos satelitales de NASA), análisis geoespacial, estadística avanzada y diseño de interfaces modernas en una sola plataforma
- **Enfoque Holístico**: No se limita a un tipo de riesgo, sino que integra múltiples factores ambientales (inundaciones, deslizamientos, incendios, expansión urbana) en un análisis comprehensivo

### Innovación Técnica

- **Visualización Interactiva**: Creación de mapas superpuestos con controles de opacidad que permiten análisis visual intuitivo de riesgos compuestos

### Enfoque Centrado en el Usuario

- **Democratización Tecnológica**: Transforma datos científicos complejos en visualizaciones accesibles para urbanistas, planificadores y ciudadanos
- **Experiencia Inmersiva**: Diseño inspirado en NASA que crea una experiencia visual coherente y profesional
- **Interactividad Intuitiva**: Controles simples que permiten exploración compleja sin requerir expertise técnico

### Solución a Problemas Reales

- **Enfoque Preventivo**: Cambia el paradigma de respuesta reactiva a desastres por planificación preventiva basada en datos
- **Escalabilidad Regional**: Arquitectura diseñada para ser replicable en otras provincias o países con mínimas modificaciones
- **Sostenibilidad Integrada**: Considera simultáneamente factores ambientales, sociales y económicos en la planificación urbana

### Aspectos Técnicos Innovadores

- **Procesamiento Híbrido**: Combina JavaScript moderno con scripts Python para optimizar diferentes aspectos del procesamiento de datos
- **Sistema de Colores Dinámico**: Implementación programática de la paleta NASA con variables CSS que se aplican automáticamente
- **Configuración Modular**: Sistema de configuración que permite adaptar la aplicación a diferentes contextos geográficos

## 🤔 Factores Considerados por el Equipo

Durante el desarrollo de Astrochingolo, el equipo evaluó cuidadosamente múltiples factores para asegurar un producto robusto, usable y escalable:

### Factores Técnicos

- **Escalabilidad**: Arquitectura modular que permite agregar nuevos tipos de riesgo y fuentes de datos sin reescribir el código base
- **Performance**: Optimización de carga de mapas e imágenes para mantener la responsividad incluso con grandes datasets
- **Seguridad**: Implementación de middleware de seguridad (Helmet, CORS) y validación de inputs para proteger contra ataques comunes
- **Mantenibilidad**: Código bien estructurado con separación clara de responsabilidades entre frontend, backend y servicios

### Factores de Usuario

- **Accesibilidad**: Diseño responsive que funciona en dispositivos móviles y de escritorio, considerando diferentes niveles de expertise técnico
- **Experiencia de Usuario**: Interfaz intuitiva que no requiere formación especializada para interpretar los mapas de riesgo
- **Idioma y Localización**: Desarrollo en español con datos específicos de la provincia de Córdoba, facilitando la adopción local

### Factores Ambientales y de Sostenibilidad

- **Relevancia Científica**: Integración de datos reales de NASA y metodologías estadísticas reconocidas para asegurar validez científica
- **Impacto Ambiental**: Enfoque en la prevención de desastres y conservación de áreas naturales
- **Eficiencia Energética**: Optimización del procesamiento de datos para minimizar el consumo de recursos computacionales

### Factores de Implementación

- **Disponibilidad de Datos**: Evaluación de la calidad y frecuencia de actualización de fuentes de datos satelitales
- **Compatibilidad de APIs**: Verificación de la estabilidad y documentación de las APIs de NASA utilizadas
- **Requisitos de Hardware**: Consideración de las limitaciones de hardware disponibles para el despliegue

### Factores Éticos y Sociales

- **Transparencia**: Diseño que facilita el acceso público a información crítica para la toma de decisiones
- **Equidad**: Herramientas que benefician tanto a autoridades como a ciudadanos, promoviendo la participación democrática
- **Educación**: Componente informativo que aumenta la conciencia sobre riesgos ambientales urbanos

### Factores de Proyecto

- **Tiempo de Desarrollo**: Planificación realista considerando las limitaciones del challenge de 48 horas
- **Colaboración**: Arquitectura que facilita el trabajo en equipo y la revisión de código
- **Documentación**: Creación de documentación comprehensiva para asegurar la mantenibilidad futura

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

1. **Página de Inicio**: Diseño con información del proyecto
2. **Análisis**: Ingrese datos numéricos separados por comas
3. **Resultados**: Visualización de datos normalizados con opción de exportar

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

- [ ] Modelos predictivos de Machine Learning para proyección de riesgos futuros
- [ ] Integración con datos meteorológicos en tiempo real
- [ ] API pública para integración con sistemas municipales
- [ ] Análisis comparativo entre múltiples regiones
- [ ] Exportación de reportes en múltiples formatos (PDF, CSV, GeoJSON)
- [ ] Autenticación de usuarios y perfiles personalizados
- [ ] Dashboard administrativo para gestión de datos

## 🤝 Contribuir

1. Fork el proyecto
2. Crear rama para feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 🙏 Agradecimientos

Este proyecto no habría sido posible sin el apoyo y los recursos de:

- **NASA Space Apps Challenge Córdoba**: Por proporcionar la plataforma y el desafío que inspiró esta solución
- **NASA FIRMS y CMR**: Por las APIs de datos satelitales que hacen posible el análisis en tiempo real
- **Provincia de Córdoba**: Por los datos geoespaciales y el contexto local que dieron relevancia al proyecto
- **Comunidad Open Source**: Vue.js, Node.js, Express.js y todas las librerías que forman la base tecnológica
- **Equipo Astrochingolo**: Por la dedicación y creatividad durante el desarrollo del proyecto

---

**Desarrollado con ❤️ para crear ciudades más seguras y sostenibles mediante la integración de ciencia espacial y planificación urbana**
