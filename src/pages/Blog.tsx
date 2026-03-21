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
    <div className="relative min-h-full py-10 blog-space overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 blog-bg-pattern" />
      <div className="pointer-events-none absolute inset-0 -z-10 blog-math-grid" />

      <section className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="mb-10 rounded-3xl border border-cyan-200/20 bg-slate-950/70 backdrop-blur-xl p-6 sm:p-10 shadow-[0_24px_90px_rgba(2,6,23,0.7)]">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-200/20 bg-cyan-300/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-cyan-100">
            <Sparkles className="h-3.5 w-3.5" />
            L2 Maths Logbook
          </p>

          <h1 className="blog-typewriter-wrap font-['Space_Grotesk',sans-serif] text-3xl sm:text-5xl font-bold leading-tight text-cyan-50 max-w-full">
            <span className="blog-typewriter">Math Notes_ Building intuition, rigor and speed</span>
            <span className="blog-cursor" aria-hidden="true" />
          </h1>

          <p className="mt-5 max-w-2xl text-sm sm:text-base text-slate-200/85 leading-relaxed break-words">
            Un blog futuriste pour etudiants en maths: methodes, strategies, routine de revision et analyse
            fine des erreurs qui font perdre des points.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {posts.map((post, index) => (
            <article
              key={post.id}
              className="group min-w-0 rounded-2xl border border-cyan-200/15 bg-slate-950/65 p-5 sm:p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-cyan-200/40 hover:shadow-[0_20px_50px_rgba(6,182,212,0.2)]"
              style={{ animationDelay: `${index * 70}ms` }}
            >
              <p className="mb-4 inline-flex rounded-full border border-cyan-200/25 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-cyan-100/90">
                {post.category}
              </p>

              <h2 className="font-['Space_Grotesk',sans-serif] text-xl font-semibold leading-snug text-cyan-50 break-words">
                {post.title}
              </h2>

              <p className="mt-3 text-sm leading-relaxed text-slate-200/80 break-words">{post.excerpt}</p>

              <div className="mt-5 flex items-center justify-between text-xs text-slate-300/75">
                <span>{post.date}</span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock3 className="h-3.5 w-3.5" />
                  {post.readTime}
                </span>
              </div>

              <Link
                to="/contact"
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-cyan-100 transition-colors group-hover:text-cyan-50"
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
