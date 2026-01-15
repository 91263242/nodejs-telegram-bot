import { ErrorHandler } from '../utils/errorHandler.js';
import logger from '../utils/logger.js';
import apiService from '../services/apiService.js';

/**
 * Custom commands handler for the bot
 */
export class CommandsHandler {
  /**
   * Start command - Welcome message
   */
  static async start(ctx) {
    try {
      const welcomeMessage = `
🤖 *Welcome to the Telegram Bot!*

I can help you with various tasks:
• Get real-time data from APIs
• Answer common questions
• Provide automated responses

Use /help to see all available commands.
      `;

      await ctx.replyWithMarkdown(welcomeMessage);
      logger.info(`User ${ctx.from.id} started the bot`);
    } catch (error) {
      await ErrorHandler.handleError(ctx, error);
    }
  }

  /**
   * Help command - List all available commands
   */
  static async help(ctx) {
    try {
      const helpMessage = `
📚 *Available Commands:*

/start - Start the bot
/help - Show this help message
/quote - Get a random inspirational quote
/crypto <symbol> - Get cryptocurrency price (e.g., /crypto bitcoin)
/weather <city> - Get weather information (e.g., /weather London)
/info - Get bot information

You can also send me a message and I'll respond automatically!
      `;

      await ctx.replyWithMarkdown(helpMessage);
    } catch (error) {
      await ErrorHandler.handleError(ctx, error);
    }
  }

  /**
   * Get random quote from API
   */
  static async quote(ctx) {
    try {
      await ctx.reply('📖 Fetching a quote for you...');
      
      const quoteData = await apiService.getRandomQuote();
      const message = `💬 *${quoteData.author}*\n\n"${quoteData.content}"`;

      await ctx.replyWithMarkdown(message);
      logger.info(`Quote sent to user ${ctx.from.id}`);
    } catch (error) {
      await ErrorHandler.handleError(
        ctx,
        error,
        'Sorry, I couldn\'t fetch a quote right now. Please try again later.'
      );
    }
  }

  /**
   * Get cryptocurrency price
   */
  static async crypto(ctx) {
    try {
      const symbol = ctx.message.text.split(' ')[1]?.toLowerCase() || 'bitcoin';

      await ctx.reply(`💰 Fetching ${symbol} price...`);

      const priceData = await apiService.getCryptoPrice(symbol);
      
      if (priceData[symbol] && priceData[symbol].usd) {
        const message = `💵 *${symbol.toUpperCase()}*\n\nPrice: $${priceData[symbol].usd.toLocaleString()}`;
        await ctx.replyWithMarkdown(message);
      } else {
        await ctx.reply(`Sorry, I couldn't find price data for ${symbol}.`);
      }

      logger.info(`Crypto price sent to user ${ctx.from.id} for ${symbol}`);
    } catch (error) {
      await ErrorHandler.handleError(
        ctx,
        error,
        'Sorry, I couldn\'t fetch the cryptocurrency price. Please check the symbol and try again.'
      );
    }
  }

  /**
   * Get weather information
   */
  static async weather(ctx) {
    try {
      const city = ctx.message.text.split(' ').slice(1).join(' ') || 'London';

      await ctx.reply(`🌤️ Fetching weather for ${city}...`);

      const weatherData = await apiService.getWeatherData(city);
      
      const message = `🌡️ *Weather in ${weatherData.location}, ${weatherData.country}*

🌡️ Temperature: ${weatherData.temp}°C
🤔 Feels like: ${weatherData.feelsLike}°C
☁️ Condition: ${weatherData.description}
💧 Humidity: ${weatherData.humidity}%
💨 Wind: ${weatherData.windSpeed} km/h`;
      
      await ctx.replyWithMarkdown(message);
      logger.info(`Weather sent to user ${ctx.from.id} for ${city}`);
    } catch (error) {
      await ErrorHandler.handleError(
        ctx,
        error,
        error.message || `Sorry, I couldn't fetch weather data for that location. Please try again with a valid city name.`
      );
    }
  }

  /**
   * Get bot information
   */
  static async info(ctx) {
    try {
      const infoMessage = `
ℹ️ *Bot Information*

🤖 *Version:* 1.0.0
📅 *Status:* Online
🔧 *Features:*
• Custom commands
• Automated responses
• External API integration
• Real-time data fetching

Built with Node.js and Telegraf.js
      `;

      await ctx.replyWithMarkdown(infoMessage);
    } catch (error) {
      await ErrorHandler.handleError(ctx, error);
    }
  }
}

export default CommandsHandler;
