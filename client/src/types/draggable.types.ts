import type { Task, Column } from '@/types/kanban.types';

/**
 * Types adaptés pour le système de drag-and-drop
 * Ces types font le pont entre nos modèles de données métier et les exigences du système DnD
 */

// Interface de base pour les éléments draggables
export interface DraggableItem {
  id: string;
}

// Adaptateur pour le type Task
export type DraggableTask = Task & DraggableItem;

// Adaptateur pour le type Column 
export type DraggableColumn = Column & DraggableItem;

// Type générique pour les options du hook useDraggable
export interface DragItemData<T extends DraggableItem = DraggableItem> {
  item: T;
  type: string;
}
