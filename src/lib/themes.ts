
export type ResourceType = 'cours' | 'td' | 'corrige-perso' | 'annale' | 'complement';
export type ResourceVisibility = 'public' | 'private';
export type ResourceSource = 'site' | 'ecampus' | 'personnel';

export interface ChapterResource {
  id: string;
  type: ResourceType;
  title: string;
  url?: string;
  visibility: ResourceVisibility;
  source?: ResourceSource;
}

export interface Chapter {
  id: string;
  title: string;
  available: boolean;
  resources?: ChapterResource[];
  cours?: string;
  td?: string;
  tdCorrection?: string;
}

export interface Theme {
  id: string;
  title: string;
  description: string;
  color: string;
  border: string;
  icon: string;
  semesters: string[];
  chapters: Chapter[];
}

const legacyResourceLabels: Record<string, { type: ResourceType; title: string; source: ResourceSource }> = {
  cours: { type: 'cours', title: 'Cours', source: 'site' },
  td: { type: 'td', title: 'TD', source: 'site' },
  tdCorrection: { type: 'corrige-perso', title: 'Corrige', source: 'personnel' },
};

export function getChapterResources(chapter: Chapter): ChapterResource[] {
  if (chapter.resources?.length) return chapter.resources;

  return (['cours', 'td', 'tdCorrection'] as const).flatMap((key) => {
    const url = chapter[key];
    if (!url) return [];

    const label = legacyResourceLabels[key];
    return [{
      id: `${chapter.id}-${key}`,
      type: label.type,
      title: label.title,
      url,
      visibility: 'public' as const,
      source: label.source,
    }];
  });
}

