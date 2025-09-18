// src/context/AuthContext.tsx

import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { User } from '@/types';
import { getUserProfile } from '@/services/apiService';

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start as true to check for existing session

  useEffect(() => {
    const checkUserSession = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userProfile = await getUserProfile();
          setCurrentUser(userProfile);
        } catch (error) {
          console.error('Session check failed:', error);
          localStorage.removeItem('token'); // Invalid token, so remove it
          setCurrentUser(null);
        }
      }
      setIsLoading(false);
    };

    checkUserSession();
  }, []);

  const login = (user: User, token: string) => {
    localStorage.setItem('token', token);
    setCurrentUser(user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to easily use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};