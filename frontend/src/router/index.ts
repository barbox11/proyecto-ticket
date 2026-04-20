import { createRouter, createWebHistory } from "vue-router";

import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import DashboardView from "../views/DashboardView.vue";
import ForgotPasswordView from "../views/ForgotPasswordView.vue";
import ResetPasswordView from "../views/ResetPasswordView.vue";

const routes = [
    { path: "/", component: LoginView },
    { path: "/register", component: RegisterView },
    { path: "/forgot-password", component: ForgotPasswordView },
    { path: "/reset-password", component: ResetPasswordView },
    { path: "/dashboard", component: DashboardView },
    ];

    export const router = createRouter({
    history: createWebHistory(),
    routes,
    });

/**
 * Route guard: verifica autenticación antes de cada navegación
 * - Si no hay token y va a /dashboard → redirige a /login
 * - Si hay token y va a /login o /register → redirige a /dashboard
 */
router.beforeEach((to, _from, next) => {
    const token = localStorage.getItem("token");

    // Rutas públicas (no requieren auth)
    const publicRoutes = ["/", "/register", "/forgot-password", "/reset-password"];
    const isPublic = publicRoutes.includes(to.path);

    if (!isPublic && !token) {
        // Ruta protegida sin token → redirigir al login
        return next("/");
    }

    if (isPublic && token) {
        // Ya autenticado intentando ir a login/register → ir al dashboard
        return next("/dashboard");
    }

    next();
});