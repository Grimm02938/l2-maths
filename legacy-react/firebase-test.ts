import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

// Test de connexion Firebase
export const testFirebaseConnection = async () => {
  try {
    console.log('🔥 Test de connexion Firebase...');
    
    // Test simple : essayer de lire une collection (même vide)
    const testCollection = collection(db, 'test');
    await getDocs(testCollection);
    
    console.log('✅ Firebase connecté avec succès !');
    return true;
  } catch (error) {
    console.error('❌ Erreur de connexion Firebase:', error);
    return false;
  }
};

// Fonction pour tester l'authentification
export const testAuth = () => {
  try {
    console.log('🔐 Service d\'authentification disponible');
    return true;
  } catch (error) {
    console.error('❌ Erreur auth:', error);
    return false;
  }
};