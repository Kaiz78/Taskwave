import type { Column, Task } from '@/types/kanban.types';

// API Base URL - utilise la même que celle définie dans api.ts
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Interface pour les nouvelles colonnes à créer
export interface NewColumnData {
  title: string;
  boardId: string;
  position?: number;
  color?: string;
}

/**
 * Service pour gérer les appels API liés aux colonnes
 */
export const columnService = {

  /**
   * Récupère les colonnes d'un tableau (utilise désormais boardService.getBoardDetails)
   * Cette fonction est maintenue pour la compatibilité avec le code existant
   */
  async getBoardColumns(boardId: string, token?: string): Promise<Column[]> {
    try {
      // Importer boardService ici pour éviter les dépendances circulaires
      const { boardService } = await import('./boardService');
      
      // On utilise désormais boardService.getBoardDetails qui récupère tout
      const board = await boardService.getBoardDetails(boardId, token);
      
      // Si la board contient des colonnes, on les retourne
      if (board.columns && Array.isArray(board.columns)) {
        return board.columns;
      }
      
      // Sinon retourner un tableau vide
      return [];
    } catch (error) {
      console.error(`Erreur lors de la récupération des colonnes pour le tableau ${boardId}:`, error);
      throw error;
    }
  },

  /**
   * Crée une nouvelle colonne
   */
  async createColumn(boardId: string, columnData: Omit<Column, 'id' | 'tasks' | 'createdAt' | 'updatedAt'>, token?: string): Promise<Column> {
    try {
      const newColumnData: NewColumnData = {
        ...columnData,
        boardId
      };

      console.log(token)
      

      // En mode développement, si pas de token, simuler la création
      if (!token && import.meta.env.DEV) {
        // Simulation d'un délai réseau
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const now = new Date();
        
        // Créer une fausse réponse
        const newColumn: Column = {
          id: `col-${Date.now()}`,
          ...columnData,
          boardId,
          tasks: [],
          createdAt: now,
          updatedAt: now
        };
        
        return newColumn;
      }
      
      // Sinon, faire un appel API réel
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
  
      const response = await fetch(`${API_BASE_URL}/columns`, {
        method: 'POST',
        headers,
        body: JSON.stringify(newColumnData)
      });




      if (!response.ok) {
        throw new Error('Échec de la création de la colonne');
      }

      const data = await response.json();
      
      // Traiter les dates si nécessaire
      const column = data.data.column;
      return {
        ...column,
        createdAt: new Date(column.createdAt),
        updatedAt: new Date(column.updatedAt),
        tasks: []
      };
      
    } catch (error) {
      console.error('Erreur lors de la création de la colonne:', error);
      throw error;
    }
  },

  /**
   * Met à jour une colonne existante
   */
  async updateColumn(columnId: string, columnData: Partial<Column>, token?: string): Promise<Column> {
    try {
      // En mode développement, si pas de token, simuler la mise à jour
      if (!token && import.meta.env.DEV) {
        // Simulation d'un délai réseau
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const now = new Date();
        
        // Simuler une mise à jour réussie
        return {
          id: columnId,
          boardId: columnData.boardId || "board-test",
          title: columnData.title || "Colonne sans titre",
          position: columnData.position || 0,
          tasks: [],
          createdAt: now,
          updatedAt: now,
          color: columnData.color
        };
      }
      
      // Sinon, faire un appel API réel
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${API_BASE_URL}/columns/${columnId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(columnData)
      });

      if (!response.ok) {
        throw new Error('Échec de la mise à jour de la colonne');
      }

      const data = await response.json();
      
      // Traiter les dates si nécessaire
      const column = data.data.column;
      return {
        ...column,
        createdAt: new Date(column.createdAt),
        updatedAt: new Date(column.updatedAt),
        tasks: (column.tasks || []).map((task: Task) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt),
          dueDate: task.dueDate ? new Date(task.dueDate) : undefined
        }))
      };
      
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de la colonne ${columnId}:`, error);
      throw error;
    }
  },

  /**
   * Supprime une colonne
   */
  async deleteColumn(columnId: string, token?: string): Promise<boolean> {
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
      
      const response = await fetch(`${API_BASE_URL}/columns/${columnId}`, {
        method: 'DELETE',
        headers
      });

      return response.ok;
      
    } catch (error) {
      console.error(`Erreur lors de la suppression de la colonne ${columnId}:`, error);
      throw error;
    }
  },

};
