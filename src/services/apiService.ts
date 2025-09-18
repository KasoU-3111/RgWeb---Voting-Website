import { RegisterUserData, LoginCredentials, Candidate } from "@/types";

const API_BASE_URL = 'http://localhost:8000/api';

/**
 * A helper function to handle API responses.
 * It checks if the response was successful and parses the JSON body.
 * If the response is an error, it throws an error with the message from the server.
 * @param response The raw response from the fetch call.
 */
const handleResponse = async (response: Response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'An error occurred.');
  }
  return data;
};

/**
 * Registers a new user.
 * @param userData - An object matching the RegisterUserData type.
 */
export const registerUser = async (userData: RegisterUserData) => {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  return handleResponse(response);
};

/**
 * Logs in a user.
 * @param credentials - An object matching the LoginCredentials type.
 */
export const loginUser = async (credentials: LoginCredentials) => {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  return handleResponse(response);
};

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
      'Authorization': `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};

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
    body: JSON.stringify({ candidateId }),
  });

  return handleResponse(response);
};

/**
 * Fetches dashboard statistics for the admin panel.
 */
export const getAdminStats = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found.');
  }

  const response = await fetch(`${API_BASE_URL}/admin/stats`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  return handleResponse(response);
};

/**
 * Adds a new candidate. (Admin only)
 * @param candidateData - An object containing name, party, and description.
 */
export const addCandidate = async (candidateData: { name: string; party: string; description: string; }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found.');
  }

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

/**
 * Updates an existing candidate. (Admin only)
 * @param candidateId The ID of the candidate to update.
 * @param candidateData The new data for the candidate.
 */
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

/**
 * Deletes a candidate. (Admin only)
 * @param candidateId The ID of the candidate to delete.
 */
export const deleteCandidate = async (candidateId: number) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No token found.');

  const response = await fetch(`${API_BASE_URL}/admin/candidates/${candidateId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};