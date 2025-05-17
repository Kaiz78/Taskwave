import { useEffect } from "react";
import {
  createBrowserRouter,
  RouterProvider as ReactRouterProvider,
  Navigate,
  Outlet,
} from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import type { RouteConfig } from "@/types/auth.types";
import LoginPage from "@/pages/Login";
import AuthCallback from "@/pages/AuthCallback";
import App from "@/pages/Home";
import SettingsPage from "@/pages/Settings";
import Layout from "@/components/Layout";

// Composant pour les routes protégées
const ProtectedRoute = () => {
  // Access state properties directly to prevent unnecessary re-renders
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const token = useAuthStore((state) => state.token);
  const fetchUserProfile = useAuthStore((state) => state.fetchUserProfile);

  useEffect(() => {
    // Si nous avons un token mais pas encore authentifié, essayer de récupérer le profil
    if (token && !isAuthenticated && !isLoading) {
      fetchUserProfile();
    }
  }, [token, isAuthenticated, isLoading, fetchUserProfile]);

  // Si en cours de chargement, afficher un écran de chargement
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Chargement...</h1>
          <p className="mt-2 text-gray-600">
            Veuillez patienter pendant que nous préparons votre espace de
            travail.
          </p>
        </div>
      </div>
    );
  }

  // Si non authentifié, rediriger vers la page de login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si authentifié, afficher le contenu protégé avec Layout
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

// Composant pour les routes accessibles uniquement aux invités
const GuestRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);

  // Si en cours de chargement, afficher un écran de chargement
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Chargement...</h1>
        </div>
      </div>
    );
  }

  // Si authentifié, rediriger vers la page d'accueil
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Si non authentifié, afficher le contenu pour invités
  return <Outlet />;
};

// Configuration des routes
const routes: RouteConfig[] = [
  {
    path: "/",
    element: <App />,
    protected: true,
  },
  
  {
    path: "/settings",
    element: <SettingsPage />,
    protected: true,
  },
  {
    path: "/login",
    element: <LoginPage />,
    guestOnly: true,
  },
  {
    path: "/auth-callback",
    element: <AuthCallback />,
  },
  // Route de fallback pour les URLs non trouvées
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
];

// Fonction pour créer les routes avec protection
const createRoutesWithAuth = (routes: RouteConfig[]) => {
  return routes.map((route) => {
    if (route.protected) {
      return {
        path: route.path,
        element: <ProtectedRoute />,
        children: [{ path: "", element: route.element }],
      };
    } else if (route.guestOnly) {
      return {
        path: route.path,
        element: <GuestRoute />,
        children: [{ path: "", element: route.element }],
      };
    } else {
      return {
        path: route.path,
        element: route.element,
      };
    }
  });
};

// Créer le routeur avec les routes protégées
const router = createBrowserRouter(createRoutesWithAuth(routes));

// Composant de routage principal
export default function Router() {
  return <ReactRouterProvider router={router} />;
}
