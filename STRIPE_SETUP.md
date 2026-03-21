# Configuration Stripe pour les Donations

Cette application inclut une intégration complète de Stripe pour permettre aux utilisateurs de faire des donations.

## Configuration

### 1. Clé Publique Stripe (Frontend)

La clé publique est déjà configurée dans `.env.local`:

```env
VITE_STRIPE_PUBLIC_KEY=pk_live_51RqyOwFsrP029t76six64eFyLCFMGmib98fSp9KnzT32IPv3FMH9FPmndf1OSTNcLPM8mVL4g1m4SsOvJBCTlUCL00eVIHsvge
```

### 2. Clé Secrète Stripe (Backend - Cloud Functions)

Pour les Cloud Functions, vous devez ajouter la clé secrète (SK) via Firebase Config Secrets:

```bash
# Option 1: Via Firebase CLI (recommandé)
firebase functions:secrets:set STRIPE_SECRET_KEY

# Puis entrez votre clé secrète commençant par sk_live_...
```

Ou

```bash
# Option 2: Via Google Cloud Secrets Manager
gcloud secrets create STRIPE_SECRET_KEY --data-file=stripe-key.txt --replication-policy="automatic"
```

### 3. Vérification

Une fois configurée, redéployez les Cloud Functions:

```bash
npm run deploy
# ou
firebase deploy --only functions
```

## Structure de l'Intégration

### Frontend (React)
- **Composant**: `src/components/DonationSection.tsx`
- **Hook Stripe**: Utilise `@stripe/react-stripe-js`
- **Éléments**: CardElement, Elements Provider
- **Fonctionnalité**: Montants prédéfinis (5€, 10€, 25€, 50€) + montant personnalisé

### Backend (Cloud Functions)
- **Fonction**: `createDonationIntent` (HTTP)
- **URL**: `europe-west1-l2-maths.cloudfunctions.net/createDonationIntent`
- **Méthode**: POST
- **Payload**:
  ```json
  {
    "amount": 1000,  // en centimes
    "email": "donateur@example.com",
    "name": "Jean Dupont"
  }
  ```
- **Réponse**:
  ```json
  {
    "clientSecret": "pi_1234...",
    "paymentIntentId": "pi_1234..."
  }
  ```

## Flux de Paiement

1. **Utilisateur remplit le formulaire**
   - Choix du montant (prédéfini ou personnalisé)
   - Entrée du nom et email
   - Entrée des informations de carte

2. **Frontend envoie la requête**
   - Appelle la Cloud Function `createDonationIntent`
   - Reçoit le `clientSecret`

3. **Stripe traite le paiement**
   - Frontend confirme le paiement avec Stripe
   - Stripe communique avec la Cloud Function

4. **Succès**
   - Notification utilisateur
   - Quittance envoyée à l'email fourni
   - Réinitialisation du formulaire

## Sécurité

- ✅ **Clé public**: Visible (autorisée)
- ✅ **Clé secrète**: Stockée dans Firebase Secrets (jamais exposée)
- ✅ **CORS**: Activé pour les Cloud Functions
- ✅ **SCA (3D Secure)**: Supporté via Payment Intent
- ✅ **Métadonnées**: Enregistrées pour chaque donation

## Variables d'Environnement Requises

### Frontend (.env.local)
```env
VITE_STRIPE_PUBLIC_KEY=pk_live_...
```

### Backend (Firebase Secrets)
```
STRIPE_SECRET_KEY=sk_live_...
```

## Troubleshooting

### Erreur: "Stripe not loaded"
- Vérifiez que `VITE_STRIPE_PUBLIC_KEY` est present dans `.env.local`
- Rechargez la page

### Erreur lors du paiement: "Clé secrète manquante"
- Assurez-vous que `STRIPE_SECRET_KEY` est configuré dans Firebase
- Redéployez les Cloud Functions après ajout du secret

### Montant invalide
- Le montant minimum est 1€ (100 centimes)
- Le frontend convertit automatiquement en centimes

## Monitoring

Consultez les logs des Cloud Functions:
```bash
firebase functions:log
```

Consultez le Stripe Dashboard pour:
- Historique des paiements
- Clients
- Factures
- Rapports

## Documentation Référence

- [Stripe React Documentation](https://stripe.com/docs/stripe-js/react)
- [Stripe Payment Intents API](https://stripe.com/docs/payments/payment-intents)
- [Firebase Cloud Functions Secrets](https://firebase.google.com/docs/functions/config/secrets)
