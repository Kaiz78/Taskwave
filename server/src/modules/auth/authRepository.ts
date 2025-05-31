import { PrismaClient, User, Provider } from '@prisma/client';
import { prisma } from '../../server';
import { DiscordProfile } from './provider/discordProvider';

export class AuthRepository {
  private prisma: PrismaClient;

  constructor(prismaClient: PrismaClient = prisma) {
    this.prisma = prismaClient;
    
    // Vérifier que l'instance Prisma est correctement initialisée
    if (!this.prisma) {
      console.error("ERREUR CRITIQUE: PrismaClient n'est pas initialisé dans le constructeur");
      // Créer une instance de secours
      this.prisma = new PrismaClient();
    }
  }

  /**
   * Trouver un utilisateur par email
   */
  async findUserByEmail(email: string): Promise<User | null> {
    try {
      if (!this.prisma) {
        console.error("PrismaClient n'est pas initialisé");
        return null;
      }
      
      if (!email) {
        console.error("Email manquant pour la recherche d'utilisateur");
        return null;
      }
      
      const user = await this.prisma.user.findUnique({
        where: { email: email }
      });
      
      return user;
    } catch (error) {
      console.error(`Erreur lors de la recherche utilisateur par email ${email}:`, error);
      return null;
    }
  }

  /**
   * Trouver un utilisateur par provider et providerId
   */
  async findUserByProvider(provider: Provider, providerId: string): Promise<User | null> {
    try {
      if (!this.prisma) {
        console.error("PrismaClient n'est pas initialisé");
        return null;
      }
      
      if (!provider || !providerId) {
        console.error("Provider ou providerId manquant");
        return null;
      }
      
      const user = await this.prisma.user.findFirst({
        where: {
          AND: [
            { provider },
            { providerId }
          ]
        }
      });
      
      return user;
    } catch (error) {
      console.error(`Erreur lors de la recherche utilisateur par provider ${provider} et providerId ${providerId}:`, error);
      return null;
    }
  }


  /**
   * Créer un nouvel utilisateur
   */
  async createUser(userData: {
    name: string;
    email: string;
    provider: Provider;
    providerId: string;
    avatarUrl?: string | null;
  }): Promise<User | null> {
    try {
      if (!this.prisma) {
        console.error("PrismaClient n'est pas initialisé");
        return null;
      }
      
      console.log('Création nouvel utilisateur avec données:', JSON.stringify({
        name: userData.name,
        email: userData.email,
        provider: userData.provider,
        providerId: userData.providerId.substring(0, 5) + '...' // Tronquer pour la sécurité dans les logs
      }, null, 2));
      
      const user = await this.prisma.user.create({
        data: userData
      });
      
      console.log('Nouvel utilisateur créé avec ID:', user.id);
      return user;
    } catch (error) {
      console.error('Erreur lors de la création d\'un utilisateur:', error);
      return null;
    }
  }

  /**
   * Mettre à jour un utilisateur existant
   */
  async updateUser(userId: string, userData: {
    name?: string;
    avatarUrl?: string | null;
    provider?: Provider;
    providerId?: string;
  }): Promise<User | null> {
    try {
      if (!this.prisma) {
        console.error("PrismaClient n'est pas initialisé");
        return null;
      }
      
      if (!userId) {
        console.error("ID utilisateur manquant pour la mise à jour");
        return null;
      }
      
      console.log('Mise à jour utilisateur:', userId);
      
      const user = await this.prisma.user.update({
        where: { id: userId },
        data: userData
      });
      
      console.log('Utilisateur mis à jour avec succès');
      return user;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de l'utilisateur ${userId}:`, error);
      return null;
    }
  }

  /**
   * Rechercher ou créer un utilisateur à partir d'un profil Discord
   */
  async findOrCreateUserByDiscord(discordUser: DiscordProfile): Promise<User | null> {
    try {
      
      // Vérifier que le profil Discord et ses données essentielles sont présents
      if (!discordUser || !discordUser.email || !discordUser.id || !discordUser.username) {
        console.error('Profil Discord invalide ou incomplet:', JSON.stringify(discordUser, null, 2));
        return null;
      }
      
      console.log('Recherche utilisateur avec email:', discordUser.email);

      // Rechercher si l'utilisateur existe déjà par email
      let user = await this.findUserByEmail(discordUser.email);
      console.log('Résultat recherche par email:', user ? 'Trouvé' : 'Non trouvé');

      // Si pas trouvé par email, chercher par provider + providerId
      if (!user && discordUser.id) {
        console.log('Recherche utilisateur par provider et providerId:', Provider.DISCORD, discordUser.id);
        user = await this.findUserByProvider(Provider.DISCORD, discordUser.id);
        console.log('Résultat recherche par provider:', user ? 'Trouvé' : 'Non trouvé');
      }
      
      if (!user) {
        // Créer un nouvel utilisateur
        return await this.createUser({
          name: discordUser.username,
          email: discordUser.email,
          provider: Provider.DISCORD,
          providerId: discordUser.id,
          avatarUrl: discordUser.image_url || null
        });
      } else {
        // Mise à jour des informations Discord si l'utilisateur existe déjà
        return await this.updateUser(user.id, {
          name: discordUser.username,
          avatarUrl: discordUser.image_url || user.avatarUrl,
          provider: Provider.DISCORD,
          providerId: discordUser.id
        });
      }
    } catch (error) {
      console.error('Erreur dans findOrCreateUserByDiscord:', error);
      return null;
    }
  }

  /**
   * Supprimer un utilisateur et toutes ses données associées
   */
  async deleteUserAndRelatedData(userId: string): Promise<boolean> {
    try {
      // Utiliser une transaction pour s'assurer que toutes les opérations sont atomiques
      await this.prisma.$transaction(async (tx) => {
        // 1. Trouver tous les tableaux appartenant à l'utilisateur
        const userBoards = await tx.board.findMany({
          where: { ownerId: userId },
          select: { id: true }
        });
        
        const boardIds = userBoards.map(board => board.id);
        
        // 2. Trouver toutes les colonnes associées aux tableaux de l'utilisateur
        const columns = await tx.column.findMany({
          where: { boardId: { in: boardIds } },
          select: { id: true }
        });
        
        const columnIds = columns.map(column => column.id);
        
        // 3. Supprimer toutes les tâches associées aux colonnes
        if (columnIds.length > 0) {
          await tx.task.deleteMany({
            where: { columnId: { in: columnIds } }
          });
        }
        
        // 4. Supprimer toutes les colonnes
        if (boardIds.length > 0) {
          await tx.column.deleteMany({
            where: { boardId: { in: boardIds } }
          });
        }
        
        // 5. Supprimer tous les tableaux
        await tx.board.deleteMany({
          where: { ownerId: userId }
        });
        
        // 6. Supprimer l'utilisateur lui-même
        await tx.user.delete({
          where: { id: userId }
        });
      });
      
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression du compte:', error);
      return false;
    }
  }
}

// Créer une instance singleton du repository pour l'utiliser dans l'application
export const authRepository = new AuthRepository();
