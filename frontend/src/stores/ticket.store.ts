import { defineStore } from "pinia";
import { api } from "../api/api";

export const useTicketStore = defineStore("tickets", {
    state: () => ({
        tickets: [] as any[],
        pagination: {
            page: 1,
            limit: 10,
            total: 0,
            totalPages: 0,
            hasMore: false,
        },
        isLoading: false,
    }),

    actions: {
        async fetchTickets(page = 1, limit = 10) {
        this.isLoading = true;
        try {
            const res = await api.get("/api/tickets", {
                params: { page, limit },
            });
            this.tickets = res.data.tickets;
            this.pagination = res.data;
        } finally {
            this.isLoading = false;
        }
        },

        async createTicket(title: string, description: string, priority: string) {
        this.isLoading = true;
        try {
            await api.post("/api/tickets", {
                title,
                description,
                priority,
            });
        } finally {
            this.isLoading = false;
            await this.fetchTickets(this.pagination.page, this.pagination.limit);
        }
        },

        async updateTicket(id: number, data: { title?: string; description?: string; priority?: string; status?: string }) {
        this.isLoading = true;
        try {
            await api.put(`/api/tickets/${id}`, data);
        } finally {
            this.isLoading = false;
            await this.fetchTickets(this.pagination.page, this.pagination.limit);
        }
        },

        async deleteTicket(id: number) {
        this.isLoading = true;
        try {
            await api.delete(`/api/tickets/${id}`);
        } finally {
            this.isLoading = false;
            await this.fetchTickets(this.pagination.page, this.pagination.limit);
        }
        },
    },
    });