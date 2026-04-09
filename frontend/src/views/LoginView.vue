<template>
    <div>
    <h1>Login</h1>

    <input v-model="email" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Password" />

    <button @click="handleLogin">Ingresar</button>

    <p>¿No tienes cuenta?</p>
    <button @click="goRegister">Crear cuenta</button>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "../stores/auth.store";
import { useRouter } from "vue-router";

const email = ref("");
const password = ref("");

const auth = useAuthStore();
const router = useRouter();

const handleLogin = async () => {
        try {
    await auth.login(email.value, password.value);
    alert("Login exitoso ✅");
    router.push("/dashboard");
    } catch (error) {
    alert("Error al iniciar sesión ❌");
    }
};

const goRegister = () => {
    router.push("/register");
};
</script>