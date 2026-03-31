import { prisma } from "../config/prisma";
import bcrypt from "bcrypt";

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