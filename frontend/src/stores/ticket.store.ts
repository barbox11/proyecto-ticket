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
    }),

    actions: {
        async fetchTickets(page = 1, limit = 10) {
        const res = await api.get("/api/tickets", {
            params: { page, limit },
        });
        this.tickets = res.data.tickets;
        this.pagination = res.data;
        },

        async createTicket(title: string, description: string, priority: string) {
        await api.post("/api/tickets", {
            title,
            description,
            priority,
        });

        await this.fetchTickets(this.pagination.page, this.pagination.limit);
        },

        async updateTicket(id: number, data: { title?: string; description?: string; priority?: string; status?: string }) {
        await api.put(`/api/tickets/${id}`, data);
        await this.fetchTickets(this.pagination.page, this.pagination.limit);
        },
    },
    });