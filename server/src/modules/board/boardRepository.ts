import { PrismaClient, Board, Column, Task } from '@prisma/client';
import { prisma } from '../../server';

// Définir des types enrichis pour les retours de requêtes avec relations
export type BoardWithRelations = Board & {
  columns: (Column & {
    tasks: Task[]
  })[];
};

export class BoardRepository {
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
   * Créer un nouveau tableau
   */
  async createBoard(data: {
    title: string;
    description?: string | null;
    backgroundColor?: string | null;
    ownerId: string;
  }): Promise<Board | null> {
    try {
      if (!this.prisma) {
        console.error("PrismaClient n'est pas initialisé");
        return null;
      }
      
      const board = await this.prisma.board.create({
        data: {
          title: data.title,
          description: data.description,
          backgroundColor: data.backgroundColor,
          owner: { connect: { id: data.ownerId } }
        }
      });
      
      return board;
    } catch (error) {
      console.error('Erreur lors de la création du tableau:', error);
      return null;
    }
  }

  /**
   * Récupérer tous les tableaux d'un utilisateur
   */
  async getBoardsByUserId(userId: string): Promise<BoardWithRelations[] | null> {
    try {
      if (!this.prisma) {
        console.error("PrismaClient n'est pas initialisé");
        return null;
      }
      
      const boards = await this.prisma.board.findMany({
        where: {
          ownerId: userId
        },
        orderBy: {
          updatedAt: 'desc'
        },
        include: {
          columns: {
            include: {
              tasks: true
            }
          }
        }
      });
      
      return boards;
    } catch (error) {
      console.error('Erreur lors de la récupération des tableaux:', error);
      return null;
    }
  }

  /**
   * Récupérer un tableau spécifique avec toutes ses données
   */
  async getBoardById(id: string, userId: string): Promise<BoardWithRelations | null> {
    try {
      if (!this.prisma) {
        console.error("PrismaClient n'est pas initialisé");
        return null;
      }
      
      const board = await this.prisma.board.findUnique({
        where: {
          id,
          ownerId: userId
        },
        include: {
          columns: {
            orderBy: {
              position: 'asc'
            },
            include: {
              tasks: {
                orderBy: {
                  position: 'asc'
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
              }
            }
          }
        }
      });
      
      return board;
    } catch (error) {
      console.error(`Erreur lors de la récupération du tableau ${id}:`, error);
      return null;
    }
  }

  /**
   * Mettre à jour un tableau
   */
  async updateBoard(id: string, userId: string, data: {
    title?: string;
    description?: string | null;
    backgroundColor?: string | null;
  }): Promise<Board | null> {
    try {
      if (!this.prisma) {
        console.error("PrismaClient n'est pas initialisé");
        return null;
      }
      
      // Vérifier si le tableau existe et appartient à l'utilisateur
      const existingBoard = await this.prisma.board.findUnique({
        where: {
          id,
          ownerId: userId
        }
      });

      if (!existingBoard) {
        return null;
      }

      const updatedBoard = await this.prisma.board.update({
        where: { id },
        data
      });
      
      return updatedBoard;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du tableau ${id}:`, error);
      return null;
    }
  }

  /**
   * Supprimer un tableau
   */
  async deleteBoard(id: string, userId: string): Promise<boolean> {
    try {
      if (!this.prisma) {
        console.error("PrismaClient n'est pas initialisé");
        return false;
      }
      
      // Vérifier si le tableau existe et appartient à l'utilisateur
      const existingBoard = await this.prisma.board.findUnique({
        where: {
          id,
          ownerId: userId
        }
      });

      if (!existingBoard) {
        return false;
      }

      await this.prisma.board.delete({
        where: { id }
      });
      
      return true;
    } catch (error) {
      console.error(`Erreur lors de la suppression du tableau ${id}:`, error);
      return false;
    }
  }
}

// Créer une instance singleton du repository
export const boardRepository = new BoardRepository();
