# Taskwave - Base de données

## Architecture de la base de données

Taskwave utilise MongoDB comme système de gestion de base de données NoSQL, avec Prisma comme ORM (Object-Relational Mapping) pour faciliter les interactions entre l'application et la base de données.

## Choix technologiques

### MongoDB

MongoDB a été choisi comme solution de base de données pour Taskwave pour plusieurs raisons clés :

1. **Flexibilité du schéma** : Les documents JSON permettent une évolution facile du modèle de données au fil du temps
2. **Performances élevées** : Optimisé pour les opérations de lecture/écriture fréquentes
3. **Scalabilité horizontale** : Capacité à s'étendre facilement avec la croissance de l'application
4. **Support natif des données JSON** : Correspondance naturelle avec les structures de données JavaScript/TypeScript
5. **Requêtes riches** : Support d'opérations complexes et d'agrégation pour l'analyse des données

### Prisma ORM

Prisma sert d'interface entre notre code TypeScript et la base de données MongoDB :

1. **Typage fort** : Génération automatique de types TypeScript correspondant aux modèles de données
2. **Sécurité** : Prévention des injections et validation des données
3. **Productivité** : API intuitive et auto-complétion dans l'IDE
4. **Migrations** : Gestion simplifiée des évolutions du schéma
5. **Requêtes optimisées** : Génération de requêtes efficaces et prévisibles

## Modèle de données

Le schéma de la base de données est défini dans `prisma/schema.prisma` et comprend les modèles suivants :

```prisma

// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?
// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}

model User {
  id          String    @id @default(auto()) @map("_id") @db.ObjectId
  name        String
  email       String    @unique
  password    String?   // Optionnel car certains utilisateurs pourraient s'authentifier uniquement via OAuth
  provider    Provider? // Le fournisseur OAuth utilisé
  providerId  String?   // ID unique de l'utilisateur chez le fournisseur OAuth
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  avatarUrl   String?
  ownedBoards Board[]   @relation("BoardOwner")
  tasks       Task[]    @relation("TaskAssignee")
}

model Board {
  id          String    @id @default(auto()) @map("_id") @db.ObjectId
  title       String
  description String?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  ownerId     String    @db.ObjectId
  owner       User      @relation("BoardOwner", fields: [ownerId], references: [id], onDelete: Cascade)
  columns     Column[]
  backgroundColor String? // Optionnel pour personnaliser l'apparence
}

model Column {
  id          String    @id @default(auto()) @map("_id") @db.ObjectId
  title       String
  position    Int       // Pour l'ordre des colonnes
  boardId     String    @db.ObjectId
  board       Board     @relation(fields: [boardId], references: [id], onDelete: Cascade)
  tasks       Task[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  color       String?   // Optionnel pour personnaliser l'apparence
}

model Task {
  id          String    @id @default(auto()) @map("_id") @db.ObjectId
  title       String
  description String?
  priority    Priority  @default(NORMAL)
  dueDate     DateTime?
  position    Int       // Pour l'ordre dans une colonne
  columnId    String    @db.ObjectId
  column      Column    @relation(fields: [columnId], references: [id], onDelete: Cascade)
  assigneeId  String?   @db.ObjectId
  assignee    User?     @relation("TaskAssignee", fields: [assigneeId], references: [id])
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  labels      String[]  // Tableau de tags/labels
  attachments String[]  // URLs ou chemins des pièces jointes
  completed   Boolean   @default(false)
}

enum Priority {
  LOW
  NORMAL
  HIGH
  URGENT
}

enum Provider {
  DISCORD
  LOCAL // Pour les utilisateurs enregistrés localement avec email/mot de passe
}
```

## Relations entre les entités

Le modèle de données de Taskwave comprend plusieurs relations clés :

1. **One-to-Many** :

   - Un utilisateur peut posséder plusieurs tableaux
   - Un tableau contient plusieurs colonnes
   - Une colonne contient plusieurs tâches
   - Un utilisateur peut être assigné à plusieurs tâches

2. **Many-to-Many** :
   - Une tâche peut avoir plusieurs étiquettes
   - Une étiquette peut être appliquée à plusieurs tâches

Ces relations sont gérées efficacement par Prisma, qui génère les index nécessaires pour maintenir l'intégrité référentielle et optimiser les performances des requêtes.

## Indexation

Pour optimiser les performances des requêtes fréquentes, les index suivants sont définis :

```prisma
model User {
  // ...
  @@index([email])
}

model Column {
  // ...
  @@index([boardId, order])
}

model Task {
  // ...
  @@index([columnId, order])
  @@index([assigneeId])
  @@index([dueDate])
}
```

## Migrations et déploiement

