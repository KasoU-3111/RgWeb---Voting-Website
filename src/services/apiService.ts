// src/services/apiService.ts

import { RegisterUserData, LoginCredentials } from "@/types";

const API_BASE_URL = 'http://localhost:8000/api';

const handleResponse = async (response: Response) => {
  // ... (keep this function as is)
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'An error occurred.');
  }
  return data;
};

export const registerUser = async (userData: RegisterUserData) => {
  // ... (keep this function as is)
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  return handleResponse(response);
};

export const loginUser = async (credentials: LoginCredentials) => {
  // ... (keep this function as is)
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  return handleResponse(response);
};


// ADD THIS NEW FUNCTION
/**
 * Fetches the current user's profile using their stored token.
 */
export const getUserProfile = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found.');
  }

  const response = await fetch(`${API_BASE_URL}/profile`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`, // <-- This is how we use the token
    },
  });
  return handleResponse(response);
};

// Add this to src/services/apiService.ts

/**
 * Fetches the list of candidates from the server.
 * Requires a valid JWT token for authorization.
 */
export const getCandidates = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found. Please log in.');
  }

  const response = await fetch(`${API_BASE_URL}/candidates`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};


// Add this to src/services/apiService.ts

/**
 * Casts a vote for a specific candidate.
 * @param candidateId The ID of the candidate to vote for.
 */
export const castVote = async (candidateId: number) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found. Please log in.');
  }

  const response = await fetch(`${API_BASE_URL}/vote`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ candidateId }), // Send candidateId in the body
  });

  return handleResponse(response);
};