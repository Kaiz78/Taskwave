import { useState, useMemo, useCallback } from 'react';
import type { BoardData, BoardSortOption, NewBoardData } from '@/types/board.types';

// Données fictives initiales
const mockBoards = [
  {
    id: "1",
    title: "Développement Taskwave",
    description: "Suivi du développement de la plateforme Taskwave",
    backgroundColor: "#3498db",
    columnsCount: 4,
    tasksCount: 12,
    createdAt: new Date(2025, 4, 10), // 10 mai 2025
  },
  {
    id: "2",
    title: "Marketing Q2 2025",
    description: "Campagnes marketing pour le deuxième trimestre",
    backgroundColor: "#2ecc71",
    columnsCount: 3,
    tasksCount: 8,
    createdAt: new Date(2025, 4, 15), // 15 mai 2025
  },
  {
    id: "3",
    title: "Idées de fonctionnalités",
    description:
      "Collection d'idées pour de nouvelles fonctionnalités à développer",
    backgroundColor: "#e74c3c",
    columnsCount: 2,
    tasksCount: 5,
    createdAt: new Date(2025, 4, 16), // 16 mai 2025
  },
];

interface UseBoardOperationsProps {
  initialBoards?: BoardData[];
}

/**
 * Hook personnalisé pour gérer les opérations CRUD et filtrage des tableaux
 */
export function useBoardOperations({ initialBoards = mockBoards }: UseBoardOperationsProps = {}) {
  // États pour les tableaux et les filtres
  const [boards, setBoards] = useState<BoardData[]>(initialBoards);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortOption, setSortOption] = useState<BoardSortOption>("newest");

  /**
   * Crée un nouveau tableau
   */
  const createBoard = useCallback((boardData: NewBoardData) => {
    // Dans un cas réel, vous feriez un appel API ici
    const newBoard: BoardData = {
      id: `${Date.now()}`, // Générer un ID temporaire
      title: boardData.title,
      description: boardData.description,
      backgroundColor: boardData.backgroundColor,
      columnsCount: 0, // Nouveau tableau, aucune colonne
      tasksCount: 0, // Nouveau tableau, aucune tâche
      createdAt: new Date(), // Date actuelle
    };
    
    setBoards((prevBoards) => [...prevBoards, newBoard]);
    return newBoard;
  }, []);

  /**
   * Supprime un tableau par son ID
   */
  const deleteBoard = useCallback((boardId: string) => {
    // Dans un cas réel, vous feriez un appel API ici
    setBoards((prevBoards) => prevBoards.filter(board => board.id !== boardId));
  }, []);

  /**
   * Met à jour un tableau existant
   */
  const updateBoard = useCallback((boardId: string, updatedData: Partial<BoardData>) => {
    // Dans un cas réel, vous feriez un appel API ici
    setBoards((prevBoards) => 
      prevBoards.map(board => 
        board.id === boardId ? { ...board, ...updatedData } : board
      )
    );
  }, []);

  /**
   * Gère la recherche de tableaux
   */
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  /**
   * Gère le tri des tableaux
   */
  const handleSort = useCallback((option: BoardSortOption) => {
    setSortOption(option);
  }, []);

  /**
   * Filtrage et tri des tableaux basé sur la recherche et l'option de tri
   */
  const filteredAndSortedBoards = useMemo(() => {
    // Filtrer d'abord par la requête de recherche
    let result = boards;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(board => 
        board.title.toLowerCase().includes(query) || 
        (board.description && board.description.toLowerCase().includes(query))
      );
    }
    
    // Ensuite trier selon l'option sélectionnée
    return [...result].sort((a, b) => {
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
  }, [boards, searchQuery, sortOption]);

  return {
    // États
    boards,
    searchQuery,
    sortOption,
    filteredBoards: filteredAndSortedBoards,
    isFiltered: searchQuery.length > 0,
    
    // Actions
    createBoard,
    deleteBoard,
    updateBoard,
    handleSearch,
    handleSort
  };
}
