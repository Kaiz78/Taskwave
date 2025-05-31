import { Request, Response } from 'express';
import { asyncWrapper, sendResponse } from '../../utils/asyncWrapper';
import { columnService } from './columnService';

// Créer une nouvelle colonne
export const createColumn = asyncWrapper(async (req: Request, res: Response) => {
  const { title, boardId, position, color } = req.body;
  const userId = req.user.id;

  const column = await columnService.createColumn({
    title,
    boardId,
    position,
    color
  }, userId);

  if (!column) {
    return sendResponse(res, 404, null, 'Tableau non trouvé');
  }

  return sendResponse(res, 201, { column }, 'Colonne créée avec succès');
});

// Récupérer toutes les colonnes d'un tableau (voir boardController.ts)


// Mettre à jour une colonne
export const updateColumn = asyncWrapper(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, position, color } = req.body;
  const userId = req.user.id;
  

  console.log(`Mise à jour de la colonne ${id} par l'utilisateur ${userId}`);

  const updatedColumn = await columnService.updateColumn(id, userId, {
    title,
    position,
    color
  });

  if (!updatedColumn) {
    return sendResponse(res, 404, null, 'Colonne non trouvée');
  }

  return sendResponse(res, 200, { column: updatedColumn }, 'Colonne mise à jour avec succès');
});

// Supprimer une colonne
export const deleteColumn = asyncWrapper(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user.id;

  const success = await columnService.deleteColumn(id, userId);

  if (!success) {
    return sendResponse(res, 404, null, 'Colonne non trouvée');
  }

  return sendResponse(res, 200, null, 'Colonne supprimée avec succès');
});


