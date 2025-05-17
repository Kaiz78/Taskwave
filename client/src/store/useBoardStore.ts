import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { BoardData, NewBoardData, BoardSortOption } from '@/types/board.types';
import { boardService } from '@/services/boardService';

// Fonction utilitaire pour filtrer et trier les tableaux
function applyFilters(
  boards: BoardData[], 
  searchQuery: string, 
  sortOption: BoardSortOption
): BoardData[] {
  // Filtrer par recherche
  let filtered = boards;
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filtered = boards.filter(board => 
      board.title.toLowerCase().includes(query) || 
      (board.description && board.description.toLowerCase().includes(query))
    );
  }
  
  // Appliquer le tri
  return [...filtered].sort((a, b) => {
    switch (sortOption) {
      case "newest":
        return b.createdAt.getTime() - a.createdAt.getTime();
      case "oldest":
        return a.createdAt.getTime() - b.createdAt.getTime();
      case "name-asc":
        return a.title.localeCompare(b.title);
      case "name-desc":
        return b.title.localeCompare(a.title);
      default:
        return 0;
    }
  });
}

// Interface pour le state du store des tableaux
interface BoardState {
  boards: BoardData[];
  filteredBoards: BoardData[];
  currentBoard: BoardData | null;
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
  isLoading: false,
  error: null,
  searchQuery: '',
  sortOption: 'newest',
};

// Création du store avec Zustand
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
>()(
  persist(
    (set) => ({
      ...initialState,
      fetchBoards: async () => {
        set({ isLoading: true, error: null });
        try {
          const authStore = localStorage.getItem('auth-storage');
          const token = authStore ? JSON.parse(authStore).state.token : null;
          const boards = await boardService.getAllBoards(token);
          set((state) => ({
            boards,
            filteredBoards: applyFilters(boards, state.searchQuery, state.sortOption),
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
          const authStore = localStorage.getItem('auth-storage');
          const token = authStore ? JSON.parse(authStore).state.token : null;
          const board = await boardService.getBoardDetails(boardId, token);
          set({ currentBoard: board, isLoading: false });
        } catch (error) {
          console.error(`Error fetching board details for ${boardId}:`, error);
          set({ isLoading: false, error: 'Error fetching board details' });
        }
      },
      createBoard: async (boardData) => {
        set({ isLoading: true, error: null });
        try {
          const authStore = localStorage.getItem('auth-storage');
          const token = authStore ? JSON.parse(authStore).state.token : null;
          const newBoard = await boardService.createBoard(boardData, token);
          set((state) => {
            const updatedBoards = [...state.boards, newBoard];
            return {
              boards: updatedBoards,
              filteredBoards: applyFilters(updatedBoards, state.searchQuery, state.sortOption),
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
          const authStore = localStorage.getItem('auth-storage');
          const token = authStore ? JSON.parse(authStore).state.token : null;
          const updatedBoard = await boardService.updateBoard(boardId, boardData, token);
          set((state) => {
            const updatedBoards = state.boards.map((board) =>
              board.id === boardId ? { ...board, ...updatedBoard } : board
            );
            return {
              boards: updatedBoards,
              currentBoard: state.currentBoard?.id === boardId ? updatedBoard : state.currentBoard,
              filteredBoards: applyFilters(updatedBoards, state.searchQuery, state.sortOption),
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
          const authStore = localStorage.getItem('auth-storage');
          const token = authStore ? JSON.parse(authStore).state.token : null;
          const success = await boardService.deleteBoard(boardId, token);
          if (success) {
            set((state) => {
              const updatedBoards = state.boards.filter((board) => board.id !== boardId);
              return {
                boards: updatedBoards,
                currentBoard: state.currentBoard?.id === boardId ? null : state.currentBoard,
                filteredBoards: applyFilters(updatedBoards, state.searchQuery, state.sortOption),
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
          filteredBoards: applyFilters(state.boards, query, state.sortOption),
        }));
      },
      setSortOption: (option) => {
        set((state) => ({
          sortOption: option,
          filteredBoards: applyFilters(state.boards, state.searchQuery, option),
        }));
      },
      setError: (error) => set({ error }),
      setLoading: (isLoading) => set({ isLoading }),
      resetState: () => set(initialState),
    }),
    {
      name: 'board-storage',
      partialize: (state) => ({
        boards: state.boards,
        currentBoard: state.currentBoard,
        sortOption: state.sortOption,
      }),
    }
  )
);
