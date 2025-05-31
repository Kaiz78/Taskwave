import { useState, useCallback, useMemo } from "react"; // Removed unused `useRef`
import { useColumnStore } from "@/store/useColumnStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useBoardStore } from "@/store/useBoardStore";
import { toast } from "sonner";
import type { EnhancedColumn } from "@/types/kanban.types";
import { 
  reorderColumns,
  generateColumnsKey,
  type ColumnEditState
} from "@/lib/kanban";

interface UseColumnHandlersProps {
  boardId?: string;
  enrichedColumns?: EnhancedColumn[]; // Accept enrichedColumns from parent
}

export function useColumnHandlers({ boardId, enrichedColumns = [] }: UseColumnHandlersProps) {
  const { token } = useAuthStore();
  const {
    fetchColumns,
    createColumn,
    updateColumn,
    deleteColumn,
  } = useColumnStore();

  const fetchBoardDetails = useBoardStore((state) => state.fetchBoardDetails);


  // États locaux pour les modaux
  const [columnModalOpen, setColumnModalOpen] = useState(false);
  const [editingColumnId, setEditingColumnId] = useState<string | null>(null);
  const [deleteColumnModalOpen, setDeleteColumnModalOpen] = useState(false);
  
  // États pour la modification de titre de colonne
  const [columnEditState, setColumnEditState] = useState<Record<string, ColumnEditState>>({});
  
  // Variable pour suivre si une suppression est en cours
  const [isDeletingColumn, setIsDeletingColumn] = useState(false);

  // Gestionnaires pour les modaux de colonnes
  const handleOpenColumnModal = useCallback((columnId?: string) => {
    if (columnId) {
      setEditingColumnId(columnId);
    } else {
      setEditingColumnId(null);
    }
    setColumnModalOpen(true);
  }, []);

  const handleCloseColumnModal = useCallback(() => {
    setColumnModalOpen(false);
    setEditingColumnId(null);
  }, []);

  // Gestionnaire spécifique pour fermer le modal de suppression
  const handleCloseDeleteColumnModal = useCallback(() => {
    setTimeout(() => {
      setDeleteColumnModalOpen(false);
      setTimeout(() => {
        setEditingColumnId(null);
      }, 300);
    }, 50);
  }, []);

  const handleAddColumn = useCallback(async (title: string) => {
    if (boardId) {
      await createColumn(boardId, title, undefined, token || undefined);
      handleCloseColumnModal();
      await fetchBoardDetails(boardId);
    }
  }, [boardId, createColumn, fetchBoardDetails, handleCloseColumnModal, token]);

  // Handle column title update
  const handleEditColumn = useCallback(
    async (columnId: string, title: string, color?: string, position?: number) => {
      try {
        await updateColumn(columnId, title, color, position);
        
        // Recharger les colonnes pour s'assurer que le store local est à jour
        if (boardId) {
          await fetchBoardDetails(boardId);
        }
        
        toast.success("Colonne mise à jour avec succès");
      } catch (error) {
        console.error("Erreur lors de la mise à jour de la colonne:", error);
        toast.error("Échec de la mise à jour de la colonne");
      }
    },
    [updateColumn, boardId, fetchBoardDetails]
  );

  const handleDeleteColumn = useCallback((columnId: string) => {
    setEditingColumnId(columnId);

    
    setDeleteColumnModalOpen(true);
  }, []);

  const handleConfirmDeleteColumn = useCallback(async () => {
    if (editingColumnId && boardId && !isDeletingColumn) {
      try {
        setIsDeletingColumn(true);
        toast("Suppression de la colonne en cours...");
        await deleteColumn(editingColumnId, token || undefined);

        
        setTimeout(() => {
          setDeleteColumnModalOpen(false);
          setTimeout(() => {
            setEditingColumnId(null);
            setIsDeletingColumn(false);
          }, 300);
        }, 50);
        
        await fetchBoardDetails(boardId);
        toast.success("Colonne supprimée avec succès");
      } catch (error) {
        console.error("Erreur lors de la suppression de la colonne:", error);
        toast.error("Erreur lors de la suppression de la colonne");
        
        setIsDeletingColumn(false);
        setTimeout(() => {
          setDeleteColumnModalOpen(false);
          setTimeout(() => setEditingColumnId(null), 300);
        }, 100);
        
        await fetchColumns(boardId, token || undefined);
      }
    }
  }, [boardId, editingColumnId, deleteColumn, fetchBoardDetails, fetchColumns, token, isDeletingColumn]);

  // Gérer la réorganisation des colonnes avec optimisation des performances
  const handleColumnOrderChange = useCallback(
    async (columnIds: string[]) => {
      if (!boardId) return;

      // Ajouter des logs pour comprendre le flux d'exécution
      console.log("handleColumnOrderChange appelé avec ordre:", columnIds);

      try {
        // N'utiliser qu'une seule colonne pour déclencher une mise à jour
        // Cela évite les appels multiples à l'API
        if (columnIds.length > 0) {
          console.log("Mise à jour des colonnes avec un seul appel API");
          
          // Trouver une colonne qui a changé de position pour la mettre à jour
          const sortedColumns = [...enrichedColumns].sort((a, b) => a.position - b.position);
          const currentOrder = sortedColumns.map(col => col.id);
          
          // Trouver la première colonne qui a changé pour la mettre à jour
          let targetColId = null;
          for (let i = 0; i < columnIds.length; i++) {
            if (columnIds[i] !== currentOrder[i]) {
              targetColId = columnIds[i];
              break;
            }
          }
          
          // Si aucun changement détecté, ne rien faire
          if (targetColId === null) {
            console.log("Aucun changement détecté dans l'ordre des colonnes");
            return;
          }
          
          console.log("Colonne cible pour mise à jour:", targetColId);
          
          // Trouver la colonne dans notre état
          const targetColumn = enrichedColumns.find(col => col.id === targetColId);
          if (targetColumn) {
            // Effectuer UN SEUL appel pour marquer le changement
            // Le serveur devrait recalculer toutes les positions
            const newPosition = columnIds.indexOf(targetColId) + 1;
            console.log(`Mise à jour de la colonne ${targetColId} avec position ${newPosition}`);
            
            // Faire un seul appel API
            await updateColumn(
              targetColId, 
              targetColumn.title, 
              targetColumn.color, 
              newPosition, 
              token || undefined
            );
            
            // Recharger les données pour s'assurer de la cohérence
            console.log("Rechargement des données du tableau");
            await fetchBoardDetails(boardId);
            
            toast.success("Ordre des colonnes mis à jour");
          }
        }
      } catch (error) {
        console.error("Erreur lors de la mise à jour de l'ordre des colonnes:", error);
        toast.error("Échec de la mise à jour de l'ordre des colonnes");
        
        // En cas d'erreur, recharger les données pour revenir à l'état cohérent
        await fetchBoardDetails(boardId);
      }
    },
    [boardId, enrichedColumns, updateColumn, fetchBoardDetails, token]
  );

  const handleMoveColumn = useCallback((columnId: string, newPosition: number) => {
    const sortedColumns = [...enrichedColumns].sort((a, b) => a.position - b.position);
    
    const currentIndex = sortedColumns.findIndex((col) => col.id === columnId);
    if (currentIndex === -1) return;
    
    const targetIndex = newPosition - 1;
    if (targetIndex < 0 || targetIndex >= sortedColumns.length) return;
    
    const newColumnOrder = reorderColumns(sortedColumns, currentIndex, targetIndex);
    
    handleColumnOrderChange(newColumnOrder);
  }, [enrichedColumns, handleColumnOrderChange]);

  const handleMoveColumnByDirection = useCallback((columnId: string, direction: 'left' | 'right') => {
    const sortedColumns = [...enrichedColumns].sort((a, b) => a.position - b.position);
    
    const currentIndex = sortedColumns.findIndex((col) => col.id === columnId);
    if (currentIndex === -1) return;
    
    let targetIndex: number;
    if (direction === 'left') {
      targetIndex = currentIndex - 1;
    } else {
      targetIndex = currentIndex + 1;
    }
    
    if (targetIndex < 0 || targetIndex >= sortedColumns.length) return;
    
    const columnToMove = sortedColumns[currentIndex];
    const columnAtTarget = sortedColumns[targetIndex];
    
    const newColumnOrder = [...sortedColumns];
    newColumnOrder[currentIndex] = columnAtTarget;
    newColumnOrder[targetIndex] = columnToMove;
    
    const columnIdsOrder = newColumnOrder.map(col => col.id);
    handleColumnOrderChange(columnIdsOrder);
  }, [enrichedColumns, handleColumnOrderChange]);

  const getEditingColumn = useCallback(() => {
    if (editingColumnId) {
      return enrichedColumns.find((col) => col.id === editingColumnId);
    }
    return undefined;
  }, [enrichedColumns, editingColumnId]);

  const setColumnIsEditing = useCallback((columnId: string, isEditing: boolean) => {
    setColumnEditState(prev => ({
      ...prev,
      [columnId]: {
        ...prev[columnId],
        isEditing
      }
    }));
  }, []);

  const handleColumnTitleChange = useCallback((columnId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    setColumnEditState(prev => ({
      ...prev,
      [columnId]: {
        ...prev[columnId],
        title: e.target.value
      }
    }));
  }, []);

  const handleColumnTitleSubmit = useCallback((columnId: string) => {
    const editState = columnEditState[columnId];
    if (!editState) return;

    const column = enrichedColumns.find((col) => col.id === columnId);
    if (!column) {
      console.error(`Colonne ${columnId} non trouvée`);
      toast.error(`Colonne ${columnId} non trouvée`);
      return;
    }

    if (editState.title.trim() && editState.title !== column.title) {
      handleEditColumn(columnId, editState.title, column.color, column.position);
    } else {
      setColumnEditState((prev) => ({
        ...prev,
        [columnId]: {
          ...prev[columnId],
          title: column.title || "", // Ensure default value
        },
      }));
    }
    setColumnIsEditing(columnId, false);
  }, [columnEditState, enrichedColumns, handleEditColumn, setColumnIsEditing]);

  const handleColumnKeyDown = useCallback((columnId: string, e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleColumnTitleSubmit(columnId);
    } else if (e.key === "Escape") {
      const column = enrichedColumns.find(col => col.id === columnId);
      if (column) {
        setColumnEditState(prev => ({
          ...prev,
          [columnId]: {
            ...prev[columnId],
            title: column.title
          }
        }));
      }
      setColumnIsEditing(columnId, false);
    }
  }, [enrichedColumns, handleColumnTitleSubmit, setColumnIsEditing]);

  const getColumnNavigationProps = useCallback((column: EnhancedColumn) => {
    const editState = columnEditState[column.id] || { isEditing: false, title: column.title };
    
    const sortedColumns = [...enrichedColumns].sort((a, b) => a.position - b.position);
    const currentIndex = sortedColumns.findIndex(col => col.id === column.id);
    
    const isLeftDisabled = currentIndex <= 0;
    const isRightDisabled = currentIndex >= sortedColumns.length - 1;
    
    return {
      isEditing: editState.isEditing,
      columnTitle: editState.title,
      isLeftDisabled,
      isRightDisabled,
      setIsEditing: (value: boolean) => setColumnIsEditing(column.id, value),
      handleTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => handleColumnTitleChange(column.id, e),
      handleTitleSubmit: () => handleColumnTitleSubmit(column.id),
      handleKeyDown: (e: React.KeyboardEvent) => handleColumnKeyDown(column.id, e),
      handleMoveLeft: () => handleMoveColumnByDirection(column.id, 'left'),
      handleMoveRight: () => handleMoveColumnByDirection(column.id, 'right'),
    };
  }, [columnEditState, enrichedColumns, handleColumnKeyDown, handleColumnTitleChange, handleColumnTitleSubmit, handleMoveColumnByDirection, setColumnIsEditing]);

  // Calculate column IDs and hash key directly from enrichedColumns
  const columnIds = useMemo(() => enrichedColumns.map(col => col.id), [enrichedColumns]);
  const columnsKey = useMemo(() => generateColumnsKey(enrichedColumns), [enrichedColumns]);

  return {
    // Modal states
    columnModalOpen,
    editingColumnId,
    deleteColumnModalOpen,
    
    // Column data
    columns: enrichedColumns,
    columnIds,
    columnsKey,
    
    // Column handlers
    handleOpenColumnModal,
    handleCloseColumnModal,
    handleCloseDeleteColumnModal,
    handleAddColumn,
    handleEditColumn,
    handleDeleteColumn,
    handleConfirmDeleteColumn,
    handleColumnOrderChange,
    handleMoveColumn,
    handleMoveColumnByDirection,
    
    // Utility functions
    getEditingColumn,
    getColumnNavigationProps,
    setColumnEditState,
  };
}
