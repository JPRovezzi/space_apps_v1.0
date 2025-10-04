# Space Apps Backend API

Node.js backend API for the Space Apps Córdoba project.

## Features

- RESTful API with Express.js
- CORS support
- Security middleware (Helmet)
- Request logging (Morgan)
- Environment-based configuration
- Sample data endpoints for satellite/weather data
- Analysis endpoints for space-related data processing

## Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the example configuration:
   ```bash
   cp config.example.js config/index.js
   ```

4. (Optional) Create a `.env` file based on the example configuration

## Usage

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

The server will start on `http://localhost:3000` by default.

## API Endpoints

### Health Check
- `GET /health` - Basic health check
- `GET /health/detailed` - Detailed health information

### Data API
- `GET /api/data` - Get all data
- `GET /api/data/:id` - Get data by ID
- `POST /api/data` - Create new data
- `PUT /api/data/:id` - Update data
- `DELETE /api/data/:id` - Delete data

### Analysis API
- `GET /api/analysis` - Get analysis data
- `POST /api/analysis` - Perform analysis

### Map Data
- `GET /api/map-data` - Get data formatted for map display

## Sample Data

The API includes sample satellite and weather station data for Córdoba, Argentina with the following structure:

```json
{
  "id": 1,
  "name": "Sample Satellite Data",
  "type": "satellite",
  "coordinates": { "lat": -31.4167, "lng": -64.1833 },
  "data": {
    "temperature": 25.5,
    "humidity": 65,
    "timestamp": "2025-10-04T..."
  }
}
```

## Configuration

Configuration is managed through environment variables and the `config/index.js` file:

- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment (development/production)
- `ALLOWED_ORIGINS`: CORS allowed origins
- `JWT_SECRET`: JWT secret key
- `DATABASE_URL`: Database connection URL (future use)
- `NASA_API_KEY`: NASA API key for space data

## Dependencies

- **express**: Web framework
- **cors**: CORS middleware
- **helmet**: Security middleware
- **morgan**: HTTP request logger
- **dotenv**: Environment variable management

## Development Dependencies

- **nodemon**: Auto-restart during development

## Project Structure

```
backend/
├── config/           # Configuration files
├── controllers/      # Route controllers
├── middleware/       # Custom middleware
├── routes/          # API routes
├── server.js        # Main server file
├── package.json     # Dependencies and scripts
└── README.md        # This file
```
