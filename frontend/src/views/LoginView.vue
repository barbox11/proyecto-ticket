<!-- LoginView.vue — Página de inicio de sesión con diseño holográfico oscuro -->
<template>
  <div class="login-page">
    <!-- Efecto holográfico/radar animado de fondo -->
    <div class="hologram">
      <div class="hologram-line-h"></div>
      <div class="hologram-line-v"></div>
      <div class="hologram-ring hologram-ring-1"></div>
      <div class="hologram-ring hologram-ring-2"></div>
      <div class="hologram-ring hologram-ring-3"></div>
    </div>

    <!-- Card de login -->
    <div class="login-card" :class="{ 'login-card--error': hasError }">
      <!-- Logo y título -->
      <div class="login-header">
        <div class="login-logo">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="3" />
            <path d="M9 9l6 6M15 9l-6 6" />
          </svg>
        </div>
        <h1 class="login-title">Bienvenido de nuevo</h1>
        <p class="login-subtitle">Inicia sesión para gestionar tus tickets</p>
      </div>

      <!-- Mensaje de error -->
      <div v-if="errorMessage" class="login-error">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <span>{{ errorMessage }}</span>
      </div>

      <!-- Formulario -->
      <form @submit.prevent="handleLogin" class="login-form">
        <!-- Email -->
        <div class="form-group">
          <label class="form-label" for="email">CORREO ELECTRÓNICO</label>
          <div class="input-wrapper">
            <svg class="input-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="4" width="20" height="16" rx="3" />
              <path d="M22 4L12 13L2 4" />
            </svg>
            <input
              id="email"
              v-model="email"
              type="email"
              placeholder="tu@email.com"
              autocomplete="email"
              class="form-input"
              :class="{ 'form-input--error': emailError }"
              @input="emailError = ''"
            />
          </div>
          <p v-if="emailError" class="field-error">{{ emailError }}</p>
        </div>

        <!-- Password -->
        <div class="form-group">
          <label class="form-label" for="password">CONTRASEÑA</label>
          <div class="input-wrapper">
            <svg class="input-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="11" width="18" height="11" rx="3" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
            <input
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="••••••••"
              autocomplete="current-password"
              class="form-input"
              :class="{ 'form-input--error': passwordError }"
              @input="passwordError = ''"
            />
            <button
              type="button"
              class="input-toggle"
              @click="showPassword = !showPassword"
              tabindex="-1"
            >
              <svg v-if="showPassword" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
              <svg v-else viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </button>
          </div>
          <p v-if="passwordError" class="field-error">{{ passwordError }}</p>
        </div>

        <!-- Remember me -->
        <label class="form-checkbox">
          <input type="checkbox" v-model="rememberMe" />
          <span class="checkbox-check">
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="3">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </span>
          <span>Mantener sesión activa</span>
        </label>

        <!-- Botón principal -->
        <button
          type="submit"
          class="btn btn-primary"
          :disabled="isLoading"
        >
          <span v-if="!isLoading" class="btn-content">
            Iniciar sesión
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3" />
            </svg>
          </span>
          <span v-else class="btn-loading">
            <svg class="spinner" viewBox="0 0 24 24" width="20" height="20">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" fill="none" stroke-dasharray="31.4 31.4" stroke-linecap="round" />
            </svg>
            Verificando...
          </span>
        </button>
      </form>

      <!-- Links adicionales -->
      <div class="login-footer">
        <p>¿No tienes cuenta? <a href="#" @click.prevent="goRegister">Crear cuenta</a></p>
        <p>¿Olvidaste tu contraseña? <a href="#" @click.prevent="goForgotPassword">Recuperarla</a></p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "../stores/auth.store";
import { useRouter } from "vue-router";

const email = ref("");
const password = ref("");
const showPassword = ref(false);
const rememberMe = ref(false);
const isLoading = ref(false);
const hasError = ref(false);
const errorMessage = ref("");
const emailError = ref("");
const passwordError = ref("");

const auth = useAuthStore();
const router = useRouter();

