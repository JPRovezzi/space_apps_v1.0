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
</style>
