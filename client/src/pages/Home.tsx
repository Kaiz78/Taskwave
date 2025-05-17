import { useAuthStore } from "@/store/useAuthStore";
import { useBoardStore } from "@/store/useBoardStore";
import { Button } from "@/components/ui/button";
import { FiPlus } from "react-icons/fi";
import { BoardGrid } from "@/components/board/BoardGrid";
import { SearchBar } from "@/components/board/SearchBar";
import { FilterBar } from "@/components/board/FilterBar";
import { useState, useEffect } from "react";
import { NewBoardModal } from "@/components/board/NewBoardModal";
import type { BoardSortOption } from "@/types/board.types";

function App() {
  // Sélectionner individuellement chaque valeur pour éviter les re-rendus excessifs
  const username = useAuthStore((state) => state.user);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Utiliser le store Zustand pour la gestion des tableaux
  const {
    filteredBoards,
    fetchBoards,
    setSearchQuery,
    setSortOption,
    createBoard,
    isLoading,
    error,
    searchQuery,
  } = useBoardStore();

  // Charger les tableaux au montage du composant
  useEffect(() => {
    fetchBoards();
  }, [fetchBoards]);

  // Vérifier si les résultats sont filtrés
  const isFiltered = searchQuery.length > 0;

  // Handlers pour la recherche et le filtrage
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (option: string) => {
    setSortOption(option as BoardSortOption);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Mes tableaux</h1>
          <p className="text-muted-foreground mt-1">
            Bienvenue {username || "Utilisateur"}, gérez vos projets et tâches
          </p>
        </div>
        <Button
          className="flex items-center gap-1"
          onClick={() => setIsModalOpen(true)}
        >
          <FiPlus className="h-4 w-4" />
          <span>Nouveau tableau</span>
        </Button>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <SearchBar onSearch={handleSearch} />
        <FilterBar onFilterChange={handleFilterChange} />
      </div>

      {/* Vue des tableaux en grille */}
      <div className="mt-6">
        {isLoading ? (
          <div className="text-center py-8">Chargement des tableaux...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : (
          <BoardGrid boards={filteredBoards} isFiltered={isFiltered} />
        )}
      </div>

      {/* Modal pour créer un nouveau tableau */}
      <NewBoardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateBoard={(boardData) => {
          createBoard(boardData);
          setIsModalOpen(false);
        }}
      />
    </div>
  );
}

export default App;
