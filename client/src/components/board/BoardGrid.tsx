import { useNavigate } from "react-router-dom";
import BoardCard from "./BoardCard";
import NewBoardCard from "./NewBoardCard";

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
}

export function BoardGrid({ boards }: BoardGridProps) {
  const navigate = useNavigate();

  const handleBoardClick = (boardId: string) => {
    // Pour l'instant, afficher simplement une alerte
    alert(`Naviguer vers le board ${boardId} - À implémenter plus tard`);
    // Plus tard, cela naviguerait vers le tableau avec:
    // navigate(`/boards/${boardId}`);
  };

  const handleNewBoardClick = () => {
    // Pour l'instant, afficher simplement une alerte
    alert("Créer un nouveau tableau - À implémenter plus tard");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {boards.map((board) => (
        <BoardCard
          key={board.id}
          {...board}
          onClick={() => handleBoardClick(board.id)}
        />
      ))}
      <NewBoardCard onClick={handleNewBoardClick} />
    </div>
  );
}

export default BoardGrid;
