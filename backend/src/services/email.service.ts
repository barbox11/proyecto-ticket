import nodemailer, { Transporter } from "nodemailer";
import logger from "../config/logger";

// Configurar transporter según el entorno
let transporter: Transporter;

if (process.env.NODE_ENV === "production") {
  // En producción, usar SendGrid, Gmail, o tu proveedor
  transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
} else {
  // En desarrollo, usar Ethereal (servidor de testing)
  transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER || "demo@ethereal.email",
      pass: process.env.EMAIL_PASSWORD || "demo123",
    },
  });
}

// ── TEMPLATES DE EMAIL ──────────────────────────────

const passwordResetEmailTemplate = (userName: string, resetLink: string) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; background: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .header { text-align: center; margin-bottom: 30px; }
    .logo { font-size: 28px; font-weight: bold; color: #ef4444; }
    .content { line-height: 1.6; color: #333; }
    .button { display: inline-block; background: #ef4444; color: white; padding: 12px 30px; border-radius: 6px; text-decoration: none; margin: 20px 0; font-weight: bold; }
    .warning { background: #fee; padding: 15px; border-left: 4px solid #ef4444; margin: 20px 0; }
    .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">🔑 Reset de Contraseña</div>
    </div>
    <div class="content">
      <p>¡Hola ${userName}!</p>
      <p>Recibimos una solicitud para resetear tu contraseña. Si no fuiste tú, ignora este email.</p>
      <div class="warning">
        <strong>⚠️ IMPORTANTE:</strong> Este link expira en 1 hora. No compartas este email con nadie.
      </div>
      <a href="${resetLink}" class="button">Resetear Contraseña</a>
      <p>O copia y pega este enlace:</p>
      <p style="word-break: break-all; color: #ef4444; font-size: 12px;">${resetLink}</p>
    </div>
    <div class="footer">
      <p>Si no solicitaste esto, ignora este email.</p>
      <p>&copy; 2026 Ticket System. Todos los derechos reservados.</p>
    </div>
  </div>
</body>
</html>
`;

// ── FUNCIONES PRINCIPALES ───────────────────────────

export const sendPasswordResetEmail = async (email: string, userName: string, token: string) => {
  try {
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    
    const mailOptions = {
      from: process.env.EMAIL_USER || "noreply@ticketsystem.com",
      to: email,
      subject: "Resetea tu contraseña - Ticket System",
      html: passwordResetEmailTemplate(userName, resetLink),
    };

    const info = await transporter.sendMail(mailOptions);
    
    logger.info("Password reset email sent", {
      email,
      messageId: info.messageId,
    });

    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    logger.error("Failed to send password reset email", {
      email,
      error: error.message,
    });
    throw new Error("No se pudo enviar el email de reset");
  }
};

// Probar conexión SMTP
export const testEmailConnection = async () => {
  try {
    await transporter.verify();
    logger.info("Email service connected successfully");
    return true;
  } catch (error: any) {
    logger.error("Email service connection failed", {
      error: error.message,
    });
    return false;
  }
};
