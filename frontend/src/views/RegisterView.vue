<template>
    <div>
        <h1>Registro</h1>

        <input v-model="email" placeholder="Email" />
        <input v-model="password" type="password" placeholder="Password" />

        <button @click="handleRegister">Registrarse</button>
    </div>
    </template>

    <script setup lang="ts">
    import { ref } from "vue";
    import { api } from "../api/api";
    import { useRouter } from "vue-router";

    const email = ref("");
    const password = ref("");

    const router = useRouter();

    const handleRegister = async () => {
    await api.post("/api/users/register", {
        email: email.value,
        password: password.value,
    });

    alert("Usuario creado");
    router.push("/");
    };
    </script>