<template>
  <div class="risk-view">
    <MainHeader title="Mapa de riesgos" back-route="/" />
    <RiskToolbar
      @background-change="handleBackgroundChange"
      @layer-toggle="handleLayerToggle"
      @layer-opacity-change="handleLayerOpacityChange"
      @legend-toggle="handleLegendToggle"
    />
    <div class="content">
      <div
        class="image-container"
        :style="{
          width: IMAGE_WIDTH + 'px',
          height: IMAGE_HEIGHT + 'px',
          ...backgroundStyle,
        }"
        @mousemove="handleMouseMove"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
      >
        <!-- Capas de riesgo (sobre el fondo, debajo del contorno) -->
        <div
          v-for="(layer, index) in layers"
          :key="index"
          v-show="layer.active"
          class="layer-overlay"
          :style="{
            backgroundImage: `url(/${getLayerImage(layer.name)})`,
            opacity: layer.opacity / 100,
          }"
        ></div>

        <!-- Contorno de Córdoba -->
        <CordobaContour
          :width="IMAGE_WIDTH"
          :height="IMAGE_HEIGHT"
          :bounds="{
            MAX_LAT: MAX_LAT,
            MIN_LAT: MIN_LAT,
            MAX_LON: MAX_LON,
            MIN_LON: MIN_LON,
          }"
          :background="currentBackground"
        />

        <!-- Leyenda de riesgo (por encima del contorno) -->
        <RiskLegend :show="showRiskLegend" />

        <!-- Indicador de coordenadas -->
        <div v-if="showCoordinates" class="coordinates-indicator">
          {{ mouseCoordinates.lat.toFixed(6) }},
          {{ mouseCoordinates.lon.toFixed(6) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MainHeader from "@/components/MainHeader.vue";
import RiskToolbar from "@/components/RiskToolbar.vue";
import CordobaContour from "@/components/CordobaContour.vue";
import RiskLegend from "@/components/RiskLegend.vue";
import { CORDOBA_BOUNDS } from "@/constants/geographicBounds.js";
import { COLORS } from "@/constants/colors.js";

export default {
  name: "RiskView",
  components: {
    MainHeader,
    RiskToolbar,
    CordobaContour,
    RiskLegend,
  },
  data() {
    return {
      IMAGE_WIDTH: 978,
      IMAGE_HEIGHT: 1296,
      currentBackground: "marble", // marble por defecto
      customColor: "#ffffff",
      colors: COLORS,
      showLegend: false, // Controla la visibilidad de la leyenda
      showCoordinates: false, // Controla la visibilidad de las coordenadas
      mouseCoordinates: { lat: 0, lon: 0 }, // Coordenadas actuales del mouse
      layers: [
        { name: "Inundaciones", active: false, opacity: 70 },
        { name: "Deslizamientos", active: false, opacity: 70 },
        { name: "Urbano", active: false, opacity: 70 },
        { name: "Agua", active: false, opacity: 70 },
        { name: "Expansión", active: false, opacity: 70 },
        { name: "Riesgo", active: false, opacity: 70 },
        { name: "Áreas protegidas", active: false, opacity: 70 },
      ],
    };
  },
  computed: {
    // Constantes geográficas para cálculos futuros
    MAX_LAT() {
      return CORDOBA_BOUNDS.MAX_LAT;
    },
    MIN_LAT() {
      return CORDOBA_BOUNDS.MIN_LAT;
    },
    MAX_LON() {
      return CORDOBA_BOUNDS.MAX_LON;
    },
    MIN_LON() {
      return CORDOBA_BOUNDS.MIN_LON;
    },

    backgroundStyle() {
      if (this.currentBackground === "marble") {
        return {
          backgroundImage: "url(/marble.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        };
      } else if (this.currentBackground === "night") {
        return {
          backgroundImage: "url(/night.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        };
      } else if (this.currentBackground === "custom") {
        return {
          backgroundColor: this.customColor,
        };
      } else {
        // Fallback al gradiente oficial NASA Space Apps
        return {
          background: this.colors.gradientBackground,
        };
      }
    },

    showRiskLegend() {
      // Mostrar la leyenda cuando esté activada manualmente
      return this.showLegend;
    },
  },
  methods: {
    handleBackgroundChange(background) {
      if (background === "marble" || background === "night") {
        this.currentBackground = background;
      } else if (
        typeof background === "object" &&
        background.type === "custom"
      ) {
        this.currentBackground = "custom";
        this.customColor = background.color;
      }
    },

    handleLayerToggle({ index, layer }) {
      this.layers[index].active = layer.active;
    },

    handleLayerOpacityChange({ index, layer }) {
      this.layers[index].opacity = layer.opacity;
    },

    handleLegendToggle(show) {
      this.showLegend = show;
    },

    getLayerImage(layerName) {
      const imageMap = {
        Inundaciones: "flood.jpeg",
        Deslizamientos: "landslide.jpeg",
        Urbano: "urban.jpeg",
        Agua: "water.jpeg",
        Expansión: "expansion.jpeg",
        Riesgo: "riesgo.jpeg",
        "Áreas protegidas": "areas_protegidas_monocromatico.jpg",
      };
      return imageMap[layerName] || "";
    },

    calculateCoordinates(mouseX, mouseY) {
      // Convertir posición del mouse a coordenadas geográficas
      const latRange = this.MAX_LAT - this.MIN_LAT;
      const lonRange = this.MAX_LON - this.MIN_LON;

      const lat = this.MAX_LAT - (mouseY / this.IMAGE_HEIGHT) * latRange;
      const lon = this.MIN_LON + (mouseX / this.IMAGE_WIDTH) * lonRange;

      return { lat, lon };
    },

    handleMouseMove(event) {
      const rect = event.currentTarget.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      // Solo calcular si el mouse está dentro del contenedor
      if (
        mouseX >= 0 &&
        mouseX <= this.IMAGE_WIDTH &&
        mouseY >= 0 &&
        mouseY <= this.IMAGE_HEIGHT
      ) {
        this.mouseCoordinates = this.calculateCoordinates(mouseX, mouseY);
      }
    },

    handleMouseEnter() {
      this.showCoordinates = true;
    },

    handleMouseLeave() {
      this.showCoordinates = false;
    },
  },
};
</script>

<style scoped>
.risk-view {
  min-height: 100vh;
  background: linear-gradient(45deg, #0042a6 0%, #07173f 100%); /* Fallback */
  background: var(--gradient-background);
  color: #ffffff; /* Fallback */
  color: var(--text-primary);
}

.content {
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 120px); /* Ajustar según el header */
}

.image-container {
  border: 2px dashed rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.1rem;
  text-align: center;
  position: relative;
  background: rgba(255, 255, 255, 0.02);
}

.layer-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  pointer-events: none;
  z-index: 1;
}

/* Risk Legend Styles */
.image-container {
  position: relative;
}

.risk-legend {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 200;
}

/* Responsive legend adjustments */
@media (max-width: 768px) {
  .risk-legend {
    top: 5px;
    left: 5px;
    max-width: calc(100vw - 20px);
  }
}

/* Coordinates indicator */
.coordinates-indicator {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.8);
  color: #eafe07;
  padding: 8px 12px;
  border-radius: 4px;
  font-family: "Fira Code", monospace;
  font-size: 0.9rem;
  font-weight: 500;
  z-index: 1000;
  pointer-events: none;
  backdrop-filter: blur(4px);
  border: 1px solid rgba(234, 254, 7, 0.3);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  transition: opacity 0.2s ease-in-out;
}

@media (max-width: 768px) {
  .coordinates-indicator {
    top: 5px;
    right: 5px;
    font-size: 0.8rem;
    padding: 6px 8px;
  }
}
</style>
