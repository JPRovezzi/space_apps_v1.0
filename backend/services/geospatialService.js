const fs = require("fs");
const path = require("path");

// Load Córdoba province data
let cordobaData = null;

function loadCordobaData() {
  if (!cordobaData) {
    try {
      const dataPath = path.join(__dirname, "../data/cordoba-province.js");
      if (fs.existsSync(dataPath)) {
        // The file exports the data as default
        const fileContent = fs.readFileSync(dataPath, "utf8");
        // Extract the JSON part from the export default statement
        const jsonMatch = fileContent.match(/export default (\{[\s\S]*\})/);
        if (jsonMatch) {
          cordobaData = JSON.parse(jsonMatch[1]);
        } else {
          // Fallback: try to parse the whole file as JSON
          cordobaData = JSON.parse(fileContent);
        }
      }
    } catch (error) {
      console.error("Error loading Córdoba geospatial data:", error);
      // Provide fallback data
      cordobaData = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: {
              name: "Provincia de Córdoba",
              country: "Argentina",
            },
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [-61.7, -29.5],
                  [-65.7, -29.5],
                  [-65.7, -35.0],
                  [-61.7, -35.0],
                  [-61.7, -29.5],
                ],
              ],
            },
          },
        ],
      };
    }
  }
  return cordobaData;
}

const geospatialService = {};

// Get Córdoba province boundaries
geospatialService.getCordobaBoundaries = () => {
  const data = loadCordobaData();
  return {
    success: true,
    data: data,
    metadata: {
      name: "Provincia de Córdoba",
      country: "Argentina",
      type: "province_boundary",
      source: "Geospatial data for Space Apps Córdoba",
      lastUpdated: new Date().toISOString(),
    },
  };
};

// Get simplified Córdoba boundaries (for faster loading)
geospatialService.getCordobaBoundariesSimplified = (tolerance = 0.01) => {
  const data = loadCordobaData();

  // Simple simplification by reducing coordinate precision
  const simplified = JSON.parse(JSON.stringify(data));
  simplified.features.forEach((feature) => {
    if (feature.geometry && feature.geometry.coordinates) {
      feature.geometry.coordinates = feature.geometry.coordinates.map((ring) =>
        ring.map((coord) => [
          Math.round(coord[0] / tolerance) * tolerance,
          Math.round(coord[1] / tolerance) * tolerance,
        ])
      );
    }
  });

  return {
    success: true,
    data: simplified,
    metadata: {
      name: "Provincia de Córdoba (Simplified)",
      country: "Argentina",
      type: "province_boundary_simplified",
      tolerance: tolerance,
      source: "Geospatial data for Space Apps Córdoba",
      lastUpdated: new Date().toISOString(),
    },
  };
};

// Get Córdoba province centroid
geospatialService.getCordobaCentroid = () => {
  const data = loadCordobaData();

  if (!data.features || data.features.length === 0) {
    return {
      success: false,
      error: "No features found in Córdoba data",
    };
  }

  const feature = data.features[0];
  if (!feature.geometry || feature.geometry.type !== "Polygon") {
    return {
      success: false,
      error: "Invalid geometry type",
    };
  }

  // Calculate centroid of the polygon (simple average)
  const coordinates = feature.geometry.coordinates[0];
  let sumLng = 0,
    sumLat = 0;

  coordinates.forEach((coord) => {
    sumLng += coord[0];
    sumLat += coord[1];
  });

  const centroid = {
    longitude: sumLng / coordinates.length,
    latitude: sumLat / coordinates.length,
  };

  return {
    success: true,
    data: {
      centroid: centroid,
      bounds: {
        minLng: Math.min(...coordinates.map((c) => c[0])),
        maxLng: Math.max(...coordinates.map((c) => c[0])),
        minLat: Math.min(...coordinates.map((c) => c[1])),
        maxLat: Math.max(...coordinates.map((c) => c[1])),
      },
    },
    metadata: {
      name: "Centroide Provincia de Córdoba",
      country: "Argentina",
      type: "centroid",
      source: "Calculated from boundary data",
      lastUpdated: new Date().toISOString(),
    },
  };
};

// Get Córdoba province area (approximate in square kilometers)
geospatialService.getCordobaArea = () => {
  // Approximate area of Córdoba province in km²
  const approximateArea = 165321; // Real area is about 165,321 km²

  return {
    success: true,
    data: {
      area: approximateArea,
      unit: "km²",
      note: "Approximate area based on official geographic data",
    },
    metadata: {
      name: "Área Provincia de Córdoba",
      country: "Argentina",
      type: "area_calculation",
      source: "Official geographic data",
      lastUpdated: new Date().toISOString(),
    },
  };
};

// Get Córdoba geospatial metadata
geospatialService.getGeospatialMetadata = () => {
  return {
    success: true,
    data: {
      region: {
        name: "Provincia de Córdoba",
        country: "Argentina",
        continent: "South America",
        area_km2: 165321,
        population: 3760450, // Approximate 2023
        capital: "Córdoba",
      },
      coordinates: {
        centroid: {
          latitude: -32.1429,
          longitude: -63.8017,
        },
        bounds: {
          north: -29.5,
          south: -35.0,
          east: -61.7,
          west: -65.7,
        },
      },
      geospatial: {
        coordinate_system: "WGS84",
        datum: "WGS84",
        format: "GeoJSON",
        geometry_type: "Polygon",
        coordinate_count: 5,
      },
      climate_zones: ["Subtropical humid", "Semiarid", "Temperate"],
      land_use: {
        agriculture: 75,
        urban: 15,
        natural: 10,
      },
    },
    metadata: {
      source: "Geospatial data for NASA Space Apps Córdoba Challenge",
      lastUpdated: new Date().toISOString(),
      version: "1.0",
    },
  };
};

module.exports = geospatialService;
