<template>
  <div
    v-if="show"
    class="mobile-warning-modal"
    @click.self="$emit('close')"
  >
    <div
      class="mobile-warning-content"
      :style="modalStyles"
      :class="{
        'very-small-screen': isVerySmallScreen,
        'small-screen': isSmallScreen,
        'medium-screen': isMediumScreen,
        'large-screen': isLargeScreen,
        'landscape-mode': isLandscape
      }"
    >
      <div class="mobile-warning-header">
        <span class="mobile-icon">📱</span>
        <h3>{{ $t('mobile.title') }}</h3>
      </div>
      <div class="mobile-warning-body">
        <p>{{ $t('mobile.message') }}</p>
        <p>{{ $t('mobile.message2') }}</p>
      </div>
      <div class="mobile-warning-footer">
        <button @click="$emit('close')" class="mobile-warning-btn">
          {{ $t('mobile.button') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MobileWarningModal",
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close'],
  data() {
    return {
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight
    };
  },
  computed: {
    modalStyles() {
      const width = Math.min(this.screenWidth * 0.9, 450);
      const height = Math.min(this.screenHeight * 0.85, 600);
      const fontScale = Math.max(0.8, Math.min(1.2, this.screenWidth / 400));

      return {
        '--modal-width': width + 'px',
        '--modal-height': height + 'px',
        '--font-scale': fontScale,
        '--screen-width': this.screenWidth + 'px',
        '--screen-height': this.screenHeight + 'px'
      };
    },
    isVerySmallScreen() {
      return this.screenWidth < 360;
    },
    isSmallScreen() {
      return this.screenWidth >= 360 && this.screenWidth < 480;
    },
    isMediumScreen() {
      return this.screenWidth >= 480 && this.screenWidth < 768;
    },
    isLargeScreen() {
      return this.screenWidth >= 768;
    },
    isLandscape() {
      return this.screenWidth > this.screenHeight && this.screenHeight < 500;
    }
  },
  mounted() {
    this.updateScreenSize();
    window.addEventListener('resize', this.updateScreenSize);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.updateScreenSize);
  },
  methods: {
    updateScreenSize() {
      this.screenWidth = window.innerWidth;
      this.screenHeight = window.innerHeight;
    }
  }
};
</script>

<style>
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
  border-radius: clamp(12px, 3vw, 16px);
  border: 2px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);

  /* Dimensiones dinámicas usando variables CSS */
  width: var(--modal-width, min(90vw, 450px));
  max-width: min(95vw, 450px);
  height: auto;
  max-height: var(--modal-height, min(85vh, 600px));

  /* Padding dinámico */
  padding: 0;
  overflow-y: auto;
  animation: slideIn 0.4s ease-out;
}

