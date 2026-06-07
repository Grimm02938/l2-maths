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
  Sparkles,
} from "lucide-react";
import type { Chapter, ChapterResource, ResourceType } from "@/lib/themes";
import type { ReactNode } from "react";
import { useState } from "react";

const resourceTypeConfig: Record<ResourceType, { label: string; icon: ReactNode }> = {
  cours: { label: "Cours", icon: <BookOpen className="h-3.5 w-3.5" /> },
  td: { label: "TD", icon: <ClipboardList className="h-3.5 w-3.5" /> },
  "corrige-perso": { label: "Corrige perso", icon: <NotebookPen className="h-3.5 w-3.5" /> },
  annale: { label: "Annale", icon: <Archive className="h-3.5 w-3.5" /> },
  complement: { label: "Complement", icon: <FilePlus2 className="h-3.5 w-3.5" /> },
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
  const content = (
    <>
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-background/70 text-primary">
        {config.icon}
      </span>
      <span className="min-w-0 flex-1 truncate text-xs font-semibold text-foreground">{resource.title}</span>
      {isPrivate ? (
        <Lock className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
      ) : (
        <ExternalLink className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
      )}
    </>
  );

  if (!href) {
    return (
      <span className="inline-flex min-w-[11rem] items-center gap-2 rounded-2xl border border-border/60 bg-background/35 px-3 py-2 opacity-70">
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
      className="group inline-flex min-w-[11rem] items-center gap-2 rounded-2xl border border-border/60 bg-background/35 px-3 py-2 transition hover:border-primary/40 hover:bg-primary/10"
    >
      {content}
    </a>
  );
}

function ChapterRow({ chapter, index, color, border }: { chapter: Chapter; index: number; color: string; border: string }) {
  const [open, setOpen] = useState(index === 0 && chapter.available);
  const resources = getChapterResources(chapter);

  if (!chapter.available) {
    return (
      <div className="rounded-[1.35rem] border border-border/60 bg-card/40 p-4 opacity-60">
        <div className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-background/55 text-muted-foreground">
              <Lock className="h-4 w-4" />
            </div>
            <span className="truncate text-sm text-muted-foreground">{chapter.title}</span>
          </div>
          <span className="rounded-full border border-border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
            Bientot
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`archive-card rounded-[1.35rem] ${open ? border : "border-border/70"}`}>
      <button onClick={() => setOpen(!open)} className="relative z-10 flex w-full items-center justify-between gap-4 p-4 text-left">
        <div className="flex min-w-0 items-center gap-3">
          <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-background/60 font-mono text-xs font-bold ${color}`}>
            {String(index + 1).padStart(2, "0")}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">{chapter.title}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{resources.length} ressource{resources.length > 1 ? "s" : ""}</p>
          </div>
        </div>
        <ChevronRight className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${open ? "rotate-90" : ""}`} />
      </button>

      {open && (
        <div className="relative z-10 border-t border-border/60 px-4 pb-4 pt-4">
          {resources.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {resources.map((resource) => <ChapterAction key={resource.id} resource={resource} />)}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">Ressources a ajouter.</p>
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
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Retour
        </Link>
      </div>
    );
  }

  const IconComponent = iconMap[theme.icon];
  const available = theme.chapters.filter((chapter) => chapter.available).length;
  const totalResources = theme.chapters.flatMap((chapter) => getChapterResources(chapter)).length;

  return (
    <div className="mx-auto max-w-5xl py-8 sm:py-12">
      <Link to="/" className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/45 px-4 py-2 text-sm text-muted-foreground transition hover:border-primary/35 hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Toutes les matieres
      </Link>

      <section className="glass-panel rounded-[2rem] p-6 sm:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-4">
            {IconComponent && (
              <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-3xl border ${theme.border} ${theme.color} bg-background/55`}>
                <IconComponent className="h-7 w-7" />
              </div>
            )}
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.24em] text-primary">Module archive</p>
              <h1 className={`text-4xl font-black tracking-tight ${theme.color}`}>{theme.title}</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">{theme.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:min-w-64">
            <div className="rounded-2xl border border-border/70 bg-background/45 p-4">
              <CheckCircle2 className="mb-3 h-4 w-4 text-primary" />
              <p className="text-2xl font-black text-foreground">{available}<span className="text-sm text-muted-foreground">/{theme.chapters.length}</span></p>
              <p className="text-xs text-muted-foreground">chapitres ouverts</p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-background/45 p-4">
              <Sparkles className="mb-3 h-4 w-4 text-primary" />
              <p className="text-2xl font-black text-foreground">{totalResources}</p>
              <p className="text-xs text-muted-foreground">ressources</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-muted-foreground">Chapitres</p>
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            ouvrir <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </div>
        <div className="space-y-3">
          {theme.chapters.map((chapter, i) => (
            <ChapterRow key={chapter.id} chapter={chapter} index={i} color={theme.color} border={theme.border} />
          ))}
        </div>
      </section>
    </div>
  );
}
