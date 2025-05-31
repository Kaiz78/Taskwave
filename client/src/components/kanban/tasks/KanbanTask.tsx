import type { Task } from "@/types/kanban.types";
import { useCallback, useRef, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FiCheck, FiCircle, FiCalendar } from "react-icons/fi";
import { cn, formatDateToString, ensureValidDate } from "@/lib/utils";
import { TaskDetailsModal } from "./TaskDetailsModal";

interface KanbanTaskProps {
  task: Task;
  onEdit?: () => void;
  onDelete?: () => void;
  onToggleComplete?: (completed: boolean) => void;
}

export function KanbanTask({ task, onToggleComplete }: KanbanTaskProps) {
  // State to control the details modal opening
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  

  // For differentiating drag and click
  const mouseDownPos = useRef<{ x: number; y: number } | null>(null);

  // Flag to signal to TaskCard if a drag has occurred
  const dragStartedRef = useRef(false);

  // Utiliser directement useSortable
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useSortable({
      id: task.id,
      data: {
        type: "task",
        task: task,
      },
      animateLayoutChanges: () => false, // Désactive les animations
    });

  // Style optimisé pour les animations fluides
  const style = {
    transition: isDragging
      ? "none"
      : "transform 50ms cubic-bezier(0.16, 1, 0.3, 1), opacity 100ms ease",
    opacity: isDragging ? 0.9 : 1,
    cursor: isDragging ? "grabbing" : "grab",
    zIndex: isDragging ? 100 : "auto",
    willChange: "transform",
    touchAction: isDragging ? "none" : "manipulation",
    transform: CSS.Transform.toString(
      transform
        ? {
            ...transform,
            scaleX: isDragging ? 1.02 : 1,
            scaleY: isDragging ? 1.02 : 1,
          }
        : null
    ),
  };

  // Add listeners to detect drag
  const handleDragStart = () => {
    dragStartedRef.current = true;
  };

  const handleDragEnd = () => {
    setTimeout(() => {
      dragStartedRef.current = false;
    }, 0);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (
      (e.target as HTMLElement).closest("button") ||
      (e.target as HTMLElement).closest('[role="menuitem"]')
    ) {
      return;
    }
    mouseDownPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (
      (e.target as HTMLElement).closest("button") ||
      (e.target as HTMLElement).closest('[role="menuitem"]')
    ) {
      return;
    }
    if (!mouseDownPos.current) return;

    const dx = e.clientX - mouseDownPos.current.x;
    const dy = e.clientY - mouseDownPos.current.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    mouseDownPos.current = null;

    // Only open the modal if no drag has occurred AND if movement is minimal
    if (distance < 5 && !dragStartedRef.current) {
      setIsDetailsOpen(true);
    }
  };

  // Disable drag/click logic when modal is open
  const cardEventHandlers = !isDetailsOpen
    ? {
        onMouseDown: handleMouseDown,
        onMouseUp: handleMouseUp,
      }
    : {};

  // Determine priority color
  const priorityColorClass =
    task.priority === "HIGH" || task.priority === "URGENT"
      ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200"
      : task.priority === "NORMAL"
      ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200"
      : task.priority === "LOW"
      ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200"
      : "";

  const priorityLabel =
    task.priority === "HIGH"
      ? "Priorité haute"
      : task.priority === "URGENT"
      ? "Priorité urgente"
      : task.priority === "NORMAL"
      ? "Priorité normale"
      : task.priority === "LOW"
      ? "Priorité basse"
      : "";

  // Optimized and memoized completion handler
  const handleToggleComplete = useCallback(() => {
    if (isDragging) return;
    if (onToggleComplete) {
      onToggleComplete(!task.completed);
    }
  }, [onToggleComplete, isDragging, task.completed]);

  return (
    <>
      <div
        ref={setNodeRef}
        style={{
          ...style,
          willChange: "transform",
        }}
        className={`
          transition-all duration-75 ease-out relative 
          ${isDragging ? "scale-[1.02] z-20" : ""}
          group
        `}
        {...attributes}
        {...listeners}
        data-task-id={task.id}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        {...cardEventHandlers}
      >
        <div
          className={cn(
            "bg-card p-3 rounded-md border shadow-sm",
            "hover:shadow-md transition-shadow",
            task.completed ? "opacity-60" : "",
            isDragging ? "shadow-md" : ""
          )}
        >
          <div className="flex items-start gap-2">
            {/* Completion toggle */}
            {onToggleComplete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleComplete();
                }}
                className="mt-[2px] flex-shrink-0"
                aria-label={
                  task.completed
                    ? "Marquer comme à faire"
                    : "Marquer comme terminée"
                }
              >
                {task.completed ? (
                  <FiCheck className="h-4 w-4 text-green-600" />
                ) : (
                  <FiCircle className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {/* Task title - with line-through if completed */}
                <h3
                  className={cn(
                    "text-sm font-medium line-clamp-2",
                    task.completed ? "line-through text-muted-foreground" : ""
                  )}
                >
                  {task.title}
                </h3>
              </div>

              {/* Task description - with line-clamp */}
              <p
                className={cn(
                  "text-xs text-muted-foreground line-clamp-2",
                  task.completed ? "line-through" : ""
                )}
              >
                {task.description || ""}
              </p>

              {/* Priority badge and due date */}
              <div className="flex items-center flex-wrap gap-1 mt-2 text-xs">
                {/* Priority badge */}
                <span
                  className={cn(
                    "px-2 py-0.5 rounded-full text-xs",
                    priorityColorClass
                  )}
                  title={priorityLabel}
                >
                  {priorityLabel}
                </span>

                {/* Due date badge */}
                {task.dueDate && (
                  <span
                    className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                    title="Date d'échéance"
                  >
                    <FiCalendar className="h-3 w-3" />
                    {formatDateToString(ensureValidDate(task.dueDate))}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <TaskDetailsModal
        isOpen={isDetailsOpen}
        task={task}
        onClose={() => setIsDetailsOpen(false)}
      />
    </>
  );
}

export default KanbanTask;
