import { useEffect, useMemo, useCallback } from "react";
import { useBoardStore } from "@/store/useBoardStore";
import { useParams } from "react-router-dom";
import { useColumnHandlers } from "./useColumnHandlers";
import { useTaskHandlers } from "./useTaskHandlers";
import { useDragHandlers } from "./useDragHandlers";
import type { EnhancedColumn, Task } from "@/types/kanban.types";

/**
 * Hook centralisé pour la page de détails du tableau qui gère :
 * - Chargement unique et centralisé des données (Board, Colonnes, Tâches)
 * - Délégation aux hooks spécialisés pour les opérations métier
 * - Drag & Drop et synchronisation des données
 */
export function useBoardDetails() {
  const params = useParams<{ boardId: string }>();
  const boardId = params.boardId;

  // Utiliser uniquement le store du tableau qui contient déjà colonnes et tâches
  const { 
    currentBoard, 
    columns,
    fetchBoardDetails, 
    isLoading, 
    error 
  } = useBoardStore();

  // Extraire toutes les tâches directement depuis les colonnes
  const tasks: Task[] = useMemo(() => {
    if (!columns || columns.length === 0) return [];
    
    // Créer un tableau plat de toutes les tâches de toutes les colonnes
    return columns.reduce<Task[]>((allTasks, column) => {
      if (column.tasks && Array.isArray(column.tasks)) {
        return [...allTasks, ...column.tasks];
      }
      return allTasks;
    }, []);
  }, [columns]);

  // Calcul des colonnes enrichies
  const enrichedColumns: EnhancedColumn[] = useMemo(() => {
    if (!columns) return [];
    
    return columns.map(column => ({
      ...column,
      tasks: tasks.filter(task => task.columnId === column.id)
                   .sort((a, b) => a.position - b.position)
    }));
  }, [columns, tasks]);

  // Chargement initial unique - fetchBoardDetails contient déjà les colonnes et les tâches
  useEffect(() => {
    let isMounted = true;
    
    if (boardId && isMounted) {
      // Vérifier si on a déjà chargé ce tableau pour éviter les requêtes multiples
      if (!currentBoard || currentBoard.id !== boardId) {
        fetchBoardDetails(boardId);
      }
    }
    
    // Fonction de nettoyage pour éviter les mises à jour sur un composant démonté
    return () => {
      isMounted = false;
    };
  }, [boardId, currentBoard, fetchBoardDetails]);

  // Fonction pour rafraîchir toutes les données (tableau, colonnes, tâches)
  const refreshData = useCallback(async () => {
    if (boardId) {
      console.log('useBoardDetails: Refreshing data for board', boardId);
      // Puisque fetchBoardDetails contient déjà les colonnes et les tâches, utilisons-le
      await fetchBoardDetails(boardId);
      console.log('useBoardDetails: Data refresh completed');
    }
  }, [boardId, fetchBoardDetails]);

  // Gestionnaires délégués avec les données enrichies
  const columnHandlers = useColumnHandlers({ 
    boardId, 
    enrichedColumns 
  });
  
  const taskHandlers = useTaskHandlers({ 
    boardId, 
    enrichedColumns, 
    onTasksChanged: refreshData 
  });
  
  const dragHandlers = useDragHandlers({
    columns: enrichedColumns,
    columnIds: enrichedColumns.map(c => c.id),
    activeTaskId: taskHandlers.activeTaskId,
    setActiveTaskId: taskHandlers.setActiveTaskId,
    handleTaskMove: taskHandlers.handleTaskMove,
    handleColumnOrderChange: columnHandlers.handleColumnOrderChange,
  });

  return {
    currentBoard,
    enrichedColumns,
    tasks,
    isLoading,
    error,
    refreshData,
    ...columnHandlers,
    ...taskHandlers,
    ...dragHandlers,
  };
}
