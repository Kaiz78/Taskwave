/**
 * Constants related to the Board feature
 */

export const BOARD_TEXT = {
  TITLE: "Mes tableaux",
  WELCOME_MESSAGE: "Bienvenue {username}, gérez vos projets et tâches",
  DEFAULT_USERNAME: "Utilisateur",
  NEW_BOARD: "Nouveau tableau",
  LOADING: "Chargement des tableaux...",
  
  // Textes pour les filtres
  FILTER_BUTTON: "Filtrer",
  FILTER_DROPDOWN_LABEL: "Trier par",
  
  // Textes pour la recherche
  SEARCH_PLACEHOLDER: "Rechercher un tableau...",
  
  // Textes pour les états sans résultats
  NO_RESULTS_TITLE: "Aucun tableau trouvé",
  NO_RESULTS_MESSAGE: "Essayez de modifier vos critères de recherche ou créez un nouveau tableau.",
  NO_BOARDS_TITLE: "Commencez à organiser vos projets",
  NO_BOARDS_MESSAGE: "Vous n'avez pas encore créé de tableaux. Cliquez sur le bouton \"Nouveau tableau\" pour commencer.",
};

export const BOARD_SORT_OPTIONS = {
  NEWEST: "newest",
  OLDEST: "oldest",
  NAME_ASC: "name-asc",
  NAME_DESC: "name-desc",
} as const;

export const SORT_OPTION_LABELS = {
  [BOARD_SORT_OPTIONS.NEWEST]: "Plus récents",
  [BOARD_SORT_OPTIONS.OLDEST]: "Plus anciens",
  [BOARD_SORT_OPTIONS.NAME_ASC]: "Nom (A-Z)",
  [BOARD_SORT_OPTIONS.NAME_DESC]: "Nom (Z-A)",
};

export const BOARD_UI = {
  PAGE_PADDING: "p-6",
  HEADER_MARGIN: "mb-8",
  FILTERS_MARGIN: "mb-6",
  CONTENT_MARGIN: "mt-6",
  HEADER_ICON_SIZE: "h-4 w-4",
  GRID_LAYOUT: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
  
  // UI pour les filtres
  FILTER_BUTTON_SIZE: "sm" as const,
  FILTER_DROPDOWN_WIDTH: "w-48",
  FILTER_ICON_SIZE: "h-4 w-4",
  FILTER_BUTTON_GAP: "gap-1.5",
  
  // UI pour la recherche
  SEARCH_INPUT_MAX_WIDTH: "max-w-md",
  SEARCH_BUTTON_SIZE: "icon" as const,
  
  // UI pour les états sans résultats
  EMPTY_STATE_PADDING: "p-10 bg-muted/30 rounded-lg mt-4",
  EMPTY_STATE_ICON_SIZE: "h-12 w-12",
  EMPTY_STATE_ICON_MARGIN: "mb-4",
  EMPTY_STATE_TITLE_SIZE: "text-xl font-medium",
  EMPTY_STATE_TEXT_MARGIN: "mt-2",
  
  // UI pour les cartes de tableau
  CARD_HOVER: "transition-all hover:shadow-md",
  CARD_COLOR_INDICATOR: "border-l-4",
  CARD_TITLE_SIZE: "text-lg font-bold",
  CARD_HEADER_PADDING: "pb-2",
  CARD_FOOTER_PADDING: "pt-2",
  CARD_FOOTER_TEXT: "text-xs text-muted-foreground",
};

export const BOARD_DEFAULT = {
  SORT_OPTION: BOARD_SORT_OPTIONS.NEWEST,
  SEARCH_QUERY: "",
};

/**
 * Couleurs disponibles pour les tableaux
 */
export const BOARD_COLORS = [
  { name: "Bleu", value: "#3498db" },
  { name: "Vert", value: "#2ecc71" },
  { name: "Rouge", value: "#e74c3c" },
  { name: "Violet", value: "#9b59b6" },
  { name: "Orange", value: "#e67e22" },
  { name: "Turquoise", value: "#1abc9c" },
];

export const DEFAULT_BOARD_COLOR = BOARD_COLORS[0].value;
