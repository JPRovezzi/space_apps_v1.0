<template>
  <div class="map-view">
    <header class="map-header">
      <router-link to="/" class="back-button">
        ← Volver
      </router-link>
      <h1 class="map-title">Mapa de Córdoba</h1>
    </header>
    <div class="divider"></div>

    <div class="map-container">
      <!-- Sidebar de control de capas -->
      <aside :class="['map-sidebar', { collapsed: sidebarCollapsed }]">
        <div class="sidebar-header">
          <h3 class="sidebar-title">Capas del Mapa</h3>
          <button @click="toggleSidebar" class="sidebar-toggle">
            <span v-if="sidebarCollapsed">▶</span>
            <span v-else>◀</span>
          </button>
        </div>

        <div class="sidebar-content">
          <div class="layers-list">
            <div
              v-for="layer in layers"
              :key="layer.id"
              class="layer-item"
            >
              <label class="layer-checkbox">
                <input
                  type="checkbox"
                  :checked="layer.visible"
                  @change="toggleLayer(layer.id)"
                />
                <span class="checkmark"></span>
              </label>

              <div class="layer-info">
                <div class="layer-icon">{{ layer.icon }}</div>
                <div class="layer-details">
                  <div class="layer-name">{{ layer.name }}</div>
                  <div class="layer-description">{{ layer.description }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <!-- Contenedor del mapa -->
      <div ref="mapContainer" class="map"></div>
    </div>
  </div>
</template>

<script>
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import cordobaGeoJson from '../assets/data/cordoba-province.js'

// Fix for default markers in Leaflet with webpack
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
})

