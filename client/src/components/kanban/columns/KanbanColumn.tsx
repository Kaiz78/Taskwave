import type { EnhancedColumn } from "@/types/kanban.types";
import { useBoardDetails } from "@/hooks/kanban/useBoardDetails";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FiArrowLeft, FiArrowRight, FiPlus, FiTrash2 } from "react-icons/fi";
import { KanbanTask } from "@/components/kanban/tasks/KanbanTask";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { KANBAN_TEXT } from "@/constants/kanban";

interface KanbanColumnProps {
  column: EnhancedColumn;
  onAddTask: (columnId: string) => void;
  onEditTask: (columnId: string, taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onDeleteColumn: (columnId: string) => void;
  onTaskToggleComplete?: (taskId: string, completed: boolean) => void;
}

export function KanbanColumn({
  column,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onDeleteColumn,
  onTaskToggleComplete,
}: KanbanColumnProps) {
  // Use our custom hook to manage navigation and editing
  const { getColumnNavigationProps } = useBoardDetails();

  const {
    isEditing,
    columnTitle,
    isLeftDisabled,
    isRightDisabled,
    setIsEditing,
    handleTitleChange,
    handleTitleSubmit,
    handleKeyDown,
    handleMoveLeft,
    handleMoveRight,
  } = getColumnNavigationProps(column);

  // Configure droppable to allow task drops
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: {
      type: "column",
      column: column,
    },
  });

  // Use a border color based on the column color, if available
  const borderColor = column.color || "#e2e8f0";
  // Add a class to indicate when a task is over the column
  const dropIndicatorClass = isOver
    ? "bg-primary-50 ring-2 ring-primary/20"
    : "";

  // Get task IDs for the sortable context
  const taskIds = column.tasks.map((task) => task.id);

  return (
    <Card
      ref={setNodeRef}
      style={{
        width: "300px",
        minWidth: "300px",
        borderTopWidth: "4px",
        borderTopColor: borderColor,
      }}
      className={`shrink-0 shadow-md hover:shadow-lg transition-shadow ${dropIndicatorClass}`}
      data-column-id={column.id}
    >
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center justify-between mb-2">
          {/* Navigation buttons */}
          <Button
            variant="ghost"
            size="icon"
            className={`h-8 w-8 ${
              isLeftDisabled ? "opacity-30 cursor-not-allowed" : ""
            }`}
            onClick={handleMoveLeft}
            disabled={isLeftDisabled}
            title="Déplacer à gauche"
          >
            <FiArrowLeft className="h-4 w-4" />
            <span className="sr-only">Déplacer à gauche</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className={`h-8 w-8 ${
              isRightDisabled ? "opacity-30 cursor-not-allowed" : ""
            }`}
            onClick={handleMoveRight}
            disabled={isRightDisabled}
            title="Déplacer à droite"
          >
            <FiArrowRight className="h-4 w-4" />
            <span className="sr-only">Déplacer à droite</span>
          </Button>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            {isEditing ? (
              <Input
                value={columnTitle}
                onChange={handleTitleChange}
                onBlur={handleTitleSubmit}
                onKeyDown={handleKeyDown}
                className="h-8 py-1"
                autoFocus
              />
            ) : (
              <div className="flex items-center">
                <div className="flex-1">
                  <CardTitle
                    className="text-lg font-semibold truncate cursor-pointer"
                    onClick={() => setIsEditing(true)}
                  >
                    {column.title}
                  </CardTitle>
                  <div className="text-xs text-muted-foreground mt-1">
                    {column.tasks.length} tâche
                    {column.tasks.length !== 1 ? "s" : ""}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex space-x-1 ml-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive"
              onClick={() => onDeleteColumn(column.id)}
              title="Supprimer"
            >
              <FiTrash2 className="h-4 w-4" />
              <span className="sr-only">Supprimer la colonne</span>
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-0">
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          <div
            className={`space-y-2 mt-2 min-h-[50px] ${
              isOver ? "bg-primary-50/30 rounded-md p-2" : ""
            }`}
          >
            {column.tasks && column.tasks.length > 0 ? (
              column.tasks.map((task) => (
                <KanbanTask
                  key={task.id}
                  task={task}
                  onEdit={() => onEditTask(column.id, task.id)}
                  onDelete={() => onDeleteTask(task.id)}
                  onToggleComplete={(completed) =>
                    onTaskToggleComplete &&
                    onTaskToggleComplete(task.id, completed)
                  }
                />
              ))
            ) : (
              <p className="text-muted-foreground text-sm">
                Aucun tâche disponible
              </p>
            )}
          </div>
        </SortableContext>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          variant="ghost"
          className="w-full flex items-center justify-center text-muted-foreground hover:text-foreground"
          onClick={() => onAddTask(column.id)}
        >
          <FiPlus className="h-4 w-4 mr-1" />
          <span>{KANBAN_TEXT.COLUMN.ADD_TASK_BUTTON}</span>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default KanbanColumn;
