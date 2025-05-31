import type { Task } from '@/types/kanban.types';
import { Priority } from '@/types/kanban.types';

// API Base URL - utilise la même que celle définie dans api.ts
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Interface pour les nouvelles tâches à créer
export interface NewTaskData {
  title: string;
  columnId: string;
  description?: string;
  priority?: Priority;
  dueDate?: Date;
  position?: number;
  assigneeId?: string;
  labels?: string[];
  attachments?: string[];
  completed?: boolean;
}

/**
 * Service pour gérer les appels API liés aux tâches
 */
export const taskService = {



  /**
   * Crée une nouvelle tâche
   */
  async createTask(columnId: string, taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>, token?: string): Promise<Task> {
    try {
      const newTaskData: NewTaskData = {
        ...taskData,
        columnId
      };
      
      // En mode développement, si pas de token, simuler la création
      if (!token && import.meta.env.DEV) {
        // Simulation d'un délai réseau
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const now = new Date();
        
        // Créer une fausse réponse
        const newTask: Task = {
          id: `task-${Date.now()}`,
          ...taskData,
          createdAt: now,
          updatedAt: now
        };
        
        return newTask;
      }
      
      // Sinon, faire un appel API réel
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: 'POST',
        headers,
        body: JSON.stringify(newTaskData)
      });

      if (!response.ok) {
        throw new Error('Échec de la création de la tâche');
      }

      const data = await response.json();
      
      // Traiter les dates si nécessaire
      const task = data.data.task;
      return {
        ...task,
        createdAt: new Date(task.createdAt),
        updatedAt: new Date(task.updatedAt),
        dueDate: task.dueDate ? new Date(task.dueDate) : undefined
      };
      
    } catch (error) {
      console.error('Erreur lors de la création de la tâche:', error);
      throw error;
    }
  },

  /**
   * Met à jour une tâche existante
   */
  async updateTask(taskId: string, taskData: Partial<Task>, token?: string): Promise<Task> {
    try {
      // En mode développement, si pas de token, simuler la mise à jour
      if (!token && import.meta.env.DEV) {
        // Simulation d'un délai réseau
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const now = new Date();
        
        // Simuler une mise à jour réussie
        return {
          id: taskId,
          columnId: taskData.columnId || "col-test",
          title: taskData.title || "Tâche sans titre",
          description: taskData.description,
          priority: taskData.priority || Priority.NORMAL,
          dueDate: taskData.dueDate,
          position: taskData.position || 0,
          createdAt: now,
          updatedAt: now,
          labels: taskData.labels || [],
          attachments: taskData.attachments || [],
          completed: taskData.completed || false
        };
      }
      
      // Sinon, faire un appel API réel
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(taskData)
      });

      if (!response.ok) {
        throw new Error('Échec de la mise à jour de la tâche');
      }

      const data = await response.json();
      
      // Traiter les dates si nécessaire
      const task = data.data.task;
      return {
        ...task,
        createdAt: new Date(task.createdAt),
        updatedAt: new Date(task.updatedAt),
        dueDate: task.dueDate ? new Date(task.dueDate) : undefined
      };
      
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de la tâche ${taskId}:`, error);
      throw error;
    }
  },

  /**
   * Supprime une tâche
   */
  async deleteTask(taskId: string, token?: string): Promise<boolean> {
    try {
      // En mode développement, si pas de token, simuler la suppression
      if (!token && import.meta.env.DEV) {
        // Simulation d'un délai réseau
        await new Promise(resolve => setTimeout(resolve, 300));
        return true;
      }
      
      // Sinon, faire un appel API réel
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: 'DELETE',
        headers
      });

      return response.ok;
      
    } catch (error) {
      console.error(`Erreur lors de la suppression de la tâche ${taskId}:`, error);
      throw error;
    }
  },

  /**
   * Déplace une tâche vers une autre colonne
   */
  async moveTask(taskId: string, targetColumnId: string, position: number, token?: string): Promise<Task> {
    try {
      // En mode développement, si pas de token, simuler le déplacement
      if (!token && import.meta.env.DEV) {
        // Simulation d'un délai réseau
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const now = new Date();
        
        // Simuler un déplacement réussi
        return {
          id: taskId,
          columnId: targetColumnId,
          title: "Tâche déplacée",
          priority: Priority.NORMAL,
          position: position,
          createdAt: now,
          updatedAt: now,
          labels: [],
          attachments: [],
          completed: false
        };
      }
      
      // Sinon, faire un appel API réel
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/move`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ columnId: targetColumnId, position })
      });

      if (!response.ok) {
        throw new Error('Échec du déplacement de la tâche');
      }

      const data = await response.json();
      
      // Traiter les dates si nécessaire
      const task = data.data.task;
      return {
        ...task,
        createdAt: new Date(task.createdAt),
        updatedAt: new Date(task.updatedAt),
        dueDate: task.dueDate ? new Date(task.dueDate) : undefined
      };
      
    } catch (error) {
      console.error(`Erreur lors du déplacement de la tâche ${taskId}:`, error);
      throw error;
    }
  },


  /**
   * Récupère toutes les tâches de l'utilisateur
   */
  async getAllTasks(token?: string): Promise<Task[]> {
    try {

      // En mode développement, si pas de token, simuler la récupération
      if (!token && import.meta.env.DEV) {
        // Simulation d'un délai réseau
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Simuler une liste de tâches
        return [
          {
            id: 'task-1',
            columnId: 'col-1',
            title: 'Tâche 1',
            description: 'Description de la tâche 1',
            priority: Priority.NORMAL,
            position: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
            labels: [],
            attachments: [],
            completed: false
          },
          {
            id: 'task-2',
            columnId: 'col-2',
            title: 'Tâche 2',
            description: 'Description de la tâche 2',
            priority: Priority.HIGH,
            position: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
            labels: [],
            attachments: [],
            completed: true
          }
        ];
      }
      
      // Sinon, faire un appel API réel
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: 'GET',
        headers
      });

      if (!response.ok) {
        throw new Error('Échec de la récupération des tâches');
      }

      const data = await response.json();
      
      // Traiter les dates si nécessaire
      return data.data.tasks.map((task: Task) => ({
        ...task,
        createdAt: new Date(task.createdAt),
        updatedAt: new Date(task.updatedAt),
        dueDate: task.dueDate ? new Date(task.dueDate) : undefined
      }));
      
    } catch (error) {
      console.error('Erreur lors de la récupération des tâches:', error);
      throw error;
    }
  },
  

};
