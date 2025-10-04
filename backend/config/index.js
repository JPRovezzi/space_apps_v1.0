require('dotenv').config();

const config = {
  // Server configuration
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',

  // CORS configuration
  cors: {
    origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:8080', 'http://localhost:3000'],
    credentials: true
  },

  // Database configuration (for future use)
  database: {
    url: process.env.DATABASE_URL
  },

  // Security configuration
  security: {
    jwtSecret: process.env.JWT_SECRET || 'your-default-secret-key-change-in-production',
    sessionTimeout: process.env.SESSION_TIMEOUT || '24h'
  },

  // API configuration
  api: {
    version: 'v1',
    prefix: '/api'
  },

  // External APIs (for space data)
  external: {
    nasa: {
      apiKey: process.env.NASA_API_KEY,
      baseUrl: 'https://api.nasa.gov'
    },
    // Add more external APIs as needed
  }
};

module.exports = config;
