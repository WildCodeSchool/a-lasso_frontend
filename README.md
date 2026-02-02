# ALASSO - Frontend

Plateforme de mise en relation entre bénévoles et associations.


Backend API pour l'application A l'Asso, une plateforme de mise en relation entre bénévoles et associations.

FrontEnd Prod : https://a-l-asso.fr/ | Stagging : https://staging.a-l-asso.fr/

BackEnd Prod : https://api.a-l-asso.fr/ | Stagging : https://staging-api.a-l-asso.fr/

Repo gitHub BackEnd : https://github.com/WildCodeSchool/a-lasso_backend

![Image 1](https://i.ibb.co/jktVfxQn/image.png)

## Description du projet

ALASSO est une application web permettant aux bénévoles de découvrir et participer à des activités proposées par des associations. L'application offre une carte interactive pour visualiser les activités à proximité, un système de messagerie, et des profils dédiés pour les bénévoles et les associations.

## Stack technique

| Technologie | Version | Usage |
|-------------|---------|-------|
| Angular | 19 | Framework frontend (composants standalone) |
| NgRx | 19 | State management (store, effects, selectors) |
| PrimeNG | 19 | Bibliothèque de composants UI |
| MapLibre GL | 5 | Carte interactive |
| SCSS | - | Styles |
| Jest | 29 | Tests unitaires et d'intégration |
| Cypress | latest | Tests End-to-End |
| TypeScript | 5.5 | Langage |

## Architecture du projet

```
src/
├── app/
│   ├── common/                    # Éléments partagés
│   │   ├── components/            # Composants réutilisables (badge, button, header...)
│   │   ├── guards/                # Guards d'authentification et de rôles
│   │   ├── interceptors/          # Intercepteurs HTTP (JWT)
│   │   ├── models/                # Interfaces et types communs
│   │   ├── pipes/                 # Pipes personnalisés
│   │   ├── resolvers/             # Resolvers de routes
│   │   ├── store/                 # État global NgRx
│   │   └── utils/                 # Fonctions utilitaires
│   │
│   └── features/                  # Modules fonctionnels
│       ├── activity/              # Gestion des activités
│       │   ├── components/        # Composants (cartes, filtres, favoris...)
│       │   ├── models/            # Modèles d'activité
│       │   ├── pages/             # Pages (liste, détails, création)
│       │   ├── services/          # Services API et façade
│       │   ├── store/             # État NgRx des activités
│       │   └── utils/             # Utilitaires spécifiques
│       │
│       ├── association/           # Gestion des associations
│       │   ├── components/        # Composants (carte association)
│       │   ├── models/            # Modèles d'association
│       │   ├── pages/             # Page détails association
│       │   ├── services/          # Services API et façade
│       │   └── store/             # État NgRx des associations
│       │
│       ├── authentication/        # Authentification
│       │   ├── components/        # Modales (login, register, forgot password)
│       │   ├── constants/         # Constantes d'auth
│       │   ├── models/            # Modèles utilisateur
│       │   ├── pages/             # Page reset password
│       │   └── store/             # État NgRx d'authentification
│       │
│       ├── map/                   # Carte interactive
│       │   ├── components/        # Composants map et popup
│       │   ├── constants/         # Configuration de la carte
│       │   ├── models/            # Types de la carte
│       │   └── services/          # Service de la carte
│       │
│       ├── profile/               # Profils utilisateurs
│       │   ├── components/        # Composants profil (association/voluntary)
│       │   ├── models/            # Modèles de profil
│       │   ├── pages/             # Pages profil association et bénévole
│       │   └── utils/             # Validateurs et utilitaires
│       │
│       └── report/                # Signalements (admin)
│           ├── components/        # Composants de signalement
│           ├── models/            # Modèles de signalement
│           ├── pages/             # Page d'accueil des signalements
│           ├── services/          # Services API et façade
│           └── store/             # État NgRx des signalements
│
├── environments/                  # Configuration par environnement
└── styles.scss                    # Styles globaux
```

## Rôles utilisateurs

| Rôle | Description | Fonctionnalités |
|------|-------------|-----------------|
| **Bénévole** | Utilisateur standard | Consulter les activités, s'inscrire, ajouter aux favoris, messagerie |
| **Association** | Organisateur d'activités | Créer/modifier des activités, gérer les inscriptions, statistiques |
| **Admin** | Administrateur | Gestion des signalements, modération |

## Installation et lancement

### Prérequis

- Node.js (version LTS recommandée)
- npm

### Installation

```bash
# Cloner le repository
git clone <url-du-repo>

# Installer les dépendances
npm install

# Activer Husky (hooks git)
npm run prepare
```


### Configuration

1. Copier le fichier d'environnement secret :
```bash
cp src/environments/environment.secret.sample.ts src/environments/environment.secret.ts
```

2. Renseigner les clés API nécessaires dans `environment.secret.ts`

### Lancer l'application

```bash
# Développement (par défaut)
npm start
# ou
npm run serve:development

# Staging
npm run serve:staging

# Production
npm run serve:production
```

L'application sera accessible sur `http://localhost:4200`

### Avec Docker

```bash
# Développement
npm run docker:dev

# Staging
npm run docker:staging

# Production
npm run docker:prod
```

## Scripts disponibles

| Commande | Description |
|----------|-------------|
| `npm start` | Lancer en mode développement |
| `npm run build:staging` | Build pour staging |
| `npm run build:production` | Build pour production |
| `npm run test` | Lancer les tests unitaires |
| `npm run test:coverage` | Tests avec rapport de couverture |
| `npm run test:watch` | Tests en mode watch |
| `npm run e2e:ui:staging` | Tests E2E Cypress (UI) - staging |
| `npm run e2e:ci:staging` | Tests E2E Cypress (CLI) - staging |
| `npm run lint` | Lancer ESLint |
| `npm run prettier` | Formater le code avec Prettier |
| `npm run doc` | Générer et servir la documentation Compodoc |


## Architecture

![Image 2](https://i.ibb.co/RGQNfsTJ/image-1.png)

## Qualité du code

### Prettier
- Formatage automatique du code
- Configuration : `.prettierrc.json`
- Exécution automatique avant chaque commit

### ESLint
- Règles de linting TypeScript et Angular
- Configuration : `eslint.config.js`
- Inclut les configurations recommandées ESLint, TSLint et NgLint

### Husky
Pre-commit hooks qui :
- Vérifient que les fichiers de configuration ne sont pas modifiés
- Exécutent Prettier et ESLint
- Valident le nom de la branche

## Tests

### Tests unitaires et d'intégration (Jest)
```bash
npm run test
```

### Tests End-to-End (Cypress)
```bash
# Interface graphique
npm run e2e:ui:staging

# Ligne de commande (CI)
npm run e2e:ci:staging
```

## Documentation

Générer et consulter la documentation avec Compodoc :
```bash
npm run doc
```
Documentation accessible sur `http://127.0.0.1:8081`

## Environnements

| Environnement | Fichier de config | Usage |
|---------------|-------------------|-------|
| Development | `environment.development.ts` | Développement local |
| Staging | `environment.staging.ts` | Tests et validation |
| Production | `environment.production.ts` | Production |

## CI/CD

Pipeline GitHub Actions :
1. **Push sur une branche** : Tests unitaires et d'intégration
2. **Push sur staging** : Tests unitaires, d'intégration et E2E
3. **Build réussi** : Construction de l'image Docker et déploiement sur DockerHub
4. **Webhook** : Le VPS pull l'image et redémarre le container

## Conventions Git

### Nommage des branches
Les branches doivent suivre le format validé par Husky (ex: `feature/issue-123/description`, `hotfix/issue-456/fix-bug`)

### Protection des branches
- `production`, `staging`, `development` : Push direct interdit
- PR obligatoires avec review des contributeurs
- PR vers `production` : Approbation du owner requise

