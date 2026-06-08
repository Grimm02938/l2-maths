import { readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = 'public/ecampus';

const labels = {
  cours: 'Cours',
  td: 'TD',
  annales: 'Annale',
  corriges: 'Corrigé',
  administratif: 'Administratif',
  autres: 'Autre',
};

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    if (!entry.name.toLowerCase().endsWith('.pdf')) return [];
    return [full];
  });
}

const files = walk(root).map((path) => {
  const href = '/' + path.replace(/^public\//, '').replaceAll('\\', '/');
  const parts = href.split('/');
  const subject = parts[2];
  const category = parts[3];
  const filename = parts.at(-1);

  return {
    subject,
    category,
    kind: labels[category] ?? 'Document',
    title: decodeURIComponent(filename.replace(/\.pdf$/i, '').replaceAll('_', ' ')),
    href,
  };
});

files.sort((a, b) =>
  a.subject.localeCompare(b.subject) ||
  a.category.localeCompare(b.category) ||
  a.title.localeCompare(b.title)
);

writeFileSync(
  'src/data/ecampus.generated.ts',
  `export const ecampusDocuments = ${JSON.stringify(files, null, 2)} as const;\n`
);

console.log(`Generated ${files.length} documents`);
