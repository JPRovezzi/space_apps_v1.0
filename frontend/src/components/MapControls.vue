<template>
  <div class="map-controls-bar">
    <div class="control-group">
      <!-- Control de Zoom Lock -->
      <button
        @click="$emit('toggle-zoom-lock')"
        class="control-btn zoom-control"
        :class="{ active: zoomLocked }"
        :title="
          zoomLocked
            ? 'Desbloquear zoom para explorar globalmente'
            : 'Bloquear zoom en provincia de Córdoba'
        "
      >
        <span class="control-icon">{{ zoomLocked ? "🔒" : "🔓" }}</span>
        <span class="control-text">{{
          zoomLocked ? "Zoom Bloqueado" : "Zoom Libre"
        }}</span>
      </button>

      <!-- Indicador de conexión NASA -->
      <div
        class="nasa-status-indicator"
        :class="{
          connected: nasaApiConnected,
          disconnected: !nasaApiConnected,
        }"
        :title="
          nasaApiConnected ? 'API NASA: Conectado' : 'API NASA: Desconectado'
        "
      >
        <span class="status-icon">{{ nasaApiConnected ? "🟢" : "🔴" }}</span>
        <span class="status-text">NASA</span>
      </div>
    </div>

    <!-- Controles adicionales -->
    <div class="control-group secondary">
      <button
        @click="$emit('fit-bounds')"
        class="control-btn fit-control"
        title="Centrar mapa en provincia de Córdoba"
      >
        <span class="control-icon">🎯</span>
        <span class="control-text">Centrar Córdoba</span>
      </button>
    </div>
  </div>

  <!-- Controles de Fecha -->
  <div class="date-range-controls">
    <div class="date-input-group">
      <label class="date-label">Desde:</label>
      <input
        type="date"
        :value="dateRange.start"
        @input="
          $emit('update-date-range', {
            ...dateRange,
            start: $event.target.value,
          })
        "
        class="date-input"
        title="Seleccionar fecha inicial"
      />
    </div>
    <div class="date-input-group">
      <label class="date-label">Hasta:</label>
      <input
        type="date"
        :value="dateRange.end"
        @input="
          $emit('update-date-range', { ...dateRange, end: $event.target.value })
        "
        class="date-input"
        title="Seleccionar fecha final"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "MapControls",
  props: {
    zoomLocked: {
      type: Boolean,
      required: true,
    },
    nasaApiConnected: {
      type: Boolean,
      default: false,
    },
    dateRange: {
      type: Object,
      required: true,
      validator: (value) => {
        return (
          value &&
          typeof value.start === "string" &&
          typeof value.end === "string"
        );
      },
    },
  },
  emits: ["toggle-zoom-lock", "fit-bounds", "update-date-range"],
};
</script>

<style scoped>
.map-controls-bar {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding: 12px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin: 0 1rem;
  border-radius: 8px 8px 0 0;
}

.control-group {
  display: flex;
  align-items: center;
  gap: 16px;
}

.control-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: 2px solid #e1e8ed;
  border-radius: 20px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  font-weight: 500;
  color: #2c3e50;
}

.control-btn:hover {
  border-color: #3498db;
  background: #f8f9fa;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.2);
}

.control-btn.active {
  background: #3498db;
  color: white;
  border-color: #2980b9;
  box-shadow: 0 2px 8px rgba(52, 152, 219, 0.3);
}

.control-separator {
  width: 1px;
  height: 24px;
  background: #e1e8ed;
}

.nasa-status-indicator {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 10px;
  border-radius: 16px;
  font-size: 0.8rem;
  font-weight: 500;
  transition: all 0.3s ease;
  cursor: default;
  border: 2px solid transparent;
}

.nasa-status-indicator.connected {
  background: rgba(34, 197, 94, 0.1);
  border-color: rgba(34, 197, 94, 0.3);
  color: #16a34a;
}

.nasa-status-indicator.disconnected {
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.3);
  color: #dc2626;
}

.status-icon {
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.status-text {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.control-icon {
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
}

/* Responsive */
@media (max-width: 768px) {
  .map-controls-bar {
    padding: 10px 15px;
    margin: 0 0.5rem;
  }

  .control-group {
    gap: 12px;
  }

  .control-btn {
    padding: 6px 12px;
    font-size: 0.8rem;
  }

  .control-text {
    display: none; /* Ocultar texto en móvil, solo iconos */
  }

  .nasa-status-indicator {
    padding: 4px 8px;
    font-size: 0.75rem;
  }

  .status-text {
    display: none; /* Ocultar texto en móvil, solo icono */
  }

  .control-separator {
    height: 20px;
  }

  /* En móvil, cambiar a diseño stacked si es necesario */
  .map-controls-bar {
    flex-direction: column;
    gap: 8px;
    align-items: stretch;
  }

  .control-group.secondary {
    justify-content: center;
  }
}

/* Controles de Fecha */
.date-range-controls {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding: 8px 20px;
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin: 0 1rem;
}

.date-input-group {
  display: flex;
  align-items: center;
  gap: 6px;
}

.date-label {
  font-size: 0.85rem;
  font-weight: 500;
  color: #2c3e50;
  white-space: nowrap;
}

.date-input {
  padding: 6px 8px;
  border: 1px solid #e1e8ed;
  border-radius: 4px;
  background: white;
  font-size: 0.85rem;
  color: #2c3e50;
  cursor: pointer;
  transition: border-color 0.3s ease;
}

.date-input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}

.date-input:hover {
  border-color: #bdc3c7;
}

@media (max-width: 768px) {
  .date-range-controls {
    flex-direction: column;
    gap: 8px;
    padding: 12px 15px;
    margin: 0 0.5rem;
  }

  .date-input-group {
    justify-content: space-between;
    width: 100%;
  }

  .date-label {
    font-size: 0.8rem;
  }

  .date-input {
    flex: 1;
    max-width: 140px;
  }
}

@media (max-width: 480px) {
  .map-controls-bar {
    padding: 8px 12px;
    margin: 0 0.25rem;
  }

  .date-range-controls {
    padding: 8px 12px;
    margin: 0 0.25rem;
  }

  .date-input-group {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  .date-label {
    font-size: 0.75rem;
  }

  .date-input {
    width: 100%;
    max-width: none;
  }
}
</style>
