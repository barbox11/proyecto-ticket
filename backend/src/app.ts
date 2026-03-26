import express, { Request, Response } from "express";
import cors from "cors";

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
res.send("API funcionando 🚀");
});

app.listen(3000, () => {
console.log("Servidor en http://localhost:3000");
});