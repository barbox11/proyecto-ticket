// Importar Router de Express para crear rutas
import { Router } from "express";
// Importar controladores de usuario
import { register, login } from "../controllers/user.controller";

// Crear instancia de Router
const router = Router();

// Ruta POST para registrar nuevo usuario
router.post("/register", register);
// Ruta POST para autenticar usuario y obtener token
router.post("/login", login);

// Exportar el router para usarlo en la app
export default router;