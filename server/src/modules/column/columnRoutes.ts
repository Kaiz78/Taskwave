import express from 'express';
import { createColumn, updateColumn, deleteColumn } from './columnController';
import { auth } from '../../middleware/auth';
import { validate, columnSchema, columnUpdateSchema } from '../../middleware/validation';

const router = express.Router();

// Toutes les routes nécessitent une authentification
router.use(auth);

// Routes CRUD pour les colonnes
router.post('/', validate(columnSchema), createColumn);
router.put('/:id', validate(columnUpdateSchema), updateColumn);
router.delete('/:id', deleteColumn);

export default router;
