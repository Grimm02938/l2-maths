import fs from "node:fs";

const path = "src/pages/l2/[slug].astro";

if (!fs.existsSync(path)) {
  console.error("❌ Fichier introuvable :", path);
  process.exit(1);
}

let s = fs.readFileSync(path, "utf8");

const aliasBlock = `const subjectAliases = {
  "analyse": {
    title: "Analyse",
    subtitle: "Cours, TD, évaluations et corrigés d’analyse.",
    semester: "L2",
    sourceSlugs: ["analyse-s1", "analyse-s2"],
  },
  "algebre-lineaire": {
    title: "Algèbre linéaire",
    subtitle: "Cours, TD, évaluations et corrigés d’algèbre linéaire.",
    semester: "L2",
    sourceSlugs: ["algebre-lineaire-s1", "algebre-lineaire-s2"],
  },
  "topologie": {
    title: "Topologie",
    subtitle: "Cours, TD, évaluations et corrigés de topologie.",
    semester: "S3",
    sourceSlugs: ["topologie-s1"],
  },
  "arithmetique": {
    title: "Arithmétique",
    subtitle: "Cours, TD, évaluations et corrigés d’arithmétique.",
    semester: "S3",
    sourceSlugs: ["arithmetique-s1"],
  },
  "probabilites": {
    title: "Probabilités",
    subtitle: "Cours, TD, évaluations et corrigés de probabilités.",
    semester: "S4",
    sourceSlugs: ["probabilites-s2"],
  },
  "courbes-surfaces": {
    title: "Courbes et surfaces",
    subtitle: "Cours, TD, évaluations et corrigés de courbes et surfaces.",
    semester: "S4",
    sourceSlugs: ["courbes-surfaces-s2"],
  },
  "maths-approfondies": {
    title: "Maths approfondies",
    subtitle: "Documents de mathématiques approfondies et graphes.",
    semester: "L2",
    sourceSlugs: ["maths-approfondies-s1", "maths-approfondies-s2"],
  },
};`;

if (!s.includes("const subjectAliases = {")) {
  const marker = "export function getStaticPaths()";
  const index = s.indexOf(marker);
  if (index === -1) {
    console.error("❌ Impossible de trouver getStaticPaths() dans", path);
    process.exit(1);
  }
  s = s.slice(0, index) + aliasBlock + "\n\n" + s.slice(index);
}

const start = s.indexOf("export function getStaticPaths()");
if (start === -1) {
  console.error("❌ Impossible de trouver getStaticPaths() dans", path);
  process.exit(1);
}

let braceStart = s.indexOf("{", start);
let depth = 0;
let end = -1;

for (let i = braceStart; i < s.length; i++) {
  if (s[i] === "{") depth++;
  if (s[i] === "}") depth--;
  if (depth === 0) {
    end = i + 1;
    break;
  }
}

if (end === -1) {
  console.error("❌ Impossible de remplacer getStaticPaths().");
  process.exit(1);
}

const newGetStaticPaths = `export function getStaticPaths() {
  const hiddenSectionsForPaths = new Set(contenuFinalL2.rules.hiddenSections);

  const visibleSubjects = new Set(
    contenuFinalL2.documents
      .filter((doc) => !doc.hidden && !hiddenSectionsForPaths.has(doc.section))
      .map((doc) => doc.subject)
  );

  const generatedPaths = Object.entries(contenuFinalL2.subjects)
    .filter(([slug]) => visibleSubjects.has(slug))
    .map(([slug, subject]) => ({
      params: { slug },
      props: {
        subject: {
          slug,
          title: subject.title,
          description: subject.subtitle,
          semester: subject.semester,
          sourceSlugs: [slug],
        },
      },
    }));

  const aliasPaths = Object.entries(subjectAliases)
    .filter(([, subject]) => subject.sourceSlugs.some((slug) => visibleSubjects.has(slug)))
    .map(([slug, subject]) => ({
      params: { slug },
      props: {
        subject: {
          slug,
          title: subject.title,
          description: subject.subtitle,
          semester: subject.semester,
          sourceSlugs: subject.sourceSlugs,
        },
      },
    }));

  return [...generatedPaths, ...aliasPaths];
}`;

s = s.slice(0, start) + newGetStaticPaths + s.slice(end);

const oldBlockRegex = /const subjectDocs = contenuFinalL2\.documents\.filter\(\s*\(doc\) => doc\.subject === subject\.slug && !doc\.hidden && !hiddenSections\.has\(doc\.section\)\s*\);/m;

const newSubjectDocs = `const sourceSlugs = subject.sourceSlugs ?? [subject.slug];

const subjectDocs = contenuFinalL2.documents.filter(
  (doc) => sourceSlugs.includes(doc.subject) && !doc.hidden && !hiddenSections.has(doc.section)
);`;

if (oldBlockRegex.test(s)) {
  s = s.replace(oldBlockRegex, newSubjectDocs);
} else if (!s.includes("const sourceSlugs = subject.sourceSlugs ?? [subject.slug];")) {
  console.error("❌ Je n’ai pas trouvé le bloc subjectDocs à remplacer.");
  console.error("   Envoie-moi : sed -n '1,120p' 'src/pages/l2/[slug].astro'");
  process.exit(1);
}

fs.writeFileSync(path, s);
console.log("✅ OK : les anciennes URLs matière fonctionnent maintenant.");
console.log("   /l2/algebre-lineaire/ → algèbre S1 + S2");
console.log("   /l2/probabilites/ → probabilités S2");
console.log("   /l2/maths-approfondies/ → maths approfondies S1 + S2");
