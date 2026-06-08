import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";

const START_URL = process.env.ECAMPUS_URL || process.argv[2];

if (!START_URL) {
  console.error('Usage : ECAMPUS_URL="https://..." node scripts/ecampus-download.mjs');
  process.exit(1);
}

const OUT_DIR = path.resolve("private-ecampus/files");
const PROFILE_DIR = path.resolve(".ecampus-browser");

await fs.mkdir(OUT_DIR, { recursive: true });

const context = await chromium.launchPersistentContext(PROFILE_DIR, {
  headless: false,
  acceptDownloads: true,
});

const page = await context.newPage();

console.log("Ouverture eCampus...");
await page.goto(START_URL, { waitUntil: "domcontentloaded", timeout: 60000 });

console.log("");
console.log("Va sur la page exacte du cours où tu vois les documents.");
console.log("Puis reviens ici et appuie sur Entrée.");
console.log("");

process.stdin.resume();
await new Promise((resolve) => process.stdin.once("data", resolve));

function cleanName(text) {
  return (text || "document")
    .replace(/[<>:"/\\|?*]+/g, "_")
    .replace(/\s+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 100) || "document";
}

function extFromHeaders(url, contentType) {
  const lower = url.toLowerCase();
  if (lower.includes(".pdf")) return ".pdf";
  if (lower.includes(".docx")) return ".docx";
  if (lower.includes(".pptx")) return ".pptx";
  if (lower.includes(".xlsx")) return ".xlsx";
  if (lower.includes(".zip")) return ".zip";

  const t = contentType.toLowerCase();
  if (t.includes("pdf")) return ".pdf";
  if (t.includes("word")) return ".docx";
  if (t.includes("presentation") || t.includes("powerpoint")) return ".pptx";
  if (t.includes("spreadsheet") || t.includes("excel")) return ".xlsx";
  if (t.includes("zip")) return ".zip";
  return ".bin";
}

async function saveFile(url, label, index) {
  const response = await page.request.get(url, { timeout: 60000, maxRedirects: 8 });
  const body = await response.body();
  const contentType = response.headers()["content-type"] || "";

  if (body.length < 500) return false;
  if (contentType.includes("text/html")) return false;

  const ext = extFromHeaders(response.url(), contentType);
  const filename = `${String(index).padStart(3, "0")}-${cleanName(label)}${ext}`;
  const filePath = path.join(OUT_DIR, filename);

  await fs.writeFile(filePath, body);
  console.log("✓", filename);
  return true;
}

const firstLinks = await page.$$eval("a[href]", (anchors) =>
  anchors.map((a) => ({
    href: a.href,
    text: (a.textContent || "").trim(),
  }))
);

const resourcePages = firstLinks.filter((link) => {
  const href = link.href.toLowerCase();
  return (
    href.includes("/mod/resource/view.php") ||
    href.includes("/mod/folder/view.php") ||
    href.includes("pluginfile.php") ||
    href.endsWith(".pdf") ||
    href.endsWith(".docx") ||
    href.endsWith(".pptx") ||
    href.endsWith(".zip")
  );
});

console.log(`Pages/ressources trouvées : ${resourcePages.length}`);

let count = 0;
const seen = new Set();

for (const resource of resourcePages) {
  try {
    if (seen.has(resource.href)) continue;
    seen.add(resource.href);

    if (resource.href.includes("pluginfile.php")) {
      const ok = await saveFile(resource.href, resource.text, count + 1);
      if (ok) count++;
      continue;
    }

    await page.goto(resource.href, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForTimeout(600);

    const fileLinks = await page.$$eval("a[href]", (anchors) =>
      anchors.map((a) => ({
        href: a.href,
        text: (a.textContent || "").trim(),
      }))
    );

    const pluginLinks = fileLinks.filter((link) =>
      link.href.toLowerCase().includes("pluginfile.php")
    );

    for (const file of pluginLinks) {
      if (seen.has(file.href)) continue;
      seen.add(file.href);

      const ok = await saveFile(file.href, file.text || resource.text, count + 1);
      if (ok) count++;
    }
  } catch (error) {
    console.log("× échec :", resource.text || resource.href);
  }
}

console.log("");
console.log(`Terminé : ${count} vrai(s) fichier(s) dans private-ecampus/files/`);
console.log("Tu peux fermer Chromium.");

await context.close();