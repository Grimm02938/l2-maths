import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const rarCandidates = [
  path.join(root, 'MPSI.rar'),
  path.join(root, 'mpsi.rar'),
  path.join(process.env.HOME ?? '', 'Téléchargements', 'MPSI.rar'),
  path.join(process.env.HOME ?? '', 'Downloads', 'MPSI.rar'),
].filter(Boolean);

const rarPath = rarCandidates.find((candidate) => fs.existsSync(candidate));

if (!rarPath) {
  console.error('❌ MPSI.rar introuvable. Place MPSI.rar à la racine du projet, puis relance : npm run install:mpsi');
  process.exit(1);
}

function findTool(candidates) {
  for (const candidate of candidates) {
    const result = spawnSync('bash', ['-lc', `command -v ${candidate}`], { encoding: 'utf8' });
    if (result.status === 0) return candidate;
  }
  return null;
}

const extractor = findTool(['unar', '7z', '7zz', '7za', 'unrar']);

if (!extractor) {
  console.error('❌ Aucun extracteur RAR trouvé. Installe unar puis relance : sudo apt install unar');
  process.exit(1);
}

const tmp = path.join(root, '.tmp-mpsi-rar');
fs.rmSync(tmp, { recursive: true, force: true });
fs.mkdirSync(tmp, { recursive: true });

console.log(`📦 Archive trouvée : ${rarPath}`);
console.log(`🔧 Extracteur utilisé : ${extractor}`);

let extraction;
if (extractor === 'unar') {
  extraction = spawnSync('unar', ['-q', '-f', '-o', tmp, rarPath], { stdio: 'inherit' });
} else if (extractor.startsWith('7z')) {
  extraction = spawnSync(extractor, ['x', '-y', `-o${tmp}`, rarPath], { stdio: 'inherit' });
} else {
  extraction = spawnSync('unrar', ['x', '-y', rarPath, tmp + path.sep], { stdio: 'inherit' });
}

if (extraction.status !== 0) {
  console.warn('⚠️  Extraction incomplète : le RAR semble abîmé ou tronqué. Je continue avec les fichiers récupérés.');
}

function walkDirs(dir) {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const dirs = [dir];
  for (const entry of entries) {
    if (entry.isDirectory()) dirs.push(...walkDirs(path.join(dir, entry.name)));
  }
  return dirs;
}

const mathSrc = walkDirs(tmp).find((dir) => path.basename(dir) === 'webMathematiques');

if (!mathSrc) {
  console.error('❌ Dossier webMathematiques introuvable dans le RAR. Rien n’a été copié.');
  process.exit(1);
}

const destination = path.join(root, 'public', 'archive', 'mpsi-mathematiques');
fs.rmSync(destination, { recursive: true, force: true });
fs.mkdirSync(destination, { recursive: true });

function copyPdfTree(srcDir, destDir) {
  let count = 0;
  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    const src = path.join(srcDir, entry.name);
    const dest = path.join(destDir, entry.name);
    if (entry.isDirectory()) {
      fs.mkdirSync(dest, { recursive: true });
      count += copyPdfTree(src, dest);
    } else if (/\.pdf$/i.test(entry.name)) {
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.copyFileSync(src, dest);
      count += 1;
    }
  }
  return count;
}

const copied = copyPdfTree(mathSrc, destination);

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

function cleanTitle(filePath) {
  const base = path.basename(filePath, path.extname(filePath));
  return base
    .replaceAll('_', ' ')
    .replaceAll('-', ' ')
    .replace(/\bcorr\b/i, 'corrigé')
    .replace(/\bappr\b/i, 'approfondissement')
    .replace(/\s+/g, ' ')
    .trim();
}

function classify(relativePath) {
  const base = path.basename(relativePath).toLowerCase();
  if (relativePath.startsWith('Chap/') || relativePath === 'poly_MPSI-Corot.pdf') return 'cours';
  if (relativePath.startsWith('TD/') || relativePath.startsWith('TD17b_Rev2') || relativePath.startsWith('TD21b_Rev3')) {
    if (base.includes('_corr')) return 'td-corriges';
    if (base.includes('_appr')) return 'td-approfondissement';
    return 'td';
  }
  if (relativePath.startsWith('DS/')) return base.includes('_corr') ? 'ds-corriges' : 'ds';
  if (relativePath.startsWith('DL/')) return base.includes('_corr') ? 'dm-dl-corriges' : 'dm-dl';
  if (relativePath.startsWith('ProgrammesColles/')) return 'colles';
  return 'complements';
}

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
];

const pdfFiles = walkFiles(destination)
  .filter((file) => file.toLowerCase().endsWith('.pdf'))
  .map((file) => path.relative(destination, file).replaceAll('\\', '/'))
  .sort((a, b) => a.localeCompare(b, 'fr', { numeric: true }));

const documents = pdfFiles.map((relativePath) => ({
  title: cleanTitle(relativePath),
  path: `/archive/mpsi-mathematiques/${relativePath}`,
  originalPath: relativePath,
  category: classify(relativePath),
}));

const grouped = categories.map((category) => ({
  ...category,
  documents: documents.filter((document) => document.category === category.id),
}));

const dataFile = path.join(root, 'src', 'data', 'mpsi-maths.ts');
const output = `export const mpsiMathsCategories = ${JSON.stringify(grouped, null, 2)} as const;\n\nexport const mpsiMathsDocumentCount = ${documents.length};\n`;
fs.writeFileSync(dataFile, output);

fs.rmSync(tmp, { recursive: true, force: true });

if (copied === 0) {
  console.error('❌ 0 PDF copié. Le RAR est probablement inutilisable ou le dossier webMathematiques ne contient pas de PDF récupérables.');
  process.exit(1);
}

console.log(`✅ ${copied} PDF copiés dans public/archive/mpsi-mathematiques/`);
console.log(`✅ Index régénéré avec ${documents.length} PDF réellement présents.`);
console.log('➡️  Lance maintenant : npm run build && firebase deploy --only hosting');
