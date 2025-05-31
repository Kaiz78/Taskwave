import { PrismaClient, Task } from '@prisma/client';
import { prisma } from '../../server';

export type TaskWithRelations = Task & {
  assignee?: {
    id: string;
    name: string;
    email: string;
    avatarUrl: string | null;
  } | null;
  column?: {
    id: string;
    title: string;
    board: {
      id: string;
      title: string;
      ownerId: string;
    }
  }
};

export class TaskRepository {
  private prisma: PrismaClient;

  constructor(prismaClient: PrismaClient = prisma) {
    this.prisma = prismaClient;
    
    // Vérifier que l'instance Prisma est correctement initialisée
    if (!this.prisma) {
      console.error("ERREUR CRITIQUE: PrismaClient n'est pas initialisé dans le constructeur");
      // Créer une instance de secours
      this.prisma = new PrismaClient();
    }
  }

  /**
   * Vérifier si une colonne existe et appartient à un utilisateur
   */
  async verifyColumnOwnership(columnId: string, userId: string): Promise<boolean> {
    try {
      if (!this.prisma) {
        console.error("PrismaClient n'est pas initialisé");
        return false;
      }
      
      const column = await this.prisma.column.findUnique({
        where: {
          id: columnId
        },
        include: {
          board: true
        }
      });
      
      return !!column && column.board.ownerId === userId;
    } catch (error) {
      console.error(`Erreur lors de la vérification de la colonne ${columnId}:`, error);
      return false;
    }
  }

  /**
   * Récupérer une colonne avec son tableau
   */
  async getColumnWithBoard(columnId: string): Promise<{ id: string; boardId: string; board: { ownerId: string; id: string } } | null> {
    try {
      if (!this.prisma) {
        console.error("PrismaClient n'est pas initialisé");
        return null;
      }
      
      return await this.prisma.column.findUnique({
        where: {
          id: columnId
        },
        select: {
          id: true,
          boardId: true,
          board: {
            select: {
              id: true,
              ownerId: true
            }
          }
        }
      });
    } catch (error) {
      console.error(`Erreur lors de la récupération de la colonne ${columnId}:`, error);
      return null;
    }
  }

