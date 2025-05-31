import type { CommandAction } from "@/components/common/CommandPalette";
import { FaCog, FaSignOutAlt } from "react-icons/fa";
import { LuLayoutDashboard } from "react-icons/lu";
import { BsListTask, BsKanban } from "react-icons/bs";
import { FaQuestionCircle } from "react-icons/fa";

/**
 * Commandes par défaut pour la palette de commandes
 * Ces commandes seront toujours disponibles dans la palette
 */
export const DEFAULT_COMMANDS: CommandAction[] = [
  {
    id: "home",
    name: "Accueil",
    icon: LuLayoutDashboard,
    action: () => null, // Cette action sera remplacée dans useCommandPalette
    keywords: ["home", "dashboard", "accueil", "tableau de bord"],
  },
  {
    id: "tasks",
    name: "Tâches",
    icon: BsListTask,
    action: () => null, // Cette action sera remplacée dans useCommandPalette
    keywords: ["tasks", "tâches", "to-do", "liste de tâches", "gestion des tâches"],
  },
  {
    id: "settings",
    name: "Paramètres",
    icon: FaCog,
    action: () => null, // Cette action sera remplacée dans useCommandPalette
    keywords: ["settings", "config", "preferences", "options", "paramètres"],
  },
  {
    id: "help",
    name: "Aide",
    icon: FaQuestionCircle,
    action: () => null, // Cette action sera remplacée dans useCommandPalette
    keywords: ["help", "aide", "support", "documentation", "guide"],
  }
];

/**
 * Commandes d'application qui nécessitent un accès à des fonctions du composant
 * Ces commandes sont définies dans le composant et utilisent des fonctions locales
 */
export const APP_COMMAND_IDS = {
  LOGOUT: "logout",
  BOARD_PREFIX: "board-",
};

/**
 * Configuration des icônes pour les commandes générées dynamiquement
 */
export const DYNAMIC_COMMAND_ICONS = {
  logout: FaSignOutAlt,
  board: BsKanban, // Icône par défaut pour les boards
};
