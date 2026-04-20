<template>
  <div class="dashboard">

    <!-- ── HEADER ─────────────────────────────────────── -->
    <header class="header">
      <div class="search-wrap">
        <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.35-4.35"/>
        </svg>
        <input class="search-input" v-model="searchQuery" type="text" placeholder="Buscar tickets, clientes o archivos..." />
      </div>
      <div class="header-right">
        <button class="icon-btn" title="Notificaciones">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          <span v-if="urgentTickets.length > 0" class="badge-notification">{{ urgentTickets.length }}</span>
        </button>
        <button class="icon-btn" title="Ayuda">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
            <circle cx="12" cy="12" r="10"/>
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </button>
        <button class="btn-logout" @click="logout" title="Cerrar sesión">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </button>
        <div class="user-chip" @click="showUserMenu = !showUserMenu">
          <div class="user-text">
            <span class="user-name">{{ auth.user?.email?.split('@')[0] || 'Usuario' }}</span>
            <span class="user-role">Última actividad: Ahora</span>
          </div>
          <div class="avatar">{{ (auth.user?.email?.[0] || 'U').toUpperCase() }}</div>
        </div>

        <!-- Dropdown de usuario -->
        <div v-if="showUserMenu" class="user-dropdown">
          <button @click="logout" class="dropdown-item">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Cerrar sesión
          </button>
        </div>
      </div>
    </header>

    <!-- ── STATS ROW ──────────────────────────────────── -->
    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-top">
          <span class="stat-label">SIN RESOLVER</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="14" height="14" class="stat-icon green">
            <rect x="3" y="3" width="18" height="18" rx="3"/>
            <path d="M9 9l6 6M15 9l-6 6"/>
          </svg>
        </div>
        <div class="stat-value">{{ unresolvedCount }}</div>
        <div class="stat-delta positive">+{{ calculateGrowth(unresolvedCount, previousStats.unresolved) }}%</div>
      </div>
      <div class="stat-card">
        <div class="stat-top">
          <span class="stat-label">PRIORIDAD ALTA</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="14" height="14" class="stat-icon red">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <div class="stat-value">{{ highPriorityCount }}</div>
        <div class="stat-sub">tickets críticos</div>
      </div>
      <div class="stat-card critical-card">
        <div class="stat-top">
          <span class="stat-label">CRÍTICOS</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="14" height="14" class="stat-icon green">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <div class="stat-value">{{ String(criticalCount).padStart(2, '0') }}</div>
        <div class="stat-sub">activos ahora</div>
      </div>
      <div class="stat-card">
        <div class="stat-top">
          <span class="stat-label">PRIORIDAD MEDIA</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="14" height="14" class="stat-icon amber">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <div class="stat-value">{{ mediumPriorityCount }}</div>
        <div class="stat-sub">tickets activos</div>
      </div>
    </div>

    <!-- ── MAIN CONTENT ───────────────────────────────── -->
    <div class="main-grid">

      <!-- LEFT: Active Stream -->
      <div class="stream-panel">
        <div class="panel-header">
          <h2 class="panel-title">Flujo Activo</h2>
          <div class="panel-actions">
            <button class="filter-btn" @click="showCreate = true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Nuevo
            </button>
            <div class="menu-container">
              <button class="filter-btn" @click.stop="showFilterMenu = !showFilterMenu">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
                </svg>
                Filtrar
                <svg v-if="filterPriority" class="filter-badge" viewBox="0 0 4 4" fill="currentColor">
                  <circle cx="2" cy="2" r="2"/>
                </svg>
              </button>
              <div v-if="showFilterMenu" class="filter-menu">
                <button @click="filterPriority = null; showFilterMenu = false" class="menu-item" :class="{ active: !filterPriority }">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Todos
                </button>
                <button @click="filterPriority = 'alta'; showFilterMenu = false" class="menu-item" :class="{ active: filterPriority === 'alta' }">
                  <span class="priority-dot dot-alta"></span>
                  Prioridad Alta
                </button>
                <button @click="filterPriority = 'media'; showFilterMenu = false" class="menu-item" :class="{ active: filterPriority === 'media' }">
                  <span class="priority-dot dot-media"></span>
                  Prioridad Media
                </button>
                <button @click="filterPriority = 'baja'; showFilterMenu = false" class="menu-item" :class="{ active: filterPriority === 'baja' }">
                  <span class="priority-dot dot-baja"></span>
                  Prioridad Baja
                </button>
              </div>
            </div>
            <div class="menu-container">
              <button class="filter-btn" @click.stop="showSortMenu = !showSortMenu">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <polyline points="19 12 12 19 5 12"/>
                </svg>
                Ordenar
              </button>
              <div v-if="showSortMenu" class="sort-menu">
                <button @click="sortBy = 'recent'; showSortMenu = false" class="menu-item" :class="{ active: sortBy === 'recent' }">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Mas Reciente
                </button>
                <button @click="sortBy = 'priority'; showSortMenu = false" class="menu-item" :class="{ active: sortBy === 'priority' }">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Mayor Prioridad
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Table header -->
        <div class="table-head">
          <span class="col-id">ID</span>
          <span class="col-subject">ASUNTO Y DESCRIPCIÓN</span>
          <span class="col-customer">CLIENTE</span>
          <span class="col-status">ESTADO</span>
          <span class="col-priority">PRIORIDAD</span>
          <span class="col-age">TIEMPO</span>
          <span class="col-actions"></span>
        </div>

        <!-- Loading state -->
        <div v-if="ticketStore.isLoading && tickets.length === 0" class="empty-state">
          <div class="spinner"></div>
          <p>Cargando tickets...</p>
        </div>

        <!-- Empty state -->
        <div v-else-if="filteredTickets.length === 0" class="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="36" height="36" style="opacity:0.3">
            <rect x="3" y="3" width="18" height="18" rx="3"/>
            <line x1="3" y1="9" x2="21" y2="9"/>
            <line x1="9" y1="21" x2="9" y2="9"/>
          </svg>
          <p v-if="searchQuery">No se encontraron resultados para "{{ searchQuery }}"</p>
          <p v-else>No hay tickets aún</p>
        </div>

        <!-- Ticket rows -->
        <div v-for="t in filteredTickets" :key="t.id" class="ticket-row" :class="{ 
          'editing': editingTicket === t.id,
          'row-critical': t.priority === 'alta' && t.status !== 'cerrado'
        }">
          <div class="row-main">
            <span class="col-id ticket-id">#{{ String(t.id).padStart(3, '0') }}</span>
            <span class="col-subject">
              <span class="ticket-title">{{ t.title }}</span>
              <span class="ticket-desc">{{ truncate(t.description, 80) }}</span>
            </span>
            <span class="col-customer">
              <span class="customer-name">{{ t.user?.name || 'Cliente' }}</span>
            </span>
            <span class="col-status">
              <span class="badge" :class="'badge-' + t.status">{{ formatStatus(t.status) }}</span>
            </span>
            <span class="col-priority">
              <span class="priority-dot" :class="'dot-' + t.priority"></span>
            </span>
            <span class="col-age">
              <span class="age-text">{{ formatTime(t.createdAt) }}</span>
            </span>
            <span class="col-actions">
              <div class="action-buttons">
                <button 
                  class="btn-edit-ticket" 
                  @click="toggleEdit(t)" 
                  :title="editingTicket === t.id ? 'Cerrar' : 'Editar'"
                >
                  <svg v-if="editingTicket !== t.id" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                  <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
                <button 
                  class="btn-delete-ticket" 
                  @click="deleteTicket(t.id)" 
                  :disabled="ticketStore.isLoading"
                  title="Eliminar"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    <line x1="10" y1="11" x2="10" y2="17"/>
                    <line x1="14" y1="11" x2="14" y2="17"/>
                  </svg>
                </button>
              </div>
            </span>
          </div>

          <!-- Edit panel -->
          <div v-if="editingTicket === t.id" class="edit-panel">
            <div class="edit-grid">
              <div class="field-group">
                <label class="field-label">Título</label>
                <input class="field-input" v-model="editForm.title" placeholder="Título del ticket" />
                <p v-if="editTitleError" class="field-error">{{ editTitleError }}</p>
              </div>
              <div class="field-group">
                <label class="field-label">Descripción</label>
                <input class="field-input" v-model="editForm.description" placeholder="Descripción" />
                <p v-if="editDescriptionError" class="field-error">{{ editDescriptionError }}</p>
              </div>
              <div class="field-group">
                <label class="field-label">Prioridad</label>
                <select class="field-select" v-model="editForm.priority">
                  <option value="baja">Baja</option>
                  <option value="media">Media</option>
                  <option value="alta">Alta</option>
                </select>
              </div>
              <div class="field-group">
                <label class="field-label">Estado</label>
                <select class="field-select" v-model="editForm.status">
                  <option value="abierto">Abierto</option>
                  <option value="en_progreso">En progreso</option>
                  <option value="cerrado">Cerrado</option>
                </select>
              </div>
            </div>
            <div class="edit-actions">
              <button class="btn-save" @click="updateStatus(t.id)" :disabled="ticketStore.isLoading">
                {{ ticketStore.isLoading ? 'Guardando...' : 'Guardar cambios' }}
              </button>
              <button class="btn-cancel" @click="cancelEdit" :disabled="ticketStore.isLoading">Cancelar</button>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="filteredTickets.length > 0" class="pagination">
          <span class="page-info">Mostrando 1–{{ filteredTickets.length }} de {{ pagination.total }} tickets</span>
          <div class="page-controls">
            <button class="page-btn" @click="prevPage" :disabled="pagination.page <= 1 || ticketStore.isLoading">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </button>
            <span class="page-num active">{{ pagination.page }}</span>
            <button class="page-btn" @click="nextPage" :disabled="!pagination.hasMore || ticketStore.isLoading">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- RIGHT: Charts + Alerts -->
      <div class="right-col">

        <!-- Support Velocity - Tickets Cerrados por Día -->
        <div class="widget-card">
          <div class="widget-header">
            <h3 class="widget-title">Tickets Cerrados por Día</h3>
            <div class="legend">
              <span class="legend-dot resolved"></span>
              <span class="legend-text">Tickets</span>
            </div>
          </div>
          <div class="chart">
            <div class="chart-bars">
              <div v-for="(bar, i) in chartData" :key="i" class="bar-group">
                <div class="bar resolved-bar" :style="{ height: bar.count + 'px' }" :title="bar.originalCount + ' tickets cerrados'"></div>
              </div>
            </div>
            <div class="chart-axis">
              <span v-for="(label, i) in chartLabels" :key="i" class="axis-label">{{ label }}</span>
            </div>
          </div>
        </div>

        <!-- Urgent Alerts -->
        <div class="widget-card alerts-card">
          <div class="widget-header">
            <h3 class="widget-title">Alertas Urgentes</h3>
          </div>
          <div v-if="urgentTickets.length === 0" class="no-alerts">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="24" height="24" style="opacity:0.4">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <p>Sin alertas críticas</p>
          </div>
          <div v-for="t in urgentTickets" :key="t.id" class="alert-item">
            <div class="alert-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <div class="alert-body">
              <p class="alert-title">{{ t.title }}</p>
              <p class="alert-sub">#{{ String(t.id).padStart(3,'0') }} — {{ formatStatus(t.status) }}</p>
            </div>
          </div>
          <button v-if="urgentTickets.length > 0" class="audit-btn">Ver Registro</button>
        </div>

      </div>
    </div>

    <!-- ── MODAL: CREAR TICKET ─────────────────────────── -->
    <transition name="fade">
      <div v-if="showCreate" class="modal-overlay" @click.self="showCreate = false">
        <div class="modal">
          <div class="modal-header">
            <h2 class="modal-title">Nuevo Ticket</h2>
            <button class="icon-btn modal-close" @click="showCreate = false">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <div class="field-group">
              <label class="field-label">Título <span class="required">*</span></label>
              <input class="field-input" v-model="title" placeholder="Ej: Error de conexión a base de datos" />
              <p v-if="titleError" class="field-error">{{ titleError }}</p>
            </div>
            <div class="field-group">
              <label class="field-label">Descripción <span class="required">*</span></label>
              <textarea class="field-input field-textarea" v-model="description" placeholder="Describe el problema en detalle..." rows="4"></textarea>
              <p v-if="descriptionError" class="field-error">{{ descriptionError }}</p>
            </div>
            <div class="field-group">
              <label class="field-label">Prioridad</label>
              <select class="field-select" v-model="priority">
                <option value="baja">Baja</option>
                <option value="media">Media</option>
                <option value="alta">Alta</option>
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-cancel" @click="showCreate = false">Cancelar</button>
            <button class="btn-save" @click="create" :disabled="ticketStore.isLoading">
              {{ ticketStore.isLoading ? 'Creando...' : 'Crear Ticket' }}
            </button>
          </div>
        </div>
      </div>
    </transition>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth.store";
