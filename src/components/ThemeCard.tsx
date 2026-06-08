import { ArrowUpRight, CheckCircle2, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useLoginModal } from "../hooks/use-login-modal";
import { iconMap } from "../lib/iconMap";

interface ThemeCardProps {
  id: string;
  title: string;
  description: string;
  color: string;
  border?: string;
  professor?: string;
  icon: string;
  chapters?: { id: string; title: string; available: boolean }[];
}

export function ThemeCard({ id, title, description, color, border = 'border-border', professor, icon, chapters = [] }: ThemeCardProps) {
  const IconComponent = iconMap[icon];
  const { user } = useAuth();
  const { open: openLoginModal } = useLoginModal();
  const navigate = useNavigate();

  const handleClick = () => {
    if (!user) {
      openLoginModal();
    } else {
      navigate(`/subject/${id}`);
    }
  };

  if (!IconComponent) return null;

  const availableCount = chapters.filter(c => c.available).length;
  const totalCount = chapters.length;
  const progress = totalCount > 0 ? Math.round((availableCount / totalCount) * 100) : 0;

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`archive-card group grid min-h-[220px] w-full grid-cols-[0.8rem_1fr] rounded-[1.35rem] text-left ${border}`}
    >
      <div className={`subject-marker m-5 mr-0 ${color.replace('text-', 'bg-')}`} aria-hidden="true" />

      <div className="flex min-w-0 flex-col p-5 pl-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="font-ui text-[10px] font-bold uppercase tracking-[0.22em] text-muted-foreground">Module</p>
            <h3 className="mt-2 font-display text-2xl font-semibold leading-tight tracking-tight text-foreground transition-colors group-hover:text-primary">
              {title}
            </h3>
          </div>

          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border ${border} bg-background/50 ${color}`}>
            <IconComponent className="h-4 w-4" />
          </div>
        </div>

        <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
          {description}
        </p>
        {professor && <p className="mt-3 font-ui text-xs text-muted-foreground">Professeur : {professor}</p>}

        <div className="mt-auto pt-5">
          <div className="mb-2 flex items-center justify-between font-ui text-xs text-muted-foreground">
            <span>{availableCount}/{totalCount || 0} chapitres ouverts</span>
            <span className="inline-flex items-center gap-1.5">
              {user ? <CheckCircle2 className="h-3.5 w-3.5 text-accent" /> : <Lock className="h-3.5 w-3.5" />}
              {user ? 'accessible' : 'connexion'}
            </span>
          </div>

          <div className="h-px w-full bg-border">
            <div
              className={`h-px ${color.replace('text-', 'bg-')} transition-all duration-500`}
              style={{ width: `${totalCount === 0 ? 6 : progress}%` }}
            />
          </div>

          <div className="mt-4 flex items-center justify-between font-ui text-xs font-bold uppercase tracking-[0.16em] text-foreground">
            <span>{progress}% indexé</span>
            <span className="inline-flex items-center gap-1.5 transition-colors group-hover:text-primary">
              Ouvrir <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}
