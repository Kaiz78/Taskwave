import { Column, PrismaClient } from '@prisma/client';
import { ColumnRepository, ColumnWithBoard, columnRepository } from './columnRepository';

export class ColumnService {
  private repository: ColumnRepository;

  constructor(repository: ColumnRepository = columnRepository) {
    this.repository = repository;
  }

  /**
   * Vérifier si un tableau existe et appartient à un utilisateur
   */
  async verifyBoardOwnership(boardId: string, userId: string): Promise<boolean> {
    return this.repository.verifyBoardOwnership(boardId, userId);
  }

  /**
   * Créer une nouvelle colonne
   */
  async createColumn(data: {
    title: string;
    boardId: string;
    position?: number;
    color?: string | null;
  }, userId: string): Promise<Column | null> {
    // Vérifier si le tableau appartient à l'utilisateur
    const boardExists = await this.repository.verifyBoardOwnership(data.boardId, userId);
    if (!boardExists) {
      return null;
    }

    // Déterminer la position de la colonne
    let finalPosition = data.position;
    if (finalPosition === undefined || finalPosition < 1) {
      const columnCount = await this.repository.countColumns(data.boardId);
      finalPosition = columnCount === 0 ? 1 : columnCount + 1;
    }

    // Ajuster les positions des colonnes existantes
    await this.repository.adjustColumnPositionsForInsert(data.boardId, finalPosition);

    // Créer la colonne
    return this.repository.createColumn({
      title: data.title,
      boardId: data.boardId,
      position: finalPosition,
      color: data.color
    });
  }

  /**
   * Récupérer une colonne avec les informations du tableau associé
   */
  async getColumnWithBoard(id: string, userId: string): Promise<ColumnWithBoard | null> {
    const column = await this.repository.getColumnWithBoard(id);
    
    // Vérifier si la colonne existe et appartient à l'utilisateur
    if (!column || column.board.ownerId !== userId) {
      return null;
    }
    
    return column;
  }

  /**
   * Récupérer toutes les colonnes d'un tableau
   */
  async getColumnsForBoard(boardId: string): Promise<Column[] | null> {
    return this.repository.getColumnsForBoard(boardId);
  }

  /**
   * Mettre à jour une colonne
   */
  async updateColumn(id: string, userId: string, data: {
    title?: string;
    position?: number;
    color?: string | null;
  }): Promise<Column | null> {
    // Récupérer la colonne avec les informations du tableau
    const column = await this.repository.getColumnWithBoard(id);
    
    // Vérifier si la colonne existe et appartient à l'utilisateur
    if (!column || column.board.ownerId !== userId) {
      return null;
    }

    // Si la position doit être mise à jour, gérer le réarrangement
    if (data.position !== undefined && data.position !== column.position) {
      const targetPosition = Math.max(1, data.position);
      
      try {
        await this.repository.executeTransaction(async (prismaClient) => {
          // Récupérer toutes les colonnes pour vérifier les positions
          const allColumns = await prismaClient.column.findMany({
            where: {
              boardId: column.boardId
            },
            orderBy: {
              position: 'asc'
            }
          });
          
          // Vérifier et réparer les positions si nécessaire
          const hasZeroPositions = allColumns.some(col => col.position === 0);
          if (hasZeroPositions) {
            await this.repository.repairColumnPositions(allColumns);
            
            // Rafraîchir notre colonne avec la nouvelle position
            const updatedColumn = await prismaClient.column.findUnique({
              where: { id: column.id }
            });
            if (updatedColumn) {
              column.position = updatedColumn.position;
            }
          }
          
          // Déplacer la colonne à la nouvelle position
          await this.repository.moveColumn(
            column.id, 
            column.position, 
            targetPosition, 
            column.boardId
          );
          
          // Vérification finale de l'intégrité des positions
          const updatedColumns = await prismaClient.column.findMany({
            where: { boardId: column.boardId },
            orderBy: { position: 'asc' }
          });
          
          // Vérifier s'il y a des positions en double et réparer si nécessaire
          const positions = updatedColumns.map(col => col.position);
          const uniquePositions = [...new Set(positions)];
          if (positions.length !== uniquePositions.length) {
            await this.repository.repairColumnPositions(updatedColumns);
          }
        });
      } catch (error) {
        console.error('Erreur lors de la mise à jour des positions:', error);
        return null;
      }
    }

    // Mettre à jour les autres champs de la colonne
    return this.repository.updateColumn(id, {
      title: data.title,
      color: data.color,
      position: data.position !== undefined ? Math.max(1, data.position) : column.position
    });
  }

  /**
   * Supprimer une colonne
   */
  async deleteColumn(id: string, userId: string): Promise<boolean> {
    // Récupérer la colonne avec les informations du tableau
    const column = await this.repository.getColumnWithBoard(id);
    
    // Vérifier si la colonne existe et appartient à l'utilisateur
    if (!column || column.board.ownerId !== userId) {
      return false;
    }

    // Utiliser une transaction pour garantir l'atomicité des opérations
    return this.repository.executeTransaction(async (prismaClient) => {
      // Supprimer la colonne
      await prismaClient.column.delete({
        where: { id }
      });

      // Réajuster les positions des autres colonnes
      await this.repository.adjustColumnPositionsAfterDelete(column.boardId, column.position);

      // Vérifier que toutes les colonnes ont des positions valides
      const remainingColumns = await prismaClient.column.findMany({
        where: { boardId: column.boardId },
        orderBy: { position: 'asc' }
      });

      if (remainingColumns.length > 0) {
        // Vérifier si la première position est bien 1
        const minPosition = Math.min(...remainingColumns.map(col => col.position));
        
        if (minPosition > 1) {
          await this.repository.repairColumnPositions(remainingColumns);
        }
      }
    });
  }
}

// Exporter une instance singleton du service
export const columnService = new ColumnService();