import { useTicketStore } from "../stores/ticket.store";

const router = useRouter();
const auth = useAuthStore();
const ticketStore = useTicketStore();

// ── Estado UI ───────────────────────────────────────────
const searchQuery = ref("");
const showUserMenu = ref(false);
const showFilterMenu = ref(false);
const showSortMenu = ref(false);
const filterPriority = ref<string | null>(null);
const sortBy = ref<'recent' | 'priority'>('recent');
const previousStats = ref({
  unresolved: 100,
  critical: 5
});

// ── Formulario crear ───────────────────────────────────
const title = ref("");
const description = ref("");
const priority = ref("media");
const titleError = ref("");
const descriptionError = ref("");
const showCreate = ref(false);

// ── Formulario editar ──────────────────────────────────
const editingTicket = ref<number | null>(null);
const editForm = ref({ title: "", description: "", priority: "", status: "" });
const editTitleError = ref("");
const editDescriptionError = ref("");

// ── Computed ───────────────────────────────────────────
const tickets = computed(() => ticketStore.tickets);
const pagination = computed(() => ticketStore.pagination);

// Estadísticas reales calculadas
const unresolvedCount = computed(() => 
  tickets.value.filter(t => t.status !== 'cerrado').length
);

const criticalCount = computed(() => 
  tickets.value.filter(t => t.priority === 'alta' && t.status !== 'cerrado').length
);

