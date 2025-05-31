import React, { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CommonModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  footerContent?: ReactNode;
  submitLabel?: string;
  cancelLabel?: string;
  onSubmit?: (e: React.FormEvent) => void;
  submitDisabled?: boolean;
  maxHeight?: string;
  maxWidth?: string;
}

export function CommonModal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footerContent,
  submitLabel = "Enregistrer",
  cancelLabel = "Annuler",
  onSubmit,
  submitDisabled = false,
  maxHeight = "85vh",
  maxWidth = "425px",
}: CommonModalProps) {
  // Références pour gérer proprement les fermetures et transitions
  const pendingCloseRef = useRef(false);
  const isProcessingRef = useRef(false);
  const previousIsOpen = useRef(isOpen);

  // Gestion de fermeture élégante pour éviter les problèmes de timing
  useEffect(() => {
    // Si modal vient d'être fermé
    if (previousIsOpen.current && !isOpen) {
      pendingCloseRef.current = false;
    }
    previousIsOpen.current = isOpen;

    // Réinitialiser l'état de traitement quand le modal s'ouvre
    if (isOpen && !previousIsOpen.current) {
      isProcessingRef.current = false;
    }
  }, [isOpen]);

  // Handler sécurisé pour fermer le modal
  const handleClose = () => {
    if (pendingCloseRef.current || isProcessingRef.current) return;

    // Marquer immédiatement comme en cours de fermeture pour éviter les doubles appels
    pendingCloseRef.current = true;

    // Attendre un instant pour permettre les animations de fermeture
    // Un délai plus long assure une meilleure compatibilité avec les animations
    setTimeout(() => {
      onClose();

      // Réinitialiser après un délai plus long pour assurer que toutes les opérations sont terminées
      // y compris les animations et transitions de modal et d'état
      setTimeout(() => {
        pendingCloseRef.current = false;
      }, 500);
    }, 100);
  };

  // Gestion de la soumission du formulaire avec fermeture après
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isProcessingRef.current) {
      console.log("Soumission ignorée - déjà en cours de traitement");
      return;
    }

    console.log("Début de soumission du formulaire");
    isProcessingRef.current = true;

    // Exécuter la soumission et prévoir une réinitialisation de l'état
    if (onSubmit) {
      // Appliquer la soumission avec un délai plus long pour permettre
      // à l'interface de réagir et éviter des problèmes d'état
      setTimeout(() => {
        console.log("Exécution de onSubmit après délai");
        onSubmit(e);

        // Réinitialiser l'état après un délai plus long pour éviter les conflits
        setTimeout(() => {
          console.log("Réinitialisation de l'état de traitement");
          isProcessingRef.current = false;
        }, 500);
      }, 50);
    } else {
      // Si pas de soumission, réinitialiser quand même l'état après un délai
      setTimeout(() => {
        console.log("Réinitialisation de l'état (pas de soumission)");
        isProcessingRef.current = false;
      }, 500);
    }
  };

  const content = (
    <div className="overflow-y-auto pr-6 -mr-6" style={{ maxHeight }}>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        {description && <DialogDescription>{description}</DialogDescription>}
      </DialogHeader>
      <div className="grid gap-4 py-4">{children}</div>
      <DialogFooter className="pt-6 mb-2">
        {footerContent || (
          <>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isProcessingRef.current}
            >
              {cancelLabel}
            </Button>
            <Button
              type="submit"
              disabled={submitDisabled || isProcessingRef.current}
            >
              {submitLabel}
            </Button>
          </>
        )}
      </DialogFooter>
    </div>
  );

  // Intercepter l'événement onOpenChange pour utiliser notre gestionnaire de fermeture sécurisé
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Si l'on essaie de fermer le modal
      handleClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        className="sm:max-w-md"
        style={{ maxWidth }}
        onInteractOutside={(e) => {
          // Empêcher la fermeture pendant une action
          if (pendingCloseRef.current || isProcessingRef.current) {
            e.preventDefault();
          }
        }}
      >
        {onSubmit ? <form onSubmit={handleSubmit}>{content}</form> : content}
      </DialogContent>
    </Dialog>
  );
}

export default CommonModal;
