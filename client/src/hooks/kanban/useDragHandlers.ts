import { useCallback } from "react";
import {
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  MouseSensor,
  useSensor,
  useSensors,
  MeasuringStrategy,
} from "@dnd-kit/core";
import type { EnhancedColumn } from "@/types/kanban.types";
import { reorderColumns } from "@/lib/kanban";

interface UseDragHandlersProps {
  columns: EnhancedColumn[];
  columnIds: string[];
  activeTaskId: string | null;
  setActiveTaskId: (id: string | null) => void;
  handleTaskMove: (taskId: string, destination: { columnId: string; position: number }) => Promise<void>;
  handleColumnOrderChange: (columnIds: string[]) => Promise<void>;
}

export function useDragHandlers({
  columns,
  columnIds,
  setActiveTaskId,
  handleTaskMove,
  handleColumnOrderChange,
}: UseDragHandlersProps) {
  // Configuration des capteurs pour le drag-and-drop
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: (event) => {
        const step = 20;
        switch (event.key) {
          case "ArrowUp":
            return { x: 0, y: -step };
          case "ArrowDown":
            return { x: 0, y: step };
          case "ArrowLeft":
            return { x: -step, y: 0 };
          case "ArrowRight":
            return { x: step, y: 0 };
          default:
            return { x: 0, y: 0 };
        }
      },
    })
  );

  // Configuration de la mesure pour optimiser les performances
  const measuringConfig = {
    droppable: {
      strategy: MeasuringStrategy.Always,
    },
  };

  // Gestion du drag-and-drop
  const handleDragStart = useCallback((event: DragStartEvent) => {
    const type = event?.active?.data?.current?.type;
    const id = event?.active?.id as string;
    
    if (type === "task") {
      // Mettre à jour l'ID de la tâche active pour les optimisations UI
      setActiveTaskId(id);
      
      // Signaler immédiatement le début du drag pour bloquer d'autres interactions
      if (event.active.data.current) {
        event.active.data.current = {
          ...event.active.data.current,
          isDragging: true,
        };
      }
    }
  }, [setActiveTaskId]);

  // Fonction optimisée pour le drag-over avec priorité aux colonnes cibles
  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { active, over } = event;

    // Si pas d'élément sous le curseur, on ne fait rien
    if (!over) return;

    // Si l'élément actif est le même que la cible, on ne fait rien
    if (active.id === over.id) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    // Si ce n'est pas une tâche qu'on déplace, on ne fait rien
    if (activeData?.type !== "task") return;

    // Si on déplace une tâche sur une colonne (changement de colonne)
    if (overData?.type === "column") {
      const sourceColumnId = activeData.task.columnId;
      const destinationColumnId = over.id as string;

      // Si on est dans la même colonne, on ne fait rien
      if (sourceColumnId === destinationColumnId) return;

      // Trouver la colonne de destination
      const destinationColumn = columns.find(col => col.id === destinationColumnId);
      if (!destinationColumn) return;

      // Position à la fin par défaut
      const position = destinationColumn.tasks.length;

      // Appliquer le mouvement avec un délai minimal pour éviter les calculs trop fréquents
      const taskId = active.id as string;
      
      // On utilise requestAnimationFrame pour synchroniser avec le pipeline de rendu
      requestAnimationFrame(() => {
        handleTaskMove(taskId, { columnId: destinationColumnId, position });
      });
    }

    // Si on déplace une tâche sur une autre tâche
    if (overData?.type === "task") {
      const sourceColumnId = activeData.task.columnId;
      const destinationColumnId = overData.task.columnId;

      // Pour les mouvements entre colonnes différentes
      if (sourceColumnId !== destinationColumnId) {
        // Trouver la colonne de destination
        const destinationColumn = columns.find(col => col.id === destinationColumnId);
        if (!destinationColumn) return;

        // Position basée sur la tâche cible
        const destinationTaskIndex = destinationColumn.tasks.findIndex(
          task => task.id === over.id
        );
        
        if (destinationTaskIndex < 0) return;
        
        // Déterminer si on insère avant ou après la tâche cible
        const activeTranslatedTop = active.rect.current?.translated?.top;
        const overRectTop = over.rect.top;
        const isBeforeTarget = 
          activeTranslatedTop !== undefined && activeTranslatedTop < overRectTop;
        
        const position = isBeforeTarget 
          ? destinationTaskIndex 
          : destinationTaskIndex + 1;
        
        // Appliquer le mouvement avec un délai minimal
        const taskId = active.id as string;
        requestAnimationFrame(() => {
          handleTaskMove(taskId, { columnId: destinationColumnId, position });
        });
      }
    }
  }, [columns, handleTaskMove]);

  // Fonction pour finaliser le déplacement d'une tâche
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    // Réinitialiser l'état actif
    setActiveTaskId(null);
    
    // Si pas d'élément sous le curseur, on arrête
    if (!over) return;

    // Obtenir les données des éléments
    const activeData = active.data.current;
    const overData = over.data.current;

    // Gestion du déplacement des colonnes
    if (activeData?.type === "column" && overData?.type === "column") {
      const fromIndex = columnIds.indexOf(active.id as string);
      const toIndex = columnIds.indexOf(over.id as string);
      
      if (fromIndex !== -1 && toIndex !== -1 && fromIndex !== toIndex) {
        // Utiliser la fonction utilitaire pour réordonner les colonnes
        const newColumnOrder = reorderColumns(columns, fromIndex, toIndex);
        
        // Appliquer le nouvel ordre
        handleColumnOrderChange(newColumnOrder);
      }
      return;
    }

    // Si on déplace une tâche dans la même colonne
    if (activeData?.type === "task") {
      const sourceColumnId = activeData.task.columnId;

      // Si la tâche est déplacée sur une autre tâche de la même colonne
      if (
        over.data.current?.type === "task" &&
        over.data.current?.task.columnId === sourceColumnId &&
        active.id !== over.id // Ne rien faire si c'est la même tâche
      ) {
        // Trouver la colonne source
        const sourceColumn = columns.find((col) => col.id === sourceColumnId);
        if (!sourceColumn) return;

        // Trouver les indices des tâches
        const activeIndex = sourceColumn.tasks.findIndex(task => task.id === active.id);
        const overIndex = sourceColumn.tasks.findIndex(task => task.id === over.id);

        // Si les indices sont différents, réorganiser les tâches
        if (activeIndex !== -1 && overIndex !== -1 && activeIndex !== overIndex) {
          // Appliquer le mouvement immédiatement pour une expérience fluide
          handleTaskMove(active.id as string, {
            columnId: sourceColumnId,
            position: overIndex,
          });
        }
      }
      
      // Si la tâche est déplacée sur une colonne (pas une tâche)
      else if (
        over.data.current?.type === "column" &&
        over.id !== sourceColumnId // Ne rien faire si c'est la même colonne
      ) {
        const destinationColumnId = over.id as string;
        
        // Trouver la colonne de destination
        const destinationColumn = columns.find((col) => col.id === destinationColumnId);
        if (!destinationColumn) return;
        
        // Ajouter à la fin de la colonne
        const position = destinationColumn.tasks.length;
        
        // Appliquer le mouvement
        handleTaskMove(active.id as string, {
          columnId: destinationColumnId,
          position,
        });
      }
    }
  }, [columns, handleTaskMove, columnIds, handleColumnOrderChange, setActiveTaskId]);

  return {
    sensors,
    measuringConfig,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  };
}
