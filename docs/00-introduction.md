# Taskwave - Introduction

## Genèse du Projet

Taskwave est né d'un constat simple : 

🧠 Trop d'idées, pas assez d’organisation.

Malgré l'abondance d'outils de gestion de projet sur le marché, beaucoup sont soit trop complexes avec des fonctionnalités superflues, soit trop simples pour répondre à mes besoins réels.

Le projet a débuté en mai 2025 avec l'ambition de créer une solution qui combine la simplicité d'utilisation avec les fonctionnalités essentielles qu'attendent les équipes agiles et distribuées.

## Présentation du Projet

TaskWave est une application de gestion de tâches pensée pour les créateurs solo : développeurs indépendants, étudiants, makers ou porteurs de projet.

Elle permet de s’organiser rapidement grâce à une interface kanban minimaliste et fluide, sans les lourdeurs des outils collaboratifs traditionnels.



### Le Problème Résolu

Quand on travaille seul sur un projet que ce soit un MVP, une app perso ou un side project ambitieux — on se retrouve vite à jongler entre Trello, Notion, des to-do dans tous les sens… Résultat :

- Vision floue de l’avancement réel

- Motivation qui chute faute de structure claire

- Distractions fréquentes sans système visuel pour prioriser

- Organisation éclatée entre outils mal adaptés à un solo builder

TaskWave est né de ce constat : il manque un outil simple, rapide et pensé pour les indépendants qui veulent avancer efficacement sur leurs projets sans se noyer dans la complexité des outils d’équipe

## Objectifs du Projet

Le projet Taskwave a été développé avec plusieurs objectifs clés en tête :

1. **Simplicité d'utilisation** : Créer une interface utilisateur intuitive qui facilite la gestion des tâches sans nécessiter de formation approfondie.

2. **Validation d'idée** : 
Valider une idée de produit concret, en build public, avec un MVP simple mais fonctionnel.

3. **Participation communautaire** :
un projet open-source qui pourra être utilisé et amélioré par d'autres développeurs, favorisant ainsi l'échange de connaissances et d'idées.

4. **Accessibilité** : Garantir que l'application soit accessible à partir de n'importe quel appareil via une interface web réactive.

5. **Sécurité** : Mettre en œuvre des mécanismes d'authentification robustes pour protéger les données des utilisateurs.

## Avantages Concurrentiels

Dans un marché saturé d'outils de gestion de projet, Taskwave se distingue par plusieurs avantages clés :

### 1. Expérience Utilisateur Optimisée

Contrairement à de nombreuses solutions qui privilégient les fonctionnalités au détriment de l'expérience utilisateur, Taskwave place l'UX au centre de sa conception. L'interface intuitive permet une prise en main immédiate sans formation préalable.

### 2. Architecture Moderne et Évolutive

En s'appuyant sur des technologies de pointe comme React, TypeScript et MongoDB, Taskwave offre une base solide et évolutive qui peut facilement s'adapter à la croissance des équipes et à l'évolution de leurs besoins.

### 3. Approche Open-Source et Transparente

Taskwave adopte une philosophie open-source, encourageant la communauté à contribuer à son développement et garantissant la transparence dans la gestion des données des utilisateurs.

### 4. Déploiement Flexible

Grâce à sa conteneurisation avec Docker, Taskwave peut être déployé dans divers environnements, du cloud public aux serveurs privés, offrant ainsi une flexibilité importante pour les entreprises soucieuses de la souveraineté de leurs données.

## Choix Technologiques

Pour réaliser ces objectifs, nous avons fait les choix technologiques suivants :

### Frontend

- **React** : Bibliothèque JavaScript pour la construction d'interfaces utilisateur interactives.
- **TypeScript** : Surcouche de JavaScript apportant un système de typage statique.
- **Tailwind CSS** : Framework CSS utilitaire pour un développement rapide et cohérent.
- **Shadcn/UI** : Composants UI réutilisables basés sur Radix UI pour accélérer le développement.
- **Zustand** : Gestionnaire d'état minimaliste pour React, plus léger et plus simple à configurer que Redux.
- **React Router** : Pour la gestion des routes côté client.

### Backend

- **Node.js** : Environnement d'exécution JavaScript côté serveur.
- **Express** : Framework web minimaliste pour Node.js.
- **Prisma** : ORM moderne pour Node.js et TypeScript facilitant les interactions avec la base de données.
- **MongoDB** : Base de données NoSQL orientée document, idéale pour les données flexibles et évolutives.

### Infrastructure

- **Docker** : Conteneurisation de l'application pour faciliter le déploiement et la gestion des environnements.
- **Docker Compose** : Orchestration des différents services (frontend, backend, base de données).

### Authentification

- **OAuth 2.0** : Protocole d'autorisation standard pour les applications web modernes.
- **Discord OAuth** : Service d'authentification tiers choisi pour sa popularité et sa facilité d'implémentation.

## Structure du Projet

Le projet Taskwave est organisé en deux parties principales :

1. **Client** : Application frontend React/TypeScript avec une architecture basée sur les composants.
2. **Serveur** : API RESTful Node.js/Express avec une architecture en couches (contrôleurs, services, modèles).
3. **Docs** : Documentation du projet.

Les deux parties sont conteneurisées séparément et communiquent via des API HTTP.

## Flux de Travail Taskwave

L'expérience utilisateur de Taskwave a été conçue pour être intuitive et efficace :

1. **Authentification simplifiée** : Connexion rapide via Discord ou autres fournisseurs OAuth
2. **Tableau de bord centralisé** : Visualisation immédiate des projets.
3. **Création de tableaux** : Mise en place facile de nouveaux projets avec des colonnes personnalisées
4. **Gestion des tâches** : Création, assignation et suivi des tâches avec descriptions riches et pièces jointes
5. **Collaboration** : Commentaires et notifications en temps réel pour une coordination efficace
6. **Rapports et analyses** : Visualisation des performances et de l'avancement des projets


## Feuille de Route du Projet

Le développement de Taskwave suit une approche itérative, avec plusieurs phases clairement définies :

1. **MVP (Produit Minimum Viable) - Q1 2024** :

   - Authentification sécurisée avec Discord OAuth
   - Interface utilisateur minimale avec navigation et sidebar responsive
   - Création de projets et de colonnes personnalisées
   - Création et affichage des tableaux kanban et des tâches basiques

2. **Version 1.0 - Q2 2024** :

   - Fonctionnalités complètes de kanban (filtres, étiquettes, archivage)
   - Amélioration de l'interface utilisateur avec thèmes personnalisables
   - Système de permissions et de rôles pour la collaboration en équipe
   - Fonctionnalités de recherche et de tri avancées

3. **Version 2.0 - Q4 2024** :

   - Intégration avec des services tiers (GitHub, Slack, Google Calendar)
   - Fonctionnalités avancées d'analyse et de reporting
   - API publique pour extensions et intégrations personnalisées
   - Applications mobiles natives pour iOS et Android

4. **Vision à long terme** :
   - Intelligence artificielle pour l'automatisation et les suggestions
   - Fonctionnalités avancées de gestion de portefeuille de projets
   - Solutions spécifiques pour différents secteurs (développement logiciel, marketing, etc.)

## Parcours de Développement

La documentation qui suit détaille chronologiquement les étapes de développement, les défis rencontrés et les solutions implémentées pour chaque phase du projet Taskwave. Elle constitue à la fois un historique du projet et un guide pour les nouveaux contributeurs souhaitant comprendre l'architecture et les choix techniques effectués.

## Documentation suivante
- [Setup](01-setup.md)
