// Méthode simulée pour getAllTasksWithBoardInfo
import { Priority } from '@/types/kanban.types';

export const mockTasksWithBoardInfo = async () => {
  // Simulation d'un délai réseau
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return [
    {
      id: "task-1",
      title: "Implémenter le drag & drop",
      description: "Ajouter la fonctionnalité de glisser-déposer pour les tâches",
      priority: Priority.HIGH,
      completed: false,
      position: 1,
      columnId: "col-1",
      boardId: "board-1",
      boardTitle: "Développement Taskwave",
      boardColor: "#3498db",
      createdAt: new Date(2025, 4, 15),
      updatedAt: new Date(2025, 4, 16),
    },
    {
      id: "task-2",
      title: "Corriger le bug d'affichage sur mobile",
      description: "Le layout est cassé sur les petits écrans",
      priority: Priority.URGENT,
      completed: true,
      position: 2,
      columnId: "col-1",
      boardId: "board-1",
      boardTitle: "Développement Taskwave",
      boardColor: "#3498db",
      createdAt: new Date(2025, 4, 14),
      updatedAt: new Date(2025, 4, 16),
    },
    {
      id: "task-3",
      title: "Ajouter le support des thèmes",
      description: "Permettre à l'utilisateur de choisir un thème clair ou sombre",
      priority: Priority.NORMAL,
      completed: false,
      position: 3,
      columnId: "col-2",
      boardId: "board-2",
      boardTitle: "UX/UI",
      boardColor: "#2ecc71",
      createdAt: new Date(2025, 4, 13),
      updatedAt: new Date(2025, 4, 14),
    }
  ];
};
