const normalizationService = require("../services/normalizationService");

const analysisController = {};

// Analyze data with normalization
analysisController.analyzeData = (req, res) => {
  try {
    const { data, normalization_type = "minmax" } = req.body;

    if (!data || !Array.isArray(data)) {
      return res.status(400).json({
        success: false,
        error: "Data array is required",
      });
    }

    const result = normalizationService.normalize(data, normalization_type);

    res.json({
      success: true,
      analysis: result,
    });
  } catch (error) {
    console.error("Analysis error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Error performing analysis",
    });
  }
};

// Specific normalization endpoint (legacy compatibility)
analysisController.normalizeData = (req, res) => {
  try {
    const { data, normalization_type = "minmax" } = req.body;

    if (!data || !Array.isArray(data)) {
      return res.status(400).json({
        success: false,
        error: "Data array is required",
      });
    }

    const result = normalizationService.normalize(data, normalization_type);

    res.json({
      success: true,
      data: result.original,
      normalized: result.normalized,
      normalization_type: result.normalization_type,
      statistics: result.statistics,
    });
  } catch (error) {
    console.error("Normalization error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Error performing normalization",
    });
  }
};

// Get available normalization methods
analysisController.getMethods = (req, res) => {
  try {
    const methods = normalizationService.getMethods();

    res.json({
      success: true,
      models: methods.map((method) => ({
        id: method.id,
        name: method.name,
        description: method.description,
        formula: method.formula,
        use_case: method.use_case,
      })),
    });
  } catch (error) {
    console.error("Get methods error:", error);
    res.status(500).json({
      success: false,
      error: "Error retrieving normalization methods",
    });
  }
};

// Get analysis statistics
analysisController.getStatistics = (req, res) => {
  try {
    // Sample statistics for demonstration
    const stats = {
      total_analyses: 42,
      normalization_types: {
        minmax: 15,
        zscore: 18,
        robust: 9,
      },
      average_processing_time: 0.023,
      last_updated: new Date().toISOString(),
      popular_methods: ["zscore", "minmax", "robust"],
    };

    res.json({
      success: true,
      statistics: stats,
    });
  } catch (error) {
    console.error("Statistics error:", error);
    res.status(500).json({
      success: false,
      error: "Error retrieving statistics",
    });
  }
};

module.exports = analysisController;
