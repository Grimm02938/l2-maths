import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getChapterResources, themes } from '@/lib/themes';

type Semester = 's1' | 's2';

const collections = [
  {
    id: 'l2',
    eyebrow: 'Corpus principal',
    title: 'Licence 2 Mathématiques',
    institution: 'Paris-Saclay',
    years: '2025/2026',
    description:
      'Le noyau vivant du site : cours, TD, corrections, annales et traces personnelles organisés par matière.',
    href: '#l2-catalogue',
    action: 'Explorer la L2',
  },
  {
    id: 'mpsi',
    eyebrow: 'Archive préparatoire',
    title: 'MPSI',
    institution: 'Jean-Baptiste-Corot',
    years: '2024/2025',
    description:
      'La réserve de fondation : documents de prépa, méthodes, devoirs et exercices pour solidifier les bases avant la suite.',
    href: '#mpsi-corpus',
    action: 'Voir le bloc MPSI',
  },
];

function GardenNav() {
  return (
    <nav className="garden-nav garden-frame">
      <Link to="/" className="garden-brand garden-link">Adame Abdelmoula · Archives mathématiques</Link>
      <div className="garden-menu">
        <a className="garden-link" href="#collections">Corpus</a>
        <a className="garden-link" href="#l2-catalogue">L2</a>
        <a className="garden-link" href="#mpsi-corpus">MPSI</a>
        <Link className="garden-link" to="/blog">Logbook</Link>
        <Link className="garden-link" to="/contact">Contact</Link>
      </div>
    </nav>
  );
}

function GardenIllustration({ resourceCount, chapterCount }: { resourceCount: number; chapterCount: number }) {
  return (
    <div className="garden-illustration" aria-hidden="true">
      <div className="garden-plot">
        <div className="vine">
          <svg viewBox="0 0 520 500" fill="none">
            <path d="M62 407 C115 296 78 229 170 173 C240 130 285 162 346 103 C389 62 421 54 470 72" stroke="#4f6f52" strokeWidth="3" strokeLinecap="round" strokeDasharray="7 9" />
            <path d="M128 294 C160 312 177 341 185 385" stroke="#7e8d60" strokeWidth="2" strokeLinecap="round" />
            <path d="M258 151 C244 206 268 242 322 262" stroke="#7e8d60" strokeWidth="2" strokeLinecap="round" />
            <path d="M370 95 C380 126 405 144 441 149" stroke="#7e8d60" strokeWidth="2" strokeLinecap="round" />
            <circle cx="62" cy="407" r="8" fill="#bd756c" />
            <circle cx="170" cy="173" r="9" fill="#c49a48" />
            <circle cx="346" cy="103" r="8" fill="#7c668f" />
            <circle cx="470" cy="72" r="10" fill="#6f98a2" />
          </svg>
        </div>
        <div className="seed-note" style={{ left: '7%', top: '10%', transform: 'rotate(-3deg)' }}>
          <b>Licence 2</b>
          Paris-Saclay · 2025/2026
        </div>
        <div className="seed-note" style={{ right: '8%', top: '34%', transform: 'rotate(2deg)' }}>
          <b>MPSI</b>
          Jean-Baptiste-Corot · 2024/2025
        </div>
        <div className="seed-note" style={{ left: '17%', bottom: '12%', transform: 'rotate(2.6deg)' }}>
          <b>Index</b>
          {chapterCount} chapitres · {resourceCount} ressources L2
        </div>
      </div>
    </div>
  );
}

