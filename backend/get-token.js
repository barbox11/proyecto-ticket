require("dotenv").config();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function getToken() {
  const token = await prisma.passwordResetToken.findFirst({
    where: { email: "test@example.com" },
    orderBy: { createdAt: "desc" },
  });

  console.log("🔑 Token de Reset:", token?.token);
  console.log("⏰ Expira en:", token?.expiresAt);
  console.log("✅ Usado:", token?.used);

  await prisma.$disconnect();
}

getToken().catch(console.error);
