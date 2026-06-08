import { useParams, Link } from "react-router-dom";
import { getChapterResources, themes } from "@/lib/themes";
import { iconMap } from "@/lib/iconMap";
import {
  Archive,
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  ExternalLink,
  FilePlus2,
  Lock,
  NotebookPen,
  Sprout,
} from "lucide-react";
import type { Chapter, ChapterResource, ResourceType } from "@/lib/themes";
import type { ReactNode } from "react";
import { useState } from "react";

const resourceTypeConfig: Record<ResourceType, { label: string; icon: ReactNode }> = {
  cours: { label: "Cours", icon: <BookOpen className="h-3.5 w-3.5" /> },
  td: { label: "TD", icon: <ClipboardList className="h-3.5 w-3.5" /> },
  "corrige-perso": { label: "Corrigé perso", icon: <NotebookPen className="h-3.5 w-3.5" /> },
  annale: { label: "Annale", icon: <Archive className="h-3.5 w-3.5" /> },
  complement: { label: "Complément", icon: <FilePlus2 className="h-3.5 w-3.5" /> },
};

const subjectAccents: Record<string, { text: string; bg: string; border: string }> = {
  analyse: { text: "text-[hsl(var(--analysis))]", bg: "bg-[hsl(var(--analysis))]", border: "border-[hsl(var(--analysis)/0.45)]" },
  algebre: { text: "text-[hsl(var(--algebra))]", bg: "bg-[hsl(var(--algebra))]", border: "border-[hsl(var(--algebra)/0.45)]" },
  topologie: { text: "text-[hsl(var(--topology))]", bg: "bg-[hsl(var(--topology))]", border: "border-[hsl(var(--topology)/0.45)]" },
  arithmetique: { text: "text-[hsl(var(--arithmetic))]", bg: "bg-[hsl(var(--arithmetic))]", border: "border-[hsl(var(--arithmetic)/0.45)]" },
  proba: { text: "text-[hsl(var(--probability))]", bg: "bg-[hsl(var(--probability))]", border: "border-[hsl(var(--probability)/0.45)]" },
  "maths-renfo": { text: "text-[hsl(var(--renfo))]", bg: "bg-[hsl(var(--renfo))]", border: "border-[hsl(var(--renfo)/0.45)]" },
  "devoirs-libres": { text: "text-[hsl(var(--annales))]", bg: "bg-[hsl(var(--annales))]", border: "border-[hsl(var(--annales)/0.45)]" },
};

function getResourceHref(resource: ChapterResource) {
  if (!resource.url || resource.visibility === "private") return null;

  if (resource.url.startsWith("/") && resource.url.toLowerCase().endsWith(".pdf")) {
    const src = encodeURIComponent(resource.url);
    const title = encodeURIComponent(resource.title);
    return `/document?src=${src}&title=${title}`;
  }

  return resource.url;
}

