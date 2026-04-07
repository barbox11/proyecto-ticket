// Importar Prisma para acceder a la BD
import { prisma } from "../config/prisma";
// Importar bcrypt para encriptar contraseñas
import bcrypt from "bcrypt";
// Importar JWT para generar tokens de autenticación
import jwt from "jsonwebtoken";

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

// Función para autenticar usuario y generar token JWT
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

  // Generar token JWT firmado con el ID del usuario y secreto
  // El token expira en 1 hora
  const token = jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET || "secreto",
    { expiresIn: "1h" }
  );

  // Retornar usuario SIN contraseña por seguridad + token generado
  return {
    user: {
      id: user.id,
      email: user.email,
    },
    token,
  };
};