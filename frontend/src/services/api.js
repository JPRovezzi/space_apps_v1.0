import axios from "axios";

const api = axios.create({
  baseURL: process.env.VUE_APP_API_URL || "http://localhost:3000",
  timeout: 2000, // Timeout corto para fallar rápido cuando no hay backend
});

// Interceptores para manejo de errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Silenciar completamente todos los errores para mejor UX offline
    // El frontend maneja los errores de manera elegante
    return Promise.reject(error);
  }
);

// API methods específicos para ML
export const mlAPI = {
  // Health check del backend
  async healthCheck() {
    return api.get("/health");
  },

  // Análisis de datos con ML
  async analyzeData(data) {
    return api.post("/api/v1/analyze", data);
  },

  // Normalización específica de subíndices
  async normalizeIndex(data) {
    return api.post("/api/v1/normalize", data);
  },

  // Obtener modelos disponibles
  async getModels() {
    return api.get("/api/v1/models");
  },

  // Subida de archivos de datos
  async uploadDataFile(file) {
    const formData = new FormData();
    formData.append("file", file);
    return api.post("/api/v1/upload-data", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

// API methods para datos de NASA
export const nasaAPI = {
  // Obtener historial de incendios para una región
  async getFireHistory(bbox, startYear, endYear) {
    return api.get("/api/v1/nasa/fire-history", {
      params: {
        bbox: bbox || "-66,-35,-62,-31", // Córdoba por defecto
        start_year: startYear || 2000,
        end_year: endYear || new Date().getFullYear(),
      },
    });
  },

  // Obtener estadísticas de incendios para un año específico
  async getFireStats(year, bbox) {
    return api.get("/api/v1/nasa/fire-stats", {
      params: {
        year: year || new Date().getFullYear(),
        bbox: bbox || "-66,-35,-62,-31",
      },
    });
  },

  // Buscar datasets disponibles de NASA para incendios
  async getAvailableFireLayers() {
    return api.get("/api/v1/nasa/fire-layers");
  },
};

export default api;
