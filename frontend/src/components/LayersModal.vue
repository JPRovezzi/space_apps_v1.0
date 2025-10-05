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
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(layer, index) in layers" :key="index">
              <td class="layer-name">{{ layer.name }}</td>
              <td class="layer-actions">
                <!-- Botón Play/Pause -->
                <button
                  class="play-pause-btn"
                  @click="$emit('layer-toggle', index)"
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
                        index,
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
  emits: ["close", "layer-toggle", "layer-opacity-change"],
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
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.color-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.color-modal-header h3 {
  margin: 0;
  color: #333;
  font-size: 1.3rem;
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
  padding: 1.5rem;
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
  padding: 1rem;
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
  gap: 1rem;
  min-width: 250px;
}

.play-pause-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
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
    gap: 0.75rem;
    min-width: auto;
  }

  .opacity-control {
    width: 100%;
  }
}
</style>
