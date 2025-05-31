import { Task } from '@prisma/client';
import { TaskRepository, TaskWithRelations, taskRepository } from './taskRepository';

export class TaskService {
  private repository: TaskRepository;

  constructor(repository: TaskRepository = taskRepository) {
    this.repository = repository;
  }

  /**
   * Créer une nouvelle tâche
   */
  async createTask(data: {
    title: string;
    description?: string;
    columnId: string;
    position?: number;
    priority?: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
    dueDate?: string | Date | null;
    assigneeId?: string;
    labels?: string[];
    attachments?: string[];
    completed?: boolean;
  }, userId: string): Promise<TaskWithRelations | null> {
    // Vérifier si la colonne appartient à l'utilisateur
    const columnOwned = await this.repository.verifyColumnOwnership(data.columnId, userId);
    if (!columnOwned) {
      return null;
    }

    // Ajuster les positions si nécessaire
    if (data.position !== undefined) {
      await this.repository.adjustTaskPositionsForInsert(data.columnId, data.position);
    }

    // Convertir la date si nécessaire
    let dueDate: Date | null | undefined = undefined;
    if (data.dueDate !== undefined) {
      dueDate = data.dueDate ? new Date(data.dueDate) : null;
    }

    // Créer la tâche
    return this.repository.createTask({
      ...data,
      dueDate
    });
  }

  /**
   * Récupérer toutes les tâches d'un utilisateur
   */
  async getAllTasksForUser(userId: string): Promise<TaskWithRelations[]> {
    return this.repository.getAllTasksForUser(userId);
  }

  /**
   * Mettre à jour une tâche
   */
  async updateTask(id: string, userId: string, data: {
    title?: string;
    description?: string;
    columnId?: string;
    position?: number;
    priority?: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
    dueDate?: string | Date | null;
    assigneeId?: string;
    labels?: string[];
    attachments?: string[];
    completed?: boolean;
  }): Promise<TaskWithRelations | null> {
    // Récupérer la tâche avec ses relations
    const task = await this.repository.getTaskWithRelations(id);
    
    // Vérifier si la tâche existe et appartient à l'utilisateur
    if (!task || task.column?.board.ownerId !== userId) {
      return null;
    }

    // Gestion du changement de colonne
    if (data.columnId && data.columnId !== task.columnId) {
      // Vérifier si la nouvelle colonne existe et appartient au même tableau
      const newColumnValid = await this.repository.verifyColumnInSameBoard(
        data.columnId,
        task.column?.board.id || ''
      );

      if (!newColumnValid) {
        return null;
      }

      // Ajuster les positions pour le changement de colonne
      await this.repository.adjustPositionsForColumnChange(
        task.columnId,
        task.position,
        data.columnId,
        data.position !== undefined ? data.position : task.position
      );
    } 
    // Gestion du changement de position dans la même colonne
    else if (data.position !== undefined && data.position !== task.position) {
      await this.repository.adjustPositionsInSameColumn(
        task.columnId,
        task.position,
        data.position
      );
    }

    // Préparer les données à mettre à jour (uniquement les champs fournis)
    const updateData: any = {};

    // N'inclure que les champs qui ont été fournis dans la requête
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.columnId !== undefined) updateData.columnId = data.columnId;
    if (data.position !== undefined) updateData.position = data.position;
    if (data.priority !== undefined) updateData.priority = data.priority;
    if (data.dueDate !== undefined) updateData.dueDate = data.dueDate ? new Date(data.dueDate) : null;
    if (data.assigneeId !== undefined) updateData.assigneeId = data.assigneeId;
    if (data.labels !== undefined) updateData.labels = data.labels;
    if (data.attachments !== undefined) updateData.attachments = data.attachments;
    if (data.completed !== undefined) updateData.completed = data.completed;

    // Mettre à jour la tâche
    return this.repository.updateTask(id, updateData);
  }

  /**
   * Supprimer une tâche
   */
  async deleteTask(id: string, userId: string): Promise<boolean> {
    // Récupérer la tâche avec ses relations
    const task = await this.repository.getTaskWithRelations(id);
    
    // Vérifier si la tâche existe et appartient à l'utilisateur
    if (!task || task.column?.board.ownerId !== userId) {
      return false;
    }

    // Supprimer la tâche
    const deleted = await this.repository.deleteTask(id);
    if (!deleted) {
      return false;
    }

    // Réajuster les positions des autres tâches
    await this.repository.adjustPositionsAfterDelete(task.columnId, task.position);
    
    return true;
  }

  /**
   * Déplacer une tâche
   */
  async moveTask(id: string, userId: string, data: {
    columnId: string;
    position: number;
  }): Promise<TaskWithRelations | null> {
    // Récupérer la tâche avec ses relations
    const task = await this.repository.getTaskWithRelations(id);
    
    // Vérifier si la tâche existe et appartient à l'utilisateur
    if (!task || task.column?.board.ownerId !== userId) {
      return null;
    }

    // Vérifier si la colonne cible existe et appartient au même tableau
    const targetColumnValid = await this.repository.verifyColumnInSameBoard(
      data.columnId,
      task.column?.board.id || ''
    );

    if (!targetColumnValid) {
      return null;
    }

    // Si la tâche est déplacée vers une colonne différente
    if (data.columnId !== task.columnId) {
      await this.repository.adjustPositionsForColumnChange(
        task.columnId,
        task.position,
        data.columnId,
        data.position
      );
    } 
    // Si la tâche reste dans la même colonne mais change de position
    else if (data.position !== task.position) {
      await this.repository.adjustPositionsInSameColumn(
        task.columnId,
        task.position,
        data.position
      );
    }

    // Mettre à jour la tâche avec sa nouvelle position
    return this.repository.updateTask(id, {
      columnId: data.columnId,
      position: data.position
    });
  }
}

// Exporter une instance singleton du service
export const taskService = new TaskService();
