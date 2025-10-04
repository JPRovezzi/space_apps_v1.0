import axios from 'axios'

const api = axios.create({
  baseURL: process.env.VUE_APP_API_URL || 'http://localhost:8000',
  timeout: 10000,
})

// Interceptores para manejo de errores
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

// API methods específicos para ML
export const mlAPI = {
  // Health check del backend
  async healthCheck() {
    return api.get('/health')
  },

  // Análisis de datos con ML
  async analyzeData(data) {
    return api.post('/api/v1/analyze', data)
  },

  // Normalización específica de subíndices
  async normalizeIndex(data) {
    return api.post('/api/v1/normalize', data)
  },

  // Obtener modelos disponibles
  async getModels() {
    return api.get('/api/v1/models')
  },

  // Subida de archivos de datos
  async uploadDataFile(file) {
    const formData = new FormData()
    formData.append('file', file)
    return api.post('/api/v1/upload-data', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}

export default api
