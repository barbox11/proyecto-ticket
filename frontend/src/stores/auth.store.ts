import { defineStore } from "pinia";
import { api } from "../api/api";

export const useAuthStore = defineStore("auth", {
    state: () => ({
        user: null as any,
        token: localStorage.getItem("token") || "",
    }),

    actions: {
        async login(email: string, password: string) {
        const res = await api.post("/api/users/login", {
            email,
            password,
        });

        this.token = res.data.token;
        this.user = res.data.user;

        localStorage.setItem("token", this.token);
        },

        logout() {
        this.token = "";
        this.user = null;
        localStorage.removeItem("token");
        },
    },
    });