function ChapterAction({ resource }: { resource: ChapterResource }) {
  const config = resourceTypeConfig[resource.type];
  const isPrivate = resource.visibility === "private";
  const href = getResourceHref(resource);
  const sourceLabel = resource.source === "personnel" ? "note perso" : resource.source === "ecampus" ? "eCampus" : "archive";

  const content = (
    <>
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-background/60 text-primary">
        {config.icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate font-ui text-sm font-semibold text-foreground">{resource.title}</span>
        <span className="mt-0.5 block font-ui text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{config.label} · {sourceLabel}</span>
      </span>
      {isPrivate ? (
        <Lock className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
      ) : (
        <ExternalLink className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
      )}
    </>
  );

  if (!href) {
    return (
      <span className="inline-flex min-w-[16rem] flex-1 items-center gap-3 rounded-2xl border border-border bg-muted/45 px-3 py-3 opacity-75">
        {content}
      </span>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${config.label} - ${resource.title}`}
      className="group inline-flex min-w-[16rem] flex-1 items-center gap-3 rounded-2xl border border-border bg-card/70 px-3 py-3 transition hover:border-foreground/35 hover:bg-background/50"
    >
      {content}
    </a>
  );
}

function ChapterRow({ chapter, index, accent }: { chapter: Chapter; index: number; accent: { text: string; bg: string; border: string } }) {
  const [open, setOpen] = useState(index === 0 && chapter.available);
  const resources = getChapterResources(chapter);

  if (!chapter.available) {
    return (
      <div className="rounded-[1.2rem] border border-border bg-card/45 p-4 opacity-70">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-background/60 text-muted-foreground">
              <Lock className="h-4 w-4" />
            </div>
            <span className="truncate font-ui text-sm text-muted-foreground">{chapter.title}</span>
          </div>
          <span className="rounded-full border border-border px-3 py-1 font-ui text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
            Bientôt
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`archive-card rounded-[1.2rem] ${open ? accent.border : "border-border"}`}>
      <button onClick={() => setOpen(!open)} className="relative z-10 flex w-full items-center justify-between gap-4 p-4 text-left">
        <div className="flex min-w-0 items-center gap-3">
          <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-background/60 font-ui text-xs font-bold ${accent.text}`}>
            {String(index + 1).padStart(2, "0")}
          </span>
          <div className="min-w-0">
            <p className="truncate font-display text-xl font-semibold text-foreground">{chapter.title}</p>
            <p className="mt-0.5 font-ui text-xs text-muted-foreground">{resources.length} ressource{resources.length > 1 ? "s" : ""}</p>
          </div>
        </div>
        <ChevronRight className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${open ? "rotate-90" : ""}`} />
      </button>

      {open && (
        <div className="relative z-10 border-t border-border px-4 pb-4 pt-4">
          {resources.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {resources.map((resource) => <ChapterAction key={resource.id} resource={resource} />)}
            </div>
          ) : (
            <p className="font-ui text-xs text-muted-foreground">Ressources à ajouter.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default function SubjectPage() {
  const { id } = useParams<{ id: string }>();
  const theme = themes.find((t) => t.id === id);

  if (!theme) {
    return (
      <div className="py-20 text-center text-muted-foreground">
        <Link to="/" className="archive-link inline-flex items-center gap-1.5 font-ui text-sm hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Retour
        </Link>
      </div>
    );
  }

  const IconComponent = iconMap[theme.icon];
  const accent = subjectAccents[theme.id] ?? { text: theme.color, bg: "bg-primary", border: theme.border };
  const available = theme.chapters.filter((chapter) => chapter.available).length;
  const totalResources = theme.chapters.flatMap((chapter) => getChapterResources(chapter)).length;

  return (
    <div className="mx-auto max-w-6xl py-8 sm:py-12">
      <Link to="/" className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-2 font-ui text-sm text-muted-foreground transition hover:border-foreground/35 hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Toutes les matières
      </Link>

      <section className="paper-panel rounded-[2rem] p-6 sm:p-8 lg:p-10">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <div className="flex items-start gap-4">
            {IconComponent && (
              <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full border bg-background/55 ${accent.border} ${accent.text}`}>
                <IconComponent className="h-6 w-6" />
              </div>
            )}
            <div>
              <p className="font-ui text-[11px] font-bold uppercase tracking-[0.28em] text-primary">Module archive</p>
              <h1 className="mt-3 font-display text-5xl font-semibold leading-none tracking-tight text-foreground sm:text-6xl">{theme.title}</h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground">{theme.description}</p>
            </div>
          </div>

          <aside className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-border bg-background/45 p-4">
              <CheckCircle2 className="mb-3 h-4 w-4 text-primary" />
              <p className="font-ui text-2xl font-black text-foreground">{available}<span className="text-sm text-muted-foreground">/{theme.chapters.length}</span></p>
              <p className="font-ui text-xs text-muted-foreground">chapitres ouverts</p>
            </div>
            <div className="rounded-2xl border border-border bg-background/45 p-4">
              <Sprout className="mb-3 h-4 w-4 text-primary" />
              <p className="font-ui text-2xl font-black text-foreground">{totalResources}</p>
              <p className="font-ui text-xs text-muted-foreground">ressources</p>
            </div>
          </aside>
        </div>
      </section>

      <section className="mt-8 grid gap-8 lg:grid-cols-[16rem_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-[1.35rem] border border-border bg-card/60 p-5">
            <p className="font-ui text-[10px] font-bold uppercase tracking-[0.24em] text-muted-foreground">Table locale</p>
            <div className="mt-4 space-y-2">
              {theme.chapters.map((chapter, index) => (
                <div key={chapter.id} className="flex gap-2 font-ui text-xs text-muted-foreground">
                  <span className={accent.text}>{String(index + 1).padStart(2, "0")}</span>
                  <span className="line-clamp-1">{chapter.title}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <div>
          <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
            <p className="font-ui text-xs font-bold uppercase tracking-[0.24em] text-muted-foreground">Chapitres</p>
            <span className="inline-flex items-center gap-1.5 font-ui text-xs text-muted-foreground">
              ouvrir <ArrowUpRight className="h-3.5 w-3.5" />
            </span>
          </div>
          <div className="space-y-3">
            {theme.chapters.map((chapter, i) => (
              <ChapterRow key={chapter.id} chapter={chapter} index={i} accent={accent} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
