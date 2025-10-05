<template>
  <div v-if="show" class="modal-overlay" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>Selector de coordenadas</h3>
        <button class="close-btn" @click="$emit('close')">&times;</button>
      </div>

      <div class="coordinates-container">
        <!-- Provincia -->
        <div class="coordinate-field">
          <button class="lock-btn" title="Próximamente">
            <span class="direction">🏛️</span>
            🔒
          </button>
          <select disabled class="coordinate-input province-select">
            <option>Provincia de Córdoba (Argentina)</option>
          </select>
        </div>

        <!-- Norte -->
        <div class="coordinate-field">
          <button class="lock-btn" title="Próximamente">
            <span class="direction">N</span>
            🔒
          </button>
          <input
            type="text"
            :value="northValue"
            disabled
            class="coordinate-input"
          />
        </div>

        <!-- Sur -->
        <div class="coordinate-field">
          <button class="lock-btn" title="Próximamente">
            <span class="direction">S</span>
            🔒
          </button>
          <input
            type="text"
            :value="southValue"
            disabled
            class="coordinate-input"
          />
        </div>

        <!-- Este -->
        <div class="coordinate-field">
          <button class="lock-btn" title="Próximamente">
            <span class="direction">E</span>
            🔒
          </button>
          <input
            type="text"
            :value="eastValue"
            disabled
            class="coordinate-input"
          />
        </div>

        <!-- Oeste -->
        <div class="coordinate-field">
          <button class="lock-btn" title="Próximamente">
            <span class="direction">O</span>
            🔒
          </button>
          <input
            type="text"
            :value="westValue"
            disabled
            class="coordinate-input"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { CORDOBA_BOUNDS } from "@/constants/geographicBounds.js";

export default {
  name: "CoordinatesModal",
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    northValue() {
      return CORDOBA_BOUNDS.MAX_LAT.toFixed(4);
    },
    southValue() {
      return CORDOBA_BOUNDS.MIN_LAT.toFixed(4);
    },
    eastValue() {
      return CORDOBA_BOUNDS.MAX_LON.toFixed(4);
    },
    westValue() {
      return CORDOBA_BOUNDS.MIN_LON.toFixed(4);
    },
  },
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  padding: 0;
  max-width: 400px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e0e0e0;
}

.modal-header h3 {
  margin: 0;
  color: #333;
  font-size: 1.25rem;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #666;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.close-btn:hover {
  background-color: #f0f0f0;
}

.coordinates-container {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.coordinate-field {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.lock-btn {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  padding: 0.5rem;
  cursor: default;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.9rem;
  color: #6c757d;
  min-width: 60px;
  justify-content: center;
  transition: background-color 0.2s;
}

.lock-btn:hover {
  background-color: #e9ecef;
}

.direction {
  font-weight: bold;
  color: #495057;
}

.coordinate-input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  background-color: #f8f9fa;
  color: #6c757d;
  font-family: monospace;
  font-size: 0.9rem;
}

.coordinate-input:disabled {
  opacity: 0.7;
}

.province-select {
  cursor: not-allowed;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-image: none;
}
</style>
