// src/services/apiService.ts

import { RegisterUserData, LoginCredentials, Candidate } from "@/types";

const API_BASE_URL = 'http://localhost:8000/api';

/**
 * A helper function to handle API responses.
 */
const handleResponse = async (response: Response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'An error occurred.');
  }
  return data;
};

// --- AUTHENTICATION ---
export const registerUser = async (userData: RegisterUserData) => {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  return handleResponse(response);
};

export const loginUser = async (credentials: LoginCredentials) => {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  return handleResponse(response);
};

export const getUserProfile = async () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No token found.');
  const response = await fetch(`${API_BASE_URL}/profile`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  return handleResponse(response);
};

// --- VOTER ACTIONS ---
export const getCandidates = async () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No token found. Please log in.');
  const response = await fetch(`${API_BASE_URL}/candidates`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  return handleResponse(response);
};

export const castVote = async (candidateId: number) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No token found. Please log in.');
  const response = await fetch(`${API_BASE_URL}/vote`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ candidateId }),
  });
  return handleResponse(response);
};

// --- PUBLIC ACTIONS ---
export const getResults = async () => {
  const response = await fetch(`${API_BASE_URL}/results`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  return handleResponse(response);
};

// --- ADMIN ACTIONS ---
export const getAdminStats = async () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No token found.');
  const response = await fetch(`${API_BASE_URL}/admin/stats`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  return handleResponse(response);
};

export const addCandidate = async (candidateData: { name: string; party: string; description: string; }) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No token found.');
  const response = await fetch(`${API_BASE_URL}/admin/candidates`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(candidateData),
  });
  return handleResponse(response);
};

export const updateCandidate = async (candidateId: number, candidateData: Partial<Candidate>) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No token found.');
  const response = await fetch(`${API_BASE_URL}/admin/candidates/${candidateId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(candidateData),
  });
  return handleResponse(response);
};

export const deleteCandidate = async (candidateId: number) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No token found.');
  const response = await fetch(`${API_BASE_URL}/admin/candidates/${candidateId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  return handleResponse(response);
};

export const getVoteDistribution = async () => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found.');
    const response = await fetch(`${API_BASE_URL}/admin/vote-distribution`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return handleResponse(response);
};
  
export const getVoterTurnout = async () => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found.');
    const response = await fetch(`${API_BASE_URL}/admin/voter-turnout`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return handleResponse(response);
};