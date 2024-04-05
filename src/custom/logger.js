const { createLogger, transports, format } = require("winston");

const logger = createLogger({
  level: "debug",
  format: format.combine(
    format.colorize(),
    format.timestamp({ format: "DD/MM/YYY HH:mm:ss.SSS" }),
    format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: "app.log" }),
  ],
});

// Adicionando funções para logging mais específico
logger.info = (message) => logger.log("info", message);
logger.error = (message, error) => logger.log("error", message, error);
logger.debug = (message) => logger.log("debug", message);

module.exports = logger;
