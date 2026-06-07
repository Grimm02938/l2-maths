import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpenCheck, Database, FileText, Layers3, Search, ShieldCheck, Sparkles } from 'lucide-react';
import { getChapterResources, themes } from '@/lib/themes';
import { ThemeCard } from '@/components/ThemeCard';

type Semester = 's1' | 's2';

const Index = () => {
  const [semester, setSemester] = useState<Semester>('s1');
  const [query, setQuery] = useState('');

  const stats = useMemo(() => {
    const chapters = themes.flatMap(theme => theme.chapters);
    const availableChapters = chapters.filter(chapter => chapter.available);
    const resources = chapters.flatMap(chapter => getChapterResources(chapter));

    return {
      subjects: themes.length,
      chapters: chapters.length,
      available: availableChapters.length,
      resources: resources.length,
    };
  }, []);

  const filteredThemes = themes
    .filter(theme => theme.semesters.includes(semester))
    .filter(theme => {
      const search = query.trim().toLowerCase();
      if (!search) return true;
      return [theme.title, theme.description, ...theme.chapters.map(chapter => chapter.title)]
        .join(' ')
        .toLowerCase()
        .includes(search);
    });

  return (
    <div className="py-8 sm:py-12">
      <section className="grid gap-6 lg:grid-cols-[1.12fr_0.88fr] lg:items-stretch">
        <div className="glass-panel scanline rounded-[2rem] p-6 sm:p-8 lg:p-10">
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <span className="chip border-primary/30 text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              archive engine 2026
            </span>
            <span className="chip">
              <ShieldCheck className="h-3.5 w-3.5" />
              ressources triees
            </span>
          </div>

          <h1 className="max-w-4xl text-4xl font-black tracking-[-0.045em] text-foreground sm:text-6xl lg:text-7xl">
            La base de survie pour traverser la L2 Maths.
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
            Cours, TD, corrections personnelles et polycopie: tout est range par matiere, semestre et chapitre pour reviser vite sans perdre ton energie a chercher les fichiers.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#catalogue" className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-[0_0_30px_hsl(var(--primary)/0.22)] transition hover:bg-primary/90">
              Ouvrir le catalogue <ArrowRight className="h-4 w-4" />
            </a>
            <Link to="/blog" className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card/55 px-5 py-3 text-sm font-bold text-foreground transition hover:border-primary/45 hover:bg-secondary/80">
              Lire le logbook <BookOpenCheck className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <aside className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <div className="glass-panel rounded-[2rem] p-5">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-muted-foreground">Etat de l archive</p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <StatCard icon={Layers3} label="Matieres" value={stats.subjects} />
              <StatCard icon={BookOpenCheck} label="Chapitres" value={stats.available} detail={`/${stats.chapters}`} />
              <StatCard icon={FileText} label="Ressources" value={stats.resources} />
              <StatCard icon={Database} label="Semestres" value={2} />
            </div>
          </div>

          <div className="glass-panel rounded-[2rem] p-5">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-muted-foreground">Mode d emploi</p>
            <div className="mt-4 space-y-3 text-sm text-muted-foreground">
              <p><span className="font-semibold text-foreground">1.</span> Choisis le semestre.</p>
              <p><span className="font-semibold text-foreground">2.</span> Ouvre une matiere.</p>
              <p><span className="font-semibold text-foreground">3.</span> Recupere cours, TD et corrections.</p>
            </div>
          </div>
        </aside>
      </section>

      <section id="catalogue" className="mt-10">
        <div className="mb-6 flex flex-col gap-4 rounded-[1.75rem] border border-border/70 bg-card/50 p-4 backdrop-blur-xl md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">Catalogue</p>
            <h2 className="mt-1 text-2xl font-black tracking-tight text-foreground">Matieres disponibles</h2>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Rechercher analyse, topo..."
                className="h-11 w-full rounded-full border border-border bg-background/60 pl-9 pr-4 text-sm outline-none transition focus:border-primary sm:w-64"
              />
            </div>

            <div className="flex rounded-full border border-border bg-background/60 p-1">
              {(['s1', 's2'] as Semester[]).map((item) => (
                <button
                  key={item}
                  onClick={() => setSemester(item)}
                  className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                    semester === item
                      ? 'bg-primary text-primary-foreground shadow-[0_0_22px_hsl(var(--primary)/0.18)]'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {item === 's1' ? 'Semestre 1' : 'Semestre 2'}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredThemes.map((theme, index) => (
            <div key={theme.id} className="archive-card-in" style={{ animationDelay: `${index * 65}ms` }}>
              <ThemeCard
                id={theme.id}
                title={theme.title}
                description={theme.description}
                color={theme.color}
                border={theme.border}
                icon={theme.icon}
                chapters={theme.chapters}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

function StatCard({ icon: Icon, label, value, detail }: { icon: typeof Layers3; label: string; value: number; detail?: string }) {
  return (
    <div className="rounded-2xl border border-border/70 bg-background/45 p-4">
      <Icon className="mb-3 h-4 w-4 text-primary" />
      <div className="text-2xl font-black text-foreground">
        {value}<span className="text-sm text-muted-foreground">{detail}</span>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

export default Index;
