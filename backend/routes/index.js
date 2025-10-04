const express = require("express");
const router = express.Router();

// Import route modules
const healthRoutes = require("./health");
const apiRoutes = require("./api");

// Health check routes
router.use("/health", healthRoutes);

// API routes
router.use("/api", apiRoutes);
// API v1 routes (for frontend compatibility)
router.use("/api/v1", apiRoutes);

// Default route
router.get("/", (req, res) => {
  res.json({
    message: "Space Apps API",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      api: "/api",
      api_v1: "/api/v1",
    },
  });
});

module.exports = router;
