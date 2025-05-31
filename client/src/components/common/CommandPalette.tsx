import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

// Types pour les commandes
export type CommandAction = {
  id: string;
  name: string;
  shortcut?: string[];
  action: () => void;
  keywords?: string[];
  icon?: React.ElementType;
};

interface CommandPaletteProps {
  commands: CommandAction[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CommandPalette({
  commands,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: CommandPaletteProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);

  // Utiliser soit les props contrôlées, soit l'état local
  const open = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen;
  const setOpen = setControlledOpen || setUncontrolledOpen;

  // Gérer le raccourci clavier (Ctrl+K)
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(!open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, setOpen]);

  const runCommand = (command: CommandAction) => {
    command.action();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogOverlay className="backdrop-blur-sm" />
      <DialogContent className="p-0 border border-border/50 shadow-lg max-w-lg">
        <Command className="rounded-lg">
          <CommandInput placeholder="Tapez une commande ou recherchez..." />
          <CommandList>
            <CommandEmpty>Aucune commande trouvée.</CommandEmpty>
            <CommandGroup heading="Commandes">
              {commands.map((command) => (
                <CommandItem
                  key={command.id}
                  onSelect={() => runCommand(command)}
                  className="flex items-center justify-between py-3"
                >
                  <div className="flex items-center gap-2">
                    {command.icon && <command.icon className="h-4 w-4" />}
                    <span>{command.name}</span>
                  </div>
                  {command.shortcut && (
                    <div className="flex items-center gap-1">
                      {command.shortcut.map((key, i) => (
                        <kbd
                          key={i}
                          className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100"
                        >
                          {key}
                        </kbd>
                      ))}
                    </div>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}

export default CommandPalette;
