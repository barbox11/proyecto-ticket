import rateLimit from "express-rate-limit";

// ── RATE LIMITERS POR ENDPOINT ───────────────────────

// General: 100 requests por 15 minutos
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100,
  message: "Demasiadas solicitudes desde esta IP, intente más tarde.",
  statusCode: 429,
  skip: (req) => process.env.NODE_ENV === "development", // Desactivar en desarrollo
});

// Auth: 5 intentos de login/registro por 15 minutos
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5,
  message: "Demasiados intentos de autenticación, intente en 15 minutos.",
  statusCode: 429,
  keyGenerator: (req) => {
    // Usar email + IP como clave
    return `${req.body?.email || req.ip}`;
  },
  skip: (req) => process.env.NODE_ENV === "development",
});

// Refresh token: 10 intentos por minuto
export const refreshLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 10,
  message: "Demasiadas solicitudes de refresh, intente más tarde.",
  statusCode: 429,
  skip: (req) => process.env.NODE_ENV === "development",
});

// Crear tickets: 20 por minuto
export const createTicketLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 20,
  message: "Límite de creación de tickets alcanzado, intente más tarde.",
  statusCode: 429,
  skip: (req) => process.env.NODE_ENV === "development",
});

// Listar tickets: 30 por minuto
export const listTicketLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 30,
  message: "Demasiadas solicitudes, intente más tarde.",
  statusCode: 429,
  skip: (req) => process.env.NODE_ENV === "development",
});

// Email: 3 intentos por hora
export const emailLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 3,
  message: "Demasiados intentos de email, intente en 1 hora.",
  statusCode: 429,
  keyGenerator: (req) => `${req.body?.email || req.ip}`,
  skip: (req) => process.env.NODE_ENV === "development",
});
