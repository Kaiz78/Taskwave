# Taskwave - API Reference

## Vue d'ensemble de l'API

L'API de Taskwave est construite selon les principes REST et sert d'interface entre le client frontend et la base de données. Elle est responsable de toutes les opérations de données, de l'authentification et de la logique métier.

## Technologies et Architecture

### Stack technologique

- **Node.js** : Environnement d'exécution JavaScript côté serveur
- **Express** : Framework web minimaliste pour Node.js
- **Prisma** : ORM (Object-Relational Mapping) pour interagir avec la base de données
- **TypeScript** : Typage statique pour un code plus robuste et maintenable
- **JWT** : JSON Web Tokens pour l'authentification et l'autorisation

### Structure des répertoires

L'API suit une architecture en couches avec une séparation claire des préoccupations :

```
server/
├── src/
│   ├── server.ts                 # Point d'entrée de l'application
│   ├── config/                   # Configuration (env, cors, etc.)
│   │   ├── corsOptions.ts
│   │   └── env.ts
│   ├── controllers/              # Contrôleurs pour la logique HTTP
│   │   ├── authController.ts
│   │   ├── boardController.ts
│   │   ├── columnController.ts
│   │   └── taskController.ts
│   ├── middleware/               # Middleware pour l'authentification, validation, etc.
│   │   ├── auth.ts
│   │   └── validation.ts
│   ├── routes/                   # Définition des routes API
│   │   ├── authRoutes.ts
│   │   ├── boardRoutes.ts
│   │   ├── columnRoutes.ts
│   │   └── taskRoutes.ts
│   └── utils/                    # Utilitaires partagés
│       ├── asyncWrapper.ts
│       └── errorHandler.ts
```

## Endpoints API

### Authentification

| Méthode | Endpoint             | Description                         | Corps de requête            | Réponse             |
| ------- | -------------------- | ----------------------------------- | --------------------------- | ------------------- |
| POST    | `/api/auth/login`    | Connexion avec email/mot de passe   | `{ email, password }`       | `{ user, token }`   |
| POST    | `/api/auth/register` | Inscription d'un nouvel utilisateur | `{ name, email, password }` | `{ user, token }`   |
| GET     | `/api/auth/me`       | Obtenir l'utilisateur actuel        | -                           | `{ user }`          |
| POST    | `/api/auth/logout`   | Déconnexion                         | -                           | `{ success: true }` |

### Tableaux Kanban

| Méthode | Endpoint          | Description                              | Corps de requête          | Réponse                      |
| ------- | ----------------- | ---------------------------------------- | ------------------------- | ---------------------------- |
| GET     | `/api/boards`     | Liste tous les tableaux de l'utilisateur | -                         | `[{ id, name, ... }]`        |
| GET     | `/api/boards/:id` | Détails d'un tableau spécifique          | -                         | `{ id, name, columns, ... }` |
| POST    | `/api/boards`     | Crée un nouveau tableau                  | `{ name, description }`   | `{ id, name, ... }`          |
| PATCH   | `/api/boards/:id` | Met à jour un tableau existant           | `{ name?, description? }` | `{ id, name, ... }`          |
| DELETE  | `/api/boards/:id` | Supprime un tableau                      | -                         | `{ success: true }`          |

### Colonnes

| Méthode | Endpoint                  | Description                     | Corps de requête                  | Réponse               |
| ------- | ------------------------- | ------------------------------- | --------------------------------- | --------------------- |
| GET     | `/api/boards/:id/columns` | Liste les colonnes d'un tableau | -                                 | `[{ id, name, ... }]` |
| POST    | `/api/columns`            | Crée une nouvelle colonne       | `{ name, boardId, order }`        | `{ id, name, ... }`   |
| PATCH   | `/api/columns/:id`        | Met à jour une colonne          | `{ name?, order? }`               | `{ id, name, ... }`   |
| DELETE  | `/api/columns/:id`        | Supprime une colonne            | -                                 | `{ success: true }`   |
| PATCH   | `/api/columns/reorder`    | Réorganise l'ordre des colonnes | `{ boardId, columnOrder: [ids] }` | `{ success: true }`   |

### Tâches

