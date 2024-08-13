const { createLogger, transports, format } = require("winston");

// Função para obter a localização do arquivo e linha do stack trace
function getErrorLocation(error) {
  if (!error.stack) return "Unknown location";

  // Divida o stack trace em linhas
  const stackLines = error.stack.split("\n");

  // Pegue a segunda linha do stack trace, que deve conter a localização do erro
  if (stackLines.length > 1) {
    const callerLine = stackLines[1].trim();
    // Tenta capturar o caminho do arquivo e linha usando uma expressão regular
    const filePathMatch = callerLine.match(/at\s+(.*):(\d+):(\d+)/);
    if (filePathMatch) {
      // Retorna o caminho do arquivo e linha
      return `${filePathMatch[1]}:${filePathMatch[2]}`;
    }
  }

  return "Unknown location";
}

// Formatação personalizada para o log
const customFormat = format.printf(({ timestamp, level, message, error }) => {
  const location = level === "error" ? getErrorLocation(error) : "";

  // Cores ajustadas para cada nível de log
  const levelColor =
    level === "info"
      ? "\x1b[32m" // Verde
      : level === "error"
      ? "\x1b[31m" // Vermelho
      : "\x1b[35m"; // Roxo para debug

  const resetColor = "\x1b[0m";

  return `${timestamp} [${levelColor}${level.toUpperCase()}${resetColor}] ${
    location ? `(${location}) ` : ""
  }${message}${error ? `: ${error.message}` : ""}`;
});

const logger = createLogger({
  level: "debug",
  format: format.combine(
    format.timestamp({ format: "DD/MM/YYYY HH:mm:ss.SSS" }),
    format.errors({ stack: true }),
    customFormat
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: "app.log" }),
  ],
});

// Funções personalizadas de log
logger.info = (message) => logger.log("info", message);
logger.error = (message, error) => {
  logger.log("error", message, { error });
};
logger.debug = (message) => logger.log("debug", message);

module.exports = logger;
