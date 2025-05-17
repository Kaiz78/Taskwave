import { Card, CardContent } from "@/components/ui/card";
import { FiPlus } from "react-icons/fi";

interface NewBoardCardProps {
  onClick: () => void;
}

export function NewBoardCard({ onClick }: NewBoardCardProps) {
  return (
    <Card
      onClick={onClick}
      className="h-full cursor-pointer border-dashed hover:border-primary hover:bg-primary/5 transition-colors flex flex-col items-center justify-center"
    >
      <CardContent className="flex flex-col items-center justify-center py-8">
        <FiPlus className="h-10 w-10 text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground font-medium">
          Créer un nouveau tableau
        </p> 
      </CardContent>
    </Card>
  );
}

export default NewBoardCard;
