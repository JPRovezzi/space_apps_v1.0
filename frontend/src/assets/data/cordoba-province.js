import { CORDOBA_BOUNDS } from "../../constants/geographicBounds.js";

export default {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        name: "Provincia de Córdoba",
        country: "Argentina",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [CORDOBA_BOUNDS.MIN_LON, CORDOBA_BOUNDS.MAX_LAT], // Noroeste
            [CORDOBA_BOUNDS.MAX_LON, CORDOBA_BOUNDS.MAX_LAT], // Noreste
            [CORDOBA_BOUNDS.MAX_LON, CORDOBA_BOUNDS.MIN_LAT], // Sureste
            [CORDOBA_BOUNDS.MIN_LON, CORDOBA_BOUNDS.MIN_LAT], // Suroeste
            [CORDOBA_BOUNDS.MIN_LON, CORDOBA_BOUNDS.MAX_LAT], // Cerrar el polígono
          ],
        ],
      },
    },
  ],
};
