import { useParams } from "react-router-dom";
import { useBoardDetails } from "@/hooks/kanban/useBoardDetails";
import {
  KanbanBoard,
  TaskDetailsModal,
  TaskAddModal,
  ColumnModal,
  DeleteColumnModal,
} from "@/components/kanban";
import { KANBAN_TEXT } from "@/constants/kanban";

export function BoardDetailsPage() {
  const { boardId } = useParams<{ boardId: string }>();

  // Use our centralized hook for board details functionality
  const {
    // Board data
    currentBoard,
    enrichedColumns: columns, // Use enrichedColumns but alias it as columns for compatibility
    isLoading,
    error,
    refreshData,

    // Modal states
    columnModalOpen,
    deleteColumnModalOpen,
    selectedTask,
    selectedColumnId,
    isTaskModalOpen,

    // Column handlers
    handleOpenColumnModal,
    handleCloseColumnModal,
    handleCloseDeleteColumnModal,
    handleAddColumn,
    handleEditColumn,
    handleDeleteColumn,
    handleConfirmDeleteColumn,
    handleColumnOrderChange,

    // Task handlers
    handleOpenTaskModal,
    handleCloseTaskModal,
    handleAddTask,
    handleTaskMove,
    handleTaskToggleComplete,
    handleDeleteTask,

    // Helpers
    getEditingColumn,
  } = useBoardDetails();



  // Conditional rendering for loading - Ne pas bloquer si le tableau existe mais les colonnes sont vides
  if (isLoading && !currentBoard) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="text-muted-foreground">
          {KANBAN_TEXT.BOARD_DETAILS.LOADING}
        </p>
      </div>
    );
  }

  // Rendering in case of error or missing board
  if (error || !currentBoard) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <h2 className="text-2xl font-bold text-red-500">
          {error === "failed to fetch"
            ? "Erreur de connexion"
            : "Tableau non trouvé"}
        </h2>
        <p className="text-muted-foreground text-center max-w-md">
          {error === "failed to fetch"
            ? "Impossible de se connecter au serveur. Vérifiez votre connexion Internet ou réessayez plus tard."
            : error || KANBAN_TEXT.BOARD_DETAILS.ERROR}
        </p>
        <a
          href="/"
          className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Retourner à l'accueil
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Board header */}
      <div className="mb-4 p-4">
        <div className="flex justify-between items-center">
          <div>
            <h1
              className="text-3xl font-bold"
              style={{
                borderLeft: `4px solid ${
                  currentBoard.backgroundColor || "#3498db"
                }`,
                paddingLeft: "12px",
              }}
            >
              {currentBoard.title}
            </h1>
            {currentBoard.description && (
              <p className="text-muted-foreground mt-2">
                {currentBoard.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Kanban interface with Drag & Drop - occupies all available space */}
      <div className="flex-1 h-auto" >
        <KanbanBoard
          columns={columns}
          onTaskToggleComplete={handleTaskToggleComplete}
          onAddColumn={() => handleOpenColumnModal()}
          onAddTask={(columnId) => handleOpenTaskModal(undefined, columnId)}
          onEditTask={(columnId, taskId) => {
            // Find the task by ID and call handleOpenTaskModal with the task object
            const column = columns.find((col) => col.id === columnId);
            if (column) {
              const task = column.tasks.find((t) => t.id === taskId);
              if (task) {
                handleOpenTaskModal(task);
              }
            }
          }}
          onDeleteTask={handleDeleteTask}
          onEditColumn={handleEditColumn}
          onDeleteColumn={handleDeleteColumn}
          onColumnOrderChange={handleColumnOrderChange}
          onTaskMove={handleTaskMove}
          isLoading={isLoading}
        />
      </div>

      {/* Modals for interactions */}
      {/* Modal pour éditer une tâche existante */}
      {selectedTask && (
        <>
          <TaskDetailsModal
            boardId={boardId || currentBoard.id}
            isOpen={isTaskModalOpen && selectedTask !== null}
            task={selectedTask}
            onClose={handleCloseTaskModal}
            onTaskChanged={refreshData}
          />
        </>
      )}

      {/* Modal pour ajouter une nouvelle tâche */}
      {selectedColumnId && (
        <TaskAddModal
          isOpen={isTaskModalOpen && !selectedTask}
          onClose={handleCloseTaskModal}
          onSave={handleAddTask}
          columnId={selectedColumnId}
        />
      )}

      <ColumnModal
        isOpen={columnModalOpen}
        onClose={handleCloseColumnModal}
        onSave={handleAddColumn}
        currentTitle={getEditingColumn()?.title}
      />

      <DeleteColumnModal
        isOpen={deleteColumnModalOpen}
        columnTitle={
          columns.find((col) => col.id === getEditingColumn()?.id)?.title || ""
        }
        onClose={handleCloseDeleteColumnModal}
        onConfirm={handleConfirmDeleteColumn}
      />
    </div>
  );
}

export default BoardDetailsPage;