const highPriorityCount = computed(() => 
  tickets.value.filter(t => t.priority === 'alta').length
);

const mediumPriorityCount = computed(() => 
  tickets.value.filter(t => t.priority === 'media').length
);

const urgentTickets = computed(() => 
  tickets.value
    .filter(t => t.priority === 'alta' && t.status !== 'cerrado')
    .slice(0, 3)
);

// Calcular crecimiento porcentual
const calculateGrowth = (current: number, previous: number) => {
  if (previous === 0) return 100;
  const growth = ((current - previous) / previous * 100).toFixed(0);
  return Math.abs(Number(growth));
};

const filteredTickets = computed(() => {
  let result = tickets.value;

  // Aplicar búsqueda
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(t => 
      t.title.toLowerCase().includes(query) ||
      t.description.toLowerCase().includes(query) ||
      t.user?.name?.toLowerCase().includes(query)
    );
  }

  // Aplicar filtro de prioridad
  if (filterPriority.value) {
    result = result.filter(t => t.priority === filterPriority.value);
  }

  // Aplicar ordenamiento
  if (sortBy.value === 'recent') {
    result = result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } else if (sortBy.value === 'priority') {
    const priorityOrder = { alta: 0, media: 1, baja: 2 };
    result = result.sort((a, b) => (priorityOrder[a.priority as keyof typeof priorityOrder] || 3) - (priorityOrder[b.priority as keyof typeof priorityOrder] || 3));
  }

  return result;
});

