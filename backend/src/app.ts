// Cargar variables de ambiente (.env)
import "dotenv/config";
// Importar Express y tipos para Request/Response
import express, { Request, Response, NextFunction } from "express";
// CORS para permitir solicitudes desde frontend
import cors from "cors";
// Instancia de Prisma para acceder a la BD
import { prisma } from "./config/prisma";
// Logger
import logger from "./config/logger";
// Rutas de usuarios
import userRoutes from "./routes/user.routes";
// Rutas de tickets
import ticketRoutes from "./routes/ticket.routes";
// Middleware de autenticación
import { authMiddleware } from "./middlewares/auth.middleware";
// Middlewares de rate limiting y logging
import { generalLimiter, createTicketLimiter, listTicketLimiter } from "./middlewares/rateLimiter.middleware";
import { requestLoggerMiddleware, errorLoggerMiddleware } from "./middlewares/logger.middleware";
// Email service
import { testEmailConnection } from "./services/email.service";
// Socket.io
import { Server as SocketIOServer } from "socket.io";
import http from "http";

// Crear instancia de la aplicación Express
const app = express();

// Crear servidor HTTP con Socket.io
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Middleware de logging
app.use(requestLoggerMiddleware);

// Configurar CORS para permitir solicitudes desde el frontend
app.use(cors({
    // Permitir solo solicitudes desde el frontend en localhost:5173
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    // Permitir envío de credenciales (cookies, headers)
    credentials: true,
    // Métodos HTTP permitidos
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    // Headers permitidos en las solicitudes
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// Middleware para parsear JSON en el body de las solicitudes
app.use(express.json());

// Aplicar rate limiter general
app.use(generalLimiter);

// Registrar rutas de usuarios bajo /api/users
app.use("/api/users", userRoutes);

// Registrar rutas de tickets bajo /api/tickets con rate limiting
app.use("/api/tickets", (req, res, next) => {
  if (req.method === "POST") {
    return createTicketLimiter(req, res, next);
  } else if (req.method === "GET") {
    return listTicketLimiter(req, res, next);
  }
  next();
});
app.use("/api/tickets", ticketRoutes);

// ── RUTAS DE SALUD ──────────────────────────────────

// Ruta de prueba para verificar que el servidor está activo
app.get("/", (req: Request, res: Response) => {
    res.json({
      message: "API funcionando 🚀",
      timestamp: new Date().toISOString(),
    });
});

// Ruta health check
app.get("/health", (req: Request, res: Response) => {
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
});

// Ruta para probar conexión con la base de datos
app.get("/test-db", async (req: Request, res: Response) => {
    try {
    // Consultar todos los usuarios para verificar conexión a BD
    const users = await prisma.user.findMany();
    res.json({ message: "Conexión a BD OK ✅", userCount: users.length });
    } catch (error: any) {
    // Si hay error, devolver status 500 (error del servidor)
    logger.error("Database connection test failed", { error: error.message });
    res.status(500).json({ error: "Error de conexión a BD ❌" });
    }
});

// Ruta para probar email
app.get("/test-email", async (req: Request, res: Response) => {
    try {
      const connected = await testEmailConnection();
      if (connected) {
        res.json({ message: "Email service OK ✅" });
      } else {
        res.status(500).json({ error: "Email service failed ❌" });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
});

// Ruta protegida
app.get("/profile", authMiddleware, (req, res) => {
    res.json({
    message: "Ruta protegida 🔒",
    user: (req as any).user,
    });
});

// ── WEBSOCKET ───────────────────────────────────────

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error("Authentication error"));
  }
  // En producción, validarías el JWT aquí
  socket.data.token = token;
  next();
});

io.on("connection", (socket) => {
  logger.info("User connected via WebSocket", { socketId: socket.id });

  // Evento: usuario se suscribe a notificaciones
  socket.on("subscribe", (userId: number) => {
    socket.join(`user:${userId}`);
    logger.info("User subscribed", { userId, socketId: socket.id });
  });

  // Evento: usuario se desuscribe
  socket.on("unsubscribe", (userId: number) => {
    socket.leave(`user:${userId}`);
    logger.info("User unsubscribed", { userId, socketId: socket.id });
  });

  // Evento: desconexión
  socket.on("disconnect", () => {
    logger.info("User disconnected", { socketId: socket.id });
  });
});

// Hacer disponible io globalmente
(global as any).io = io;

// ── ERROR HANDLING ──────────────────────────────────

// Middleware para loguear errores
app.use(errorLoggerMiddleware);

// Middleware de error 404
app.use((req: Request, res: Response) => {
    logger.warn("Route not found", {
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
    });
    res.status(404).json({ error: "Ruta no encontrada" });
});

// ── INICIAR SERVIDOR ────────────────────────────────

const PORT = process.env.PORT || 3000;

server.listen(PORT, async () => {
    logger.info(`Servidor iniciado en puerto ${PORT}`);
    console.log(`🚀 API en http://localhost:${PORT}`);
    console.log(`📊 WebSocket activo`);
    
    // Probar conexiones
    try {
      await prisma.$queryRaw`SELECT 1`;
      logger.info("Database connection OK");
    } catch (error) {
      logger.error("Database connection failed", { error });
    }
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  logger.info("SIGTERM received, shutting down...");
  server.close(() => {
    logger.info("Server closed");
    process.exit(0);
  });
});

export default app;