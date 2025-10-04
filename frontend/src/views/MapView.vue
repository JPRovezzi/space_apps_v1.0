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
      zoom: 7,
      center: [-30.2, -63.8], // Centro aproximado de la provincia de Córdoba
      cordobaGeoJson: cordobaGeoJson,
      map: null,
      geoJsonLayer: null
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
          zoom: this.zoom
        })

      // Añadir capa de tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.map)

      // Añadir capa GeoJSON
      this.geoJsonLayer = L.geoJSON(this.cordobaGeoJson, {
        style: {
          color: '#ffffff',
          weight: 3,
          opacity: 0.9,
          fillColor: 'rgba(255, 255, 255, 0.15)',
          fillOpacity: 0.2
        },
        onEachFeature: this.onEachFeature
      }).addTo(this.map)
      }
    },
    onEachFeature(feature, layer) {
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
  }
}
</script>

<style scoped>
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
</style>
