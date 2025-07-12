import { Button } from "@/components/ui/button";
import { FiPlus } from "react-icons/fi";
import { BoardGrid } from "@/components/board/BoardGrid";
import { SearchBar } from "@/components/common/SearchBar";
import { FilterBar } from "@/components/common/FilterBar";
import { NewBoardModal } from "@/components/board/NewBoardModal";
import { useBoardPage } from "@/hooks/useBoard";
import { BOARD_TEXT, BOARD_UI, SORT_OPTION_LABELS } from "@/constants/board";

/**
 * Board page component displaying user's boards with filtering and creation capabilities
 */
function BoardPage() {
  // Use custom hook for board page logic
  const {
    welcomeMessage,
    newBoardModalOpen,
    filteredBoards,
    isLoading,
    error,
    isFiltered,
    toggleNewBoardModal,
    handleSearch,
    handleFilterChange,
    handleCreateBoard,
    newBoardFormData,
    handleNewBoardInputChange,
    handleNewBoardColorSelect,
    isNewBoardFormValid,
    boardColors,

    // BoardGrid related props
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
  } = useBoardPage();


// erreur custome 
   console.error("Error loading boards:");
  
  return (
    <div className={BOARD_UI.PAGE_PADDING}>
      <div
        className={`flex justify-between items-center ${BOARD_UI.HEADER_MARGIN}`}
      >
        <div>
          <h1 className="text-3xl font-bold">{BOARD_TEXT.TITLE}</h1>
          <p className="text-muted-foreground mt-1">{welcomeMessage}</p>
        </div>
        <Button
          className="flex items-center gap-1"
          onClick={() => toggleNewBoardModal(true)}
        >
          <FiPlus className={BOARD_UI.HEADER_ICON_SIZE} />
          <span>{BOARD_TEXT.NEW_BOARD}</span>
        </Button>
      </div>

      {/* Search and filter bar */}
      <div
        className={`flex flex-col md:flex-row justify-between gap-4 ${BOARD_UI.FILTERS_MARGIN}`}
      >
        <SearchBar
          onSearch={handleSearch}
          placeholder={BOARD_TEXT.SEARCH_PLACEHOLDER}
        />
        <FilterBar
          onFilterChange={handleFilterChange}
          buttonText={BOARD_TEXT.FILTER_BUTTON}
          dropdownLabel={BOARD_TEXT.FILTER_DROPDOWN_LABEL}
          sortOptions={SORT_OPTION_LABELS}
        />
      </div>

      {/* Board grid view */}
      <div className={BOARD_UI.CONTENT_MARGIN}>
        {isLoading ? (
          <div className="text-center py-8">{BOARD_TEXT.LOADING}</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : (
          <BoardGrid
            boards={filteredBoards}
            isFiltered={isFiltered}
            selectedBoard={selectedBoard}
            editModalOpen={editModalOpen}
            deleteModalOpen={deleteModalOpen}
            handleBoardClick={handleBoardClick}
            handleEditBoard={handleEditBoard}
            handleDeleteBoard={handleDeleteBoard}
            handleViewDetails={handleViewDetails}
            confirmDeleteBoard={confirmDeleteBoard}
            closeEditModal={closeEditModal}
            closeDeleteModal={closeDeleteModal}
            handleUpdateBoard={handleUpdateBoard}
            editBoardFormData={editBoardFormData}
            handleEditBoardInputChange={handleEditBoardInputChange}
            handleEditBoardColorSelect={handleEditBoardColorSelect}
            isEditBoardFormValid={isEditBoardFormValid}
            boardColors={boardColors}
          />
        )}
      </div>

      {/* Modal pour créer un nouveau tableau */}
      <NewBoardModal
        isOpen={newBoardModalOpen}
        onClose={() => toggleNewBoardModal(false)}
        onCreateBoard={handleCreateBoard}
        formData={newBoardFormData}
        onInputChange={handleNewBoardInputChange}
        onColorSelect={handleNewBoardColorSelect}
        isFormValid={isNewBoardFormValid}
        colorOptions={boardColors}
      />
    </div>
  );
}

export default BoardPage;
