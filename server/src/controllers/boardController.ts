import { Request, Response } from 'express';
import { prisma } from '../server';
import { asyncWrapper, sendResponse } from '../utils/asyncWrapper';

// Créer un nouveau tableau
export const createBoard = asyncWrapper(async (req: Request, res: Response) => {
  const { title, description, backgroundColor } = req.body;
  const userId = req.user.id;

  const board = await prisma.board.create({
    data: {
      title,
      description,
      backgroundColor,
      owner: { connect: { id: userId } }
    }
  });

  return sendResponse(res, 201, { board }, 'Tableau créé avec succès');
});

// Récupérer tous les tableaux de l'utilisateur
export const getBoards = asyncWrapper(async (req: Request, res: Response) => {
  const userId = req.user.id;

  const boards = await prisma.board.findMany({
    where: {
      ownerId: userId
    },
    orderBy: {
      updatedAt: 'desc'
    },
    include: {
      columns: {
        include: {
          tasks: true
        }
      }
    }
  });

  const boardsWithCounts = boards.map(board => {
    const columnsCount = board.columns.length;
    const tasksCount = board.columns.reduce((total, column) => {
      return total + column.tasks.length;
    }, 0);

    // Nettoyage de la réponse si besoin (éviter d’envoyer les colonnes entières)
    return {
      id: board.id,
      title: board.title,
      description: board.description,
      backgroundColor: board.backgroundColor,
      createdAt: board.createdAt,
      updatedAt: board.updatedAt,
      columnsCount,
      tasksCount
    };
  });

  return sendResponse(res, 200, { boards: boardsWithCounts }, 'Tableaux récupérés avec succès');
});


// Récupérer un tableau spécifique avec ses colonnes et tâches
export const getBoardById = asyncWrapper(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user.id;

  const board = await prisma.board.findUnique({
    where: {
      id,
      ownerId: userId
    },
    include: {
      columns: {
        orderBy: {
          position: 'asc'
        },
        include: {
          tasks: {
            orderBy: {
              position: 'asc'
            },
            include: {
              assignee: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  avatarUrl: true
                }
              }
            }
          }
        }
      }
    }
  });

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

  // Vérifier si le tableau existe et appartient à l'utilisateur
  const existingBoard = await prisma.board.findUnique({
    where: {
      id,
      ownerId: userId
    }
  });

  if (!existingBoard) {
    return sendResponse(res, 404, null, 'Tableau non trouvé');
  }

  const updatedBoard = await prisma.board.update({
    where: { id },
    data: {
      title,
      description,
      backgroundColor
    }
  });

  return sendResponse(res, 200, { board: updatedBoard }, 'Tableau mis à jour avec succès');
});

// Supprimer un tableau
export const deleteBoard = asyncWrapper(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = req.user.id;

  // Vérifier si le tableau existe et appartient à l'utilisateur
  const existingBoard = await prisma.board.findUnique({
    where: {
      id,
      ownerId: userId
    }
  });

  if (!existingBoard) {
    return sendResponse(res, 404, null, 'Tableau non trouvé');
  }

  await prisma.board.delete({
    where: { id }
  });

  return sendResponse(res, 200, null, 'Tableau supprimé avec succès');
});
