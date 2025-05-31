import { useState, useCallback } from "react";
import { useTaskStore } from "@/store/useTaskStore";
import { useBoardStore } from "@/store/useBoardStore";
import { useAuthStore } from "@/store/useAuthStore";

import { toast } from "sonner";
import type { EnhancedColumn, Task } from "@/types/kanban.types";
import { findTaskInColumns, hasTaskMoved } from "@/lib/kanban";
import { Priority } from "@/types/kanban.types";

interface UseTaskHandlersProps {
  boardId?: string;
  onTasksChanged?: () => void; // Callback to notify parent when tasks are updated
  enrichedColumns?: EnhancedColumn[]; // Accept enrichedColumns from parent
  
}

export function useTaskHandlers({ 
  boardId, 
  onTasksChanged,
  enrichedColumns = [] 
}: UseTaskHandlersProps) {
  const { token } = useAuthStore();

  const fetchBoardDetails = useBoardStore((state) => state.fetchBoardDetails);
  
  const {
    createTask,
    deleteTask,
    moveTask,
    toggleTaskCompletion,
    updateTask, // Ajout de updateTask pour la mise à jour des tâches
  } = useTaskStore();

  // État pour suivre la colonne sélectionnée pour l'ajout de tâches
  const [selectedColumnId, setSelectedColumnId] = useState<string | null>(null);

  // État modal pour création/édition de tâches et pour la tâche sélectionnée
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  
  // État pour suivre la tâche active pendant le drag-and-drop
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  // Handlers pour la modal des tâches
  const handleOpenTaskModal = useCallback((task?: Task, columnId?: string) => {
    if (task) {
      setSelectedTask(task);
    } else {
      // Réinitialiser selectedTask pour ouvrir le modal d'ajout
      setSelectedTask(null);
      if (columnId) {
        setSelectedColumnId(columnId);
      }
    }
    setIsTaskModalOpen(true);
  }, []);

  const handleCloseTaskModal = useCallback(() => {
    setIsTaskModalOpen(false);
    setSelectedTask(null);
    setSelectedColumnId(null);
  }, []);

  // Ajouter une nouvelle tâche
  const handleAddTask = useCallback(async (taskData: Partial<Task>) => {
    if (!boardId || !selectedColumnId) {
      toast.error("Données de tableau ou colonne manquantes");
      return;
    }

    try {
      // Valeurs par défaut pour les champs manquants
      const task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> = {
        title: taskData.title || "Nouvelle tâche",
        description: taskData.description || "",
        priority: taskData.priority || Priority.NORMAL,
        completed: taskData.completed || false,
        columnId: selectedColumnId,
        position: 0,
        labels: [],
        attachments: []
      };

      // Créer la tâche - le store mettra déjà à jour l'interface utilisateur
      const newTask = await createTask(selectedColumnId, task, token || undefined);

      // Fermer la modal et notifier l'utilisateur en cas de succès
      handleCloseTaskModal();
      
      if (newTask) {
        toast.success("Tâche créée avec succès");
        
        // Toujours rafraîchir les données pour s'assurer que l'UI est à jour
        if (boardId && onTasksChanged) {
          await fetchBoardDetails(boardId); // Rafraîchir les données directement
          onTasksChanged(); // Exécuter le callback pour informer le parent
        }
      } else {
        toast.error("Échec de la création de la tâche");
        // Rafraîchir les données uniquement en cas d'échec
        if (boardId) {
          await fetchBoardDetails(boardId);
        }
      }
    } catch (error) {
      console.error("Erreur lors de la création de la tâche:", error);
      toast.error("Échec de la création de la tâche");
      
      if (boardId) {
        await fetchBoardDetails(boardId);
      }
    }
  }, [boardId, createTask, fetchBoardDetails, handleCloseTaskModal, selectedColumnId, token, onTasksChanged]);

  // Gestionnaire pour la complétion de tâche
  const handleTaskToggleComplete = useCallback(async (taskId: string, completed: boolean) => {
    try {
      // Appeler l'API directement pour mettre à jour la tâche en utilisant l'état passé
      // Le store Zustand fait déjà une mise à jour optimiste de l'interface pour useTaskStore
      const result = await toggleTaskCompletion(
        taskId,
        token || undefined,
        completed
      );

      toast.success("Statut de la tâche mis à jour");
      
      // Toujours rafraîchir les données pour s'assurer que l'UI est à jour
      if (boardId) {
        await fetchBoardDetails(boardId); // Rafraîchir les données directement
        
        // Notify parent about the change
        if (result && onTasksChanged) {
          onTasksChanged();
        }
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la tâche:", error);
      toast.error("Échec de la mise à jour de la tâche");
      
      // En cas d'erreur uniquement, rafraîchir les données pour restaurer l'état correct
      if (boardId) {
        await fetchBoardDetails(boardId);
      }
    }
  }, [boardId, fetchBoardDetails, token, toggleTaskCompletion, onTasksChanged]);

  // Supprimer une tâche
  const handleDeleteTask = useCallback(async (taskId: string) => {
    try {
      // Appeler l'API - le store fait déjà la mise à jour optimiste
      const success = await deleteTask(taskId, token || undefined);
      
      if (success) {
        toast.success("Tâche supprimée avec succès");
        
        // Toujours rafraîchir les données pour s'assurer que l'UI est à jour
        if (boardId) {
          await fetchBoardDetails(boardId); // Rafraîchir les données directement
          
          // Notify parent about the change
          if (onTasksChanged) {
            onTasksChanged();
          }
        }
      } else {
        toast.error("Échec de la suppression de la tâche");
        // Rafraîchir les données uniquement en cas d'échec
        if (boardId) {
          await fetchBoardDetails(boardId);
        }
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de la tâche:", error);
      toast.error("Échec de la suppression de la tâche");
      
      // Rafraîchir les données pour restaurer l'état correct en cas d'erreur
      if (boardId) {
        await fetchBoardDetails(boardId);
      }
    }
  }, [boardId, deleteTask, fetchBoardDetails, token, onTasksChanged]);

  // Déplacer une tâche entre colonnes ou réordonner dans une même colonne
  const handleTaskMove = useCallback(
    async (taskId: string, destination: { columnId: string; position: number }) => {
      // Use enrichedColumns instead of columns from useSharedStore
      const task = findTaskInColumns(enrichedColumns, taskId);
      
      if (!task) {
        console.error("Tâche non trouvée dans les colonnes");
        return;
      }

      // On vérifie si la tâche a changé de colonne
      const hasMoved = hasTaskMoved(task, { columnId: destination.columnId, position: destination.position });

      try {
        // Le store devrait déjà mettre à jour l'interface utilisateur de façon optimiste
        const movedTask = await moveTask(
          taskId,
          destination.columnId,
          destination.position,
          token || undefined
        );
        
        // Message adapté selon si déplacement entre colonnes ou réorganisation
        if (movedTask) {
          toast.success(
            hasMoved
              ? "Tâche déplacée vers une autre colonne"
              : "Position de la tâche mise à jour"
          );
          
          // Toujours rafraîchir les données pour s'assurer que l'UI est à jour
          if (boardId) {
            await fetchBoardDetails(boardId); // Rafraîchir les données directement
            
            // Notify parent about the change
            if (onTasksChanged) {
              onTasksChanged();
            }
          }
        } else {
          // Si moveTask renvoie null, c'est qu'il y a eu une erreur
          toast.error("Échec du déplacement de la tâche");
          // Rafraîchir les données pour restaurer l'état correct
          if (boardId) {
            await fetchBoardDetails(boardId);
          }
        }
      } catch (error) {
        console.error("Erreur lors du déplacement de la tâche:", error);
        toast.error("Échec du déplacement de la tâche");

        // Rafraîchir les données pour rétablir l'état correct après échec
        if (boardId) {
          await fetchBoardDetails(boardId);
        }
      }
    },
    [boardId, enrichedColumns, fetchBoardDetails, moveTask, token, onTasksChanged]
  );

  // Modifier une tâche existante
  const handleEditTask = useCallback(async (taskId: string, updatedData: Partial<Task>) => {
    try {
      // Appeler l'API pour mettre à jour la tâche avec les nouvelles données
      const updatedTask = await updateTask(taskId, updatedData, token || undefined);

      if (updatedTask) {
        toast.success("Tâche mise à jour avec succès");

        console.log(boardId);
        // Toujours rafraîchir les données pour s'assurer que l'UI est à jour
        if (boardId) {
          await fetchBoardDetails(boardId); // Rafraîchir les données directement

          // Notify parent about the change
          if (onTasksChanged) {
            onTasksChanged();
          }
        }
      } else {
        toast.error("Échec de la mise à jour de la tâche");
        // Rafraîchir les données uniquement en cas d'échec
        if (boardId) {
          await fetchBoardDetails(boardId);
        }
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la tâche:", error);
      toast.error("Échec de la mise à jour de la tâche");

      // Rafraîchir les données pour restaurer l'état correct en cas d'erreur
      if (boardId) {
        await fetchBoardDetails(boardId);
      }
    }
  }, [boardId, fetchBoardDetails, token, updateTask, onTasksChanged]);

  return {
    // États
    selectedTask,
    selectedColumnId,
    isTaskModalOpen,
    activeTaskId,
    
    // Setters
    setActiveTaskId,
    
    // Handlers pour modals
    handleOpenTaskModal,
    handleCloseTaskModal,
    
    // Handlers pour tâches
    handleAddTask,
    handleTaskToggleComplete,
    handleDeleteTask,
    handleTaskMove,
    handleEditTask, // Ajout de handleEditTask pour la modification des tâches
  };
}
