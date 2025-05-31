import * as jwt from 'jsonwebtoken';
import { config } from '../../config/env';
import { DiscordProvider } from './provider/discordProvider';

import { blacklistToken } from '../../shared/redis';
import { AuthRepository } from './authRepository';

// Initialiser le fournisseur Discord
const discordProvider = new DiscordProvider({
  clientId: config.discordClientId as string,
  clientSecret: config.discordClientSecret as string,
  callbackUrl: config.discordCallbackUrl as string
});

export class AuthService {
  private repository: AuthRepository;

  constructor() {
    this.repository = new AuthRepository();
  }

  /**
   * Obtenir l'URL d'autorisation Discord
   */
  getDiscordAuthUrl(): string {
    return discordProvider.getAuthorizationUrl();
  }

  /**
   * Traiter le callback Discord et authentifier l'utilisateur
   */
  async handleDiscordCallback(code: string): Promise<{ user: any; token: string } | null> {
    try {
      // Récupérer le token d'accès
      const accessToken = await discordProvider.getToken(code);
      if (!accessToken) {
        console.error('Échec de la récupération du token Discord');
        return null;
      }
      
      // Récupérer le profil utilisateur
      const discordUser = await discordProvider.getUserProfile(accessToken);
      if (!discordUser) {
        console.error('Échec de la récupération du profil Discord');
        return null;
      }
      
      // Vérifier que les informations essentielles sont présentes
      if (!discordUser.email || !discordUser.id || !discordUser.username) {
        console.error('Profil Discord incomplet:', 
          JSON.stringify({
            hasEmail: !!discordUser.email,
            hasId: !!discordUser.id,
            hasUsername: !!discordUser.username,
            profile: discordUser
          }, null, 2)
        );
        return null;
      }

      console.log('Profil Discord récupéré:', 
        JSON.stringify({
          id: discordUser.id,
          username: discordUser.username,
          email: discordUser.email,
          hasAvatar: !!discordUser.image_url
        }, null, 2)
      );

      // Rechercher ou créer l'utilisateur
      const dbUser = await this.repository.findOrCreateUserByDiscord(discordUser);

      if (!dbUser) {
        console.error('Échec de création/récupération de l\'utilisateur en base de données');
        return null;
      }

      // Générer un token JWT
      let token;
      try {
        // @ts-expect-error - Problème de typage avec jwt.sign
        token = jwt.sign(
          { userId: dbUser.id, email: dbUser.email },
          String(config.jwtSecret),
          { expiresIn: config.jwtExpiresIn }
        );
        console.log('Token JWT généré avec succès');
      } catch (jwtError) {
        console.error('Erreur lors de la génération du token JWT:', jwtError);
        return null;
      }


      return { user: dbUser, token };
    } catch (error) {
      console.error('Erreur dans handleDiscordCallback:', error);
      return null;
    }
  }

  /**
   * Déconnexion: blacklister le token JWT
   */
  async logout(token: string): Promise<boolean> {
    // Décoder le token pour obtenir sa durée de validité restante
    const decoded: any = jwt.decode(token);
    
    if (!decoded || !decoded.exp) {
      return false;
    }
    
    // Calculer la durée restante en secondes
    const expiresIn = decoded.exp - Math.floor(Date.now() / 1000);
    
    // Si le token est encore valide, le blacklister
    if (expiresIn > 0) {
      await blacklistToken(token, expiresIn);
    }
    
    return true;
  }

  /**
   * Supprimer un compte utilisateur et toutes ses données
   */
  async deleteAccount(userId: string): Promise<boolean> {
    try {
      return await this.repository.deleteUserAndRelatedData(userId);
    } catch (error) {
      console.error('Erreur lors de la suppression du compte:', error);
      return false;
    }
  }
}

// Exporter une instance du service
export const authService = new AuthService();