| Méthode | Endpoint                 | Description                    | Corps de requête                | Réponse                        |
| ------- | ------------------------ | ------------------------------ | ------------------------------- | ------------------------------ |
| GET     | `/api/columns/:id/tasks` | Liste les tâches d'une colonne | -                               | `[{ id, title, ... }]`         |
| POST    | `/api/tasks`             | Crée une nouvelle tâche        | `{ title, columnId, ... }`      | `{ id, title, ... }`           |
| GET     | `/api/tasks/:id`         | Détails d'une tâche            | -                               | `{ id, title, ... }`           |
| PATCH   | `/api/tasks/:id`         | Met à jour une tâche           | `{ title?, description?, ... }` | `{ id, title, ... }`           |
| DELETE  | `/api/tasks/:id`         | Supprime une tâche             | -                               | `{ success: true }`            |
| PATCH   | `/api/tasks/move`        | Déplace une tâche              | `{ taskId, columnId, order }`   | `{ id, columnId, order, ... }` |

## Gestion de l'authentification

### JWT (JSON Web Tokens)

L'authentification dans l'API Taskwave utilise JWT pour maintenir les sessions utilisateur de manière sécurisée et sans état.

#### Processus d'authentification :

1. L'utilisateur se connecte avec ses identifiants
2. Le serveur vérifie les identifiants et génère un JWT
3. Le JWT est renvoyé au client, qui le stocke localement
4. Pour les requêtes ultérieures, le client envoie le JWT dans l'en-tête d'autorisation
5. Le serveur vérifie la validité du JWT pour chaque requête authentifiée

```typescript
// Exemple de middleware d'authentification
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Non autorisé" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

    // Ajouter l'utilisateur décodé à la requête
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token invalide" });
  }
};
```

### OAuth

Taskwave prend également en charge l'authentification OAuth pour se connecter avec des comptes externes :
- Discord OAuth

## Gestion des erreurs

L'API utilise un système de gestion d'erreurs centralisé pour garantir des réponses cohérentes :

```typescript
// Exemple de wrapper pour gérer les erreurs async
export const asyncWrapper = (fn: RequestHandler): RequestHandler => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

// Gestionnaire d'erreurs global
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);

  // Erreurs Prisma spécifiques
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      return res
        .status(409)
        .json({ message: "Conflit - La ressource existe déjà" });
    }
  }

  res.status(500).json({ message: "Erreur serveur interne" });
};
```

## Validation des données

Toutes les entrées utilisateur sont validées avant traitement pour assurer l'intégrité des données et la sécurité :

```typescript
// Exemple de middleware de validation pour la création de tâche
export const validateTaskCreation = [
  body("title").trim().notEmpty().withMessage("Le titre est requis"),
  body("columnId").isUUID().withMessage("ID de colonne invalide"),
  body("priority")
    .optional()
    .isIn(["low", "medium", "high"])
    .withMessage("Priorité invalide"),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
```

## Documentation API interactive

L'API de Taskwave est documentée avec Swagger/OpenAPI, offrant une interface interactive pour explorer et tester les endpoints :

- URL de documentation : `/api/docs`
- Spécification OpenAPI complète disponible à `/api/docs/swagger.json`

## Limites de taux et sécurité

Pour protéger l'API contre les abus, les mesures suivantes sont en place :

1. **Limitation de taux** : Max 100 requêtes par IP par minute
2. **En-têtes de sécurité** : Helmet.js pour configurer les en-têtes HTTP de sécurité
3. **Prévention CSRF** : Jetons anti-CSRF pour les opérations sensibles
4. **Sanitisation des entrées** : Échappement et validation de toutes les entrées utilisateur

## Requêtes en lots (Batch Requests)

Pour optimiser les performances, l'API prend en charge les requêtes en lots pour certaines opérations :

```
POST /api/batch
Content-Type: application/json

{
  "requests": [
    { "method": "GET", "path": "/api/boards/123" },
    { "method": "GET", "path": "/api/columns/456/tasks" }
  ]
}
```

## Versionnement de l'API

L'API Taskwave suit les principes de versionnement sémantique pour assurer la compatibilité :

- Version actuelle : `v1`
- Format d'URL : `/api/v1/resource`
- Les changements majeurs sont signalés par un incrément de la version principale

## Conclusion

L'API de Taskwave est conçue pour être robuste, sécurisée et performante. Sa structure modulaire et son utilisation de TypeScript assurent une maintenabilité à long terme, tandis que son architecture RESTful la rend facilement consommable par différents clients.

Les développeurs souhaitant contribuer à l'API sont invités à consulter le guide de contribution et à respecter les standards de code établis.