// ── Chart data - Tickets CERRADOS por día ──────────────
const chartLabels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

const chartData = computed(() => {
  // Agrupar tickets CERRADOS por día de la semana
  const ticketsByDay = Array(7).fill(0);
  
  tickets.value.forEach(ticket => {
    // Solo contar tickets CERRADOS
    if (ticket.status === 'cerrado') {
      const date = new Date(ticket.createdAt);
      const dayOfWeek = date.getDay(); // 0 = Domingo, 1 = Lunes, etc.
      const index = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Convertir a 0-6 (Lun-Dom)
      ticketsByDay[index]++;
    }
  });
  
  // Si no hay tickets cerrados, mostrar datos de ejemplo
  if (ticketsByDay.every(count => count === 0)) {
    return chartLabels.map(() => ({
      count: Math.floor(Math.random() * 6) + 1,
      originalCount: Math.floor(Math.random() * 6) + 1
    }));
  }
  
  // Normalizar alturas (máximo 100px)
  const maxCount = Math.max(...ticketsByDay, 1);
  return ticketsByDay.map(count => ({
    count: (count / maxCount) * 100,
    originalCount: count
  }));
});

// ── Helpers ───────────────────────────────────────────
const formatStatus = (status: string) => {
  const map: Record<string, string> = {
    abierto: 'Abierto',
    en_progreso: 'En progreso',
    cerrado: 'Cerrado'
  };
  return map[status] || status;
};

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `hace ${days}d`;
  if (hours > 0) return `hace ${hours}h`;
  if (minutes > 0) return `hace ${minutes}m`;
  return 'ahora';
};

const truncate = (text: string, length: number) =>
  text.length > length ? text.substring(0, length) + "..." : text;

// ── Acciones ───────────────────────────────────────────
const logout = () => { 
  auth.logout(); 
  router.push("/"); 
};

const create = async () => {
  titleError.value = "";
  descriptionError.value = "";

  if (!title.value.trim()) { 
    titleError.value = "El título es obligatorio"; 
    return; 
  }
  if (title.value.trim().length < 3) { 
    titleError.value = "Mínimo 3 caracteres"; 
    return; 
  }
  if (!description.value.trim()) { 
    descriptionError.value = "La descripción es obligatoria"; 
    return; 
  }

  try {
    await ticketStore.createTicket(title.value, description.value, priority.value);
    title.value = "";
    description.value = "";
    showCreate.value = false;
  } catch {
    titleError.value = "Error al crear ticket";
  }
};

const updateStatus = async (id: number) => {
  editTitleError.value = "";
  editDescriptionError.value = "";

  if (!editForm.value.title.trim()) { 
    editTitleError.value = "El título es obligatorio"; 
    return; 
  }
  if (editForm.value.title.trim().length < 3) { 
    editTitleError.value = "Mínimo 3 caracteres"; 
    return; 
  }
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
    editingTicket.value = null;
  } catch {
    editTitleError.value = "Error al actualizar";
  }
};

const toggleEdit = (ticket: any) => {
  if (editingTicket.value === ticket.id) { 
    cancelEdit(); 
    return; 
  }
  editingTicket.value = ticket.id;
  editForm.value = { 
    title: ticket.title, 
    description: ticket.description, 
    priority: ticket.priority, 
    status: ticket.status 
  };
  editTitleError.value = "";
  editDescriptionError.value = "";
};

