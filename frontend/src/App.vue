<template>
  <div id="app">
    <MainHeader
      :title="headerTitle"
      :back-route="headerBackRoute"
      :show-title="headerShowTitle"
      :show-back-button="headerShowBackButton"
      :show-header-buttons="headerShowButtons"
    />
    <router-view />

    <!-- Modal de dispositivo móvil no soportado -->
    <div
      v-if="showMobileWarning"
      class="mobile-warning-modal"
      @click.self="closeMobileWarning"
    >
      <div class="mobile-warning-content">
        <div class="mobile-warning-header">
          <span class="mobile-icon">📱</span>
          <h3>Modo Móvil No Soportado</h3>
        </div>
        <div class="mobile-warning-body">
          <p>
            Actualmente, la aplicación Astrochingolo está optimizada únicamente
            para dispositivos de escritorio. La versión móvil se encuentra en
            desarrollo.
          </p>
          <p>
            Para una mejor experiencia, te recomendamos acceder desde una
            computadora o dispositivo con pantalla más grande.
          </p>
        </div>
        <div class="mobile-warning-footer">
          <button @click="closeMobileWarning" class="mobile-warning-btn">
            Entendido
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MainHeader from "@/components/MainHeader.vue";
import { COLORS } from "@/constants/colors.js";

export default {
  name: "App",
  components: {
    MainHeader,
  },
  data() {
    return {
      colors: COLORS,
      showMobileWarning: false,
    };
  },
  computed: {
    headerTitle() {
      switch (this.$route.path) {
        case "/risk":
          return "Mapa de riesgos";
        default:
          return "";
      }
    },
    headerBackRoute() {
      switch (this.$route.path) {
        case "/risk":
          return "/";
        default:
          return "/";
      }
    },
    headerShowTitle() {
      return this.$route.path === "/risk";
    },
    headerShowBackButton() {
      return this.$route.path === "/risk";
    },
    headerShowButtons() {
      // Mostrar botones en todas las rutas por ahora
      return true;
    },
  },
  methods: {
    isMobileDevice() {
      // Detectar dispositivos móviles usando múltiples métodos para mayor precisión
      return (
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        ) ||
        (window.innerWidth <= 768 && window.innerHeight <= 1024) ||
        ("ontouchstart" in window && window.innerWidth <= 768)
      );
    },
    closeMobileWarning() {
      this.showMobileWarning = false;
      // No guardar en localStorage para que aparezca cada vez que se refresque
    },
  },
  mounted() {
    // Aplicar las variables CSS dinámicamente para asegurar que estén disponibles
    const root = document.documentElement;
    root.style.setProperty("--electric-blue", this.colors.electricBlue);
    root.style.setProperty("--deep-blue", this.colors.deepBlue);
    root.style.setProperty("--neon-yellow", this.colors.neonYellow);
    root.style.setProperty("--white", this.colors.white);
    root.style.setProperty("--neon-blue", this.colors.neonBlue);
    root.style.setProperty("--blue-yonder", this.colors.blueYonder);
    root.style.setProperty("--rocket-red", this.colors.rocketRed);
    root.style.setProperty("--martian-red", this.colors.martianRed);

    // Gradientes oficiales
    root.style.setProperty("--gradient-primary", this.colors.gradientPrimary);
    root.style.setProperty(
      "--gradient-background",
      this.colors.gradientBackground
    );
    root.style.setProperty(
      "--gradient-secondary",
      this.colors.gradientSecondary
    );
    root.style.setProperty("--gradient-accent", this.colors.gradientAccent);

    // Colores de texto
    root.style.setProperty("--text-primary", this.colors.textPrimary);
    root.style.setProperty("--text-secondary", this.colors.textSecondary);
    root.style.setProperty("--text-muted", this.colors.textMuted);
    root.style.setProperty("--text-on-dark", this.colors.textOnDark);
    root.style.setProperty("--text-on-primary", this.colors.textOnPrimary);

    // Estados
    root.style.setProperty("--success", this.colors.success);
    root.style.setProperty("--warning", this.colors.warning);
    root.style.setProperty("--error", this.colors.error);
    root.style.setProperty("--danger", this.colors.danger);
    root.style.setProperty("--info", this.colors.info);

    // Acentos (regla 60-30-10)
    root.style.setProperty("--accent-primary", this.colors.accentPrimary);
    root.style.setProperty("--accent-secondary", this.colors.accentSecondary);
    root.style.setProperty("--accent-minimal", this.colors.accentMinimal);

    // Aplicar fuentes tipográficas
    root.style.setProperty("--font-heading", "'Fira Sans', sans-serif");
    root.style.setProperty("--font-body", "'Overpass', sans-serif");
    root.style.setProperty("--font-code", "'Fira Code', monospace");

    // Detectar dispositivo móvil y mostrar warning si es necesario
    this.$nextTick(() => {
      if (this.isMobileDevice()) {
        this.showMobileWarning = true;
      }

      // Listener para cambios de tamaño de ventana (rotación de dispositivo)
      window.addEventListener("resize", () => {
        if (this.isMobileDevice() && !this.showMobileWarning) {
          this.showMobileWarning = true;
        }
      });
    });
  },
};
</script>

