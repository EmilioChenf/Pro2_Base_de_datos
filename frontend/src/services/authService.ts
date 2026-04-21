import { api } from './api';
import type { AuthResponse, User } from '@/types';

export async function loginRequest(payload: {
  correo: string;
  password: string;
}) {
  const response = await api.post<AuthResponse>('/auth/login', payload);
  return response.data;
}

export async function registerRequest(payload: {
  nombre: string;
  correo: string;
  password: string;
  telefono?: string;
}) {
  const response = await api.post<AuthResponse>('/auth/register', payload);
  return response.data;
}

export async function googleLoginRequest(accessToken: string) {
  const response = await api.post<AuthResponse>('/auth/google', { accessToken });
  return response.data;
}

export async function meRequest() {
  const response = await api.get<{ user: User }>('/auth/me');
  return response.data.user;
}
