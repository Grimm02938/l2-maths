const mpsiFiles = [
  "Chap/CH00.pdf", "Chap/CH01.pdf", "Chap/CH02.pdf", "Chap/CH03.pdf", "Chap/CH04.pdf", "Chap/CH05.pdf", "Chap/CH06.pdf", "Chap/CH07.pdf", "Chap/CH08.pdf", "Chap/CH09.pdf",
  "Chap/CH10.pdf", "Chap/CH11.pdf", "Chap/CH12.pdf", "Chap/CH13.pdf", "Chap/CH14.pdf", "Chap/CH15.pdf", "Chap/CH16.pdf", "Chap/CH17.pdf", "Chap/CH18.pdf", "Chap/CH19.pdf",
  "Chap/CH20.pdf", "Chap/CH21.pdf", "Chap/CH22.pdf", "Chap/CH23.pdf", "Chap/CH24.pdf", "Chap/CH25.pdf", "Chap/CH26.pdf", "Chap/CH27.pdf", "Chap/CH28.pdf",
  "DL/DL01.pdf", "DL/DL01_corr.pdf", "DL/DL02.pdf", "DL/DL03.pdf", "DL/DL03_corr.pdf", "DL/DL04.pdf", "DL/DL04_corr.pdf", "DL/DL05.pdf", "DL/DL05_corr.pdf", "DL/DL06.pdf", "DL/DL06_corr.pdf", "DL/DL07.pdf", "DL/DL07_corr.pdf", "DL/DL08.pdf", "DL/DL08_corr.pdf", "DL/DL09.pdf", "DL/DL09_corr.pdf", "DL/DL10.pdf", "DL/DL11.pdf", "DL/DL11_corr.pdf", "DL/DL12.pdf", "DL/DL12_corr.pdf", "DL/DL13.pdf", "DL/DL13_corr.pdf", "DL/DL14.pdf", "DL/DL14_corr.pdf",
  "DS/DS01.pdf", "DS/DS01_corr.pdf", "DS/DS02.pdf", "DS/DS02_corr.pdf", "DS/DS03.pdf", "DS/DS03_corr.pdf", "DS/DS04.pdf", "DS/DS04_corr.pdf", "DS/DS05.pdf", "DS/DS05_corr.pdf", "DS/DS06.pdf", "DS/DS06_corr.pdf", "DS/DS07.pdf", "DS/DS07_corr.pdf", "DS/DS08.pdf", "DS/DS08_corr.pdf", "DS/DS09.pdf", "DS/DS09_corr.pdf", "DS/DS10.pdf", "DS/DS10_corr.pdf", "DS/DS11.pdf", "DS/DS11_corr.pdf", "DS/DS12.pdf", "DS/DS12_corr.pdf", "DS/DS13.pdf", "DS/DS13_corr.pdf", "DS/DS13b.pdf", "DS/DS13b_corr.pdf",
  "ProgrammesColles/prog01.pdf", "ProgrammesColles/prog02.pdf", "ProgrammesColles/prog03.pdf", "ProgrammesColles/prog04.pdf", "ProgrammesColles/prog05.pdf", "ProgrammesColles/prog06.pdf", "ProgrammesColles/prog07.pdf", "ProgrammesColles/prog08.pdf", "ProgrammesColles/prog09.pdf", "ProgrammesColles/prog10.pdf", "ProgrammesColles/prog11.pdf", "ProgrammesColles/prog12.pdf", "ProgrammesColles/prog13.pdf", "ProgrammesColles/prog14.pdf", "ProgrammesColles/prog15.pdf", "ProgrammesColles/prog16.pdf", "ProgrammesColles/prog17.pdf", "ProgrammesColles/prog18.pdf", "ProgrammesColles/prog19.pdf", "ProgrammesColles/prog20.pdf", "ProgrammesColles/prog21.pdf", "ProgrammesColles/prog22.pdf", "ProgrammesColles/prog23.pdf", "ProgrammesColles/prog24.pdf", "ProgrammesColles/prog25.pdf", "ProgrammesColles/prog26.pdf", "ProgrammesColles/prog27.pdf", "ProgrammesColles/prog28.pdf", "ProgrammesColles/prog29.pdf", "ProgrammesColles/prog30.pdf",
  "TD/TD00/TD00.pdf", "TD/TD01/TD01.pdf", "TD/TD01/TD01_corr.pdf", "TD/TD02/TD02.pdf", "TD/TD02/TD02_corr.pdf", "TD/TD03/TD03.pdf", "TD/TD03/TD03_appr.pdf", "TD/TD03/TD03_corr.pdf", "TD/TD04/TD04.pdf", "TD/TD04/TD04_appr.pdf", "TD/TD04/TD04_corr.pdf", "TD/TD05/TD05.pdf", "TD/TD05/TD05_appr.pdf", "TD/TD05/TD05_corr.pdf", "TD/TD06/TD06.pdf", "TD/TD06/TD06_appr.pdf", "TD/TD06/TD06_corr.pdf", "TD/TD07/TD07.pdf", "TD/TD07/TD07_appr.pdf", "TD/TD07/TD07_corr.pdf", "TD/TD08/TD08.pdf", "TD/TD08/TD08_corr.pdf", "TD/TD09/TD09.pdf", "TD/TD09/TD09_appr.pdf", "TD/TD09/TD09_corr.pdf", "TD/TD10/TD10.pdf", "TD/TD10/TD10_appr.pdf", "TD/TD10/TD10_corr.pdf", "TD/TD11/TD11.pdf", "TD/TD11/TD11_appr.pdf", "TD/TD11/TD11_corr.pdf", "TD/TD12/TD12.pdf", "TD/TD12/TD12_appr.pdf", "TD/TD12/TD12_corr.pdf", "TD/TD13/TD13.pdf", "TD/TD13/TD13_appr.pdf", "TD/TD13/TD13_corr.pdf", "TD/TD14/TD14.pdf", "TD/TD14/TD14_appr.pdf", "TD/TD14/TD14_corr.pdf", "TD/TD15/TD15.pdf", "TD/TD15/TD15_appr.pdf", "TD/TD15/TD15_corr.pdf", "TD/TD16/TD16.pdf", "TD/TD16/TD16_appr.pdf", "TD/TD16/TD16_corr.pdf", "TD/TD17/TD17.pdf", "TD/TD17/TD17_appr.pdf", "TD/TD17/TD17_corr.pdf", "TD/TD18/TD18.pdf", "TD/TD18/TD18_corr.pdf", "TD/TD19/TD19.pdf", "TD/TD19/TD19_corr.pdf", "TD/TD20/TD20.pdf", "TD/TD20/TD20_corr.pdf", "TD/TD21/TD21.pdf", "TD/TD21/TD21_corr.pdf", "TD/TD22/TD22.pdf", "TD/TD22/TD22_corr.pdf", "TD/TD23/TD23.pdf", "TD/TD23/TD23_corr.pdf", "TD/TD24/TD24.pdf", "TD/TD24/TD24_corr.pdf", "TD/TD25/TD25.pdf", "TD/TD25/TD25_corr.pdf", "TD/TD26/TD26.pdf", "TD/TD26/TD26_corr.pdf", "TD/TD27/TD27.pdf", "TD/TD27/TD27_corr.pdf", "TD/TD28/TD28.pdf", "TD/TD28/TD28_corr.pdf", "TD17b_Rev2.pdf", "TD21b_Rev3.pdf",
  "alphabet_grec.pdf", "index-notations.pdf", "poly_MPSI-Corot.pdf", "prog_MPSI.pdf"
] as const;

