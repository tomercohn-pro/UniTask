import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import ScannerPage from './pages/ScannerPage';
import OnboardingPage from './pages/OnboardingPage';
import CoursesPage from './pages/CoursesPage';
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/LoginPage';
import BottomNav from './components/BottomNav';
import Sidebar from './components/Sidebar';
import { supabase } from './supabaseClient.js';

function AppRoutes() {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const path = window.location.pathname;
      const isGuest = localStorage.getItem('guestMode') === 'true';
      if (!session?.user && path !== '/login' && !isGuest) {
        navigate('/login');
      }
      if (session?.user && path === '/') {
        if (!localStorage.getItem('userDegree')) navigate('/onboarding');
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      const path = window.location.pathname;
      const isGuest = localStorage.getItem('guestMode') === 'true';
      if (!session?.user && path !== '/login' && !isGuest) {
        navigate('/login');
      } else if (session?.user && path === '/login') {
        localStorage.removeItem('guestMode');
        navigate(localStorage.getItem('userDegree') ? '/' : '/onboarding');
      }
    });

    return () => listener.subscription.unsubscribe();
  }, [navigate]);

  return (
    <Routes>
      <Route path="/"           element={<DashboardPage />} />
      <Route path="/scanner"    element={<ScannerPage />} />
      <Route path="/onboarding" element={<OnboardingPage />} />
      <Route path="/courses"    element={<CoursesPage />} />
      <Route path="/settings"   element={<SettingsPage />} />
      <Route path="/login"      element={<LoginPage />} />
    </Routes>
  );
}

function NavWrapper() {
  const location = useLocation();
  const hide = ['/login', '/onboarding'].includes(location.pathname);
  if (hide) return null;

  return (
    <>
      {/* Desktop: sidebar */}
      <Sidebar />
      {/* Mobile: bottom nav */}
      <div className="bottom-nav-wrapper">
        <BottomNav />
      </div>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <div className="app-shell">
        <NavWrapper />
        <main className="page-content">
          <AppRoutes />
        </main>
      </div>
    </Router>
  );
}
