import { Button } from "@/components/ui/button";
import { FiFilter } from "react-icons/fi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type SortOption = "newest" | "oldest" | "name-asc" | "name-desc";

interface FilterBarProps {
  onFilterChange: (option: SortOption) => void;
}

export function FilterBar({ onFilterChange }: FilterBarProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1.5"
        >
          <FiFilter className="h-4 w-4" />
          <span>Filtrer</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Trier par</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => onFilterChange("newest")}>
            Plus récents
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onFilterChange("oldest")}>
            Plus anciens
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onFilterChange("name-asc")}>
            Nom (A-Z)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onFilterChange("name-desc")}>
            Nom (Z-A)
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default FilterBar;
