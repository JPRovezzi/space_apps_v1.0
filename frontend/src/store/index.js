import { createStore } from 'vuex'
import { mlAPI } from '../services/api'

export default createStore({
  state: {
    currentAnalysis: null,
    analysisHistory: [],
    loading: false,
    error: null,
    models: []
  },

  mutations: {
    SET_LOADING(state, loading) {
      state.loading = loading
    },

    SET_ERROR(state, error) {
      state.error = error
    },

    SET_ANALYSIS(state, analysis) {
      state.currentAnalysis = analysis
      if (analysis) {
        state.analysisHistory.unshift({
          ...analysis,
          timestamp: new Date()
        })
        // Mantener solo los últimos 10 análisis
        if (state.analysisHistory.length > 10) {
          state.analysisHistory = state.analysisHistory.slice(0, 10)
        }
      }
    },

    CLEAR_ANALYSIS(state) {
      state.currentAnalysis = null
    },

    SET_MODELS(state, models) {
      state.models = models
    }
  },

  actions: {
    async performAnalysis({ commit }, data) {
      commit('SET_LOADING', true)
      commit('SET_ERROR', null)

      try {
        const result = await mlAPI.analyzeData(data)
        commit('SET_ANALYSIS', result.data)
        return result.data
      } catch (error) {
        const errorMessage = error.response?.data?.detail || error.message
        commit('SET_ERROR', errorMessage)
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async loadModels({ commit }) {
      try {
        const result = await mlAPI.getModels()
        commit('SET_MODELS', result.data.models || [])
      } catch (error) {
        console.error('Error loading models:', error)
      }
    },

    async checkBackendHealth({ commit }) {
      try {
        await mlAPI.healthCheck()
        commit('SET_ERROR', null)
        return true
      } catch (error) {
        commit('SET_ERROR', 'Backend no disponible')
        return false
      }
    },

    clearCurrentAnalysis({ commit }) {
      commit('CLEAR_ANALYSIS')
    }
  },

  getters: {
    hasAnalysis: state => !!state.currentAnalysis,
    latestAnalysis: state => state.analysisHistory[0],
    isLoading: state => state.loading,
    hasError: state => !!state.error,
    availableModels: state => state.models
  }
})