<style>
/* Importar fuentes oficiales NASA Space Apps desde Google Fonts */
@import url("https://fonts.googleapis.com/css2?family=Fira+Sans:wght@400;700;900&family=Overpass:wght@400;700;900&family=Fira+Code:wght@400;700&display=swap");

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Variables CSS se aplican dinámicamente en mounted() */

/* Fuentes para elementos de código */
code,
pre,
kbd,
samp {
  font-family: var(--font-code);
  font-weight: 400; /* Fira Code Regular */
}

code {
  background: rgba(0, 0, 0, 0.05);
  padding: 0.125rem 0.25rem;
  border-radius: 3px;
  font-size: 0.9em;
}

pre {
  background: rgba(0, 0, 0, 0.05);
  padding: 1rem;
  border-radius: 6px;
  overflow-x: auto;
  font-size: 0.875rem;
  line-height: 1.5;
}

pre code {
  background: transparent;
  padding: 0;
  border-radius: 0;
}

html,
body {
  height: 100%;
  background: linear-gradient(45deg, #0042a6 0%, #07173f 100%); /* Fallback */
  background: var(--gradient-background); /* Variable CSS dinámica */
}

#app {
  font-family: var(--font-body);
  font-size: 16px;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #ffffff;
  color: var(--text-primary);
  min-height: 100vh;
  background: linear-gradient(45deg, #0042a6 0%, #07173f 100%); /* Fallback */
  background: var(--gradient-background);
}

/* Modal de advertencia para dispositivos móviles */
.mobile-warning-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  animation: fadeIn 0.3s ease-out;
}

.mobile-warning-content {
  background: var(--deep-blue);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  max-width: 90vw;
  max-height: 80vh;
  width: 400px;
  padding: 0;
  overflow: hidden;
  animation: slideIn 0.4s ease-out;
}

.mobile-warning-header {
  background: var(--gradient-primary);
  color: white;
  padding: 1.5rem;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.mobile-warning-header h3 {
  font-family: var(--font-heading);
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0.5rem 0 0 0;
  letter-spacing: -0.025em;
}

.mobile-icon {
  font-size: 2rem;
  display: block;
}

.mobile-warning-body {
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.02);
}

.mobile-warning-body p {
  font-family: var(--font-body);
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--text-primary);
  margin: 0 0 1rem 0;
  text-align: center;
}

.mobile-warning-body p:last-child {
  margin-bottom: 0;
}

.mobile-warning-footer {
  padding: 1rem 1.5rem 1.5rem 1.5rem;
  background: rgba(255, 255, 255, 0.01);
  text-align: center;
}

.mobile-warning-btn {
  background: var(--gradient-primary);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 25px;
  padding: 0.75rem 2rem;
  font-family: var(--font-heading);
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  letter-spacing: 0.025em;
}

.mobile-warning-btn:hover {
  background: var(--gradient-accent);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Responsive para el modal */
@media (max-width: 480px) {
  .mobile-warning-content {
    width: 95vw;
    margin: 1rem;
  }

  .mobile-warning-header {
    padding: 1rem;
  }

  .mobile-warning-header h3 {
    font-size: 1.1rem;
  }

  .mobile-warning-body {
    padding: 1rem;
  }

  .mobile-warning-body p {
    font-size: 0.9rem;
  }

  .mobile-warning-footer {
    padding: 0.75rem 1rem 1rem 1rem;
  }

  .mobile-warning-btn {
    padding: 0.6rem 1.5rem;
    font-size: 0.9rem;
  }
}
</style>
