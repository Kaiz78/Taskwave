import { Request, Response, NextFunction } from 'express';

// Wrapper pour les fonctions asynchrones afin d'éviter try/catch répétitifs
export const asyncWrapper = (fn: Function) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

// Fonction pour générer une réponse standardisée
export const sendResponse = (res: Response, statusCode: number, data: any = null, message: string = '') => {
  const success = statusCode >= 200 && statusCode < 400;
  
  const response: any = { success };
  if (message) response.message = message;
  if (data !== null) response.data = data;
  
  return res.status(statusCode).json(response);
};
