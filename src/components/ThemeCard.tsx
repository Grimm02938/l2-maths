import { ArrowUpRight, CheckCircle2, Lock, Sparkles } from "lucide-react";
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

export function ThemeCard({ id, title, description, color, border = 'border-border/20', professor, icon, chapters = [] }: ThemeCardProps) {
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
  const isEmpty = totalCount === 0;

  return (
    <button
      type="button"
      onClick={handleClick}
      className="archive-card group flex h-full w-full flex-col rounded-[1.65rem] p-5 text-left"
    >
      <div className="relative z-10 flex items-start justify-between gap-4">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${border} bg-background/55 ${color} shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]`}>
          <IconComponent className="h-6 w-6" />
        </div>
        <div className="chip">
          {user ? <CheckCircle2 className="h-3.5 w-3.5 text-primary" /> : <Lock className="h-3.5 w-3.5" />}
          {user ? 'open' : 'login'}
        </div>
      </div>

      <div className="relative z-10 mt-5 flex-1">
        <p className={`mb-2 text-[10px] font-bold uppercase tracking-[0.24em] ${color}`}>module</p>
        <h3 className="text-xl font-black tracking-tight text-foreground transition-colors group-hover:text-primary">
          {title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
        {professor && <p className="mt-3 text-xs text-muted-foreground/80">Professeur : {professor}</p>}
      </div>

      <div className="relative z-10 mt-6 space-y-3 border-t border-border/50 pt-4">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Ressources indexees</span>
          <span className="font-mono text-foreground">{availableCount}/{totalCount || 0}</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-background/80">
          <div
            className="h-full rounded-full bg-primary shadow-[0_0_18px_hsl(var(--primary)/0.45)] transition-all duration-500"
            style={{ width: `${isEmpty ? 8 : progress}%` }}
          />
        </div>
        <div className="flex items-center justify-between pt-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5" />
            {isEmpty ? 'zone a remplir' : `${progress}% disponible`}
          </span>
          <span className="inline-flex items-center gap-1.5 font-medium text-foreground/90 group-hover:text-primary">
            Entrer <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </div>
    </button>
  );
}
