import { FaSun, FaMoon } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useDarkMode } from "@/hooks/useDarkMode";

export function ThemeToggle() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleDarkMode}
      aria-label={
        isDarkMode ? "Activer le mode clair" : "Activer le mode sombre"
      }
      title={isDarkMode ? "Mode clair" : "Mode sombre"}
      className="rounded-full h-8 w-8 transition-all"
    >
      {isDarkMode ? (
        <FaSun className="h-4 w-4 text-yellow-500" />
      ) : (
        <FaMoon className="h-4 w-4 text-slate-700" />
      )}
    </Button>
  );
}

export default ThemeToggle;
