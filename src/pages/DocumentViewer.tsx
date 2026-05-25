import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, FileText, ExternalLink } from 'lucide-react';

function getTitleFromSource(source: string | null) {
  if (!source) return 'Document';

  try {
    const decoded = decodeURIComponent(source);
    const fileName = decoded.split('/').pop() || decoded;
    return fileName.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');
  } catch {
    return 'Document';
  }
}

export default function DocumentViewerPage() {
  const [searchParams] = useSearchParams();
  const source = searchParams.get('src');
  const title = searchParams.get('title') || getTitleFromSource(source);

  useEffect(() => {
    document.title = `${title} - L2 MATHS Archive`;
    return () => {
      document.title = 'L2 MATHS Archive - Archive Académique';
    };
  }, [title]);

  if (!source) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="h-4 w-4" /> Retour
        </Link>
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-3 text-muted-foreground">
            <FileText className="h-5 w-5" />
            <p>Aucun document n'a été fourni.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between gap-4 mb-6">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Retour
        </Link>
        <a
          href={source}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Ouvrir le PDF
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-lg">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-background/60">
          <FileText className="h-5 w-5 text-amber-300" />
          <div>
            <h1 className="text-base font-semibold text-foreground">{title}</h1>
            <p className="text-xs text-muted-foreground">Visualisation dans une page du site</p>
          </div>
        </div>
        <iframe
          src={source}
          title={title}
          className="w-full min-h-[78vh] bg-muted"
        />
      </div>
    </div>
  );
}
