/**
 * Types liés aux tableaux (boards) de l'application Taskwave
 */

// Type pour un tableau
export interface BoardData {
  id: string;
  title: string;
  description?: string;
  backgroundColor?: string;
  columnsCount: number;
  tasksCount: number;
  createdAt: Date;
}

// Type pour les données d'un nouveau tableau
export interface NewBoardData {
  title: string;
  description: string;
  backgroundColor: string;
}

// Type pour les options de tri des tableaux
export type BoardSortOption = "newest" | "oldest" | "name-asc" | "name-desc";

// Type pour les filtres appliqués aux tableaux
export interface BoardFilters {
  searchQuery: string;
  sortOption: BoardSortOption;
}
