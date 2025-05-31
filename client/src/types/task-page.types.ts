import type { Task } from './kanban.types';

// Type pour les tâches enrichies avec des informations de tableau
export interface EnhancedTask extends Task {
  boardTitle?: string;
  boardColor?: string;
  boardId: string;
}
