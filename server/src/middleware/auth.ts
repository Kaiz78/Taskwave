import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { prisma } from '../server';

// Extension de l'interface Request pour y ajouter l'utilisateur
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Récupérer le token du header Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Accès non autorisé, token manquant' });
    }

    // Extraire le token
    const token = authHeader.split(' ')[1];
    
    // Vérifier le token
    const decoded: any = jwt.verify(token, config.jwtSecret as jwt.Secret);
    
    // Trouver l'utilisateur dans la base de données
    const user = await prisma.user.findUnique({
      where: {
        id: decoded.userId
      },
      select: {
        id: true,
        email: true,
        name: true,
        provider: true,
        avatarUrl: true
      }
    });

    if (!user) {
      return res.status(401).json({ message: 'Utilisateur introuvable' });
    }

    // Attacher l'utilisateur à la requête
    req.user = user;
    
    next();
  } catch (error) {
    console.error('Erreur d\'authentification:', error);
    return res.status(401).json({ message: 'Token invalide ou expiré' });
  }
};

// Middleware d'autorisation optionnel pour les routes qui peuvent être publiques ou privées
export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(); // Continuer sans authentification
    }

    const token = authHeader.split(' ')[1];
    const decoded: any = jwt.verify(token, config.jwtSecret);
    
    const user = await prisma.user.findUnique({
      where: {
        id: decoded.userId
      },
      select: {
        id: true,
        email: true,
        name: true,
        provider: true,
        avatarUrl: true
      }
    });

    if (user) {
      req.user = user;
    }
    
    next();
  } catch (error) {
    // En cas d'erreur, on continue sans authentification
    next();
  }
};
