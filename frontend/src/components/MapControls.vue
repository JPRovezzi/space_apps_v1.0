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

      <!-- Separador -->
      <div class="control-separator"></div>

      <!-- Info de Incendios -->
      <div class="control-info">
        <span class="info-icon">🔥</span>
        <span class="info-text"
          >{{ fireIncidentsCount }} incendios en {{ selectedYear }}</span
        >
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
</template>

<script>
export default {
  name: "MapControls",
  props: {
    zoomLocked: {
      type: Boolean,
      required: true,
    },
    fireIncidentsCount: {
      type: Number,
      default: 0,
    },
    selectedYear: {
      type: Number,
      required: true,
    },
  },
  emits: ["toggle-zoom-lock", "fit-bounds"],
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

.control-info {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #2c3e50;
  font-weight: 500;
  font-size: 0.9rem;
}

.info-icon {
  font-size: 1.1rem;
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

  .control-separator {
    height: 20px;
  }

  .control-info {
    font-size: 0.8rem;
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

@media (max-width: 480px) {
  .map-controls-bar {
    padding: 8px 12px;
    margin: 0 0.25rem;
  }

  .control-info {
    display: none; /* Ocultar info de incendios en pantallas muy pequeñas */
  }
}
</style>
