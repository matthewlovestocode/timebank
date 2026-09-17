import pino from 'pino';

const isProduction = process.env.NODE_ENV === 'production';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  
  // NATIVE SANITIZATION CONFIGURATION
  redact: {
    // Array of string paths to search for and sanitize
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      'password',
      'confirmPassword',
      'creditCard',
      'secret',
      'token'
    ],
    // The value that replaces the sensitive data
    censor: '[REDACTED]',
    // Set to true if you want to completely remove the key instead of replacing its value
    remove: false, 
  },

  transport: !isProduction
    ? {
        target: 'pino-pretty',
        options: { colorize: true },
      }
    : undefined,
});
