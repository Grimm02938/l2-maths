import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Index from '@/pages/Index';
import ProfilePage from '@/pages/Profile';
import ContactPage from '@/pages/Contact';
import SubjectPage from '@/pages/SubjectPage';
import DocumentViewerPage from '@/pages/DocumentViewer';
import BlogPage from '@/pages/Blog';
import { Navbar } from '@/components/Navbar';
import LoginModal from '@/components/LoginModal';
import { Toaster } from '@/components/ui/sonner';

const AppContent = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  return (
    <div className="archive-shell min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      <LoginModal />
      <Toaster />
      <main className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-10 sm:px-6 lg:px-8 flex-1">
        <div key={location.pathname} className="page-transition-in">
          <Routes location={location}>
            <Route path="/" element={<Index />} />
            <Route path="/subject/:id" element={<SubjectPage />} />
            <Route path="/document" element={<DocumentViewerPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/blog" element={<BlogPage />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
