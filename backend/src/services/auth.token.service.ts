import crypto from "crypto";
import bcrypt from "bcrypt";
import { prisma } from "../config/prisma";
import logger from "../config/logger";

// ── PASSWORD RESET TOKEN ────────────────────────────

export const createPasswordResetToken = async (userId: number, email: string) => {
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hora

    try {
        const resetToken = await prisma.passwordResetToken.create({
        data: {
            token,
            email,
            userId,
            expiresAt,
        },
        });

        logger.info("Password reset token created", { userId, email });
        return token;
    } catch (error: any) {
        logger.error("Failed to create password reset token", {
        userId,
        email,
        error: error.message,
        });
        throw error;
    }
    };

    export const validatePasswordResetToken = async (token: string) => {
    try {
        const resetToken = await prisma.passwordResetToken.findUnique({
        where: { token },
        include: { user: true },
        });

        if (!resetToken) {
        throw new Error("Token inválido");
        }

        if (new Date() > resetToken.expiresAt) {
        await prisma.passwordResetToken.delete({ where: { token } });
        throw new Error("Token expirado");
        }

        if (resetToken.used) {
        throw new Error("Token ya fue usado");
        }

        return { valid: true, user: resetToken.user };
    } catch (error: any) {
        logger.error("Password reset token validation failed", {
        token,
        error: error.message,
        });
        throw error;
    }
    };

    export const resetPassword = async (token: string, newPassword: string) => {
    try {
        // Validar token
        const resetToken = await prisma.passwordResetToken.findUnique({
        where: { token },
        });

        if (!resetToken) {
        throw new Error("Token inválido");
        }

        if (new Date() > resetToken.expiresAt) {
        await prisma.passwordResetToken.delete({ where: { token } });
        throw new Error("Token expirado");
        }

        if (resetToken.used) {
        throw new Error("Token ya fue usado");
        }

        // Encriptar la contraseña con bcrypt (10 rounds)
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Actualizar contraseña y marcar token como usado
        await Promise.all([
        prisma.user.update({
            where: { id: resetToken.userId },
            data: { password: hashedPassword },
        }),
        prisma.passwordResetToken.update({
            where: { token },
            data: { used: true },
        }),
        ]);

        logger.info("Password reset successfully", { userId: resetToken.userId });
        return { success: true };
    } catch (error: any) {
        logger.error("Password reset failed", {
        token,
        error: error.message,
        });
        throw error;
    }
    };

