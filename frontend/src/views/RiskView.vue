<template>
  <div class="risk-view">
    <!-- Texto informativo ocultable -->
    <div class="info-text-container" :class="{ expanded: showInfoText }">
      <button
        @click="toggleInfoText"
        class="info-toggle-btn"
        :title="showInfoText ? 'Ocultar información' : 'Mostrar información'"
      >
        <span class="icon">{{ showInfoText ? "📖" : "ℹ️" }}</span>
        <span class="text">{{
          showInfoText ? "Ocultar información" : "Mostrar información"
        }}</span>
      </button>

      <div v-show="showInfoText" class="info-content">
        <p>
          Este es un mapa para ver distintas capas de información y estimar
          riesgos para la expansión de asentamientos humanos. Es una herramienta
          en desarrollo. Por el momento muestra la vista de la provincia de
          Córdoba, Argentina. Al mostrar leyenda se muestra el color de cada
          valor del índice de riesgo del 1 al 10. Los datos faltantas de
          muestran en un color especificado. Se excluye las zonas ya
          urbanizadas, zonas protegidas y los cuerpos de agua ya existentes y se
          las denomina como área no válida.
        </p>
      </div>
    </div>

    <RiskToolbar
      @background-change="handleBackgroundChange"
      @layer-toggle="handleLayerToggle"
      @layer-opacity-change="handleLayerOpacityChange"
      @legend-toggle="handleLegendToggle"
      @map-controls-toggle="handleMapControlsToggle"
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

        <!-- Rosa de los vientos y escala del mapa -->
        <div v-show="showMapControls" class="map-controls">
          <!-- Rosa de los vientos -->
          <div
            class="compass-rose"
            :class="{ 'night-mode': currentBackground === 'night' }"
          >
            <svg width="60" height="60" viewBox="0 0 60 60">
              <!-- Círculo exterior -->
              <circle
                cx="30"
                cy="30"
                r="28"
                fill="rgba(255, 255, 255, 0.15)"
                :stroke="
                  currentBackground === 'night'
                    ? 'var(--electric-blue)'
                    : '#ffffff'
                "
                stroke-width="3"
                opacity="0.9"
              />
              <!-- Flecha del Norte (roja) -->
              <path
                d="M30,8 L35,20 L30,16 L25,20 Z"
                fill="#ff0000"
                stroke="#ffffff"
                stroke-width="1"
              />
              <!-- Flecha del Sur -->
              <path
                d="M30,52 L35,40 L30,44 L25,40 Z"
                fill="rgba(255,255,255,0.8)"
                stroke="#ffffff"
                stroke-width="1"
              />
              <!-- Flecha del Este -->
              <path
                d="M52,30 L40,35 L44,30 L40,25 Z"
                fill="rgba(255,255,255,0.8)"
                stroke="#ffffff"
                stroke-width="1"
              />
              <!-- Flecha del Oeste -->
              <path
                d="M8,30 L20,35 L16,30 L20,25 Z"
                fill="rgba(255,255,255,0.8)"
                stroke="#ffffff"
                stroke-width="1"
              />
            </svg>
          </div>

          <!-- Barra de escala -->
          <div
            class="scale-bar"
            :class="{ 'night-mode': currentBackground === 'night' }"
          >
            <div class="scale-line">
              <div class="scale-tick start"></div>
              <div class="scale-bar-line"></div>
              <div class="scale-tick end"></div>
            </div>
            <div class="scale-text">{{ getScaleBarDistance() }} km</div>
          </div>
        </div>

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
import RiskToolbar from "@/components/RiskToolbar.vue";
import CordobaContour from "@/components/CordobaContour.vue";
import RiskLegend from "@/components/RiskLegend.vue";
import { CORDOBA_BOUNDS } from "@/constants/geographicBounds.js";
import { COLORS } from "@/constants/colors.js";

