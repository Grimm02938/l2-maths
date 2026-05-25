import { useParams, Link } from "react-router-dom";
import { getChapterResources, themes } from "@/lib/themes";
import { iconMap } from "@/lib/iconMap";
import {
  Archive,
  ArrowLeft,
  BookOpen,
  ChevronRight,
  ClipboardList,
  ExternalLink,
  FilePlus2,
  Lock,
  NotebookPen,
} from "lucide-react";
import type { Chapter, ChapterResource, ResourceType } from "@/lib/themes";
import type { ReactNode } from "react";
import { useState } from "react";

const resourceTypeConfig: Record<ResourceType, {
  label: string;
  icon: ReactNode;
}> = {
  cours: {
    label: "Cours",
    icon: <BookOpen className="h-3 w-3" />,
  },
  td: {
    label: "TD",
    icon: <ClipboardList className="h-3 w-3" />,
  },
  "corrige-perso": {
    label: "Corrige perso",
    icon: <NotebookPen className="h-3 w-3" />,
  },
  annale: {
    label: "Annale",
    icon: <Archive className="h-3 w-3" />,
  },
  complement: {
    label: "Complement",
    icon: <FilePlus2 className="h-3 w-3" />,
  },
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

function ChapterAction({
  resource,
}: {
  resource: ChapterResource;
}) {
  const config = resourceTypeConfig[resource.type];
  const isPrivate = resource.visibility === "private";
  const href = getResourceHref(resource);
  const content = (
    <>
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-sm bg-background/60 text-muted-foreground">
        {config.icon}
      </span>
      <span className="text-[11px] font-medium text-muted-foreground group-hover:text-foreground">
        {resource.title}
      </span>
      {isPrivate ? (
        <Lock className="h-2.5 w-2.5 shrink-0 text-muted-foreground" />
      ) : (
        <ExternalLink className="h-2.5 w-2.5 shrink-0 text-muted-foreground" />
      )}
    </>
  );

  if (!href) {
    return (
      <span
        aria-label={`${config.label} - ${resource.title}`}
        className="neo-button-shape inline-flex items-center gap-1.5 border border-border/60 bg-background/35 px-2 py-1.5 whitespace-nowrap opacity-70"
      >
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
      className="neo-button-shape group inline-flex items-center gap-1.5 border border-border/60 bg-background/35 px-2 py-1.5 transition-colors whitespace-nowrap hover:border-border hover:bg-background/60"
    >
      {content}
    </a>
  );
}

function ChapterRow({ chapter, index, color, border }: {
  chapter: Chapter;
  index: number;
  color: string;
  border: string;
}) {
  const [open, setOpen] = useState(false);

  if (!chapter.available) {
    return (
      <div className="neo-panel flex items-center justify-between px-5 py-4 bg-card border border-border opacity-50">
        <div className="flex items-center gap-3">
          <Lock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{chapter.title}</span>
        </div>
        <span className="text-xs text-muted-foreground border border-border rounded-full px-3 py-0.5">
          Bientôt
        </span>
      </div>
    );
  }

  const resources = getChapterResources(chapter);

  return (
    <div className={`neo-panel bg-card border ${open ? border : "border-border"} overflow-hidden transition-all`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-accent/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className={`text-sm font-mono ${color}`}>
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="text-sm font-medium text-foreground">{chapter.title}</span>
        </div>
        <ChevronRight className={`h-4 w-4 shrink-0 transition-transform duration-200 ${open ? "rotate-90" : ""} text-muted-foreground`} />
      </button>

      {open && (
        <div className="px-5 pb-4 pt-3 border-t border-border">
          {resources.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {resources.map((resource) => (
                <ChapterAction key={resource.id} resource={resource} />
              ))}
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
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
        <ArrowLeft className="h-4 w-4" />
        Toutes les matieres
      </Link>

      <div className="flex items-center gap-4 mb-8">
        {IconComponent && (
          <div className={`neo-icon flex h-12 w-12 items-center justify-center border ${theme.border} ${theme.color} bg-card`}>
            <IconComponent className="h-6 w-6" />
          </div>
        )}
        <div>
          <h1 className={`text-2xl font-semibold ${theme.color}`}>{theme.title}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{theme.description}</p>
        </div>
      </div>

      <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-3">Chapitres</p>
      <div className="space-y-2">
        {theme.chapters.map((chapter, i) => (
          <ChapterRow
            key={chapter.id}
            chapter={chapter}
            index={i}
            color={theme.color}
            border={theme.border}
          />
        ))}
      </div>
    </div>
  );
}
