import dotenv from 'dotenv';

dotenv.config();

export const config = {
  botToken: process.env.BOT_TOKEN || '',
  apiKey: process.env.API_KEY || '',
  apiBaseUrl: process.env.API_BASE_URL || 'https://api.example.com',
  nodeEnv: process.env.NODE_ENV || 'development',
  logLevel: process.env.LOG_LEVEL || 'info',
};

// Validate required configuration
if (!config.botToken) {
  console.error('Error: BOT_TOKEN is required in .env file');
  process.exit(1);
}
