import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getChapterResources, themes } from '@/lib/themes';

type Semester = 's1' | 's2';

const growthStages = [
  {
    label: 'Seedlings',
    title: 'Notions en germe',
    text: 'Les idées que je commence à comprendre : elles sont fragiles, parfois incomplètes, mais déjà reliées au reste du cours.',
  },
  {
    label: 'Growing',
    title: 'Chapitres en croissance',
    text: 'Les cours, TD et corrections que je retravaille jusqu’à voir la structure derrière les calculs.',
  },
  {
    label: 'Evergreen',
    title: 'Méthodes durables',
    text: 'Les raisonnements qui doivent survivre à la L2 et devenir des outils pour le magistère.',
  },
];

function GardenNav() {
  return (
    <nav className="garden-nav garden-frame">
      <Link to="/" className="garden-brand garden-link">Adame Abdelmoula · L2 Maths</Link>
      <div className="garden-menu">
        <a className="garden-link" href="#catalogue">Archive</a>
        <a className="garden-link" href="#garden">Garden</a>
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
          <b>Archive</b>
          {resourceCount} ressources indexées
        </div>
        <div className="seed-note" style={{ right: '8%', top: '34%', transform: 'rotate(2deg)' }}>
          <b>Garden</b>
          notions reliées par chapitre
        </div>
        <div className="seed-note" style={{ left: '17%', bottom: '12%', transform: 'rotate(2.6deg)' }}>
          <b>Magistère</b>
          {chapterCount} chapitres pour construire la suite
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
            <p className="garden-kicker">A living mathematical garden</p>
            <h1 className="garden-title">
              Maths as a <em>garden</em>, not a drive.
            </h1>
            <p className="garden-subtitle">
              Une archive personnelle pour les cours, TD, annales et corrections de L2 — mais pensée comme un jardin de notions : vivant, annoté, relié, destiné à survivre jusqu’au magistère.
            </p>
            <div className="garden-actions">
              <a href="#catalogue" className="garden-button">Entrer dans l’archive</a>
              <a href="#garden" className="garden-button secondary">Voir la logique garden</a>
            </div>
          </div>

          <GardenIllustration resourceCount={stats.resources} chapterCount={stats.chapters} />
        </section>

        <section id="garden" className="garden-section">
          <div className="section-heading">
            <div>
              <p className="garden-kicker">Growth stages</p>
              <h2>Une bibliothèque qui pousse.</h2>
            </div>
            <p>
              Chaque contenu a un statut. Un TD brut n’est pas une correction personnelle. Une fiche fragile n’est pas encore une idée evergreen. Le site doit le montrer.
            </p>
          </div>

          <div className="growth-grid">
            {growthStages.map((stage) => (
              <article className="growth-card" key={stage.label}>
                <p className="garden-kicker">{stage.label}</p>
                <h3>{stage.title}</h3>
                <p>{stage.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="catalogue" className="garden-section">
          <div className="section-heading">
            <div>
              <p className="garden-kicker">Catalogue</p>
              <h2>Le corpus L2.</h2>
            </div>
            <p>
              Pas de cartes molles. Juste une table de jardin : matière, description, disponibilité, et entrée directe vers les ressources.
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

        <section className="garden-section">
          <div className="section-heading">
            <div>
              <p className="garden-kicker">Personal proof</p>
              <h2>Montrer que je deviens quelqu’un.</h2>
            </div>
            <p>
              Le site n’est pas seulement un rangement. C’est une trace publique : je lis, je classe, je corrige, je relie, je progresse. <span className="tagline-hand">La L2 devient un terrain.</span>
            </p>
          </div>
        </section>
      </main>
    </>
  );
};

export default Index;
