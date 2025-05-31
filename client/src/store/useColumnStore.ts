// filepath: /home/amine/git/aletwork/Taskwave/client/src/store/useColumnStore.ts
import { create } from 'zustand';
import type { BaseColumn } from '@/types/kanban.types';
import { columnService } from '@/services/columnService';
import { getAuthToken } from '@/lib/auth';

// Interface pour le state du store des colonnes (sans les tâches imbriquées)
interface ColumnState {
  columns: BaseColumn[];
  currentColumnId: string | null;
  editingColumn: BaseColumn | null;
  isLoading: boolean;
  error: string | null;
}

// Action types pour les colonnes
interface ColumnActions {
  fetchColumns: (boardId: string, token?: string) => Promise<void>;
  createColumn: (boardId: string, title: string, color?: string, token?: string) => Promise<BaseColumn | null>;
  updateColumn: (columnId: string, title?: string, color?: string, position?:number,token?: string) => Promise<BaseColumn | null>;
  deleteColumn: (columnId: string, token?: string) => Promise<boolean>;
  setEditingColumn: (column: BaseColumn | null) => void;
  setError: (error: string | null) => void;
  resetState: () => void;
}

// Type pour le store complet
type ColumnStore = ColumnState & ColumnActions;

// État initial du store
const initialState: ColumnState = {
  columns: [],
  currentColumnId: null,
  editingColumn: null,
  isLoading: false,
  error: null
};

// Création du store Zustand (sans persistance)
export const useColumnStore = create<ColumnStore>((set, get) => ({
  ...initialState,

  // Récupération des colonnes d'un tableau (sans les tâches imbriquées)
  fetchColumns: async (boardId: string, token?: string) => {
    set({ isLoading: true, error: null });
    try {
      const authToken = getAuthToken();
      // Récupérer les colonnes avec les tâches
      const fullColumns = await columnService.getBoardColumns(boardId, token || authToken);
      
      // Transformer les colonnes pour ne conserver que les propriétés de base (sans les tâches)
      const baseColumns: BaseColumn[] = fullColumns.map(column => ({
        id: column.id,
        title: column.title,
        position: column.position,
        boardId: column.boardId,
        createdAt: column.createdAt,
        updatedAt: column.updatedAt,
        color: column.color
      }));
      
      console.log(`ColumnStore: ${baseColumns.length} colonnes récupérées (sans tâches)`);
      set({ columns: baseColumns, isLoading: false });
    } catch (error) {
      console.error('Erreur lors de la récupération des colonnes:', error);
      set({
        error: error instanceof Error ? error.message : 'Erreur lors de la récupération des colonnes',
        isLoading: false
      });
    }
  },

  // Création d'une nouvelle colonne
  createColumn: async (boardId: string, title: string, color?: string, token?: string) => {
    set({ isLoading: true, error: null });
    try {
      const authStore = localStorage.getItem('auth-storage');
      const authToken = authStore ? JSON.parse(authStore).state.token : null;

      const existingColumns = get().columns;
      // S'assurer que la position commence à 1 (pas à 0)
      const maxPosition = existingColumns.length === 0 
        ? 0 
        : Math.max(...existingColumns.map(col => col.position || 0));
        
      const newPosition = maxPosition + 1;
      console.log(`Création de colonne avec position: ${newPosition}`);
      
      const fullColumn = await columnService.createColumn(
        boardId,
        {
          title,
          position: newPosition,
          boardId,
          color
        },
        token || authToken
      );

      // Extraire les propriétés de base de la nouvelle colonne 
      const newColumn: BaseColumn = {
        id: fullColumn.id,
        title: fullColumn.title,
        position: fullColumn.position,
        boardId: fullColumn.boardId,
        createdAt: fullColumn.createdAt,
        updatedAt: fullColumn.updatedAt,
        color: fullColumn.color
      };
      
      set(state => ({
        columns: [...state.columns, newColumn],
        isLoading: false,
      }));
      
      return newColumn;

    } catch (error) {
      console.error('Erreur lors de la création de la colonne:', error);
      set({
        error: error instanceof Error ? error.message : 'Erreur lors de la création de la colonne',
        isLoading: false
      });
      return null;
    }
  },

  // Mise à jour d'une colonne
  updateColumn: async (columnId: string, title?: string, color?: string, position?:number, token?: string) => {
    set({ isLoading: true, error: null });
    try {
      const authStore = localStorage.getItem('auth-storage');
      const authToken = authStore ? JSON.parse(authStore).state.token : null;
      
      // Récupérer la colonne existante
      const existingColumn = get().columns.find(c => c.id === columnId);
      
      // Si la colonne n'existe pas dans le store local, on tente quand même de la mettre à jour
      // au lieu de lancer une erreur immédiatement
      let columnToUpdate = {
        title: title || '',
        position: position || 1,
        color: color || undefined
      };

      if (existingColumn) {
        columnToUpdate = {
          title: title || existingColumn.title,
          position: position ?? existingColumn.position,
          color: color || existingColumn.color
        };
      }

      const updatedColumn = await columnService.updateColumn(
        columnId,
        columnToUpdate,
        token || authToken
      );
      
      // Mettre à jour localement
      set(state => ({
        columns: state.columns.map(col => 
          col.id === columnId ? { ...col, ...updatedColumn } : col
        ),
        isLoading: false
      }));
      
      return updatedColumn;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de la colonne ${columnId}:`, error);
      set({
        error: error instanceof Error ? error.message : `Erreur lors de la mise à jour de la colonne ${columnId}`,
        isLoading: false
      });
      return null;
    }
  },

  // Suppression d'une colonne
  deleteColumn: async (columnId: string, token?: string) => {
    set({ isLoading: true, error: null });
    try {
      const authStore = localStorage.getItem('auth-storage');
      const authToken = authStore ? JSON.parse(authStore).state.token : null;
      
      await columnService.deleteColumn(columnId, token || authToken);
      
      // Mettre à jour localement
      set(state => ({
        columns: state.columns.filter(col => col.id !== columnId),
        isLoading: false
      }));
      
      return true;
    } catch (error) {
      console.error(`Erreur lors de la suppression de la colonne ${columnId}:`, error);
      set({
        error: error instanceof Error ? error.message : `Erreur lors de la suppression de la colonne ${columnId}`,
        isLoading: false
      });
      return false;
    }
  },

  // Définir la colonne en cours d'édition
  setEditingColumn: (column) => {
    set({ editingColumn: column });
  },
  
  // Définir le message d'erreur
  setError: (error) => {
    set({ error });
  },
  
  // Réinitialiser l'état
  resetState: () => {
    set(initialState);
  }
}));
