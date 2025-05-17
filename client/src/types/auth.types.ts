// Types liés à l'authentification
export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  provider?: 'DISCORD' | 'LOCAL';
  createdAt?: string;
}

export interface AuthState {
  user: string | null;
  email: string | null;
  avatarUrl: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  error: string | null;
}

export interface LoginResponse {
  user: User;
  token: string;
}

// Types pour le routeur
export interface RouteConfig {
  path: string;
  element: React.ReactNode;
  children?: RouteConfig[];
  protected?: boolean;
  guestOnly?: boolean;
}

export interface AuthError {
  message: string;
}
