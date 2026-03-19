# 🔥 Guide Firebase - L2 Maths Archive

## 📋 Configuration Manuelle Nécessaire

### 1. Créer un projet Firebase

1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Cliquez sur "Ajouter un projet"
3. Nommez votre projet `l2-maths-archive` ou un autre nom de votre choix
4. Activez Google Analytics (optionnel)
5. Créez le projet

### 2. Configurer les services Firebase

Dans la console Firebase :

#### Hosting
- Allez dans "Hosting" dans le menu latéral
- Cliquez sur "Commencer"
- Suivez les étapes (les fichiers sont déjà configurés)

#### Firestore Database
- Allez dans "Firestore Database"
- Cliquez sur "Créer une base de données"
- Choisissez le mode "Test" pour commencer
- Sélectionnez une région proche

#### Storage
- Allez dans "Storage"
- Cliquez sur "Commencer"
- Choisissez le mode "Test"

#### Authentication (Optionnel)
- Allez dans "Authentication"
- Configurez les méthodes de connexion souhaitées

### 3. Obtenir les clés de configuration

1. Dans Firebase Console, allez dans "Paramètres du projet" (icône engrenage)
2. Dans l'onglet "Général", descendez jusqu'à "Vos applications"
3. Cliquez sur "Ajouter une application" > Web
4. Donnez un nom à votre app
5. Cochez "Configurer aussi Firebase Hosting"
6. Copiez la configuration qui apparaît

### 4. Configurer les variables d'environnement

1. Créez un fichier `.env` à la racine du projet
2. Copiez le contenu de `.env.example`
3. Remplacez les valeurs par celles de votre configuration Firebase

```env
VITE_FIREBASE_API_KEY=votre_clé_api
VITE_FIREBASE_AUTH_DOMAIN=votre-projet.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=votre-projet-id
VITE_FIREBASE_STORAGE_BUCKET=votre-projet.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=votre_sender_id
VITE_FIREBASE_APP_ID=votre_app_id
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 5. Mettre à jour .firebaserc

Modifiez le fichier `.firebaserc` avec votre ID de projet :

```json
{
  "projects": {
    "default": "votre-projet-id"
  }
}
```

## 🚀 Déploiement

### Premier déploiement

```bash
npm run build
firebase deploy
```

### Déploiements suivants

```bash
npm run deploy
```

Ou seulement l'hosting :

```bash
npm run deploy:hosting
```

## 🔧 Développement Local

Pour tester avec les émulateurs Firebase :

```bash
firebase emulators:start
```

## 📝 Scripts Disponibles

- `npm run dev` - Serveur de développement
- `npm run build` - Build de production
- `npm run deploy` - Build + Déploiement complet
- `npm run deploy:hosting` - Build + Déploiement hosting uniquement

## ⚠️ Important

- N'oubliez pas d'ajouter `.env` dans `.gitignore`
- Configurez les règles de sécurité avant la production
- Testez d'abord avec les émulateurs Firebase