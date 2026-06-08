from pathlib import Path
import shutil
import json

SRC = Path("private-ecampus/sorted")
PUBLIC = Path("public/ecampus")
OUT = Path("src/data/documents.generated.ts")

LABELS = {
    "cours": "Cours",
    "td": "TD",
    "annales": "Annales",
    "corriges": "Corrigés",
    "administratif": "Administratif",
}

MAP = {
    "analyse-s1": ("analyse", "S1"),
    "analyse-s2": ("analyse", "S2"),
    "algebre-lineaire-s1": ("algebre-lineaire", "S1"),
    "algebre-lineaire-s2": ("algebre-lineaire", "S2"),
    "topologie-s1": ("topologie", "S1"),
    "arithmetique-s1": ("arithmetique", "S1"),
    "probabilites-s2": ("probabilites", "S2"),
    "courbes-surfaces-s2": ("courbes-surfaces", "S2"),
    "maths-approfondies-s1": ("maths-approfondies", "S1"),
    "maths-approfondies-s2": ("maths-approfondies", "S2"),
}

if PUBLIC.exists():
    shutil.rmtree(PUBLIC)

PUBLIC.mkdir(parents=True, exist_ok=True)

docs = []

for folder, (subject, semester) in MAP.items():
    root = SRC / folder
    if not root.exists():
        continue

    for category_dir in sorted(root.iterdir()):
        if not category_dir.is_dir():
            continue

        category = category_dir.name
        target = PUBLIC / folder / category
        target.mkdir(parents=True, exist_ok=True)

        for file in sorted(category_dir.iterdir()):
            if not file.is_file():
                continue

            dest = target / file.name
            shutil.copy2(file, dest)

            docs.append({
                "subjectSlug": subject,
                "semester": semester,
                "category": category,
                "categoryLabel": LABELS.get(category, category),
                "title": file.stem.replace("_", " "),
                "href": "/" + str(dest.relative_to("public")),
            })

OUT.write_text(
    "export const generatedDocuments = "
    + json.dumps(docs, ensure_ascii=False, indent=2)
    + " as const;\n",
    encoding="utf-8",
)

print(f"{len(docs)} documents branchés.")
print(f"PDF copiés dans : {PUBLIC}")
print(f"Index généré : {OUT}")