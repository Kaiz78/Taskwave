# Taskwave - Setup du Projet

## Configuration Initiale

Le démarrage du projet Taskwave a nécessité la mise en place d'une infrastructure robuste et modulaire. Cette section décrit le processus d'installation, la configuration et l'architecture technique du projet.

## Installation du Projet

### Prérequis

Pour exécuter Taskwave localement, les outils suivants sont nécessaires :

- Node.js (v18+)
- Docker et Docker Compose
- Git
- npm ou yarn

### Étapes d'Installation

1. **Clonage du dépôt** :

   ```bash
   git clone https://github.com/aletwork/Taskwave.git
   cd Taskwave
   ```

2. **Configuration des variables d'environnement** :

   - Copier les fichiers `.env.example` en `.env` dans les dossiers client et server
   - Configurer les variables d'environnement appropriées :

     **Pour le client** :

     ```
     VITE_API_URL=http://localhost:5000/api
     VITE_AUTH_URL=http://localhost:5000
     ```

     **Pour le serveur** :

     ```
     PORT=5000
     NODE_ENV=development
     DATABASE_URL=mongodb://mongodb:27017/taskwave
     REDIS_URL=redis://redis:6379
     ```

3. **Installation des dépendances** :

   ```bash
   # Installation des dépendances du serveur
   cd server
   npm install

   # Installation des dépendances du client
   cd ../client
   npm install
   ```

4. **Démarrage avec Docker Compose** :
   ```bash
   # Depuis la racine du projet
   cd ..
   docker-compose up
   ```

## Architecture Docker

L'architecture de Taskwave est basée sur des conteneurs Docker pour faciliter le développement, les tests et le déploiement. Docker isole chaque composant de l'application dans son propre environnement, garantissant ainsi la cohérence entre les différentes machines et environnements.

### Docker Compose

Le fichier `docker-compose.yml` coordonne les différents services :

```yaml
version: "3.8"
services:
  # Frontend React
  client:
    build:
      context: ./client
      dockerfile: docker/Dockerfile
    ports:
      - "5173:5173"
    volumes:
      - ./client:/app
    depends_on:
      - server
    env_file:
      - ./client/.env
    networks:
      - taskwave-network

  # Backend Node.js
  server:
    build:
      context: ./server
      dockerfile: docker/Dockerfile
    ports:
      - "5000:5000"
    volumes:
      - ./server:/app
    depends_on:
      - mongodb
      - redis
    env_file:
      - ./server/.env
    networks:
      - taskwave-network

  # Base de données MongoDB
  mongodb:
    image: mongo:latest
    ports:
      - "27018:27017"
    volumes:
      - mongodb-data:/data/db
      - ./mongo-init.js:/docker-entrypoint-initdb.d/mongo-init.js
    command: ["--replSet", "rs0", "--bind_ip_all"]
    networks:
      - taskwave-network

  # Cache Redis
  redis:
    image: redis:latest
    ports:
      - "6379:6379"
    networks:
      - taskwave-network
    volumes:
      - redis-data:/data

networks:
  taskwave-network:
    driver: bridge

volumes:
  mongodb-data:
  redis-data:
```

### Dockerfiles

#### Client (Frontend)

Le `Dockerfile` pour le client (React/TypeScript) :

```dockerfile
FROM node:18

WORKDIR /app

COPY package*.json ./

COPY . .

EXPOSE 5173

# Copier le script d'entrypoint
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Utilisation de l'entrypoint
ENTRYPOINT ["/entrypoint.sh"]
```

Avec un script d'entrée pour garantir l'installation des dépendances :

```bash
#!/bin/bash

# Installation des dépendances
npm install

# Démarrer le serveur de développement
npm run dev
```

#### Server (Backend)

Le `Dockerfile` pour le serveur (Node.js/Express) :

```dockerfile
FROM node:18

WORKDIR /app

COPY package*.json ./

COPY . .

EXPOSE 5000

# Copier le script d'entrypoint
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Utilisation de l'entrypoint
ENTRYPOINT ["/entrypoint.sh"]
```

Avec un script d'entrée similaire :

```bash
#!/bin/bash

# Installation des dépendances
npm install

# Génération du client Prisma
npx prisma generate

# Démarrer le serveur en mode développement
echo "Starting development server..."
npm run dev
```

## Structure du Projet

### Arborescence Frontend (client)

