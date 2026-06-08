import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getChapterResources, themes, type Chapter, type ChapterResource } from "@/lib/themes";

function GardenNav() {
  return (
    <nav className="garden-nav garden-frame">
      <Link to="/" className="garden-brand garden-link">Adame Abdelmoula · L2 Maths</Link>
      <div className="garden-menu">
        <Link className="garden-link" to="/">Archive</Link>
        <Link className="garden-link" to="/blog">Logbook</Link>
        <Link className="garden-link" to="/contact">Contact</Link>
      </div>
    </nav>
  );
}

function resourceLabel(resource: ChapterResource) {
  const labels: Record<string, string> = {
    cours: "Cours",
    td: "TD",
    "corrige-perso": "Corrigé perso",
    annale: "Annale",
    complement: "Complément",
  };
  return labels[resource.type] ?? resource.type;
}

function getResourceHref(resource: ChapterResource) {
  if (!resource.url || resource.visibility === "private") return null;
  if (resource.url.startsWith("/") && resource.url.toLowerCase().endsWith(".pdf")) {
    const src = encodeURIComponent(resource.url);
    const title = encodeURIComponent(resource.title);
    return `/document?src=${src}&title=${title}`;
  }
  return resource.url;
}

function ResourceSheet({ chapter, index }: { chapter: Chapter; index: number }) {
  const [open, setOpen] = useState(index === 0 && chapter.available);
  const resources = getChapterResources(chapter);

  return (
    <article className="resource-sheet">
      <button onClick={() => setOpen(!open)} className="subject-number" aria-expanded={open}>
        {String(index + 1).padStart(2, "0")}
      </button>
      <div>
        <button onClick={() => setOpen(!open)} className="w-full text-left">
          <p className="garden-kicker">{chapter.available ? `${resources.length} ressources` : "à cultiver"}</p>
          <h2 className="mt-2 font-serif text-3xl font-normal leading-none tracking-[-0.035em] sm:text-5xl">
            {chapter.title}
          </h2>
        </button>

        {open && (
          <div className="resource-links">
            {resources.length > 0 ? resources.map((resource) => {
              const href = getResourceHref(resource);
              const label = `${resourceLabel(resource)} · ${resource.title}`;
              if (!href) {
                return <span key={resource.id} className="resource-pill opacity-60">{label} · privé</span>;
              }
              return (
                <a key={resource.id} href={href} target="_blank" rel="noopener noreferrer" className="resource-pill">
                  {label} ↗
                </a>
              );
            }) : (
              <span className="resource-pill opacity-60">Ressources à ajouter</span>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

export default function SubjectPage() {
  const { id } = useParams<{ id: string }>();
  const theme = themes.find((t) => t.id === id);

  if (!theme) {
    return (
      <>
        <GardenNav />
        <main className="subject-page">
          <Link to="/" className="garden-link garden-kicker">← retour à l’archive</Link>
          <p className="mt-8 text-xl">Matière introuvable.</p>
        </main>
      </>
    );
  }

  const resources = theme.chapters.flatMap((chapter) => getChapterResources(chapter)).length;
  const available = theme.chapters.filter((chapter) => chapter.available).length;

  return (
    <>
      <GardenNav />
      <main className="subject-page">
        <Link to="/" className="garden-link garden-kicker">← retour à l’archive</Link>

        <header className="subject-header">
          <p className="garden-kicker">Module · {available}/{theme.chapters.length || 0} chapitres · {resources} ressources</p>
          <h1 className="subject-title mt-5">{theme.title}</h1>
          <p className="garden-subtitle">{theme.description}</p>
        </header>

        <section className="pt-8">
          {theme.chapters.map((chapter, index) => (
            <ResourceSheet key={chapter.id} chapter={chapter} index={index} />
          ))}
        </section>
      </main>
    </>
  );
}
