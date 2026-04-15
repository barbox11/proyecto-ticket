import axios from "axios";

// URL del backend desde variable de entorno (se define en .env)
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const api = axios.create({
    baseURL: API_URL,
});

// Interceptor de request: adjunta access token a cada petición
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

// Interceptor de response: si recibe 401, intenta renovar tokens automáticamente
let isRefreshing = false;
let failedQueue: { resolve: (value: unknown) => void; reject: (reason?: any) => void }[] = [];

// Procesa la cola de peticiones fallidas después de renovar el token
const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Si el error es 401 y aún no se intentó renovar
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            // Si ya se está renovando, encolar la petición
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return api(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            isRefreshing = true;

            try {
                const refreshToken = localStorage.getItem("refreshToken");

                if (!refreshToken) {
                    throw new Error("No hay refresh token");
                }

                // Llamar al endpoint de refresh para obtener nuevos tokens
                const res = await api.post("/api/users/refresh", { refreshToken });

                const { accessToken, refreshToken: newRefreshToken } = res.data;

                // Guardar nuevos tokens
                localStorage.setItem("token", accessToken);
                localStorage.setItem("refreshToken", newRefreshToken);

                // Actualizar interceptor con nuevo token
                api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;

                processQueue(null, accessToken);

                return api(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                // Si falla el refresh, limpiar sesión y redirigir al login
                localStorage.removeItem("token");
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("user");
                window.location.href = "/";
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);
