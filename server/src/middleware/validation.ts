import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

// Fonction de validation générique
export const validate = (schema: z.ZodTypeAny) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: 'Données invalides', 
          errors: error.errors.map(err => ({
            path: err.path.join('.'),
            message: err.message
          }))
        });
      }
      
      return res.status(400).json({ message: 'Erreur de validation' });
    }
  };
};

// Schémas de validation pour les différentes entités

// User
// ...

// Board
export const boardSchema = z.object({
  title: z.string().min(1, 'Le titre est requis'),
  description: z.string().optional(),
  backgroundColor: z.string().optional()
});

// Column
export const columnSchema = z.object({
  title: z.string().min(1, 'Le titre est requis'),
  boardId: z.string().min(1, 'L\'ID du tableau est requis'),
  position: z.number().int().nonnegative(),
  color: z.string().optional()
});

// Task
export const taskSchema = z.object({
  title: z.string().min(1, 'Le titre est requis'),
  description: z.string().optional(),
  columnId: z.string().min(1, 'L\'ID de la colonne est requis'),
  position: z.number().int().nonnegative(),
  priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT']).optional(),
  dueDate: z.string().optional().nullable(),
  assigneeId: z.string().optional().nullable(),
  labels: z.array(z.string()).optional(),
  attachments: z.array(z.string()).optional(),
  completed: z.boolean().optional()
});
