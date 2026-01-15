import logger from './logger.js';

/**
 * Error handling utility for the bot
 */
export class ErrorHandler {
  /**
   * Handle errors gracefully and send user-friendly messages
   */
  static async handleError(ctx, error, customMessage = null) {
    // Log error message only, not full stack trace
    const errorMessage = error?.message || error?.toString() || 'Unknown error';
    logger.error(`Error occurred: ${errorMessage}`);

    const userMessage = customMessage || 
      'Sorry, something went wrong. Please try again later.';

    try {
      await ctx.reply(userMessage);
    } catch (replyError) {
      logger.error(`Failed to send error message: ${replyError.message || replyError}`);
    }
  }

  /**
   * Wrap async functions with error handling
   */
  static wrapAsync(fn) {
    return async (ctx, next) => {
      try {
        await fn(ctx, next);
      } catch (error) {
        await ErrorHandler.handleError(ctx, error);
      }
    };
  }

  /**
   * Validate API response
   */
  static validateApiResponse(response) {
    if (!response || !response.data) {
      throw new Error('Invalid API response');
    }
    return response.data;
  }
}

export default ErrorHandler;
