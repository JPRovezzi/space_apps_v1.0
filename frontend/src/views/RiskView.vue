<template>
  <div class="risk-view">
    <MainHeader title="Mapa de riesgos" back-route="/" />
    <RiskToolbar @background-change="handleBackgroundChange" />
    <div class="content">
      <div
        class="image-container"
        :style="{
          width: IMAGE_WIDTH + 'px',
          height: IMAGE_HEIGHT + 'px',
          ...backgroundStyle,
        }"
      >
        <!-- Aquí irá la imagen del mapa de riesgos -->
      </div>
    </div>
  </div>
</template>

<script>
import MainHeader from "@/components/MainHeader.vue";
import RiskToolbar from "@/components/RiskToolbar.vue";
import { CORDOBA_BOUNDS } from "@/constants/geographicBounds.js";

export default {
  name: "RiskView",
  components: {
    MainHeader,
    RiskToolbar,
  },
  data() {
    return {
      IMAGE_WIDTH: 978,
      IMAGE_HEIGHT: 1296,
      currentBackground: "marble", // marble por defecto
      customColor: "#ffffff",
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
        // Fallback al gradiente azul
        return {
          background:
            "linear-gradient(135deg, #0960e1 0%, #4a90e2 50%, #7bb3ff 100%)",
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
  },
};
</script>

<style scoped>
.risk-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #0960e1 0%, #4a90e2 50%, #7bb3ff 100%);
  color: white;
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
</style>
