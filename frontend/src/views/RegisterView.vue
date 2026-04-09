<template>
    <div>
        <h1>Registro</h1>

        <input v-model="name" placeholder="Nombre" />
        <input v-model="email" placeholder="Email" />
        <input v-model="password" type="password" placeholder="Password" />

        <button @click="handleRegister">Registrarse</button>

        <p>¿Ya tienes cuenta?</p>
        <button @click="goLogin">Ir al login</button>
    </div>
    </template>

    <script setup lang="ts">
    import { ref } from "vue";
    import { api } from "../api/api";
    import { useRouter } from "vue-router";

    const name = ref("");
    const email = ref("");
    const password = ref("");

    const router = useRouter();

    const handleRegister = async () => {
    try {
        await api.post("/api/users/register", {
        name: name.value,
        email: email.value,
        password: password.value,
        });

        alert("Usuario creado correctamente ✅");
        router.push("/");
    } catch (error) {
        alert("Error al registrarse ❌");
    }
    };

    const goLogin = () => {
    router.push("/");
    };
    </script>