<template>
  <div class="map-view">
    <MainHeader title="Mapa de Córdoba" />
    <div class="divider"></div>

    <MapControls
      :zoom-locked="zoomLocked"
      :nasa-api-connected="nasaApiConnected"
      :date-range="dateRange"
      @toggle-zoom-lock="toggleZoomLock"
      @fit-bounds="fitToCordobaBounds"
      @update-date-range="updateDateRange"
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
              v-for="layer in layers.filter((l) => !l.hidden)"
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
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import cordobaGeoJson from "../assets/data/cordoba-province.js";
import { simulatedFireIncidents } from "../assets/data/simulated-fire-incidents.js";
import MainHeader from "../components/MainHeader.vue";
import MapControls from "../components/MapControls.vue";
import {
  CORDOBA_BOUNDS,
  CORDOBA_ZOOM_CONFIG,
} from "../constants/geographicBounds.js";

// Constantes para límites geográficos (ahora importadas desde constants/geographicBounds.js)

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
      zoom: CORDOBA_ZOOM_CONFIG.DEFAULT_ZOOM,
      center: CORDOBA_BOUNDS.CENTER, // Centro aproximado de la provincia de Córdoba
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
          hidden: false,
        },
        {
          id: "cordoba-capital",
          name: "Córdoba Capital",
          visible: true,
          layerRef: null,
          icon: "🏙️",
          description: "Ciudad capital",
          hidden: true,
        },
        {
          id: "influence-zone",
          name: "Zona de Influencia",
          visible: true,
          layerRef: null,
          icon: "🎯",
          description: "Área de 30km de radio",
          hidden: true,
        },
        {
          id: "sub-region",
          name: "Sub-región Ejemplo",
          visible: true,
          layerRef: null,
          icon: "🔷",
          description: "Polígono adicional",
          hidden: true,
        },
        {
          id: "route-line",
          name: "Ruta de Ejemplo",
          visible: true,
          layerRef: null,
          icon: "🛣️",
          description: "Línea trazada",
          hidden: true,
        },
        {
          id: "simulated-fire",
          name: "Incendios Simulados",
          visible: true,
          layerRef: null,
          icon: "🔥",
          description: "Puntos de incendios detectados",
          hidden: false,
        },
        {
          id: "cordoba-fire-nasa",
          name: "Incendios Córdoba (NASA)",
          visible: false,
          layerRef: null,
          icon: "🚀",
          description: "Datos reales de FIRMS",
          hidden: true,
        },
        {
          id: "modis-data",
          name: "MODIS",
          visible: true,
          layerRef: null,
          icon: "🛰️",
          description: "Datos MODIS Córdoba",
          hidden: false,
        },
      ],
      zoomLocked: false, // Por defecto zoom bloqueado en Córdoba
      dateRange: {
        start: "2024-01-15",
        end: "2024-10-08",
      },
      nasaApiConnected: false,
      nasaConnectionCheckInterval: null,
    };
  },
  async mounted() {
    this.initMap();

    // Verificar conexión con NASA API inicialmente
    await this.checkNasaApiConnection();

    // Configurar verificación periódica cada 30 segundos
    this.nasaConnectionCheckInterval = setInterval(() => {
      this.checkNasaApiConnection();
    }, 30000);
  },
  beforeUnmount() {
    if (this.map) {
      this.map.remove();
    }

    // Limpiar intervalo de verificación de conexión NASA
    if (this.nasaConnectionCheckInterval) {
      clearInterval(this.nasaConnectionCheckInterval);
    }
  },
  methods: {
    async initMap() {
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
        });

        // Crear elementos del mapa y almacenar referencias
        await this.createMapElements();

        // Aplicar restricciones de zoom iniciales
        this.updateMapBounds();
      }
    },
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed;
    },
    toggleLayer(layerId) {
      const layer = this.layers.find((l) => l.id === layerId);
      if (layer && layer.layerRef) {
        layer.visible = !layer.visible;

        // Manejo uniforme para todas las capas (incluyendo incendios simulados)
        if (layer.visible) {
          layer.layerRef.addTo(this.map);
        } else {
          this.map.removeLayer(layer.layerRef);
        }
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
    updateDateRange(newDateRange) {
      this.dateRange = newDateRange;
      // Actualizar capa de incendios cuando cambie el rango de fechas
      this.createFireIncidentsLayer();
    },
    fitToCordobaBounds() {
      if (this.map && this.cordobaGeoJson) {
        this.map.fitBounds(this.cordobaLayer.getBounds(), {
          padding: [20, 20],
          maxZoom: this.zoomLocked
            ? CORDOBA_ZOOM_CONFIG.MAX_ZOOM_LOCKED
            : CORDOBA_ZOOM_CONFIG.MAX_ZOOM,
        });
      }
    },
    updateMapBounds() {
      if (!this.map) return;

      if (this.zoomLocked) {
        // Aplicar restricciones de Córdoba
        this.map.setMaxBounds(CORDOBA_BOUNDS.getLeafletBounds());
        this.map.setMaxZoom(CORDOBA_ZOOM_CONFIG.MAX_ZOOM_LOCKED);
        this.map.setMinZoom(CORDOBA_ZOOM_CONFIG.MIN_ZOOM);
        this.map.options.maxBoundsViscosity = 1.0;
      } else {
        // Quitar restricciones - zoom libre
        this.map.setMaxBounds(null);
        this.map.setMaxZoom(CORDOBA_ZOOM_CONFIG.MAX_ZOOM);
        this.map.setMinZoom(1);
        this.map.options.maxBoundsViscosity = 0.0;
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
    async createMapElements() {
      // 1. Marcador de Córdoba Capital
      const capitalMarker = L.marker([-31.4167, -64.1833]).bindPopup(
        "Córdoba Capital<br><b>Población: ~1.5M</b>"
      );

      // Solo agregar al mapa si la capa es visible y no está oculta
      const capitalLayer = this.layers.find((l) => l.id === "cordoba-capital");
      if (capitalLayer && capitalLayer.visible && !capitalLayer.hidden) {
        capitalMarker.addTo(this.map).openPopup();
      }
      if (capitalLayer) {
        capitalLayer.layerRef = capitalMarker;
      }

      // 2. Círculo de zona de influencia
      const influenceCircle = L.circle([-32.5, -63.5], {
        color: "red",
        fillColor: "#f03",
        fillOpacity: 0.3,
        radius: 30000, // 30km de radio
      }).bindPopup("Zona de ejemplo");

      // Solo agregar al mapa si la capa es visible y no está oculta
      const influenceLayer = this.layers.find((l) => l.id === "influence-zone");
      if (influenceLayer && influenceLayer.visible && !influenceLayer.hidden) {
        influenceCircle.addTo(this.map);
      }
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
      );

      // Solo agregar al mapa si la capa es visible y no está oculta
      const subRegionLayer = this.layers.find((l) => l.id === "sub-region");
      if (subRegionLayer && subRegionLayer.visible && !subRegionLayer.hidden) {
        subRegionPolygon.addTo(this.map);
      }
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
      );

      // Solo agregar al mapa si la capa es visible y no está oculta
      const routeLayer = this.layers.find((l) => l.id === "route-line");
      if (routeLayer && routeLayer.visible && !routeLayer.hidden) {
        routeLine.addTo(this.map);
      }
      if (routeLayer) {
        routeLayer.layerRef = routeLine;
      }

      // 5. Crear capa de incendios simulados (filtrados por fecha)
      this.createFireIncidentsLayer();

      // 6. Crear capa de incendios reales de Córdoba (filtrados por fecha)
      this.createRealFireIncidentsLayer();

      // 7. Crear capa de datos MODIS para Córdoba
      await this.createModisLayer();
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
    async checkNasaApiConnection() {
      try {
        // Crear AbortController para timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 segundos timeout

        // Hacer una petición simple para verificar conexión
        const response = await fetch(
          "http://localhost:3000/api/v1/nasa/health",
          {
            method: "GET",
            signal: controller.signal,
          }
        );

        clearTimeout(timeoutId);
        this.nasaApiConnected = response.ok;
      } catch (error) {
        if (error.name === "AbortError") {
          console.warn("NASA API connection check timed out");
        } else {
          console.warn("Error checking NASA API connection:", error);
        }
        this.nasaApiConnected = false;
      }
    },
    createFireIncidentsLayer() {
      // Filtrar incendios por rango de fechas
      const filteredIncidents = simulatedFireIncidents.filter((incident) => {
        const incidentDate = new Date(incident.acq_date);
        const startDate = new Date(this.dateRange.start);
        const endDate = new Date(this.dateRange.end);
        return incidentDate >= startDate && incidentDate <= endDate;
      });

      const fireMarkers = [];

      filteredIncidents.forEach((incident) => {
        // Crear círculo rojo para cada incendio
        const fireCircle = L.circle([incident.latitude, incident.longitude], {
          color: "red",
          fillColor: "#ff0000",
          fillOpacity: 0.8,
          radius: 500, // Radio fijo de 500 metros
          weight: 2,
        }).bindPopup(`
            <div style="font-family: Arial, sans-serif; font-size: 12px;">
              <strong>🔥 Incendio Detectado</strong><br>
              <strong>Fecha:</strong> ${incident.acq_date}<br>
              <strong>Hora:</strong> ${incident.acq_time}<br>
              <strong>Confianza:</strong> ${incident.confidence}%<br>
              <strong>Brillo:</strong> ${incident.brightness} K<br>
              <strong>Satélite:</strong> ${incident.satellite}<br>
              <strong>Modo:</strong> ${
                incident.daynight === "D" ? "Diurno" : "Nocturno"
              }<br>
              <strong>Coordenadas:</strong> ${incident.latitude.toFixed(
                4
              )}, ${incident.longitude.toFixed(4)}
            </div>
          `);

        fireMarkers.push(fireCircle);
      });

      // Remover capa anterior si existe
      const simulatedLayer = this.layers.find((l) => l.id === "simulated-fire");
      if (simulatedLayer && simulatedLayer.layerRef) {
        this.map.removeLayer(simulatedLayer.layerRef);
      }

      // Crear nueva capa
      const fireLayerGroup = L.layerGroup(fireMarkers);

      // Solo añadir al mapa si la capa está visible y no está oculta
      if (simulatedLayer && simulatedLayer.visible && !simulatedLayer.hidden) {
        fireLayerGroup.addTo(this.map);
      }

      // Actualizar referencia
      if (simulatedLayer) {
        simulatedLayer.layerRef = fireLayerGroup;
      }
    },
    async createRealFireIncidentsLayer() {
      try {
        // Obtener datos reales de NASA FIRMS para Córdoba
        const currentYear = new Date().getFullYear();
        const response = await fetch(
          `http://localhost:3000/api/v1/nasa/fire-incidents?year=${currentYear}&bbox=-66,-35,-62,-31`
        );
        const data = await response.json();

        if (!data.success || !data.data.incidents) {
          console.warn("No se pudieron obtener datos de incendios reales");
          return;
        }

        // Filtrar por rango de fechas
        const filteredIncidents = data.data.incidents.filter((incident) => {
          const incidentDate = new Date(incident.acq_date);
          const startDate = new Date(this.dateRange.start);
          const endDate = new Date(this.dateRange.end);
          return incidentDate >= startDate && incidentDate <= endDate;
        });

        const fireMarkers = [];

        filteredIncidents.forEach((incident) => {
          // Crear círculo rojo para cada incendio real (sin popup)
          const fireCircle = L.circle([incident.latitude, incident.longitude], {
            color: "red",
            fillColor: "#ff0000",
            fillOpacity: 0.8,
            radius: 500, // Radio fijo de 500 metros
            weight: 2,
          });

          fireMarkers.push(fireCircle);
        });

        // Remover capa anterior si existe
        const nasaLayer = this.layers.find((l) => l.id === "cordoba-fire-nasa");
        if (nasaLayer && nasaLayer.layerRef) {
          this.map.removeLayer(nasaLayer.layerRef);
        }

        // Crear nueva capa
        const fireLayerGroup = L.layerGroup(fireMarkers);

        // Solo añadir al mapa si la capa está visible y no está oculta
        if (nasaLayer && nasaLayer.visible && !nasaLayer.hidden) {
          fireLayerGroup.addTo(this.map);
        }

        // Actualizar referencia
        if (nasaLayer) {
          nasaLayer.layerRef = fireLayerGroup;
        }

        console.log(
          `Cargados ${filteredIncidents.length} incendios reales de NASA para Córdoba`
        );
      } catch (error) {
        console.error("Error cargando incendios reales de NASA:", error);
        // Si falla, la capa queda vacía (sin mostrar error al usuario)
      }
    },
    async createModisLayer() {
      try {
        // Cargar el archivo CSV de datos MODIS
        const response = await fetch(
          "./MODIS_C6_1_Global_MCD14DL_NRT_2025277.txt"
        );
        const csvText = await response.text();

        // Parsear el CSV
        const lines = csvText.trim().split("\n");
        const headers = lines[0].split(",");

        const modisPoints = [];

        // Procesar cada línea del CSV (saltando el header)
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(",");
          const point = {};

          // Crear objeto con los datos del punto
          headers.forEach((header, index) => {
            if (
              header === "latitude" ||
              header === "longitude" ||
              header === "brightness" ||
              header === "confidence"
            ) {
              point[header] = parseFloat(values[index]);
            } else {
              point[header] = values[index];
            }
          });

          // Filtrar solo puntos dentro de los límites de Córdoba
          if (CORDOBA_BOUNDS.contains(point.latitude, point.longitude)) {
            modisPoints.push(point);
          }
        }

        const modisMarkers = [];

        modisPoints.forEach((point) => {
          // Crear círculo rojo para cada punto MODIS
          const modisCircle = L.circle([point.latitude, point.longitude], {
            color: "red",
            fillColor: "#ff0000",
            fillOpacity: 0.8,
            radius: 500, // Radio fijo de 500 metros
            weight: 2,
          }).bindPopup(`
            <div style="font-family: Arial, sans-serif; font-size: 12px;">
              <strong>🛰️ Punto MODIS</strong><br>
              <strong>Fecha:</strong> ${point.acq_date}<br>
              <strong>Hora:</strong> ${point.acq_time}<br>
              <strong>Brillo:</strong> ${point.brightness} K<br>
              <strong>Confianza:</strong> ${point.confidence}%<br>
              <strong>Satélite:</strong> ${point.satellite}<br>
              <strong>Modo:</strong> ${
                point.daynight === "D" ? "Diurno" : "Nocturno"
              }<br>
              <strong>FRP:</strong> ${point.frp} MW<br>
              <strong>Coordenadas:</strong> ${point.latitude.toFixed(
                4
              )}, ${point.longitude.toFixed(4)}
            </div>
          `);

          modisMarkers.push(modisCircle);
        });

        // Remover capa anterior si existe
        const modisLayer = this.layers.find((l) => l.id === "modis-data");
        if (modisLayer && modisLayer.layerRef) {
          this.map.removeLayer(modisLayer.layerRef);
        }

        // Crear nueva capa
        const modisLayerGroup = L.layerGroup(modisMarkers);

        // Solo añadir al mapa si la capa está visible y no está oculta
        if (modisLayer && modisLayer.visible && !modisLayer.hidden) {
          modisLayerGroup.addTo(this.map);
        }

        // Actualizar referencia
        if (modisLayer) {
          modisLayer.layerRef = modisLayerGroup;
        }

        console.log(`Cargados ${modisPoints.length} puntos MODIS para Córdoba`);
      } catch (error) {
        console.error("Error cargando datos MODIS:", error);
      }
    },
  },
  watch: {
    dateRange: {
      handler() {
        // Actualizar capa de incendios cuando cambie el rango de fechas
        this.createFireIncidentsLayer();
        this.createRealFireIncidentsLayer();
      },
      deep: true,
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
</style>
