# L2 MATHS Archive

Archive web non officielle pour centraliser les ressources de L2 Maths (cours, TD, corriges), organisees par matiere et semestre.

## Fonctionnalites

- Catalogue de matieres avec bascule Semestre 1 / Semestre 2
- Navigation par matiere puis par chapitre
- Liens directs vers les ressources (Cours, TD, Corrige)
- Authentification utilisateur Firebase
- Espace profil utilisateur
- Formulaire de contact
- Interface de televersement (selon les droits/configuration)
- UI responsive (React + Tailwind + composants Radix/shadcn)

## Stack technique

- React 19 + TypeScript
- Vite
- React Router
- Tailwind CSS
- Firebase (Auth, Firestore, Storage, Analytics)

## Installation locale

Prerequis:

- Node.js 20+
- npm

Commandes:

```bash
git clone <URL_DU_REPO>
cd l2-maths-archive
npm install
npm run dev
```

L'application est ensuite disponible en local via l'URL affichee par Vite.

## Variables d'environnement

Creer un fichier `.env.local` a partir de `.env.example` puis renseigner:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`

Si ces variables manquent, l'application demarre en mode demo avec un fallback Firebase minimal (certaines fonctionnalites peuvent etre desactivees).

## Scripts utiles

- `npm run dev`: demarrage en developpement
- `npm run build`: build de production
- `npm run build:dev`: build en mode development
- `npm run preview`: previsualisation du build
- `npm run lint`: verification ESLint
- `npm run deploy`: build + deploiement Firebase
- `npm run deploy:hosting`: build + deploiement Firebase Hosting uniquement

## Deploiement Firebase

Configurer Firebase CLI puis lancer:

```bash
npm run deploy
```

ou uniquement l'hebergement:

```bash
npm run deploy:hosting
```

## Structure du projet

- `src/pages`: pages principales
- `src/components`: composants UI et metier
- `src/lib`: services et configuration (Firebase, themes, utilitaires)
- `public`: ressources statiques
- `functions`: Cloud Functions Firebase

## Statut

Projet en evolution. Contributions et ameliorations bienvenues.
