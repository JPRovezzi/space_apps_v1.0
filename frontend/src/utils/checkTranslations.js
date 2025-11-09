import messages from '../locales'

export function checkTranslations() {
  const baseLocale = 'es'
  const targetLocales = ['en']

  const baseKeys = getAllKeys(messages[baseLocale])

  targetLocales.forEach(locale => {
    const missingKeys = []

    baseKeys.forEach(key => {
      if (!hasKey(messages[locale], key)) {
        missingKeys.push(key)
      }
    })

    if (missingKeys.length > 0) {
      console.warn(`⚠️  Traducciones faltantes en ${locale}:`, missingKeys)
    } else {
      console.log(`✅ Todas las traducciones están completas para ${locale}`)
    }
  })
}

function getAllKeys(obj, prefix = '') {
  let keys = []

  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key

    if (typeof obj[key] === 'object' && obj[key] !== null) {
      keys = keys.concat(getAllKeys(obj[key], fullKey))
    } else {
      keys.push(fullKey)
    }
  }

  return keys
}

function hasKey(obj, key) {
  return key.split('.').reduce((current, k) => current?.[k], obj) !== undefined
}

// Ejecutar verificación en desarrollo
if (process.env.NODE_ENV === 'development') {
  checkTranslations()
}
