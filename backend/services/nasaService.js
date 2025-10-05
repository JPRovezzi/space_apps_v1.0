const config = require("../config");

// Simple in-memory cache for API responses
const apiCache = new Map();
const CACHE_DURATION = 1000 * 60 * 30; // 30 minutes

const nasaService = {};

// Cache utility functions
const getCacheKey = (url, params = {}) => {
  return `${url}_${JSON.stringify(params)}`;
};

const getCachedData = (key) => {
  const cached = apiCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  if (cached) {
    apiCache.delete(key); // Remove expired cache
  }
  return null;
};

const setCachedData = (key, data) => {
  apiCache.set(key, {
    data,
    timestamp: Date.now(),
  });
};

// Parse CSV data from FIRMS API
const parseFIRMSData = (csvText) => {
  const lines = csvText.trim().split("\n");
  if (lines.length < 2) return [];

  const headers = lines[0].split(",");
  const data = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",");
    if (values.length === headers.length) {
      const row = {};
      headers.forEach((header, index) => {
        const cleanHeader = header.trim().toLowerCase();
        let value = values[index].trim();

        // Convert numeric fields
        if (
          [
            "latitude",
            "longitude",
            "brightness",
            "scan",
            "track",
            "confidence",
            "bright_t31",
            "frp",
          ].includes(cleanHeader)
        ) {
          value = parseFloat(value) || 0;
        }

        row[cleanHeader] = value;
      });
      data.push(row);
    }
  }

  return data;
};

// Simulated fire data for Córdoba, Argentina
// BBOX: -66,-35,-62,-31 (aprox. límites de la provincia de Córdoba)
const generateMockFireData = (year, bbox) => {
  const baseFires = {
    2024: 1250,
    2023: 980,
    2022: 1450,
    2021: 780,
    2020: 2100,
    2019: 1650,
    2018: 1350,
    2017: 1100,
    2016: 950,
    2015: 800,
  };

  const fires = baseFires[year] || Math.floor(Math.random() * 2000) + 500;
  const burnedArea = fires * (Math.random() * 50 + 10); // 10-60 ha por incendio promedio

  return {
    year,
    fires,
    burnedArea: Math.round(burnedArea),
    bbox,
    confidence: "85-95%",
    dataSource: "NASA FIRMS (Simulated)",
    lastUpdated: new Date().toISOString(),
  };
};

// Generate historical fire data for Córdoba
nasaService.getFireHistory = (bbox, startYear, endYear) => {
  const history = [];
  const start = startYear || 2015;
  const end = endYear || new Date().getFullYear();

  for (let year = start; year <= end; year++) {
    history.push(generateMockFireData(year, bbox));
  }

  return {
    region: "Córdoba, Argentina",
    bbox: bbox || "-66,-35,-62,-31",
    period: `${start}-${end}`,
    data: history,
    totalFires: history.reduce((sum, item) => sum + item.fires, 0),
    totalBurnedArea: history.reduce((sum, item) => sum + item.burnedArea, 0),
    averageFiresPerYear: Math.round(
      history.reduce((sum, item) => sum + item.fires, 0) / history.length
    ),
    generatedAt: new Date().toISOString(),
  };
};

// Get fire statistics for a specific year
nasaService.getFireStats = (year, bbox) => {
  const currentYear = year || new Date().getFullYear();
  const currentYearData = generateMockFireData(currentYear, bbox);

  // Calculate previous year comparison
  const previousYearData = generateMockFireData(currentYear - 1, bbox);
  const changePercent = (
    ((currentYearData.fires - previousYearData.fires) /
      previousYearData.fires) *
    100
  ).toFixed(1);

  // Calculate 5-year average
  const fiveYearData = [];
  for (let y = currentYear - 4; y <= currentYear; y++) {
    fiveYearData.push(generateMockFireData(y, bbox));
  }
  const avgFiresPerYear = Math.round(
    fiveYearData.reduce((sum, item) => sum + item.fires, 0) / 5
  );

  return {
    year: currentYear,
    currentYearFires: currentYearData.fires,
    previousYearFires: previousYearData.fires,
    changePercent: parseFloat(changePercent),
    burnedArea: currentYearData.burnedArea,
    avgFiresPerYear,
    confidence: currentYearData.confidence,
    dataSource: currentYearData.dataSource,
    lastUpdated: currentYearData.lastUpdated,
    bbox: bbox || "-66,-35,-62,-31",
  };
};

// Get available fire data layers
nasaService.getAvailableFireLayers = () => {
  return {
    layers: [
      {
        id: "VIIRS_NOAA20_NRT",
        name: "VIIRS NOAA-20 Near Real-Time",
        description: "Datos de incendios en tiempo casi real",
        resolution: "375m",
        temporal_coverage: "Desde 2020",
        active: true,
      },
      {
        id: "MODIS_C6_1",
        name: "MODIS Collection 6.1",
        description: "Datos históricos de incendios MODIS",
        resolution: "1km",
        temporal_coverage: "2000-2023",
        active: true,
      },
      {
        id: "VIIRS_C6_1",
        name: "VIIRS Collection 6.1",
        description: "Datos históricos de incendios VIIRS",
        resolution: "375m",
        temporal_coverage: "2012-2023",
        active: true,
      },
    ],
    dataSource: "NASA FIRMS",
    lastUpdated: new Date().toISOString(),
    note: "Datos simulados para demostración. En producción usar API real de NASA.",
  };
};

