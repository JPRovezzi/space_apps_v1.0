const express = require("express");
const router = express.Router();

// Health check endpoint
router.get("/", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.env.npm_package_version || "1.0.0",
  });
});

// Detailed health check
router.get("/detailed", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    environment: {
      nodeVersion: process.version,
      platform: process.platform,
      architecture: process.arch,
    },
    config: {
      port: process.env.PORT || 3000,
      nodeEnv: process.env.NODE_ENV || "development",
    },
  });
});

module.exports = router;
