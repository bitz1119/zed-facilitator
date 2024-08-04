// logger.js

const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, errors } = format;

// Custom log format
const myFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} ${level}: ${stack || message}`;
});

// Create a logger instance
const logger = createLogger({
  level: 'info', // Minimum log level
  format: combine(
    timestamp(),
    errors({ stack: true }), // Log error stack trace
    myFormat
  ),
  transports: [
    new transports.Console(), // Log to the console
    new transports.File({ filename: 'app.log' }) // Log to a file
  ]
});

module.exports = logger;

// const logger = require('./logger');

// // Example usage
// logger.info('This is an info message');
// logger.warn('This is a warning message');
// logger.error('This is an error message');

// // Logging an error with stack trace
// try {
//   throw new Error('Something went wrong!');
// } catch (error) {
//   logger.error('An error occurred', error);
// }