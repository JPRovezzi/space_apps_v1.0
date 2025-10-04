const nasaService = {};

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
nasaService.getFireIncidents = (year, bbox) => {
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
    });
  }

  return {
    year,
    bbox: bbox || "-66,-35,-62,-31",
    totalIncidents: incidents.length,
    incidents,
    dataSource: "NASA FIRMS (Simulated)",
    generatedAt: new Date().toISOString(),
  };
};

module.exports = nasaService;
