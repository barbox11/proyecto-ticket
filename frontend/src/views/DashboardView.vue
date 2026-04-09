<template>
    <div>
        <h1>Dashboard</h1>

        <button @click="logout">Cerrar sesión</button>

        <hr />

        <h2>Crear Ticket</h2>

        <input v-model="title" placeholder="Título" />
        <input v-model="description" placeholder="Descripción" />

        <select v-model="priority">
        <option value="low">Baja</option>
        <option value="medium">Media</option>
        <option value="high">Alta</option>
        </select>

        <button @click="create">Crear</button>

        <hr />

        <h2>Mis Tickets</h2>

        <div v-for="t in tickets" :key="t.id">
        <p>
            {{ t.title }} - {{ t.priority }} - {{ t.status }}
        </p>
        </div>
    </div>
    </template>

    <script setup lang="ts">
    import { ref, onMounted } from "vue";
    import { useAuthStore } from "../stores/auth.store";
    import { useTicketStore } from "../stores/ticket.store";

    const auth = useAuthStore();
    const ticketStore = useTicketStore();

    const title = ref("");
    const description = ref("");
    const priority = ref("medium");

    // 👇 importante: referencia reactiva
    const tickets = ticketStore.tickets;

    const logout = () => {
    auth.logout();
    };

    const create = async () => {
    try {
        await ticketStore.createTicket(
        title.value,
        description.value,
        priority.value
        );

        alert("Ticket creado ✅");

        title.value = "";
        description.value = "";
    } catch (error) {
        alert("Error al crear ticket ❌");
    }
    };

    onMounted(() => {
    ticketStore.fetchTickets();
    });
    </script>