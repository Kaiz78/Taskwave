import { useNavigate } from "react-router-dom";
import { useState } from "react";
import BoardCard from "./BoardCard";
import EditBoardModal from "./EditBoardModal";
import DeleteBoardModal from "./DeleteBoardModal";
import { useBoardStore } from "@/store/useBoardStore";
import { FiSearch, FiDatabase } from "react-icons/fi";
import type { BoardData as BoardDataType } from "@/types/board.types";

interface BoardGridProps {
  boards: BoardDataType[];
  isFiltered?: boolean;
}

export function BoardGrid({ boards, isFiltered = false }: BoardGridProps) {
  const navigate = useNavigate();
  const { updateBoard, deleteBoard, fetchBoardDetails } = useBoardStore();

  // États pour les modaux
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState<BoardDataType | null>(
    null
  );

  const handleBoardClick = (boardId: string) => {
    // Rediriger vers la page du tableau sélectionné
    navigate(`/boards/${boardId}`);
  };

  const handleEditBoard = (boardId: string) => {
    // Trouver le tableau à éditer
    const boardToEdit = boards.find((board) => board.id === boardId);
    if (boardToEdit) {
      setSelectedBoard(boardToEdit);
      setEditModalOpen(true);
    }
  };

  const handleDeleteBoard = (boardId: string) => {
    // Trouver le tableau à supprimer
    const boardToDelete = boards.find((board) => board.id === boardId);
    if (boardToDelete) {
      setSelectedBoard(boardToDelete);
      setDeleteModalOpen(true);
    }
  };

  const handleViewDetails = (boardId: string) => {
    fetchBoardDetails(boardId);
    navigate(`/boards/${boardId}`);
  };

  // Confirmer la suppression d'un tableau
  const confirmDeleteBoard = () => {
    if (selectedBoard) {
      deleteBoard(selectedBoard.id);
    }
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
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {boards.map((board) => (
          <BoardCard
            key={board.id}
            {...board}
            onClick={() => handleBoardClick(board.id)}
            onEdit={handleEditBoard}
            onDelete={handleDeleteBoard}
            onViewDetails={handleViewDetails}
          />
        ))}
      </div>

      {/* Modal d'édition */}
      <EditBoardModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onUpdateBoard={updateBoard}
        board={selectedBoard}
      />

      {/* Modal de confirmation de suppression */}
      {selectedBoard && (
        <DeleteBoardModal
          isOpen={deleteModalOpen}
          boardTitle={selectedBoard.title}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={confirmDeleteBoard}
        />
      )}
    </>
  );
}

export default BoardGrid;
