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
import { useRef } from "react";

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
  // Référence pour suivre l'état du traitement
  const isProcessingRef = useRef(false);
  const closeRequestedRef = useRef(false);

  // Handler sécurisé pour la fermeture du modal
  const handleClose = () => {
    // Si une opération est en cours, on mémorise la demande de fermeture
    if (isProcessingRef.current) {
      closeRequestedRef.current = true;
      return;
    }

    onClose();
  };

  // Handler sécurisé pour la confirmation
  const handleConfirm = () => {
    if (isProcessingRef.current) {
      return;
    }

    isProcessingRef.current = true;

    // Appeler uniquement onConfirm, qui gèrera la fermeture
    onConfirm();

    // Réinitialiser l'état après un délai significatif
    setTimeout(() => {
      isProcessingRef.current = false;

      // Si une fermeture a été demandée pendant le traitement, on la traite maintenant
      if (closeRequestedRef.current) {
        closeRequestedRef.current = false;
        onClose();
      }
    }, 500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FiAlertTriangle className="h-5 w-5 text-red-500" />
            Confirmer la suppression
          </DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer la colonne{" "}
            <span className="font-medium text-foreground">"{boardTitle}"</span>{" "}
            ?
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            Cette action est irréversible. Toutes les tâches associées à cette
            colonne seront définitivement supprimées.
          </p>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isProcessingRef.current}
          >
            Annuler
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={isProcessingRef.current}
          >
            Supprimer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteBoardModal;
