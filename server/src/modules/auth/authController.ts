import { Request, Response } from 'express';

import { asyncWrapper, sendResponse } from '../../utils/asyncWrapper';
import { authService } from './authService';

// Message pour expliquer que l'authentification locale est désactivée
export const register = asyncWrapper(async (req: Request, res: Response) => {
  return sendResponse(res, 400, null, 'L\'inscription par email/mot de passe est désactivée. Veuillez utiliser l\'authentification Discord.');
});

// Message pour expliquer que l'authentification locale est désactivée
export const login = asyncWrapper(async (req: Request, res: Response) => {
  return sendResponse(res, 400, null, 'La connexion par email/mot de passe est désactivée. Veuillez utiliser l\'authentification Discord.');
});

// Récupérer le profil de l'utilisateur connecté
export const getProfile = asyncWrapper(async (req: Request, res: Response) => {
  return sendResponse(res, 200, { user: req.user }, 'Profil récupéré avec succès');
});

// Mettre à jour le profil
export const updateProfile = asyncWrapper(async (req: Request, res: Response) => {
  return sendResponse(res, 400, [], 'La mise à jour du profil par email/mot de passe est désactivée.');
});

// OAuth avec Discord (point d'entrée)
export const discordAuth = (req: Request, res: Response) => {
  const redirectUrl = authService.getDiscordAuthUrl();
  res.redirect(redirectUrl);
};

// Callback pour Discord OAuth
export const discordCallback = asyncWrapper(async (req: Request, res: Response) => {
  const { code } = req.query;

  if (!code) {
    return sendResponse(res, 400, null, 'Code d\'autorisation manquant');
  }

  try {
    const result = await authService.handleDiscordCallback(code as string);
    
    if (!result || !result.user || !result.token) {
      console.error('Échec de l\'authentification');
      return res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/auth-callback?error=auth`);
    }

    // Rediriger vers le frontend avec le token
    return res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/auth-callback?token=${result.token}`);
  } catch (error) {
    console.error('Erreur OAuth Discord:', error);
    return res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/auth-callback?error=true`);
  }
});

// Déconnexion de l'utilisateur
export const logout = asyncWrapper(async (req: Request, res: Response) => {
  // Récupérer le token depuis la requête (ajouté par le middleware auth)
  const token = req.headers.authorization?.split(' ')[1] || req.token;
  
  if (!token) {
    return sendResponse(res, 400, null, 'Token non fourni');
  }
  
  const success = await authService.logout(token);
  
  if (!success) {
    return sendResponse(res, 400, null, 'Erreur lors de la déconnexion');
  }
  
  return sendResponse(res, 200, null, 'Déconnexion réussie');
});

// Supprimer le compte utilisateur et toutes les données associées
export const deleteAccount = asyncWrapper(async (req: Request, res: Response) => {
  const userId = req.user.id;
  
  try {
    const success = await authService.deleteAccount(userId);
    
    if (!success) {
      return sendResponse(res, 500, null, 'Une erreur est survenue lors de la suppression du compte');
    }
    
    // Récupérer le token pour le blacklister
    const token = req.headers.authorization?.split(' ')[1] || req.token;
    if (token) {
      await authService.logout(token);
    }
    
    return sendResponse(res, 200, null, 'Compte et toutes les données associées supprimés avec succès');
  } catch (error) {
    console.error('Erreur lors de la suppression du compte:', error);
    return sendResponse(res, 500, null, 'Une erreur est survenue lors de la suppression du compte');
  }
});