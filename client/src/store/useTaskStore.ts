
import { create } from 'zustand';
import type { Task } from '@/types/kanban.types';
import { taskService } from '@/services/taskService';

// Type pour les données partielles d'une tâche (pour la création/mise à jour)
export type TaskData = Omit<Task, 'id' | 'createdAt' | 'updatedAt'>;

// Interface pour le state du store des tâches
interface TaskState {
  tasks: Task[];
  currentTask: Task | null;
  editingTask: {
    columnId: string;
    task: Task | null;
  };
  isModalOpen: boolean;
  isLoading: boolean;
  error: string | null;
  // Nouvelle propriété pour suivre les tâches en cours de suppression
  deletingTaskIds: string[];
}

// Interface pour les actions du store
interface TaskActions {
  fetchTasks: (columnId: string, token?: string) => Promise<void>;
  createTask: (columnId: string, taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>, token?: string) => Promise<Task | null>;
  updateTask: (taskId: string, taskData: Partial<Task>, token?: string) => Promise<Task | null>;
  deleteTask: (taskId: string, token?: string) => Promise<boolean>;
  moveTask: (taskId: string, targetColumnId: string, position: number, token?: string) => Promise<Task | null>;
  toggleTaskCompletion: (taskId: string, token?: string, completed?: boolean) => Promise<Task | null>;
  setCurrentTask: (task: Task | null) => void;
  setEditingTask: (columnId: string, task: Task | null) => void;
  toggleTaskModal: (isOpen?: boolean) => void;
  setError: (error: string | null) => void;
  resetState: () => void;
}

// Type pour le store complet
type TaskStore = TaskState & TaskActions;

// État initial du store
const initialState: TaskState = {
  tasks: [],
  currentTask: null,
  editingTask: {
    columnId: '',
    task: null
  },
  isModalOpen: false,
  isLoading: false,
  error: null,
  deletingTaskIds: []
};

