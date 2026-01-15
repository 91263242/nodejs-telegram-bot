import { ErrorHandler } from '../utils/errorHandler.js';
import logger from '../utils/logger.js';

/**
 * Automated response handler for common interactions
 */
export class ResponseHandler {
  /**
   * Handle text messages with automated responses
   */
  static async handleTextMessage(ctx) {
    try {
      const text = ctx.message.text.toLowerCase();
      const userId = ctx.from.id;
      const username = ctx.from.username || ctx.from.first_name;

      logger.info(`Message from ${username} (${userId}): ${text}`);

      // Greeting responses
      if (this.isGreeting(text)) {
        await ctx.reply(`Hello ${ctx.from.first_name}! 👋\n\nHow can I help you today? Use /help to see available commands.`);
        return;
      }

      // Thank you responses
      if (this.isThankYou(text)) {
        await ctx.reply('You\'re welcome! 😊\n\nIs there anything else I can help you with?');
        return;
      }

      // Question responses
      if (this.isQuestion(text)) {
        await ctx.reply(
          'I\'m here to help! 🤔\n\n' +
          'You can use commands like:\n' +
          '• /quote - Get a random quote\n' +
          '• /crypto bitcoin - Get crypto prices\n' +
          '• /weather London - Get weather info\n\n' +
          'Or use /help for more options!'
        );
        return;
      }

      // Default response
      await ctx.reply(
        `I received your message: "${ctx.message.text}"\n\n` +
        'I can help you with various tasks. Use /help to see all available commands!'
      );

    } catch (error) {
      await ErrorHandler.handleError(ctx, error);
    }
  }

  /**
   * Check if message is a greeting
   */
  static isGreeting(text) {
    const greetings = ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening', 'greetings'];
    return greetings.some(greeting => text.includes(greeting));
  }

  /**
   * Check if message is a thank you
   */
  static isThankYou(text) {
    const thanks = ['thank', 'thanks', 'thx', 'appreciate'];
    return thanks.some(thank => text.includes(thank));
  }

  /**
   * Check if message is a question
   */
  static isQuestion(text) {
    const questionWords = ['what', 'how', 'when', 'where', 'why', 'who', 'which', '?'];
    return questionWords.some(word => text.includes(word)) || text.endsWith('?');
  }

  /**
   * Handle callback queries (button clicks)
   */
  static async handleCallbackQuery(ctx) {
    try {
      const data = ctx.callbackQuery.data;
      
      await ctx.answerCbQuery();
      
      switch (data) {
        case 'help':
          await ctx.reply('Use /help to see all available commands!');
          break;
        default:
          await ctx.reply('Unknown action. Please try again.');
      }
    } catch (error) {
      await ErrorHandler.handleError(ctx, error);
    }
  }
}

export default ResponseHandler;
