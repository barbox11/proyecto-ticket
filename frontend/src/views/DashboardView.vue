<template>
    <div>
        <h1>Dashboard</h1>

        <button @click="logout">Cerrar sesión</button>
    </div>
    </template>

    <script setup lang="ts">
    import { useAuthStore } from "../stores/auth.store";
import { useRouter } from "vue-router";

    const auth = useAuthStore();
const router = useRouter();

    const logout = () => {
    auth.logout();
    router.push("/");
    };
    </script>