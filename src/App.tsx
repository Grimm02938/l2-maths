import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Index from '@/pages/Index';
import ProfilePage from '@/pages/Profile';
import ContactPage from '@/pages/Contact';
import SubjectPage from '@/pages/SubjectPage';
import { Navbar } from '@/components/Navbar';
import LoginModal from '@/components/LoginModal';
import { Toaster } from '@/components/ui/sonner';

const AppContent = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <LoginModal />
      <Toaster />
      <main className="container mx-auto px-4 pb-8">
        <div key={location.pathname} className="page-transition-in">
          <Routes location={location}>
            <Route path="/" element={<Index />} />
            <Route path="/subject/:id" element={<SubjectPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/contact" element={<ContactPage />} />
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
