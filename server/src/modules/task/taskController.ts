import { Request, Response } from 'express';
import { asyncWrapper, sendResponse } from '../../utils/asyncWrapper';
import { taskService } from './taskService';

// Créer une nouvelle tâche
export const createTask = asyncWrapper(async (req: Request, res: Response) => {
  const {
    title,
    description,
    columnId,
    position,
    priority,
    dueDate,
    assigneeId,
    labels,
    attachments,
    completed
  } = req.body;

  const userId = req.user.id;

  const task = await taskService.createTask({
    title,
    description,
    columnId,
    position,
    priority,
    dueDate,
    assigneeId,
    labels,
    attachments,
    completed
  }, userId);

  if (!task) {
    return sendResponse(res, 404, null, 'Colonne non trouvée');
  }

  return sendResponse(res, 201, { task }, 'Tâche créée avec succès');
});

// Récupérer toutes les tâches de l'utilisateur
export const getAllTasks = asyncWrapper(async (req: Request, res: Response) => {
  const userId = req.user.id;

  const tasks = await taskService.getAllTasksForUser(userId);

  return sendResponse(res, 200, { tasks }, 'Tâches récupérées avec succès');
});

// Mettre à jour une tâche
export const updateTask = asyncWrapper(async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    title,
    description,
    columnId,
    position,
    priority,
    dueDate,
    assigneeId,
    labels,
    attachments,
    completed
  } = req.body;

  const userId = req.user.id;

  const updatedTask = await taskService.updateTask(id, userId, {
    title,
    description,
    columnId,
    position,
    priority,
    dueDate,
    assigneeId,
    labels,
    attachments,
    completed
  });

  if (!updatedTask) {
    return sendResponse(res, 404, null, 'Tâche non trouvée');
  }

  return sendResponse(res, 200, { task: updatedTask }, 'Tâche mise à jour avec succès');
});

// Supprimer une tâche
export const deleteTask = asyncWrapper(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user.id;

  const success = await taskService.deleteTask(id, userId);

  if (!success) {
    return sendResponse(res, 404, null, 'Tâche non trouvée');
  }

  return sendResponse(res, 200, null, 'Tâche supprimée avec succès');
});

// Déplacer une tâche
export const moveTask = asyncWrapper(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { columnId, position } = req.body;
  const userId = req.user.id;

  const updatedTask = await taskService.moveTask(id, userId, {
    columnId,
    position
  });

  if (!updatedTask) {
    return sendResponse(res, 404, null, 'Tâche non trouvée');
  }

  return sendResponse(res, 200, { task: updatedTask }, 'Tâche déplacée avec succès');
});


