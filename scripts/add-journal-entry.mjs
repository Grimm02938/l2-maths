import fs from 'node:fs';
import path from 'node:path';

const message = process.argv.slice(2).join(' ').trim();

if (!message) {
  console.error('❌ Message vide. Exemple : npm run journal -- "Aujourd’hui, j’ai repris le site proprement."');
  process.exit(1);
}

const root = process.cwd();
const journalPath = path.join(root, 'src', 'data', 'journal.ts');

function escapeForTs(value) {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$\{/g, '\\${');
}

let existing = [];
if (fs.existsSync(journalPath)) {
  const content = fs.readFileSync(journalPath, 'utf8');
  const match = content.match(/export const journalEntries = ([\s\S]*?) as const;/);
  if (match) {
    try {
      existing = JSON.parse(match[1]);
    } catch {
      existing = [];
    }
  }
}

const entry = {
  id: String(Date.now()),
  createdAt: new Date().toISOString(),
  text: message,
};

const next = [entry, ...existing];
const output = `export const journalEntries = ${JSON.stringify(next, null, 2)} as const;\n`;
fs.writeFileSync(journalPath, output);

console.log('✅ Entrée ajoutée au journal.');
console.log(`🕰️  ${entry.createdAt}`);
console.log(`✍️  ${message}`);
console.log('➡️  Lance ensuite : npm run build && firebase deploy --only hosting');
