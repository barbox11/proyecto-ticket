<template>
  <div class="recover-container">
    <div class="recover-card">
      <!-- Logo -->
      <div class="logo-container">
        <img :src="logo" alt="Logo" class="card-logo" />
      </div>

      <h1>Recuperar Acceso</h1>
      <p class="subtitle">Ingresa tu correo electrónico para iniciar el proceso de recuperación de contraseña</p>

      <!-- Mensaje de éxito -->
      <div v-if="success" class="success-message">
        <p>✅ {{ successMessage }}</p>
        <p>Revisa tu correo para el enlace de recuperación.</p>
      </div>

      <!-- Formulario -->
      <form v-else @submit.prevent="handleForgotPassword" class="recover-form">
        <!-- Input para email -->
        <div class="form-group">
          <input
            v-model="email"
            type="email"
            placeholder="CORREO ELECTRÓNICO"
            class="email-input"
          />
        </div>

        <!-- Mensaje de error -->
        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <!-- Botón enviar -->
        <button 
          type="submit" 
          :disabled="loading"
          class="btn-send"
        >
          {{ loading ? "Enviando..." : "Enviar Enlace de Recuperación" }}
        </button>

        <!-- Link volver al login -->
        <p class="back-link">
          <router-link to="/login">← Volver al Login</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { api } from "../api/api";
import logo from "../assets/logo.png";

const router = useRouter();

const email = ref("");
const loading = ref(false);
const error = ref("");
const success = ref(false);
const successMessage = ref("");

const handleForgotPassword = async () => {
  // Limpiar errores previos
  error.value = "";

  // Validar email
  if (!email.value || !email.value.includes("@")) {
    error.value = "Por favor ingresa un correo electrónico válido";
    return;
  }

  loading.value = true;

  try {
    const response = await api.post("/users/forgot-password", {
      email: email.value,
    });

    successMessage.value = response.data.message || "Enlace enviado correctamente";
    success.value = true;

    // Redirigir al login después de 3 segundos
    setTimeout(() => {
      router.push("/login");
    }, 3000);
  } catch (err: any) {
    error.value = err.response?.data?.error || "Error al procesar la solicitud";
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.recover-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0f172a 0%, #1a1f3a 100%);
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

.recover-card {
  background: linear-gradient(135deg, #1e2749 0%, #1a1f3a 100%);
  padding: 50px 40px;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  width: 100%;
  max-width: 380px;
  border: 1px solid rgba(102, 126, 234, 0.1);
  text-align: center;
}

.logo-container {
  width: auto;
  height: auto;
  background: transparent;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 50px;
  box-shadow: none;
  padding: 0;
  animation: none;
  border: none;
}

.card-logo {
  width: 200px;
  height: 200px;
  object-fit: contain;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.2));
  transition: transform 0.3s ease;
}

.logo-container:hover .card-logo {
  transform: scale(1.05);
}

h1 {
  color: #f0f9ff;
  margin-bottom: 12px;
  font-size: 28px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.subtitle {
  color: #a0aec0;
  font-size: 14px;
  margin-bottom: 30px;
  line-height: 1.5;
  max-width: 320px;
  margin-left: auto;
  margin-right: auto;
}

.recover-form {
  margin-top: 30px;
}

.form-group {
  margin-bottom: 20px;
}

.email-input {
  width: 100%;
  padding: 14px 16px;
  background: rgba(51, 65, 85, 0.5);
  border: 1.5px solid rgba(102, 126, 234, 0.3);
  border-radius: 8px;
  font-size: 13px;
  color: #e0e7ff;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.email-input::placeholder {
  color: #64748b;
  font-size: 12px;
}

.email-input:focus {
  outline: none;
  border-color: #667eea;
  background: rgba(51, 65, 85, 0.7);
  box-shadow: 0 0 12px rgba(102, 126, 234, 0.2);
}

.error-message {
  background: rgba(239, 68, 68, 0.1);
  color: #fca5a5;
  padding: 12px 14px;
  border-radius: 6px;
  margin-bottom: 16px;
  font-size: 13px;
  border-left: 3px solid #ef4444;
}

.success-message {
  background: rgba(16, 185, 129, 0.1);
  color: #86efac;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  text-align: left;
  border-left: 3px solid #10b981;
}

.success-message p {
  margin: 6px 0;
  font-size: 14px;
}

.btn-send {
  width: 100%;
  padding: 14px 20px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  margin-bottom: 16px;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.btn-send:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
}

.btn-send:active:not(:disabled) {
  transform: translateY(0);
}

.btn-send:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.back-link {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px dashed rgba(102, 126, 234, 0.2);
}

.back-link a {
  color: #60a5fa;
  text-decoration: none;
  font-size: 13px;
  font-weight: 500;
  transition: color 0.3s ease;
  letter-spacing: 0.3px;
}

.back-link a:hover {
  color: #93c5fd;
  text-decoration: underline;
}
</style>
