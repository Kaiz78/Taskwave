import React from "react";
import { KANBAN_TEXT } from "@/constants/kanban";
import CommonModal from "@/components/common/CommonModal";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DeleteColumnModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  columnTitle: string;
}

export function DeleteColumnModal({
  isOpen,
  onClose,
  onConfirm,
  columnTitle,
}: DeleteColumnModalProps) {
  return (
    <CommonModal
      isOpen={isOpen}
      onClose={onClose}
      title={KANBAN_TEXT.COLUMN.DELETE_MODAL.TITLE}
      description={KANBAN_TEXT.COLUMN.DELETE_MODAL.DESCRIPTION}
      footerContent={
        <div className="flex justify-end space-x-2 w-full">
          <Button
            variant="outline"
            onClick={() => {
              // Utiliser setTimeout pour éviter les problèmes de synchronisation
              // entre React et les états du modal
              setTimeout(() => {
                onClose();
              }, 50);
            }}
            className="w-full sm:w-auto"
          >
            {KANBAN_TEXT.COLUMN.DELETE_MODAL.CANCEL_BUTTON}
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              // Utiliser setTimeout pour donner le temps au modal de traiter l'action
              setTimeout(() => {
                onConfirm();
              }, 50);
            }}
            className="w-full sm:w-auto"
          >
            {KANBAN_TEXT.COLUMN.DELETE_MODAL.CONFIRM_BUTTON}
          </Button>
        </div>
      }
    >
      <div className="bg-destructive/10 text-destructive p-3 rounded-md mt-4 mb-2 flex items-start">
        <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold mb-1">Attention!</p>
          <p className="text-sm">
            Cette action supprimera définitivement la colonne{" "}
            <span className="font-semibold">"{columnTitle}"</span> et toutes ses
            tâches.
          </p>
        </div>
      </div>
    </CommonModal>
  );
}

export default DeleteColumnModal;
