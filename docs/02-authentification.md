# Taskwave - Authentification

## Introduction à l'Authentification

L'authentification est un élément crucial de toute application web moderne, garantissant que seuls les utilisateurs autorisés peuvent accéder aux fonctionnalités et aux données. Pour Taskwave, nous avons choisi d'implémenter un système d'authentification basé sur OAuth 2.0 avec Discord comme fournisseur principal.

## Choix du Système d'Authentification

### Pourquoi OAuth?

OAuth 2.0 est un protocole d'autorisation standardisé qui permet à une application d'accéder aux ressources d'un utilisateur sur un autre service web sans exposer les identifiants de l'utilisateur. Nous avons choisi OAuth pour plusieurs raisons :

1. **Sécurité renforcée** : Les mots de passe des utilisateurs ne transitent jamais par notre application
2. **Expérience utilisateur améliorée** : Connexion en un clic sans nécessiter la création d'un nouveau compte
3. **Maintenance réduite** : Pas besoin de gérer la récupération de mot de passe, la vérification d'email, etc.
4. **Confiance accrue** : Les utilisateurs font davantage confiance aux méthodes d'authentification reconnues

### Pourquoi Discord?

Pour la première version de Taskwave (MVP), nous avons choisi Discord comme fournisseur OAuth pour les raisons suivantes :

1. **Simplicité d'intégration** : L'API Discord est bien documentée et facile à intégrer
2. **Popularité** : Discord est très populaire parmi les développeurs et les équipes techniques
3. **Données pertinentes** : Discord fournit les informations essentielles dont nous avons besoin (nom, email, avatar)
4. **Approche MVP** : Pour une version minimale viable, se concentrer sur un seul fournisseur OAuth permet de réduire la complexité

Ce choix correspond à notre philosophie de développement MVP (Minimum Viable Product) : implémentation rapide et efficace des fonctionnalités essentielles pour valider le concept avant d'investir davantage de ressources.

## Implémentation Technique

### Configuration de l'OAuth Discord

Pour utiliser l'API Discord, nous avons créé une application Discord dans le portail développeur de Discord :

1. Création d'une application sur [Discord Developer Portal](https://discord.com/developers/applications)
2. Configuration des redirections OAuth (URL de callback)
3. Obtention des identifiants client (Client ID et Client Secret)

### Backend : Mise en place de l'API d'authentification

Le backend gère le processus d'authentification avec Discord et la gestion des sessions utilisateur.

#### Structure des Contrôleurs et Services

```typescript
// authController.ts
export const discordAuth = async (req: Request, res: Response) => {
  try {
    const redirectUrl = discordProvider.getAuthorizationUrl();
    return res.redirect(redirectUrl);
  } catch (error) {
    return errorHandler(res, error, "Error initiating Discord authentication");
  }
};

export const discordCallback = async (req: Request, res: Response) => {
  try {
    const { code } = req.query;

    if (!code || typeof code !== "string") {
      return res.status(400).json({ message: "Authorization code required" });
    }

    // Échanger le code contre un token et récupérer les informations utilisateur
    const userData = await discordProvider.getUserData(code);

    // Créer ou mettre à jour l'utilisateur dans notre base de données
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {
        name: userData.username,
        avatarUrl: userData.avatar,
      },
      create: {
        email: userData.email,
        name: userData.username,
        avatarUrl: userData.avatar,
        provider: "DISCORD",
      },
    });

    // Générer un JWT pour l'utilisateur
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    // Rediriger vers le client avec le token
    const clientRedirectUrl = `${process.env.CLIENT_URL}/auth-callback?token=${token}`;
    return res.redirect(clientRedirectUrl);
  } catch (error) {
    return errorHandler(
      res,
      error,
      "Error during Discord authentication callback"
    );
  }
};
```

#### Service Discord Provider

Le service Discord Provider encapsule la logique d'interaction avec l'API Discord :

