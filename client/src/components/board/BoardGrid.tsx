import { useNavigate } from "react-router-dom";
import BoardCard from "./BoardCard";

import { FiSearch, FiDatabase } from "react-icons/fi";

export interface BoardData {
  id: string;
  title: string;
  description?: string;
  backgroundColor?: string;
  columnsCount: number;
  tasksCount: number;
  createdAt: Date;
}

interface BoardGridProps {
  boards: BoardData[];
  isFiltered?: boolean;
}

export function BoardGrid({ boards, isFiltered = false }: BoardGridProps) {
  const navigate = useNavigate();

  const handleBoardClick = (boardId: string) => {
    // Rediriger vers la page du tableau sélectionné
    navigate(`/boards/${boardId}`);
  };


  // Afficher un message si aucun tableau n'est trouvé lors du filtrage
  if (isFiltered && boards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-10 bg-muted/30 rounded-lg mt-4">
        <FiSearch className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-xl font-medium">Aucun tableau trouvé</h3>
        <p className="text-muted-foreground text-center mt-2">
          Essayez de modifier vos critères de recherche ou créez un nouveau
          tableau.
        </p>
      </div>
    );
  }

  // Afficher un message si la liste des tableaux est vide (sans filtrage)
  if (!isFiltered && boards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-10 bg-muted/30 rounded-lg mt-4">
        <FiDatabase className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-xl font-medium">
          Commencez à organiser vos projets
        </h3>
        <p className="text-muted-foreground text-center mt-2">
          Vous n'avez pas encore créé de tableaux. Cliquez sur le bouton
          "Nouveau tableau" pour commencer.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {boards.map((board) => (
        <BoardCard
          key={board.id}
          {...board}
          onClick={() => handleBoardClick(board.id)}
        />
      ))}
    </div>
  );
}

export default BoardGrid;
