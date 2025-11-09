<template>
  <header class="map-header">
    <!-- Layout móvil: fila única con botones -->
    <div v-if="isMobile" class="mobile-header-row">
      <div class="mobile-left-section">
        <router-link v-if="showBackButton" :to="backRoute" class="mobile-back-button">
          ← {{ $t('nav.back') }}
        </router-link>
      </div>

      <div class="mobile-right-section">
        <!-- Botones del header derecho -->
        <div v-if="showHeaderButtons" class="mobile-header-buttons">
          <!-- Botón de idioma -->
          <button
            @click="toggleLanguage"
            class="header-btn language-btn"
            :title="currentLanguage.name + ' - ' + $t('nav.language')"
          >
            <img
              v-if="currentLanguageFlag"
              :src="currentLanguageFlag"
              :alt="currentLanguageCode"
              class="language-flag"
              @error="handleFlagError"
            />
            <span v-else class="language-code">{{ currentLanguageCode }}</span>
          </button>

          <!-- Botón de conexión NASA -->
          <button
            @click="handleConnectionClick"
            class="header-btn connection-btn"
            :title="$t('nav.connection')"
          >
            🛰️<span class="connection-dot"></span>
          </button>
        </div>
      </div>
    </div>

    <!-- Título en contenedor separado para móviles -->
    <div v-if="showTitle && isMobile" class="mobile-title-container">
      <h1 class="mobile-map-title">{{ title }}</h1>
    </div>

    <!-- Layout desktop: título centrado con elementos absolutos -->
    <div v-if="!isMobile" class="desktop-header-layout">
      <router-link v-if="showBackButton" :to="backRoute" class="back-button">
        ← {{ $t('nav.back') }}
      </router-link>
      <h1 v-if="showTitle" class="map-title">{{ title }}</h1>

      <!-- Botones del header derecho -->
      <div v-if="showHeaderButtons" class="header-buttons">
      <!-- Botón de idioma -->
      <button
        @click="toggleLanguage"
        class="header-btn language-btn"
        :title="currentLanguage.name + ' - ' + $t('nav.language')"
      >
        <img
          v-if="currentLanguageFlag"
          :src="currentLanguageFlag"
          :alt="currentLanguageCode"
          class="language-flag"
          @error="handleFlagError"
        />
        <span v-else class="language-code">{{ currentLanguageCode }}</span>
      </button>

      <!-- Botón de conexión NASA -->
      <button
        @click="handleConnectionClick"
        class="header-btn connection-btn"
        :title="$t('nav.connection')"
      >
        🛰️<span class="connection-dot"></span>
      </button>
      </div>
    </div>

    <!-- Popups -->
    <div v-show="showConnectionPopup" class="popup connection-popup">
      {{ $t('nav.connectionMessage') }}
    </div>
  </header>
</template>

<script>
export default {
  name: "MainHeader",
  props: {
    title: {
      type: String,
      default: "",
    },
    backRoute: {
      type: String,
      default: "/",
    },
    showTitle: {
      type: Boolean,
      default: true,
    },
    showBackButton: {
      type: Boolean,
      default: true,
    },
    showHeaderButtons: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      showConnectionPopup: false,
      connectionTimeout: null,
      flagImagesSupported: true, // Asumir que sí al inicio
      // Idiomas disponibles - fácil de extender
      availableLanguages: [
        {
          code: 'es',
          name: 'Español',
          flag: 'https://flagpedia.net/data/flags/w580/ar.webp',
          emoji: '🇦🇷'
        },
        {
          code: 'en',
          name: 'English',
          flag: 'https://flagpedia.net/data/flags/w580/gb.webp',
          emoji: '🇬🇧'
        },
        // Futuros idiomas:
        // { code: 'fr', name: 'Français', flag: 'https://flagpedia.net/data/flags/w580/fr.webp', emoji: '🇫🇷' },
        // { code: 'pt', name: 'Português', flag: 'https://flagpedia.net/data/flags/w580/pt.webp', emoji: '🇵🇹' }
      ]
    };
  },
  computed: {
    isMobile() {
      return window.innerWidth <= 768
    },
    currentLanguage() {
      return this.availableLanguages.find(lang => lang.code === this.$i18n.locale) || this.availableLanguages[0]
    },
    currentLanguageCode() {
      return this.currentLanguage.code.toUpperCase()
    },
    currentLanguageFlag() {
      return this.flagImagesSupported ? this.currentLanguage.flag : null
    }
  },
  methods: {
    toggleLanguage() {
      const currentIndex = this.availableLanguages.findIndex(lang => lang.code === this.$i18n.locale)
      const nextIndex = (currentIndex + 1) % this.availableLanguages.length
      const newLocale = this.availableLanguages[nextIndex].code

      // Cambiar el idioma
      this.$i18n.locale = newLocale

      // Guardar en localStorage para persistencia
      localStorage.setItem('user-language', newLocale)

      // Opcional: feedback visual (puedes agregar una animación aquí)
      console.log(`🌍 Idioma cambiado a: ${this.availableLanguages[nextIndex].name}`)
    },

    handleFlagError() {
      // Si la imagen falla, desactivar el uso de imágenes de banderas
      this.flagImagesSupported = false;
    },

    handleConnectionClick() {
      this.showConnectionPopup = true;
      if (this.connectionTimeout) {
        clearTimeout(this.connectionTimeout);
      }
      this.connectionTimeout = setTimeout(() => {
        this.showConnectionPopup = false;
      }, 3000); // 3 segundos
    },
  },

  beforeUnmount() {
    // Limpiar timeouts cuando el componente se destruya
    if (this.connectionTimeout) {
      clearTimeout(this.connectionTimeout);
    }
  },
};
</script>

