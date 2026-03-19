import { Clock, FileText, Download, Book } from "lucide-react";

interface ActivityItem {
  id: string;
  title: string;
  subject: string;
  timestamp: string;
  type: "cours" | "td" | "correction" | "ds";
  color: string;
}

const activities: ActivityItem[] = [
  {
    id: "1",
    title: "Séries de Fourier",
    subject: "Analyse",
    timestamp: "Il y a 2h",
    type: "cours",
    color: "text-analysis",
  },
  {
    id: "2", 
    title: "Exercices sur les matrices",
    subject: "Algèbre",
    timestamp: "Il y a 4h",
    type: "td",
    color: "text-algebra",
  },
  {
    id: "3",
    title: "Correction DS Probabilités", 
    subject: "Probabilités",
    timestamp: "Il y a 1j",
    type: "correction",
    color: "text-topology",
  },
];

const typeIcons = {
  cours: FileText,
  td: Book,
  correction: Download,
  ds: FileText,
};

export function ActivityFeed() {
  return (
    <div className="cyber-card p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-primary/10">
          <Clock className="h-5 w-5 text-primary" />
        </div>
        <h2 className="text-xl font-bold text-glow">Activité Récente</h2>
      </div>
      
      <div className="space-y-4">
        {activities.map((activity, index) => {
          const Icon = typeIcons[activity.type];
          
          return (
            <div 
              key={activity.id}
              className="activity-item group cursor-pointer"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center gap-4">
                <div className={`
                  p-3 rounded-xl ${activity.color} bg-current/10 
                  group-hover:bg-current/20 transition-all duration-300
                  group-hover:scale-110
                `}>
                  <Icon className="h-5 w-5 text-current" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground group-hover:text-current transition-colors duration-300">
                    {activity.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {activity.subject} • {activity.timestamp}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Voir
                  </span>
                  <div className={`
                    w-2 h-2 rounded-full ${activity.color} bg-current
                    group-hover:scale-150 transition-transform duration-300
                  `} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-6 pt-4 border-t border-border/50">
        <button className="w-full text-center text-sm text-primary hover:text-primary/80 transition-colors duration-300">
          Voir toute l'activité
        </button>
      </div>
    </div>
  );
}