```typescript
// discordProvider.ts
export class DiscordProvider {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;
  private scope: string;

  constructor() {
    this.clientId = process.env.DISCORD_CLIENT_ID!;
    this.clientSecret = process.env.DISCORD_CLIENT_SECRET!;
    this.redirectUri = `${process.env.API_URL}/auth/discord/callback`;
    this.scope = "identify email";
  }

  getAuthorizationUrl(): string {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: "code",
      scope: this.scope,
    });

    return `https://discord.com/api/oauth2/authorize?${params.toString()}`;
  }

  async getUserData(code: string): Promise<DiscordUser> {
    // Échanger le code contre un token d'accès
    const tokenResponse = await axios.post(
      "https://discord.com/api/oauth2/token",
      new URLSearchParams({
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: "authorization_code",
        code,
        redirect_uri: this.redirectUri,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const { access_token } = tokenResponse.data;

    // Utiliser le token pour récupérer les informations utilisateur
    const userResponse = await axios.get("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    // Extraire et formater les données utilisateur
    const userData = userResponse.data;
    const avatarUrl = userData.avatar
      ? `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png`
      : null;

    return {
      id: userData.id,
      username: userData.username,
      email: userData.email,
      avatar: avatarUrl,
    };
  }
}

export const discordProvider = new DiscordProvider();
```

### Frontend : Gestion de l'État d'Authentification avec Zustand

Pour gérer l'état d'authentification côté client, nous avons utilisé Zustand, un gestionnaire d'état minimaliste et performant pour React.

#### Store d'Authentification

```typescript
// useAuthStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthState, User } from "@/types/auth.types";
import { authService } from "@/services/api";

const initialState: AuthState = {
  user: null,
  email: null,
  avatarUrl: null,
  isAuthenticated: false,
  isLoading: false,
  token: null,
  error: null,
};

export const useAuthStore = create<
  AuthState & {
    setToken: (token: string) => void;
    logout: () => void;
    setUser: (user: User) => void;
    setError: (error: string | null) => void;
    setLoading: (isLoading: boolean) => void;
    loginWithDiscord: () => void;
    fetchUserProfile: () => Promise<void>;
  }
>()(
  persist(
    (set, get) => ({
      ...initialState,

      setToken: (token: string) => set({ token, isAuthenticated: true }),

      logout: () => set({ ...initialState }),

      setUser: (user: User) =>
        set({
          user: user.name,
          email: user.email,
          avatarUrl: user.avatarUrl,
        }),

      setError: (error: string | null) => set({ error }),

      setLoading: (isLoading: boolean) => set({ isLoading }),

      loginWithDiscord: () => {
        set({ isLoading: true, error: null });
        try {
          // Rediriger vers l'authentification Discord
          authService.discordLogin();
          // La redirection quitte cette page, donc pas besoin de gérer la suite ici
        } catch (error) {
          console.error("Erreur lors de la redirection vers Discord:", error);
          set({
            isLoading: false,
            error: "Erreur lors de la redirection vers Discord",
          });
        }
      },

      fetchUserProfile: async () => {
        const { token } = get();

        if (!token) {
          set({ error: "Pas de token disponible" });
          return;
        }

        set({ isLoading: true });

        try {
          const data = await authService.getProfile(token);

          set({
            user: data.data.user.name,
            avatarUrl: data.data.user.avatarUrl,
            email: data.data.user.email,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          console.error("Erreur lors de la récupération du profil:", error);
          set({
            isLoading: false,
            error: "Erreur lors de la récupération du profil",
            isAuthenticated: false,
            token: null,
          });
        }
      },
    }),
    {
      name: "auth-storage", // nom du stockage dans localStorage
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        email: state.email,
        avatarUrl: state.avatarUrl,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
```

La configuration utilise le middleware `persist` de Zustand pour stocker les informations d'authentification dans le localStorage, permettant la persistance des sessions même après le rechargement de la page.

### Flux d'Authentification

Le flux d'authentification de Taskwave se déroule comme suit :

1. **Initiation** : L'utilisateur clique sur le bouton "Connexion avec Discord" sur la page de login
2. **Redirection** : L'utilisateur est redirigé vers la page d'autorisation de Discord
3. **Autorisation** : L'utilisateur autorise l'accès à son profil Discord
4. **Callback** : Discord redirige vers notre endpoint de callback avec un code d'autorisation
5. **Échange de Code** : Le backend échange ce code contre un token d'accès Discord
6. **Récupération du Profil** : Le backend récupère les informations du profil utilisateur
7. **Création/Mise à Jour** : Le backend crée ou met à jour l'utilisateur dans la base de données
8. **JWT** : Le backend génère un JWT (JSON Web Token) pour l'utilisateur
9. **Redirection finale** : L'utilisateur est redirigé vers le frontend avec le token JWT
10. **Stockage** : Le frontend stocke le token JWT et met à jour l'état d'authentification
11. **Récupération du Profil** : Le frontend utilise le token pour récupérer les détails du profil utilisateur

### Composants Frontend pour l'Authentification

#### Page de Login

```tsx
// Login.tsx
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import { FaDiscord } from "react-icons/fa";

function LoginPage() {
  const loginWithDiscord = useAuthStore((state) => state.loginWithDiscord);
  const isLoading = useAuthStore((state) => state.isLoading);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 dark:bg-gray-900">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">Taskwave</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Connectez-vous pour gérer vos projets et tâches
          </p>
        </div>

        <div className="mt-8">
          <Button
            onClick={loginWithDiscord}
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700"
          >
            <FaDiscord className="h-5 w-5" />
            {isLoading ? "Chargement..." : "Connexion avec Discord"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
```

#### Composant Callback d'Authentification

```tsx
// AuthCallback.tsx
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";

function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const setToken = useAuthStore((state) => state.setToken);
  const fetchUserProfile = useAuthStore((state) => state.fetchUserProfile);
  const token = searchParams.get("token");

  useEffect(() => {
    const handleCallback = async () => {
      if (token) {
        // Stocker le token dans le state
        setToken(token);

        try {
          // Récupérer les données du profil utilisateur
          await fetchUserProfile();

          // Redirection vers la page d'accueil après authentification réussie
          navigate("/", { replace: true });
        } catch (error) {
          console.error("Erreur lors de la récupération du profil:", error);
          navigate("/login", { replace: true });
        }
      } else {
        // Si pas de token, rediriger vers la page de login
        navigate("/login", { replace: true });
      }
    };

    handleCallback();
  }, [token, setToken, fetchUserProfile, navigate]);

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Authentification en cours...</h1>
        <p className="mt-2 text-gray-600">
          Veuillez patienter pendant que nous finalisons votre connexion.
        </p>
      </div>
    </div>
  );
}

export default AuthCallback;
```

### Protection des Routes

Pour protéger les routes de l'application, nous avons implémenté un système de protection basé sur React Router, qui vérifie si l'utilisateur est authentifié avant de permettre l'accès aux pages protégées :

```tsx
// Router.tsx
// Composant pour les routes protégées
const ProtectedRoute = () => {
  // Access state properties directly to prevent unnecessary re-renders
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const token = useAuthStore((state) => state.token);
  const fetchUserProfile = useAuthStore((state) => state.fetchUserProfile);

  useEffect(() => {
    // Si nous avons un token mais pas encore authentifié, essayer de récupérer le profil
    if (token && !isAuthenticated && !isLoading) {
      fetchUserProfile();
    }
  }, [token, isAuthenticated, isLoading, fetchUserProfile]);

  // Si en cours de chargement, afficher un écran de chargement
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Chargement...</h1>
          <p className="mt-2 text-gray-600">
            Veuillez patienter pendant que nous préparons votre espace de
            travail.
          </p>
        </div>
      </div>
    );
  }

  // Si non authentifié, rediriger vers la page de login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si authentifié, afficher le contenu protégé avec Layout
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};
```

## Avantages de l'Approche Choisie

L'approche d'authentification que nous avons implémentée offre plusieurs avantages :

1. **Expérience utilisateur fluide** : Connexion en quelques clics sans nécessiter de formulaires complexes
2. **Sécurité** : Aucun mot de passe à gérer ou à stocker
3. **Évolutivité** : Architecture facilitant l'ajout d'autres fournisseurs OAuth à l'avenir
4. **Persistance** : Sessions maintenues entre les chargements de page grâce au stockage local
5. **Séparation des préoccupations** : Logique d'authentification bien encapsulée dans des services dédiés

## Limitations et Améliorations Futures

Bien que notre système d'authentification actuel réponde aux besoins du MVP, plusieurs améliorations sont envisagées pour les versions futures :

1. **Fournisseurs supplémentaires** : Ajouter d'autres options d'authentification (Google, GitHub, etc.)
2. **Authentification par email/mot de passe** : Offrir une méthode traditionnelle pour les utilisateurs qui préfèrent ne pas utiliser OAuth
3. **Rafraîchissement automatique des tokens** : Implémentation d'un système de rafraîchissement pour prolonger les sessions
4. **Niveaux d'autorisation** : Ajout de rôles et permissions plus granulaires
5. **Authentification à deux facteurs** : Renforcement de la sécurité pour les actions sensibles

## Conclusion

L'implémentation de l'authentification avec Discord OAuth pour Taskwave représente un équilibre entre simplicité de développement et expérience utilisateur optimale. Cette approche nous a permis de lancer rapidement une version fonctionnelle tout en maintenant un niveau de sécurité élevé.

Le système est conçu de manière modulaire, ce qui facilitera l'ajout de nouvelles fonctionnalités et méthodes d'authentification au fur et à mesure que le projet évolue.
