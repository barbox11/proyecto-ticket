// Importar el cliente de Prisma para interactuar con la BD
import { PrismaClient } from "@prisma/client";

// Crear instancia de Prisma y exportarla para usarla en toda la aplicación
export const prisma = new PrismaClient({});