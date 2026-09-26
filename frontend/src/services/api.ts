import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const dashboardService = {
  getSummary: async () => {
    const response = await api.get('/dashboard/summary');
    return response.data;
  },
};

export const eventService = {
  getEvents: async (skip = 0, limit = 50) => {
    const response = await api.get(`/events?skip=${skip}&limit=${limit}`);
    return response.data;
  },
};

export const alertService = {
  getAlerts: async (skip = 0, limit = 50) => {
    const response = await api.get(`/alerts?skip=${skip}&limit=${limit}`);
    return response.data;
  },
};

export const incidentService = {
  getIncidents: async (skip = 0, limit = 50) => {
    const response = await api.get(`/incidents?skip=${skip}&limit=${limit}`);
    return response.data;
  },
};

export default api;
