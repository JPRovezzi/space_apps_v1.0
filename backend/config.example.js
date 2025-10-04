// Example configuration file
// Copy this to config/index.js and update with your actual values

const config = {
  // Server configuration
  port: 3000,
  nodeEnv: "development",

  // CORS configuration
  cors: {
    origin: ["http://localhost:8080", "http://localhost:3000"],
    credentials: true,
  },

  // Database configuration (for future use)
  database: {
    url: null, // Add your database URL here
  },

  // Security configuration
  security: {
    jwtSecret: "your-default-secret-key-change-in-production",
    sessionTimeout: "24h",
  },

  // API configuration
  api: {
    version: "v1",
    prefix: "/api",
  },

  // External APIs (for space data)
  external: {
    nasa: {
      apiKey: null, // Add your NASA API key here
      baseUrl: "https://api.nasa.gov",
    },
  },
};

module.exports = config;
