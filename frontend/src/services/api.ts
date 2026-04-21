import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL ?? '/api';

export const TOKEN_STORAGE_KEY = 'plushstore_token';
export const USER_STORAGE_KEY = 'plushstore_user';

export const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
