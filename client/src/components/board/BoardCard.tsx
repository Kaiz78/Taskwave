import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FiCalendar,
  FiMoreVertical,
  FiInfo,
  FiEdit,
  FiTrash2,
} from "react-icons/fi";
import { Badge } from "@/components/ui/badge";
import { cn, formatDistanceToNow } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface BoardCardProps {
  id: string;
  title: string;
  description?: string;
  backgroundColor?: string;
  columnsCount: number;
  tasksCount: number;
  createdAt: Date;
  onClick?: () => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onViewDetails?: (id: string) => void;
}

export function BoardCard({
  id,
  title,
  description,
  backgroundColor,
  columnsCount,
  tasksCount,
  createdAt,
  onClick,
  onEdit,
  onDelete,
  onViewDetails,
}: BoardCardProps) {
  // Fonction pour empêcher la propagation du clic
  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all hover:shadow-md relative",
        backgroundColor ? "border-l-4" : ""
      )}
      style={backgroundColor ? { borderLeftColor: backgroundColor } : undefined}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-bold">{title}</CardTitle>

          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={handleActionClick}>
              <button className=" rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none">
                <FiMoreVertical className="h-4 w-4" />
                <span className="sr-only">Actions</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onViewDetails && (
                <DropdownMenuItem
                  onClick={(e) => {
                    handleActionClick(e);
                    onViewDetails(id);
                  }}
                >
                  <FiInfo className="mr-2 h-4 w-4" />
                  <span>Détails</span>
                </DropdownMenuItem>
              )}
              {onEdit && (
                <DropdownMenuItem
                  onClick={(e) => {
                    handleActionClick(e);
                    onEdit(id);
                  }}
                >
                  <FiEdit className="mr-2 h-4 w-4" />
                  <span>Modifier</span>
                </DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem
                  className="text-red-600 focus:text-red-600"
                  onClick={(e) => {
                    handleActionClick(e);
                    onDelete(id);
                  }}
                >
                  <FiTrash2 className="mr-2 h-4 w-4" />
                  <span>Supprimer</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {description && (
          <CardDescription className="line-clamp-2">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div className="flex space-x-2 ">
            <Badge variant="outline" className="text-xs">
              {columnsCount} colonnes
            </Badge>
            <Badge variant="outline" className="text-xs">
              {tasksCount} tâches
            </Badge>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2 text-xs text-muted-foreground flex items-center">
        <FiCalendar className="mr-1 h-3 w-3" />
        {`Créé ${formatDistanceToNow(createdAt, {
          addSuffix: true,
          language: "fr",
        })}`}
      </CardFooter>
    </Card>
  );
}

export default BoardCard;
