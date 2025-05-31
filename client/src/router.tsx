import { useEffect } from "react";
import {
  createBrowserRouter,
  RouterProvider as ReactRouterProvider,
  Navigate,
  Outlet,
} from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import type { RouteConfig } from "@/types/auth.types";
import Layout from "@/components/Layout";
import ThemeToggle from "./components/ThemeToggle";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import { APP_ROUTES } from "./constants/routes";

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
      <LoadingOverlay
        isLoading={true}
        message="Préparation de votre espace de travail..."
        position="full"
      />
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
      <LoadingOverlay
        isLoading={true}
        message="Chargement..."
        position="full"
      />
    );
  }

  // Si authentifié, rediriger vers la page d'accueil
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Si non authentifié, afficher le contenu pour invités
  return (
    <>
      <ThemeToggle className="absolute top-2 right-2" />
      <Outlet />
    </>
  );
};

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
const router = createBrowserRouter(createRoutesWithAuth(APP_ROUTES));

// Composant de routage principal
export default function Router() {
  return <ReactRouterProvider router={router} />;
}
