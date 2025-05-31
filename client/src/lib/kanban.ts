// Utility functions for Kanban board operations
import type { Column, EnhancedColumn, Task } from "@/types/kanban.types";
import { closestCenter } from "@dnd-kit/core";


// Types for Kanban utilities
export interface TaskDestination {
  columnId: string;
  position: number;
}

export interface ColumnUpdate {
  id: string;
  oldPosition: number;
  newPosition: number;
  title: string;
}

export interface ColumnEditState {
  isEditing: boolean;
  title: string;
}

export interface ColumnNavigationProps {
  isEditing: boolean;
  columnTitle: string;
  isLeftDisabled: boolean;
  isRightDisabled: boolean;
  setIsEditing: (value: boolean) => void;
  handleTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleTitleSubmit: () => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  handleMoveLeft: () => void;
  handleMoveRight: () => void;
}

/**
 * Reorders columns array and returns new IDs order.
 * @param columns Array of columns
 * @param fromIndex Source index
 * @param toIndex Destination index
 */
export function reorderColumns(columns: Column[] | EnhancedColumn[], fromIndex: number, toIndex: number): string[] {
  const newColumns = [...columns];
  const [moved] = newColumns.splice(fromIndex, 1);
  newColumns.splice(toIndex, 0, moved);
  return newColumns.map(col => col.id);
}

/**
 * Trouver une tâche dans l'ensemble des colonnes
 * @param columns Liste des colonnes
 * @param taskId ID de la tâche à trouver
 * @returns Les informations complètes sur la tâche trouvée ou undefined
 */
export function findTaskInColumns(
  columns: Column[],
  taskId: string
): Task | undefined {
  return columns.flatMap((col) => col.tasks).find((task) => task.id === taskId);
}

/**
 * Déterminer si une tâche a changé de position ou de colonne
 * @param task Tâche à vérifier
 * @param destination Nouvelle destination (colonne et position)
 * @returns true si la tâche a été déplacée, false sinon
 */
export function hasTaskMoved(
  task: Task, 
  destination: TaskDestination
): boolean {
  return !(
    task.columnId === destination.columnId && 
    task.position === destination.position
  );
}

/**
 * Préparer les colonnes à mettre à jour après un changement d'ordre
 * @param columns Liste des colonnes
 * @param columnIds Nouvel ordre des IDs de colonnes
 * @returns Liste des colonnes à mettre à jour avec leurs nouvelles positions
 */
export function prepareColumnsToUpdate(
  columns: Column[], 
  columnIds: string[]
): ColumnUpdate[] {
  const columnMap = new Map<string, Column>();
  columns.forEach((col) => {
    columnMap.set(col.id, col);
  });

  const columnsToUpdate: ColumnUpdate[] = [];
  
  for (let i = 0; i < columnIds.length; i++) {
    const columnId = columnIds[i];
    const column = columnMap.get(columnId);
    const newPosition = i + 1; // position 1-indexée pour correspondre au backend

    if (column && column.position !== newPosition) {
      columnsToUpdate.push({
        id: columnId,
        oldPosition: column.position,
        newPosition,
        title: column.title,
      });
    }
  }

  // Stratégie de tri spéciale pour éviter les conflits de position:
  // 1. D'abord traiter les colonnes déplacées vers la position 1
  // 2. Puis traiter les autres colonnes dans l'ordre de la nouvelle position
  return columnsToUpdate.sort((a, b) => {
    // Donner une priorité absolue aux colonnes déplacées vers la position 1
    if (a.newPosition === 1) return -1;
    if (b.newPosition === 1) return 1;
    // Puis trier par nouvelle position
    return a.newPosition - b.newPosition;
  });
}

/**
 * Crée une fonction optimisée de détection de collision pour drag-and-drop
 * @returns Une fonction de détection de collision optimisée
 */
export function createOptimizedCollisionDetection() {
  return (args: Parameters<typeof closestCenter>[0]) => {
    // Use closestCenter for better base precision
    const collisions = closestCenter(args);

    // Improve collision precision by adding weights
    if (collisions.length > 1) {
      // Filter and prioritize relevant collisions
      // Priority to columns for inter-column movements
      return collisions.sort((a, b) => {
        const typeA = a.data?.current?.type;
        const typeB = b.data?.current?.type;

        // Prioritize columns over tasks
        if (typeA === "column" && typeB !== "column") return -1;
        if (typeA !== "column" && typeB === "column") return 1;

        return 0;
      });
    }

    return collisions;
  };
}

/**
 * Génère une clé unique basée sur l'ordre des colonnes pour forcer le rendu
 * @param columns Liste des colonnes
 * @returns Une chaîne unique représentant l'ordre des colonnes
 */
export function generateColumnsKey(columns: Column[] | EnhancedColumn[]): string {
  return columns.map((col) => `${col.id}-${col.position}`).join("-");
}

/**
 * Interface pour les éléments DnD avec données
 */
interface DragElement {
  id: string;
  data: {
    current?: {
      type?: string;
      task?: {
        id: string;
        columnId: string;
        position: number;
      };
      column?: Column | EnhancedColumn;
      isDragging?: boolean;
    };
  };
  rect?: {
    current?: {
      translated?: {
        top?: number;
      };
    };
    top?: number;
  };
}

/**
 * Déterminer si une tâche est en train d'être déplacée sur une autre tâche de la même colonne
 * @param active Élément actif (tâche en cours de déplacement)
 * @param over Élément survolé 
 * @returns true si c'est un déplacement dans la même colonne, false sinon
 */
export function isSameColumnTaskMove(
  active: DragElement,
  over: DragElement
): boolean {
  if (!active.data.current || !over.data.current) return false;
  
  return (
    active.data.current.type === "task" &&
    over.data.current.type === "task" &&
    active.data.current.task?.columnId === over.data.current.task?.columnId &&
    active.id !== over.id
  );
}

/**
 * Déterminer si une tâche est en train d'être déplacée sur une colonne différente
 * @param active Élément actif (tâche en cours de déplacement)
 * @param over Élément survolé
 * @returns true si c'est un déplacement vers une colonne différente, false sinon
 */
export function isDifferentColumnMove(
  active: DragElement,
  over: DragElement
): boolean {
  if (!active.data.current || !over.data.current) return false;
  
  return (
    active.data.current.type === "task" &&
    over.data.current.type === "column" &&
    over.id !== active.data.current.task?.columnId
  );
}

/**
 * Trouver l'indice d'une tâche dans une colonne donnée
 * @param column Colonne à examiner
 * @param taskId ID de la tâche à trouver
 * @returns Indice de la tâche dans le tableau tasks de la colonne, ou -1 si non trouvée
 */
export function findTaskIndexInColumn(column: Column, taskId: string): number {
  return column.tasks.findIndex(task => task.id === taskId);
}

/**
 * Détermine la nouvelle position d'une tâche lors d'un déplacement sur une autre tâche
 * @param activeTranslatedTop Position Y traduite de l'élément actif
 * @param overRectTop Position Y de l'élément survolé
 * @param overIndex Indice de l'élément survolé
 * @returns Nouvelle position pour la tâche active
 */
export function determineTaskPosition(
  activeTranslatedTop: number | undefined, 
  overRectTop: number,
  overIndex: number
): number {
  if (activeTranslatedTop === undefined) return overIndex;
  return activeTranslatedTop < overRectTop ? overIndex : overIndex + 1;
}
