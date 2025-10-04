const express = require("express");
const router = express.Router();
const geospatialController = require("../controllers/geospatialController");

// Córdoba geospatial data routes
router.get("/cordoba/boundaries", geospatialController.getCordobaBoundaries);
router.get(
  "/cordoba/boundaries/simplified",
  geospatialController.getCordobaBoundariesSimplified
);
router.get("/cordoba/centroid", geospatialController.getCordobaCentroid);
router.get("/cordoba/area", geospatialController.getCordobaArea);
router.get("/cordoba/metadata", geospatialController.getGeospatialMetadata);
router.get("/cordoba", geospatialController.getCombinedGeospatialData);

// General geospatial routes
router.get("/regions", (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: "cordoba",
        name: "Provincia de Córdoba",
        country: "Argentina",
        type: "province",
        available: true,
        endpoints: {
          boundaries: "/api/geospatial/cordoba/boundaries",
          centroid: "/api/geospatial/cordoba/centroid",
          area: "/api/geospatial/cordoba/area",
          metadata: "/api/geospatial/cordoba/metadata",
          combined: "/api/geospatial/cordoba",
        },
      },
    ],
    metadata: {
      total_regions: 1,
      source: "Space Apps Córdoba Challenge",
      lastUpdated: new Date().toISOString(),
    },
  });
});

// Info endpoint
router.get("/", (req, res) => {
  res.json({
    message: "Geospatial API",
    description:
      "Geospatial data and boundary information for Space Apps Córdoba",
    endpoints: {
      "cordoba-boundaries":
        "GET /api/geospatial/cordoba/boundaries - Córdoba province boundaries (GeoJSON)",
      "cordoba-simplified":
        "GET /api/geospatial/cordoba/boundaries/simplified - Simplified boundaries",
      "cordoba-centroid":
        "GET /api/geospatial/cordoba/centroid - Province centroid coordinates",
      "cordoba-area":
        "GET /api/geospatial/cordoba/area - Province area information",
      "cordoba-metadata":
        "GET /api/geospatial/cordoba/metadata - Regional metadata",
      "cordoba-combined":
        "GET /api/geospatial/cordoba - All Córdoba geospatial data combined",
      regions: "GET /api/geospatial/regions - List of available regions",
    },
    supported_formats: ["GeoJSON", "JSON"],
    coordinate_system: "WGS84",
    regions: ["Córdoba, Argentina"],
  });
});

module.exports = router;
