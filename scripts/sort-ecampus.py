from pathlib import Path
import shutil
import re
import unicodedata
import csv

RAW = Path("private-ecampus/raw")
SORTED = Path("private-ecampus/sorted")

CATEGORIES = ["cours", "td", "annales", "corriges", "administratif", "autres"]

def strip_accents(s: str) -> str:
    return "".join(c for c in unicodedata.normalize("NFD", s) if unicodedata.category(c) != "Mn")

def clean_filename(name: str) -> str:
    name = name.replace(".pdf.pdf", ".pdf")
    stem = Path(name).stem
    ext = Path(name).suffix.lower() or ".pdf"
    stem = re.sub(r"^\d{3}-", "", stem)
    stem = stem.replace(" ", "_")
    stem = re.sub(r"_+", "_", stem).strip("_-.")
    return stem + ext

def classify(filename: str) -> str:
    name = strip_accents(filename.lower())

    if any(k in name for k in ["numero", "numerotation", "places", "session2", "session_2", "numexamen", "numsession", "conseils", "revision"]):
        return "administratif"

    if any(k in name for k in ["corrige", "correction", "_corr", "-corr", "corr_", "_cor", "-cor", "_c.", "-c.", "_c_", "-c_", "com"]):
        return "corriges"

    if any(k in name for k in ["cours", "poly", "ndc", "formulaire", "form", "chapitre", "notes", "methode", "projection", "symetrie", "traduction"]):
        return "cours"

    if any(k in name for k in ["examen", "exam", "partiel", "controle", "cc", "interrogation", "test", "projet_exam", "sujet", "p-1", "p-2", "p-3"]):
        return "annales"

    if any(k in name for k in ["td", "feuille", "faitalaseance", "probleme", "pbl", "exercices", "exemple", "i1", "i2", "i3", "i4", "template", "f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8", "f9", "f10"]):
        return "td"

    return "autres"

def unique_path(path: Path) -> Path:
    if not path.exists():
        return path
    i = 2
    while True:
        candidate = path.with_name(f"{path.stem}-{i}{path.suffix}")
        if not candidate.exists():
            return candidate
        i += 1

def main():
    if not RAW.exists():
        raise SystemExit("Dossier introuvable : private-ecampus/raw")

    if SORTED.exists():
        shutil.rmtree(SORTED)

    SORTED.mkdir(parents=True, exist_ok=True)

    rows = []
    total = 0
    counts = {}

    for subject_dir in sorted(RAW.iterdir()):
        if not subject_dir.is_dir():
            continue

        subject = subject_dir.name
        counts[subject] = {cat: 0 for cat in CATEGORIES}

        for cat in CATEGORIES:
            (SORTED / subject / cat).mkdir(parents=True, exist_ok=True)

        for file in sorted(subject_dir.iterdir()):
            if not file.is_file():
                continue

            category = classify(file.name)
            clean = clean_filename(file.name)
            dest = unique_path(SORTED / subject / category / clean)

            shutil.copy2(file, dest)

            counts[subject][category] += 1
            total += 1

            rows.append({
                "subject": subject,
                "category": category,
                "source": str(file),
                "destination": str(dest),
            })

    manifest = SORTED / "manifest.csv"
    with manifest.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["subject", "category", "source", "destination"])
        writer.writeheader()
        writer.writerows(rows)

    print(f"Tri terminé : {total} fichiers copiés.")
    print(f"Dossier propre : {SORTED}")
    print()
    print("Résumé :")
    for subject, data in counts.items():
        line = " | ".join(f"{cat}: {data[cat]}" for cat in CATEGORIES if data[cat])
        print(f"- {subject} : {line}")

if __name__ == "__main__":
    main()