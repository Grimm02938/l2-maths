import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Index from '@/pages/Index';
import SubjectPage from '@/pages/SubjectPage';
import DocumentViewerPage from '@/pages/DocumentViewer';
import BlogPage from '@/pages/Blog';
import ContactPage from '@/pages/Contact';

const AppContent = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [location.pathname]);

  return (
    <div className="garden-shell">
      <Routes location={location}>
        <Route path="/" element={<Index />} />
        <Route path="/subject/:id" element={<SubjectPage />} />
        <Route path="/document" element={<DocumentViewerPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
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
