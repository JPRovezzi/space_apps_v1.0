const nasaService = require("../services/nasaService");

const nasaController = {};

// Get fire history data
nasaController.getFireHistory = (req, res) => {
  try {
    const { bbox, start_year, end_year } = req.query;

    const startYear = start_year ? parseInt(start_year) : 2015;
    const endYear = end_year ? parseInt(end_year) : new Date().getFullYear();

    const historyData = nasaService.getFireHistory(bbox, startYear, endYear);

    res.json({
      success: true,
      data: historyData,
    });
  } catch (error) {
    console.error("Fire history error:", error);
    res.status(500).json({
      success: false,
      error: "Error retrieving fire history data",
    });
  }
};

// Get fire statistics for a specific year
nasaController.getFireStats = (req, res) => {
  try {
    const { year, bbox } = req.query;

    const yearNum = year ? parseInt(year) : new Date().getFullYear();

    const stats = nasaService.getFireStats(yearNum, bbox);

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Fire stats error:", error);
    res.status(500).json({
      success: false,
      error: "Error retrieving fire statistics",
    });
  }
};

// Get available fire data layers
nasaController.getFireLayers = (req, res) => {
  try {
    const layersData = nasaService.getAvailableFireLayers();

    res.json({
      success: true,
      data: layersData,
    });
  } catch (error) {
    console.error("Fire layers error:", error);
    res.status(500).json({
      success: false,
      error: "Error retrieving fire data layers",
    });
  }
};

// Get detailed fire incidents for map visualization
nasaController.getFireIncidents = (req, res) => {
  try {
    const { year, bbox } = req.query;

    const yearNum = year ? parseInt(year) : new Date().getFullYear();

    const incidentsData = nasaService.getFireIncidents(yearNum, bbox);

    res.json({
      success: true,
      data: incidentsData,
    });
  } catch (error) {
    console.error("Fire incidents error:", error);
    res.status(500).json({
      success: false,
      error: "Error retrieving fire incidents data",
    });
  }
};

module.exports = nasaController;
