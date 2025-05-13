import { Request, Response, NextFunction } from 'express';

// Middleware pour gérer les erreurs de manière centrale
const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Erreur:', err);

  // Erreurs Prisma
  if (err.name === 'PrismaClientKnownRequestError') {
    return res.status(400).json({
      message: 'Erreur de base de données',
      error: err.message
    });
  }

  // Erreurs de validation
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Erreur de validation',
      error: err.message
    });
  }

  // Erreurs d'authentification
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      message: 'Non autorisé',
      error: err.message
    });
  }

  // Erreurs par défaut
  return res.status(500).json({
    message: 'Erreur serveur',
    error: process.env.NODE_ENV === 'production' ? 'Une erreur est survenue' : err.message
  });
};

export default errorHandler;
