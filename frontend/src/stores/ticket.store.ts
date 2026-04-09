import { defineStore } from "pinia";
import { api } from "../api/api";

export const useTicketStore = defineStore("tickets", {
    state: () => ({
        tickets: [] as any[],
    }),

    actions: {
        async fetchTickets() {
        const res = await api.get("/api/tickets");
        this.tickets = res.data;
        },

        async createTicket(title: string, description: string, priority: string) {
        await api.post("/api/tickets", {
            title,
            description,
            priority,
        });

        await this.fetchTickets();
        },
    },
    });