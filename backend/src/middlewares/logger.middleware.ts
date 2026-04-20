import { Request, Response, NextFunction } from "express";
import logger from "../config/logger";

// Middleware para loguear todas las requests
export const requestLoggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const startTime = Date.now();
  
  // Capturar datos de la request
  const { method, originalUrl, ip, body } = req;
  const userId = (req as any).user?.id || "anonymous";

  // Respuesta original
  const originalSend = res.send;

  res.send = function (data) {
    const duration = Date.now() - startTime;
    const statusCode = res.statusCode;
    
    // Loguear según el nivel
    const logLevel = statusCode >= 500 ? "error" : statusCode >= 400 ? "warn" : "info";
    
    logger.log(logLevel, `${method} ${originalUrl}`, {
      method,
      url: originalUrl,
      statusCode,
      duration: `${duration}ms`,
      ip,
      userId,
      userAgent: req.get("user-agent"),
      ...(statusCode >= 400 && { body, response: data }),
    });

    return originalSend.call(this, data);
  };

  next();
};

// Loguear errores de forma centralizada
export const errorLoggerMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = (req as any).user?.id || "anonymous";
  
  logger.error("Unhandled Error", {
    message: err.message || "Unknown error",
    stack: err.stack,
    method: req.method,
    url: req.originalUrl,
    userId,
    ip: req.ip,
    body: req.body,
    statusCode: err.statusCode || 500,
  });

  next(err);
};
