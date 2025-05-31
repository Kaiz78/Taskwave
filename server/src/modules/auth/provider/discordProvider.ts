// Interfaces pour la configuration OAuth
export interface OAuthUserConfig<P> {
  clientId: string;
  clientSecret: string;
  callbackUrl?: string;
  scope?: string[];
  authorization?: string;
  token?: string;
  userinfo?: string;
  profile?: (profile: any) => P;
}

export interface OAuthConfig<P> {
  id: string;
  name: string;
  type: string;
  authorization: string;
  token: string;
  userinfo: string;
  profile: (profile: any) => P;
}

// Interface pour le profil Discord
export interface DiscordProfile extends Record<string, any> {
  accent_color?: number;
  avatar: string;
  banner?: string;
  banner_color?: string;
  discriminator: string;
  email: string;
  flags?: number;
  id: string;
  image_url: string;
  locale?: string;
  mfa_enabled?: boolean;
  premium_type?: number;
  public_flags?: number;
  username: string;
  verified: boolean;
}

/**
 * Fournisseur d'authentification OAuth pour Discord
 */
export class DiscordProvider {
  private clientId: string;
  private clientSecret: string;
  private callbackUrl: string;
  private scope: string[];
  private readonly discordApiUrl = 'https://discord.com/api/v10';
  private readonly discordCdnUrl = 'https://cdn.discordapp.com';

  /**
   * Crée une nouvelle instance du fournisseur Discord
   * @param options Options de configuration
   */
  constructor(options: OAuthUserConfig<DiscordProfile>) {
    this.clientId = options.clientId;
    this.clientSecret = options.clientSecret;
    this.callbackUrl = options.callbackUrl || '';
    this.scope = options.scope || ['identify', 'email'];

    // Vérification des paramètres requis
    if (!this.clientId || !this.clientSecret || !this.callbackUrl) {
      throw new Error('DiscordProvider: clientId, clientSecret et callbackUrl sont requis');
    }
  }

  /**
   * Génère l'URL d'autorisation Discord
   * @returns URL d'autorisation
   */
  public getAuthorizationUrl(): string {
    const scopeString = this.scope.join(' ');
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.callbackUrl,
      response_type: 'code',
      scope: scopeString,
    });

    return `${this.discordApiUrl}/oauth2/authorize?${params.toString()}`;
  }

  /**
   * Échange un code d'autorisation contre un token d'accès
   * @param code Code d'autorisation
   * @returns Token d'accès
   */
  public async getToken(code: string): Promise<string | null> {
    try {
      const params = new URLSearchParams({
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: this.callbackUrl,
      });

      const response = await fetch(`${this.discordApiUrl}/oauth2/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString()
      });

      if (!response.ok) {
        throw new Error(`Discord API error: ${response.status}`);
      }

      const data = await response.json();
      return data.access_token || null;
    } catch (error) {
      console.error('Erreur lors de la récupération du token Discord:', error);
      return null;
    }
  }

  /**
   * Récupère le profil utilisateur Discord
   * @param accessToken Token d'accès
   * @returns Profil utilisateur
   */
  public async getUserProfile(accessToken: string): Promise<DiscordProfile | null> {
    try {
      const response = await fetch(`${this.discordApiUrl}/users/@me`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Discord API error: ${response.status}`);
      }

      const user = await response.json();
      
      // Construction de l'URL de l'avatar si disponible
      let image_url = null;
      if (user.avatar) {
        const avatarExtension = user.avatar.startsWith('a_') ? 'gif' : 'png';
        image_url = `${this.discordCdnUrl}/avatars/${user.id}/${user.avatar}.${avatarExtension}`;
      } else {
        // Avatar par défaut de Discord basé sur le discriminant
        const defaultAvatarId = parseInt(user.discriminator) % 5;
        image_url = `${this.discordCdnUrl}/embed/avatars/${defaultAvatarId}.png`;
      }

      // Construire le profil complet avec les champs requis
      return {
        id: user.id,
        username: user.username,
        discriminator: user.discriminator,
        avatar: user.avatar || '',
        email: user.email,
        verified: user.verified,
        image_url: image_url || '',
        accent_color: user.accent_color || 0,
        banner: user.banner || '',
        banner_color: user.banner_color || '',
        flags: user.flags || 0,
        locale: user.locale || 'fr',
        mfa_enabled: user.mfa_enabled || false,
        premium_type: user.premium_type || 0,
        public_flags: user.public_flags || 0
      };
    } catch (error) {
      console.error('Erreur lors de la récupération du profil Discord:', error);
      return null;
    }
  }

  /**
   * Révoque un token d'accès
   * @param accessToken Token à révoquer
   * @returns true si succès, false sinon
   */
  public async revokeToken(accessToken: string): Promise<boolean> {
    try {
      const params = new URLSearchParams({
        client_id: this.clientId,
        client_secret: this.clientSecret,
        token: accessToken,
      });

      const response = await fetch(`${this.discordApiUrl}/oauth2/token/revoke`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString()
      });

      return response.ok;
    } catch (error) {
      console.error('Erreur lors de la révocation du token Discord:', error);
      return false;
    }
  }
}

/**
 * Fonction factory pour créer une configuration OAuth Discord
 * selon le format standard
 */
export default function Discord<P extends DiscordProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: "discord",
    name: "Discord",
    type: "oauth",
    authorization: "https://discord.com/api/oauth2/authorize",
    token: "https://discord.com/api/oauth2/token",
    userinfo: "https://discord.com/api/users/@me",
    profile: (profile) => {
      const avatarUrl = profile.avatar
        ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.${
            profile.avatar.startsWith("a_") ? "gif" : "png"
          }`
        : `https://cdn.discordapp.com/embed/avatars/${
            parseInt(profile.discriminator) % 5
          }.png`;

      return {
        id: profile.id,
        name: profile.username,
        email: profile.email,
        image: avatarUrl,
        ...profile,
        image_url: avatarUrl,
      } as P;
    },
    ...options,
  };
}
