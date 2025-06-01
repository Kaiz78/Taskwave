// Import des hooks et composants nécessaires
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { FiCalendar, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { formatDistanceToNow, formatDateToString } from "@/lib/utils";
import { TASK } from "@/constants/task.ts";

// Import des composants requis
import { SearchBar } from "@/components/common/SearchBar";
import { FilterBar } from "@/components/common/FilterBar";
import TaskDetailsModal from "@/components/kanban/tasks/TaskDetailsModal";

// Import du hook personnalisé
import { useTaskPage } from "@/hooks/useTaskPage";

export default function TaskPage() {
  // Utiliser le hook personnalisé pour gérer la logique
  const {
    loading,
    error,
    currentPage,
    currentTasks,
    totalPages,
    indexOfFirstTask,
    indexOfLastTask,
    filteredTasks,
    selectedTask,
    isModalOpen,
    uniqueBoards,
    handleOpenModal,
    handleCloseModal,
    handleTasksChanged,
    handlePriorityFilter,
    handleBoardFilter,
    handleStatusFilter,
    handleSearch,
    paginate,
  } = useTaskPage();

  // Options de priorité pour le filtre
  const priorityOptions = {
    all: "Toutes les priorités",
    low: TASK.PRIORITY.LOW,
    normal: TASK.PRIORITY.NORMAL,
    high: TASK.PRIORITY.HIGH,
    urgent: TASK.PRIORITY.URGENT,
  };

  // Options de statut pour le filtre
  const statusOptions = {
    all: "Tous les statuts",
    completed: "Terminée",
    "in-progress": "En cours",
  };

  // Fonction pour convertir la priorité en badge avec couleur
  const getPriorityBadge = (priority: string) => {
    switch (priority.toUpperCase()) {
      case "LOW":
        return (
          <Badge
            variant="secondary"
            className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
          >
            {TASK.PRIORITY.LOW}
          </Badge>
        );
      case "NORMAL":
        return (
          <Badge
            variant="secondary"
            className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
          >
            {TASK.PRIORITY.NORMAL}
          </Badge>
        );
      case "HIGH":
        return (
          <Badge
            variant="secondary"
            className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
          >
            {TASK.PRIORITY.HIGH}
          </Badge>
        );
      case "URGENT":
        return (
          <Badge
            variant="secondary"
            className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
          >
            {TASK.PRIORITY.URGENT}
          </Badge>
        );
      default:
        return <Badge variant="outline">Inconnue</Badge>;
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col space-y-4">
        <h1 className="text-3xl font-bold">Mes tâches</h1>
        <p className="text-muted-foreground">
          Gérez toutes vos tâches à travers vos différents tableaux
        </p>
      </div>

      {/* Barre de filtres et recherche */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2">
          <FilterBar
            onFilterChange={handlePriorityFilter}
            buttonText="Priorité"
            dropdownLabel="Filtrer par priorité"
            sortOptions={priorityOptions}
          />
          <FilterBar
            onFilterChange={handleBoardFilter}
            buttonText="Tableau"
            dropdownLabel="Filtrer par tableau"
            sortOptions={uniqueBoards}
          />
          <FilterBar
            onFilterChange={handleStatusFilter}
            buttonText="Statut"
            dropdownLabel="Filtrer par statut"
            sortOptions={statusOptions}
          />
        </div>

        <div className="grow max-w-md">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Rechercher des tâches..."
          />
        </div>
      </div>

      {/* Affichage des erreurs */}
      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md">
          {error}
        </div>
      )}

      {/* Tableau principal des tâches */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : filteredTasks.length === 0 ? (
        <Card className="text-center p-8">
          <CardContent className="pt-8 pb-8">
            <p className="text-muted-foreground">
              Aucune tâche ne correspond à vos critères.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Titre</TableHead>
                  <TableHead>Tableau</TableHead>
                  <TableHead>Priorité</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Date d'échéance</TableHead>
                  <TableHead>Créée le</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentTasks.map((task) => (
                  <TableRow
                    key={task.id}
                    className={task.completed ? "opacity-70" : ""}
                  >
                    <TableCell className="font-medium">
                      <div className="max-w-[300px] truncate">{task.title}</div>
                    </TableCell>
                    <TableCell>
                      {task.boardTitle ? (
                        <div className="flex items-center gap-2">
                          {task.boardColor && (
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: task.boardColor }}
                            ></div>
                          )}
                          <span>{task.boardTitle}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>{getPriorityBadge(task.priority)}</TableCell>
                    <TableCell>
                      {task.completed ? (
                        <Badge
                          variant="outline"
                          className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        >
                          Terminée
                        </Badge>
                      ) : (
                        <Badge variant="outline">En cours</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {task.dueDate && (
                        <div className="flex items-center gap-1 text-sm">
                          <FiCalendar className="h-3 w-3 text-blue-500" />
                          {formatDateToString(task.dueDate)}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-muted-foreground text-sm">
                        <FiCalendar className="h-3 w-3" />
                        {formatDistanceToNow(new Date(task.createdAt), {
                          addSuffix: true,
                        })}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenModal(task)}
                      >
                        Détails
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              Affichage de {indexOfFirstTask + 1} à{" "}
              {Math.min(indexOfLastTask, filteredTasks.length)} sur{" "}
              {filteredTasks.length} tâches
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <FiChevronLeft className="h-4 w-4" />
              </Button>
              <div className="text-sm">
                Page {currentPage} sur {totalPages || 1}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                <FiChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Modal de détails de tâche */}
      {selectedTask && isModalOpen && (
        <TaskDetailsModal
          boardId={selectedTask.boardId}
          isOpen={isModalOpen}
          task={selectedTask}
          onClose={handleCloseModal}
          onTaskChanged={handleTasksChanged}
        />
      )}
    </div>
  );
}
