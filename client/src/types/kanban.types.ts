/**
 * Types partagés pour les tâches et les colonnes du kanban
 */

const Priority = {
  LOW: "LOW",
  NORMAL: "NORMAL",
  HIGH: "HIGH",
  URGENT: "URGENT"
} as const;

type Priority = typeof Priority[keyof typeof Priority];

export { Priority };

export interface Task {
  column?: unknown
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  dueDate?: Date;
  position: number;
  columnId: string;
  assigneeId?: string;
  createdAt: Date;
  updatedAt: Date;
  labels: string[];
  attachments: string[];
  completed: boolean;
}

// Interface de base pour une colonne sans tâches
export interface BaseColumn {
  id: string;
  title: string;
  position: number;
  boardId: string;
  createdAt: Date;
  updatedAt: Date;
  color?: string;
}

// Interface pour une colonne avec ses tâches imbriquées
export interface Column extends BaseColumn {
  tasks: Task[];
}

// Interface pour une colonne avec ses tâches (utilisée pour construire un affichage)
export interface EnhancedColumn extends BaseColumn {
  tasks: Task[];
}
