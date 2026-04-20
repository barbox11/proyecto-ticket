// Importar Router de Express para crear rutas
import { Router } from "express";
// Importar controladores de usuario
import {
  register,
  login,
  refresh,
  forgotPasswordController,
  resetPasswordController,
  validateResetTokenController,
} from "../controllers/user.controller";
// Importar middlewares
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  authLimiter,
  refreshLimiter,
  emailLimiter,
} from "../middlewares/rateLimiter.middleware";

// Crear instancia de Router
const router = Router();

// Ruta POST para registrar nuevo usuario
router.post("/register", authLimiter, register);
// Ruta POST para autenticar usuario y obtener tokens (access + refresh)
router.post("/login", authLimiter, login);
// Ruta POST para renovar tokens (refresh token → nuevos access + refresh)
router.post("/refresh", refreshLimiter, refresh);

// Password reset
router.post("/forgot-password", emailLimiter, forgotPasswordController);
router.post("/reset-password", resetPasswordController);
router.get("/validate-reset-token/:token", validateResetTokenController);

// Exportar el router para usarlo en la app
export default router;