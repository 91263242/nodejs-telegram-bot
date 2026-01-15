import axios from 'axios';
import { config } from '../config/config.js';
import logger from '../utils/logger.js';
import { ErrorHandler } from '../utils/errorHandler.js';

/**
 * Service for integrating with external APIs
 */
class ApiService {
  constructor() {
    this.client = axios.create({
      baseURL: config.apiBaseUrl,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        ...(config.apiKey && { 'Authorization': `Bearer ${config.apiKey}` }),
      },
    });

    // Add request interceptor for logging
    this.client.interceptors.request.use(
      (request) => {
        logger.debug(`API Request: ${request.method} ${request.url}`);
        return request;
      },
      (error) => {
        logger.error('API Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        // Only log error message, not full stack trace
        if (error.response) {
          logger.error(`API Response Error: ${error.response.status} - ${error.message}`);
        } else if (error.request) {
          logger.error(`API Request Error: ${error.message}`);
        } else {
          logger.error(`API Error: ${error.message}`);
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Fetch weather data using wttr.in API (free, no API key required)
   */
  async getWeatherData(city) {
    try {
      // Using wttr.in API - free weather service
      const response = await axios.get(`https://wttr.in/${encodeURIComponent(city)}`, {
        params: {
          format: 'j1', // JSON format
        },
        timeout: 8000,
      });
      
      if (!response.data || !response.data.current_condition) {
        throw new Error('Invalid weather data received');
      }

      const current = response.data.current_condition[0];
      const location = response.data.nearest_area[0];
      
      return {
        location: location.areaName[0].value,
        country: location.country[0].value,
        temp: current.temp_C,
        feelsLike: current.FeelsLikeC,
        description: current.weatherDesc[0].value,
        humidity: current.humidity,
        windSpeed: current.windspeedKmph,
      };
    } catch (error) {
      if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
        logger.error(`Network error fetching weather for ${city}`);
        throw new Error('Network error: Unable to connect to weather service');
      }
      logger.error(`Failed to fetch weather for ${city}:`, error.message);
      throw new Error(`Unable to fetch weather data for ${city}. Please check the city name and try again.`);
    }
  }

  /**
   * Fetch random quote using quotable.io API
   */
  async getRandomQuote() {
    try {
      const response = await axios.get('https://api.quotable.io/random', {
        timeout: 8000,
      });
      
      if (!response.data || !response.data.content) {
        throw new Error('Invalid quote data received');
      }
      
      return response.data;
    } catch (error) {
      if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
        logger.error('Network error fetching quote');
        throw new Error('Network error: Unable to connect to quote service');
      }
      logger.error('Failed to fetch quote:', error.message);
      throw new Error('Unable to fetch quote. Please try again later.');
    }
  }

  /**
   * Fetch cryptocurrency price using CoinGecko API
   */
  async getCryptoPrice(symbol) {
    try {
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(symbol)}&vs_currencies=usd`,
        {
          timeout: 8000,
        }
      );
      
      if (!response.data || Object.keys(response.data).length === 0) {
        throw new Error('Cryptocurrency not found');
      }
      
      return response.data;
    } catch (error) {
      if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
        logger.error(`Network error fetching crypto price for ${symbol}`);
        throw new Error('Network error: Unable to connect to cryptocurrency service');
      }
      logger.error(`Failed to fetch crypto price for ${symbol}:`, error.message);
      throw new Error(`Unable to fetch price for ${symbol}. Please check the symbol and try again.`);
    }
  }

  /**
   * Generic GET request method
   */
  async get(endpoint, params = {}) {
    try {
      const response = await this.client.get(endpoint, { params });
      return ErrorHandler.validateApiResponse(response);
    } catch (error) {
      logger.error(`GET request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Generic POST request method
   */
  async post(endpoint, data = {}) {
    try {
      const response = await this.client.post(endpoint, data);
      return ErrorHandler.validateApiResponse(response);
    } catch (error) {
      logger.error(`POST request failed for ${endpoint}:`, error);
      throw error;
    }
  }
}

export default new ApiService();
