// filepath: /home/amine/git/aletwork/Taskwave/client/src/store/useBoardStore.ts
import { create } from 'zustand';
import type { BoardData, NewBoardData, BoardSortOption } from '@/types/board.types';
import type { Column } from '@/types/kanban.types';
import { boardService } from '@/services/boardService';
import { filterAndSortBoards } from '@/lib/board';
import { getAuthToken } from '@/lib/auth';
import { BOARD_DEFAULT } from '@/constants/board';

// Interface pour le state du store des tableaux
interface BoardState {
  boards: BoardData[];
  filteredBoards: BoardData[];
  currentBoard: BoardData | null;
  columns: Column[]; // Stockage des colonnes récupérées par getBoardDetails
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  sortOption: BoardSortOption;
}

// État initial
const initialState: BoardState = {
  boards: [],
  filteredBoards: [],
  currentBoard: null,
  columns: [],
  isLoading: false,
  error: null,
  searchQuery: BOARD_DEFAULT.SEARCH_QUERY,
  sortOption: BOARD_DEFAULT.SORT_OPTION,
};

// Création du store avec Zustand (sans persistance)
export const useBoardStore = create<
  BoardState & {
    fetchBoards: () => Promise<void>;
    fetchBoardDetails: (boardId: string) => Promise<void>;
    createBoard: (boardData: NewBoardData) => Promise<BoardData | null>;
    updateBoard: (boardId: string, boardData: Partial<BoardData>) => Promise<BoardData | null>;
    deleteBoard: (boardId: string) => Promise<boolean>;
    setSearchQuery: (query: string) => void;
    setSortOption: (option: BoardSortOption) => void;
    setError: (error: string | null) => void;
    setLoading: (isLoading: boolean) => void;
    resetState: () => void;
  }
>((set) => ({
  ...initialState,
  fetchBoards: async () => {
    set({ isLoading: true, error: null });
    try {
      const token = getAuthToken();
      const boards = await boardService.getAllBoards(token);
      set((state) => ({
        boards,
        filteredBoards: filterAndSortBoards(boards, state.searchQuery, state.sortOption),
        isLoading: false,
      }));
    } catch (error) {
      console.error('Error fetching boards:', error);
      set({ isLoading: false, error: 'Error fetching boards' });
    }
  },
  fetchBoardDetails: async (boardId) => {
    set({ isLoading: true, error: null });
    try {
      const token = getAuthToken();
      const board = await boardService.getBoardDetails(boardId, token);
      
      // Extraire les colonnes du tableau si elles existent
      const columns = board.columns || [];
      
      set({ 
        currentBoard: board, 
        columns: columns,
        isLoading: false 
      });
    } catch (error: unknown) {
      const err = error instanceof Error ? error : new Error(String(error));
      console.error(`Error fetching board details for ${boardId}:`, err);
      
      // Gestion spécifique des erreurs réseau
      if (error instanceof TypeError && (
        error.message.includes("fetch") || 
        error.message.includes("Network") ||
        error.message.includes("Failed to fetch")
      )) {
        set({ isLoading: false, error: 'failed to fetch' });
      } 
      // Gestion des erreurs HTTP spécifiques
      else if (err.message.includes('Tableau non trouvé')) {
        set({ isLoading: false, error: 'Tableau non trouvé' });
      }
      else if (err.message.includes('Accès refusé')) {
        set({ isLoading: false, error: 'Accès refusé à ce tableau' });
      }
      // Utilise le message d'erreur de l'API si disponible
      else if (err.message) {
        set({ isLoading: false, error: err.message });
      }
      // Fallback message
      else {
        set({ isLoading: false, error: 'Impossible de charger les détails du tableau' });
      }
    }
  },
  createBoard: async (boardData) => {
    set({ isLoading: true, error: null });
    try {
      const token = getAuthToken();
      const newBoard = await boardService.createBoard(boardData, token);
      set((state) => {
        const updatedBoards = [...state.boards, newBoard];
        return {
          boards: updatedBoards,
          filteredBoards: filterAndSortBoards(updatedBoards, state.searchQuery, state.sortOption),
          isLoading: false,
        };
      });
      return newBoard;
    } catch (error) {
      console.error('Error creating board:', error);
      set({ isLoading: false, error: 'Error creating board' });
      return null;
    }
  },
  updateBoard: async (boardId, boardData) => {
    set({ isLoading: true, error: null });
    try {
      const token = getAuthToken();
      const updatedBoard = await boardService.updateBoard(boardId, boardData, token);
      set((state) => {
        const updatedBoards = state.boards.map((board) =>
          board.id === boardId ? { ...board, ...updatedBoard } : board
        );
        return {
          boards: updatedBoards,
          currentBoard: state.currentBoard?.id === boardId ? updatedBoard : state.currentBoard,
          filteredBoards: filterAndSortBoards(updatedBoards, state.searchQuery, state.sortOption),
          isLoading: false,
        };
      });
      return updatedBoard;
    } catch (error) {
      console.error(`Error updating board ${boardId}:`, error);
      set({ isLoading: false, error: 'Error updating board' });
      return null;
    }
  },
  deleteBoard: async (boardId) => {
    set({ isLoading: true, error: null });
    try {
      const token = getAuthToken();
      const success = await boardService.deleteBoard(boardId, token);
      if (success) {
        set((state) => {
          const updatedBoards = state.boards.filter((b) => b.id !== boardId);
          return {
            boards: updatedBoards,
            filteredBoards: filterAndSortBoards(updatedBoards, state.searchQuery, state.sortOption),
            currentBoard: state.currentBoard?.id === boardId ? null : state.currentBoard,
            isLoading: false,
          };
        });
        return true;
      }
      throw new Error('Failed to delete board');
    } catch (error) {
      console.error(`Error deleting board ${boardId}:`, error);
      set({ isLoading: false, error: 'Error deleting board' });
      return false;
    }
  },
  setSearchQuery: (query) => {
    set((state) => ({
      searchQuery: query,
      filteredBoards: filterAndSortBoards(state.boards, query, state.sortOption),
    }));
  },
  setSortOption: (option) => {
    set((state) => ({
      sortOption: option,
      filteredBoards: filterAndSortBoards(state.boards, state.searchQuery, option),
    }));
  },
  setError: (error) => set({ error }),
  setLoading: (isLoading) => set({ isLoading }),
  resetState: () => set(initialState),
  
}));