// Get detailed fire incidents (for map visualization)
nasaService.getFireIncidents = async (year, bbox) => {
  try {
    // Check if NASA API key is configured
    if (!config.external.nasa.apiKey) {
      console.warn("NASA API key not configured, using simulated data");
      return nasaService.getFireIncidentsSimulated(year, bbox);
    }

    // Default to Córdoba province bounds if not specified
    const defaultBbox = "-66,-35,-62,-31";
    const targetBbox = bbox || defaultBbox;

    // Use VIIRS_NOAA20_NRT for near real-time data
    const apiUrl = `${config.external.nasa.firmsBaseUrl}area/csv/${config.external.nasa.apiKey}/VIIRS_NOAA20_NRT/${targetBbox}/1/`;

    // Check cache first
    const cacheKey = getCacheKey(apiUrl, { year, bbox });
    const cachedData = getCachedData(cacheKey);
    if (cachedData) {
      console.log("Returning cached FIRMS data");
      return cachedData;
    }

    console.log(`Fetching FIRMS data from: ${apiUrl}`);

    // Fetch data from NASA FIRMS API
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    const response = await fetch(apiUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent": "SpaceApps-Cordoba-FireMonitor/1.0",
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(
        `FIRMS API error: ${response.status} ${response.statusText}`
      );
    }

    const csvData = await response.text();

    // Parse CSV data
    const rawIncidents = parseFIRMSData(csvData);

    // Transform to our internal format
    const incidents = rawIncidents.map((row, index) => ({
      id: `fire_${year}_${index + 1}`,
      latitude: parseFloat(row.latitude) || 0,
      longitude: parseFloat(row.longitude) || 0,
      brightness: parseFloat(row.brightness) || 0,
      scan: parseFloat(row.scan) || 0,
      track: parseFloat(row.track) || 0,
      acq_date: row.acq_date || new Date().toISOString().split("T")[0],
      acq_time: row.acq_time || "0000",
      satellite: row.satellite || "VIIRS",
      instrument: row.instrument || "VIIRS",
      confidence: parseInt(row.confidence) || 0,
      version: row.version || "2.0 NRT",
      bright_t31: parseFloat(row.bright_t31) || 0,
      frp: parseFloat(row.frp) || 0,
      daynight: row.daynight || "N",
      // Additional fields for our app
      source: "NASA_FIRMS",
      region: "Córdoba, Argentina",
    }));

    const result = {
      year,
      bbox: targetBbox,
      totalIncidents: incidents.length,
      incidents,
      dataSource: "NASA FIRMS (Real-time)",
      apiUrl,
      generatedAt: new Date().toISOString(),
      cached: false,
    };

    // Cache the result
    setCachedData(cacheKey, result);

    console.log(
      `Fetched ${incidents.length} real fire incidents from NASA FIRMS`
    );

    return result;
  } catch (error) {
    console.error("Error fetching from NASA FIRMS API:", error.message);

    // Fallback to simulated data
    console.log("Falling back to simulated fire data");
    return nasaService.getFireIncidentsSimulated(year, bbox);
  }
};

// Fallback method with simulated data (renamed from original)
nasaService.getFireIncidentsSimulated = (year, bbox) => {
  const numIncidents = Math.floor(Math.random() * 50) + 10; // 10-60 incendios
  const incidents = [];

  // Córdoba province bounds: lat -29.5 to -35.0, lng -66.0 to -62.0
  for (let i = 0; i < numIncidents; i++) {
    incidents.push({
      id: `fire_${year}_${i + 1}`,
      latitude: -29.5 - Math.random() * 5.5, // -29.5 to -35.0
      longitude: -66.0 + Math.random() * 4.0, // -66.0 to -62.0
      brightness: Math.floor(Math.random() * 400) + 300, // 300-700 Kelvin
      scan: Math.random() * 0.5 + 0.3, // 0.3-0.8 km
      track: Math.random() * 0.5 + 0.3, // 0.3-0.8 km
      acq_date: new Date(
        year,
        Math.floor(Math.random() * 12),
        Math.floor(Math.random() * 28) + 1
      )
        .toISOString()
        .split("T")[0],
      acq_time: Math.floor(Math.random() * 2400)
        .toString()
        .padStart(4, "0"),
      satellite: Math.random() > 0.5 ? "NOAA-20" : "NOAA-21",
      instrument: "VIIRS",
      confidence: Math.floor(Math.random() * 40) + 60, // 60-100%
      version: "2.0 NRT",
      bright_t31: Math.floor(Math.random() * 50) + 280, // 280-330 Kelvin
      frp: Math.random() * 50, // Fire Radiative Power
      daynight: Math.random() > 0.7 ? "D" : "N", // 30% day, 70% night
      source: "SIMULATED",
      region: "Córdoba, Argentina",
    });
  }

  return {
    year,
    bbox: bbox || "-66,-35,-62,-31",
    totalIncidents: incidents.length,
    incidents,
    dataSource: "NASA FIRMS (Simulated)",
    generatedAt: new Date().toISOString(),
    cached: false,
  };
};

module.exports = nasaService;
