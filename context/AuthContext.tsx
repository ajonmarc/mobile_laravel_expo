//context/AuthContext.tsx
import { api } from '@/constants/api';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { createContext, useContext, useEffect, useState } from 'react';
// 1. Add this import at the top of AuthContext.tsx
import type { LaravelValidationError, LoginResponse, User } from '@/types/api';


// 2. Improve the context type (optional but recommended)
type AuthContextType = {
  user: User | null;           // ← better than any
  loading: boolean;
  loginError: string | null;
  loginLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearLoginError: () => void;
};


const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);           // app-wide auth loading
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Auto-login / token check on mount
  useEffect(() => {
    const loadUser = async () => {
      const token = await SecureStore.getItemAsync('token');

      if (token) {
        api.defaults.headers.common.Authorization = `Bearer ${token}`;

        try {
          const res = await api.get('/me');
          setUser(res.data);
        } catch (err) {
          console.warn('Auto-login failed → clearing token', err);
          await SecureStore.deleteItemAsync('token');
          delete api.defaults.headers.common.Authorization;
          setUser(null);
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const clearLoginError = () => setLoginError(null);



  const login = async (email: string, password: string) => {
    setLoginError(null);
    setLoginLoading(true);

    try {
      if (!email.trim() || !password.trim()) {
        setLoginError('Email and password are required');
        return;
      }

      // Tell TS what the success response looks like
      const res = await api.post<LoginResponse>('/login', { email, password });

      const { access_token, refresh_token } = res.data;

      if (!access_token) {
        throw new Error('No access token received from server');
      }

      await SecureStore.setItemAsync('token', access_token);
      if (refresh_token) {
        await SecureStore.setItemAsync('refresh_token', refresh_token);
      }

      api.defaults.headers.common.Authorization = `Bearer ${access_token}`;

      // Also type the /me response
      const meRes = await api.get<User>('/me');
      setUser(meRes.data);

      router.replace('/(protected)/(tabs)');
    } catch (err: any) {
      let message = 'Something went wrong. Please try again.';

      if (err.response) {
        const { status, data } = err.response;

        if (status === 422) {
          // ── This is the important part ──
          // Tell TypeScript: this is a Laravel validation error shape
          const errorData = data as LaravelValidationError | undefined;

          if (errorData?.errors) {
            // Now TS knows errors is Record<string, string[]>
            // So Object.values() → string[][]
            // So [0] → string[] | undefined
            // So [0]?.[0] is safe
            const firstFieldErrors = Object.values(errorData.errors)[0];
            message = firstFieldErrors?.[0] ?? errorData.message ?? 'Validation failed';
          } else {
            message = errorData?.message ?? 'Invalid input';
          }
        } else if (status === 401) {
          message = 'Incorrect email or password';
        } else if (status === 429) {
          message = 'Too many attempts. Try again later.';
        } else {
          message = (data as { message?: string })?.message || `Server error (${status})`;
        }
      } else if (err.request) {
        message = 'Cannot reach the server. Check your internet connection.';
      } else {
        message = err.message || 'Unexpected error';
      }

      setLoginError(message);
      console.warn('Login failed:', err);
    } finally {
      setLoginLoading(false);
    }
  };
  
  const logout = async () => {
    try {
      await api.post('/logout'); // may fail if token already invalid — that's fine
    } catch (e) {
      console.log('Logout API call failed (probably already invalid token)');
    }

    await SecureStore.deleteItemAsync('token');
    await SecureStore.deleteItemAsync('refresh_token');
    delete api.defaults.headers.common.Authorization;
    setUser(null);

    router.replace('/login');
  };

  // Debug helper (optional – remove in production)
  useEffect(() => {
    console.log('🔐 AUTH STATE CHANGED:', user ? 'Logged in' : 'Logged out');
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginError,
        loginLoading,
        login,
        logout,
        clearLoginError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};