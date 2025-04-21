export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'analyst';
  token: string;
}

export interface AuthResponse {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'analyst';
  createdAt: string;
  updatedAt: string;
  __v: number;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}