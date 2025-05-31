// Constants file for navigation items
import { FaCog } from "react-icons/fa";
import { LuLayoutDashboard } from "react-icons/lu";
import { BsListTask } from "react-icons/bs";
import { FaQuestionCircle } from "react-icons/fa";

/**
 * Interface defining a navigation item in the sidebar
 */
export interface NavItem {
  title: string;
  url: string;
  icon: React.ElementType;
}

/**
 * Main navigation items for the sidebar
 */
export const NAVIGATION_ITEMS: NavItem[] = [
  {
    title: "Projet",
    url: "/",
    icon: LuLayoutDashboard,
  },
  {
    title: "Tâches",
    url: "/tasks",
    icon: BsListTask,
  },
  {
    title: "Paramètres",
    url: "/settings",
    icon: FaCog,
  },
  {
    title: "Aide",
    url: "/help",
    icon: FaQuestionCircle,
  },
];

/**
 * Keyboard shortcuts for the sidebar toggle
 */
export const SIDEBAR_KEYBOARD_SHORTCUTS = {
  mac: "⌘ + B",
  windows: "Ctrl + B",
};