const cancelEdit = () => {
  editingTicket.value = null;
  editForm.value = { title: "", description: "", priority: "", status: "" };
  editTitleError.value = "";
  editDescriptionError.value = "";
};

const deleteTicket = async (id: number) => {
  if (!confirm("¿Está seguro de que desea eliminar este ticket?")) return;
  
  try {
    await ticketStore.deleteTicket(id);
  } catch {
    alert("Error al eliminar el ticket");
  }
};

const prevPage = () => {
  if (pagination.value.page > 1)
    ticketStore.fetchTickets(pagination.value.page - 1, pagination.value.limit);
};

const nextPage = () => {
  if (pagination.value.hasMore)
    ticketStore.fetchTickets(pagination.value.page + 1, pagination.value.limit);
};

// Cerrar menus al hacer click fuera
const closeMenus = (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  if (!target.closest('.user-chip') && !target.closest('.user-dropdown')) {
    showUserMenu.value = false;
  }
  if (!target.closest('.filter-btn') && !target.closest('.filter-menu')) {
    showFilterMenu.value = false;
  }
  if (!target.closest('.filter-btn') && !target.closest('.sort-menu')) {
    showSortMenu.value = false;
  }
};

onMounted(() => { 
  ticketStore.fetchTickets();
  document.addEventListener('click', closeMenus);
});

onUnmounted(() => {
  document.removeEventListener('click', closeMenus);
});
</script>

<style scoped>
/* ── RESET & ROOT ───────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.dashboard {
  --bg-darkest:    #0a0f1c;
  --bg-darker:     #0f1724;
  --bg-dark:       #151e2e;
  --bg-card:       #1a2438;
  --bg-elevated:   #1f2a40;
  --bg-input:      #0f1724;
  --border:        #253047;
  --border-soft:   #1e293b;
  --accent:        #10b981;
  --accent-glow:   rgba(16, 185, 129, 0.15);
  --accent-bg:     rgba(16, 185, 129, 0.1);
  --text-primary:  #e2e8f0;
  --text-secondary:#94a3b8;
  --text-muted:    #64748b;
  --red:           #ef4444;
  --red-bg:        rgba(239, 68, 68, 0.1);
  --amber:         #f59e0b;
  --amber-bg:      rgba(245, 158, 11, 0.1);
  --blue:          #3b82f6;
  --blue-bg:       rgba(59, 130, 246, 0.1);

  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background: var(--bg-darkest);
  color: var(--text-primary);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* ── HEADER ─────────────────────────────────────────── */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom: 1px solid var(--border);
  background: var(--bg-darker);
}

.search-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--bg-input);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 8px 12px;
  width: 420px;
  transition: all 0.2s ease;
}
.search-wrap:focus-within { 
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-glow);
}
.search-icon { 
  color: var(--text-muted); 
  flex-shrink: 0;
  width: 16px;
  height: 16px;
}
.search-input {
  background: transparent;
  border: none;
  outline: none;
  color: var(--text-primary);
  font-family: inherit;
  font-size: 13px;
  width: 100%;
}
.search-input::placeholder { 
  color: var(--text-muted); 
}

.header-right { 
  display: flex; 
  align-items: center; 
  gap: 10px; 
  position: relative;
}

.icon-btn {
  position: relative;
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text-secondary);
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;
}
.icon-btn:hover { 
  border-color: var(--accent); 
  color: var(--accent);
  background: var(--accent-bg);
}

.btn-logout {
  background: transparent;
  border: 1px solid var(--red);
  color: var(--red);
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;
}
.btn-logout:hover { 
  background: var(--red);
  color: white;
}

.badge-notification {
  position: absolute;
  top: -4px;
  right: -4px;
  background: var(--red);
  color: white;
  font-size: 10px;
  font-weight: 600;
  min-width: 16px;
  height: 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 3px;
}

.user-chip {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 12px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 8px;
  margin-left: 8px;
  cursor: pointer;
  transition: all 0.15s ease;
}
.user-chip:hover { 
  border-color: var(--accent);
  background: var(--bg-elevated);
}

.user-text { 
  display: flex; 
  flex-direction: column; 
  align-items: flex-end; 
}
.user-name { 
  font-size: 13px; 
  font-weight: 600; 
  color: var(--text-primary); 
  line-height: 1.2; 
}
.user-role { 
  font-size: 11px; 
  color: var(--text-muted); 
}
.avatar {
  width: 32px;
  height: 32px;
  background: var(--accent-bg);
  border: 1px solid var(--accent);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  color: var(--accent);
}

.user-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 180px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 8px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
  z-index: 100;
  overflow: hidden;
  animation: slideDown 0.15s ease;
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
}

.dropdown-item {
  width: 100%;
  padding: 10px 14px;
  background: transparent;
  border: none;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.15s ease;
  font-size: 13px;
  font-family: inherit;
  text-align: left;
}
.dropdown-item:hover { 
  background: var(--bg-elevated);
  color: var(--red);
}

