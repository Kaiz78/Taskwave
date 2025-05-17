import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchIcon } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export function SearchBar({
  onSearch,
  placeholder = "Rechercher un tableau...",
}: SearchBarProps) {
  return (
    <div className="relative flex w-full max-w-md items-center">
      <Input
        type="text"
        placeholder={placeholder}
        className="pr-10"
        onChange={(e) => onSearch(e.target.value)}
      />
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-0 top-0 h-full"
        type="submit"
      >
        <SearchIcon className="h-4 w-4" />
      </Button>
    </div>
  );
}

export default SearchBar;
