<template>
  <div class="map-view">
    <MainHeader title="Mapa de Córdoba" />
    <div class="divider"></div>

    <MapControls
      :zoom-locked="zoomLocked"
      :fire-incidents-count="visibleFireIncidentsCount"
      :date-range="dateRange"
      @toggle-zoom-lock="toggleZoomLock"
      @fit-bounds="fitToCordobaBounds"
      @update-date-range="onDateRangeChange"
    />

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
import { simulatedFireIncidents } from "../assets/data/simulated-fire-incidents.js";
import MainHeader from "../components/MainHeader.vue";
import MapControls from "../components/MapControls.vue";

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
    MapControls,
  },
  data() {
    return {
      zoom: 9,
      center: [-32.25, -63.7], // Centro aproximado de la provincia de Córdoba
      cordobaGeoJson: cordobaGeoJson,
      map: null,
      cordobaLayer: null, // Referencia a la capa de Córdoba
      sidebarCollapsed: false,
      isZooming: false, // Flag para evitar operaciones de capa durante zoom
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
        {
          id: "simulated-fire",
          name: "Incendios Simulados",
          visible: true,
          layerRef: null,
          type: "simulated-fire",
          icon: "🔥",
          description: "Datos de ejemplo para desarrollo",
        },
      ],
      dateRange: {
        start: "2024-01-01",
        end: "2024-12-31",
      },
      zoomLocked: false, // Por defecto zoom bloqueado en Córdoba
      simulatedFireIncidents: [],
      filteredSimulatedIncidents: [],
    };
  },
  computed: {
    hasActiveFireLayers() {
      return this.layers.some(
        (layer) => layer.type === "simulated-fire" && layer.visible
      );
    },
    visibleFireIncidentsCount() {
      return this.layers.find((l) => l.id === "simulated-fire")?.visible
        ? this.filteredSimulatedIncidents.length
        : 0;
    },
  },
  mounted() {
    this.initMap();
    this.loadSimulatedFireIncidents(); // Cargar datos simulados
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
          // Las restricciones se aplicarán dinámicamente en updateMapBounds()
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
        this.cordobaLayer = cordobaLayer; // Referencia global para fitToCordobaBounds
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

        // Agregar listeners para detectar animaciones de zoom
        this.map.on("zoomstart", () => {
          this.isZooming = true;
        });
        this.map.on("zoomend", () => {
          this.isZooming = false;
          // Actualizar capa de incendios simulados después del zoom si está visible
          const simulatedLayer = this.layers.find(
            (l) => l.id === "simulated-fire"
          );

          if (simulatedLayer?.visible) {
            this.updateSimulatedFireLayer();
          }
        });

        // Crear elementos del mapa y almacenar referencias
        this.createMapElements();

        // Aplicar restricciones de zoom iniciales
        this.updateMapBounds();
      }
    },
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed;
    },
    toggleLayer(layerId) {
      const layer = this.layers.find((l) => l.id === layerId);
      if (layer) {
        layer.visible = !layer.visible;

        // Para capas de incendios simulados
        if (layer.type === "simulated-fire") {
          this.updateSimulatedFireLayer();
        } else if (layer.layerRef) {
          // Manejo normal para otras capas
          if (layer.visible) {
            layer.layerRef.addTo(this.map);
          } else {
            this.map.removeLayer(layer.layerRef);
          }
        }
      }
    },
    onDateRangeChange(newRange) {
      // Validar que la fecha inicial no sea posterior a la final
      if (new Date(newRange.start) > new Date(newRange.end)) {
        console.warn("Fecha inicial no puede ser posterior a la fecha final");
        return;
      }

      this.dateRange = newRange;

      // Recargar datos filtrados si la capa está activa y no hay zoom
      if (
        this.layers.find((l) => l.id === "simulated-fire")?.visible &&
        !this.isZooming
      ) {
        this.loadSimulatedFireIncidents();
      }
    },
    toggleZoomLock() {
      this.zoomLocked = !this.zoomLocked;
      this.updateMapBounds();
      if (this.zoomLocked) {
        // Si se bloquea el zoom, centrar automáticamente en Córdoba
        this.fitToCordobaBounds();
      }
    },
    fitToCordobaBounds() {
      if (this.map && this.cordobaGeoJson) {
        this.map.fitBounds(this.cordobaLayer.getBounds(), {
          padding: [20, 20],
          maxZoom: this.zoomLocked ? 12 : 18,
        });
      }
    },
    updateMapBounds() {
      if (!this.map) return;

      if (this.zoomLocked) {
        // Aplicar restricciones de Córdoba
        const cordobaBounds = [
          [-29.5, -66.0], // Noroeste
          [-35.0, -62.0], // Sureste
        ];
        this.map.setMaxBounds(cordobaBounds);
        this.map.setMaxZoom(12);
        this.map.setMinZoom(8);
        this.map.options.maxBoundsViscosity = 1.0;
      } else {
        // Quitar restricciones - zoom libre
        this.map.setMaxBounds(null);
        this.map.setMaxZoom(18);
        this.map.setMinZoom(1);
        this.map.options.maxBoundsViscosity = 0.0;
      }
    },
    filterIncidentsByDateRange(incidents, startDate, endDate) {
      return incidents.filter((incident) => {
        const incidentDate = new Date(incident.acq_date);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return incidentDate >= start && incidentDate <= end;
      });
    },
    loadSimulatedFireIncidents() {
      // Cargar y filtrar datos simulados por rango de fechas
      this.simulatedFireIncidents = simulatedFireIncidents;
      this.filteredSimulatedIncidents = this.filterIncidentsByDateRange(
        this.simulatedFireIncidents,
        this.dateRange.start,
        this.dateRange.end
      );
      this.updateSimulatedFireLayer();
    },
    updateSimulatedFireLayer() {
      const simulatedLayer = this.layers.find((l) => l.id === "simulated-fire");
      if (!simulatedLayer) return;

      // Evitar operaciones de capa durante animaciones de zoom
      if (this.isZooming) return;

      // Limpiar layer existente
      if (simulatedLayer.layerRef) {
        this.map.removeLayer(simulatedLayer.layerRef);
      }

      // Crear nuevo layer group para incendios simulados
      const simulatedLayerGroup = L.layerGroup();

      // Agregar marcadores para cada incendio simulado filtrado
      this.filteredSimulatedIncidents.forEach((incident) => {
        const marker = L.marker([incident.latitude, incident.longitude], {
          icon: L.divIcon({
            className: "fire-marker",
            html: "🔥",
            iconSize: [30, 30],
            iconAnchor: [15, 15],
          }),
        });

        // Popup con información del incendio simulado
        const popupContent = `
          <div class="fire-popup">
            <h4>🔥 Incendio Simulado</h4>
            <p><strong>Fecha:</strong> ${incident.acq_date}</p>
            <p><strong>Hora:</strong> ${incident.acq_time}</p>
            <p><strong>Confianza:</strong> ${incident.confidence}%</p>
            <p><strong>Brillo:</strong> ${incident.brightness}K</p>
            <p><strong>Satélite:</strong> ${incident.satellite}</p>
            <p><strong>Día/Noche:</strong> ${
              incident.daynight === "D" ? "Día" : "Noche"
            }</p>
            <p style="color: #ff6b35; font-style: italic;"><strong>📝 Datos de ejemplo</strong></p>
          </div>
        `;

        marker.bindPopup(popupContent);
        simulatedLayerGroup.addLayer(marker);
      });

      simulatedLayer.layerRef = simulatedLayerGroup;

      // Agregar al mapa si la capa está visible
      if (simulatedLayer.visible && this.map) {
        simulatedLayerGroup.addTo(this.map);
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
  .time-controls {
    padding: 0.75rem;
    margin-top: 0.75rem;
  }

  .time-title {
    font-size: 0.9rem;
  }

  .control-label {
    font-size: 0.8rem;
  }

  .date-input {
    font-size: 0.8rem;
    padding: 0.4rem;
  }
}

/* Fire Markers Styles */
.fire-marker {
  font-size: 24px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  filter: drop-shadow(0 0 8px rgba(255, 100, 0, 0.8));
  animation: fire-pulse 2s ease-in-out infinite;
}

@keyframes fire-pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
}

.fire-popup {
  font-family: Arial, sans-serif;
  max-width: 250px;
}

.fire-popup h4 {
  margin: 0 0 8px 0;
  color: #e74c3c;
  font-size: 14px;
}

.fire-popup p {
  margin: 4px 0;
  font-size: 12px;
  line-height: 1.4;
}
</style>
