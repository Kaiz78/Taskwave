import BoardCard from "./BoardCard";
import EditBoardModal from "./EditBoardModal";
import DeleteBoardModal from "./DeleteBoardModal";
import { FiSearch, FiDatabase } from "react-icons/fi";
import type { BoardData as BoardDataType } from "@/types/board.types";
import { BOARD_TEXT, BOARD_UI } from "@/constants/board";

interface BoardGridProps {
  boards: BoardDataType[];
  isFiltered?: boolean;
  selectedBoard: BoardDataType | null;
  editModalOpen: boolean;
  deleteModalOpen: boolean;
  handleBoardClick: (boardId: string) => void;
  handleEditBoard: (boardId: string) => void;
  handleDeleteBoard: (boardId: string) => void;
  handleViewDetails: (boardId: string) => void;
  confirmDeleteBoard: () => void;
  closeEditModal: () => void;
  closeDeleteModal: () => void;
  handleUpdateBoard: (boardId: string, data: Partial<BoardDataType>) => void;
  editBoardFormData: {
    title: string;
    description: string;
    backgroundColor: string;
  };
  handleEditBoardInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleEditBoardColorSelect: (color: string) => void;
  isEditBoardFormValid: boolean;
  boardColors: Array<{ name: string; value: string }>;
}

export function BoardGrid({
  boards,
  isFiltered = false,
  selectedBoard,
  editModalOpen,
  deleteModalOpen,
  handleBoardClick,
  handleEditBoard,
  handleDeleteBoard,
  handleViewDetails,
  confirmDeleteBoard,
  closeEditModal,
  closeDeleteModal,
  handleUpdateBoard,
  editBoardFormData,
  handleEditBoardInputChange,
  handleEditBoardColorSelect,
  isEditBoardFormValid,
  boardColors,
}: BoardGridProps) {
  // Afficher un message si aucun tableau n'est trouvé lors du filtrage
  if (isFiltered && boards.length === 0) {
    return (
      <div
        className={`flex flex-col items-center justify-center ${BOARD_UI.EMPTY_STATE_PADDING}`}
      >
        <FiSearch
          className={`${BOARD_UI.EMPTY_STATE_ICON_SIZE} text-muted-foreground ${BOARD_UI.EMPTY_STATE_ICON_MARGIN}`}
        />
        <h3 className={BOARD_UI.EMPTY_STATE_TITLE_SIZE}>
          {BOARD_TEXT.NO_RESULTS_TITLE}
        </h3>
        <p
          className={`text-muted-foreground text-center ${BOARD_UI.EMPTY_STATE_TEXT_MARGIN}`}
        >
          {BOARD_TEXT.NO_RESULTS_MESSAGE}
        </p>
      </div>
    );
  }

  // Afficher un message si la liste des tableaux est vide (sans filtrage)
  if (!isFiltered && boards.length === 0) {
    return (
      <div
        className={`flex flex-col items-center justify-center ${BOARD_UI.EMPTY_STATE_PADDING}`}
      >
        <FiDatabase
          className={`${BOARD_UI.EMPTY_STATE_ICON_SIZE} text-muted-foreground ${BOARD_UI.EMPTY_STATE_ICON_MARGIN}`}
        />
        <h3 className={BOARD_UI.EMPTY_STATE_TITLE_SIZE}>
          {BOARD_TEXT.NO_BOARDS_TITLE}
        </h3>
        <p
          className={`text-muted-foreground text-center ${BOARD_UI.EMPTY_STATE_TEXT_MARGIN}`}
        >
          {BOARD_TEXT.NO_BOARDS_MESSAGE}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className={BOARD_UI.GRID_LAYOUT}>
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
        onClose={closeEditModal}
        onUpdateBoard={handleUpdateBoard}
        board={selectedBoard}
        formData={editBoardFormData}
        onInputChange={handleEditBoardInputChange}
        onColorSelect={handleEditBoardColorSelect}
        isFormValid={isEditBoardFormValid}
        colorOptions={boardColors}
      />

      {/* Modal de confirmation de suppression */}
      {selectedBoard && (
        <DeleteBoardModal
          isOpen={deleteModalOpen}
          boardTitle={selectedBoard.title}
          onClose={closeDeleteModal}
          onConfirm={confirmDeleteBoard}
        />
      )}
    </>
  );
}

export default BoardGrid;
