<template>
  <div class="home">
    <div class="hero">
      <h1 class="title">SpaceApps de la NASA</h1>
      <p class="subtitle">Análisis de Subíndices Normalizados con Machine Learning</p>
    </div>

    <div class="features">
      <div class="feature-card">
        <h3>🔬 Análisis Científico</h3>
        <p>Procesamiento avanzado de datos espaciales</p>
      </div>
      <div class="feature-card">
        <h3>🤖 Machine Learning</h3>
        <p>Algoritmos de normalización automática</p>
      </div>
      <div class="feature-card">
        <h3>📊 Visualización</h3>
        <p>Gráficos interactivos de resultados</p>
      </div>
    </div>

    <div class="navigation">
      <router-link to="/analysis" class="btn-primary">
        🚀 Iniciar Análisis
      </router-link>
      <router-link to="/map" class="btn-secondary">
        🗺️ Ver Mapa
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeView'
}
</script>

<style scoped>
.home {
  min-height: 100vh;
  background: linear-gradient(135deg, #0c4a6e 0%, #0369a1 50%, #0284c7 100%);
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
}

.hero {
  margin-bottom: 3rem;
}

.title {
  font-size: 4rem;
  font-weight: bold;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
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

.feature-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.2);
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
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
}

.btn-primary:hover {
  background-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.3);
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
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  cursor: pointer;
}

.btn-secondary:hover {
  background-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.2);
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

  .btn-primary,
  .btn-secondary {
    padding: 12px 24px;
    font-size: 1rem;
  }
}
</style>
