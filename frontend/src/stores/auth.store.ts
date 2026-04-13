import { defineStore } from "pinia";
import { api } from "../api/api";

export const useAuthStore = defineStore("auth", {
    state: () => ({
        user: JSON.parse(localStorage.getItem("user") || "null"),
        token: localStorage.getItem("token") || "",
    }),

    actions: {
        async login(email: string, password: string) {
        const res = await api.post("/api/users/login", {
            email,
            password,
        });

        // Guardar access token en localStorage
        this.token = res.data.accessToken;
        this.user = res.data.user;

        localStorage.setItem("token", this.token);
        // Guardar refresh token en localStorage
        localStorage.setItem("refreshToken", res.data.refreshToken);
        localStorage.setItem("user", JSON.stringify(this.user));
        },

        logout() {
        this.token = "";
        this.user = null;
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        },
    },
    });