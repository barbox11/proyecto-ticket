import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import { prisma } from "./config/prisma";
import userRoutes from "./routes/user.routes";

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

app.use("/api/users", userRoutes);

app.get("/", (req: Request, res: Response) => {
res.send("API funcionando 🚀");
});

app.get("/test-db", async (req: Request, res: Response) => {
    try {
    const users = await prisma.user.findMany();
    res.json({ message: "Conexión a BD OK ✅", users });
    } catch (error) {
    res.status(500).json({ error: "Error de conexión a BD ❌" });
    }
});

app.listen(3000, () => {
console.log("Servidor en http://localhost:3000");
});