/**
 * Constantes para límites geográficos de la Provincia de Córdoba
 * Utilizado para filtrado de datos y restricciones de mapa
 */

// Límites geográficos de la Provincia de Córdoba
export const CORDOBA_BOUNDS = {
  // Coordenadas de las esquinas
  // VALUE: latitude, longitude
  // NORTH_WEST: [MAX_LAT, MIN_LON]
  // SOUTH_EAST: [MIN_LAT, MAX_LON]
  NORTH_WEST: [-29.4, -66.0], // Esquina noroeste
  SOUTH_EAST: [-35.1, -61.7], // Esquina sureste

  // Límites individuales para filtrado
  MIN_LAT: -35.1, // Latitud mínima (sur)
  MAX_LAT: -29.4, // Latitud máxima (norte)
  MIN_LON: -66.0, // Longitud mínima (oeste)
  MAX_LON: -61.7, // Longitud máxima (este)

  // Centro aproximado de la provincia
  CENTER: [-32.25, -63.7],

  // Método helper para verificar si un punto está dentro de Córdoba
  contains(lat, lon) {
    return (
      lat >= this.MIN_LAT &&
      lat <= this.MAX_LAT &&
      lon >= this.MIN_LON &&
      lon <= this.MAX_LON
    );
  },

  // Método para obtener los bounds como array de coordenadas
  getBoundsArray() {
    return [this.SOUTH_EAST, this.NORTH_WEST];
  },

  // Método para obtener los bounds como objeto Leaflet
  getLeafletBounds() {
    return [
      [this.MIN_LAT, this.MIN_LON], // Southwest
      [this.MAX_LAT, this.MAX_LON], // Northeast
    ];
  },
};

// Configuración de zoom para Córdoba
export const CORDOBA_ZOOM_CONFIG = {
  DEFAULT_ZOOM: 9,
  MIN_ZOOM: 8,
  MAX_ZOOM: 18,
  MAX_ZOOM_LOCKED: 12, // Zoom máximo cuando está bloqueado a Córdoba
};

export default CORDOBA_BOUNDS;