export default {
  name: 'MapView',
  data() {
    return {
      zoom: 9,
      center: [-32.25, -63.7], // Centro aproximado de la provincia de Córdoba
      cordobaGeoJson: cordobaGeoJson,
      map: null,
      sidebarCollapsed: false,
      layers: [
        {
          id: 'cordoba-province',
          name: 'Provincia de Córdoba',
          visible: true,
          layerRef: null,
          icon: '🏛️',
          description: 'Límites provinciales'
        },
        {
          id: 'cordoba-capital',
          name: 'Córdoba Capital',
          visible: true,
          layerRef: null,
          icon: '🏙️',
          description: 'Ciudad capital'
        },
        {
          id: 'influence-zone',
          name: 'Zona de Influencia',
          visible: true,
          layerRef: null,
          icon: '🎯',
          description: 'Área de 30km de radio'
        },
        {
          id: 'sub-region',
          name: 'Sub-región Ejemplo',
          visible: true,
          layerRef: null,
          icon: '🔷',
          description: 'Polígono adicional'
        },
        {
          id: 'route-line',
          name: 'Ruta de Ejemplo',
          visible: true,
          layerRef: null,
          icon: '🛣️',
          description: 'Línea trazada'
        }
      ]
    }
  },
  mounted() {
    this.initMap()
  },
  beforeUnmount() {
    if (this.map) {
      this.map.remove()
    }
  },
  methods: {
    initMap() {
      // Crear el mapa
      const mapContainer = this.$refs.mapContainer
      if (mapContainer) {
        this.map = L.map(mapContainer, {
          center: this.center,
          zoom: this.zoom,
          minZoom: 8,  // Zoom mínimo para evitar alejarse demasiado
          maxZoom: 12, // Zoom máximo para evitar acercarse demasiado
          maxBounds: [
            [-29.0, -61.0], // Esquina noroeste (mínimo margen)
            [-35.5, -66.0]  // Esquina sureste (mínimo margen)
          ],
          maxBoundsViscosity: 1.0 // Hace que los límites sean estrictos
        })

        // Agregar control de escala
        L.control.scale({
          position: 'bottomright',
          metric: true,
          imperial: false,
          maxWidth: 200
        }).addTo(this.map)

        // Agregar control de coordenadas del mouse
        this.addCoordinatesControl()

        // Añadir capa de tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.map)

      // Añadir capa GeoJSON de Córdoba
      const cordobaLayer = L.geoJSON(this.cordobaGeoJson, {
        style: {
          color: '#ffffff',
          weight: 3,
          opacity: 0.9,
          fillColor: 'rgba(255, 255, 255, 0.15)',
          fillOpacity: 0.2
        },
        onEachFeature: (feature, layer) => {
          layer.on({
            mouseover: (e) => {
              const layer = e.target;
              layer.setStyle({
                weight: 4,
                color: '#ffffff',
                fillOpacity: 0.3
              });
            },
            mouseout: (e) => {
              const layer = e.target;
              layer.setStyle({
                color: '#ffffff',
                weight: 3,
                opacity: 0.9,
                fillColor: 'rgba(255, 255, 255, 0.15)',
                fillOpacity: 0.2
              });
            }
          });
        }
      }).addTo(this.map)

      // Almacenar referencia de la capa de Córdoba
      const cordobaLayerData = this.layers.find(l => l.id === 'cordoba-province')
      if (cordobaLayerData) {
        cordobaLayerData.layerRef = cordobaLayer
      }

      // Ajustar el mapa exactamente a los límites de Córdoba (sin padding)
      this.map.fitBounds(cordobaLayer.getBounds(), {
        padding: [0, 0] // Sin padding para ajuste perfecto al ancho del polígono
      })

      // Crear elementos del mapa y almacenar referencias
      this.createMapElements();
      }
    },
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed
    },
    toggleLayer(layerId) {
      const layer = this.layers.find(l => l.id === layerId)
      if (layer && layer.layerRef) {
        layer.visible = !layer.visible

        if (layer.visible) {
          // Agregar la capa al mapa
          layer.layerRef.addTo(this.map)
        } else {
          // Remover la capa del mapa
          this.map.removeLayer(layer.layerRef)
        }
      }
    },
    createMapElements() {
      // 1. Marcador de Córdoba Capital
      const capitalMarker = L.marker([-31.4167, -64.1833])
        .addTo(this.map)
        .bindPopup('Córdoba Capital<br><b>Población: ~1.5M</b>')
        .openPopup();

      const capitalLayer = this.layers.find(l => l.id === 'cordoba-capital')
      if (capitalLayer) {
        capitalLayer.layerRef = capitalMarker
      }

      // 2. Círculo de zona de influencia
      const influenceCircle = L.circle([-32.5, -63.5], {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.3,
        radius: 30000 // 30km de radio
      }).addTo(this.map)
      .bindPopup('Zona de ejemplo');

      const influenceLayer = this.layers.find(l => l.id === 'influence-zone')
      if (influenceLayer) {
        influenceLayer.layerRef = influenceCircle
      }

      // 3. Polígono adicional (sub-región)
      const subRegionPolygon = L.polygon([
        [-31.0, -63.0],
        [-31.5, -63.0],
        [-31.5, -63.5],
        [-31.0, -63.5]
      ], {
        color: 'blue',
        fillColor: 'blue',
        fillOpacity: 0.2
      }).addTo(this.map);

      const subRegionLayer = this.layers.find(l => l.id === 'sub-region')
      if (subRegionLayer) {
        subRegionLayer.layerRef = subRegionPolygon
      }

      // 4. Línea (ruta de ejemplo)
      const routeLine = L.polyline([
        [-30.0, -64.0],
        [-31.0, -64.5],
        [-32.0, -65.0]
      ], {
        color: 'green',
        weight: 3,
        opacity: 0.7
      }).addTo(this.map);

      const routeLayer = this.layers.find(l => l.id === 'route-line')
      if (routeLayer) {
        routeLayer.layerRef = routeLine
      }
    },
    addCoordinatesControl() {
      // Crear control personalizado para coordenadas
      const CoordinatesControl = L.Control.extend({
        options: {
          position: 'bottomright'
        },

        onAdd: function(map) {
          // Crear contenedor del control
          const container = L.DomUtil.create('div', 'coordinates-control')
          container.innerHTML = '<div class="coordinates-display">Mueva el mouse sobre el mapa</div>'

          // Evitar que los eventos del mouse en el control se propaguen al mapa
          L.DomEvent.disableClickPropagation(container)
          L.DomEvent.disableScrollPropagation(container)

          // Escuchar eventos del mouse en el mapa
          map.on('mousemove', function(e) {
            const lat = e.latlng.lat.toFixed(5)
            const lng = e.latlng.lng.toFixed(5)
            container.innerHTML = `<div class="coordinates-display">Lat: ${lat} | Lon: ${lng}</div>`
          })

          map.on('mouseout', function() {
            container.innerHTML = '<div class="coordinates-display">Mueva el mouse sobre el mapa</div>'
          })

          return container
        }
      })

      // Agregar el control al mapa
      new CoordinatesControl().addTo(this.map)
    }
  }
}
</script>

<style>
.map-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #0c4a6e 0%, #0369a1 50%, #0284c7 100%);
  color: white;
  display: flex;
  flex-direction: column;
}

.map-header {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
}

.back-button {
  position: absolute;
  left: 2rem;
  top: 2rem;
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  color: white;
  padding: 8px 16px;
  text-decoration: none;
  border-radius: 25px;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  font-weight: bold;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.back-button:hover {
  background-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  border-color: rgba(255, 255, 255, 0.4);
}

.map-title {
  font-size: 2.5rem;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
  margin: 0;
  text-align: center;
}

.divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.3);
  margin: 0 2rem;
}

.map-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.map {
  height: 70vh;
  width: 100%;
  max-width: 1200px;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.2);
  border: 2px solid rgba(255, 255, 255, 0.1);
  position: relative;
}

