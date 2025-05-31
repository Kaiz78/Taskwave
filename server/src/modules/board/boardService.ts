import { Board } from '@prisma/client';
import { BoardRepository, BoardWithRelations } from './boardRepository';

export class BoardService {
  private repository: BoardRepository;

  constructor(repository: BoardRepository) {
    this.repository = repository;
  }

  /**
   * Créer un nouveau tableau
   */
  async createBoard(userId: string, data: {
    title: string;
    description?: string | null;
    backgroundColor?: string | null;
  }): Promise<Board | null> {
    try {
      return await this.repository.createBoard({
        ...data,
        ownerId: userId
      });
    } catch (error) {
      console.error('Erreur dans le service lors de la création du tableau:', error);
      return null;
    }
  }

  /**
   * Récupérer tous les tableaux d'un utilisateur avec les statistiques
   */
  async getAllBoards(userId: string): Promise<Array<{
    id: string;
    title: string;
    description: string | null;
    backgroundColor: string | null;
    createdAt: Date;
    updatedAt: Date;
    columnsCount: number;
    tasksCount: number;
  }> | null> {
    try {
      const boards = await this.repository.getBoardsByUserId(userId);
      
      if (!boards) {
        return null;
      }

      // Transformer les données pour inclure les compteurs
      const boardsWithCounts = boards.map(board => {
        const columnsCount = board.columns.length;
        const tasksCount = board.columns.reduce((total, column) => {
          return total + column.tasks.length;
        }, 0);

        return {
          id: board.id,
          title: board.title,
          description: board.description,
          backgroundColor: board.backgroundColor,
          createdAt: board.createdAt,
          updatedAt: board.updatedAt,
          columnsCount,
          tasksCount
        };
      });
      
      return boardsWithCounts;
    } catch (error) {
      console.error('Erreur dans le service lors de la récupération des tableaux:', error);
      return null;
    }
  }

  /**
   * Récupérer un tableau spécifique avec toutes ses données
   */
  async getBoardById(boardId: string, userId: string): Promise<BoardWithRelations | null> {
    try {
      return await this.repository.getBoardById(boardId, userId);
    } catch (error) {
      console.error(`Erreur dans le service lors de la récupération du tableau ${boardId}:`, error);
      return null;
    }
  }

  /**
   * Mettre à jour un tableau
   */
  async updateBoard(boardId: string, userId: string, data: {
    title?: string;
    description?: string | null;
    backgroundColor?: string | null;
  }): Promise<Board | null> {
    try {
      return await this.repository.updateBoard(boardId, userId, data);
    } catch (error) {
      console.error(`Erreur dans le service lors de la mise à jour du tableau ${boardId}:`, error);
      return null;
    }
  }

  /**
   * Supprimer un tableau
   */
  async deleteBoard(boardId: string, userId: string): Promise<boolean> {
    try {
      return await this.repository.deleteBoard(boardId, userId);
    } catch (error) {
      console.error(`Erreur dans le service lors de la suppression du tableau ${boardId}:`, error);
      return false;
    }
  }
}

// Créer une instance du service avec le repository injecté
import { boardRepository } from './boardRepository';
export const boardService = new BoardService(boardRepository);
