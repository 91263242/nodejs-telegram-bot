# Telegram Bot with Node.js

A feature-rich Telegram bot built with Node.js that supports custom commands, automated responses, and external API integration for real-time data.

## Features

- ✅ **Custom Commands** - Handle various user tasks and queries
- ✅ **Automated Responses** - Smart responses for common interactions
- ✅ **API Integration** - Fetch real-time data from external APIs
- ✅ **Error Handling** - Comprehensive error management and logging
- ✅ **Modular Structure** - Clean, maintainable, and scalable codebase
- ✅ **Async Operations** - Proper handling of asynchronous operations

## Tech Stack

- **Node.js** - Runtime environment
- **Telegraf.js** - Telegram Bot framework
- **Axios** - HTTP client for API requests
- **dotenv** - Environment variable management

## Project Structure

```
telegram_bot_nodejs/
├── src/
│   ├── config/
│   │   └── config.js          # Configuration management
│   ├── handlers/
│   │   ├── commands.js        # Custom commands handler
│   │   └── responses.js       # Automated response handler
│   ├── services/
│   │   └── apiService.js      # External API integration
│   ├── utils/
│   │   ├── logger.js          # Logging utility
│   │   └── errorHandler.js    # Error handling utility
│   └── index.js               # Main bot file
├── .env.example               # Environment variables template
├── .gitignore                 # Git ignore rules
├── package.json               # Dependencies and scripts
└── README.md                  # Project documentation
```

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd telegram_bot_nodejs
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your bot token:
   ```
   BOT_TOKEN=your_telegram_bot_token_here
   ```

4. **Get a Telegram Bot Token**
   - Open Telegram and search for [@BotFather](https://t.me/BotFather)
   - Send `/newbot` command
   - Follow the instructions to create your bot
   - Copy the bot token and add it to your `.env` file

## Usage

### Start the bot

```bash
npm start
```

### Development mode (with auto-reload)

```bash
npm run dev
```

## Available Commands

- `/start` - Start the bot and see welcome message
- `/help` - Show all available commands
- `/quote` - Get a random inspirational quote
- `/crypto <symbol>` - Get cryptocurrency price (e.g., `/crypto bitcoin`)
- `/weather <city>` - Get weather information (e.g., `/weather London`)
- `/info` - Get bot information

## API Integration Examples

The bot includes example integrations for:

1. **Random Quotes API** - Uses quotable.io API
2. **Cryptocurrency Prices** - Uses CoinGecko API
3. **Weather Data** - Configurable weather API endpoint

### Customizing API Integration

To integrate your own APIs, edit `src/services/apiService.js`:

```javascript
async getYourCustomData(params) {
  try {
    const response = await this.client.get('/your-endpoint', {
      params: params
    });
    return ErrorHandler.validateApiResponse(response);
  } catch (error) {
    logger.error('Failed to fetch data:', error);
    throw new Error('Unable to fetch data');
  }
}
```

Then add a command handler in `src/handlers/commands.js`:

```javascript
static async yourCommand(ctx) {
  try {
    const data = await apiService.getYourCustomData();
    await ctx.reply(`Your data: ${JSON.stringify(data)}`);
  } catch (error) {
    await ErrorHandler.handleError(ctx, error);
  }
}
```

Finally, register the command in `src/index.js`:

```javascript
this.bot.command('yourcommand', ErrorHandler.wrapAsync(CommandsHandler.yourCommand));
```

## Automated Responses

The bot automatically responds to:
- Greetings (hi, hello, hey, etc.)
- Thank you messages
- Questions
- General text messages

Customize responses in `src/handlers/responses.js`.

## Error Handling

The bot includes comprehensive error handling:
- Graceful error messages to users
- Detailed logging for debugging
- Error wrapping for async operations
- Process-level error handling

## Logging

Logs are output to the console with timestamps and log levels:
- `ERROR` - Critical errors
- `WARN` - Warnings
- `INFO` - General information
- `DEBUG` - Debug messages

Set log level in `.env`:
```
LOG_LEVEL=info
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `BOT_TOKEN` | Telegram bot token from BotFather | Yes |
| `API_KEY` | API key for external services | No |
| `API_BASE_URL` | Base URL for API requests | No |
| `NODE_ENV` | Environment (development/production) | No |
| `LOG_LEVEL` | Logging level (error/warn/info/debug) | No |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - feel free to use this project for your own purposes.

## Support

For issues and questions, please open an issue on the repository.

---

Built with ❤️ using Node.js and Telegraf.js
