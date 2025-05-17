import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import type { BoardData } from "@/types/board.types";

interface EditBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateBoard: (boardId: string, boardData: Partial<BoardData>) => void;
  board: BoardData | null;
}

const colorOptions = [
  { name: "Bleu", value: "#3498db" },
  { name: "Vert", value: "#2ecc71" },
  { name: "Rouge", value: "#e74c3c" },
  { name: "Violet", value: "#9b59b6" },
  { name: "Orange", value: "#e67e22" },
  { name: "Turquoise", value: "#1abc9c" },
];

export function EditBoardModal({
  isOpen,
  onClose,
  onUpdateBoard,
  board,
}: EditBoardModalProps) {
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    backgroundColor: string;
  }>({
    title: "",
    description: "",
    backgroundColor: colorOptions[0].value,
  });

  // Mettre à jour le formulaire quand un tableau est sélectionné pour l'édition
  useEffect(() => {
    if (board) {
      setFormData({
        title: board.title,
        description: board.description || "",
        backgroundColor: board.backgroundColor || colorOptions[0].value,
      });
    }
  }, [board]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleColorSelect = (color: string) => {
    setFormData((prev) => ({ ...prev, backgroundColor: color }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (board) {
      onUpdateBoard(board.id, formData);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <form
          onSubmit={handleSubmit}
          className="max-h-[calc(85vh-4rem)] overflow-y-auto pr-6 -mr-6"
        >
          <DialogHeader>
            <DialogTitle>Modifier le tableau</DialogTitle>
            <DialogDescription>
              Modifiez les informations de votre tableau ci-dessous.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Titre
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="col-span-3"
                required
                autoFocus
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="col-span-3 resize-y"
                style={{ maxHeight: "200px" }}
                maxLength={500}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Couleur</Label>
              <div className="flex flex-wrap gap-2 col-span-3">
                {colorOptions.map((color) => (
                  <div
                    key={color.value}
                    className="w-8 h-8 rounded-full cursor-pointer border-2 transition-all"
                    style={{
                      backgroundColor: color.value,
                      borderColor:
                        formData.backgroundColor === color.value
                          ? "white"
                          : color.value,
                      outline:
                        formData.backgroundColor === color.value
                          ? "2px solid rgb(var(--primary))"
                          : "",
                    }}
                    onClick={() => handleColorSelect(color.value)}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter className="pt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={!formData.title.trim()}>
              Enregistrer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default EditBoardModal;
