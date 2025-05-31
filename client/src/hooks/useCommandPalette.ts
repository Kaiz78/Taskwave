import { useNavigate } from "react-router-dom";
import type { CommandAction } from "@/components/common/CommandPalette";
import { 
  DEFAULT_COMMANDS, 
  APP_COMMAND_IDS,
  DYNAMIC_COMMAND_ICONS
} from "@/constants/commands";
import type { BoardData } from "@/types/board.types";

/**
 * Hook pour initialiser la palette de commandes avec des commandes par défaut
 * Configure les actions de navigation pour chaque commande
 */
export function useCommandPalette() {
  const navigate = useNavigate();

  // Configurez les actions de navigation pour chaque commande
  const defaultCommands: CommandAction[] = DEFAULT_COMMANDS.map(command => {
    switch (command.id) {
      case "home":
        return { ...command, action: () => navigate("/") };
      case "settings":
        return { ...command, action: () => navigate("/settings") };
      case "help":
        return { ...command, action: () => navigate("/help") };
      case "board":
        return { ...command, action: () => navigate("/board") };
      case "tasks":
        return { ...command, action: () => navigate("/tasks") };
      default:
        return command;
    }
  });

  /**
   * Fonction utilitaire pour créer une commande de déconnexion personnalisée
   * @param logoutAction Fonction de déconnexion à exécuter
   * @returns Commande de déconnexion
   */
  const createLogoutCommand = (logoutAction: () => void): CommandAction => ({
    id: APP_COMMAND_IDS.LOGOUT,
    name: "Déconnexion",
    action: logoutAction,
    icon: DYNAMIC_COMMAND_ICONS.logout,
    keywords: ["logout", "sign out", "déconnexion", "quitter"],
  });

  /**
   * Fonction utilitaire pour convertir les boards en commandes
   * @param boards Liste des boards à convertir
   * @returns Liste des commandes pour naviguer vers les boards
   */
  const createBoardCommands = (boards: BoardData[]): CommandAction[] => {
    return boards.map(board => ({
      id: `${APP_COMMAND_IDS.BOARD_PREFIX}${board.id}`,
      name: board.title,
      action: () => navigate(`/boards/${board.id}`),
      icon: DYNAMIC_COMMAND_ICONS.board,
      keywords: ["board", "tableau", board.title],
    }));
  };

  return {
    defaultCommands,
    createLogoutCommand,
    createBoardCommands,
  };
}

export default useCommandPalette;
