/**
 * Constants related to the Kanban feature
 */

export const KANBAN_TEXT = {
  // Column related texts
  COLUMN: {
    ADD_BUTTON: "Ajouter une colonne",
    EDIT_BUTTON: "Modifier",
    DELETE_BUTTON: "Supprimer",
    ADD_TASK_BUTTON: "Ajouter une tâche",
    DEFAULT_TITLE: "Nouvelle colonne",
    PLACEHOLDER: "Titre de la colonne",
    EMPTY_COLUMN: "Aucune tâche",
    MODAL: {
      ADD_TITLE: "Ajouter une colonne",
      EDIT_TITLE: "Modifier la colonne",
      SAVE_BUTTON: "Enregistrer",
      CANCEL_BUTTON: "Annuler",
    },
    DELETE_MODAL: {
      TITLE: "Supprimer la colonne",
      DESCRIPTION: "Êtes-vous sûr de vouloir supprimer cette colonne? Cette action est irréversible.",
      CONFIRM_BUTTON: "Supprimer",
      CANCEL_BUTTON: "Annuler",
    }
  },
  
  // Task related texts
  TASK: {
    DEFAULT_TITLE: "Nouvelle tâche",
    PLACEHOLDER: "Titre de la tâche",
    DESCRIPTION_PLACEHOLDER: "Description de la tâche",
    DUE_DATE_LABEL: "Date d'échéance",
    DUE_DATE_PLACEHOLDER: "Sélectionner une date d'échéance",
    MODAL: {
      ADD_TITLE: "Ajouter une tâche",
      EDIT_TITLE: "Modifier la tâche",
      SAVE_BUTTON: "Enregistrer",
      SAVE_SUCCESS: "Tâche enregistrée avec succès",
      SAVE_ERROR: "Erreur lors de l'enregistrement de la tâche",
      CANCEL_BUTTON: "Annuler",
      DELETE_BUTTON: "Supprimer",
      DELETE_SUCCESS: "Tâche supprimée avec succès",
      DELETE_ERROR: "Erreur lors de la suppression de la tâche",
      TITLE_LABEL: "Titre",
      DESCRIPTION_LABEL: "Description",
      DUE_DATE_LABEL: "Date d'échéance",
      PRIORITY_LABEL: "Priorité",
      PRIORITY_PLACEHOLDER: "Sélectionner une priorité",
      STATUS_LABEL: "Statut",
      STATUS_COMPLETE: "Terminé",
      STATUS_PENDING: "En cours",
      MARK_COMPLETE: "Tâche marquée comme terminée",
      MARK_INCOMPLETE: "Tâche marquée comme en cours",
      UPDATE_STATUS_ERROR: "Erreur lors de la mise à jour du statut",
      COLUMN_LABEL: "Colonne",
      CREATED_AT_LABEL: "Créée le",
      UPDATED_AT_LABEL: "Dernière mise à jour",
    },
  },
  
  // Board details texts
  BOARD_DETAILS: {
    LOADING: "Chargement du tableau...",
    ERROR: "Impossible de charger le tableau",
  }
};

export const KANBAN_UI = {
  // Column UI
  COLUMN: {
    WIDTH: "w-72",
    MIN_HEIGHT: "min-h-[120px]",
    MAX_HEIGHT: "max-h-full",
    HEADER_HEIGHT: "h-12",
    BACKGROUND: "bg-slate-100 dark:bg-slate-800",
    BORDER: "border border-slate-200 dark:border-slate-700",
    BORDER_RADIUS: "rounded-md",
    SHADOW: "shadow-sm",
    HEADER_PADDING: "px-3 py-2",
    CONTENT_PADDING: "p-2",
    GAP: "gap-2",
    ADD_BUTTON_SIZE: "sm" as const,
  },
  
  // Task UI
  TASK: {
    PADDING: "p-3",
    MARGIN: "my-2",
    BACKGROUND: "bg-white dark:bg-slate-950",
    BORDER: "border border-slate-200 dark:border-slate-800",
    BORDER_RADIUS: "rounded-md",
    SHADOW: "shadow-sm",
    HOVER_SHADOW: "hover:shadow-md",
    TITLE_SIZE: "text-sm font-medium",
    DESCRIPTION_SIZE: "text-xs text-slate-500 dark:text-slate-400",
    ICON_SIZE: "h-4 w-4",
    BUTTON_SPACING: "space-x-1",
    COMPLETED_OPACITY: "opacity-50",
    COMPLETED_LINE_THROUGH: "line-through",
  },
  
  // Board details UI
  BOARD_DETAILS: {
    HEADER_PADDING: "mb-4 p-4",
    TITLE_BORDER_WIDTH: "4px",
    TITLE_PADDING_LEFT: "12px",
    DESCRIPTION_MARGIN: "mt-2",
  },
  
  // Drag and Drop
  DND: {
    DRAGGING_OPACITY: "opacity-50",
    DROPPING_HIGHLIGHT: "ring-2 ring-blue-500",
    TRANSITION: "transition-all duration-200",
  }
};
