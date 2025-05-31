import { FaSun, FaMoon } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useDarkMode } from "@/hooks/useDarkMode";

export function ThemeToggle({ className }: { className?: string }) {
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
      className={`${className} flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-200 ease-in-out hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600`}
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
