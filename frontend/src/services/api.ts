import axios from "axios";
import { User, SupplyCategory, Supply, SupplyTransaction } from "../types";

let hostname = window.location.hostname;
const API_BASE_URL = `http://${hostname}:8000/api`;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically attach tokens to every request if available
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("access_token");
    const refreshToken = localStorage.getItem("refresh_token");
    if (accessToken) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${accessToken}`,
      };
    }
    if (refreshToken) {
      config.headers = {
        ...config.headers,
        "X-Refresh-Token": refreshToken,
      };
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const supplyCategoryAPI = {
  getAll: () => api.get<SupplyCategory[]>("/categories"),
  create: (data: Partial<SupplyCategory>) => api.post("/categories/", data),
  update: (id: number, data: Partial<SupplyCategory>) =>
    api.put(`/categories/${id}/`, data),
  delete: (id: number) => api.delete(`/categories/${id}`),
};

export const supplyAPI = {
  getAll: () => api.get<Supply[]>("/supplies"),
  create: (data: Partial<Supply>) => api.post("/supplies/", data),
  update: (id: number, data: Partial<Supply>) =>
    api.put(`/supplies/${id}/`, data),
  delete: (id: number) => api.delete(`/supplies/${id}/`),
  getLowStock: () => api.get<Supply[]>("/supplies/low-stock"),
};

export const transactionAPI = {
  getAll: () => api.get<SupplyTransaction[]>("/transactions"),
  create: (data: Partial<SupplyTransaction>) =>
    api.post("/transactions/", data),
};

export const userAPI = {
  getAll: () => api.get<User[]>("/users"),
};

export default api;
