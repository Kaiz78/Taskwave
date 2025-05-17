import type { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  FaSignOutAlt,
  FaHome,
  FaCog,
} from "react-icons/fa";
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
import { useAuthStore } from "@/store/useAuthStore";
import { Avatar } from "@/components/ui/avatar";
import ThemeToggle from "./ThemeToggle";

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

  // Fonction pour gérer la déconnexion
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Menu items.
  const items = [
    {
      title: "Accueil",
      url: "/",
      icon: FaHome,
    },
    {
      title: "Paramètres",
      url: "/settings",
      icon: FaCog,
    },
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
                alt="Taskwave"
                className="h-6 w-6"
              />
              <span className="font-semibold text-lg">Taskwave</span>
            </div>
          </SidebarHeader>

          {/* Contenu de la sidebar - avec flex-1 pour permettre au footer d'être en bas */}
          <SidebarContent className="flex flex-col flex-1">
            {/* Zone principale qui peut scroller si nécessaire */}
            <div className="flex-1 overflow-y-auto">
              <SidebarGroup>
                <SidebarGroupLabel>Application</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {items.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          onClick={() => navigate(item.url)}
                          isActive={location.pathname === item.url}
                          data-active={location.pathname === item.url}
                        >
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </div>

            {/* Bouton de déconnexion - maintenant fixe en bas */}
            <SidebarFooter className="mt-auto border-t">
              <div className="flex items-center gap-3 px-2 py-2">
                <Avatar
                  src={avatarUrl || undefined}
                  fallback={username?.charAt(0).toUpperCase() || "U"}
                  className="h-10 w-10 border border-border"
                />
                <div className="flex flex-col">
                  <span className="font-medium truncate max-w-[120px]">
                    {username || "Utilisateur"}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="h-7 px-2 justify-start text-destructive hover:text-destructive"
                  >
                    <FaSignOutAlt className="mr-1 h-3 w-3" />
                    <span className="text-xs">Se déconnecter</span>
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
                  ⌘ + B
                </kbd>
                ou{" "}
                <kbd className="mx-1 px-1.5 py-0.5 bg-muted rounded border text-xs font-mono">
                  Ctrl+B
                </kbd>
              </span>
            </div>
            <div className="flex items-center">
              {/* Darkmode */}
              <ThemeToggle />
            </div>
          </div>

          {/* Zone de contenu avec marges et padding appropriés */}
          <main className="flex-1 overflow-auto p-4 w-full">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default Layout;
