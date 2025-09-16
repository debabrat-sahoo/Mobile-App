import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiService } from '@/services/api';
import { LoginRequest } from '@/types/api';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isMountedRef = useRef<boolean>(false);

  useEffect(() => {
    isMountedRef.current = true;
    checkAuthStatus();
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await apiService.getStoredToken();
      const userData = await apiService.getStoredUser();
      
      if (token && userData && isMountedRef.current) {
        setUser(userData);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  };

  const login = async (credentials: LoginRequest) => {
    if (isMountedRef.current) setIsLoading(true);
    try {
      // Exchange credentials for access token via OAuth2 password grant
      const tokenResponse = await apiService.getTokenWithPasswordGrant({
        username: credentials.email,
        password: credentials.password,
        client_id: 'mobileapp',
      });

      // Persist access token for subsequent API calls
      if (tokenResponse?.access_token) {
        await AsyncStorage.setItem('jwt_token', tokenResponse.access_token);
        if (tokenResponse.refresh_token) {
          await AsyncStorage.setItem('refresh_token', tokenResponse.refresh_token);
        }
      }

      // Optionally fetch current user profile to populate context
      try {
        const details = await apiService.getCustomerDetails();
        if (isMountedRef.current && details) {
          const normalized = { id: String(details.id), email: details.email ?? '', name: `${details.firstName ?? ''} ${details.lastName ?? ''}`.trim() };
          setUser(normalized);
          await AsyncStorage.setItem('user_data', JSON.stringify(normalized));
        }
      } catch (e) {
        // If profile fetch fails, still consider authenticated (token stored)
        if (isMountedRef.current) {
          setUser({ id: 'self', email: credentials.email, name: credentials.email });
          await AsyncStorage.setItem('user_data', JSON.stringify({ id: 'self', email: credentials.email, name: credentials.email }));
        }
      }
    } catch (error) {
      throw error;
    } finally {
      if (isMountedRef.current) setIsLoading(false);
    }
  };

  const logout = async () => {
    if (isMountedRef.current) setIsLoading(true);
    try {
      await apiService.logout();
      if (isMountedRef.current) setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      if (isMountedRef.current) setIsLoading(false);
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}