<style scoped>
.map-header {
  position: relative;
  min-height: 60px;
}

/* Layout desktop */
.desktop-header-layout {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

/* Contenedor de título móvil */
.mobile-title-container {
  padding: 1rem 1.5rem;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.mobile-map-title {
  font-family: var(--font-heading);
  font-size: 1.8rem;
  font-weight: 900;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  margin: 0;
  text-align: center;
  letter-spacing: -0.025em;
  line-height: 1.25;
}

/* Layout móvil - fila única */
.mobile-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  width: 100%;
  box-sizing: border-box;
}

.mobile-left-section {
  display: flex;
  align-items: center;
}

.mobile-right-section {
  display: flex;
  align-items: center;
  margin-left: auto;
}

.mobile-back-button {
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  color: white;
  padding: 8px 16px;
  text-decoration: none;
  border-radius: 25px;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  font-weight: bold;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.mobile-back-button:hover {
  background-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  border-color: rgba(255, 255, 255, 0.4);
}

.mobile-header-buttons {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.back-button {
  position: absolute;
  left: 2rem;
  top: 2rem;
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  color: white;
  padding: 8px 16px;
  text-decoration: none;
  border-radius: 25px;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  font-weight: bold;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.back-button:hover {
  background-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  border-color: rgba(255, 255, 255, 0.4);
}

.map-title {
  font-family: var(--font-heading);
  font-size: 2.5rem;
  font-weight: 900; /* Fira Sans Black */
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  margin: 0;
  text-align: center;
  letter-spacing: -0.025em;
  line-height: 1.25;
  position: relative;
  z-index: 1;
}

/* Desktop responsive */
@media (max-width: 1024px) {
  .desktop-header-layout {
    padding: 1.5rem;
  }

  .back-button {
    left: 1.5rem;
    top: 1.5rem;
  }

  .map-title {
    font-size: 2.2rem;
  }

  .header-buttons {
    right: 1.5rem;
    top: 1.5rem;
  }
}

/* Botones del header derecho */
.header-buttons {
  position: absolute;
  right: 2rem;
  top: 2rem;
  display: flex;
  gap: 0.75rem;
  align-items: center;
  z-index: 10;
}

.header-btn {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  transition: all 0.3s ease;
  position: relative;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  border-color: rgba(255, 255, 255, 0.4);
}

.connection-dot {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 8px;
  height: 8px;
  background: #ff0000;
  border-radius: 50%;
  border: 1px solid white;
  box-shadow: 0 0 4px rgba(255, 0, 0, 0.6);
}

.language-code {
  font-size: 0.7rem;
  font-weight: bold;
  margin-right: 2px;
  opacity: 0.9;
}

.language-flag {
  width: 24px;
  height: 18px;
  border-radius: 2px;
  object-fit: cover;
}

/* Popups */
.popup {
  position: absolute;
  top: 60px;
  right: 0;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(10px);
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-family: var(--font-body);
  font-weight: 400;
  max-width: 250px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
  z-index: 1000;
  animation: fadeIn 0.3s ease-out;
}

.language-popup {
  right: 80px; /* Ajuste para el botón de idioma (primero desde la derecha) */
}

.connection-popup {
  right: 0px; /* Ajuste para el botón de conexión (segundo desde la derecha) */
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Mobile layout activation */
@media (max-width: 768px) {
  .desktop-header-layout {
    display: none;
  }

  .mobile-title-container,
  .mobile-header-layout {
    display: block;
  }
}

/* Mobile responsive adjustments */
@media (max-width: 768px) {
  .mobile-map-title {
    font-size: 1.6rem;
  }

  .mobile-header-layout {
    padding: 0.75rem 1rem;
  }

  .mobile-back-button {
    padding: 6px 12px;
    font-size: 0.8rem;
  }

  .mobile-header-buttons .header-btn {
    width: 32px;
    height: 32px;
    font-size: 0.9rem;
  }

  .connection-dot {
    width: 5px;
    height: 5px;
    top: 4px;
    right: 4px;
  }

  .popup {
    position: absolute;
    top: 100%;
    right: 0;
    margin-top: 0.5rem;
    font-size: 0.8rem;
    padding: 0.5rem 0.75rem;
    max-width: 200px;
  }

  .language-popup {
    right: 40px;
  }

  .connection-popup {
    right: 0;
  }
}

/* Very small mobile optimizations */
@media (max-width: 480px) {
  .mobile-title-container {
    padding: 0.75rem 1rem 0.25rem 1rem;
  }

  .mobile-map-title {
    font-size: 1.4rem;
    line-height: 1.2;
  }

  .mobile-header-layout {
    padding: 0.5rem 0.75rem;
  }

  .mobile-back-button {
    padding: 5px 10px;
    font-size: 0.75rem;
  }

  .mobile-header-buttons .header-btn {
    width: 28px;
    height: 28px;
    font-size: 0.8rem;
  }

  .mobile-header-buttons .language-flag {
    width: 18px;
    height: 14px;
  }

  .connection-dot {
    width: 4px;
    height: 4px;
    top: 3px;
    right: 3px;
  }

  .popup {
    font-size: 0.75rem;
    padding: 0.4rem 0.6rem;
    max-width: 180px;
  }

  .language-popup {
    right: 35px;
  }
}
</style>
