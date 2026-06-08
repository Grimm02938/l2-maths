import { Link } from 'react-router-dom';

type Note = {
  stage: 'seedling' | 'growing' | 'evergreen';
  title: string;
  date: string;
  text: string;
};

const notes: Note[] = [
  {
    stage: 'evergreen',
    title: 'Démarrer proprement sa L2 de mathématiques',
    date: '20 mars 2026',
    text: 'Le vrai problème n’est pas seulement de trouver les fichiers. C’est de savoir où ils vivent, à quel chapitre ils appartiennent, et ce qu’ils m’ont appris.',
  },
  {
    stage: 'growing',
    title: 'Algèbre : les erreurs qui coûtent des points',
    date: '18 mars 2026',
    text: 'Une erreur de quantificateur révèle souvent une image mentale floue de l’objet étudié.',
  },
  {
    stage: 'seedling',
    title: 'Probabilités : construire une intuition solide',
    date: '15 mars 2026',
    text: 'Relier les variables aléatoires à des expériences mentales simples, pas seulement à des formules récitées.',
  },
];

function GardenNav() {
  return (
    <nav className="garden-nav garden-frame">
      <Link to="/" className="garden-brand garden-link">L2 Maths Garden</Link>
      <div className="garden-menu">
        <Link className="garden-link" to="/">Archive</Link>
        <Link className="garden-link" to="/blog">Logbook</Link>
        <Link className="garden-link" to="/contact">Contact</Link>
      </div>
    </nav>
  );
}

const BlogPage = () => {
  return (
    <>
      <GardenNav />
      <main className="garden-frame">
        <section className="garden-hero" style={{ gridTemplateColumns: '1fr' }}>
          <div>
            <p className="garden-kicker">Working notes</p>
            <h1 className="garden-title">Logbook.</h1>
            <p className="garden-subtitle">
              Un carnet ouvert : pas des articles parfaits, mais les traces d’une pensée mathématique en construction.
            </p>
          </div>
        </section>

        <section className="garden-section">
          <div className="subject-list">
            {notes.map((note, index) => (
              <article className="subject-row" key={note.title}>
                <div className="subject-number">{String(index + 1).padStart(2, '0')}</div>
                <div>
                  <p className="garden-kicker">{note.stage} · {note.date}</p>
                  <h3>{note.title}</h3>
                  <p>{note.text}</p>
                </div>
                <div className="subject-meta">
                  <span>note</span>
                  <span>working</span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </>
  );
};

export default BlogPage;
