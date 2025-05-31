/**
 * UI-related constants for the application
 */

/**
 * Layout configuration values
 */
export const LAYOUT = {
  FOOTER_MARGIN: "mt-20", // Margin top for footer
  CONTENT_PADDING: "p-4", // Padding for main content
  AVATAR_SIZE: "h-10 w-10", // Avatar size in user profile
  LOGO_SIZE: "h-6 w-6", // Logo size in header
  ICON_SIZE: {
    SM: "h-3 w-3", // Small icon size
    MD: "h-4 w-4", // Medium icon size
    LG: "h-6 w-6", // Large icon size
  },
  TEXT: {
    APP_NAME: "Taskwave",
    USER_FALLBACK: "Utilisateur",
    LOGOUT_BUTTON: "Se déconnecter",
    APP_SECTION: "Application",
  },
};

/**
 * Common UI components configuration
 */
export const COMMON_UI = {
  // SearchBar component
  SEARCH: {
    INPUT_MAX_WIDTH: "max-w-md",
    BUTTON_SIZE: "icon" as const,
    ICON_SIZE: "h-4 w-4",
    PLACEHOLDER: "Rechercher...",
  },
  
  // FilterBar component
  FILTER: {
    BUTTON_SIZE: "sm" as const,
    DROPDOWN_WIDTH: "w-48",
    ICON_SIZE: "h-4 w-4",
    BUTTON_GAP: "gap-1.5",
    BUTTON_TEXT: "Filtrer",
    DROPDOWN_LABEL: "Trier par",
  },

  // CommandPalette component
  COMMAND: {
    SHORTCUT: "Ctrl+K",
    PLACEHOLDER: "Tapez une commande ou recherchez...",
    NO_RESULTS: "Aucune commande trouvée.",
    HEADING: "Commandes",
    MAX_HEIGHT: "max-h-[300px]",
  },
};
