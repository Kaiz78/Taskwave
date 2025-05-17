import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FiCalendar } from "react-icons/fi";
import { Badge } from "@/components/ui/badge";
import { cn, formatDistanceToNow } from "@/lib/utils";

export interface BoardCardProps {
  id: string;
  title: string;
  description?: string;
  backgroundColor?: string;
  columnsCount: number;
  tasksCount: number;
  createdAt: Date;
  onClick?: () => void;
}

export function BoardCard({
  title,
  description,
  backgroundColor,
  columnsCount,
  tasksCount,
  createdAt,
  onClick,
}: BoardCardProps) {
  return (
    <Card
      className={cn(
        "cursor-pointer transition-all hover:shadow-md",
        backgroundColor ? "border-l-4" : ""
      )}
      style={backgroundColor ? { borderLeftColor: backgroundColor } : undefined}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold">{title}</CardTitle>
        {description && (
          <CardDescription className="line-clamp-2">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
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
