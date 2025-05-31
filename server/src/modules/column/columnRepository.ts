import { PrismaClient, Column } from '@prisma/client';
import { prisma } from '../../server';

export type ColumnWithBoard = Column & {
  board: {
    id: string;
    ownerId: string;
    title: string;
  };
};

export class ColumnRepository {
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
   * Vérifier si un tableau existe et appartient à un utilisateur
   */
  async verifyBoardOwnership(boardId: string, userId: string): Promise<boolean> {
    try {
      if (!this.prisma) {
        console.error("PrismaClient n'est pas initialisé");
        return false;
      }
      
      const board = await this.prisma.board.findUnique({
        where: {
          id: boardId,
          ownerId: userId
        }
      });
      
      return !!board;
    } catch (error) {
      console.error(`Erreur lors de la vérification du tableau ${boardId}:`, error);
      return false;
    }
  }

  /**
   * Compter les colonnes d'un tableau
   */
  async countColumns(boardId: string): Promise<number> {
    try {
      if (!this.prisma) {
        console.error("PrismaClient n'est pas initialisé");
        return 0;
      }
      
      return await this.prisma.column.count({
        where: { boardId }
      });
    } catch (error) {
      console.error(`Erreur lors du comptage des colonnes pour le tableau ${boardId}:`, error);
      return 0;
    }
  }

  /**
   * Ajuster les positions des colonnes lors de l'insertion
   */
  async adjustColumnPositionsForInsert(boardId: string, position: number): Promise<boolean> {
    try {
      if (!this.prisma) {
        console.error("PrismaClient n'est pas initialisé");
        return false;
      }
      
      await this.prisma.column.updateMany({
        where: {
          boardId,
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
      console.error(`Erreur lors de l'ajustement des positions pour le tableau ${boardId}:`, error);
      return false;
    }
  }

  /**
   * Créer une nouvelle colonne
   */
  async createColumn(data: {
    title: string;
    boardId: string;
    position: number;
    color?: string | null;
  }): Promise<Column | null> {
    try {
      if (!this.prisma) {
        console.error("PrismaClient n'est pas initialisé");
        return null;
      }
      
      const column = await this.prisma.column.create({
        data: {
          title: data.title,
          position: data.position,
          color: data.color,
          board: {
            connect: { id: data.boardId }
          }
        }
      });
      
      return column;
    } catch (error) {
      console.error('Erreur lors de la création de la colonne:', error);
      return null;
    }
  }

  /**
   * Récupérer une colonne avec les informations du tableau associé
   */
  async getColumnWithBoard(id: string): Promise<ColumnWithBoard | null> {
    try {
      if (!this.prisma) {
        console.error("PrismaClient n'est pas initialisé");
        return null;
      }
      
      const column = await this.prisma.column.findUnique({
        where: { id },
        include: {
          board: true
        }
      });
      
      return column;
    } catch (error) {
      console.error(`Erreur lors de la récupération de la colonne ${id}:`, error);
      return null;
    }
  }

  /**
   * Récupérer toutes les colonnes d'un tableau
   */
  async getColumnsForBoard(boardId: string): Promise<Column[] | null> {
    try {
      if (!this.prisma) {
        console.error("PrismaClient n'est pas initialisé");
        return null;
      }
      
      const columns = await this.prisma.column.findMany({
        where: { boardId },
        orderBy: {
          position: 'asc'
        }
      });
      
      return columns;
    } catch (error) {
      console.error(`Erreur lors de la récupération des colonnes pour le tableau ${boardId}:`, error);
      return null;
    }
  }

  /**
   * Mettre à jour une colonne
   */
  async updateColumn(id: string, data: {
    title?: string;
    position?: number;
    color?: string | null;
  }): Promise<Column | null> {
    try {
      if (!this.prisma) {
        console.error("PrismaClient n'est pas initialisé");
        return null;
      }
      
      const column = await this.prisma.column.update({
        where: { id },
        data
      });
      
      return column;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de la colonne ${id}:`, error);
      return null;
    }
  }

  /**
   * Récupérer toutes les colonnes d'un tableau dans l'ordre
   */
  async getAllColumnsForBoard(boardId: string): Promise<Column[] | null> {
    try {
      if (!this.prisma) {
        console.error("PrismaClient n'est pas initialisé");
        return null;
      }
      
      const columns = await this.prisma.column.findMany({
        where: {
          boardId
        },
        orderBy: {
          position: 'asc'
        }
      });
      
      return columns;
    } catch (error) {
      console.error(`Erreur lors de la récupération des colonnes pour le tableau ${boardId}:`, error);
      return null;
    }
  }

  /**
   * Réparer les positions des colonnes
   */
  async repairColumnPositions(columns: Column[]): Promise<boolean> {
    try {
      if (!this.prisma) {
        console.error("PrismaClient n'est pas initialisé");
        return false;
      }
      
      const repairs = columns.map((col, index) => {
        return this.prisma.column.update({
          where: { id: col.id },
          data: { position: index + 1 }
        });
      });
      
      await Promise.all(repairs);
      return true;
    } catch (error) {
      console.error('Erreur lors de la réparation des positions:', error);
      return false;
    }
  }

  /**
   * Supprimer une colonne
   */
  async deleteColumn(id: string): Promise<boolean> {
    try {
      if (!this.prisma) {
        console.error("PrismaClient n'est pas initialisé");
        return false;
      }
      
      await this.prisma.column.delete({
        where: { id }
      });
      
      return true;
    } catch (error) {
      console.error(`Erreur lors de la suppression de la colonne ${id}:`, error);
      return false;
    }
  }

  /**
   * Ajuster les positions après la suppression d'une colonne
   */
  async adjustColumnPositionsAfterDelete(boardId: string, deletedPosition: number): Promise<boolean> {
    try {
      if (!this.prisma) {
        console.error("PrismaClient n'est pas initialisé");
        return false;
      }
      
      await this.prisma.column.updateMany({
        where: {
          boardId,
          position: {
            gt: deletedPosition
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
      console.error(`Erreur lors de l'ajustement des positions après suppression pour le tableau ${boardId}:`, error);
      return false;
    }
  }

  /**
   * Gérer le déplacement d'une colonne (changement de position)
   */
  async moveColumn(columnId: string, currentPosition: number, targetPosition: number, boardId: string): Promise<boolean> {
    try {
      if (!this.prisma) {
        console.error("PrismaClient n'est pas initialisé");
        return false;
      }
      
      // Si on déplace une colonne vers une position inférieure (vers le début du tableau)
      if (targetPosition < currentPosition) {
        await this.prisma.column.updateMany({
          where: {
            boardId,
            position: {
              gte: targetPosition,
              lt: currentPosition
            }
          },
          data: {
            position: {
              increment: 1
            }
          }
        });
      } 
      // Si on déplace une colonne vers une position supérieure (vers la fin du tableau)
      else if (targetPosition > currentPosition) {
        await this.prisma.column.updateMany({
          where: {
            boardId,
            position: {
              gt: currentPosition,
              lte: targetPosition
            }
          },
          data: {
            position: {
              decrement: 1
            }
          }
        });
      }
      
      // Mettre à jour la position de la colonne déplacée en dernier
      await this.prisma.column.update({
        where: { id: columnId },
        data: { position: targetPosition }
      });
      
      return true;
    } catch (error) {
      console.error(`Erreur lors du déplacement de la colonne ${columnId}:`, error);
      return false;
    }
  }

  /**
   * Exécuter plusieurs opérations sur les colonnes dans une transaction
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
export const columnRepository = new ColumnRepository();
