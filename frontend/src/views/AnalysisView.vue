<template>
  <div class="analysis-view">
    <MainHeader title="Análisis de Subíndices Normalizados" />
    <div class="divider"></div>
    <div class="analysis-content">
      <!-- Mensajes de estado -->
      <div v-if="error" class="error-message">
        <p>{{ error }}</p>
        <button @click="clearError" class="btn-secondary">×</button>
      </div>

      <div v-if="!backendAvailable" class="warning-message">
        <p>
          ⚠️ El backend no está disponible. Verifique que esté ejecutándose.
        </p>
      </div>

      <div class="form-section">
        <h3>📊 Configuración del Análisis</h3>
        <form @submit.prevent="submitAnalysis">
          <div class="form-group">
            <label for="data">Datos de entrada:</label>
            <textarea
              id="data"
              v-model="formData.data"
              placeholder="Ingrese valores numéricos separados por comas (ej: 1.2, 3.4, 5.6, 7.8)"
              rows="4"
              :disabled="loading"
              required
            ></textarea>
            <small class="help-text"
              >Los datos deben ser valores numéricos separados por comas</small
            >
          </div>

          <div class="form-group">
            <label for="normalization">Tipo de normalización:</label>
            <select
              id="normalization"
              v-model="formData.normalizationType"
              :disabled="loading"
            >
              <option value="minmax">Min-Max Scaling (0-1)</option>
              <option value="zscore">
                Z-Score Normalization (media 0, desv 1)
              </option>
              <option value="robust">Robust Scaling (mediana y IQR)</option>
            </select>
          </div>

          <div class="form-actions">
            <button
              type="submit"
              class="btn-primary"
              :disabled="loading || !isFormValid"
            >
              <span v-if="loading" class="spinner"></span>
              {{ loading ? "Procesando..." : "🚀 Ejecutar Análisis" }}
            </button>
            <button
              type="button"
              @click="clearForm"
              class="btn-secondary"
              :disabled="loading"
            >
              Limpiar
            </button>
          </div>
        </form>
      </div>

      <!-- Loading overlay -->
      <div v-if="loading" class="loading-overlay">
        <div class="loading-content">
          <div class="spinner-large"></div>
          <p>Analizando datos con Machine Learning...</p>
          <p class="loading-subtitle">Esto puede tomar unos momentos</p>
        </div>
      </div>

      <!-- Resultados preliminares -->
      <div v-if="hasAnalysis" class="results-preview">
        <h3>✅ Análisis Completado</h3>
        <p>Resultados disponibles en la página de resultados</p>
        <router-link to="/results" class="btn-primary">
          📈 Ver Resultados Completos
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import MainHeader from "../components/MainHeader.vue";
import { COLORS } from "../constants/colors.js";

export default {
  name: "AnalysisView",
  components: {
    MainHeader,
  },
  data() {
    return {
      colors: COLORS, // Colores oficiales NASA Space Apps
      formData: {
        data: "",
        normalizationType: "minmax",
      },
      backendAvailable: true,
    };
  },

  computed: {
    ...mapState(["loading", "error"]),
    ...mapGetters(["hasAnalysis"]),

    isFormValid() {
      return (
        this.formData.data.trim().length > 0 &&
        this.isValidData(this.formData.data)
      );
    },
  },

  async mounted() {
    // Verificar conexión con backend
    this.backendAvailable = await this.checkBackendHealth();
  },

  methods: {
    ...mapActions(["performAnalysis", "checkBackendHealth"]),

    isValidData(dataString) {
      const values = dataString.split(",").map((v) => v.trim());
      return values.every((v) => !isNaN(parseFloat(v)) && isFinite(v));
    },

    async submitAnalysis() {
      if (!this.isFormValid) return;

      try {
        // Preparar datos para la API
        const data = this.formData.data
          .split(",")
          .map((v) => parseFloat(v.trim()))
          .filter((v) => !isNaN(v));

        const payload = {
          data: data,
          normalization_type: this.formData.normalizationType,
        };

        // Ejecutar análisis
        await this.performAnalysis(payload);

        // Navegar a resultados
        this.$router.push("/results");
      } catch (error) {
        console.error("Error en análisis:", error);
        this.backendAvailable = false;
      }
    },

    clearForm() {
      this.formData.data = "";
      this.formData.normalizationType = "minmax";
    },

    clearError() {
      this.$store.commit("SET_ERROR", null);
    },
  },
};
</script>

<style scoped>
.analysis-view {
  min-height: 100vh;
  background: linear-gradient(45deg, #0042a6 0%, #07173f 100%); /* Fallback */
  background: var(--gradient-background);
  color: #ffffff; /* Fallback */
  color: var(--text-primary);
  display: flex;
  flex-direction: column;
}

.divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.3);
  margin: 0 2rem;
}

.analysis-content {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
  flex: 1;
}

.error-message {
  background: #fee;
  border: 1px solid #fcc;
  color: #c33;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.warning-message {
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  color: #856404;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.form-section {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.form-section h3 {
  color: #2c3e50;
  margin-bottom: 1.5rem;
  font-size: 1.3rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #2c3e50;
}

.help-text {
  color: #7f8c8d;
  font-size: 0.9rem;
  margin-top: 0.25rem;
  display: block;
}

textarea,
select {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e1e8ed;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

textarea:focus,
select:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

textarea:disabled,
select:disabled {
  background-color: #f8f9fa;
  cursor: not-allowed;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
}

.btn-primary,
.btn-secondary {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 140px;
  justify-content: center;
}

.btn-primary {
  background: var(--gradient-accent);
  color: var(--text-primary);
  box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(52, 152, 219, 0.4);
}

.btn-primary:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.btn-secondary {
  background: #ecf0f1;
  color: #2c3e50;
  border: 2px solid #bdc3c7;
}

.btn-secondary:hover:not(:disabled) {
  background: #d5dbdb;
  border-color: #95a5a6;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.loading-content {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.spinner-large {
  width: 48px;
  height: 48px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

.loading-content p {
  margin: 0.5rem 0;
  font-size: 1.1rem;
  color: #2c3e50;
}

.loading-subtitle {
  color: #7f8c8d;
  font-size: 0.9rem;
}

.results-preview {
  background: #d4edda;
  border: 1px solid #c3e6cb;
  color: #155724;
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
}

.results-preview h3 {
  margin-bottom: 0.5rem;
}

.results-preview .btn-primary {
  margin-top: 1rem;
  background: #28a745;
  box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .divider {
    margin: 0 1.5rem;
  }

  .analysis-content {
    padding: 1rem;
  }

  .form-section {
    padding: 1.5rem;
  }

  .form-actions {
    flex-direction: column;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
  }
}
</style>
