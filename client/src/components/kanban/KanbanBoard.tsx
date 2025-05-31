import { KANBAN_TEXT } from "@/constants/kanban";
import {
  DndContext,
  closestCenter,
  type CollisionDetection,
} from "@dnd-kit/core";
import LoadingOverlay from "@/components/ui/loading-overlay";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useMemo } from "react";
import type { EnhancedColumn } from "@/types/kanban.types";
import { FiPlus } from "react-icons/fi";
import { KanbanColumn } from "./columns/KanbanColumn";
import { useBoardDetails } from "@/hooks/kanban/useBoardDetails";

interface KanbanBoardProps {
  columns: EnhancedColumn[];
  onAddColumn: () => void;
  onAddTask: (columnId: string) => void;
  onEditTask: (columnId: string, taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onDeleteColumn: (columnId: string) => void;
  onEditColumn?: (
    columnId: string,
    title: string,
    color?: string,
    position?: number
  ) => Promise<void> | void;
  onColumnOrderChange: (columnIds: string[]) => void;
  onTaskMove: (
    taskId: string,
    destination: { columnId: string; position: number }
  ) => void;
  onTaskToggleComplete?: (taskId: string, completed: boolean) => void;
  isLoading?: boolean;
}

export function KanbanBoard({
  columns,
  onAddColumn,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onDeleteColumn,
  onTaskToggleComplete,
  isLoading = false,
}: KanbanBoardProps) {
  // Use our centralized hook for board functionality
  const {
    sensors,
    measuringConfig,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    columnIds,
    columnsKey,
    activeTaskId,
  } = useBoardDetails();

  // Optimized collision detection for smooth animations
  const collisionDetection: CollisionDetection = useMemo(() => {
    return (args) => {
      // Use closestCenter for better base precision
      const collisions = closestCenter(args);

      // Improve collision precision by adding weights
      if (collisions.length > 1) {
        // Filter and prioritize relevant collisions
        // Priority to columns for inter-column movements
        return collisions.sort((a, b) => {
          const typeA = a.data?.current?.type;
          const typeB = b.data?.current?.type;

          // Prioritize columns over tasks
          if (typeA === "column" && typeB !== "column") return -1;
          if (typeA !== "column" && typeB === "column") return 1;

          return 0;
        });
      }

      return collisions;
    };
  }, []);

  return (
    <div className="h-full relative">
      {/* Show loading overlay when operations are in progress - not during dragging */}
      <LoadingOverlay
        isLoading={isLoading}
        message="Mise à jour en cours..."
        position="bottom-right"
      />
      <DndContext
        sensors={sensors}
        collisionDetection={collisionDetection}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        // Use columnsKey to force rendering only when the column order actually changes
        key={columnsKey}
        // Options to optimize drag and drop performance
        measuring={measuringConfig}
        // Reduce animations for more fluidity
        accessibility={{
          announcements: {
            onDragStart: () => "", // Disable announcements to reduce CPU load
            onDragOver: () => "",
            onDragEnd: () => "",
            onDragCancel: () => "",
          },
        }}
      >
        <div
          className="flex gap-4 flex-nowrap"
          style={{
            minWidth: "max-content",
            willChange: activeTaskId ? "transform" : "auto", // Optimize rendering during drag
          }}
        >
          <SortableContext
            items={columnIds}
            strategy={horizontalListSortingStrategy}
          >
            {columns.map((column) => {
              return (
                <div
                  key={column.id}
                  className="transition-transform ease-out"
                  style={{
                    transform: "translate3d(0,0,0)", // Force GPU acceleration
                  }}
                >
                  <KanbanColumn
                    column={column}
                    onAddTask={onAddTask}
                    onEditTask={onEditTask}
                    onDeleteTask={onDeleteTask}
                    onDeleteColumn={onDeleteColumn}
                    onTaskToggleComplete={onTaskToggleComplete}
                  />
                </div>
              );
            })}
          </SortableContext>

          {/* Button to add a new column */}
          {columns.length < 10 && (
            <div
              className="border-2 border-dashed border-muted rounded-lg w-72 h-[200px] shrink-0 flex items-center justify-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
              onClick={onAddColumn}
            >
              <div className="flex flex-col items-center text-muted-foreground">
                <FiPlus className="h-6 w-6 mb-2" />
                <span>{KANBAN_TEXT.COLUMN.ADD_BUTTON}</span>
              </div>
            </div>
          )}
        </div>
      </DndContext>
    </div>
  );
}

export default KanbanBoard;
