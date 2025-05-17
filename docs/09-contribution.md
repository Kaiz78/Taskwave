# Taskwave - Guide de contribution

## Introduction

Merci de votre intérêt pour contribuer à Taskwave ! Ce projet est ouvert aux contributions de la communauté et nous apprécions toute aide, qu'il s'agisse de corrections de bugs, d'améliorations de fonctionnalités, de documentation ou de rapports de problèmes.

Ce document fournit des directives pour contribuer efficacement au projet et maintenir la qualité du code.

## Comment contribuer

### 1. Trouver une tâche sur laquelle travailler

Plusieurs façons de contribuer sont possibles :

- **Corriger des bugs** : Consultez les [issues](https://github.com/alework/Taskwave/issues) marquées avec le label `bug`
- **Ajouter des fonctionnalités** : Recherchez les issues avec le label `enhancement` ou `feature-request`
- **Améliorer la documentation** : Identifiez les sections peu claires ou manquantes
- **Refactoring de code** : Améliorez la qualité du code sans modifier son comportement
- **Ajouter des tests** : Augmentez la couverture de tests

### 2. Fork et clonage

1. Créez un fork du dépôt Taskwave sur GitHub
2. Clonez votre fork sur votre machine locale
3. Configurez le dépôt d'origine comme remote upstream

```bash
git clone https://github.com/votre-username/Taskwave.git
cd Taskwave
git remote add upstream https://github.com/alework/Taskwave.git
```

### 3. Créer une branche

Créez une branche pour vos modifications basée sur la branche principale (`main`).

```bash
git checkout main
git pull upstream main
git checkout -b feature/nom-de-ma-fonctionnalite
```

Conventions de nommage des branches :

- `feature/nom-de-la-fonctionnalite` pour les nouvelles fonctionnalités
- `fix/nom-du-bug` pour les corrections de bugs
- `docs/sujet-de-la-doc` pour les mises à jour de documentation
- `refactor/description` pour les refactorisations

### 4. Développer et tester

1. Implémentez vos modifications
2. Suivez les standards de code du projet
3. Ajoutez ou mettez à jour les tests si nécessaire
4. Vérifiez que tous les tests passent

```bash
# Installation des dépendances
cd client
npm install
cd ../server
npm install

# Exécution de l'application en développement
cd client
npm run dev

# Dans un autre terminal
cd server
npm run dev

# Exécution des tests (lorsqu'ils seront implémentés)
npm run test
```

### 5. Soumettre une Pull Request

1. Committez vos changements avec des messages clairs
2. Poussez votre branche vers votre fork
3. Créez une pull request vers la branche `main` du dépôt principal
4. Décrivez clairement vos modifications dans la description de la PR

```bash
git add .
git commit -m "feat: ajouter la fonctionnalité X"
git push origin feature/nom-de-ma-fonctionnalite
```

## Standards de code

### TypeScript

- Utilisez TypeScript pour tous les fichiers .ts et .tsx
- Définissez des types précis plutôt que `any`
- Utilisez des interfaces pour les props des composants React

### Composants React

- Utilisez des composants fonctionnels avec hooks
- Un composant par fichier, sauf pour les composants étroitement liés
- Nommez les fichiers de composants en PascalCase

### Style de code

- Suivez les règles ESLint et Prettier configurées dans le projet
- Formatez votre code avant de soumettre un PR
- Respectez l'architecture existante


### Messages de commit

Suivez la convention [Conventional Commits](https://www.conventionalcommits.org/) :

- `feat:` pour une nouvelle fonctionnalité
- `fix:` pour une correction de bug
- `docs:` pour les changements de documentation
- `style:` pour les changements de formatage (espaces, etc.)
- `refactor:` pour les refactorisations
- `test:` pour l'ajout ou la modification de tests
- `chore:` pour les tâches de maintenance

### Tests

Quand les tests seront implémentés :

- Écrivez des tests pour toutes les nouvelles fonctionnalités
- Maintenez ou augmentez la couverture de tests
- Vérifiez que tous les tests passent avant de soumettre une PR

## Cycle de revue des Pull Requests

1. Soumettez votre PR
2. Les mainteneurs examineront votre code
3. Des modifications peuvent être demandées
4. Une fois approuvée, la PR sera fusionnée

## Signalement de bugs

Si vous trouvez un bug, veuillez créer une issue en utilisant le template de bug fourni et incluez :

- Une description claire du problème
- Les étapes pour reproduire le bug
- Le comportement attendu et le comportement observé
- Votre environnement (navigateur, OS, version)
- Des captures d'écran si possible

## Demandes de fonctionnalités

Pour suggérer une nouvelle fonctionnalité :

1. Vérifiez d'abord que la fonctionnalité n'est pas déjà prévue dans la [roadmap](./08-roadmap.md)
2. Créez une issue en utilisant le template de demande de fonctionnalité
3. Décrivez en détail la fonctionnalité et sa valeur ajoutée
4. Proposez une implémentation si possible

## Structure du projet

Familiarisez-vous avec la structure du projet pour contribuer efficacement :

```
Taskwave/
├── client/            # Application frontend React
│   ├── src/
│   │   ├── components/  # Composants React
│   │   ├── hooks/       # Hooks personnalisés
│   │   ├── pages/       # Pages de l'application
│   │   └── store/       # Gestion de l'état global
├── server/            # API backend Node.js
│   ├── src/
│   │   ├── controllers/ # Contrôleurs API
│   │   ├── models/      # Modèles de données
│   │   ├── routes/      # Routes API
│   │   └── services/    # Services métier
└── docs/              # Documentation
```

## Communication

- Utilisez les issues GitHub pour les discussions techniques
- Gardez les discussions respectueuses et constructives
- N'hésitez pas à demander de l'aide si vous êtes bloqué

## Reconnaissances

Les contributeurs seront reconnus dans le fichier CONTRIBUTORS.md et dans les notes de version.

## Licence

En contribuant à Taskwave, vous acceptez que vos contributions soient soumises à la licence du projet, comme indiqué dans le fichier LICENSE.

## Questions

Si vous avez des questions sur le processus de contribution, n'hésitez pas à créer une issue avec le label `question`.

Merci de contribuer à rendre Taskwave meilleur pour tous !
