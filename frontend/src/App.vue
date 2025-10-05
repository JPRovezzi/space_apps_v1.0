<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { COLORS } from "@/constants/colors.js";

export default {
  name: "App",
  data() {
    return {
      colors: COLORS,
    };
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
  },
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Variables CSS se aplican dinámicamente en mounted() */

html,
body {
  height: 100%;
  background: linear-gradient(45deg, #0042a6 0%, #07173f 100%); /* Fallback */
  background: var(--gradient-background); /* Variable CSS dinámica */
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
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
