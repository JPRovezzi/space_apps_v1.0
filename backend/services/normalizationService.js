const normalizationService = {};

// Min-Max Scaling (0-1 range)
function minMaxScale(data) {
  const min = Math.min(...data);
  const max = Math.max(...data);

  if (max === min) {
    return data.map(() => 0.5); // If all values are the same, return 0.5
  }

  return data.map((value) => (value - min) / (max - min));
}

// Z-Score Normalization (mean = 0, std = 1)
function zScoreNormalize(data) {
  const mean = data.reduce((sum, value) => sum + value, 0) / data.length;
  const variance =
    data.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) /
    data.length;
  const std = Math.sqrt(variance);

  if (std === 0) {
    return data.map(() => 0); // If no variance, return 0
  }

  return data.map((value) => (value - mean) / std);
}

// Robust Scaling (median and IQR)
function robustScale(data) {
  const sorted = [...data].sort((a, b) => a - b);
  const n = sorted.length;

  // Calculate Q1 and Q3
  const q1Index = Math.floor(n * 0.25);
  const q3Index = Math.floor(n * 0.75);
  const q1 = sorted[q1Index];
  const q3 = sorted[q3Index];
  const iqr = q3 - q1;

  const median =
    n % 2 === 0
      ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2
      : sorted[Math.floor(n / 2)];

  if (iqr === 0) {
    return data.map(() => 0); // If no IQR, return 0
  }

  return data.map((value) => (value - median) / iqr);
}

// Calculate statistics for a dataset
function calculateStatistics(data) {
  const sorted = [...data].sort((a, b) => a - b);
  const n = data.length;
  const mean = data.reduce((sum, value) => sum + value, 0) / n;
  const variance =
    data.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / n;
  const std = Math.sqrt(variance);

  const median =
    n % 2 === 0
      ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2
      : sorted[Math.floor(n / 2)];

  const min = sorted[0];
  const max = sorted[n - 1];
  const range = max - min;

  // Quartiles
  const q1Index = Math.floor(n * 0.25);
  const q3Index = Math.floor(n * 0.75);
  const q1 = sorted[q1Index];
  const q3 = sorted[q3Index];
  const iqr = q3 - q1;

  return {
    count: n,
    mean: Number(mean.toFixed(4)),
    median: Number(median.toFixed(4)),
    std: Number(std.toFixed(4)),
    variance: Number(variance.toFixed(4)),
    min: Number(min.toFixed(4)),
    max: Number(max.toFixed(4)),
    range: Number(range.toFixed(4)),
    q1: Number(q1.toFixed(4)),
    q3: Number(q3.toFixed(4)),
    iqr: Number(iqr.toFixed(4)),
  };
}

// Main normalization function
normalizationService.normalize = (data, type = "minmax") => {
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("Data must be a non-empty array");
  }

  // Validate all values are numbers
  if (!data.every((value) => typeof value === "number" && !isNaN(value))) {
    throw new Error("All data values must be valid numbers");
  }

  let normalized;
  let algorithm;

  switch (type.toLowerCase()) {
    case "minmax":
      normalized = minMaxScale(data);
      algorithm = "Min-Max Scaling (0-1 range)";
      break;
    case "zscore":
      normalized = zScoreNormalize(data);
      algorithm = "Z-Score Normalization (mean=0, std=1)";
      break;
    case "robust":
      normalized = robustScale(data);
      algorithm = "Robust Scaling (median and IQR)";
      break;
    default:
      throw new Error(
        `Unknown normalization type: ${type}. Supported: minmax, zscore, robust`
      );
  }

  return {
    original: data,
    normalized: normalized.map((value) => Number(value.toFixed(6))),
    normalization_type: type,
    algorithm: algorithm,
    statistics: calculateStatistics(data),
    timestamp: new Date().toISOString(),
  };
};

// Get available normalization methods
normalizationService.getMethods = () => {
  return [
    {
      id: "minmax",
      name: "Min-Max Scaling",
      description: "Escala valores al rango [0,1]",
      formula: "(x - min) / (max - min)",
      use_case: "Cuando se necesita un rango específico [0,1]",
    },
    {
      id: "zscore",
      name: "Z-Score Normalization",
      description: "Media = 0, Desviación estándar = 1",
      formula: "(x - μ) / σ",
      use_case: "Cuando se necesita comparar variables con diferentes unidades",
    },
    {
      id: "robust",
      name: "Robust Scaling",
      description: "Basado en mediana y rango intercuartílico",
      formula: "(x - median) / IQR",
      use_case: "Cuando hay outliers que afectan otras normalizaciones",
    },
  ];
};

module.exports = normalizationService;