/* ── STATS ──────────────────────────────────────────── */
.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1px;
  background: var(--border);
  border-bottom: 1px solid var(--border);
}

.stat-card {
  background: var(--bg-darker);
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.critical-card { 
  background: var(--bg-card);
  border: 1px solid var(--accent);
}

.stat-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.stat-label { 
  font-size: 11px; 
  letter-spacing: 0.05em; 
  color: var(--text-muted); 
  font-weight: 500;
  text-transform: uppercase;
}
.stat-icon { 
  color: var(--text-muted);
}
.stat-icon.green { color: var(--accent); }
.stat-icon.red { color: var(--red); }
.stat-icon.amber { color: var(--amber); }

.stat-value { 
  font-size: 28px; 
  font-weight: 600; 
  color: var(--text-primary); 
  line-height: 1;
}
.critical-card .stat-value { 
  color: var(--accent);
}

.stat-delta { 
  font-size: 12px; 
  font-weight: 500;
  margin-top: 2px;
}
.stat-delta.positive { color: var(--accent); }
.stat-delta.negative { color: var(--red); }
.stat-sub { 
  font-size: 11px; 
  color: var(--text-muted); 
}

/* ── MAIN GRID ──────────────────────────────────────── */
.main-grid {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 0;
  flex: 1;
}

/* ── STREAM PANEL ───────────────────────────────────── */
.stream-panel {
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  background: var(--bg-darker);
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--border);
}
.panel-title { 
  font-size: 16px; 
  font-weight: 600; 
  color: var(--text-primary);
}
.panel-actions { display: flex; gap: 8px; }

.filter-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  color: var(--text-secondary);
  font-size: 12px;
  font-family: inherit;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
  position: relative;
}
.filter-btn:hover { 
  border-color: var(--accent); 
  color: var(--accent);
}

.filter-badge {
  width: 6px;
  height: 6px;
  margin-left: 4px;
  color: var(--accent);
}

.menu-container {
  position: relative;
  display: inline-block;
}

.filter-menu,
.sort-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 6px;
  min-width: 180px;
  margin-top: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 100;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 10px 12px;
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 12px;
  font-family: inherit;
  text-align: left;
  cursor: pointer;
  transition: all 0.15s ease;
}
.menu-item:first-child {
  border-radius: 6px 6px 0 0;
}
.menu-item:last-child {
  border-radius: 0 0 6px 6px;
}
.menu-item:hover {
  background: var(--bg-elevated);
  color: var(--accent);
}
.menu-item.active {
  background: var(--accent-bg);
  color: var(--accent);
}
.menu-item svg {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}

/* ── TABLE ──────────────────────────────────────────── */
.table-head {
  display: grid;
  grid-template-columns: 70px 1.5fr 140px 110px 70px 70px 50px;
  padding: 12px 24px;
  border-bottom: 1px solid var(--border);
  font-size: 11px;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  font-weight: 600;
  text-transform: uppercase;
  background: var(--bg-card);
}

.ticket-row {
  border-bottom: 1px solid var(--border-soft);
  transition: background 0.15s ease;
}
.ticket-row:hover { 
  background: var(--bg-card); 
}
.ticket-row.editing { 
  background: var(--bg-elevated);
}
.ticket-row.row-critical {
  background: var(--red-bg);
}
.ticket-row.row-critical:hover {
  background: rgba(239, 68, 68, 0.15);
}

.row-main {
  display: grid;
  grid-template-columns: 70px 1.5fr 140px 110px 70px 70px 50px;
  align-items: center;
  padding: 16px 24px;
  gap: 8px;
}

.col-subject { min-width: 0; }
.col-priority { display: flex; justify-content: center; }
.col-actions { 
  display: flex; 
  justify-content: flex-end;
  align-items: center;
}

.action-buttons {
  display: flex;
  gap: 6px;
  align-items: center;
}

.btn-edit-ticket {
  background: var(--bg-card);
  border: 1px solid var(--border);
  color: var(--text-secondary);
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;
}
.btn-edit-ticket:hover { 
  border-color: var(--blue); 
  color: var(--blue);
  background: var(--blue-bg);
  transform: translateY(-2px);
}

.btn-delete-ticket {
  background: var(--bg-card);
  border: 1px solid var(--border);
  color: var(--text-secondary);
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;
}
.btn-delete-ticket:hover { 
  border-color: var(--red); 
  color: var(--red);
  background: var(--red-bg);
  transform: translateY(-2px);
}
.btn-delete-ticket:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.ticket-id {
  font-family: 'SF Mono', Monaco, monospace;
  font-size: 12px;
  color: var(--text-muted);
  font-weight: 500;
}

