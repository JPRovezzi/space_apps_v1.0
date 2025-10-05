const nasaService = require("../services/nasaService");
const config = require("../config");

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
nasaController.getFireIncidents = async (req, res) => {
  try {
    const { year, bbox } = req.query;

    const yearNum = year ? parseInt(year) : new Date().getFullYear();

    const incidentsData = await nasaService.getFireIncidents(yearNum, bbox);

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

// Check NASA API connection health
nasaController.checkApiHealth = async (req, res) => {
  try {
    // Check if NASA API key is configured
    if (!config.external.nasa.apiKey) {
      return res.status(503).json({
        status: "error",
        message: "NASA API key not configured",
        nasaApi: false,
        details: {
          apiKeyConfigured: false,
          firmsAvailable: false,
          cmrAvailable: false,
        },
      });
    }

    // Test FIRMS API connection with a small query
    const firmsTestUrl = `${config.external.nasa.firmsBaseUrl}area/csv/${config.external.nasa.apiKey}/VIIRS_NOAA20_NRT/-66,-35,-62,-31/1/`;
    console.log("Testing FIRMS URL:", firmsTestUrl);

    let firmsAvailable = false;
    let cmrAvailable = false;

    // Test FIRMS API connection
    try {
      const firmsController = new AbortController();
      const firmsTimeoutId = setTimeout(() => firmsController.abort(), 15000); // 15 second timeout

      const firmsResponse = await fetch(firmsTestUrl, {
        signal: firmsController.signal,
        headers: {
          "User-Agent": "SpaceApps-Cordoba-FireMonitor/1.0",
        },
      });

      clearTimeout(firmsTimeoutId);

      if (firmsResponse.ok) {
        const csvData = await firmsResponse.text();
        console.log("FIRMS response length:", csvData.length);
        // Check if we got actual data (not empty response)
        firmsAvailable = csvData.length > 100; // Basic check for data
        console.log("FIRMS available:", firmsAvailable);
      } else {
        console.log("FIRMS response status:", firmsResponse.status);
      }
    } catch (firmsError) {
      console.warn("FIRMS API test failed:", firmsError.message);
      if (firmsError.name === "AbortError") {
        console.warn("FIRMS request timed out");
      }
    }

    // Test CMR API connection
    try {
      const cmrTestUrl = `${config.external.nasa.cmrBaseUrl}collections.json?provider=NASA_GSFC&short_name=MOD09GQ`;
      console.log("Testing CMR URL:", cmrTestUrl);

      const cmrController = new AbortController();
      const cmrTimeoutId = setTimeout(() => cmrController.abort(), 10000); // 10 second timeout

      const cmrResponse = await fetch(cmrTestUrl, {
        signal: cmrController.signal,
        headers: {
          "User-Agent": "SpaceApps-Cordoba-FireMonitor/1.0",
        },
      });

      clearTimeout(cmrTimeoutId);

      cmrAvailable = cmrResponse.ok;
      console.log("CMR response status:", cmrResponse.status);
      console.log("CMR available:", cmrAvailable);
    } catch (cmrError) {
      console.warn("CMR API test failed:", cmrError.message);
      if (cmrError.name === "AbortError") {
        console.warn("CMR request timed out");
      }
    }

    const overallStatus = firmsAvailable || cmrAvailable ? "ok" : "degraded";

    res.json({
      status: overallStatus,
      message:
        overallStatus === "ok" ? "NASA APIs operational" : "NASA APIs degraded",
      nasaApi: overallStatus === "ok",
      details: {
        apiKeyConfigured: true,
        firmsAvailable,
        cmrAvailable,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("NASA API health check error:", error);
    res.status(503).json({
      status: "error",
      message: "NASA API health check failed",
      nasaApi: false,
      details: {
        error: error.message,
        timestamp: new Date().toISOString(),
      },
    });
  }
};

module.exports = nasaController;
