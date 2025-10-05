<template>
  <div class="risk-toolbar">
    <div class="toolbar-container">
      <!-- Toggle sol/luna -->
      <button
        class="toolbar-btn"
        @click="toggleBackground"
        :title="
          currentBackground === 'marble'
            ? 'Cambiar a modo nocturno'
            : 'Cambiar a modo diurno'
        "
      >
        <span class="icon">{{
          currentBackground === "marble" ? "☀️" : "🌙"
        }}</span>
      </button>

      <!-- Selector de colores -->
      <button
        class="toolbar-btn"
        @click="showColorPicker = true"
        title="Seleccionar color de fondo"
      >
        <span class="icon">🎨</span>
      </button>

      <!-- Zoom In -->
      <button class="toolbar-btn" title="Acercar">
        <span class="icon">🔍+</span>
      </button>

      <!-- Zoom Out -->
      <button class="toolbar-btn" title="Alejar">
        <span class="icon">🔍-</span>
      </button>

      <!-- Capas -->
      <button
        class="toolbar-btn"
        @click="showLayersModal = true"
        title="Gestionar capas"
      >
        <span class="icon">📚</span>
      </button>

      <!-- Leyenda -->
      <button
        class="toolbar-btn"
        @click="toggleLegend"
        :title="showLegend ? 'Ocultar leyenda' : 'Mostrar leyenda'"
      >
        <span class="icon">📊</span>
      </button>

      <!-- Coordenadas -->
      <button
        class="toolbar-btn"
        @click="showCoordinatesModal = true"
        title="Ver coordenadas"
      >
        <span class="icon">📍</span>
      </button>
    </div>

    <!-- Modal de selección de colores -->
    <ColorPickerModal
      :show="showColorPicker"
      @close="showColorPicker = false"
      @color-selected="handleColorSelected"
    />

    <!-- Modal de gestión de capas -->
    <LayersModal
      :show="showLayersModal"
      :layers="layers"
      @close="showLayersModal = false"
      @accept="handleLayersAccept"
      @layer-toggle="handleLayerToggle"
      @layer-opacity-change="handleLayerOpacityChange"
    />

    <!-- Modal de coordenadas -->
    <CoordinatesModal
      :show="showCoordinatesModal"
      @close="showCoordinatesModal = false"
    />
  </div>
</template>

<script>
import ColorPickerModal from "./ColorPickerModal.vue";
import LayersModal from "./LayersModal.vue";
import CoordinatesModal from "./CoordinatesModal.vue";

export default {
  name: "RiskToolbar",
  components: {
    ColorPickerModal,
    LayersModal,
    CoordinatesModal,
  },
  data() {
    return {
      currentBackground: "marble", // marble por defecto
      showColorPicker: false,
      showLayersModal: false,
      showCoordinatesModal: false,
      showLegend: false,
      layers: [
        { name: "Inundaciones", active: false, opacity: 70 },
        { name: "Deslizamientos", active: false, opacity: 70 },
        { name: "Urbano", active: false, opacity: 70 },
        { name: "Agua", active: false, opacity: 70 },
        { name: "Expansión", active: false, opacity: 70 },
        { name: "Riesgo", active: false, opacity: 70 },
      ],
    };
  },
  methods: {
    toggleBackground() {
      this.currentBackground =
        this.currentBackground === "marble" ? "night" : "marble";
      this.$emit("background-change", this.currentBackground);
    },

    handleColorSelected(colorData) {
      this.$emit("background-change", colorData);
    },

    handleLayerToggle(index) {
      this.layers[index].active = !this.layers[index].active;
      this.$emit("layer-toggle", {
        index,
        layer: this.layers[index],
      });
    },

    handleLayerOpacityChange({ index, opacity }) {
      this.layers[index].opacity = opacity;
      this.$emit("layer-opacity-change", {
        index,
        layer: this.layers[index],
      });
    },

    toggleLegend() {
      this.showLegend = !this.showLegend;
      this.$emit("legend-toggle", this.showLegend);
    },

    handleLayersAccept() {
      // Cerrar el modal cuando se aceptan los cambios
      this.showLayersModal = false;
    },
  },
};
</script>

<style scoped>
.risk-toolbar {
  display: flex;
  justify-content: center;
  padding: 1rem;
}

.toolbar-container {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
}

.toolbar-btn {
  background: transparent;
  border: none;
  border-radius: 50px;
  padding: 12px 16px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
}

.toolbar-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.icon {
  font-size: 1.2rem;
}

@media (max-width: 768px) {
  .toolbar-container {
    gap: 0.75rem;
    padding: 0.75rem;
  }

  .toolbar-btn {
    padding: 10px 14px;
    font-size: 1rem;
  }
}
</style>
