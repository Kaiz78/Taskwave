import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CommonModal } from "@/components/common/CommonModal";
import { useEffect, useState } from "react";
import { KANBAN_TEXT } from "@/constants/kanban";

interface ColumnModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string) => void;
  currentTitle?: string;
}

export function ColumnModal({
  isOpen,
  onClose,
  onSave,
  currentTitle,
}: ColumnModalProps) {
  const [title, setTitle] = useState("");
  const isEditing = !!currentTitle;

  // Reset form when modal opens/closes or when currentTitle changes
  useEffect(() => {
    if (isOpen) {
      setTitle(currentTitle || "");
    }
  }, [isOpen, currentTitle]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSave(title.trim());
    }
  };

  return (
    <CommonModal
      isOpen={isOpen}
      onClose={onClose}
      title={
        isEditing
          ? KANBAN_TEXT.COLUMN.MODAL.EDIT_TITLE
          : KANBAN_TEXT.COLUMN.MODAL.ADD_TITLE
      }
      maxWidth="md"
      submitLabel={KANBAN_TEXT.COLUMN.MODAL.SAVE_BUTTON}
      cancelLabel={KANBAN_TEXT.COLUMN.MODAL.CANCEL_BUTTON}
      submitDisabled={!title.trim()}
      onSubmit={handleSubmit}
    >
      <div className="grid gap-2">
        <Label htmlFor="title">{KANBAN_TEXT.COLUMN.PLACEHOLDER}</Label>
        <Input
          id="title"
          placeholder={KANBAN_TEXT.COLUMN.PLACEHOLDER}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
        />
      </div>
    </CommonModal>
  );
}

export default ColumnModal;
