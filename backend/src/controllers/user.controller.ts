// Importar tipos de Express para Request y Response
import { Request, Response } from "express";
// Importar funciones del servicio que manejan la lógica de usuarios
import { createUser, loginUser, refreshTokens } from "../services/user.service";

// Controlador para registrar nuevo usuario
export const register = async (req: Request, res: Response) => {
    try {
    // Extraer email, password y name del body de la solicitud
    const { email, password, name } = req.body;

    // Validar que todos los campos requeridos estén presentes
    if (!email || !password || !name) {
        return res.status(400).json({ error: "Email, password y name son requeridos" });
    }

    // Llamar al servicio para crear el usuario
    const user = await createUser(email, password, name);

    // Devolver status 201 (Created) con los datos del nuevo usuario
    res.status(201).json({ message: "Usuario creado ✅", user });
    } catch (error: any) {
    // Loguear el error en la consola para debugging
    console.error("Error en registro:", error);
    // Devolver status 500 (error del servidor) con el mensaje de error
    res.status(500).json({ error: error.message || "Error al crear usuario" });
    }
};


// Controlador para autenticar usuario y generar tokens (access + refresh)
export const login = async (req: Request, res: Response) => {
    try {
    // Extraer email y password del body de la solicitud
    const { email, password } = req.body;

    // Llamar al servicio para autenticar y generar tokens
    const data = await loginUser(email, password);

    // Devolver el usuario y ambos tokens
    res.json(data);
    } catch (error: any) {
    // Devolver status 400 (bad request) con el mensaje de error
    res.status(400).json({ error: error.message });
    }
};

/**
 * Controlador para renovar tokens
 * Recibe un refresh token válido y devuelve nuevos tokens (access + refresh)
 * Implementa rotación: el refresh token anterior se revoca
 */
export const refresh = async (req: Request, res: Response) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({ error: "Refresh token es requerido" });
        }

        const data = await refreshTokens(refreshToken);

        res.json(data);
    } catch (error: any) {
        res.status(401).json({ error: error.message });
    }
};