.ticket-title {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 4px;
}
.ticket-desc {
  display: block;
  font-size: 12px;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.customer-name {
  font-size: 12px;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 6px;
}
.customer-name::before {
  content: '';
  width: 6px;
  height: 6px;
  background: var(--accent);
  border-radius: 50%;
  display: inline-block;
}

/* Badges */
.badge {
  display: inline-flex;
  align-items: center;
  font-size: 11px;
  padding: 4px 10px;
  border-radius: 12px;
  font-weight: 500;
  white-space: nowrap;
}
.badge-abierto { 
  background: var(--blue-bg); 
  color: var(--blue);
}
.badge-en_progreso { 
  background: var(--amber-bg); 
  color: var(--amber);
}
.badge-cerrado { 
  background: var(--accent-bg); 
  color: var(--accent);
}

/* Priority */
.priority-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
.dot-alta   { 
  background: var(--red);
  box-shadow: 0 0 8px rgba(239, 68, 68, 0.4);
}
.dot-media  { 
  background: var(--amber);
}
.dot-baja   { 
  background: var(--text-muted);
}

.age-text {
  font-size: 12px;
  color: var(--text-muted);
}

/* ── EDIT PANEL ─────────────────────────────────────── */
.edit-panel {
  padding: 20px 24px;
  background: var(--bg-elevated);
  border-top: 1px solid var(--border);
}
.edit-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-bottom: 16px;
}
.edit-actions { 
  display: flex; 
  gap: 10px;
  justify-content: flex-end;
}

/* ── FIELDS ─────────────────────────────────────────── */
.field-group { 
  display: flex; 
  flex-direction: column; 
  gap: 6px; 
}
.field-label { 
  font-size: 11px; 
  letter-spacing: 0.05em; 
  color: var(--text-muted); 
  font-weight: 600;
  text-transform: uppercase;
}
.required { color: var(--red); margin-left: 2px; }

.field-input, .field-select {
  background: var(--bg-input);
  border: 1px solid var(--border);
  color: var(--text-primary);
  font-family: inherit;
  font-size: 13px;
  padding: 10px 12px;
  border-radius: 6px;
  outline: none;
  transition: all 0.15s ease;
  width: 100%;
}
.field-input:focus, .field-select:focus { 
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-glow);
}
.field-input::placeholder { color: var(--text-muted); }
.field-select option { 
  background: var(--bg-input);
  color: var(--text-primary);
}
.field-error { 
  font-size: 11px; 
  color: var(--red);
}
.field-textarea {
  resize: vertical;
  min-height: 80px;
}

/* ── BUTTONS ─────────────────────────────────────────── */
.btn-save {
  background: var(--accent);
  color: white;
  border: none;
  font-family: inherit;
  font-size: 13px;
  font-weight: 600;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
}
.btn-save:disabled { 
  opacity: 0.5; 
  cursor: not-allowed; 
}
.btn-save:hover:not(:disabled) { 
  background: #059669;
}

.btn-cancel {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text-secondary);
  font-family: inherit;
  font-size: 13px;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
}
.btn-cancel:hover { 
  border-color: var(--text-secondary);
  background: var(--bg-card);
}

/* ── PAGINATION ─────────────────────────────────────── */
.pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-top: 1px solid var(--border);
  margin-top: auto;
  background: var(--bg-card);
}
.page-info { 
  font-size: 12px; 
  color: var(--text-muted);
}
.page-controls { 
  display: flex; 
  align-items: center; 
  gap: 4px; 
}
.page-btn {
  background: var(--bg-card);
  border: 1px solid var(--border);
  color: var(--text-secondary);
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;
}
.page-btn:disabled { 
  opacity: 0.3; 
  cursor: not-allowed; 
}
.page-btn:hover:not(:disabled) { 
  border-color: var(--accent); 
  color: var(--accent);
}
.page-num {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: var(--text-secondary);
  border-radius: 6px;
}
.page-num.active { 
  background: var(--accent);
  color: white;
  font-weight: 600;
}

