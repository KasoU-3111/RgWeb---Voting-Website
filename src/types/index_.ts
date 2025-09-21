// src/types/index.ts

export type RegisterUserData = {
  fullName: string;
  email: string;
  password: string;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

// ADD THIS TYPE
export type User = {
  id: number;
  full_name: string;
  email: string;
  role: 'voter' | 'admin';
};

export type Candidate = {
  id: number;
  name: string;
  party: string;
  description: string;
  image_url: string | null; // Can be null if not provided
};

export type Result = {
  id: number;
  name: string;
  party: string;
  description: string;
  votes: number;
  percentage: number;
};