const categories = [
  { id: 'cours', title: 'Cours', description: 'Chapitres, polycopié et documents de cours.' },
  { id: 'td', title: 'TD', description: 'Feuilles de travaux dirigés.' },
  { id: 'td-approfondissement', title: 'TD approfondissement', description: 'Feuilles complémentaires et approfondissements.' },
  { id: 'td-corriges', title: 'Corrigés de TD', description: 'Corrections des feuilles de TD.' },
  { id: 'ds', title: 'DS', description: 'Devoirs surveillés.' },
  { id: 'ds-corriges', title: 'Corrigés de DS', description: 'Corrections des devoirs surveillés.' },
  { id: 'dm-dl', title: 'DM / DL', description: 'Devoirs maison et devoirs libres.' },
  { id: 'dm-dl-corriges', title: 'Corrigés DM / DL', description: 'Corrections des devoirs maison et devoirs libres.' },
  { id: 'colles', title: 'Colles', description: 'Programmes de colles.' },
  { id: 'complements', title: 'Compléments', description: 'Notations, alphabet grec et documents généraux.' },
] as const;

function cleanTitle(filePath: string) {
  const base = filePath.split('/').pop()?.replace(/\.pdf$/i, '') ?? filePath;
  return base
    .replaceAll('_', ' ')
    .replaceAll('-', ' ')
    .replace(/\bcorr\b/i, 'corrigé')
    .replace(/\bappr\b/i, 'approfondissement')
    .replace(/\s+/g, ' ')
    .trim();
}

function classify(filePath: string) {
  const base = filePath.split('/').pop()?.toLowerCase() ?? '';

  if (filePath.startsWith('Chap/') || filePath === 'poly_MPSI-Corot.pdf') return 'cours';
  if (filePath.startsWith('TD/') || filePath.startsWith('TD17b_Rev2') || filePath.startsWith('TD21b_Rev3')) {
    if (base.includes('_corr')) return 'td-corriges';
    if (base.includes('_appr')) return 'td-approfondissement';
    return 'td';
  }
  if (filePath.startsWith('DS/')) return base.includes('_corr') ? 'ds-corriges' : 'ds';
  if (filePath.startsWith('DL/')) return base.includes('_corr') ? 'dm-dl-corriges' : 'dm-dl';
  if (filePath.startsWith('ProgrammesColles/')) return 'colles';
  return 'complements';
}

const documents = mpsiFiles.map((filePath) => ({
  title: cleanTitle(filePath),
  path: `/archive/mpsi-mathematiques/${filePath}`,
  originalPath: filePath,
  category: classify(filePath),
}));

export const mpsiMathsCategories = categories.map((category) => ({
  ...category,
  documents: documents.filter((document) => document.category === category.id),
}));

export const mpsiMathsDocumentCount = documents.length;