### Gestion des migrations

Prisma facilite la gestion des changements de schéma grâce à son système de migrations :

1. **Création de migration** : `npx prisma migrate dev --name nom_de_la_migration`
2. **Application en production** : `npx prisma migrate deploy`
3. **Génération du client** : `npx prisma generate`

### Initialisation de la base de données

Le fichier `mongo-init.js` est utilisé lors du premier déploiement pour configurer l'utilisateur MongoDB et les permissions initiales :

```javascript
db.createUser({
  user: process.env.MONGO_INITDB_ROOT_USERNAME,
  pwd: process.env.MONGO_INITDB_ROOT_PASSWORD,
  roles: [{ role: "readWrite", db: "taskwave" }],
});

db = db.getSiblingDB("taskwave");

// Collections initiales
db.createCollection("User");
db.createCollection("Board");
db.createCollection("Column");
db.createCollection("Task");
db.createCollection("Label");
```

## Optimisation des performances

### Stratégies de requêtes

Pour maintenir des performances optimales même avec un grand volume de données, plusieurs stratégies sont mises en place :

1. **Pagination** : Limitation du nombre de résultats renvoyés par requête
2. **Projections** : Sélection uniquement des champs nécessaires
3. **Mise en cache** : Caching des requêtes fréquentes avec Redis
4. **Requêtes composées** : Utilisation des fonctionnalités d'agrégation de MongoDB pour minimiser les allers-retours

### Exemple d'utilisation avec Prisma

```typescript
// Récupération paginée des tâches avec filtres
async function getTasks(
  columnId: string,
  page: number = 1,
  limit: number = 20,
  filters: TaskFilters
) {
  const skip = (page - 1) * limit;

  // Construction des filtres dynamiques
  const where: Prisma.TaskWhereInput = {
    columnId,
    ...(filters.priority ? { priority: filters.priority } : {}),
    ...(filters.assigneeId ? { assigneeId: filters.assigneeId } : {}),
    ...(filters.dueDate
      ? {
          dueDate: {
            lte: new Date(filters.dueDate),
          },
        }
      : {}),
  };

  // Requête principale avec pagination et filtres
  const tasks = await prisma.task.findMany({
    where,
    orderBy: { order: "asc" },
    skip,
    take: limit,
    include: {
      assignee: {
        select: {
          id: true,
          name: true,
          avatarUrl: true,
        },
      },
      labels: true,
    },
  });

  // Comptage total pour la pagination
  const total = await prisma.task.count({ where });

  return {
    data: tasks,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
}
```

## Sécurité des données

La sécurité des données est une priorité dans l'architecture de Taskwave :

1. **Authentification MongoDB** : Accès sécurisé avec nom d'utilisateur et mot de passe
2. **Variables d'environnement** : Aucune information sensible dans le code source
3. **Validation des entrées** : Filtrage et validation de toutes les données entrantes
4. **Principe du moindre privilège** : Permissions minimales nécessaires pour chaque opération
5. **Chiffrement des données sensibles** : Hachage des mots de passe et chiffrement des informations sensibles
6. **Network Isolation** : Réseau Docker isolé pour les communications base de données

## Sauvegarde et reprise après sinistre

Pour garantir la durabilité des données, une stratégie de sauvegarde complète est mise en œuvre :

1. **Sauvegardes automatiques quotidiennes** : Snapshots de la base de données
2. **Conservation à long terme** : Conservation des sauvegardes pendant 30 jours
3. **Réplication** : Réplication des données sur plusieurs nœuds pour la haute disponibilité
4. **Procédures de restauration** : Processus documenté pour la récupération rapide après incident

## Environnement de développement

Pour le développement local, MongoDB est déployé via Docker Compose :

```yaml
# Extrait de docker-compose.yml
services:
  mongodb:
    image: mongo:latest
    container_name: taskwave-mongodb
    environment:
      - MONGO_INITDB_ROOT_USERNAME=${MONGO_INITDB_ROOT_USERNAME}
      - MONGO_INITDB_ROOT_PASSWORD=${MONGO_INITDB_ROOT_PASSWORD}
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
      - ./mongo-init.js:/docker-entrypoint-initdb.d/mongo-init.js:ro
    restart: unless-stopped
```

## Conclusion

L'architecture de base de données de Taskwave est conçue pour allier flexibilité, performances et sécurité. L'utilisation de MongoDB avec Prisma offre un excellent équilibre entre la puissance d'une base de données NoSQL et la sécurité type d'un ORM fortement typé.

Cette architecture permet à Taskwave de gérer efficacement les données des utilisateurs, des tableaux Kanban et des tâches, tout en restant évolutive pour répondre aux besoins futurs de l'application.
