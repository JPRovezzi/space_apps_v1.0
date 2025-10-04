<template>
  <div class="map-view">
    <header class="map-header">
      <router-link to="/" class="back-button">
        ← Volver
      </router-link>
      <h1 class="map-title">Mapa de Córdoba</h1>
    </header>
    <div class="divider"></div>

    <!-- Aquí irá el contenido del mapa en el futuro -->
    <div class="map-content">
      <p>Contenido del mapa próximamente...</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MapView'
}
</script>

<style scoped>
.map-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #0c4a6e 0%, #0369a1 50%, #0284c7 100%);
  color: white;
  display: flex;
  flex-direction: column;
}

.map-header {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
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
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.back-button:hover {
  background-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  border-color: rgba(255, 255, 255, 0.4);
}

.map-title {
  font-size: 2.5rem;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
  margin: 0;
  text-align: center;
}

.divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.3);
  margin: 0 2rem;
}

.map-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.map-content p {
  font-size: 1.2rem;
  opacity: 0.8;
  text-align: center;
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

  .divider {
    margin: 0 1.5rem;
  }

  .map-content {
    padding: 1.5rem;
  }
}
</style>
