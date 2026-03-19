import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { BookOpen, ClipboardList, ClipboardCheck, ExternalLink } from "lucide-react";
import type { Chapter } from "@/lib/themes";

interface ChapterAccordionProps {
  chapters: Chapter[];
  accentColor: string;
}

interface PdfLinkProps {
  href: string;
  label: string;
  icon: React.ReactNode;
}

function PdfLink({ href, label, icon }: PdfLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 hover:underline transition-colors"
    >
      {icon}
      {label}
      <ExternalLink className="h-3 w-3 opacity-60" />
    </a>
  );
}

const borderAccentMap: Record<string, string> = {
  blue: "border-l-blue-400",
  emerald: "border-l-emerald-400",
  amber: "border-l-amber-400",
  violet: "border-l-violet-400",
  pink: "border-l-pink-400",
  teal: "border-l-teal-400",
  orange: "border-l-orange-400",
};

const textAccentMap: Record<string, string> = {
  blue: "text-blue-300",
  emerald: "text-emerald-300",
  amber: "text-amber-300",
  violet: "text-violet-300",
  pink: "text-pink-300",
  teal: "text-teal-300",
  orange: "text-orange-300",
};

export function ChapterAccordion({ chapters, accentColor }: ChapterAccordionProps) {
  const borderClass = borderAccentMap[accentColor] ?? "border-l-zinc-500";
  const textClass = textAccentMap[accentColor] ?? "text-zinc-300";

  if (chapters.length === 0) {
    return (
      <p className="text-sm text-muted-foreground italic py-8 text-center">
        Aucun chapitre pour l'instant.
      </p>
    );
  }

  return (
    <Accordion type="multiple" className="space-y-2">
      {chapters.map((chapter) => {
        const isAvailable = chapter.available;

        return (
          <AccordionItem
            key={chapter.id}
            value={chapter.id}
            disabled={!isAvailable}
            className={`
              border border-zinc-700/60 rounded-lg overflow-hidden
              bg-zinc-800/40
              ${isAvailable ? "hover:bg-zinc-800/60" : "opacity-60 cursor-not-allowed"}
            `}
          >
            <AccordionTrigger
              className={`
                px-4 py-3.5 hover:no-underline
                border-l-4 ${borderClass}
                [&>svg]:shrink-0
                ${!isAvailable ? "pointer-events-none" : ""}
              `}
            >
              <div className="flex items-center gap-3 text-left flex-1 min-w-0">
                <span className={`shrink-0 ${textClass}`}>
                  <BookOpen className="h-4 w-4" />
                </span>
                <span className="text-sm font-medium text-foreground truncate">
                  {chapter.title}
                </span>
                {!isAvailable && (
                  <Badge
                    variant="secondary"
                    className="ml-2 shrink-0 text-xs bg-zinc-700 text-zinc-400 border-zinc-600"
                  >
                    Bientot disponible
                  </Badge>
                )}
              </div>
            </AccordionTrigger>

            {isAvailable && (
              <AccordionContent className="px-4 pb-4 pt-1">
                <div className="flex flex-wrap gap-4 pl-7">
                  {chapter.cours && (
                    <PdfLink
                      href={chapter.cours}
                      label="Cours"
                      icon={<BookOpen className="h-3.5 w-3.5" />}
                    />
                  )}
                  {chapter.td && (
                    <PdfLink
                      href={chapter.td}
                      label="TD - Enonce"
                      icon={<ClipboardList className="h-3.5 w-3.5" />}
                    />
                  )}
                  {chapter.tdCorrection && (
                    <PdfLink
                      href={chapter.tdCorrection}
                      label="TD - Correction"
                      icon={<ClipboardCheck className="h-3.5 w-3.5" />}
                    />
                  )}
                </div>
              </AccordionContent>
            )}
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
