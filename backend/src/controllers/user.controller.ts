// Importar tipos de Express para Request y Response
import { Request, Response } from "express";
// Importar funciones del servicio que manejan la lógica de usuarios
import { createUser, loginUser, refreshTokens, getUserIdByEmail } from "../services/user.service";
// Importar servicios de tokens y email
import {
  createPasswordResetToken,
  validatePasswordResetToken,
  resetPassword,
} from "../services/auth.token.service";
import { sendPasswordResetEmail } from "../services/email.service";
import logger from "../config/logger";

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

// ── PASSWORD RESET ──────────────────────────────────

/**
 * POST /api/users/forgot-password
 * Solicitar reset de contraseña
 */
export const forgotPasswordController = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: "Email es requerido" });
        }

        // Crear token de reset
        const userId = await getUserIdByEmail(email);
        if (!userId) {
            // Por seguridad, no revelamos si existe o no el usuario
            return res.json({
                message: "Si el email existe, recibirás un enlace de reset",
            });
        }

        const token = await createPasswordResetToken(userId, email);
        
        // Enviar email
        await sendPasswordResetEmail(email, email.split("@")[0], token);

        logger.info("Password reset email sent", { email });
        res.json({
            message: "Si el email existe, recibirás un enlace de reset ✅",
        });
    } catch (error: any) {
        logger.error("Forgot password failed", { error: error.message });
        res.status(500).json({ error: "Error procesando solicitud" });
    }
};

/**
 * POST /api/users/reset-password
 * Resetear contraseña con token
 */
export const resetPasswordController = async (req: Request, res: Response) => {
    try {
        const { token, newPassword, confirmPassword } = req.body;

        if (!token || !newPassword || !confirmPassword) {
            return res.status(400).json({
                error: "Token, contraseña y confirmación son requeridos",
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                error: "Las contraseñas no coinciden",
            });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({
                error: "La contraseña debe tener al menos 8 caracteres",
            });
        }

        const result = await resetPassword(token, newPassword);

        logger.info("Password reset successful", { token });
        res.json({
            message: "Contraseña actualizada exitosamente ✅",
        });
    } catch (error: any) {
        logger.warn("Password reset failed", { error: error.message });
        res.status(400).json({ error: error.message });
    }
};

/**
 * GET /api/users/validate-reset-token/:token
 * Validar si el token de reset es válido
 */
export const validateResetTokenController = async (req: Request, res: Response) => {
    try {
        const { token } = req.params;

        if (!token) {
            return res.status(400).json({ error: "Token es requerido" });
        }

        const result = await validatePasswordResetToken(token);

        res.json({
            valid: true,
            email: result.user.email,
        });
    } catch (error: any) {
        logger.warn("Token validation failed", { error: error.message });
        res.status(400).json({
            valid: false,
            error: error.message,
        });
    }
};

// ── HELPER ──────────────────────────────────────────

/**
 * Helper para obtener userId por email
 */
async function getUserIdByEmail(email: string): Promise<number | null> {
    try {
        const { prisma } = await import("../config/prisma");
        const user = await prisma.user.findUnique({
            where: { email },
            select: { id: true },
        });
        return user?.id || null;
    } catch {
        return null;
    }
}