/* ── EMPTY / LOADING ────────────────────────────────── */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  padding: 60px 24px;
  color: var(--text-muted);
  font-size: 13px;
  text-align: center;
}
.spinner {
  width: 28px;
  height: 28px;
  border: 2px solid var(--border);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { 
  to { transform: rotate(360deg); } 
}

/* ── RIGHT COL ──────────────────────────────────────── */
.right-col {
  display: flex;
  flex-direction: column;
  gap: 0;
  background: var(--bg-darker);
}

.widget-card {
  padding: 20px;
  border-bottom: 1px solid var(--border);
}
.widget-card:last-child {
  border-bottom: none;
}

.widget-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
.widget-title { 
  font-size: 14px; 
  font-weight: 600; 
  color: var(--text-primary);
}

.legend { 
  display: flex; 
  align-items: center; 
  gap: 6px;
  font-size: 11px;
}
.legend-dot { 
  width: 8px; 
  height: 8px; 
  border-radius: 2px; 
}
.legend-dot.resolved { 
  background: var(--accent);
}
.legend-dot.incoming { 
  background: var(--text-muted);
}
.legend-text { 
  color: var(--text-muted);
}

/* Chart */
.chart-bars {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  height: 110px;
  margin-bottom: 12px;
  padding: 0 4px;
}
.bar-group { 
  display: flex; 
  gap: 3px; 
  align-items: flex-end; 
  flex: 1;
  height: 100%;
}
.bar { 
  border-radius: 3px 3px 0 0; 
  min-height: 4px; 
  transition: height 0.4s ease;
}
.resolved-bar { 
  background: var(--accent); 
  flex: 1;
  opacity: 0.9;
}
.incoming-bar { 
  background: var(--text-muted); 
  flex: 1; 
  opacity: 0.4;
}
.chart-axis { 
  display: flex; 
  justify-content: space-between; 
}
.axis-label { 
  font-size: 10px; 
  color: var(--text-muted);
  flex: 1; 
  text-align: center;
}

/* Alerts */
.alerts-card {
  background: var(--bg-card);
}

.no-alerts {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 30px 0;
  color: var(--text-muted);
  font-size: 12px;
}

.alert-item {
  display: flex;
  gap: 10px;
  padding: 12px;
  background: var(--red-bg);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 8px;
  margin-bottom: 10px;
}
.alert-item:last-of-type { 
  margin-bottom: 0;
}

.alert-icon {
  width: 28px;
  height: 28px;
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--red);
  flex-shrink: 0;
}

.alert-body { 
  flex: 1; 
  min-width: 0; 
}
.alert-title { 
  font-size: 12px; 
  font-weight: 600; 
  color: var(--text-primary);
  margin-bottom: 3px;
}
.alert-sub { 
  font-size: 11px; 
  color: var(--text-muted);
}

.audit-btn {
  margin-top: 14px;
  width: 100%;
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text-secondary);
  font-family: inherit;
  font-size: 12px;
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
}
.audit-btn:hover { 
  border-color: var(--accent); 
  color: var(--accent);
}

/* ── MODAL ──────────────────────────────────────────── */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(10, 15, 28, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  backdrop-filter: blur(6px);
}

.modal {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  width: 520px;
  max-width: 92vw;
  box-shadow: 0 24px 80px rgba(0,0,0,0.7);
  animation: modalIn 0.2s ease;
}

@keyframes modalIn {
  from { 
    opacity: 0; 
    transform: scale(0.97) translateY(8px);
  }
  to { 
    opacity: 1; 
    transform: scale(1) translateY(0);
  }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border-bottom: 1px solid var(--border);
}
.modal-title { 
  font-size: 16px; 
  font-weight: 600;
  color: var(--text-primary);
}
.modal-close {
  width: 32px;
  height: 32px;
}

.modal-body { 
  padding: 20px; 
  display: flex; 
  flex-direction: column; 
  gap: 16px; 
}
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 20px;
  border-top: 1px solid var(--border);
  background: var(--bg-elevated);
}

/* ── TRANSITION ─────────────────────────────────────── */
.fade-enter-active, .fade-leave-active { 
  transition: opacity 0.2s ease; 
}
.fade-enter-active .modal, .fade-leave-active .modal { 
  transition: transform 0.2s ease, opacity 0.2s ease; 
}
.fade-enter-from, .fade-leave-to { 
  opacity: 0; 
}
.fade-enter-from .modal, .fade-leave-to .modal { 
  transform: scale(0.97) translateY(8px);
  opacity: 0;
}

/* ── RESPONSIVE ─────────────────────────────────────── */
@media (max-width: 1100px) {
  .main-grid {
    grid-template-columns: 1fr;
  }
  .stream-panel {
    border-right: none;
    border-bottom: 1px solid var(--border);
  }
  .stats-row {
    grid-template-columns: repeat(2, 1fr);
  }
  .search-wrap {
    width: 300px;
  }
}

@media (max-width: 768px) {
  .header {
    padding: 12px 16px;
    flex-wrap: wrap;
    gap: 12px;
  }
  .search-wrap {
    width: 100%;
    order: 3;
  }
  .stats-row {
    grid-template-columns: 1fr 1fr;
  }
  .table-head,
  .row-main {
    grid-template-columns: 60px 1fr 90px 70px 60px 40px;
  }
  .col-customer {
    display: none;
  }
  .edit-grid {
    grid-template-columns: 1fr;
  }
  .modal {
    width: 95vw;
  }
}

@media (max-width: 480px) {
  .panel-header {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
  .panel-actions {
    justify-content: flex-end;
  }
  .table-head,
  .row-main {
    grid-template-columns: 50px 1fr 70px 50px 40px;
  }
  .col-status,
  .col-priority {
    display: none;
  }
  .pagination {
    flex-direction: column;
    gap: 12px;
  }
}
</style>
