import winston from "winston";
import path from "path";
import fs from "fs";

// Crear directorio de logs si no existe
const logsDir = path.join(process.cwd(), "logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Formato personalizado
const customFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    return JSON.stringify({
      timestamp,
      level: level.toUpperCase(),
      message,
      ...meta,
    });
  })
);

// Logger principal
export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: customFormat,
  defaultMeta: { service: "ticket-system" },
  transports: [
    // Error log: solo errores
    new winston.transports.File({
      filename: path.join(logsDir, "error.log"),
      level: "error",
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // Combined log: todos los niveles
    new winston.transports.File({
      filename: path.join(logsDir, "combined.log"),
      maxsize: 5242880, // 5MB
      maxFiles: 7,
    }),
  ],
});

// Agregar console en desarrollo
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
          let logString = `[${timestamp}] ${level}: ${message}`;
          if (Object.keys(meta).length > 0) {
            logString += ` ${JSON.stringify(meta)}`;
          }
          return logString;
        })
      ),
    })
  );
}

export default logger;
