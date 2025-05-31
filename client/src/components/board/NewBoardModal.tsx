import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import CommonModal from "@/components/common/CommonModal";
import type { NewBoardData } from "@/types/board.types";

interface NewBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateBoard: (boardData: NewBoardData) => void;
  formData: {
    title: string;
    description: string;
    backgroundColor: string;
  };
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onColorSelect: (color: string) => void;
  isFormValid: boolean;
  colorOptions: Array<{ name: string; value: string }>;
}

export function NewBoardModal({
  isOpen,
  onClose,
  onCreateBoard,
  formData,
  onInputChange,
  onColorSelect,
  isFormValid,
  colorOptions,
}: NewBoardModalProps) {
  // Handler pour soumettre le formulaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateBoard(formData);
  };

  return (
    <CommonModal
      isOpen={isOpen}
      onClose={onClose}
      title="Créer un nouveau tableau"
      description="Ajoutez les informations de votre tableau ci-dessous."
      onSubmit={handleSubmit}
      submitLabel="Créer"
      submitDisabled={!isFormValid}
    >
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="title" className="text-right">
          Titre
        </Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={onInputChange}
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
          onChange={onInputChange}
          className="col-span-3 resize-y"
          maxLength={500}
          style={{ maxHeight: "200px" }}
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
              onClick={() => onColorSelect(color.value)}
              title={color.name}
            />
          ))}
        </div>
      </div>
    </CommonModal>
  );
}

export default NewBoardModal;
