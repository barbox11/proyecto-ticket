import { prisma } from "../config/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const createUser = async (email: string, password: string, name: string) => {
  // encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

  // guardar usuario
    const user = await prisma.user.create({
    data: {
        email,
        password: hashedPassword,
        name,
    },
    });

    return user;
};

// Función para autenticar usuario y generar token
export const loginUser = async (email: string, password: string) => {
  // Buscar usuario en la base de datos
  const user = await prisma.user.findUnique({
    where: { email },
  });

  // Validar que el usuario exista
  if (!user) {
    throw new Error("Usuario no encontrado");
  }

  // Comparar la contraseña ingresada con la hash guardada
  const isValid = await bcrypt.compare(password, user.password);

  // Validar que la contraseña sea correcta
  if (!isValid) {
    throw new Error("Contraseña incorrecta");
  }

  // Generar token JWT con el ID del usuario
  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET || "secreto",
    { expiresIn: "1h" }
  );

  // Retornar usuario y token generado (sin contraseña)
  return {
    user: {
      id: user.id,
      email: user.email,
    },
    token,
  };
};