// Création du store Zustand
export const useTaskStore = create<TaskStore>()((set, get) => ({
  ...initialState,

  // Récupération des tâches d'une colonne
  fetchTasks: async (columnId: string, token?: string) => {
    set({ isLoading: true, error: null });
    try {
      const tasks = await taskService.getAllTasks(token);

      // Si columnId est fourni, filtrer les tâches pour cette colonne
      const filteredTasks = columnId 
        ? tasks.filter(task => task.columnId === columnId)
        : tasks;

      // Fusionner les nouvelles tâches avec les tâches existantes
      set(state => ({
        // Si aucun ID de colonne n'est fourni, remplacer toutes les tâches
        tasks: columnId 
          ? [
              ...state.tasks.filter(task => task.columnId !== columnId),
              ...filteredTasks
            ]
          : tasks,
        isLoading: false
      }));
    } catch (error) {
      console.error('Erreur lors de la récupération des tâches:', error);
      set({
        error: error instanceof Error ? error.message : 'Erreur lors de la récupération des tâches',
        isLoading: false
      });
    }
  },

  // Création d'une nouvelle tâche
  createTask: async (columnId: string, taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>, token?: string) => {
    set({ isLoading: true, error: null });
    try {
      const authStore = localStorage.getItem('auth-storage');
      const authToken = authStore ? JSON.parse(authStore).state.token : null;

      // Log task data if needed using a logging utility or remove this line
      // Log dueDate if needed using a logging utility or remove this line

      // Calculer la position maximale pour la colonne cible
      const columnTasks = get().tasks.filter(task => task.columnId === columnId);
      const maxPosition = columnTasks.length > 0
        ? Math.max(...columnTasks.map(task => task.position)) + 1
        : 0;

      // S'assurer que la date est correctement formatée
      const processedTaskData = {
        ...taskData,
        position: maxPosition,
        dueDate: taskData.dueDate ? new Date(taskData.dueDate) : undefined
      };

      // Créer la tâche via le service
      const newTask = await taskService.createTask(columnId, processedTaskData, token || authToken);
      
      // Log created task if needed using a logging utility or remove this line
      // Log dueDate after creation if needed using a logging utility or remove this line
      
      if (!newTask) {
        throw new Error('Échec de la création de la tâche');
      }

      // Ajouter la nouvelle tâche au store
      set(state => ({
        tasks: [...state.tasks, newTask],
        isLoading: false,
        isModalOpen: false, // Fermer le modal après la création
        editingTask: {
          columnId: '',
          task: null
        }
      }));

      return newTask;
    } catch (error) {
      console.error('Erreur lors de la création de la tâche:', error);
      set({
        error: error instanceof Error ? error.message : 'Erreur lors de la création de la tâche',
        isLoading: false
      });
      return null;
    }
  },

  // Mise à jour d'une tâche existante
  updateTask: async (taskId: string, taskData: Partial<Task>, token?: string) => {
    set({ isLoading: true, error: null });
    try {
      const authStore = localStorage.getItem('auth-storage');
      const authToken = authStore ? JSON.parse(authStore).state.token : null;
      
      // Fusionner les données existantes de la tâche avec les nouvelles données
      // pour s'assurer d'avoir une tâche complète
      let completeTaskData = taskData;
      const existingTask = get().tasks.find(task => task.id === taskId);

      console.log("updateTask - taskData reçu:", taskData);
      console.log("updateTask - dueDate:", taskData.dueDate, "type:", taskData.dueDate ? typeof taskData.dueDate : "undefined");
      console.log("updateTask - existingTask:", existingTask);
      
      if (existingTask) {
        completeTaskData = {
          ...existingTask,
          ...taskData,
          // S'assurer que la date est correctement formatée
          dueDate: taskData.dueDate !== undefined ? new Date(taskData.dueDate) : existingTask.dueDate
        };
      }
      
      console.log('updateTask - Données à envoyer:', completeTaskData);
      console.log('updateTask - dueDate à envoyer:', completeTaskData.dueDate, "type:", completeTaskData.dueDate ? typeof completeTaskData.dueDate : "undefined");
      
      // Appeler directement l'API sans vérifier si la tâche existe dans le store local
      const updatedTask = await taskService.updateTask(taskId, completeTaskData, token || authToken);
      
      console.log('updateTask - Tâche mise à jour:', updatedTask);
      console.log('updateTask - dueDate après mise à jour:', updatedTask.dueDate, "type:", updatedTask.dueDate ? typeof updatedTask.dueDate : "undefined");
      
      if (!updatedTask) {
        throw new Error(`Échec de la mise à jour de la tâche ${taskId}`);
      }

      // Mettre à jour le store avec la tâche actualisée
      // Si la tâche n'existe pas encore dans le store, l'ajouter
      set(state => {
        // Vérifier si la tâche existe déjà
        const taskExists = state.tasks.some(task => task.id === taskId);
        
        let updatedTasks;
        if (taskExists) {
          updatedTasks = state.tasks.map(task => task.id === taskId ? updatedTask : task);
        } else {
          // Ajouter la tâche au store s'il ne la contient pas
          updatedTasks = [...state.tasks, updatedTask];
        }
        
        return {
          tasks: updatedTasks,
          // Mettre à jour currentTask si c'est la tâche active
          currentTask: state.currentTask?.id === taskId ? updatedTask : state.currentTask,
          editingTask: {
            columnId: state.editingTask.columnId,
            task: state.editingTask.task?.id === taskId ? updatedTask : state.editingTask.task
          },
          isLoading: false,
          isModalOpen: false // Fermer le modal après la mise à jour
        };
      });

      return updatedTask;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de la tâche ${taskId}:`, error);
      set({
        error: error instanceof Error ? error.message : 'Erreur lors de la mise à jour de la tâche',
        isLoading: false
      });
      return null;
    }
  },

  // Suppression d'une tâche
  deleteTask: async (taskId: string, token?: string) => {
    // Marquer la tâche comme étant en cours de suppression
    set(state => ({
      deletingTaskIds: [...state.deletingTaskIds, taskId],
      isLoading: true, 
      error: null
    }));
    
    try {
      const authStore = localStorage.getItem('auth-storage');
      const authToken = authStore ? JSON.parse(authStore).state.token : null;
      
      // Supprimer la tâche côté serveur
      const success = await taskService.deleteTask(taskId, token || authToken);

      if (success) {
        // Mise à jour du state uniquement si la suppression a réussi
        set(state => ({
          // Filtrer la tâche supprimée
          tasks: state.tasks.filter(task => task.id !== taskId),
          // Réinitialiser la tâche courante si c'était celle supprimée
          currentTask: state.currentTask?.id === taskId ? null : state.currentTask,
          // Réinitialiser la tâche en édition si c'était celle supprimée
          editingTask: state.editingTask.task?.id === taskId 
            ? { columnId: state.editingTask.columnId, task: null } 
            : state.editingTask,
          // Fermer le modal si la tâche supprimée était concernée
          isModalOpen: state.currentTask?.id === taskId ? false : state.isModalOpen,
          // Retirer l'ID de la liste des tâches en cours de suppression
          deletingTaskIds: state.deletingTaskIds.filter(id => id !== taskId),
          isLoading: false
        }));
      } else {
        // En cas d'échec, retirer l'ID de la liste des suppressions en cours
        set(state => ({
          deletingTaskIds: state.deletingTaskIds.filter(id => id !== taskId),
          isLoading: false,
          error: 'Échec de la suppression de la tâche'
        }));
        return false;
      }

      return success;
    } catch (error) {
      console.error(`Erreur lors de la suppression de la tâche ${taskId}:`, error);
      // En cas d'erreur, retirer l'ID de la liste des suppressions en cours
      set(state => ({
        deletingTaskIds: state.deletingTaskIds.filter(id => id !== taskId),
        error: error instanceof Error ? error.message : 'Erreur lors de la suppression de la tâche',
        isLoading: false
      }));
      return false;
    }
  },

  // Déplacement d'une tâche vers une autre colonne
  moveTask: async (taskId: string, targetColumnId: string, position: number, token?: string) => {
    set({ isLoading: true, error: null });
    try {
      const authStore = localStorage.getItem('auth-storage');
      const authToken = authStore ? JSON.parse(authStore).state.token : null;
      const movedTask = await taskService.moveTask(taskId, targetColumnId, position, token || authToken);

      set(state => ({
        tasks: state.tasks.map(task => task.id === taskId ? movedTask : task),
        // Mettre à jour la tâche courante si elle est déplacée
        currentTask: state.currentTask?.id === taskId ? movedTask : state.currentTask,
        isLoading: false
      }));

      return movedTask;
    } catch (error) {
      console.error(`Erreur lors du déplacement de la tâche ${taskId}:`, error);
      set({
        error: error instanceof Error ? error.message : 'Erreur lors du déplacement de la tâche',
        isLoading: false
      });
      return null;
    }
  },

  // Basculer l'état de complétion d'une tâche
  toggleTaskCompletion: async (taskId: string, token?: string, completed?: boolean) => {
    // Ne pas mettre isLoading à true pour éviter de bloquer l'UI
    set({ error: null });
    
    console.log(`toggleTaskCompletion - Basculer statut de tâche ${taskId}`);
    
    // Récupérer le statut actuel si la tâche existe dans le store
    const existingTask = get().tasks.find(task => task.id === taskId);
    // Utiliser la valeur fournie si disponible, sinon inverser l'état actuel
    const newCompletedState = completed !== undefined ? completed : (existingTask ? !existingTask.completed : true);
    
    // Mettre à jour l'UI immédiatement pour une expérience utilisateur réactive
    if (existingTask) {
      set(state => ({
        tasks: state.tasks.map(task => 
          task.id === taskId 
            ? { ...task, completed: newCompletedState } 
            : task
        ),
        // Mettre à jour aussi la tâche courante si besoin
        currentTask: state.currentTask?.id === taskId 
          ? { ...state.currentTask, completed: newCompletedState }
          : state.currentTask
      }));
    }
    
    try {
      const authStore = localStorage.getItem('auth-storage');
      const authToken = authStore ? JSON.parse(authStore).state.token : null;
      
      console.log(`toggleTaskCompletion - Envoi au serveur: tâche ${taskId}, completed=${newCompletedState}`);
      
      // Mettre à jour la tâche côté serveur
      const updatedTaskData = {
        completed: newCompletedState
      };
      
      // Envoyer la mise à jour au serveur
      const updatedTask = await taskService.updateTask(taskId, updatedTaskData, token || authToken);
      
      // Mettre à jour le store avec la tâche complètement mise à jour
      set(state => ({
        tasks: state.tasks.map(task => task.id === taskId ? updatedTask : task),
        currentTask: state.currentTask?.id === taskId ? updatedTask : state.currentTask,
        isLoading: false
      }));
      
      return updatedTask;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de l'état de complétion de la tâche ${taskId}:`, error);
      
      // En cas d'erreur, revenir à l'état précédent si on avait une tâche existante
      if (existingTask) {
        set(state => ({
          tasks: state.tasks.map(task => 
            task.id === taskId 
              ? { ...task, completed: existingTask.completed } 
              : task
          ),
          currentTask: state.currentTask?.id === taskId 
            ? { ...state.currentTask, completed: existingTask.completed }
            : state.currentTask,
          error: error instanceof Error ? error.message : 'Erreur lors de la mise à jour de l\'état de complétion',
          isLoading: false
        }));
      } else {
        set({
          error: error instanceof Error ? error.message : 'Erreur lors de la mise à jour de l\'état de complétion',
          isLoading: false
        });
      }
      
      return null;
    }
  },

  // Définir la tâche courante
  setCurrentTask: (task: Task | null) => {
    set({ currentTask: task });
  },

  // Définir la tâche en cours d'édition
  setEditingTask: (columnId: string, task: Task | null) => {
    set({
      editingTask: { columnId, task }
    });
  },

  // Ouvrir/Fermer le modal de création/édition de tâche
  toggleTaskModal: (isOpen?: boolean) => {
    set(state => ({
      isModalOpen: isOpen !== undefined ? isOpen : !state.isModalOpen
    }));
  },

  // Définir un message d'erreur
  setError: (error: string | null) => {
    set({ error });
  },

  // Réinitialiser l'état complet du store
  resetState: () => {
    set(initialState);
  }
}));

export default useTaskStore;
