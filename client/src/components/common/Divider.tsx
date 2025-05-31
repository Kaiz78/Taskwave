import { cn } from "@/lib/utils";

interface DividerProps {
  label?: string;
  className?: string;
}

export function Divider({ label, className }: DividerProps) {
  return (
    <div className={cn("relative", className)}>
      <div className="absolute inset-0 flex items-center">
        <hr className="w-full border-t border-border" />
      </div>
      {label && (
        <div className="relative flex justify-center text-sm">
          <span className="px-2 text-muted-foreground bg-card">
            {label}
          </span>
        </div>
      )}
    </div>
  );
}
