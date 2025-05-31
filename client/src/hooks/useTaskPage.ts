import { useState, useEffect, useMemo } from "react";
import { taskService } from "@/services/taskService";
import { useAuthStore } from "@/store/useAuthStore";
import { useTaskHandlers } from "@/hooks/kanban/useTaskHandlers";
import type { Task } from "@/types/kanban.types";
import { toast } from "sonner";
import { getRandomColor } from "@/lib/utils";

// Interface pour les tâches avec l'information du tableau
import type { EnhancedTask } from "@/types/task-page.types";

export function useTaskPage() {
  // État pour stocker les tâches
  const [tasks, setTasks] = useState<EnhancedTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // État pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [tasksPerPage] = useState(10);

  // État pour les filtres et la recherche
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [filterBoard, setFilterBoard] = useState<string>("all");

  // État pour le modal de détails
  const [selectedTask, setSelectedTask] = useState<EnhancedTask | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Obtenir le token depuis le store d'authentification
  const { token } = useAuthStore();
  
  // Utiliser le hook pour les opérations sur les tâches
  const taskHandlers = useTaskHandlers({});

  // Récupérer les tableaux disponibles pour le filtre
  const uniqueBoards = useMemo(() => {
    const boards: Record<string, string> = { "all": "Tous les tableaux" };
    
    // Utiliser un Set pour suivre les tableaux déjà traités
    const processedBoards = new Set<string>();
    
    tasks.forEach(task => {
      // S'assurer que nous avons un ID de tableau valide et que nous ne l'avons pas déjà traité
      if (task.boardId && task.boardTitle && !processedBoards.has(task.boardId)) {
        boards[task.boardId] = task.boardTitle;
        processedBoards.add(task.boardId);
      }
    });
    
    return boards;
  }, [tasks]);

  // Charger les tâches avec les informations des tableaux au chargement de la page
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const tasksData = await taskService.getAllTasks(token || undefined);

        // Transformer les tâches en EnhancedTask
        // Dans une vraie application, les infos du tableau seraient récupérées via le boardService
        // ou directement via une API qui retourne les tâches avec leurs tableaux
        const enhancedTasks = tasksData.map((task: Task) => {
          // Extraire les informations du tableau de manière sécurisée
          const column = task.column as { board?: { id?: string; title?: string } }; // Cast to a type that includes 'board'
          let boardId = "unknown";
          let boardTitle = "Sans tableau";
          
          // Vérifier si nous avons des informations de tableau dans la colonne
          if (column && column.board) {
            boardId = column.board.id || task.columnId.split('-')[0] || "unknown";
            boardTitle = column.board.title || "Sans titre";
          } else {
            // Fallback : extraire l'ID du tableau à partir de l'ID de colonne
            boardId = task.columnId.split('-')[0] || "unknown";
          }
          
          return {
            ...task,
            boardId: boardId,
            boardTitle: boardTitle,
            boardColor: getRandomColor(boardId), // Utiliser l'ID du tableau pour la cohérence des couleurs
          };
        }) as EnhancedTask[];

        setTasks(enhancedTasks);
        setError(null);
      } catch (err) {
        console.error("Erreur lors du chargement des tâches:", err);
        setError(
          "Impossible de charger les tâches. Veuillez réessayer plus tard."
        );
      } finally {
        setLoading(false);
      }
    };



    fetchTasks();
  }, [token]);

  // Obtenir les tâches filtrées en fonction des filtres et de la recherche
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Filtre par terme de recherche
      const searchMatch =
        searchTerm === "" ||
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.description &&
          task.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (task.boardTitle &&
          task.boardTitle.toLowerCase().includes(searchTerm.toLowerCase()));

      // Filtre par priorité
      const priorityMatch =
        filterPriority === "all" ||
        task.priority.toLowerCase() === filterPriority.toLowerCase();

      // Filtre par tableau
      const boardMatch =
        filterBoard === "all" ||
        (task.boardId && task.boardId === filterBoard);

      return searchMatch && priorityMatch && boardMatch;
    });
  }, [tasks, searchTerm, filterPriority, filterBoard]);

  // Calculer les tâches à afficher sur la page actuelle
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);

  // Calculer le nombre total de pages
  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

  // Fonction pour changer de page
  const paginate = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Gestionnaires pour le modal de détails
  const handleOpenModal = (task: EnhancedTask) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  // Fonction pour rafraîchir les tâches après une modification
  const handleTasksChanged = async () => {
    try {
      const tasksData = await taskService.getAllTasks(token || undefined);

      // Transformer les tâches en EnhancedTask de la même manière que dans useEffect
      const enhancedTasks = tasksData.map((task: Task) => {

        
        const column = task.column as { board?: { id?: string; title?: string } }; // Cast to a type that includes 'board'
        let boardId = "unknown";
        let boardTitle = "Sans tableau";
        
        // Vérifier si nous avons des informations de tableau dans la colonne
        if (column && column.board) {
          boardId = column.board.id || task.columnId.split('-')[0] || "unknown";
          boardTitle = column.board.title || "Sans titre";
        } else {
          // Fallback : extraire l'ID du tableau à partir de l'ID de colonne
          boardId = task.columnId.split('-')[0] || "unknown";
        }
        
        return {
          ...task,
          boardId: boardId,
          boardTitle: boardTitle,
          boardColor: getRandomColor(boardId), // Utiliser l'ID du tableau pour la cohérence des couleurs
        };
      }) as EnhancedTask[];

      setTasks(enhancedTasks);
    } catch (error) {
      console.error("Erreur lors du rafraîchissement des tâches:", error);
      toast.error("Échec du rafraîchissement des tâches.");
    }
  };
  


  // Gérer le changement du filtre de priorité
  const handlePriorityFilter = (option: string) => {
    setFilterPriority(option);
    setCurrentPage(1); // Retour à la première page après filtrage
  };

  // Gérer le changement du filtre de tableau
  const handleBoardFilter = (option: string) => {
    setFilterBoard(option);
    setCurrentPage(1); // Retour à la première page après filtrage
  };

  // Gérer la recherche
  const handleSearch = (query: string) => {
    setSearchTerm(query);
    setCurrentPage(1); // Retour à la première page après recherche
  };

  return {
    tasks,
    loading,
    error,
    currentPage,
    tasksPerPage,
    filteredTasks,
    currentTasks,
    totalPages,
    indexOfFirstTask,
    indexOfLastTask,
    searchTerm,
    filterPriority,
    filterBoard,
    selectedTask,
    isModalOpen,
    uniqueBoards,
    paginate,
    handleOpenModal,
    handleCloseModal,
    handleTasksChanged,
    handlePriorityFilter,
    handleBoardFilter,
    handleSearch,
    taskHandlers
  };
}
