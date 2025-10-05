<template>
  <div v-if="show" class="color-modal-overlay" @click="$emit('close')">
    <div class="color-modal layers-modal" @click.stop>
      <div class="color-modal-header">
        <h3>Gestión de Capas</h3>
        <button class="close-btn" @click="$emit('close')">&times;</button>
      </div>

      <div class="layers-modal-body">
        <table class="layers-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Acciones: Activar/Desactivar y Opacidad</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="layer in layers" :key="layer.id">
              <td class="layer-name">
                <span
                  class="layer-name-link"
                  @click="openSourcePopup(layer.name)"
                >
                  {{ layer.name }}
                </span>
              </td>
              <td class="layer-actions">
                <!-- Botón Play/Pause -->
                <button
                  class="play-pause-btn"
                  @click="$emit('layer-toggle', layer.id)"
                  :title="layer.active ? 'Desactivar capa' : 'Activar capa'"
                >
                  {{ layer.active ? "⏸️" : "▶️" }}
                </button>

                <!-- Slider de opacidad -->
                <div class="opacity-control">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    :value="layer.opacity"
                    @input="
                      $emit('layer-opacity-change', {
                        layerId: layer.id,
                        opacity: parseInt($event.target.value),
                      })
                    "
                    class="opacity-slider"
                  />
                  <span class="opacity-value">{{ layer.opacity }}%</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modal Footer -->
      <div class="modal-footer">
        <button class="cancel-btn" @click="$emit('close')">Cancelar</button>
        <button class="accept-btn" @click="$emit('accept')">Aceptar</button>
      </div>
    </div>
  </div>

  <!-- Popup de información de fuente -->
  <div
    v-if="activePopup"
    class="source-popup-overlay"
    @click="closeSourcePopup"
  >
    <div class="source-popup" @click.stop>
      <div class="source-popup-header">
        <h4>Información de la Fuente</h4>
        <button class="source-popup-close" @click="closeSourcePopup">
          &times;
        </button>
      </div>
      <div class="source-popup-body">
        <div class="source-popup-section">
          <strong>Fuente:</strong>
          <p>{{ layerSources[activePopup]?.source }}</p>
        </div>
        <div class="source-popup-section">
          <strong>Capa:</strong>
          <p>{{ layerSources[activePopup]?.layer }}</p>
        </div>
        <div class="source-popup-section">
          <strong>Temática:</strong>
          <p>{{ layerSources[activePopup]?.theme }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LayersModal",
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    layers: {
      type: Array,
      default: () => [],
    },
  },
  emits: ["close", "layer-toggle", "layer-opacity-change", "accept"],
  data() {
    return {
      activePopup: null, // Controla qué popup está abierto (solo uno a la vez)
      layerSources: {
        "Peligro de inundación": {
          source: "NASA Worldview",
          layer:
            "Global Flood Mortality Risks and Distribution, v1 (2000) → Flood Hazard: Mortality Risk",
          theme: "Inundaciones",
        },
        "Procesos de remoción en masa": {
          source: "NASA Worldview",
          layer:
            "Global Landslide Hazard Distribution, v1 (2000) → Landslide Hazard: Frequency and Distribution",
          theme: "Procesos de remoción en masa",
        },
        "Presencia de Urbanización": {
          source: "NASA Worldview",
          layer: "GRUMPv1: Urban Extents Grid, v1 (1995) → Urban Extents",
          theme: "Presencia de Urbanización",
        },
        "Cuerpos de Agua y Cursos Fluviales": {
          source: "NASA Worldview",
          layer: "Global 250m Water map (Terra/MODIS, SRTM)",
          theme: "Presencia de Cuerpos de Agua y Cursos Fluviales",
        },
        "Probabilidad de expansión urbana": {
          source: "NASA Worldview",
          layer:
            "Global Grid of Probabilities of Urban Expansion to 2030, v1 (2000-2030) → Probabilities of Urban Expansion to 2030",
          theme: "Probabilidad de expansión urbana",
        },
        Riesgo: {
          source: "Cálculo Local",
          layer:
            "Riesgo calculado: (flood + landslide) × 0.5 × water × (1-urban) × area_protegida",
          theme: "Índice de riesgo compuesto",
        },
        "Áreas protegidas": {
          source: "IGN (Instituto Geográfico Nacional)",
          layer: "Área Protegida (archivo shape de polígono)",
          theme: "Presencia de Áreas Protegidas",
        },
      },
    };
  },
  watch: {
    show(newVal) {
      if (!newVal) {
        this.closeSourcePopup(); // Cerrar popup cuando se cierra el modal
      }
    },
  },
  methods: {
    openSourcePopup(layerName) {
      this.activePopup = layerName;
    },
    closeSourcePopup() {
      this.activePopup = null;
    },
  },
};
</script>

