const geospatialService = require("../services/geospatialService");

const geospatialController = {};

// Get Córdoba province boundaries
geospatialController.getCordobaBoundaries = (req, res) => {
  try {
    const result = geospatialService.getCordobaBoundaries();

    res.json({
      success: true,
      data: result.data,
      metadata: result.metadata,
    });
  } catch (error) {
    console.error("Córdoba boundaries error:", error);
    res.status(500).json({
      success: false,
      error: "Error retrieving Córdoba geospatial boundaries",
    });
  }
};

// Get simplified Córdoba boundaries
geospatialController.getCordobaBoundariesSimplified = (req, res) => {
  try {
    const { tolerance } = req.query;
    const toleranceNum = tolerance ? parseFloat(tolerance) : 0.01;

    const result =
      geospatialService.getCordobaBoundariesSimplified(toleranceNum);

    res.json({
      success: true,
      data: result.data,
      metadata: result.metadata,
    });
  } catch (error) {
    console.error("Simplified boundaries error:", error);
    res.status(500).json({
      success: false,
      error: "Error retrieving simplified Córdoba boundaries",
    });
  }
};

// Get Córdoba centroid
geospatialController.getCordobaCentroid = (req, res) => {
  try {
    const result = geospatialService.getCordobaCentroid();

    if (!result.success) {
      return res.status(404).json(result);
    }

    res.json({
      success: true,
      data: result.data,
      metadata: result.metadata,
    });
  } catch (error) {
    console.error("Centroid error:", error);
    res.status(500).json({
      success: false,
      error: "Error calculating Córdoba centroid",
    });
  }
};

// Get Córdoba area
geospatialController.getCordobaArea = (req, res) => {
  try {
    const result = geospatialService.getCordobaArea();

    res.json({
      success: true,
      data: result.data,
      metadata: result.metadata,
    });
  } catch (error) {
    console.error("Area error:", error);
    res.status(500).json({
      success: false,
      error: "Error retrieving Córdoba area data",
    });
  }
};

// Get geospatial metadata
geospatialController.getGeospatialMetadata = (req, res) => {
  try {
    const result = geospatialService.getGeospatialMetadata();

    res.json({
      success: true,
      data: result.data,
      metadata: result.metadata,
    });
  } catch (error) {
    console.error("Metadata error:", error);
    res.status(500).json({
      success: false,
      error: "Error retrieving geospatial metadata",
    });
  }
};

// Get combined geospatial data (boundaries + metadata)
geospatialController.getCombinedGeospatialData = (req, res) => {
  try {
    const boundaries = geospatialService.getCordobaBoundaries();
    const centroid = geospatialService.getCordobaCentroid();
    const area = geospatialService.getCordobaArea();
    const metadata = geospatialService.getGeospatialMetadata();

    res.json({
      success: true,
      data: {
        boundaries: boundaries.data,
        centroid: centroid.success ? centroid.data : null,
        area: area.data,
        region: metadata.data.region,
        coordinates: metadata.data.coordinates,
      },
      metadata: {
        name: "Datos Geoespaciales Completos - Provincia de Córdoba",
        country: "Argentina",
        type: "complete_geospatial_data",
        source: "Space Apps Córdoba Challenge",
        lastUpdated: new Date().toISOString(),
        endpoints: {
          boundaries: "/api/geospatial/cordoba/boundaries",
          centroid: "/api/geospatial/cordoba/centroid",
          area: "/api/geospatial/cordoba/area",
          metadata: "/api/geospatial/cordoba/metadata",
        },
      },
    });
  } catch (error) {
    console.error("Combined data error:", error);
    res.status(500).json({
      success: false,
      error: "Error retrieving combined geospatial data",
    });
  }
};

module.exports = geospatialController;
