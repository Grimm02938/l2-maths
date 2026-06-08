export type ResourceKind = 'Cours' | 'TD' | 'Corrige perso' | 'Annale' | 'Note' | 'Source';

export type Resource = {
  kind: ResourceKind;
  title: string;
  href?: string;
  note?: string;
};

export type Chapter = {
  title: string;
  status: 'ouvert' | 'a reprendre' | 'a creer';
  resources: Resource[];
};

export type Subject = {
  slug: string;
  code: string;
  title: string;
  semester: 'S1' | 'S2' | 'Annuel';
  professor: string;
  description: string;
  status: 'archive' | 'chantier' | 'bientot';
  chapters: Chapter[];
};

const commonChapters = (title: string): Chapter[] => [
  {
    title,
    status: 'a reprendre',
    resources: [
      { kind: 'Cours', title: 'Cours' },
      { kind: 'TD', title: 'TD' },
      { kind: 'Annale', title: 'Annales et évaluations' },
    ],
  },
];

export const subjects: Subject[] = [
  {
    slug: 'analyse-s1',
    code: 'L2-AN-S1',
    title: 'Analyse S1',
    semester: 'S1',
    professor: 'Christophe Pallard',
    status: 'chantier',
    description: 'Suites, séries, intégrales, fonctions, estimations. La matière où chaque détail finit par coûter des points.',
    chapters: commonChapters('Analyse S1'),
  },
  {
    slug: 'algebre-lineaire',
    code: 'L2-AL-S1',
    title: 'Algèbre linéaire',
    semester: 'S1',
    professor: 'Frédéric Menous',
    status: 'archive',
    description: 'Espaces vectoriels, applications linéaires, matrices, réduction. Le socle à rendre parfaitement propre.',
    chapters: commonChapters('Algèbre linéaire S1'),
  },
  {
    slug: 'topologie',
    code: 'L2-TO-S1',
    title: 'Topologie',
    semester: 'S1',
    professor: 'Frédéric Haglund',
    status: 'chantier',
    description: 'Ouverts, fermés, compacité, connexité. Une matière à organiser par définitions, exemples, contre-exemples.',
    chapters: commonChapters('Topologie S1'),
  },
  {
    slug: 'arithmetique',
    code: 'L2-AR-S1',
    title: 'Arithmétique',
    semester: 'S1',
    professor: 'Rachid Fahlaoui',
    status: 'archive',
    description: 'Congruences, groupes cycliques, nombres premiers, anneaux quotients. Un terrain parfait pour des fiches sèches.',
    chapters: commonChapters('Arithmétique S1'),
  },
  {
    slug: 'maths-approfondies-s1',
    code: 'L2-MA-S1',
    title: 'Maths approfondies',
    semester: 'S1',
    professor: 'Frédéric Haglund',
    status: 'chantier',
    description: 'Exercices plus longs, méthodes transversales, problèmes à refaire. Le bloc qui sert à consolider les liens entre les matières.',
    chapters: commonChapters('Maths approfondies S1'),
  },
  {
    slug: 'analyse-s2',
    code: 'L2-AN-S2',
    title: 'Analyse S2',
    semester: 'S2',
    professor: 'Professeur à renseigner',
    status: 'chantier',
    description: 'Suites et séries de fonctions, convergence, intégrales et outils d’analyse du semestre 4.',
    chapters: commonChapters('Analyse S2'),
  },
  {
    slug: 'algebre-lineaire-s2',
    code: 'L2-AL-S2',
    title: 'Algèbre linéaire',
    semester: 'S2',
    professor: 'Frédéric Menous',
    status: 'archive',
    description: 'Produit scalaire, orthogonalité, isométries et géométrie affine.',
    chapters: commonChapters('Algèbre linéaire S2'),
  },
  {
    slug: 'probabilites',
    code: 'L2-PR-S2',
    title: 'Probabilités',
    semester: 'S2',
    professor: 'Julie Fournier',
    status: 'chantier',
    description: 'Variables aléatoires, lois, espérance, variance, convergence. Le cours doit devenir calculable et intuitif.',
    chapters: commonChapters('Probabilités S2'),
  },
  {
    slug: 'courbes-surfaces',
    code: 'L2-CS-S2',
    title: 'Courbes et surfaces',
    semester: 'S2',
    professor: 'Arnaud Girand',
    status: 'chantier',
    description: 'Courbes paramétrées, surfaces, géométrie différentielle élémentaire. Le pont entre calcul, intuition et formes.',
    chapters: commonChapters('Courbes et surfaces S2'),
  },
];

export const logbook = [
  {
    date: '2026-06-08',
    title: 'Ajout documents — Analyse S1',
    text: '41 fichiers ajoutés depuis eCampus.',
  },
  {
    date: '2026-06-08',
    title: 'Ajout documents — Algèbre linéaire S1',
    text: '34 fichiers ajoutés depuis eCampus.',
  },
  {
    date: '2026-06-08',
    title: 'Ajout documents — Topologie S1',
    text: '36 fichiers ajoutés depuis eCampus.',
  },
  {
    date: '2026-06-08',
    title: 'Ajout documents — Arithmétique S1',
    text: '14 fichiers ajoutés depuis eCampus.',
  },
  {
    date: '2026-06-08',
    title: 'Ajout documents — Maths approfondies S1',
    text: '30 fichiers ajoutés depuis eCampus.',
  },
  {
    date: '2026-06-08',
    title: 'Ajout documents — Analyse S2',
    text: '42 fichiers ajoutés depuis eCampus.',
  },
  {
    date: '2026-06-08',
    title: 'Ajout documents — Algèbre linéaire S2',
    text: '23 fichiers ajoutés depuis eCampus.',
  },
  {
    date: '2026-06-08',
    title: 'Ajout documents — Probabilités S2',
    text: '26 fichiers ajoutés depuis eCampus.',
  },
  {
    date: '2026-06-08',
    title: 'Ajout documents — Courbes et surfaces S2',
    text: '7 fichiers ajoutés depuis eCampus.',
  },
];

export const externalSeeds = [
  {
    label: 'Pages perso de profs',
    text: 'enseignement, TD, PDF, corrections, archives par année',
  },
  {
    label: 'Vieux index universitaires',
    text: 'liens bleus, dossiers, titres secs, peu de décoration',
  },
  {
    label: 'Carnets mathématiques',
    text: 'notes courtes, erreurs, méthodes, questions à reprendre',
  },
];