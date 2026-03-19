import { useState } from 'react';
import { themes } from '@/lib/themes';
import { ThemeCard } from '@/components/ThemeCard';

type Semester = 's1' | 's2';

const Index = () => {
  const [semester, setSemester] = useState<Semester>('s1');
  const [slideDirection, setSlideDirection] = useState<'from-left' | 'from-right'>('from-right');

  const handleSemesterChange = (nextSemester: Semester) => {
    if (nextSemester === semester) return;

    // Going from S1 to S2 enters from the right, and inverse when going back.
    setSlideDirection(nextSemester === 's2' ? 'from-right' : 'from-left');
    setSemester(nextSemester);
  };

  const filteredThemes = themes.filter(theme => theme.semesters.includes(semester));

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-extrabold tracking-tight mb-4 text-foreground">
          L2 Maths Archive
        </h1>
        <p className="text-xl text-muted-foreground">
          Archive des cours de L2 Maths à l'Université Paris-Saclay.
        </p>
        <p className="text-sm text-muted-foreground/80 mt-2">
          Site non affilié à l'université. Contributions bienvenues.
        </p>
      </header>

      <div className="flex justify-center mb-8">
        <div className="semester-switch-3d bg-card p-1 rounded-full flex items-center space-x-1">
          <button
            onClick={() => handleSemesterChange('s1')}
            className={`semester-tab-3d px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
              semester === 's1'
                ? 'semester-tab-3d-active bg-background/80 text-foreground shadow-md'
                : 'text-muted-foreground hover:text-foreground/80'
            }`}
          >
            Semestre 1
          </button>
          <button
            onClick={() => handleSemesterChange('s2')}
            className={`semester-tab-3d px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
              semester === 's2'
                ? 'semester-tab-3d-active bg-background/80 text-foreground shadow-md'
                : 'text-muted-foreground hover:text-foreground/80'
            }`}
          >
            Semestre 2
          </button>
        </div>
      </div>

      <div className="overflow-hidden">
        <div
          key={semester}
          className="semester-catalogue-flow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredThemes.map((theme, index) => (
            <div
              key={theme.id}
              className={slideDirection === 'from-right' ? 'semester-card-in-from-right' : 'semester-card-in-from-left'}
              style={{ animationDelay: `${index * 65}ms` }}
            >
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
      </div>

    </div>
  );
};

export default Index;
