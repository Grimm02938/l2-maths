import { Link } from 'react-router-dom';
import { ArrowUpRight, Clock3, Sprout } from 'lucide-react';

type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  maturity: 'seedling' | 'growing' | 'evergreen';
};

const posts: BlogPost[] = [
  {
    id: 'demarrer-l2-maths',
    title: 'Démarrer proprement sa L2 de mathématiques',
    excerpt:
      'Une stratégie simple pour organiser ses chapitres, ses exercices et son rythme de révision sans transformer le travail en chaos.',
    date: '20 mars 2026',
    readTime: '6 min',
    category: 'Méthodologie',
    maturity: 'evergreen',
  },
  {
    id: 'algebre-erreurs',
    title: 'Algèbre : les erreurs qui coûtent des points',
    excerpt:
      'Signes, quantificateurs, hypothèses oubliées : les pièges fréquents et la façon de les repérer avant la copie finale.',
    date: '18 mars 2026',
    readTime: '8 min',
    category: 'Algèbre',
    maturity: 'growing',
  },
  {
    id: 'probas-intuition',
    title: 'Probabilités : construire une intuition solide',
    excerpt:
      'Relier les formules à des situations mentales claires pour ne pas seulement apprendre par cœur.',
    date: '15 mars 2026',
    readTime: '7 min',
    category: 'Probabilités',
    maturity: 'seedling',
  },
  {
    id: 'oral-maths',
    title: 'Parler maths à l’oral sans paniquer',
    excerpt:
      'Une mini check-list pour structurer un raisonnement, annoncer les hypothèses et rester lisible pendant une présentation.',
    date: '12 mars 2026',
    readTime: '5 min',
    category: 'Communication',
    maturity: 'growing',
  },
];

const maturityLabels: Record<BlogPost['maturity'], string> = {
  seedling: 'Seedling',
  growing: 'Growing',
  evergreen: 'Evergreen',
};

const BlogPage = () => {
  return (
    <div className="py-8 sm:py-12">
      <section className="paper-panel rounded-[2rem] px-5 py-8 sm:px-8 sm:py-10 lg:px-12">
        <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1 font-ui text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <Sprout className="h-3.5 w-3.5 text-primary" />
          carnet public
        </p>

        <div className="grid gap-8 lg:grid-cols-[1fr_18rem] lg:items-end">
          <div>
            <h1 className="font-display text-5xl font-semibold leading-none tracking-[-0.04em] text-foreground sm:text-7xl">
              Logbook mathématique.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              Un carnet de progression : méthodes, erreurs, intuitions, routines et notes qui transforment les documents de cours en pensée personnelle.
            </p>
          </div>

          <aside className="marginal-note rounded-r-[1.2rem] p-5">
            <p className="font-ui text-[10px] font-bold uppercase tracking-[0.24em] text-primary">Principe</p>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Une note n’est pas un article parfait. Elle peut commencer fragile, puis devenir une idée durable.
            </p>
          </aside>
        </div>
      </section>

      <section className="mt-10 grid gap-5 lg:grid-cols-[16rem_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-[1.35rem] border border-border bg-card/60 p-5">
            <p className="font-ui text-[10px] font-bold uppercase tracking-[0.24em] text-muted-foreground">Statuts</p>
            <div className="mt-4 space-y-3 font-ui text-xs text-muted-foreground">
              <p><span className="font-semibold text-foreground">Seedling</span> — idée en germe.</p>
              <p><span className="font-semibold text-foreground">Growing</span> — note en croissance.</p>
              <p><span className="font-semibold text-foreground">Evergreen</span> — notion stabilisée.</p>
            </div>
          </div>
        </aside>

        <div className="space-y-4">
          {posts.map((post, index) => (
            <article
              key={post.id}
              className="archive-card archive-card-in rounded-[1.35rem] p-5 sm:p-6"
              style={{ animationDelay: `${index * 70}ms` }}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="mb-3 flex flex-wrap gap-2">
                    <span className="chip">{post.category}</span>
                    <span className="chip text-primary">{maturityLabels[post.maturity]}</span>
                  </div>

                  <h2 className="font-display text-3xl font-semibold leading-tight tracking-tight text-foreground">
                    {post.title}
                  </h2>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">{post.excerpt}</p>
                </div>

                <div className="shrink-0 font-ui text-xs text-muted-foreground sm:text-right">
                  <p>{post.date}</p>
                  <p className="mt-2 inline-flex items-center gap-1.5">
                    <Clock3 className="h-3.5 w-3.5" />
                    {post.readTime}
                  </p>
                </div>
              </div>

              <Link
                to="/contact"
                className="archive-link mt-6 inline-flex items-center gap-1.5 font-ui text-sm font-bold uppercase tracking-[0.14em] text-foreground transition-colors hover:text-primary"
              >
                Lire la note
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default BlogPage;
