<template>
  <div v-if="show" class="color-modal-overlay" @click="$emit('close')">
    <div class="color-modal layers-modal" @click.stop>
      <div class="color-modal-header">
        <h3>{{ $t('layers.title') }}</h3>
        <button class="close-btn" @click="$emit('close')">&times;</button>
      </div>

      <div class="layers-modal-body">
        <table class="layers-table">
          <thead>
            <tr>
              <th>{{ $t('layers.name') }}</th>
              <th>{{ $t('layers.actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="layer in layers" :key="layer.id">
              <td class="layer-name">
                <span
                  class="layer-name-link"
                  @click="openSourcePopup(layer.id)"
                >
                  {{ getTranslatedLayerName(layer.id) }}
                </span>
              </td>
              <td class="layer-actions">
                <!-- Botón Play/Pause -->
                <button
                  class="play-pause-btn"
                  @click="$emit('layer-toggle', layer.id)"
                  :title="layer.active ? $t('layers.deactivate') : $t('layers.activate')"
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
                    :title="$t('layers.opacityLevel', { percentage: layer.opacity })"
                    @input="
                      $emit('layer-opacity-change', {
                        layerId: layer.id,
                        opacity: parseInt($event.target.value),
                      })
                    "
                    class="opacity-slider"
                  />
                  <span
                    class="opacity-value"
                    :title="$t('layers.currentOpacity', { percentage: layer.opacity })"
                  >
                    {{ layer.opacity }}%
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modal Footer -->
      <div class="modal-footer">
        <button class="cancel-btn" @click="$emit('close')">{{ $t('layers.cancel') }}</button>
        <button class="accept-btn" @click="$emit('accept')">{{ $t('layers.accept') }}</button>
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
        <h4>{{ $t('layers.sourceInfo') }}</h4>
        <button class="source-popup-close" @click="closeSourcePopup">
          &times;
        </button>
      </div>
      <div class="source-popup-body">
        <div class="source-popup-section">
          <strong>{{ $t('layers.source') }}:</strong>
          <p>{{ getSourceData(activePopup)?.source }}</p>
        </div>
        <div class="source-popup-section">
          <strong>{{ $t('layers.layer') }}:</strong>
          <p>{{ getSourceData(activePopup)?.layer }}</p>
        </div>
        <div class="source-popup-section">
          <strong>{{ $t('layers.theme') }}:</strong>
          <p>{{ getSourceData(activePopup)?.theme }}</p>
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
    openSourcePopup(layerId) {
      this.activePopup = layerId;
    },
    closeSourcePopup() {
      this.activePopup = null;
    },
    getTranslatedLayerName(layerId) {
      return this.$t(`layerNames.${layerId}`);
    },
    getSourceData(layerId) {
      // Verificar que tenemos un layerId válido
      if (!layerId) {
        return null;
      }

      // Intentar acceder directamente a las traducciones de Vue i18n
      try {
        // Acceder usando notación de punto
        const sources = this.$t('sources');
        if (sources && sources[layerId]) {
          const data = sources[layerId];
          if (data && data.source && data.layer && data.theme) {
            return data;
          }
        }
      } catch (error) {
        console.warn('Error accessing sources translations:', error);
      }

      // Si las traducciones no funcionan, usar datos hardcodeados según el idioma actual
      const isEnglish = this.$i18n.locale === 'en';

      const fallbackData = {
        flood: {
          source: 'NASA Worldview',
          layer: isEnglish ? 'Global Flood Mortality Risks and Distribution, v1 (2000) → Flood Hazard: Mortality Risk' : 'Global Flood Mortality Risks and Distribution, v1 (2000) → Flood Hazard: Mortality Risk',
          theme: isEnglish ? 'Flooding' : 'Inundaciones'
        },
        landslide: {
          source: 'NASA Worldview',
          layer: isEnglish ? 'Global Landslide Hazard Distribution, v1 (2000) → Landslide Hazard: Frequency and Distribution' : 'Global Landslide Hazard Distribution, v1 (2000) → Landslide Hazard: Frequency and Distribution',
          theme: isEnglish ? 'Mass movement processes' : 'Procesos de remoción en masa'
        },
        urban: {
          source: 'NASA Worldview',
          layer: isEnglish ? 'GRUMPv1: Urban Extents Grid, v1 (1995) → Urban Extents' : 'GRUMPv1: Urban Extents Grid, v1 (1995) → Urban Extents',
          theme: isEnglish ? 'Urban Presence' : 'Presencia de Urbanización'
        },
        water: {
          source: 'NASA Worldview',
          layer: isEnglish ? 'Global 250m Water map (Terra/MODIS, SRTM)' : 'Global 250m Water map (Terra/MODIS, SRTM)',
          theme: isEnglish ? 'Presence of Water Bodies and Rivers' : 'Presencia de Cuerpos de Agua y Cursos Fluviales'
        },
        expansion: {
          source: 'NASA Worldview',
          layer: isEnglish ? 'Global Grid of Probabilities of Urban Expansion to 2030, v1 (2000-2030) → Probabilities of Urban Expansion to 2030' : 'Global Grid of Probabilities of Urban Expansion to 2030, v1 (2000-2030) → Probabilities of Urban Expansion to 2030',
          theme: isEnglish ? 'Urban expansion probability' : 'Probabilidad de expansión urbana'
        },
        risk: {
          source: isEnglish ? 'Local Calculation' : 'Cálculo Local',
          layer: isEnglish ? 'Calculated risk: (flood + landslide) × 0.5 × water × (1-urban) × protected_area' : 'Riesgo calculado: (flood + landslide) × 0.5 × water × (1-urban) × area_protegida',
          theme: isEnglish ? 'Composite risk index' : 'Índice de riesgo compuesto'
        },
        protected: {
          source: isEnglish ? 'IGN (National Geographic Institute)' : 'IGN (Instituto Geográfico Nacional)',
          layer: isEnglish ? 'Protected Area (polygon shape file)' : 'Área Protegida (archivo shape de polígono)',
          theme: isEnglish ? 'Presence of Protected Areas' : 'Presencia de Áreas Protegidas'
        }
      };

      return fallbackData[layerId] || { source: 'N/A', layer: 'N/A', theme: 'N/A' };
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
  z-index: 1200;
}

.color-modal {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 12px;
  padding: 0;
  max-width: 700px;
  width: 90%;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.color-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
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
  background: var(--background-overlay-hover);
  color: var(--text-primary);
}

.layers-modal-body {
  padding: 1rem 1.5rem;
  flex: 1;
  overflow-y: auto;
  min-height: 0; /* Importante para que flex funcione correctamente */
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
  background: var(--background-overlay-hover);
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
  background: var(--electric-blue);
  cursor: pointer;
}

.opacity-slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--electric-blue);
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
  flex-shrink: 0;
}

.cancel-btn,
.accept-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-btn {
  background: var(--blue-yonder);
  color: var(--text-on-primary);
}

.cancel-btn:hover {
  background: var(--neon-blue);
}

.accept-btn {
  background: var(--electric-blue);
  color: var(--text-on-primary);
}

.accept-btn:hover {
  background: var(--deep-blue);
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .modal-footer {
    padding: 0.75rem 1rem;
  }

  .cancel-btn,
  .accept-btn {
    width: 100%;
  }
}

/* Layer Name Link Styles */
.layer-name-link {
  cursor: pointer;
  color: #555;
  transition: color 0.2s ease;
}

.layer-name-link:hover {
  color: var(--electric-blue);
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
  z-index: 1300;
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
  background: var(--background-overlay-hover);
  color: var(--text-primary);
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
