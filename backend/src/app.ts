// Cargar variables de ambiente (.env)
import "dotenv/config";
// Importar Express y tipos para Request/Response
import express, { Request, Response } from "express";
// CORS para permitir solicitudes desde frontend
import cors from "cors";
// Instancia de Prisma para acceder a la BD
import { prisma } from "./config/prisma";
// Rutas de usuarios
import userRoutes from "./routes/user.routes";

// Crear instancia de la aplicación Express
const app = express();

// Configurar CORS para permitir solicitudes desde el frontend
app.use(cors({
    // Permitir solo solicitudes desde el frontend en localhost:5173
    origin: "http://localhost:5173",
    // Permitir envío de credenciales (cookies, headers)
    credentials: true,
    // Métodos HTTP permitidos
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    // Headers permitidos en las solicitudes
    allowedHeaders: ["Content-Type", "Authorization"]
}));
// Middleware para parsear JSON en el body de las solicitudes
app.use(express.json());

// Registrar rutas de usuarios bajo /api/users
app.use("/api/users", userRoutes);

// Ruta de prueba para verificar que el servidor está activo
app.get("/", (req: Request, res: Response) => {
    res.send("API funcionando 🚀");
});

// Ruta para probar conexión con la base de datos
app.get("/test-db", async (req: Request, res: Response) => {
    try {
    // Consultar todos los usuarios para verificar conexión a BD
    const users = await prisma.user.findMany();
    res.json({ message: "Conexión a BD OK ✅", users });
    } catch (error) {
    // Si hay error, devolver status 500 (error del servidor)
    res.status(500).json({ error: "Error de conexión a BD ❌" });
    }
});

// Iniciar el servidor en puerto 3000
app.listen(3000, () => {
    console.log("Servidor en http://localhost:3000");
});