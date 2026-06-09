import fs from 'node:fs';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';

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

if (extractor === 'unar') {
  execFileSync('unar', ['-q', '-f', '-o', tmp, rarPath], { stdio: 'inherit' });
} else if (extractor.startsWith('7z')) {
  execFileSync(extractor, ['x', '-y', `-o${tmp}`, rarPath], { stdio: 'inherit' });
} else {
  execFileSync('unrar', ['x', '-y', rarPath, tmp + path.sep], { stdio: 'inherit' });
}

function walkDirs(dir) {
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
fs.rmSync(tmp, { recursive: true, force: true });

console.log(`✅ ${copied} PDF copiés dans public/archive/mpsi-mathematiques/`);
console.log('➡️  Lance maintenant : npm run deploy:hosting');
