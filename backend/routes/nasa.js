const express = require("express");
const router = express.Router();
const nasaController = require("../controllers/nasaController");

// NASA FIRMS fire data endpoints
router.get("/fire-history", nasaController.getFireHistory);
router.get("/fire-stats", nasaController.getFireStats);
router.get("/fire-layers", nasaController.getFireLayers);
router.get("/fire-incidents", nasaController.getFireIncidents);

// Info endpoint
router.get("/", (req, res) => {
  const config = require("../config");
  const hasApiKey = !!config.external.nasa.apiKey;

  res.json({
    message: hasApiKey
      ? "NASA FIRMS API (Real + Simulated Fallback)"
      : "NASA FIRMS API (Simulated)",
    description: hasApiKey
      ? "NASA Fire Information for Resource Management System with real-time data and simulated fallback"
      : "Simulated NASA Fire Information for Resource Management System data",
    endpoints: {
      "fire-history": "GET /api/v1/nasa/fire-history - Historical fire data",
      "fire-stats":
        "GET /api/v1/nasa/fire-stats - Fire statistics for specific year",
      "fire-layers":
        "GET /api/v1/nasa/fire-layers - Available fire data layers",
      "fire-incidents":
        "GET /api/v1/nasa/fire-incidents - Detailed fire incidents",
      health: "GET /api/v1/nasa/health - API connection health check",
    },
    parameters: {
      bbox: "Bounding box (format: minLng,minLat,maxLng,maxLat)",
      year: "Specific year for data",
      start_year: "Start year for historical data",
      end_year: "End year for historical data",
    },
    status: {
      apiKeyConfigured: hasApiKey,
      realTimeData: hasApiKey,
      fallbackAvailable: true,
      cacheEnabled: true,
      cacheDuration: "30 minutes",
    },
    dataSources: {
      primary: hasApiKey ? "NASA FIRMS Real-time API" : null,
      fallback: "Simulated data",
      bbox: "Córdoba Province: -66,-35,-62,-31",
    },
  });
});

module.exports = router;
