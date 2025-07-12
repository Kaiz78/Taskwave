// Constants file for route configuration
import { Navigate } from "react-router-dom";
import type { RouteConfig } from "../types/auth.types";
import LoginPage from "../pages/Login";
import AuthCallback from "../pages/AuthCallback";
import Board from "../pages/Board";
import BoardDetailsPage from "../pages/BoardDetails";
import SettingsPage from "../pages/Settings";
import TaskPage from "../pages/TaskPage";
import HelpPage from "../pages/Help";
import LandingPage from "../pages/LandingPage";
import BugReport from "../pages/BugReport";

/**
 * Configuration des routes de l'application
 *
 * protected: true - Route accessible uniquement aux utilisateurs authentifiés
 * guestOnly: true - Route accessible uniquement aux utilisateurs non authentifiés
 * Si aucun des deux n'est spécifié, la route est publique
 */
export const APP_ROUTES: RouteConfig[] = [
  {
    path: "/",
    element: <Board />,
    protected: true,
  },
  {
    path: "/boards/:boardId",
    element: <BoardDetailsPage />,
    protected: true,
  },
  {
    path: "/tasks/",
    element: <TaskPage />,
    protected: true,
  },
  {
    path: "/settings",
    element: <SettingsPage />,
    protected: true,
  },
  {
    path: "/help",
    element: <HelpPage />,
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
  // Landing page publique
  {
    path: "/landing",
    element: <LandingPage />,
  },
  // Page de rapport de bug
  {
    path: "/bug-report",
    element: <BugReport />,
  },
  // Route de fallback pour les URLs non trouvées
  {
    path: "*",
    element: <Navigate to="/landing" replace />,
  },
];
