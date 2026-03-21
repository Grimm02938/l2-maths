import { Link } from 'react-router-dom';
import { ArrowUpRight, Clock3, Sparkles } from 'lucide-react';

type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
};

const posts: BlogPost[] = [
  {
    id: 'demarrer-l2-maths',
    title: 'Demarrer proprement sa L2 de mathematiques',
    excerpt:
      'Une strategie simple pour organiser ses chapitres, ses exos et son rythme de revision sans se perdre.',
    date: '20 Mars 2026',
    readTime: '6 min',
    category: 'Methodologie',
  },
  {
    id: 'algebre-erreurs',
    title: 'Algebre: les erreurs qui coutent des points',
    excerpt:
      'Signes, quantificateurs, hypothese oubliee: voici les pieges les plus frequents et comment les eviter.',
    date: '18 Mars 2026',
    readTime: '8 min',
    category: 'Algebre',
  },
  {
    id: 'probas-intuition',
    title: 'Probas: construire une intuition solide',
    excerpt:
      'Des exemples concrets pour relier formules et intuition, et arreter de faire du par coeur.',
    date: '15 Mars 2026',
    readTime: '7 min',
    category: 'Probabilites',
  },
  {
    id: 'oral-maths',
    title: 'Parler maths a l oral sans paniquer',
    excerpt:
      'Une mini check-list pour structurer ton raisonnement et rester clair pendant une presentation.',
    date: '12 Mars 2026',
    readTime: '5 min',
    category: 'Communication',
  },
];

const BlogPage = () => {
  return (
    <div className="relative min-h-full py-10">
      <div className="pointer-events-none absolute inset-0 -z-10 blog-bg-pattern" />

      <section className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="mb-10 rounded-2xl border border-white/10 bg-card/70 backdrop-blur-xl p-6 sm:p-10 shadow-[0_20px_80px_rgba(0,0,0,0.45)]">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5" />
            Journal L2 Maths
          </p>

          <h1 className="blog-typewriter-wrap font-['Space_Grotesk',sans-serif] text-3xl sm:text-5xl font-bold leading-tight text-foreground">
            <span className="blog-typewriter">Reflexions, methodes et notes de progression</span>
            <span className="blog-cursor" aria-hidden="true" />
          </h1>

          <p className="mt-5 max-w-2xl text-sm sm:text-base text-muted-foreground">
            Un espace editorial pour avancer plus vite en mathematiques: techniques de travail,
            erreurs frequentes et routines qui aident vraiment.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {posts.map((post, index) => (
            <article
              key={post.id}
              className="group rounded-2xl border border-white/10 bg-card/55 p-5 sm:p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-white/25 hover:bg-card/70"
              style={{ animationDelay: `${index * 70}ms` }}
            >
              <p className="mb-4 inline-flex rounded-full border border-white/20 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                {post.category}
              </p>

              <h2 className="font-['Space_Grotesk',sans-serif] text-xl font-semibold leading-snug text-foreground">
                {post.title}
              </h2>

              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{post.excerpt}</p>

              <div className="mt-5 flex items-center justify-between text-xs text-muted-foreground">
                <span>{post.date}</span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock3 className="h-3.5 w-3.5" />
                  {post.readTime}
                </span>
              </div>

              <Link
                to="/contact"
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-foreground/90 transition-colors group-hover:text-foreground"
              >
                Lire l article
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
