import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpenCheck, Database, FileText, Layers3, Search, Sprout, SquarePen } from 'lucide-react';
import { getChapterResources, themes } from '@/lib/themes';
import { ThemeCard } from '@/components/ThemeCard';

type Semester = 's1' | 's2';

const gardenNotes = [
  {
    label: 'Evergreen',
    title: 'Les notions qui doivent rester vivantes',
    text: 'Suites, espaces vectoriels, topologie, probabilités : chaque notion importante doit pouvoir être retrouvée, reliée et retravaillée.',
  },
  {
    label: 'Archive',
    title: 'Le corpus L2, propre et consultable',
    text: 'Cours, TD, annales, corrections personnelles et compléments classés comme une bibliothèque de travail.',
  },
  {
    label: 'Magistère',
    title: 'La suite commence ici',
    text: 'Le site doit survivre à la L2 : il deviendra progressivement un carnet de recherche et de préparation plus ambitieux.',
  },
];

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
      <section className="paper-panel rounded-[2rem] px-5 py-7 sm:px-8 sm:py-10 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <div>
            <div className="mb-7 flex flex-wrap items-center gap-2">
              <span className="chip text-primary">
                <Sprout className="h-3.5 w-3.5" />
                digital garden
              </span>
              <span className="chip">
                L2 · Magistère · notes personnelles
              </span>
            </div>

            <p className="font-ui text-[11px] font-bold uppercase tracking-[0.34em] text-muted-foreground">
              Université Paris-Saclay — Licence 2
            </p>

            <h1 className="mt-5 max-w-4xl font-display text-5xl font-semibold leading-[0.96] tracking-[-0.045em] text-foreground sm:text-7xl lg:text-8xl">
              Une archive vivante pour apprendre les maths sérieusement.
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-muted-foreground">
              Ce site rassemble les cours, TD, annales, corrections et notes qui construisent mon parcours : de la L2 au magistère, du document brut à l’intuition durable.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#catalogue" className="archive-button inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-5 py-3 font-ui text-sm font-bold text-background transition hover:bg-foreground/88">
                Explorer l’archive <ArrowRight className="h-4 w-4" />
              </a>
              <a href="#garden" className="archive-button inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card/60 px-5 py-3 font-ui text-sm font-bold text-foreground transition hover:border-foreground/35">
                Voir le jardin <Sprout className="h-4 w-4" />
              </a>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="paper-panel-soft rounded-[1.5rem] p-5">
              <p className="font-ui text-[10px] font-bold uppercase tracking-[0.24em] text-muted-foreground">État du corpus</p>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <StatCard icon={Layers3} label="Matières" value={stats.subjects} />
                <StatCard icon={BookOpenCheck} label="Chapitres" value={stats.available} detail={`/${stats.chapters}`} />
                <StatCard icon={FileText} label="Ressources" value={stats.resources} />
                <StatCard icon={Database} label="Semestres" value={2} />
              </div>
            </div>

            <div className="marginal-note rounded-r-[1.3rem] p-5">
              <p className="font-ui text-[10px] font-bold uppercase tracking-[0.24em] text-primary">Intention</p>
              <p className="mt-3 font-display text-2xl leading-tight text-foreground">
                Pas un drive. Une bibliothèque personnelle de formation.
              </p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Le but : retrouver vite, relier les idées, et laisser une trace de progression réelle.
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section id="garden" className="mt-10 grid gap-5 md:grid-cols-3">
        {gardenNotes.map((note, index) => (
          <article key={note.title} className="archive-card archive-card-in rounded-[1.35rem] p-5" style={{ animationDelay: `${index * 70}ms` }}>
            <p className="font-ui text-[10px] font-bold uppercase tracking-[0.22em] text-primary">{note.label}</p>
            <h2 className="mt-3 font-display text-2xl font-semibold leading-tight text-foreground">{note.title}</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{note.text}</p>
          </article>
        ))}
      </section>

      <section id="catalogue" className="mt-12">
        <div className="mb-6 border-y border-border py-5 md:flex md:items-end md:justify-between md:gap-8">
          <div>
            <p className="font-ui text-[11px] font-bold uppercase tracking-[0.28em] text-primary">Catalogue</p>
            <h2 className="mt-2 font-display text-4xl font-semibold tracking-tight text-foreground">Matières disponibles</h2>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center md:mt-0">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Rechercher analyse, topo..."
                className="archive-input h-11 w-full rounded-full border border-border bg-card/70 pl-9 pr-4 font-ui text-sm outline-none transition focus:border-foreground/40 sm:w-72"
              />
            </div>

            <div className="flex rounded-full border border-border bg-card/70 p-1 font-ui">
              {(['s1', 's2'] as Semester[]).map((item) => (
                <button
                  key={item}
                  onClick={() => setSemester(item)}
                  className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                    semester === item
                      ? 'bg-foreground text-background'
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

        {filteredThemes.length === 0 && (
          <div className="paper-panel-soft rounded-[1.35rem] p-8 text-center text-muted-foreground">
            Aucun résultat pour cette recherche.
          </div>
        )}
      </section>

      <section className="mt-12 grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="paper-panel-soft rounded-[1.5rem] p-6">
          <SquarePen className="mb-4 h-5 w-5 text-primary" />
          <h2 className="font-display text-3xl font-semibold tracking-tight text-foreground">Ce que le site doit devenir</h2>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            Une archive académique, mais aussi une preuve de trajectoire : quelqu’un qui classe, relit, comprend, annote et construit une pensée mathématique.
          </p>
        </div>
        <div className="paper-panel rounded-[1.5rem] p-6">
          <p className="font-ui text-[10px] font-bold uppercase tracking-[0.24em] text-muted-foreground">Architecture mentale</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-5">
            {['Semestre', 'Matière', 'Chapitre', 'Ressource', 'Note'].map((item, index) => (
              <div key={item} className="rounded-2xl border border-border bg-background/45 p-4 text-center">
                <p className="font-display text-2xl text-primary">{index + 1}</p>
                <p className="mt-2 font-ui text-xs font-bold uppercase tracking-[0.16em] text-foreground">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

function StatCard({ icon: Icon, label, value, detail }: { icon: typeof Layers3; label: string; value: number; detail?: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card/55 p-4">
      <Icon className="mb-3 h-4 w-4 text-primary" />
      <div className="font-ui text-2xl font-black text-foreground">
        {value}<span className="text-sm text-muted-foreground">{detail}</span>
      </div>
      <p className="mt-1 font-ui text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

export default Index;
