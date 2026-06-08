import { existsSync, mkdirSync, copyFileSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';

const projectRoot = process.cwd();
const manifestPath = join(projectRoot, 'src/data/contenu-final-l2.json');

if (!existsSync(manifestPath)) {
  console.error('❌ Manifest introuvable : src/data/contenu-final-l2.json');
  console.error('Copie d’abord contenu-final-l2.json dans src/data/.');
  process.exit(1);
}

const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
const hiddenSections = new Set(manifest.rules.hiddenSections ?? []);

function normalizeCandidates(originalPath) {
  const paths = [];
  const add = (p) => { if (p && !paths.includes(p)) paths.push(p); };

  add(join(projectRoot, originalPath));
  add(join(projectRoot, 'public', originalPath));
  add(join(projectRoot, 'private-sources', originalPath));
  add(join(projectRoot, 'private-sources', 'extracted', originalPath));

  // eCampus est souvent déjà dans public/ecampus sur ton projet,
  // alors que le manifest vient d’un zip extrait en ecampus/ecampus/...
  if (originalPath.startsWith('ecampus/ecampus/')) {
    const shortened = originalPath.replace(/^ecampus\/ecampus\//, 'ecampus/');
    add(join(projectRoot, 'public', shortened));
    add(join(projectRoot, 'private-sources', shortened));
    add(join(projectRoot, 'private-sources', 'extracted', shortened));
  }

  return paths;
}

const visibleDocs = manifest.documents.filter((doc) => !doc.hidden && !hiddenSections.has(doc.section));
const copied = [];
const missing = [];

for (const doc of visibleDocs) {
  const candidates = normalizeCandidates(doc.originalPath);
  const source = candidates.find((p) => existsSync(p));

  if (!source) {
    missing.push({
      subject: doc.subject,
      section: doc.section,
      title: doc.displayTitle,
      originalPath: doc.originalPath,
      tried: candidates,
    });
    continue;
  }

  const target = join(projectRoot, 'public', doc.finalPath);
  mkdirSync(dirname(target), { recursive: true });
  copyFileSync(source, target);
  copied.push({ from: source, to: target });
}

mkdirSync(join(projectRoot, 'reports'), { recursive: true });
writeFileSync(join(projectRoot, 'reports', 'missing-final-content.json'), JSON.stringify(missing, null, 2));
writeFileSync(join(projectRoot, 'reports', 'copied-final-content.json'), JSON.stringify(copied, null, 2));

console.log(`✅ Documents copiés : ${copied.length}/${visibleDocs.length}`);
console.log(`📁 Destination : public/archive/`);

if (missing.length > 0) {
  console.log(`⚠️ Documents manquants : ${missing.length}`);
  console.log(`Voir : reports/missing-final-content.json`);
  process.exitCode = 1;
} else {
  console.log('🎉 Tous les documents visibles sont installés.');
}
