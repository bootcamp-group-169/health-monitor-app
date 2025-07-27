import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  needsOnboarding: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  completeOnboarding: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      needsOnboarding: false,
      login: async (email: string, password: string) => {
        // Simulate API call
        console.log('Auth store login called with:', { email, password });
        await new Promise(resolve => setTimeout(resolve, 1000));
        const user = {
          id: '1',
          email,
          name: email.split('@')[0],
          avatar: `https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop`
        };
        console.log('Setting user:', user);
        set({ user, isAuthenticated: true, needsOnboarding: false });
      },
      register: async (name: string, email: string, password: string) => {
        // Simulate API call
        console.log('Auth store register called with:', { name, email, password });
        await new Promise(resolve => setTimeout(resolve, 1000));
        const user = {
          id: '1',
          email,
          name,
          avatar: `https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop`
        };
        console.log('Setting user:', user);
        set({ user, isAuthenticated: true, needsOnboarding: true });
      },
      logout: () => {
        set({ user: null, isAuthenticated: false, needsOnboarding: false });
      },
      completeOnboarding: () => {
        set({ needsOnboarding: false });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);