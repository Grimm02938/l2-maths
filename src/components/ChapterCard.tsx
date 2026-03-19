import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Calculator, TrendingUp, Hash, Network, Cpu, LucideIcon, LineChart, LayoutGrid, Spline, Sigma, Dices, Infinity } from "lucide-react";

interface ChapterCardProps {
  title: string;
  id: string;
  themeId: string;
  color: string;
  icon: string;
}

const iconMap: Record<string, LucideIcon> = {
  Calculator,
  TrendingUp,
  Hash,
  Network,
  Cpu,
  LineChart,
  LayoutGrid,
  Spline,
  Sigma,
  Dices,
  Infinity,
};

export function ChapterCard({ title, id, themeId, color, icon }: ChapterCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const IconComponent = iconMap[icon] || Calculator;

  return (
    <Link 
      to={`/theme/${themeId}/chapter/${id}`}
      className="block group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`
        relative p-6 transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1
        bg-gradient-to-r from-card/80 via-card/60 to-card/40
        border border-border/30 hover:border-current/40
        rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-current/20
        backdrop-blur-sm
        ${color}
      `}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
            backgroundSize: '20px 20px'
          }} />
        </div>
        
        {/* Content */}
        <div className="flex items-center gap-4 relative z-10">
          <div className={`
            p-3 rounded-xl bg-current/10 group-hover:bg-current/20
            transition-all duration-500 group-hover:scale-110 group-hover:rotate-3
            border border-current/20 group-hover:border-current/40
            shadow-md group-hover:shadow-lg group-hover:shadow-current/25
            ${isHovered ? 'animate-pulse' : ''}
          `}>
            <IconComponent className="h-6 w-6 text-current transition-all duration-500" />
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-bold text-foreground group-hover:text-current transition-all duration-300">
              {title}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-1 h-1 rounded-full bg-current/40" />
              <span className="text-xs text-current/60 font-medium uppercase tracking-wider">
                Disponible
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="transform translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
              <div className="w-6 h-[2px] bg-current/60 rounded-full" />
            </div>
            <ChevronRight className={`
              h-5 w-5 text-current/60 group-hover:text-current transition-all duration-300
              group-hover:translate-x-1 group-hover:scale-110
            `} />
          </div>
        </div>
        
        {/* Glowing edge effect */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-current/60 to-current/20 opacity-80 group-hover:opacity-100 group-hover:w-2 transition-all duration-300" />
        
        {/* Corner accent */}
        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-current/5 to-transparent rounded-bl-2xl transform scale-0 group-hover:scale-100 transition-transform duration-500" />
      </div>
    </Link>
  );
}
