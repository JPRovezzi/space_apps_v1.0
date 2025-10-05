# Conversor CSV → JPEG para Datos Geoespaciales

Este script convierte los archivos CSV de datos geoespaciales en imágenes JPEG optimizadas con escalas de colores específicas.

## 🚀 Instalación y Uso

### 1. Instalar dependencias

```bash
pip install -r requirements-csv.txt
```

### 2. Ejecutar el script

```bash
python csv_to_jpeg.py
```

## 📊 Archivos procesados

El script procesa automáticamente todos los archivos CSV encontrados:

- **`expansion.csv`** → `expansion.jpeg` (Azul: Electric Blue → Deep Blue)
- **`flood.csv`** → `flood.jpeg` (Azul invertido para inundaciones)
- **`landslide.csv`** → `landslide.jpeg` (Naranja/Terracota para deslizamientos)
- **`urban.csv`** → `urban.jpeg` (Gris para áreas urbanas)
- **`water.csv`** → `water.jpeg` (Azul claro para cuerpos de agua)

## 🎨 Esquemas de colores

Cada tipo de dato tiene una escala de colores específica basada en la paleta NASA Space Apps:

### Expansion Urbana

- **Electric Blue claro** → **Electric Blue** (#0042A6) → **Electric Blue oscuro**
- Gradiente de intensidad urbana usando solo variaciones del azul

### Inundaciones

- **Rocket Red claro** → **Rocket Red** (#E43700) → **Rocket Red oscuro**
- Gradiente de intensidad de inundación usando solo variaciones del rojo

### Deslizamientos

- **Orange claro** → **Orange** (#FF6B35) → **Orange oscuro**
- Gradiente de peligro usando solo variaciones del naranja

### Área Urbana

- **Gris claro** → **Gris medio** (#666666) → **Gris oscuro**
- Gradiente de densidad urbana usando solo variaciones del gris

### Cuerpos de Agua

- **Electric Blue claro** → **Electric Blue** (#0042A6) → **Electric Blue oscuro**
- Gradiente de volumen de agua usando solo variaciones del azul

## 📁 Salida

Los archivos JPEG se generan directamente en `frontend/public/` con:

- **Resolución**: Mantiene las dimensiones originales del CSV
- **Formato**: JPEG con calidad 95%
- **Optimización**: Comprimido para web
- **Sin márgenes**: Imagen pura de datos

### Archivos generados:

```
frontend/public/
├── expansion.jpeg
├── flood.jpeg
├── landslide.jpeg
├── urban.jpeg
├── water.jpeg
└── conversion_summary.json
```

## 📋 Resumen de conversión

El archivo `conversion_summary.json` contiene información detallada sobre cada conversión:

```json
{
  "expansion.csv": {
    "jpeg_path": "expansion.jpeg",
    "dimensions": "1296x978",
    "data_type": "expansion",
    "color_scheme": "Expansión Urbana"
  }
}
```

## 🔧 Integración en la aplicación

Después de ejecutar el script, los archivos JPEG estarán disponibles directamente en `frontend/public/` y listos para ser usados en la aplicación Vue.js:

1. Los JPEGs ya están en la ubicación correcta (`frontend/public/`)
2. Modificar los componentes para cargar imágenes en lugar de generar canvas
3. Implementar lógica de alternancia entre capas usando las URLs de las imágenes

## ⚡ Ventajas

- **Rendimiento**: Carga instantánea vs generación en tiempo real
- **Optimización**: JPEGs comprimidos para web
- **Consistencia**: Colores exactos y reproducibles
- **Cache**: Navegador puede cachear las imágenes
- **Offline**: Funciona sin procesamiento adicional

## 🐛 Solución de problemas

### Error de dependencias

```bash
pip install --upgrade pip
pip install -r requirements-csv.txt
```

### Error de memoria

Para CSVs muy grandes, el script puede requerir más memoria. Asegúrate de tener suficiente RAM disponible.

### Colores incorrectos

Verifica que los nombres de archivos CSV coincidan con los tipos de datos esperados en `get_color_scheme()`.

## 📝 Notas técnicas

- **Interpolación**: `nearest` para preservar valores exactos de píxeles
- **DPI**: 100 para balance entre calidad y tamaño
- **Calidad JPEG**: 95% para buena compresión sin pérdida visible
- **Formato**: Sin márgenes, imagen pura de datos geoespaciales
