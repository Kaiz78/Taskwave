import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CommonModal } from "@/components/common/CommonModal";
import { formatDistanceToNow, ensureValidDate } from "@/lib/utils";
import type { Task } from "@/types/kanban.types";
import { Priority } from "@/types/kanban.types";
import { toast } from "sonner";
import { FiCheckCircle, FiCircle, FiCalendar, FiTrash2 } from "react-icons/fi";

import { KANBAN_TEXT } from "@/constants/kanban";
import { useTaskHandlers } from "@/hooks/kanban/useTaskHandlers"; // Importer useTaskHandlers
import { useBoardStore } from "@/store/useBoardStore"; // Import board store to get board ID if needed
import { TASK } from "@/constants/task";

interface TaskDetailsModalProps {
  boardId?: string; // ID du tableau pour les opérations de tâche
  isOpen: boolean;
  task: Task; // Task est obligatoire car ce modal est uniquement pour l'édition
  onClose: () => void;
  onTaskChanged?: () => void; // Callback pour informer le parent qu'une tâche a été modifiée
}

export function TaskDetailsModal({
  boardId, // Passer l'ID du tableau pour les opérations de tâche
  isOpen,
  task,
  onClose,
  onTaskChanged,
}: TaskDetailsModalProps) {
  const { currentBoard } = useBoardStore(); // Get the current board from the store

  // Get the most reliable board ID
  const effectiveBoardId = boardId || currentBoard?.id;

  // Récupérer toutes les fonctions nécessaires de useTaskHandlers
  const { handleEditTask, handleDeleteTask, handleTaskToggleComplete } =
    useTaskHandlers({
      boardId: effectiveBoardId,
      onTasksChanged: onTaskChanged, // Callback pour notifier les changements
    });

  const [formData, setFormData] = useState<
    Omit<Task, "id" | "createdAt" | "updatedAt">
  >({ ...task });
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Update formData when task changes or when modal opens
  useEffect(() => {
    if (isOpen && task) {
  
      // Construire un nouvel objet de tâche avec une date proprement formatée
      const processedTask = {
        ...task,
        dueDate: ensureValidDate(task.dueDate),
      };

      setFormData(processedTask);
    }
  }, [task, isOpen]);

  // Save changes
  const handleSaveEdit = async () => {
    try {
      setIsSaving(true);

      if (!effectiveBoardId) {
        console.error("Aucun boardId disponible lors de l'édition de la tâche");
        toast.error("Erreur: Impossible d'identifier le tableau");
        return;
      }

      await handleEditTask(task.id, formData); // Appeler handleEditTask ici
      toast.success(KANBAN_TEXT.TASK.MODAL.SAVE_SUCCESS);
      onClose();
    } catch (error) {
      console.error("Error saving task:", error);
      toast.error(KANBAN_TEXT.TASK.MODAL.SAVE_ERROR);
    } finally {
      setIsSaving(false);
    }
  };

  // Delete task
  const handleDeleteTaskAction = async () => {
    try {
      setIsDeleting(true);

      // Utiliser la fonction de useTaskHandlers
      await handleDeleteTask(task.id);

      toast.success(KANBAN_TEXT.TASK.MODAL.DELETE_SUCCESS);
      onClose();
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error(KANBAN_TEXT.TASK.MODAL.DELETE_ERROR);
    } finally {
      setIsDeleting(false);
    }
  };

  // Toggle task completion status
  const handleToggleComplete = async (e: React.MouseEvent) => {
    try {
      // stop propagation to prevent closing the modal
      e.preventDefault();
      e.stopPropagation();

      // Utiliser la fonction de useTaskHandlers
      await handleTaskToggleComplete(task.id, !formData.completed);

      toast.success(
        formData.completed
          ? KANBAN_TEXT.TASK.MODAL.MARK_INCOMPLETE
          : KANBAN_TEXT.TASK.MODAL.MARK_COMPLETE
      );

      // Update the local form data to reflect the change
      setFormData({
        ...formData,
        completed: !formData.completed,
      });

      // Don't close the modal immediately so the user can see the status change
      // onClose();
    } catch (error) {
      console.error("Error toggling task completion:", error);
      toast.error(KANBAN_TEXT.TASK.MODAL.UPDATE_STATUS_ERROR);
    }
  };

  // Formatter la date pour l'input HTML
  const formatDateForInput = (
    date: Date | undefined | string | null
  ): string => {
    if (!date) return "";
    try {
      // Si c'est une chaîne, convertir en objet Date
      const dateObj = typeof date === "string" ? new Date(date) : date;

      // Vérifier si la date est valide
      if (isNaN(dateObj.getTime())) {
        console.error("DetailModal - Date invalide:", date);
        return "";
      }

 
      // Format YYYY-MM-DD pour input type="date"
      const formattedDate = dateObj.toISOString().split("T")[0];
      
      return formattedDate;
    } catch (error) {
      console.error("DetailModal - Erreur de formatage de date:", error);
      return "";
    }
  };

  // Gérer le changement de date
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value;

    // Si la valeur est vide, on met undefined
    if (!dateValue) {
      setFormData((prevData) => {
        const newData = {
          ...prevData,
          dueDate: undefined,
        };

        return newData;
      });
      return;
    }

    try {
      // Créer un nouvel objet Date à partir de la valeur de l'input
      const newDate = new Date(dateValue + "T00:00:00.000Z");

      // Vérifier que la date est valide
      if (isNaN(newDate.getTime())) {
        console.error("DetailModal - Date invalide créée:", newDate);
        return;
      }

      setFormData((prevData) => {
        const newData = {
          ...prevData,
          dueDate: newDate,
        };
  
        return newData;
      });
    } catch (error) {
      console.error("DetailModal - Erreur lors du changement de date:", error);
    }
  };

  return (
    <CommonModal
      isOpen={isOpen}
      onClose={onClose}
      title={formData.title}
      maxWidth="600px"
      submitLabel={KANBAN_TEXT.TASK.MODAL.SAVE_BUTTON}
      cancelLabel={KANBAN_TEXT.TASK.MODAL.CANCEL_BUTTON}
      submitDisabled={isSaving}
      onSubmit={handleSaveEdit}
    >
      <div className="space-y-4">
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title">{KANBAN_TEXT.TASK.MODAL.TITLE_LABEL}</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">
            {KANBAN_TEXT.TASK.MODAL.DESCRIPTION_LABEL}
          </Label>
          <Textarea
            id="description"
            value={formData.description || ""}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={4}
          />
        </div>

        {/* Date d'échéance */}
        <div className="space-y-2">
          <Label htmlFor="dueDate" className="flex items-center gap-2">
            <FiCalendar className="h-4 w-4" />
            {KANBAN_TEXT.TASK.MODAL.DUE_DATE_LABEL}
          </Label>
          <Input
            type="date"
            id="dueDate"
            value={formatDateForInput(formData.dueDate)}
            onChange={handleDateChange}
            className="w-full"
          />
        </div>

        {/* Priority */}
        <div className="space-y-2">
          <Label htmlFor="priority">
            {KANBAN_TEXT.TASK.MODAL.PRIORITY_LABEL}
          </Label>
          <Select
            value={formData.priority}
            onValueChange={(value: Priority) =>
              setFormData({ ...formData, priority: value })
            }
          >
            <SelectTrigger id="priority">
              <SelectValue
                placeholder={KANBAN_TEXT.TASK.MODAL.PRIORITY_PLACEHOLDER}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={Priority.LOW}>{TASK.PRIORITY.LOW}</SelectItem>
              <SelectItem value={Priority.NORMAL}>
                {TASK.PRIORITY.NORMAL}
              </SelectItem>
              <SelectItem value={Priority.HIGH}>
                {TASK.PRIORITY.HIGH}
              </SelectItem>
              <SelectItem value={Priority.URGENT}>
                {TASK.PRIORITY.URGENT}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Status */}
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center space-x-2"
            onClick={handleToggleComplete}
          >
            {formData.completed ? (
              <>
                <FiCheckCircle className="h-4 w-4 text-green-500" />
                <span>{KANBAN_TEXT.TASK.MODAL.STATUS_COMPLETE}</span>
              </>
            ) : (
              <>
                <FiCircle className="h-4 w-4" />
                <span>{KANBAN_TEXT.TASK.MODAL.STATUS_PENDING}</span>
              </>
            )}
          </Button>
        </div>

        {/* Metadata */}
        <div className="pt-4 border-t border-border space-y-2 text-sm text-muted-foreground">
          {/* Created & Updated */}
          <div className="flex items-center space-x-1">
            <FiCalendar className="h-3 w-3" />
            <span>{KANBAN_TEXT.TASK.MODAL.CREATED_AT_LABEL}: </span>
            <span>
              {formatDistanceToNow(new Date(task.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>
          {task.updatedAt && (
            <div className="flex items-center space-x-1">
              <FiCalendar className="h-3 w-3" />
              <span>{KANBAN_TEXT.TASK.MODAL.UPDATED_AT_LABEL}: </span>
              <span>
                {formatDistanceToNow(new Date(task.updatedAt), {
                  addSuffix: true,
                })}
              </span>
            </div>
          )}
        </div>

        {/* Delete button */}
        <div className="flex pt-4">
          <Button
            variant="outline"
            size="sm"
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={handleDeleteTaskAction}
            disabled={isDeleting}
          >
            <FiTrash2 className="h-4 w-4 mr-1" />
            {KANBAN_TEXT.TASK.MODAL.DELETE_BUTTON}
          </Button>
        </div>
      </div>
    </CommonModal>
  );
}

export default TaskDetailsModal;
