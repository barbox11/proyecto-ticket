import { Request, Response } from "express";
import { createUser, loginUser } from "../services/user.service";


export const register = async (req: Request, res: Response) => {
    try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
        return res.status(400).json({ error: "Email, password y name son requeridos" });
    }

    const user = await createUser(email, password, name);

    res.status(201).json({ message: "Usuario creado ✅", user });
    } catch (error: any) {
    console.error("Error en registro:", error);
    res.status(500).json({ error: error.message || "Error al crear usuario" });
    }
};


export const login = async (req: Request, res: Response) => {
    try {
    const { email, password } = req.body;

    const data = await loginUser(email, password);

    res.json(data);
    } catch (error: any) {
    res.status(400).json({ error: error.message });
    }
};