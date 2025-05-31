import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import CommonModal from "@/components/common/CommonModal";
import type { BoardData } from "@/types/board.types";

interface EditBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateBoard: (boardId: string, boardData: Partial<BoardData>) => void;
  board: BoardData | null;
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

export function EditBoardModal({
  isOpen,
  onClose,
  onUpdateBoard,
  board,
  formData,
  onInputChange,
  onColorSelect,
  isFormValid,
  colorOptions,
}: EditBoardModalProps) {
  // Handler pour soumettre le formulaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (board) {
      onUpdateBoard(board.id, formData);
    }
  };

  return (
    <CommonModal
      isOpen={isOpen}
      onClose={onClose}
      title="Modifier le tableau"
      description="Modifiez les informations de votre tableau ci-dessous."
      onSubmit={handleSubmit}
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
              onClick={() => onColorSelect(color.value)}
              title={color.name}
            />
          ))}
        </div>
      </div>
    </CommonModal>
  );
}

export default EditBoardModal;
