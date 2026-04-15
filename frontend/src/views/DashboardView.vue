<!-- Dashboard principal: crear, listar y editar tickets -->

<template>
    <div>
        <h1>Dashboard</h1>

        <!-- Botón para cerrar sesión -->
        <button @click="logout">Cerrar sesión</button>

        <hr />

        <!-- Formulario para crear un nuevo ticket -->
        <h2>Crear Ticket</h2>

        <input v-model="title" placeholder="Título" />
        <p v-if="titleError" style="color: red; margin: 0.2rem 0; font-size: 0.85rem;">{{ titleError }}</p>
        <input v-model="description" placeholder="Descripción" />
        <p v-if="descriptionError" style="color: red; margin: 0.2rem 0; font-size: 0.85rem;">{{ descriptionError }}</p>

        <!-- Selector de prioridad: baja, media, alta -->
        <select v-model="priority">
            <option value="baja">Baja</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
        </select>

        <button @click="create" :disabled="ticketStore.isLoading">
            {{ ticketStore.isLoading ? "Creando..." : "Crear" }}
        </button>

        <hr />

        <!-- Lista de tickets del usuario -->
        <h2>Mis Tickets</h2>

        <!-- Mensaje mientras carga -->
        <p v-if="ticketStore.isLoading && tickets.length === 0" style="color: #666;">Cargando tickets...</p>

        <div v-for="t in tickets" :key="t.id" style="margin-bottom: 0.5rem; padding: 0.75rem; border: 1px solid #ccc; border-radius: 4px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <p style="margin: 0; font-weight: bold;">{{ t.title }}</p>
                    <p style="margin: 0; font-size: 0.85rem; color: #666;">{{ formatPriority(t.priority) }} - {{ formatStatus(t.status) }}</p>
                </div>
                <!-- Botón que abre/cierra el panel de edición del ticket -->
                <button @click="toggleEdit(t)" style="padding: 0.3rem 0.6rem; cursor: pointer;">
                    ✏️ Editar
                </button>
            </div>

            <!-- Panel de edición: se muestra solo si el ticket está en modo edición -->
            <div v-if="editingTicket === t.id" style="margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px solid #eee;">
                <div style="margin-bottom: 0.5rem;">
                    <input v-model="editForm.title" placeholder="Título" style="width: 100%; padding: 0.4rem;" />
                    <p v-if="editTitleError" style="color: red; margin: 0.2rem 0; font-size: 0.85rem;">{{ editTitleError }}</p>
                </div>
                <div style="margin-bottom: 0.5rem;">
                    <input v-model="editForm.description" placeholder="Descripción" style="width: 100%; padding: 0.4rem;" />
                    <p v-if="editDescriptionError" style="color: red; margin: 0.2rem 0; font-size: 0.85rem;">{{ editDescriptionError }}</p>
                </div>
                <div style="margin-bottom: 0.5rem; display: flex; gap: 0.5rem;">
                    <select v-model="editForm.priority" style="flex: 1; padding: 0.4rem;">
                        <option value="baja">Baja</option>
                        <option value="media">Media</option>
                        <option value="alta">Alta</option>
                    </select>
                    <select v-model="editForm.status" style="flex: 1; padding: 0.4rem;">
                        <option value="abierto">Abierto</option>
                        <option value="en_progreso">En progreso</option>
                        <option value="cerrado">Cerrado</option>
                    </select>
                </div>
                <div style="display: flex; gap: 0.5rem;">
                    <!-- Botón para guardar los cambios del ticket -->
                    <button @click="updateStatus(t.id)" :disabled="ticketStore.isLoading" style="padding: 0.4rem 0.8rem; background: #4caf50; color: white; border: none; cursor: pointer;" :style="ticketStore.isLoading ? 'opacity: 0.6; cursor: not-allowed;' : ''">
                        {{ ticketStore.isLoading ? "Guardando..." : "💾 Guardar" }}
                    </button>
                    <!-- Botón para cancelar y cerrar el panel de edición -->
                    <button @click="cancelEdit" :disabled="ticketStore.isLoading" style="padding: 0.4rem 0.8rem; background: #999; color: white; border: none; cursor: pointer;" :style="ticketStore.isLoading ? 'opacity: 0.6; cursor: not-allowed;' : ''">
                        Cancelar
                    </button>
                </div>
            </div>
        </div>

        <!-- Controles de paginación -->
        <div v-if="tickets.length > 0" style="display: flex; justify-content: space-between; align-items: center; margin-top: 1rem; padding: 0.5rem;">
            <button @click="prevPage" :disabled="pagination.page <= 1 || ticketStore.isLoading">Anterior</button>
            <span v-if="ticketStore.isLoading">Cargando...</span>
            <span v-else>Página {{ pagination.page }} de {{ pagination.totalPages }}</span>
            <button @click="nextPage" :disabled="!pagination.hasMore || ticketStore.isLoading">Siguiente</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth.store";
