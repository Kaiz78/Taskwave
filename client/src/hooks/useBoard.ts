import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { useBoardStore } from "@/store/useBoardStore";
import type { BoardData, BoardSortOption, NewBoardData } from "@/types/board.types";
import { formatWelcomeMessage, initializeBoardFormData, findBoardById } from "@/lib/board";
import { BOARD_TEXT, BOARD_COLORS } from "@/constants/board";

/**
 * Custom hook for managing Board page functionalities
 * Handles board loading, filtering, modals, and board operations
 */
export function useBoardPage() {
  const navigate = useNavigate();
  
  // Modal states
  const [newBoardModalOpen, setNewBoardModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  
  // Form data states
  const [newBoardFormData, setNewBoardFormData] = useState(initializeBoardFormData());
  const [editBoardFormData, setEditBoardFormData] = useState(initializeBoardFormData());
  
  // Selected board for edit/delete operations
  const [selectedBoard, setSelectedBoard] = useState<BoardData | null>(null);
  
  // Authentication data
  const username = useAuthStore((state) => state.user);
  
  // Board store data and functions
  const {
    boards,
    filteredBoards,
    fetchBoards,
    fetchBoardDetails,
    setSearchQuery,
    setSortOption,
    createBoard,
    updateBoard,
    deleteBoard,
    isLoading,
    error,
    searchQuery
  } = useBoardStore();

  // Load boards on component mount
  useEffect(() => {
    fetchBoards();
  }, [fetchBoards]);

  // Format welcome message with username
  const welcomeMessage = formatWelcomeMessage(
    BOARD_TEXT.WELCOME_MESSAGE,
    username,
    BOARD_TEXT.DEFAULT_USERNAME
  );

  // Check if results are filtered
  const isFiltered = searchQuery.length > 0;

  // Handler for search functionality
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, [setSearchQuery]);

  // Handler for filter/sort functionality
  const handleFilterChange = useCallback((option: string) => {
    setSortOption(option as BoardSortOption);
  }, [setSortOption]);

  // ---- New Board Modal handlers ----
  
  // Toggle the new board modal
  const toggleNewBoardModal = useCallback((isOpen: boolean) => {
    if (isOpen) {
      // Reset form data when opening
      setNewBoardFormData(initializeBoardFormData());
    }
    setNewBoardModalOpen(isOpen);
  }, []);
  
  // Handle input change in the new board form
  const handleNewBoardInputChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewBoardFormData(prev => ({ ...prev, [name]: value }));
  }, []);
  
  // Handle color selection in the new board form
  const handleNewBoardColorSelect = useCallback((color: string) => {
    setNewBoardFormData(prev => ({ ...prev, backgroundColor: color }));
  }, []);
  
  // Submit new board form
  const handleCreateBoard = useCallback((boardData: NewBoardData) => {
    createBoard(boardData);
    setNewBoardModalOpen(false);
  }, [createBoard]);
  
  // ---- Board Grid handlers ----
  
  // Navigate to board details page
  const handleBoardClick = useCallback((boardId: string) => {
    navigate(`/boards/${boardId}`);
  }, [navigate]);
  
  // Open board edit modal
  const handleEditBoard = useCallback((boardId: string) => {
    const boardToEdit = findBoardById(boards, boardId);
    if (boardToEdit) {
      setSelectedBoard(boardToEdit);
      setEditBoardFormData({
        title: boardToEdit.title,
        description: boardToEdit.description || "",
        backgroundColor: boardToEdit.backgroundColor || BOARD_COLORS[0].value,
      });
      setEditModalOpen(true);
    }
  }, [boards]);
  
  // Open board delete confirmation modal
  const handleDeleteBoard = useCallback((boardId: string) => {
    const boardToDelete = findBoardById(boards, boardId);
    if (boardToDelete) {
      setSelectedBoard(boardToDelete);
      setDeleteModalOpen(true);
    }
  }, [boards]);
  
  // Navigate to board details with data fetching
  const handleViewDetails = useCallback((boardId: string) => {
    fetchBoardDetails(boardId);
    navigate(`/boards/${boardId}`);
  }, [fetchBoardDetails, navigate]);
  
  // Confirm board deletion
  const confirmDeleteBoard = useCallback(() => {
    if (selectedBoard) {
      deleteBoard(selectedBoard.id);
      setDeleteModalOpen(false);
    }
  }, [deleteBoard, selectedBoard]);
  
  // ---- Edit Board Modal handlers ----
  
  // Handle input change in the edit board form
  const handleEditBoardInputChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditBoardFormData(prev => ({ ...prev, [name]: value }));
  }, []);
  
  // Handle color selection in the edit board form
  const handleEditBoardColorSelect = useCallback((color: string) => {
    setEditBoardFormData(prev => ({ ...prev, backgroundColor: color }));
  }, []);
  
  // Submit edit board form
  const handleUpdateBoard = useCallback((boardId: string, data: Partial<BoardData>) => {
    updateBoard(boardId, data);
    setEditModalOpen(false);
  }, [updateBoard]);
  
  // ---- Modal close handlers ----
  
  const closeEditModal = useCallback(() => setEditModalOpen(false), []);
  const closeDeleteModal = useCallback(() => setDeleteModalOpen(false), []);
  
  // Form validation
  const isNewBoardFormValid = newBoardFormData.title.trim().length > 0;
  const isEditBoardFormValid = editBoardFormData.title.trim().length > 0;

  return {
    // State
    username,
    welcomeMessage,
    isFiltered,
    filteredBoards,
    isLoading,
    error,
    
    // Selected board
    selectedBoard,
    
    // New board modal
    newBoardModalOpen,
    newBoardFormData,
    isNewBoardFormValid,
    toggleNewBoardModal,
    handleNewBoardInputChange,
    handleNewBoardColorSelect,
    handleCreateBoard,
    
    // Grid operations
    handleBoardClick,
    handleEditBoard,
    handleDeleteBoard,
    handleViewDetails,
    
    // Edit board modal
    editModalOpen,
    editBoardFormData,
    isEditBoardFormValid,
    handleEditBoardInputChange,
    handleEditBoardColorSelect,
    handleUpdateBoard,
    closeEditModal,
    
    // Delete modal
    deleteModalOpen,
    confirmDeleteBoard,
    closeDeleteModal,
    
    // Filters
    handleSearch,
    handleFilterChange,
    
    // Other
    boardColors: BOARD_COLORS,
  };
}
