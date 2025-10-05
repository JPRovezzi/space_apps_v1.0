<template>
  <header class="map-header">
    <router-link v-if="showBackButton" :to="backRoute" class="back-button">
      ← Volver
    </router-link>
    <h1 v-if="showTitle" class="map-title">{{ title }}</h1>

    <!-- Botones del header derecho -->
    <div v-if="showHeaderButtons" class="header-buttons">
      <!-- Botón de idioma -->
      <button
        @click="handleLanguageClick"
        class="header-btn language-btn"
        title="Cambiar idioma"
      >
        🇪🇸
      </button>

      <!-- Botón de conexión NASA -->
      <button
        @click="handleConnectionClick"
        class="header-btn connection-btn"
        title="Estado de conexión"
      >
        🛰️<span class="connection-dot"></span>
      </button>
    </div>

    <!-- Popups -->
    <div v-show="showLanguagePopup" class="popup language-popup">
      Cambiar idioma: por el momento el sitio se encuentra solo disponible en
      español.
    </div>

    <div v-show="showConnectionPopup" class="popup connection-popup">
      Conexión con API de la NASA: En desarrollo
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
      showLanguagePopup: false,
      showConnectionPopup: false,
      languageTimeout: null,
      connectionTimeout: null,
    };
  },
  methods: {
    handleLanguageClick() {
      this.showLanguagePopup = true;
      if (this.languageTimeout) {
        clearTimeout(this.languageTimeout);
      }
      this.languageTimeout = setTimeout(() => {
        this.showLanguagePopup = false;
      }, 3000); // 3 segundos
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
    if (this.languageTimeout) {
      clearTimeout(this.languageTimeout);
    }
    if (this.connectionTimeout) {
      clearTimeout(this.connectionTimeout);
    }
  },
};
</script>

<style scoped>
.map-header {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
  min-height: 60px;
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

@media (max-width: 768px) {
  .map-header {
    padding: 1.5rem;
  }

  .back-button {
    left: 1.5rem;
    top: 1.5rem;
    padding: 6px 12px;
    font-size: 0.8rem;
  }

  .map-title {
    font-size: 2rem;
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

/* Responsive */
@media (max-width: 768px) {
  .header-buttons {
    right: 1.5rem;
    top: 1.5rem;
    gap: 0.5rem;
  }

  .header-btn {
    width: 35px;
    height: 35px;
    font-size: 1rem;
  }

  .connection-dot {
    width: 6px;
    height: 6px;
    top: 5px;
    right: 5px;
  }

  .popup {
    top: 50px;
    font-size: 0.8rem;
    padding: 0.5rem 0.75rem;
    max-width: 200px;
  }

  .language-popup {
    right: 60px;
  }
}
</style>
