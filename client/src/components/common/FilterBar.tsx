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
import type { BoardSortOption } from "@/types/board.types";
import { SORT_OPTION_LABELS } from "@/constants/board";
import { COMMON_UI } from "@/constants/ui";

interface FilterBarProps {
  onFilterChange: (option: BoardSortOption) => void;
  buttonText?: string;
  dropdownLabel?: string;
  sortOptions: Record<string, string>;
}

export function FilterBar({
  onFilterChange,
  buttonText = COMMON_UI.FILTER.BUTTON_TEXT,
  dropdownLabel = COMMON_UI.FILTER.DROPDOWN_LABEL,
  sortOptions = SORT_OPTION_LABELS,
}: FilterBarProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size={COMMON_UI.FILTER.BUTTON_SIZE}
          className={`flex items-center ${COMMON_UI.FILTER.BUTTON_GAP}`}
        >
          <FiFilter className={COMMON_UI.FILTER.ICON_SIZE} />
          <span>{buttonText}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className={COMMON_UI.FILTER.DROPDOWN_WIDTH}
      >
        <DropdownMenuLabel>{dropdownLabel}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {Object.entries(sortOptions).map(([option, label]) => (
            <DropdownMenuItem
              key={option}
              onClick={() => onFilterChange(option as BoardSortOption)}
            >
              {label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default FilterBar;
