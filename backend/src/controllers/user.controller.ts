// Importar tipos de Express para Request y Response
import { Request, Response } from "express";
// Importar funciones del servicio que manejan la lógica de usuarios
import { createUser, loginUser } from "../services/user.service";

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


// Controlador para autenticar usuario y generar token
export const login = async (req: Request, res: Response) => {
    try {
    // Extraer email y password del body de la solicitud
    const { email, password } = req.body;

    // Llamar al servicio para autenticar y generar token
    const data = await loginUser(email, password);

    // Devolver el usuario y token si la autenticación es exitosa
    res.json(data);
    } catch (error: any) {
    // Devolver status 400 (bad request) con el mensaje de error
    res.status(400).json({ error: error.message });
    }
};