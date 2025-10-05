<template>
  <div class="risk-view">
    <MainHeader title="Mapa de riesgos" back-route="/" />
    <RiskToolbar
      @background-change="handleBackgroundChange"
      @layer-toggle="handleLayerToggle"
      @layer-opacity-change="handleLayerOpacityChange"
    />
    <div class="content">
      <div
        class="image-container"
        :style="{
          width: IMAGE_WIDTH + 'px',
          height: IMAGE_HEIGHT + 'px',
          ...backgroundStyle,
        }"
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

        <!-- Contorno de Córdoba (siempre arriba) -->
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
      </div>
    </div>
  </div>
</template>

<script>
import MainHeader from "@/components/MainHeader.vue";
import RiskToolbar from "@/components/RiskToolbar.vue";
import CordobaContour from "@/components/CordobaContour.vue";
import { CORDOBA_BOUNDS } from "@/constants/geographicBounds.js";
import { COLORS } from "@/constants/colors.js";

export default {
  name: "RiskView",
  components: {
    MainHeader,
    RiskToolbar,
    CordobaContour,
  },
  data() {
    return {
      IMAGE_WIDTH: 978,
      IMAGE_HEIGHT: 1296,
      currentBackground: "marble", // marble por defecto
      customColor: "#ffffff",
      colors: COLORS,
      layers: [
        { name: "Inundaciones", active: false, opacity: 70 },
        { name: "Deslizamientos", active: false, opacity: 70 },
        { name: "Urbano", active: false, opacity: 70 },
        { name: "Agua", active: false, opacity: 70 },
        { name: "Expansión", active: false, opacity: 70 },
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

    getLayerImage(layerName) {
      const imageMap = {
        Inundaciones: "flood.jpeg",
        Deslizamientos: "landslide.jpeg",
        Urbano: "urban.jpeg",
        Agua: "water.jpeg",
        Expansión: "expansion.jpeg",
      };
      return imageMap[layerName] || "";
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
</style>
