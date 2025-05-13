import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { prisma } from '../server';
import { config } from '../config/env';
import { asyncWrapper, sendResponse } from '../utils/asyncWrapper';
import { DiscordProvider, DiscordProfile } from '../services/auth/discordProvider'

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
  const { name, avatarUrl } = req.body;
  const userId = req.user.id;

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      name: name || undefined,
      avatarUrl: avatarUrl || undefined
    },
    select: {
      id: true,
      name: true,
      email: true,
      provider: true,
      avatarUrl: true
    }
  });

  return sendResponse(res, 200, { user: updatedUser }, 'Profil mis à jour avec succès');
});

// Initialiser le fournisseur Discord
const discordProvider = new DiscordProvider({
  clientId: config.discordClientId as string,
  clientSecret: config.discordClientSecret as string,
  callbackUrl: config.discordCallbackUrl as string
});

// OAuth avec Discord (point d'entrée)
export const discordAuth = (req: Request, res: Response) => {
  const redirectUrl = discordProvider.getAuthorizationUrl();
  res.redirect(redirectUrl);
};

// Callback pour Discord OAuth
export const discordCallback = asyncWrapper(async (req: Request, res: Response) => {
  const { code } = req.query;

  if (!code) {
    return sendResponse(res, 400, null, 'Code d\'autorisation manquant');
  }

  try {
    // Récupérer le token d'accès
    const accessToken = await discordProvider.getToken(code as string);
    if (!accessToken) {
      return sendResponse(res, 400, null, 'Échec de l\'authentification Discord');
    }
    
    // Récupérer le profil utilisateur
    const discordUser = await discordProvider.getUserProfile(accessToken);
    if (!discordUser) {
      return sendResponse(res, 400, null, 'Échec de la récupération des données utilisateur Discord');
    }





    // Rechercher si l'utilisateur existe déjà par email
    let user = await prisma.user.findUnique({
      where: { email: discordUser.email }
    });

    // Si pas trouvé par email, chercher par provider + providerId
    if (!user) {
      user = await prisma.user.findFirst({
        where: {
          AND: [
            { provider: 'DISCORD' },
            { providerId: discordUser.id }
          ]
        }
      });
    }

    let dbUser;
    
    if (!user) {
      try {
        // Créer un nouvel utilisateur
        dbUser = await prisma.user.create({
          data: {
            name: discordUser.username,
            email: discordUser.email,
            provider: 'DISCORD',
            providerId: discordUser.id,
            avatarUrl: discordUser.image_url || null // Utilisation de l'image URL calculée
          }
        });
      } catch (dbError) {
        console.error('Erreur création utilisateur:', dbError);
        return res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/auth-callback?error=database`);
      }
    } else {
      try {
        // Mise à jour des informations Discord si l'utilisateur existe déjà
        dbUser = await prisma.user.update({
          where: { id: user.id },
          data: {
            name: discordUser.username,
            avatarUrl: discordUser.image_url || user.avatarUrl,
            provider: 'DISCORD',
            providerId: discordUser.id
          }
        });
      } catch (dbError) {
        console.error('Erreur mise à jour utilisateur:', dbError);
        return res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/auth-callback?error=database`);
      }
    }

    if (!dbUser) {
      console.error('Utilisateur non créé ou mis à jour');
      return res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/auth-callback?error=database`);
    }

    try {
      // Générer un token JWT
      // @ts-ignore
      const token = jwt.sign(
        { userId: dbUser.id, email: dbUser.email },
        config.jwtSecret as string,
        { expiresIn: config.jwtExpiresIn }
      );

      // Rediriger vers le frontend avec le token
      return res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/auth-callback?token=${token}`);
    } catch (jwtError) {
      console.error('Erreur génération JWT:', jwtError);
      return res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/auth-callback?error=auth`);
    }
  } catch (error) {
    console.error('Erreur OAuth Discord:', error);
    return res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/auth-callback?error=true`);
  }
});
