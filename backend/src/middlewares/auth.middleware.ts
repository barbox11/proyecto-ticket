import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Validar que JWT_SECRET exista al iniciar
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET debe estar configurado en el archivo .env");
}

export const authMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
    ) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
        return res.status(401).json({ error: "No autorizado" });
        }

        const decoded = jwt.verify(
        token,
        JWT_SECRET
        );

        (req as any).user = decoded;

        next();
    } catch (error) {
        return res.status(401).json({ error: "Token inválido" });
    }
    };