<style scoped>
/* Modal Styles */
.color-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.color-modal {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 12px;
  padding: 0;
  max-width: 700px;
  width: 90%;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.color-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.color-modal-header h3 {
  margin: 0;
  color: #333;
  font-size: 1.2rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 2rem;
  color: #666;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: rgba(0, 0, 0, 0.1);
  color: #333;
}

.layers-modal-body {
  padding: 1rem 1.5rem;
}

.layers-table {
  width: 100%;
  border-collapse: collapse;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  overflow: hidden;
}

.layers-table th,
.layers-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.layers-table th {
  background: rgba(255, 255, 255, 0.1);
  font-weight: bold;
  color: #333;
}

.layer-name {
  font-weight: 500;
  color: #555;
}

.layer-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 200px;
  flex-wrap: wrap;
}

.play-pause-btn {
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.4rem;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.play-pause-btn:hover {
  background: rgba(0, 0, 0, 0.1);
}

.opacity-control {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
}

.opacity-slider {
  flex: 1;
  height: 6px;
  border-radius: 3px;
  background: #ddd;
  outline: none;
  -webkit-appearance: none;
}

.opacity-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #007bff;
  cursor: pointer;
}

.opacity-slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #007bff;
  cursor: pointer;
  border: none;
}

.opacity-value {
  min-width: 45px;
  font-size: 0.9rem;
  font-weight: 500;
  color: #555;
  text-align: right;
}

@media (max-width: 768px) {
  .layer-actions {
    gap: 0.5rem;
    min-width: auto;
    flex-wrap: wrap;
  }

  .opacity-control {
    width: 100%;
    margin-top: 0.5rem;
  }
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.05);
}

.cancel-btn,
.accept-btn {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.cancel-btn {
  background: rgba(108, 117, 125, 0.1);
  color: #6c757d;
  border: 1px solid rgba(108, 117, 125, 0.3);
}

.cancel-btn:hover {
  background: rgba(108, 117, 125, 0.2);
}

.accept-btn {
  background: #0042a6;
  color: white;
}

.accept-btn:hover {
  background: #003080;
  transform: translateY(-1px);
}

@media (max-width: 480px) {
  .modal-footer {
    padding: 0.75rem 1rem;
  }

  .cancel-btn,
  .accept-btn {
    padding: 0.5rem 0.75rem;
    font-size: 0.85rem;
  }
}

/* Layer Name Link Styles */
.layer-name-link {
  cursor: pointer;
  color: #555;
  transition: color 0.2s ease;
}

.layer-name-link:hover {
  color: #0042a6;
}

/* Source Popup Styles */
.source-popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1100;
}

.source-popup {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  border-radius: 12px;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.source-popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 1.5rem 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.source-popup-header h4 {
  margin: 0;
  color: #333;
  font-size: 1.1rem;
  font-weight: 600;
}

.source-popup-close {
  background: none;
  border: none;
  font-size: 1.8rem;
  color: #666;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.source-popup-close:hover {
  background: rgba(0, 0, 0, 0.1);
  color: #333;
}

.source-popup-body {
  padding: 1.5rem;
}

.source-popup-section {
  margin-bottom: 1.5rem;
}

.source-popup-section:last-child {
  margin-bottom: 0;
}

.source-popup-section strong {
  display: block;
  color: #0042a6;
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

.source-popup-section p {
  margin: 0;
  color: #555;
  line-height: 1.5;
  font-size: 0.9rem;
}

@media (max-width: 480px) {
  .source-popup-header {
    padding: 1rem 1rem 0.75rem;
  }

  .source-popup-body {
    padding: 1rem;
  }

  .source-popup-section {
    margin-bottom: 1rem;
  }
}
</style>