import { useTicketStore } from "../stores/ticket.store";

const router = useRouter();
const auth = useAuthStore();
const ticketStore = useTicketStore();

// Refs del formulario de crear ticket
const title = ref("");
const description = ref("");
const priority = ref("media");

// Mensajes de error para el formulario de crear ticket
const titleError = ref("");
const descriptionError = ref("");

// Estado para el panel de edición inline
const editingTicket = ref<number | null>(null);
const editForm = ref({ title: "", description: "", priority: "", status: "" });

// Mensajes de error para el formulario de edición
const editTitleError = ref("");
const editDescriptionError = ref("");

// Lista reactiva de tickets (se actualiza automáticamente desde el store)
const tickets = computed(() => ticketStore.tickets);

// Datos de paginación (page, limit, total, totalPages, hasMore)
const pagination = computed(() => ticketStore.pagination);

/** Formatea el estado para mostrar sin guiones: en_progreso -> En progreso */
const formatStatus = (status: string) => {
    return status.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
};

/** Formatea la prioridad para mostrar: baja -> Baja */
const formatPriority = (priority: string) => {
    return priority.charAt(0).toUpperCase() + priority.slice(1);
};

/** Cierra la sesión del usuario y redirige al login */
const logout = () => {
    auth.logout();
    router.push("/");
};

/** Crea un nuevo ticket y limpia el formulario */
const create = async () => {
    // Limpiar errores previos
    titleError.value = "";
    descriptionError.value = "";

    // Validar título
    if (!title.value.trim()) {
        titleError.value = "El título es obligatorio";
        return;
    }
    if (title.value.trim().length < 3) {
        titleError.value = "El título debe tener al menos 3 caracteres";
        return;
    }

    // Validar descripción
    if (!description.value.trim()) {
        descriptionError.value = "La descripción es obligatoria";
        return;
    }

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

/** Actualiza un ticket con los valores del formulario de edición */
const updateStatus = async (id: number) => {
    // Limpiar errores previos
    editTitleError.value = "";
    editDescriptionError.value = "";

    // Validar título
    if (!editForm.value.title.trim()) {
        editTitleError.value = "El título es obligatorio";
        return;
    }
    if (editForm.value.title.trim().length < 3) {
        editTitleError.value = "El título debe tener al menos 3 caracteres";
        return;
    }

    // Validar descripción
    if (!editForm.value.description.trim()) {
        editDescriptionError.value = "La descripción es obligatoria";
        return;
    }

    try {
        await ticketStore.updateTicket(id, {
            title: editForm.value.title,
            description: editForm.value.description,
            priority: editForm.value.priority,
            status: editForm.value.status,
        });
        alert("Ticket actualizado ✅");
        editingTicket.value = null;
    } catch (error) {
        alert("Error al actualizar ticket ❌");
    }
};

/** Abre el panel de edición y carga los datos actuales del ticket */
const toggleEdit = (ticket: any) => {
    editingTicket.value = ticket.id;
    editForm.value = {
        title: ticket.title,
        description: ticket.description,
        priority: ticket.priority,
        status: ticket.status,
    };
    // Limpiar errores al abrir
    editTitleError.value = "";
    editDescriptionError.value = "";
};

/** Cierra el panel de edición sin guardar cambios */
const cancelEdit = () => {
    editingTicket.value = null;
    editForm.value = { title: "", description: "", priority: "", status: "" };
    editTitleError.value = "";
    editDescriptionError.value = "";
};

/** Ir a la página anterior */
const prevPage = () => {
    if (pagination.value.page > 1) {
        ticketStore.fetchTickets(pagination.value.page - 1, pagination.value.limit);
    }
};

/** Ir a la página siguiente */
const nextPage = () => {
    if (pagination.value.hasMore) {
        ticketStore.fetchTickets(pagination.value.page + 1, pagination.value.limit);
    }
};

// Cargar tickets al montar el componente
onMounted(() => {
    ticketStore.fetchTickets();
});
</script>
