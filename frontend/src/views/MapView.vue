<template>
  <div class="map-view">
    <MainHeader title="Mapa de Córdoba" />
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
              :data-fire-layer="layer.type === 'nasa-fire'"
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

          <!-- Estadísticas de incendios -->
          <div v-if="hasActiveFireLayers" class="fire-stats">
            <div v-if="fireStats.error" class="offline-banner">
              🔌 Backend desconectado - Sin datos científicos disponibles
            </div>
            <h4 class="stats-title">
              📊 Estadísticas
              <span v-if="fireStats.error" class="error-badge"
                >❌ Sin conexión</span
              >
              <span
                v-else-if="fireStats.dataSource === 'NASA FIRMS'"
                class="nasa-badge"
                >🛰️ NASA Real</span
              >
            </h4>
            <div class="stat-item">
              <span class="stat-label">Incendios {{ selectedYear }}:</span>
              <span
                class="stat-value"
                :data-empty="fireStats.currentYearFires === null"
              >
                {{
                  fireStats.currentYearFires !== null
                    ? fireStats.currentYearFires
                    : "—"
                }}
              </span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Área afectada:</span>
              <span
                class="stat-value"
                :data-empty="fireStats.burnedArea === null"
              >
                {{
                  fireStats.burnedArea !== null
                    ? fireStats.burnedArea + " ha"
                    : "—"
                }}
              </span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Promedio histórico:</span>
              <span
                class="stat-value"
                :data-empty="fireStats.avgFiresPerYear === null"
              >
                {{
                  fireStats.avgFiresPerYear !== null
                    ? fireStats.avgFiresPerYear + "/año"
                    : "—"
                }}
              </span>
            </div>

            <!-- Información adicional sobre fuente de datos -->
            <div
              v-if="!fireStats.error && fireStats.dataSource === 'NASA FIRMS'"
              class="data-info"
            >
              <div class="info-item">
                <span class="info-label">📡 Fuente:</span>
                <span class="info-value">{{ fireStats.dataSource }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">🔬 Confianza:</span>
                <span class="info-value">{{ fireStats.confidence }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">⏰ Última actualización:</span>
                <span class="info-value">{{
                  formatLastUpdate(fireStats.lastUpdated)
                }}</span>
              </div>
            </div>

            <!-- Información adicional en modo offline -->
            <div v-if="fireStats.error" class="data-info">
              <div class="info-item">
                <span class="info-label">📡 Fuente:</span>
                <span class="info-value">{{ fireStats.dataSource }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">🔬 Estado:</span>
                <span class="info-value">{{ fireStats.confidence }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">⏰ Datos:</span>
                <span class="info-value">No disponibles</span>
              </div>
            </div>

            <div v-if="fireStats.error" class="error-info">
              <div class="error-message">
                🔌 Backend desconectado
                <br /><small>Para ver datos reales de NASA, ejecute:</small>
                <br /><code class="command">cd backend && python run.py</code>
                <br /><small>{{ fireStats.error }}</small>
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
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import cordobaGeoJson from "../assets/data/cordoba-province.js";
import { nasaAPI } from "../services/api.js";
import MainHeader from "../components/MainHeader.vue";

// Fix for default markers in Leaflet with webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

export default {
  name: "MapView",
  components: {
    MainHeader,
  },
  data() {
    return {
      zoom: 9,
      center: [-32.25, -63.7], // Centro aproximado de la provincia de Córdoba
      cordobaGeoJson: cordobaGeoJson,
      map: null,
      sidebarCollapsed: false,
      layers: [
        {
          id: "cordoba-province",
          name: "Provincia de Córdoba",
          visible: true,
          layerRef: null,
          icon: "🏛️",
          description: "Límites provinciales",
        },
        {
          id: "cordoba-capital",
          name: "Córdoba Capital",
          visible: true,
          layerRef: null,
          icon: "🏙️",
          description: "Ciudad capital",
        },
        {
          id: "influence-zone",
          name: "Zona de Influencia",
          visible: true,
          layerRef: null,
          icon: "🎯",
          description: "Área de 30km de radio",
        },
        {
          id: "sub-region",
          name: "Sub-región Ejemplo",
          visible: true,
          layerRef: null,
          icon: "🔷",
          description: "Polígono adicional",
        },
        {
          id: "route-line",
          name: "Ruta de Ejemplo",
          visible: true,
          layerRef: null,
          icon: "🛣️",
          description: "Línea trazada",
        },
      ],
      selectedYear: new Date().getFullYear(),
      fireStats: {
        currentYearFires: 0,
        burnedArea: 0,
        avgFiresPerYear: 0,
        isSimulated: false,
        error: null,
        dataSource: "No disponible",
        lastUpdated: null,
        confidence: null,
      },
    };
  },
  computed: {
    hasActiveFireLayers() {
      // Ya no hay capas de incendios
      return false;
    },
  },
  mounted() {
    this.initMap();
    this.loadFireStats();
  },
  beforeUnmount() {
    if (this.map) {
      this.map.remove();
    }
  },
  methods: {
    initMap() {
      // Crear el mapa
      const mapContainer = this.$refs.mapContainer;
      if (mapContainer) {
        this.map = L.map(mapContainer, {
          center: this.center,
          zoom: this.zoom,
          minZoom: 8, // Zoom mínimo para evitar alejarse demasiado
          maxZoom: 12, // Zoom máximo para evitar acercarse demasiado
          maxBounds: [
            [-29.0, -61.0], // Esquina noroeste (mínimo margen)
            [-35.5, -66.0], // Esquina sureste (mínimo margen)
          ],
          maxBoundsViscosity: 1.0, // Hace que los límites sean estrictos
        });

        // Agregar control de escala
        L.control
          .scale({
            position: "bottomright",
            metric: true,
            imperial: false,
            maxWidth: 200,
          })
          .addTo(this.map);

        // Agregar control de coordenadas del mouse
        this.addCoordinatesControl();

        // Añadir capa de tiles
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(this.map);

        // Añadir capa GeoJSON de Córdoba
        const cordobaLayer = L.geoJSON(this.cordobaGeoJson, {
          style: {
            color: "#ffffff",
            weight: 3,
            opacity: 0.9,
            fillColor: "rgba(255, 255, 255, 0.15)",
            fillOpacity: 0.2,
          },
          onEachFeature: (feature, layer) => {
            layer.on({
              mouseover: (e) => {
                const layer = e.target;
                layer.setStyle({
                  weight: 4,
                  color: "#ffffff",
                  fillOpacity: 0.3,
                });
              },
              mouseout: (e) => {
                const layer = e.target;
                layer.setStyle({
                  color: "#ffffff",
                  weight: 3,
                  opacity: 0.9,
                  fillColor: "rgba(255, 255, 255, 0.15)",
                  fillOpacity: 0.2,
                });
              },
            });
          },
        }).addTo(this.map);

        // Almacenar referencia de la capa de Córdoba
        const cordobaLayerData = this.layers.find(
          (l) => l.id === "cordoba-province"
        );
        if (cordobaLayerData) {
          cordobaLayerData.layerRef = cordobaLayer;
        }

        // Ajustar el mapa exactamente a los límites de Córdoba (sin padding)
        this.map.fitBounds(cordobaLayer.getBounds(), {
          padding: [0, 0], // Sin padding para ajuste perfecto al ancho del polígono
        });

        // Crear elementos del mapa y almacenar referencias
        this.createMapElements();
      }
    },
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed;
    },
    toggleLayer(layerId) {
      const layer = this.layers.find((l) => l.id === layerId);
      if (layer) {
        layer.visible = !layer.visible;

        if (layer.layerRef) {
          // Manejo normal para otras capas
          if (layer.visible) {
            layer.layerRef.addTo(this.map);
          } else {
            this.map.removeLayer(layer.layerRef);
          }
        }
      }
    },
    onYearChange() {
      this.loadFireStats(); // Recargar estadísticas para el nuevo año
    },
    async loadFireStats() {
      try {
        const response = await nasaAPI.getFireStats(this.selectedYear);
        this.fireStats = {
          currentYearFires: response.total_fires || 0,
          burnedArea: response.total_burned_area_ha || 0,
          avgFiresPerYear: (response.avg_fires_per_month || 0) * 12,
          isSimulated: false,
          dataSource: response.data_source || "NASA FIRMS",
          lastUpdated: response.last_updated || null,
          confidence: response.confidence || null,
          error: null,
        };
      } catch (error) {
        this.fireStats = {
          currentYearFires: null,
          burnedArea: null,
          avgFiresPerYear: null,
          isSimulated: false,
          error: "Backend no disponible",
          dataSource: "No disponible",
          lastUpdated: null,
          confidence: null,
        };
      }
    },
    formatLastUpdate(timestamp) {
      if (!timestamp) return "Nunca";
      try {
        const date = new Date(timestamp);
        return date.toLocaleString("es-AR", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      } catch {
        return "Desconocido";
      }
    },
    createMapElements() {
      // 1. Marcador de Córdoba Capital
      const capitalMarker = L.marker([-31.4167, -64.1833])
        .addTo(this.map)
        .bindPopup("Córdoba Capital<br><b>Población: ~1.5M</b>")
        .openPopup();

      const capitalLayer = this.layers.find((l) => l.id === "cordoba-capital");
      if (capitalLayer) {
        capitalLayer.layerRef = capitalMarker;
      }

      // 2. Círculo de zona de influencia
      const influenceCircle = L.circle([-32.5, -63.5], {
        color: "red",
        fillColor: "#f03",
        fillOpacity: 0.3,
        radius: 30000, // 30km de radio
      })
        .addTo(this.map)
        .bindPopup("Zona de ejemplo");

      const influenceLayer = this.layers.find((l) => l.id === "influence-zone");
      if (influenceLayer) {
        influenceLayer.layerRef = influenceCircle;
      }

      // 3. Polígono adicional (sub-región)
      const subRegionPolygon = L.polygon(
        [
          [-31.0, -63.0],
          [-31.5, -63.0],
          [-31.5, -63.5],
          [-31.0, -63.5],
        ],
        {
          color: "blue",
          fillColor: "blue",
          fillOpacity: 0.2,
        }
      ).addTo(this.map);

      const subRegionLayer = this.layers.find((l) => l.id === "sub-region");
      if (subRegionLayer) {
        subRegionLayer.layerRef = subRegionPolygon;
      }

      // 4. Línea (ruta de ejemplo)
      const routeLine = L.polyline(
        [
          [-30.0, -64.0],
          [-31.0, -64.5],
          [-32.0, -65.0],
        ],
        {
          color: "green",
          weight: 3,
          opacity: 0.7,
        }
      ).addTo(this.map);

      const routeLayer = this.layers.find((l) => l.id === "route-line");
      if (routeLayer) {
        routeLayer.layerRef = routeLine;
      }
    },
    addCoordinatesControl() {
      // Crear control personalizado para coordenadas
      const CoordinatesControl = L.Control.extend({
        options: {
          position: "bottomright",
        },

        onAdd: function (map) {
          // Crear contenedor del control
          const container = L.DomUtil.create("div", "coordinates-control");
          container.innerHTML =
            '<div class="coordinates-display">Mueva el mouse sobre el mapa</div>';

          // Evitar que los eventos del mouse en el control se propaguen al mapa
          L.DomEvent.disableClickPropagation(container);
          L.DomEvent.disableScrollPropagation(container);

          // Escuchar eventos del mouse en el mapa
          map.on("mousemove", function (e) {
            const lat = e.latlng.lat.toFixed(5);
            const lng = e.latlng.lng.toFixed(5);
            container.innerHTML = `<div class="coordinates-display">Lat: ${lat} | Lon: ${lng}</div>`;
          });

          map.on("mouseout", function () {
            container.innerHTML =
              '<div class="coordinates-display">Mueva el mouse sobre el mapa</div>';
          });

          return container;
        },
      });

      // Agregar el control al mapa
      new CoordinatesControl().addTo(this.map);
    },
  },
};
</script>

<style>
.map-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #0c4a6e 0%, #0369a1 50%, #0284c7 100%);
  color: white;
  display: flex;
  flex-direction: column;
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
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.1);
  position: relative;
}

@media (max-width: 768px) {
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
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
}

.map-sidebar.collapsed {
  width: 50px;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
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
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
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
  content: "✓";
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
  font-family: "Courier New", monospace !important;
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

/* NASA Fire Controls Styles */
.time-controls {
  margin-top: 1rem;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(10px);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.time-title {
  color: #ffffff;
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: 1rem;
  text-align: center;
}

.date-control {
  margin-bottom: 1rem;
}

.control-label {
  display: block;
  color: #ffffff;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.date-input {
  width: 100%;
  padding: 0.5rem;
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.95);
  color: #000000;
  font-size: 0.9rem;
  font-weight: 500;
}

.date-input:focus {
  outline: none;
  border-color: #0369a1;
  box-shadow: 0 0 0 2px rgba(3, 105, 161, 0.2);
}

.year-control {
  margin-bottom: 1rem;
}

.year-slider {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.2);
  outline: none;
  -webkit-appearance: none;
  appearance: none;
}

.year-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #0369a1;
  cursor: pointer;
  border: 2px solid #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.year-slider::-webkit-slider-thumb:hover {
  background: #0284c7;
  transform: scale(1.1);
}

.year-slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #0369a1;
  cursor: pointer;
  border: 2px solid #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.fire-stats {
  margin-top: 1rem;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(10px);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.stats-title {
  color: #ffffff;
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: 1rem;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.error-badge {
  font-size: 0.75rem;
  background: rgba(239, 68, 68, 0.9);
  color: #ffffff;
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  font-weight: bold;
  border: 1px solid rgba(239, 68, 68, 1);
}

.nasa-badge {
  font-size: 0.75rem;
  background: rgba(34, 197, 94, 0.8);
  color: #ffffff;
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  font-weight: normal;
  border: 1px solid rgba(34, 197, 94, 1);
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.25);
}

.stat-item:last-child {
  border-bottom: none;
}

.stat-label {
  color: #ffffff;
  font-size: 0.85rem;
  opacity: 1;
  font-weight: 500;
}

.stat-value {
  color: #ffffff;
  font-size: 0.9rem;
  font-weight: bold;
  background: rgba(255, 255, 255, 0.2);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  min-width: 60px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.stat-value[data-empty="true"] {
  color: rgba(255, 255, 255, 0.5);
  background: rgba(255, 255, 255, 0.1);
  font-style: italic;
  font-weight: normal;
}

/* Información de fuente de datos */
.data-info {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.25rem 0;
  font-size: 0.8rem;
}

.info-label {
  color: #ffffff;
  opacity: 0.8;
  font-weight: 500;
}

.info-value {
  color: #ffffff;
  font-weight: bold;
  background: rgba(255, 255, 255, 0.1);
  padding: 0.2rem 0.4rem;
  border-radius: 3px;
  font-size: 0.75rem;
}

/* Información de error */
.error-info {
  margin-top: 1rem;
  padding: 0.75rem;
  background: rgba(220, 38, 38, 0.1);
  border: 1px solid rgba(220, 38, 38, 0.3);
  border-radius: 6px;
}

.error-message {
  color: #ffffff;
  text-align: center;
  font-size: 0.85rem;
  line-height: 1.4;
}

.command {
  background: rgba(0, 0, 0, 0.3);
  color: #ffffff;
  padding: 0.2rem 0.4rem;
  border-radius: 3px;
  font-family: "Courier New", monospace;
  font-size: 0.75rem;
  font-weight: bold;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.offline-banner {
  background: rgba(239, 68, 68, 0.9);
  color: #ffffff;
  padding: 0.5rem;
  border-radius: 6px;
  text-align: center;
  font-size: 0.85rem;
  font-weight: bold;
  margin-bottom: 1rem;
  border: 2px solid rgba(239, 68, 68, 0.3);
}

/* Fire layer highlighting */
.layer-item[data-fire-layer="true"] {
  position: relative;
}

.layer-item[data-fire-layer="true"]::before {
  content: "";
  position: absolute;
  left: -8px;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 60%;
  background: linear-gradient(135deg, #ff6b35, #f7931e);
  border-radius: 2px;
  opacity: 0.8;
}

/* Responsive adjustments for fire controls */
@media (max-width: 768px) {
  .time-controls,
  .fire-stats {
    padding: 0.75rem;
    margin-top: 0.75rem;
  }

  .time-title,
  .stats-title {
    font-size: 0.9rem;
  }

  .control-label {
    font-size: 0.8rem;
  }

  .date-input {
    font-size: 0.8rem;
    padding: 0.4rem;
  }

  .stat-label,
  .stat-value {
    font-size: 0.8rem;
  }
}
</style>
