import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { createI18n } from 'vue-i18n'
import messages from './locales'
import './utils/checkTranslations.js'

// Función helper para acceder a valores anidados
function getNestedValue(obj, path) {
  return path.reduce((current, key) => current?.[key], obj)
}

// Función para obtener el idioma inicial
function getInitialLocale() {
  // Primero verificar si hay un idioma guardado
  const savedLanguage = localStorage.getItem('user-language')
  if (savedLanguage && ['es', 'en'].includes(savedLanguage)) {
    return savedLanguage
  }

  // Si no, detectar del navegador (solo los primeros 2 caracteres)
  const browserLang = navigator.language.split('-')[0]
  return ['es', 'en'].includes(browserLang) ? browserLang : 'es'
}

const i18n = createI18n({
  locale: getInitialLocale(),
  fallbackLocale: 'es',
  messages,
  legacy: false,

  // Configuración segura para producción
  missingWarn: false,
  fallbackWarn: false,

  // Permitir HTML solo en traducciones específicas por seguridad
  warnHtmlMessage: false, // Desactivar warning global de HTML

  // Handler seguro para traducciones faltantes
  missing: (locale, key) => {
    // En desarrollo: mostrar claramente qué falta
    if (process.env.NODE_ENV === 'development') {
      return `🔍 [${locale}:${key}]`
    }

    // En producción: intentar español, sino mostrar key
    try {
      const esValue = getNestedValue(messages.es, key.split('.'))
      return esValue || `[${key}]`
    } catch {
      return `[${key}]`
    }
  }
})

createApp(App)
  .use(router)
  .use(store)
  .use(i18n)
  .mount('#app')
