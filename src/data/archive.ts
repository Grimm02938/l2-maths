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

export const subjects: Subject[] = [
  {
    slug: 'analyse',
    code: 'L2-AN',
    title: 'Analyse',
    semester: 'Annuel',
    professor: 'Professeur à renseigner',
    status: 'chantier',
    description: 'Suites, series, integrales, fonctions, estimations. La matiere ou chaque detail finit par couter des points.',
    chapters: [
      {
        title: 'Suites et series',
        status: 'a reprendre',
        resources: [
          { kind: 'Cours', title: 'Cours complet', href: '/pdf/analyse/cours.pdf' },
          { kind: 'TD', title: 'Feuille de TD', href: '/pdf/analyse/td.pdf' },
          { kind: 'Corrige perso', title: 'Corrections en reconstruction' },
          { kind: 'Note', title: 'Erreurs de convergence' },
        ],
      },
      {
        title: 'Integrales et convergence',
        status: 'a creer',
        resources: [
          { kind: 'TD', title: 'Feuille a ajouter' },
          { kind: 'Annale', title: 'Sujets a classer' },
        ],
      },
    ],
  },
  {
    slug: 'algebre-lineaire',
    code: 'L2-AL',
    title: 'Algebre lineaire',
    semester: 'Annuel',
    professor: 'Professeur à renseigner',
    status: 'archive',
    description: 'Espaces vectoriels, applications lineaires, matrices, reduction. Le socle a rendre parfaitement propre.',
    chapters: [
      {
        title: 'Espaces vectoriels et applications lineaires',
        status: 'ouvert',
        resources: [
          { kind: 'Cours', title: 'Poly de cours', href: '/pdf/algebre-lineaire/cours.pdf' },
          { kind: 'TD', title: 'TD 1-3', href: '/pdf/algebre-lineaire/td.pdf' },
          { kind: 'Corrige perso', title: 'Base, noyau, image' },
        ],
      },
      {
        title: 'Reduction',
        status: 'a reprendre',
        resources: [
          { kind: 'TD', title: 'Exercices reduction' },
          { kind: 'Note', title: 'Diagonalisation : criteres utiles' },
        ],
      },
    ],
  },
  {
    slug: 'topologie',
    code: 'L2-TO',
    title: 'Topologie',
    semester: 'S1',
    professor: 'Professeur à renseigner',
    status: 'chantier',
    description: 'Ouverts, fermes, compacite, connexite. Une matiere a organiser par definitions, exemples, contre-exemples.',
    chapters: [
      {
        title: 'Ouverts, fermes, adherences',
        status: 'a reprendre',
        resources: [
          { kind: 'Cours', title: 'Definitions a recopier proprement' },
          { kind: 'TD', title: 'Feuille de TD', href: '/pdf/topologie/td.pdf' },
          { kind: 'Note', title: 'Exemples et contre-exemples' },
        ],
      },
      {
        title: 'Compacite',
        status: 'a creer',
        resources: [
          { kind: 'Annale', title: 'Exercices classiques a indexer' },
        ],
      },
    ],
  },
  {
    slug: 'arithmetique',
    code: 'L2-AR',
    title: 'Arithmetique',
    semester: 'S1',
    professor: 'Professeur à renseigner',
    status: 'archive',
    description: 'Congruences, groupes cycliques, nombres premiers, anneaux quotients. Un terrain parfait pour des fiches seches.',
    chapters: [
      {
        title: 'Congruences et divisibilite',
        status: 'ouvert',
        resources: [
          { kind: 'Cours', title: 'Cours annote' },
          { kind: 'TD', title: 'Feuille exercices' },
          { kind: 'Corrige perso', title: 'Euclide, Bezout, Gauss' },
        ],
      },
    ],
  },
  {
    slug: 'probabilites',
    code: 'L2-PR',
    title: 'Probabilites',
    semester: 'S2',
    professor: 'Professeur à renseigner',
    status: 'chantier',
    description: 'Variables aleatoires, lois, esperance, variance, convergence. Le cours doit devenir calculable et intuitif.',
    chapters: [
      {
        title: 'Variables aleatoires discretes',
        status: 'ouvert',
        resources: [
          { kind: 'Cours', title: 'Cours a classer' },
          { kind: 'TD', title: 'TD variables aleatoires', href: '/pdf/probabilites/td.pdf' },
          { kind: 'Corrige perso', title: 'Esperance et variance' },
        ],
      },
      {
        title: 'Convergences',
        status: 'a reprendre',
        resources: [
          { kind: 'Note', title: 'Distinguer presque sure, proba, loi' },
        ],
      },
    ],
  },
  {
    slug: 'courbes-surfaces',
    code: 'L2-CS',
    title: 'Courbes et surfaces',
    semester: 'S2',
    professor: 'Professeur à renseigner',
    status: 'chantier',
    description: 'Courbes parametrees, surfaces, geometrie differentielle elementaire. Le pont entre calcul, intuition et formes.',
    chapters: [
      {
        title: 'Courbes parametrees',
        status: 'a creer',
        resources: [
          { kind: 'Cours', title: 'Cours a ajouter' },
          { kind: 'TD', title: 'Feuille de TD a ajouter' },
        ],
      },
      {
        title: 'Surfaces',
        status: 'a creer',
        resources: [
          { kind: 'Note', title: 'Definitions et exemples a construire' },
        ],
      },
    ],
  },
  {
    slug: 'maths-approfondies',
    code: 'L2-MA',
    title: 'Maths approfondies',
    semester: 'Annuel',
    professor: 'Professeur à renseigner',
    status: 'chantier',
    description: 'Exercices plus longs, methodes transversales, problemes a refaire. Le bloc qui sert de passerelle vers le magistere.',
    chapters: [
      {
        title: 'Methodes et problemes',
        status: 'a reprendre',
        resources: [
          { kind: 'TD', title: 'Problemes a classer' },
          { kind: 'Note', title: 'Methodes de demonstration' },
        ],
      },
    ],
  },
];

export const logbook = [
  {
    date: '2026-06-08',
    title: 'Repartir sobrement',
    text: 'Le site doit d abord etre utile : retrouver un PDF, savoir ce qui est corrige, voir ce qui reste en dette.',
  },
  {
    date: '2026-06-08',
    title: 'Pas un portfolio',
    text: 'La valeur vient de l archive elle-meme : cours, TD, annales, corrections, notes de methode.',
  },
  {
    date: '2026-06-08',
    title: 'Magistere ensuite',
    text: 'La L2 sert de socle. Chaque chapitre propre maintenant devient un appui pour la suite.',
  },
];

export const externalSeeds = [
  {
    label: 'Pages perso de profs',
    text: 'enseignement, TD, PDF, corrections, archives par annee',
  },
  {
    label: 'Vieux index universitaires',
    text: 'liens bleus, dossiers, titres secs, peu de decoration',
  },
  {
    label: 'Carnets mathematiques',
    text: 'notes courtes, erreurs, methodes, questions a reprendre',
  },
];
