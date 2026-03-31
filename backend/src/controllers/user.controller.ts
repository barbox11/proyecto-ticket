import { Request, Response } from "express";
import { createUser } from "../services/user.service";

export const register = async (req: Request, res: Response) => {
    try {
    const { email, password, name } = req.body;

    const user = await createUser(email, password, name);

    res.json(user);
    } catch (error) {
    res.status(500).json({ error: "Error al crear usuario" });
    }
};