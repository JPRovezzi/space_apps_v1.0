const dataController = {};

// Sample data store (in a real app, this would be a database)
let sampleData = [
  {
    id: 1,
    name: "Sample Satellite Data",
    type: "satellite",
    coordinates: { lat: -31.4167, lng: -64.1833 },
    data: {
      temperature: 25.5,
      humidity: 65,
      timestamp: new Date().toISOString(),
    },
  },
  {
    id: 2,
    name: "Weather Station Córdoba",
    type: "weather",
    coordinates: { lat: -31.4201, lng: -64.1888 },
    data: {
      temperature: 22.3,
      humidity: 70,
      windSpeed: 12.5,
      timestamp: new Date().toISOString(),
    },
  },
];

// Get all data
dataController.getData = (req, res) => {
  try {
    res.json({
      success: true,
      count: sampleData.length,
      data: sampleData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error fetching data",
    });
  }
};

// Get data by ID
dataController.getDataById = (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const data = sampleData.find((item) => item.id === id);

    if (!data) {
      return res.status(404).json({
        success: false,
        error: "Data not found",
      });
    }

    res.json({
      success: true,
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error fetching data",
    });
  }
};

// Create new data
dataController.createData = (req, res) => {
  try {
    const newData = {
      id: sampleData.length + 1,
      ...req.body,
      timestamp: new Date().toISOString(),
    };

    sampleData.push(newData);

    res.status(201).json({
      success: true,
      data: newData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error creating data",
    });
  }
};

// Update data
dataController.updateData = (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const index = sampleData.findIndex((item) => item.id === id);

    if (index === -1) {
      return res.status(404).json({
        success: false,
        error: "Data not found",
      });
    }

    sampleData[index] = {
      ...sampleData[index],
      ...req.body,
      updatedAt: new Date().toISOString(),
    };

    res.json({
      success: true,
      data: sampleData[index],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error updating data",
    });
  }
};

// Delete data
dataController.deleteData = (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const index = sampleData.findIndex((item) => item.id === id);

    if (index === -1) {
      return res.status(404).json({
        success: false,
        error: "Data not found",
      });
    }

    const deletedData = sampleData.splice(index, 1);

    res.json({
      success: true,
      data: deletedData[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error deleting data",
    });
  }
};

// Get analysis data
dataController.getAnalysis = (req, res) => {
  try {
    // Sample analysis for space apps (temperature trends, etc.)
    const analysis = {
      averageTemperature:
        sampleData.reduce(
          (acc, item) => acc + (item.data.temperature || 0),
          0
        ) / sampleData.length,
      totalStations: sampleData.length,
      dataPoints: sampleData.map((item) => ({
        id: item.id,
        temperature: item.data.temperature,
        coordinates: item.coordinates,
      })),
      timestamp: new Date().toISOString(),
    };

    res.json({
      success: true,
      analysis: analysis,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error performing analysis",
    });
  }
};

// Perform analysis
dataController.performAnalysis = (req, res) => {
  try {
    const { type, parameters } = req.body;

    // Sample analysis logic
    const result = {
      type: type || "temperature-analysis",
      parameters: parameters || {},
      result: {
        status: "completed",
        insights: [
          "Temperature data shows normal patterns",
          "Humidity levels are within expected range",
          "Data collection is consistent",
        ],
      },
      timestamp: new Date().toISOString(),
    };

    res.json({
      success: true,
      analysis: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error performing analysis",
    });
  }
};

// Get map data
dataController.getMapData = (req, res) => {
  try {
    const mapData = sampleData.map((item) => ({
      id: item.id,
      name: item.name,
      type: item.type,
      coordinates: item.coordinates,
      properties: {
        temperature: item.data.temperature,
        lastUpdate: item.data.timestamp,
      },
    }));

    res.json({
      success: true,
      mapData: mapData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error fetching map data",
    });
  }
};

module.exports = dataController;
