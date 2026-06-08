import { db } from './firebase';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc,
  setDoc,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';

// Types pour la base de données
export interface UserProfile {
  id: string; // Corresponds to Firebase Auth UID
  email: string;
  displayName: string;
  university?: string;
  fieldOfStudy?: string;
  createdAt: any;
  updatedAt: any;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  subjectId: string;
  chapterId: string;
  type: 'cours' | 'td' | 'correction-td' | 'ds' | 'correction-ds';
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  uploadedBy: string;
  uploadedAt: Date;
  isPublic: boolean;
  downloadCount: number;
}

export interface Subject {
  id: string;
  title: string;
  description: string;
  professor: string;
  color: string;
  icon: string;
  isActive: boolean;
  createdAt: Date;
}

export interface ChapterData {
  id: string;
  title: string;
  subjectId: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
}

export interface ContactMessage {
    id: string;
    email: string;
    message: string;
  imageUrls?: string[];
    createdAt: Date;
}

// Collection references
const coursesCollection = collection(db, 'courses');
const subjectsCollection = collection(db, 'subjects');
const chaptersCollection = collection(db, 'chapters');
const contactMessagesCollection = collection(db, 'contact-messages');
const userProfilesCollection = collection(db, 'user-profiles');


// Service pour les profils utilisateurs
export const userProfileService = {
  // Récupérer ou créer un profil
  async getOrCreateProfile(userId: string, userData: { email?: string | null; displayName?: string | null; }): Promise<UserProfile> {
    const profileRef = doc(db, 'user-profiles', userId);
    const profileSnap = await getDoc(profileRef);

    if (profileSnap.exists()) {
      return { id: profileSnap.id, ...profileSnap.data() } as UserProfile;
    } else {
      const newProfile: Omit<UserProfile, 'id'> = {
        email: userData.email || 'N/A',
        displayName: userData.displayName || 'Nouvel utilisateur',
        university: '',
        fieldOfStudy: '',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      await setDoc(profileRef, newProfile);
      
      // Re-fetch the profile to get server-generated timestamps
      const newProfileSnap = await getDoc(profileRef);
      if (newProfileSnap.exists()) {
        return { id: newProfileSnap.id, ...newProfileSnap.data() } as UserProfile;
      } else {
        // This should not happen if setDoc was successful
        throw new Error("Failed to create and fetch profile.");
      }
    }
  },

  // Mettre à jour un profil
  async updateProfile(userId: string, updates: Partial<Omit<UserProfile, 'id' | 'email' | 'createdAt'>>) {
    const profileRef = doc(db, 'user-profiles', userId);
    try {
      await updateDoc(profileRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error);
      throw error;
    }
  }
};


// Fonctions pour les messages de contact
export const contactService = {
  // Ajouter un message de contact
  async addContactMessage(messageData: Omit<ContactMessage, 'id' | 'createdAt'>) {
    try {
      await addDoc(contactMessagesCollection, {
        ...messageData,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error(`Erreur lors de l'ajout du message de contact:`, error);
      throw error;
    }
  },
};


// Fonctions pour les cours
export const courseService = {
  // Ajouter un cours
  async addCourse(course: Omit<Course, 'id'>) {
    try {
      const docRef = await addDoc(coursesCollection, {
        ...course,
        uploadedAt: serverTimestamp(),
        downloadCount: 0
      });
      return docRef.id;
    } catch (error) {
      console.error(`Erreur lors de l\'ajout du cours:`, error);
      throw error;
    }
  },

  // Récupérer tous les cours d'un chapitre
  async getCoursesByChapter(subjectId: string, chapterId: string) {
    try {
      const q = query(
        coursesCollection,
        where('subjectId', '==', subjectId),
        where('chapterId', '==', chapterId),
        where('isPublic', '==', true),
        orderBy('type')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Course[];
    } catch (error) {
      console.error(`Erreur lors de la récupération des cours:`, error);
      throw error;
    }
  },

  // Mettre à jour un cours
  async updateCourse(courseId: string, updates: Partial<Course>) {
    try {
      const courseRef = doc(db, 'courses', courseId);
      await updateDoc(courseRef, updates);
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du cours:`, error);
      throw error;
    }
  },

  // Supprimer un cours
  async deleteCourse(courseId: string) {
    try {
      const courseRef = doc(db, 'courses', courseId);
      await deleteDoc(courseRef);
    } catch (error) {
      console.error(`Erreur lors de la suppression du cours:`, error);
      throw error;
    }
  },

  // Incrémenter le compteur de téléchargements
  async incrementDownloadCount(courseId: string) {
    try {
      const courseRef = doc(db, 'courses', courseId);
      const courseDoc = await getDoc(courseRef);
      if (courseDoc.exists()) {
        const currentCount = courseDoc.data().downloadCount || 0;
        await updateDoc(courseRef, {
          downloadCount: currentCount + 1
        });
      }
    } catch (error) {
      console.error(`Erreur lors de l\'incrémentation du compteur:`, error);
    }
  }
};

// Fonctions pour les matières
export const subjectService = {
  // Récupérer toutes les matières actives
  async getActiveSubjects() {
    try {
      const q = query(
        subjectsCollection,
        where('isActive', '==', true),
        orderBy('title')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Subject[];
    } catch (error) {
      console.error(`Erreur lors de la récupération des matières:`, error);
      throw error;
    }
  },

  // Ajouter une matière
  async addSubject(subject: Omit<Subject, 'id'>) {
    try {
      const docRef = await addDoc(subjectsCollection, {
        ...subject,
        createdAt: serverTimestamp(),
        isActive: true
      });
      return docRef.id;
    } catch (error) {
      console.error(`Erreur lors de l\'ajout de la matière:`, error);
      throw error;
    }
  }
};

// Fonctions pour les chapitres
export const chapterService = {
  // Récupérer les chapitres d'une matière
  async getChaptersBySubject(subjectId: string) {
    try {
      const q = query(
        chaptersCollection,
        where('subjectId', '==', subjectId),
        where('isActive', '==', true),
        orderBy('order')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ChapterData[];
    } catch (error) {
      console.error(`Erreur lors de la récupération des chapitres:`, error);
      throw error;
    }
  },

  // Ajouter un chapitre
  async addChapter(chapter: Omit<ChapterData, 'id'>) {
    try {
      const docRef = await addDoc(chaptersCollection, {
        ...chapter,
        createdAt: serverTimestamp(),
        isActive: true
      });
      return docRef.id;
    } catch (error) {
      console.error(`Erreur lors de l\'ajout du chapitre:`, error);
      throw error;
    }
  }
};

// Fonction utilitaire pour initialiser les données de base
export const initializeBaseData = async () => {
    try {
        const subjectsSnapshot = await getDocs(subjectsCollection);
        if (!subjectsSnapshot.empty) {
            console.log('Les données de base existent déjà');
            return;
        }
        const defaultSubjects = [
            {
                title: "ALGÈBRE LINÉAIRE",
                description: "Cette section regroupe les cours d'Algèbre (Menous).",
                professor: "Prof. Menous",
                color: "text-algebra",
                icon: "Calculator",
                isActive: true
            },
            {
                title: "ANALYSE",
                description: "Cette section regroupe les cours d'Analyse (Pallard).",
                professor: "Prof. Pallard",
                color: "text-analysis",
                icon: "TrendingUp",
                isActive: true
            },
            {
                title: "ARITHMÉTIQUE",
                description: "Cette section regroupe les cours d'Arithmétique (Fahlaoui).",
                professor: "Prof. Fahlaoui",
                color: "text-arithmetic",
                icon: "Hash",
                isActive: true
            },
            {
                title: "TOPOLOGIE",
                description: "Cette section regroupe les cours de Topologie (Haglund).",
                professor: "Prof. Haglund",
                color: "text-topology",
                icon: "Network",
                isActive: true
            },
            {
                title: "CALCUL NUMÉRIQUE",
                description: "Cette section regroupe les cours de Calcul numérique (Graille).",
                professor: "Prof. Graille",
                color: "text-calcul",
                icon: "Cpu",
                isActive: true
            }
        ];
        for (const subject of defaultSubjects) {
            await subjectService.addSubject(subject);
        }
        console.log('✅ Données de base initialisées avec succès');
    } catch (error) {
        console.error(`❌ Erreur lors de l\'initialisation des données:`, error);
    }
};