export const themes: Theme[] = [
  {
    id: 'analyse',
    title: 'Analyse',
    description: "Cours d'analyse, séries, intégrales et équations différentielles.",
    color: 'text-blue-300',
    border: 'border-blue-300/35',
    icon: 'SquareFunction',
    semesters: ['s1', 's2'],
    chapters: [
      {
        id: 'a1',
        title: 'Suites et Séries Numériques',
        available: true,
        resources: [
          {
            id: 'a1-cours',
            type: 'cours',
            title: 'Cours',
            url: '/documents/analyse/a1_cours.pdf',
            visibility: 'public',
            source: 'site',
          },
          {
            id: 'a1-td',
            type: 'td',
            title: 'TD',
            url: '/documents/analyse/a1_td.pdf',
            visibility: 'public',
            source: 'site',
          },
          {
            id: 'a1-corrige-perso',
            type: 'corrige-perso',
            title: 'Corrige personnel',
            url: '/documents/analyse/a1_td_corr.pdf',
            visibility: 'public',
            source: 'personnel',
          },
        ],
      },
      {
        id: 'a2',
        title: 'Séries de Fonctions',
        available: true,
        resources: [
          {
            id: 'a2-cours',
            type: 'cours',
            title: 'Cours',
            url: '/documents/analyse/a2_cours.pdf',
            visibility: 'public',
            source: 'site',
          },
          {
            id: 'a2-td',
            type: 'td',
            title: 'TD import eCampus',
            visibility: 'private',
            source: 'ecampus',
          },
          {
            id: 'a2-corrige-perso',
            type: 'corrige-perso',
            title: 'Corrige personnel',
            url: '/documents/analyse/a2_td_corr.pdf',
            visibility: 'public',
            source: 'personnel',
          },
        ],
      },
    ],
  },
  {
    id: 'algebre',
    title: 'Algèbre Linéaire',
    description: "Espaces vectoriels, applications linéaires, réductions d'endomorphismes.",
    color: 'text-emerald-300',
    border: 'border-emerald-300/35',
    icon: 'Sigma',
    semesters: ['s1', 's2'],
    chapters: [
      {
        id: 'al1',
        title: 'Espaces Vectoriels et Applications Linéaires',
        available: true,
        resources: [
          {
            id: 'al1-cours',
            type: 'cours',
            title: 'Cours',
            url: '/documents/algebre/al1_cours.pdf',
            visibility: 'public',
            source: 'site',
          },
          {
            id: 'al1-td',
            type: 'td',
            title: 'TD',
            url: '/documents/algebre/al1_td.pdf',
            visibility: 'public',
            source: 'site',
          },
          {
            id: 'al1-corrige-perso',
            type: 'corrige-perso',
            title: 'Corrige personnel',
            url: '/documents/algebre/al1_td_corr.pdf',
            visibility: 'public',
            source: 'personnel',
          },
        ],
      },
      {
        id: 'al2',
        title: 'Matrices et Déterminants',
        available: false,
      },
    ],
  },
  {
    id: 'topologie',
    title: 'Topologie',
    description: "Poly de Girand et TD associés aux 4 chapitres du cours.",
    color: 'text-amber-300',
    border: 'border-amber-300/35',
    icon: 'Orbit',
    semesters: ['s1', 's2'],
    chapters: [
      {
        id: 'topologie-i',
        title: 'Chapitre I — Cadre d’étude et définitions',
        available: true,
        resources: [
          {
            id: 'topologie-i-cours',
            type: 'cours',
            title: 'Poly Girand',
            url: '/documents/topologie/s2/poly-girand.pdf',
            visibility: 'public',
            source: 'site',
          },
          {
            id: 'topologie-i-td',
            type: 'td',
            title: 'TD 1',
            url: '/documents/topologie/s2/td1.pdf',
            visibility: 'public',
            source: 'site',
          },
        ],
      },
      {
        id: 'topologie-ii',
        title: 'Chapitre II — Étude locale et asymptotique',
        available: true,
        resources: [
          {
            id: 'topologie-ii-cours',
            type: 'cours',
            title: 'Poly Girand',
            url: '/documents/topologie/s2/poly-girand.pdf',
            visibility: 'public',
            source: 'site',
          },
          {
            id: 'topologie-ii-td',
            type: 'td',
            title: 'TD 2',
            url: '/documents/topologie/s2/td2.pdf',
            visibility: 'public',
            source: 'site',
          },
        ],
      },
      {
        id: 'topologie-iii',
        title: 'Chapitre III — Tracé d’une courbe paramétrée',
        available: true,
        resources: [
          {
            id: 'topologie-iii-cours',
            type: 'cours',
            title: 'Poly Girand',
            url: '/documents/topologie/s2/poly-girand.pdf',
            visibility: 'public',
            source: 'site',
          },
          {
            id: 'topologie-iii-td',
            type: 'td',
            title: 'TD 3',
            url: '/documents/topologie/s2/td3.pdf',
            visibility: 'public',
            source: 'site',
          },
        ],
      },
      {
        id: 'topologie-iv',
        title: 'Chapitre IV — Étude métrique des courbes',
        available: true,
        resources: [
          {
            id: 'topologie-iv-cours',
            type: 'cours',
            title: 'Poly Girand',
            url: '/documents/topologie/s2/poly-girand.pdf',
            visibility: 'public',
            source: 'site',
          },
          {
            id: 'topologie-iv-td',
            type: 'td',
            title: 'TD 4',
            url: '/documents/topologie/s2/td4.pdf',
            visibility: 'public',
            source: 'site',
          },
        ],
      },
    ],
  },
  {
    id: 'arithmetique',
    title: 'Arithmétique',
    description: "Nombres premiers, congruences, et anneaux Z/nZ.",
    color: 'text-violet-300',
    border: 'border-violet-300/35',
    icon: 'Divide',
    semesters: ['s1'],
    chapters: [
      { id: 'ar1', title: 'Division Euclidienne et PGCD', available: false },
      { id: 'ar2', title: 'Congruences', available: false },
    ],
  },
  {
    id: 'proba',
    title: 'Probabilités',
    description: "Variables aléatoires, lois de probabilité, et théorèmes limites.",
    color: 'text-pink-300',
    border: 'border-pink-300/35',
    icon: 'Percent',
    semesters: ['s2'],
    chapters: [
      { id: 'p1', title: 'Espaces Probabilisés', available: false },
      { id: 'p2', title: 'Variables Aléatoires', available: false },
    ],
  },
  {
    id: 'maths-renfo',
    title: 'Maths Renfo',
    description: 'Renforcement en mathématiques.',
    color: 'text-teal-300',
    border: 'border-teal-300/35',
    icon: 'Calculator',
    semesters: ['s1', 's2'],
    chapters: [
      { id: 'mr1', title: 'Continuité et Dérivabilité', available: false },
    ],
  },
  {
    id: 'devoirs-libres',
    title: 'Devoirs Libres',
    description: 'Sujets et corrections de devoirs libres.',
    color: 'text-orange-300',
    border: 'border-orange-300/35',
    icon: 'BookOpen',
    semesters: ['s1', 's2'],
    chapters: [],
  },
];
