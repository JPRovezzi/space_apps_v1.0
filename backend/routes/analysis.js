const express = require("express");
const router = express.Router();
const analysisController = require("../controllers/analysisController");

// Analysis endpoints
router.post("/analyze", analysisController.analyzeData);
router.post("/normalize", analysisController.normalizeData);
router.get("/models", analysisController.getMethods);
router.get("/statistics", analysisController.getStatistics);

// Info endpoint
router.get("/", (req, res) => {
  res.json({
    message: "Analysis API",
    endpoints: {
      analyze: "POST /api/v1/analyze - Analyze data with normalization",
      normalize: "POST /api/v1/normalize - Normalize data specifically",
      models: "GET /api/v1/models - Get available normalization methods",
      statistics: "GET /api/v1/statistics - Get analysis statistics",
    },
    supported_normalizations: ["minmax", "zscore", "robust"],
  });
});

module.exports = router;
