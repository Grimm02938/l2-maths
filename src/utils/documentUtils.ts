// Utilitaire pour gérer automatiquement les documents PDF

interface DocumentInfo {
  type: 'cours' | 'td' | 'corrections';
  chapterId: string;
  subject: string;
  filename: string;
  url: string;
}

/**
 * Génère automatiquement l'URL d'un document basé sur les paramètres
 */
export function getDocumentUrl(
  subject: string, 
  type: 'cours' | 'td' | 'corrections', 
  chapterId: string
): string {
  // Mapping des IDs de chapitres vers les numéros
  const chapterNumbers: Record<string, string> = {
    // Analyse
    'a1': '1', 'a2': '2', 'a3': '3', 'a4': '4', 'a5': '5',
    // Algèbre  
    'e1': '1', 'e2': '2', 'e3': '3', 'e4': '4', 'e5': '5',
    // Arithmétique
    'ar1': '1', 'ar2': '2', 'ar3': '3', 'ar4': '4',
    // Topologie
    't1': '1', 't2': '2', 't3': '3', 't4': '4',
    // Calcul
    'c1': '1', 'c2': '2', 'c3': '3', 'c4': '4'
  };

  const chapterNum = chapterNumbers[chapterId] || '1';
  
  // Construction automatique du nom de fichier
  const typeMap = {
    'cours': 'cours',
    'td': 'td', 
    'corrections': 'correction'
  };
  
  const filename = `chapitre-${chapterNum}-${typeMap[type]}.pdf`;
  
  return `/documents/${subject}/${type}/${filename}`;
}

/**
 * Vérifie si un document existe (à implémenter côté client)
 */
export async function checkDocumentExists(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Liste tous les documents d'un chapitre
 */
export function getChapterDocuments(subjectId: string, chapterId: string) {
  const types = ['cours', 'td', 'corrections'] as const;
  
  return types.map(type => ({
    type,
    label: type === 'cours' ? 'COURS' : 
           type === 'td' ? 'TD' : 'CORRECTIONS',
    url: getDocumentUrl(subjectId, type, chapterId),
    available: true // Par défaut, on considère que c'est disponible
  }));
}