  /**
   * Ajuster les positions des tâches lors de l'insertion
   */
  async adjustTaskPositionsForInsert(columnId: string, position: number): Promise<boolean> {
    try {
      if (!this.prisma) {
        console.error("PrismaClient n'est pas initialisé");
        return false;
      }
      
      await this.prisma.task.updateMany({
        where: {
          columnId,
          position: {
            gte: position
          }
        },
        data: {
          position: {
            increment: 1
          }
        }
      });
      
      return true;
    } catch (error) {
      console.error(`Erreur lors de l'ajustement des positions pour la colonne ${columnId}:`, error);
      return false;
    }
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
    dueDate?: Date | null;
    assigneeId?: string;
    labels?: string[];
    attachments?: string[];
    completed?: boolean;
  }): Promise<TaskWithRelations | null> {
    try {
      if (!this.prisma) {
        console.error("PrismaClient n'est pas initialisé");
        return null;
      }
      
      const task = await this.prisma.task.create({
        data: {
          title: data.title,
          description: data.description || null,
          priority: (data.priority as any) || 'NORMAL',
          position: data.position ?? 0,
          dueDate: data.dueDate || null,
          labels: data.labels || [],
          attachments: data.attachments || [],
          completed: data.completed || false,
          column: {
            connect: { id: data.columnId }
          },
          assignee: data.assigneeId ? {
            connect: { id: data.assigneeId }
          } : undefined
        },
        include: {
          assignee: {
            select: {
              id: true,
              name: true,
              email: true,
              avatarUrl: true
            }
          }
        }
      });
      
      return task;
    } catch (error) {
      console.error('Erreur lors de la création de la tâche:', error);
      return null;
    }
  }

  /**
   * Récupérer une tâche avec ses relations
   */
  async getTaskWithRelations(id: string): Promise<TaskWithRelations | null> {
    try {
      if (!this.prisma) {
        console.error("PrismaClient n'est pas initialisé");
        return null;
      }
      
      const task = await this.prisma.task.findUnique({
        where: { id },
        include: {
          column: {
            include: {
              board: true
            }
          },
          assignee: {
            select: {
              id: true,
              name: true,
              email: true,
              avatarUrl: true
            }
          }
        }
      });
      
      return task;
    } catch (error) {
      console.error(`Erreur lors de la récupération de la tâche ${id}:`, error);
      return null;
    }
  }

  /**
   * Récupérer toutes les tâches d'un utilisateur
   */
  async getAllTasksForUser(userId: string): Promise<TaskWithRelations[]> {
    try {
      if (!this.prisma) {
        console.error("PrismaClient n'est pas initialisé");
        return [];
      }
      
      const tasks = await this.prisma.task.findMany({
        where: {
          column: {
            board: {
              ownerId: userId
            }
          }
        },
        include: {
          column: {
            include: {
              board: true
            }
          },
          assignee: {
            select: {
              id: true,
              name: true,
              email: true,
              avatarUrl: true
            }
          }
        }
      });
      
      return tasks;
    } catch (error) {
      console.error(`Erreur lors de la récupération des tâches pour l'utilisateur ${userId}:`, error);
      return [];
    }
  }

  /**
   * Vérifier si une colonne existe et appartient au même tableau
   */
  async verifyColumnInSameBoard(columnId: string, boardId: string): Promise<boolean> {
    try {
      if (!this.prisma) {
        console.error("PrismaClient n'est pas initialisé");
        return false;
      }
      
      const column = await this.prisma.column.findUnique({
        where: {
          id: columnId,
          boardId: boardId
        }
      });
      
      return !!column;
    } catch (error) {
      console.error(`Erreur lors de la vérification de la colonne ${columnId}:`, error);
      return false;
    }
  }

  /**
   * Ajuster les positions après un déplacement de tâche entre colonnes
   */
  async adjustPositionsForColumnChange(
    sourceColumnId: string,
    sourcePosition: number,
    targetColumnId: string,
    targetPosition: number
  ): Promise<boolean> {
    try {
      if (!this.prisma) {
        console.error("PrismaClient n'est pas initialisé");
        return false;
      }
      
      // Ajuster les positions dans l'ancienne colonne
      await this.prisma.task.updateMany({
        where: {
          columnId: sourceColumnId,
          position: {
            gt: sourcePosition
          }
        },
        data: {
          position: {
            decrement: 1
          }
        }
      });

      // Ajuster les positions dans la nouvelle colonne
      await this.prisma.task.updateMany({
        where: {
          columnId: targetColumnId,
          position: {
            gte: targetPosition
          }
        },
        data: {
          position: {
            increment: 1
          }
        }
      });
      
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'ajustement des positions pour le changement de colonne:', error);
      return false;
    }
  }

  /**
   * Ajuster les positions dans la même colonne
   */
  async adjustPositionsInSameColumn(
    columnId: string,
    oldPosition: number,
    newPosition: number
  ): Promise<boolean> {
    try {
      if (!this.prisma) {
        console.error("PrismaClient n'est pas initialisé");
        return false;
      }
      
      if (newPosition > oldPosition) {
        // Déplacer vers le bas - ajuster les tâches entre l'ancienne et la nouvelle position
        await this.prisma.task.updateMany({
          where: {
            columnId: columnId,
            position: {
              gt: oldPosition,
              lte: newPosition
            }
          },
          data: {
            position: {
              decrement: 1
            }
          }
        });
      } else {
        // Déplacer vers le haut - ajuster les tâches entre la nouvelle et l'ancienne position
        await this.prisma.task.updateMany({
          where: {
            columnId: columnId,
            position: {
              gte: newPosition,
              lt: oldPosition
            }
          },
          data: {
            position: {
              increment: 1
            }
          }
        });
      }
      
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'ajustement des positions dans la même colonne:', error);
      return false;
    }
  }

  /**
   * Mettre à jour une tâche
   */
  async updateTask(id: string, data: any): Promise<TaskWithRelations | null> {
    try {
      if (!this.prisma) {
        console.error("PrismaClient n'est pas initialisé");
        return null;
      }
      
      const task = await this.prisma.task.update({
        where: { id },
        data,
        include: {
          assignee: {
            select: {
              id: true,
              name: true,
              email: true,
              avatarUrl: true
            }
          }
        }
      });
      
      return task;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de la tâche ${id}:`, error);
      return null;
    }
  }

  /**
   * Supprimer une tâche
   */
  async deleteTask(id: string): Promise<boolean> {
    try {
      if (!this.prisma) {
        console.error("PrismaClient n'est pas initialisé");
        return false;
      }
      
      await this.prisma.task.delete({
        where: { id }
      });
      
      return true;
    } catch (error) {
      console.error(`Erreur lors de la suppression de la tâche ${id}:`, error);
      return false;
    }
  }

  /**
   * Ajuster les positions après suppression d'une tâche
   */
  async adjustPositionsAfterDelete(columnId: string, position: number): Promise<boolean> {
    try {
      if (!this.prisma) {
        console.error("PrismaClient n'est pas initialisé");
        return false;
      }
      
      await this.prisma.task.updateMany({
        where: {
          columnId,
          position: {
            gt: position
          }
        },
        data: {
          position: {
            decrement: 1
          }
        }
      });
      
      return true;
    } catch (error) {
      console.error(`Erreur lors de l'ajustement des positions après suppression pour la colonne ${columnId}:`, error);
      return false;
    }
  }

  /**
   * Exécuter plusieurs opérations sur les tâches dans une transaction
   */
  async executeTransaction<T>(callback: (prismaClient: PrismaClient) => Promise<T>): Promise<boolean> {
    try {
      if (!this.prisma) {
        console.error("PrismaClient n'est pas initialisé");
        return false;
      }
      
      await this.prisma.$transaction(async (prismaClient) => {
        // Using type assertion here to handle the transaction context correctly
        await callback(prismaClient as unknown as PrismaClient);
      });
      
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'exécution d\'une transaction:', error);
      return false;
    }
  }
}

// Créer une instance singleton du repository
export const taskRepository = new TaskRepository();
