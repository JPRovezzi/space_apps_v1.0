<template>
  <div class="home">
    <div class="hero">
      <h1 class="title">Cometa-3</h1>
      <p class="subtitle">
        Análisis de riesgo para ciudades del hoy y del mañana
      </p>
    </div>

    <div class="visualization-container">
      <div class="shared-background">
        <div class="feature-card">
          <h3>📊 Visualización</h3>
          <p>Gráficos interactivos de resultados</p>
        </div>
        <router-link to="/risk" class="btn-map"> 🗺️ Ver Mapa </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { COLORS } from "@/constants/colors.js";

export default {
  name: "HomeView",
  data() {
    return {
      colors: COLORS,
    };
  },
};
</script>

<style scoped>
.home {
  height: 100vh;
  background: linear-gradient(45deg, #0042a6 0%, #07173f 100%); /* Fallback */
  background: var(--gradient-background);
  color: #ffffff; /* Fallback */
  color: var(--text-primary);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
  box-sizing: border-box;
}

.hero {
  margin-bottom: 3rem;
}

.title {
  font-family: var(--font-heading);
  font-size: 4rem;
  font-weight: 900; /* Fira Sans Black */
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  letter-spacing: -0.025em; /* Espaciado ajustado para títulos */
  line-height: 1.25;
}

.subtitle {
  font-family: var(--font-body);
  font-size: 1.25rem;
  font-weight: 400; /* Overpass Regular */
  opacity: 0.9;
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.5;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 900px;
  width: 100%;
  margin-bottom: 3rem;
}

.shared-background {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  gap: 2rem;
  padding: 2rem;
}

.feature-card {
  background: transparent;
  backdrop-filter: none;
  border: none;
  padding: 0;
  margin: 0;
  border-radius: 0;
  transition: none;
}

.feature-card:hover {
  transform: none;
  box-shadow: none;
}

.feature-card h3 {
  font-family: var(--font-heading);
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  font-weight: 700; /* Fira Sans Bold */
  letter-spacing: -0.025em;
}

.feature-card p {
  opacity: 0.8;
  line-height: 1.5;
}

.visualization-container {
  display: flex;
  justify-content: center;
  max-width: 800px;
  width: 100%;
}

.btn-map {
  font-family: var(--font-heading);
  font-weight: 700; /* Fira Sans Bold */
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  color: white;
  padding: 16px 32px;
  border-radius: 50px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1.125rem;
  text-decoration: none;
  letter-spacing: 0.025em;
}

.btn-map:hover {
  background-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  border-color: rgba(255, 255, 255, 0.4);
}

.navigation {
  margin-top: 2rem;
  display: flex;
  gap: 1rem;
  justify-content: center;
  align-items: center;
}

.btn-primary {
  font-family: var(--font-heading);
  font-weight: 700; /* Fira Sans Bold */
  background-color: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  color: white;
  padding: 16px 32px;
  text-decoration: none;
  border-radius: 50px;
  display: inline-block;
  transition: all 0.3s ease;
  font-size: 1.125rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  letter-spacing: 0.025em;
}

.btn-primary:hover {
  background-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
}

.btn-secondary {
  font-family: var(--font-body);
  font-weight: 700; /* Overpass Bold */
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  color: white;
  padding: 16px 32px;
  text-decoration: none;
  border-radius: 50px;
  display: inline-block;
  transition: all 0.3s ease;
  font-size: 1.125rem;
  border: 2px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  letter-spacing: 0.025em;
}

.btn-secondary:hover {
  background-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  border-color: rgba(255, 255, 255, 0.4);
}

@media (max-width: 768px) {
  .title {
    font-size: 2.5rem;
  }

  .features {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .feature-card {
    padding: 1.5rem;
  }

  .navigation {
    flex-direction: column;
    gap: 0.5rem;
  }

  .shared-background {
    flex-direction: column;
    gap: 1.5rem;
    padding: 1.5rem;
  }

  .btn-primary,
  .btn-secondary,
  .btn-map {
    padding: 12px 24px;
    font-size: 1rem;
  }
}
</style>
