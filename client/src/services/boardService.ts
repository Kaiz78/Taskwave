import type { BoardData, NewBoardData } from '@/types/board.types';

// API Base URL - utilise la même que celle définie dans api.ts
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Service pour gérer les appels API liés aux tableaux
 */
export const boardService = {
  /**
   * Récupère tous les tableaux de l'utilisateur
   */
  async getAllBoards(token?: string): Promise<BoardData[]> {
    try {
      // En mode développement, si pas de token, retourner des données fictives
      if (!token && import.meta.env.DEV) {
        // Simulation d'un délai réseau
        await new Promise(resolve => setTimeout(resolve, 300));
        
        return [
          {
            id: "1",
            title: "Développement Taskwave",
            description: "Suivi du développement de la plateforme Taskwave",
            backgroundColor: "#3498db",
            columnsCount: 4,
            tasksCount: 12,
            createdAt: new Date(2025, 4, 10),
          },
          {
            id: "2",
            title: "Marketing Q2 2025",
            description: "Campagnes marketing pour le deuxième trimestre",
            backgroundColor: "#2ecc71",
            columnsCount: 3,
            tasksCount: 8,
            createdAt: new Date(2025, 4, 15),
          },
          {
            id: "3",
            title: "Idées de fonctionnalités",
            description: "Collection d'idées pour de nouvelles fonctionnalités à développer",
            backgroundColor: "#e74c3c",
            columnsCount: 2,
            tasksCount: 5,
            createdAt: new Date(2025, 4, 16),
          },
        ];
      }
      
      // Sinon, faire un appel API réel
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${API_BASE_URL}/boards`, {
        method: 'GET',
        headers
      });

      if (!response.ok) {
        throw new Error('Échec de la récupération des tableaux');
      }

      const data = await response.json();



      // Conversion des chaînes de date en objets Date
      return data?.data?.boards.map((board: Record<string, unknown>) => ({
        ...board,
        createdAt: new Date(board.createdAt as string)
      }));
      
    } catch (error) {
      console.error('Erreur lors de la récupération des tableaux:', error);
      throw error;
    }
  },

  /**
   * Crée un nouveau tableau
   */
  async createBoard(boardData: NewBoardData, token?: string): Promise<BoardData> {
    try {
      // En mode développement, si pas de token, simuler la création
      if (!token && import.meta.env.DEV) {
        // Simulation d'un délai réseau
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Créer une fausse réponse
        const newBoard: BoardData = {
          id: `board-${Date.now()}`,
          title: boardData.title,
          description: boardData.description,
          backgroundColor: boardData.backgroundColor,
          columnsCount: 0,
          tasksCount: 0,
          createdAt: new Date()
        };
        
        return newBoard;
      }
      
      // Sinon, faire un appel API réel
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${API_BASE_URL}/boards`, {
        method: 'POST',
        headers,
        body: JSON.stringify(boardData)
      });

      if (!response.ok) {
        throw new Error('Échec de la création du tableau');
      }

      const data = await response.json();
      
      // Conversion des chaînes de date en objets Date
      return {
        ...data,
        createdAt: new Date(data.createdAt)
      };
      
    } catch (error) {
      console.error('Erreur lors de la création du tableau:', error);
      throw error;
    }
  },

  /**
   * Met à jour un tableau existant
   */
  async updateBoard(boardId: string, boardData: Partial<BoardData>, token?: string): Promise<BoardData> {
    try {
      // En mode développement, si pas de token, simuler la mise à jour
      if (!token && import.meta.env.DEV) {
        // Simulation d'un délai réseau
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Simuler une mise à jour réussie
        return {
          id: boardId,
          title: boardData.title || 'Tableau sans titre',
          description: boardData.description || '',
          backgroundColor: boardData.backgroundColor || '#3498db',
          columnsCount: boardData.columnsCount || 0,
          tasksCount: boardData.tasksCount || 0,
          createdAt: new Date()
        };
      }
      
      // Sinon, faire un appel API réel
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${API_BASE_URL}/boards/${boardId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(boardData)
      });

      if (!response.ok) {
        throw new Error('Échec de la mise à jour du tableau');
      }

      const data = await response.json();
      
      // Conversion des chaînes de date en objets Date
      return {
        ...data,
        createdAt: new Date(data.createdAt)
      };
      
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du tableau ${boardId}:`, error);
      throw error;
    }
  },

  /**
   * Supprime un tableau
   */
  async deleteBoard(boardId: string, token?: string): Promise<boolean> {
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
      
      const response = await fetch(`${API_BASE_URL}/boards/${boardId}`, {
        method: 'DELETE',
        headers
      });

      return response.ok;
      
    } catch (error) {
      console.error(`Erreur lors de la suppression du tableau ${boardId}:`, error);
      throw error;
    }
  },

  /**
   * Récupère les détails d'un tableau spécifique
   */
  async getBoardDetails(boardId: string, token?: string): Promise<BoardData> {
    try {
      // En mode développement, si pas de token, simuler la récupération
      if (!token && import.meta.env.DEV) {
        // Simulation d'un délai réseau
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Simuler une récupération réussie
        return {
          id: boardId,
          title: 'Tableau détaillé',
          description: 'Description du tableau récupéré',
          backgroundColor: '#3498db',
          columnsCount: 3,
          tasksCount: 8,
          createdAt: new Date()
        };
      }
      
      // Sinon, faire un appel API réel
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${API_BASE_URL}/boards/${boardId}`, {
        method: 'GET',
        headers
      });

      if (!response.ok) {
        throw new Error(`Tableau ${boardId} non trouvé`);
      }

      const data = await response.json();
      
      // Conversion des chaînes de date en objets Date
      return {
        ...data,
        createdAt: new Date(data.createdAt)
      };
      
    } catch (error) {
      console.error(`Erreur lors de la récupération des détails du tableau ${boardId}:`, error);
      throw error;
    }
  }
};
