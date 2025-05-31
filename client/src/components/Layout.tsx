import type { ReactNode } from "react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FaSignOutAlt } from "react-icons/fa";
import {
  Sidebar,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarProvider,
  SidebarHeader,
  SidebarFooter,
  SidebarTrigger,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  NAVIGATION_ITEMS,
  SIDEBAR_KEYBOARD_SHORTCUTS,
} from "../constants/navigation";
import { LAYOUT } from "../constants/ui";
import { useAuthStore } from "@/store/useAuthStore";
import { useBoardStore } from "@/store/useBoardStore";
import { Avatar } from "@/components/ui/avatar";
import ThemeToggle from "./ThemeToggle";
import { Footer } from "./Footer";
import { Toaster } from "@/components/ui/sonner";

import CommandPalette from "./common/CommandPalette";
import useCommandPalette from "@/hooks/useCommandPalette";
import type { CommandAction } from "@/components/common/CommandPalette";

type LayoutProps = {
  children: ReactNode;
};

export function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

  // Récupération des fonctions et données d'auth
  const logout = useAuthStore((state) => state.logout);
  const username = useAuthStore((state) => state.user);
  const avatarUrl = useAuthStore((state) => state.avatarUrl);

  // État pour la palette de commandes
  const [isOpen, setIsOpen] = useState(false);

  // Récupérer les fonctions du hook useCommandPalette
  const { defaultCommands, createBoardCommands, createLogoutCommand } =
    useCommandPalette();

  // Fonction pour gérer la déconnexion
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Récupérer les boards depuis le store
  const boards = useBoardStore((state) => state.boards);

  // Créer les commandes de boards
  const boardCommands = createBoardCommands(boards);

  // Créer la commande de déconnexion
  const logoutCommand = createLogoutCommand(handleLogout);

  // Combiner toutes les commandes
  const allCommands: CommandAction[] = [
    ...defaultCommands,
    ...boardCommands,
    logoutCommand,
  ];

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen w-full overflow-hidden">
        <Sidebar collapsible="offcanvas">
          {/* Header de la sidebar avec bouton de fermeture */}
          <SidebarHeader className="flex items-center justify-between">
            <div className="flex items-center gap-2 px-2">
              <img
                src="/src/assets/logo.svg"
                alt={LAYOUT.TEXT.APP_NAME}
                className={LAYOUT.LOGO_SIZE}
              />
              <span className="font-semibold text-lg">
                {LAYOUT.TEXT.APP_NAME}
              </span>
            </div>
          </SidebarHeader>

          {/* Contenu de la sidebar - avec flex-1 pour permettre au footer d'être en bas */}
          <SidebarContent className="flex flex-col flex-1">
            {/* Zone principale qui peut scroller si nécessaire */}
            <div className="flex-1 overflow-y-auto">
              <SidebarGroup>
                <SidebarGroupLabel>{LAYOUT.TEXT.APP_SECTION}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {NAVIGATION_ITEMS.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          onClick={() => navigate(item.url)}
                          isActive={location.pathname === item.url}
                          data-active={location.pathname === item.url}
                        >
                          <item.icon className={LAYOUT.ICON_SIZE.MD} />
                          <span>{item.title}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </div>

            {/* Bouton de déconnexion -  Fixe en bas */}
            <SidebarFooter className="mt-auto border-t">
              <div className="flex items-center gap-3 px-2 py-2">
                <Avatar
                  src={avatarUrl || undefined}
                  fallback={username?.charAt(0).toUpperCase() || "U"}
                  className={`${LAYOUT.AVATAR_SIZE} border border-border`}
                />
                <div className="flex flex-col">
                  <span className="font-medium truncate max-w-[120px]">
                    {username || LAYOUT.TEXT.USER_FALLBACK}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="h-7 px-2 justify-start text-destructive hover:text-destructive"
                  >
                    <FaSignOutAlt className={`mr-1 ${LAYOUT.ICON_SIZE.SM}`} />
                    <span className="text-xs">{LAYOUT.TEXT.LOGOUT_BUTTON}</span>
                  </Button>
                </div>
              </div>
            </SidebarFooter>
          </SidebarContent>
        </Sidebar>

        {/* Contenu principal - occupe tout l'espace disponible */}
        <div className="flex flex-col flex-1 h-full w-full overflow-hidden">
          {/* Bouton de la sidebar à l'extérieur avec info raccourci clavier */}
          <div className="p-2 flex items-center justify-between border-b">
            <div className="flex items-center">
              <SidebarTrigger />
              <span className="ml-2 text-xs text-muted-foreground hidden md:inline-flex items-center">
                <kbd className="mx-1 px-1.5 py-0.5 bg-muted rounded border text-xs font-mono">
                  {SIDEBAR_KEYBOARD_SHORTCUTS.mac}
                </kbd>
                ou{" "}
                <kbd className="mx-1 px-1.5 py-0.5 bg-muted rounded border text-xs font-mono">
                  {SIDEBAR_KEYBOARD_SHORTCUTS.windows}
                </kbd>
              </span>
            </div>
            <div className="flex items-center gap-2">
              {/* Darkmode */}
              <ThemeToggle />
            </div>
          </div>

          {/* Zone de contenu avec marges et padding appropriés */}
          <main
            className={`flex-1 overflow-auto ${LAYOUT.CONTENT_PADDING} w-full`}
          >
            {children}
            <div className={`${LAYOUT.FOOTER_MARGIN}`}>
              <Footer />
            </div>
          </main>
          <Toaster />
          <CommandPalette
            commands={allCommands}
            open={isOpen}
            onOpenChange={setIsOpen}
          />
        </div>
      </div>
    </SidebarProvider>
  );
}

export default Layout;
