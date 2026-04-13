// Importar Prisma para acceder a la BD
import { prisma } from "../config/prisma";
// Importar bcrypt para encriptar contraseñas
import bcrypt from "bcrypt";
// Importar JWT para generar tokens de autenticación
import jwt from "jsonwebtoken";

// Validar que JWT_SECRET exista
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET debe estar configurado en el archivo .env");
}

// Función para crear nuevo usuario
export const createUser = async (email: string, password: string, name: string) => {
  // Encriptar la contraseña con bcrypt (10 rounds)
  const hashedPassword = await bcrypt.hash(password, 10);

  // Guardar el nuevo usuario en la base de datos con datos encriptados
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
  });

  // Retornar el usuario creado
  return user;
};

// Función para autenticar usuario y generar tokens (access + refresh)
export const loginUser = async (email: string, password: string) => {
  // Buscar usuario en la BD por email
  const user = await prisma.user.findUnique({
    where: { email },
  });

  // Validar que el usuario exista en la BD
  if (!user) {
    throw new Error("Usuario no encontrado");
  }

  // Comparar la contraseña proporcionada con el hash guardado en la BD
  const isValid = await bcrypt.compare(password, user.password);

  // Validar que la contraseña sea correcta
  if (!isValid) {
    throw new Error("Contraseña incorrecta");
  }

  // Generar access token (15 minutos)
  const accessToken = jwt.sign(
    { id: user.id },
    JWT_SECRET,
    { expiresIn: "15m" }
  );

  // Generar refresh token (7 días)
  const refreshTokenValue = jwt.sign(
    { id: user.id, type: "refresh" },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  // Calcular fecha de expiración (7 días desde ahora)
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  // Guardar refresh token en la BD
  await prisma.refreshToken.create({
    data: {
      token: refreshTokenValue,
      userId: user.id,
      expiresAt,
    },
  });

  // Retornar usuario SIN contraseña + ambos tokens
  return {
    user: {
      id: user.id,
      email: user.email,
    },
    accessToken,
    refreshToken: refreshTokenValue,
  };
};

/**
 * Genera nuevos tokens usando un refresh token válido
 * Implementa rotación: invalida el refresh token anterior y crea uno nuevo
 */
export const refreshTokens = async (refreshToken: string) => {
  // Verificar que el refresh token sea válido y no haya expirado
  const decoded = jwt.verify(refreshToken, JWT_SECRET) as { id: number; type: string };

  if (decoded.type !== "refresh") {
    throw new Error("Token inválido");
  }

  // Buscar el refresh token en la BD
  const storedToken = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
  });

  // Verificar que exista y no haya sido revocado
  if (!storedToken || storedToken.revoked || storedToken.expiresAt < new Date()) {
    throw new Error("Refresh token inválido o expirado");
  }

  // Revocar el refresh token anterior (rotación)
  await prisma.refreshToken.update({
    where: { token: refreshToken },
    data: { revoked: true },
  });

  // Generar nuevo access token
  const accessToken = jwt.sign(
    { id: storedToken.userId },
    JWT_SECRET,
    { expiresIn: "15m" }
  );

  // Generar nuevo refresh token
  const newRefreshTokenValue = jwt.sign(
    { id: storedToken.userId, type: "refresh" },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  const newExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  // Guardar nuevo refresh token en la BD
  await prisma.refreshToken.create({
    data: {
      token: newRefreshTokenValue,
      userId: storedToken.userId,
      expiresAt: newExpiresAt,
    },
  });

  return { accessToken, refreshToken: newRefreshTokenValue };
};