.mobile-warning-header {
  background: var(--gradient-primary);
  color: white;
  padding: clamp(1rem, 4vh, 1.5rem) clamp(1rem, 3vw, 1.5rem);
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.mobile-warning-header h3 {
  font-family: var(--font-heading);
  font-size: clamp(1.1rem, 4vw, 1.4rem);
  font-weight: 700;
  margin: clamp(0.25rem, 2vh, 0.5rem) 0 0 0;
  letter-spacing: -0.025em;
}

.mobile-icon {
  font-size: clamp(1.5rem, 5vw, 2rem);
  display: block;
}

.mobile-warning-body {
  padding: clamp(1rem, 4vh, 1.5rem) clamp(1rem, 3vw, 1.5rem);
  background: rgba(255, 255, 255, 0.02);
}

.mobile-warning-body p {
  font-family: var(--font-body);
  font-size: clamp(0.85rem, 3vw, 1rem);
  line-height: 1.6;
  color: var(--text-primary);
  margin: 0 0 clamp(0.5rem, 2vh, 1rem) 0;
  text-align: center;
  word-wrap: break-word;
  hyphens: auto;
}

.mobile-warning-body p:last-child {
  margin-bottom: 0;
}

.mobile-warning-footer {
  padding: clamp(0.75rem, 3vh, 1rem) clamp(1rem, 3vw, 1.5rem) clamp(1rem, 3vh, 1.5rem) clamp(1rem, 3vw, 1.5rem);
  background: rgba(255, 255, 255, 0.01);
  text-align: center;
}

.mobile-warning-btn {
  background: var(--gradient-primary);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 25px;
  padding: clamp(0.6rem, 2vh, 0.75rem) clamp(1.5rem, 4vw, 2rem);
  font-family: var(--font-heading);
  font-size: clamp(0.9rem, 3vw, 1.1rem);
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  letter-spacing: 0.025em;
  min-width: clamp(120px, 30vw, 200px);
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
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ===========================================
   BREAKPOINTS INTELIGENTES POR TAMAÑO DE PANTALLA
   =========================================== */

/* Pantallas muy pequeñas (< 360px) - Teléfonos pequeños */
.very-small-screen {
  margin: clamp(0.25rem, 1vh, 0.5rem);
}

.very-small-screen .mobile-warning-content {
  width: min(98vw, var(--modal-width, 320px));
  max-height: min(95vh, var(--modal-height, 550px));
}

.very-small-screen .mobile-warning-header {
  padding: clamp(0.75rem, 3vh, 1rem) clamp(0.75rem, 2vw, 1rem);
}

.very-small-screen .mobile-warning-header h3 {
  font-size: clamp(1rem, 5vw, 1.2rem);
  margin-top: clamp(0.25rem, 1vh, 0.4rem);
}

.very-small-screen .mobile-icon {
  font-size: clamp(1.25rem, 6vw, 1.75rem);
}

.very-small-screen .mobile-warning-body {
  padding: clamp(0.75rem, 3vh, 1rem) clamp(0.75rem, 2vw, 1rem);
}

.very-small-screen .mobile-warning-body p {
  font-size: clamp(0.8rem, 4vw, 0.9rem);
  line-height: 1.5;
  margin-bottom: clamp(0.5rem, 2vh, 0.75rem);
}

.very-small-screen .mobile-warning-footer {
  padding: clamp(0.5rem, 2vh, 0.75rem) clamp(0.75rem, 2vw, 1rem) clamp(0.75rem, 2vh, 1rem) clamp(0.75rem, 2vw, 1rem);
}

.very-small-screen .mobile-warning-btn {
  padding: clamp(0.5rem, 2vh, 0.6rem) clamp(1.25rem, 6vw, 1.5rem);
  font-size: clamp(0.85rem, 4vw, 0.95rem);
}

/* Pantallas pequeñas (360px - 480px) - Teléfonos estándar */
.small-screen .mobile-warning-content {
  width: min(95vw, var(--modal-width, 420px));
  max-height: min(90vh, var(--modal-height, 580px));
}

.small-screen .mobile-warning-header h3 {
  font-size: clamp(1.1rem, 4.5vw, 1.3rem);
}

.small-screen .mobile-warning-body p {
  font-size: clamp(0.85rem, 3.5vw, 0.95rem);
}

/* Pantallas medianas (480px - 768px) - Tablets */
.medium-screen .mobile-warning-content {
  width: min(90vw, var(--modal-width, 450px));
  max-height: min(85vh, var(--modal-height, 600px));
}

.medium-screen .mobile-warning-header h3 {
  font-size: clamp(1.2rem, 3.5vw, 1.4rem);
}

.medium-screen .mobile-warning-body p {
  font-size: clamp(0.9rem, 2.8vw, 1rem);
}

.medium-screen .mobile-warning-btn {
  font-size: clamp(0.95rem, 2.5vw, 1.1rem);
}

/* Pantallas grandes (768px+) - Desktop */
.large-screen .mobile-warning-content {
  width: var(--modal-width, 450px);
  max-height: var(--modal-height, 600px);
}

.large-screen .mobile-warning-header h3 {
  font-size: 1.4rem;
}

.large-screen .mobile-warning-body p {
  font-size: 1rem;
}

.large-screen .mobile-warning-btn {
  font-size: 1.1rem;
}

/* ===========================================
   MODO HORIZONTAL (Landscape)
   =========================================== */

.landscape-mode .mobile-warning-content {
  max-height: min(90vh, var(--modal-height, 500px));
  width: min(85vw, var(--modal-width, 400px));
}

.landscape-mode .mobile-warning-header {
  padding: clamp(0.75rem, 2vh, 1.25rem) clamp(1rem, 2vw, 1.25rem);
}

.landscape-mode .mobile-warning-header h3 {
  font-size: clamp(1rem, 3vw, 1.2rem);
}

.landscape-mode .mobile-icon {
  font-size: clamp(1.25rem, 4vw, 1.75rem);
}

.landscape-mode .mobile-warning-body {
  padding: clamp(0.75rem, 2vh, 1rem) clamp(1rem, 2vw, 1.25rem);
}

.landscape-mode .mobile-warning-body p {
  font-size: clamp(0.8rem, 2.5vw, 0.9rem);
  line-height: 1.5;
}

.landscape-mode .mobile-warning-footer {
  padding: clamp(0.5rem, 1.5vh, 0.75rem) clamp(1rem, 2vw, 1.25rem) clamp(0.75rem, 2vh, 1rem) clamp(1rem, 2vw, 1.25rem);
}

.landscape-mode .mobile-warning-btn {
  padding: clamp(0.5rem, 1.5vh, 0.6rem) clamp(1.25rem, 3vw, 1.75rem);
  font-size: clamp(0.85rem, 2.2vw, 0.95rem);
}

/* ===========================================
   UTILIDADES PARA MEJOR ACCESIBILIDAD
   =========================================== */

/* Asegurar que el modal sea accesible en todas las orientaciones */
@media (orientation: landscape) {
  .mobile-warning-modal {
    padding: clamp(0.5rem, 2vh, 1rem);
  }
}

/* Soporte para pantallas de muy alta densidad */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 2dppx) {
  .mobile-warning-content {
    border-radius: clamp(14px, 3.5vw, 18px);
  }
}

/* Soporte para modo oscuro del sistema */
@media (prefers-color-scheme: dark) {
  .mobile-warning-modal {
    background: rgba(0, 0, 0, 0.85);
  }
}
</style>