const handleLogin = async () => {
  // Limpiar errores previos
  emailError.value = "";
  passwordError.value = "";
  errorMessage.value = "";
  hasError.value = false;

  // Validación
  let hasValidationError = false;

  if (!email.value.trim()) {
    emailError.value = "El email es obligatorio";
    hasValidationError = true;
  } else if (!/\S+@\S+\.\S+/.test(email.value)) {
    emailError.value = "Ingresa un email válido";
    hasValidationError = true;
  }

  if (!password.value) {
    passwordError.value = "La contraseña es obligatoria";
    hasValidationError = true;
  } else if (password.value.length < 3) {
    passwordError.value = "Contraseña demasiado corta";
    hasValidationError = true;
  }

  if (hasValidationError) return;

  isLoading.value = true;

  try {
    await auth.login(email.value, password.value);
    router.push("/dashboard");
  } catch (error: any) {
    hasError.value = true;
    errorMessage.value = error?.response?.data?.error || "Credenciales incorrectas";
  } finally {
    isLoading.value = false;
  }
};

const goRegister = () => {
  router.push("/register");
};

const goForgotPassword = () => {
  router.push("/forgot-password");
};
</script>

<style scoped>
/* 
    Página de Login - Layout
    */

.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  position: relative;
  overflow: hidden;
  background: var(--neutral-dark);
  /* Fondo con gradiente sutil */
  background:
    radial-gradient(ellipse at 20% 50%, rgba(16, 185, 129, 0.08) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 20%, rgba(51, 65, 85, 0.15) 0%, transparent 50%),
    var(--neutral-dark);
  animation: pageEnter 0.5s var(--transition-slow) both;
}

/* 
    Efecto Holográfico / Radar
    */

.hologram {
  position: absolute;
  left: 8%;
  top: 50%;
  transform: translateY(-50%);
  width: 420px;
  height: 420px;
  pointer-events: none;
}

.hologram-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 2px solid rgba(16, 185, 129, 0.35);
}

.hologram-ring-1 {
  animation: rotateSlow 12s linear infinite, pulseGlow 3s ease-in-out infinite;
}

.hologram-ring-2 {
  inset: 45px;
  animation: rotateSlow 9s linear infinite reverse, pulseGlow 3s ease-in-out infinite 0.5s;
  border-color: rgba(16, 185, 129, 0.25);
  border-style: dashed;
}

.hologram-ring-3 {
  inset: 90px;
  animation: rotateSlow 6s linear infinite, pulseGlow 3s ease-in-out infinite 1s;
  border-color: rgba(16, 185, 129, 0.18);
}

/* Centro del holograma - punto brillante */
.hologram::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 12px;
  height: 12px;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background: var(--primary);
  box-shadow:
    0 0 20px rgba(16, 185, 129, 0.6),
    0 0 40px rgba(16, 185, 129, 0.3),
    0 0 60px rgba(16, 185, 129, 0.15);
  animation: pulseGlow 2s ease-in-out infinite;
}

/* Barrido de luz que recorre el holograma */
.hologram::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 50%;
  height: 2px;
  transform-origin: left center;
  background: linear-gradient(90deg, rgba(16, 185, 129, 0.6), transparent);
  animation: rotateSlow 4s linear infinite;
  filter: drop-shadow(0 0 6px rgba(16, 185, 129, 0.8));
}

/* Línea horizontal del radar */
.hologram-line-h {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 85%;
  height: 1px;
  transform: translate(-50%, -50%);
  background: linear-gradient(90deg, transparent, rgba(16, 185, 129, 0.25), transparent);
}

/* Línea vertical del radar */
.hologram-line-v {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 1px;
  height: 85%;
  transform: translate(-50%, -50%);
  background: linear-gradient(180deg, transparent, rgba(16, 185, 129, 0.25), transparent);
}

/* 
    Card de Login
    */

.login-card {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 420px;
  background: var(--neutral-card);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--neutral-border);
  border-radius: var(--radius-lg);
  padding: 40px 36px;
  box-shadow: var(--shadow-card);
  transition: box-shadow var(--transition-normal);
}

.login-card--error {
  animation: shake 0.5s ease;
}

