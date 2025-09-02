module.exports = {
  // Server Configuration
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',

  // CORS Configuration
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',

  // Database Configuration
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/beer-rating-app',

  // File Upload Configuration
  MAX_FILE_SIZE: process.env.MAX_FILE_SIZE || 500 * 1024 * 1024, // 500MB in bytes
  UPLOAD_PATH: process.env.UPLOAD_PATH || 'uploads',
  
  // Supported video formats
  SUPPORTED_FORMATS: ['.mp4', '.webm', '.ogg', '.avi', '.mov', '.wmv', '.flv', '.mkv'],

  // API Configuration
  API_BASE_URL: process.env.API_BASE_URL || '/api'
}; 