export default {
  name: "RiskView",
  components: {
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
        { name: "Peligro de inundación", active: false, opacity: 70 },
        { name: "Procesos de remoción en masa", active: false, opacity: 70 },
        { name: "Presencia de Urbanización", active: false, opacity: 70 },
        {
          name: "Cuerpos de Agua y Cursos Fluviales",
          active: false,
          opacity: 70,
        },
        {
          name: "Probabilidad de expansión urbana",
          active: false,
          opacity: 70,
        },
        { name: "Riesgo", active: false, opacity: 70 },
        { name: "Áreas protegidas", active: false, opacity: 70 },
      ],
      showMapControls: true, // Mostrar controles del mapa por defecto
      showInfoText: true, // Mostrar texto informativo por defecto
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
        "Peligro de inundación": "flood.jpeg",
        "Procesos de remoción en masa": "landslide.jpeg",
        "Presencia de Urbanización": "urban.jpeg",
        "Cuerpos de Agua y Cursos Fluviales": "water.jpeg",
        "Probabilidad de expansión urbana": "expansion.jpeg",
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

    handleMapControlsToggle(show) {
      this.showMapControls = show;
    },

    toggleInfoText() {
      this.showInfoText = !this.showInfoText;
    },

    // Cálculos geográficos para rosa de los vientos y escala
    calculateGeographicDistance(lat1, lon1, lat2, lon2) {
      // Fórmula de distancia haversine (distancia en km entre dos puntos geográficos)
      const R = 6371; // Radio de la Tierra en km
      const dLat = this.toRadians(lat2 - lat1);
      const dLon = this.toRadians(lon2 - lon1);

      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(this.toRadians(lat1)) *
          Math.cos(this.toRadians(lat2)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);

      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    },

    toRadians(degrees) {
      return degrees * (Math.PI / 180);
    },

    calculateMapScale() {
      // Calcular distancia horizontal (este-oeste) en km
      const horizontalDistance = this.calculateGeographicDistance(
        this.MAX_LAT,
        this.MIN_LON,
        this.MAX_LAT,
        this.MAX_LON
      );

      // Calcular distancia vertical (norte-sur) en km
      const verticalDistance = this.calculateGeographicDistance(
        this.MIN_LAT,
        this.MAX_LON,
        this.MIN_LAT,
        this.MAX_LON
      );

      // Calcular escala (km por píxel)
      const horizontalScale = horizontalDistance / this.IMAGE_WIDTH;
      const verticalScale = verticalDistance / this.IMAGE_HEIGHT;

      return {
        horizontal: horizontalScale,
        vertical: verticalScale,
        average: (horizontalScale + verticalScale) / 2,
      };
    },

    getScaleBarDistance() {
      // Calcular una distancia representativa para mostrar en la barra de escala
      // Buscamos algo entre 1-10 km que se vea bien visualmente
      const scale = this.calculateMapScale();
      const averageScale = scale.average;

      // Buscar una distancia que represente aproximadamente 100-150 píxeles
      const targetPixels = 120;
      let distance = averageScale * targetPixels;

      // Redondear a un número "bonito" (1, 2, 5, 10, etc.)
      if (distance < 1) {
        return 0.5;
      } else if (distance < 2) {
        return 1;
      } else if (distance < 5) {
        return 2;
      } else if (distance < 10) {
        return 5;
      } else {
        return Math.round(distance / 10) * 10;
      }
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

/* Contenedor del texto informativo */
.info-text-container {
  margin: 1rem 2rem 0 2rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  transition: all 0.3s ease;
  width: fit-content;
  min-width: 200px;
  margin-left: auto;
  margin-right: 2rem;
}

.info-text-container.expanded {
  width: calc(100vw - 4rem);
  max-width: none;
  margin-left: 2rem;
  margin-right: 2rem;
}

/* Botón toggle del instructivo */
.info-toggle-btn {
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: none;
  padding: 0.75rem 1rem;
  color: var(--text-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
  font-family: var(--font-body);
  font-weight: 500;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.info-toggle-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.info-toggle-btn .icon {
  font-size: 1.1rem;
}

/* Contenido del instructivo */
.info-content {
  padding: 1rem 2rem 1.5rem 2rem;
  background: rgba(255, 255, 255, 0.02);
}

.info-content p {
  font-family: var(--font-body);
  font-weight: 400; /* Overpass Regular */
  font-size: 1rem;
  line-height: 1.6;
  color: var(--text-primary);
  margin: 0;
  text-align: justify;
  width: 100%;
  max-width: none;
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

  .info-text-container {
    margin: 1rem 1rem 0 auto;
    width: fit-content;
    min-width: 160px;
    margin-right: 1rem;
  }

  .info-text-container.expanded {
    width: calc(100vw - 2rem);
    max-width: none;
    margin-left: 1rem;
    margin-right: 1rem;
  }

  .info-toggle-btn {
    padding: 0.5rem 0.75rem;
    font-size: 0.8rem;
    justify-content: center;
  }

  .info-toggle-btn .icon {
    font-size: 1rem;
  }

  .info-content {
    padding: 0.75rem 1.5rem 1rem 1.5rem;
  }

  .info-content p {
    font-size: 0.9rem;
    line-height: 1.5;
    text-align: justify;
  }
}

/* Map Controls - Rosa de los vientos y escala */
.map-controls {
  position: absolute;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 15px;
  pointer-events: none;
}

/* Rosa de los vientos */
.compass-rose {
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  padding: 2px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

.compass-rose svg {
  display: block;
}

/* Barra de escala */
.scale-bar {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(8px);
  border-radius: 6px;
  padding: 8px 12px;
  border: 3px solid rgba(255, 255, 255, 0.9);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  min-width: 120px;
}

/* Modo noche para barra de escala */
.scale-bar.night-mode {
  border-color: var(--electric-blue);
}

.scale-line {
  display: flex;
  align-items: center;
  margin-bottom: 4px;
  position: relative;
}

.scale-tick {
  width: 2px;
  height: 8px;
  background: var(--neon-yellow);
  position: relative;
}

.scale-tick.start::before,
.scale-tick.end::before {
  content: "";
  position: absolute;
  top: -2px;
  left: -1px;
  width: 4px;
  height: 4px;
  background: var(--neon-yellow);
  border-radius: 50%;
}

.scale-bar-line {
  flex: 1;
  height: 2px;
  background: var(--neon-yellow);
  margin: 0 4px;
  position: relative;
}

.scale-bar-line::after {
  content: "";
  position: absolute;
  top: -1px;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    var(--neon-yellow) 20%,
    var(--neon-yellow) 80%,
    transparent 100%
  );
  opacity: 0.3;
}

.scale-text {
  color: var(--neon-yellow);
  font-family: "Fira Code", monospace;
  font-size: 11px;
  font-weight: 500;
  text-align: center;
  letter-spacing: 0.5px;
}

/* Responsive adjustments for map controls */
@media (max-width: 768px) {
  .map-controls {
    bottom: 15px;
    right: 15px;
    gap: 10px;
  }

  .compass-rose {
    padding: 6px;
  }

  .compass-rose svg {
    width: 50px;
    height: 50px;
  }

  .scale-bar {
    padding: 6px 10px;
    min-width: 100px;
  }

  .scale-text {
    font-size: 10px;
  }
}
</style>
