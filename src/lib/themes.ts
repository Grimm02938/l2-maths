
export interface Chapter {
  id: string;
  title: string;
  available: boolean;
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
        cours: '/documents/analyse/a1_cours.pdf',
        td: '/documents/analyse/a1_td.pdf',
        tdCorrection: '/documents/analyse/a1_td_corr.pdf',
      },
      {
        id: 'a2',
        title: 'Séries de Fonctions',
        available: true,
        cours: '/documents/analyse/a2_cours.pdf',
        td: 'https://drive.google.com/drive/folders/1QmUf7OxAv5rzbuBnHkBuq0XDF6qGmFeK',
        tdCorrection: '/documents/analyse/a2_td_corr.pdf',
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
        cours: '/documents/algebre/al1_cours.pdf',
        td: '/documents/algebre/al1_td.pdf',
        tdCorrection: '/documents/algebre/al1_td_corr.pdf',
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
    description: "Espaces topologiques, connexité, compacité et espaces métriques.",
    color: 'text-amber-300',
    border: 'border-amber-300/35',
    icon: 'Orbit',
    semesters: ['s1', 's2'],
    chapters: [
      { id: 't1', title: 'Espaces Topologiques', available: false },
      { id: 't2', title: 'Continuité et Homéomorphismes', available: false },
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
