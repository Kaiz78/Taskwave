import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthState, User } from '@/types/auth.types';
import { authService } from '@/services/api';

const initialState: AuthState = {
  user: null,
  email: null,
  avatarUrl: null,
  isAuthenticated: false,
  isLoading: false,
  token: null,
  error: null
};

export const useAuthStore = create<AuthState & {
  setToken: (token: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
  setError: (error: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  loginWithDiscord: () => void;
  fetchUserProfile: () => Promise<void>;
}>()(
  persist(
    (set, get) => ({
      ...initialState,

      setToken: (token: string) => set({ token, isAuthenticated: true }),
      
      logout: () => set({ ...initialState }),
      
      setUser: (user: User) => set({ 
        user: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl
      }),
      
      setError: (error: string | null) => set({ error }),
      
      setLoading: (isLoading: boolean) => set({ isLoading }),
      
      loginWithDiscord: () => {
        set({ isLoading: true, error: null });
        try {
          // Rediriger vers l'authentification Discord
          authService.discordLogin();
          // Remarque : la redirection va quitter cette page, donc pas besoin de gérer la suite ici
        } catch (error) {
          console.error('Erreur lors de la redirection vers Discord:', error);
          set({ 
            isLoading: false, 
            error: 'Erreur lors de la redirection vers Discord' 
          });
        }
      },
      
      fetchUserProfile: async () => {
        const { token } = get();
        
        if (!token) {
          set({ error: 'Pas de token disponible' });
          return;
        }
        
        set({ isLoading: true });
        
        try {
          const data = await authService.getProfile(token);

          set({ 
            user: data.data.user.name, 
            avatarUrl: data.data.user.avatarUrl,
            email: data.data.user.email,
            isAuthenticated: true, 
            isLoading: false 
          });
        } catch (error) {
          console.error('Erreur lors de la récupération du profil:', error);
          set({
            isLoading: false,
            error: 'Erreur lors de la récupération du profil',
            isAuthenticated: false,
            token: null
          });
        }
      }
    }),
    {
      name: 'auth-storage', // nom du stockage dans localStorage
      partialize: (state) => ({ 
        token: state.token, 
        user: state.user,
        email: state.email,
        avatarUrl: state.avatarUrl,
        isAuthenticated: state.isAuthenticated
      }),
    }
  )
);