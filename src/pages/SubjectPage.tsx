import { useParams, Link } from "react-router-dom";
import { themes } from "@/lib/themes";
import { iconMap } from "@/lib/iconMap";
import { ArrowLeft, BookOpen, ChevronRight, ClipboardList, ClipboardCheck, ExternalLink, Lock } from "lucide-react";
import type { Chapter } from "@/lib/themes";
import { useState } from "react";

const actionToneMap: Record<string, { container: string; icon: string; text: string }> = {
  "text-blue-300": {
    container: "border-blue-300/20 bg-blue-300/5 hover:bg-blue-300/10",
    icon: "bg-blue-300/10 text-blue-300",
    text: "text-blue-200",
  },
  "text-emerald-300": {
    container: "border-emerald-300/20 bg-emerald-300/5 hover:bg-emerald-300/10",
    icon: "bg-emerald-300/10 text-emerald-300",
    text: "text-emerald-200",
  },
  "text-amber-300": {
    container: "border-amber-300/20 bg-amber-300/5 hover:bg-amber-300/10",
    icon: "bg-amber-300/10 text-amber-300",
    text: "text-amber-200",
  },
  "text-violet-300": {
    container: "border-violet-300/20 bg-violet-300/5 hover:bg-violet-300/10",
    icon: "bg-violet-300/10 text-violet-300",
    text: "text-violet-200",
  },
  "text-pink-300": {
    container: "border-pink-300/20 bg-pink-300/5 hover:bg-pink-300/10",
    icon: "bg-pink-300/10 text-pink-300",
    text: "text-pink-200",
  },
  "text-teal-300": {
    container: "border-teal-300/20 bg-teal-300/5 hover:bg-teal-300/10",
    icon: "bg-teal-300/10 text-teal-300",
    text: "text-teal-200",
  },
  "text-orange-300": {
    container: "border-orange-300/20 bg-orange-300/5 hover:bg-orange-300/10",
    icon: "bg-orange-300/10 text-orange-300",
    text: "text-orange-200",
  },
};

function ChapterAction({
  href,
  label,
  color,
  icon,
}: {
  href: string;
  label: string;
  color: string;
  icon: React.ReactNode;
}) {
  const tone = actionToneMap[color] ?? {
    container: "border-border bg-accent/20 hover:bg-accent/30",
    icon: "bg-accent text-foreground",
    text: "text-foreground",
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1.5 transition-colors whitespace-nowrap ${tone.container}`}
    >
      <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-sm ${tone.icon}`}>
        {icon}
      </span>
      <span className={`text-[11px] font-medium ${tone.text}`}>{label}</span>
      <ExternalLink className="h-2.5 w-2.5 shrink-0 text-muted-foreground" />
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
      <div className="flex items-center justify-between px-5 py-4 rounded-lg bg-card border border-border opacity-50">
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

  return (
    <div className={`rounded-lg bg-card border ${open ? border : "border-border"} overflow-hidden transition-all`}>
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
          <div className="flex flex-wrap gap-1.5">
            {chapter.cours && (
              <ChapterAction
                href={chapter.cours}
                label="Cours"
                color={color}
                icon={<BookOpen className="h-3 w-3" />}
              />
            )}
            {chapter.td && (
              <ChapterAction
                href={chapter.td}
                label="TD"
                color={color}
                icon={<ClipboardList className="h-3 w-3" />}
              />
            )}
            {chapter.tdCorrection && (
              <ChapterAction
                href={chapter.tdCorrection}
                label="Corrigé"
                color={color}
                icon={<ClipboardCheck className="h-3 w-3" />}
              />
            )}
          </div>
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
  const availableCount = theme.chapters.filter((c) => c.available).length;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
        <ArrowLeft className="h-4 w-4" />
        Toutes les matieres
      </Link>

      <div className="flex items-center gap-4 mb-8">
        {IconComponent && (
          <div className={`p-3 rounded-xl border ${theme.border} ${theme.color} bg-card`}>
            <IconComponent className="h-6 w-6" />
          </div>
        )}
        <div>
          <h1 className={`text-2xl font-semibold ${theme.color}`}>{theme.title}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{theme.description}</p>
        </div>
      </div>

      <div className="flex gap-2 mb-8">
        <span className="text-xs border border-border text-muted-foreground rounded-full px-3 py-1">
          {availableCount} / {theme.chapters.length} chapitres
        </span>
        {theme.semesters.map((s) => (
          <span key={s} className="text-xs border border-border text-muted-foreground rounded-full px-3 py-1">
            {s.toUpperCase()}
          </span>
        ))}
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
