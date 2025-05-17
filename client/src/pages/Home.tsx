import { useAuthStore } from "@/store/useAuthStore";

import { BoardGrid } from "@/components/board/BoardGrid";
import { SearchBar } from "@/components/board/SearchBar";
import { FilterBar } from "@/components/board/FilterBar";
import { useState } from "react";

// Données fictives pour l'exemple
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

function App() {
  // Sélectionner individuellement chaque valeur pour éviter les re-rendus excessifs
  const username = useAuthStore((state) => state.user);
  const [boards] = useState(mockBoards);

  const handleSearch = (query: string) => {
    console.log("Recherche:", query);
    // La logique de recherche sera implémentée plus tard
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
      </div>

      {/* Barre de recherche et filtres */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <SearchBar onSearch={handleSearch} />
        <FilterBar
          onFilterChange={(option) => {
            console.log("Option de tri:", option);
            // La logique de filtrage sera implémentée plus tard
          }}
        />
      </div>

      {/* Vue des tableaux en grille */}
      <div className="mt-6">
        <BoardGrid boards={boards} />
      </div>

      
    </div>
  );
}

export default App;
