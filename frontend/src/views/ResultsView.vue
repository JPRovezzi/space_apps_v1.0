<template>
  <div class="results">
    <div class="header">
      <h2>📊 Resultados del Análisis</h2>
      <p>Visualización de los datos normalizados</p>
    </div>

    <div v-if="!currentAnalysis" class="no-results">
      <p>No hay resultados disponibles. Realice un análisis primero.</p>
      <router-link to="/analysis" class="btn-primary">
        🚀 Ir a Análisis
      </router-link>
    </div>

    <div v-else class="results-content">
      <div class="summary-card">
        <h3>Resumen del Análisis</h3>
        <div class="stats">
          <div class="stat">
            <span class="label">Tipo de Normalización:</span>
            <span class="value">{{
              currentAnalysis.normalization_type || "minmax"
            }}</span>
          </div>
          <div class="stat">
            <span class="label">Datos Procesados:</span>
            <span class="value">{{ currentAnalysis.data?.length || 0 }}</span>
          </div>
          <div class="stat">
            <span class="label">Estado:</span>
            <span class="value status-success">Completado</span>
          </div>
        </div>
      </div>

      <div class="data-section">
        <h3>Datos Normalizados</h3>
        <div class="data-display">
          <div
            class="data-item"
            v-for="(value, index) in currentAnalysis.data"
            :key="index"
          >
            <span class="index">{{ index + 1 }}</span>
            <span class="original">{{ value }}</span>
            <span class="arrow">→</span>
            <span class="normalized">{{
              (currentAnalysis.normalized?.[index] || value).toFixed(4)
            }}</span>
          </div>
        </div>
      </div>

      <div class="actions">
        <button @click="exportResults" class="btn-secondary">
          💾 Exportar
        </button>
        <router-link to="/analysis" class="btn-primary">
          🔄 Nuevo Análisis
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { COLORS } from "../constants/colors.js";

export default {
  name: "ResultsView",
  data() {
    return {
      colors: COLORS, // Colores oficiales NASA Space Apps
    };
  },
  computed: {
    ...mapState(["currentAnalysis"]),
  },
  methods: {
    ...mapActions(["clearCurrentAnalysis"]),

    exportResults() {
      if (!this.currentAnalysis) return;

      const data = {
        timestamp: new Date().toISOString(),
        analysis: this.currentAnalysis,
      };

      const dataStr = JSON.stringify(data, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `resultados_${
        new Date().toISOString().split("T")[0]
      }.json`;
      link.click();
      URL.revokeObjectURL(url);
    },
  },
};
</script>

<style scoped>
.results {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
}

.header {
  text-align: center;
  margin-bottom: 2rem;
}

.header h2 {
  font-family: var(--font-heading);
  font-weight: 900; /* Fira Sans Black */
  color: #2c3e50;
  margin-bottom: 0.5rem;
  font-size: 2rem;
  letter-spacing: -0.025em;
  line-height: 1.25;
}

.header p {
  font-family: var(--font-body);
  font-weight: 400; /* Overpass Regular */
  color: #7f8c8d;
  font-size: 1.125rem;
  line-height: 1.5;
}

.no-results {
  text-align: center;
  padding: 3rem;
  background: #f8f9fa;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.summary-card,
.data-section {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.summary-card h3,
.data-section h3 {
  font-family: var(--font-heading);
  font-weight: 700; /* Fira Sans Bold */
  color: #2c3e50;
  margin-bottom: 1.5rem;
  font-size: 1.25rem;
  letter-spacing: -0.025em;
}

.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.stat {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #3498db;
}

.label {
  font-family: var(--font-body);
  font-weight: 700; /* Overpass Bold */
  color: #2c3e50;
  letter-spacing: 0.025em;
}

.value {
  font-family: var(--font-body);
  font-weight: 400; /* Overpass Regular */
  color: #495057;
}

.status-success {
  color: #27ae60;
  font-weight: bold;
}

.data-display {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
  max-height: 400px;
  overflow-y: auto;
}

.data-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  background: white;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.data-item:hover {
  transform: translateY(-1px);
}

.index {
  font-weight: bold;
  color: #3498db;
  min-width: 40px;
  text-align: center;
}

.original {
  flex: 1;
  text-align: center;
  color: #2c3e50;
  font-family: "Courier New", monospace;
}

.arrow {
  color: #7f8c8d;
  margin: 0 1rem;
  font-size: 1.2rem;
}

.normalized {
  flex: 1;
  text-align: center;
  color: #27ae60;
  font-weight: bold;
  font-family: "Courier New", monospace;
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
}

.btn-primary,
.btn-secondary {
  font-family: var(--font-heading);
  font-weight: 700; /* Fira Sans Bold */
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  min-width: 140px;
  justify-content: center;
  letter-spacing: 0.025em;
}

.btn-primary {
  background: var(--gradient-accent);
  color: var(--text-primary);
  box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(52, 152, 219, 0.4);
}

.btn-secondary {
  background: #ecf0f1;
  color: #2c3e50;
  border: 2px solid #bdc3c7;
}

.btn-secondary:hover {
  background: #d5dbdb;
  border-color: #95a5a6;
}

@media (max-width: 768px) {
  .results {
    padding: 1rem;
  }

  .stats {
    grid-template-columns: 1fr;
  }

  .data-item {
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
  }

  .actions {
    flex-direction: column;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
  }
}
</style>