```
client/
├── components.json       # Configuration des composants Shadcn/UI
├── eslint.config.js      # Configuration ESLint
├── index.html            # Page HTML principale
├── package.json          # Dépendances et scripts npm
├── tsconfig.json         # Configuration TypeScript
├── vite.config.ts        # Configuration Vite
├── docker/               # Configuration Docker
│   ├── Dockerfile        # Dockerfile pour le frontend
│   └── entrypoint.sh     # Script d'entrée pour le conteneur
├── public/               # Fichiers statiques
└── src/
    ├── main.tsx          # Point d'entrée de l'application
    ├── router.tsx        # Gestion des routes de l'application
    ├── assets/           # Images, polices et autres ressources
    ├── components/       # Composants React réutilisables
    │   ├── Layout.tsx    # Mise en page principale
    │   ├── board/        # Composants liés aux tableaux
    │   ├── common/       # Composants génériques
    │   ├── kanban/       # Composants pour l'affichage kanban
    │   │   ├── columns/  # Composants pour les colonnes
    │   │   └── tasks/    # Composants pour les tâches
    │   ├── login/        # Composants liés à l'authentification
    │   └── ui/           # Composants d'interface utilisateur
    ├── constants/        # Constantes de l'application
    │   ├── commands.ts   # Commandes pour la palette de commandes
    │   ├── kanban.ts     # Constantes pour la fonctionnalité kanban
    │   └── task.ts       # Constantes pour les tâches
    ├── hooks/            # Hooks React personnalisés
    │   ├── useCommandPalette.ts # Hook pour la palette de commandes
    │   ├── useTaskPage.ts       # Hook pour la page des tâches
    │   └── kanban/       # Hooks spécifiques au kanban
    ├── lib/              # Bibliothèques et utilitaires
    │   └── utils.ts      # Fonctions utilitaires génériques
    ├── pages/            # Composants de pages
    │   ├── BoardDetails.tsx # Page de détails d'un tableau
    │   ├── TaskPage.tsx     # Page de gestion des tâches
    │   └── Settings.tsx     # Page de paramètres
    ├── services/         # Services API
    │   ├── boardService.ts  # Service pour les tableaux
    │   ├── columnService.ts # Service pour les colonnes
    │   └── taskService.ts   # Service pour les tâches
    ├── store/            # Gestion de l'état global (Zustand)
    │   ├── useAuthStore.ts  # Store pour l'authentification
    │   ├── useBoardStore.ts # Store pour les tableaux
    │   └── useTaskStore.ts  # Store pour les tâches
    └── types/            # Types TypeScript
        ├── board.types.ts   # Types pour les tableaux
        └── kanban.types.ts  # Types pour le kanban
```

### Arborescence Backend (server)

```
server/
├── package.json          # Dépendances et scripts npm
├── tsconfig.json         # Configuration TypeScript
├── docker/               # Configuration Docker
│   ├── Dockerfile        # Dockerfile pour le backend
│   └── entrypoint.sh     # Script d'entrée pour le conteneur
├── prisma/
│   └── schema.prisma     # Schéma de la base de données Prisma
└── src/
    ├── server.ts         # Point d'entrée de l'application
    ├── config/           # Configuration de l'application
    ├── middleware/       # Middleware Express
    ├── modules/          # Organisation modulaire par fonctionnalité
    │   ├── auth/         # Module d'authentification
    │   │   └── provider/ # Fournisseurs d'authentification
    │   ├── board/        # Module de gestion des tableaux
    │   ├── column/       # Module de gestion des colonnes
    │   └── task/         # Module de gestion des tâches
    ├── shared/           # Code partagé entre les modules
    └── utils/            # Fonctions utilitaires
```

## Schéma de la Base de Données

Taskwave utilise MongoDB comme base de données, structurée avec Prisma pour garantir la cohérence des données et faciliter les requêtes.

Voici le schéma Prisma principal :

```prisma
// Schema Prisma pour MongoDB

datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
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
  id              String    @id @default(auto()) @map("_id") @db.ObjectId
  title           String
  description     String?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  ownerId         String    @db.ObjectId
  owner           User      @relation("BoardOwner", fields: [ownerId], references: [id], onDelete: Cascade)
  columns         Column[]
  backgroundColor String?   // Optionnel pour personnaliser l'apparence
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

enum Provider {
  DISCORD
  LOCAL // Pour les utilisateurs enregistrés localement avec email/mot de passe
}

enum Priority {
  LOW
  NORMAL
  HIGH
  URGENT
}
```

Ce schéma illustre les relations principales entre les utilisateurs, les tableaux kanban (boards), les colonnes et les tâches. Il permet :

- L'attribution de tâches aux utilisateurs
- L'organisation des tâches en colonnes avec ordonnancement
- La gestion des priorités et des dates d'échéance
- Le suivi des relations de propriété
- La gestion du statut d'achèvement des tâches
- L'association de labels et pièces jointes aux tâches
- La personnalisation visuelle avec des couleurs pour les colonnes et les tableaux

## Communication entre les Services

La communication entre le frontend et le backend s'effectue via des API RESTful. Le client envoie des requêtes HTTP au serveur, qui traite ces requêtes et renvoie les réponses appropriées.

L'API est organisée selon une architecture modulaire, avec des points de terminaison pour les principales entités :

- `/api/auth` : Authentification et gestion des utilisateurs
- `/api/boards` : Gestion des tableaux
- `/api/columns` : Gestion des colonnes
- `/api/tasks` : Gestion des tâches

En plus de la base de données MongoDB, l'application utilise Redis pour la mise en cache et la gestion des sessions, améliorant ainsi les performances et la scalabilité.

## Conclusion

La configuration de ce projet suit les meilleures pratiques modernes de développement web :

- Architecture en microservices avec Docker
- Séparation claire entre frontend et backend
- Organisation modulaire du code par domaine fonctionnel
- Base de données avec un schéma bien défini et une couche d'abstraction via Prisma
- Système de cache avec Redis pour améliorer les performances
- Outils de développement modernes facilitant la maintenance

Cette architecture offre plusieurs avantages :

- **Isolation** : Les problèmes dans un service n'affectent pas les autres
- **Scalabilité** : Chaque service peut évoluer indépendamment
- **Développement parallèle** : Les équipes peuvent travailler simultanément sur différentes parties
- **Facilité de déploiement** : L'utilisation de Docker simplifie le déploiement dans différents environnements
- **Maintenabilité** : L'organisation modulaire facilite l'évolution et la maintenance du code
- **Performance** : L'utilisation de Redis offre des gains significatifs en termes de réactivité
