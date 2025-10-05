const express = require("express");
const router = express.Router();

// Import controllers
const dataController = require("../controllers/dataController");
const analysisController = require("../controllers/analysisController");
const nasaController = require("../controllers/nasaController");
const fileController = require("../controllers/fileController");
const geospatialController = require("../controllers/geospatialController");

// Data routes
router.get("/data", dataController.getData);
router.get("/data/:id", dataController.getDataById);
router.post("/data", dataController.createData);
router.put("/data/:id", dataController.updateData);
router.delete("/data/:id", dataController.deleteData);

// Analysis routes (for space apps functionality)
router.get("/analysis", dataController.getAnalysis);
router.post("/analysis", dataController.performAnalysis);

// Map data routes
router.get("/map-data", dataController.getMapData);

// ML Analysis routes
router.post("/analyze", analysisController.analyzeData);
router.post("/normalize", analysisController.normalizeData);
router.get("/models", analysisController.getMethods);
router.get("/statistics", analysisController.getStatistics);

// NASA routes
router.get("/nasa/fire-history", nasaController.getFireHistory);
router.get("/nasa/fire-stats", nasaController.getFireStats);
router.get("/nasa/fire-layers", nasaController.getFireLayers);
router.get("/nasa/fire-incidents", nasaController.getFireIncidents);
router.get("/nasa/health", nasaController.checkApiHealth);

// File upload routes
const {
  uploadSingle,
  uploadMultiple,
  handleUploadError,
} = require("../middleware/upload");
router.post(
  "/upload-data",
  uploadSingle,
  handleUploadError,
  fileController.uploadDataFile
);
router.post(
  "/upload/files",
  uploadMultiple,
  handleUploadError,
  fileController.uploadMultipleFiles
);
router.get("/upload/files", fileController.getUploadedFiles);
router.delete("/upload/files/:filename", fileController.deleteFile);

// Geospatial routes
router.get(
  "/geospatial/cordoba/boundaries",
  geospatialController.getCordobaBoundaries
);
router.get(
  "/geospatial/cordoba/boundaries/simplified",
  geospatialController.getCordobaBoundariesSimplified
);
router.get(
  "/geospatial/cordoba/centroid",
  geospatialController.getCordobaCentroid
);
router.get("/geospatial/cordoba/area", geospatialController.getCordobaArea);
router.get(
  "/geospatial/cordoba/metadata",
  geospatialController.getGeospatialMetadata
);
router.get(
  "/geospatial/cordoba",
  geospatialController.getCombinedGeospatialData
);
router.get("/geospatial/regions", (req, res) => {
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

// Default API info
router.get("/", (req, res) => {
  res.json({
    message: "Space Apps API v1.0",
    endpoints: {
      data: "/api/data",
      analysis: "/api/analysis",
      mapData: "/api/map-data",
      ml: {
        analyze: "/api/analyze",
        normalize: "/api/normalize",
        models: "/api/models",
        statistics: "/api/statistics",
      },
      nasa: {
        "fire-history": "/api/nasa/fire-history",
        "fire-stats": "/api/nasa/fire-stats",
        "fire-layers": "/api/nasa/fire-layers",
        "fire-incidents": "/api/nasa/fire-incidents",
        health: "/api/nasa/health",
      },
      upload: {
        "upload-data": "/api/upload-data",
        "upload-files": "/api/upload/files",
        "list-files": "/api/upload/files",
        "delete-file": "/api/upload/files/:filename",
      },
      geospatial: {
        "cordoba-boundaries": "/api/geospatial/cordoba/boundaries",
        "cordoba-centroid": "/api/geospatial/cordoba/centroid",
        "cordoba-area": "/api/geospatial/cordoba/area",
        "cordoba-metadata": "/api/geospatial/cordoba/metadata",
        "cordoba-combined": "/api/geospatial/cordoba",
        regions: "/api/geospatial/regions",
      },
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    normalizations: ["minmax", "zscore", "robust"],
  });
});

module.exports = router;
