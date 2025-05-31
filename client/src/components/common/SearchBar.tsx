import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchIcon } from "lucide-react";
import { COMMON_UI } from "@/constants/ui";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export function SearchBar({
  onSearch,
  placeholder = COMMON_UI.SEARCH.PLACEHOLDER,
}: SearchBarProps) {
  return (
    <div
      className={`relative flex w-full ${COMMON_UI.SEARCH.INPUT_MAX_WIDTH} items-center`}
    >
      <Input
        type="text"
        placeholder={placeholder}
        className="pr-10"
        onChange={(e) => onSearch(e.target.value)}
      />
      <Button
        variant="ghost"
        size={COMMON_UI.SEARCH.BUTTON_SIZE}
        className="absolute right-0 top-0 h-full"
        type="submit"
      >
        <SearchIcon className={COMMON_UI.SEARCH.ICON_SIZE} />
      </Button>
    </div>
  );
}

export default SearchBar;
