import { Telegraf } from 'telegraf';
import { config } from './config/config.js';
import logger from './utils/logger.js';
import { CommandsHandler } from './handlers/commands.js';
import { ResponseHandler } from './handlers/responses.js';
import { ErrorHandler } from './utils/errorHandler.js';

/**
 * Main bot initialization and setup
 */
class TelegramBot {
  constructor() {
    this.bot = new Telegraf(config.botToken);
    this.setupMiddleware();
    this.setupCommands();
    this.setupHandlers();
    this.setupErrorHandling();
  }

  /**
   * Setup middleware for logging and error handling
   */
  setupMiddleware() {
    // Log all updates
    this.bot.use(async (ctx, next) => {
      logger.debug(`Update received: ${ctx.updateType}`);
      await next();
    });
  }

  /**
   * Register all custom commands
   */
  setupCommands() {
    // Start command
    this.bot.command('start', ErrorHandler.wrapAsync(CommandsHandler.start));

    // Help command
    this.bot.command('help', ErrorHandler.wrapAsync(CommandsHandler.help));

    // Quote command
    this.bot.command('quote', ErrorHandler.wrapAsync(CommandsHandler.quote));

    // Crypto command
    this.bot.command('crypto', ErrorHandler.wrapAsync(CommandsHandler.crypto));

    // Weather command
    this.bot.command('weather', ErrorHandler.wrapAsync(CommandsHandler.weather));

    // Info command
    this.bot.command('info', ErrorHandler.wrapAsync(CommandsHandler.info));

    logger.info('Commands registered successfully');
  }

  /**
   * Setup message and callback handlers
   */
  setupHandlers() {
    // Handle text messages
    this.bot.on('text', ErrorHandler.wrapAsync(ResponseHandler.handleTextMessage));

    // Handle callback queries (button clicks)
    this.bot.on('callback_query', ErrorHandler.wrapAsync(ResponseHandler.handleCallbackQuery));

    logger.info('Handlers registered successfully');
  }

  /**
   * Setup global error handling
   */
  setupErrorHandling() {
    this.bot.catch((err, ctx) => {
      logger.error('Bot error occurred:', err);
      ErrorHandler.handleError(ctx, err);
    });

    // Handle process errors
    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    });

    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception:', error);
      process.exit(1);
    });
  }

  /**
   * Start the bot
   */
  async start() {
    try {
      logger.info('Starting Telegram bot...');
      
      // Launch bot
      await this.bot.launch();
      
      logger.info('Bot is running successfully!');
      logger.info(`Bot username: @${(await this.bot.telegram.getMe()).username}`);

      // Graceful shutdown
      process.once('SIGINT', () => this.stop('SIGINT'));
      process.once('SIGTERM', () => this.stop('SIGTERM'));
    } catch (error) {
      logger.error('Failed to start bot:', error);
      process.exit(1);
    }
  }

  /**
   * Stop the bot gracefully
   */
  async stop(signal) {
    logger.info(`Received ${signal}, stopping bot...`);
    this.bot.stop(signal);
    process.exit(0);
  }
}

// Initialize and start the bot
const bot = new TelegramBot();
bot.start();

export default bot;
