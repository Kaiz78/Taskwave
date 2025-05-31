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
import { CommonModal } from "@/components/common/CommonModal";
import { Priority } from "@/types/kanban.types";
import type { Task } from "@/types/kanban.types";
import { TASK } from "@/constants/task";
import { KANBAN_TEXT } from "@/constants/kanban";
import { FiCalendar } from "react-icons/fi";

interface TaskAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    taskData: Omit<Task, "id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  columnId: string;
}

export function TaskAddModal({
  isOpen,
  onClose,
  onSave,
  columnId,
}: TaskAddModalProps) {
  const [formData, setFormData] = useState<
    Omit<Task, "id" | "createdAt" | "updatedAt">
  >({
    title: "",
    description: "",
    priority: Priority.NORMAL,
    position: 0,
    columnId: columnId,
    completed: false,
    labels: [],
    attachments: [],
    dueDate: undefined,
  });
  const [isSaving, setIsSaving] = useState(false);

  // Réinitialiser le formulaire quand le modal s'ouvre ou que la colonne change
  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: "",
        description: "",
        priority: Priority.NORMAL,
        position: 0,
        columnId: columnId,
        completed: false,
        labels: [],
        attachments: [],
        dueDate: undefined,
      });
    }
  }, [columnId, isOpen]);

  // Gérer la soumission du formulaire
  const handleSubmit = async () => {
    if (isSaving) return;
    if (!formData.title.trim()) return;

    setIsSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de la tâche:", error);
    } finally {
      setIsSaving(false);
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
        console.error("AddModal - Date invalide:", date);
        return "";
      }


      // Format YYYY-MM-DD pour input type="date"
      const formattedDate = dateObj.toISOString().split("T")[0];
      return formattedDate;
    } catch (error) {
      console.error("AddModal - Erreur de formatage de date:", error);
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
        console.error("AddModal - Date invalide créée:", newDate);
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
      console.error("AddModal - Erreur lors du changement de date:", error);
    }
  };

  return (
    <CommonModal
      isOpen={isOpen}
      onClose={onClose}
      title={KANBAN_TEXT.TASK.MODAL.ADD_TITLE}
      onSubmit={handleSubmit}
      submitDisabled={!formData.title.trim() || isSaving}
    >
      <div className="space-y-4">
        {/* Titre */}
        <div className="space-y-2">
          <Label htmlFor="title">{KANBAN_TEXT.TASK.MODAL.TITLE_LABEL}</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            placeholder={KANBAN_TEXT.TASK.PLACEHOLDER}
            autoFocus
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
            placeholder={KANBAN_TEXT.TASK.DESCRIPTION_PLACEHOLDER}
            rows={4}
          />
        </div>

        {/* Date d'échéance */}
        <div className="space-y-2">
          <Label htmlFor="dueDate" className="flex items-center gap-2">
            <FiCalendar className="h-4 w-4" />{" "}
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

        {/* Priorité */}
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
      </div>
    </CommonModal>
  );
}

export default TaskAddModal;
