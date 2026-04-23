<!-- RegisterView.vue — Página de registro completa -->
    <template>
    <div class="register-page">
        <!-- Efecto holográfico de fondo -->
        <div class="hologram">
        <div class="hologram-line-h"></div>
        <div class="hologram-line-v"></div>
        <div class="hologram-ring hologram-ring-1"></div>
        <div class="hologram-ring hologram-ring-2"></div>
        <div class="hologram-ring hologram-ring-3"></div>
        </div>

        <div class="register-container">
        <!-- Panel Izquierdo -->
        <div class="register-left">
            <div class="register-logo">
            <img :src="logo" alt="Logo" class="logo-img" />
            <span class="logo-text">Archon Systems</span>
            </div>

            <div class="register-hero">
            <h1 class="hero-title">
                Arquitecta tu<br />
                <span class="highlight">futuro digital</span> con<br />
                precisión total.
            </h1>
            
            <p class="hero-description">
                Accede al terminal más sofisticado de la industria para la gestión 
                de recursos empresariales y análisis de datos de alta densidad.
            </p>
            </div>
        </div>

        <!-- Panel Derecho - Formulario -->
        <div class="register-right">
            <div class="form-container">
            <h2 class="form-title">Crear Cuenta de Acceso</h2>
            <p class="form-subtitle">Inicializa tus credenciales de terminal para continuar.</p>

            <!-- Mensaje de error general -->
            <div v-if="errorMessage" class="form-error">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{{ errorMessage }}</span>
            </div>

            <!-- FORMULARIO COMPLETO -->
            <form @submit.prevent="handleRegister" class="register-form">
                
                <!-- Nombre Completo -->
                <div class="form-group">
                <label class="form-label" for="name">NOMBRE COMPLETO</label>
                <div class="input-wrapper">
                    <svg class="input-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                    </svg>
                    <input
                    id="name"
                    v-model="name"
                    type="text"
                    placeholder="Juan Pérez"
                    class="form-input"
                    :class="{ 'form-input--error': nameError }"
                    @input="nameError = ''"
                    />
                </div>
                <p v-if="nameError" class="field-error">{{ nameError }}</p>
                </div>

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
                    class="form-input"
                    :class="{ 'form-input--error': emailError }"
                    @input="emailError = ''"
                    />
                </div>
                <p v-if="emailError" class="field-error">{{ emailError }}</p>
                </div>

                <!-- Contraseña -->
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

                <!-- Confirmar Contraseña -->
                <div class="form-group">
                <label class="form-label" for="verifyPassword">CONFIRMAR CONTRASEÑA</label>
                <div class="input-wrapper">
                    <svg class="input-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="11" width="18" height="11" rx="3" />
                    <path d="M7 11V7a5 5 0 0110 0v4" />
                    </svg>
                    <input
                    id="verifyPassword"
                    v-model="verifyPassword"
                    :type="showVerifyPassword ? 'text' : 'password'"
                    placeholder="••••••••"
                    class="form-input"
                    :class="{ 'form-input--error': verifyPasswordError }"
                    @input="verifyPasswordError = ''"
                    />
                    <button
                    type="button"
                    class="input-toggle"
                    @click="showVerifyPassword = !showVerifyPassword"
                    tabindex="-1"
                    >
                    <svg v-if="showVerifyPassword" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
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
                <p v-if="verifyPasswordError" class="field-error">{{ verifyPasswordError }}</p>
                </div>

                <!-- Checkbox Términos -->
                <label class="form-checkbox">
                <input type="checkbox" v-model="acceptTerms" />
                <span class="checkbox-check">
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="3">
                    <polyline points="20 6 9 17 4 12" />
                    </svg>
                </span>
                <span>Acepto los <a href="#" class="link" @click.prevent>Términos</a> y <a href="#" class="link" @click.prevent>Política de Privacidad</a></span>
                </label>

                <!-- Botón principal -->
                <button
                type="submit"
                class="btn btn-primary"
                :disabled="isLoading"
                >
                <span v-if="!isLoading" class="btn-content">
                    Crear cuenta
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3" />
                    </svg>
                </span>
                <span v-else class="btn-loading">
                    <svg class="spinner" viewBox="0 0 24 24" width="20" height="20">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" fill="none" stroke-dasharray="31.4 31.4" stroke-linecap="round" />
                    </svg>
                    Procesando...
                </span>
                </button>
            </form>

            <!-- Divider -->
            <div class="divider">
                <span>O AUTENTICAR CON</span>
            </div>

            <!-- Botones SSO -->
            <div class="sso-buttons">
                <button class="btn-sso" @click="handleSSO('portal')" :disabled="isLoading">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 2a14.5 14.5 0 000 20 14.5 14.5 0 000-20" />
                    <path d="M2 12h20" />
                </svg>
                Portal SSO
                </button>
                <button class="btn-sso" @click="handleSSO('github')" :disabled="isLoading">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub ID
                </button>
            </div>

            <!-- Link a login -->
            <div class="login-link">
                ¿Ya tienes cuenta? <a href="#" class="link" @click.prevent="goLogin">Iniciar sesión</a>
            </div>
            </div>
        </div>
        </div>
    </div>
    </template>

    <script setup lang="ts">
    import { ref } from "vue";
    import { api } from "../api/api";
    import { useRouter } from "vue-router";
    import logo from "../assets/logo.png";

    // Variables reactivas
    const name = ref("");
    const email = ref("");
    const password = ref("");
    const verifyPassword = ref("");
    const acceptTerms = ref(false);
    const showPassword = ref(false);
    const showVerifyPassword = ref(false);
    const isLoading = ref(false);
    const errorMessage = ref("");

    // Errores individuales
    const nameError = ref("");
    const emailError = ref("");
    const passwordError = ref("");
    const verifyPasswordError = ref("");

    const router = useRouter();

    const validateForm = (): boolean => {
    nameError.value = "";
    emailError.value = "";
    passwordError.value = "";
    verifyPasswordError.value = "";
    errorMessage.value = "";

    let isValid = true;

    if (!name.value.trim()) {
        nameError.value = "El nombre es obligatorio";
        isValid = false;
    }

    if (!email.value.trim()) {
        emailError.value = "El email es obligatorio";
        isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email.value)) {
        emailError.value = "Ingresa un email válido";
        isValid = false;
    }

    if (!password.value) {
        passwordError.value = "La contraseña es obligatoria";
        isValid = false;
    } else if (password.value.length < 6) {
        passwordError.value = "Mínimo 6 caracteres";
        isValid = false;
    }

    if (password.value !== verifyPassword.value) {
        verifyPasswordError.value = "Las contraseñas no coinciden";
        isValid = false;
    }

    if (!acceptTerms.value) {
        errorMessage.value = "Debes aceptar los términos";
        isValid = false;
    }

    return isValid;
    };

    const handleRegister = async () => {
    if (!validateForm()) return;

    isLoading.value = true;

    try {
        // LLAMADA REAL A TU API EXISTENTE
        await api.post("/api/users/register", {
        name: name.value,
        email: email.value,
        password: password.value,
        });

        // ✅ CAMBIO CLAVE: Redirigir a "/" (que es el login en tu router)
        router.push("/");

    } catch (error: any) {
        console.error("Error en registro:", error);
        
        if (error.response?.status === 409) {
        errorMessage.value = "Este email ya está registrado";
        emailError.value = "Email duplicado";
        } else if (error.response?.status === 400) {
        errorMessage.value = error.response?.data?.message || "Datos inválidos";
        } else if (error.response?.data?.message) {
        errorMessage.value = error.response.data.message;
        } else {
        errorMessage.value = "Error al registrarse. Intenta más tarde.";
        }
    } finally {
        isLoading.value = false;
    }
    };

    const handleSSO = async (provider: string) => {
    console.log(`SSO con ${provider}`);
    };

    const goLogin = () => {
    // ✅ CAMBIO CLAVE: Redirigir a "/" (que es el login en tu router)
    router.push("/");
    };
    </script>

    <style scoped>
    /* ============================================
    VARIABLES CSS
    ============================================ */
    :root {
    --primary: #10b981;
    --primary-dark: #059669;
    --primary-light: #34d399;
    --bg-dark: #0a0e1a;
    --bg-card: rgba(17, 24, 39, 0.6);
    --text-primary: #ffffff;
    --text-secondary: #9ca3af;
    --text-muted: #6b7280;
    --border-color: rgba(16, 185, 129, 0.2);
    --error-bg: rgba(239, 68, 68, 0.1);
    --error-border: rgba(239, 68, 68, 0.3);
    --error-text: #fca5a5;
    --radius-sm: 8px;
    --radius-md: 12px;
    --radius-lg: 16px;
    --transition-fast: 150ms ease;
    --transition-normal: 300ms ease;
    }

    /* ============================================
    LAYOUT PRINCIPAL
    ============================================ */
    .register-page {
    min-height: 100vh;
    background: var(--bg-dark);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    position: relative;
    overflow: hidden;
    background:
        radial-gradient(ellipse at 20% 50%, rgba(16, 185, 129, 0.08) 0%, transparent 50%),
        radial-gradient(ellipse at 80% 20%, rgba(51, 65, 85, 0.15) 0%, transparent 50%),
        var(--bg-dark);
    }

    .register-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    max-width: 1200px;
    width: 100%;
    gap: 4rem;
    position: relative;
    z-index: 1;
    animation: fadeInUp 0.6s ease-out;
    }

    /* ============================================
    EFECTO HOLOGRÁFICO
    ============================================ */
    .hologram {
    position: absolute;
    left: 5%;
    top: 50%;
    transform: translateY(-50%);
    width: 420px;
    height: 420px;
    pointer-events: none;
    z-index: 0;
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

    .hologram-line-h {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 85%;
    height: 1px;
    transform: translate(-50%, -50%);
    background: linear-gradient(90deg, transparent, rgba(16, 185, 129, 0.25), transparent);
    }

    .hologram-line-v {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 1px;
    height: 85%;
    transform: translate(-50%, -50%);
    background: linear-gradient(180deg, transparent, rgba(16, 185, 129, 0.25), transparent);
    }

    /* ============================================
    PANEL IZQUIERDO
    ============================================ */
    .register-left {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 2rem 0;
    }

    .register-logo {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    }

    .logo-icon {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
    border-radius: var(--radius-sm);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
    font-size: 1.25rem;
    }

    .logo-img {
    width: 100px;
    height: 100px;
    object-fit: contain;
    filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.25));
    transition: transform 0.3s ease;
    }

    .register-logo:hover .logo-img {
    transform: scale(1.12) rotate(8deg);
    }

    .logo-text {
    color: var(--primary);
    font-size: 1.8rem;
    font-weight: 700;
    letter-spacing: -0.5px;
    }

    .register-hero {
    margin-top: 3rem;
    }

    .hero-title {
    font-size: 3.5rem;
    line-height: 1.1;
    color: var(--text-primary);
    font-weight: 700;
    margin-bottom: 1.5rem;
    letter-spacing: -2px;
    }

    .hero-title .highlight {
    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    }

    .hero-description {
    color: var(--text-secondary);
    font-size: 1.125rem;
    line-height: 1.7;
    max-width: 480px;
    }

    /* ============================================
    PANEL DERECHO - FORMULARIO
    ============================================ */
    .register-right {
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-lg);
    padding: 3rem;
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    }

    .form-container {
    width: 100%;
    }

    .form-title {
    color: var(--text-primary);
    font-size: 1.75rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    }

    .form-subtitle {
    color: var(--text-secondary);
    font-size: 0.95rem;
    margin-bottom: 2.5rem;
    }

    /* Mensaje de error */
    .form-error {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.875rem 1rem;
    background: var(--error-bg);
    border: 1px solid var(--error-border);
    border-radius: var(--radius-sm);
    color: var(--error-text);
    font-size: 0.875rem;
    margin-bottom: 1.5rem;
    animation: shake 0.5s ease;
    }

    /* ============================================
    FORMULARIO
    ============================================ */
    .register-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    }

    .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    }

    .form-label {
    color: var(--text-secondary);
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    display: flex;
    align-items: center;
    gap: 0.5rem;
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
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-sm);
    color: var(--text-primary);
    font-size: 0.95rem;
    transition: all var(--transition-fast);
    outline: none;
    }

    .form-input::placeholder {
    color: var(--text-muted);
    }

    .form-input:hover {
    border-color: var(--primary);
    }

    .form-input:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
    }

    .form-input--error {
    border-color: var(--error-border) !important;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
    }

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
    cursor: pointer;
    transition: color var(--transition-fast);
    }

    .input-toggle:hover {
    color: var(--text-secondary);
    }

    /* Checkbox */
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
    border: 1px solid var(--border-color);
    background: rgba(255, 255, 255, 0.03);
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

    .form-checkbox .link {
    color: var(--primary);
    text-decoration: none;
    }

    .form-checkbox .link:hover {
    color: var(--primary-light);
    text-decoration: underline;
    }

    .field-error {
    font-size: 12px;
    color: var(--error-text);
    margin-top: -4px;
    animation: fadeIn 0.2s ease;
    }

    /* Botón principal */
    .btn-primary {
    width: 100%;
    height: 48px;
    border-radius: var(--radius-sm);
    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
    color: white;
    font-size: 15px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all var(--transition-normal);
    box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.2);
    position: relative;
    overflow: hidden;
    margin-top: 1rem;
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
    background: linear-gradient(135deg, var(--primary-light) 0%, var(--primary) 100%);
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(16, 185, 129, 0.3);
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

    /* Divider */
    .divider {
    display: flex;
    align-items: center;
    margin: 2rem 0;
    color: var(--text-muted);
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    }

    .divider::before,
    .divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--border-color);
    }

    .divider span {
    padding: 0 1rem;
    }

    /* Botones SSO */
    .sso-buttons {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    }

    .btn-sso {
    height: 48px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-sm);
    color: var(--text-primary);
    font-size: 0.95rem;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    transition: all var(--transition-fast);
    }

    .btn-sso:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.05);
    border-color: var(--primary);
    transform: translateY(-2px);
    }

    .btn-sso:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    }

    /* Link a login */
    .login-link {
    text-align: center;
    margin-top: 2rem;
    color: var(--text-secondary);
    font-size: 14px;
    }

    .login-link .link {
    font-weight: 500;
    color: var(--primary);
    text-decoration: none;
    }

    .login-link .link:hover {
    color: var(--primary-light);
    text-decoration: underline;
    }

    /* ============================================
    ANIMACIONES
    ============================================ */
    @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
    }

    @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
    }

    @keyframes rotateSlow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
    }

    @keyframes pulseGlow {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.6; }
    }

    @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
    }

    @keyframes spin {
    to { transform: rotate(360deg); }
    }

    @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20%, 60% { transform: translateX(-5px); }
    40%, 80% { transform: translateX(5px); }
    }

    /* ============================================
    RESPONSIVE
    ============================================ */
    @media (max-width: 968px) {
    .register-container {
        grid-template-columns: 1fr;
        gap: 2rem;
    }

    .register-left {
        display: none;
    }

    .hologram {
        display: none;
    }

    .register-right {
        padding: 2.5rem;
    }
    }

    @media (max-width: 640px) {
    .register-page {
        padding: 1rem;
    }

    .register-right {
        padding: 2rem 1.5rem;
    }

    .sso-buttons {
        grid-template-columns: 1fr;
    }

    .hero-title {
        font-size: 2.5rem;
    }
    }
    </style>