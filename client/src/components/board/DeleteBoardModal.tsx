import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { FiAlertTriangle } from "react-icons/fi";

interface DeleteBoardModalProps {
  isOpen: boolean;
  boardTitle: string;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteBoardModal({
  isOpen,
  boardTitle,
  onClose,
  onConfirm,
}: DeleteBoardModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FiAlertTriangle className="h-5 w-5 text-red-500" />
            Confirmer la suppression
          </DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer le tableau{" "}
            <span className="font-medium text-foreground">"{boardTitle}"</span>{" "}
            ?
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            Cette action est irréversible. Toutes les colonnes et tâches
            associées à ce tableau seront définitivement supprimées.
          </p>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Supprimer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteBoardModal;
