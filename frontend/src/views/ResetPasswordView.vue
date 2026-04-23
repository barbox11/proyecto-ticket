<template>
  <div class="reset-password-container">
    <div class="reset-password-card">
      <!-- Logo -->
      <div class="logo-container">
        <img :src="logo" alt="Logo" class="card-logo" />
      </div>
      <h1>Cambiar Contraseña</h1>

      <!-- Estado de carga -->
      <div v-if="validating" class="loading">
        <p>Validando enlace...</p>
      </div>

      <!-- Token inválido o expirado -->
      <div v-else-if="tokenInvalid" class="error-message">
        <p>❌ {{ errorMessage }}</p>
        <p>El enlace de recuperación es inválido o ha expirado.</p>
        <router-link to="/forgot-password" class="btn-link">
          Solicitar nuevo enlace
        </router-link>
      </div>

      <!-- Formulario de reset -->
      <form v-else @submit.prevent="handleResetPassword">
        <div class="form-group">
          <label for="newPassword">Nueva Contraseña</label>
          <input
            id="newPassword"
            v-model="newPassword"
            type="password"
            placeholder="••••••••"
          />
        </div>

        <div class="form-group">
          <label for="confirmPassword">Confirmar Contraseña</label>
          <input
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
            placeholder="••••••••"
          />
        </div>

        <!-- Requisitos de contraseña -->
        <div class="password-requirements">
          <p :class="{ valid: newPassword.length >= 8 }">
            ✓ Mínimo 8 caracteres
          </p>
          <p :class="{ valid: newPassword === confirmPassword }">
            ✓ Las contraseñas coinciden
          </p>
        </div>

        <!-- Mensaje de error -->
        <div v-if="error" class="error-message">
          ❌ {{ error }}
        </div>

        <!-- Botón enviar -->
        <button
          type="submit"
          :disabled="loading || !isFormValid"
          class="btn-submit"
        >
          {{ loading ? "Procesando..." : "Cambiar Contraseña" }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { api } from "../api/api";
import logo from "../assets/logo.png";

const router = useRouter();
const route = useRoute();

const token = ref<string>("");
const newPassword = ref<string>("");
const confirmPassword = ref<string>("");
const loading = ref<boolean>(false);
const validating = ref<boolean>(true);
const tokenInvalid = ref<boolean>(false);
const error = ref<string>("");
const errorMessage = ref<string>("");

const isFormValid = computed((): boolean => {
  return (
    newPassword.value.length >= 8 &&
    newPassword.value === confirmPassword.value
  );
});

onMounted(async (): Promise<void> => {
  const queryToken = route.query.token;
  token.value = typeof queryToken === "string" ? queryToken : "";

  if (!token.value) {
    tokenInvalid.value = true;
    errorMessage.value = "No hay token de recuperación";
    validating.value = false;
    return;
  }

  try {
    await api.get(`/users/validate-reset-token/${token.value}`);
    validating.value = false;
  } catch (err: any) {
    tokenInvalid.value = true;
    errorMessage.value =
      err.response?.data?.error || "El token es inválido o ha expirado";
    validating.value = false;
  }
});

const handleResetPassword = async (): Promise<void> => {
  error.value = "";

  if (newPassword.value.length < 8) {
    error.value = "La contraseña debe tener al menos 8 caracteres";
    return;
  }

  if (newPassword.value !== confirmPassword.value) {
    error.value = "Las contraseñas no coinciden";
    return;
  }

  loading.value = true;

  try {
    await api.post("/users/reset-password", {
      token: token.value,
      newPassword: newPassword.value,
      confirmPassword: confirmPassword.value,
    });

    alert("✅ Contraseña cambiada exitosamente. Inicia sesión con tu nueva contraseña.");
    router.push("/login");
  } catch (err: any) {
    error.value =
      err.response?.data?.error || "Error al cambiar la contraseña";
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.reset-password-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.reset-password-card {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
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
  text-align: center;
  color: #333;
  margin-bottom: 30px;
  font-size: 28px;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #666;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-weight: 600;
}

input {
  width: 100%;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s;
  box-sizing: border-box;
}

input:focus {
  outline: none;
  border-color: #667eea;
}

.password-requirements {
  background: #f5f5f5;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 14px;
  color: #666;
}

.password-requirements p {
  margin: 8px 0;
  transition: color 0.3s;
}

.password-requirements p.valid {
  color: #080;
  font-weight: 600;
}

.error-message {
  background: #fee;
  color: #c00;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  border-left: 4px solid #c00;
  font-size: 14px;
}

.error-message p {
  margin: 8px 0;
}

.btn-link {
  display: inline-block;
  margin-top: 15px;
  padding: 10px 20px;
  background: #667eea;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 600;
  transition: background 0.3s;
}

.btn-link:hover {
  background: #764ba2;
}

.btn-submit {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