const Index = () => {
  const [semester, setSemester] = useState<Semester>('s1');
  const [query, setQuery] = useState('');

  const stats = useMemo(() => {
    const chapters = themes.flatMap(theme => theme.chapters);
    const resources = chapters.flatMap(chapter => getChapterResources(chapter));
    return { chapters: chapters.length, resources: resources.length };
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
    <>
      <GardenNav />

      <main className="garden-frame">
        <section className="garden-hero">
          <div>
            <p className="garden-kicker">Archive de travail</p>
            <h1 className="garden-title">
              Deux <em>corpus</em>, une trajectoire.
            </h1>
            <p className="garden-subtitle">
              Pour l’instant, le site se concentre sur deux blocs précis : la Licence 2 Mathématiques à Paris-Saclay et l’archive MPSI du lycée Jean-Baptiste-Corot. Le reste viendra après, sans brouiller la page.
            </p>
            <div className="garden-actions">
              <a href="#collections" className="garden-button">Voir les deux corpus</a>
              <a href="#l2-catalogue" className="garden-button secondary">Entrer dans la L2</a>
            </div>
          </div>

          <GardenIllustration resourceCount={stats.resources} chapterCount={stats.chapters} />
        </section>

        <section id="collections" className="garden-section">
          <div className="section-heading">
            <div>
              <p className="garden-kicker">Corpus</p>
              <h2>Le périmètre actuel.</h2>
            </div>
            <p>
              Pas encore de Magistère affiché, pas de catégories parasites. La page doit respirer autour de ces deux années : une année universitaire et une année de prépa.
            </p>
          </div>

          <div className="corpus-grid">
            {collections.map((collection, index) => (
              <a className="corpus-card garden-link" href={collection.href} key={collection.id}>
                <div className="corpus-card-topline">
                  <span>{collection.eyebrow}</span>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                </div>
                <h3>{collection.title}</h3>
                <p className="corpus-institution">{collection.institution}</p>
                <p className="corpus-years">{collection.years}</p>
                <p className="corpus-description">{collection.description}</p>
                <span className="corpus-action">{collection.action} →</span>
              </a>
            ))}
          </div>
        </section>

        <section id="l2-catalogue" className="garden-section">
          <div className="section-heading">
            <div>
              <p className="garden-kicker">Licence 2 Mathématiques · Paris-Saclay · 2025/2026</p>
              <h2>Le corpus L2.</h2>
            </div>
            <p>
              Matières, chapitres et ressources déjà indexées. Cette partie reste le cœur actif du site.
            </p>
          </div>

          <div className="catalogue-tools">
            <input
              className="garden-input"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Chercher une matière, un chapitre, une notion…"
            />
            <div className="semester-tabs" role="tablist" aria-label="Semestre">
              <button data-active={semester === 's1'} onClick={() => setSemester('s1')}>S1</button>
              <button data-active={semester === 's2'} onClick={() => setSemester('s2')}>S2</button>
            </div>
          </div>

          <div className="subject-list">
            {filteredThemes.map((theme, index) => {
              const available = theme.chapters.filter(chapter => chapter.available).length;
              const resources = theme.chapters.flatMap(chapter => getChapterResources(chapter)).length;
              return (
                <Link to={`/subject/${theme.id}`} className="subject-row garden-link" key={theme.id}>
                  <div className="subject-number">{String(index + 1).padStart(2, '0')}</div>
                  <div>
                    <h3>{theme.title}</h3>
                    <p>{theme.description}</p>
                  </div>
                  <div className="subject-meta">
                    <span>{available}/{theme.chapters.length || 0} chapitres</span>
                    <span>{resources} ressources</span>
                    <span>ouvrir →</span>
                  </div>
                </Link>
              );
            })}
          </div>

          {filteredThemes.length === 0 && (
            <p className="mt-8 text-center text-muted-foreground">Aucun résultat pour cette recherche.</p>
          )}
        </section>

        <section id="mpsi-corpus" className="garden-section">
          <div className="section-heading">
            <div>
              <p className="garden-kicker">MPSI · Jean-Baptiste-Corot · 2024/2025</p>
              <h2>L’archive de prépa.</h2>
            </div>
            <p>
              Ce bloc est posé comme deuxième pilier du site. L’étape suivante sera de l’indexer proprement par matière, type de document et chapitre, sans l’afficher comme une simple liste de fichiers.
            </p>
          </div>

          <div className="mpsi-panel">
            <div>
              <p className="garden-kicker">À structurer</p>
              <h3>Mathématiques · Physique · Colles · DS · TD</h3>
            </div>
            <p>
              La MPSI sert ici de socle : une archive exigeante pour consolider les méthodes de prépa et alimenter le travail de L2. Elle n’est pas encore éclatée en centaines de documents sur la page d’accueil ; elle reste un bloc clair, sérieux, identifiable.
            </p>
          </div>
        </section>
      </main>
    </>
  );
};

export default Index;
