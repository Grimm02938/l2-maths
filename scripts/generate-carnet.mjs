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
  return 'Archive';
}

function readableSection(relativePath) {
  const parts = relativePath.split('/');
  if (relativePath.startsWith('mpsi-mathematiques/')) {
    const second = parts[1] ?? '';
    if (second === 'Chap') return 'Cours';
    if (second === 'TD') return 'TD';
    if (second === 'DS') return 'DS';
    if (second === 'DL') return 'DM / DL';
    if (second === 'ProgrammesColles') return 'Colles';
    return 'Compléments';
  }
  return parts[1] ?? 'Documents';
}

const pdfs = walkFiles(archiveDir)
  .filter((file) => file.toLowerCase().endsWith('.pdf'))
  .map((file) => path.relative(archiveDir, file).replaceAll('\\', '/'))
  .sort((a, b) => a.localeCompare(b, 'fr', { numeric: true }));

const groups = new Map();
for (const pdf of pdfs) {
  const key = `${readableCorpus(pdf)} — ${readableSection(pdf)}`;
  if (!groups.has(key)) groups.set(key, []);
  groups.get(key).push(pdf);
}

const entries = [...groups.entries()].map(([key, files]) => ({
  date: today(),
  title: `Index automatique — ${key}`,
  text: `${files.length} PDF détecté(s) dans public/archive. Dernier scan local avant build.`,
  count: files.length,
}));

fs.mkdirSync(path.dirname(outputFile), { recursive: true });
fs.writeFileSync(
  outputFile,
  `export const generatedLogbook = ${JSON.stringify(entries, null, 2)} as const;\n`
);

console.log(`✅ Carnet automatique généré : ${entries.length} entrée(s), ${pdfs.length} PDF détectés.`);