@media (max-width: 768px) {
  .map-header {
    padding: 1.5rem;
  }

  .back-button {
    left: 1.5rem;
    top: 1.5rem;
    padding: 6px 12px;
    font-size: 0.8rem;
  }

  .map-title {
    font-size: 2rem;
  }

  .divider {
    margin: 0 1.5rem;
  }

  .map-container {
    padding: 0.5rem;
  }

  .map {
    height: 60vh;
    border-radius: 8px;
  }
}

/* Sidebar Styles */
.map-container {
  display: flex;
  position: relative;
}

.map-sidebar {
  width: 320px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-right: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 10px rgba(0,0,0,0.1);
}

.map-sidebar.collapsed {
  width: 50px;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid rgba(0,0,0,0.1);
  background: rgba(0, 36, 107, 0.9);
  color: white;
}

.sidebar-title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: bold;
}

.sidebar-toggle {
  background: none;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background 0.2s ease;
}

.sidebar-toggle:hover {
  background: rgba(255, 255, 255, 0.2);
}

.sidebar-content {
  flex: 1;
  overflow: hidden;
}

.layers-list {
  max-height: calc(70vh - 80px);
  overflow-y: auto;
  padding: 0.5rem;
}

.layer-item {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  border-bottom: 1px solid rgba(0,0,0,0.05);
  transition: background 0.2s ease;
}

.layer-item:hover {
  background: rgba(0, 36, 107, 0.05);
}

.layer-checkbox {
  position: relative;
  margin-right: 1rem;
  cursor: pointer;
}

.layer-checkbox input {
  opacity: 0;
  position: absolute;
}

.checkmark {
  width: 20px;
  height: 20px;
  border: 2px solid #0369a1;
  border-radius: 4px;
  display: inline-block;
  position: relative;
  transition: all 0.2s ease;
}

.layer-checkbox input:checked + .checkmark {
  background: #0369a1;
  border-color: #0369a1;
}

.layer-checkbox input:checked + .checkmark::after {
  content: '✓';
  position: absolute;
  top: -2px;
  left: 2px;
  color: white;
  font-size: 14px;
  font-weight: bold;
}

.layer-info {
  display: flex;
  align-items: center;
  flex: 1;
}

.layer-icon {
  font-size: 1.5rem;
  margin-right: 0.75rem;
  width: 30px;
  text-align: center;
}

.layer-details {
  flex: 1;
}

.layer-name {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.layer-description {
  font-size: 0.85rem;
  color: #6b7280;
}

.map-sidebar.collapsed .sidebar-content,
.map-sidebar.collapsed .sidebar-title {
  display: none;
}

.map-sidebar.collapsed .layer-item {
  justify-content: center;
  padding: 1rem 0.5rem;
}

.map-sidebar.collapsed .layer-info {
  display: none;
}

.map-sidebar.collapsed .layer-checkbox {
  margin-right: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .map-sidebar {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    z-index: 1001;
  }

  .map-sidebar.collapsed {
    width: 0;
  }

  .map-container {
    position: relative;
  }
}

/* Map Controls Styles - Global para que aplique a controles de Leaflet */
.coordinates-control {
  background: rgba(255, 255, 255, 0.9) !important;
  backdrop-filter: blur(10px) !important;
  border: 1px solid rgba(0, 0, 0, 0.1) !important;
  border-radius: 4px !important;
  padding: 8px 12px !important;
  margin-bottom: 10px !important;
  font-family: 'Courier New', monospace !important;
  font-size: 12px !important;
  font-weight: 500 !important;
  color: #000000 !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
  min-width: 200px !important;
  text-align: center !important;
}

.coordinates-display {
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  color: #000000 !important;
}

/* Override default Leaflet scale control styles */
.leaflet-control-scale {
  background: rgba(255, 255, 255, 0.9) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 0, 0, 0.1) !important;
  border-radius: 4px !important;
  padding: 6px 10px !important;
  font-family: Arial, sans-serif !important;
  font-size: 11px !important;
  font-weight: 500 !important;
  color: #1f2937 !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
}

.leaflet-control-scale-line {
  border-color: #0369a1 !important;
  background: rgba(3, 105, 161, 0.1) !important;
}

/* Positioning adjustments for controls */
.leaflet-bottom.leaflet-right {
  bottom: 20px !important;
  right: 20px !important;
}

.leaflet-control-scale {
  margin-bottom: 8px !important;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .coordinates-control {
    min-width: 180px;
    padding: 6px 10px;
    font-size: 11px;
  }

  .leaflet-control-scale {
    font-size: 10px !important;
    padding: 4px 8px !important;
  }

  .leaflet-bottom.leaflet-right {
    bottom: 15px !important;
    right: 15px !important;
  }
}
</style>
