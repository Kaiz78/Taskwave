import express from 'express';
import { 
  createTask, 
  updateTask, 
  deleteTask,
  moveTask, 
  getAllTasks
} from './taskController';
import { auth } from '../../middleware/auth';
import { validate, taskSchema, taskUpdateSchema, taskMoveSchema } from '../../middleware/validation';

const router = express.Router();

// Toutes les routes nécessitent une authentification
router.use(auth);

// Routes CRUD pour les tâches
router.get('/', getAllTasks);
router.post('/', validate(taskSchema), createTask);
router.put('/:id', validate(taskUpdateSchema), updateTask);
router.put('/:id/move', validate(taskMoveSchema), moveTask);
router.delete('/:id', deleteTask);

export default router;
