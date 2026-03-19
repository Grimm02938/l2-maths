import { LucideIcon } from "lucide-react";
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

  return (
    <div
      onClick={handleClick}
      className={`
        group relative flex flex-col h-full transition-all duration-200
        bg-card hover:bg-card/80
        border border-border/30 hover:border-border/60
        rounded-xl cursor-pointer overflow-hidden
      `}
    >
      {/* Barre colorée en haut uniquement */}
      <div className={`h-0.5 w-full ${color} opacity-70`} style={{ background: 'currentColor' }} />

      <div className="flex flex-col flex-1 p-5">
        {/* Icône + Titre */}
        <div className="flex items-start gap-3 flex-1">
          <div className={`mt-0.5 ${color}`}>
              <IconComponent className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-foreground leading-snug">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        {/* Compteur chapitres */}
        <div className="mt-4 pt-3 border-t border-border/20 flex items-center gap-1.5">
          <span className={`text-xs font-medium ${color}`}>{availableCount}</span>
          <span className="text-xs text-muted-foreground">
            {availableCount === 1 ? 'chapitre disponible' : 'chapitres disponibles'}
          </span>
        </div>
      </div>
    </div>
  );
}