/* 
    Header del Login
   */

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.login-logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: var(--radius-md);
  background: var(--primary-gradient);
  color: white;
  margin-bottom: 20px;
  animation: iconPulse 3s ease-in-out infinite;
}

.login-title {
  font-family: var(--font-headline);
  font-size: 26px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 8px;
  letter-spacing: -0.5px;
}

.login-subtitle {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.5;
}

/* 
    Mensaje de Error
    */

.login-error {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: var(--error-bg);
  border: 1px solid var(--error-border);
  border-radius: var(--radius-sm);
  color: var(--error-text);
  font-size: 13px;
  margin-bottom: 20px;
  animation: fadeIn 0.3s ease;
}

/* 
    Formulario
    */

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 14px;
  color: var(--text-muted);
  pointer-events: none;
  transition: color var(--transition-fast);
}

.form-input {
  width: 100%;
  height: 48px;
  padding: 0 44px 0 42px;
  background: var(--input-bg);
  border: 1px solid var(--input-border);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  font-size: 14px;
  transition: all var(--transition-fast);
  box-shadow: var(--shadow-input);
}

.form-input::placeholder {
  color: var(--text-muted);
}

.form-input:hover {
  border-color: var(--secondary-light);
}

.form-input:focus {
  outline: none;
  border-color: var(--input-focus-border);
  box-shadow: 0 0 0 3px var(--input-focus-glow);
}

.form-input:focus + .input-icon,
.form-input:focus ~ .input-icon {
  color: var(--primary);
}

.form-input--error {
  border-color: var(--error-border) !important;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15) !important;
}

.field-error {
  font-size: 12px;
  color: var(--error-text);
  margin-top: -4px;
  animation: fadeIn 0.2s ease;
}

/* Toggle password visibility */
.input-toggle {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  color: var(--text-muted);
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: color var(--transition-fast);
}

.input-toggle:hover {
  color: var(--text-secondary);
}

/* 
    Checkbox personalizado
    */

.form-checkbox {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-size: 13px;
  color: var(--text-secondary);
  user-select: none;
}

.form-checkbox input[type="checkbox"] {
  display: none;
}

.checkbox-check {
  width: 18px;
  height: 18px;
  border-radius: 4px;
  border: 1px solid var(--input-border);
  background: var(--input-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  color: transparent;
  transition: all var(--transition-fast);
  flex-shrink: 0;
}

.form-checkbox:hover .checkbox-check {
  border-color: var(--primary);
}

.form-checkbox input:checked + .checkbox-check {
  background: var(--primary);
  border-color: var(--primary);
  color: white;
}

/* 
    Botón Principal
    */

.btn-primary {
  width: 100%;
  height: 48px;
  border-radius: var(--radius-sm);
  background: var(--primary-gradient);
  color: white;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0.02em;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all var(--transition-normal);
  box-shadow: var(--shadow-button);
  position: relative;
  overflow: hidden;
}

.btn-primary::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  background-size: 200% 100%;
  animation: shimmer 3s infinite;
}

.btn-primary:hover:not(:disabled) {
  background: var(--primary-gradient-hover);
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.5);
}

.btn-primary:active:not(:disabled) {
  transform: translateY(0);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-content {
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
  z-index: 1;
}

.btn-loading {
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
  z-index: 1;
}

.spinner {
  animation: spin 0.8s linear infinite;
}

/* 
    Footer del Login
    */

.login-footer {
  text-align: center;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid var(--neutral-border);
  font-size: 14px;
  color: var(--text-secondary);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.login-footer p {
  margin: 0;
}

.login-footer a {
  font-weight: 500;
  color: var(--primary);
  transition: color var(--transition-fast);
}

.login-footer a:hover {
  color: var(--primary-light);
  text-decoration: underline;
}

/* 
    Responsive: Móvil
    */

@media (max-width: 640px) {
  .login-page {
    padding: 16px;
  }

  .hologram {
    display: none;
  }

  .login-card {
    padding: 32px 24px;
  }

  .login-title {
    font-size: 22px;
  }
}
</style>
