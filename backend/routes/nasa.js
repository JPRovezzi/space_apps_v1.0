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
  res.json({
    message: "NASA FIRMS API (Simulated)",
    description:
      "Simulated NASA Fire Information for Resource Management System data",
    endpoints: {
      "fire-history": "GET /api/v1/nasa/fire-history - Historical fire data",
      "fire-stats":
        "GET /api/v1/nasa/fire-stats - Fire statistics for specific year",
      "fire-layers":
        "GET /api/v1/nasa/fire-layers - Available fire data layers",
      "fire-incidents":
        "GET /api/v1/nasa/fire-incidents - Detailed fire incidents",
    },
    parameters: {
      bbox: "Bounding box (format: minLng,minLat,maxLng,maxLat)",
      year: "Specific year for data",
      start_year: "Start year for historical data",
      end_year: "End year for historical data",
    },
    note: "This is simulated data. In production, integrate with real NASA FIRMS API.",
  });
});

module.exports = router;
