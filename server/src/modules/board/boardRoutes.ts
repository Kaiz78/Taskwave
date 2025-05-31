import express from 'express';
import { createBoard, getBoards, getBoardById, updateBoard, deleteBoard } from './boardController';
import { auth } from '../../middleware/auth';
import { validate, boardSchema } from '../../middleware/validation';

const router = express.Router();

// Toutes les routes nécessitent une authentification
router.use(auth);

// Routes CRUD pour les tableaux
router.post('/', validate(boardSchema), createBoard);
router.get('/', getBoards);
router.get('/:id', getBoardById);
router.put('/:id', validate(boardSchema), updateBoard);
router.delete('/:id', deleteBoard);

export default router;
