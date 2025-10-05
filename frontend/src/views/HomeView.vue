<template>
  <div class="home">
    <div class="hero">
      <h1 class="title">SpaceApps de la NASA</h1>
      <p class="subtitle">
        Análisis de Subíndices Normalizados con Machine Learning
      </p>
    </div>

    <div class="visualization-container">
      <div class="shared-background">
        <div class="feature-card">
          <h3>📊 Visualización</h3>
          <p>Gráficos interactivos de resultados</p>
        </div>
        <button class="btn-map">🗺️ Ver Mapa</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HomeView",
};
</script>

<style scoped>
.home {
  height: 100vh;
  background: linear-gradient(135deg, #0c4a6e 0%, #0369a1 50%, #0284c7 100%);
  color: white;
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
  font-size: 4rem;
  font-weight: bold;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  letter-spacing: 2px;
}

.subtitle {
  font-size: 1.5rem;
  opacity: 0.9;
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
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
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
  font-weight: bold;
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
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  color: white;
  padding: 16px 32px;
  border-radius: 50px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1.2rem;
  font-weight: bold;
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
  background-color: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  color: white;
  padding: 16px 32px;
  text-decoration: none;
  border-radius: 50px;
  display: inline-block;
  transition: all 0.3s ease;
  font-size: 1.2rem;
  font-weight: bold;
  border: 2px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.btn-primary:hover {
  background-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
}

.btn-secondary {
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  color: white;
  padding: 16px 32px;
  text-decoration: none;
  border-radius: 50px;
  display: inline-block;
  transition: all 0.3s ease;
  font-size: 1.2rem;
  font-weight: bold;
  border: 2px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  cursor: pointer;
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
