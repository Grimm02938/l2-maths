import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const archiveDir = path.join(root, 'public', 'archive');
const outputFile = path.join(root, 'src', 'data', 'generated-carnet.ts');

function walkFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walkFiles(full));
    else files.push(full);
  }
  return files;
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function readableCorpus(relativePath) {
  if (relativePath.startsWith('mpsi-mathematiques/')) return 'MPSI Mathématiques';
  if (relativePath.startsWith('l2/')) return 'Licence 2 Mathématiques';
  return 'Archive générale';
}

function readableSection(relativePath) {
  const parts = relativePath.split('/');

  if (relativePath.startsWith('mpsi-mathematiques/')) {
    const second = parts[1] ?? '';
    const fileName = parts.at(-1)?.toLowerCase() ?? '';
    if (second === 'Chap') return 'Cours';
    if (second === 'TD' && fileName.includes('_corr')) return 'Corrigés de TD';
    if (second === 'TD' && fileName.includes('_appr')) return 'TD d’approfondissement';
    if (second === 'TD') return 'TD';
    if (second === 'DS' && fileName.includes('_corr')) return 'Corrigés de DS';
    if (second === 'DS') return 'DS';
    if (second === 'DL' && fileName.includes('_corr')) return 'Corrigés de DM / DL';
    if (second === 'DL') return 'DM / DL';
    if (second === 'ProgrammesColles') return 'Programmes de colles';
    return 'Compléments';
  }

  const raw = parts[1] ?? 'Documents';
  return raw
    .replaceAll('-', ' ')
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function editorialTitle(corpus, section) {
  if (corpus === 'Archive générale') return `Classement de l’archive — ${section}`;
  return `${section} — ${corpus}`;
}

function editorialText(count, corpus, section) {
  const plural = count > 1 ? 'documents ont été intégrés' : 'document a été intégré';
  const zone = corpus === 'Archive générale' ? section : `${section.toLowerCase()} du corpus ${corpus}`;
  return `${count} ${plural} dans ${zone}. L’index a été reconstruit pour rendre cette partie plus lisible, plus stable et plus facile à retrouver.`;
}

const pdfs = walkFiles(archiveDir)
  .filter((file) => file.toLowerCase().endsWith('.pdf'))
  .map((file) => path.relative(archiveDir, file).replaceAll('\\', '/'))
  .sort((a, b) => a.localeCompare(b, 'fr', { numeric: true }));

const groups = new Map();
for (const pdf of pdfs) {
  const corpus = readableCorpus(pdf);
  const section = readableSection(pdf);
  const key = `${corpus}|||${section}`;
  if (!groups.has(key)) groups.set(key, { corpus, section, files: [] });
  groups.get(key).files.push(pdf);
}

const entries = [...groups.values()].map(({ corpus, section, files }) => ({
  date: today(),
  title: editorialTitle(corpus, section),
  text: editorialText(files.length, corpus, section),
  count: files.length,
  corpus,
  section,
}));

fs.mkdirSync(path.dirname(outputFile), { recursive: true });
fs.writeFileSync(
  outputFile,
  `export const generatedLogbook = ${JSON.stringify(entries, null, 2)} as const;\n`
);

console.log(`✅ Carnet automatique généré : ${entries.length} entrée(s), ${pdfs.length} PDF détectés.`);
