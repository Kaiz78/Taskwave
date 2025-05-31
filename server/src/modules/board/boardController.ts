import { Request, Response } from 'express';
import { asyncWrapper, sendResponse } from '../../utils/asyncWrapper';
import { boardService } from './boardService';

// Créer un nouveau tableau
export const createBoard = asyncWrapper(async (req: Request, res: Response) => {
  const { title, description, backgroundColor } = req.body;
  const userId = req.user.id;

  const board = await boardService.createBoard(userId, {
    title,
    description,
    backgroundColor
  });

  if (!board) {
    return sendResponse(res, 500, null, 'Erreur lors de la création du tableau');
  }

  return sendResponse(res, 201, { board }, 'Tableau créé avec succès');
});

// Récupérer tous les tableaux de l'utilisateur
export const getBoards = asyncWrapper(async (req: Request, res: Response) => {
  const userId = req.user.id;

  const boardsWithCounts = await boardService.getAllBoards(userId);

  if (!boardsWithCounts) {
    return sendResponse(res, 500, null, 'Erreur lors de la récupération des tableaux');
  }

  return sendResponse(res, 200, { boards: boardsWithCounts }, 'Tableaux récupérés avec succès');
});

// Récupérer un tableau spécifique avec ses colonnes et tâches
export const getBoardById = asyncWrapper(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user.id;

  const board = await boardService.getBoardById(id, userId);

  if (!board) {
    return sendResponse(res, 404, null, 'Tableau non trouvé');
  }

  return sendResponse(res, 200, { board }, 'Tableau récupéré avec succès');
});

// Mettre à jour un tableau
export const updateBoard = asyncWrapper(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, backgroundColor } = req.body;
  const userId = req.user.id;

  const updatedBoard = await boardService.updateBoard(id, userId, {
    title, 
    description,
    backgroundColor
  });

  if (!updatedBoard) {
    return sendResponse(res, 404, null, 'Tableau non trouvé');
  }

  return sendResponse(res, 200, { board: updatedBoard }, 'Tableau mis à jour avec succès');
});

// Supprimer un tableau
export const deleteBoard = asyncWrapper(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user.id;

  const success = await boardService.deleteBoard(id, userId);

  if (!success) {
    return sendResponse(res, 404, null, 'Tableau non trouvé');
  }

  return sendResponse(res, 200, null, 'Tableau supprimé avec succès');
});
